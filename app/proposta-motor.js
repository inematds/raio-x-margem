/*
 * Motor do gerador de proposta — monta escopo, preço sugerido e medição a partir do Raio-X.
 * Roda no navegador (window.RXPR) e no Node (require) para os testes. Usa o motor do Raio-X.
 *
 * Regra de preço do kit (kit-comercial/precificacao.md): tudo somado ≤ 1/3 do recuperável mensal.
 * "Tudo somado" = mensalidade + implantação diluída em 6 meses (o horizonte do "recuperável").
 */
(function (g) {
  var RXM = g.RXM || (typeof require !== 'undefined' && require('./motor.js'));
  var HORIZONTE = 6;          // meses do "recuperável" e da diluição da implantação
  var TETO = 1 / 3;           // custo mensal equivalente ≤ 1/3 do recuperável mensal
  var ATRIBUIVEIS = ['pagamentos', 'antecipacao'];  // bônus só sobre o que dá para provar com documento

  function arredondar(v) {
    if (v <= 0) return 0;
    var passo = v >= 10000 ? 500 : v >= 1000 ? 50 : 10;
    return Math.round(v / passo) * passo;
  }

  // Escopo: as prioridades do Raio-X, agrupadas pela receita (módulo) que resolve cada uma.
  function montar(pacote, valores, quantas) {
    var d = RXM.diagnosticar(pacote, valores);
    var prioridades = d.ranking.slice(0, quantas || 4);
    var porReceita = {};
    prioridades.forEach(function (r) {
      var id = r.vazamento.receitas[0] || 'processo-interno';
      if (!porReceita[id]) {
        var rec = pacote.receitas[id] || { nome: id, resumo: '' };
        porReceita[id] = { id: id, nome: rec.nome, resumo: rec.resumo, vazamentos: [], recuperavel: 0, prazo: 0 };
      }
      var m = porReceita[id];
      m.vazamentos.push(r.vazamento.nome);
      m.recuperavel += r.recuperavel;
      m.prazo = Math.max(m.prazo, r.vazamento.prazo_semanas);
    });
    var modulos = Object.keys(porReceita).map(function (k) { return porReceita[k]; })
      .sort(function (a, b) { return a.prazo - b.prazo; });   // o mais rápido primeiro paga o resto
    var recuperavel = prioridades.reduce(function (s, r) { return s + r.recuperavel; }, 0);
    var perda = prioridades.reduce(function (s, r) { return s + r.perda; }, 0);
    // Sugestão: implantação ≈ metade do recuperável mensal de cada módulo; mensalidade ≈ 15% do recuperável.
    // Assim o custo mensal equivalente fica em ~0,15 + 0,5×n/6 ≤ 1/3 para até 2 módulos; acima disso, ajustar() corta.
    modulos.forEach(function (m) { m.preco = arredondar(m.recuperavel * 0.5); });
    var proposta = {
      diagnostico: d,
      prioridades: prioridades,
      perda: perda,
      recuperavel: recuperavel,
      modulos: modulos,
      mensalidade: arredondar(recuperavel * 0.15),
      bonusPct: 15,
      atribuiveis: prioridades.filter(function (r) { return ATRIBUIVEIS.indexOf(r.id) >= 0; }).map(function (r) { return r.id; }),
      medicao: prioridades.map(function (r) { return { vazamento: r.vazamento.nome, base: r.vazamento.como_medir.base, metrica: r.vazamento.como_medir.metrica, janela: r.vazamento.como_medir.janela }; })
    };
    return ajustar(proposta);
  }

  // Se a sugestão passar do teto, reduz implantação e mensalidade na mesma proporção.
  function ajustar(p) {
    var a = avaliar(p);
    if (a.dentroDoTeto || a.custoMensal === 0) return p;
    var fator = (p.recuperavel * TETO) / a.custoMensal;
    p.modulos.forEach(function (m) { m.preco = arredondar(m.preco * fator); });
    p.mensalidade = arredondar(p.mensalidade * fator);
    return p;
  }

  function avaliar(p, selecionados) {
    var mods = selecionados ? p.modulos.filter(function (m) { return selecionados.indexOf(m.id) >= 0; }) : p.modulos;
    var implantacao = mods.reduce(function (s, m) { return s + (m.preco || 0); }, 0);
    var recuperavel = mods.reduce(function (s, m) { return s + m.recuperavel; }, 0);
    var custoMensal = (p.mensalidade || 0) + implantacao / HORIZONTE;
    var liquido = recuperavel - (p.mensalidade || 0);
    return {
      implantacao: implantacao,
      recuperavel: recuperavel,
      custoMensal: custoMensal,
      teto: recuperavel * TETO,
      dentroDoTeto: custoMensal <= recuperavel * TETO + 0.01,
      payback: liquido > 0 ? implantacao / liquido : null,   // meses para a implantação se pagar
      liquidoMensal: liquido
    };
  }

  var api = { montar: montar, avaliar: avaliar, ajustar: ajustar, arredondar: arredondar, HORIZONTE: HORIZONTE, TETO: TETO };
  g.RXPR = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
