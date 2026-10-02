#!/usr/bin/env node
// Ordena leads para o enriquecimento gastar busca e IA primeiro em quem tem NOME DE FACHADA.
// Razão social ("Aakf Lanchonete e Cafeteria Ltda") não acha nada na busca; nome de marca acha.
// Uso: node coletor/priorizar.js entrada.json > saida.json
const fs = require('fs');

const JURIDICO = /\b(ltda|s\.?\s?a|s\/?s|s\/?c|eireli|epp|me|holding|participa[cç][oõ]es|com[eé]rcio de|servi[cç]os m[eé]dicos)\b\.?/i;
const MARCA = /cl[ií]nica|odonto|centro|instituto|est[eé]tica|studio|est[uú]dio|sal[aã]o|barbearia|beauty|spa\b|espa[cç]o|hair|fisio|derma|sorriso|dental|pilates|pousada|hotel|chal[eé]|restaurante|cantina|pizzaria|bistr[oô]|caf[eé]|bar\b|grill|burger|sushi/i;
const PESO_PORTE = { DEMAIS: 2, EPP: 2, ME: 1, MEI: 0 };

function pontosNome(l) {
  let n = 0;
  if ((l.fontes || []).length > 1) n += 4;          // apareceu em mais de uma fonte (OSM, CNES, Cadastur…): fachada conhecida
  if (!JURIDICO.test(l.nome || '')) n += 2;         // sem cara de razão social
  if (MARCA.test(l.nome || '')) n += 1;             // tem palavra de negócio
  n += PESO_PORTE[l.porte] ?? 1;
  if (l.site) n += 1;                               // já tem site: enriquecer sai barato
  if (l.uhs) n += Math.min(2, Math.floor(l.uhs / 20)); // hospedagem: mais quartos, mais receita
  if (l.situacao && l.situacao !== 'ATIVA') n -= 10;
  return n;
}

function priorizar(leads) {
  return leads.map((l, i) => ({ l, i, p: pontosNome(l) }))
    .sort((a, b) => (b.p - a.p) || (a.i - b.i))
    .map((x) => x.l);
}

if (require.main === module) {
  const arq = process.argv[2];
  if (!arq) { console.error('uso: node coletor/priorizar.js entrada.json > saida.json'); process.exit(1); }
  const d = JSON.parse(fs.readFileSync(arq, 'utf8'));
  const leads = Array.isArray(d) ? d : d.leads;
  const saida = Array.isArray(d) ? { leads: [] } : d;
  saida.leads = priorizar(leads);
  saida.priorizado = { em: new Date().toISOString(), criterio: 'fachada conhecida > nome sem razão social > palavra de negócio > porte > site' };
  process.stdout.write(JSON.stringify(saida, null, 1));
  console.error(`priorizados ${leads.length} leads; 1º: ${saida.leads[0] && saida.leads[0].nome}`);
}

module.exports = { priorizar, pontosNome };
