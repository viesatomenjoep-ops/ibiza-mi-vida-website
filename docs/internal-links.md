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
| `car-rental-ibiza` (pillar) | — | `boat-rental-ibiza` ¹, `ibiza-club-tickets` ², `car-rental-ibiza-airport` |
| `car-rental-ibiza-airport` | `car-rental-ibiza` | `convertible-car-rental-ibiza`, `boat-rental-ibiza` ¹ |
| `convertible-car-rental-ibiza` | `car-rental-ibiza` | `car-rental-ibiza-airport`, `boat-rental-ibiza` ¹ |

² The second cross-silo link, and the weaker of the two. It exists because
"how do I get to Amnesia and back" is a real question a car-hire visitor has.
If the silo ever needs tightening, this is the link to drop first.

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

## What is not linked yet

- The DE, FR, ES and NL versions of the two pillars do not exist, so nothing
  links to them. Language versions are connected by hreflang rather than by
  in-page links, and the language switcher resolves localised slugs through
  `route-slugs.ts`.
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
