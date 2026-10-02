/*
 * Pacote de setor: RESTAURANTE (delivery + salão)
 *
 * Um pacote de setor é DADO, não código: perguntas, fórmulas dos vazamentos,
 * quanto dá para recuperar, como medir depois e quais receitas resolvem.
 * Para criar outro setor (hotel, clínica, salão...), copie este arquivo,
 * troque o id e edite os dados. O motor (app/motor.js) não muda.
 *
 * Fórmulas são expressões JavaScript avaliadas localmente. Pacotes são
 * arquivos confiáveis do próprio implantador — não carregue pacote de terceiros
 * sem ler.
 *
 * Campo `fonte.verificado`: true só quando o número de referência tem fonte
 * pública citada em docs/ANALISE.md. Caso contrário é premissa a confirmar com
 * o cliente.
 */
(function (g) {
  var pacote = {
    id: 'restaurante',
    nome: 'Restaurante (delivery + salão)',
    versao: '0.2.0',
    // Mercado, não só idioma: ES = América Latina, EN = modelo global.
    // Outro mercado = outro pacote (plataformas, pagamentos e referências locais).
    mercado: 'BR',
    idioma: 'pt-BR',
    moeda: 'BRL',

    // ───────────────────────── Perguntas ─────────────────────────
    // Todas em valores MENSAIS. Campo vazio = "não sei" → o vazamento que
    // depende dele fica fora da soma e aparece como "sem dados".
    grupos: [
      { id: 'geral', titulo: 'Números gerais do negócio' },
      { id: 'delivery', titulo: 'Marketplace e delivery' },
      { id: 'pagamentos', titulo: 'Pagamentos e caixa' },
      { id: 'clientes', titulo: 'Clientes e vendas' },
      { id: 'cozinha', titulo: 'Cozinha, compras e cardápio' },
      { id: 'operacao', titulo: 'Operação e marketing' }
    ],

    entradas: [
      { id: 'faturamento', grupo: 'geral', rotulo: 'Faturamento total do mês', unidade: 'R$', exemplo: 150000 },
      { id: 'pedidos_mes', grupo: 'geral', rotulo: 'Pedidos/contas por mês (salão + delivery)', unidade: 'un', exemplo: 3000 },
      { id: 'ticket_medio', grupo: 'geral', rotulo: 'Ticket médio', unidade: 'R$', exemplo: 50 },
      { id: 'margem_contrib_pct', grupo: 'geral', rotulo: 'Margem de contribuição média (preço − CMV − embalagem)', unidade: '%', exemplo: 60,
        ajuda: 'Se não souber, 55–65% é comum em comida pronta; confirme com o CMV real.' },

      { id: 'fat_marketplace', grupo: 'delivery', rotulo: 'Faturamento via marketplaces (iFood, 99Food, Keeta, Rappi)', unidade: 'R$', exemplo: 100000 },
      { id: 'taxa_marketplace_pct', grupo: 'delivery', rotulo: 'Custo efetivo do marketplace (comissão + taxa de pagamento + promoções bancadas + mensalidade ÷ faturamento)', unidade: '%', exemplo: 25,
        ajuda: 'Calcule pelo extrato/repasse: (vendido − recebido) ÷ vendido. Não use a comissão da tabela.' },
      { id: 'custo_canal_proprio_pct', grupo: 'delivery', rotulo: 'Custo do canal próprio por pedido (pagamento + software + entrega extra)', unidade: '%', exemplo: 15,
        ajuda: 'Pix custa pouco; cartão online e entregador próprio pesam. Seja conservador.' },
      { id: 'recompra_marketplace_pct', grupo: 'delivery', rotulo: 'Parte do faturamento do marketplace que vem de clientes que JÁ compraram antes', unidade: '%', exemplo: 30,
        ajuda: 'Painel do marketplace mostra recorrência; se não houver, 30–50% é premissa a validar.' },

      { id: 'fat_cartao', grupo: 'pagamentos', rotulo: 'Vendas no cartão (maquininha/link) no mês', unidade: 'R$', exemplo: 60000 },
      { id: 'mdr_atual_pct', grupo: 'pagamentos', rotulo: 'Taxa média atual do cartão (MDR ponderado débito+crédito)', unidade: '%', exemplo: 3.2 },
      { id: 'mdr_referencia_pct', grupo: 'pagamentos', rotulo: 'Taxa negociável de referência para esse volume', unidade: '%', exemplo: 2.2,
        ajuda: 'Peça proposta a 2–3 adquirentes com o extrato na mão.' },
      { id: 'valor_antecipado', grupo: 'pagamentos', rotulo: 'Valor antecipado no mês', unidade: 'R$', exemplo: 0 },
      { id: 'custo_antecipacao_pct', grupo: 'pagamentos', rotulo: 'Custo da antecipação (% sobre o valor antecipado)', unidade: '%', exemplo: 0 },
      { id: 'chargeback_mes', grupo: 'pagamentos', rotulo: 'Perdas com chargeback/estorno/diferença de conciliação', unidade: 'R$', exemplo: 0 },
      { id: 'juros_multas_mes', grupo: 'pagamentos', rotulo: 'Juros de cheque especial, multas e encargos por atraso', unidade: 'R$', exemplo: 0 },

      { id: 'clientes_novos_mes', grupo: 'clientes', rotulo: 'Clientes novos por mês (todos os canais)', unidade: 'un', exemplo: 400 },
      { id: 'retorno_atual_pct', grupo: 'clientes', rotulo: 'Desses, quantos voltam em 60 dias hoje', unidade: '%', exemplo: 20 },
      { id: 'retorno_meta_pct', grupo: 'clientes', rotulo: 'Meta de retorno com CRM + reativação', unidade: '%', exemplo: 35 },
      { id: 'pedidos_mes_recorrente', grupo: 'clientes', rotulo: 'Pedidos por mês de um cliente recorrente', unidade: 'un', exemplo: 2 },
      { id: 'pct_com_adicional_atual', grupo: 'clientes', rotulo: 'Pedidos que levam bebida/sobremesa/adicional hoje', unidade: '%', exemplo: 25 },
      { id: 'pct_com_adicional_meta', grupo: 'clientes', rotulo: 'Meta com oferta automática (combo, upsell)', unidade: '%', exemplo: 40 },
      { id: 'valor_adicional', grupo: 'clientes', rotulo: 'Valor médio do adicional', unidade: 'R$', exemplo: 12 },

      { id: 'cmv_mes', grupo: 'cozinha', rotulo: 'CMV do mês (insumos consumidos)', unidade: 'R$', exemplo: 45000 },
      { id: 'desperdicio_pct', grupo: 'cozinha', rotulo: 'Desperdício estimado (% do CMV)', unidade: '%', exemplo: 10 },
      { id: 'desperdicio_ref_pct', grupo: 'cozinha', rotulo: 'Desperdício aceitável de referência', unidade: '%', exemplo: 4 },
      { id: 'compras_mes', grupo: 'cozinha', rotulo: 'Compras com fornecedores no mês', unidade: 'R$', exemplo: 45000 },
      { id: 'sobrepreco_compras_pct', grupo: 'cozinha', rotulo: 'Sobrepreço evitável em compras (cotação, compra emergencial)', unidade: '%', exemplo: 3 },
      { id: 'vendas_baixa_margem_pct', grupo: 'cozinha', rotulo: 'Parte das vendas em itens com margem abaixo da média', unidade: '%', exemplo: 30 },
      { id: 'gap_margem_pp', grupo: 'cozinha', rotulo: 'Quantos pontos de margem esses itens ficam abaixo', unidade: 'p.p.', exemplo: 15 },
      { id: 'realocavel_pct', grupo: 'cozinha', rotulo: 'Parte dessas vendas que dá para mover para itens melhores (destaque, combo, preço)', unidade: '%', exemplo: 20 },

      { id: 'horas_repetitivas_semana', grupo: 'operacao', rotulo: 'Horas/semana da equipe em WhatsApp, anotar pedido, confirmar pagamento', unidade: 'h', exemplo: 40 },
      { id: 'custo_hora', grupo: 'operacao', rotulo: 'Custo da hora de trabalho com encargos', unidade: 'R$', exemplo: 15 },
      { id: 'gasto_anuncios_mes', grupo: 'operacao', rotulo: 'Gasto com anúncios (Meta, Google, impulsionar)', unidade: 'R$', exemplo: 2000 },
      { id: 'anuncio_para_clientes_pct', grupo: 'operacao', rotulo: 'Parte desse gasto que alcança quem já é cliente', unidade: '%', exemplo: 40,
        ajuda: 'Sem lista própria de clientes, o anúncio paga de novo por quem já conhece a casa.' }
    ],

    // ───────────────────────── Vazamentos ─────────────────────────
    // formula   → perda mensal em R$ (o "vazamento")
    // recuperavel_pct → quanto disso é realista recuperar em 6 meses
    // dificuldade 1 (fácil) … 5 (difícil); prazo em semanas até o 1º efeito
    // como_medir → base (antes) e métrica (depois); sustenta o Painel
    vazamentos: [
      {
        id: 'marketplace', nome: 'Marketplace cobrando de novo por cliente que já é seu',
        entradas: ['fat_marketplace', 'recompra_marketplace_pct', 'taxa_marketplace_pct', 'custo_canal_proprio_pct'],
        formula: 'fat_marketplace * recompra_marketplace_pct/100 * Math.max(0, taxa_marketplace_pct - custo_canal_proprio_pct)/100',
        recuperavel_pct: 40, dificuldade: 3, prazo_semanas: 6,
        explicacao: 'Cada pedido de cliente recorrente feito pelo marketplace paga a comissão de novo. A diferença entre o custo do marketplace e o do canal próprio, nesses pedidos, é o vazamento.',
        como_medir: { base: 'Faturamento e custo efetivo do marketplace nos 3 meses anteriores', metrica: 'Pedidos no canal próprio de clientes vindos do marketplace × diferença de custo', janela: 'mensal, comparando mesmo período e descontando promoções do marketplace' },
        receitas: ['cardapio-vivo', 'aquisicao', 'marketing-local', 'canal-proprio'],
        fonte: { texto: 'Exemplo do documento de origem: R$ 30 mil migrados × 10 p.p. = R$ 3 mil/mês. Custo efetivo do marketplace vem do extrato do cliente.', verificado: false }
      },
      {
        id: 'pagamentos', nome: 'Taxas de cartão acima do mercado',
        entradas: ['fat_cartao', 'mdr_atual_pct', 'mdr_referencia_pct'],
        formula: 'fat_cartao * Math.max(0, mdr_atual_pct - mdr_referencia_pct)/100',
        recuperavel_pct: 70, dificuldade: 1, prazo_semanas: 2,
        explicacao: 'MDR acima do que o volume permite negociar. É o vazamento mais rápido de fechar: proposta de outra adquirente com o extrato na mão.',
        como_medir: { base: 'Extrato da adquirente dos 3 meses anteriores (taxa efetiva)', metrica: 'Taxa efetiva nova × volume do mês', janela: 'mensal' },
        receitas: ['cobranca'],
        fonte: { texto: 'Referência de MDR: ver docs/ANALISE.md (pagamentos).', verificado: false }
      },
      {
        id: 'antecipacao', nome: 'Antecipação de recebíveis e perdas de conciliação',
        entradas: ['valor_antecipado', 'custo_antecipacao_pct', 'chargeback_mes'],
        formula: 'valor_antecipado * custo_antecipacao_pct/100 + chargeback_mes',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Antecipar por hábito, sem precisar, custa juros. Estorno e diferença de repasse que ninguém confere viram perda silenciosa.',
        como_medir: { base: 'Custo de antecipação e diferenças de conciliação dos 3 meses anteriores', metrica: 'Mesmos itens no mês atual', janela: 'mensal' },
        receitas: ['cobranca'],
        fonte: { texto: 'Valores do próprio extrato do cliente.', verificado: true }
      },
      {
        id: 'caixa', nome: 'Juros, multas e encargos por falta de previsão de caixa',
        entradas: ['juros_multas_mes'],
        formula: 'juros_multas_mes',
        recuperavel_pct: 60, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Conta paga atrasada e cheque especial são sintoma de caixa sem previsão.',
        como_medir: { base: 'Encargos pagos nos 3 meses anteriores', metrica: 'Encargos pagos no mês', janela: 'mensal' },
        receitas: ['cobranca'],
        fonte: { texto: 'Valores do próprio extrato bancário.', verificado: true }
      },
      {
        id: 'retencao', nome: 'Clientes que compram uma vez e não voltam',
        entradas: ['clientes_novos_mes', 'retorno_atual_pct', 'retorno_meta_pct', 'ticket_medio', 'pedidos_mes_recorrente', 'margem_contrib_pct'],
        formula: 'clientes_novos_mes * Math.max(0, retorno_meta_pct - retorno_atual_pct)/100 * ticket_medio * pedidos_mes_recorrente * margem_contrib_pct/100',
        recuperavel_pct: 50, dificuldade: 3, prazo_semanas: 8,
        explicacao: 'Margem que deixa de entrar porque ninguém fala com o cliente depois da primeira compra. Calculado em margem, não em faturamento.',
        como_medir: { base: 'Taxa de retorno em 60 dias da coorte de clientes novos antes do CRM', metrica: 'Mesma taxa nas coortes após o CRM', janela: 'por coorte mensal' },
        receitas: ['aquisicao', 'marketing-local'],
        fonte: { texto: 'Meta de retorno é premissa do implantador; validar após 2 coortes.', verificado: false }
      },
      {
        id: 'ticket', nome: 'Ticket médio baixo (ninguém oferece o adicional)',
        entradas: ['pedidos_mes', 'pct_com_adicional_atual', 'pct_com_adicional_meta', 'valor_adicional', 'margem_contrib_pct'],
        formula: 'pedidos_mes * Math.max(0, pct_com_adicional_meta - pct_com_adicional_atual)/100 * valor_adicional * margem_contrib_pct/100',
        recuperavel_pct: 60, dificuldade: 2, prazo_semanas: 3,
        explicacao: 'Bebida, sobremesa e combo oferecidos na hora certa (no cardápio próprio, no atendimento automático) aumentam a margem por pedido.',
        como_medir: { base: '% de pedidos com adicional nos 30 dias anteriores', metrica: '% atual × valor médio do adicional', janela: 'mensal' },
        receitas: ['cardapio-vivo'],
        fonte: { texto: 'Taxa de adicional sai do relatório de vendas do PDV.', verificado: false }
      },
      {
        id: 'desperdicio', nome: 'Desperdício e estoque',
        entradas: ['cmv_mes', 'desperdicio_pct', 'desperdicio_ref_pct'],
        formula: 'cmv_mes * Math.max(0, desperdicio_pct - desperdicio_ref_pct)/100',
        recuperavel_pct: 40, dificuldade: 4, prazo_semanas: 8,
        explicacao: 'Compra em excesso, produto vencendo, porção inconsistente. Exige pesagem e ficha técnica — é o mais trabalhoso.',
        como_medir: { base: 'Registro de descarte por 2 semanas antes', metrica: 'Descarte registrado ÷ CMV', janela: 'quinzenal' },
        receitas: [],
        fonte: { texto: 'Referência de desperdício: ver docs/ANALISE.md.', verificado: false }
      },
      {
        id: 'compras', nome: 'Compras sem cotação e fornecedor por hábito',
        entradas: ['compras_mes', 'sobrepreco_compras_pct'],
        formula: 'compras_mes * sobrepreco_compras_pct/100',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Preço que sobe sem ninguém ver, compra emergencial, falta de comparação.',
        como_medir: { base: 'Preço pago dos 20 itens mais comprados nos 3 meses anteriores', metrica: 'Preço pago atual dos mesmos itens', janela: 'mensal' },
        receitas: [],
        fonte: { texto: 'Sobrepreço é premissa; confirmar com 1 rodada de cotação.', verificado: false }
      },
      {
        id: 'cardapio', nome: 'Cardápio vendendo mais o que dá menos lucro',
        entradas: ['faturamento', 'vendas_baixa_margem_pct', 'gap_margem_pp', 'realocavel_pct'],
        formula: 'faturamento * vendas_baixa_margem_pct/100 * realocavel_pct/100 * gap_margem_pp/100',
        recuperavel_pct: 60, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Engenharia de cardápio: destacar e montar combos com os itens de maior margem, revisar preço dos que vendem muito e pouco rendem.',
        como_medir: { base: 'Mix de vendas e margem por item no mês anterior', metrica: 'Margem média ponderada do mix atual', janela: 'mensal' },
        receitas: ['cardapio-vivo'],
        fonte: { texto: 'Precisa de ficha técnica (custo por item).', verificado: false }
      },
      {
        id: 'mao_de_obra', nome: 'Equipe presa em tarefa repetitiva',
        entradas: ['horas_repetitivas_semana', 'custo_hora'],
        formula: 'horas_repetitivas_semana * 4.33 * custo_hora',
        recuperavel_pct: 50, dificuldade: 3, prazo_semanas: 6,
        explicacao: 'Responder a mesma pergunta, anotar pedido, conferir Pix. Automação libera horas — o ganho é real só se as horas forem realocadas ou deixarem de ser pagas.',
        como_medir: { base: 'Horas medidas em 1 semana típica antes', metrica: 'Horas medidas em 1 semana típica depois', janela: 'mensal' },
        receitas: ['cardapio-vivo'],
        fonte: { texto: 'Medir com o próprio cliente; não estimar.', verificado: false }
      },
      {
        id: 'marketing', nome: 'Anúncio pagando de novo por quem já é cliente',
        entradas: ['gasto_anuncios_mes', 'anuncio_para_clientes_pct'],
        formula: 'gasto_anuncios_mes * anuncio_para_clientes_pct/100',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 4,
        explicacao: 'Sem base própria, não dá para excluir clientes atuais do público do anúncio nem falar com eles de graça.',
        como_medir: { base: 'Custo por pedido atribuído a anúncio antes', metrica: 'Mesmo custo com lista de exclusão e canal próprio', janela: 'mensal' },
        receitas: ['marketing-local', 'aquisicao'],
        fonte: { texto: 'Parte que alcança clientes é estimativa; validar com público personalizado.', verificado: false }
      }
    ],

    // ───────────────── Receitas (módulos de correção) ─────────────────
    // Detalhe em docs/modulos/<id>.md
    receitas: {
      'cardapio-vivo': { nome: 'Cardápio Vivo', doc: 'docs/modulos/cardapio-vivo.md', resumo: 'Cardápio próprio que muda todo dia e se espalha sozinho (Google, Instagram, status do WhatsApp).' },
      'aquisicao': { nome: 'Ganho e retenção de clientes', doc: 'docs/modulos/aquisicao.md', resumo: 'Marketplace traz, canal próprio retém: captura de contato, CRM, reativação e indicação.' },
      'cobranca': { nome: 'Cobrança e pagamentos', doc: 'docs/modulos/cobranca.md', resumo: 'Renegociar taxas, Pix, conciliação, antecipação só quando precisa, previsão de caixa.' },
      'marketing-local': { nome: 'Marketing local e comunidade', doc: 'docs/modulos/marketing-local.md', resumo: 'O restaurante como ponto de encontro do bairro: canal, parcerias, eventos, indicação.' },
      'canal-proprio': { nome: '100% canal próprio', doc: 'docs/modulos/canal-proprio.md', resumo: 'Sair do marketplace em etapas, com peças de código aberto, quando a marca do bairro sustenta.' }
    },

    // ───────────── Caçador de Margem: critérios de lead ─────────────
    // Usado pelo Caçador (app/cacador.html). Pontuação 0–100.
    // Cada critério lê um SINAL do lead (lead.sinais[sinal]) e aplica o teste.
    // Sinal desconhecido (null) não pontua e conta como "a conferir".
    cacador: {
      // CNAEs que entram na lista (Receita Federal, sem pontuação)
      cnaes: ['5611201', '5611203', '5611204', '5611205', '5620104'],
      sinais: [
        { id: 'nota', rotulo: 'Nota no Google', tipo: 'numero' },
        { id: 'avaliacoes', rotulo: 'Nº de avaliações no Google', tipo: 'numero' },
        { id: 'marketplace', rotulo: 'Está em marketplace de delivery', tipo: 'sim_nao' },
        { id: 'instagram_ativo', rotulo: 'Instagram com post nos últimos 30 dias', tipo: 'sim_nao' },
        { id: 'pedido_proprio', rotulo: 'Tem pedido online próprio estruturado', tipo: 'sim_nao' },
        { id: 'whatsapp_manual', rotulo: 'Pedido por WhatsApp atendido à mão', tipo: 'sim_nao' },
        { id: 'fidelidade', rotulo: 'Tem fidelidade/clube/cashback visível', tipo: 'sim_nao' }
      ],
      criterios: [
        { id: 'nota', sinal: 'nota', teste: 'v >= 4.5', rotulo: 'Nota no Google ≥ 4,5', peso: 15 },
        { id: 'avaliacoes', sinal: 'avaliacoes', teste: 'v >= 500', rotulo: '500+ avaliações (tem demanda)', peso: 20 },
        { id: 'marketplace', sinal: 'marketplace', teste: 'v === true', rotulo: 'Ativo em marketplace de delivery', peso: 20 },
        { id: 'instagram', sinal: 'instagram_ativo', teste: 'v === true', rotulo: 'Instagram ativo', peso: 10 },
        { id: 'sem_pedido_proprio', sinal: 'pedido_proprio', teste: 'v === false', rotulo: 'Sem pedido próprio estruturado', peso: 15 },
        { id: 'whatsapp_manual', sinal: 'whatsapp_manual', teste: 'v === true', rotulo: 'WhatsApp atendido à mão', peso: 10 },
        { id: 'sem_fidelidade', sinal: 'fidelidade', teste: 'v === false', rotulo: 'Sem fidelidade/CRM visível', peso: 10 }
      ],
      // Quando a tese falha (docs/ANALISE.md §3.5): não descarta, avisa.
      alertas: [
        { id: 'pouca_demanda', teste: 'l.sinais.avaliacoes != null && l.sinais.avaliacoes < 100', texto: 'Poucas avaliações: talvez falte demanda, não canal.' },
        { id: 'nota_baixa', teste: 'l.sinais.nota != null && l.sinais.nota < 4.0', texto: 'Nota abaixo de 4,0: problema pode ser produto/serviço.' },
        { id: 'mei', teste: 'l.porte === "MEI"', texto: 'MEI: faturamento pequeno para pagar implantação.' },
        { id: 'inativa', teste: 'l.situacao && l.situacao !== "ATIVA"', texto: 'CNPJ não está ativo na Receita.' },
        { id: 'so_delivery', teste: 'l.cnae === "5620104"', texto: 'Só delivery (CNAE 5620-1/04): migrar cliente é mais difícil.' }
      ],
      // Potencial = faixa grosseira para ORDENAR a lista, nunca para prometer.
      // Faturamento mensal pelo porte declarado na Receita (limites legais do
      // Simples/porte; EPP tem faixa larga). Depois aplica a conta do marketplace.
      potencial: {
        faturamento_por_porte: { MEI: [0, 6750], ME: [6750, 30000], EPP: [30000, 400000], DEMAIS: [400000, 1000000] },
        // fração do faturamento que vaza: delivery 58% × marketplace 54% (Abrasel)
        // × recompra 30% (premissa) × 10 p.p. de diferença de custo (premissa)
        fator: 0.58 * 0.54 * 0.30 * 0.10,
        aviso: 'Estimativa grosseira pelo porte da Receita e médias do setor. Só serve para ordenar; o número real sai do Raio-X.'
      },
      conferir: [
        { rotulo: 'iFood', busca: 'site:ifood.com.br {onde}' },
        { rotulo: '99Food / Keeta', busca: '{nome} {cidade} 99food OR keeta' }
      ],
      textos: {
        demanda: 'Vi que {nome} tem nota {nota} com {avaliacoes} avaliações no Google — demanda vocês têm.',
        conheco_local: 'Conheço {nome} aqui no {local}.',
        conheco: 'Conheço {nome}.',
        sem_canal: 'Não encontrei um jeito de pedir direto com vocês sem passar por aplicativo — cada cliente que volta poderia voltar por um canal de vocês.',
        sem_fidelidade: 'Também não vi programa de fidelidade: cliente que compra uma vez não tem motivo para voltar.',
        convite: 'Faço um diagnóstico de 40 minutos que mostra, em reais por mês, quanto está escapando em taxa de marketplace, cartão e cliente que não volta. Sem custo: se não aparecer pelo menos R$ 2 mil por mês, eu mesmo digo que não vale mexer. Qual dia é mais tranquilo?'
      },
      abordagem: 'Seu restaurante claramente já tem demanda. O problema não parece ser conseguir clientes. É que, cada vez que seu cliente volta pelo marketplace, você paga de novo para falar com alguém que já conhece sua marca.'
    }
  };

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
