#!/usr/bin/env python3
"""Lista clínicas e consultórios de um município/bairro pelo CNES (DATASUS).

Dados abertos do Ministério da Saúde:
https://dadosabertos.saude.gov.br/dataset/cnes-cadastro-nacional-de-estabelecimentos-de-saude

Uso:
  python3 coletor/cnes.py --ibge 410690 --cidade Curitiba --bairro BATEL --saida dados/cnes-batel.json
  (código IBGE de 6 dígitos; baixa o ZIP de ~56 MB para dados/ na 1ª vez)

LGPD: só estabelecimentos COM CNPJ (consultório de pessoa física tem o nome do
profissional e fica fora), sem e-mail, só privados e ativos (sem motivo de
desativação), só natureza jurídica de empresa (pessoa física fica fora). Tipos de unidade padrão: 22 consultório isolado, 36 clínica/centro
de especialidade, 4 policlínica (conferir a tabela de tipos no CNES).
"""
import argparse
import csv
import io
import json
import os
import re
import unicodedata
import urllib.request
import zipfile

URL = "https://s3.sa-east-1.amazonaws.com/ckan.saude.gov.br/CNES/cnes_estabelecimentos_csv.zip"
USER_AGENT = "raio-x-margem/0.3 (+https://github.com/inematds/raio-x-margem)"
# Natureza jurídica (1º dígito): 1 poder público, 2 empresa, 3 sem fins lucrativos, 4 pessoa física.
# A "esfera administrativa" do CNES é de GESTÃO (quem gere o cadastro), não de propriedade.
EMPRESA = "2"


def normalizar(s):
    return re.sub(r"\s+", " ", unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode()).strip().upper()


def titulo(s):
    pequenas = {"de", "da", "do", "das", "dos", "e"}
    return " ".join(p if (i and p.lower() in pequenas) else p.capitalize() for i, p in enumerate((s or "").lower().split()))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--ibge", required=True, help="código IBGE do município, 6 dígitos (Curitiba = 410690)")
    ap.add_argument("--cidade", required=True)
    ap.add_argument("--bairro", help="texto do bairro (ex.: BATEL); sem ele, a cidade toda")
    ap.add_argument("--tipos", default="22,36,4", help="TP_UNIDADE aceitos")
    ap.add_argument("--zip", default="dados/cnes_estabelecimentos_csv.zip")
    ap.add_argument("--saida", required=True)
    a = ap.parse_args()

    if not os.path.exists(a.zip):
        os.makedirs(os.path.dirname(a.zip) or ".", exist_ok=True)
        with urllib.request.urlopen(urllib.request.Request(URL, headers={"User-Agent": USER_AGENT}), timeout=300) as r:
            open(a.zip, "wb").write(r.read())
    z = zipfile.ZipFile(a.zip)
    tipos = set(a.tipos.split(","))
    bairro = normalizar(a.bairro) if a.bairro else None
    leads, contagem = [], {"municipio": 0, "inativos": 0, "nao_empresa": 0, "sem_cnpj": 0, "outro_tipo": 0}
    with z.open(z.namelist()[0]) as f:
        for l in csv.DictReader(io.TextIOWrapper(f, encoding="latin-1"), delimiter=";"):
            if (l.get("CO_IBGE") or "").strip() != a.ibge:
                continue
            if bairro and normalizar(l.get("NO_BAIRRO")) != bairro:
                continue
            contagem["municipio"] += 1
            if (l.get("CO_MOTIVO_DESAB") or "").strip():
                contagem["inativos"] += 1
                continue
            if not (l.get("CO_NATUREZA_JUR") or "").strip().startswith(EMPRESA):
                contagem["nao_empresa"] += 1  # público, sem fins lucrativos ou pessoa física (LGPD)
                continue
            cnpj = re.sub(r"\D", "", l.get("NU_CNPJ") or "")
            if len(cnpj) != 14:
                contagem["sem_cnpj"] += 1
                continue
            if (l.get("TP_UNIDADE") or "").strip().lstrip("0") not in {t.lstrip("0") for t in tipos}:
                contagem["outro_tipo"] += 1
                continue
            nome = (l.get("NO_FANTASIA") or "").strip() or (l.get("NO_RAZAO_SOCIAL") or "").strip()
            lat, lon = l.get("NU_LATITUDE"), l.get("NU_LONGITUDE")
            leads.append({
                "nome": titulo(nome),
                "cnpj": f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:]}",
                "bairro": titulo(l.get("NO_BAIRRO")),
                "cidade": a.cidade,
                "endereco": " ".join(x for x in [titulo(l.get("NO_LOGRADOURO")), (l.get("NU_ENDERECO") or "").strip()] if x),
                "cep": l.get("CO_CEP"),
                "telefone": (l.get("NU_TELEFONE") or "").strip() or None,
                "tipo_cnes": (l.get("TP_UNIDADE") or "").strip(),
                "cnes": (l.get("CO_CNES") or "").strip(),
                "lat": float(lat) if lat and lat not in ("0.0", "") else None,
                "lon": float(lon) if lon and lon not in ("0.0", "") else None,
                "fontes": ["cnes"],
            })
    leads.sort(key=lambda x: x["nome"])
    json.dump({"fonte": "CNES — Ministério da Saúde (dados abertos)", "consulta": vars(a), "contagem": contagem, "leads": leads},
              open(a.saida, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"{len(leads)} empresas de saúde ativas → {a.saida}  (descartados: {contagem})")


if __name__ == "__main__":
    main()
