/*
 * Perfil: CLÍNICA / CONSULTORIO — América Latina hispana (ES / LATAM)
 * Hereda de setores/es/servicos.js. Misma lógica del perfil brasileño
 * (inasistencia = fuga n.º 1, glosa de aseguradora, tratamiento no iniciado),
 * con textos y reglas del mercado. Publicidad médica: en México se requiere aviso
 * o permiso de COFEPRIS, incluso para publicaciones orgánicas (proveedor; verificar
 * la norma). Datos de salud son datos sensibles en todas las leyes de la región.
 */
(function (g) {
  var herdar = g.RXM_HERDAR || require('../_herdar.js');
  if (!(g.RXM_BASES && g.RXM_BASES['servicos-latam']) && typeof require !== 'undefined') require('./servicos.js');
  var base = g.RXM_BASES['servicos-latam'];

  var pacote = herdar(base, {
    id: 'clinica-latam',
    nome: 'Clínica / consultorio',
    versao: '0.1.0',
    termos: { cliente: 'paciente', clientes: 'pacientes', atendimento: 'consulta', atendimentos: 'consultas', plataforma: 'plataforma de citas (Doctoralia, AgendaPro)' },
    remover: { vazamentos: ['adicional'], entradas: ['pct_com_adicional_atual', 'pct_com_adicional_meta', 'valor_adicional', 'margem_adicional_pct'] },
    grupos: [{ id: 'convenio', titulo: 'Aseguradoras y tratamientos' }],
    entradas: [
      { id: 'faturamento', exemplo: 330000 },
      { id: 'ticket_medio', exemplo: 900 },
      { id: 'margem_contrib_pct', exemplo: 60 },
      { id: 'falta_pct', exemplo: 16, ajuda: 'Referencia: Chile, sector público 16,5% (rango 8,8–20,2%). Mida en su agenda: inasistencias sin aviso ÷ citas agendadas.' },
      { id: 'falta_meta_pct', exemplo: 8 },
      { id: 'receita_hora', exemplo: 600 },
      { id: 'clientes_novos_mes', exemplo: 50 },
      { id: 'retorno_atual_pct', exemplo: 45, rotulo: 'De ellos, cuántos vuelven a su control/revisión a tiempo (hoy)' },
      { id: 'retorno_meta_pct', exemplo: 60 },
      { id: 'atendimentos_mes_recorrente', exemplo: 0.33, ajuda: 'Odontología con revisión semestral ≈ 0,17; tratamiento continuo (fisioterapia, psicología) puede pasar de 2.' },
      { id: 'fat_cartao', exemplo: 180000 },
      { id: 'horas_agenda_manual_semana', exemplo: 15 },
      { id: 'gasto_anuncios_mes', exemplo: 5000 },
      { id: 'fat_convenio', grupo: 'convenio', rotulo: 'Facturado a aseguradoras en el mes', unidade: 'R$', exemplo: 100000 },
      { id: 'glosa_pct', grupo: 'convenio', rotulo: 'Rechazos de la aseguradora (monto rechazado ÷ facturado)', unidade: '%', exemplo: 6,
        ajuda: 'Medir por aseguradora en los últimos 3 meses. No hay referencia pública confiable.' },
      { id: 'glosa_ref_pct', grupo: 'convenio', rotulo: 'Rechazo aceptable con revisión antes del envío', unidade: '%', exemplo: 2 },
      { id: 'orcamentos_mes', grupo: 'convenio', rotulo: 'Planes de tratamiento/presupuestos presentados por mes', unidade: 'un', exemplo: 40 },
      { id: 'aprovacao_atual_pct', grupo: 'convenio', rotulo: 'Aprobados hoy', unidade: '%', exemplo: 40 },
      { id: 'aprovacao_meta_pct', grupo: 'convenio', rotulo: 'Meta con seguimiento estructurado (explicación, opciones de pago en el consultorio)', unidade: '%', exemplo: 50 },
      { id: 'valor_orcamento', grupo: 'convenio', rotulo: 'Valor promedio de un plan de tratamiento', unidade: 'R$', exemplo: 7000 }
    ],
    vazamentos: [
      { id: 'glosa', nome: 'Rechazos de la aseguradora',
        entradas: ['fat_convenio', 'glosa_pct', 'glosa_ref_pct'],
        formula: 'fat_convenio * Math.max(0, glosa_pct - glosa_ref_pct)/100',
        recuperavel_pct: 50, dificuldade: 2, prazo_semanas: 6,
        explicacao: 'Monto facturado que la aseguradora rechaza por error de documento, autorización o código. Revisión antes del envío y reclamación organizada recuperan una parte.',
        como_medir: { base: 'Rechazo por aseguradora en los 3 meses anteriores', metrica: 'Rechazo por aseguradora en el mes', janela: 'mensual' },
        receitas: ['cobranca'],
        fonte: { texto: 'Sin referencia pública confiable; medir con los datos de la clínica.', verificado: false } },
      { id: 'orcamentos', nome: 'Tratamiento indicado que no empieza',
        entradas: ['orcamentos_mes', 'aprovacao_atual_pct', 'aprovacao_meta_pct', 'valor_orcamento', 'margem_contrib_pct'],
        formula: 'orcamentos_mes * Math.max(0, aprovacao_meta_pct - aprovacao_atual_pct)/100 * valor_orcamento * margem_contrib_pct/100',
        recuperavel_pct: 40, dificuldade: 3, prazo_semanas: 6,
        explicacao: 'Plan presentado y no iniciado: nadie llama para resolver dudas o ajustar el pago. El seguimiento es servicio de salud, no publicidad.',
        como_medir: { base: '% de planes aprobados en 60 días, en los 3 meses anteriores', metrica: 'La misma tasa después del seguimiento', janela: 'mensual' },
        receitas: ['agenda-cheia'],
        fonte: { texto: 'La tasa de aprobación sale del sistema de la clínica.', verificado: false } }
    ],
    cacador: {
      sinais: [
        { id: 'marketplace', rotulo: 'Está en Doctoralia/AgendaPro (ya paga agenda digital)' },
        { id: 'fidelidade', rotulo: 'Tiene plan propio/suscripción de cuidado continuo' }
      ],
      criterios: [
        { id: 'whatsapp_manual', peso: 25, rotulo: 'Agenda a mano (inasistencias y confirmación manual)' },
        { id: 'sem_agenda_online', peso: 10 },
        { id: 'marketplace', peso: 5, rotulo: 'Está en plataforma de citas' },
        { id: 'sem_plano', peso: 15, rotulo: 'Sin plan de cuidado continuo' }
      ],
      potencial: { formula: 'l.empleados ? [l.empleados[0] * 30000 * 0.03, l.empleados[1] * 60000 * 0.03] : null',
        aviso: 'Estimación gruesa por personal ocupado y ≈ 3% de la facturación en inasistencias y regreso (supuesto). Solo ordena.' },
      conferir: [{ rotulo: 'Doctoralia', busca: 'site:doctoralia.com.mx {nome} {cidade}' }],
      textos: {
        convite: 'Hago un diagnóstico de 40 minutos que muestra, en pesos por mes, cuánto se escapa en inasistencias, horarios vacíos, pacientes que no vuelven a su control, rechazos de aseguradoras y tasa de tarjeta — sin promociones ni publicidad, que la regulación sanitaria restringe. Sin costo: si no aparecen al menos 8 mil pesos al mes, yo mismo le digo que no vale la pena. ¿Qué día le queda mejor?'
      },
      abordagem: 'Por lo que vi, la agenda depende de alguien que agenda y confirma a mano: ahí nacen la inasistencia sin aviso y el horario vacío, que en una clínica suelen ser la mayor fuga.'
    }
  });

  (g.RXM_SETORES = g.RXM_SETORES || {})[pacote.id] = pacote;
  if (typeof module !== 'undefined' && module.exports) module.exports = pacote;
})(typeof window !== 'undefined' ? window : globalThis);
