# Módulo: Cobros y pagos

> Ataca: **pagos** (comisiones altas), **anticipos y conciliación**, **caja** (intereses y recargos). Es el módulo de **resultados más rápidos**: normalmente es el primero que se implementa, porque ayuda a financiar el resto del proyecto.

## 1. Tasas de tarjeta (2 semanas)

1. Obtener los estados de cuenta de cada adquirente de los últimos 3 meses y calcular la **tasa efectiva** por modalidad (débito, crédito al contado y en cuotas, cuando aplique).
2. Comparar con las referencias disponibles para el país. En México, Mercado Pago Point cobra 3,50% por transacción con tarjeta, más 16% de IVA sobre la comisión. En Chile, Point Smart 2 publica 2,19% para débito y 2,69% para crédito; Point Mini, 2,95% para ambos, más IVA si corresponde. [Ver investigación de mercado](../../mercados/latam-pesquisa-2026-10.md).
3. Pedir propuestas a 2–3 adquirentes **con los estados de cuenta a la mano**; después, volver con la mejor oferta a la actual.
4. Unificar terminales cuando haya varias con poco volumen en cada una (concentrar el volumen puede mejorar la negociación).
5. Revisar si hay alquiler de terminal, cuota de instalación o cargos adicionales.

## 2. Anticipos (solo cuando se necesitan)

- Revisar si el cliente recibe sus ventas **anticipadamente** por defecto en el contrato. Es posible que no lo sepa.
- Desactivar el anticipo automático y anticipar solo lo que exija el flujo de caja.
- Si hace falta, cotizar con otros financiadores. Las tasas y condiciones dependen del país y del proveedor; hay que verificarlas localmente.

## 3. Conciliación

Revisar cada semana: ventas del POS × monto previsto por el adquirente × depósitos recibidos en el banco; liquidaciones del marketplace × pedidos. Convertir las diferencias en una lista de reclamaciones para el adquirente o la plataforma. Registrar el motivo de cada reembolso o contracargo para corregir el origen (entrega tardía, artículo faltante).

## 4. Pagos instantáneos en el canal adecuado

- **Pedido propio:** ofrecer el medio instantáneo disponible en el país. En México, CoDi/DiMo procesa pagos sin costo para el comercio; en Argentina hay QR interoperable, con tasas publicadas para comercios de 0,6–0,8%; en Perú, Yape Empresa cobra 2,95% sobre los ingresos del día desde S/10, mientras que el costo de Plin Negocios no está confirmado; en Colombia, el costo para el comercio de Bre-B no está definido y debe verificarse con el banco. En Chile no se confirmó un sistema equivalente con costo regulado para el comercio. [Ver investigación de mercado](../../mercados/latam-pesquisa-2026-10.md).
- **Confirmación automática:** cuando el proveedor lo permita, usar un QR que confirme el pago automáticamente, para que el equipo no tenga que revisar capturas de pantalla. Verificar las condiciones con el banco o proveedor local.
- **Cobros recurrentes:** si el proveedor local ofrece una modalidad adecuada, evaluar productos como suscripciones semanales de almuerzos, clubes de café o desayunos corporativos. No se confirmó un sistema regional de cobro recurrente por pago instantáneo; verificar su disponibilidad y condiciones en cada país.

## 5. Previsión de caja

Preparar una hoja de cálculo de 8 semanas: ingresos previstos (calendario de pagos del adquirente y liquidaciones del marketplace) × egresos (proveedores, nómina, impuestos, alquiler). Activar una alerta cuando una semana quede en negativo, antes de recurrir a crédito de emergencia.

## 6. Cobros a clientes con pago a plazo

Acordar pagos con empresas de la zona (por ejemplo, almuerzos para empleados) y clientes habituales que compran a crédito. Usar un medio de pago local con fecha de vencimiento y recordatorio automático, en vez de llevar un registro en papel.

## Caminos de implementación

**A — sin software nuevo:** negociación + hoja de conciliación + previsión de caja. Puede entregar buena parte del beneficio.

**B — con PSP:** contratar una cuenta con un proveedor de pagos local que ofrezca QR o pagos instantáneos, enlaces de pago y, si está disponible, cobros recurrentes; integrarla con el menú propio.

## Checklist

- [ ] Estados de cuenta de los últimos 3 meses de cada adquirente y marketplace
- [ ] Tasa efectiva actual por modalidad (hoja de cálculo)
- [ ] 2–3 propuestas comparadas; decisión del dueño registrada
- [ ] Anticipos automáticos revisados
- [ ] Rutina semanal de conciliación definida (quién y cuándo)
- [ ] Previsión de caja de 8 semanas preparada
- [ ] Medio de pago instantáneo y costo verificados para el país

## Cómo medir

Tasa efectiva × volumen del mes (dato contractual, fácil de atribuir: **la mejor métrica para un bono por resultados**); costo de anticipos del mes; diferencias de conciliación recuperadas; intereses y recargos pagados.
