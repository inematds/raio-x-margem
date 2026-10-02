#!/usr/bin/env node
// Junta arquivos de leads (cnpj.py, osm.py, CSV exportado...) sem duplicar.
// Uso: node coletor/juntar.js dados/cnpj-batel.json dados/osm-batel.json > dados/leads.json
const fs = require('fs');
const RXC = require('../app/cacador-motor.js');
const pacote = require('../setores/restaurante.js');

const arquivos = process.argv.slice(2);
if (!arquivos.length) { console.error('uso: node coletor/juntar.js a.json b.json ... > leads.json'); process.exit(1); }
let leads = [];
const fontes = [];
for (const arq of arquivos) {
  const txt = fs.readFileSync(arq, 'utf8');
  const novos = /\.csv$/i.test(arq) ? RXC.lerCSV(txt) : (j => Array.isArray(j) ? j : j.leads)(JSON.parse(txt));
  const antes = leads.length;
  leads = RXC.mesclar(pacote, leads, novos);
  fontes.push(`${arq}: ${novos.length} (${leads.length - antes} novos)`);
}
// ordem de trabalho: matriz/porte maior primeiro, depois quem tem site
const pesoPorte = { DEMAIS: 4, EPP: 3, ME: 2, MEI: 0 };
leads.sort((a, b) => ((pesoPorte[b.porte] ?? 1) - (pesoPorte[a.porte] ?? 1)) || (!!b.site - !!a.site) || String(a.nome).localeCompare(b.nome));
process.stdout.write(JSON.stringify({ pacote: pacote.id, juntadoEm: new Date().toISOString(), fontes, leads }, null, 2));
console.error(fontes.join('\n') + `\n→ ${leads.length} leads`);
