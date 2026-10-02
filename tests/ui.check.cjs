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
    const page = await browser.newPage({ viewport, locale: 'pt-BR' });
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
    const cac = await browser.newPage({ viewport, locale: 'pt-BR' });
    cac.on('pageerror', (e) => erros.push(`${nome} caçador: ${e.message}`));
    await cac.goto('file://' + path.resolve(__dirname, '..', 'app', 'cacador.html'));
    await cac.setInputFiles('#bt-importar', path.join(__dirname, 'fixtures', 'leads-exemplo.json'));
    await cac.waitForSelector('details.lead');
    ok(!/não consegui|could not|no pude/i.test(await cac.textContent('#resumo')), `${nome} caçador: erro na importação: ${await cac.textContent('#resumo')}`);
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
  // ── Setor hotel (mesmas telas, outro pacote) ──
  {
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, locale: 'pt-BR' });
    page.on('pageerror', (e) => erros.push(`hotel: ${e.message}`));
    await page.goto('file://' + path.resolve(__dirname, '..', 'app', 'index.html') + '?setor=hotel');
    ok((await page.inputValue('#seletor-setor')) === 'hotel', 'hotel: seletor não ficou em hotel');
    await page.click('#bt-exemplo');
    const linhas = await page.$$eval('#p-tabela tr', (t) => t.length);
    ok(linhas === 9, `hotel: esperava 9 vazamentos com perda, veio ${linhas}`);
    ok(/Booking|OTA/.test(await page.textContent('#p-tabela')), 'hotel: relatório sem vazamento de OTA');
    await page.screenshot({ path: path.join(saida, 'raio-x-hotel.png'), fullPage: true });
    await page.goto('file://' + path.resolve(__dirname, '..', 'app', 'cacador.html') + '?setor=hotel');
    await page.setInputFiles('#bt-importar', path.join(__dirname, 'fixtures', 'leads-hotel.json'));
    await page.waitForSelector('details.lead');
    ok(!/não consegui|could not|no pude/i.test(await page.textContent('#resumo')), 'hotel caçador: erro na importação');
    const primeiro = page.locator('details.lead').first();
    ok((await primeiro.locator('.nome').textContent()) === 'Pousada Exemplo da Serra', 'hotel caçador: ordem');
    ok((await primeiro.locator('.placar b').textContent()) === '90', 'hotel caçador: pontos (instagram a conferir → 90)');
    ok(/R\$/.test(await primeiro.locator('.placar').textContent()), 'hotel caçador: potencial por UHs não apareceu');
    await primeiro.locator('summary').click();
    ok(await primeiro.locator('a', { hasText: 'Booking' }).count() === 1, 'hotel caçador: link de conferência da Booking');
    ok(/Booking/.test(await primeiro.locator('textarea').inputValue()), 'hotel caçador: abordagem sem paridade/Booking');
    ok((await page.$$('details.lead:nth-child(2) .chip.alerta')).length === 1, 'hotel caçador: alerta de pousada pequena');
    await page.screenshot({ path: path.join(saida, 'cacador-hotel.png'), fullPage: true });
    await page.close();
  }
  // ── Idiomas: EN e ES (interface traduzida; pacote do mercado ou, se ainda não houver, o do Brasil) ──
  for (const [lang, titulo, botao] of [['en', 'Margin X-Ray', 'Fill in example'], ['es', 'Radiografía de Margen', 'Completar ejemplo']]) {
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', (e) => erros.push(`${lang}: ${e.message}`));
    await page.goto('file://' + path.resolve(__dirname, '..', 'app', 'index.html') + '?lang=' + lang);
    ok((await page.textContent('h1')).replace(/\s+/g, ' ').trim() === titulo, `${lang}: título`);
    ok((await page.textContent('#bt-exemplo')) === botao, `${lang}: botão`);
    ok((await page.getAttribute('html', 'lang')).startsWith(lang), `${lang}: <html lang>`);
    const setor = await page.$eval('#seletor-setor', (s) => s.options[s.selectedIndex].text);
    ok(setor.includes(lang === 'es' ? 'LATAM' : 'GLOBAL'), `${lang}: setor do mercado (${setor})`);
    await page.click('#bt-exemplo');
    const total = await page.textContent('#r-total');
    ok(lang === 'es' ? /MX\$|\$/.test(total) && !/R\$/.test(total) : /\$/.test(total) && !/R\$/.test(total), `${lang}: moeda (${total})`);
    ok(!/iFood|Pix|LGPD/.test(await page.textContent('body')), `${lang}: cita o Brasil`);
    ok((await page.$$('#p-tabela tr')).length >= 8, `${lang}: relatório`);
    const cac = await page.goto('file://' + path.resolve(__dirname, '..', 'app', 'cacador.html') + '?lang=' + lang);
    ok((await page.$$('[data-i18n]')).length > 5, `${lang}: caçador sem marcações de idioma`);
    await page.screenshot({ path: path.join(saida, `raio-x-${lang}.png`) });
    await page.close();
  }
  // ── Gerador de proposta (a partir do Raio-X salvo no navegador) ──
  for (const [lang, moeda] of [['pt', 'R$'], ['en', '$']]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: lang === 'pt' ? 'pt-BR' : 'en-US' });
    page.on('pageerror', (e) => erros.push(`proposta ${lang}: ${e.message}`));
    await page.goto('file://' + path.resolve(__dirname, '..', 'app', 'index.html') + '?lang=' + lang);
    await page.click('#bt-exemplo');
    await page.click('#bt-proposta');
    await page.waitForSelector('#doc:not([hidden])');
    const doc = await page.textContent('#doc');
    ok(doc.includes(moeda) && (lang === 'en' ? !doc.includes('R$') : true), `proposta ${lang}: moeda`);
    ok((await page.$$('#doc table')).length >= 4, `proposta ${lang}: tabelas`);
    ok(!(await page.$('#doc .alerta')), `proposta ${lang}: sugestão deveria caber no teto de 1/3`);
    if (lang === 'pt') {
      await page.fill('#c-nome', 'Consultoria Exemplo');
      await page.screenshot({ path: path.join(saida, 'proposta.png'), fullPage: true });
      await page.emulateMedia({ media: 'print' });
      await page.pdf({ path: path.join(saida, 'proposta-exemplo.pdf'), format: 'A4', margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
      await page.emulateMedia({ media: 'screen' });
    }
    ok(/15%/.test(await page.textContent('#doc')), `proposta ${lang}: bônus sobre taxa de cartão`);
    // desmarcar o módulo de cobrança muda a implantação e tira o bônus (não há mais o que atribuir)
    const antes = await page.textContent('#doc');
    await page.locator('[data-mod]').first().uncheck();
    ok((await page.textContent('#doc')) !== antes, `proposta ${lang}: desmarcar módulo não mudou nada`);
    ok(!/15%/.test(await page.textContent('#doc')), `proposta ${lang}: bônus continuou sem o módulo de cobrança`);
    await page.fill('#c-nome', 'Consultoria Teste');
    ok((await page.textContent('#doc')).includes('Consultoria Teste'), `proposta ${lang}: nome do consultor`);
    const larg = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(larg <= 0, `proposta ${lang}: rolagem ${larg}px`);
    await page.close();
  }

  // ── Painel de Recuperação ──
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: 'pt-BR' });
    page.on('pageerror', (e) => erros.push(`painel: ${e.message}`));
    await page.goto('file://' + path.resolve(__dirname, '..', 'app', 'painel.html'));
    ok(!(await page.isVisible('#conteudo')), 'painel: deveria abrir vazio');
    await page.setInputFiles('#bt-abrir', path.join(__dirname, 'fixtures', 'diagnostico-exemplo.json'));
    await page.waitForSelector('#conteudo:not([hidden])');
    ok((await page.textContent('#k-base')).replace(/\s/g, ' ') === 'R$ 14.700', `painel: base ${await page.textContent('#k-base')}`);
    await page.click('#bt-lancar');
    ok((await page.inputValue('#f-mes')) === '2026-11', 'painel: próximo mês sugerido');
    await page.fill('[data-entrada="mdr_atual_pct"]', '2.4');
    await page.fill('[data-entrada="recompra_marketplace_pct"]', '40');
    await page.fill('#f-obs', 'troca de adquirente');
    await page.click('#form-mes button[type=submit]');
    ok((await page.textContent('#k-ultimo')).replace(/\s/g, ' ') === 'R$ 2.880', `painel: recuperado ${await page.textContent('#k-ultimo')}`);
    ok((await page.textContent('#k-meses')) === '1', 'painel: meses');
    ok(/R\$\s252/.test(await page.textContent('#b-resultado')), `painel: bônus ${await page.textContent('#b-resultado')}`);
    ok((await page.$$('#grafico rect')).length === 1, 'painel: gráfico');
    const larg = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(larg <= 0, `painel: rolagem ${larg}px`);
    await page.screenshot({ path: path.join(saida, 'painel.png'), fullPage: true });
    await page.reload();
    ok((await page.textContent('#k-meses')) === '1', 'painel: acompanhamento não voltou após recarregar');
    await page.close();
    const en = await browser.newPage({ viewport: { width: 390, height: 844 } });
    en.on('pageerror', (e) => erros.push(`painel en: ${e.message}`));
    await en.goto('file://' + path.resolve(__dirname, '..', 'app', 'painel.html') + '?lang=en');
    ok(/Recovery/.test(await en.textContent('h1')), 'painel en: título');
    const largEn = await en.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(largEn <= 0, `painel en celular: rolagem ${largEn}px`);
    await en.close();
  }
  await browser.close();
  const tudo = erros.concat(falhas);
  if (tudo.length) { console.error('FALHOU:\n- ' + tudo.join('\n- ')); process.exit(1); }
  console.log('UI ok: desktop + celular, sem pageerror; prints e PDF em ' + saida);
})();
