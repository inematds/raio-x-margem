# Módulo: Ganho e retenção de clientes

> Ataca: **marketplace** (recompra paga de novo), **retenção** (cliente que compra uma vez e some), **marketing** (anúncio para quem já é cliente).

## Regra de ouro

**Marketplace = aquisição. Canal próprio = retenção.** O módulo não tenta tirar o restaurante do marketplace; tenta fazer com que **a segunda compra** aconteça num canal onde o restaurante conhece o cliente.

## Duas frentes

### Frente 1 — Ganhar clientes (para o restaurante)

| Fonte | Ação | Custo |
|---|---|---|
| Google | Perfil completo, avaliações respondidas, pedir avaliação após pedido próprio | zero |
| Marketplace | Continua como vitrine para quem não conhece a casa | comissão |
| Indicação | "Indique um vizinho: os dois ganham X" — código por cliente | benefício |
| Bairro | Parcerias e comunidade ([marketing-local](marketing-local.md)) | baixo |
| Anúncio | Só para público **novo**, excluindo a lista de clientes atuais | mídia |

### Frente 2 — Fazer voltar (retenção)

1. **Capturar o contato com consentimento** em todo ponto que é do restaurante: pedido próprio, salão (QR "entre no clube"), Wi-Fi do salão, balcão. Nunca usar dado de cliente do marketplace (ver [ANALISE.md §3.1](../ANALISE.md#31-termos-do-marketplace-o-risco-jurídico-central)).
2. **Segmentar** automaticamente: novo (1 pedido), recorrente, inativo (> 30/45 dias), VIP (top 10% em valor), sensível a promoção.
3. **Régua de mensagens** (WhatsApp; ver custos e regras na análise):
   - D+1 após 1º pedido: agradecimento + pedido de avaliação no Google
   - D+7: "seu prato favorito saiu hoje" (se houver)
   - Inativo 30 dias: benefício de volta, uma vez
   - VIP: aviso antecipado de novidade, sem desconto (não ensinar a esperar promoção)
4. **Fidelidade simples**: pontos ou "a cada 10, 1 grátis". Sem app: identificação pelo telefone.

## Para o implantador: Caçador de Margem (ganhar clientes para você)

O mesmo módulo, do lado de quem implanta. Critérios e pesos já estão no pacote (`cacador`): nota ≥ 4,5, mais de 500 avaliações, ativo em marketplace, Instagram ativo, sem pedido próprio, WhatsApp manual, sem fidelidade. Fase 3 entrega a tela: colar CSV de leads (levantados à mão ou por coleta autorizada) → pontuação → texto de abordagem pronto.

Abordagem (do pacote):
> "Seu restaurante claramente já tem demanda. O problema não parece ser conseguir clientes. É que, cada vez que seu cliente volta pelo marketplace, você paga de novo para falar com alguém que já conhece sua marca."

## Caminhos de implantação

**A — SaaS pronto:** o próprio sistema de cardápio (quando exporta clientes) + WhatsApp Business app com etiquetas + planilha de régua. Para volume, provedor oficial da API do WhatsApp com campanhas.

**B — Stack própria:** CRM em planilha/Supabase + automação (n8n) + API oficial do WhatsApp. **Nunca** API não oficial no número principal.

## Checklist

- [ ] Onde o contato é capturado (lista de pontos) + texto de consentimento (LGPD)
- [ ] Segmentos definidos com dias de corte da casa
- [ ] 4 mensagens da régua escritas e aprovadas pelo dono
- [ ] Programa de fidelidade com regra de 1 linha
- [ ] Lista de exclusão aplicada nos anúncios
- [ ] Base "antes": retorno em 60 dias da última coorte

## Como medir

Retorno em 60 dias por coorte mensal (antes × depois); pedidos no canal próprio de clientes identificados; custo de mensagens ÷ margem dos pedidos gerados.
