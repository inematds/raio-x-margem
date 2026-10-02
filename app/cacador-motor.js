/*
 * Motor do Caçador de Margem — pontua leads com os critérios do pacote de setor.
 * Roda no navegador (window.RXC) e no Node (require) para os testes.
 */
(function (g) {
  var SINAIS_SIM_NAO = { sim: true, s: true, true: true, '1': true, yes: true, nao: false, 'não': false, n: false, false: false, '0': false, no: false };

  function semAcento(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function chaveNome(s) {
    return semAcento(s).toLowerCase().replace(/\b(ltda|me|epp|eireli|s\/?a|restaurante|bar|lanchonete)\b/g, '').replace(/[^a-z0-9]+/g, '');
  }

  function lerSinal(tipo, v) {
    if (v === null || v === undefined || v === '') return null;
    if (tipo === 'numero') {
      var s = String(v).trim();
      if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
      var n = typeof v === 'number' ? v : parseFloat(s);
      return isFinite(n) ? n : null;
    }
    if (typeof v === 'boolean') return v;
    var k = semAcento(String(v).trim().toLowerCase());
    return k in SINAIS_SIM_NAO ? SINAIS_SIM_NAO[k] : null;
  }

  // Garante o formato do lead; sinais em texto ("sim", "4,7") viram tipos certos.
  function normalizarLead(pacote, bruto) {
    var l = JSON.parse(JSON.stringify(bruto || {}));
    l.sinais = l.sinais || {};
    pacote.cacador.sinais.forEach(function (s) {
      var v = s.id in l.sinais ? l.sinais[s.id] : l[s.id];
      l.sinais[s.id] = lerSinal(s.tipo, v);
      if (s.id in l && s.id !== 'sinais') delete l[s.id];
    });
    l.evidencias = l.evidencias || {};
    l.fontes = l.fontes || [];
    l.status = l.status || 'a_contatar';
    l.historico = l.historico || [];
    if (!l.id) l.id = l.cnpj ? 'cnpj:' + String(l.cnpj).replace(/\D/g, '') : 'nome:' + chaveNome(l.nome) + (l.osm_id ? ':' + l.osm_id : '');
    return l;
  }

  var cache = {};
  function funcao(args, expr) {
    var k = args + '|' + expr;
    if (!cache[k]) cache[k] = new Function(args, '"use strict"; return (' + expr + ');');
    return cache[k];
  }

  function pontuar(pacote, lead) {
    var c = pacote.cacador;
    var max = 0, pontos = 0, conhecidos = 0;
    var criterios = c.criterios.map(function (cr) {
      max += cr.peso;
      var v = lead.sinais[cr.sinal];
      if (v === null || v === undefined) return { id: cr.id, rotulo: cr.rotulo, peso: cr.peso, ok: null };
      conhecidos += cr.peso;
      var ok = !!funcao('v', cr.teste)(v);
      if (ok) pontos += cr.peso;
      return { id: cr.id, rotulo: cr.rotulo, peso: cr.peso, ok: ok };
    });
    var alertas = c.alertas.filter(function (a) {
      try { return !!funcao('l', a.teste)(lead); } catch (e) { return false; }
    }).map(function (a) { return a.texto; });
    var faixa = c.potencial.faturamento_por_porte[lead.porte];
    return {
      pontos: pontos,
      max: max,
      conferido: max ? Math.round(conhecidos / max * 100) : 0,
      // teto: pontos se tudo que falta conferir der positivo
      teto: pontos + (max - conhecidos),
      criterios: criterios,
      aConferir: criterios.filter(function (x) { return x.ok === null; }).map(function (x) { return x.rotulo; }),
      alertas: alertas,
      potencial: faixa ? [faixa[0] * c.potencial.fator, faixa[1] * c.potencial.fator] : null
    };
  }

  // Ordena: pontos, depois teto (quem ainda pode subir), depois potencial máximo.
  function ordenar(pacote, leads) {
    return leads.map(function (l) { return { lead: l, p: pontuar(pacote, l) }; })
      .sort(function (a, b) {
        return (b.p.pontos - a.p.pontos) || (b.p.teto - a.p.teto) ||
          ((b.p.potencial ? b.p.potencial[1] : 0) - (a.p.potencial ? a.p.potencial[1] : 0));
      });
  }

  function formatarNumero(n) { return String(n).replace('.', ','); }

  // Abordagem personalizada: só cita o que foi conferido.
  function abordagem(pacote, lead) {
    var s = lead.sinais, partes = [];
    var nome = lead.nome || 'seu restaurante';
    if (s.nota != null && s.avaliacoes != null && s.nota >= 4.3) {
      partes.push('Vi que o ' + nome + ' tem nota ' + formatarNumero(s.nota) + ' com ' + s.avaliacoes.toLocaleString('pt-BR') + ' avaliações no Google — demanda vocês têm.');
    } else {
      partes.push('Conheço o ' + nome + (lead.bairro ? ' aqui no ' + lead.bairro : '') + '.');
    }
    if (s.marketplace === true && s.pedido_proprio === false) {
      partes.push(pacote.cacador.abordagem);
    } else if (s.pedido_proprio === false) {
      partes.push('Não encontrei um jeito de pedir direto com vocês sem passar por aplicativo — cada cliente que volta poderia voltar por um canal de vocês.');
    }
    if (s.fidelidade === false) partes.push('Também não vi programa de fidelidade: cliente que compra uma vez não tem motivo para voltar.');
    partes.push('Faço um diagnóstico de 40 minutos que mostra, em reais por mês, quanto está escapando em taxa de marketplace, cartão e cliente que não volta. Sem custo: se não aparecer pelo menos R$ 2 mil por mês, eu mesmo digo que não vale mexer. Qual dia é mais tranquilo?');
    return partes.join(' ');
  }

  // Junta listas sem duplicar: mesmo CNPJ, ou mesmo nome no mesmo bairro.
  function mesclar(pacote, base, novos) {
    var porId = {}, porNome = {};
    var saida = base.map(function (l) { return normalizarLead(pacote, l); });
    saida.forEach(function (l, i) {
      porId[l.id] = i;
      porNome[chaveNome(l.nome) + '|' + chaveNome(l.bairro)] = i;
    });
    // Nome parecido no mesmo bairro: um começa com o outro ("madero" × "maderobatel").
    function parecido(l) {
      var k = chaveNome(l.nome), b = chaveNome(l.bairro);
      if (k.length < 5) return undefined;
      for (var j = 0; j < saida.length; j++) {
        var o = saida[j], ko = chaveNome(o.nome);
        if (ko.length < 5 || chaveNome(o.bairro) !== b) continue;
        if (o.cnpj && l.cnpj && o.cnpj !== l.cnpj) continue;
        if (k.indexOf(ko) === 0 || ko.indexOf(k) === 0) return j;
      }
      return undefined;
    }
    novos.forEach(function (bruto) {
      var l = normalizarLead(pacote, bruto);
      var i = porId[l.id];
      if (i === undefined) i = porNome[chaveNome(l.nome) + '|' + chaveNome(l.bairro)];
      if (i === undefined) i = parecido(l);
      if (i === undefined) {
        porId[l.id] = saida.length;
        porNome[chaveNome(l.nome) + '|' + chaveNome(l.bairro)] = saida.length;
        saida.push(l);
        return;
      }
      var alvo = saida[i];
      Object.keys(l).forEach(function (k) {
        if (k === 'sinais' || k === 'evidencias') {
          Object.keys(l[k]).forEach(function (s) { if (l[k][s] != null && alvo[k][s] == null) alvo[k][s] = l[k][s]; });
        } else if (k === 'fontes') {
          l.fontes.forEach(function (f) { if (alvo.fontes.indexOf(f) < 0) alvo.fontes.push(f); });
        } else if (alvo[k] == null || alvo[k] === '') {
          alvo[k] = l[k];
        }
      });
    });
    return saida;
  }

  // ── CSV (vírgula ou ponto e vírgula, aspas, acentos) ──
  function lerCSV(texto) {
    texto = String(texto).replace(/^﻿/, '');
    var primeira = texto.split(/\r?\n/)[0] || '';
    var sep = (primeira.match(/;/g) || []).length > (primeira.match(/,/g) || []).length ? ';' : ',';
    var linhas = [], campo = '', linha = [], aspas = false;
    for (var i = 0; i < texto.length; i++) {
      var ch = texto[i];
      if (aspas) {
        if (ch === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
        else if (ch === '"') aspas = false;
        else campo += ch;
      } else if (ch === '"') aspas = true;
      else if (ch === sep) { linha.push(campo); campo = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && texto[i + 1] === '\n') i++;
        linha.push(campo); campo = '';
        if (linha.some(function (x) { return x !== ''; })) linhas.push(linha);
        linha = [];
      } else campo += ch;
    }
    linha.push(campo);
    if (linha.some(function (x) { return x !== ''; })) linhas.push(linha);
    if (!linhas.length) return [];
    var cab = linhas.shift().map(function (h) { return semAcento(h).trim().toLowerCase().replace(/\s+/g, '_'); });
    return linhas.map(function (l) {
      var o = {};
      cab.forEach(function (h, j) { o[h] = (l[j] || '').trim(); });
      return o;
    });
  }

  var COLUNAS_CSV = ['nome', 'cnpj', 'bairro', 'cidade', 'endereco', 'telefone', 'site', 'instagram', 'porte', 'cnae', 'situacao'];
  function escreverCSV(pacote, leads) {
    var sinais = pacote.cacador.sinais.map(function (s) { return s.id; });
    var cab = COLUNAS_CSV.concat(sinais, ['pontos', 'status', 'obs']);
    var q = function (v) {
      v = v == null ? '' : typeof v === 'boolean' ? (v ? 'sim' : 'nao') : String(v);
      return /[",;\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    };
    var linhas = leads.map(function (l) {
      var p = pontuar(pacote, l);
      return COLUNAS_CSV.map(function (c) { return q(l[c]); })
        .concat(sinais.map(function (s) { return q(l.sinais[s]); }), [p.pontos, q(l.status), q(l.obs)]).join(',');
    });
    return cab.join(',') + '\n' + linhas.join('\n') + '\n';
  }

  var api = {
    normalizarLead: normalizarLead, pontuar: pontuar, ordenar: ordenar, abordagem: abordagem,
    mesclar: mesclar, lerCSV: lerCSV, escreverCSV: escreverCSV, chaveNome: chaveNome
  };
  g.RXC = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
