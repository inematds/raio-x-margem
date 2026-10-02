# Margin X-Ray

**🇧🇷 [Português](README.md) · 🇺🇸 [English](README.en.md) · 🇪🇸 [Español](README.es.md)**

[![Margin X-Ray](guia/assets/banner-en.jpg)](https://inematds.github.io/raio-x-margem/guia/en/)

📖 **Guide:** [inematds.github.io/raio-x-margem/guia/en/](https://inematds.github.io/raio-x-margem/guia/en/)

**Open kit to find where a small business is losing money, show it in dollars, fix it and prove what came back.**
Sectors: restaurants, hotels, clinics, salons and any appointment-based service — with a global market pack in English (USD, US worked example).

> It doesn't sell AI. It doesn't sell an app. It sells **less leakage, more margin, more control and recurring revenue.**

## Find the client: Margin Hunter

`coletor/` builds a list of businesses in a city or neighborhood from **open data** — OpenStreetMap (works worldwide) plus each business's own website, with an optional AI review through your subscription CLI. You can also merge a CSV export from your country's business registry (UK Companies House, France SIRENE, Australia ABN, Canada's open business data). `app/cacador.html?lang=en` scores each lead, estimates its potential, writes the outreach message and tracks it up to the X-Ray.

```bash
mkdir -p dados
python3 coletor/osm.py --cidade Austin --setor alimentacao --saida dados/osm-austin.json
node coletor/juntar.js dados/osm-austin.json dados/registry-austin.csv > dados/leads-austin.json   # CSV optional
python3 coletor/sitios.py --entrada dados/leads-austin.json --saida dados/leads-austin-enr.json --setor alimentacao --limite 30
```

OpenStreetMap boundaries use different `admin_level` values per country: adjust with `--nivel-cidade` / `--nivel-bairro`. Sectors: `alimentacao` (food), `hospedagem` (lodging), `servicos` (clinics and salons). Collector docs (in Portuguese): [`coletor/README.md`](coletor/README.md).

## How to use it with a client (6 steps)

1. **Open `app/index.html?lang=en`** in a browser (double-click; works offline, nothing to install).
2. **Fill it in with the owner**, with the delivery-app and card-processor statements open. Anything the owner doesn't know stays empty.
3. **Print the report** (*Print report / PDF*) and **save the diagnosis** (.json) — that is your "before" baseline.
4. **Open the playbook** for the highest-priority leak in [`docs/en/modulos/`](docs/en/modulos/).
5. **Implement** it following the playbook's checklist (ready-made SaaS path or your own open-source stack).
6. **Measure** every month in the **Recovery Dashboard** (`app/painel.html?lang=en`): it opens the saved diagnosis, takes the month's numbers and shows before × after, % of target, cumulative recovery and a bonus only on what can be attributed. Bill the retainer. Rule of thumb: total fees stay below 1/3 of what the X-Ray showed as recoverable.

## What's inside

| Folder | Contents |
|---|---|
| `app/` | X-Ray (`index.html`), Hunter (`cacador.html`) and Recovery Dashboard (`painel.html`), UI in English, Spanish and Portuguese |
| `coletor/` | Lead-list scripts: OpenStreetMap, websites, merge (plus national registry collectors for Brazil) |
| `setores/en/` | Global market packs: restaurant, hotel, appointment services, clinic, salon |
| `docs/en/modulos/` | Fix playbooks in English: menu, customer acquisition and retention, payments, local marketing, own channel, appointments, hotel direct booking and low season |
| `docs/ARQUITETURA.md` | How the system is built, pack format and roadmap (in Portuguese) |
| `docs/mercados/global-pesquisa-2026-10.md` | Global market research with sources (in Portuguese) |
| `docs/TERMOS.md` | What platform terms and privacy rules allow (in Portuguese) |
| `kit-comercial/` | Outreach, objections, pricing (in Portuguese for now) |
| `tests/` | Engine and UI tests |

## Markets

Each language is a separate **market**, not just a translation:

| Market | Platforms and rules covered |
|---|---|
| 🌐 Global (EN) | DoorDash, Uber Eats, Grubhub, Deliveroo, Just Eat; card processing (IFR caps in the UK/EU, surcharging banned in the UK, EU and Australia); SMS/email with consent (TCPA, PECR soft opt-in, GDPR); hotels: no Booking rate parity in the EEA (DMA); marketplaces such as Fresha, Booksy Boost and Zocdoc that charge for new clients |
| 🌎 Latin America (ES) | Rappi, DiDi Food, Uber Eats; local instant payments; WhatsApp-first |
| 🇧🇷 Brazil (PT) | the original pack, with its own platforms and rules |

To add a sector or a country: copy a pack from `setores/en/`, change `id`, `mercado`, currency and data. See [ARQUITETURA.md](docs/ARQUITETURA.md#mercados).

**Within the rules:** the kit does not scrape Google Maps, Instagram or delivery apps, never uses customer contacts passed on by marketplaces and only keeps business data. B2B outreach rules vary by country (GDPR legitimate interest, PECR corporate subscribers in the UK, CAN-SPAM opt-out in the US, stricter CASL in Canada). Health data is a special category (HIPAA, GDPR).

## Tests

```bash
npm test                       # engines (X-Ray and Hunter) + collector, no network
NODE_PATH=<folder>/node_modules npm run test:ui   # UI over file://, desktop and mobile (needs playwright)
```

## Privacy

Nothing leaves the browser. The client's numbers stay in the local draft and in the `.json` you save.

---

An open project by [INEMA.CLUB](https://inema.club) · [MIT](LICENSE) license · version 0.6.1
