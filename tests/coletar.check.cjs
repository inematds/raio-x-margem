// Teste de ponta a ponta da tela Coletar: sem servidor (file://) e com o servidor local.
// Rodar: NODE_PATH=<node_modules com playwright> node tests/coletar.check.cjs [porta]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const RAIZ = path.resolve(__dirname, '..');
const PORTA = process.argv[2] || '8797';
const falhas = []; const ok = (c, m) => { if (!c) falhas.push(m); };

(async () => {
  const b = await chromium.launch();
  // 1) file:// — sem servidor: aviso, comando pronto, botão desligado, 4 fontes bloqueadas
  const p = await b.newPage({ locale: 'pt-BR' });
  const erros = []; p.on('pageerror', (e) => erros.push(e.message));
  await p.goto('file://' + path.join(RAIZ, 'app', 'coletar.html'));
  ok(/servidor local/.test(await p.textContent('#status')), 'file: aviso de servidor');
  ok((await p.textContent('#comando')).includes('bash coletor/rodar.sh --setor restaurante --uf PR --cidade Curitiba --bairro Batel'), 'file: comando');
  ok(await p.isDisabled('#bt-coletar'), 'file: botão deveria estar desligado');
  ok((await p.$$('.fonte .trava')).length === 4, 'file: 4 fontes bloqueadas');
  await p.fill('#buscar', '10');
  ok(/20 créditos/.test(await p.textContent('#custo')), 'file: estimativa de crédito');
  await p.fill('#cidade', 'São José dos Pinhais');
  ok((await p.textContent('#comando')).includes('--cidade "São José dos Pinhais"'), 'file: aspas na cidade');
  await p.close();

  // 2) com servidor: coleta real pequena (salões do Batel, do cache) e abertura no Caçador
  const srv = spawn('python3', ['coletor/servidor.py', '--porta', PORTA], { cwd: RAIZ, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((r) => srv.stdout.on('data', (d) => { if (/coletor local/.test(d)) r(); }));
  try {
    const q = await b.newPage({ locale: 'pt-BR' });
    q.on('pageerror', (e) => erros.push(e.message));
    await q.goto(`http://127.0.0.1:${PORTA}/app/coletar.html`);
    await q.waitForSelector('#status.ok');
    await q.selectOption('#setor', 'salao');
    await q.fill('#limite', '0');
    await q.click('#bt-coletar');
    await q.waitForSelector('#abrir-cacador', { timeout: 180000 });
    ok(/leads-salao-curitiba-batel\.json/.test(await q.textContent('#p-titulo')), 'servidor: saída');
    ok((await q.$$('#passos i.feito')).length === 6, 'servidor: 6 passos feitos');
    // pedido inválido é recusado pelo servidor
    const r = await q.evaluate(async () => (await fetch('../api/coletar', { method: 'POST', body: JSON.stringify({ setor: 'hotel', uf: 'PR', cidade: '$(id)' }) })).status);
    ok(r === 400, 'servidor: recusa cidade perigosa');
    await q.click('#abrir-cacador');
    await q.waitForSelector('details.lead');
    ok((await q.$$('details.lead')).length > 100, 'caçador: importou os salões');
    ok(/importados/.test(await q.textContent('#resumo')), 'caçador: resumo da importação');
    await q.screenshot({ path: path.join(RAIZ, '.saida-teste', 'cacador-importado.png') });
    await q.close();
  } finally {
    srv.kill(); // só o processo que este teste subiu
  }
  await b.close();
  const tudo = erros.concat(falhas);
  if (tudo.length) { console.error('FALHOU:\n- ' + tudo.join('\n- ')); process.exit(1); }
  console.log('coletar ok: sem servidor (comando, fontes bloqueadas) e com servidor (coleta real → Caçador)');
})();
