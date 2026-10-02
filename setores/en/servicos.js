/*
 * BASE pack: APPOINTMENT-BASED SERVICES — global model (EN / GLOBAL)
 * Inherits the formulas from setores/servicos.js. Default worked example: United States (USD).
 * Profiles: setores/en/clinica.js, setores/en/salao.js.
 * Research: docs/mercados/global-pesquisa-2026-10.md
 *
 * Marketplaces here charge mainly on NEW clients (Fresha, Booksy Boost 30% one-time,
 * Treatwell, Zocdoc per new patient): the leak is regulars rebooking through the app.
 * No-shows: global healthcare average 23% (systematic review); salons vary widely.
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('../_herdar.js');
  if (!(g.RXM_BASES && g.RXM_BASES.servicos) && typeof require !== 'undefined') require('../servicos.js');

  var bruto = herdar(g.RXM_BASES.servicos, {
    id: 'servicos-global',
    nome: 'Appointment-based services (generic)',
    versao: '0.1.0',
    mercado: 'GLOBAL',
    idioma: 'en',
    moeda: 'USD',
    termos: {
      cliente: 'client', clientes: 'clients', atendimento: 'appointment', atendimentos: 'appointments',
      profissional: 'professional', profissionais: 'professionals', plataforma: 'booking platform'
    },
    grupos: [
      { id: 'geral', titulo: 'Business basics' },
      { id: 'agenda', titulo: 'Schedule: no-shows and empty slots' },
      { id: 'clientes', titulo: '{Clientes} and sales' },
      { id: 'plataforma', titulo: '{Plataforma} and marketplaces' },
      { id: 'pagamentos', titulo: 'Payments and cash flow' },
      { id: 'operacao', titulo: 'Operations and marketing' }
    ],
    entradas: [
      { id: 'faturamento', rotulo: 'Total monthly revenue', exemplo: 45000 },
      { id: 'atendimentos_mes', rotulo: '{Atendimentos} delivered per month', exemplo: 500 },
      { id: 'ticket_medio', rotulo: 'Average value of an {atendimento}', exemplo: 90 },
      { id: 'margem_contrib_pct', rotulo: 'Contribution margin per {atendimento} (price − materials − {profissional} commission − fees)', exemplo: 50,
        ajuda: 'Commission paid to the {profissional} per service is a variable cost and comes out of margin; rent and fixed salaries do not.' },
      { id: 'falta_pct', rotulo: 'No-shows without notice (% of booked {atendimentos})', exemplo: 15 },
      { id: 'falta_meta_pct', rotulo: 'No-show target with automated reminders and deposits', exemplo: 7 },
      { id: 'horas_disponiveis_mes', rotulo: 'Bookable hours in the month (all {profissionais})', exemplo: 600 },
      { id: 'ocupacao_pct', rotulo: 'Schedule utilization (booked hours ÷ available)', exemplo: 65 },
      { id: 'ocupacao_meta_pct', rotulo: 'Utilization target (waitlist, off-peak offers, scheduled rebooking)', exemplo: 75 },
      { id: 'receita_hora', rotulo: 'Average revenue per hour served', exemplo: 75 },
      { id: 'clientes_novos_mes', rotulo: 'New {clientes} per month', exemplo: 70 },
      { id: 'retorno_atual_pct', rotulo: 'Of those, how many come back on time (today)', exemplo: 40 },
      { id: 'retorno_meta_pct', rotulo: 'Return target with scheduled reminders', exemplo: 55 },
      { id: 'atendimentos_mes_recorrente', rotulo: '{Atendimentos} per month from a returning {cliente}', exemplo: 1 },
      { id: 'pct_com_adicional_atual', rotulo: '{Atendimentos} with an add-on service or product (today)', exemplo: 10 },
      { id: 'pct_com_adicional_meta', rotulo: 'Target with an offer at booking or during the {atendimento}', exemplo: 18 },
      { id: 'valor_adicional', rotulo: 'Average add-on value', exemplo: 35 },
      { id: 'margem_adicional_pct', rotulo: 'Add-on margin', exemplo: 40 },
      { id: 'receita_plataforma', rotulo: 'Revenue from a {plataforma}/marketplace that charges per booking or per {cliente}', exemplo: 3000,
        ajuda: 'Only what pays a per-booking or new-{cliente} fee (e.g., Fresha marketplace, Booksy Boost, Zocdoc). A flat software subscription is not a per-{cliente} leak.' },
      { id: 'comissao_plataforma_pct', rotulo: 'Effective cost of that {plataforma} (% of the revenue it brought)', exemplo: 15 },
      { id: 'custo_proprio_pct', rotulo: 'Cost of your own booking (% of revenue)', exemplo: 3 },
      { id: 'recorrente_plataforma_pct', rotulo: 'Share of that revenue from {clientes} who had visited before', exemplo: 30 },
      { id: 'fat_cartao', rotulo: 'Card revenue in the month', exemplo: 40000 },
      { id: 'mdr_atual_pct', rotulo: 'Current blended card processing rate', exemplo: 3.0 },
      { id: 'mdr_referencia_pct', rotulo: 'Negotiable benchmark rate', exemplo: 2.6 },
      { id: 'valor_antecipado', rotulo: 'Cash advance drawn this month', exemplo: 0 },
      { id: 'custo_antecipacao_pct', rotulo: 'Cost of that advance (% of the amount)', exemplo: 0 },
      { id: 'juros_multas_mes', rotulo: 'Interest, late fees and penalties', exemplo: 0 },
      { id: 'horas_agenda_manual_semana', rotulo: 'Hours/week booking, confirming and rescheduling by phone/message', exemplo: 10 },
      { id: 'custo_hora', rotulo: 'Loaded hourly cost of whoever does it', exemplo: 20 },
      { id: 'gasto_anuncios_mes', rotulo: 'Ad spend', exemplo: 1000 },
      { id: 'anuncio_para_clientes_pct', rotulo: 'Share that reaches existing {clientes}', exemplo: 30 }
    ],
    vazamentos: [
      { id: 'faltas', nome: 'No-shows without notice',
        explicacao: 'A booked slot left empty: the {profissional} is there, the {atendimento} does not happen. Automated confirmations, a waitlist and deposits on high-demand slots (with a published, even-handed policy).',
        como_medir: { base: 'No-show % over the previous 4 weeks (from the schedule)', metrica: 'No-show % this month × {atendimentos} × average value', janela: 'monthly' },
        fonte: { texto: 'Healthcare: global average no-show 23% (systematic review, 2023). Salons: vendors report 3–30% — use your own schedule.', verificado: false } },
      { id: 'ociosidade', nome: 'Slots that were never booked',
        explicacao: 'Recurring gaps (Tuesday mornings, Monday late afternoons). Scheduled rebooking, a waitlist and off-peak offers fill them without discounting peak hours.',
        como_medir: { base: 'Utilization by day and time band over the previous 4 weeks', metrica: 'Same utilization afterwards', janela: 'monthly' },
        fonte: { texto: 'Measured on your own schedule. No-shows belong to the previous leak, not here.', verificado: false } },
      { id: 'retorno', nome: '{Clientes} who do not come back on time',
        explicacao: 'The next {atendimento} has a predictable interval. Without a reminder, the {cliente} forgets or goes elsewhere.',
        como_medir: { base: 'On-time return of the new-{cliente} cohort before reminders', metrica: 'Same rate for cohorts afterwards', janela: 'per monthly cohort' },
        fonte: { texto: 'Target return rate is the implementer\'s assumption; validate over 2 cohorts.', verificado: false } },
      { id: 'plataforma', nome: '{Plataforma} charging for {clientes} who are already yours',
        explicacao: 'When the {plataforma} charges per booking or per new {cliente}, regulars who rebook through the app can be counted again. If it only charges a subscription, this leak is zero.',
        como_medir: { base: 'Revenue and cost by channel over the previous 3 months', metrica: 'Direct rebookings from {clientes} who used to come through the {plataforma}', janela: 'monthly' },
        fonte: { texto: 'Fresha charges a one-time fee on brand-new marketplace clients; Booksy Boost 30% one-time; Treatwell 0% on repeat bookings (official pricing pages).', verificado: true } },
      { id: 'adicional', nome: 'Add-ons nobody offers',
        explicacao: 'A complementary service or product offered at the right moment, without pressure.',
        como_medir: { base: '% of {atendimentos} with an add-on over the previous 30 days', metrica: 'Current % × average value', janela: 'monthly' },
        fonte: { texto: 'From the business\'s own POS/system.', verificado: false } },
      { id: 'pagamentos', nome: 'Card processing above market',
        explicacao: 'A blended rate above what your volume can negotiate. Do not surcharge clients where it is banned (UK, EU, Australia).',
        como_medir: { base: 'Processor statements for the previous 3 months', metrica: 'New effective rate × monthly volume', janela: 'monthly' },
        fonte: { texto: 'Square US 2.6% + 15¢; Stripe UK 1.5% + 20p standard cards (official).', verificado: true } },
      { id: 'antecipacao', nome: 'Cash advances',
        explicacao: 'Taking advances out of habit is expensive credit.',
        como_medir: { base: 'Advance costs over the previous 3 months', metrica: 'Cost this month', janela: 'monthly' },
        fonte: { texto: 'Business\'s own statements.', verificado: true } },
      { id: 'caixa', nome: 'Interest and late fees from cash gaps',
        explicacao: 'Late bills and overdrafts are symptoms of cash flow with no forecast.',
        como_medir: { base: 'Charges over the previous 3 months', metrica: 'Charges this month', janela: 'monthly' },
        fonte: { texto: 'Bank statements.', verificado: true } },
      { id: 'mao_de_obra', nome: 'Front desk stuck booking and confirming by hand',
        explicacao: 'Online booking and automated confirmations free hours — real only if those hours are redeployed.',
        como_medir: { base: 'Hours in a typical week before', metrica: 'Hours in a typical week after', janela: 'monthly' },
        fonte: { texto: 'Measure with the business.', verificado: false } },
      { id: 'marketing', nome: 'Ads paying for existing {clientes}',
        explicacao: 'Without your own list you cannot exclude current {clientes} from ads or reach them for free.',
        como_medir: { base: 'Cost per new {cliente} attributed to ads before', metrica: 'Same cost with an exclusion list', janela: 'monthly' },
        fonte: { texto: 'Estimate to validate with a custom audience.', verificado: false } }
    ],
    receitas: {
      'agenda-cheia': { nome: 'Full schedule', doc: 'docs/en/modulos/servicos-agenda.md', resumo: 'Automated confirmations, waitlist, deposits, scheduled rebooking, memberships with recurring billing.' },
      'aquisicao': { nome: 'Win and keep {clientes}', doc: 'docs/en/modulos/aquisicao.md', resumo: 'Consented list, rebooking reminders, referrals.' },
      'cobranca': { nome: 'Payments and billing', doc: 'docs/en/modulos/cobranca.md', resumo: 'Processing rates, deposits, advances only when needed.' },
      'marketing-local': { nome: 'Local marketing and community', doc: 'docs/en/modulos/marketing-local.md', resumo: 'Partnerships with neighboring businesses, Google presence, local community.' }
    },
    remover: { cacador: { alertas: ['mei'] } },
    cacador: {
      sinais: [
        { id: 'nota', rotulo: 'Google rating' },
        { id: 'avaliacoes', rotulo: 'Number of Google reviews' },
        { id: 'marketplace', rotulo: 'On a {plataforma}/marketplace that charges per {cliente}' },
        { id: 'instagram_ativo', rotulo: 'Instagram post in the last 30 days' },
        { id: 'pedido_proprio', rotulo: 'Has its own online booking' },
        { id: 'whatsapp_manual', rotulo: 'Booking only by phone/message' },
        { id: 'fidelidade', rotulo: 'Has a membership, club or package plan' }
      ],
      criterios: [
        { id: 'nota', rotulo: 'Google rating ≥ 4.5' },
        { id: 'avaliacoes', rotulo: '100+ reviews (has demand)' },
        { id: 'whatsapp_manual', rotulo: 'Booking by hand (no-shows and empty slots)' },
        { id: 'sem_agenda_online', rotulo: 'No online booking' },
        { id: 'marketplace', rotulo: 'Pays {plataforma} per {cliente}' },
        { id: 'instagram', rotulo: 'Active Instagram' },
        { id: 'sem_plano', rotulo: 'No membership/package plan' }
      ],
      alertas: [
        { id: 'pouca_demanda', texto: 'Few reviews: demand may be lacking.' },
        { id: 'nota_baixa', texto: 'Rating below 4.0: the problem may be the service.' },
        { id: 'inativa', texto: 'Registry does not show the business as active.' }
      ],
      potencial: {
        formula: 'l.empleados ? [l.empleados[0] * 5000 * 0.02, l.empleados[1] * 10000 * 0.02] : null',
        aviso: 'Rough estimate from headcount (where the registry has it) and ≈ 2% of revenue in no-shows and returns (assumption). For ranking only.'
      },
      conferir: [{ rotulo: 'Online booking', busca: '{nome} {cidade} book online' }],
      textos: {
        demanda: 'I saw {nome} has a {nota} rating with {avaliacoes} reviews on Google — the {clientes} are there.',
        conheco_local: 'I know {nome}, in {local}.',
        conheco: 'I know {nome}.',
        sem_canal: 'I could not find a way to book online without calling or messaging — every booking, confirmation and reschedule goes through someone on your team.',
        com_canal: 'I saw you already take online bookings — the question is how much of the schedule still sits empty because of no-shows and {clientes} who do not come back on time.',
        sem_fidelidade: 'I did not see a membership or package either: a happy {cliente} has no reason to lock in the next slot.',
        convite: 'I run a 40-minute diagnosis that shows, in dollars per month, how much is leaking through no-shows, empty slots, {clientes} who do not return and card fees. No charge: if it does not show at least $1,000 a month, I will tell you it is not worth changing anything. What day works best?'
      },
      abordagem: 'From what I saw, the schedule depends on someone booking and confirming by hand — that is where no-shows and empty slots come from.'
    }
  }, { resolver: false });

  g.RXM_BASES = g.RXM_BASES || {};
  g.RXM_BASES['servicos-global'] = bruto;
  var pacote = herdar(bruto, { id: bruto.id });
  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
