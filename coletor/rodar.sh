#!/usr/bin/env bash
# Um comando por bairro (ou cidade) e setor: lista → junta → prioriza → enriquece.
#
#   bash coletor/rodar.sh --setor restaurante --uf PR --cidade Curitiba --bairro "Água Verde" --limite 30 --ia claude
#   bash coletor/rodar.sh --setor hotel --uf RS --cidade Gramado --limite 40
#   bash coletor/rodar.sh --setor clinica --uf PR --cidade Curitiba --bairro Batel --buscar 25 --confirmar
#   ... --simular   → só mostra os passos, não executa nada
#
# Setores: restaurante | hotel | clinica | salao
# Fontes por setor: CNPJ (Receita) + OpenStreetMap; hotel + Cadastur; clínica + CNES.
# Nada é raspado de Google Maps, Instagram, apps de delivery ou sites de reserva (ver docs/FONTES-E-LIMITES.md).
# Saída: dados/leads-<setor>-<cidade>[-<bairro>].json  →  importar no Caçador (app/cacador.html).
set -euo pipefail
cd "$(dirname "$0")/.."

SETOR="" UF="" CIDADE="" BAIRRO="" LIMITE=30 IA="nenhuma" BUSCAR=0 CONFIRMAR=0 INTERVALO=13 SIMULAR=0
while [ $# -gt 0 ]; do
  case "$1" in
    --setor) SETOR="$2"; shift 2;; --uf) UF="$2"; shift 2;; --cidade) CIDADE="$2"; shift 2;;
    --bairro) BAIRRO="$2"; shift 2;; --limite) LIMITE="$2"; shift 2;; --ia) IA="$2"; shift 2;;
    --buscar) BUSCAR="$2"; shift 2;; --confirmar) CONFIRMAR=1; shift;; --intervalo-busca) INTERVALO="$2"; shift 2;;
    --simular) SIMULAR=1; shift;;
    *) echo "argumento desconhecido: $1" >&2; exit 1;;
  esac
done
[ -n "$SETOR" ] && [ -n "$UF" ] && [ -n "$CIDADE" ] || { echo "uso: rodar.sh --setor <restaurante|hotel|clinica|salao> --uf <UF> --cidade <nome> [--bairro <nome>] [--limite N] [--ia claude|codex|nenhuma] [--buscar N --confirmar] [--simular]" >&2; exit 1; }
[[ "$UF" =~ ^[A-Za-z]{2}$ ]] || { echo "UF inválida: $UF" >&2; exit 1; }
[[ "$LIMITE" =~ ^[0-9]+$ && "$BUSCAR" =~ ^[0-9]+$ ]] || { echo "--limite/--buscar devem ser números" >&2; exit 1; }
UF=$(echo "$UF" | tr a-z A-Z)

slug() { python3 -c 'import sys,unicodedata,re;s=unicodedata.normalize("NFD",sys.argv[1]).encode("ascii","ignore").decode().lower();print(re.sub(r"[^a-z0-9]+","-",s).strip("-"))' "$1"; }
cnaes() { node -e 'const p=require("./setores/"+process.argv[1]+".js");process.stdout.write(p.cacador.cnaes.join(","))' "$1"; }
passo() { echo "== [$1/6] $2"; }
run() { echo "\$ $*"; if [ "$SIMULAR" = 0 ]; then "$@"; fi; }

ID="$SETOR-$(slug "$CIDADE")${BAIRRO:+-$(slug "$BAIRRO")}"
D=dados; mkdir -p "$D"
SERVICOS="$(cnaes clinica),$(cnaes salao)"
case "$SETOR" in
  restaurante) GRUPO=alimentacao; CN=$(cnaes restaurante); SOMENTE=""; OSM=alimentacao; SIT=alimentacao;;
  hotel)       GRUPO=hospedagem;  CN=$(cnaes hotel);       SOMENTE=""; OSM=hospedagem;  SIT=hospedagem;;
  clinica)     GRUPO=servicos;    CN=$SERVICOS;            SOMENTE=$(cnaes clinica); OSM=saude;  SIT=servicos;;
  salao)       GRUPO=servicos;    CN=$SERVICOS;            SOMENTE=$(cnaes salao);   OSM=beleza; SIT=servicos;;
  *) echo "setor inválido: $SETOR" >&2; exit 1;;
esac

passo 1 "códigos do município"
if [ "$SIMULAR" = 1 ]; then MUN="<codigo-receita>"; IBGE="<codigo-ibge>"; echo "\$ python3 coletor/municipio.py --uf $UF --cidade \"$CIDADE\""
else
  SEM_IBGE="--sem-ibge"; [ "$SETOR" = clinica ] && SEM_IBGE=""
  J=$(python3 coletor/municipio.py --uf "$UF" --cidade "$CIDADE" $SEM_IBGE)
  MUN=$(echo "$J" | python3 -c 'import sys,json;print(",".join(json.load(sys.stdin)["receita"]))')
  IBGE=$(echo "$J" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("ibge") or "")')
  echo "Receita: $MUN · IBGE: ${IBGE:-—}"
fi
CIDADES=$(echo "$MUN" | tr ',' '\n' | sed "s/.*/$CIDADE/" | paste -sd, -)   # um nome por código (homônimos)

passo 2 "CNPJ (Receita) — 1ª vez por cidade e grupo baixa ~7 GB filtrando no caminho; depois sai do cache"
ARGS=(--uf "$UF" --municipio "$MUN" --cidade "$CIDADES" --grupo "$GRUPO" --cnaes "$CN" --saida "$D/$ID-cnpj.json")
[ -n "$BAIRRO" ] && ARGS+=(--bairro "$BAIRRO")
[ -n "$SOMENTE" ] && ARGS+=(--somente "$SOMENTE")
run python3 -u coletor/cnpj.py "${ARGS[@]}"
FONTES=("$D/$ID-cnpj.json")

passo 3 "OpenStreetMap e cadastros do setor"
ARGS=(--cidade "$CIDADE" --setor "$OSM" --saida "$D/$ID-osm.json")
[ -n "$BAIRRO" ] && ARGS+=(--bairro "$BAIRRO")
if run python3 coletor/osm.py "${ARGS[@]}"; then FONTES+=("$D/$ID-osm.json"); else echo "  (OSM sem resultado — segue sem ele)"; fi
if [ "$SETOR" = hotel ]; then
  run python3 coletor/cadastur.py --uf "$UF" --municipios "$CIDADE" --saida "$D/$ID-cadastur.json" && FONTES+=("$D/$ID-cadastur.json")
fi
if [ "$SETOR" = clinica ]; then
  if [ -n "${IBGE:-}" ]; then
    ARGS=(--ibge "$IBGE" --cidade "$CIDADE" --saida "$D/$ID-cnes.json"); [ -n "$BAIRRO" ] && ARGS+=(--bairro "$BAIRRO")
    run python3 coletor/cnes.py "${ARGS[@]}" && FONTES+=("$D/$ID-cnes.json")
  else echo "  (sem código IBGE — CNES pulado)"; fi
fi

passo 4 "juntar sem duplicar"
echo "\$ node coletor/juntar.js ${FONTES[*]} > $D/$ID-juntos.json"
[ "$SIMULAR" = 0 ] && node coletor/juntar.js "${FONTES[@]}" > "$D/$ID-juntos.json"

passo 5 "priorizar nome de fachada"
echo "\$ node coletor/priorizar.js $D/$ID-juntos.json > $D/leads-$ID.json"
[ "$SIMULAR" = 0 ] && node coletor/priorizar.js "$D/$ID-juntos.json" > "$D/leads-$ID.json"

EXTRA=""; [ "$IA" != nenhuma ] && EXTRA="$EXTRA, IA $IA"; [ "$BUSCAR" -gt 0 ] && EXTRA="$EXTRA, até $BUSCAR buscas"
passo 6 "enriquecer os $LIMITE primeiros (site do próprio negócio$EXTRA)"
FINAL="$D/leads-$ID.json"
if [ "$LIMITE" -gt 0 ]; then
  ARGS=(--setor "$SIT" --entrada "$D/leads-$ID.json" --saida "$D/leads-$ID-enr.json" --limite "$LIMITE" --intervalo-busca "$INTERVALO")
  [ "$IA" != nenhuma ] && ARGS+=(--ia "$IA")
  if [ "$BUSCAR" -gt 0 ]; then ARGS+=(--buscar firecrawl --max-buscas "$BUSCAR"); [ "$CONFIRMAR" = 1 ] && ARGS+=(--confirmar); fi
  if [ "$BUSCAR" -gt 0 ] && [ "$CONFIRMAR" = 0 ]; then
    run python3 -u coletor/sitios.py "${ARGS[@]}"   # só mostra a estimativa de crédito
    ARGS=(--setor "$SIT" --entrada "$D/leads-$ID.json" --saida "$D/leads-$ID-enr.json" --limite "$LIMITE")
    [ "$IA" != nenhuma ] && ARGS+=(--ia "$IA")
    echo "  (busca paga não confirmada: enriquecendo só quem já tem site)"
  fi
  run python3 -u coletor/sitios.py "${ARGS[@]}"
  FINAL="$D/leads-$ID-enr.json"
fi
if [ "$SIMULAR" = 1 ]; then echo "(simulação: nada foi executado; a saída seria $FINAL)"; else echo "SAIDA: $FINAL"; fi
