# Content TODOs — figures and pages that need you

Everything here is a deliberate gap rather than an oversight. The site's rule is
that a number is either real or absent: no placeholder prices, no invented
ratings, no filler copy standing in for a fact. Each item below is a blank that
only you can fill.

Last reviewed: 31 August 2026.

## 1. Prices — the blocking ones

All live in `src/lib/rental-prices.ts` as `amount: null`. While a value is null:

- the page copy renders correctly **without** the figure (the price clause
  disappears rather than printing "from €null"),
- the price table shows the localised "on request",
- `<SchemaMarkup>` emits the Product with **no Offer node**, because publishing a
  placeholder price as structured data is a commitment we cannot honour.

Filling one in is a one-line edit and it propagates to all four places at once.

| Constant | What it should be | Used on |
| --- | --- | --- |
| `boatWithSkipper` | From-price, full day, skipper included | `/en/boat-rental-ibiza`, `/en/boat-rental-with-skipper-ibiza` |
| `boatNoLicence` | From-price, full day, licence-free (max 15 hp) | `/en/boat-rental-ibiza`, `/en/boat-hire-ibiza-no-licence` |
| `boatWithLicence` | From-price, full day, you drive with your own licence | `/en/boat-rental-ibiza` |
| `jetSki30` | Price for the standard 30-minute slot | `/en/jet-ski-rental-ibiza` |
| `carPerDay` | From-price per day, all-inclusive (Wiber) | `/en/car-rental-ibiza`, `/en/car-rental-ibiza-airport` |
| `boatParty` | Per-person ticket price | reserved for the boat-party page |

Also unpriced, and handled the same way (the table shows "on request"):

- Car categories **compact**, **convertible** and **SUV/4x4** on
  `/en/car-rental-ibiza`. Only the economy row is wired to a constant; if you
  want per-category prices, say so and they get their own constants rather than
  being written into the table by hand.

**Do not** replace a null with a guess to make a page look finished. A wrong
price on a booking site is the most expensive kind of wrong.

## 2. Proof figures

`src/lib/proof.ts`, reviewed monthly by you.

- `ticketsSold` is `null` — the season's ticket count has not been pulled from
  the booking records. Null renders nothing; it never renders "0".
- `soldFor` currently lists CamelPhat, Anyma Presents ÆDEN, ANTS and KISS Pool
  Party. Confirm these are all shows we genuinely sold for, and add or remove as
  the season goes.
- `season` and `verified` are the staleness markers. Update `verified` whenever
  you check the file, even if nothing changed.

**Not in that file, on purpose:** the Google rating and review count. Those are
fetched live from the Google Business Profile by `src/lib/google-reviews.ts` and
are never hardcoded. They will start appearing on the pages by themselves once
the profile is verified and `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` are
set. Until then every rating block correctly renders nothing. See section 5.

## 3. Unfinished pages already live

`/[locale]/privacy-policy`, `/[locale]/terms-&-conditions` and `/[locale]/legal`
are **unedited Relume template boilerplate** — "Tagline", "Short heading here",
lorem ipsum and buttons labelled "Button" — in all five languages. They are
served with `noindex`, so they are not in search results, and they have been
removed from the sitemap (a noindexed URL in a sitemap is a contradiction Search
Console flags).

They are still reachable by anyone who clicks a footer link, and a privacy
policy and terms of service are legal documents rather than copy I should
invent. **These need real text from you or your lawyer.** When they are written:
remove the `noindex` and add the routes back to `STATIC_ROUTES` in
`src/app/sitemap.ts` in the same change — the two settings must always move
together.

## 4. Affiliate links

- **Wiber (Awin)** — wired in `src/lib/partners.ts` using the deeplink from your
  Awin creative: `s=4715895&v=124596&q=598784&r=3064911`. The `r` parameter is
  the publisher id that credits us. Awin's creative also ships a `cshow.php`
  impression pixel, which we deliberately do **not** render: it fires for every
  visitor on page load, which is a consent question under GDPR rather than a
  click, and the `cread.php` link tracks the commission on its own.
- **Click&Boat (Impact)** — wired in `src/lib/partners.ts` using the deeplink
  `click-and-boat.pxf.io/c/7702481/3995680/19914`. The account id `7702481`
  matches the Impact universal tracking tag already loaded (consent-gated) in
  `ConsentScripts.tsx`. Impact's `imp.pxf.io` impression pixel and its
  `impactradius-go.com` iframe ad unit are deliberately not rendered — the
  pixel would fire ungated for every visitor beside a tag we consent-gate, and
  an iframe ad is invisible to a crawler that runs no JavaScript.
- **ClubTickets** — `CLUBTICKETS_URL` currently points at the plain
  `clubtickets.com` homepage. If there is an affiliate deeplink with our
  publisher id, send it and it replaces the constant. As it stands, clicks from
  `/en/ibiza-club-tickets` are **not tracked to us**. This is now the only
  untracked partner.

Both are rendered through `<AffiliateLink>`, which hardcodes
`rel="sponsored noopener noreferrer"` and a visible disclosure. Never link to a
partner with a bare `<a>`.

## 5. Environment variables not yet set

| Variable | Effect while unset |
| --- | --- |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | No Google rating anywhere: the Proof and trust blocks render without a rating line, and no AggregateRating markup is emitted. Correct behaviour, but it means the 5.0 rating is invisible on the site. |
| `NEXT_PUBLIC_GOOGLE_BUSINESS_URL` | The Google Business Profile is absent from the Organization `sameAs` list, so search engines are not told the profile and the site are the same business. |
| `NEXT_PUBLIC_CLUBTICKETS_AFFILIATE_URL` | ClubTickets clicks untracked (see section 4). |

## 6. Pages built, awaiting a native check

Both big pillars now exist in all five languages, each written per language
rather than translated:

| Route | en | nl | de | fr | es |
| --- | --- | --- | --- | --- | --- |
| Boat rental | `boat-rental-ibiza` | `boot-huren-ibiza` | `boot-mieten-ibiza` | `location-bateau-ibiza` | `alquiler-barco-ibiza` |
| Car rental | `car-rental-ibiza` | `auto-huren-ibiza` | `mietwagen-ibiza` | `location-voiture-ibiza` | `alquiler-coches-ibiza` |

English-only for now: `jet-ski-rental-ibiza`, `boat-hire-ibiza-no-licence`,
`boat-rental-with-skipper-ibiza`, `car-rental-ibiza-airport`,
`convertible-car-rental-ibiza`, `ibiza-club-tickets`, `ibiza-guestlist`.
`ROUTE_LOCALES` records that accurately, so their hreflang clusters are honest.

## 7. Native review before an indexing push

**This is the blocking item before submitting any of the non-English pages.**

Copy written by an AI in a language you cannot check is the fastest way to make
a brand look foreign in its own market. Every page below needs a native speaker
to read it once — not for accuracy of facts (those are shared across languages
and were written deliberately) but for register: does it sound like a person who
lives here, or like a translation?

| Page | Language | Native review |
| --- | --- | --- |
| `/nl/boot-huren-ibiza` | Dutch | ☐ pending |
| `/nl/auto-huren-ibiza` | Dutch | ☐ pending |
| `/de/boot-mieten-ibiza` | German | ☐ pending |
| `/de/mietwagen-ibiza` | German | ☐ pending |
| `/fr/location-bateau-ibiza` | French | ☐ pending |
| `/fr/location-voiture-ibiza` | French | ☐ pending |
| `/es/alquiler-barco-ibiza` | Spanish | ☐ pending |
| `/es/alquiler-coches-ibiza` | Spanish | ☐ pending |

You can read the Dutch yourself. German, French and Spanish need someone else —
the local team works in all three.

**Only after those boxes are ticked**, submit them:

```bash
node scripts/indexnow-ping.mjs --dry-run --file=docs/new-urls.txt   # inspect
node scripts/indexnow-ping.mjs --file=docs/new-urls.txt             # submit
```

A dry run of the full new-URL set has been done and is clean; the real
submission is deliberately left for you, because the pages have to be deployed
and reviewed first. Pinging a URL that 404s in production is worse than not
pinging at all.
