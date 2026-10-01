// Rodar: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const RXM = require('../app/motor.js');
const restaurante = require('../setores/restaurante.js');

const perto = (a, b) => assert.ok(Math.abs(a - b) < 0.01, `${a} ≠ ${b}`);
const item = (d, id) => d.itens.find((r) => r.id === id);

test('exemplo do doc de origem: R$ 30 mil migrados × 10 p.p. = R$ 3.000/mês', () => {
  const d = RXM.diagnosticar(restaurante, {
    fat_marketplace: 100000, recompra_marketplace_pct: 30,
    taxa_marketplace_pct: 25, custo_canal_proprio_pct: 15
  });
  perto(item(d, 'marketplace').perda, 3000);
  perto(d.totalMensal, 3000);
  perto(d.totalAnual, 36000);
});

test('diagnóstico do doc de origem: R$ 14.700 em quatro pontos', () => {
  const d = RXM.diagnosticar(restaurante, {
    // marketplace R$ 5.200
    fat_marketplace: 100000, recompra_marketplace_pct: 52, taxa_marketplace_pct: 25, custo_canal_proprio_pct: 15,
    // pagamentos R$ 2.100
    fat_cartao: 210000, mdr_atual_pct: 3.2, mdr_referencia_pct: 2.2,
    // desperdício R$ 3.800
    cmv_mes: 47500, desperdicio_pct: 12, desperdicio_ref_pct: 4,
    // clientes que não voltam R$ 3.600 (60 clientes × R$ 50 × 2 pedidos × 60% de margem)
    clientes_novos_mes: 400, retorno_atual_pct: 20, retorno_meta_pct: 35,
    ticket_medio: 50, pedidos_mes_recorrente: 2, margem_contrib_pct: 60
  });
  perto(item(d, 'marketplace').perda, 5200);
  perto(item(d, 'pagamentos').perda, 2100);
  perto(item(d, 'desperdicio').perda, 3800);
  perto(item(d, 'retencao').perda, 3600);
  perto(d.totalMensal, 14700);
  assert.equal(d.ranking.length, 4);
  // pagamentos é o mais fácil e rápido: deve liderar a prioridade
  assert.equal(d.ranking[0].id, 'pagamentos');
});

test('dado faltando tira o vazamento da soma e lista o que falta', () => {
  const d = RXM.diagnosticar(restaurante, { fat_cartao: 60000, mdr_atual_pct: 3 });
  const p = item(d, 'pagamentos');
  assert.equal(p.perda, null);
  assert.deepEqual(p.faltando, ['mdr_referencia_pct']);
  assert.equal(d.totalMensal, 0);
  assert.equal(d.semDados.length, restaurante.vazamentos.length);
});

test('taxa abaixo da referência não vira vazamento negativo', () => {
  const d = RXM.diagnosticar(restaurante, { fat_cartao: 60000, mdr_atual_pct: 1.5, mdr_referencia_pct: 2.2 });
  assert.equal(item(d, 'pagamentos').perda, 0);
  assert.equal(d.ranking.length, 0);
});

test('aceita número em formato brasileiro e do input', () => {
  assert.equal(RXM.numero('1.234,5'), 1234.5);
  assert.equal(RXM.numero('3.2'), 3.2);
  assert.equal(RXM.numero(''), null);
  assert.equal(RXM.numero('abc'), null);
});

test('exemplo completo do pacote calcula todos os vazamentos', () => {
  const valores = Object.fromEntries(restaurante.entradas.map((e) => [e.id, e.exemplo]));
  const d = RXM.diagnosticar(restaurante, valores);
  const semDados = d.semDados.map((r) => r.id);
  assert.deepEqual(semDados, [], 'todo vazamento deve ter exemplo completo');
  assert.ok(d.totalMensal > 0 && d.pctFaturamento > 0 && d.pctFaturamento < 100);
  // valores citados em README/kit-comercial/precificacao.md — se mudar o exemplo, atualize os docs
  assert.equal(Math.round(d.totalMensal), 19238);
  assert.equal(Math.round(d.ranking.slice(0, 4).reduce((s, r) => s + r.recuperavel, 0)), 4974);
});

test('integridade do pacote restaurante', () => {
  const ids = new Set(restaurante.entradas.map((e) => e.id));
  const grupos = new Set(restaurante.grupos.map((g) => g.id));
  restaurante.entradas.forEach((e) => assert.ok(grupos.has(e.grupo), `grupo ${e.grupo}`));
  restaurante.vazamentos.forEach((v) => {
    v.entradas.forEach((id) => assert.ok(ids.has(id), `${v.id}: entrada ${id} inexistente`));
    v.receitas.forEach((r) => assert.ok(restaurante.receitas[r], `${v.id}: receita ${r} inexistente`));
    assert.ok(v.recuperavel_pct > 0 && v.recuperavel_pct <= 100, `${v.id}: recuperavel_pct`);
    assert.ok(v.dificuldade >= 1 && v.dificuldade <= 5, `${v.id}: dificuldade`);
    assert.ok(v.como_medir && v.como_medir.base && v.como_medir.metrica, `${v.id}: como_medir`);
    assert.equal(typeof v.fonte.verificado, 'boolean', `${v.id}: fonte.verificado`);
  });
  assert.ok(['BR'].includes(restaurante.mercado));
  const pesos = restaurante.cacador.criterios.reduce((s, c) => s + c.peso, 0);
  assert.equal(pesos, 100);
});
