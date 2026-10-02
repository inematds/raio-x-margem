# Módulo: 100% canal propio (sin marketplace)

> Ataca: **marketplace** por completo, **pagos** (transferencia o QR sin intermediario), **retención**. Para restaurantes con **marca en el barrio**: salón lleno, buena calificación y gente que pregunta «¿hacen entregas?».

## Cuándo tiene sentido (y cuándo no)

| Tiene sentido | No tiene sentido |
|---|---|
| Salón concurrido, marca conocida en la zona | Cocina solo de delivery, sin marca ni salón |
| Radio de entrega corto (barrio y zonas cercanas) | Depende de clientes lejanos que solo lo encuentran en la app |
| Dueño dispuesto a operar el canal todos los días | No hay quien responda y publique el plato del día |
| Marketplace < 30% de las ventas | Marketplace > 60% de las ventas (salir de golpe afecta el flujo de caja) |

**Transición segura:** primero **reducir** (marketplace para quienes no conocen el restaurante y canal propio para el resto); salir por completo solo cuando el canal propio supere al marketplace durante 3 meses seguidos. El Panel (fase 5) muestra ese cruce.

## Qué ofrece el marketplace y cómo reemplazarlo

| Qué ofrece el marketplace | Sustituto en el canal propio |
|---|---|
| Descubrimiento (gente nueva) | Perfil de Google, Instagram, **Guía del Barrio** ([marketing-local](marketing-local.md)), recomendaciones |
| Menú y carrito | [Menú Vivo](cardapio-vivo.md) (página del kit o TastyIgniter) |
| Pago | CoDi/DiMo en México; QR interoperable en Argentina; Yape/Plin en Perú; Bre-B en Colombia. En Chile, verificar localmente qué opción equivalente está disponible |
| Repartidor | Repartidor propio o aliado del barrio + rutas con VROOM/OSRM; horarios de entrega agrupada en edificios |
| Atención y estado | WhatsApp Business (app) o Chatwoot + API oficial |
| Promociones | Club del barrio, fidelidad, cupón de un negocio aliado |
| Reseñas | Solicitud de reseña en Google después de cada entrega |

Piezas abiertas, licencias y riesgos: [ALTERNATIVAS-ABERTAS.md](../../ALTERNATIVAS-ABERTAS.md).

## Stack mínimo (costo mensual cercano a cero)

1. Menú estático publicado (GitHub Pages/Cloudflare Pages) con carrito que arma el mensaje del pedido.
2. En México, CoDi/DiMo permite pagos electrónicos sin costo para el comercio; en Argentina se puede usar QR interoperable, con el costo según la categoría del comercio. En Perú, Yape Empresa cobra comisión y la tarifa de Plin Negocios debe verificarse localmente. En Colombia, el costo de Bre-B debe confirmarse con el banco. En Chile, verificar localmente la opción y su costo.
3. WhatsApp Business app con catálogo y respuestas rápidas.
4. Hoja de cálculo de clientes (teléfono, pedidos, último pedido) → ciclo manual de reactivación durante el primer mes.
5. Repartidor propio o aliado por jornada, radio fijo y tarifa de entrega clara.

## Riesgos

- **La transferencia o el QR pueden no confirmar el pago automáticamente:** verificarlo en el banco o proveedor. En México, CoDi/DiMo procesa operaciones sin costo para el comercio. En Colombia, el costo de Bre-B es negociable y debe confirmarse con el banco. [Investigación de mercado](../../mercados/latam-pesquisa-2026-10.md).
- **La logística** es el factor que más puede perjudicar el servicio: un retraso de entrega propia afecta la marca más rápido que uno de la app.
- **Sin nuevos clientes,** el canal se reduce con el tiempo: la Guía del Barrio y las recomendaciones son obligatorias, no opcionales.

## Checklist

- [ ] El diagnóstico confirma: marketplace < 60% y salón/marca fuertes
- [ ] Menú propio publicado + método de pago probado en 2 bancos o aplicaciones
- [ ] Entrega propia con tiempo promedio medido durante 2 semanas
- [ ] Club del barrio con más de 100 miembros antes de reducir el marketplace
- [ ] Plan de reducción en 3 etapas, con fecha y criterio para revertir

## Cómo medir

Pedidos por semana en el canal propio × marketplace (cruce); tiempo promedio de entrega; costo por pedido (entrega + pago + operación) × costo efectivo del marketplace. En México, sumar el IVA del 16% a la comisión de la plataforma; en los demás países, verificar la tasa de IVA local aplicable. [Investigación de mercado](../../mercados/latam-pesquisa-2026-10.md).
