#!/usr/bin/env python3
"""Enriquece leads: acha site/Instagram, lê o SITE DO PRÓPRIO RESTAURANTE e
preenche os sinais (pedido próprio, WhatsApp manual, fidelidade, marketplace).

  1. Sem site? Busca "<nome> <bairro> <cidade>" no Firecrawl (opcional, gasta crédito).
  2. Lê a página inicial + até 2 páginas de cardápio/pedido do site, respeitando
     robots.txt, direto desta máquina (sem custo).
  3. Regras simples marcam os sinais com evidência.
  4. Opcional: IA pela ASSINATURA (claude -p ou codex exec) revisa os sinais.

Instagram e marketplace NÃO são raspados (termos proíbem): só se registra o que
aparece no site do restaurante ou no resultado de busca, para conferência manual.

Uso:
  python3 coletor/sitios.py --entrada dados/leads.json --saida dados/leads-enriquecidos.json \
      [--buscar firecrawl --max-buscas 30 --confirmar] [--ia claude|codex] [--limite 30]

Chave do Firecrawl: variável FIRECRAWL_API_KEY ou arquivo --env (lida, nunca impressa).
"""
import argparse
import hashlib
import html
import json
import os
import re
import subprocess
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
import urllib.robotparser

USER_AGENT = "raio-x-margem/0.2 (+https://github.com/inematds/raio-x-margem)"
CREDITOS_POR_BUSCA = 2  # Firecrawl: ~2 créditos por busca de até 10 resultados (conferir na página de preços)

MARKETPLACES = {"ifood.com.br": "iFood", "99app.com": "99Food", "99food": "99Food", "keeta": "Keeta",
                "rappi.com": "Rappi", "aiqfome.com": "aiqfome", "ubereats.com": "Uber Eats"}
PEDIDO_PROPRIO = ["anota.ai", "goomer", "cardapioweb", "cardapio.web", "menudino", "neemo", "olaclick",
                  "saipos", "consumer.com.br", "deliverymuch", "instadelivery", "pedido.app", "app.cardapio",
                  "delivery.direto", "takeat", "ceofood", "lexsis", "menuvem"]
PEDIDO_TEXTO = ["faça seu pedido", "faca seu pedido", "peça online", "peca online", "pedido online",
                "peça agora", "peca agora", "pedir agora", "adicionar ao carrinho", "finalizar pedido", "delivery próprio"]
FIDELIDADE = ["fidelidade", "cashback", "clube de vantagens", "clube do", "programa de pontos", "acumule pontos", "seja membro", "assinatura"]
IGNORAR = ["google.", "facebook.com", "tripadvisor", "yelp.", "foursquare", "guiadacidade", "restaurantguru",
           "wikipedia", "linkedin", "youtube", "tiktok", "twitter.com", "x.com", "apontador", "cnpj", "econodata",
           "casadosdados", "solutudo", "telelistas", "waze", "booking.com", "tagme", "getin", "opentable", "kekanto",
           "br-rest.com", "restaurantes.com", "menupix", "cardapio.menu", "guiademoteis", "hoteis.com", "trivago", "decolar", "expedia", "airbnb"]


def log(msg):
    print(time.strftime("%H:%M:%S"), msg, file=sys.stderr, flush=True)


def chave(s):
    s = unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode().lower()
    s = re.sub(r"\b(ltda|me|epp|restaurante|bar|lanchonete|gastronomia|cafe|curitiba|batel)\b", " ", s)
    return re.sub(r"[^a-z0-9]+", "", s)


def ler_env(caminho, nome):
    if os.environ.get(nome):
        return os.environ[nome]
    if caminho and os.path.exists(caminho):
        for l in open(caminho, encoding="utf-8"):
            m = re.match(rf"\s*{nome}\s*=\s*[\"']?([^\"'\s]+)", l)
            if m:
                return m.group(1)
    return None


class Cache:
    def __init__(self, pasta):
        self.pasta = pasta
        os.makedirs(pasta, exist_ok=True)

    def _p(self, k):
        return os.path.join(self.pasta, hashlib.sha1(k.encode()).hexdigest() + ".json")

    def get(self, k):
        p = self._p(k)
        return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else None

    def put(self, k, v):
        json.dump(v, open(self._p(k), "w", encoding="utf-8"), ensure_ascii=False)
        return v


def buscar_firecrawl(consulta, chave_api, cache):
    em_cache = cache.get("busca:" + consulta)
    if em_cache is not None:
        return em_cache, False
    req = urllib.request.Request(
        "https://api.firecrawl.dev/v1/search",
        data=json.dumps({"query": consulta, "limit": 8, "lang": "pt", "country": "br"}).encode(),
        headers={"Authorization": "Bearer " + chave_api, "Content-Type": "application/json", "User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as r:
        dados = json.load(r)
    itens = dados.get("data") or []
    if isinstance(itens, dict):  # formato v2: {"web": [...]}
        itens = itens.get("web", [])
    res = [{"url": i.get("url"), "titulo": i.get("title"), "descricao": i.get("description")} for i in itens if i.get("url")]
    return cache.put("busca:" + consulta, res), True


def classificar_resultados(lead, resultados):
    """Do resultado de busca tira: site candidato, Instagram e presença em marketplace."""
    achados = {"site": None, "instagram": None, "marketplaces": []}
    k = chave(lead.get("nome"))
    for r in resultados:
        url = r["url"] or ""
        dom = urllib.parse.urlparse(url).netloc.lower().removeprefix("www.")
        m = re.match(r"https?://(www\.)?instagram\.com/([A-Za-z0-9_.]+)/?", url)
        if m and m.group(2) not in ("p", "reel", "explore", "accounts") and not achados["instagram"]:
            achados["instagram"] = "@" + m.group(2)
            continue
        mk = next((n for d, n in MARKETPLACES.items() if d in dom or d in url), None)
        if mk:
            if (mk, url) not in achados["marketplaces"]:
                achados["marketplaces"].append((mk, url))
            continue
        if any(x in dom for x in IGNORAR) or achados["site"]:
            continue
        # site oficial: domínio parecido com o nome
        kd = chave(dom.split(".")[0])
        if k and kd and len(min(k, kd, key=len)) >= 4 and (k[:6] in kd or kd[:6] in k):
            achados["site"] = f"https://{dom}/"
    return achados


def baixar(url, cache, robots_cache):
    em_cache = cache.get("pagina:" + url)
    if em_cache is not None:
        return em_cache
    p = urllib.parse.urlparse(url)
    raiz = f"{p.scheme}://{p.netloc}"
    if raiz not in robots_cache:
        rp = urllib.robotparser.RobotFileParser()
        try:
            req = urllib.request.Request(raiz + "/robots.txt", headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=15) as r:
                rp.parse(r.read().decode("utf-8", "ignore").splitlines())
        except Exception:
            rp.parse([])  # sem robots.txt = permitido
        robots_cache[raiz] = rp
    if not robots_cache[raiz].can_fetch(USER_AGENT, url):
        return cache.put("pagina:" + url, {"erro": "robots.txt não permite"})
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept-Language": "pt-BR"})
        with urllib.request.urlopen(req, timeout=20) as r:
            corpo = r.read(2_000_000).decode(r.headers.get_content_charset() or "utf-8", "ignore")
            final = r.geturl()
    except Exception as e:
        return {"erro": str(e)[:200]}
    links = re.findall(r"""href=["']([^"'#]+)""", corpo, re.I)
    texto = re.sub(r"(?is)<(script|style|noscript)[^>]*>.*?</\1>", " ", corpo)
    texto = html.unescape(re.sub(r"<[^>]+>", " ", texto))
    texto = re.sub(r"\s+", " ", texto).strip()
    return cache.put("pagina:" + url, {"url": final, "links": [urllib.parse.urljoin(final, l) for l in links][:600], "texto": texto[:20000]})


def ler_site(site, cache, robots_cache):
    paginas = []
    inicio = baixar(site, cache, robots_cache)
    if inicio.get("erro"):
        return None, inicio["erro"]
    paginas.append(inicio)
    dom = urllib.parse.urlparse(inicio["url"]).netloc
    internas = [l for l in inicio["links"] if urllib.parse.urlparse(l).netloc == dom
                and re.search(r"card[aá]pio|menu|delivery|pedido|pe[cç]a|fidelidade|clube", l, re.I)]
    for l in list(dict.fromkeys(internas))[:2]:
        pg = baixar(l, cache, robots_cache)
        if not pg.get("erro"):
            paginas.append(pg)
    return paginas, None


def regras(paginas):
    """Sinais a partir do site; cada sinal com evidência curta."""
    links = [l.lower() for p in paginas for l in p["links"]]
    texto = " ".join(p["texto"] for p in paginas).lower()
    s, ev = {}, {}
    mk = sorted({n for l in links for d, n in MARKETPLACES.items() if d in l})
    if mk:
        s["marketplace"] = True
        ev["marketplace"] = "Site linka para " + ", ".join(mk)
    pp = sorted({d for l in links for d in PEDIDO_PROPRIO if d in l})
    pt = [t for t in PEDIDO_TEXTO if t in texto]
    if pp or pt:
        s["pedido_proprio"] = True
        ev["pedido_proprio"] = "Site: " + ", ".join(pp + pt[:2])
    else:
        s["pedido_proprio"] = False
        ev["pedido_proprio"] = "Não achei pedido online no site (só " + str(len(paginas)) + " página(s) lida(s))"
    wa = any(("wa.me" in l or "whatsapp.com/send" in l or "api.whatsapp.com" in l) for l in links)
    if wa and not s.get("pedido_proprio"):
        s["whatsapp_manual"] = True
        ev["whatsapp_manual"] = "Site manda para WhatsApp e não tem pedido online"
    elif s.get("pedido_proprio"):
        s["whatsapp_manual"] = False
        ev["whatsapp_manual"] = "Tem pedido online"
    fd = [t for t in FIDELIDADE if t in texto]
    s["fidelidade"] = bool(fd)
    ev["fidelidade"] = ("Site menciona: " + ", ".join(fd[:3])) if fd else "Não achei fidelidade/clube no site"
    insta = next((m.group(1) for l in links for m in [re.match(r"https?://(?:www\.)?instagram\.com/([A-Za-z0-9_.]+)", l)]
                  if m and m.group(1) not in ("p", "reel", "explore", "accounts")), None)
    return s, ev, insta


PROMPT_IA = """Você avalia o site de um {tipo} para um consultor. Responda SÓ um JSON, sem texto fora dele:
{{"pedido_proprio": true|false|null, "whatsapp_manual": true|false|null, "fidelidade": true|false|null,
  "marketplace": true|false|null, "porque": {{"pedido_proprio": "...", "whatsapp_manual": "...", "fidelidade": "...", "marketplace": "..."}}}}
Definições: {definicoes} Use null quando o texto não permitir concluir. "porque" em até 15 palavras, PT-BR.

Nome: {nome}
Regras automáticas já marcaram: {regras}
Links do site (amostra): {links}
Texto do site (amostra): {texto}
"""

DEFINICOES = ("pedido_proprio = há pedido online do próprio restaurante (cardápio com carrinho/checkout, ainda que de um SaaS) — reserva de mesa NÃO conta. "
              "whatsapp_manual = pedidos de delivery são feitos mandando mensagem no WhatsApp, sem carrinho. fidelidade = programa de pontos/clube/cashback. "
              "marketplace = o restaurante divulga iFood/99Food/Keeta/Rappi.")
TIPO = "restaurante"

# Listas por setor: mesmos sinais, outro vocabulário.
SETORES = {
    "alimentacao": None,  # usa as listas do topo do arquivo
    "hospedagem": {
        "MARKETPLACES": {"booking.com": "Booking", "expedia": "Expedia", "hoteis.com": "Hoteis.com", "hotels.com": "Hoteis.com",
                         "decolar.com": "Decolar", "airbnb.": "Airbnb", "trivago": "Trivago", "hurb.com": "Hurb", "vrbo.com": "Vrbo"},
        "PEDIDO_PROPRIO": ["omnibees", "hsystem", "silbeck", "cloudbeds", "hospedin", "letsbook", "hotelflow", "synxis",
                           "travelclick", "simplebooking", "be.hqbeds", "hqbeds", "booking-engine", "motor-de-reserva",
                           "reservas.", "/reserva", "/booking", "stays.net"],
        "PEDIDO_TEXTO": ["reserve agora", "reservar agora", "reserva online", "faça sua reserva", "faca sua reserva",
                         "verificar disponibilidade", "consultar disponibilidade", "melhor tarifa garantida", "melhor preço garantido"],
        "FIDELIDADE": ["fidelidade", "programa de pontos", "acumule pontos", "clube de vantagens", "hóspede frequente",
                       "hospede frequente", "member", "membro", "cashback", "rewards"],
        "TIPO": "hotel ou pousada",
        "DEFINICOES": ("pedido_proprio = o site tem MOTOR DE RESERVA direta (escolher datas, ver tarifa e reservar/pagar no próprio site, ainda que de um fornecedor como Omnibees/HSystem/Silbeck) — formulário de contato ou link para Booking NÃO conta. "
                       "whatsapp_manual = a reserva direta é feita mandando mensagem no WhatsApp/e-mail, sem motor. "
                       "fidelidade = programa de hóspede frequente, pontos, clube ou tarifa de membro. "
                       "marketplace = o site divulga Booking/Expedia/Decolar/Airbnb/Hurb."),
    },
}


def usar_setor(nome):
    """Troca as listas globais pelo vocabulário do setor (alimentação é o padrão)."""
    conf = SETORES.get(nome)
    if conf:
        globals().update(conf)


def julgar_ia(motor, lead, paginas, sinais):
    links = sorted({l for p in paginas for l in p["links"] if not l.startswith("mailto")})[:80]
    texto = " ".join(p["texto"] for p in paginas)[:6000]
    prompt = PROMPT_IA.format(tipo=TIPO, definicoes=DEFINICOES, nome=lead.get("nome"), regras=json.dumps(sinais, ensure_ascii=False), links="\n".join(links), texto=texto)
    if motor == "claude":
        cmd = ["claude", "-p", "--output-format", "text"]
    else:
        cmd = ["codex", "exec", "-s", "read-only", "--skip-git-repo-check", "-"]
    try:
        r = subprocess.run(cmd, input=prompt, capture_output=True, text=True, timeout=180)
    except Exception as e:
        log(f"  IA falhou: {e}")
        return None
    m = re.search(r"\{.*\}", r.stdout, re.S)
    if not m:
        log(f"  IA sem JSON (código {r.returncode})")
        return None
    try:
        return json.loads(m.group(0))
    except json.JSONDecodeError:
        return None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--entrada", required=True)
    ap.add_argument("--saida", required=True)
    ap.add_argument("--limite", type=int, default=30, help="quantos leads processar (ordem do arquivo)")
    ap.add_argument("--buscar", choices=["firecrawl"], help="buscar site/Instagram de quem não tem site")
    ap.add_argument("--max-buscas", type=int, default=30)
    ap.add_argument("--confirmar", action="store_true", help="sem isto, só mostra a estimativa de crédito")
    ap.add_argument("--env", default=os.path.expanduser("~/projetos/openpcbotv2/.env"))
    ap.add_argument("--ia", choices=["claude", "codex"])
    ap.add_argument("--setor", choices=sorted(SETORES), default="alimentacao")
    ap.add_argument("--cache", default="dados/cache-sitios")
    a = ap.parse_args()

    usar_setor(a.setor)
    dados = json.load(open(a.entrada, encoding="utf-8"))
    leads = dados["leads"] if isinstance(dados, dict) else dados
    alvo = leads[: a.limite]
    cache = Cache(a.cache)
    robots = {}

    chave_api = None
    if a.buscar:
        precisa = [l for l in alvo if not l.get("site")][: a.max_buscas]
        novas = [l for l in precisa if cache.get("busca:" + consulta_de(l)) is None]
        print(f"Busca: {len(novas)} novas (+{len(precisa) - len(novas)} em cache) ≈ {len(novas) * CREDITOS_POR_BUSCA} créditos do Firecrawl")
        if not a.confirmar:
            print("Rode de novo com --confirmar para gastar os créditos.")
            return
        chave_api = ler_env(a.env, "FIRECRAWL_API_KEY")
        if not chave_api:
            raise SystemExit("FIRECRAWL_API_KEY não encontrada (variável de ambiente ou --env).")

    buscas = 0
    for i, l in enumerate(alvo, 1):
        log(f"[{i}/{len(alvo)}] {l.get('nome')}")
        l.setdefault("sinais", {})
        l.setdefault("evidencias", {})
        l.setdefault("fontes", [])
        if a.buscar and not l.get("site") and buscas < a.max_buscas:
            try:
                res, nova = buscar_firecrawl(consulta_de(l), chave_api, cache)
                buscas += 1 if nova else 0
            except Exception as e:
                log(f"  busca falhou: {e}")
                res = []
            ach = classificar_resultados(l, res)
            if ach["site"]:
                l["site"] = ach["site"]
            if ach["instagram"] and not l.get("instagram"):
                l["instagram"] = ach["instagram"]
            if ach["marketplaces"] and l["sinais"].get("marketplace") is None:
                l["sinais"]["marketplace"] = True
                l["evidencias"]["marketplace"] = "Busca encontrou: " + ", ".join(sorted({n for n, _ in ach["marketplaces"]})) + " (conferir)"
            if "busca" not in l["fontes"]:
                l["fontes"].append("busca")
        if not l.get("site"):
            continue
        paginas, erro = ler_site(l["site"], cache, robots)
        if erro:
            l["evidencias"]["site"] = "Site não lido: " + erro
            continue
        sinais, ev, insta = regras(paginas)
        if insta and not l.get("instagram"):
            l["instagram"] = "@" + insta
        if a.ia:
            j = julgar_ia(a.ia, l, paginas, sinais)
            if j:
                for k in ("pedido_proprio", "whatsapp_manual", "fidelidade", "marketplace"):
                    if j.get(k) is not None:
                        sinais[k] = bool(j[k])
                        ev[k] = f"IA ({a.ia}): " + str((j.get("porque") or {}).get(k, ""))[:120]
        for k, v in sinais.items():
            if l["sinais"].get(k) is None or k != "marketplace":
                l["sinais"][k] = v
                l["evidencias"][k] = ev.get(k, "")
        if "site" not in l["fontes"]:
            l["fontes"].append("site")

    saida = dict(dados) if isinstance(dados, dict) else {}
    saida["leads"] = leads
    saida["enriquecido"] = {"em": time.strftime("%Y-%m-%d %H:%M"), "buscas_novas": buscas, "ia": a.ia}
    json.dump(saida, open(a.saida, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    com_site = sum(1 for l in alvo if l.get("site"))
    print(f"{len(alvo)} leads processados, {com_site} com site, {buscas} buscas novas → {a.saida}")


def consulta_de(l):
    return " ".join(x for x in [l.get("nome"), l.get("bairro"), l.get("cidade")] if x)


if __name__ == "__main__":
    main()
