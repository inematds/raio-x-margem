/*
 * Pacote BASE: SERVIÇOS COM AGENDA (Brasil)
 *
 * Modelo padrão para negócios de hora marcada e cliente que volta: clínicas,
 * salões, barbearias, estúdios, pet shops, oficinas... Perfis herdam daqui
 * (setores/clinica.js, setores/salao.js) com setores/_herdar.js e trocam só
 * termos, números de referência, CNAEs e o que for próprio do nicho.
 *
 * Textos usam {cliente}, {clientes}, {atendimento}, {atendimentos},
 * {profissional}, {plataforma} — o perfil define as palavras em `termos`.
 *
 * Também é selecionável sozinho, como "Serviços com agenda (genérico)".
 */
(function (g) {
  var herdar = g.RXM_HERDAR || (typeof require !== 'undefined' && require('./_herdar.js'));

  var base = {
    id: 'servicos',
    nome: 'Serviços com agenda (genérico)',
    versao: '0.1.0',
    mercado: 'BR',
    idioma: 'pt-BR',
    moeda: 'BRL',
    termos: {
      cliente: 'cliente', clientes: 'clientes', atendimento: 'atendimento', atendimentos: 'atendimentos',
      profissional: 'profissional', profissionais: 'profissionais', plataforma: 'plataforma de agendamento'
    },

    grupos: [
      { id: 'geral', titulo: 'Números gerais' },
      { id: 'agenda', titulo: 'Agenda: faltas e horários vazios' },
      { id: 'clientes', titulo: '{Clientes} e vendas' },
      { id: 'plataforma', titulo: '{Plataforma} e intermediários' },
      { id: 'pagamentos', titulo: 'Pagamentos e caixa' },
      { id: 'operacao', titulo: 'Operação e marketing' }
    ],

    entradas: [
      { id: 'faturamento', grupo: 'geral', rotulo: 'Faturamento total do mês', unidade: 'R$', exemplo: 60000 },
      { id: 'atendimentos_mes', grupo: 'geral', rotulo: '{Atendimentos} realizados por mês', unidade: 'un', exemplo: 400 },
      { id: 'ticket_medio', grupo: 'geral', rotulo: 'Valor médio de um {atendimento}', unidade: 'R$', exemplo: 150 },
      { id: 'margem_contrib_pct', grupo: 'geral', rotulo: 'Margem de contribuição do {atendimento} (preço − material − comissão do {profissional} − taxa)', unidade: '%', exemplo: 50,
        ajuda: 'Comissão de {profissional} por produção é custo variável e sai da margem; aluguel e salário fixo não.' },

      { id: 'falta_pct', grupo: 'agenda', rotulo: 'Faltas sem aviso (% dos {atendimentos} agendados)', unidade: '%', exemplo: 15 },
      { id: 'falta_meta_pct', grupo: 'agenda', rotulo: 'Meta de faltas com confirmação automática e sinal', unidade: '%', exemplo: 7 },
      { id: 'horas_disponiveis_mes', grupo: 'agenda', rotulo: 'Horas de agenda disponíveis no mês (todos os {profissionais})', unidade: 'h', exemplo: 600 },
      { id: 'ocupacao_pct', grupo: 'agenda', rotulo: 'Ocupação da agenda (horas agendadas ÷ disponíveis)', unidade: '%', exemplo: 65 },
      { id: 'ocupacao_meta_pct', grupo: 'agenda', rotulo: 'Meta de ocupação (lista de espera, horário de baixa, retorno programado)', unidade: '%', exemplo: 75 },
      { id: 'receita_hora', grupo: 'agenda', rotulo: 'Receita média por hora atendida', unidade: 'R$', exemplo: 100 },

      { id: 'clientes_novos_mes', grupo: 'clientes', rotulo: '{Clientes} novos por mês', unidade: 'un', exemplo: 60 },
      { id: 'retorno_atual_pct', grupo: 'clientes', rotulo: 'Desses, quantos voltam no prazo esperado (hoje)', unidade: '%', exemplo: 40 },
      { id: 'retorno_meta_pct', grupo: 'clientes', rotulo: 'Meta de retorno com lembrete programado', unidade: '%', exemplo: 55 },
      { id: 'atendimentos_mes_recorrente', grupo: 'clientes', rotulo: '{Atendimentos} por mês de um {cliente} que volta', unidade: 'un', exemplo: 1 },
      { id: 'pct_com_adicional_atual', grupo: 'clientes', rotulo: '{Atendimentos} com serviço ou produto adicional (hoje)', unidade: '%', exemplo: 10 },
      { id: 'pct_com_adicional_meta', grupo: 'clientes', rotulo: 'Meta com oferta no agendamento/atendimento', unidade: '%', exemplo: 18 },
      { id: 'valor_adicional', grupo: 'clientes', rotulo: 'Valor médio do adicional', unidade: 'R$', exemplo: 60 },
      { id: 'margem_adicional_pct', grupo: 'clientes', rotulo: 'Margem do adicional', unidade: '%', exemplo: 40 },

      { id: 'receita_plataforma', grupo: 'plataforma', rotulo: 'Receita vinda de {plataforma}/marketplace que cobra por {cliente} ou por agendamento', unidade: 'R$', exemplo: 0,
        ajuda: 'Só o que paga comissão por agendamento ou por {cliente} novo. Mensalidade fixa de software não é vazamento por {cliente}.' },
      { id: 'comissao_plataforma_pct', grupo: 'plataforma', rotulo: 'Custo efetivo dessa {plataforma} (% da receita que veio dela)', unidade: '%', exemplo: 0 },
      { id: 'custo_proprio_pct', grupo: 'plataforma', rotulo: 'Custo do agendamento próprio (% da receita)', unidade: '%', exemplo: 2 },
      { id: 'recorrente_plataforma_pct', grupo: 'plataforma', rotulo: 'Parte dessa receita de {clientes} que já vieram antes', unidade: '%', exemplo: 30 },

      { id: 'fat_cartao', grupo: 'pagamentos', rotulo: 'Recebido no cartão no mês', unidade: 'R$', exemplo: 35000 },
      { id: 'mdr_atual_pct', grupo: 'pagamentos', rotulo: 'Taxa média atual do cartão', unidade: '%', exemplo: 3.0 },
      { id: 'mdr_referencia_pct', grupo: 'pagamentos', rotulo: 'Taxa negociável de referência', unidade: '%', exemplo: 2.2 },
      { id: 'valor_antecipado', grupo: 'pagamentos', rotulo: 'Valor antecipado no mês', unidade: 'R$', exemplo: 0 },
      { id: 'custo_antecipacao_pct', grupo: 'pagamentos', rotulo: 'Custo da antecipação (% sobre o antecipado)', unidade: '%', exemplo: 0 },
      { id: 'juros_multas_mes', grupo: 'pagamentos', rotulo: 'Juros, multas e encargos por falta de caixa', unidade: 'R$', exemplo: 0 },

      { id: 'horas_agenda_manual_semana', grupo: 'operacao', rotulo: 'Horas/semana marcando, confirmando e remarcando por WhatsApp/telefone', unidade: 'h', exemplo: 12 },
      { id: 'custo_hora', grupo: 'operacao', rotulo: 'Custo da hora de quem faz isso (com encargos)', unidade: 'R$', exemplo: 16 },
      { id: 'gasto_anuncios_mes', grupo: 'operacao', rotulo: 'Gasto com anúncios', unidade: 'R$', exemplo: 800 },
      { id: 'anuncio_para_clientes_pct', grupo: 'operacao', rotulo: 'Parte que alcança quem já é {cliente}', unidade: '%', exemplo: 30 }
    ],

    vazamentos: [
      {
        id: 'faltas', nome: 'Falta sem aviso',
        entradas: ['atendimentos_mes', 'falta_pct', 'falta_meta_pct', 'ticket_medio', 'margem_contrib_pct'],
        formula: 'atendimentos_mes * Math.max(0, falta_pct - falta_meta_pct)/100 * ticket_medio * margem_contrib_pct/100',
        recuperavel_pct: 60, dificuldade: 1, prazo_semanas: 2,
        explicacao: 'Horário reservado e vazio: o {profissional} está lá, o {atendimento} não acontece. Confirmação automática, lista de espera e sinal por Pix nos horários disputados.',
        como_medir: { base: '% de faltas nas 4 semanas anteriores (da agenda)', metrica: '% de faltas no mês × {atendimentos} × valor médio', janela: 'mensal' },
        receitas: ['agenda-cheia', 'cobranca'],
        fonte: { texto: 'Taxa de falta sai da agenda do próprio negócio; referência do setor em docs/setores/servicos.md.', verificado: false }
      },
      {
        id: 'ociosidade', nome: 'Horário que nunca foi agendado',
        entradas: ['horas_disponiveis_mes', 'ocupacao_pct', 'ocupacao_meta_pct', 'receita_hora', 'margem_contrib_pct'],
        formula: 'horas_disponiveis_mes * Math.max(0, ocupacao_meta_pct - ocupacao_pct)/100 * receita_hora * margem_contrib_pct/100',
        recuperavel_pct: 40, dificuldade: 3, prazo_semanas: 8,
        explicacao: 'Agenda com buraco fixo (manhã de terça, fim de tarde de segunda). Retorno programado, lista de espera e oferta para horário de baixa enchem sem baixar preço do horário nobre.',
        como_medir: { base: 'Ocupação por dia e faixa de horário nas 4 semanas anteriores', metrica: 'Mesma ocupação depois', janela: 'mensal' },
        receitas: ['agenda-cheia', 'marketing-local'],
        fonte: { texto: 'Medida na agenda do próprio negócio. Falta sem aviso entra no vazamento anterior, não aqui.', verificado: false }
      },
      {
        id: 'retorno', nome: '{Cliente} que não volta no prazo',
        entradas: ['clientes_novos_mes', 'retorno_atual_pct', 'retorno_meta_pct', 'ticket_medio', 'atendimentos_mes_recorrente', 'margem_contrib_pct'],
        formula: 'clientes_novos_mes * Math.max(0, retorno_meta_pct - retorno_atual_pct)/100 * ticket_medio * atendimentos_mes_recorrente * margem_contrib_pct/100',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 8,
        explicacao: 'O próximo {atendimento} tem prazo previsível. Sem lembrete no prazo, o {cliente} esquece ou vai para outro lugar.',
        como_medir: { base: 'Retorno no prazo da coorte de {clientes} novos antes do lembrete', metrica: 'Mesma taxa nas coortes depois', janela: 'por coorte mensal' },
        receitas: ['agenda-cheia', 'aquisicao'],
        fonte: { texto: 'Meta de retorno é premissa do implantador; validar em 2 coortes.', verificado: false }
      },
      {
        id: 'plataforma', nome: '{Plataforma} cobrando de {cliente} que já é seu',
        entradas: ['receita_plataforma', 'recorrente_plataforma_pct', 'comissao_plataforma_pct', 'custo_proprio_pct'],
        formula: 'receita_plataforma * recorrente_plataforma_pct/100 * Math.max(0, comissao_plataforma_pct - custo_proprio_pct)/100',
        recuperavel_pct: 40, dificuldade: 3, prazo_semanas: 8,
        explicacao: 'Quando a {plataforma} cobra por agendamento ou por {cliente}, quem já é da casa paga de novo. Se a {plataforma} só cobra mensalidade, este vazamento é zero.',
        como_medir: { base: 'Receita e custo por canal nos 3 meses anteriores', metrica: 'Agendamentos diretos de {clientes} que vinham pela {plataforma}', janela: 'mensal' },
        receitas: ['agenda-cheia', 'aquisicao'],
        fonte: { texto: 'Custo efetivo sai da fatura da {plataforma}.', verificado: false }
      },
      {
        id: 'adicional', nome: 'Adicional que ninguém oferece',
        entradas: ['atendimentos_mes', 'pct_com_adicional_atual', 'pct_com_adicional_meta', 'valor_adicional', 'margem_adicional_pct'],
        formula: 'atendimentos_mes * Math.max(0, pct_com_adicional_meta - pct_com_adicional_atual)/100 * valor_adicional * margem_adicional_pct/100',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Serviço complementar ou produto oferecido na hora certa, sem pressão.',
        como_medir: { base: '% de {atendimentos} com adicional nos 30 dias anteriores', metrica: '% atual × valor médio', janela: 'mensal' },
        receitas: ['agenda-cheia'],
        fonte: { texto: 'Sai do caixa/sistema do próprio negócio.', verificado: false }
      },
      {
        id: 'pagamentos', nome: 'Taxas de cartão acima do mercado',
        entradas: ['fat_cartao', 'mdr_atual_pct', 'mdr_referencia_pct'],
        formula: 'fat_cartao * Math.max(0, mdr_atual_pct - mdr_referencia_pct)/100',
        recuperavel_pct: 70, dificuldade: 1, prazo_semanas: 2,
        explicacao: 'MDR acima do que o volume permite negociar.',
        como_medir: { base: 'Extrato da adquirente dos 3 meses anteriores', metrica: 'Taxa efetiva nova × volume do mês', janela: 'mensal' },
        receitas: ['cobranca'],
        fonte: { texto: 'MDR médio BC 2º sem/2025: crédito 2,10%, débito 1,08% (docs/ANALISE.md).', verificado: true }
      },
      {
        id: 'antecipacao', nome: 'Antecipação de recebíveis',
        entradas: ['valor_antecipado', 'custo_antecipacao_pct'],
        formula: 'valor_antecipado * custo_antecipacao_pct/100',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Antecipar por hábito custa juros.',
        como_medir: { base: 'Custo de antecipação nos 3 meses anteriores', metrica: 'Custo no mês', janela: 'mensal' },
        receitas: ['cobranca'],
        fonte: { texto: 'Extrato do próprio negócio.', verificado: true }
      },
      {
        id: 'caixa', nome: 'Juros e multas por falta de caixa',
        entradas: ['juros_multas_mes'],
        formula: 'juros_multas_mes',
        recuperavel_pct: 60, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Conta atrasada e cheque especial são sintoma de caixa sem previsão.',
        como_medir: { base: 'Encargos nos 3 meses anteriores', metrica: 'Encargos no mês', janela: 'mensal' },
        receitas: ['cobranca'],
        fonte: { texto: 'Extrato bancário.', verificado: true }
      },
      {
        id: 'mao_de_obra', nome: 'Recepção presa marcando e confirmando à mão',
        entradas: ['horas_agenda_manual_semana', 'custo_hora'],
        formula: 'horas_agenda_manual_semana * 4.33 * custo_hora',
        recuperavel_pct: 60, dificuldade: 2, prazo_semanas: 3,
        explicacao: 'Agendamento online e confirmação automática liberam horas — ganho real só se as horas forem realocadas.',
        como_medir: { base: 'Horas medidas em 1 semana típica antes', metrica: 'Horas em 1 semana típica depois', janela: 'mensal' },
        receitas: ['agenda-cheia'],
        fonte: { texto: 'Medir com o próprio negócio.', verificado: false }
      },
      {
        id: 'marketing', nome: 'Anúncio pagando por quem já é {cliente}',
        entradas: ['gasto_anuncios_mes', 'anuncio_para_clientes_pct'],
        formula: 'gasto_anuncios_mes * anuncio_para_clientes_pct/100',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Sem base própria não dá para excluir {clientes} atuais do anúncio nem falar com eles de graça.',
        como_medir: { base: 'Custo por {cliente} novo atribuído a anúncio antes', metrica: 'Mesmo custo com lista de exclusão', janela: 'mensal' },
        receitas: ['marketing-local', 'aquisicao'],
        fonte: { texto: 'Estimativa a validar com público personalizado.', verificado: false }
      }
    ],

    receitas: {
      'agenda-cheia': { nome: 'Agenda cheia', doc: 'docs/modulos/servicos-agenda.md', resumo: 'Confirmação automática, lista de espera, sinal por Pix, retorno programado, plano/assinatura com Pix Automático.' },
      'aquisicao': { nome: 'Ganho e retenção de {clientes}', doc: 'docs/modulos/aquisicao.md', resumo: 'Base própria consentida, régua de retorno, indicação.' },
      'cobranca': { nome: 'Cobrança e pagamentos', doc: 'docs/modulos/cobranca.md', resumo: 'Taxas, Pix, sinal de agendamento, antecipação só quando precisa.' },
      'marketing-local': { nome: 'Marketing local e comunidade', doc: 'docs/modulos/marketing-local.md', resumo: 'Parcerias com negócios vizinhos, presença no Google, comunidade do bairro.' }
    },

    cacador: {
      cnaes: [],
      sinais: [
        { id: 'nota', rotulo: 'Nota no Google', tipo: 'numero' },
        { id: 'avaliacoes', rotulo: 'Nº de avaliações no Google', tipo: 'numero' },
        { id: 'marketplace', rotulo: 'Está em {plataforma}/marketplace que cobra por {cliente}', tipo: 'sim_nao' },
        { id: 'instagram_ativo', rotulo: 'Instagram com post nos últimos 30 dias', tipo: 'sim_nao' },
        { id: 'pedido_proprio', rotulo: 'Tem agendamento online próprio', tipo: 'sim_nao' },
        { id: 'whatsapp_manual', rotulo: 'Agenda só por WhatsApp/telefone', tipo: 'sim_nao' },
        { id: 'fidelidade', rotulo: 'Tem plano, clube ou assinatura', tipo: 'sim_nao' }
      ],
      criterios: [
        { id: 'nota', sinal: 'nota', teste: 'v >= 4.5', rotulo: 'Nota no Google ≥ 4,5', peso: 15 },
        { id: 'avaliacoes', sinal: 'avaliacoes', teste: 'v >= 100', rotulo: '100+ avaliações (tem demanda)', peso: 20 },
        { id: 'whatsapp_manual', sinal: 'whatsapp_manual', teste: 'v === true', rotulo: 'Agenda à mão (falta e horário vazio)', peso: 20 },
        { id: 'sem_agenda_online', sinal: 'pedido_proprio', teste: 'v === false', rotulo: 'Sem agendamento online', peso: 10 },
        { id: 'marketplace', sinal: 'marketplace', teste: 'v === true', rotulo: 'Paga {plataforma} por {cliente}', peso: 5 },
        { id: 'instagram', sinal: 'instagram_ativo', teste: 'v === true', rotulo: 'Instagram ativo', peso: 10 },
        { id: 'sem_plano', sinal: 'fidelidade', teste: 'v === false', rotulo: 'Sem plano/clube/assinatura', peso: 20 }
      ],
      alertas: [
        { id: 'pouca_demanda', teste: 'l.sinais.avaliacoes != null && l.sinais.avaliacoes < 20', texto: 'Poucas avaliações: talvez falte demanda.' },
        { id: 'nota_baixa', teste: 'l.sinais.nota != null && l.sinais.nota < 4.0', texto: 'Nota abaixo de 4,0: problema pode ser o serviço.' },
        { id: 'mei', teste: 'l.porte === "MEI"', texto: 'MEI: estrutura de uma pessoa; implantação precisa ser mínima.' },
        { id: 'inativa', teste: 'l.situacao && l.situacao !== "ATIVA"', texto: 'CNPJ não está ativo na Receita.' }
      ],
      potencial: {
        faturamento_por_porte: { MEI: [0, 6750], ME: [6750, 30000], EPP: [30000, 400000], DEMAIS: [400000, 1000000] },
        // faltas (~8 p.p. evitáveis) × margem ~50% ≈ 4% do faturamento, × metade recuperável (premissa)
        fator: 0.02,
        aviso: 'Estimativa grosseira pelo porte da Receita (≈ 2% do faturamento em faltas e retorno, premissa). Só ordena; o número real sai do Raio-X.'
      },
      conferir: [
        { rotulo: 'Agenda online', busca: '{nome} {cidade} agendar online' }
      ],
      textos: {
        demanda: 'Vi que {nome} tem nota {nota} com {avaliacoes} avaliações no Google — {clientes} vocês têm.',
        conheco_local: 'Conheço {nome}, em {local}.',
        conheco: 'Conheço {nome}.',
        sem_canal: 'Não encontrei como agendar direto sem mandar mensagem — cada marcação, confirmação e remarcação passa por alguém da equipe.',
        com_canal: 'Vi que vocês já têm agendamento online — o ponto é quanto da agenda ainda fica vazia por falta e por {cliente} que não volta no prazo.',
        sem_fidelidade: 'Também não vi plano ou clube: o {cliente} que gosta não tem motivo para garantir o próximo horário.',
        convite: 'Faço um diagnóstico de 40 minutos que mostra, em reais por mês, quanto escapa em falta sem aviso, horário vazio, {cliente} que não volta e taxa de cartão. Sem custo: se não aparecer pelo menos R$ 1,5 mil por mês, eu mesmo digo que não vale mexer. Qual dia é mais tranquilo?'
      },
      abordagem: 'Pelo que vi, a agenda depende de alguém marcando e confirmando à mão — é aí que nascem a falta sem aviso e o horário vazio.'
    }
  };

  var pacote = herdar(base, { id: base.id });
  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  g.RXM_BASES = g.RXM_BASES || {};
  g.RXM_BASES.servicos = base;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
