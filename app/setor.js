/*
 * Escolha do pacote de setor nas telas: ?setor=<id> na URL, senão o último
 * usado neste navegador, senão o primeiro carregado. Monta o seletor em
 * #seletor-setor e recarrega a página ao trocar.
 */
(function (g) {
  function escolher() {
    var setores = g.RXM_SETORES || {};
    var ids = Object.keys(setores);
    var pedido = new URLSearchParams(location.search).get('setor');
    var salvo = null;
    try { salvo = localStorage.getItem('rxm:setor'); } catch (e) { salvo = null; }
    var id = [pedido, salvo, 'restaurante', ids[0]].filter(function (x) { return x && setores[x]; })[0];
    try { localStorage.setItem('rxm:setor', id); } catch (e) { /* sem storage */ }
    var el = document.getElementById('seletor-setor');
    if (el) {
      el.innerHTML = ids.map(function (k) {
        return '<option value="' + k + '"' + (k === id ? ' selected' : '') + '>' + setores[k].nome + ' · ' + setores[k].mercado + '</option>';
      }).join('');
      el.onchange = function () {
        var u = new URL(location.href);
        u.search = '';
        u.searchParams.set('setor', el.value);
        location.href = u.toString();
      };
    }
    return setores[id];
  }
  g.RXM_ESCOLHER_SETOR = escolher;
})(window);
