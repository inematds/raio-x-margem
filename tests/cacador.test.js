// Rodar: node --test tests/*.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const RXC = require('../app/cacador-motor.js');
const restaurante = require('../setores/restaurante.js');

const lead = (x) => RXC.normalizarLead(restaurante, x);

test('lead ideal do documento de origem soma 100 pontos', () => {
  // Restaurante A: 4,8 estrelas, 3.000 avaliações, Instagram ativo, marketplace,
  // sem pedido próprio, WhatsApp manual, sem fidelidade
  const p = RXC.pontuar(restaurante, lead({ nome: 'Restaurante A', sinais: {
    nota: 4.8, avaliacoes: 3000, marketplace: true, instagram_ativo: true,
    pedido_proprio: false, whatsapp_manual: true, fidelidade: false } }));
  assert.equal(p.pontos, 100);
  assert.equal(p.conferido, 100);
  assert.deepEqual(p.aConferir, []);
});

test('conta à mão: nota 4,6 + 800 avaliações + pedido próprio = 35 pontos, teto 65', () => {
  const p = RXC.pontuar(restaurante, lead({ nome: 'B', sinais: { nota: '4,6', avaliacoes: '800', pedido_proprio: 'sim' } }));
  assert.equal(p.pontos, 15 + 20);       // nota + avaliações; tem pedido próprio → 0 nos 15
  assert.equal(p.conferido, 50);         // 15 + 20 + 15 de 100 conferidos
  assert.equal(p.teto, 35 + 50);         // o que falta conferir ainda pode somar 50
  assert.equal(p.aConferir.length, 4);
});

test('sinais em texto viram tipos; desconhecido fica null', () => {
  const l = lead({ nome: 'C', marketplace: 'Sim', fidelidade: 'não', nota: '', avaliacoes: 'abc' });
  assert.equal(l.sinais.marketplace, true);
  assert.equal(l.sinais.fidelidade, false);
  assert.equal(l.sinais.nota, null);
  assert.equal(l.sinais.avaliacoes, null);
  assert.equal(l.marketplace, undefined, 'sinal sai da raiz do lead');
});

test('alertas de quando a tese falha', () => {
  const p = RXC.pontuar(restaurante, lead({ nome: 'D', porte: 'MEI', situacao: 'BAIXADA', cnae: '5620104', sinais: { avaliacoes: 40, nota: 3.6 } }));
  assert.equal(p.alertas.length, 5);
});

test('potencial pela faixa de porte (conta à mão)', () => {
  const p = RXC.pontuar(restaurante, lead({ nome: 'E', porte: 'EPP' }));
  const f = 0.58 * 0.54 * 0.30 * 0.10;
  assert.ok(Math.abs(p.potencial[0] - 30000 * f) < 0.01);
  assert.ok(Math.abs(p.potencial[1] - 400000 * f) < 0.01);
  assert.equal(RXC.pontuar(restaurante, lead({ nome: 'F' })).potencial, null);
});

test('ordena por pontos, depois teto', () => {
  const lista = [
    lead({ nome: 'baixo', sinais: { nota: 4.0 } }),
    lead({ nome: 'alto', sinais: { nota: 4.9, avaliacoes: 900 } }),
    lead({ nome: 'medio-teto-alto', sinais: { avaliacoes: 900 } })
  ];
  const ordem = RXC.ordenar(restaurante, lista).map((x) => x.lead.nome);
  assert.deepEqual(ordem, ['alto', 'medio-teto-alto', 'baixo']);
});

test('abordagem só cita o que foi conferido', () => {
  const t1 = RXC.abordagem(restaurante, lead({ nome: 'Casa X', sinais: { nota: 4.8, avaliacoes: 3000, marketplace: true, pedido_proprio: false } }));
  assert.match(t1, /nota 4,8 com 3\.000 avaliações/);
  assert.match(t1, /paga de novo/);
  const t2 = RXC.abordagem(restaurante, lead({ nome: 'Casa Y', bairro: 'Batel' }));
  assert.doesNotMatch(t2, /avaliações/);
  assert.match(t2, /aqui no Batel/);
});

test('mesclar: mesmo CNPJ ou mesmo nome+bairro não duplica e completa campos', () => {
  const base = [{ nome: 'Bar do Zé Ltda', cnpj: '12.345.678/0001-90', bairro: 'Batel', fontes: ['cnpj'] }];
  const novos = [
    { nome: 'Bar do Zé', bairro: 'BATEL', site: 'https://bardoze.com.br', fontes: ['osm'], sinais: { nota: 4.7 } },
    { nome: 'Outro Lugar', bairro: 'Batel', fontes: ['osm'] }
  ];
  const r = RXC.mesclar(restaurante, base, novos);
  assert.equal(r.length, 2);
  assert.equal(r[0].site, 'https://bardoze.com.br');
  assert.equal(r[0].sinais.nota, 4.7);
  assert.deepEqual(r[0].fontes, ['cnpj', 'osm']);
});

test('CSV com ponto e vírgula, aspas e acento; ida e volta', () => {
  const linhas = RXC.lerCSV('﻿Nome;Bairro;Nota;Marketplace\n"Café; Bistrô ""Real""";Batel;4,7;sim\nPadaria São João;Batel;;não\n');
  assert.equal(linhas.length, 2);
  assert.equal(linhas[0].nome, 'Café; Bistrô "Real"');
  const leads = linhas.map((x) => lead(x));
  assert.equal(leads[0].sinais.nota, 4.7);
  assert.equal(leads[1].sinais.marketplace, false);
  const csv = RXC.escreverCSV(restaurante, leads);
  const volta = RXC.lerCSV(csv);
  assert.equal(volta[0].nome, 'Café; Bistrô "Real"');
  assert.equal(volta[1].marketplace, 'nao');
});

test('integridade do Caçador no pacote', () => {
  const c = restaurante.cacador;
  const sinais = new Set(c.sinais.map((s) => s.id));
  c.criterios.forEach((cr) => assert.ok(sinais.has(cr.sinal), `critério ${cr.id}: sinal ${cr.sinal}`));
  assert.equal(c.criterios.reduce((s, x) => s + x.peso, 0), 100);
  ['MEI', 'ME', 'EPP', 'DEMAIS'].forEach((p) => assert.ok(c.potencial.faturamento_por_porte[p]));
});

test('mesclar: nome parecido no mesmo bairro junta; CNPJs diferentes não', () => {
  const r = RXC.mesclar(restaurante,
    [{ nome: 'Madero', cnpj: '11.111.111/0001-11', bairro: 'Batel' }, { nome: 'Cafe Zurich', cnpj: '22.222.222/0001-22', bairro: 'Batel' }],
    [{ nome: 'Madero Batel', bairro: 'Batel', site: 'https://madero.com.br' },
     { nome: 'Cafe Zurich Express', cnpj: '33.333.333/0001-33', bairro: 'Batel' },
     { nome: 'Madero', bairro: 'Centro' }]);
  assert.equal(r.length, 4);
  assert.equal(r[0].site, 'https://madero.com.br');
});

test('CSV com cabeçalhos em inglês e espanhol', () => {
  const en = RXC.lerCSV('Business Name,City,Website,Rating,Reviews\nJoe Diner,Austin,https://joe.example,4.7,812\n');
  assert.deepEqual(Object.keys(en[0]), ['nome', 'cidade', 'site', 'nota', 'avaliacoes']);
  const es = RXC.lerCSV('Nombre;Ciudad;Teléfono;Reseñas\nTaquería Sol;Ciudad de México;5555;300\n');
  assert.equal(es[0].nome, 'Taquería Sol');
  assert.equal(es[0].telefone, '5555');
  assert.equal(RXC.normalizarLead(restaurante, es[0]).sinais.avaliacoes, 300);
});

test('abordagem formata números pelo mercado do pacote', () => {
  const global = require('../setores/en/restaurante.js');
  const t = RXC.abordagem(global, RXC.normalizarLead(global, { nome: 'Joe', sinais: { nota: 4.7, avaliacoes: 3000 } }));
  assert.match(t, /4\.7 rating with 3,000 reviews/);
});

test('priorizar: fachada conhecida e nome de marca antes de razão social', () => {
  const { priorizar } = require('../coletor/priorizar.js');
  const ordem = priorizar([
    { nome: 'Aakf Lanchonete e Cafeteria Ltda', porte: 'DEMAIS', fontes: ['cnpj'] },
    { nome: 'Cantina do Delio Batel', porte: 'ME', fontes: ['cnpj', 'osm'] },
    { nome: 'Restaurante Manu', porte: 'EPP', fontes: ['cnpj'] },
    { nome: 'Fechado Ltda', porte: 'DEMAIS', fontes: ['cnpj', 'osm'], situacao: 'BAIXADA' }
  ]).map((l) => l.nome);
  assert.deepEqual(ordem, ['Cantina do Delio Batel', 'Restaurante Manu', 'Aakf Lanchonete e Cafeteria Ltda', 'Fechado Ltda']);
});
