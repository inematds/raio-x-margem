/*
 * Perfil: SALÓN DE BELLEZA / BARBERÍA / ESTÉTICA — América Latina hispana (ES / LATAM)
 * Hereda de setores/es/servicos.js. Regreso dentro del ciclo = fuga n.º 1.
 * Plataformas (AgendaPro, Booksy, Fresha) cobran sobre todo suscripción;
 * la tarifa de Fresha por cliente nuevo en LATAM no está confirmada.
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('../_herdar.js');
  if (!(g.RXM_BASES && g.RXM_BASES['servicos-latam']) && typeof require !== 'undefined') require('./servicos.js');
  var base = g.RXM_BASES['servicos-latam'];

  var pacote = herdar(base, {
    id: 'salao-latam',
    nome: 'Salón / barbería / estética',
    versao: '0.1.0',
    termos: { plataforma: 'app de reservas (AgendaPro, Booksy, Fresha)' },
    entradas: [
      { id: 'faturamento', exemplo: 260000 },
      { id: 'atendimentos_mes', exemplo: 900 },
      { id: 'ticket_medio', exemplo: 300 },
      { id: 'margem_contrib_pct', exemplo: 45, ajuda: 'La comisión del profesional (a menudo 40–50%) y el producto usado salen del margen.' },
      { id: 'falta_pct', exemplo: 12, ajuda: 'Referencia de EE. UU.: barberías ~14%, salones ~17% (proveedor). Mida en su agenda.' },
      { id: 'falta_meta_pct', exemplo: 6 },
      { id: 'horas_disponiveis_mes', exemplo: 1200 },
      { id: 'ocupacao_pct', exemplo: 60 },
      { id: 'ocupacao_meta_pct', exemplo: 70 },
      { id: 'receita_hora', exemplo: 220 },
      { id: 'clientes_novos_mes', exemplo: 120 },
      { id: 'retorno_atual_pct', exemplo: 40, rotulo: 'De ellos, cuántos vuelven dentro del ciclo (barbería 2–4 semanas; color/química 4–8)' },
      { id: 'retorno_meta_pct', exemplo: 55, rotulo: 'Meta con invitación a volver (7–20 días después del servicio)' },
      { id: 'atendimentos_mes_recorrente', exemplo: 1.5 },
      { id: 'pct_com_adicional_atual', exemplo: 8, rotulo: 'Servicios con producto para casa o servicio complementario (hoy)' },
      { id: 'pct_com_adicional_meta', exemplo: 15 },
      { id: 'valor_adicional', exemplo: 250 },
      { id: 'fat_cartao', exemplo: 150000 },
      { id: 'horas_agenda_manual_semana', exemplo: 10 },
      { id: 'gasto_anuncios_mes', exemplo: 2500 }
    ],
    vazamentos: [
      { id: 'retorno', recuperavel_pct: 50, dificuldade: 1, prazo_semanas: 3,
        fonte: { texto: 'Ventana de invitación 7–20 días (proveedor, Brasil). Sin dato latinoamericano de cuántos no vuelven: medir en la agenda.', verificado: false } },
      { id: 'faltas', fonte: { texto: 'Inasistencias 14% barbería / 17% salón son datos de EE. UU. (proveedor). Medir en la agenda.', verificado: false } }
    ],
    cacador: {
      sinais: [
        { id: 'marketplace', rotulo: 'Está en AgendaPro/Booksy/Fresha (agenda digital)' },
        { id: 'fidelidade', rotulo: 'Tiene club/suscripción o lealtad' }
      ],
      criterios: [
        { id: 'whatsapp_manual', peso: 20 },
        { id: 'sem_agenda_online', peso: 10 },
        { id: 'marketplace', peso: 0, rotulo: 'Está en app de reservas (informativo)' },
        { id: 'sem_plano', peso: 25, rotulo: 'Sin club/suscripción' }
      ],
      potencial: { formula: 'l.empleados ? [l.empleados[0] * 20000 * 0.025, l.empleados[1] * 40000 * 0.025] : null',
        aviso: 'Estimación gruesa por personal ocupado y ≈ 2,5% de la facturación en regreso e inasistencias (supuesto). Solo ordena.' },
      conferir: [{ rotulo: 'AgendaPro / Booksy', busca: '{nome} {cidade} agendapro OR booksy OR fresha' }],
      abordagem: 'Por lo que vi, la agenda depende de alguien que agenda a mano y nadie invita al cliente a volver dentro del ciclo: ahí es donde el salón pierde más dinero.'
    }
  });

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
