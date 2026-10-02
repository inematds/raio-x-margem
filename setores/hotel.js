/*
 * Pacote de setor: HOTÉIS E POUSADAS (Brasil)
 *
 * Mesmo formato do pacote restaurante (ver docs/ARQUITETURA.md). Referências e
 * contratos das OTAs em docs/setores/hotel.md; o que pode e o que não pode em
 * docs/TERMOS.md (seção hotel).
 *
 * Regra de ouro do setor (Booking, cl. 2.2 — Brasil é país de "paridade
 * restrita"): o site próprio NÃO pode publicar tarifa menor que a da Booking.
 * O canal direto ganha por benefício e por tarifa fechada (e-mail, WhatsApp,
 * balcão), nunca por preço público menor.
 */
(function (g) {
  var pacote = {
    id: 'hotel',
    nome: 'Hotel / pousada',
    versao: '0.1.0',
    mercado: 'BR',
    idioma: 'pt-BR',
    moeda: 'BRL',

    grupos: [
      { id: 'geral', titulo: 'Números gerais da hospedagem' },
      { id: 'canais', titulo: 'Sites de reserva (OTAs) e reserva direta' },
      { id: 'temporada', titulo: 'Ocupação e baixa temporada' },
      { id: 'hospedes', titulo: 'Hóspedes e receita extra' },
      { id: 'pagamentos', titulo: 'Pagamentos, cancelamentos e caixa' },
      { id: 'operacao', titulo: 'Operação e marketing' }
    ],

    entradas: [
      { id: 'faturamento', grupo: 'geral', rotulo: 'Receita total do mês (diárias + extras)', unidade: 'R$', exemplo: 220000 },
      { id: 'uhs', grupo: 'geral', rotulo: 'Unidades habitacionais (quartos/chalés)', unidade: 'un', exemplo: 30 },
      { id: 'reservas_mes', grupo: 'geral', rotulo: 'Reservas por mês', unidade: 'un', exemplo: 220 },
      { id: 'valor_reserva', grupo: 'geral', rotulo: 'Valor médio de uma reserva (estadia inteira)', unidade: 'R$', exemplo: 1000 },
      { id: 'margem_contrib_pct', grupo: 'geral', rotulo: 'Margem de contribuição da diária (diária − custos variáveis: lavanderia, café, amenities, comissão média)', unidade: '%', exemplo: 65,
        ajuda: 'Custos fixos (folha, aluguel) não entram: quarto vazio não economiza folha.' },

      { id: 'receita_ota', grupo: 'canais', rotulo: 'Receita vinda de OTAs (Booking, Expedia, Decolar, Airbnb, Hurb)', unidade: 'R$', exemplo: 132000 },
      { id: 'comissao_ota_pct', grupo: 'canais', rotulo: 'Custo efetivo das OTAs (comissão + programa Preferencial/Genius + taxa de pagamento)', unidade: '%', exemplo: 18,
        ajuda: 'Booking 15% padrão, 18% no Preferencial (07/2026); Airbnb 16% na taxa única no Brasil. Use as faturas do mês.' },
      { id: 'custo_direto_pct', grupo: 'canais', rotulo: 'Custo da reserva direta (motor de reserva + pagamento + anúncio de marca)', unidade: '%', exemplo: 6 },
      { id: 'recorrente_ota_pct', grupo: 'canais', rotulo: 'Parte da receita OTA de hóspedes que já se hospedaram ou que poderiam reservar direto', unidade: '%', exemplo: 15,
        ajuda: 'Cruze nome do hóspede OTA com o histórico do PMS. Sem histórico: 10–20% é premissa a validar.' },
      { id: 'adicional_programa_pct', grupo: 'canais', rotulo: 'Pontos extras pagos por programa de visibilidade (ex.: Preferencial = +3 p.p.)', unidade: 'p.p.', exemplo: 3 },
      { id: 'programa_sem_retorno_pct', grupo: 'canais', rotulo: 'Parte desse extra que NÃO volta como reserva a mais', unidade: '%', exemplo: 50,
        ajuda: 'Teste: compare reservas por OTA 2 meses com e sem o programa. Sem teste, 50% é premissa.' },

      { id: 'ocupacao_baixa_pct', grupo: 'temporada', rotulo: 'Ocupação média nos meses de baixa temporada', unidade: '%', exemplo: 40 },
      { id: 'ocupacao_meta_baixa_pct', grupo: 'temporada', rotulo: 'Meta realista de ocupação na baixa (pacotes, eventos, mercado regional, corporativo)', unidade: '%', exemplo: 48 },
      { id: 'diaria_baixa', grupo: 'temporada', rotulo: 'Diária média na baixa temporada', unidade: 'R$', exemplo: 350 },

      { id: 'retorno_atual_pct', grupo: 'hospedes', rotulo: 'Hóspedes que voltam em até 12 meses (hoje)', unidade: '%', exemplo: 4 },
      { id: 'retorno_meta_pct', grupo: 'hospedes', rotulo: 'Meta de retorno com base própria + oferta ao hóspede', unidade: '%', exemplo: 8 },
      { id: 'pct_com_extra_atual', grupo: 'hospedes', rotulo: 'Reservas que compram extra (jantar, late checkout, transfer, pacote, upgrade)', unidade: '%', exemplo: 15 },
      { id: 'pct_com_extra_meta', grupo: 'hospedes', rotulo: 'Meta com oferta antes da chegada (pré-check-in)', unidade: '%', exemplo: 25 },
      { id: 'valor_extra', grupo: 'hospedes', rotulo: 'Valor médio do extra', unidade: 'R$', exemplo: 180 },
      { id: 'margem_extra_pct', grupo: 'hospedes', rotulo: 'Margem do extra', unidade: '%', exemplo: 50 },

      { id: 'fat_cartao', grupo: 'pagamentos', rotulo: 'Recebido no cartão (fora das OTAs) no mês', unidade: 'R$', exemplo: 70000 },
      { id: 'mdr_atual_pct', grupo: 'pagamentos', rotulo: 'Taxa média atual do cartão', unidade: '%', exemplo: 3.2 },
      { id: 'mdr_referencia_pct', grupo: 'pagamentos', rotulo: 'Taxa negociável de referência', unidade: '%', exemplo: 2.3 },
      { id: 'valor_antecipado', grupo: 'pagamentos', rotulo: 'Valor antecipado no mês', unidade: 'R$', exemplo: 0 },
      { id: 'custo_antecipacao_pct', grupo: 'pagamentos', rotulo: 'Custo da antecipação (% sobre o antecipado)', unidade: '%', exemplo: 0 },
      { id: 'cancelamentos_mes', grupo: 'pagamentos', rotulo: 'Reservas canceladas tarde ou no-show por mês', unidade: 'un', exemplo: 6 },
      { id: 'nao_cobrado_pct', grupo: 'pagamentos', rotulo: 'Parte desses que não foi cobrada (sem garantia/pré-pagamento)', unidade: '%', exemplo: 70 },
      { id: 'juros_multas_mes', grupo: 'pagamentos', rotulo: 'Juros, multas e encargos por falta de caixa (baixa temporada)', unidade: 'R$', exemplo: 0 },

      { id: 'horas_reserva_manual_semana', grupo: 'operacao', rotulo: 'Horas/semana respondendo cotação e reserva por WhatsApp/e-mail', unidade: 'h', exemplo: 25 },
      { id: 'custo_hora', grupo: 'operacao', rotulo: 'Custo da hora de trabalho com encargos', unidade: 'R$', exemplo: 18 },
      { id: 'gasto_anuncios_mes', grupo: 'operacao', rotulo: 'Gasto com anúncios e metabuscadores (Google Hotel Ads, Meta)', unidade: 'R$', exemplo: 2500 },
      { id: 'anuncio_para_clientes_pct', grupo: 'operacao', rotulo: 'Parte que alcança quem já se hospedou', unidade: '%', exemplo: 30 }
    ],

    vazamentos: [
      {
        id: 'ota_recorrente', nome: 'OTA cobrando comissão de hóspede que já é seu',
        entradas: ['receita_ota', 'recorrente_ota_pct', 'comissao_ota_pct', 'custo_direto_pct'],
        formula: 'receita_ota * recorrente_ota_pct/100 * Math.max(0, comissao_ota_pct - custo_direto_pct)/100',
        recuperavel_pct: 40, dificuldade: 3, prazo_semanas: 8,
        explicacao: 'Hóspede que volta, ou que achou o hotel no Google e reservou pela OTA, paga comissão de novo. A diferença para o custo da reserva direta é o vazamento.',
        como_medir: { base: 'Receita e comissão por canal nos 3 meses equivalentes do ano anterior (sazonalidade!)', metrica: 'Reservas diretas de hóspedes identificados × diferença de custo', janela: 'mensal, comparando com o mesmo mês do ano anterior' },
        receitas: ['reserva-direta', 'aquisicao'],
        fonte: { texto: 'Booking 15%/18% (Panrotas 07/2026); Airbnb 16% (Airbnb, artigo 1857); 55% das reservas por canais indiretos (FOHB/Noctua 2024). Ver docs/setores/hotel.md.', verificado: true }
      },
      {
        id: 'programa_ota', nome: 'Programa de visibilidade da OTA que não se paga',
        entradas: ['receita_ota', 'adicional_programa_pct', 'programa_sem_retorno_pct'],
        formula: 'receita_ota * adicional_programa_pct/100 * programa_sem_retorno_pct/100',
        recuperavel_pct: 60, dificuldade: 1, prazo_semanas: 8,
        explicacao: 'Preferencial/Genius cobram pontos a mais pela visibilidade. Se as reservas extras não pagam o adicional, é dinheiro saindo. Resolve-se com teste: 2 meses com e sem.',
        como_medir: { base: 'Reservas e comissão por OTA com o programa ativo', metrica: 'Mesmas métricas no período de teste sem o programa', janela: 'bimestral, ajustado pela sazonalidade' },
        receitas: ['reserva-direta'],
        fonte: { texto: 'Preferencial 18% × padrão 15% na Booking (07/2026). Retorno do programa é premissa a testar.', verificado: false }
      },
      {
        id: 'baixa_temporada', nome: 'Quarto vazio na baixa temporada',
        entradas: ['uhs', 'ocupacao_baixa_pct', 'ocupacao_meta_baixa_pct', 'diaria_baixa', 'margem_contrib_pct'],
        formula: 'uhs * 30 * Math.max(0, ocupacao_meta_baixa_pct - ocupacao_baixa_pct)/100 * diaria_baixa * margem_contrib_pct/100',
        recuperavel_pct: 50, dificuldade: 3, prazo_semanas: 10,
        explicacao: 'Margem perdida por mês de baixa: quartos que poderiam ser vendidos com pacote, evento, mercado regional ou corporativo. Em Gramado a ocupação anual caiu a 45% em 2024 contra 85–100% nos picos.',
        como_medir: { base: 'Ocupação e diária dos meses de baixa do ano anterior', metrica: 'Ocupação e diária dos mesmos meses, com pacotes/ações registrados', janela: 'mensal na baixa' },
        receitas: ['baixa-temporada', 'marketing-local'],
        fonte: { texto: 'Gramado: 45,30% em 2024, média ~56,7% (Jornal do Comércio 06/2025, dados municipais). Meta é premissa do implantador.', verificado: false }
      },
      {
        id: 'retorno', nome: 'Hóspede que não volta',
        entradas: ['reservas_mes', 'retorno_atual_pct', 'retorno_meta_pct', 'valor_reserva', 'margem_contrib_pct'],
        formula: 'reservas_mes * Math.max(0, retorno_meta_pct - retorno_atual_pct)/100 * valor_reserva * margem_contrib_pct/100',
        recuperavel_pct: 50, dificuldade: 3, prazo_semanas: 16,
        explicacao: 'Cada mês de hóspedes gera retornos ao longo do ano; em regime, o ganho mensal equivale a este valor. Base própria com consentimento (check-in), nunca o contato que a OTA fornece.',
        como_medir: { base: 'Taxa de retorno em 12 meses no PMS antes da base própria', metrica: 'Mesma taxa nas coortes após a base própria', janela: 'trimestral por coorte' },
        receitas: ['reserva-direta', 'aquisicao'],
        fonte: { texto: 'Direto volta 5,1% × OTA 1,3% (Bookboost, 2,2 mi hóspedes europeus, fornecedor). Sem dado brasileiro.', verificado: false }
      },
      {
        id: 'extras', nome: 'Receita extra que ninguém oferece',
        entradas: ['reservas_mes', 'pct_com_extra_atual', 'pct_com_extra_meta', 'valor_extra', 'margem_extra_pct'],
        formula: 'reservas_mes * Math.max(0, pct_com_extra_meta - pct_com_extra_atual)/100 * valor_extra * margem_extra_pct/100',
        recuperavel_pct: 60, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Jantar, fondue, late checkout, transfer, ingresso de atração, upgrade: ofertados no pré-check-in por mensagem, vendem sem desconto.',
        como_medir: { base: '% de reservas com extra nos 60 dias anteriores', metrica: '% atual × valor médio do extra', janela: 'mensal' },
        receitas: ['reserva-direta'],
        fonte: { texto: 'Taxa de extras sai do PMS/caixa do próprio hotel.', verificado: false }
      },
      {
        id: 'no_show', nome: 'Cancelamento tardio e no-show sem cobrança',
        entradas: ['cancelamentos_mes', 'nao_cobrado_pct', 'valor_reserva', 'margem_contrib_pct'],
        formula: 'cancelamentos_mes * nao_cobrado_pct/100 * valor_reserva * margem_contrib_pct/100',
        recuperavel_pct: 60, dificuldade: 2, prazo_semanas: 3,
        explicacao: 'Reserva direta sem garantia (cartão/Pix de sinal) vira quarto bloqueado e vazio. Política clara + pré-pagamento por Pix.',
        como_medir: { base: 'No-shows e cancelamentos tardios não cobrados nos 3 meses equivalentes', metrica: 'Mesmo número com política de garantia', janela: 'mensal' },
        receitas: ['cobranca', 'reserva-direta'],
        fonte: { texto: 'Valores do próprio hotel; não há referência brasileira confiável.', verificado: false }
      },
      {
        id: 'pagamentos', nome: 'Taxas de cartão acima do mercado',
        entradas: ['fat_cartao', 'mdr_atual_pct', 'mdr_referencia_pct'],
        formula: 'fat_cartao * Math.max(0, mdr_atual_pct - mdr_referencia_pct)/100',
        recuperavel_pct: 70, dificuldade: 1, prazo_semanas: 2,
        explicacao: 'MDR acima do que o volume permite negociar; hotel tem ticket alto e parcelamento, o que pesa mais.',
        como_medir: { base: 'Extrato da adquirente dos 3 meses anteriores', metrica: 'Taxa efetiva nova × volume do mês', janela: 'mensal' },
        receitas: ['cobranca'],
        fonte: { texto: 'MDR médio BC 2º sem/2025: crédito 2,10%, débito 1,08% (ver docs/ANALISE.md).', verificado: true }
      },
      {
        id: 'antecipacao', nome: 'Antecipação de recebíveis',
        entradas: ['valor_antecipado', 'custo_antecipacao_pct'],
        formula: 'valor_antecipado * custo_antecipacao_pct/100',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Na baixa temporada o hotel antecipa para pagar a folha: crédito caro. Previsão de caixa e sinal por Pix nas reservas da alta reduzem a necessidade.',
        como_medir: { base: 'Custo de antecipação nos 3 meses equivalentes', metrica: 'Custo no mês atual', janela: 'mensal' },
        receitas: ['cobranca'],
        fonte: { texto: 'Extrato do próprio hotel.', verificado: true }
      },
      {
        id: 'caixa', nome: 'Juros e multas por falta de caixa',
        entradas: ['juros_multas_mes'],
        formula: 'juros_multas_mes',
        recuperavel_pct: 60, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Sazonalidade forte sem previsão de caixa vira cheque especial na baixa.',
        como_medir: { base: 'Encargos nos 3 meses equivalentes', metrica: 'Encargos no mês', janela: 'mensal' },
        receitas: ['cobranca'],
        fonte: { texto: 'Extrato bancário do hotel.', verificado: true }
      },
      {
        id: 'mao_de_obra', nome: 'Recepção presa em cotação manual',
        entradas: ['horas_reserva_manual_semana', 'custo_hora'],
        formula: 'horas_reserva_manual_semana * 4.33 * custo_hora',
        recuperavel_pct: 50, dificuldade: 3, prazo_semanas: 6,
        explicacao: 'Responder "tem vaga dia tal? quanto fica?" à mão. Motor de reserva e atendimento automático liberam horas — ganho real só se as horas forem realocadas.',
        como_medir: { base: 'Horas medidas em 1 semana típica antes', metrica: 'Horas em 1 semana típica depois', janela: 'mensal' },
        receitas: ['reserva-direta'],
        fonte: { texto: 'Medir com o próprio hotel.', verificado: false }
      },
      {
        id: 'marketing', nome: 'Anúncio pagando por quem já se hospedou',
        entradas: ['gasto_anuncios_mes', 'anuncio_para_clientes_pct'],
        formula: 'gasto_anuncios_mes * anuncio_para_clientes_pct/100',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Sem base própria, o anúncio paga de novo por quem já conhece o hotel. Com base consentida, dá para excluir e falar de graça.',
        como_medir: { base: 'Custo por reserva atribuída a anúncio antes', metrica: 'Mesmo custo com lista de exclusão', janela: 'mensal' },
        receitas: ['marketing-local', 'aquisicao'],
        fonte: { texto: 'Estimativa a validar com público personalizado.', verificado: false }
      }
    ],

    receitas: {
      'reserva-direta': { nome: 'Reserva direta sem quebrar paridade', doc: 'docs/modulos/hotel-reserva-direta.md', resumo: 'Motor de reserva, tarifa fechada e benefício para quem reserva direto, base própria consentida, pré-check-in com extras.' },
      'baixa-temporada': { nome: 'Baixa temporada', doc: 'docs/modulos/hotel-baixa-temporada.md', resumo: 'Pacotes, mercado regional, corporativo e eventos; mínimo de noites nos picos; preço por demanda.' },
      'aquisicao': { nome: 'Ganho e retenção de clientes', doc: 'docs/modulos/aquisicao.md', resumo: 'OTA traz, canal próprio retém: base consentida, régua, indicação.' },
      'cobranca': { nome: 'Cobrança e pagamentos', doc: 'docs/modulos/cobranca.md', resumo: 'Taxas, garantia de reserva por Pix, antecipação só quando precisa, caixa da baixa temporada.' },
      'marketing-local': { nome: 'Marketing local e comunidade', doc: 'docs/modulos/marketing-local.md', resumo: 'Parcerias com restaurantes, atrações e eventos da cidade.' }
    },

    cacador: {
      cnaes: ['5510801', '5510802', '5590601', '5590603', '5590699'],
      sinais: [
        { id: 'nota', rotulo: 'Nota no Google', tipo: 'numero' },
        { id: 'avaliacoes', rotulo: 'Nº de avaliações no Google', tipo: 'numero' },
        { id: 'marketplace', rotulo: 'Vende por OTAs (Booking, Expedia, Decolar, Airbnb)', tipo: 'sim_nao' },
        { id: 'instagram_ativo', rotulo: 'Instagram com post nos últimos 30 dias', tipo: 'sim_nao' },
        { id: 'pedido_proprio', rotulo: 'Tem motor de reserva direta no site', tipo: 'sim_nao' },
        { id: 'whatsapp_manual', rotulo: 'Reserva direta só por WhatsApp/e-mail', tipo: 'sim_nao' },
        { id: 'fidelidade', rotulo: 'Tem programa de hóspede frequente/clube', tipo: 'sim_nao' }
      ],
      criterios: [
        { id: 'nota', sinal: 'nota', teste: 'v >= 4.5', rotulo: 'Nota no Google ≥ 4,5', peso: 15 },
        { id: 'avaliacoes', sinal: 'avaliacoes', teste: 'v >= 300', rotulo: '300+ avaliações (tem demanda)', peso: 20 },
        { id: 'marketplace', sinal: 'marketplace', teste: 'v === true', rotulo: 'Vende por OTA', peso: 20 },
        { id: 'instagram', sinal: 'instagram_ativo', teste: 'v === true', rotulo: 'Instagram ativo', peso: 10 },
        { id: 'sem_motor', sinal: 'pedido_proprio', teste: 'v === false', rotulo: 'Sem motor de reserva direta', peso: 15 },
        { id: 'whatsapp_manual', sinal: 'whatsapp_manual', teste: 'v === true', rotulo: 'Reserva direta à mão', peso: 10 },
        { id: 'sem_fidelidade', sinal: 'fidelidade', teste: 'v === false', rotulo: 'Sem programa de hóspede', peso: 10 }
      ],
      alertas: [
        { id: 'pequeno', teste: 'l.uhs != null && l.uhs < 8', texto: 'Menos de 8 UHs: receita pequena para pagar implantação.' },
        { id: 'rede', teste: 'l.uhs != null && l.uhs > 200', texto: 'Mais de 200 UHs: provavelmente rede com central própria — decisão fora do hotel.' },
        { id: 'pouca_demanda', teste: 'l.sinais.avaliacoes != null && l.sinais.avaliacoes < 50', texto: 'Poucas avaliações: talvez falte demanda.' },
        { id: 'nota_baixa', teste: 'l.sinais.nota != null && l.sinais.nota < 4.0', texto: 'Nota abaixo de 4,0: problema pode ser produto/serviço.' },
        { id: 'motel', teste: 'l.cnae === "5510803"', texto: 'Motel: dinâmica de canal diferente (fora da tese de OTA).' },
        { id: 'mei', teste: 'l.porte === "MEI"', texto: 'MEI: estrutura pequena.' },
        { id: 'inativa', teste: 'l.situacao && l.situacao !== "ATIVA"', texto: 'CNPJ não está ativo na Receita.' }
      ],
      // Receita estimada por UHs × 30 noites × ocupação 45–57% (Gramado 2024 e média)
      // × diária R$ 250–600 (premissa de faixa, sem dado oficial) × fator do vazamento
      // de OTA: 55% por OTA (FOHB) × 16% de comissão × 15% migrável (premissa).
      potencial: {
        formula: 'l.uhs ? [l.uhs * 30 * 0.45 * 250 * 0.55 * 0.16 * 0.15, l.uhs * 30 * 0.57 * 600 * 0.55 * 0.16 * 0.15] : null',
        aviso: 'Estimativa grosseira por nº de quartos, ocupação de Gramado e faixa de diária (premissa). Só serve para ordenar; o número real sai do Raio-X.'
      },
      conferir: [
        { rotulo: 'Booking', busca: 'site:booking.com {nome} {cidade}' },
        { rotulo: 'Airbnb / Decolar', busca: '{nome} {cidade} airbnb OR decolar OR expedia' },
        { rotulo: 'Cadastur', busca: 'cadastur {nome} {cidade}' }
      ],
      textos: {
        demanda: 'Vi que {nome} tem nota {nota} com {avaliacoes} avaliações no Google — hóspede vocês têm.',
        conheco_local: 'Conheço {nome}, em {local}.',
        conheco: 'Conheço {nome}.',
        sem_canal: 'Não encontrei como reservar direto no site de vocês sem passar por site de reserva ou mandar mensagem — quem já conhece a casa acaba reservando pela OTA.',
        sem_fidelidade: 'Também não vi nada para quem volta: hóspede satisfeito não tem motivo para reservar direto da próxima vez.',
        convite: 'Faço um diagnóstico de 40 minutos que mostra, em reais por mês, quanto está escapando em comissão de OTA de hóspede que já é seu, quarto vazio na baixa e taxa de cartão — sem mexer na paridade com a Booking. Sem custo: se não aparecer pelo menos R$ 3 mil por mês, eu mesmo digo que não vale mexer. Qual dia é mais tranquilo?'
      },
      abordagem: 'Pelo que vi, a casa vende bem pelos sites de reserva. O ponto é que hóspede que volta, ou que já achou vocês no Google, também paga comissão — e isso se recupera sem baixar preço no site, que a Booking não permite.'
    }
  };

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
