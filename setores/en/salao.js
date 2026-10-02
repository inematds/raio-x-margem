/*
 * Profile: SALON / BARBERSHOP / BEAUTY — global model (EN / GLOBAL)
 * Inherits from setores/en/servicos.js. Rebooking within the cycle is leak #1.
 * Marketplace fees hit new clients (Fresha, Booksy Boost 30% one-time, Treatwell);
 * Treatwell lists 0% commission on repeat bookings.
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('../_herdar.js');
  if (!(g.RXM_BASES && g.RXM_BASES['servicos-global']) && typeof require !== 'undefined') require('./servicos.js');
  var base = g.RXM_BASES['servicos-global'];

  var pacote = herdar(base, {
    id: 'salao-global',
    nome: 'Salon / barbershop / beauty',
    versao: '0.1.0',
    termos: { plataforma: 'booking app (Fresha, Booksy, Vagaro, Treatwell)' },
    entradas: [
      { id: 'faturamento', exemplo: 55000 },
      { id: 'atendimentos_mes', exemplo: 900 },
      { id: 'ticket_medio', exemplo: 60 },
      { id: 'margem_contrib_pct', exemplo: 45, ajuda: 'Stylist commission (often 40–50%) and product used come out of margin.' },
      { id: 'falta_pct', exemplo: 12, ajuda: 'Vendors report anywhere from 3% to 30%: measure on your own schedule.' },
      { id: 'falta_meta_pct', exemplo: 6 },
      { id: 'horas_disponiveis_mes', exemplo: 1200 },
      { id: 'ocupacao_pct', exemplo: 60 },
      { id: 'ocupacao_meta_pct', exemplo: 70 },
      { id: 'receita_hora', exemplo: 50 },
      { id: 'clientes_novos_mes', exemplo: 120 },
      { id: 'retorno_atual_pct', exemplo: 40, rotulo: 'Of those, how many rebook within the cycle (barber 2–4 weeks; color/chemical 4–8)' },
      { id: 'retorno_meta_pct', exemplo: 55, rotulo: 'Target with a rebooking invitation (7–20 days after the visit)' },
      { id: 'atendimentos_mes_recorrente', exemplo: 1.5 },
      { id: 'pct_com_adicional_atual', exemplo: 8, rotulo: 'Visits with retail product or an add-on service (today)' },
      { id: 'pct_com_adicional_meta', exemplo: 15 },
      { id: 'valor_adicional', exemplo: 25 },
      { id: 'receita_plataforma', exemplo: 2500 },
      { id: 'comissao_plataforma_pct', exemplo: 15 },
      { id: 'fat_cartao', exemplo: 48000 },
      { id: 'horas_agenda_manual_semana', exemplo: 10 },
      { id: 'gasto_anuncios_mes', exemplo: 600 }
    ],
    vazamentos: [
      { id: 'retorno', recuperavel_pct: 50, dificuldade: 1, prazo_semanas: 3,
        fonte: { texto: 'No reliable public benchmark of how many clients never rebook: measure on the schedule.', verificado: false } }
    ],
    cacador: {
      sinais: [
        { id: 'marketplace', rotulo: 'On Fresha/Booksy/Treatwell marketplace' },
        { id: 'fidelidade', rotulo: 'Has a membership/package or loyalty' }
      ],
      criterios: [
        { id: 'whatsapp_manual', peso: 20 },
        { id: 'sem_agenda_online', peso: 10 },
        { id: 'marketplace', peso: 0, rotulo: 'On a booking app (informational)' },
        { id: 'sem_plano', peso: 25, rotulo: 'No membership/package' }
      ],
      potencial: { formula: 'l.empleados ? [l.empleados[0] * 4000 * 0.025, l.empleados[1] * 8000 * 0.025] : null',
        aviso: 'Rough estimate from headcount and ≈ 2.5% of revenue in rebooking and no-shows (assumption). For ranking only.' },
      conferir: [{ rotulo: 'Fresha / Booksy', busca: '{nome} {cidade} fresha OR booksy OR vagaro' }],
      abordagem: 'From what I saw, booking depends on someone doing it by hand and nobody invites clients back within their cycle — that is where a salon loses the most money.'
    }
  });

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
