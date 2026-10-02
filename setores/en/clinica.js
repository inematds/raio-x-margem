/*
 * Profile: CLINIC / PRACTICE (dental, medical, physio, therapy...) — global model (EN / GLOBAL)
 * Inherits from setores/en/servicos.js. No-shows are leak #1; insurance claim denials and
 * treatment plans that never start replace "add-ons". Reminders: under HIPAA (US) an
 * appointment reminder is treatment communication; under GDPR health data is a special
 * category — keep reminders minimal (do not name the procedure). Professional advertising
 * rules vary by country and profession: check the local regulator.
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('../_herdar.js');
  if (!(g.RXM_BASES && g.RXM_BASES['servicos-global']) && typeof require !== 'undefined') require('./servicos.js');
  var base = g.RXM_BASES['servicos-global'];

  var pacote = herdar(base, {
    id: 'clinica-global',
    nome: 'Clinic / practice',
    versao: '0.1.0',
    termos: { cliente: 'patient', clientes: 'patients', atendimento: 'appointment', atendimentos: 'appointments', plataforma: 'booking marketplace (e.g., Zocdoc)' },
    remover: { vazamentos: ['adicional'], entradas: ['pct_com_adicional_atual', 'pct_com_adicional_meta', 'valor_adicional', 'margem_adicional_pct'] },
    grupos: [{ id: 'convenio', titulo: 'Insurance and treatment plans' }],
    entradas: [
      { id: 'faturamento', exemplo: 80000 },
      { id: 'atendimentos_mes', exemplo: 450 },
      { id: 'ticket_medio', exemplo: 180 },
      { id: 'margem_contrib_pct', exemplo: 60 },
      { id: 'falta_pct', exemplo: 15, ajuda: 'Healthcare global average 23% (systematic review); a GP area in England reported under 4%. Measure on your schedule: no-shows ÷ booked appointments.' },
      { id: 'falta_meta_pct', exemplo: 8 },
      { id: 'receita_hora', exemplo: 150 },
      { id: 'clientes_novos_mes', exemplo: 50 },
      { id: 'retorno_atual_pct', exemplo: 45, rotulo: 'Of those, how many come back for their recall/check-up on time (today)' },
      { id: 'retorno_meta_pct', exemplo: 60 },
      { id: 'atendimentos_mes_recorrente', exemplo: 0.33, ajuda: 'Dental recall every 6 months ≈ 0.17; ongoing care (physio, therapy) can exceed 2.' },
      { id: 'receita_plataforma', exemplo: 4000, ajuda: 'Only marketplaces that charge per new patient (e.g., Zocdoc per-booking fee). A subscription-only scheduler is not a per-patient leak.' },
      { id: 'comissao_plataforma_pct', exemplo: 20 },
      { id: 'fat_cartao', exemplo: 40000 },
      { id: 'horas_agenda_manual_semana', exemplo: 15 },
      { id: 'gasto_anuncios_mes', exemplo: 1500 },
      { id: 'fat_convenio', grupo: 'convenio', rotulo: 'Billed to insurers this month', unidade: 'R$', exemplo: 35000 },
      { id: 'glosa_pct', grupo: 'convenio', rotulo: 'Claim denials (amount denied ÷ billed)', unidade: '%', exemplo: 8,
        ajuda: 'Measure by payer over the last 3 months.' },
      { id: 'glosa_ref_pct', grupo: 'convenio', rotulo: 'Acceptable denial rate with pre-submission checks', unidade: '%', exemplo: 3 },
      { id: 'orcamentos_mes', grupo: 'convenio', rotulo: 'Treatment plans/estimates presented per month', unidade: 'un', exemplo: 40 },
      { id: 'aprovacao_atual_pct', grupo: 'convenio', rotulo: 'Accepted today', unidade: '%', exemplo: 40 },
      { id: 'aprovacao_meta_pct', grupo: 'convenio', rotulo: 'Target with structured follow-up (explanation, payment options)', unidade: '%', exemplo: 50 },
      { id: 'valor_orcamento', grupo: 'convenio', rotulo: 'Average treatment plan value', unidade: 'R$', exemplo: 1500 }
    ],
    vazamentos: [
      { id: 'glosa', nome: 'Insurance claim denials',
        entradas: ['fat_convenio', 'glosa_pct', 'glosa_ref_pct'],
        formula: 'fat_convenio * Math.max(0, glosa_pct - glosa_ref_pct)/100',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 6,
        explicacao: 'Billed amounts the insurer denies over coding, authorization or paperwork errors. Pre-submission checks and an organized appeals routine recover part of it.',
        como_medir: { base: 'Denials by payer over the previous 3 months', metrica: 'Denials by payer this month', janela: 'monthly' },
        receitas: ['cobranca'],
        fonte: { texto: 'No reliable public benchmark gathered; measure with the practice\'s own data.', verificado: false } },
      { id: 'orcamentos', nome: 'Treatment plans that never start',
        entradas: ['orcamentos_mes', 'aprovacao_atual_pct', 'aprovacao_meta_pct', 'valor_orcamento', 'margem_contrib_pct'],
        formula: 'orcamentos_mes * Math.max(0, aprovacao_meta_pct - aprovacao_atual_pct)/100 * valor_orcamento * margem_contrib_pct/100',
        recuperavel_pct: 40, dificuldade: 3, prazo_semanas: 6,
        explicacao: 'A plan presented and never started: nobody follows up to answer questions or adjust payment. Follow-up is patient care, not advertising.',
        como_medir: { base: '% of plans accepted within 60 days, previous 3 months', metrica: 'Same rate after structured follow-up', janela: 'monthly' },
        receitas: ['agenda-cheia'],
        fonte: { texto: 'Acceptance rate comes from the practice management system.', verificado: false } }
    ],
    cacador: {
      sinais: [
        { id: 'marketplace', rotulo: 'On a per-patient booking marketplace (e.g., Zocdoc)' },
        { id: 'fidelidade', rotulo: 'Has a membership/care plan' }
      ],
      criterios: [
        { id: 'whatsapp_manual', peso: 25, rotulo: 'Booking by hand (no-shows, manual confirmations)' },
        { id: 'sem_agenda_online', peso: 10 },
        { id: 'marketplace', peso: 5, rotulo: 'On a booking marketplace' },
        { id: 'sem_plano', peso: 15, rotulo: 'No membership/care plan' }
      ],
      potencial: { formula: 'l.empleados ? [l.empleados[0] * 8000 * 0.03, l.empleados[1] * 15000 * 0.03] : null',
        aviso: 'Rough estimate from headcount and ≈ 3% of revenue in no-shows and returns (assumption). For ranking only.' },
      conferir: [{ rotulo: 'Zocdoc / booking', busca: '{nome} {cidade} zocdoc OR "book appointment"' }],
      textos: {
        convite: 'I run a 40-minute diagnosis that shows, in dollars per month, how much is leaking through no-shows, empty slots, patients who miss their recall, claim denials and card fees — no promotions or advertising involved. No charge: if it does not show at least $1,500 a month, I will tell you it is not worth changing anything. What day works best?'
      },
      abordagem: 'From what I saw, the schedule depends on someone booking and confirming by hand — that is where no-shows and empty slots come from, and in a practice they are usually the biggest leak.'
    }
  });

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
