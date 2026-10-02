/*
 * Herança de pacotes de setor: um PERFIL herda de um pacote BASE e troca só o
 * que muda. Carregar este arquivo antes dos pacotes que herdam.
 *
 *   RXM_HERDAR(base, perfil) → pacote completo
 *
 * Regras:
 *  - campos simples do perfil substituem os da base;
 *  - listas com id (grupos, entradas, vazamentos, cacador.sinais/criterios/alertas)
 *    juntam por id: item com mesmo id é mesclado campo a campo, id novo entra no fim;
 *  - perfil.remover = { entradas: [...], vazamentos: [...], ... } tira itens da base;
 *  - objetos (receitas, cacador.textos, cacador.potencial) são mesclados;
 *  - perfil.termos = { cliente: 'paciente', ... } troca {cliente}/{Cliente} em todos
 *    os textos (o que não estiver em termos usa base.termos).
 */
(function (g) {
  var LISTAS = ['grupos', 'entradas', 'vazamentos'];
  var LISTAS_CACADOR = ['sinais', 'criterios', 'alertas'];

  function copiar(x) { return JSON.parse(JSON.stringify(x)); }

  function juntarPorId(base, extra, remover) {
    var fora = {};
    (remover || []).forEach(function (id) { fora[id] = 1; });
    var saida = (base || []).filter(function (i) { return !fora[i.id]; }).map(copiar);
    (extra || []).forEach(function (item) {
      var alvo = saida.filter(function (i) { return i.id === item.id; })[0];
      if (alvo) Object.keys(item).forEach(function (k) { alvo[k] = copiar(item[k]); });
      else saida.push(copiar(item));
    });
    return saida;
  }

  function trocarTermos(valor, termos) {
    if (typeof valor === 'string') {
      return valor.replace(/\{([A-Za-zÀ-ú_]+)\}/g, function (m, chave) {
        var minus = chave.charAt(0).toLowerCase() + chave.slice(1);
        if (!(minus in termos)) return m; // placeholders de outro uso ({nome}, {nota}...) ficam
        var t = termos[minus];
        return chave.charAt(0) === chave.charAt(0).toUpperCase() && chave.charAt(0) !== chave.charAt(0).toLowerCase()
          ? t.charAt(0).toUpperCase() + t.slice(1) : t;
      });
    }
    if (Array.isArray(valor)) return valor.map(function (v) { return trocarTermos(v, termos); });
    if (valor && typeof valor === 'object') {
      var o = {};
      Object.keys(valor).forEach(function (k) { o[k] = trocarTermos(valor[k], termos); });
      return o;
    }
    return valor;
  }

  function herdar(base, perfil) {
    var rem = perfil.remover || {};
    var p = copiar(base);
    Object.keys(perfil).forEach(function (k) {
      if (LISTAS.indexOf(k) >= 0 || ['cacador', 'receitas', 'remover', 'termos'].indexOf(k) >= 0) return;
      p[k] = copiar(perfil[k]);
    });
    LISTAS.forEach(function (k) { p[k] = juntarPorId(base[k], perfil[k], rem[k]); });
    p.receitas = Object.assign({}, copiar(base.receitas || {}), copiar(perfil.receitas || {}));
    (rem.receitas || []).forEach(function (id) { delete p.receitas[id]; });
    var bc = base.cacador || {}, pc = perfil.cacador || {};
    p.cacador = Object.assign({}, copiar(bc), copiar(pc));
    LISTAS_CACADOR.forEach(function (k) { p.cacador[k] = juntarPorId(bc[k], pc[k], (rem.cacador || {})[k]); });
    p.cacador.textos = Object.assign({}, copiar(bc.textos || {}), copiar(pc.textos || {}));
    p.cacador.potencial = Object.assign({}, copiar(bc.potencial || {}), copiar(pc.potencial || {}));
    // vazamento que perdeu entrada ou receita por remoção é erro do perfil: o teste de integridade acusa
    var termos = Object.assign({}, base.termos || {}, perfil.termos || {});
    p.termos = termos;
    if (perfil.id !== base.id) p.base = base.id;
    delete p.remover;
    return trocarTermos(p, termos);
  }

  g.RXM_HERDAR = herdar;
  if (typeof module !== 'undefined' && module.exports) module.exports = herdar;
})(typeof window !== 'undefined' ? window : globalThis);
