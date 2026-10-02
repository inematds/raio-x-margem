# Sources and limits — what could be scraped, why not, and what to do instead

> Technically, much of this information can be scraped: open tools exist for Google Maps, Instagram, and apps (see [ALTERNATIVAS-ABERTAS.md](../ALTERNATIVAS-ABERTAS.md)). This kit does not do that by design: platform terms may prohibit it, the risk falls on whoever deploys the tool and, worse, on the client. Below, source by source: what it could provide, what may prevent collection, the risk, and **how to get the same information another way**. See [TERMOS.md](../TERMOS.md) for literal excerpts and links.

## The rule of thumb

In order of preference:

1. **Data provided by the owner** — with the client present, they export it from their own account or partner dashboard. It is the most complete data and the data the Raio-X actually needs.
2. **Official public records** — the relevant company register or other open local dataset, where available and licensed for reuse. Availability and reuse terms vary by country; verify locally.
3. **Indirect signals** — the business’s own website, which may link to an app, social profile, or booking engine, plus web search results.
4. **Official API with authorization** — where one exists and the scale justifies the cost and administration.
5. **Assisted review** — you look; the tool opens a prepared search and you enter what you see. It takes about a minute per lead and is only worthwhile for the highest-scoring prospects.

## Source by source

### Google Maps — rating, review count, phone, hours, category

| | |
|---|---|
| **Would provide** | A strong demand signal: rating and number of reviews |
| **What may prevent it** | Google Maps Platform terms restrict exporting, extracting, or scraping Maps content, including copying and saving business names, addresses, or reviews. Additional Maps terms prohibit creating business-listing, mailing, or telemarketing databases. Check the current terms for the intended use. |
| **Risk** | IP or Google account restrictions; suspension of the Google Cloud project |
| **Tool that could do it** | `gosom/google-maps-scraper` (MIT) — not integrated |
| **Instead** | (a) **Assisted review** in the lead tool; (b) the official **Places API**, storing only the `place_id` and retrieving rating and reviews when displayed (paid API with a monthly allowance; requires a key and authorization to use); (c) ask the client to export insights and reviews from their **Google Business Profile** |

### Instagram — profile, posting frequency, followers

| | |
|---|---|
| **Would provide** | Whether the business is active and communicates with customers |
| **What may prevent it** | Instagram terms prohibit collecting information automatically without express permission; Meta also has Automated Data Collection Terms. |
| **Risk** | Account restrictions or a notice from Meta |
| **Tool that could do it** | `instaloader` (MIT) — not integrated |
| **Instead** | (a) `sitios.py` finds the **@handle on the business’s own website**; (b) the lead tool opens the profile and you mark “posted in the last 30 days”; (c) the official **Meta Business Discovery API** provides basic public data for business accounts, but requires a Meta app, your own business account, and review; (d) ask the client for their Instagram Insights |

### Delivery apps — Uber Eats, DoorDash, Grubhub, Deliveroo, Just Eat

| | |
|---|---|
| **Would provide** | Whether a restaurant is on the app, its app rating, prices, and promotions |
| **What may prevent it** | The terms of each app apply. Check the relevant platform’s current terms for the intended collection and use. |
| **Risk** | Account restrictions or legal action; potential problems for the client with its platform partner |
| **Instead** | (a) **Indirect signal**: the restaurant’s website links to the app, which `sitios.py` can detect; (b) **web search** can surface the restaurant’s app page for a “check” step; (c) ask the client for the **partner portal’s sales and payout report** — it shows the effective cost used by the Raio-X |

### Booking sites — Booking.com, Airbnb, Expedia, Tripadvisor

| | |
|---|---|
| **Would provide** | OTA presence, rating, price, and availability |
| **What may prevent it** | Check each platform’s current terms. In the European Economic Area, the Digital Markets Act prevents Booking.com from stopping accommodation providers from offering different prices on their own websites. Rules elsewhere need local verification. [Research](../mercados/global-pesquisa-2026-10.md) |
| **Risk** | Account restrictions or conflict with the hotel’s platform agreement |
| **Instead** | (a) Use the relevant **official public business records**, where available and reusable; check locally; (b) inspect the **hotel’s own website** for its booking engine and OTA links (`sitios.py`); (c) ask the client for the **Booking.com/Airbnb extranet** report showing bookings by channel and commissions paid |

## What the kit collects on its own, without requesting platform access

| Source | Basis | Collector |
|---|---|---|
| Relevant public company records | Depends on the country, register, and reuse licence; verify locally |
| Other official open datasets | Depends on the country and dataset; verify locally |
| OpenStreetMap | ODbL (attribution; share-alike conditions apply) |
| Business’s own website | `robots.txt` respected |
| Web search (optional) | Firecrawl, paid credits, only with `--confirmar` |

Everything runs with **one command** (`coletor/rodar.sh`) or from the **Collect** screen (`app/coletar.html` with `python3 coletor/servidor.py`).

## Data protection

The collector stores **business data only**: no email addresses, personal names, or reviewer identities. Whether a sole proprietor’s details count as personal data depends on local law and context; verify locally. Customer contact details from platforms are never used.

For marketing messages, follow the applicable consent and opt-out rules. In the US, CAN-SPAM applies to business-to-business email too and uses an opt-out model. In the UK, PECR generally requires specific consent for marketing emails or texts to individuals, with a limited soft opt-in for previous customers. GDPR and UK GDPR apply to personal data; other markets have their own rules, including CASL in Canada. Verify requirements locally before sending messages. [Research](../mercados/global-pesquisa-2026-10.md)
