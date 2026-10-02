#!/usr/bin/env bash
# Adapta os módulos (docs/modulos/*.md) para outro MERCADO — não é tradução literal.
# Usa o Codex pela ASSINATURA (sem API). Uso:
#   scripts/adaptar-docs.sh es  [arquivo.md ...]   → docs/es/modulos/  (América Latina hispânica)
#   scripts/adaptar-docs.sh en  [arquivo.md ...]   → docs/en/modulos/  (modelo global)
set -euo pipefail
cd "$(dirname "$0")/.."
LANG_ALVO="${1:?es ou en}"; shift
ARQS=("$@"); [ ${#ARQS[@]} -eq 0 ] && ARQS=(docs/modulos/*.md)
MODELO="${MODELO:-gpt-6-luna}"
mkdir -p "docs/$LANG_ALVO/modulos"

case "$LANG_ALVO" in
  es) PESQ="docs/mercados/latam-pesquisa-2026-10.md"
      MERCADO="América Latina hispana (ejemplo por defecto: México, MXN; mencione Colombia, Argentina, Chile y Perú cuando cambie algo). Español neutro latinoamericano, trato de usted.
- Plataformas: Rappi, DiDi Food, Uber Eats, PedidosYa (no iFood/99Food/Keeta).
- Pagos instantáneos: CoDi/DiMo (MX, sin costo para el comercio), QR interoperable (AR), Yape/Plin (PE), Bre-B (CO).
- El IVA se cobra sobre la comisión de la plataforma.
- En Chile la FNE eliminó la paridad de precios en delivery y en Booking: vender más barato en el canal propio es legal allí; en los demás países, revisar el contrato.
- Leyes de datos: LFPDPPP (MX), Ley 1581 (CO), Ley 25.326 (AR), Ley 21.719 (CL), Ley 29733 (PE) — no LGPD.
- WhatsApp: precios oficiales de Meta por país (oct/2026) en la investigación." ;;
  en) PESQ="docs/mercados/global-pesquisa-2026-10.md"
      MERCADO="Global model, NOT focused on Brazil (default worked example: United States, USD; mention UK/EU/Canada/Australia where rules differ). Plain international English.
- Platforms: Uber Eats, DoorDash, Grubhub, Deliveroo, Just Eat (not iFood).
- Payments: card processing and local instant payments (FedNow, Faster Payments/Pay by Bank, SEPA Instant).
- Customer messaging: SMS and email are often more common than WhatsApp; follow consent rules (TCPA, PECR, GDPR, CASL).
- Rate parity: banned for Booking in the EEA (DMA); check local rules elsewhere.
- Data protection: GDPR/UK GDPR, CCPA etc. — not LGPD." ;;
  *) echo "idioma inválido"; exit 1 ;;
esac

for ARQ in "${ARQS[@]}"; do
  NOME=$(basename "$ARQ")
  case "$ARQ" in docs/modulos/*) DIR_SAIDA="docs/$LANG_ALVO/modulos";; *) DIR_SAIDA="docs/$LANG_ALVO";; esac
  mkdir -p "$DIR_SAIDA"; SAIDA="$DIR_SAIDA/$NOME"
  echo "→ $ARQ → $SAIDA" >&2
  PROMPT="Adapte o documento abaixo para outro mercado, no idioma de destino. Não é tradução literal: troque exemplos, plataformas, meios de pagamento, leis e números do Brasil pelos do mercado de destino, usando SOMENTE fatos do arquivo de pesquisa $PESQ (leia-o). Se o mercado não tiver um equivalente confirmado, diga que é preciso verificar localmente — nunca invente número ou regra.

Mercado de destino: $MERCADO

Não cite o Brasil nem instituições, leis ou produtos brasileiros (iFood, Pix, LGPD, Abrasel, CNPJ): o leitor não é do Brasil.

Regras de formato:
- Responda SOMENTE com o markdown final do documento, sem comentários antes ou depois, sem cercas de código em volta.
- Mantenha a estrutura (títulos, tabelas, checklists) e o tamanho aproximado.
- Links relativos: o arquivo original fica em $(dirname "$ARQ")/ e o novo em $DIR_SAIDA/. Reescreva cada link relativo para continuar apontando para o MESMO arquivo (os documentos citados existem só em português, salvo os módulos já adaptados em docs/$LANG_ALVO/modulos/; prefira esses quando existirem). Quando citar números do mercado, acrescente link para a pesquisa docs/mercados/$(basename "$PESQ") com o caminho relativo correto.
- Placeholders como {cliente} ficam como estão.

Documento original (português, mercado Brasil):
-----
$(cat "$ARQ")"
  printf '%s' "$PROMPT" | codex exec -m "$MODELO" -s read-only --skip-git-repo-check - > "$SAIDA.tmp" 2> "$SAIDA.log" || { echo "falhou: $ARQ (ver $SAIDA.log)" >&2; continue; }
  # o codex exec imprime só a resposta final no stdout
  if [ -s "$SAIDA.tmp" ] && head -c 2 "$SAIDA.tmp" | grep -q '#'; then mv "$SAIDA.tmp" "$SAIDA"; rm -f "$SAIDA.log"; else echo "saída inesperada: $ARQ (ver $SAIDA.tmp)" >&2; fi
done
