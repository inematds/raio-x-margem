/*
 * Perfil: CLÍNICA / CONSULTÓRIO (odontologia, médica, fisioterapia, psicologia,
 * nutrição...). Herda de setores/servicos.js. Análise e regras de conselho em
 * docs/setores/servicos.md.
 *
 * Diferenças da base:
 *  - falta sem aviso é o vazamento nº 1 (bem gerida 5–12%; média ~25%)
 *  - glosa de convênio e orçamento de tratamento não aprovado
 *  - sem "adicional" (venda casada é vedada ao médico; não faz sentido em saúde)
 *  - plataforma (Doctoralia, BoaConsulta) cobra mensalidade, não comissão: o
 *    vazamento "plataforma" fica zerado no exemplo
 *  - campanhas seguem o conselho (CFM 2.336/2023, CFO 118/2012 + 196/2019 + 271/2025,
 *    COFFITO 424/2013) e a LGPD de dado sensível (art. 11)
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('./_herdar.js');
  if (!(g.RXM_BASES && g.RXM_BASES.servicos) && typeof require !== 'undefined') require('./servicos.js');
  var base = g.RXM_BASES.servicos;

  var pacote = herdar(base, {
    id: 'clinica',
    nome: 'Clínica / consultório',
    versao: '0.1.0',
    termos: { cliente: 'paciente', clientes: 'pacientes', atendimento: 'consulta', atendimentos: 'consultas', plataforma: 'plataforma de agendamento (Doctoralia, BoaConsulta)' },
    remover: { vazamentos: ['adicional'], entradas: ['pct_com_adicional_atual', 'pct_com_adicional_meta', 'valor_adicional', 'margem_adicional_pct'] },
    grupos: [{ id: 'convenio', titulo: 'Convênios e tratamentos' }],
    entradas: [
      { id: 'faturamento', exemplo: 90000 },
      { id: 'atendimentos_mes', exemplo: 400 },
      { id: 'ticket_medio', exemplo: 250 },
      { id: 'margem_contrib_pct', exemplo: 60 },
      { id: 'falta_pct', exemplo: 18, ajuda: 'Bem gerida: 5–12%. Média de mercado citada: ~25% (fornecedor). Meça na agenda: faltas sem aviso ÷ consultas agendadas.' },
      { id: 'falta_meta_pct', exemplo: 9 },
      { id: 'horas_disponiveis_mes', exemplo: 640 },
      { id: 'ocupacao_pct', exemplo: 70 },
      { id: 'ocupacao_meta_pct', exemplo: 78 },
      { id: 'receita_hora', exemplo: 160 },
      { id: 'clientes_novos_mes', exemplo: 50 },
      { id: 'retorno_atual_pct', exemplo: 45, rotulo: 'Desses, quantos voltam para o retorno/revisão no prazo (hoje)' },
      { id: 'retorno_meta_pct', exemplo: 60 },
      { id: 'atendimentos_mes_recorrente', exemplo: 0.33, ajuda: 'Odonto com revisão semestral ≈ 0,17; tratamento contínuo (fisio, psicologia) pode passar de 2.' },
      { id: 'receita_plataforma', exemplo: 0 },
      { id: 'fat_cartao', exemplo: 50000 },
      { id: 'horas_agenda_manual_semana', exemplo: 15 },
      { id: 'gasto_anuncios_mes', exemplo: 1500 },
      { id: 'fat_convenio', grupo: 'convenio', rotulo: 'Faturado para convênios no mês', unidade: 'R$', exemplo: 30000 },
      { id: 'glosa_pct', grupo: 'convenio', rotulo: 'Glosa (valor recusado pelo convênio ÷ faturado)', unidade: '%', exemplo: 6,
        ajuda: 'Medir por operadora nos últimos 3 meses. Não há referência pública confiável para clínica/odonto.' },
      { id: 'glosa_ref_pct', grupo: 'convenio', rotulo: 'Glosa aceitável com conferência antes do envio', unidade: '%', exemplo: 2 },
      { id: 'orcamentos_mes', grupo: 'convenio', rotulo: 'Planos de tratamento/orçamentos apresentados por mês', unidade: 'un', exemplo: 40 },
      { id: 'aprovacao_atual_pct', grupo: 'convenio', rotulo: 'Aprovados hoje', unidade: '%', exemplo: 40 },
      { id: 'aprovacao_meta_pct', grupo: 'convenio', rotulo: 'Meta com retorno estruturado (explicação, parcelamento no consultório)', unidade: '%', exemplo: 50 },
      { id: 'valor_orcamento', grupo: 'convenio', rotulo: 'Valor médio de um plano de tratamento', unidade: 'R$', exemplo: 1800 }
    ],
    vazamentos: [
      { id: 'faltas', recuperavel_pct: 60, dificuldade: 1, prazo_semanas: 2,
        fonte: { texto: 'SUS-CE: lembrete WhatsApp em 3 toques reduziu faltas ~19% (oficial, lido indiretamente). Faixas privadas 5–12% / ~25%: fornecedor. Ver docs/setores/servicos.md.', verificado: false } },
      { id: 'glosa', nome: 'Glosa de convênio',
        entradas: ['fat_convenio', 'glosa_pct', 'glosa_ref_pct'],
        formula: 'fat_convenio * Math.max(0, glosa_pct - glosa_ref_pct)/100',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 6,
        explicacao: 'Valor faturado que o convênio recusa por erro de guia, autorização ou código. Conferência antes do envio e recurso organizado recuperam parte.',
        como_medir: { base: 'Glosa por operadora nos 3 meses anteriores', metrica: 'Glosa por operadora no mês', janela: 'mensal' },
        receitas: ['cobranca'],
        fonte: { texto: 'Sem referência pública confiável para clínica; medir com os dados da própria clínica.', verificado: false } },
      { id: 'orcamentos', nome: 'Tratamento indicado que não começa',
        entradas: ['orcamentos_mes', 'aprovacao_atual_pct', 'aprovacao_meta_pct', 'valor_orcamento', 'margem_contrib_pct'],
        formula: 'orcamentos_mes * Math.max(0, aprovacao_meta_pct - aprovacao_atual_pct)/100 * valor_orcamento * margem_contrib_pct/100',
        recuperavel_pct: 40, dificuldade: 3, prazo_semanas: 6,
        explicacao: 'Plano de tratamento apresentado e não iniciado: ninguém liga de volta para tirar dúvida ou ajustar o pagamento. Contato de retorno é serviço de saúde, não propaganda.',
        como_medir: { base: '% de planos aprovados em 60 dias, nos 3 meses anteriores', metrica: 'Mesma taxa depois do retorno estruturado', janela: 'mensal' },
        receitas: ['agenda-cheia'],
        fonte: { texto: 'Taxa de aprovação sai do sistema da clínica.', verificado: false } }
    ],
    cacador: {
      cnaes: ['8630501', '8630502', '8630503', '8630504', '8630505', '8630599', '8650002', '8650003', '8650004', '8650006', '8690901', '8690903', '8690904', '8690999'],
      sinais: [
        { id: 'marketplace', rotulo: 'Está na Doctoralia/BoaConsulta (já paga agenda digital)' },
        { id: 'fidelidade', rotulo: 'Tem plano próprio/assinatura de cuidado contínuo' }
      ],
      criterios: [
        { id: 'whatsapp_manual', peso: 25, rotulo: 'Agenda à mão (faltas e confirmação manual)' },
        { id: 'sem_agenda_online', peso: 10 },
        { id: 'marketplace', peso: 5, rotulo: 'Está em plataforma de agendamento' },
        { id: 'sem_plano', peso: 15, rotulo: 'Sem plano de cuidado contínuo' }
      ],
      alertas: [
        { id: 'odonto', teste: 'l.cnae === "8630504" || l.cnae === "8630505"', texto: 'Odontologia: anúncio com preço/parcelamento, brinde, sorteio e "indique e ganhe" são vedados (CFO). Campanhas só de serviço.' },
        { id: 'fisio', teste: 'l.cnae === "8650004"', texto: 'Fisioterapia: promoção e preço fora do consultório vedados (COFFITO 424/2013).' }
      ],
      potencial: { fator: 0.03, aviso: 'Estimativa grosseira pelo porte da Receita (≈ 3% do faturamento em faltas e retorno, premissa). Só ordena; o número real sai do Raio-X.' },
      conferir: [
        { rotulo: 'Doctoralia', busca: 'site:doctoralia.com.br {nome} {cidade}' },
        { rotulo: 'Agenda online', busca: '{nome} {cidade} agendar consulta online' }
      ],
      textos: {
        convite: 'Faço um diagnóstico de 40 minutos que mostra, em reais por mês, quanto escapa em falta sem aviso, horário vazio, paciente que não volta para o retorno, glosa e taxa de cartão — sem nada de promoção ou propaganda, que conselho profissional não permite. Sem custo: se não aparecer pelo menos R$ 2 mil por mês, eu mesmo digo que não vale mexer. Qual dia é mais tranquilo?'
      },
      abordagem: 'Pelo que vi, a agenda depende de alguém marcando e confirmando à mão — é aí que nascem a falta sem aviso e o horário vazio, que numa clínica costumam ser o maior vazamento.'
    }
  });

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
