const test = require('node:test');
const assert = require('node:assert/strict');
const { dicionarios: D } = require('../app/i18n.js');

const marcas = (s) => (s.match(/\{\w+\}/g) || []).sort().join(',');
const tags = (s) => (s.match(/<\/?\w+/g) || []).sort().join(',');

test('PT, EN e ES têm as mesmas chaves', () => {
  const pt = Object.keys(D.pt).sort();
  for (const l of ['en', 'es']) assert.deepEqual(Object.keys(D[l]).sort(), pt, `chaves de ${l}`);
});

test('cada tradução mantém os {marcadores} e as tags HTML do português', () => {
  for (const l of ['en', 'es']) for (const k of Object.keys(D.pt)) {
    assert.equal(marcas(D[l][k]), marcas(D.pt[k]), `${l}:${k} marcadores`);
    assert.equal(tags(D[l][k]), tags(D.pt[k]), `${l}:${k} tags`);
  }
});

test('nenhuma tradução vazia ou igual ao português em frase longa', () => {
  for (const l of ['en', 'es']) for (const k of Object.keys(D.pt)) {
    assert.ok(D[l][k].trim(), `${l}:${k} vazia`);
    if (D.pt[k].length > 25) assert.notEqual(D[l][k], D.pt[k], `${l}:${k} não traduzida`);
  }
});
