#!/usr/bin/env python3
"""Lista restaurantes de um bairro pelos dados abertos do CNPJ (Receita Federal).

Dados públicos oficiais, reuso livre. Baixa os arquivos e filtra DURANTE o
download (não grava os zips): ~7 GB de tráfego na 1ª vez por município; depois
usa o cache de dados/ (só as linhas de alimentação do município).

Uso:
  python3 coletor/cnpj.py --uf PR --municipio 7535 --cidade Curitiba --bairro BATEL \
      --saida dados/cnpj-batel.json

Código de município é o da RECEITA (não IBGE): Curitiba = 7535. Ver Municipios.zip.
LGPD: guarda só dados da empresa (nome fantasia, CNPJ, endereço, telefone
comercial, porte). Não guarda e-mail nem razão social de MEI (costuma ter nome/CPF).
"""
import argparse
import csv
import io
import json
import os
import re
import struct
import sys
import time
import unicodedata
import urllib.request
import zlib

BASE = "https://arquivos.receitafederal.gov.br/public.php/dav/files/YggdBLfdninEJX9/"
USER_AGENT = "raio-x-margem/0.2 (+https://github.com/inematds/raio-x-margem)"
CNAES_PADRAO = ["5611201", "5611203", "5611204", "5611205", "5620104"]
SITUACAO = {"01": "NULA", "1": "NULA", "02": "ATIVA", "2": "ATIVA", "03": "SUSPENSA", "3": "SUSPENSA",
            "04": "INAPTA", "4": "INAPTA", "08": "BAIXADA", "8": "BAIXADA"}
PORTE = {"01": "ME", "03": "EPP", "05": "DEMAIS"}


def log(msg):
    print(time.strftime("%H:%M:%S"), msg, file=sys.stderr, flush=True)


def requisitar(url, metodo="GET", cabecalhos=None):
    h = {"User-Agent": USER_AGENT}
    h.update(cabecalhos or {})
    return urllib.request.urlopen(urllib.request.Request(url, method=metodo, headers=h), timeout=120)


def mes_mais_recente():
    x = requisitar(BASE, "PROPFIND", {"Depth": "1"}).read().decode()
    meses = sorted(set(re.findall(r"/(\d{4}-\d{2})/</d:href>", x)))
    if not meses:
        raise SystemExit("Não achei pastas AAAA-MM no compartilhamento da Receita (o endereço pode ter mudado).")
    return meses[-1]


def linhas_do_zip(url):
    """Descompacta o 1º arquivo de um .zip enquanto baixa (sem gravar em disco)."""
    r = requisitar(url)
    cab = r.read(30)
    assinatura, _, _, metodo, _, _, _, _, _, tam_nome, tam_extra = struct.unpack("<IHHHHHIIIHH", cab)
    if assinatura != 0x04034B50 or metodo != 8:
        raise ValueError(f"{url}: zip inesperado (assinatura {assinatura:x}, método {metodo})")
    r.read(tam_nome + tam_extra)
    d = zlib.decompressobj(-15)
    resto = b""
    total = 0
    while not d.eof:
        bloco = r.read(1 << 20)
        if not bloco:
            break
        total += len(bloco)
        dados = resto + d.decompress(bloco)
        partes = dados.split(b"\n")
        resto = partes.pop()
        for p in partes:
            yield p
    if resto:
        yield resto
    log(f"  {url.rsplit('/', 1)[-1]}: {total / 1e6:.0f} MB lidos")


def ler_csv(linha_bytes):
    return next(csv.reader([linha_bytes.decode("latin-1")], delimiter=";"))


def normalizar(s):
    s = unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", s).strip().upper()


def titulo(s):
    pequenas = {"de", "da", "do", "das", "dos", "e"}
    return " ".join(p if (i and p.lower() in pequenas) else p.capitalize() for i, p in enumerate((s or "").lower().split()))


def cache_municipio(mes, uf, municipio, cnaes, pasta):
    """Estabelecimentos de alimentação do município (todas as situações) → CSV em cache."""
    caminho = os.path.join(pasta, f"cnpj-{mes}-{uf}-{municipio}-alimentacao.csv")
    if os.path.exists(caminho):
        log(f"cache: {caminho}")
        return caminho
    alvo_mun = f'"{municipio}"'.encode()
    alvo_uf = f'"{uf}"'.encode()
    cnaes_b = [c.encode() for c in cnaes]
    tmp = caminho + ".parcial"
    n = 0
    with open(tmp, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter=";")
        for i in range(10):
            for linha in linhas_do_zip(f"{BASE}{mes}/Estabelecimentos{i}.zip"):
                # filtro barato antes do parse
                if alvo_mun not in linha or alvo_uf not in linha or not any(c in linha for c in cnaes_b):
                    continue
                col = ler_csv(linha)
                if len(col) < 30 or col[20] != municipio or col[19] != uf or col[11] not in cnaes:
                    continue
                w.writerow(col)
                n += 1
    os.replace(tmp, caminho)
    log(f"{n} estabelecimentos de alimentação no município → {caminho}")
    return caminho


def complementar(mes, basicos, pasta, nome_cache):
    """Porte/razão social (Empresas) e MEI (Simples) só para os CNPJs pedidos; com cache."""
    caminho = os.path.join(pasta, nome_cache)
    info = {}
    if os.path.exists(caminho):
        info = json.load(open(caminho, encoding="utf-8"))
    faltam = {b for b in basicos if b not in info}
    if not faltam:
        return info
    alvo = {b.encode() for b in faltam}
    for i in range(10):
        for linha in linhas_do_zip(f"{BASE}{mes}/Empresas{i}.zip"):
            if linha[1:9] not in alvo:
                continue
            col = ler_csv(linha)
            info.setdefault(col[0], {}).update({"razao": col[1], "porte": PORTE.get(col[5])})
    for linha in linhas_do_zip(f"{BASE}{mes}/Simples.zip"):
        if linha[1:9] not in alvo:
            continue
        col = ler_csv(linha)
        mei = col[4] == "S" and col[6] in ("", "00000000")
        info.setdefault(col[0], {})["mei"] = mei
    for b in faltam:
        info.setdefault(b, {})
    json.dump(info, open(caminho, "w", encoding="utf-8"), ensure_ascii=False)
    return info


def data_br(s):
    return f"{s[6:8]}/{s[4:6]}/{s[0:4]}" if s and len(s) == 8 and s != "00000000" else None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--uf", required=True)
    ap.add_argument("--municipio", required=True, help="código da Receita (Curitiba = 7535)")
    ap.add_argument("--cidade", required=True, help="nome para exibir")
    ap.add_argument("--bairro", required=True, help="texto do bairro como a Receita grava (ex.: BATEL)")
    ap.add_argument("--cnaes", default=",".join(CNAES_PADRAO))
    ap.add_argument("--mes", help="AAAA-MM (padrão: mais recente)")
    ap.add_argument("--todas-situacoes", action="store_true", help="inclui baixadas/inaptas")
    ap.add_argument("--cache", default="dados")
    ap.add_argument("--saida", required=True)
    a = ap.parse_args()

    os.makedirs(a.cache, exist_ok=True)
    mes = a.mes or mes_mais_recente()
    log(f"dados abertos do CNPJ, mês {mes}")
    arq = cache_municipio(mes, a.uf, a.municipio, a.cnaes.split(","), a.cache)

    bairro = normalizar(a.bairro)
    linhas = []
    with open(arq, encoding="utf-8") as f:
        for col in csv.reader(f, delimiter=";"):
            if normalizar(col[17]) != bairro:
                continue
            if not a.todas_situacoes and SITUACAO.get(col[5]) != "ATIVA":
                continue
            linhas.append(col)
    log(f"{len(linhas)} estabelecimentos no bairro {bairro}")

    info = complementar(mes, {c[0] for c in linhas}, a.cache, f"cnpj-{mes}-{a.uf}-{a.municipio}-empresas.json")
    leads = []
    for c in linhas:
        e = info.get(c[0], {})
        mei = e.get("mei", False)
        nome = c[4].strip() or ("" if mei else e.get("razao", ""))
        if not nome:
            continue  # MEI sem nome fantasia: só teria o nome da pessoa
        cnpj = f"{c[0][:2]}.{c[0][2:5]}.{c[0][5:8]}/{c[1]}-{c[2]}"
        tel = f"({c[21]}) {c[22]}" if c[22].strip() else None
        endereco = " ".join(x for x in [c[13].title(), titulo(c[14]), c[15]] if x and x.strip())
        leads.append({
            "nome": titulo(nome),
            "cnpj": cnpj,
            "bairro": titulo(c[17]),
            "cidade": a.cidade,
            "endereco": endereco + (f" — {titulo(c[16])}" if c[16].strip() else ""),
            "cep": c[18],
            "telefone": tel,
            "cnae": c[11],
            "situacao": SITUACAO.get(c[5], c[5]),
            "abertura": data_br(c[10]),
            "porte": "MEI" if mei else e.get("porte"),
            "matriz": c[3] == "1",
            "fontes": ["cnpj"],
        })
    leads.sort(key=lambda l: l["nome"])
    with open(a.saida, "w", encoding="utf-8") as f:
        json.dump({"fonte": f"Dados abertos do CNPJ — Receita Federal ({mes})", "consulta": vars(a), "leads": leads}, f, ensure_ascii=False, indent=2)
    print(f"{len(leads)} empresas ativas de alimentação no bairro → {a.saida}")


if __name__ == "__main__":
    main()
