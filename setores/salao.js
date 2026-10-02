/*
 * Perfil: SALÃO DE BELEZA / BARBEARIA / ESTÉTICA (não médica).
 * Herda de setores/servicos.js. Análise em docs/setores/servicos.md.
 *
 * Diferenças da base:
 *  - retorno no ciclo (2–4 semanas na barbearia) é o vazamento nº 1
 *  - comissão do profissional (40–50%) derruba a margem de contribuição
 *  - plano/clube de assinatura (Pix Automático ou cartão) pesa mais no Caçador
 *  - Booksy/Trinks/AppBarber cobram mensalidade no Brasil (Booksy isentou o Boost
 *    aqui): vazamento "plataforma" zerado no exemplo
 *  - adicional = produto para casa (home care) e serviço complementar
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('./_herdar.js');
  if (!(g.RXM_BASES && g.RXM_BASES.servicos) && typeof require !== 'undefined') require('./servicos.js');
  var base = g.RXM_BASES.servicos;

  var pacote = herdar(base, {
    id: 'salao',
    nome: 'Salão / barbearia / estética',
    versao: '0.1.0',
    termos: { plataforma: 'app de agendamento (Booksy, Trinks, AppBarber)' },
    entradas: [
      { id: 'faturamento', exemplo: 70000 },
      { id: 'atendimentos_mes', exemplo: 900 },
      { id: 'ticket_medio', exemplo: 80 },
      { id: 'margem_contrib_pct', exemplo: 45, ajuda: 'Comissão do profissional (muitas vezes 40–50%) e produto usado saem da margem.' },
      { id: 'falta_pct', exemplo: 12, ajuda: 'Referência dos EUA: barbearias ~14%, salões ~17% (fornecedor). Meça na sua agenda.' },
      { id: 'falta_meta_pct', exemplo: 6 },
      { id: 'horas_disponiveis_mes', exemplo: 1200 },
      { id: 'ocupacao_pct', exemplo: 60 },
      { id: 'ocupacao_meta_pct', exemplo: 70 },
      { id: 'receita_hora', exemplo: 60 },
      { id: 'clientes_novos_mes', exemplo: 120 },
      { id: 'retorno_atual_pct', exemplo: 40, rotulo: 'Desses, quantos voltam dentro do ciclo (barbearia 2–4 semanas; cor/química 4–8)' },
      { id: 'retorno_meta_pct', exemplo: 55, rotulo: 'Meta com convite de retorno (7–20 dias após o atendimento)' },
      { id: 'atendimentos_mes_recorrente', exemplo: 1.5 },
      { id: 'pct_com_adicional_atual', exemplo: 8, rotulo: 'Atendimentos com produto para casa ou serviço complementar (hoje)' },
      { id: 'pct_com_adicional_meta', exemplo: 15 },
      { id: 'valor_adicional', exemplo: 70 },
      { id: 'margem_adicional_pct', exemplo: 40 },
      { id: 'receita_plataforma', exemplo: 0 },
      { id: 'fat_cartao', exemplo: 40000 },
      { id: 'horas_agenda_manual_semana', exemplo: 10 },
      { id: 'gasto_anuncios_mes', exemplo: 600 }
    ],
    vazamentos: [
      { id: 'retorno', recuperavel_pct: 50, dificuldade: 1, prazo_semanas: 3,
        fonte: { texto: 'Janela de convite 7–20 dias (Trinks, fornecedor). Sem dado brasileiro de quantos não voltam: medir na agenda.', verificado: false } },
      { id: 'faltas', fonte: { texto: 'Faltas 14% barbearia / 17% salão são dados dos EUA (Mangomint 2024, via fornecedor). Medir na agenda.', verificado: false } }
    ],
    cacador: {
      cnaes: ['9602501', '9602502', '9609201'],
      sinais: [
        { id: 'marketplace', rotulo: 'Está no Booksy/Trinks/AppBarber (agenda digital)' },
        { id: 'fidelidade', rotulo: 'Tem clube/assinatura ou fidelidade' }
      ],
      criterios: [
        { id: 'whatsapp_manual', peso: 20 },
        { id: 'sem_agenda_online', peso: 10 },
        { id: 'marketplace', peso: 0, rotulo: 'Está em app de agendamento (informativo)' },
        { id: 'sem_plano', peso: 25, rotulo: 'Sem clube/assinatura' }
      ],
      potencial: { fator: 0.025, aviso: 'Estimativa grosseira pelo porte da Receita (≈ 2,5% do faturamento em retorno e faltas, premissa). Só ordena; o número real sai do Raio-X.' },
      conferir: [
        { rotulo: 'Booksy / Trinks', busca: '{nome} {cidade} booksy OR trinks OR appbarber' }
      ],
      abordagem: 'Pelo que vi, a agenda depende de alguém marcando à mão e ninguém chama o cliente de volta no ciclo — é aí que o salão perde mais dinheiro.'
    }
  });

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
