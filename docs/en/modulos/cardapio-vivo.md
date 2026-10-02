# Module: Live Menu

> Addresses: **marketplace dependence** (gives customers a reason and a path to order directly), **average order value** (bundles and add-ons at the right moment), **weak menu mix** (highlights items with stronger margins), **staff workload** (the menu answers questions the team used to handle by hand).

## The right question: how do you get people to the menu?

A standalone menu is **a shop on a quiet street**. People rarely type in a menu’s address. They find it through three things, and this module builds all three:

### 1. Traffic: bring the menu to places customers already visit

| Where customers already are | How the menu shows up |
|---|---|
| Google (“restaurant near me,” “lunch open now”) | Google Business Profile with an **order link** to the menu, photos of the daily special, accurate hours, and weekly posts |
| Instagram | Link in bio, a **“Menu” highlight**, and a daily special story with a link |
| Email and SMS | Opt-in messages with the daily special or a direct link to order; follow local consent and opt-out rules |
| Local community | Neighbourhood groups or channels (see [local-marketing](marketing-local.md)) |
| In person | QR code on tables, at the counter, on the storefront, and on bags for **direct orders** and dine-in orders |

### 2. A reason: why order here instead of using the usual app?

Without a reason, customers return to a marketplace out of habit. Reasons that can work:

- **Daily news** — and this is the heart of “live”: daily special, “the stew has sold out,” “just out of the kitchen,” or a slow-hour offer. A menu that changes **gives people a reason to check again**. A static menu does not create repeat visits.
- **A benefit on the direct channel** — points, a free item, dessert on the fifth order, or a better delivery deal. Avoid assuming that lower direct prices are allowed under a marketplace agreement or local rules. Check the contract and local requirements first.
- **A sense of belonging** — a neighbourhood club: customers known by name, a vote on next week’s special, or early notice of a new dish.

### 3. A low-friction path

Every extra step loses customers. Aim for **no more than four taps from link to paid order**.

link → menu (loads quickly, no account required, good photos) → cart with an add-on suggestion → checkout with card processing or a locally available instant payment option → confirmation.

One-tap reordering of a previous order is a strong way to encourage repeat business.

## One update, everywhere

The owner should not have to update five places every day. The module’s workflow:

```text
dish photo + one sentence (owner sends it to the assistant)
        │
        ▼  AI drafts short copy, price, tags, and featured placement
   direct menu updated (daily special, sold-out items)
        │
        ├─► email or SMS draft
        ├─► Instagram story/post (draft for approval)
        └─► Google Business Profile post
```

Start simple: the implementer handles this manually or semi-automatically in the first month, learns the restaurant’s rhythm, and then automates the repeated steps.

## Implementation paths

**A — Ready-made software (recommended to start).** Compare options available in the restaurant’s country. Check whether the service supports local payment methods, repeat ordering, customer-list export (CSV), featured items, and bundles. **If it cannot export customer data, rule it out** — the customer list is an asset. Confirm fees, data handling, and contract terms directly with each provider.

**B — Your own stack (when the client wants control).** A static menu page (data in a spreadsheet or JSON) + an order assembled for checkout + card processing or a supported local payment provider + customer list in a spreadsheet or simple CRM. Costs depend on hosting and payment-provider fees; the implementer is responsible for maintenance.

## Implementation checklist (first version)

- [ ] Recipe and cost sheets for the 20 best-selling items (cost → margin) to choose featured items
- [ ] Menu with real photos, three high-margin bundles, and a suggested add-on in the cart
- [ ] Short link and QR code created; QR printed for tables, counter, and direct-order bags
- [ ] Google Business Profile: order link, hours, 10 photos, first post
- [ ] Instagram: bio link and “Menu” highlight
- [ ] Email/SMS: opt-in collection, welcome message with menu link, and opt-out handling that meets local rules
- [ ] Daily-special routine agreed (who sends the photo, and by what time)
- [ ] Baseline recorded: share of orders with an add-on; direct-channel orders per week

## How to measure

Direct-channel orders per week; share with an add-on; average margin across the item mix; link visits (using a link shortener with click counts). Connected to the `como_medir` fields for the *marketplace*, *ticket*, and *menu* leaks.
