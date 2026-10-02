#!/usr/bin/env python3
"""Lista estabelecimentos de um setor numa cidade ou bairro pelo OpenStreetMap (Overpass).

Dados do OpenStreetMap: © colaboradores do OpenStreetMap, licença ODbL
(https://www.openstreetmap.org/copyright) — reuso livre com atribuição.

Uso:
  python3 coletor/osm.py --cidade Curitiba --bairro Batel --saida dados/osm-batel.json
  python3 coletor/osm.py --cidade Gramado --setor hospedagem --saida dados/osm-gramado.json

Overpass público tem política de uso justo: 1 consulta por vez, sem laço.
"""
import argparse
import json
import sys
import time
import urllib.parse
import urllib.request

ENDPOINT = "https://overpass-api.de/api/interpreter"
SETORES = {  # setor → lista de (chave OSM, valores)
    "alimentacao": [("amenity", "restaurant|fast_food|cafe|bar|pub|ice_cream|food_court|biergarten")],
    "hospedagem": [("tourism", "hotel|guest_house|motel|hostel|apartment|chalet")],
    "servicos": [("amenity", "dentist|clinic|doctors"), ("healthcare", "dentist|clinic|doctor|physiotherapist|psychotherapist|podiatrist|alternative|nutrition_counselling|speech_therapist"),
                 ("shop", "hairdresser|beauty|massage|cosmetics")],
    "saude": [("amenity", "dentist|clinic|doctors"), ("healthcare", "dentist|clinic|doctor|physiotherapist|psychotherapist|podiatrist|alternative|nutrition_counselling|speech_therapist")],
    "beleza": [("shop", "hairdresser|beauty|massage|cosmetics")],
}
USER_AGENT = "raio-x-margem/0.2 (+https://github.com/inematds/raio-x-margem)"


def montar_consulta(cidade, bairro, nivel_cidade, nivel_bairro, setor, uf=None):
    filtro_uf = f'["is_in:state_code"="{uf}"]' if uf else ""
    if bairro:
        area = f"""area["name"="{cidade}"]["boundary"="administrative"]["admin_level"="{nivel_cidade}"]{filtro_uf}->.cidade;
rel["name"="{bairro}"]["boundary"="administrative"]["admin_level"="{nivel_bairro}"](area.cidade);
map_to_area->.alvo;"""
    else:
        area = f"""area["name"="{cidade}"]["boundary"="administrative"]["admin_level"="{nivel_cidade}"]{filtro_uf}->.alvo;"""
    filtros = "\n".join(f'  nwr["{chave}"~"^({valores})$"](area.alvo);' for chave, valores in SETORES[setor])
    return f"""
[out:json][timeout:90];
{area}
(
{filtros}
);
out center tags;
""".strip()


def consultar(consulta, tentativas=3):
    dados = urllib.parse.urlencode({"data": consulta}).encode()
    for i in range(tentativas):
        req = urllib.request.Request(ENDPOINT, data=dados, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)
        except Exception as e:  # 429/504 são comuns no Overpass público
            if i == tentativas - 1:
                raise
            espera = 20 * (i + 1)
            print(f"Overpass falhou ({e}); nova tentativa em {espera}s", file=sys.stderr)
            time.sleep(espera)


def para_lead(el, cidade, bairro, setor):
    t = el.get("tags", {})
    if not t.get("name"):
        return None
    endereco = " ".join(x for x in [t.get("addr:street"), t.get("addr:housenumber")] if x)
    insta = t.get("contact:instagram") or t.get("instagram")
    centro = el.get("center") or {"lat": el.get("lat"), "lon": el.get("lon")}
    return {
        "nome": t["name"],
        "bairro": t.get("addr:suburb") or bairro or None,
        "cidade": t.get("addr:city") or cidade,
        "endereco": endereco or None,
        "telefone": t.get("phone") or t.get("contact:phone"),
        "site": t.get("website") or t.get("contact:website"),
        "instagram": insta,
        "tipo": next((t.get(chave) for chave, _ in SETORES[setor] if t.get(chave)), None),
        "estrelas": t.get("stars"),
        "quartos": t.get("rooms"),
        "cozinha": t.get("cuisine"),
        "horario": t.get("opening_hours"),
        "osm_id": f"{el['type']}/{el['id']}",
        "lat": centro.get("lat"),
        "lon": centro.get("lon"),
        "fontes": ["osm"],
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cidade", required=True)
    ap.add_argument("--bairro", help="sem ele, a cidade toda")
    ap.add_argument("--setor", choices=sorted(SETORES), default="alimentacao")
    ap.add_argument("--uf", help="sigla do estado, se houver cidades homônimas (usa is_in:state_code)")
    ap.add_argument("--nivel-cidade", default="8", help="admin_level da cidade no OSM (Brasil: 8)")
    ap.add_argument("--nivel-bairro", default="10", help="admin_level do bairro no OSM (Curitiba: 10)")
    ap.add_argument("--saida", required=True)
    a = ap.parse_args()

    resposta = consultar(montar_consulta(a.cidade, a.bairro, a.nivel_cidade, a.nivel_bairro, a.setor, a.uf))
    leads = [l for l in (para_lead(e, a.cidade, a.bairro, a.setor) for e in resposta.get("elements", [])) if l]
    leads.sort(key=lambda l: l["nome"].lower())
    with open(a.saida, "w", encoding="utf-8") as f:
        json.dump({"fonte": "OpenStreetMap (ODbL)", "consulta": {"cidade": a.cidade, "bairro": a.bairro, "setor": a.setor}, "leads": leads}, f, ensure_ascii=False, indent=2)
    com_site = sum(1 for l in leads if l["site"])
    print(f"{len(leads)} lugares no OSM ({com_site} com site) → {a.saida}")
    if not leads:
        print("Nada encontrado: confira o nome exato do bairro e o admin_level no OSM.", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
