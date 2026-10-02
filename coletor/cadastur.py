#!/usr/bin/env python3
"""Lista meios de hospedagem de municípios pelo Cadastur (Ministério do Turismo).

Dados abertos, licença ODbL (atribuição: "Cadastur — Ministério do Turismo").
Página: https://dados.turismo.gov.br/dataset/meios-de-hospedagem (XLSX trimestral).

Uso:
  python3 coletor/cadastur.py --arquivo dados/cadastur-hospedagem-2026T2.xlsx \
      --uf RS --municipios Gramado,Canela --saida dados/cadastur-serra.json
  (sem --arquivo, baixa o XLSX mais recente do portal)

LGPD: descarta na leitura CPF, nome do responsável e todos os e-mails.
Lê XLSX só com a biblioteca padrão (sem openpyxl).
"""
import argparse
import json
import re
import sys
import unicodedata
import urllib.request
import zipfile
import xml.etree.ElementTree as ET

PACOTE = "https://dados.turismo.gov.br/api/3/action/package_show?id=meios-de-hospedagem"
USER_AGENT = "raio-x-margem/0.2 (+https://github.com/inematds/raio-x-margem)"
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
DESCARTAR = ("CPF", "Nome do Responsável", "E-mail")  # prefixos de coluna que nunca saem do leitor


def normalizar(s):
    return unicodedata.normalize("NFD", str(s or "")).encode("ascii", "ignore").decode().strip().upper()


def titulo(s):
    pequenas = {"de", "da", "do", "das", "dos", "e"}
    return " ".join(p if (i and p.lower() in pequenas) else p.capitalize() for i, p in enumerate(str(s or "").lower().split()))


def baixar_mais_recente(destino):
    r = json.load(urllib.request.urlopen(urllib.request.Request(PACOTE, headers={"User-Agent": USER_AGENT}), timeout=60))
    xlsx = [x for x in r["result"]["resources"] if (x.get("format") or "").upper() == "XLSX"]
    ultimo = max(xlsx, key=lambda x: x.get("created") or "")
    print(f"Cadastur: {ultimo['name']} → {destino}", file=sys.stderr)
    with urllib.request.urlopen(urllib.request.Request(ultimo["url"], headers={"User-Agent": USER_AGENT}), timeout=180) as f:
        open(destino, "wb").write(f.read())
    return ultimo["name"]


def coluna_indice(ref):
    letras = re.match(r"[A-Z]+", ref).group(0)
    n = 0
    for c in letras:
        n = n * 26 + ord(c) - 64
    return n - 1


def linhas_xlsx(caminho):
    z = zipfile.ZipFile(caminho)
    compartilhadas = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
            compartilhadas.append("".join(t.text or "" for t in si.iter("{%s}t" % NS["m"])))
    planilha = sorted(n for n in z.namelist() if n.startswith("xl/worksheets/sheet"))[0]
    for _, el in ET.iterparse(z.open(planilha)):
        if el.tag != "{%s}row" % NS["m"]:
            continue
        linha = {}
        for c in el.findall("m:c", NS):
            v = c.find("m:v", NS)
            if v is None:
                t = c.find("m:is/m:t", NS)
                valor = t.text if t is not None else ""
            elif c.get("t") == "s":
                valor = compartilhadas[int(v.text)]
            else:
                valor = v.text
            linha[coluna_indice(c.get("r"))] = valor
        el.clear()
        if linha:
            yield [linha.get(i, "") for i in range(max(linha) + 1)]


def porte(texto):
    t = normalizar(texto)
    if "MICROEMPREENDEDOR" in t or t == "MEI":
        return "MEI"
    if "MICRO" in t:
        return "ME"
    if "PEQUENO" in t:
        return "EPP"
    return "DEMAIS" if t else None


def numero(v):
    try:
        return int(float(v))
    except (TypeError, ValueError):
        return None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--arquivo", help="XLSX já baixado (senão baixa o mais recente)")
    ap.add_argument("--uf", required=True)
    ap.add_argument("--municipios", required=True, help="nomes separados por vírgula")
    ap.add_argument("--saida", required=True)
    a = ap.parse_args()

    arq = a.arquivo or "dados/cadastur-hospedagem.xlsx"
    edicao = None if a.arquivo else baixar_mais_recente(arq)
    alvos = {normalizar(m) for m in a.municipios.split(",")}
    linhas = linhas_xlsx(arq)
    cab = next(linhas)
    idx = {nome: i for i, nome in enumerate(cab) if not str(nome).startswith(DESCARTAR)}

    def campo(l, nome):
        i = idx.get(nome)
        return (l[i] if i is not None and i < len(l) else "") or ""

    leads = []
    for l in linhas:
        if normalizar(campo(l, "UF")) != normalizar(a.uf) or normalizar(campo(l, "Município")) not in alvos:
            continue
        cnpj = re.sub(r"\D", "", campo(l, "Número de Inscrição do CNPJ")).zfill(14)
        p = porte(campo(l, "Porte"))
        nome = campo(l, "Nome Fantasia").strip() or ("" if p == "MEI" else campo(l, "Nome da Pessoa Jurídica"))
        if not nome:
            continue
        site = campo(l, "Website").strip().strip("/")
        if site and not re.match(r"https?://", site):
            site = "https://" + site
        # descarta lixo ("-", "nao possui", rede social como site)
        if not re.match(r"https?://[\w-]+(\.[\w-]+)+", site or "") or re.search(r"instagram|facebook|wa\.me|booking\.com|airbnb", site or "", re.I):
            site = ""
        leads.append({
            "nome": titulo(nome),
            "cnpj": f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:]}",
            "cidade": titulo(campo(l, "Município")),
            "bairro": None,
            "endereco": titulo(campo(l, "Endereço Completo Comercial") or campo(l, "Endereço Completo Receita Federal")),
            "telefone": campo(l, "Telefone Comercial") or campo(l, "Telefone Institucional") or None,
            "site": site or None,
            "porte": p,
            "tipo": campo(l, "Tipo de Hospedagem") or campo(l, "Tipo de Estabelecimento") or None,
            "uhs": numero(campo(l, "Unidade Habitacionais")),
            "leitos": numero(campo(l, "Leitos")),
            "idiomas": campo(l, "Idiomas") or None,
            "situacao_cadastur": campo(l, "Situação Cadastral") or None,
            "abertura": campo(l, "Data de Abertura") or None,
            "fontes": ["cadastur"],
        })
    leads.sort(key=lambda x: -(x["uhs"] or 0))
    json.dump({"fonte": "Cadastur — Ministério do Turismo (ODbL)" + (f", {edicao}" if edicao else ""),
               "consulta": vars(a), "leads": leads}, open(a.saida, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"{len(leads)} meios de hospedagem ({sum(1 for x in leads if x['site'])} com site, "
          f"{sum(x['uhs'] or 0 for x in leads)} UHs) → {a.saida}")


if __name__ == "__main__":
    main()
