const test = require('node:test');
const assert = require('node:assert/strict');
const RXPR = require('../app/proposta-motor.js');
const restaurante = require('../setores/restaurante.js');
const hotel = require('../setores/hotel.js');

const perto = (a, b) => assert.ok(Math.abs(a - b) < 0.01, `${a} ≠ ${b}`);
const exemplo = (p) => Object.fromEntries(p.entradas.map((e) => [e.id, e.exemplo]));

// Diagnóstico de R$ 14.700 dos documentos de origem
const valores = {
  fat_marketplace: 100000, recompra_marketplace_pct: 52, taxa_marketplace_pct: 25, custo_canal_proprio_pct: 15,
  fat_cartao: 210000, mdr_atual_pct: 3.2, mdr_referencia_pct: 2.2,
  cmv_mes: 47500, desperdicio_pct: 12, desperdicio_ref_pct: 4,
  clientes_novos_mes: 400, retorno_atual_pct: 20, retorno_meta_pct: 35, ticket_medio: 50, pedidos_mes_recorrente: 2, margem_contrib_pct: 60
};

test('escopo agrupa as prioridades por módulo, o mais rápido primeiro', () => {
  const p = RXPR.montar(restaurante, valores);
  perto(p.perda, 14700);
  // recuperável: pagamentos 2100×70% + marketplace 5200×40% + retenção 3600×50% + desperdício 3800×40%
  perto(p.recuperavel, 1470 + 2080 + 1800 + 1520);
  assert.equal(p.modulos[0].id, 'cobranca', 'cobrança (2 semanas) vem primeiro');
  assert.ok(p.modulos.some((m) => m.id === 'processo-interno'), 'desperdício não tem receita de software');
  assert.deepEqual(p.atribuiveis, ['pagamentos']);
  assert.equal(p.medicao.length, 4);
});

test('a sugestão sempre respeita o teto de 1/3', () => {
  for (const [pac, v] of [[restaurante, valores], [restaurante, exemplo(restaurante)], [hotel, exemplo(hotel)]]) {
    const p = RXPR.montar(pac, v);
    const a = RXPR.avaliar(p);
    assert.ok(a.dentroDoTeto, `${pac.id}: custo ${a.custoMensal} > teto ${a.teto}`);
    assert.ok(a.payback > 0 && a.payback < 6, `${pac.id}: payback ${a.payback}`);
  }
});

test('avaliar: conta à mão e seleção parcial de módulos', () => {
  const p = { mensalidade: 900, modulos: [{ id: 'a', preco: 1500, recuperavel: 2000 }, { id: 'b', preco: 3000, recuperavel: 1500 }] };
  const a = RXPR.avaliar(p);
  perto(a.implantacao, 4500);
  perto(a.custoMensal, 900 + 4500 / 6);                // 1.650
  perto(a.teto, 3500 / 3);                             // 1.166,67 → fora do teto
  assert.equal(a.dentroDoTeto, false);
  perto(a.payback, 4500 / (3500 - 900));
  const so = RXPR.avaliar(p, ['a']);
  perto(so.recuperavel, 2000);
  perto(so.custoMensal, 900 + 250);
});

test('ajustar reduz preço que passou do teto', () => {
  const p = RXPR.ajustar({ recuperavel: 3500, mensalidade: 900, modulos: [{ id: 'a', preco: 1500, recuperavel: 2000 }, { id: 'b', preco: 3000, recuperavel: 1500 }] });
  assert.ok(RXPR.avaliar(p).custoMensal <= 3500 / 3 + 30, 'arredondamento pode passar alguns reais');
});

test('arredondamento por faixa', () => {
  assert.equal(RXPR.arredondar(1234), 1250);
  assert.equal(RXPR.arredondar(987), 990);
  assert.equal(RXPR.arredondar(12340), 12500);
  assert.equal(RXPR.arredondar(-5), 0);
});
