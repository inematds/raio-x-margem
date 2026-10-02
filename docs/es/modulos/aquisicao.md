# Módulo: Ganancia y retención de clientes

> Aborda: **marketplace** (una recompra vuelve a pagar comisión), **retención** (clientes que compran una vez y desaparecen), **marketing** (anuncios para quienes ya son clientes).

## Regla de oro

**Marketplace = adquisición. Canal propio = retención.** El módulo no busca sacar al restaurante del marketplace: busca que **la segunda compra** ocurra en un canal donde el restaurante conoce al cliente.

## Dos frentes

### Frente 1 — Ganar clientes (para el restaurante)

| Fuente | Acción | Costo |
|---|---|---|
| Google | Perfil completo, responder reseñas y pedir una después de un pedido propio | cero |
| Marketplace | Mantenerlo como vitrina para quienes aún no conocen el restaurante | comisión |
| Referidos | «Recomiende a un vecino: ambos reciben X» — código por cliente | beneficio |
| Barrio | Alianzas y comunidad ([marketing-local](marketing-local.md)) | bajo |
| Anuncios | Solo para público **nuevo**, excluyendo la lista de clientes actuales | medios |

### Frente 2 — Hacer que vuelvan (retención)

1. **Capturar el contacto con consentimiento** en cada punto del restaurante: pedido propio, salón (QR «únase al club»), Wi-Fi del salón y mostrador. No usar datos de clientes del marketplace (ver [ANALISE.md §3.1](../../ANALISE.md#31-termos-do-marketplace-o-risco-jurídico-central)).
2. **Segmentar** automáticamente: nuevo (1 pedido), recurrente, inactivo (> 30/45 días), VIP (10% superior por valor), sensible a promociones.
3. **Secuencia de mensajes** (WhatsApp; ver costos y reglas en la investigación):
   - D+1 después del primer pedido: agradecimiento + solicitud de reseña en Google
   - D+7: «hoy salió su plato favorito» (si está disponible)
   - Inactivo 30 días: beneficio para volver, una sola vez
   - VIP: aviso anticipado de novedades, sin descuento (no acostumbrarlo a esperar promociones)
4. **Fidelidad simple**: puntos o «por cada 10, 1 gratis». Sin aplicación: identificación por teléfono.

## Para quien implementa: Cazador de Margen (ganar clientes para usted)

El mismo módulo, desde el lado de quien implementa: `app/cacador.html` + `coletor/`.

1. **Listar** el barrio con fuentes abiertas: DENUE/INEGI en México, RUES en Colombia, SII en Chile, SUNAT en Perú o padrón de ARCA en Argentina. La disponibilidad de campos, licencias y cobertura cambia según el país; verifique la investigación antes de elegir la fuente ([investigación de mercado](../../mercados/latam-pesquisa-2026-10.md)).
2. **Enriquecer** leyendo el sitio del propio restaurante (¿pedido en línea?, ¿WhatsApp?, ¿fidelidad?, ¿enlaces a Rappi, DiDi Food, Uber Eats o PedidosYa?), con IA mediante la suscripción, si se desea.
3. **Revisar manualmente** lo que los términos no permiten recopilar: calificación y reseñas en Google, Instagram activo, presencia en marketplaces. El Cazador abre la búsqueda preparada.
4. **Puntuar** con los criterios del paquete (0–100, solo con lo verificado; la barra clara muestra el límite) y ver **alertas** cuando la hipótesis falla (persona física con registro de negocio, pocas reseñas, solo delivery).
5. **Contactar** con el texto generado —solo menciona lo que se verificó— y seguir el estado hasta el Raio-X («Abrir Raio-X de este lead»).

Texto base de contacto (del paquete):

> «Su restaurante claramente ya tiene demanda. El problema no parece ser conseguir clientes. Es que, cada vez que un cliente vuelve por Rappi, DiDi Food, Uber Eats o PedidosYa, usted vuelve a pagar para llegar a alguien que ya conoce su marca».

## Rutas de implementación

**A — SaaS listo:** el propio sistema de menú (si permite exportar clientes) + aplicación WhatsApp Business con etiquetas + hoja de cálculo para la secuencia. Para más volumen, proveedor oficial de WhatsApp Business Platform con campañas. Las tarifas de mensajes de plantilla varían por país y categoría; desde octubre de 2026, las tarifas oficiales de Meta para marketing son USD 0,0397 en México, 0,0125 en Colombia, 0,0618 en Argentina, 0,0889 en Chile y 0,0703 en Perú por mensaje entregado. Los mensajes de servicio también se cobran, con un nivel gratuito compartido de 1.000 mensajes de servicio entregados por número comercial al mes ([investigación de mercado](../../mercados/latam-pesquisa-2026-10.md)).

**B — Stack propio:** CRM en hoja de cálculo/Supabase + automatización (n8n) + API oficial de WhatsApp. **Nunca** usar una API no oficial en el número principal.

## Checklist

- [ ] Dónde se captura el contacto (lista de puntos) + texto de consentimiento y aviso de privacidad según la ley local: LFPDPPP (MX), Ley 1581 (CO), Ley 25.326 (AR), Ley 21.719 (CL) o Ley 29733 (PE)
- [ ] Segmentos definidos con días de corte del restaurante
- [ ] 4 mensajes de la secuencia escritos y aprobados por el dueño
- [ ] Programa de fidelidad con una regla de una línea
- [ ] Lista de exclusión aplicada en los anuncios
- [ ] Base «antes»: retorno a 60 días de la última cohorte

## Cómo medir

Retorno a 60 días por cohorte mensual (antes × después); pedidos en el canal propio de clientes identificados; costo de mensajes ÷ margen de los pedidos generados.
