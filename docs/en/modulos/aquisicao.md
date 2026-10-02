# Module: Customer acquisition and retention

> Addresses: **marketplaces** (repeat orders incur fees again), **retention** (customers who order once and disappear), **marketing** (ads shown to people who are already customers).

## Golden rule

**Marketplaces acquire customers. Direct channels retain them.** This module does not try to pull a restaurant off marketplaces. It aims to make **the second purchase** happen through a channel where the restaurant knows the customer.

## Two workstreams

### Workstream 1 — Win customers (for the restaurant)

| Source | Action | Cost |
|---|---|---|
| Google | Complete the business profile, respond to reviews, and ask for a review after a direct order | None |
| Marketplace | Keep it as a storefront for people who do not know the restaurant | Commission |
| Referral | “Refer a neighbour: you both get X” — use a code for each customer | Reward |
| Local area | Partnerships and community ([local marketing](marketing-local.md)) | Low |
| Advertising | Target **new** audiences only, excluding the existing customer list | Media spend |

### Workstream 2 — Bring customers back (retention)

1. **Collect contact details with consent** at every restaurant-owned touchpoint: direct orders, dine-in (a QR code to “join the club”), in-store Wi-Fi, and the counter. Never use customer data obtained through a marketplace; check the applicable platform terms and local rules ([ANALISE.md §3.1](../../ANALISE.md#31-termos-do-marketplace-o-risco-jurídico-central)).
2. **Create automatic segments:** new (1 order), repeat, inactive (more than 30/45 days), VIP (top 10% by spend), and promotion-sensitive.
3. **Set a messaging sequence** (SMS and email are common options; WhatsApp may also be used where customers expect it). Get consent and follow the rules that apply locally: TCPA in the US, PECR and UK GDPR in the UK, GDPR in the EEA, and CASL in Canada. Rules and requirements vary by market; verify locally before sending:
   - Day 1 after the first order: thank the customer and ask for a Google review
   - Day 7: “Your favourite dish is on today” (if available)
   - Inactive for 30 days: offer one return benefit, once
   - VIP: early notice of something new, with no discount (avoid training customers to wait for promotions)
4. **Keep loyalty simple:** points or “buy 10, get 1 free.” No app required: identify customers by phone number.

## For implementers: Margin Hunter (win customers for your business)

The same module, from the implementer’s perspective: `app/cacador.html` + `coletor/`.

1. **Build a list** of businesses in the local area using open sources. The available registries differ by country: examples include Companies House in the UK, SIRENE in France, and ABN data in Australia. The US has no national business register; it has state registries and NAICS classifications. Verify local sources and terms before collecting data ([coletor/README.md](../../coletor/README.md)).
2. **Enrich** the list by reading each restaurant’s own website (online ordering? messaging options? loyalty? marketplace links?), with optional AI available through the user’s subscription.
3. **Manually check** details you should not collect automatically under applicable terms: Google rating and reviews, active Instagram account, and marketplace presence. Margin Hunter opens a ready-made search.
4. **Score** with the package criteria (0–100, using only checked information; the clear bar shows the ceiling) and review **alerts** for cases where the business thesis may fail (business size or status, few reviews, delivery-only).
5. **Reach out** with the generated message—it mentions only details that have been checked—and track the status through to the Margin X-Ray (“Open X-Ray for this lead”).

Suggested opening (from the package):

> “Your restaurant clearly already has demand. The problem does not seem to be finding customers. It is that each time a customer comes back through a marketplace, you pay again to reach someone who already knows your brand.”

## Implementation paths

**A — Ready-made SaaS:** the restaurant’s menu or ordering system (if it exports customer data) + a customer messaging tool with labels + a spreadsheet for the messaging sequence. For higher volume, use an official messaging provider and follow the consent rules for the relevant market.

**B — Your own stack:** CRM in a spreadsheet or Supabase + automation (n8n) + an official messaging API. **Never** use an unofficial API on the primary business number.

## Checklist

- [ ] Contact collection points listed, with consent wording that meets applicable privacy and messaging rules
- [ ] Segments defined with the restaurant’s cutoff periods
- [ ] Four messages in the sequence written and approved by the owner
- [ ] Loyalty program has a one-line rule
- [ ] Existing-customer exclusion applied to ads
- [ ] “Before” baseline: return rate within 60 days for the last customer cohort

## How to measure

Return within 60 days by monthly cohort (before × after); direct-channel orders from identified customers; messaging cost ÷ margin from the orders generated.
