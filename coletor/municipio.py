#!/usr/bin/env python3
"""Descobre os códigos de um município: o da Receita (para o CNPJ) e o do IBGE (para o CNES).

Uso:
  python3 coletor/municipio.py --uf PR --cidade Curitiba            → {"receita": ["7535"], "ibge": "410690"}
  python3 coletor/municipio.py --uf PR --cidade Curitiba --sem-ibge  → só o da Receita (sem consulta ao OSM)

Receita: tabela Municipios.zip (sem UF; homônimos voltam todos — o cnpj.py filtra pela UF).
IBGE: tag "IBGE:GEOCODIGO" da fronteira do município no OpenStreetMap (Overpass), dentro da UF.
"""
import argparse
import csv
import io
import json
import os
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
import zipfile

BASE = "https://arquivos.receitafederal.gov.br/public.php/dav/files/YggdBLfdninEJX9/"
OVERPASS = "https://overpass-api.de/api/interpreter"
USER_AGENT = "raio-x-margem/0.6 (+https://github.com/inematds/raio-x-margem)"
CACHE = "dados/receita-municipios.csv"


def normalizar(s):
    s = unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", s).strip().upper()


def tabela_receita():
    if not os.path.exists(CACHE):
        os.makedirs(os.path.dirname(CACHE), exist_ok=True)
        x = urllib.request.urlopen(urllib.request.Request(BASE, method="PROPFIND", headers={"Depth": "1", "User-Agent": USER_AGENT}), timeout=60).read().decode()
        mes = sorted(set(re.findall(r"/(\d{4}-\d{2})/</d:href>", x)))[-1]
        b = urllib.request.urlopen(urllib.request.Request(f"{BASE}{mes}/Municipios.zip", headers={"User-Agent": USER_AGENT}), timeout=120).read()
        z = zipfile.ZipFile(io.BytesIO(b))
        texto = z.read(z.namelist()[0]).decode("latin-1")
        with open(CACHE, "w", encoding="utf-8") as f:
            f.write(texto)
    with open(CACHE, encoding="utf-8") as f:
        return [(c, n) for c, n in csv.reader(f, delimiter=";")]


def codigos_receita(cidade):
    alvo = normalizar(cidade)
    return [c for c, n in tabela_receita() if normalizar(n) == alvo]


def codigo_ibge(uf, cidade):
    q = f"""[out:json][timeout:60];
area["ISO3166-2"="BR-{uf.upper()}"]->.uf;
rel["boundary"="administrative"]["admin_level"="8"]["name"="{cidade}"](area.uf);
out tags;"""
    dados = urllib.parse.urlencode({"data": q}).encode()
    r = None
    for t in range(3):  # Overpass público devolve 429/504 quando está cheio
        try:
            r = json.load(urllib.request.urlopen(urllib.request.Request(OVERPASS, data=dados, headers={"User-Agent": USER_AGENT}), timeout=90))
            break
        except Exception as e:
            print(f"Overpass falhou ({e}); tentativa {t + 1}/3", file=sys.stderr)
            time.sleep(20 * (t + 1))
    if r is None:
        return None
    for el in r.get("elements", []):
        g = el.get("tags", {}).get("IBGE:GEOCODIGO")
        if g and len(g) >= 6:
            return g[:6]  # CNES usa 6 dígitos (sem o verificador)
    return None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--uf", required=True)
    ap.add_argument("--cidade", required=True)
    ap.add_argument("--sem-ibge", action="store_true")
    a = ap.parse_args()
    receita = codigos_receita(a.cidade)
    if not receita:
        print(json.dumps({"erro": f"município '{a.cidade}' não está na tabela da Receita (confira a grafia)"}, ensure_ascii=False))
        sys.exit(2)
    ibge = None if a.sem_ibge else codigo_ibge(a.uf, a.cidade)
    print(json.dumps({"receita": receita, "ibge": ibge}, ensure_ascii=False))


if __name__ == "__main__":
    main()
