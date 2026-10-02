/*
 * Paquete BASE: SERVICIOS CON AGENDA — América Latina hispana (ES / LATAM)
 * Hereda las fórmulas de setores/servicos.js. Ejemplo por defecto: México (MXN).
 * Perfiles: setores/es/clinica.js, setores/es/salao.js.
 * Investigación: docs/mercados/latam-pesquisa-2026-10.md
 *
 * En LATAM también predomina la suscripción (Doctoralia, AgendaPro), no la
 * comisión por reserva: la fuga principal es la inasistencia (Chile, sector
 * público: 16,5%, rango 8,8–20,2%).
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('../_herdar.js');
  if (!(g.RXM_BASES && g.RXM_BASES.servicos) && typeof require !== 'undefined') require('../servicos.js');

  var bruto = herdar(g.RXM_BASES.servicos, {
    id: 'servicos-latam',
    nome: 'Servicios con agenda (genérico)',
    versao: '0.1.0',
    mercado: 'LATAM',
    idioma: 'es',
    moeda: 'MXN',
    termos: {
      cliente: 'cliente', clientes: 'clientes', atendimento: 'servicio', atendimentos: 'servicios',
      profissional: 'profesional', profissionais: 'profesionales', plataforma: 'plataforma de reservas'
    },
    grupos: [
      { id: 'geral', titulo: 'Números generales' },
      { id: 'agenda', titulo: 'Agenda: inasistencias y horarios vacíos' },
      { id: 'clientes', titulo: '{Clientes} y ventas' },
      { id: 'plataforma', titulo: '{Plataforma} e intermediarios' },
      { id: 'pagamentos', titulo: 'Pagos y caja' },
      { id: 'operacao', titulo: 'Operación y marketing' }
    ],
    entradas: [
      { id: 'faturamento', rotulo: 'Facturación total del mes', exemplo: 220000 },
      { id: 'atendimentos_mes', rotulo: '{Atendimentos} realizados por mes', exemplo: 400 },
      { id: 'ticket_medio', rotulo: 'Valor promedio de un {atendimento}', exemplo: 550 },
      { id: 'margem_contrib_pct', rotulo: 'Margen de contribución del {atendimento} (precio − material − comisión del {profissional} − tasa)', exemplo: 50,
        ajuda: 'La comisión del {profissional} por producción es costo variable y sale del margen; renta y sueldo fijo no.' },
      { id: 'falta_pct', rotulo: 'Inasistencias sin aviso (% de los {atendimentos} agendados)', exemplo: 15 },
      { id: 'falta_meta_pct', rotulo: 'Meta de inasistencias con confirmación automática y anticipo', exemplo: 7 },
      { id: 'horas_disponiveis_mes', rotulo: 'Horas de agenda disponibles en el mes (todos los {profissionais})', exemplo: 600 },
      { id: 'ocupacao_pct', rotulo: 'Ocupación de la agenda (horas agendadas ÷ disponibles)', exemplo: 65 },
      { id: 'ocupacao_meta_pct', rotulo: 'Meta de ocupación (lista de espera, horario valle, regreso programado)', exemplo: 75 },
      { id: 'receita_hora', rotulo: 'Ingreso promedio por hora atendida', exemplo: 380 },
      { id: 'clientes_novos_mes', rotulo: '{Clientes} nuevos por mes', exemplo: 60 },
      { id: 'retorno_atual_pct', rotulo: 'De ellos, cuántos vuelven en el plazo esperado (hoy)', exemplo: 40 },
      { id: 'retorno_meta_pct', rotulo: 'Meta de regreso con recordatorio programado', exemplo: 55 },
      { id: 'atendimentos_mes_recorrente', rotulo: '{Atendimentos} por mes de un {cliente} que vuelve', exemplo: 1 },
      { id: 'pct_com_adicional_atual', rotulo: '{Atendimentos} con servicio o producto adicional (hoy)', exemplo: 10 },
      { id: 'pct_com_adicional_meta', rotulo: 'Meta con oferta al agendar o en el {atendimento}', exemplo: 18 },
      { id: 'valor_adicional', rotulo: 'Valor promedio del adicional', exemplo: 220 },
      { id: 'margem_adicional_pct', rotulo: 'Margen del adicional', exemplo: 40 },
      { id: 'receita_plataforma', rotulo: 'Ingreso que viene de {plataforma}/marketplace que cobra por {cliente} o por reserva', exemplo: 0,
        ajuda: 'Solo lo que paga comisión por reserva o por {cliente} nuevo. La suscripción fija de software no es fuga por {cliente}.' },
      { id: 'comissao_plataforma_pct', rotulo: 'Costo efectivo de esa {plataforma} (% del ingreso que vino de ella)', exemplo: 0 },
      { id: 'custo_proprio_pct', rotulo: 'Costo de la agenda propia (% del ingreso)', exemplo: 2 },
      { id: 'recorrente_plataforma_pct', rotulo: 'Parte de ese ingreso de {clientes} que ya habían venido', exemplo: 30 },
      { id: 'fat_cartao', rotulo: 'Cobrado con tarjeta en el mes', exemplo: 130000 },
      { id: 'mdr_atual_pct', rotulo: 'Tasa promedio actual de la tarjeta (con IVA)', exemplo: 4.06 },
      { id: 'mdr_referencia_pct', rotulo: 'Tasa negociable de referencia', exemplo: 2.8 },
      { id: 'valor_antecipado', rotulo: 'Monto adelantado en el mes', exemplo: 0 },
      { id: 'custo_antecipacao_pct', rotulo: 'Costo del adelanto (% sobre lo adelantado)', exemplo: 0 },
      { id: 'juros_multas_mes', rotulo: 'Intereses, multas y cargos por falta de caja', exemplo: 0 },
      { id: 'horas_agenda_manual_semana', rotulo: 'Horas/semana agendando, confirmando y reprogramando por WhatsApp/teléfono', exemplo: 12 },
      { id: 'custo_hora', rotulo: 'Costo de la hora de quien lo hace (con cargas)', exemplo: 60 },
      { id: 'gasto_anuncios_mes', rotulo: 'Gasto en anuncios', exemplo: 3000 },
      { id: 'anuncio_para_clientes_pct', rotulo: 'Parte que llega a quien ya es {cliente}', exemplo: 30 }
    ],
    vazamentos: [
      { id: 'faltas', nome: 'Inasistencia sin aviso',
        explicacao: 'Horario reservado y vacío: el {profissional} está, el {atendimento} no ocurre. Confirmación automática, lista de espera y anticipo en los horarios más pedidos.',
        como_medir: { base: '% de inasistencias en las 4 semanas anteriores (de la agenda)', metrica: '% de inasistencias del mes × {atendimentos} × valor promedio', janela: 'mensual' },
        fonte: { texto: 'Chile, sector público: 16,5% de inasistencia (rango 8,8–20,2%; Medwave, datos 2005–2010). Medir en la agenda propia.', verificado: false } },
      { id: 'ociosidade', nome: 'Horario que nunca se agendó',
        explicacao: 'Agenda con hueco fijo (martes en la mañana, lunes en la tarde). Regreso programado, lista de espera y oferta para el horario valle llenan sin bajar el precio del horario pico.',
        como_medir: { base: 'Ocupación por día y franja en las 4 semanas anteriores', metrica: 'La misma ocupación después', janela: 'mensual' },
        fonte: { texto: 'Se mide en la agenda propia. La inasistencia entra en la fuga anterior, no aquí.', verificado: false } },
      { id: 'retorno', nome: '{Cliente} que no vuelve a tiempo',
        explicacao: 'El próximo {atendimento} tiene un plazo previsible. Sin recordatorio, el {cliente} se olvida o se va a otro lugar.',
        como_medir: { base: 'Regreso a tiempo de la cohorte de {clientes} nuevos antes del recordatorio', metrica: 'La misma tasa en las cohortes después', janela: 'por cohorte mensual' },
        fonte: { texto: 'La meta de regreso es supuesto del implementador; validar en 2 cohortes.', verificado: false } },
      { id: 'plataforma', nome: '{Plataforma} que cobra por un {cliente} que ya es suyo',
        explicacao: 'Cuando la {plataforma} cobra por reserva o por {cliente}, quien ya es de la casa paga otra vez. Si solo cobra suscripción, esta fuga es cero.',
        como_medir: { base: 'Ingreso y costo por canal en los 3 meses anteriores', metrica: 'Reservas directas de {clientes} que venían por la {plataforma}', janela: 'mensual' },
        fonte: { texto: 'Doctoralia (MX, CO) y AgendaPro (CL) cobran suscripción (oficial). El costo efectivo sale de la factura.', verificado: true } },
      { id: 'adicional', nome: 'Adicional que nadie ofrece',
        explicacao: 'Servicio complementario o producto ofrecido en el momento justo, sin presión.',
        como_medir: { base: '% de {atendimentos} con adicional en los 30 días anteriores', metrica: '% actual × valor promedio', janela: 'mensual' },
        fonte: { texto: 'Sale de la caja/sistema del propio negocio.', verificado: false } },
      { id: 'pagamentos', nome: 'Tasas de tarjeta por encima del mercado',
        explicacao: 'Tasa de descuento más alta de lo que el volumen permite negociar.',
        como_medir: { base: 'Estado de cuenta del adquirente de los 3 meses anteriores', metrica: 'Nueva tasa efectiva × volumen del mes', janela: 'mensual' },
        fonte: { texto: 'Mercado Pago Point México 3,50% + IVA (oficial).', verificado: true } },
      { id: 'antecipacao', nome: 'Adelanto de ventas con tarjeta',
        explicacao: 'Adelantar por costumbre cuesta intereses.',
        como_medir: { base: 'Costo de adelantos en los 3 meses anteriores', metrica: 'Costo en el mes', janela: 'mensual' },
        fonte: { texto: 'Estado de cuenta del propio negocio.', verificado: true } },
      { id: 'caixa', nome: 'Intereses y multas por falta de caja',
        explicacao: 'Pagos atrasados y sobregiros son síntoma de caja sin pronóstico.',
        como_medir: { base: 'Cargos en los 3 meses anteriores', metrica: 'Cargos en el mes', janela: 'mensual' },
        fonte: { texto: 'Estado de cuenta bancario.', verificado: true } },
      { id: 'mao_de_obra', nome: 'Recepción atrapada agendando y confirmando a mano',
        explicacao: 'Agenda en línea y confirmación automática liberan horas — ganancia real solo si las horas se reasignan.',
        como_medir: { base: 'Horas medidas en una semana típica antes', metrica: 'Horas en una semana típica después', janela: 'mensual' },
        fonte: { texto: 'Medir con el propio negocio.', verificado: false } },
      { id: 'marketing', nome: 'Anuncio que paga por quien ya es {cliente}',
        explicacao: 'Sin base propia no se puede excluir a los {clientes} actuales del anuncio ni hablarles gratis.',
        como_medir: { base: 'Costo por {cliente} nuevo atribuido a anuncios antes', metrica: 'El mismo costo con lista de exclusión', janela: 'mensual' },
        fonte: { texto: 'Estimación a validar con público personalizado.', verificado: false } }
    ],
    receitas: {
      'agenda-cheia': { nome: 'Agenda llena', doc: 'docs/es/modulos/servicos-agenda.md', resumo: 'Confirmación automática, lista de espera, anticipo, regreso programado, plan/suscripción con cobro recurrente.' },
      'aquisicao': { nome: 'Ganar y retener {clientes}', doc: 'docs/es/modulos/aquisicao.md', resumo: 'Base propia consentida, seguimiento de regreso, referidos.' },
      'cobranca': { nome: 'Cobros y pagos', doc: 'docs/es/modulos/cobranca.md', resumo: 'Tasas, pago instantáneo local, anticipo de reserva, adelanto solo cuando hace falta.' },
      'marketing-local': { nome: 'Marketing local y comunidad', doc: 'docs/es/modulos/marketing-local.md', resumo: 'Alianzas con negocios vecinos, presencia en Google, comunidad del barrio.' }
    },
    remover: { cacador: { alertas: ['mei'] } },
    cacador: {
      sinais: [
        { id: 'nota', rotulo: 'Calificación en Google' },
        { id: 'avaliacoes', rotulo: 'N.º de reseñas en Google' },
        { id: 'marketplace', rotulo: 'Está en {plataforma}/marketplace que cobra por {cliente}' },
        { id: 'instagram_ativo', rotulo: 'Instagram con publicación en los últimos 30 días' },
        { id: 'pedido_proprio', rotulo: 'Tiene agenda en línea propia' },
        { id: 'whatsapp_manual', rotulo: 'Agenda solo por WhatsApp/teléfono' },
        { id: 'fidelidade', rotulo: 'Tiene plan, club o suscripción' }
      ],
      criterios: [
        { id: 'nota', rotulo: 'Calificación en Google ≥ 4,5' },
        { id: 'avaliacoes', rotulo: '100+ reseñas (tiene demanda)' },
        { id: 'whatsapp_manual', rotulo: 'Agenda a mano (inasistencias y horarios vacíos)' },
        { id: 'sem_agenda_online', rotulo: 'Sin agenda en línea' },
        { id: 'marketplace', rotulo: 'Paga {plataforma} por {cliente}' },
        { id: 'instagram', rotulo: 'Instagram activo' },
        { id: 'sem_plano', rotulo: 'Sin plan/club/suscripción' }
      ],
      alertas: [
        { id: 'pouca_demanda', texto: 'Pocas reseñas: tal vez falte demanda.' },
        { id: 'nota_baixa', texto: 'Calificación menor a 4,0: el problema puede ser el servicio.' },
        { id: 'inativa', texto: 'El registro no aparece como activo.' }
      ],
      potencial: {
        formula: 'l.empleados ? [l.empleados[0] * 25000 * 0.02, l.empleados[1] * 50000 * 0.02] : null',
        aviso: 'Estimación gruesa por personal ocupado (DENUE) y ≈ 2% de la facturación en inasistencias y regreso (supuesto). Solo ordena; el número real sale de la Radiografía.'
      },
      conferir: [{ rotulo: 'Agenda en línea', busca: '{nome} {cidade} agendar cita en línea' }],
      textos: {
        demanda: 'Vi que {nome} tiene {nota} estrellas con {avaliacoes} reseñas en Google: {clientes} tienen.',
        conheco_local: 'Conozco {nome}, en {local}.',
        conheco: 'Conozco {nome}.',
        sem_canal: 'No encontré cómo agendar directo sin mandar mensaje: cada cita, confirmación y cambio pasa por alguien del equipo.',
        com_canal: 'Vi que ya tienen agenda en línea: la pregunta es cuánto de la agenda todavía queda vacía por inasistencias y por {clientes} que no vuelven a tiempo.',
        sem_fidelidade: 'Tampoco vi plan o club: el {cliente} que está contento no tiene motivo para asegurar el próximo horario.',
        convite: 'Hago un diagnóstico de 40 minutos que muestra, en pesos por mes, cuánto se escapa en inasistencias, horarios vacíos, {clientes} que no vuelven y tasa de tarjeta. Sin costo: si no aparecen al menos 6 mil pesos al mes, yo mismo le digo que no vale la pena. ¿Qué día le queda mejor?'
      },
      abordagem: 'Por lo que vi, la agenda depende de alguien que agenda y confirma a mano: ahí nacen la inasistencia sin aviso y el horario vacío.'
    }
  }, { resolver: false });

  g.RXM_BASES = g.RXM_BASES || {};
  g.RXM_BASES['servicos-latam'] = bruto;
  var pacote = herdar(bruto, { id: bruto.id });
  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
