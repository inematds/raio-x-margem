# Módulo: 100% canal próprio (sem marketplace)

> Ataca: **marketplace** por inteiro, **pagamentos** (Pix sem intermediário), **retenção**. Para restaurante com **marca no bairro** — quem já tem salão cheio, nota alta e gente que pergunta "vocês entregam?".

## Quando faz sentido (e quando não)

| Faz sentido | Não faz |
|---|---|
| Salão movimentado, marca conhecida na região | Cozinha só de delivery, sem marca (CNAE 5620-1/04 sem salão) |
| Raio de entrega curto (bairro + vizinhos) | Depende de clientes de longe que só acham pelo app |
| Dono disposto a operar o canal todo dia | Ninguém para responder e postar o prato do dia |
| Marketplace < 30% do faturamento | Marketplace > 60% do faturamento (sair de uma vez quebra o caixa) |

**Transição segura:** primeiro **reduzir** (marketplace só para quem não conhece a casa, canal próprio para o resto); sair de vez só quando o canal próprio passar do marketplace por 3 meses seguidos. O Painel (fase 5) mostra esse cruzamento.

## O que o marketplace entrega — e quem substitui

| O marketplace dá | Substituto no canal próprio |
|---|---|
| Descoberta (gente nova) | Perfil do Google, Instagram, **Guia do Bairro** ([marketing-local](marketing-local.md)), indicação |
| Cardápio e carrinho | [Cardápio Vivo](cardapio-vivo.md) (página do kit ou TastyIgniter) |
| Pagamento | **Pix estático** gerado localmente (sem intermediário, sem taxa) ou PSP com Pix dinâmico ([cobrança](cobranca.md)) |
| Entregador | Motoboy próprio/parceiro do bairro + rotas com VROOM/OSRM; horários de entrega agrupada em condomínios |
| Atendimento e status | WhatsApp Business (app) ou Chatwoot + API oficial |
| Promoções | Clube do bairro, fidelidade, cupom de parceiro |
| Avaliações | Pedido de avaliação no Google após cada entrega |

Peças abertas, licenças e riscos: [ALTERNATIVAS-ABERTAS.md](../ALTERNATIVAS-ABERTAS.md).

## Stack mínima (custo mensal perto de zero)

1. Cardápio estático publicado (GitHub Pages/Cloudflare Pages) com carrinho que monta a mensagem do pedido.
2. Pix estático com o QR da chave da empresa (valor preenchido no pedido); conferência pela notificação do banco.
3. WhatsApp Business app com catálogo e respostas rápidas.
4. Planilha de clientes (telefone, pedidos, último pedido) → régua de reativação manual no 1º mês.
5. Motoboy próprio ou parceiro por diária, raio fixo, taxa de entrega clara.

## Riscos

- **Pix estático** não confirma sozinho: alguém confere o extrato. Com volume, migrar para Pix dinâmico (PSP) — custo baixo, confirmação automática.
- **Logística** é o ponto que mais derruba: atraso de entrega própria queima a marca mais rápido que atraso do app.
- **Sem descoberta nova** o canal encolhe com o tempo: Guia do Bairro e indicação são obrigatórios, não opcionais.

## Checklist

- [ ] Raio-X confirma: marketplace < 60% e salão/marca fortes
- [ ] Cardápio próprio no ar + QR Pix testado em 2 bancos
- [ ] Entrega própria com tempo médio medido por 2 semanas
- [ ] Clube do bairro com 100+ membros antes de reduzir o marketplace
- [ ] Plano de redução em 3 etapas com data e critério de volta atrás

## Como medir

Pedidos/semana no canal próprio × marketplace (cruzamento); tempo médio de entrega; custo por pedido (entrega + Pix + operação) × custo efetivo do marketplace.
