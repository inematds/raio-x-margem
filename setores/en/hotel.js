/*
 * Sector pack: HOTEL / B&B / INN — global model (EN / GLOBAL)
 * Inherits the formulas from setores/hotel.js. Default worked example: United States (USD).
 * Research: docs/mercados/global-pesquisa-2026-10.md
 *
 * Rate parity: in the EEA the DMA bans Booking.com parity clauses of any kind
 * (since 14/11/2024) — your own site may be cheaper. In the US, UK and Australia
 * check the OTA contract before publishing a lower direct rate.
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('../_herdar.js');
  var base = (g.RXM_SETORES && g.RXM_SETORES.hotel) || require('../hotel.js');

  var pacote = herdar(base, {
    id: 'hotel-global',
    nome: 'Hotel / B&B / inn',
    versao: '0.1.0',
    mercado: 'GLOBAL',
    idioma: 'en',
    moeda: 'USD',
    grupos: [
      { id: 'geral', titulo: 'Property basics' },
      { id: 'canais', titulo: 'Online travel agencies (OTAs) and direct booking' },
      { id: 'temporada', titulo: 'Occupancy and low season' },
      { id: 'hospedes', titulo: 'Guests and extra revenue' },
      { id: 'pagamentos', titulo: 'Payments, cancellations and cash flow' },
      { id: 'operacao', titulo: 'Operations and marketing' }
    ],
    entradas: [
      { id: 'faturamento', rotulo: 'Total monthly revenue (rooms + extras)', exemplo: 150000 },
      { id: 'uhs', rotulo: 'Rooms/units', exemplo: 30 },
      { id: 'reservas_mes', rotulo: 'Bookings per month', exemplo: 300 },
      { id: 'valor_reserva', rotulo: 'Average booking value (whole stay)', exemplo: 480 },
      { id: 'margem_contrib_pct', rotulo: 'Room contribution margin (rate − variable costs: laundry, breakfast, amenities, average commission)', exemplo: 65,
        ajuda: 'Fixed costs (payroll, rent) stay out: an empty room saves no payroll.' },
      { id: 'receita_ota', rotulo: 'Revenue coming from OTAs (Booking.com, Expedia, Airbnb)', exemplo: 75000 },
      { id: 'comissao_ota_pct', rotulo: 'Effective OTA cost (commission + visibility programs + payment fees)', exemplo: 18,
        ajuda: 'Booking.com: rate depends on country and agreement, plus programs like Preferred; independent hotels typically pay 15–25%. Airbnb host-only fee 15.5% (mandatory for hotels). Use the monthly invoices.' },
      { id: 'custo_direto_pct', rotulo: 'Cost of a direct booking (booking engine + payment + brand search ads)', exemplo: 5 },
      { id: 'recorrente_ota_pct', rotulo: 'Share of OTA revenue from returning guests or guests who could book direct', exemplo: 15,
        ajuda: 'Match OTA guest names against your PMS history. Without history, 10–20% is an assumption to validate.' },
      { id: 'adicional_programa_pct', rotulo: 'Extra points paid for visibility programs (e.g., Preferred)', exemplo: 3 },
      { id: 'programa_sem_retorno_pct', rotulo: 'Share of that extra that does NOT come back as additional bookings', exemplo: 50,
        ajuda: 'Test: compare OTA bookings for 2 months with and without the program. Without a test, 50% is an assumption.' },
      { id: 'ocupacao_baixa_pct', rotulo: 'Average occupancy in low-season months', exemplo: 45 },
      { id: 'ocupacao_meta_baixa_pct', rotulo: 'Realistic low-season occupancy target (packages, events, drive market, corporate)', exemplo: 53 },
      { id: 'diaria_baixa', rotulo: 'Average daily rate in low season', exemplo: 140 },
      { id: 'retorno_atual_pct', rotulo: 'Guests who return within 12 months (today)', exemplo: 4 },
      { id: 'retorno_meta_pct', rotulo: 'Target return rate with your own guest list + offers', exemplo: 8 },
      { id: 'pct_com_extra_atual', rotulo: 'Bookings that buy an extra (dinner, late checkout, transfer, package, upgrade)', exemplo: 15 },
      { id: 'pct_com_extra_meta', rotulo: 'Target with a pre-arrival offer', exemplo: 25 },
      { id: 'valor_extra', rotulo: 'Average extra value', exemplo: 45 },
      { id: 'margem_extra_pct', rotulo: 'Margin on extras', exemplo: 50 },
      { id: 'fat_cartao', rotulo: 'Card revenue collected directly (outside the OTAs) this month', exemplo: 70000 },
      { id: 'mdr_atual_pct', rotulo: 'Current blended card processing rate', exemplo: 2.9 },
      { id: 'mdr_referencia_pct', rotulo: 'Negotiable benchmark rate', exemplo: 2.4 },
      { id: 'valor_antecipado', rotulo: 'Cash advance drawn this month', exemplo: 0 },
      { id: 'custo_antecipacao_pct', rotulo: 'Cost of that advance (% of the amount)', exemplo: 0 },
      { id: 'cancelamentos_mes', rotulo: 'Late cancellations or no-shows per month', exemplo: 8 },
      { id: 'nao_cobrado_pct', rotulo: 'Share of those not charged (no guarantee/deposit)', exemplo: 60 },
      { id: 'juros_multas_mes', rotulo: 'Interest, late fees and penalties from low-season cash gaps', exemplo: 0 },
      { id: 'horas_reserva_manual_semana', rotulo: 'Hours/week answering availability and booking requests by phone/email', exemplo: 20 },
      { id: 'custo_hora', rotulo: 'Loaded hourly labor cost', exemplo: 20 },
      { id: 'gasto_anuncios_mes', rotulo: 'Ad and metasearch spend (Google Hotel Ads, Meta)', exemplo: 3000 },
      { id: 'anuncio_para_clientes_pct', rotulo: 'Share that reaches past guests', exemplo: 30 }
    ],
    vazamentos: [
      { id: 'ota_recorrente', nome: 'OTA commission on guests who are already yours',
        explicacao: 'A returning guest — or one who found you on Google and then booked on the OTA — pays commission again. The gap to your direct-booking cost is the leak.',
        como_medir: { base: 'Revenue and commission by channel for the same 3 months last year (seasonality)', metrica: 'Direct bookings from identified guests × cost gap', janela: 'monthly, against the same month last year' },
        fonte: { texto: 'Booking.com: rate varies by country/agreement (official); independent hotels 15–25% (vendor); Airbnb 15.5% (official). See docs/mercados/global-pesquisa-2026-10.md.', verificado: true } },
      { id: 'programa_ota', nome: 'OTA visibility program that does not pay for itself',
        explicacao: 'Preferred-type programs charge extra points for visibility. If the additional bookings do not cover the extra, money leaks. Fix it with a test: 2 months with and without.',
        como_medir: { base: 'OTA bookings and commission with the program on', metrica: 'Same metrics during the test without it', janela: 'bi-monthly, seasonally adjusted' },
        fonte: { texto: 'Program return is an assumption to test.', verificado: false } },
      { id: 'baixa_temporada', nome: 'Empty rooms in low season',
        explicacao: 'Margin lost per low-season month: rooms that could sell with packages, events, the drive market or corporate business.',
        como_medir: { base: 'Low-season occupancy and ADR last year', metrica: 'Same months this year, with packages/actions logged', janela: 'monthly in low season' },
        fonte: { texto: 'Target is the implementer\'s assumption; measure with the property.', verificado: false } },
      { id: 'retorno', nome: 'Guests who never come back',
        explicacao: 'Each month of guests creates return stays over the year; at steady state the monthly gain equals this value. Build your own consented list at check-in — never use contact details the OTA passes on.',
        como_medir: { base: '12-month return rate in the PMS before your own list', metrica: 'Same rate for cohorts afterwards', janela: 'quarterly per cohort' },
        fonte: { texto: 'Direct guests return 5.1% × OTA 1.3% (Bookboost, 2.2 M European guests, vendor).', verificado: false } },
      { id: 'extras', nome: 'Extra revenue nobody offers',
        explicacao: 'Dinner, late checkout, transfers, tickets, upgrades: offered in a pre-arrival message, they sell without discounting.',
        como_medir: { base: '% of bookings with an extra over the previous 60 days', metrica: 'Current % × average extra value', janela: 'monthly' },
        fonte: { texto: 'Extras rate comes from the property\'s PMS/POS.', verificado: false } },
      { id: 'no_show', nome: 'Late cancellations and no-shows not charged',
        explicacao: 'A direct booking without a guarantee becomes a blocked, empty room. Clear policy + card guarantee or deposit.',
        como_medir: { base: 'Uncharged no-shows and late cancellations over the same 3 months', metrica: 'Same count with a guarantee policy', janela: 'monthly' },
        fonte: { texto: 'Property\'s own figures.', verificado: false } },
      { id: 'pagamentos', nome: 'Card processing above market',
        explicacao: 'A blended rate above what your volume can negotiate. Do not surcharge guests where it is banned (UK, EU, Australia).',
        como_medir: { base: 'Processor statements for the previous 3 months', metrica: 'New effective rate × monthly volume', janela: 'monthly' },
        fonte: { texto: 'Square US 2.6% + 15¢; Stripe UK 1.5% + 20p standard cards (official).', verificado: true } },
      { id: 'antecipacao', nome: 'Cash advances',
        explicacao: 'In low season the property draws advances to make payroll: expensive credit. A cash forecast and high-season deposits reduce the need.',
        como_medir: { base: 'Advance costs over the same 3 months', metrica: 'Cost this month', janela: 'monthly' },
        fonte: { texto: 'Property\'s own statements.', verificado: true } },
      { id: 'caixa', nome: 'Interest and late fees from cash gaps',
        explicacao: 'Strong seasonality without a forecast ends in overdraft in low season.',
        como_medir: { base: 'Charges over the same 3 months', metrica: 'Charges this month', janela: 'monthly' },
        fonte: { texto: 'Bank statements.', verificado: true } },
      { id: 'mao_de_obra', nome: 'Front desk stuck quoting by hand',
        explicacao: 'Answering "any rooms on the 12th? how much?" by hand. A booking engine and automated replies free hours — real only if those hours are redeployed.',
        como_medir: { base: 'Hours in a typical week before', metrica: 'Hours in a typical week after', janela: 'monthly' },
        fonte: { texto: 'Measure with the property.', verificado: false } },
      { id: 'marketing', nome: 'Ads paying for past guests',
        explicacao: 'Without your own list, ads pay again for people who already know the property. With a consented list you can exclude them and reach them for free.',
        como_medir: { base: 'Cost per ad-attributed booking before', metrica: 'Same cost with an exclusion list', janela: 'monthly' },
        fonte: { texto: 'Estimate to validate with a custom audience.', verificado: false } }
    ],
    receitas: {
      'reserva-direta': { nome: 'Direct booking within the rules', doc: 'docs/en/modulos/hotel-reserva-direta.md', resumo: 'Booking engine, closed rates and perks for direct guests, consented guest list, pre-arrival extras.' },
      'baixa-temporada': { nome: 'Low season', doc: 'docs/en/modulos/hotel-baixa-temporada.md', resumo: 'Packages, drive market, corporate and events; minimum stays at peaks; demand-based pricing.' },
      'aquisicao': { nome: 'Win and keep customers', doc: 'docs/en/modulos/aquisicao.md', resumo: 'OTAs bring them in, your own channel keeps them: consented list, follow-ups, referrals.' },
      'cobranca': { nome: 'Payments and billing', doc: 'docs/en/modulos/cobranca.md', resumo: 'Processing rates, booking guarantees, advances only when needed, low-season cash.' },
      'marketing-local': { nome: 'Local marketing and community', doc: 'docs/en/modulos/marketing-local.md', resumo: 'Partnerships with restaurants, attractions and local events.' }
    },
    remover: { cacador: { alertas: ['mei', 'motel'] } },
    cacador: {
      cnaes: [],
      sinais: [
        { id: 'nota', rotulo: 'Google rating' },
        { id: 'avaliacoes', rotulo: 'Number of Google reviews' },
        { id: 'marketplace', rotulo: 'Sells through OTAs (Booking.com, Expedia, Airbnb)' },
        { id: 'instagram_ativo', rotulo: 'Instagram post in the last 30 days' },
        { id: 'pedido_proprio', rotulo: 'Has a direct booking engine on its website' },
        { id: 'whatsapp_manual', rotulo: 'Direct bookings only by phone/email' },
        { id: 'fidelidade', rotulo: 'Has a returning-guest program/club' }
      ],
      criterios: [
        { id: 'nota', rotulo: 'Google rating ≥ 4.5' },
        { id: 'avaliacoes', rotulo: '300+ reviews (has demand)' },
        { id: 'marketplace', rotulo: 'Sells through OTAs' },
        { id: 'instagram', rotulo: 'Active Instagram' },
        { id: 'sem_motor', rotulo: 'No direct booking engine' },
        { id: 'whatsapp_manual', rotulo: 'Direct bookings by hand' },
        { id: 'sem_fidelidade', rotulo: 'No returning-guest program' }
      ],
      alertas: [
        { id: 'pequeno', texto: 'Fewer than 8 rooms: revenue may be too small to fund the project.' },
        { id: 'rede', texto: 'More than 200 rooms: probably a chain with central distribution — the decision is not on site.' },
        { id: 'pouca_demanda', texto: 'Few reviews: demand may be lacking.' },
        { id: 'nota_baixa', texto: 'Rating below 4.0: the problem may be product or service.' },
        { id: 'inativa', texto: 'Registry does not show the business as active.' }
      ],
      potencial: {
        formula: 'l.uhs ? [l.uhs * 30 * 0.45 * 100 * 0.55 * 0.18 * 0.15, l.uhs * 30 * 0.65 * 300 * 0.55 * 0.18 * 0.15] : null',
        aviso: 'Rough estimate from room count and an ADR range (assumption). For ranking only; the real number comes from the X-Ray.'
      },
      conferir: [
        { rotulo: 'Booking.com', busca: 'site:booking.com {nome} {cidade}' },
        { rotulo: 'Expedia / Airbnb', busca: '{nome} {cidade} expedia OR airbnb' }
      ],
      textos: {
        demanda: 'I saw {nome} has a {nota} rating with {avaliacoes} reviews on Google — the guests are there.',
        conheco_local: 'I know {nome}, in {local}.',
        conheco: 'I know {nome}.',
        sem_canal: 'I could not find a way to book directly on your website without going through an OTA or sending a message — people who already know you end up booking on the OTA.',
        com_canal: 'I saw you already take direct bookings on your website — the question is how much revenue still pays 15–25% to the OTAs, and how past guests come back.',
        sem_fidelidade: 'I did not see anything for returning guests either: a happy guest has no reason to book direct next time.',
        convite: 'I run a 40-minute diagnosis that shows, in dollars per month, how much is leaking through OTA commission on guests who are already yours, empty rooms in low season and card fees — within what your OTA contracts allow on pricing. No charge: if it does not show at least $2,000 a month, I will tell you it is not worth changing anything. What day works best?'
      },
      abordagem: 'From what I saw, the property sells well through the OTAs. The point is that returning guests — and people who already found you on Google — also pay commission, and that can be recovered with perks and closed rates, without breaking your contract.'
    }
  });

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
