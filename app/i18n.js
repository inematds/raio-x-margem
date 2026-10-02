/*
 * Idiomas da interface (PT / EN / ES). Conteúdo de negócio (perguntas,
 * vazamentos, receitas) vem do PACOTE de setor do mercado escolhido — outro
 * idioma é outro mercado: ES = América Latina, EN = modelo global.
 *
 *   RXM_I18N.lang            idioma ativo ('pt' | 'en' | 'es')
 *   RXM_I18N.t(chave, vars)  texto traduzido, com {var} substituído
 *   RXM_I18N.aplicar()       traduz [data-i18n], [data-i18n-html], [data-i18n-ph], [data-i18n-title]
 *   RXM_I18N.locale          locale para Intl (pt-BR, en, es)
 */
(function (g) {
  var D = {
    pt: {
      'rx.titulo': 'Raio-X de <span>Margem</span>',
      'rx.sub': 'Onde está indo embora o dinheiro que o cliente já faturou',
      'rx.cacador': 'Caçador de leads',
      'bt.exemplo': 'Preencher exemplo', 'bt.limpar': 'Limpar', 'bt.salvar': 'Salvar diagnóstico (.json)',
      'bt.abrir': 'Abrir diagnóstico', 'bt.imprimir': 'Imprimir relatório / PDF',
      'cli.titulo': 'Cliente', 'cli.nome': 'Nome do negócio', 'cli.cidade': 'Cidade / bairro', 'cli.data': 'Data do diagnóstico',
      'cli.resp': 'Responsável pelo diagnóstico',
      'cli.aviso': 'Preencha com o dono, com extrato e relatórios abertos. Campo vazio = "não sei": o vazamento fica fora da soma e vai para a lista de dados a levantar. Nada sai deste navegador.',
      'r.titulo': 'Vazamento estimado', 'r.por_mes': 'por mês', 'r.por_ano': 'por ano', 'r.do_fat': 'do faturamento',
      'r.recuperavel': 'Recuperável em 6 meses:', 'r.mes': 'mês', 'r.sem_dados': 'Sem dados ({n}):',
      'p.vazamento': 'Vazamento', 'p.perda': 'Perda/mês', 'p.recuperavel': 'Recuperável/mês', 'p.dificuldade': 'Dificuldade',
      'p.efeito': '1º efeito', 'p.corrigir': 'Como corrigir', 'p.medir': 'Como vamos medir o resultado', 'p.base': 'Base (antes)',
      'p.metrica': 'Métrica (depois)', 'p.janela': 'Janela', 'p.semanas': '{n} sem.', 'p.interno': 'processo interno',
      'p.o_negocio': 'o negócio', 'p.por': 'por {nome}',
      'p.manchete': '{nome} está deixando aproximadamente <strong>{total} por mês</strong> em {n} {pontos}. Começando pelas {k} prioridades ({somaTop}/mês de vazamento), nossa proposta é recuperar <strong class="verde">{rec} por mês</strong> ({recAno} por ano).',
      'p.ponto': 'ponto', 'p.pontos': 'pontos', 'p.vazio': 'Preencha os números com o dono para gerar o diagnóstico.',
      'p.premissas': '<b>Premissas.</b> Valores são estimativas a partir dos números informados.',
      'p.confirmar': 'Confirmar com documento (extrato, relatório de vendas, cotação) antes de fechar meta: {lista}.',
      'p.recuperavel_e': '"Recuperável" é o que é realista em 6 meses, não o vazamento inteiro.',
      'p.sem_dados': 'Pontos ainda sem dados: {lista}.',
      'p.exemplo': 'Exemplo', 'p.ex': 'ex.:',
      'erro.outro_setor': 'Diagnóstico de outro setor: {id}', 'erro.abrir': 'Não consegui abrir o arquivo: {msg}',
      'c.titulo': 'Caçador de <span>Margem</span>', 'c.sub': 'Quem já tem demanda e está perdendo dinheiro', 'c.raiox': 'abrir Raio-X',
      'c.importar': 'Importar leads (.json do coletor ou .csv)', 'c.novo': 'Adicionar lead', 'c.json': 'Exportar .json', 'c.csv': 'Exportar .csv',
      'c.limpar': 'Limpar lista',
      'c.aviso': 'Pontos = critérios já conferidos. A barra clara mostra até onde o lead pode chegar quando você conferir o que falta. <b>Potencial:</b> {aviso} Avaliações, Instagram e presença em plataformas se conferem à mão (os termos proíbem coleta automática — ver docs/TERMOS.md).',
      'c.buscar': 'Buscar nome, endereço, CNPJ…', 'c.todos_status': 'Todos os status', 'c.todos_bairros': 'Todos os bairros',
      'c.com_sem': 'Com e sem alertas', 'c.so_sem': 'Só sem alertas',
      'c.vazio': 'Nenhum lead ainda. Importe o <b>leads.json</b> gerado pelo coletor (<code>coletor/</code>), uma planilha .csv, ou adicione à mão.',
      'c.vazio_filtro': 'Nenhum lead com esses filtros.', 'c.de': '{a} de {b} leads', 'c.importados': '{n} importados de {arq}',
      'c.erro_importar': 'Não consegui importar: {msg}',
      'c.teto': 'teto {t} · {c}% conferido', 'c.sem_porte': 'sem porte', 'c.sem_nome': '(sem nome)',
      'c.conferir': 'Conferir', 'c.sinais': 'Sinais', 'c.dados': 'Dados', 'c.andamento': 'Andamento', 'c.status': 'Status',
      'c.obs': 'Observação', 'c.abordagem': 'Abordagem', 'c.copiar': 'Copiar abordagem', 'c.copiado': 'Copiado ✓',
      'c.abrir_raiox': 'Abrir Raio-X deste lead', 'c.remover': 'Remover', 'c.a_conferir': '? a conferir', 'c.sim': 'Sim', 'c.nao': 'Não',
      'c.aberto_em': 'aberto em {d}', 'c.tel': 'tel. {t}', 'c.uhs': '{n} UHs',
      'c.novo_titulo': 'Novo lead', 'c.nome': 'Nome', 'c.bairro': 'Bairro', 'c.cidade': 'Cidade', 'c.site': 'Site',
      'c.adicionar': 'Adicionar', 'c.cancelar': 'Cancelar',
      'st.a_contatar': 'A contatar', 'st.contatado': 'Contatado', 'st.raio_x': 'Raio-X marcado', 'st.proposta': 'Proposta enviada',
      'st.fechado': 'Fechado', 'st.descartado': 'Descartado',
      'setor': 'Setor', 'idioma': 'Idioma'
    },
    en: {
      'rx.titulo': 'Margin <span>X-Ray</span>',
      'rx.sub': 'Where the money the business already earned is leaking out',
      'rx.cacador': 'Lead hunter',
      'bt.exemplo': 'Fill in example', 'bt.limpar': 'Clear', 'bt.salvar': 'Save diagnosis (.json)',
      'bt.abrir': 'Open diagnosis', 'bt.imprimir': 'Print report / PDF',
      'cli.titulo': 'Client', 'cli.nome': 'Business name', 'cli.cidade': 'City / neighborhood', 'cli.data': 'Diagnosis date',
      'cli.resp': 'Diagnosis done by',
      'cli.aviso': 'Fill it in with the owner, with statements and reports open. Empty field = "don\'t know": that leak stays out of the total and goes to the list of data to collect. Nothing leaves this browser.',
      'r.titulo': 'Estimated leak', 'r.por_mes': 'per month', 'r.por_ano': 'per year', 'r.do_fat': 'of revenue',
      'r.recuperavel': 'Recoverable in 6 months:', 'r.mes': 'month', 'r.sem_dados': 'No data ({n}):',
      'p.vazamento': 'Leak', 'p.perda': 'Loss/month', 'p.recuperavel': 'Recoverable/month', 'p.dificuldade': 'Difficulty',
      'p.efeito': 'First effect', 'p.corrigir': 'How to fix', 'p.medir': 'How we will measure the result', 'p.base': 'Baseline (before)',
      'p.metrica': 'Metric (after)', 'p.janela': 'Window', 'p.semanas': '{n} wk', 'p.interno': 'internal process',
      'p.o_negocio': 'the business', 'p.por': 'by {nome}',
      'p.manchete': '{nome} is leaving roughly <strong>{total} per month</strong> on the table across {n} {pontos}. Starting with the top {k} priorities ({somaTop}/month leaking), our proposal is to recover <strong class="verde">{rec} per month</strong> ({recAno} per year).',
      'p.ponto': 'point', 'p.pontos': 'points', 'p.vazio': 'Fill in the numbers with the owner to generate the diagnosis.',
      'p.premissas': '<b>Assumptions.</b> Values are estimates based on the numbers provided.',
      'p.confirmar': 'Confirm with documents (statements, sales report, quotes) before committing to a target: {lista}.',
      'p.recuperavel_e': '"Recoverable" is what is realistic in 6 months, not the whole leak.',
      'p.sem_dados': 'Points still without data: {lista}.',
      'p.exemplo': 'Example', 'p.ex': 'e.g.',
      'erro.outro_setor': 'Diagnosis from another sector: {id}', 'erro.abrir': 'Could not open the file: {msg}',
      'c.titulo': 'Margin <span>Hunter</span>', 'c.sub': 'Businesses that already have demand and are losing money', 'c.raiox': 'open X-Ray',
      'c.importar': 'Import leads (collector .json or .csv)', 'c.novo': 'Add lead', 'c.json': 'Export .json', 'c.csv': 'Export .csv',
      'c.limpar': 'Clear list',
      'c.aviso': 'Points = criteria already checked. The light bar shows how far the lead can go once you check what is missing. <b>Potential:</b> {aviso} Reviews, Instagram and platform presence are checked by hand (platform terms forbid automated collection — see docs/TERMOS.md).',
      'c.buscar': 'Search name, address, company ID…', 'c.todos_status': 'All statuses', 'c.todos_bairros': 'All neighborhoods',
      'c.com_sem': 'With and without alerts', 'c.so_sem': 'Only without alerts',
      'c.vazio': 'No leads yet. Import the <b>leads.json</b> produced by the collector (<code>coletor/</code>), a .csv spreadsheet, or add one by hand.',
      'c.vazio_filtro': 'No leads match these filters.', 'c.de': '{a} of {b} leads', 'c.importados': '{n} imported from {arq}',
      'c.erro_importar': 'Could not import: {msg}',
      'c.teto': 'ceiling {t} · {c}% checked', 'c.sem_porte': 'no size data', 'c.sem_nome': '(no name)',
      'c.conferir': 'Check', 'c.sinais': 'Signals', 'c.dados': 'Data', 'c.andamento': 'Progress', 'c.status': 'Status',
      'c.obs': 'Note', 'c.abordagem': 'Outreach message', 'c.copiar': 'Copy message', 'c.copiado': 'Copied ✓',
      'c.abrir_raiox': 'Open X-Ray for this lead', 'c.remover': 'Remove', 'c.a_conferir': '? to check', 'c.sim': 'Yes', 'c.nao': 'No',
      'c.aberto_em': 'opened {d}', 'c.tel': 'phone {t}', 'c.uhs': '{n} rooms',
      'c.novo_titulo': 'New lead', 'c.nome': 'Name', 'c.bairro': 'Neighborhood', 'c.cidade': 'City', 'c.site': 'Website',
      'c.adicionar': 'Add', 'c.cancelar': 'Cancel',
      'st.a_contatar': 'To contact', 'st.contatado': 'Contacted', 'st.raio_x': 'X-Ray scheduled', 'st.proposta': 'Proposal sent',
      'st.fechado': 'Won', 'st.descartado': 'Discarded',
      'setor': 'Sector', 'idioma': 'Language'
    },
    es: {
      'rx.titulo': 'Radiografía de <span>Margen</span>',
      'rx.sub': 'Por dónde se escapa el dinero que el negocio ya facturó',
      'rx.cacador': 'Cazador de clientes',
      'bt.exemplo': 'Completar ejemplo', 'bt.limpar': 'Limpiar', 'bt.salvar': 'Guardar diagnóstico (.json)',
      'bt.abrir': 'Abrir diagnóstico', 'bt.imprimir': 'Imprimir informe / PDF',
      'cli.titulo': 'Cliente', 'cli.nome': 'Nombre del negocio', 'cli.cidade': 'Ciudad / barrio', 'cli.data': 'Fecha del diagnóstico',
      'cli.resp': 'Responsable del diagnóstico',
      'cli.aviso': 'Complételo con el dueño, con extractos e informes abiertos. Campo vacío = "no sé": esa fuga queda fuera de la suma y pasa a la lista de datos a levantar. Nada sale de este navegador.',
      'r.titulo': 'Fuga estimada', 'r.por_mes': 'por mes', 'r.por_ano': 'por año', 'r.do_fat': 'de la facturación',
      'r.recuperavel': 'Recuperable en 6 meses:', 'r.mes': 'mes', 'r.sem_dados': 'Sin datos ({n}):',
      'p.vazamento': 'Fuga', 'p.perda': 'Pérdida/mes', 'p.recuperavel': 'Recuperable/mes', 'p.dificuldade': 'Dificultad',
      'p.efeito': '1.er efecto', 'p.corrigir': 'Cómo corregir', 'p.medir': 'Cómo vamos a medir el resultado', 'p.base': 'Base (antes)',
      'p.metrica': 'Métrica (después)', 'p.janela': 'Ventana', 'p.semanas': '{n} sem.', 'p.interno': 'proceso interno',
      'p.o_negocio': 'el negocio', 'p.por': 'por {nome}',
      'p.manchete': '{nome} está dejando aproximadamente <strong>{total} por mes</strong> en {n} {pontos}. Empezando por las {k} prioridades ({somaTop}/mes de fuga), nuestra propuesta es recuperar <strong class="verde">{rec} por mes</strong> ({recAno} por año).',
      'p.ponto': 'punto', 'p.pontos': 'puntos', 'p.vazio': 'Complete los números con el dueño para generar el diagnóstico.',
      'p.premissas': '<b>Supuestos.</b> Los valores son estimaciones a partir de los números informados.',
      'p.confirmar': 'Confirmar con documentos (extracto, informe de ventas, cotización) antes de fijar una meta: {lista}.',
      'p.recuperavel_e': '"Recuperable" es lo realista en 6 meses, no la fuga entera.',
      'p.sem_dados': 'Puntos aún sin datos: {lista}.',
      'p.exemplo': 'Ejemplo', 'p.ex': 'ej.:',
      'erro.outro_setor': 'Diagnóstico de otro sector: {id}', 'erro.abrir': 'No pude abrir el archivo: {msg}',
      'c.titulo': 'Cazador de <span>Margen</span>', 'c.sub': 'Quien ya tiene demanda y está perdiendo dinero', 'c.raiox': 'abrir Radiografía',
      'c.importar': 'Importar leads (.json del recolector o .csv)', 'c.novo': 'Agregar lead', 'c.json': 'Exportar .json', 'c.csv': 'Exportar .csv',
      'c.limpar': 'Limpiar lista',
      'c.aviso': 'Puntos = criterios ya verificados. La barra clara muestra hasta dónde puede llegar el lead cuando verifique lo que falta. <b>Potencial:</b> {aviso} Reseñas, Instagram y presencia en plataformas se verifican a mano (los términos prohíben la recolección automática — ver docs/TERMOS.md).',
      'c.buscar': 'Buscar nombre, dirección, identificación fiscal…', 'c.todos_status': 'Todos los estados', 'c.todos_bairros': 'Todos los barrios',
      'c.com_sem': 'Con y sin alertas', 'c.so_sem': 'Solo sin alertas',
      'c.vazio': 'Todavía no hay leads. Importe el <b>leads.json</b> generado por el recolector (<code>coletor/</code>), una planilla .csv, o agregue a mano.',
      'c.vazio_filtro': 'Ningún lead con estos filtros.', 'c.de': '{a} de {b} leads', 'c.importados': '{n} importados de {arq}',
      'c.erro_importar': 'No pude importar: {msg}',
      'c.teto': 'techo {t} · {c}% verificado', 'c.sem_porte': 'sin tamaño', 'c.sem_nome': '(sin nombre)',
      'c.conferir': 'Verificar', 'c.sinais': 'Señales', 'c.dados': 'Datos', 'c.andamento': 'Avance', 'c.status': 'Estado',
      'c.obs': 'Observación', 'c.abordagem': 'Mensaje de contacto', 'c.copiar': 'Copiar mensaje', 'c.copiado': 'Copiado ✓',
      'c.abrir_raiox': 'Abrir Radiografía de este lead', 'c.remover': 'Quitar', 'c.a_conferir': '? a verificar', 'c.sim': 'Sí', 'c.nao': 'No',
      'c.aberto_em': 'abierto el {d}', 'c.tel': 'tel. {t}', 'c.uhs': '{n} habitaciones',
      'c.novo_titulo': 'Nuevo lead', 'c.nome': 'Nombre', 'c.bairro': 'Barrio', 'c.cidade': 'Ciudad', 'c.site': 'Sitio web',
      'c.adicionar': 'Agregar', 'c.cancelar': 'Cancelar',
      'st.a_contatar': 'Por contactar', 'st.contatado': 'Contactado', 'st.raio_x': 'Radiografía agendada', 'st.proposta': 'Propuesta enviada',
      'st.fechado': 'Cerrado', 'st.descartado': 'Descartado',
      'setor': 'Sector', 'idioma': 'Idioma'
    }
  };
  var LOCALE = { pt: 'pt-BR', en: 'en', es: 'es' };
  var NOMES = { pt: 'Português', en: 'English', es: 'Español' };

  function detectar() {
    if (typeof location === 'undefined') return 'pt';
    var pedido = new URLSearchParams(location.search).get('lang');
    var salvo = null;
    try { salvo = localStorage.getItem('rxm:lang'); } catch (e) { salvo = null; }
    var nav = ((typeof navigator !== 'undefined' && navigator.language) || 'pt').slice(0, 2);
    var l = [pedido, salvo, nav, 'pt'].filter(function (x) { return x && D[x]; })[0];
    try { localStorage.setItem('rxm:lang', l); } catch (e) { /* sem storage */ }
    return l;
  }

  var lang = detectar();
  function t(chave, vars) {
    var s = (D[lang] && D[lang][chave]) || D.pt[chave] || chave;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return k in vars ? vars[k] : m; });
    return s;
  }
  function aplicar(raiz) {
    raiz = raiz || document;
    document.documentElement.lang = LOCALE[lang];
    raiz.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    raiz.querySelectorAll('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    raiz.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
    raiz.querySelectorAll('[data-i18n-title]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-title'))); });
    var sel = document.getElementById('seletor-idioma');
    if (sel) {
      sel.innerHTML = Object.keys(D).map(function (k) { return '<option value="' + k + '"' + (k === lang ? ' selected' : '') + '>' + NOMES[k] + '</option>'; }).join('');
      sel.onchange = function () {
        var u = new URL(location.href);
        u.search = '';
        u.searchParams.set('lang', sel.value);
        location.href = u.toString();
      };
    }
  }

  g.RXM_I18N = { lang: lang, t: t, aplicar: aplicar, locale: LOCALE[lang], idiomas: Object.keys(D), dicionarios: D };
  if (typeof module !== 'undefined' && module.exports) module.exports = g.RXM_I18N;
})(typeof window !== 'undefined' ? window : globalThis);
