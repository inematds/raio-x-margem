/*
 * Sector pack: RESTAURANT — global model (EN / GLOBAL)
 *
 * Inherits the FORMULAS from setores/restaurante.js; text, examples and market
 * references change. Default worked example: United States (USD).
 * Research with sources: docs/mercados/global-pesquisa-2026-10.md
 *
 * Key differences from Brazil:
 *  - delivery apps charge by plan (DoorDash 15/25/30%, Uber Eats 20/25/30%), and the
 *    median US restaurant makes 2.8–4.0% before taxes: an app order is often a loss
 *  - card processing is a smaller leak (UK/EU ~1.5% + fixed fee under the IFR caps;
 *    US 2.6–2.9% + fixed); surcharging the customer is banned in the UK, EU and Australia
 *  - customer reactivation runs on SMS/email more than WhatsApp — follow consent rules
 *    (TCPA in the US, PECR "soft opt-in" in the UK, GDPR/ePrivacy in the EU)
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('../_herdar.js');
  var base = (g.RXM_SETORES && g.RXM_SETORES.restaurante) || require('../restaurante.js');

  var pacote = herdar(base, {
    id: 'restaurante-global',
    nome: 'Restaurant (delivery + dine-in)',
    versao: '0.1.0',
    mercado: 'GLOBAL',
    idioma: 'en',
    moeda: 'USD',
    grupos: [
      { id: 'geral', titulo: 'Business basics' },
      { id: 'delivery', titulo: 'Delivery apps' },
      { id: 'pagamentos', titulo: 'Payments and cash flow' },
      { id: 'clientes', titulo: 'Customers and sales' },
      { id: 'cozinha', titulo: 'Kitchen, purchasing and menu' },
      { id: 'operacao', titulo: 'Operations and marketing' }
    ],
    entradas: [
      { id: 'faturamento', rotulo: 'Total monthly revenue', exemplo: 120000, ajuda: null },
      { id: 'pedidos_mes', rotulo: 'Orders/checks per month (dine-in + delivery)', exemplo: 3500 },
      { id: 'ticket_medio', rotulo: 'Average check', exemplo: 32 },
      { id: 'margem_contrib_pct', rotulo: 'Average contribution margin (price − food cost − packaging)', exemplo: 65,
        ajuda: 'If unknown, 60–70% is common for prepared food; confirm with actual food cost.' },
      { id: 'fat_marketplace', rotulo: 'Sales through delivery apps (Uber Eats, DoorDash, Grubhub, Deliveroo, Just Eat)', exemplo: 40000 },
      { id: 'taxa_marketplace_pct', rotulo: 'Effective cost of the apps (commission + processing + promotions you fund + ads ÷ app sales)', exemplo: 30,
        ajuda: 'Work it out from the payout statement: (sold − paid out) ÷ sold. US list prices: DoorDash 15/25/30% by plan, Uber Eats 20/25/30%; NYC still caps delivery commission at 15% (+ optional "enhanced services").' },
      { id: 'custo_canal_proprio_pct', rotulo: 'Cost of your own ordering channel per order (processing + software + delivery)', exemplo: 9,
        ajuda: 'Direct-ordering tools run on a flat fee (e.g., ChowNow $229–449/mo) or flat fee + per-order %; add card processing and delivery. Be conservative.' },
      { id: 'recompra_marketplace_pct', rotulo: 'Share of app sales that comes from customers who ordered BEFORE', exemplo: 30,
        ajuda: 'If the app dashboard does not show it, 30–50% is an assumption to validate.' },
      { id: 'fat_cartao', rotulo: 'Card sales in the month (terminal/online)', exemplo: 90000 },
      { id: 'mdr_atual_pct', rotulo: 'Current blended card processing rate', exemplo: 3.2 },
      { id: 'mdr_referencia_pct', rotulo: 'Negotiable benchmark rate for this volume', exemplo: 2.7,
        ajuda: 'Square US lists 2.6% + 15¢ in person; UK/EU standard consumer cards ~1.5% + a fixed fee. Ask 2–3 processors for a quote with statements in hand.' },
      { id: 'valor_antecipado', rotulo: 'Merchant cash advance / early payout drawn in the month', exemplo: 0 },
      { id: 'custo_antecipacao_pct', rotulo: 'Cost of that advance (% of the amount)', exemplo: 0 },
      { id: 'chargeback_mes', rotulo: 'Losses from chargebacks, refunds and reconciliation gaps', exemplo: 0 },
      { id: 'juros_multas_mes', rotulo: 'Overdraft interest, late fees and penalties', exemplo: 0 },
      { id: 'clientes_novos_mes', rotulo: 'New customers per month (all channels)', exemplo: 450 },
      { id: 'retorno_atual_pct', rotulo: 'Of those, how many come back within 60 days today', exemplo: 20 },
      { id: 'retorno_meta_pct', rotulo: 'Target return rate with CRM + win-back', exemplo: 35 },
      { id: 'pedidos_mes_recorrente', rotulo: 'Orders per month from a repeat customer', exemplo: 2 },
      { id: 'pct_com_adicional_atual', rotulo: 'Orders that include a drink/dessert/add-on today', exemplo: 25 },
      { id: 'pct_com_adicional_meta', rotulo: 'Target with automatic offers (combos, upsell)', exemplo: 40 },
      { id: 'valor_adicional', rotulo: 'Average add-on value', exemplo: 5 },
      { id: 'cmv_mes', rotulo: 'Food cost for the month', exemplo: 36000 },
      { id: 'desperdicio_pct', rotulo: 'Estimated waste (% of food cost)', exemplo: 8 },
      { id: 'desperdicio_ref_pct', rotulo: 'Acceptable waste benchmark', exemplo: 4 },
      { id: 'compras_mes', rotulo: 'Supplier purchases in the month', exemplo: 36000 },
      { id: 'sobrepreco_compras_pct', rotulo: 'Avoidable overpayment on purchases (no quotes, emergency buys)', exemplo: 3 },
      { id: 'vendas_baixa_margem_pct', rotulo: 'Share of sales in items with below-average margin', exemplo: 30 },
      { id: 'gap_margem_pp', rotulo: 'How many margin points those items sit below average', exemplo: 15 },
      { id: 'realocavel_pct', rotulo: 'Share of those sales that can move to better items (feature, combo, price)', exemplo: 20 },
      { id: 'horas_repetitivas_semana', rotulo: 'Staff hours/week on phone orders, messages, payment checks', exemplo: 30 },
      { id: 'custo_hora', rotulo: 'Loaded hourly labor cost', exemplo: 22 },
      { id: 'gasto_anuncios_mes', rotulo: 'Ad spend (Meta, Google, in-app ads)', exemplo: 3000 },
      { id: 'anuncio_para_clientes_pct', rotulo: 'Share of that spend that reaches existing customers', exemplo: 40,
        ajuda: 'Without your own customer list, ads pay again for people who already know you.' }
    ],
    vazamentos: [
      { id: 'marketplace', nome: 'Delivery apps charging again for customers who are already yours',
        explicacao: 'Every repeat order placed through an app pays the commission again. The gap between that cost and your own channel, on those orders, is the leak.',
        como_medir: { base: 'App sales and effective cost over the previous 3 months', metrica: 'Own-channel orders from customers who used to come through the app × cost gap', janela: 'monthly, same period last year, net of app promotions' },
        receitas: ['cardapio-vivo', 'aquisicao', 'marketing-local', 'canal-proprio'],
        fonte: { texto: 'DoorDash 15/25/30% (official pricing page); Uber Eats US Lite raised to 20% (Restaurant Dive, 03/2026). See docs/mercados/global-pesquisa-2026-10.md.', verificado: true } },
      { id: 'pagamentos', nome: 'Card processing above market',
        explicacao: 'A blended rate higher than your volume can negotiate. In the UK/EU the interchange caps keep standard consumer cards cheap; in the US, interchange-plus pricing usually beats a flat rate at scale.',
        como_medir: { base: 'Processor statements for the previous 3 months (effective rate)', metrica: 'New effective rate × monthly volume', janela: 'monthly' },
        fonte: { texto: 'Square US 2.6% + 15¢ in person; Stripe UK 1.5% + 20p standard UK cards (official pricing pages).', verificado: true } },
      { id: 'antecipacao', nome: 'Cash advances and reconciliation losses',
        explicacao: 'Merchant cash advances taken out of habit are expensive credit. Chargebacks and payouts nobody checks are a silent loss.',
        como_medir: { base: 'Advance costs and reconciliation gaps over the previous 3 months', metrica: 'Same items this month', janela: 'monthly' },
        fonte: { texto: 'Figures from the client\'s own statements.', verificado: true } },
      { id: 'caixa', nome: 'Interest and late fees from poor cash planning',
        explicacao: 'Late bills and overdrafts are symptoms of cash flow with no forecast.',
        como_medir: { base: 'Charges paid over the previous 3 months', metrica: 'Charges paid this month', janela: 'monthly' },
        fonte: { texto: 'Figures from the bank statement.', verificado: true } },
      { id: 'retencao', nome: 'Customers who buy once and never come back',
        explicacao: 'Margin that never arrives because nobody talks to the customer after the first visit. Calculated on margin, not revenue.',
        como_medir: { base: '60-day return rate of the new-customer cohort before CRM', metrica: 'Same rate for cohorts after CRM', janela: 'per monthly cohort' },
        fonte: { texto: 'Target return rate is the implementer\'s assumption; validate after 2 cohorts.', verificado: false } },
      { id: 'ticket', nome: 'Low average check (nobody offers the add-on)',
        explicacao: 'Drinks, desserts and combos offered at the right moment (own menu, automated replies) raise margin per order.',
        como_medir: { base: '% of orders with an add-on over the previous 30 days', metrica: 'Current % × average add-on value', janela: 'monthly' },
        fonte: { texto: 'Add-on rate comes from the POS sales report.', verificado: false } },
      { id: 'desperdicio', nome: 'Waste and inventory',
        explicacao: 'Over-ordering, expiring stock, inconsistent portions. Needs weighing and recipe costing — the most work.',
        como_medir: { base: 'Waste log for 2 weeks before', metrica: 'Logged waste ÷ food cost', janela: 'fortnightly' },
        fonte: { texto: 'Waste benchmark to confirm with the client.', verificado: false } },
      { id: 'compras', nome: 'Buying without quotes and sticking with suppliers out of habit',
        explicacao: 'Prices creeping up unnoticed, emergency purchases, no comparison.',
        como_medir: { base: 'Prices paid for the top 20 items over the previous 3 months', metrica: 'Current prices for the same items', janela: 'monthly' },
        fonte: { texto: 'Overpayment is an assumption; confirm with one round of quotes.', verificado: false } },
      { id: 'cardapio', nome: 'Menu selling more of what earns less',
        explicacao: 'Menu engineering: feature and bundle high-margin items, reprice the ones that sell a lot and earn little.',
        como_medir: { base: 'Sales mix and item margin last month', metrica: 'Weighted average margin of the current mix', janela: 'monthly' },
        fonte: { texto: 'Requires recipe costing (cost per item).', verificado: false } },
      { id: 'mao_de_obra', nome: 'Staff stuck on repetitive tasks',
        explicacao: 'Answering the same questions, taking phone orders, checking payments. Automation frees hours — the gain is real only if those hours are redeployed or no longer paid.',
        como_medir: { base: 'Hours measured in a typical week before', metrica: 'Hours measured in a typical week after', janela: 'monthly' },
        fonte: { texto: 'Measure with the client; do not estimate.', verificado: false } },
      { id: 'marketing', nome: 'Ads paying again for existing customers',
        explicacao: 'Without your own list you cannot exclude current customers from ads or reach them for free.',
        como_medir: { base: 'Cost per ad-attributed order before', metrica: 'Same cost with an exclusion list and own channel', janela: 'monthly' },
        fonte: { texto: 'Share reaching existing customers is an estimate; validate with a custom audience.', verificado: false } }
    ],
    receitas: {
      'cardapio-vivo': { nome: 'Living menu', doc: 'docs/en/modulos/cardapio-vivo.md', resumo: 'Your own menu that changes every day and spreads itself (Google, Instagram, SMS/email).' },
      'aquisicao': { nome: 'Win and keep customers', doc: 'docs/en/modulos/aquisicao.md', resumo: 'Apps bring them in, your own channel keeps them: consented contact capture, CRM, win-back, referrals.' },
      'cobranca': { nome: 'Payments and billing', doc: 'docs/en/modulos/cobranca.md', resumo: 'Renegotiate processing, local instant payments, reconciliation, advances only when needed.' },
      'marketing-local': { nome: 'Local marketing and community', doc: 'docs/en/modulos/marketing-local.md', resumo: 'The restaurant as the neighborhood meeting point: channel, partnerships, events, referrals.' },
      'canal-proprio': { nome: '100% own channel', doc: 'docs/en/modulos/canal-proprio.md', resumo: 'Leave the apps in stages, with open-source pieces, when the local brand can carry it.' }
    },
    remover: { cacador: { alertas: ['mei', 'so_delivery'] } },
    cacador: {
      cnaes: [],
      sinais: [
        { id: 'nota', rotulo: 'Google rating' },
        { id: 'avaliacoes', rotulo: 'Number of Google reviews' },
        { id: 'marketplace', rotulo: 'Listed on delivery apps' },
        { id: 'instagram_ativo', rotulo: 'Instagram post in the last 30 days' },
        { id: 'pedido_proprio', rotulo: 'Has its own online ordering' },
        { id: 'whatsapp_manual', rotulo: 'Phone/message orders handled by hand' },
        { id: 'fidelidade', rotulo: 'Visible loyalty/club/rewards program' }
      ],
      criterios: [
        { id: 'nota', rotulo: 'Google rating ≥ 4.5' },
        { id: 'avaliacoes', rotulo: '500+ reviews (has demand)' },
        { id: 'marketplace', rotulo: 'Active on delivery apps' },
        { id: 'instagram', rotulo: 'Active Instagram' },
        { id: 'sem_pedido_proprio', rotulo: 'No own ordering' },
        { id: 'whatsapp_manual', rotulo: 'Orders handled by hand' },
        { id: 'sem_fidelidade', rotulo: 'No visible loyalty/CRM' }
      ],
      alertas: [
        { id: 'pouca_demanda', texto: 'Few reviews: demand may be the problem, not the channel.' },
        { id: 'nota_baixa', texto: 'Rating below 4.0: the problem may be product or service.' },
        { id: 'inativa', texto: 'Registry does not show the business as active.' }
      ],
      potencial: {
        formula: 'l.empleados ? [l.empleados[0] * 6000 * 0.012, l.empleados[1] * 12000 * 0.012] : null',
        aviso: 'Rough estimate from headcount (where the registry has it) and sector averages (assumption). For ranking only; the real number comes from the X-Ray.'
      },
      conferir: [
        { rotulo: 'DoorDash / Uber Eats', busca: '{nome} {cidade} doordash OR "uber eats" OR grubhub' },
        { rotulo: 'Deliveroo / Just Eat', busca: '{nome} {cidade} deliveroo OR "just eat"' }
      ],
      textos: {
        demanda: 'I saw {nome} has a {nota} rating with {avaliacoes} reviews on Google — the demand is there.',
        conheco_local: 'I know {nome}, in {local}.',
        conheco: 'I know {nome}.',
        sem_canal: 'I could not find a way to order directly without going through an app — every returning customer could be coming back through a channel you own.',
        com_canal: 'I saw you already have your own online ordering — the question is how much of your sales still pays 15–30% to the apps.',
        sem_fidelidade: 'I did not see a loyalty program either: a customer who buys once has no reason to come back.',
        convite: 'I run a 40-minute diagnosis that shows, in dollars per month, how much is leaking through app commissions, card fees and customers who never return. No charge: if it does not show at least $1,500 a month, I will tell you it is not worth changing anything. What day works best?'
      },
      abordagem: 'Your restaurant clearly has demand. The problem is not getting customers — it is that every time a regular reorders through the app, you pay commission again for someone who already knows your brand.'
    }
  });

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
