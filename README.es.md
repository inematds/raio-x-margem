# Radiografía de Margen

**🇧🇷 [Português](README.md) · 🇺🇸 [English](README.en.md) · 🇪🇸 [Español](README.es.md)**

[![Radiografía de Margen](guia/assets/banner-es.jpg)](https://inematds.github.io/raio-x-margem/guia/es/)

📖 **Guía:** https://inematds.github.io/raio-x-margem/guia/es/

**Kit abierto para encontrar dónde un pequeño negocio pierde dinero, mostrarlo en su moneda, corregirlo y demostrar cuánto volvió a la caja.**
Paquetes en español para **América Latina hispana**: restaurante, hotel/posada, servicios con agenda, clínica y salón — en MXN, con México como ejemplo por defecto.

> No vende IA. No vende una app. Vende **menos pérdida, más margen, más control y más recurrencia.**

## Encontrar al cliente: Cazador de Margen

`coletor/osm.py` lista los negocios de una ciudad o colonia con **OpenStreetMap** (funciona en cualquier país; ajuste `--nivel-cidade`/`--nivel-bairro` porque el `admin_level` cambia por país) y `coletor/sitios.py` lee el sitio de cada uno (respeta robots.txt; revisión opcional por IA con su suscripción, `--ia claude`; búsqueda opcional con Firecrawl solo con `--confirmar`). También puede importar el CSV de un registro local — DENUE de INEGI (México), RNT/RUES (Colombia), SII (Chile), SUNAT (Perú) — directo en `app/cacador.html?lang=es`, que puntúa, estima el potencial, genera el mensaje de contacto y sigue cada cliente hasta la Radiografía. Los recolectores automáticos por registro de cada país están en la hoja de ruta.

```bash
python3 coletor/osm.py --cidade "Ciudad de México" --setor alimentacao --saida dados/osm-cdmx.json
python3 coletor/sitios.py --entrada dados/osm-cdmx.json --saida dados/leads-cdmx-enr.json --setor alimentacao --limite 30
```

Detalles del recolector en [`coletor/README.md`](coletor/README.md) (en portugués).

## Cómo usarlo con un cliente (6 pasos)

1. **Abra `app/index.html?lang=es`** en el navegador (doble clic; funciona sin conexión, sin instalar nada).
2. **Complételo con el dueño**, con la liquidación de las plataformas (Rappi, DiDi Food, Uber Eats, PedidosYa) y el estado de la terminal abiertos. El campo que no sepa queda vacío.
3. **Imprima el informe** (botón *Imprimir informe / PDF*) y **guarde el diagnóstico** (.json) — esa es la base "antes".
4. **Abra la receta** de la fuga de mayor prioridad en [`docs/es/modulos/`](docs/es/modulos/).
5. **Implemente** siguiendo el checklist de la receta (camino SaaS listo o stack propio).
6. **Mida** cada mes en el **Panel de Recuperación** (`app/painel.html?lang=es`): abre el diagnóstico guardado, recibe los números del mes y muestra antes × después, % de la meta, acumulado y bono solo sobre lo atribuible. Cobre la mensualidad. Regla práctica para la propuesta: todo sumado no pasa de 1/3 de lo recuperable.

Contacto, guion de la reunión y precio: [`kit-comercial/`](kit-comercial/) (en portugués).

## Qué hay dentro

| Carpeta | Contenido |
|---|---|
| `app/` | Radiografía (`index.html`), Cazador (`cacador.html`) y Panel de Recuperación (`painel.html`); interfaz en ES con `?lang=es` |
| `coletor/` | Scripts de lista de clientes: OpenStreetMap y sitios (más recolectores de registros de Brasil) |
| `setores/es/` | Paquetes LATAM: restaurante, hotel, servicios, clínica, salón (preguntas, fórmulas, % recuperable, cómo medir, recetas) |
| `docs/es/modulos/` | Recetas: menú vivo, captación y retención, cobros y pagos, marketing local, canal propio, agenda llena, hotel |
| `docs/mercados/` | Investigación de mercado LATAM y GLOBAL con fuentes (en portugués) |
| `docs/ARQUITETURA.md` | Cómo está armado el sistema, formato del paquete y hoja de ruta (en portugués) |
| `docs/TERMOS.md` | Qué permiten los términos de Google, Instagram y las plataformas (en portugués) |
| `kit-comercial/` | Contacto, objeciones, precios (en portugués) |
| `guia/` | Página de presentación y guía de uso (PT, EN, ES) |
| `tests/` | Pruebas del motor y de la interfaz |

## Mercados

Otro idioma **no es traducción: es otro mercado.**

- **ES / América Latina hispana:** Rappi, DiDi Food, Uber Eats y PedidosYa; IVA cobrado sobre la comisión (en México, 25% se vuelve ≈ 29%); pago instantáneo por país (CoDi/DiMo en México sin costo para el comercio, QR interoperable en Argentina, Yape/Plin en Perú, Bre-B en Colombia); en Chile la FNE eliminó la paridad de precios en delivery y en Booking; WhatsApp con la tabla oficial de Meta por país; Doctoralia y AgendaPro cobran suscripción. Moneda por defecto: MXN.
- **EN / Global:** modelo mundial (DoorDash, Uber Eats, Deliveroo; tarjeta y billeteras digitales).
- **PT / Brasil:** el mercado del primer piloto.

Para otro país, copie un paquete de `setores/es/`, cambie `id`, la moneda (campo `moeda`) y los ejemplos. Ver [ARQUITETURA.md](docs/ARQUITETURA.md#mercados).

## Pruebas

```bash
npm test                       # motores (Radiografía y Cazador) + recolector, sin red
NODE_PATH=<carpeta>/node_modules npm run test:ui   # interfaz en file://, escritorio y celular (requiere playwright)
```

## Privacidad

Nada sale del navegador. Los números del cliente quedan en el borrador local y en el `.json` que usted guarde. El recolector solo guarda datos de empresa; la prospección B2B sigue la ley de cada país (aviso de privacidad en México, Ley 1581 en Colombia, Ley 25.326 en Argentina, Ley 21.719 en Chile, Ley 29733 en Perú). Los datos de salud son sensibles en toda la región.

---

Proyecto abierto de [INEMA.CLUB](https://inema.club) · licencia [MIT](LICENSE) · versión 0.6.1
