# Fuentes y límites: qué se podría recopilar, por qué no y qué hacer en su lugar

> Técnicamente, existen herramientas para recopilar datos de Google Maps, Instagram y aplicaciones. El kit no lo hace de forma automática: antes de hacerlo hay que confirmar los términos aplicables en cada plataforma y país, y evaluar el riesgo para quien lo implementa y para el cliente. A continuación, fuente por fuente: qué aportaría, qué puede impedirlo, qué riesgos hay y **cómo obtener la misma información de otra manera**. Para los términos y las herramientas disponibles, consulte [ALTERNATIVAS-ABERTAS.md](../ALTERNATIVAS-ABERTAS.md) y [TERMOS.md](../TERMOS.md); confirme localmente si sus condiciones aplican al mercado de destino.

## La regla práctica

En orden de preferencia:

1. **Datos del propio negocio**: con el cliente presente, este exporta los datos de sus paneles de Google, Instagram, la plataforma de delivery o Booking. Son los datos más completos y los que realmente necesita el diagnóstico.
2. **Registros públicos oficiales**: varían por país. En México, por ejemplo, el DENUE publica datos de establecimientos y permite extraerlos total o parcialmente; en Colombia, el RNT tiene datos de establecimientos turísticos. Confirme la licencia y las condiciones del registro que use.
3. **Señales indirectas**: el sitio web del negocio puede enlazar sus aplicaciones, perfiles sociales o motor de reservas. También puede consultarse el buscador web.
4. **API oficial con autorización**: cuando existe y la escala justifica el costo y los trámites, use la API de acuerdo con sus condiciones.
5. **Verificación asistida**: usted revisa la fuente; el Caçador abre la búsqueda preparada y usted registra lo que ve. Toma alrededor de un minuto por lead y conviene reservarlo para los mejor puntuados.

## Fuente por fuente

### Google Maps: calificación, número de reseñas, teléfono, horario y categoría

| | |
|---|---|
| **Qué aportaría** | Una señal de demanda: la calificación y la cantidad de reseñas |
| **Qué puede impedirlo** | Hay que revisar localmente los términos de Google Maps Platform y las condiciones aplicables al uso de sus datos. |
| **Riesgo** | La investigación de mercado no confirma sanciones concretas para cada país. Verifique las consecuencias contractuales antes de recopilar datos automáticamente. |
| **Herramienta que lo haría** | `gosom/google-maps-scraper` (MIT); no está integrada. |
| **En su lugar** | (a) **Verificación asistida** en el Caçador; (b) **Places API oficial**, guardando solo el `place_id` y consultando la calificación y las reseñas al mostrarlas —es una API de pago y requiere clave y autorización—; (c) con el cliente: el propietario exporta sus datos de Perfil de Negocio de Google. |

### Instagram: perfil, frecuencia de publicaciones y seguidores

| | |
|---|---|
| **Qué aportaría** | Una señal de si el negocio está activo y se comunica con sus clientes |
| **Qué puede impedirlo** | Hay que confirmar las condiciones vigentes de Instagram y Meta para la recopilación automatizada. La investigación de mercado no confirma su aplicación local por país. |
| **Riesgo** | Verifique localmente las consecuencias para la cuenta y el negocio antes de automatizar la recopilación. |
| **Herramienta que lo haría** | `instaloader` (MIT); no está integrada. |
| **En su lugar** | (a) `sitios.py` toma el **@ del sitio web del propio negocio**; (b) el Caçador abre el perfil y usted marca «publicó en los últimos 30 días»; (c) **API oficial de Meta (Business Discovery)** para datos públicos básicos de cuentas comerciales, sujeta a los requisitos y la revisión de Meta; (d) con el cliente: sus Insights de Instagram. |

### Aplicaciones de delivery: Rappi, DiDi Food, Uber Eats y PedidosYa

| | |
|---|---|
| **Qué aportaría** | Si el restaurante está en la aplicación, su calificación, precios y promociones |
| **Qué puede impedirlo** | Confirme los términos de cada plataforma y país. La investigación no establece una regla única para toda América Latina hispana. Las comisiones tampoco son uniformes: algunas no se publican y varían según el socio, la ubicación y las condiciones del mercado. |
| **Riesgo** | Verifique localmente las consecuencias contractuales y cualquier posible conflicto con la plataforma. |
| **En su lugar** | (a) **Señal indirecta**: el sitio del restaurante enlaza a la aplicación y `sitios.py` puede detectarlo; (b) una **búsqueda web** puede mostrar la página del restaurante en la aplicación y marcarla para revisión; (c) con el cliente: el **reporte de ventas y liquidaciones del portal de socios** permite calcular el costo efectivo. En México, calcule el IVA sobre la comisión; por ejemplo, una comisión de Rappi de 25% equivale a cerca de 29% con IVA de 16%. [Investigación de mercado](../mercados/latam-pesquisa-2026-10.md) |

### Sitios de reserva: Booking, Airbnb, Expedia y Tripadvisor

| | |
|---|---|
| **Qué aportaría** | Presencia en agencias de viaje en línea (OTA), calificación, precio y disponibilidad |
| **Qué puede impedirlo** | Revise las condiciones contractuales de cada plataforma. La investigación confirma que la FNE de Chile eliminó la paridad de precios en delivery y Booking; para los demás países, revise el contrato antes de ofrecer precios distintos en el canal propio. |
| **Riesgo** | Verifique localmente las consecuencias contractuales y cualquier conflicto con el hotel. |
| **En su lugar** | (a) Consulte el registro turístico oficial que corresponda al país; (b) revise el sitio del hotel, su motor de reserva y los enlaces a OTA; (c) con el cliente: la extranet de Booking o Airbnb muestra las reservas por canal y las comisiones pagadas. |

## Qué recopila el kit por sí solo

| Fuente | Condición indicada en la investigación | Colector |
|---|---|---|
| DENUE (México) | Uso libre para copiar, difundir, publicar y extraer datos; la API requiere un token gratuito y limita la búsqueda a un radio de 5.000 m. | `colector/denue.py` |
| RUES (Colombia) | Datasets con licencia CC BY-SA 4.0 y atribución a Confecámaras; no incluyen columna de dirección. | Verificar el conector disponible |
| RNT (Colombia) | Dataset con licencia CC BY-SA 4.0; contiene dirección comercial, teléfonos, correo y datos de habitaciones. | Verificar el conector disponible |
| SII (Chile) | Nóminas de actividades económicas, direcciones históricas y razón social en archivos TXT; cubre personas jurídicas. La licencia no está verificada. | Verificar el conector disponible |
| Padrón reducido de SUNAT (Perú) | Incluye RUC, razón social, estado, condición del domicilio, ubicación y domicilio fiscal. La presencia de CIIU no está confirmada. | Verificar el conector disponible |
| Archivo de ARCA (Argentina) | Incluye CUIT, nombre y situación tributaria; no incluye dirección ni código de actividad. | Verificar el conector disponible |
| Sitio web del propio negocio | La investigación no precisa las condiciones de recopilación aplicables en cada país; confirme localmente y respete `robots.txt`. | `colector/sitios.py` |
| Búsqueda web (opcional) | Firecrawl, con crédito de pago y solo con `--confirmar`; confirme localmente las condiciones aplicables. | `colector/sitios.py --buscar` |

En México, la API del DENUE requiere un token gratuito y permite buscar en un radio de hasta 5.000 m. Consulte los detalles en la [investigación de mercado](../mercados/latam-pesquisa-2026-10.md).

Todo esto puede ejecutarse con un comando (`coletor/rodar.sh`) o desde la pantalla **Colectar** (`app/coletar.html` con `python3 coletor/servidor.py`).

## Datos personales

El recolector debe limitarse a los datos necesarios del negocio y no recopilar correos personales, nombres de responsables ni datos de quienes publican reseñas. Las leyes aplicables varían por país: LFPDPPP en México, Ley 1581 en Colombia, Ley 25.326 en Argentina, Ley 21.719 en Chile y Ley 29733 en Perú. Antes de usar datos personales para prospección, confirme localmente la base jurídica, los avisos de privacidad y los mecanismos de oposición o exclusión aplicables. En México, la investigación señala que el DENUE es una fuente prevista en la ley, pero también indica la necesidad de un aviso de privacidad y de permitir la oposición. [Investigación de mercado](../mercados/latam-pesquisa-2026-10.md)
