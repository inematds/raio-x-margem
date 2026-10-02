// Integridade de TODOS os pacotes em setores/ + casos numéricos do hotel.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const RXM = require('../app/motor.js');
const RXC = require('../app/cacador-motor.js');

const raiz = path.join(__dirname, '..');
const pacotes = fs.readdirSync(path.join(raiz, 'setores')).filter((f) => f.endsWith('.js'))
  .map((f) => require(path.join(raiz, 'setores', f)));

for (const p of pacotes) {
  test(`pacote ${p.id}: integridade`, () => {
    assert.ok(p.id && p.nome && p.versao && p.mercado && p.moeda);
    const ids = new Set(p.entradas.map((e) => e.id));
    const grupos = new Set(p.grupos.map((g) => g.id));
    assert.equal(ids.size, p.entradas.length, 'entrada duplicada');
    p.entradas.forEach((e) => assert.ok(grupos.has(e.grupo), `${e.id}: grupo ${e.grupo}`));
    p.vazamentos.forEach((v) => {
      v.entradas.forEach((id) => assert.ok(ids.has(id), `${v.id}: entrada ${id}`));
      v.receitas.forEach((r) => assert.ok(p.receitas[r], `${v.id}: receita ${r}`));
      assert.ok(v.recuperavel_pct > 0 && v.recuperavel_pct <= 100 && v.dificuldade >= 1 && v.dificuldade <= 5);
      assert.ok(v.como_medir.base && v.como_medir.metrica && v.como_medir.janela, `${v.id}: como_medir`);
      assert.equal(typeof v.fonte.verificado, 'boolean');
    });
    Object.entries(p.receitas).forEach(([id, r]) => assert.ok(fs.existsSync(path.join(raiz, r.doc)), `receita ${id}: falta ${r.doc}`));
    const c = p.cacador;
    const sinais = new Set(c.sinais.map((s) => s.id));
    c.criterios.forEach((cr) => assert.ok(sinais.has(cr.sinal), `critério ${cr.id}`));
    assert.equal(c.criterios.reduce((s, x) => s + x.peso, 0), 100);
    ['demanda', 'conheco_local', 'conheco', 'sem_canal', 'sem_fidelidade', 'convite'].forEach((k) => assert.ok(c.textos[k], `texto ${k}`));
  });

  test(`pacote ${p.id}: exemplo completo calcula todos os vazamentos`, () => {
    const v = Object.fromEntries(p.entradas.map((e) => [e.id, e.exemplo]));
    const d = RXM.diagnosticar(p, v);
    assert.deepEqual(d.semDados.map((r) => r.id), []);
    assert.ok(d.totalMensal > 0 && d.pctFaturamento > 0 && d.pctFaturamento < 100);
  });
}

const hotel = require('../setores/hotel.js');
const perto = (a, b) => assert.ok(Math.abs(a - b) < 0.01, `${a} ≠ ${b}`);

test('hotel: contas à mão do exemplo (pousada 30 UHs)', () => {
  const v = Object.fromEntries(hotel.entradas.map((e) => [e.id, e.exemplo]));
  const d = RXM.diagnosticar(hotel, v);
  const de = (id) => d.itens.find((r) => r.id === id).perda;
  perto(de('ota_recorrente'), 132000 * 0.15 * 0.12);       // 2.376
  perto(de('programa_ota'), 132000 * 0.03 * 0.5);          // 1.980
  perto(de('baixa_temporada'), 30 * 30 * 0.08 * 350 * 0.65); // 16.380 por mês de baixa
  perto(de('retorno'), 220 * 0.04 * 1000 * 0.65);          // 5.720
  perto(de('extras'), 220 * 0.10 * 180 * 0.5);             // 1.980
  perto(de('no_show'), 6 * 0.7 * 1000 * 0.65);             // 2.730
  perto(de('pagamentos'), 70000 * 0.009);                  // 630
  perto(de('mao_de_obra'), 25 * 4.33 * 18);                // 1.948,50
  perto(de('marketing'), 750);
});

test('hotel: Caçador usa nº de quartos no potencial e alerta rede/pequeno', () => {
  const l = RXC.normalizarLead(hotel, { nome: 'Pousada X', cidade: 'Gramado', uhs: 30 });
  const p = RXC.pontuar(hotel, l);
  perto(p.potencial[0], 30 * 30 * 0.45 * 250 * 0.55 * 0.16 * 0.15);
  perto(p.potencial[1], 30 * 30 * 0.57 * 600 * 0.55 * 0.16 * 0.15);
  assert.equal(RXC.pontuar(hotel, RXC.normalizarLead(hotel, { nome: 'Y', uhs: 5 })).alertas.length, 1);
  assert.equal(RXC.pontuar(hotel, RXC.normalizarLead(hotel, { nome: 'Z', uhs: 300 })).alertas.length, 1);
  assert.equal(RXC.pontuar(hotel, RXC.normalizarLead(hotel, { nome: 'W' })).potencial, null);
});

test('hotel: abordagem fala de OTA e paridade, não de iFood', () => {
  const t = RXC.abordagem(hotel, RXC.normalizarLead(hotel, { nome: 'Pousada X', cidade: 'Canela', sinais: { marketplace: true, pedido_proprio: false, fidelidade: false } }));
  assert.match(t, /Booking/);
  assert.match(t, /em Canela/);
  assert.doesNotMatch(t, /iFood|marketplace|restaurante/i);
});
