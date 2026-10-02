# Termos de uso e LGPD — o que o kit pode e não pode fazer

> Leitura **na íntegra** em 01/10/2026 (páginas abertas, PDFs convertidos, trechos literais). Não é parecer jurídico. O contrato assinado por cada restaurante prevalece sobre qualquer resumo aqui.

## Resumo para quem implanta

| Pergunta | Resposta | Base |
|---|---|---|
| Raspar o Google Maps (script próprio ou Apify) para montar lista de leads? | **Não** | Google Maps Platform Terms 3.2.3(a): "will not export, extract, or otherwise scrape Google Maps Content… (iii) copy and save business names, addresses, or user reviews"; Termos adicionais do Maps §2: proíbe criar "business listings database, mailing list, or telemarketing list" |
| Usar a Places API? | **Sim, com regra:** guardar só o `place_id`; nota, avaliações e telefone são consultados na hora de exibir | Places API policies: "place ID … exempt from the caching restrictions"; lat/lng no máximo 30 dias (Service Specific Terms 14.3) |
| Coleta automatizada no Instagram? | **Não**, sem autorização escrita da Meta | Termos do Instagram: "collecting information in an automated way without our express permission"; Meta Automated Data Collection Terms item 2 |
| Raspar o iFood para ver quem está listado? | **Não** | Termos do usuário iFood (01/12/2025) §8: proibido "coletar, reunir e utilizar informações com o intuito de monitorar, classificar dados… ou concorrer" |
| Ler o **site do próprio restaurante** (Firecrawl) | **Sim**, respeitando robots.txt (padrão do Firecrawl) | Firecrawl `ignoreRobotsTxt` default false; ToS joga a responsabilidade no usuário |
| Folheto/QR/WhatsApp **dentro da sacola de pedido do iFood** | **Risco alto — evitar** | Contrato parceiro iFood (30/03/2023) cl. 3.3: não disponibilizar "por meio do(s) Pedido(s)… números de telefone e/ou… endereços virtuais de outros canais de entrega" |
| Usar contato de cliente que veio do iFood | **Não** | iFood cl. 3.3.1: vedado usar dados dos Clientes Finais "para a divulgação dos canais de entrega" |
| Preço menor no canal próprio | **Depende do contrato** — Rappi exige "mesmos preços… que oferece ao público"; não achei paridade no iFood 2023 nem na Keeta | Rappi FullService (2019); iFood 2023; Keeta GTC out/2025 |
| Indicar canal próprio dentro do app Rappi | **Não** — "suspensão e inativação da loja… rescisão contratual imediata" | Rappi FullService (2019) |
| Penalidades iFood | rebaixamento 1–30 dias, desativação 1–30 dias, até rescisão, "a exclusivo critério do iFood" | iFood cl. 13.1 |
| Exclusividade com uma plataforma | TJ-SP (29/09/2026) derrubou cláusulas da 99Food que proibiam operar com a Keeta, decisão válida para todo o Brasil | [Mobile Time](https://www.mobiletime.com.br/noticias/29/09/2026/tjsp-exclusivo-99food/) |

## Hotéis e hospedagem

| Pergunta | Resposta | Base |
|---|---|---|
| Site próprio mais barato que a Booking? | **Não** — Brasil é país de "paridade restrita" | Booking GDT v2601, definição "Narrow Parity Countries" e cl. 2.2.1 |
| Tarifa fechada para hóspede (e-mail, WhatsApp, balcão)? | **Sim**, se não for publicada nem divulgada online | Booking cl. 2.2.2 (canais offline e tarifas "Unpublished") — validar com advogado |
| Usar o contato do hóspede que veio da Booking? | **Não** para comunicação não solicitada | Booking cl. 2.9.3; Anexo 1, 2.2.4 (base legal/consentimento) |
| Marketing para hóspede da Expedia? | **Só** "general marketing" com opt-in, sem mover reserva ativa | Expedia Off-Platform Booking Policy |
| Convidar hóspede do Airbnb a reservar direto? | **Não** dentro da plataforma (sem links, sem desconto fora) | Airbnb Termos 5.4, política 2799, 11.1 |
| Anúncio com a marca da OTA? | **Não** | Booking cl. 4.3.3 |
| Raspar Booking, Airbnb, Tripadvisor? | **Não** | Booking termos ao cliente A15.2 (15/09/2025); Airbnb 11.1; Tripadvisor |
| Paridade ampla no Brasil? | Encerrada por acordo com o CADE (TCC homologado em 27/03/2018: Booking, Decolar, Expedia) | [CADE](https://www.gov.br/cade/pt-br/assuntos/noticias/booking-decolar-e-expedia-celebram-acordo-de-cessacao-com-o-cade) |
| Cadastur (lista de hospedagens) | **Pode usar**, licença ODbL com atribuição; o coletor descarta CPF, responsável e e-mails | [dados.turismo.gov.br](https://dados.turismo.gov.br/dataset/meios-de-hospedagem) |

Fontes: [Booking GDT](https://admin.booking.com/hotelreg/terms-and-conditions.html?language=en) · [paridade Booking](https://partner.booking.com/en-us/help/legal-security/how-does-parity-work) · [Expedia](https://www.expediagroup.com/en-us/marketplace-policies/offline-booking-policy) · [Airbnb 2908](https://www.airbnb.com.br/help/article/2908), [2799](https://www.airbnb.com.br/help/article/2799) · [Booking, termos ao cliente](https://www.booking.com/content/terms.pt-br.html) · DMA/UE: [Comissão Europeia 28/09/2026](https://digital-markets-act.ec.europa.eu/factsheet-how-dma-ensures-businesses-using-bookingcom-are-free-set-their-prices-and-bookingcom-2026-09-28_en) (na UE a Booking não pode mais exigir paridade — não vale para o Brasil).

## LGPD na prospecção

- **Dado da empresa** (nome fantasia, telefone comercial, nota) não é dado pessoal.
- **Dado pessoal:** nome do dono, celular/WhatsApp pessoal, nome e foto de quem avaliou.
- Base possível para prospecção B2B: **legítimo interesse** (art. 7º, IX; art. 10), com dados "estritamente necessários" (art. 10 §1º), transparência (§2º) e **teste de balanceamento por finalidade** (Guia ANPD de Legítimo Interesse, v1.0, fev/2024).
- **Regra do kit:** o Caçador guarda só dados da empresa por padrão. Se o implantador anotar nome/celular do dono, registra a origem, informa no primeiro contato de onde veio o dado e apaga quando pedirem. Nunca coletar avaliadores.

## Fontes lidas

- Google Maps Platform Terms (26/08/2026): https://cloud.google.com/maps-platform/terms
- Maps Service Specific Terms (10/06/2026): https://cloud.google.com/maps-platform/terms/maps-service-terms
- Places API policies: https://developers.google.com/maps/documentation/places/web-service/policies
- Termos adicionais do Google Maps (27/01/2026): https://www.google.com/help/terms_maps/
- Termos do Instagram: https://help.instagram.com/581066165581870 · Meta Automated Data Collection Terms (07/10/2024, via archive.org)
- iFood parceiro (30/03/2023): https://assets-cms-partner.ifood.com.br/termos_e_condicoes_2023_92a1934504.pdf · iFood usuário (01/12/2025): https://webmiddleware.ifood.com.br/termos
- Keeta GTC (out/2025): PDF em s3-ap-hongkong.mykeeta.net (contrato do comerciante, pt)
- Rappi FullService (2019): http://promos.rappi.com/brasil/2019/8/27/termos-e-condies-gerais-de-servio-de-intermediao-rappi-via-fullservice-digital
- Apify General Terms (09/07/2026) cl. 11.1 e 9.1: https://docs.apify.com/legal/general-terms-and-conditions · Google Maps Scraper (US$ 1,50/1.000 lugares): https://apify.com/compass/crawler-google-places
- Firecrawl ToS (05/11/2024) e preços: https://www.firecrawl.dev/terms-of-service · https://www.firecrawl.dev/pricing
- LGPD: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm · Guia ANPD Legítimo Interesse (fev/2024)

## Não lido na íntegra

Termos de parceiro da 99Food (só com login); versão do contrato iFood posterior a 30/03/2023 e o Formulário de contratação (Portal do Parceiro, com login); termos da Rappi posteriores a 2019; data de revisão dos termos do Instagram.
