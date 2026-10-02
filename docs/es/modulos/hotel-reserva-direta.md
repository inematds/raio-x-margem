# Módulo (hotel): Reservas directas sin romper la paridad

> Aborda: **OTA que cobra a un huésped que ya es suyo**, **programa de visibilidad que no se paga**, **huésped que no regresa**, **ingresos extra**, **cotizaciones manuales**, **no-show**. Reglas de contrato: [docs/setores/hotel.md](../../setores/hotel.md#contratos--o-que-muda-na-estratégia).

## La regla que lo define todo

En Chile, los acuerdos de la FNE eliminaron las cláusulas de paridad de precios de Booking y de las plataformas de delivery. Vender más barato en el canal propio es legal allí. En México, Colombia y Argentina no se encontró una acción sobre paridad de las OTA; revise el contrato y confirme la situación local antes de ofrecer una tarifa menor. [Fuente](../../mercados/latam-pesquisa-2026-10.md)

El canal directo puede competir con:

1. **Tarifa cerrada** — no publicada en línea: por correo electrónico, WhatsApp, en recepción o en un área para miembros de una base con consentimiento. Confirme las condiciones del contrato con asesoría local.
2. **Beneficios en vez de descuentos** — desayuno incluido, salida tardía, mejora de habitación sujeta a disponibilidad, botella de vino o crédito en un restaurante asociado.
3. **Comodidad** — motor de reservas rápido, pago local, confirmación inmediata y comunicación directa con el hotel. En México, CoDi/DiMo permite pagos comerciales sin costo; en Colombia el costo de Bre-B debe verificarse con el banco. [Fuente](../../mercados/latam-pesquisa-2026-10.md)

## Componentes

| Componente | Para qué sirve | Opción A (lista) | Opción B (abierta) |
|---|---|---|---|
| Motor de reservas | reservar y pagar en el sitio | del PMS | TastyIgniter no es adecuado; para una posada pequeña: calendario + medio de pago local + confirmación manual |
| Base propia con consentimiento | contactar a quienes ya se hospedaron | formulario de check-in con opt-in (papel o digital) | hoja de cálculo/CRM ([alternativas](../../ALTERNATIVAS-ABERTAS.md)) |
| Pre check-in | vender extras y obtener consentimiento | mensaje 3 días antes con enlace | formulario propio |
| Garantía | reducir no-shows | política + anticipo por medio de pago local | México: CoDi/DiMo; Colombia: costo de Bre-B por verificar; Argentina: QR interoperable; Perú: Yape/Plin ([cobranza](cobranca.md)) |
| Prueba de Preferente | comprobar si el aumento de comisión se justifica | 2 meses sin × con, en la misma época del año anterior | hoja de cálculo por canal |

Las comisiones de Booking reportadas para Latinoamérica son 15% para hoteles estándar, 18% para Preferente y 23% para Preferente Plus; son datos de una consultora y conviene confirmarlos en el contrato vigente. Airbnb publica tarifas distintas según el modelo y el tipo de alojamiento. [Fuente](../../mercados/latam-pesquisa-2026-10.md)

## Qué **no** hacer

- Publicar en el sitio un precio menor que en Booking sin confirmar que el contrato y las reglas locales lo permiten. En Chile, la FNE eliminó la paridad de precios para Booking.
- Enviar mensajes al contacto que proporcionó la OTA sin confirmar que el contrato y el consentimiento del huésped lo permiten.
- Invitar a “reservar directamente la próxima vez” dentro de la mensajería de una OTA.
- Anunciarse usando la marca de la OTA.

## Recorrido del huésped (con consentimiento obtenido por el hotel)

1. Check-in: “¿Desea recibir nuestras ofertas de temporada baja y tarifas para huéspedes?” (registrar el opt-in).
2. Durante la estadía: tarjeta en la habitación con QR del club de huéspedes.
3. Check-out + 2 días: agradecimiento + solicitud de reseña en Google.
4. Aniversario de la estadía / temporada baja: tarifa cerrada para huéspedes, por mensaje.

## Checklist

- [ ] Ingresos y comisiones por canal de los últimos 12 meses (base estacional)
- [ ] Motor de reservas en el sitio con medios de pago locales y tarjeta, probado en el celular
- [ ] Tarifas cerradas y beneficios definidos por escrito; confirmar si se pueden publicar según el contrato y el país
- [ ] Opt-in en el check-in + hoja de cálculo/CRM
- [ ] Mensaje de pre check-in con 3 extras
- [ ] Política de garantía publicada y aplicada
- [ ] Prueba del programa Preferente/Genius agendada (con fecha de revisión)

## Cómo medir

% de ingresos por canal directo × OTA, mes a mes frente al **mismo mes del año anterior**; comisión total pagada; % de reservas con extras; no-shows no cobrados; tasa de retorno en 12 meses por cohorte.
