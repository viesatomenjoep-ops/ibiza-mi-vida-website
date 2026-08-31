# i18n audit — locales, slugs and the ibizamivida.es question

Status: 31 August 2026.

## 1. How the language setup works now

Five locales, English as the default and as `x-default`:

| Locale | Prefix | Role |
| --- | --- | --- |
| `en` | `/en` | Primary. `x-default` points here. |
| `nl` | `/nl` | Supporting |
| `de` | `/de` | Supporting |
| `es` | `/es` | Supporting |
| `fr` | `/fr` | Supporting |

The bare domain does not redirect to `/nl`. `src/middleware.ts` resolves a
language from, in order: a remembered cookie, `Accept-Language` (parsed with
q-values, so `fr-CA,fr;q=0.9,en;q=0.8` gives French rather than whatever came
first), then country, then English. Language beats country deliberately — a
Dutch speaker holidaying in Spain still gets Dutch.

### Two kinds of route

**Shared-path routes.** Most of the site: `/en/calendar`, `/nl/calendar`, and so
on. Alternates come from `buildAlternates()` in `src/lib/seo.ts`.

**Localised-slug routes.** The keyword pages, where the slug is itself the
keyword and therefore differs per language — `/en/boat-rental-ibiza` versus
`/nl/boot-huren-ibiza`. These are defined in `src/lib/route-slugs.ts`, which is
the single source of truth for four consumers: the page's own hreflang
alternates, the sitemap, the language switcher, and the middleware redirect that
301s a locale landing on another language's slug.

`ROUTE_LOCALES` in that file records which languages each route is actually
published in. Publishing an alternate for a page that does not exist is worse
than publishing none — Google validates a cluster by following it and discards
the whole set when links 404 — so a language is added there only after its page
renders.

### Verification

`npm run check:hreflang` asserts, per route: a self-reference, an `x-default`,
valid language codes, no duplicates, a self-referencing canonical, and full
symmetry (every alternate lists this page back at the same URL). Completeness is
measured against what the sitemap declares for that URL rather than against a
hardcoded list of five, precisely because not every page exists in every
language.

## 2. Does a separate ibizamivida.es site exist?

**Yes — the domain is live and the business treats it as a second property.**

What I could verify from here:

- `ibizamivida.es` resolves in DNS, to `216.150.16.1` and `216.150.16.193`.
  `ibizamivida.com` resolves to `216.150.1.193` and `216.150.16.1` — an
  overlapping address, which points at the same hosting or CDN edge serving
  both.
- The admin panel committed in this repo (`public/admin.html`) references it
  repeatedly and in a way that only makes sense for a live site: a reviews
  tracker described as *"Linked to ibizamivida.com and ibizamivida.es — track,
  reply and monitor all reviews"*, `ibizamivida.es` as a selectable property in
  two dropdowns, its own stat tile, an "Open ↗" link to
  `https://www.ibizamivida.es`, and a separate social handle `@ibizamivida.es`.

What I could **not** verify: this environment has no outbound network access to
either domain (every request returned HTTP 000), so I could not fetch
`ibizamivida.es` to see whether it serves a copy of this site, a different site,
or a redirect. **Confirm that before acting on anything below.** The one-minute
check:

```bash
curl -sI https://www.ibizamivida.es/ | head -5      # 200, or already a 301?
curl -s https://www.ibizamivida.es/ | head -40      # same content as .com?
curl -s https://www.ibizamivida.es/robots.txt
curl -s https://www.ibizamivida.es/sitemap.xml | grep -c "<loc>"
```

## 3. Why this matters

If `.es` serves the same content as `.com`, the two domains compete for the same
queries with the same words. The practical consequences, in order of cost:

1. **Split authority.** Every link, mention and citation that lands on `.es` does
   nothing for `.com`. For a business whose entire SEO case rests on being cited,
   this is the expensive one.
2. **Google picks, not you.** With duplicate content across two domains Google
   selects one as canonical. It frequently picks the one you did not want, and
   there is no dashboard that tells you it happened.
3. **The Spanish trap.** A `.es` domain looks like the obvious home for the
   Spanish version. It is not: `/es/` on the main domain inherits the whole
   domain's authority, while a separate `.es` starts from zero and has to earn
   its own. Spanish speakers are also not only in Spain — Latin America is a
   large part of that audience and a `.es` ccTLD signals Spain specifically.
4. **Doubled work.** Two sitemaps, two Search Console properties, two robots
   files, two sets of schema, and every future change made twice or forgotten
   once.

## 4. Recommendation

**Consolidate onto `www.ibizamivida.com`, with Spanish at `/es/`.** Keep the
`.es` domain registered — do not let it lapse, and do not let it serve content.
Point it at the main site with permanent redirects.

This is a recommendation, not an instruction, and **nothing below has been
executed.** These redirects change live URLs and need your go-ahead.

### Redirects needed

Assuming `.es` currently mirrors `.com`, at the DNS/host level for
`ibizamivida.es`:

| From | To | Status |
| --- | --- | --- |
| `http://ibizamivida.es/*` | `https://www.ibizamivida.com/*` | 301 |
| `https://ibizamivida.es/*` | `https://www.ibizamivida.com/*` | 301 |
| `http://www.ibizamivida.es/*` | `https://www.ibizamivida.com/*` | 301 |
| `https://www.ibizamivida.es/*` | `https://www.ibizamivida.com/*` | 301 |

Rules that matter more than the table:

- **Preserve the path.** `ibizamivida.es/es/clubs` must land on
  `www.ibizamivida.com/es/clubs`, not on the homepage. A redirect that dumps
  every URL on the root throws away the link equity you are consolidating, and
  Google treats a mass redirect-to-homepage as a soft 404.
- **301, not 302.** Only a permanent redirect passes authority.
- **One hop.** `ibizamivida.es/x` → `www.ibizamivida.com/x` directly, not via
  `ibizamivida.com/x` first. Chains lose value and slow crawling.
- **Do not redirect `.es` to `/es/`.** The Spanish domain is not the Spanish
  language. A German visitor with a `.es` link should reach the German page.
- If any `.es` path has no equivalent on `.com`, map it to the closest real page
  rather than 404ing it — or port that content across first.

### Order of operations

1. Confirm what `.es` actually serves (the curl block above).
2. If it has content worth keeping that `.com` lacks, port it first.
3. Add `ibizamivida.es` as a property in Google Search Console, so you can use
   the **Change of Address** tool — this is the step people skip, and it is what
   tells Google the move is deliberate.
4. Put the 301s in place.
5. Submit the `.com` sitemap; leave the `.es` property in Search Console for at
   least 180 days to watch the transfer.
6. Update the `@ibizamivida.es` social profile links to point at `.com`, and add
   the profile to the `sameAs` list in `SchemaMarkup` if it is genuinely ours.

### If .es turns out to serve something different

If it is a separate business, a landing page or a parked domain, none of the
above applies. A parked domain is harmless; a *different* live site sharing the
brand name is a different conversation, and worth having before either grows.

## 5. Open items

- Confirm what `ibizamivida.es` serves (blocking everything in section 4).
- Decide whether `@ibizamivida.es` on social is ours; if so, add it to `sameAs`.
- The DE, FR, ES and NL versions of the two big pillars are not built yet — see
  `docs/content-todos.md`. Until they exist, `ROUTE_LOCALES` correctly lists
  those routes as English-only, and the hreflang clusters are honest about it.
