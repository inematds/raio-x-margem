const test = require('node:test');
const assert = require('node:assert/strict');
const herdar = require('../setores/_herdar.js');

const base = {
  id: 'b', nome: 'Base', termos: { cliente: 'cliente', atendimento: 'atendimento' },
  grupos: [{ id: 'g', titulo: '{Cliente}s' }],
  entradas: [{ id: 'a', grupo: 'g', rotulo: 'Valor do {atendimento} por {cliente}', exemplo: 1 }, { id: 'x', grupo: 'g', rotulo: 'sai', exemplo: 2 }],
  vazamentos: [{ id: 'v1', nome: '{Cliente} que some', explicacao: 'O {cliente} de {nome} some', recuperavel_pct: 50 }],
  receitas: { r1: { nome: 'R1' } },
  cacador: { textos: { demanda: 'Oi {nome}, {clientes} você tem' }, criterios: [{ id: 'c1', peso: 60 }, { id: 'c2', peso: 40 }], sinais: [], alertas: [], potencial: { fator: 0.02 } }
};

test('termos trocam {x} e {X}; outros placeholders ficam', () => {
  const p = herdar(base, { id: 'p', termos: { cliente: 'paciente', clientes: 'pacientes', atendimento: 'consulta' } });
  assert.equal(p.entradas[0].rotulo, 'Valor do consulta por paciente');
  assert.equal(p.vazamentos[0].nome, 'Paciente que some');
  assert.equal(p.vazamentos[0].explicacao, 'O paciente de {nome} some');
  assert.equal(p.cacador.textos.demanda, 'Oi {nome}, pacientes você tem');
  assert.equal(p.grupos[0].titulo, 'Pacientes');
  assert.equal(p.base, 'b');
});

test('junta por id, acrescenta novos e remove o pedido; base não muda', () => {
  const p = herdar(base, {
    id: 'p',
    entradas: [{ id: 'a', exemplo: 9 }, { id: 'novo', grupo: 'g', rotulo: 'n', exemplo: 3 }],
    vazamentos: [{ id: 'v1', recuperavel_pct: 30 }],
    receitas: { r2: { nome: 'R2' } },
    cacador: { criterios: [{ id: 'c1', peso: 50 }, { id: 'c3', peso: 10 }], textos: { convite: 'c' }, potencial: { aviso: 'av' } },
    remover: { entradas: ['x'] }
  });
  assert.deepEqual(p.entradas.map((e) => e.id), ['a', 'novo']);
  assert.equal(p.entradas[0].exemplo, 9);
  assert.equal(p.entradas[0].grupo, 'g', 'campos não sobrescritos ficam da base');
  assert.equal(p.vazamentos[0].recuperavel_pct, 30);
  assert.deepEqual(Object.keys(p.receitas), ['r1', 'r2']);
  assert.deepEqual(p.cacador.criterios.map((c) => c.peso), [50, 40, 10]);
  assert.equal(p.cacador.textos.demanda.startsWith('Oi'), true);
  assert.equal(p.cacador.potencial.fator, 0.02);
  assert.equal(p.cacador.potencial.aviso, 'av');
  assert.equal(base.entradas.length, 2, 'base intacta');
  assert.equal(base.entradas[0].exemplo, 1);
});
