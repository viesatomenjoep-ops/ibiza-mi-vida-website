# Fase A — Audit van de bestaande codebase

Datum: 2026-09-07 · Branch: `claude/ibiza-mi-vida-adjustments-tap8rv`

Doel van dit document: vaststellen wat er al staat, vóórdat er iets gebouwd wordt.
De master-prompt (`docs/seo/MASTER-PROMPTS.md`) is geschreven vanuit de aanname
dat dit een kale Next.js-site is. Dat is niet zo. Het grootste deel van fase B,
C en G bestaat al, in een vorm die strenger is dan wat de prompt voorschrijft.
Dit document zegt per onderdeel wat er is, en waar het plan botst met regels die
deze repo al met schade heeft geleerd (zie `CLAUDE.md`).

---

## A1 — Routes

App Router, **niet** Pages Router. Alle routes onder `src/app/[locale]/…`,
locales `en · nl · de · es · fr` met `en` als default en `x-default`.

76 `page.tsx`-bestanden. De relevante clusters:

| Cluster | Routes |
|---|---|
| Clubtickets | `/ibiza-club-tickets` (pillar), `/club-tickets`, `/club-tickets/[slug]`, `/club-tickets/[slug]/[eventSlug]`, `/clubs`, `/calendar`, `/this-week`, `/ibiza-in/[month]` |
| Artiesten | `/artists`, `/artists/[slug]` |
| Guestlist / VIP | `/guestlist`, `/package-deals`, `/ibiza-guestlist` (308 → `/guestlist`) |
| Boten | `/boats` (pillar + gids), `/private-boat-charters`, `/private-boat-charters/dossier/[slug]`, `/boat-party`, `/boat-trip(/[slug]/[eventSlug])`, `/boat-charters`, `/boat-hire-ibiza-no-licence`, `/boat-rental-with-skipper-ibiza`, `/click-and-boat-ibiza` |
| Boot-slugs per taal | `/boat-rental-ibiza`, `/boot-huren-ibiza`, `/boot-mieten-ibiza`, `/location-bateau-ibiza`, `/alquiler-barco-ibiza` — **alle vijf 308 → `/boats`** |
| Formentera | `/ferry-formentera(/[slug]/[eventSlug])`, `/shuttle-ferry(/…)` |
| Activiteiten | `/activities(/…)`, `/tours(/…)`, `/water-sports(/…)`, `/activities-calendar`, `/jet-ski-rental-ibiza` |
| Auto | `/car-rental-ibiza` (+ nl/de/fr/es-slugs), `/car-rental-ibiza-airport`, `/convertible-car-rental-ibiza`, `/wiber-car-rental-ibiza` |
| Redactioneel | `/tips`, `/ibiza-tips` (redirect), `/ibiza-prices`, `/ibiza-season`, `/locations`, `/locations/[slug]`, `/beach-clubs`, `/faq`, `/about-us`, `/contact`, `/blog` |
| Overig | `/deals-of-the-day`, `/free-discount-ibiza`, `/restaurants` (404't bewust), `/admin`, `/m` (app-shell), `/legal`, `/privacy-policy`, `/terms-&-conditions` (noindex) |

**Metadata:** elke publieke route heeft `generateMetadata()` of `staticMetadata()`.
Canonical + `alternates.languages` komen centraal uit `buildAlternates()`
(`src/lib/seo.ts`) of `localizedAlternates()` (`src/lib/route-slugs.ts`) —
niemand schrijft ze met de hand. Titels lopen door `fitTitle()` (60 tekens,
inclusief de 16-teken-suffix " | Ibiza mi vida").

**H1:** één per pagina, via `HubHero`. `npm run check:onpage` bewaakt dat.

**JSON-LD:** via `<SchemaMarkup>` (één `<script>`, één `@graph`, `@id`-conventie).

## A2 — Databronnen

| Bron | Waar | Vorm |
|---|---|---|
| ClubTickets (events, venues, artists, dates) | `src/data/clubtickets_{en,nl,de,es,fr}.json` in de repo, gelezen via `src/lib/clubtickets.ts` | statische JSON, ververst met `npm run sync-clubtickets` |
| ClubTickets live | `src/lib/clubtickets-live.ts` | |
| Vloot (theyachtbroker) | `src/data/fleet.ts` (31 boten, echte dagtarieven) + live laag via `/api/fleet-live`, `src/lib/yacht-broker.ts` | statisch + live prijzen per datum |
| Google-reviews | `src/lib/google-reviews.ts` → Google Places API | **live, geen fallback** |
| Supabase | `src/lib/supabase/*`, `src/lib/page-content.ts` | hero-teksten per pagina |
| Prijsstatistiek | `src/lib/price-stats.ts`, `season-stats.ts`, `fleet-stats.ts` | afgeleid uit bovenstaande |

ISR: contentpagina's zetten `export const revalidate = 3600`; sitemap en
`llms.txt` staan op 86400. Er is **geen** `Math.random()`/`Date.now()` in render
(`CLAUDE.md` verbiedt het na een hydration-incident).

⚠️ **Belangrijk voor fase G:** `/api/calendar-events` leest uit Supabase terwijl
de kalenderpagina uit de ClubTickets-JSON leest. Die route is dus géén bron voor
een event-engine.

## A3 — i18n

`next-intl` staat in `package.json`, maar de site draait op een eigen mechanisme:
`src/middleware.ts` (locale-detectie: cookie → Accept-Language → land → `en`),
`src/lib/dictionary.ts` + `src/dictionaries/{en,nl,de,es,fr}.json`, en
`src/lib/seo-pages.ts` voor per-pagina titel/omschrijving in vijf talen.

Nieuwe pagina toevoegen met vertaalde slug: `RouteKey` in
`src/lib/route-slugs.ts` (slug voor **alle vijf**), `ROUTE_LOCALES` alleen de
talen die écht renderen, dan de map onder `src/app/[locale]/<slug>/`, dan
`LOCALIZED_ROUTES` in `src/app/sitemap.ts`.

## A4 — robots, sitemap, middleware, hreflang

| Onderdeel | Status |
|---|---|
| `src/app/robots.ts` | **FOUND.** Eén groep per crawler (robots.txt is niet cumulatief), inclusief `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`, `Google-Extended`, `PerplexityBot`, `Applebot-Extended`, `CCBot`, `meta-externalagent`. Disallow `/api/`, `/admin`, `/*/planner/`, `/preview`, `/draft`. |
| `src/app/sitemap.ts` | **FOUND.** Statische routes + gelokaliseerde routes + venues + events + locations + maandpagina's + artiesten met komende datums. Volledige `alternates.languages` per URL, `&` ge-escaped, `lastModified` uit data. Noindex-pagina's bewust afwezig. |
| `src/middleware.ts` | **FOUND.** Locale-detectie (307 + `Vary`), cross-locale slug-301, host-normalisatie non-www → www (308), `X-Robots-Tag: noindex` op elke niet-canonieke host. |
| hreflang | **FOUND.** `buildAlternates()` / `localizedAlternates()`; `npm run check:hreflang` bewijst symmetrie. |
| `llms.txt` | **FOUND**, en uitgebreider dan de master-prompt voorschrijft — cijfers komen live uit de dataset in plaats van hardgecodeerd. |

## A5 — Organization / WebSite JSON-LD

**FOUND.** `organizationNode()` in `src/components/seo/SchemaMarkup.tsx`:
`@id` = `https://www.ibizamivida.com/#organization`, `sameAs` met alleen
bevestigde profielen (Instagram, TikTok, Google Bedrijfsprofiel via `cid`),
`areaServed` Ibiza/ES, `founder` → `FOUNDER_ID`, telefoon uit env.

`<meta name="keywords">`: **AANWEZIG en verwijderd.** Stond in
`src/app/[locale]/layout.tsx`, site-breed, met veertien termen. Niet alleen
nutteloos (Google negeert hem sinds 2009) maar schadelijk: dezelfde veertien
termen — inclusief 'Pacha' en 'Amnesia' — op alle 76 pagina's vertellen elke
parser dat de hele site over één onderwerp gaat.

## A6 — Venues in de ClubTickets-feed

42 venues, waarvan **15 clubbing**:

`528-ibiza · baloo · bambuku-ibiza · club-chinois-ibiza · eden-ibiza ·
es-paradis · hi-ibiza · ibiza-rocks · lio · o-beach-ibiza · playa-soleil ·
swag · teatro-pereyra · unvrs-ibiza · ushuaia-ibiza`

**Pacha, Amnesia en DC-10 ontbreken volledig** — niet als venue, niet als
event, niet als `type_slug`. Bevestigd met een directe scan van
`src/data/clubtickets_en.json`.

➡️ Gevolg: die drie kunnen **geen** boekknop krijgen. Ze worden guide +
guestlist + WhatsApp-concierge, zonder ticketclaim. Precies wat de master-prompt
voor DC-10 al voorschreef; het geldt ook voor Pacha en Amnesia.

De overige 12 clubbing-venues hebben al een pagina op `/club-tickets/<slug>`
mét live line-up, prijzen en `EventSchema`.

## A7 — Affiliate-links

Alles loopt via `<AffiliateLink>` (`src/components/hub/AffiliateLink.tsx`), dat
`rel="sponsored noopener noreferrer"` plus een zichtbare disclosure hardcodeert.
Partners in `src/lib/partners.ts`: `CLICKANDBOAT_URL`, de Awin/Wiber-deeplink,
en ClubTickets via `src/lib/ct-link.ts`. Awin's `cshow.php`-impressiepixel wordt
bewust niet server-gerenderd.

## A8 — Build & checks

`npm run check:seo` (ssr + schema + hreflang + onpage + fetch op
robots/llms/sitemap) blokkeert PR's via `.github/workflows/seo-check.yml`, met
`scripts/seo-check/baseline.json` als lijst bekende fouten — die lijst mag
alleen krimpen. `npm run check:live` draait na elke productie-deploy.
Er zijn ook `check:fleet` en `check:ai`.

---

## A9 — FOUND / PARTIAL / MISSING per doelpagina

| Doelslug uit de master-prompt | Status | Wat er nu is |
|---|---|---|
| `ibiza-club-tickets` | **FOUND** | Volledige pillar met prijstabel, 8 FAQ, schema |
| `ushuaia-ibiza` | **FOUND** | `/club-tickets/ushuaia-ibiza`, live line-up |
| `hi-ibiza` | **FOUND** | `/club-tickets/hi-ibiza` |
| `unvrs-ibiza` | **FOUND** | `/club-tickets/unvrs-ibiza` |
| `pacha-ibiza` | **MISSING** | Niet in feed → geen route. Te bouwen als guide |
| `amnesia-ibiza` | **MISSING** | Idem |
| `dc10-ibiza` | **MISSING** | Idem, tickets lopen via DICE |
| `private-yacht-ibiza` | **FOUND (andere URL)** | `/private-boat-charters` |
| `ibiza-yacht-charter` | **FOUND (andere URL)** | `/boats` + `/private-boat-charters` |
| `ibiza-boat-rental` | **FOUND (andere URL)** | `/boats` — `/boat-rental-ibiza` is er juist in opgegaan |
| `private-boat-ibiza` | **FOUND (andere URL)** | `/private-boat-charters` |
| `ibiza-formentera-ferry` | **FOUND** | `/ferry-formentera` |
| `formentera-day-trip` | **FOUND** | `/ferry-formentera/[slug]` per operator |
| `ibiza-formentera-private-boat` | **PARTIAL** | Gedekt door `/private-boat-charters`, geen eigen sectie |
| `ibiza-sunset-boat` | **PARTIAL** | Onderdeel van `/boat-trip` en `/boats` |
| `es-vedra-boat-trip` | **PARTIAL** | `src/lib/sailing-routes.ts` kent de route, geen eigen pagina |
| `ibiza-nightlife` | **PARTIAL** | Verdeeld over `/clubs`, `/calendar`, `/tips` |
| `things-to-do-ibiza` | **PARTIAL** | `/activities` + `/tours` |
| `ibiza-vip` | **FOUND (andere URL)** | `/guestlist` + `/package-deals` |
| `ibiza-beach-clubs` | **FOUND** | `/beach-clubs` |
| `ibiza-events` | **FOUND** | `/calendar` (+ `/this-week`, `/ibiza-in/[month]`) |
| `ibiza-guide` | **PARTIAL** | `/tips`, `/ibiza-prices`, `/ibiza-season`, `/locations` |
| `ibiza-jet-ski` | **FOUND** | `/jet-ski-rental-ibiza` |
| `ibiza-car-rental` | **FOUND** | `/car-rental-ibiza` in vijf talen |
| `ibiza-airport-transfer` | **MISSING** | Geen route, geen data |
| `llms.txt` | **FOUND** | `src/app/llms.txt/route.ts`, live cijfers |
| `robots` | **FOUND** | |
| `sitemap` | **FOUND** | |

**Samenvatting: 4 van de 28 doelpagina's ontbreken echt** — `pacha-ibiza`,
`amnesia-ibiza`, `dc10-ibiza`, `ibiza-airport-transfer`. De rest bestaat, meestal
op een andere URL dan de master-prompt aanneemt.

---

## Conflicten tussen de master-prompt en `CLAUDE.md`

Deze staan hier omdat ze de uitvoering van fase E t/m H veranderen. `CLAUDE.md`
is de neerslag van fouten die deze site live gemaakt heeft; die regels wegen
zwaarder dan een plan dat de repo niet kende.

**1. Vier bootpagina's naast `/boats` (E6–E9).** `CLAUDE.md`: *"Bouw geen tweede
pagina over een onderwerp dat al een route heeft alleen voor een keyword-slug."*
`/boat-rental-ibiza` en zijn vier vertalingen zijn in augustus juist opgegáán in
`/boats`, met 308's, omdat twee eigen URL's op dezelfde query elkaars links
splitsen. `private-yacht-ibiza`, `ibiza-yacht-charter`, `ibiza-boat-rental` en
`private-boat-ibiza` zijn vier formuleringen van één zoekintentie en zouden die
consolidatie in één klap terugdraaien. → **Niet bouwen.** De term hoort in de
titel en de lead van `/boats` en `/private-boat-charters`.

**2. Catch-all `app/[locale]/(seo)/[slug]/page.tsx` (C2).** Een catch-all naast
76 bestaande routes is een permanente kans op schaduwing. De repo heeft al een
werkend patroon (`HubSections` + `SchemaMarkup` + `route-slugs.ts`) dat per
route expliciet is. → **Niet bouwen**; nieuwe pagina's volgen het bestaande
patroon.

**3. `AggregateRating` 5.0 / 10 reviews (PROMPT 0 en H3).** `CLAUDE.md`:
reviewcijfers komen *uitsluitend* live uit het Google Bedrijfsprofiel via
`src/lib/google-reviews.ts` — geen prop, geen default, geen fallback. Een
hardgecodeerde `AggregateRating` heeft hier al live gestaan en is een
overtreding van Google's spambeleid. → **Niet hardcoderen.** Het cijfer rendert
zodra `GOOGLE_PLACES_API_KEY` en `GOOGLE_PLACE_ID` in Vercel staan.

**4. `lib/seo/metadata.ts` + `lib/seo/jsonld.ts` (B5, B6).** Bestaat al als
`src/lib/seo.ts` en `src/components/seo/SchemaMarkup.tsx`. Een tweede laag
ernaast is precies de versnippering die `SchemaMarkup` heeft opgeruimd. →
**Niet bouwen**, bestaande helpers gebruiken.

**5. `content/seo/<locale>/<slug>.json` (C1) en `[[TRANSLATE]]`-kopieën (H7).**
De site heeft al twee contentlagen (`seo-pages.ts` voor metadata, Supabase voor
hero-content) plus per-pagina componenten. Een derde laag introduceren voor vier
nieuwe pagina's kost meer dan het oplevert. En `[[TRANSLATE]]`-kopieën in
`nl/de/es/fr` zetten zou 4×4 URL's opleveren die als Engelse duplicaten
renderen. `CLAUDE.md`: *"Voeg een taal pas toe aan `ROUTE_LOCALES` als die
pagina echt rendert."* → Nieuwe pagina's zijn `['en']` tot ze vertaald zijn.

**6. Ferry "from ~€29" (PROMPT 0).** Niet bevestigd tegen de feed. `CLAUDE.md`:
publiceer nooit een prijs die niet bevestigd is. → Als `[[VERIFY]]` in
`NIGHT-REPORT.md`, niet in de copy.

**7. Branch `seo/night-run-1`.** Deze sessie is vastgezet op
`claude/ibiza-mi-vida-adjustments-tap8rv`. Alle werk staat daar.
