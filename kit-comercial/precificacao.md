# Precificação

> Faixas são **premissas a testar** com os primeiros clientes, não tabela de mercado. Registrar o que fechou em cada cliente para calibrar.

## Estrutura

| Item | Modelo | Faixa inicial |
|---|---|---|
| Raio-X | grátis como porta de entrada, ou R$ 300–500 abatidos se virar projeto | — |
| Implantação | fixo por módulo | Cobrança R$ 1.500 · Cardápio Vivo R$ 2.500 · Retenção R$ 2.500 · Comunidade R$ 2.000 |
| Operação mensal | recorrente | R$ 400–1.500/mês conforme módulos ativos |
| Bônus por resultado | opcional | 10–20% da economia **comprovada em taxas** por 6–12 meses |

## Regras

1. **Teto:** tudo somado ≤ 1/3 do recuperável mensal do Raio-X — "tudo somado" = mensalidade + implantação diluída em 6 meses (o horizonte do recuperável). O gerador (`app/proposta.html`) já sugere preços dentro do teto e avisa se você passar dele.
2. **Bônus só sobre o que dá para atribuir** (taxa de cartão, antecipação). Retenção e marketplace entram no relatório, não na cobrança variável — ver [ANALISE.md §3.4](../docs/ANALISE.md#34-atribuição-a-fraqueza-da-cobrança-por-resultado).
3. **Software de terceiros (SaaS, API do WhatsApp) é pago pelo cliente**, na conta dele. O implantador não revende assinatura.
4. **Contrato com saída simples** (30 dias). Quem prova resultado todo mês não precisa de multa.

## Exemplo (Raio-X do app, botão "Preencher exemplo")

- Vazamento: R$ 19.238/mês · recuperável nas 4 prioridades: R$ 4.974/mês
- Teto (1/3): ~R$ 1.650/mês
- Proposta: Cobrança (R$ 1.500) + Cardápio Vivo (R$ 2.500) + operação R$ 900/mês
- Payback da implantação: < 1 mês do recuperável
