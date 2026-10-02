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

    // ── Caçador ──
    const cac = await browser.newPage({ viewport });
    cac.on('pageerror', (e) => erros.push(`${nome} caçador: ${e.message}`));
    await cac.goto('file://' + path.resolve(__dirname, '..', 'app', 'cacador.html'));
    await cac.setInputFiles('#bt-importar', path.join(__dirname, 'fixtures', 'leads-exemplo.json'));
    await cac.waitForSelector('details.lead');
    const nomes = await cac.$$eval('details.lead .nome', (n) => n.map((x) => x.textContent));
    ok(nomes.length === 3 && nomes[0] === 'Cantina Exemplo', `${nome} caçador: ordem ${nomes.join(' | ')}`);
    const pts = await cac.textContent('details.lead:first-child .placar b');
    ok(pts === '100', `${nome} caçador: lead ideal com ${pts} pontos`);
    ok((await cac.$$('details.lead:nth-child(2) .chip.alerta')).length + (await cac.$$('details.lead:nth-child(3) .chip.alerta')).length >= 2, `${nome} caçador: alertas do MEI não apareceram`);
    // conferir um sinal à mão muda a pontuação do Bistrô (ME): sem pedido próprio → +15
    const bistro = cac.locator('details.lead', { hasText: 'Bistrô Demonstração' });
    await bistro.locator('summary').click();
    const antes = Number(await bistro.locator('.placar b').textContent());
    await bistro.locator('select[data-sinal="pedido_proprio"]').selectOption('nao');
    const depois = Number(await cac.locator('details.lead', { hasText: 'Bistrô Demonstração' }).locator('.placar b').textContent());
    ok(depois === antes + 15, `${nome} caçador: sinal manual ${antes} → ${depois}`);
    const larg2 = await cac.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(larg2 <= 0, `${nome} caçador: rolagem horizontal de ${larg2}px`);
    await cac.screenshot({ path: path.join(saida, `cacador-${nome}.png`), fullPage: true });
    // persistência + ida ao Raio-X com o nome do lead
    await cac.reload();
    ok((await cac.$$('details.lead')).length === 3, `${nome} caçador: lista não voltou após recarregar`);
    const primeiro = cac.locator('details.lead').first();
    await primeiro.locator('summary').click();
    await primeiro.locator('a', { hasText: 'Abrir Raio-X' }).click();
    await cac.waitForLoadState();
    ok((await cac.inputValue('#cli-nome')) === 'Cantina Exemplo', `${nome}: Raio-X não recebeu o nome do lead`);
    ok((await cac.textContent('#r-total')).replace(/\s/g, ' ') === 'R$ 0', `${nome}: Raio-X do lead novo deveria começar zerado`);
    await cac.close();
  }
  await browser.close();
  const tudo = erros.concat(falhas);
  if (tudo.length) { console.error('FALHOU:\n- ' + tudo.join('\n- ')); process.exit(1); }
  console.log('UI ok: desktop + celular, sem pageerror; prints e PDF em ' + saida);
})();
