// Teste de interface em file:// (sem servidor).
// Rodar: NODE_PATH=<pasta com node_modules/playwright> node tests/ui.check.cjs [pasta-de-saida]
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const saida = process.argv[2] || path.join(__dirname, '..', '.saida-teste');
  require('fs').mkdirSync(saida, { recursive: true });
  const url = 'file://' + path.resolve(__dirname, '..', 'app', 'index.html');
  const browser = await chromium.launch();
  const erros = [];
  const falhas = [];
  const ok = (cond, msg) => { if (!cond) falhas.push(msg); };

  for (const [nome, viewport] of [['desktop', { width: 1366, height: 900 }], ['celular', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport });
    page.on('pageerror', (e) => erros.push(`${nome}: ${e.message}`));
    await page.goto(url);
    ok((await page.textContent('#r-total')).includes('R$'), `${nome}: total não renderizou`);
    await page.click('#bt-exemplo');
    const total = await page.textContent('#r-total');
    ok(total !== 'R$ 0' && /R\$\s?\d/.test(total), `${nome}: total após exemplo = ${total}`);
    const linhas = await page.$$eval('#p-tabela tr', (t) => t.length);
    // exemplo tem antecipação e juros = 0 → 9 vazamentos com perda
    ok(linhas === 9, `${nome}: esperava 9 vazamentos no relatório, veio ${linhas}`);
    ok((await page.textContent('#r-sem-dados')).trim() === '', `${nome}: sobrou vazamento sem dados`);
    const larg = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(larg <= 0, `${nome}: rolagem horizontal de ${larg}px`);
    // limpar zera; recarregar mantém rascunho
    await page.click('#bt-exemplo');
    await page.reload();
    ok((await page.textContent('#r-total')) === total, `${nome}: rascunho não voltou após recarregar`);
    await page.screenshot({ path: path.join(saida, `raio-x-${nome}.png`), fullPage: true });
    if (nome === 'desktop') {
      await page.emulateMedia({ media: 'print' });
      await page.pdf({ path: path.join(saida, 'relatorio-exemplo.pdf'), format: 'A4', margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' } });
      await page.emulateMedia({ media: 'screen' });
    }
    await page.click('#bt-limpar');
    ok((await page.textContent('#r-total')).replace(/\s/g, ' ') === 'R$ 0', `${nome}: limpar não zerou`);
    await page.close();
  }
  await browser.close();
  const tudo = erros.concat(falhas);
  if (tudo.length) { console.error('FALHOU:\n- ' + tudo.join('\n- ')); process.exit(1); }
  console.log('UI ok: desktop + celular, sem pageerror; prints e PDF em ' + saida);
})();
