/*
 * Paquete de sector: RESTAURANTE — América Latina hispana (ES / LATAM)
 *
 * Hereda las FÓRMULAS del paquete brasileño (setores/restaurante.js) y cambia
 * textos, ejemplos y referencias del mercado. Ejemplo por defecto: México (MXN).
 * Investigación con fuentes: docs/mercados/latam-pesquisa-2026-10.md
 *
 * Diferencias clave frente a Brasil:
 *  - el IVA se cobra SOBRE la comisión de la plataforma (MX 16%, CL 19%, AR 21%):
 *    25% de comisión ≈ 29% efectivo en México
 *  - no hay un "Pix" regional: CoDi/DiMo (MX, sin costo para el comercio), QR
 *    interoperable (AR, 0,6–0,8%), Yape/Plin (PE), Bre-B (CO, costo por banco)
 *  - en Chile la FNE eliminó la paridad de precios en delivery (2023): vender más
 *    barato en el canal propio es legal allí
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('../_herdar.js');
  var base = (g.RXM_SETORES && g.RXM_SETORES.restaurante) || require('../restaurante.js');

  var pacote = herdar(base, {
    id: 'restaurante-latam',
    nome: 'Restaurante (delivery + salón)',
    versao: '0.1.0',
    mercado: 'LATAM',
    idioma: 'es',
    moeda: 'MXN',
    grupos: [
      { id: 'geral', titulo: 'Números generales del negocio' },
      { id: 'delivery', titulo: 'Plataformas de delivery' },
      { id: 'pagamentos', titulo: 'Pagos y caja' },
      { id: 'clientes', titulo: 'Clientes y ventas' },
      { id: 'cozinha', titulo: 'Cocina, compras y menú' },
      { id: 'operacao', titulo: 'Operación y marketing' }
    ],
    entradas: [
      { id: 'faturamento', rotulo: 'Facturación total del mes', exemplo: 550000, ajuda: null },
      { id: 'pedidos_mes', rotulo: 'Pedidos/cuentas por mes (salón + delivery)', exemplo: 3000 },
      { id: 'ticket_medio', rotulo: 'Ticket promedio', exemplo: 180 },
      { id: 'margem_contrib_pct', rotulo: 'Margen de contribución promedio (precio − costo de insumos − empaque)', exemplo: 60,
        ajuda: 'Si no lo sabe, 55–65% es común en comida preparada; confírmelo con el costo real de insumos.' },
      { id: 'fat_marketplace', rotulo: 'Ventas por plataformas (Rappi, DiDi Food, Uber Eats, PedidosYa)', exemplo: 350000 },
      { id: 'taxa_marketplace_pct', rotulo: 'Costo efectivo de las plataformas (comisión + IVA sobre la comisión + publicidad obligatoria + promociones que paga usted ÷ ventas)', exemplo: 32,
        ajuda: 'Calcúlelo con la liquidación: (vendido − depositado) ÷ vendido. Las plataformas no publican tarifa; en México 25% de comisión ≈ 29% con IVA, más 4–5% de publicidad en algunos planes.' },
      { id: 'custo_canal_proprio_pct', rotulo: 'Costo del canal propio por pedido (pago + software + envío extra)', exemplo: 8,
        ajuda: 'CoDi/DiMo no tiene costo para el comercio en México; la tarjeta en terminal ronda 3,5% + IVA. Sea conservador con el envío.' },
      { id: 'recompra_marketplace_pct', rotulo: 'Parte de las ventas por plataforma que viene de clientes que YA compraron antes', exemplo: 30,
        ajuda: 'Si el panel de la plataforma no lo muestra, 30–50% es un supuesto a validar.' },
      { id: 'fat_cartao', rotulo: 'Ventas con tarjeta (terminal/link) en el mes', exemplo: 200000 },
      { id: 'mdr_atual_pct', rotulo: 'Tasa promedio actual de la tarjeta (con IVA)', exemplo: 4.06 },
      { id: 'mdr_referencia_pct', rotulo: 'Tasa negociable de referencia para ese volumen', exemplo: 2.8,
        ajuda: 'Pida propuesta a 2–3 adquirentes con el estado de cuenta en la mano.' },
      { id: 'valor_antecipado', rotulo: 'Monto adelantado en el mes (adelanto de ventas con tarjeta)', exemplo: 0 },
      { id: 'custo_antecipacao_pct', rotulo: 'Costo del adelanto (% sobre el monto adelantado)', exemplo: 0 },
      { id: 'chargeback_mes', rotulo: 'Pérdidas por contracargos, reembolsos o diferencias de conciliación', exemplo: 0 },
      { id: 'juros_multas_mes', rotulo: 'Intereses, multas y cargos por atraso', exemplo: 0 },
      { id: 'clientes_novos_mes', rotulo: 'Clientes nuevos por mes (todos los canales)', exemplo: 400 },
      { id: 'retorno_atual_pct', rotulo: 'De ellos, cuántos vuelven en 60 días hoy', exemplo: 20 },
      { id: 'retorno_meta_pct', rotulo: 'Meta de regreso con CRM + reactivación', exemplo: 35 },
      { id: 'pedidos_mes_recorrente', rotulo: 'Pedidos por mes de un cliente recurrente', exemplo: 2 },
      { id: 'pct_com_adicional_atual', rotulo: 'Pedidos que llevan bebida/postre/extra hoy', exemplo: 25 },
      { id: 'pct_com_adicional_meta', rotulo: 'Meta con oferta automática (combo, venta adicional)', exemplo: 40 },
      { id: 'valor_adicional', rotulo: 'Valor promedio del extra', exemplo: 45 },
      { id: 'cmv_mes', rotulo: 'Costo de insumos del mes', exemplo: 170000 },
      { id: 'desperdicio_pct', rotulo: 'Desperdicio estimado (% del costo de insumos)', exemplo: 10 },
      { id: 'desperdicio_ref_pct', rotulo: 'Desperdicio aceptable de referencia', exemplo: 4 },
      { id: 'compras_mes', rotulo: 'Compras a proveedores en el mes', exemplo: 170000 },
      { id: 'sobrepreco_compras_pct', rotulo: 'Sobreprecio evitable en compras (cotización, compra de emergencia)', exemplo: 3 },
      { id: 'vendas_baixa_margem_pct', rotulo: 'Parte de las ventas en platillos con margen por debajo del promedio', exemplo: 30 },
      { id: 'gap_margem_pp', rotulo: 'Cuántos puntos de margen quedan por debajo esos platillos', exemplo: 15 },
      { id: 'realocavel_pct', rotulo: 'Parte de esas ventas que se puede mover a platillos mejores (destacar, combo, precio)', exemplo: 20 },
      { id: 'horas_repetitivas_semana', rotulo: 'Horas/semana del equipo en WhatsApp, tomar pedidos, confirmar pagos', exemplo: 40 },
      { id: 'custo_hora', rotulo: 'Costo de la hora de trabajo con cargas', exemplo: 60 },
      { id: 'gasto_anuncios_mes', rotulo: 'Gasto en anuncios (Meta, Google, publicidad dentro de la plataforma)', exemplo: 8000 },
      { id: 'anuncio_para_clientes_pct', rotulo: 'Parte de ese gasto que llega a quien ya es cliente', exemplo: 40,
        ajuda: 'Sin una lista propia de clientes, el anuncio vuelve a pagar por quien ya conoce el lugar.' }
    ],
    vazamentos: [
      { id: 'marketplace', nome: 'La plataforma cobra otra vez por un cliente que ya es suyo',
        explicacao: 'Cada pedido de un cliente recurrente hecho por la plataforma paga la comisión (con IVA) de nuevo. La diferencia entre ese costo y el del canal propio, en esos pedidos, es la fuga.',
        como_medir: { base: 'Ventas y costo efectivo por plataforma en los 3 meses anteriores', metrica: 'Pedidos en el canal propio de clientes que venían de la plataforma × diferencia de costo', janela: 'mensual, comparando el mismo periodo y descontando promociones de la plataforma' },
        receitas: ['cardapio-vivo', 'aquisicao', 'marketing-local', 'canal-proprio'],
        fonte: { texto: 'México: Uber Eats 25–30% de comisión, efectivo con IVA hasta 33,6% (proveedor, 2025); las plataformas no publican tarifa única. Ver docs/mercados/latam-pesquisa-2026-10.md.', verificado: false } },
      { id: 'pagamentos', nome: 'Tasas de tarjeta por encima del mercado',
        explicacao: 'Tasa de descuento más alta de lo que el volumen permite negociar. Es la fuga más rápida de cerrar: propuesta de otro adquirente con el estado de cuenta en la mano. En México, CoDi/DiMo cobra 0% al comercio.',
        como_medir: { base: 'Estado de cuenta del adquirente de los 3 meses anteriores (tasa efectiva)', metrica: 'Nueva tasa efectiva × volumen del mes', janela: 'mensual' },
        fonte: { texto: 'Mercado Pago Point México: 3,50% + IVA (oficial). CoDi/DiMo sin costo para el comercio (Banxico, oficial).', verificado: true } },
      { id: 'antecipacao', nome: 'Adelanto de ventas y pérdidas de conciliación',
        explicacao: 'Adelantar por costumbre, sin necesidad, cuesta intereses. Contracargos y depósitos que nadie revisa son pérdida silenciosa.',
        como_medir: { base: 'Costo de adelantos y diferencias de conciliación de los 3 meses anteriores', metrica: 'Los mismos rubros en el mes actual', janela: 'mensual' },
        fonte: { texto: 'Valores del estado de cuenta del propio cliente.', verificado: true } },
      { id: 'caixa', nome: 'Intereses, multas y cargos por falta de flujo de caja',
        explicacao: 'Pagos atrasados y sobregiros son síntoma de caja sin pronóstico.',
        como_medir: { base: 'Cargos pagados en los 3 meses anteriores', metrica: 'Cargos pagados en el mes', janela: 'mensual' },
        fonte: { texto: 'Valores del estado de cuenta bancario.', verificado: true } },
      { id: 'retencao', nome: 'Clientes que compran una vez y no vuelven',
        explicacao: 'Margen que deja de entrar porque nadie le habla al cliente después de la primera compra. Calculado en margen, no en facturación.',
        como_medir: { base: 'Tasa de regreso en 60 días de la cohorte de clientes nuevos antes del CRM', metrica: 'La misma tasa en las cohortes después del CRM', janela: 'por cohorte mensual' },
        fonte: { texto: 'La meta de regreso es supuesto del implementador; validar tras 2 cohortes.', verificado: false } },
      { id: 'ticket', nome: 'Ticket bajo (nadie ofrece el extra)',
        explicacao: 'Bebida, postre y combo ofrecidos en el momento justo (menú propio, atención automática) suben el margen por pedido.',
        como_medir: { base: '% de pedidos con extra en los 30 días anteriores', metrica: '% actual × valor promedio del extra', janela: 'mensual' },
        fonte: { texto: 'La tasa de extras sale del reporte de ventas del punto de venta.', verificado: false } },
      { id: 'desperdicio', nome: 'Desperdicio e inventario',
        explicacao: 'Compra de más, producto que vence, porción inconsistente. Requiere pesar y receta estándar — es lo más trabajoso.',
        como_medir: { base: 'Registro de merma durante 2 semanas antes', metrica: 'Merma registrada ÷ costo de insumos', janela: 'quincenal' },
        fonte: { texto: 'Referencia de desperdicio a confirmar con el propio cliente.', verificado: false } },
      { id: 'compras', nome: 'Compras sin cotizar y proveedor por costumbre',
        explicacao: 'Precio que sube sin que nadie lo vea, compra de emergencia, falta de comparación.',
        como_medir: { base: 'Precio pagado de los 20 insumos más comprados en los 3 meses anteriores', metrica: 'Precio actual de los mismos insumos', janela: 'mensual' },
        fonte: { texto: 'Sobreprecio es supuesto; confirmar con una ronda de cotización.', verificado: false } },
      { id: 'cardapio', nome: 'Menú que vende más lo que deja menos',
        explicacao: 'Ingeniería de menú: destacar y armar combos con los platillos de mayor margen, revisar precio de los que venden mucho y rinden poco.',
        como_medir: { base: 'Mezcla de ventas y margen por platillo del mes anterior', metrica: 'Margen promedio ponderado de la mezcla actual', janela: 'mensual' },
        fonte: { texto: 'Requiere receta estándar (costo por platillo).', verificado: false } },
      { id: 'mao_de_obra', nome: 'Equipo atrapado en tareas repetitivas',
        explicacao: 'Responder la misma pregunta, tomar pedidos, confirmar transferencias. La automatización libera horas — la ganancia es real solo si las horas se reasignan o dejan de pagarse.',
        como_medir: { base: 'Horas medidas en una semana típica antes', metrica: 'Horas medidas en una semana típica después', janela: 'mensual' },
        fonte: { texto: 'Medir con el propio cliente; no estimar.', verificado: false } },
      { id: 'marketing', nome: 'Anuncio que vuelve a pagar por quien ya es cliente',
        explicacao: 'Sin base propia no se puede excluir a los clientes actuales del público del anuncio ni hablarles gratis.',
        como_medir: { base: 'Costo por pedido atribuido a anuncios antes', metrica: 'El mismo costo con lista de exclusión y canal propio', janela: 'mensual' },
        fonte: { texto: 'La parte que llega a clientes es estimación; validar con público personalizado.', verificado: false } }
    ],
    receitas: {
      'cardapio-vivo': { nome: 'Menú vivo', doc: 'docs/es/modulos/cardapio-vivo.md', resumo: 'Menú propio que cambia cada día y se difunde solo (Google, Instagram, estados de WhatsApp).' },
      'aquisicao': { nome: 'Ganar y retener clientes', doc: 'docs/es/modulos/aquisicao.md', resumo: 'La plataforma trae, el canal propio retiene: captura de contacto, CRM, reactivación y referidos.' },
      'cobranca': { nome: 'Cobros y pagos', doc: 'docs/es/modulos/cobranca.md', resumo: 'Renegociar tasas, pago instantáneo local (CoDi/DiMo, QR, Yape), conciliación, adelanto solo cuando hace falta.' },
      'marketing-local': { nome: 'Marketing local y comunidad', doc: 'docs/es/modulos/marketing-local.md', resumo: 'El restaurante como punto de encuentro del barrio: canal, alianzas, eventos, referidos.' },
      'canal-proprio': { nome: '100% canal propio', doc: 'docs/es/modulos/canal-proprio.md', resumo: 'Salir de la plataforma por etapas, con piezas de código abierto, cuando la marca del barrio lo sostiene.' }
    },
    remover: { cacador: { alertas: ['mei', 'so_delivery'] } },
    cacador: {
      cnaes: [],
      sinais: [
        { id: 'nota', rotulo: 'Calificación en Google' },
        { id: 'avaliacoes', rotulo: 'N.º de reseñas en Google' },
        { id: 'marketplace', rotulo: 'Está en plataformas de delivery' },
        { id: 'instagram_ativo', rotulo: 'Instagram con publicación en los últimos 30 días' },
        { id: 'pedido_proprio', rotulo: 'Tiene pedido en línea propio' },
        { id: 'whatsapp_manual', rotulo: 'Pedidos por WhatsApp atendidos a mano' },
        { id: 'fidelidade', rotulo: 'Tiene programa de lealtad/club/cashback visible' }
      ],
      criterios: [
        { id: 'nota', rotulo: 'Calificación en Google ≥ 4,5' },
        { id: 'avaliacoes', rotulo: '500+ reseñas (tiene demanda)' },
        { id: 'marketplace', rotulo: 'Activo en plataformas de delivery' },
        { id: 'instagram', rotulo: 'Instagram activo' },
        { id: 'sem_pedido_proprio', rotulo: 'Sin pedido propio' },
        { id: 'whatsapp_manual', rotulo: 'WhatsApp atendido a mano' },
        { id: 'sem_fidelidade', rotulo: 'Sin lealtad/CRM visible' }
      ],
      alertas: [
        { id: 'pouca_demanda', texto: 'Pocas reseñas: tal vez falte demanda, no canal.' },
        { id: 'nota_baixa', texto: 'Calificación menor a 4,0: el problema puede ser el producto o el servicio.' },
        { id: 'inativa', texto: 'El registro no aparece como activo.' }
      ],
      // DENUE (México) trae el estrato de personal ocupado: ventas ≈ personal × MXN 30–60 mil/mes (supuesto)
      potencial: {
        formula: 'l.empleados ? [l.empleados[0] * 30000 * 0.0094, l.empleados[1] * 60000 * 0.0094] : null',
        aviso: 'Estimación gruesa por personal ocupado (DENUE) y promedios del sector (supuesto). Solo sirve para ordenar; el número real sale de la Radiografía.'
      },
      conferir: [
        { rotulo: 'Rappi', busca: 'site:rappi.com.mx {nome} {cidade}' },
        { rotulo: 'DiDi Food / Uber Eats', busca: '{nome} {cidade} didi food OR uber eats' }
      ],
      textos: {
        demanda: 'Vi que {nome} tiene {nota} estrellas con {avaliacoes} reseñas en Google: demanda tienen.',
        conheco_local: 'Conozco {nome}, en {local}.',
        conheco: 'Conozco {nome}.',
        sem_canal: 'No encontré cómo pedir directo sin pasar por una app: cada cliente que vuelve podría volver por un canal suyo.',
        com_canal: 'Vi que ya tienen pedido en línea propio: la pregunta es cuánto de la venta todavía paga 25–30% más IVA en las apps.',
        sem_fidelidade: 'Tampoco vi programa de lealtad: el cliente que compra una vez no tiene motivo para volver.',
        convite: 'Hago un diagnóstico de 40 minutos que muestra, en pesos por mes, cuánto se escapa en comisiones de apps, tarjeta y clientes que no vuelven. Sin costo: si no aparecen al menos 8 mil pesos al mes, yo mismo le digo que no vale la pena. ¿Qué día le queda mejor?'
      },
      abordagem: 'Su restaurante claramente ya tiene demanda. El problema no parece ser conseguir clientes: cada vez que un cliente vuelve por la app, usted vuelve a pagar comisión, con IVA, por alguien que ya conoce su marca.'
    }
  });

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
