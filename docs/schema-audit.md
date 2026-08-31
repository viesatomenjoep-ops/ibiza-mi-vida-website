# Structured data audit

Last run: 31 August 2026, against a production build served locally.

## How schema is emitted now

One component: `src/components/seo/SchemaMarkup.tsx`. It renders a **single**
`<script type="application/ld+json">` containing **one `@graph`**, so every node
on a page can reference the others by `@id` and a consumer sees one connected
description instead of several disconnected ones.

Variants: `Organization`, `Product` + `Offer`, `FAQPage`, `BreadcrumbList`, and
`AggregateRating`.

### Two constraints that are structural, not conventional

**No invented price.** `product.price` accepts `null`, and `null` means the
Product is emitted with **no Offer node at all**. A page whose "from" price is
still unconfirmed cannot publish that placeholder as a real offer — Google reads
a price in Product markup as a commitment.

**No invented rating.** Rating markup is only ever built from live Google
Business Profile data via `src/lib/google-reviews.ts`, which returns `null` when
it cannot prove a number is real. There is no default rating, no default count
and no sample review anywhere in the component. This is not caution for its own
sake: this site previously shipped invented reviews and a hardcoded
`AggregateRating`, which is a Google spam-policy violation.

## Automated verification

`npm run check:schema` fetches each route, extracts every JSON-LD block,
`JSON.parse`s it, and asserts per type:

| Type | Asserted |
| --- | --- |
| `Organization` | `name`, `url` present |
| `Product` | `name`, `url` present |
| `Offer` | price present, finite and **above zero**; `priceCurrency` present |
| `AggregateRating` | `ratingValue` within 0–5; `reviewCount` a real count above zero |
| `FAQPage` | non-empty `mainEntity`; every question has a `name` and an `acceptedAnswer.text` |
| `BreadcrumbList` | at least two crumbs; sequential `position`; **last crumb carries no `item` URL** |

It additionally asserts that **every FAQ question and answer in the schema
appears in the visible page text**. That is the single-source-of-truth rule made
enforceable: markup claiming an answer a visitor cannot see is a structured-data
violation, and it is exactly the drift that happens when someone edits the
accordion and forgets the schema array. In this codebase both halves are fed the
same array, so the check confirms the arrangement rather than policing a habit.

**Result on the nine English keyword pages: 9 checked, 0 failed.**

## What is actually emitted

Verified by fetching the rendered HTML:

### `/en/boat-rental-ibiza` — 2 blocks

| Node | Detail |
| --- | --- |
| `Product` | brand `Click&Boat`, **no `offers`** — the from-price is still unconfirmed |
| `FAQPage` | 8 questions |
| `BreadcrumbList` | 3 crumbs (Home → Boats → Boat rental Ibiza) |
| `Person` | `Simon` — from the existing `AuthorByline`, its own block |

### `/en/car-rental-ibiza` — 2 blocks

| Node | Detail |
| --- | --- |
| `Product` | brand `Wiber Rent a Car`, **no `offers`** — from-price unconfirmed |
| `FAQPage` | 8 questions |
| `BreadcrumbList` | 2 crumbs (Home → Car rental Ibiza) |
| `Person` | `Simon` |

The missing `Offer` on both is correct behaviour and not a defect: fill in
`boatWithSkipper` and `carPerDay` in `src/lib/rental-prices.ts` and the Offer
node appears on its own. See `docs/content-todos.md`.

`AuthorByline` still emits its own separate block. It is the next candidate for
consolidation into `SchemaMarkup` — the `Person` belongs in the same `@graph` as
the `Organization` that references it as `founder`.

## Manual Rich Results Test — NOT YET RUN

**This has not been done, and I could not do it.** The environment this work ran
in has no outbound network access to Google, so the two manual tests requested
are still open. The automated checks above validate JSON syntax and required
fields; they do **not** replicate Google's own eligibility rules, which is what
the Rich Results Test tells you.

Run it once the pages are deployed:

1. Open <https://search.google.com/test/rich-results>
2. Test `https://www.ibizamivida.com/en/boat-rental-ibiza`
3. Test `https://www.ibizamivida.com/en/car-rental-ibiza`
4. Record the outcome in the table below.

| URL | Date | Detected items | Errors | Warnings | Notes |
| --- | --- | --- | --- | --- | --- |
| `/en/boat-rental-ibiza` | _not yet run_ | | | | |
| `/en/car-rental-ibiza` | _not yet run_ | | | | |

### What to expect, and what is fine

- **FAQ rich results are no longer shown for most sites.** Google restricted FAQ
  rich results to authoritative government and health sites in 2023. Valid
  `FAQPage` markup is still worth having — answer engines read it, and it is the
  form LLMs quote most readily — but do not treat "not eligible for display" as
  a defect. It is expected.
- **A `Product` without an `Offer` will draw a warning** about missing price
  fields. That is the deliberate behaviour described above. It resolves by
  filling in a real price, never by publishing a fake one.
- **`priceValidUntil`** is supported by the component but unused, since there is
  no price yet. Google warns when it is absent from an Offer; set it when the
  prices land.
- **Breadcrumbs should show cleanly.** If they do not, the likely cause is the
  last crumb carrying an `item` URL — which the automated check already forbids.
