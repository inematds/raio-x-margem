# Alternativas de código aberto

> Verificadas em 01/10/2026 com `gh api` (licença, estrelas, último push, arquivado). Projeto parado ou arquivado está marcado. **Ferramenta aberta muda o custo, não os termos da fonte de dados** — ver [TERMOS.md](TERMOS.md).

## Usadas pelo kit

| Função | Escolha | Licença | Por quê |
|---|---|---|---|
| Lista de empresas | **Dados abertos do CNPJ** (Receita Federal) via `coletor/cnpj.py` | dado público | Lista oficial de todos os restaurantes do município, sem termo de uso restritivo |
| Lugares e site | **OpenStreetMap** via Overpass (`coletor/osm.py`) | ODbL (dados) | Reuso com atribuição "© colaboradores do OpenStreetMap" |
| Ler o site do restaurante | `coletor/sitios.py` (Python puro, respeita robots.txt) | MIT (este repo) | Sem dependência; para sites pesados em JS, trocar por crawl4ai |
| Achar site/Instagram | Firecrawl (busca) — **opcional, gasta crédito** | AGPL-3.0 (self-host) / serviço pago | Autorizado no piloto; sem ele, conferência manual |
| Julgar os sinais | `claude -p` ou `codex exec` **pela assinatura** | — | Sem chave de API |

## Para montar o "100% canal próprio"

| Função | Projeto | Licença | ★ | Último push | Nota |
|---|---|---|---|---|---|
| Pedido online | [tastyigniter/TastyIgniter](https://github.com/tastyigniter/TastyIgniter) | MIT | 3,7 mil | 09/2026 | Laravel; sem Pix nativo; extensões podem ser pagas |
| Pedido online (novo) | [mighty840/kitchenasty](https://github.com/mighty840/kitchenasty) | MIT | 55 | 09/2026 | pequeno, risco de abandono |
| PDV + cupons/fidelidade | [odoo/odoo](https://github.com/odoo/odoo) Community | LGPL-3.0 | 54 mil | 10/2026 | pesado; alguns módulos só na Enterprise |
| Pix estático (QR) | [cleitonleonel/pypix](https://github.com/cleitonleonel/pypix) · [NascentSecureTech/pix-qrcode-utils](https://github.com/NascentSecureTech/pix-qrcode-utils) · [renatomb/php_qrcode_pix](https://github.com/renatomb/php_qrcode_pix) | MIT · MIT · CC0 | — | 2025–2026 | offline, sem intermediário; **testar o QR no app de um banco** |
| Atendimento | [chatwoot/chatwoot](https://github.com/chatwoot/chatwoot) | MIT (núcleo) + `enterprise/` proprietária | 37 mil | 10/2026 | usar com a **API oficial** do WhatsApp |
| CRM | [twentyhq/twenty](https://github.com/twentyhq/twenty) · [espocrm/espocrm](https://github.com/espocrm/espocrm) | AGPL-3.0 | 58 mil · 3,4 mil | 10/2026 | AGPL: publicar o código se modificar e servir pela rede |
| Automação | [activepieces/activepieces](https://github.com/activepieces/activepieces) | MIT (núcleo) + `ee/` | 25 mil | 10/2026 | a mais permissiva |
| Automação | [n8n-io/n8n](https://github.com/n8n-io/n8n) | Sustainable Use (fair-code) | 206 mil | 10/2026 | uso interno ok; **revender hospedado para cliente é restrito** |
| Rotas de entrega | [VROOM-Project/vroom](https://github.com/VROOM-Project/vroom) + [Project-OSRM/osrm-backend](https://github.com/Project-OSRM/osrm-backend) | BSD-2 | 1,9 mil · 8 mil | 09–10/2026 | self-host; servidor demo do OSRM não é para produção |
| Extração de texto | [adbar/trafilatura](https://github.com/adbar/trafilatura) · [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) · [scrapy/scrapy](https://github.com/scrapy/scrapy) | Apache-2.0 · Apache-2.0 · BSD-3 | — | 09–10/2026 | respeitar robots.txt |
| Dados do CNPJ em banco | [rictom/cnpj-sqlite](https://github.com/rictom/cnpj-sqlite) | MIT | 240 | 09/2026 | base completa (~30 GB) se for atender muitas cidades |

**Fidelidade/cashback:** não há projeto aberto independente e maduro (só o módulo do Odoo). O kit recomenda regra simples (telefone + contagem de pedidos em planilha/CRM).

## Existem, mas violam termos — por conta e risco de quem usa

| Projeto | Licença | O que viola |
|---|---|---|
| [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper) · [omkarcloud/google-maps-scraper](https://github.com/omkarcloud/google-maps-scraper) | MIT | Google Maps Platform Terms 3.2.3 (sem raspagem) — risco: bloqueio de IP |
| [instaloader/instaloader](https://github.com/instaloader/instaloader) | MIT | Termos do Instagram (coleta automatizada) — risco: bloqueio da conta |
| [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys) · [evolution-foundation/evolution-api](https://github.com/evolution-foundation/evolution-api) | MIT · Apache-2.0 (com condições) | Termos do WhatsApp — risco: **banimento do número do restaurante** |

O kit não integra esses projetos. Quem implanta decide; o número do restaurante nunca deve ir para gateway não oficial.

## Parados ou arquivados (não usar)

[cuducos/minha-receita](https://github.com/cuducos/minha-receita) (arquivado no GitHub, mudou para Codeberg) · [aphonsoar/Receita_Federal…CNPJ](https://github.com/aphonsoar/Receita_Federal_do_Brasil_-_Dados_Publicos_CNPJ) (sem push desde 08/2024) · [joseviniciusnunes/qrcode-pix](https://github.com/joseviniciusnunes/qrcode-pix) (sem push desde 05/2024) · [caiopizzol/cnpj-data-pipeline](https://github.com/caiopizzol/cnpj-data-pipeline) (sem LICENSE — só referência).
