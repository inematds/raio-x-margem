/*
 * Motor do Raio-X de Margem — calcula vazamentos a partir de um pacote de setor.
 * Roda no navegador (window.RXM) e no Node (require) para os testes.
 */
(function (g) {
  var VERSAO = '0.1.0';

  function numero(v) {
    if (v === null || v === undefined || v === '') return null;
    var s = String(v).trim();
    // "1.234,5" (formato BR) → 1234.5; "3.2" (input number) fica como está
    if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
    var n = typeof v === 'number' ? v : parseFloat(s);
    return isFinite(n) ? n : null;
  }

  var cacheFormulas = {};
  function compilar(vaz) {
    if (!cacheFormulas[vaz.formula]) {
      cacheFormulas[vaz.formula] = new Function(vaz.entradas.join(','), '"use strict"; return (' + vaz.formula + ');');
    }
    return cacheFormulas[vaz.formula];
  }

  // Calcula um vazamento. Retorna null em `perda` se faltar algum dado.
  function calcularVazamento(vaz, valores) {
    var args = [], faltando = [];
    vaz.entradas.forEach(function (id) {
      var n = numero(valores[id]);
      if (n === null) faltando.push(id);
      args.push(n);
    });
    if (faltando.length) return { id: vaz.id, perda: null, recuperavel: null, faltando: faltando };
    var perda = Math.max(0, compilar(vaz).apply(null, args) || 0);
    var recuperavel = perda * vaz.recuperavel_pct / 100;
    return {
      id: vaz.id,
      perda: perda,
      recuperavel: recuperavel,
      faltando: [],
      // prioridade: dinheiro recuperável por ponto de dificuldade, acelerado se for rápido
      prioridade: recuperavel / vaz.dificuldade / Math.sqrt(Math.max(1, vaz.prazo_semanas) / 4)
    };
  }

  function diagnosticar(pacote, valores) {
    var itens = pacote.vazamentos.map(function (v) {
      var r = calcularVazamento(v, valores);
      r.vazamento = v;
      return r;
    });
    var calculados = itens.filter(function (r) { return r.perda !== null; });
    var total = calculados.reduce(function (s, r) { return s + r.perda; }, 0);
    var recuperavel = calculados.reduce(function (s, r) { return s + r.recuperavel; }, 0);
    var ranking = calculados.filter(function (r) { return r.perda > 0; })
      .sort(function (a, b) { return b.prioridade - a.prioridade; });
    var fat = numero(valores.faturamento);
    return {
      itens: itens,
      ranking: ranking,
      semDados: itens.filter(function (r) { return r.perda === null; }),
      totalMensal: total,
      totalAnual: total * 12,
      recuperavelMensal: recuperavel,
      pctFaturamento: fat ? total / fat * 100 : null
    };
  }

  var api = { VERSAO: VERSAO, numero: numero, calcularVazamento: calcularVazamento, diagnosticar: diagnosticar };
  g.RXM = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
