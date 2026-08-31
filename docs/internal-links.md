# Internal link matrix

The link graph for the keyword pages, and the rules it follows. Written down
because an internal link structure that lives only in page files drifts the
moment somebody adds a page and links it "somewhere sensible".

Last verified: 31 August 2026, against the `InternalLinks` blocks and
breadcrumb trails in `src/app/[locale]/*/page.tsx`.

## The rules

1. **Every spoke links up to its pillar.** In the breadcrumb (which is a real
   link) and in the related-pages block at the foot.
2. **Every spoke links sideways to one or two sisters** in the same silo, and no
   more. A spoke that links to eight other pages passes almost nothing to any of
   them.
3. **Every pillar links down to all of its spokes.**
4. **No cross-links between unrelated silos.** Boats do not link to clubs
   because both are "things to do in Ibiza". The one deliberate exception is
   noted below.
5. **Breadcrumbs mirror the hierarchy**: Home → pillar → spoke, and the visible
   trail and the `BreadcrumbList` schema are built from the same array, so they
   cannot disagree.

## Silo 1 — Boats

Pillar: **`/en/boat-rental-ibiza`**

| Page | Links up to | Links sideways to |
| --- | --- | --- |
| `boat-rental-ibiza` (pillar) | — | `jet-ski-rental-ibiza`, `boat-party`, `car-rental-ibiza` ¹ |
| `boat-hire-ibiza-no-licence` | `boat-rental-ibiza` | `boat-rental-with-skipper-ibiza`, `jet-ski-rental-ibiza` |
| `boat-rental-with-skipper-ibiza` | `boat-rental-ibiza` | `boat-hire-ibiza-no-licence`, `boat-party` |
| `jet-ski-rental-ibiza` | `boat-rental-ibiza` | `boat-party` |

The pillar also links down to both boat spokes through its three choice cards
(with licence → skipper page, without licence → no-licence page, with skipper →
skipper page), which is where most of the click-through actually happens.

¹ The one deliberate cross-silo link, and it earns its place: the car page is
how you reach the marina, and the boat page is what you do once the car has got
you to a cove. It is a genuine user journey, not a topical association.

## Silo 2 — Cars

Pillar: **`/en/car-rental-ibiza`**

| Page | Links up to | Links sideways to |
| --- | --- | --- |
| `car-rental-ibiza` (pillar) | — | `boat-rental-ibiza` ¹, `wiber-car-rental-ibiza`, `car-rental-ibiza-airport` |
| `car-rental-ibiza-airport` | `car-rental-ibiza` | `convertible-car-rental-ibiza`, `boat-rental-ibiza` ¹ |
| `convertible-car-rental-ibiza` | `car-rental-ibiza` | `car-rental-ibiza-airport`, `boat-rental-ibiza` ¹ |

² This footnote used to mark a link from the car pillar to `ibiza-club-tickets`
as the weakest in the graph and the first to drop. It has been dropped, replaced
by the Wiber dossier — a link that stays inside the silo and answers the question
a reader on that page is actually holding.

## Partner dossiers

Two pages target branded trust queries ("Wiber Ibiza", "is Click&Boat legit")
rather than category queries, so they do not compete with the pillars:

| Page | Hangs under | Links back to |
| --- | --- | --- |
| `wiber-car-rental-ibiza` | `car-rental-ibiza` | the pillar, `car-rental-ibiza-airport`, `click-and-boat-ibiza` |
| `click-and-boat-ibiza` | `boat-rental-ibiza` | the pillar, `boat-hire-ibiza-no-licence`, `wiber-car-rental-ibiza` |

They link to each other deliberately — a reader checking whether one partner is
trustworthy is often about to check the other — and each is linked from its own
pillar's related-pages block.

## Silo 3 — Nightlife

Pillar: **`/en/ibiza-club-tickets`**

| Page | Links up to | Links sideways to |
| --- | --- | --- |
| `ibiza-club-tickets` (pillar) | — | `ibiza-guestlist`, `boat-party`, `car-rental-ibiza` ² |
| `ibiza-guestlist` | `ibiza-club-tickets` | `boat-party` |

`ibiza-guestlist` sits under the club-tickets pillar in its breadcrumb
(Home → Ibiza club tickets → Guestlist and VIP tables) rather than at the top
level, because that is the relationship a reader has with it: they came looking
for a way in, and the guestlist page is one of the answers.

## Existing routes referenced

- **`/[locale]/boat-party`** — the pre-existing boat party page. Deliberately
  **not** duplicated onto a `boat-party-ibiza` keyword slug: two of our own URLs
  competing for the same query split each other's links and Google picks one,
  usually not the one you wanted. If the keyword slug is ever wanted, rename
  that route and 301 the old path.
- **`/[locale]/boats`** — appears in the boat pillar's breadcrumb as the parent
  section.

## The localised pillars

Both big pillars exist in all five languages, each on its own keyword slug:

| Route | en | nl | de | fr | es |
| --- | --- | --- | --- | --- | --- |
| Boat rental | `boat-rental-ibiza` | `boot-huren-ibiza` | `boot-mieten-ibiza` | `location-bateau-ibiza` | `alquiler-barco-ibiza` |
| Car rental | `car-rental-ibiza` | `auto-huren-ibiza` | `mietwagen-ibiza` | `location-voiture-ibiza` | `alquiler-coches-ibiza` |

Within each language the two pillars link to each other, plus to that language's
existing routes (`boat-party`, `private-boat-charters`, `car-scooter-rental`,
`tips`). They do **not** link across languages: language versions are connected
by hreflang, not by in-page links, and a link from a Dutch page to an English
one leaks a reader out of their language. The language switcher resolves the
localised slugs through `route-slugs.ts`.

The English-only spokes are not linked from the non-English pillars either, for
the same reason — a Dutch reader following "jet ski rental" onto an English page
is a worse experience than not seeing the link.

## What is not linked yet
- `/en/ibiza-club-tickets` and the existing `/[locale]/club-tickets` section are
  two different things: the former is a hub about what tickets cost, the latter
  is the per-venue booking section. The hub does not link into individual venue
  pages yet — worth adding once the hub proves itself.

## Checking it

There is no automated internal-link check yet. `npm run check:onpage` validates
titles, descriptions, headings and alt text but does not crawl the link graph.
Adding a link checker is the obvious next step; until then this file is the
reference, and it needs updating in the same commit as any page that changes its
`InternalLinks` block.
