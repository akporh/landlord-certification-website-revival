## What changed in this plan

Checked the live site. There is no mention of same-day vs next-day zones anywhere — only "fast response" and "book anytime." So I'll drop the zone split entirely (in the coverage section, in the FAQ copy, in the legend on the cartogram, and in the hero "next-day slots" line). We'll talk about coverage in terms of *where*, not *how fast*. Speed claims stay generic and truthful: "Most jobs booked the same week, certificate emailed within 24 hours of inspection."

## 1. Coverage section — contemporary map treatment

Drop the postcode search and the chip cloud of every borough name. Drop the inner/outer zone legend.

New layout: a single full-bleed canvas where a stylised London map is the **atmosphere**, not the content. The map sits as a soft, glowing silhouette behind the section — low opacity, blurred edges, emerald accent on the Thames — so the page feels grounded in London without forcing the user to read a map.

```text
┌──────────────────────────── Coverage ────────────────────────────┐
│                                                                  │
│       ░░░░░░ soft glowing London silhouette ░░░░░░               │
│       ░░░░░ Thames runs across as a quiet emerald ░░░░           │
│                                                                  │
│              We cover every London borough.                      │
│         Plus M25 fringe — Watford to Dartford to Epsom.          │
│                                                                  │
│    ┌──────────────┬──────────────┬──────────────┐                │
│    │  32          │  M25         │  24 hr       │                │
│    │  London      │  fringe      │  certificate │                │
│    │  boroughs    │  covered     │  email       │                │
│    └──────────────┴──────────────┴──────────────┘                │
│                                                                  │
│   Not sure? Call 0203 772 5959 — we'll confirm in 30 seconds.    │
└──────────────────────────────────────────────────────────────────┘
```

Visual direction for the map:
- Take the existing `LondonBoroughMap` outer silhouette path, throw away the borough labels, graticule, compass and labels.
- Render it as a single shape with a radial gradient fill (navy-deep at the edge, emerald glow at the centre), blurred behind a subtle grain. Thames as a thin lit ribbon. No tiles, no borough names, no buttons.
- Position it absolutely behind the headline at maybe 70% opacity, sitting off-centre so it feels like a backdrop, not a diagram.
- On hover (desktop), borough silhouettes get a faint emerald wash that ripples outward once. Optional, can drop.

Because this is a real visual question and I genuinely don't know which atmospheric treatment will land — soft glowing silhouette, contour-line topographic, dot-grid heatmap, or sketched line-art — I'd like to render three directions and let you pick before I build. Acts after your sign-off on the rest of the plan.

## 2. "Before we arrive" — keep the new single-view checklist

Confirmed direction: drop the tabs, show all four service checklists at once in a 2×2 grid of grouped cards, each with the service icon, heading, and short bullets. Nothing to click. Same content as today, just laid out together.

## 3. Clients / Agents page (`/clients`)

New route, modeled on the live `/contact-us/clients/` page. Demo only — form is decorative, no email, no Cloud.

Sections:
- Hero: "Built for estate agents, developers & portfolio landlords."
- What you get: 6 tiles — Certified Gas Safe engineers · £5M public liability · Personal account manager · Credit up to £2,500 · Field management portal · Confidential white-label.
- How agents save: 4 points lifted from their existing copy (no tenant calls, no admin chasing, certs ready in 48 hrs, single supplier).
- Free trial offer card: "New business accounts get a free gas inspection."
- Contact form: Company, contact name, phone, email, preferred method. Submit shows a success toast and resets — no backend.

Slim "For agents" strip on the home page just above the FAQ, links to `/clients`.

## 4. Navigation cleanup

Header links become:
- Certificates
- Commercial   *(was HMO; section id `#hmo` → `#commercial`, heading "Commercial & HMO properties")*
- Bundles   *(was Offers)*
- Coverage
- For Agents   *(new, → `/clients`)*
- FAQ

Sign in + Get quote stay on the right. Mobile gets a hamburger sheet with the same set plus the phone number.

## Files

- `src/routes/index.tsx` — nav rename, new "For agents" strip, coverage section rewrite (delete postcode UI + chip cloud + zone legend), before-we-arrive rewrite, copy edits removing same-day/next-day claims.
- `src/components/LondonBoroughMap.tsx` — strip down to silhouette + Thames for the new atmospheric background, or new component if the directions land on a different metaphor.
- `src/routes/clients.tsx` — new page.

## What I'll do next

1. On your approval of this plan, generate three coverage-section design directions (atmospheric map variations) and ask you to pick one.
2. Build everything else immediately after that pick.
