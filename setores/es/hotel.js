/*
 * Paquete de sector: HOTEL / POSADA — América Latina hispana (ES / LATAM)
 * Hereda las fórmulas de setores/hotel.js. Ejemplo por defecto: México (MXN).
 * Investigación: docs/mercados/latam-pesquisa-2026-10.md
 *
 * Paridad: en Chile la FNE eliminó las cláusulas de paridad de Booking
 * (acuerdo 41/2026) — el sitio propio puede ser más barato. En los demás países
 * no se encontró acción de la autoridad: revisar el contrato de cada OTA.
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('../_herdar.js');
  var base = (g.RXM_SETORES && g.RXM_SETORES.hotel) || require('../hotel.js');

  var pacote = herdar(base, {
    id: 'hotel-latam',
    nome: 'Hotel / posada',
    versao: '0.1.0',
    mercado: 'LATAM',
    idioma: 'es',
    moeda: 'MXN',
    grupos: [
      { id: 'geral', titulo: 'Números generales del hospedaje' },
      { id: 'canais', titulo: 'Agencias en línea (OTAs) y reserva directa' },
      { id: 'temporada', titulo: 'Ocupación y temporada baja' },
      { id: 'hospedes', titulo: 'Huéspedes e ingresos extra' },
      { id: 'pagamentos', titulo: 'Pagos, cancelaciones y caja' },
      { id: 'operacao', titulo: 'Operación y marketing' }
    ],
    entradas: [
      { id: 'faturamento', rotulo: 'Ingreso total del mes (noches + extras)', exemplo: 900000 },
      { id: 'uhs', rotulo: 'Habitaciones/cabañas', exemplo: 30 },
      { id: 'reservas_mes', rotulo: 'Reservas por mes', exemplo: 220 },
      { id: 'valor_reserva', rotulo: 'Valor promedio de una reserva (estancia completa)', exemplo: 4000 },
      { id: 'margem_contrib_pct', rotulo: 'Margen de contribución de la noche (tarifa − costos variables: lavandería, desayuno, amenidades, comisión promedio)', exemplo: 65,
        ajuda: 'Los costos fijos (nómina, renta) no entran: el cuarto vacío no ahorra nómina.' },
      { id: 'receita_ota', rotulo: 'Ingreso que viene de OTAs (Booking, Expedia, Airbnb, Despegar)', exemplo: 540000 },
      { id: 'comissao_ota_pct', rotulo: 'Costo efectivo de las OTAs (comisión + programa Preferente/Genius + pago + IVA sobre la comisión)', exemplo: 20,
        ajuda: 'Booking en LATAM: 15% estándar, 18% Preferente, 23% Preferente Plus (proveedor, 04/2025); Expedia ~19%; Airbnb tarifa única 15,5% (16% en México). Use las facturas del mes.' },
      { id: 'custo_direto_pct', rotulo: 'Costo de la reserva directa (motor de reservas + pago + anuncio de marca)', exemplo: 6 },
      { id: 'recorrente_ota_pct', rotulo: 'Parte del ingreso por OTA de huéspedes que ya se hospedaron o que podrían reservar directo', exemplo: 15,
        ajuda: 'Cruce el nombre del huésped de OTA con el historial del sistema. Sin historial: 10–20% es supuesto a validar.' },
      { id: 'adicional_programa_pct', rotulo: 'Puntos extra pagados por programas de visibilidad (ej.: Preferente = +3 p.p.)', exemplo: 3 },
      { id: 'programa_sem_retorno_pct', rotulo: 'Parte de ese extra que NO vuelve como reservas adicionales', exemplo: 50,
        ajuda: 'Prueba: compare reservas por OTA 2 meses con y sin el programa. Sin prueba, 50% es supuesto.' },
      { id: 'ocupacao_baixa_pct', rotulo: 'Ocupación promedio en los meses de temporada baja', exemplo: 40 },
      { id: 'ocupacao_meta_baixa_pct', rotulo: 'Meta realista de ocupación en temporada baja (paquetes, eventos, mercado regional, corporativo)', exemplo: 48 },
      { id: 'diaria_baixa', rotulo: 'Tarifa promedio por noche en temporada baja', exemplo: 1400 },
      { id: 'retorno_atual_pct', rotulo: 'Huéspedes que vuelven en 12 meses (hoy)', exemplo: 4 },
      { id: 'retorno_meta_pct', rotulo: 'Meta de regreso con base propia + oferta al huésped', exemplo: 8 },
      { id: 'pct_com_extra_atual', rotulo: 'Reservas que compran extra (cena, salida tardía, traslado, paquete, mejora)', exemplo: 15 },
      { id: 'pct_com_extra_meta', rotulo: 'Meta con oferta antes de la llegada (pre check-in)', exemplo: 25 },
      { id: 'valor_extra', rotulo: 'Valor promedio del extra', exemplo: 700 },
      { id: 'margem_extra_pct', rotulo: 'Margen del extra', exemplo: 50 },
      { id: 'fat_cartao', rotulo: 'Cobrado con tarjeta (fuera de las OTAs) en el mes', exemplo: 300000 },
      { id: 'mdr_atual_pct', rotulo: 'Tasa promedio actual de la tarjeta (con IVA)', exemplo: 4.06 },
      { id: 'mdr_referencia_pct', rotulo: 'Tasa negociable de referencia', exemplo: 2.8 },
      { id: 'valor_antecipado', rotulo: 'Monto adelantado en el mes', exemplo: 0 },
      { id: 'custo_antecipacao_pct', rotulo: 'Costo del adelanto (% sobre lo adelantado)', exemplo: 0 },
      { id: 'cancelamentos_mes', rotulo: 'Cancelaciones tardías o no-shows por mes', exemplo: 6 },
      { id: 'nao_cobrado_pct', rotulo: 'Parte de ellos que no se cobró (sin garantía/prepago)', exemplo: 70 },
      { id: 'juros_multas_mes', rotulo: 'Intereses, multas y cargos por falta de caja (temporada baja)', exemplo: 0 },
      { id: 'horas_reserva_manual_semana', rotulo: 'Horas/semana respondiendo cotizaciones y reservas por WhatsApp/correo', exemplo: 25 },
      { id: 'custo_hora', rotulo: 'Costo de la hora de trabajo con cargas', exemplo: 70 },
      { id: 'gasto_anuncios_mes', rotulo: 'Gasto en anuncios y metabuscadores (Google Hotel Ads, Meta)', exemplo: 10000 },
      { id: 'anuncio_para_clientes_pct', rotulo: 'Parte que llega a quien ya se hospedó', exemplo: 30 }
    ],
    vazamentos: [
      { id: 'ota_recorrente', nome: 'La OTA cobra comisión por un huésped que ya es suyo',
        explicacao: 'El huésped que vuelve, o que encontró el hotel en Google y reservó por la OTA, paga comisión otra vez. La diferencia con el costo de la reserva directa es la fuga.',
        como_medir: { base: 'Ingreso y comisión por canal en los 3 meses equivalentes del año anterior (estacionalidad)', metrica: 'Reservas directas de huéspedes identificados × diferencia de costo', janela: 'mensual, contra el mismo mes del año anterior' },
        fonte: { texto: 'Booking LATAM 15/18/23% (proveedor, 04/2025); Airbnb 15,5%/16% MX (oficial). Ver docs/mercados/latam-pesquisa-2026-10.md.', verificado: true } },
      { id: 'programa_ota', nome: 'Programa de visibilidad de la OTA que no se paga',
        explicacao: 'Preferente/Genius cobran puntos extra por visibilidad. Si las reservas adicionales no pagan el extra, es dinero que se va. Se resuelve con prueba: 2 meses con y sin.',
        como_medir: { base: 'Reservas y comisión por OTA con el programa activo', metrica: 'Las mismas métricas en el periodo de prueba sin el programa', janela: 'bimestral, ajustado por estacionalidad' },
        fonte: { texto: 'Preferente 18% / Preferente Plus 23% × estándar 15% (proveedor). El retorno del programa es supuesto a probar.', verificado: false } },
      { id: 'baixa_temporada', nome: 'Cuarto vacío en temporada baja',
        explicacao: 'Margen perdido por mes de temporada baja: cuartos que podrían venderse con paquete, evento, mercado regional o corporativo.',
        como_medir: { base: 'Ocupación y tarifa de los meses bajos del año anterior', metrica: 'Ocupación y tarifa de los mismos meses, con paquetes/acciones registrados', janela: 'mensual en temporada baja' },
        fonte: { texto: 'Meta es supuesto del implementador; medir con el propio hotel.', verificado: false } },
      { id: 'retorno', nome: 'Huésped que no vuelve',
        explicacao: 'Cada mes de huéspedes genera regresos a lo largo del año; en régimen, la ganancia mensual equivale a este valor. Base propia con consentimiento (check-in), nunca el contacto que entrega la OTA.',
        como_medir: { base: 'Tasa de regreso en 12 meses en el sistema antes de la base propia', metrica: 'La misma tasa en las cohortes después', janela: 'trimestral por cohorte' },
        fonte: { texto: 'Directo vuelve 5,1% × OTA 1,3% (Bookboost, 2,2 M huéspedes en Europa, proveedor). Sin dato latinoamericano.', verificado: false } },
      { id: 'extras', nome: 'Ingreso extra que nadie ofrece',
        explicacao: 'Cena, salida tardía, traslado, tour, mejora de habitación: ofrecidos en el pre check-in por mensaje, se venden sin descuento.',
        como_medir: { base: '% de reservas con extra en los 60 días anteriores', metrica: '% actual × valor promedio del extra', janela: 'mensual' },
        fonte: { texto: 'La tasa de extras sale del sistema/caja del propio hotel.', verificado: false } },
      { id: 'no_show', nome: 'Cancelación tardía y no-show sin cobro',
        explicacao: 'Reserva directa sin garantía (tarjeta o anticipo por transferencia/CoDi) se convierte en cuarto bloqueado y vacío. Política clara + anticipo.',
        como_medir: { base: 'No-shows y cancelaciones tardías no cobradas en los 3 meses equivalentes', metrica: 'El mismo número con política de garantía', janela: 'mensual' },
        fonte: { texto: 'Valores del propio hotel.', verificado: false } },
      { id: 'pagamentos', nome: 'Tasas de tarjeta por encima del mercado',
        explicacao: 'Tasa de descuento más alta de lo que el volumen permite negociar; el hotel tiene ticket alto y meses sin intereses, que pesan más.',
        como_medir: { base: 'Estado de cuenta del adquirente de los 3 meses anteriores', metrica: 'Nueva tasa efectiva × volumen del mes', janela: 'mensual' },
        fonte: { texto: 'Mercado Pago Point México 3,50% + IVA (oficial).', verificado: true } },
      { id: 'antecipacao', nome: 'Adelanto de ventas con tarjeta',
        explicacao: 'En temporada baja el hotel adelanta para pagar la nómina: crédito caro. Pronóstico de caja y anticipos en las reservas de temporada alta reducen la necesidad.',
        como_medir: { base: 'Costo de adelantos en los 3 meses equivalentes', metrica: 'Costo en el mes actual', janela: 'mensual' },
        fonte: { texto: 'Estado de cuenta del propio hotel.', verificado: true } },
      { id: 'caixa', nome: 'Intereses y multas por falta de caja',
        explicacao: 'Estacionalidad fuerte sin pronóstico de caja termina en sobregiro en temporada baja.',
        como_medir: { base: 'Cargos en los 3 meses equivalentes', metrica: 'Cargos en el mes', janela: 'mensual' },
        fonte: { texto: 'Estado de cuenta bancario del hotel.', verificado: true } },
      { id: 'mao_de_obra', nome: 'Recepción atrapada cotizando a mano',
        explicacao: 'Responder "¿hay lugar tal día? ¿cuánto sale?" a mano. Motor de reservas y respuesta automática liberan horas — ganancia real solo si las horas se reasignan.',
        como_medir: { base: 'Horas medidas en una semana típica antes', metrica: 'Horas en una semana típica después', janela: 'mensual' },
        fonte: { texto: 'Medir con el propio hotel.', verificado: false } },
      { id: 'marketing', nome: 'Anuncio que paga por quien ya se hospedó',
        explicacao: 'Sin base propia, el anuncio vuelve a pagar por quien ya conoce el hotel. Con base consentida se puede excluir y hablarles gratis.',
        como_medir: { base: 'Costo por reserva atribuida a anuncios antes', metrica: 'El mismo costo con lista de exclusión', janela: 'mensual' },
        fonte: { texto: 'Estimación a validar con público personalizado.', verificado: false } }
    ],
    receitas: {
      'reserva-direta': { nome: 'Reserva directa sin romper la paridad', doc: 'docs/es/modulos/hotel-reserva-direta.md', resumo: 'Motor de reservas, tarifa cerrada y beneficio para quien reserva directo, base propia consentida, pre check-in con extras.' },
      'baixa-temporada': { nome: 'Temporada baja', doc: 'docs/es/modulos/hotel-baixa-temporada.md', resumo: 'Paquetes, mercado regional, corporativo y eventos; estancia mínima en picos; precio por demanda.' },
      'aquisicao': { nome: 'Ganar y retener clientes', doc: 'docs/es/modulos/aquisicao.md', resumo: 'La OTA trae, el canal propio retiene: base consentida, seguimiento, referidos.' },
      'cobranca': { nome: 'Cobros y pagos', doc: 'docs/es/modulos/cobranca.md', resumo: 'Tasas, garantía de reserva, adelanto solo cuando hace falta, caja de la temporada baja.' },
      'marketing-local': { nome: 'Marketing local y comunidad', doc: 'docs/es/modulos/marketing-local.md', resumo: 'Alianzas con restaurantes, atracciones y eventos de la ciudad.' }
    },
    remover: { cacador: { alertas: ['mei', 'motel'] } },
    cacador: {
      cnaes: [],
      sinais: [
        { id: 'nota', rotulo: 'Calificación en Google' },
        { id: 'avaliacoes', rotulo: 'N.º de reseñas en Google' },
        { id: 'marketplace', rotulo: 'Vende por OTAs (Booking, Expedia, Airbnb, Despegar)' },
        { id: 'instagram_ativo', rotulo: 'Instagram con publicación en los últimos 30 días' },
        { id: 'pedido_proprio', rotulo: 'Tiene motor de reserva directa en el sitio' },
        { id: 'whatsapp_manual', rotulo: 'Reserva directa solo por WhatsApp/correo' },
        { id: 'fidelidade', rotulo: 'Tiene programa de huésped frecuente/club' }
      ],
      criterios: [
        { id: 'nota', rotulo: 'Calificación en Google ≥ 4,5' },
        { id: 'avaliacoes', rotulo: '300+ reseñas (tiene demanda)' },
        { id: 'marketplace', rotulo: 'Vende por OTA' },
        { id: 'instagram', rotulo: 'Instagram activo' },
        { id: 'sem_motor', rotulo: 'Sin motor de reserva directa' },
        { id: 'whatsapp_manual', rotulo: 'Reserva directa a mano' },
        { id: 'sem_fidelidade', rotulo: 'Sin programa de huésped' }
      ],
      alertas: [
        { id: 'pequeno', texto: 'Menos de 8 habitaciones: ingreso pequeño para pagar la implementación.' },
        { id: 'rede', texto: 'Más de 200 habitaciones: probablemente cadena con central propia — la decisión no está en el hotel.' },
        { id: 'pouca_demanda', texto: 'Pocas reseñas: tal vez falte demanda.' },
        { id: 'nota_baixa', texto: 'Calificación menor a 4,0: el problema puede ser el producto o el servicio.' },
        { id: 'inativa', texto: 'El registro no aparece como activo.' }
      ],
      // habitaciones × 30 noches × ocupación 45–60% × tarifa MXN 900–2.500 (supuesto) × fuga de OTA (0,55 × 0,18 × 0,15)
      potencial: {
        formula: 'l.uhs ? [l.uhs * 30 * 0.45 * 900 * 0.55 * 0.18 * 0.15, l.uhs * 30 * 0.60 * 2500 * 0.55 * 0.18 * 0.15] : null',
        aviso: 'Estimación gruesa por número de habitaciones y rango de tarifa (supuesto). Solo sirve para ordenar; el número real sale de la Radiografía.'
      },
      conferir: [
        { rotulo: 'Booking', busca: 'site:booking.com {nome} {cidade}' },
        { rotulo: 'Airbnb / Despegar', busca: '{nome} {cidade} airbnb OR despegar OR expedia' }
      ],
      textos: {
        demanda: 'Vi que {nome} tiene {nota} estrellas con {avaliacoes} reseñas en Google: huéspedes tienen.',
        conheco_local: 'Conozco {nome}, en {local}.',
        conheco: 'Conozco {nome}.',
        sem_canal: 'No encontré cómo reservar directo en su sitio sin pasar por una agencia o mandar mensaje: quien ya conoce el lugar termina reservando por la OTA.',
        com_canal: 'Vi que ya tienen reserva directa en el sitio: la pregunta es cuánto del ingreso todavía paga 15–23% a las OTAs, y por dónde vuelve quien ya se hospedó.',
        sem_fidelidade: 'Tampoco vi nada para quien vuelve: el huésped satisfecho no tiene motivo para reservar directo la próxima vez.',
        convite: 'Hago un diagnóstico de 40 minutos que muestra, en pesos por mes, cuánto se escapa en comisión de OTA de huéspedes que ya son suyos, cuartos vacíos en temporada baja y tasa de tarjeta, revisando lo que su contrato permite sobre precios. Sin costo: si no aparecen al menos 10 mil pesos al mes, yo mismo le digo que no vale la pena. ¿Qué día le queda mejor?'
      },
      abordagem: 'Por lo que vi, el lugar vende bien por las agencias en línea. El punto es que el huésped que vuelve, o que ya los encontró en Google, también paga comisión — y eso se recupera con beneficios y tarifa cerrada, sin publicar un precio menor si el contrato lo prohíbe.'
    }
  });

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
