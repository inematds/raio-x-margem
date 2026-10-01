# Análise profunda — a tese "encontre clientes que estão perdendo dinheiro"

> Base: os dois documentos em [`origem/`](origem/). Pesquisa feita em 01/10/2026 com busca na web.
> **Como ler os números:** cada valor traz fonte e grau de confiança — **oficial** (órgão/empresa dona do dado), **imprensa**, **fornecedor** (blog de quem vende software para restaurante, logo tem interesse) ou **estimativa**. Nenhum número aqui substitui o extrato do cliente: no diagnóstico, vale o que está no papel dele.

---

## 1. Veredito

A tese se sustenta e é melhor do que "vender IA" por um motivo simples: **ela começa por um número que o dono já sente, mas não enxerga somado.** O diferencial não é o software — software de cardápio e pedido próprio já existe e é barato (seção 5). O diferencial é o **pacote diagnóstico + implantação + medição**, feito por alguém do lugar, que prova em reais o que voltou para o caixa.

Três ajustes em relação aos documentos de origem:

1. **Calcular vazamento em margem, não em faturamento.** "Cliente que não volta" não custa o ticket inteiro; custa a margem de contribuição que deixou de entrar. O Raio-X já calcula assim — os números ficam menores e muito mais defensáveis diante do dono.
2. **O vazamento mais rápido de fechar quase nunca é o marketplace.** Taxa de cartão e antecipação se resolvem em 2 semanas com uma proposta de adquirente; o canal próprio leva meses. Começar pelo rápido paga a implantação e compra confiança para o resto.
3. **Medição tem de ser desenhada antes de começar.** Sem base "antes" registrada, o "dinheiro recuperado" vira opinião (sazonalidade, promoção do marketplace, chuva). Por isso cada vazamento no pacote de setor carrega `como_medir`.

---

## 2. O tamanho da dor (com fonte)

### 2.1 Marketplaces de delivery

| Plataforma | Custo para o restaurante | Confiança | Fonte |
|---|---|---|---|
| iFood Plano Básico (restaurante entrega) | 12% comissão + 3,2% pagamento online = **15,2%** | fornecedor (confere com blog do iFood) | [brendi](https://brendi.com.br/blog/planos-ifood-taxas-2026/), [iFood parceiros](https://blog-parceiros.ifood.com.br/taxas-ifood/) |
| iFood Plano Entrega (iFood entrega) | 23% + 3,2% = **26,2%** — pedido de R$ 100 repassa R$ 73,80 | fornecedor | [brendi](https://brendi.com.br/blog/taxa-ifood-restaurantes-delivery-2026/) |
| iFood mensalidade | R$ 110 (Básico) / R$ 150 (Entrega), acima de R$ 1.800/mês | fornecedor | idem |
| iFood custo total efetivo | **20% a 32%** do faturamento no canal | estimativa | [sisfood](https://www.sisfood.com.br/saiba-mais/gestao-financeira/quanto-custa-vender-ifood) |
| 99Food | 0% comissão e mensalidade nos 2 primeiros anos; depois 8,9%–12% anunciados | fornecedor | [brendi](https://brendi.com.br/comparativo-ifood-99food-keeta) |
| Keeta (Meituan) | sem tabela pública; "2–3 p.p. abaixo do líder", isenção na entrada | estimativa | [brendi](https://brendi.com.br/keeta-para-restaurantes) |
| Rappi | 12% + 3,5% (entrega própria) ou 27% (full service); houve isenção com aporte de R$ 1,4 bi | oficial/imprensa | [Rappi](https://merchants.rappi.com/pt-br/taxas-rappi-para-restaurantes), [CNN](https://www.cnnbrasil.com.br/economia/negocios/rappi-vai-investir-r-14-bi-no-brasil-e-isentar-restaurantes-de-taxas/) |

**Leitura:** o "quase um quarto do pedido" do documento de origem bate com o Plano Entrega do iFood (26,2%). No Plano Básico o custo cai para ~15%, mas o restaurante paga entregador. **Por isso o Raio-X pede o custo efetivo calculado pelo extrato** ((vendido − recebido) ÷ vendido), não a tabela.

**Competição muda o argumento, não o mata.** Com 99Food a 0% e Keeta isentando, o argumento "a comissão é cara" enfraquece por um tempo. O argumento que fica é o do documento de origem: **quem tem o contato do cliente é a plataforma, não o restaurante.** Promoção de entrada acaba; a base própria fica. Em 30/09/2026 o TJ-SP considerou ilegais cláusulas da 99Food que impediam restaurantes de operar também com a Keeta ([Correio Braziliense](https://blogs.correiobraziliense.com.br/capital-sa/2026/09/30/justica-impede-99food-de-proibir-parceria-de-bares-e-restaurantes-com-a-keeta/), imprensa) — o ambiente regulatório está a favor de o restaurante não depender de um só canal.

### 2.2 Canais de venda do delivery hoje

- Faturamento do delivery por canal: **marketplaces 54%, WhatsApp 26%, app/site próprio 12%, telefone 8%** — [Abrasel](https://abrasel.com.br/noticias/noticias/whatsapp-representa-26-do-faturamento-delivery-bares-restaurantes/) (oficial; ano não confirmado).
- Delivery = **58% das vendas** de quem entrega; estabelecimentos que entregam caíram de 78% (2022) para 71% (2025) — pesquisa Abrasel **encomendada pela 99Food** ([spacemoney](https://www.spacemoney.com.br/tecnologia/delivery-restaurantes-abrasel-58)). Conflito de interesse: usar com cautela.

**Leitura:** o WhatsApp já é o segundo canal (26%) — mas quase sempre atendido à mão, sem cardápio estruturado, sem histórico. Isso confirma a aposta do documento de origem: **não criar app; estruturar o WhatsApp que já existe.**

### 2.3 Margem do setor

- Junho/2025, micro e pequenas de alimentação fora do lar: 32,5% com lucro, 45% no equilíbrio, 22% no prejuízo; entre restaurantes, 41% com lucro — [Fecomércio-RN / Abrasel](https://shrbs-rn.portaldocomercio.org.br/mercado/micro-e-pequenas-empresas-de-alimentacao-fora-do-lar-enfrentam-cenario-desafiador-em-2025/) (imprensa com dado Abrasel).
- "Mais da metade opera sem lucro" — [Abrasel](https://abrasel.com.br/noticias/noticias/bares-restaurantes-sem-lucro/) (oficial; mês/ano não confirmado no resumo).
- Lucro líquido médio "até 10%" — consultoria ([fonte](https://miriangasparin.com.br/2025/06/lucro-liquido-medio-dos-restaurantes-no-brasil-nao-passa-de-10/)), **estimativa**.

**Leitura:** com margem líquida de um dígito, cada 1% do faturamento recuperado é ~10–20% a mais de lucro. É essa conta que deve aparecer na conversa com o dono.

### 2.4 Pagamentos

- MDR médio no 2º semestre/2025: **crédito 2,10%, débito 1,08%** — dado do Banco Central citado por [Cora](https://www.cora.com.br/blog/taxa-mdr/) (base aberta do [BCB](https://dadosabertos.bcb.gov.br/dataset/estatisticas-meios-pagamentos)).
- Pequeno comerciante na prática: débito 0,8–1,5%, crédito à vista 2–4%, parcelado 3,5–6%+ — **estimativa** ([vendasimples](https://vendasimples.com.br/blog/taxa-da-maquininha-de-cartao/)).
- Antecipação de recebíveis: **1,89% a 3,2% ao mês** — fornecedor ([antecipafacil](https://antecipafacil.com.br/artigo/antecipacao-recebiveis-cielo-2026-cartao-credito)). O lojista pode escolher outro financiador.
- Pix: sem MDR; PJ (exceto MEI/EI) pode pagar tarifa definida pela instituição — [Stone](https://conteudo.stone.com.br/tarifa-do-pix/) (imprensa do setor). Pix na maquininha: 0–0,99% (estimativa).
- Pix Automático desde 16/06/2025: grátis para o pagador PF, tarifa do recebedor negociada — [Agência Gov](https://agenciagov.ebc.com.br/noticias/202506/pix-automatico-chega-em-16-de-junho) (oficial).

**Leitura:** a distância entre a média do BC (2,10% no crédito) e o que muito pequeno comerciante paga (3–4%) é o vazamento mais fácil de provar e fechar. Antecipação de rotina a 2–3% ao mês é crédito caro disfarçado de "receber antes". Pix Automático abre uma porta nova: **assinatura de marmita/almoço semanal** com cobrança recorrente barata (módulo [cobrança](modulos/cobranca.md)).

### 2.5 Cozinha

- CMV de referência: 25–40% do faturamento conforme a operação — atribuído à Abrasel em [blog do iFood](https://blog-parceiros.ifood.com.br/cmv/) (não checado na fonte).
- Desperdício: médio 8–12% do CMV; aceitável 4–8%; enxuto 3–5%; acima de 10% = sem controle — **fornecedor** ([sisfood](https://www.sisfood.com.br/saiba-mais/gestao-financeira/desperdicio-restaurante)).

**Leitura:** desperdício é vazamento grande, mas é o mais caro de medir (exige pesagem e ficha técnica). Fica no diagnóstico, raramente na primeira fase da implantação.

### 2.6 Retenção (dados fracos)

Só achei dados dos EUA e de blogs: 69–78% dos clientes de primeira visita não voltam; membros de fidelidade gastam 18–30% mais ([bloomintelligence](https://bloomintelligence.com/blog/restaurant-customer-retention-2026-guide/), **estimativa**). **Não há dado brasileiro confiável de recompra em delivery.** Consequência prática: no Raio-X, retorno atual e meta são **premissas a medir com o próprio cliente** em 2 coortes antes de virar promessa.

---

## 3. Riscos que podem derrubar a tese

### 3.1 Termos do marketplace (o risco jurídico central)

Os termos de parceiro do iFood vedam, segundo os resumos encontrados: **divulgar telefone ou canal de entrega próprio por pedidos e canais da plataforma**, **usar dados de clientes da plataforma para divulgar canal próprio** e usar embalagem de concorrente ([termos 2023 PDF](https://assets-cms-partner.ifood.com.br/termos_e_condicoes_2023_92a1934504.pdf), [termos web](https://webmiddleware.ifood.com.br/termos) — oficial, lido por resumo).

**Não confirmamos** se um folheto/QR físico dentro da sacola é vetado nem qual a penalidade. Até ler a cláusula vigente:

- **Não** usar telefone/endereço do cliente que veio do marketplace para mandar mensagem.
- **Não** colocar "peça direto no WhatsApp" na descrição ou nos itens do cardápio do marketplace.
- Preferir migração por **canais que são do restaurante**: Perfil do Google, Instagram, salão/balcão, sacola de pedidos próprios, comunidade do bairro.
- Se usar algo na embalagem, que seja **valor (cartão fidelidade do clube do bairro, conteúdo)**, com decisão consciente do dono sobre o risco — e registrar isso no contrato.

> **Pendência:** ler a cláusula vigente do iFood, 99Food, Keeta e Rappi e registrar aqui. Até lá, o kit trata "insert na embalagem do marketplace" como risco, não como tática recomendada.

### 3.2 WhatsApp oficial × não oficial

- Desde 01/07/2025 a API oficial cobra por mensagem de template entregue. Brasil: **marketing ≈ US$ 0,0625 (≈ R$ 0,32)**, **utilidade ≈ US$ 0,0068**, **atendimento dentro da janela de 24 h grátis** ([engagelab](https://www.engagelab.com/blog/whatsapp-business-api-pricing), [wiichat](https://wiichat.com.br/ferramentas/calculadora-de-precos-api-oficial-whatsapp) — fornecedores repassando tabela da Meta; não conferido em developers.facebook.com).
- Soluções não oficiais (Baileys, Evolution API, whatsapp-web.js) violam os termos; há relatos de banimento permanente sem recurso ([organizabot](https://blog.organizabot.com/2026/03/evolution-api.html), [socialhub](https://www.socialhub.pro/blog/baileys-wwebjs-venom-riscos-apis-whatsapp-nao-oficiais/) — concorrentes que vendem a oficial; números de "% banido" são anedóticos).

**Decisão do kit:** número principal do restaurante **nunca** em API não oficial. Para pequeno: WhatsApp Business app (grátis) + catálogo + link do cardápio próprio + respostas rápidas. Para volume: API oficial via provedor. Conta de campanha: 1.000 mensagens de marketing ≈ R$ 320 — a reativação precisa render mais que isso (o Painel mede).

### 3.3 Concorrência de software barato

| Produto | Faixa mensal | Fonte |
|---|---|---|
| Goomer | grátis até 30 pedidos; R$ 59,94–299,90 | [visio.ai](https://visio.ai/pt/r/goomer-vs-anota-ai-cardapio-digital-delivery-2026) |
| MenuDino | < R$ 100 | [Consumer](https://blog.consumer.com.br/menudino-plataforma-para-delivery-online-sem-taxas/) |
| Neemo | R$ 129–289 | [Saipos](https://saipos.com/neemo) |
| Cardápio Web | R$ 169,99–269,99 | [reidodelivery](https://reidodelivery.com.br/blog/cardapio-web-vale-a-pena) |
| Anota AI | R$ 219,99–389,99 (fontes divergem) | [reidodelivery](https://reidodelivery.com.br/blog/anota-ai-vale-a-pena) |
| Saipos | a partir de R$ 240,79 | [Saipos](https://saipos.com/planos-e-precos) |
| OlaClick | tem plano grátis | [OlaClick](https://olaclick.com/ponto-de-venda/sistema-delivery-sem-comissao/) |

Todos 2026, preços de site/blog (fornecedor). **Isso não mata o implantador — define o papel dele.** O restaurante não falha por falta de software; falha porque ninguém configura direito, ninguém divulga o canal, ninguém roda campanha de reativação e ninguém mede. O kit, portanto:

- **Não reconstrói** cardápio/pedido quando um SaaS desses resolve — recomenda e configura (caminho "SaaS pronto" das receitas).
- Constrói só o que falta neles: **o diagnóstico, a camada de comunidade local, o Painel de recuperação e a operação mensal.**

### 3.4 Atribuição (a fraqueza da cobrança por resultado)

Faturamento de restaurante oscila com clima, feriado, promoção do marketplace e concorrente novo. Se a remuneração depende de "dinheiro recuperado", o implantador precisa de:

1. Base "antes" registrada **no dia do diagnóstico** (o JSON do Raio-X salvo).
2. Métrica que isole o efeito: taxa de cartão (fácil, contratual), pedidos no canal próprio de clientes identificados (médio), retorno por coorte (médio), desperdício pesado (difícil).
3. Contrato com **mensalidade fixa + bônus opcional** atrelado só a métricas fáceis de atribuir. Nunca 100% variável.

### 3.5 Advogado do diabo — quando a tese falha

- **Restaurante sem demanda.** Se ninguém compra, não há vazamento para recuperar — há problema de produto/localização. O Caçador de Margem filtra isso (nota alta + muitas avaliações).
- **Dono sem números.** Sem extrato, sem relatório de vendas, o Raio-X vira chute. Saída: diagnóstico em 2 encontros — no 1º levanta o que dá e lista "dados a levantar"; no 2º fecha. O app mostra "sem dados" de propósito.
- **Marketplace é o único canal real.** Restaurante de cozinha fantasma, sem salão, sem Instagram, sem marca: migrar cliente é muito difícil. Focar em pagamentos, cardápio e ticket.
- **Dono não executa.** Canal próprio exige alguém respondendo, postando o prato do dia, embalando com cuidado. O implantador vende a operação mensal ou o projeto morre em 60 dias.
- **Preço menor no canal próprio** pode esbarrar em regras de paridade do marketplace (não confirmado). Alternativa segura: mesmo preço + benefício (pontos, brinde, frete) só no canal próprio.

---

## 4. O que a IA faz de verdade aqui

| Tarefa | IA ajuda? | Como |
|---|---|---|
| Achar leads | Sim | Agente lê perfil do Google, Instagram e presença em marketplace e pontua (Caçador). Coleta respeitando termos de cada site; API do Google só com autorização. |
| Diagnóstico | Pouco | É conta e conversa. IA ajuda a ler extrato em PDF e montar a planilha. |
| Atender WhatsApp | Sim | Responder dúvida repetida, mandar cardápio, montar pedido. Humano fecha casos fora do padrão. |
| Cardápio vivo | Sim | Foto do prato do dia → texto, post e status em um passo. |
| Reativação | Sim | Segmentar (novo, recorrente, inativo, VIP) e escrever a mensagem certa para cada um. |
| Previsão de demanda/compras | Médio | Só com histórico de vendas de alguns meses. |
| Medição | Não precisa | Planilha e regra clara resolvem; IA só redige o relatório mensal. |

Conclusão: **IA é a ferramenta da correção e da prospecção, não o produto.** O documento de origem já dizia isso; os dados confirmam.

---

## 5. Onde o implantador ganha dinheiro

| Etapa | Cobrança | Faixa sugerida (premissa a testar) |
|---|---|---|
| Raio-X | Fixo ou grátis como porta de entrada | R$ 0–500 (grátis se virar projeto) |
| Implantação | Fixo por módulo | R$ 1.500–6.000 conforme módulos |
| Operação mensal | Recorrente | R$ 400–1.500/mês (campanhas, cardápio vivo, comunidade, relatório) |
| Bônus | Opcional, só métricas atribuíveis | 10–20% da economia comprovada em taxas, por 6–12 meses |

**Regra de bolso:** o custo total para o cliente não deve passar de **1/3 do que o Raio-X mostrou de recuperável.** Se o recuperável é R$ 4.900/mês, cobrar até ~R$ 1.600/mês somando tudo.

Detalhe e roteiros em [`../kit-comercial/`](../kit-comercial/).

---

## 6. Para outros mercados (EN e ES)

A tese é universal (intermediário + comissão + recorrência), mas os números e as plataformas não. **Versão em espanhol = mercado latino-americano** (Rappi, PedidosYa, DiDi Food, Uber Eats; Mercado Pago, transferências instantâneas locais; WhatsApp tão central quanto no Brasil). **Versão em inglês = modelo global** (Uber Eats, DoorDash, Deliveroo, Just Eat; cartão e carteiras digitais; SMS/e-mail/app mais que WhatsApp em alguns países). Cada uma ganha **pacote de setor próprio** com referências locais pesquisadas — não tradução do pacote brasileiro. Ver [ARQUITETURA.md](ARQUITETURA.md#mercados).

---

## 7. Números ainda não confirmados

- Taxa de antecipação/repasse do iFood.
- Tabela real da Keeta.
- Ano do prazo de isenção da Rappi ("até 31 de julho").
- Tabela oficial da Meta para o Brasil (usado preço de fornecedores; datas de cobrança em BRL divergem).
- **Cláusula exata e penalidade do iFood sobre insert/QR na embalagem e preço diferente fora da plataforma.**
- Custo do Pix por aproximação e do Pix Automático para o lojista.
- Margem líquida média oficial da Abrasel.
- Recompra/retenção em delivery no Brasil; efeito de cashback/fidelidade em restaurante brasileiro.
- Impacto do Perfil do Google no Brasil; dados sobre QR na mesa, grupos de condomínio e Comunidades do WhatsApp.
- Desperdício (% do CMV) por fonte independente (Sebrae, WRAP, Abrasel).
