# Módulo: Cardápio Vivo

> Ataca: **marketplace** (dá ao cliente um motivo e um caminho para pedir direto), **ticket médio** (combo e adicional na hora certa), **cardápio errado** (destaque para o que dá margem), **mão de obra** (o cardápio responde o que a equipe respondia à mão).

## A pergunta certa: como fazer as pessoas irem até o cardápio?

Um cardápio próprio sozinho é **uma loja numa rua sem movimento**. Ninguém digita o endereço de um cardápio. As pessoas chegam por três coisas, e o módulo constrói as três:

### 1. Tráfego: o cardápio vai até onde a pessoa já está

O cliente não vai ao cardápio; o cardápio aparece onde ele já passa o dia:

| Onde a pessoa já está | Como o cardápio aparece |
|---|---|
| Google ("restaurante perto de mim", "almoço aberto agora") | Perfil da Empresa no Google com **link de pedido** apontando para o cardápio, fotos do prato do dia, horário certo, posts semanais |
| Instagram | link na bio, **destaque "Cardápio"**, story diário do prato do dia com link |
| WhatsApp | **status diário** (quem tem o número salvo vê), **canal** do restaurante, catálogo do WhatsApp Business apontando para o cardápio |
| Comunidade do bairro | grupo/canal do clube do bairro (ver [marketing-local](marketing-local.md)) |
| Mundo físico | QR na mesa, no balcão, na fachada, na sacola dos **pedidos próprios** e do salão, no cartão do motoboy próprio — **nunca na sacola de pedido do iFood** (cl. 3.3) |

### 2. Motivo: por que pedir aqui e não no app de sempre?

Sem motivo, o cliente volta ao marketplace por hábito. Motivos que funcionam:

- **Novidade diária** — e esse é o coração do "vivo": prato do dia, "acabou a feijoada", "saiu agora", promoção da hora parada (15h–18h). Um cardápio que muda **dá razão para olhar de novo**. Cardápio estático não gera visita.
- **Benefício só no canal próprio** — pontos, brinde, sobremesa na 5ª compra, frete melhor. (Preço mais baixo que no marketplace esbarra na paridade da Rappi e talvez no contrato do cliente; benefício é mais seguro — ver [TERMOS.md](../TERMOS.md).)
- **Pertencimento** — "clube do bairro": cliente identificado pelo nome, votação do prato da semana, aviso antes de todo mundo.

### 3. Caminho sem atrito

Cada toque a mais perde gente. Meta: **do link ao pedido pago em até 4 toques.**

link → cardápio (abre rápido, sem cadastro, foto boa) → carrinho com sugestão de adicional → WhatsApp já com o pedido escrito **ou** checkout com Pix copia-e-cola → confirmação.

Repetir o pedido anterior com 1 toque é o maior acelerador de recompra.

## Uma atualização, todos os lugares

O dono não vai atualizar 5 lugares por dia. O fluxo do módulo:

```
foto do prato + 1 frase (WhatsApp do dono para o "assistente")
        │
        ▼  IA escreve texto curto, preço, tags, destaque
   cardápio próprio atualizado (prato do dia, esgotados)
        │
        ├─► status do WhatsApp + canal
        ├─► story/post do Instagram (rascunho para aprovar)
        └─► post no Perfil do Google
```

Começo simples: o implantador faz isso manualmente/semiautomático no 1º mês (aprende o ritmo da casa), depois automatiza o que se repetiu.

## Caminhos de implantação

**A — SaaS pronto (recomendado para começar).** Goomer, Cardápio Web, Anota AI, MenuDino, Neemo, OlaClick (faixas de preço em [ANALISE.md](../ANALISE.md#33-concorrência-de-software-barato)). O implantador escolhe pelo critério: tem Pix sem taxa alta? Tem repetir pedido? Exporta lista de clientes (CSV)? Tem destaque/combos? **Se não exporta clientes, descartar** — a base de clientes é o ativo.

**B — Stack própria (quando o cliente quer controle).** Página estática do cardápio (dados em planilha/JSON) + pedido montado em mensagem de WhatsApp + Pix do próprio banco/PSP + lista de clientes em planilha/CRM simples. Custo mensal perto de zero; exige o implantador na manutenção.

## Checklist de implantação (1ª versão)

- [ ] Ficha técnica dos 20 itens mais vendidos (custo → margem) para decidir destaques
- [ ] Cardápio com fotos reais, 3 combos de margem alta, adicional sugerido no carrinho
- [ ] Link curto e QR gerados; QR impresso em mesa, balcão, sacola de pedido próprio
- [ ] Perfil do Google: link de pedido, horários, 10 fotos, 1º post
- [ ] Instagram: bio, destaque "Cardápio"
- [ ] WhatsApp Business: catálogo, mensagem de saudação com link, respostas rápidas
- [ ] Rotina do prato do dia combinada (quem manda a foto, até que horas)
- [ ] Base "antes" registrada: % pedidos com adicional, pedidos no canal próprio/semana

## Como medir

Pedidos no canal próprio por semana; % com adicional; margem média do mix; acessos ao link (encurtador com contagem). Ligado aos `como_medir` dos vazamentos *marketplace*, *ticket* e *cardápio*.
