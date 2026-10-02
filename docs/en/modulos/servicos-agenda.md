# Module (appointment-based services): A Full Calendar

> Addresses **no-shows**, **appointments that never get booked**, **clients who do not return on time**, **platform fees for clients you already have**, and **front-desk staff stuck booking by hand**. Applies to all profiles in the standard “Appointment-Based Services” model (clinics, salons, barbershops, studios, pet shops, and more). See [docs/setores/servicos.md](../setores/servicos.md) for sector-specific rules, such as professional licensing and health-data requirements.

## The five components

| Component | What it solves | How |
|---|---|---|
| **Automatic confirmation** | No-shows | Send a reminder 24–48 hours beforehand with “confirm / reschedule”; call clients who do not respond |
| **Waitlist** | Cancellations and last-minute gaps | When someone cancels, automatically offer the slot to clients who requested that day |
| **Deposit by card or local payment method** | High-demand time slots | Take a deposit only for prime-time slots or from {cliente} who has missed appointments before; publish and communicate the policy |
| **Scheduled return** | {cliente} who does not come back | Book the next visit or record its date at checkout; send a reminder when it is due |
| **Plan / membership** | Idle capacity and repeat visits | Offer a monthly package or membership with recurring card billing; check which local instant-payment options support recurring payments |

## Recommended order

1. **Measure** four weeks of bookings: no-shows, occupancy by time slot, and on-time return rate.
2. **Add confirmations and a waitlist** (results in two weeks can help pay for the rest).
3. **Schedule returns** using your own consented client list.
4. **Add a plan or membership** only after the calendar is organised.

## Options

**A — ready-made system:** Most appointment-booking systems in this sector offer confirmations and online booking. Compare options and prices in [docs/setores/servicos.md](../setores/servicos.md). Selection criteria: support for SMS and email reminders, a waitlist, export of {clientes}, and no commission on appointments from existing clients. Marketplace discovery fees can apply to new clients: for example, Fresha charges a one-time fee for new clients who discover a business through its marketplace; Booksy lists a $29.99 monthly price and a one-time 30% Boost fee for clients brought in through Boost; Treatwell UK lists a new-client commission for marketplace referrals, 0% commission on repeat bookings, and a 2.5% processing fee. Check the terms and current price for your country. [Market research](../../mercados/global-pesquisa-2026-10.md)

**B — open minimum:** a business SMS/email account, a return-date spreadsheet, and card processing or a locally available instant-payment method. In the US, FedNow exists, but the research does not confirm a direct merchant payment setup or merchant cost; verify locally. In the UK and EEA, check Faster Payments / Pay by Bank and SEPA Instant availability with your provider. See [ALTERNATIVAS-ABERTAS.md](../../ALTERNATIVAS-ABERTAS.md).

## Care points

- **A reminder is not advertising.** Appointment and return reminders are service messages; promotions are different. Follow applicable consent and privacy rules, including TCPA in the US, PECR and UK GDPR in the UK, GDPR in the EEA, and CASL in Canada. For health appointments, keep the message discreet and verify local health-data rules.
- **Use your own client list only with appropriate consent.** Get consent through the business itself and keep a record. Contacts acquired through a marketplace remain subject to its terms.
- **A deposit is not a surprise penalty:** publish the policy and explain it when the appointment is booked. Check local rules before charging for missed appointments or setting cancellation terms.

## Checklist

- [ ] Four weeks of bookings measured as a baseline
- [ ] Automatic confirmations enabled and tested
- [ ] Waitlist working
- [ ] Deposit policy published, if using one
- [ ] Return date recorded for every appointment
- [ ] Consent recorded and stored

## How to measure

Compare no-show rate, occupancy by time slot, and on-time return rate month over month; track front-desk hours spent managing bookings and revenue from plans.
