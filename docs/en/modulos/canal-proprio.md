# Module: 100% direct channel (no marketplace)

> Addresses: **marketplaces**, **payments** (direct card processing and local instant payment options), and **retention**. For a restaurant with a **strong local brand**—a busy dining room, good reviews, and customers who ask, “Do you deliver?”

## When it makes sense (and when it doesn’t)

| Makes sense | Doesn’t |
|---|---|
| Busy dining room and a recognised local brand | Delivery-only kitchen with no established brand |
| Short delivery radius (the neighbourhood and nearby areas) | Relies on distant customers who find it only through an app |
| Owner willing to run the channel every day | No one available to respond or post the daily special |
| Marketplace is a smaller share of sales | Marketplace is a large share of sales, making an abrupt exit a cash-flow risk |

**Safer transition:** first **reduce** marketplace use—keep Uber Eats, DoorDash, Grubhub, Deliveroo, or Just Eat for discovery, and encourage repeat customers to order direct. Leave only when direct-channel orders consistently exceed marketplace orders. Track the crossover in the Dashboard (phase 5).

## What the marketplace provides—and what replaces it

| The marketplace provides | Direct-channel alternative |
|---|---|
| Discovery (new customers) | Google Business Profile, Instagram, local partnerships ([local marketing](marketing-local.md)), referrals |
| Menu and cart | [Living Menu](cardapio-vivo.md) (the kit page or TastyIgniter) |
| Payment | Card processing or a locally available instant payment option, such as FedNow, Faster Payments/Pay by Bank, or SEPA Instant. Availability and merchant costs depend on the country and provider ([payments](cobranca.md)). |
| Delivery driver | In-house drivers or a local delivery partner; plan routes and group deliveries where practical |
| Customer service and order status | SMS or email, which are common options; WhatsApp Business may fit some customer bases. Obtain consent and follow applicable rules. |
| Promotions | Local loyalty club, rewards, partner offers |
| Reviews | Ask for a Google review after each delivery |

Open-source options, licenses, and risks: [OPEN-ALTERNATIVES.md](../../ALTERNATIVAS-ABERTAS.md).

## Minimum stack (keep recurring costs low)

1. Static menu published on GitHub Pages or Cloudflare Pages, with a cart that prepares the order details.
2. Card processing and, where available, a local instant payment option. Confirm the provider’s fees before choosing; for example, Square lists US Free-plan rates of 2.6% + 15¢ in person and 2.9% + 30¢ online ([market research](../../mercados/global-pesquisa-2026-10.md)).
3. A customer contact channel, such as SMS or email, with consent records and clear opt-out handling. Check local requirements before sending marketing messages.
4. Customer spreadsheet (contact details, orders, last order) → manually follow up with eligible customers during the first month.
5. In-house driver or local delivery partner, with a defined delivery radius and clear delivery fees.

## Risks

- **Payment processing has a cost:** card fees vary by provider and country. Instant payment options also depend on local availability and provider terms; confirm the merchant cost before promising a low-cost payment method.
- **Delivery logistics** are the main operational risk: delays from your own delivery operation can damage the brand faster than delays through an app.
- **Without new-customer discovery**, the direct channel can shrink over time. Local partnerships and referrals are essential.
- **Customer messaging has consent rules:** requirements differ across the US, UK, EEA, Canada, and Australia. Check TCPA, PECR, GDPR/UK GDPR, CASL, or the applicable local rules before contacting customers.

## Checklist

- [ ] The X-Ray confirms a strong local brand and that marketplace dependence can be reduced safely
- [ ] Direct menu is live and payment flow has been tested
- [ ] Delivery operation has a measured average delivery time
- [ ] Local loyalty club has an active customer base before marketplace use is reduced
- [ ] Reduction plan has stages, dates, and a clear rollback criterion
- [ ] Customer messaging consent and opt-out process have been checked against local rules

## How to measure

Direct-channel orders per week × marketplace orders (crossover); average delivery time; cost per order (delivery + payment processing + operations) × effective marketplace cost. For a US comparison, DoorDash lists 15%, 25%, and 30% commission tiers, while Grubhub lists plans starting at 15%, 20%, and 25%; actual terms vary by plan and market ([market research](../../mercados/global-pesquisa-2026-10.md)).
