/*
 * Motor do Painel de Recuperação — compara cada mês com a base (diagnóstico do Raio-X).
 * Roda no navegador (window.RXP) e no Node (require) para os testes. Usa o motor do Raio-X.
 *
 * Arquivo de acompanhamento:
 *   { tipo: 'acompanhamento', pacote, cliente, base: { data, valores }, meses: [{ mes: 'AAAA-MM', valores, obs }] }
 * Um diagnóstico salvo no Raio-X ({ pacote, cliente, valores, salvoEm }) vira acompanhamento com meses vazios.
 */
(function (g) {
  var RXM = g.RXM || (typeof require !== 'undefined' && require('./motor.js'));

  function deDiagnostico(diag) {
    if (diag && diag.tipo === 'acompanhamento') return diag;
    return {
      tipo: 'acompanhamento',
      pacote: diag.pacote,
      cliente: diag.cliente || {},
      base: { data: (diag.salvoEm || new Date().toISOString()).slice(0, 10), valores: diag.valores || {} },
      meses: []
    };
  }

  // Compara um conjunto de valores com a base, vazamento a vazamento.
  // recuperado > 0 = a perda caiu; < 0 = piorou. Vazamento sem dado em um dos lados fica fora da soma.
  function comparar(pacote, valoresBase, valoresMes) {
    var antes = RXM.diagnosticar(pacote, valoresBase);
    var agora = RXM.diagnosticar(pacote, valoresMes);
    var porId = {};
    agora.itens.forEach(function (r) { porId[r.id] = r; });
    var itens = antes.itens.map(function (a) {
      var d = porId[a.id];
      var ok = a.perda !== null && d && d.perda !== null;
      var recuperado = ok ? a.perda - d.perda : null;
      return {
        id: a.id,
        vazamento: a.vazamento,
        antes: a.perda,
        agora: d ? d.perda : null,
        recuperado: recuperado,
        meta: a.recuperavel,                       // o que o Raio-X disse ser realista em 6 meses
        pctMeta: ok && a.recuperavel > 0 ? recuperado / a.recuperavel * 100 : null
      };
    });
    var comparaveis = itens.filter(function (x) { return x.recuperado !== null; });
    var soma = function (k) { return comparaveis.reduce(function (s, x) { return s + (x[k] || 0); }, 0); };
    return {
      itens: itens,
      totalAntes: soma('antes'),
      totalAgora: soma('agora'),
      recuperado: soma('recuperado'),
      meta: soma('meta'),
      pctMeta: soma('meta') > 0 ? soma('recuperado') / soma('meta') * 100 : null,
      semComparacao: itens.filter(function (x) { return x.recuperado === null; }).map(function (x) { return x.id; })
    };
  }

  // Linha do tempo: um resultado por mês, em ordem, com o acumulado recuperado.
  function linhaDoTempo(pacote, acomp) {
    var meses = (acomp.meses || []).slice().sort(function (a, b) { return a.mes < b.mes ? -1 : a.mes > b.mes ? 1 : 0; });
    var acumulado = 0;
    return meses.map(function (m) {
      var c = comparar(pacote, acomp.base.valores, m.valores);
      acumulado += c.recuperado;
      return { mes: m.mes, obs: m.obs || '', resultado: c, acumulado: acumulado };
    });
  }

  // Bônus por resultado: só sobre vazamentos marcados como atribuíveis (ex.: taxa de cartão).
  function bonus(comparacao, idsAtribuiveis, pct) {
    var base = comparacao.itens.filter(function (x) { return idsAtribuiveis.indexOf(x.id) >= 0 && x.recuperado > 0; })
      .reduce(function (s, x) { return s + x.recuperado; }, 0);
    return { base: base, valor: base * (pct || 0) / 100 };
  }

  function proximoMes(acomp) {
    var ultimos = (acomp.meses || []).map(function (m) { return m.mes; }).sort();
    var ref = ultimos.length ? ultimos[ultimos.length - 1] : acomp.base.data.slice(0, 7);
    var a = parseInt(ref.slice(0, 4), 10), m = parseInt(ref.slice(5, 7), 10) + 1;
    if (m > 12) { m = 1; a++; }
    return a + '-' + (m < 10 ? '0' : '') + m;
  }

  var api = { deDiagnostico: deDiagnostico, comparar: comparar, linhaDoTempo: linhaDoTempo, bonus: bonus, proximoMes: proximoMes };
  g.RXP = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
