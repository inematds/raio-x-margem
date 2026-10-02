# Módulo: Menú Vivo

> Ataca: **marketplace** (da al cliente un motivo y un camino para pedir directamente), **ticket promedio** (combo y adicional en el momento oportuno), **menú mal diseñado** (destaca lo que deja margen), **mano de obra** (el menú responde lo que antes respondía el equipo).

## La pregunta correcta: ¿cómo hacer que las personas lleguen al menú?

Un menú propio por sí solo es **una tienda en una calle sin movimiento**. Nadie escribe la dirección de un menú. Las personas llegan por tres vías, y este módulo construye las tres:

### 1. Tráfico: el menú aparece donde ya está la persona

El cliente no va al menú; el menú aparece donde ya pasa el día:

| Dónde está la persona | Cómo aparece el menú |
|---|---|
| Google («restaurante cerca de mí», «almuerzo abierto ahora») | Perfil de Negocio en Google con **enlace para pedir** que lleve al menú, fotos del plato del día, horario actualizado y publicaciones semanales |
| Instagram | Enlace en la biografía, **destacado «Menú»**, historia diaria del plato del día con enlace |
| WhatsApp | **Estado diario** (lo ve quien tiene guardado el número), **canal** del restaurante y catálogo de WhatsApp Business que lleve al menú |
| Comunidad del barrio | Grupo o canal del club del barrio (ver [marketing-local](marketing-local.md)) |
| Mundo físico | QR en la mesa, el mostrador, la fachada, la bolsa de los **pedidos propios** y del salón, y la tarjeta del repartidor propio; **nunca en la bolsa de un pedido de Rappi, DiDi Food, Uber Eats o PedidosYa** |

### 2. Motivo: ¿por qué pedir aquí y no en la aplicación de siempre?

Sin un motivo, el cliente vuelve al marketplace por costumbre. Algunas razones que funcionan:

- **Novedad diaria** — y ese es el corazón de lo «vivo»: plato del día, «se acabó la feijoada», «acaba de salir», promoción de la hora más tranquila (15:00–18:00). Un menú que cambia **da una razón para volver a mirar**. Un menú estático no genera visitas.
- **Beneficio exclusivo del canal propio** — puntos, un obsequio, postre en la quinta compra o un mejor costo de entrega. En Chile, vender más barato en el canal propio es legal tras los acuerdos de la FNE sobre paridad en delivery; en los demás países, revise el contrato de la plataforma. (Ver [TERMOS.md](../../TERMOS.md).)
- **Sentido de pertenencia** — «club del barrio»: cliente identificado por su nombre, votación del plato de la semana y aviso antes que a los demás.

### 3. Un camino sin fricción

Cada paso adicional hace que algunas personas abandonen. La meta es **pasar del enlace al pedido pagado en un máximo de 4 pasos**.

Enlace → menú (abre rápido, sin registro y con buenas fotos) → carrito con sugerencia de adicional → WhatsApp con el pedido ya escrito **o** pago con CoDi/DiMo en México, QR interoperable en Argentina, Yape/Plin en Perú o Bre-B en Colombia → confirmación.

En Chile, confirme localmente qué medio de pago instantáneo conviene ofrecer; la investigación no confirmó un equivalente con costo regulado para comercios. El costo de Bre-B para el comercio también debe verificarse con el banco.

Permitir repetir el pedido anterior con un toque es uno de los mayores aceleradores de recompra.

## Una actualización, todos los lugares

El dueño no va a actualizar cinco lugares cada día. El flujo del módulo:

```text
foto del plato + una frase (WhatsApp del dueño al «asistente»)
        │
        ▼  IA redacta texto breve, precio, etiquetas y destacado
   menú propio actualizado (plato del día, productos agotados)
        │
        ├─► estado de WhatsApp + canal
        ├─► historia/publicación de Instagram (borrador para aprobar)
        └─► publicación en el Perfil de Negocio en Google
```

Para empezar, la persona que implementa el sistema lo hace manualmente o de forma semiautomática durante el primer mes (para conocer el ritmo del local). Después automatiza lo que se repita.

## Opciones de implementación

**A — SaaS listo para usar (recomendado para empezar).** Elija una herramienta disponible en el país del cliente; la investigación no confirma proveedores específicos de menú digital para esta adaptación. Criterios: ¿acepta CoDi/DiMo sin costo para el comercio en México? ¿Permite repetir pedidos? ¿Exporta la lista de clientes a CSV? ¿Tiene destacados y combos? **Si no permite exportar los datos de clientes, descártela**: la base de clientes es un activo.

En otros países, verifique localmente las comisiones y condiciones de pago antes de elegir. El IVA se cobra sobre la comisión de la plataforma. Por ejemplo, en México una comisión del 25% equivale a cerca del 29% efectivo con IVA; en Chile una comisión de 29% más IVA de 19% equivale a aproximadamente 34,5%. [Consulte la investigación de mercado](../../mercados/latam-pesquisa-2026-10.md).

**B — Solución propia (cuando el cliente quiere control).** Página estática con el menú (datos en una hoja de cálculo o JSON) + pedido preparado en un mensaje de WhatsApp + medio de pago local + lista de clientes en una hoja de cálculo o CRM sencillo. El costo mensual puede ser cercano a cero; requiere mantenimiento de quien implementa el sistema. En México, CoDi/DiMo permite pagos al comercio sin costo según la investigación; confirme el medio y el proceso de cobro en cada país. [Fuente](../../mercados/latam-pesquisa-2026-10.md).

## Lista de verificación de implementación (primera versión)

- [ ] Ficha técnica de los 20 productos más vendidos (costo → margen) para decidir qué destacar
- [ ] Menú con fotos reales, 3 combos de margen alto y un adicional sugerido en el carrito
- [ ] Enlace corto y códigos QR generados; QR impreso en mesa, mostrador y bolsa de pedido propio
- [ ] Perfil de Negocio en Google: enlace para pedir, horarios, 10 fotos y primera publicación
- [ ] Instagram: biografía y destacado «Menú»
- [ ] WhatsApp Business: catálogo, mensaje de bienvenida con enlace y respuestas rápidas
- [ ] Rutina del plato del día acordada (quién envía la foto y hasta qué hora)
- [ ] Línea de base registrada: porcentaje de pedidos con adicional y pedidos por semana en el canal propio

## Cómo medir

Pedidos semanales en el canal propio; porcentaje de pedidos con adicional; margen promedio de la combinación de productos; visitas al enlace (con contador de clics). Se relaciona con `como_medir` de las fugas *marketplace*, *ticket* y *menú*.
