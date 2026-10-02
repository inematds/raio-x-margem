const test = require('node:test');
const assert = require('node:assert/strict');
const RXP = require('../app/painel-motor.js');
const restaurante = require('../setores/restaurante.js');

const perto = (a, b) => assert.ok(Math.abs(a - b) < 0.01, `${a} ≠ ${b}`);

// Base = diagnóstico de R$ 14.700 do documento de origem
const valoresBase = {
  fat_marketplace: 100000, recompra_marketplace_pct: 52, taxa_marketplace_pct: 25, custo_canal_proprio_pct: 15,
  fat_cartao: 210000, mdr_atual_pct: 3.2, mdr_referencia_pct: 2.2,
  cmv_mes: 47500, desperdicio_pct: 12, desperdicio_ref_pct: 4,
  clientes_novos_mes: 400, retorno_atual_pct: 20, retorno_meta_pct: 35, ticket_medio: 50, pedidos_mes_recorrente: 2, margem_contrib_pct: 60
};

test('diagnóstico do Raio-X vira acompanhamento', () => {
  const a = RXP.deDiagnostico({ pacote: 'restaurante', cliente: { 'cli-nome': 'X' }, valores: valoresBase, salvoEm: '2026-10-02T10:00:00Z' });
  assert.equal(a.tipo, 'acompanhamento');
  assert.equal(a.base.data, '2026-10-02');
  assert.deepEqual(a.meses, []);
  assert.equal(RXP.proximoMes(a), '2026-11');
  assert.equal(RXP.deDiagnostico(a), a, 'acompanhamento passa direto');
});

test('conta à mão: taxa de cartão renegociada + recompra migrada', () => {
  // mês 1: MDR caiu de 3,2% para 2,4% e a recompra pelo marketplace caiu de 52% para 40%
  const mes = { ...valoresBase, mdr_atual_pct: 2.4, recompra_marketplace_pct: 40 };
  const c = RXP.comparar(restaurante, valoresBase, mes);
  const it = (id) => c.itens.find((x) => x.id === id);
  perto(it('pagamentos').antes, 2100);
  perto(it('pagamentos').agora, 210000 * 0.002);           // 420
  perto(it('pagamentos').recuperado, 1680);
  perto(it('marketplace').recuperado, 5200 - 100000 * 0.40 * 0.10); // 1.200
  perto(c.recuperado, 1680 + 1200);
  perto(it('pagamentos').meta, 2100 * 0.70);               // recuperável que o Raio-X prometeu
  perto(it('pagamentos').pctMeta, 1680 / 1470 * 100);      // passou da meta
  assert.ok(c.semComparacao.includes('ticket'), 'vazamento sem dado fica fora');
});

test('piora aparece como recuperado negativo', () => {
  const c = RXP.comparar(restaurante, valoresBase, { ...valoresBase, desperdicio_pct: 14 });
  perto(c.itens.find((x) => x.id === 'desperdicio').recuperado, -47500 * 0.02);
});

test('linha do tempo ordena os meses e acumula', () => {
  const a = RXP.deDiagnostico({ pacote: 'restaurante', valores: valoresBase, salvoEm: '2026-10-02' });
  a.meses.push({ mes: '2026-12', valores: { ...valoresBase, mdr_atual_pct: 2.2 } });
  a.meses.push({ mes: '2026-11', valores: { ...valoresBase, mdr_atual_pct: 2.7 } });
  const l = RXP.linhaDoTempo(restaurante, a);
  assert.deepEqual(l.map((x) => x.mes), ['2026-11', '2026-12']);
  perto(l[0].resultado.recuperado, 210000 * 0.005);  // 1.050
  perto(l[1].resultado.recuperado, 2100);
  perto(l[1].acumulado, 1050 + 2100);
  assert.equal(RXP.proximoMes(a), '2027-01');
});

test('bônus só sobre o que é atribuível', () => {
  const c = RXP.comparar(restaurante, valoresBase, { ...valoresBase, mdr_atual_pct: 2.4, recompra_marketplace_pct: 40 });
  const b = RXP.bonus(c, ['pagamentos', 'antecipacao'], 15);
  perto(b.base, 1680);
  perto(b.valor, 252);
});
