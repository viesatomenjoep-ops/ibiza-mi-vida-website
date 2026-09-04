# Implementation plan — live API layer for event detail pages

## Goal

Show **fresh prices, sold‑out state and line‑ups** on the event detail pages by calling the
ClubTickets per‑event endpoint at render time, on top of the committed JSON that is only
synced once a day (05:20 UTC, `price-snapshot.yml`).

```
GET {BASE_URL}/venue/{venueId}/event/{eventId}?locale={locale}
```

The endpoint adds two things the nightly JSON does not have:

- `lowestAvailablePrice` — cheapest **currently in‑stock** tier as a number, `null` when the
  date is fully sold out.
- `prices` with sold‑out tiers already removed, `""` when everything is sold out.

Plus fresher `dates[]`, `lineUp`, `startAt`/`endAt` and per‑date `affLink`.

## Non‑goals

- **Not** replacing the committed JSON as the source of truth. It still resolves
  slug → numeric id, drives `generateMetadata`, the sitemap, the calendar and the homepage.
- **Not** a client‑side fetch. Crawlers run no JS and the CLAUDE.md rules forbid
  post‑mount data fetches that shift layout.
- **Not** rescuing an event that is missing from the JSON entirely — it 404s until the next
  sync, same as today.
- **Not** touching `/calendar`, the homepage, the sitemap, or Supabase.
- **Not** overlaying prose (`description`, `requirements`). Those arrive from the API with
  injected CSS/JS that only the sync script's `deepCleanHtml` handles; the JSON copy is
  already cleaned. The live overlay is limited to volatile, low‑markup fields.

## Design

Mirror the established pattern in this repo: `src/lib/yacht-broker.ts` +
`private-boat-charters/page.tsx`.

| Property | Value |
|---|---|
| Where the fetch runs | Server component, in the page, before render |
| Fallback | On any failure → `null` → page renders from JSON exactly as today (no regression) |
| Cache | `next: { revalidate: 900 }`, keyed on the full URL (venueId + eventId + locale) |
| Page revalidate | Lower `club-tickets/[slug]/[eventSlug]/page.tsx` from `3600` → `900`, matching the boats page, so a sold‑out tier surfaces within 15 min |
| Timeout | `AbortSignal.timeout(3500)` — a slow partner must not hang the revalidation render |
| Invented data | Never. No live answer → no live badge, static bands stay |

### Merge semantics

Static JSON = structure (which dates exist, ids, slugs, venue). Live API = overlay.

- Date present in **both** → overlay `prices`, `lowestAvailablePrice`, `lineUp`, `affLink`;
  derive `soldOut = prices === '' && lowestAvailablePrice == null`.
- Date in **JSON only** (live omitted it) → keep static, `live: false`, no badge. Do **not**
  delete it silently; log the count mismatch.
- Date in **live only** and `>= today` → append (a date that went on sale since the sync).
- `live === null` → every date passes through untouched with `live: false`.

## Files to change

### 1. `src/lib/clubtickets.ts` — types + shared key

- Add `lowestAvailablePrice?: number | null` to `CTEventDate`.
- Introduce `CLUBTICKETS_API_KEY` env var; keep the current literal as the documented
  build‑time fallback. Update `API_KEY`/`BASE_URL` to read it. (The sync script
  `scripts/sync-clubtickets.mjs` should read the same env var — one constant, two callers.)

### 2. `src/lib/clubtickets-live.ts` — NEW, the fetch

```ts
import { cache } from 'react'
import { BASE_URL } from './clubtickets'
import { stripHtml } from './html-utils'

const REVALIDATE_SECONDS = 900
const TIMEOUT_MS = 3500

export interface LiveEventDate {
  id: number
  date: string
  lineUp: string
  prices: string                 // "" = all tiers sold out
  lowestAvailablePrice: number | null
  affLink: string
}

export interface LiveEvent {
  id: number
  startAt?: string
  endAt?: string
  dates: LiveEventDate[]
  soldOut: boolean               // every date "" / null
}

function warn(reason: string) {
  console.warn(`[clubtickets-live] live event niet gebruikt: ${reason}`)
  // TODO: Sentry.captureMessage(reason, 'warning') — see yacht-broker.ts, same gap
}

/** null on any failure — never throws, never partial. */
export const getLiveEvent = cache(
  async (venueId: number, eventId: number, locale: string): Promise<LiveEvent | null> => {
    if (!venueId || !eventId) return null
    try {
      const res = await fetch(`${BASE_URL}/venue/${venueId}/event/${eventId}?locale=${locale}`, {
        headers: { accept: 'application/json', 'user-agent': 'ibizamivida.com partner integration' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        next: { revalidate: REVALIDATE_SECONDS, tags: [`ct-event-${eventId}`] },
      })
      if (!res.ok) return warn(`HTTP ${res.status}`), null
      const d = (await res.json())?.data
      if (!d?.id || !Array.isArray(d.dates)) return warn('antwoord zonder data.dates'), null

      const dates: LiveEventDate[] = d.dates
        .filter((x: any) => x?.date)
        .map((x: any) => ({
          id: Number(x.id),
          date: String(x.date).slice(0, 10),
          lineUp: stripHtml(x.lineUp || ''),
          prices: typeof x.prices === 'string' ? x.prices : '',
          lowestAvailablePrice:
            typeof x.lowestAvailablePrice === 'number' ? x.lowestAvailablePrice : null,
          affLink: String(x.affLink || ''),
        }))

      return {
        id: Number(d.id),
        startAt: d.startAt || undefined,
        endAt: d.endAt || undefined,
        dates,
        soldOut: dates.length > 0 && dates.every(x => x.prices === '' && x.lowestAvailablePrice == null),
      }
    } catch (e) {
      return warn(e instanceof Error ? e.message : String(e)), null
    }
  },
)
```

### 3. `src/lib/merge-event-dates.ts` — NEW, pure, unit‑tested

```ts
import type { CTEventDate } from './clubtickets'
import type { LiveEvent } from './clubtickets-live'

export interface MergedEventDate extends CTEventDate {
  lowestAvailablePrice: number | null
  soldOut: boolean
  live: boolean
}

export function mergeEventDates(
  staticDates: CTEventDate[],
  live: LiveEvent | null,
  today: string,
): MergedEventDate[] {
  const base = (d: CTEventDate): MergedEventDate => ({
    ...d,
    lowestAvailablePrice: d.lowestAvailablePrice ?? null,
    soldOut: false,
    live: false,
  })
  if (!live) return staticDates.map(base)

  const liveByDate = new Map(live.dates.map(l => [l.date, l]))
  const merged = staticDates.map(d => {
    const l = liveByDate.get((d.date || '').slice(0, 10))
    if (!l) return base(d)
    return {
      ...base(d),
      prices: l.prices,
      lineUp: l.lineUp || d.lineUp,
      affLink: l.affLink || d.affLink,
      lowestAvailablePrice: l.lowestAvailablePrice,
      soldOut: l.prices === '' && l.lowestAvailablePrice == null,
      live: true,
    }
  })

  const known = new Set(staticDates.map(d => (d.date || '').slice(0, 10)))
  for (const l of live.dates) {
    if (known.has(l.date) || l.date < today) continue
    merged.push({
      id: l.id, name: '', date: l.date, lineUp: l.lineUp, prices: l.prices, affLink: l.affLink,
      lowestAvailablePrice: l.lowestAvailablePrice,
      soldOut: l.prices === '' && l.lowestAvailablePrice == null,
      live: true,
    } as MergedEventDate)
  }
  return merged.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
}
```

### 4. `src/app/[locale]/club-tickets/[slug]/[eventSlug]/page.tsx`

- `export const revalidate = 900` (was `3600`).
- After the two `notFound()` guards, resolve ids and fetch:

```ts
import { getLiveEvent } from '@/lib/clubtickets-live'
import { mergeEventDates } from '@/lib/merge-event-dates'
import { ibizaToday } from '@/lib/date-label'

const venueId = venue.id
const eventId = eventDates[0]?.eventId ?? 0
const live = await getLiveEvent(venueId, eventId, params.locale)
const dates = mergeEventDates(eventDates, live, ibizaToday())

return (
  <EventDetailPage
    eventDates={dates}
    liveTimes={live ? { startAt: live.startAt, endAt: live.endAt } : undefined}
    eventSoldOut={live?.soldOut ?? false}
    eventSlug={params.eventSlug}
    club={venue as any}
    locale={params.locale}
    basePath="club-tickets"
  />
)
```

- `generateMetadata` stays JSON‑only. No second fetch. (Optionally set the OG title suffix to
  `Sold out —` when trivially known, but not worth a fetch.)

### 5. `src/components/templates/EventDetailPage.tsx`

- Accept `liveTimes?: { startAt?: string; endAt?: string }` and `eventSoldOut?: boolean`.
- Prefer `liveTimes.startAt/endAt` over `eventDetail.startAt/endAt` for the Times block and
  for `schemaDates`.
- When `eventSoldOut`, render a "Sold out" state on the hero checkout button
  (`EventCheckoutButton` gets a `disabled`/sold‑out variant) instead of hiding the route.

### 6. `src/components/templates/EventDatePicker.tsx` + `EventTicketSelector.tsx`

- Per tile: if `soldOut`, show a muted "Sold out" chip and disable the Tickets button.
- Else if `lowestAvailablePrice != null`, lead with `From €{lowestAvailablePrice}` and keep
  the `prices` range as the secondary line.
- `PickerDate` / props gain `lowestAvailablePrice: number | null` and `soldOut: boolean`
  (plain serialisable fields — they cross the server→client boundary).

### 7. `src/components/seo/EventSchema.tsx`

- Feed `lowestAvailablePrice` into `offers.price` / `offers.lowPrice` (currency `EUR`).
- When a date is sold out, set that date's `offers.availability` to
  `https://schema.org/SoldOut`; when the whole event is sold out, keep the `Event` but omit
  the `Offer` price rather than publishing `0`. This matches the existing CLAUDE.md rule
  ("nooit een prijs die niet bevestigd is") — a live number *is* confirmed.

### 8. `src/app/api/event-live/[venueId]/[eventId]/route.ts` — NEW, optional probe

Mirror `/api/fleet-live`: `GET` returns `getLiveEvent()` as JSON, `503` on `null`. Not used
by any page; it exists so a human (or `check:event`) can see whether the integration is up,
because the failure is otherwise silent.

### 9. `scripts/event-live-check.mjs` + `package.json` + `.github/workflows/live-health.yml`

- `npm run check:event` — hits the endpoint for one known busy event (e.g. Hï Ibiza), asserts
  `data.dates[].lowestAvailablePrice` is present and numeric, and diffs the live date count
  against `src/data/clubtickets_en.json`. Warn (non‑zero) if live has materially fewer dates.
- Add a step to `live-health.yml` (`if: always()`), next to `check:fleet`.

### 10. `scripts/sync-clubtickets.mjs` — parallel improvement (separate commit)

Map `lowestAvailablePrice` from the API into each date object it writes. This makes the JSON
fallback itself better and keeps the two shapes aligned. Low risk, do it in its own commit.

## Failure handling

| Case | Behaviour |
|---|---|
| API 5xx / timeout / malformed | `getLiveEvent` → `null` → page identical to today |
| `venueId` or `eventId` missing from JSON | live skipped, no call made |
| Live returns fewer dates than JSON | static dates kept, `live:false`; `check:event` warns |
| Live returns a brand‑new date | appended if `>= ibizaToday()` |
| Whole event sold out | route still renders; hero + tiles show sold‑out state; schema omits price |
| Partner rate‑limits us | 900 s Data Cache + 900 s ISR ⇒ ≤ ~1 call/event/locale/region per 15 min |

## Observability

- `warn()` logs today; wire it to `Sentry.captureMessage(_, 'warning')` in the same change,
  and close the identical gap in `yacht-broker.ts` while touching it.
- Track a "live event layer hit %" the same way `check:fleet` reports the brokerKey match %.

## Testing

- **Unit** (`vitest`, new): `mergeEventDates` — both present, JSON‑only date, live‑only future
  date, live‑only past date (dropped), `live === null` passthrough, sold‑out derivation.
- **Unit**: `getLiveEvent` response mapping with a fixture (happy path, `""` prices,
  `null` lowestAvailablePrice, missing `data`).
- **Integration**: `npm run check:event` against production.
- **Manual**: open `/api/event-live/<venueId>/<eventId>`; load an event page with the network
  panel and confirm the price in the HTML matches clubtickets.com.
- **Regression**: with `CLUBTICKETS_API_KEY` unset / endpoint blocked, every event page must
  still render from JSON (this is the CI build condition today).

## Rollout

1. Ship steps 1–5 + 7 behind `club-tickets` only. Verify on staging + `check:live`.
2. Apply the same `getLiveEvent` + `mergeEventDates` wiring to the sibling category routes
   (`activities/[slug]/[eventSlug]`, `boat-trip/…`, `ferry-formentera/…`) — the endpoint and
   lib are type‑agnostic, only each `page.tsx` needs the four added lines.
3. Steps 8–10 (probe route, check script, sync improvement) can land in parallel.

## Execution order (step by step)

Each phase is one commit / small PR, independently safe to ship. Every phase after 1 leaves
the site fully working even if the live layer is disabled.

### Phase 0 — de‑risk (no repo changes yet)

1. From a terminal, hit the endpoint for a known busy event in **all five locales**, e.g.
   `curl 'https://affiliates.clubtickets.com/api/affiliate/<key>/get/venue/<id>/event/<id>?locale=en'`.
   Pick the ids out of `src/data/clubtickets_en.json` (`venues[].id`, `venues[].events[].id`).
2. Confirm: `data.dates[].lowestAvailablePrice` is present and numeric; a sold‑out date shows
   `prices: ""` + `lowestAvailablePrice: null`; currency is EUR everywhere.
3. Save two responses as fixtures under `src/lib/__fixtures__/` (one normal, one with a
   sold‑out date). These drive the unit tests.
4. Decide the three open questions at the bottom of this doc (revalidate number, currency,
   dev behaviour). Default: `900`, EUR, live layer active in all environments.

### Phase 1 — types + shared key (no behaviour change) — DONE (code), verify pending

5. ✅ `src/lib/clubtickets.ts`: `lowestAvailablePrice?: number | null` added to `CTEventDate`.
6. ✅ `API_KEY` in `src/lib/clubtickets.ts` and `scripts/sync-clubtickets.mjs` now read
   `process.env.CLUBTICKETS_API_KEY || '<literal>'`; `.env.example` documents it (commented,
   optional — both call sites fall back to the literal). `price-snapshot.yml` sets no env, so
   it keeps using the literal — no behaviour change.
7. **Verify (run locally — Bash was unavailable in the implementing session):**
   `npm run build` && `npm run lint`.
8. **Commit:** `chore: CLUBTICKETS_API_KEY env var + lowestAvailablePrice type`

### Phase 2 — test runner — DONE (code), verify pending

9. ✅ `package.json`: added `vitest` + `@vitest/coverage-v8` (`^3.2.0`) to devDeps and the
   `test` / `test:watch` / `test:coverage` scripts. New `vitest.config.ts` — node env,
   `@/` alias mirrored from tsconfig, `include: src/**/*.{test,spec}.ts`, v8 coverage scoped
   to `src/lib`. One smoke test `src/lib/html-utils.test.ts` (proves alias + TS + runner;
   real tests land in Phase 3/4). No `passWithNoTests` — an empty run should still fail.
   Test files sit inside the existing `tsconfig` `include` glob, so `next build` type-checks
   them too; keep deps installed. To take tests out of the prod typecheck later, add
   `**/*.test.ts` to `tsconfig` `exclude`.
10. **Verify (run locally):** `npm install` then `npm test` (1 file, 4 assertions) and
    `npm run build`.
11. **Commit:** `chore: add vitest`

### Phase 3 — fetch lib (isolated, unused) — DONE (code), verify pending

12. ✅ `src/lib/clubtickets-live.ts` — `getLiveEvent(venueId, eventId, locale)`, `LiveEvent`,
    `LiveEventDate`. Mirrors `yacht-broker.ts`: `AbortSignal.timeout(3500)`,
    `next: { revalidate: 900, tags: ['ct-event-<id>'] }`, `null` on every failure, `warn()`
    log. `lineUp` run through `stripHtml`. **Deviation from the sketch:** no `React.cache`
    wrapper — matches `getLiveFleet`, and Next already memoises identical `fetch` calls per
    render.
13. ✅ `src/lib/clubtickets-live.test.ts` — 9 cases: normal mapping (uses the real Phase 0
    fixture), sold-out date, all-dates-sold-out → `soldOut`, datetime→`YYYY-MM-DD`, no `data`,
    `data` without `dates`, HTTP 500, fetch reject/timeout, missing ids skip the call. `fetch`
    stubbed via `vi.stubGlobal`.
14. **Verify (run locally):** `npm test` green. Nothing imports `clubtickets-live` yet except
    its test (new file, wired in Phase 5).
15. **Commit:** `feat: clubtickets-live getLiveEvent (unwired)`

### Phase 4 — merge (pure, unused) — DONE (code), verify pending

16. ✅ `src/lib/merge-event-dates.ts` — `mergeEventDates(staticDates, live, today)` +
    `MergedEventDate` (`extends CTEventDate` with non-optional `lowestAvailablePrice`, plus
    `soldOut` and `live`). Zero runtime imports, never mutates input. `today` compared as a
    string; a live-only date exactly on `today` is kept (`< today` is the drop test).
17. ✅ `src/lib/merge-event-dates.test.ts` — 12 cases: overlay onto a match, JSON-only
    passthrough, live-only future appended, live-only == today kept, live-only past dropped,
    `live === null` passthrough + sort, `soldOut` derivation, sort with static+appended
    interleaved, CT fields (`eventCover`/`venueSlug`/`eventId`) preserved, empty live line-up
    falls back to static, input not mutated.
18. **Verify (run locally):** `npm test` green.
19. **Commit:** `feat: mergeEventDates (unwired)`

### Phase 5 — wire the club‑tickets page — DONE (code), verify pending

20. ✅ `club-tickets/[slug]/[eventSlug]/page.tsx`: `revalidate` 3600 → 900; after the
    `notFound()` guards, `eventId = eventDates[0]?.eventId ?? 0`,
    `live = await getLiveEvent(venue.id, eventId, locale)`,
    `dates = mergeEventDates(eventDates, live, ibizaToday())`; passes `eventDates={dates}`
    (cast dropped), `liveTimes`, `eventSoldOut`.
21. ✅ `EventDetailPage.tsx`: `eventDates` prop retyped `MergedEventDate[]`; new optional
    `liveTimes` / `eventSoldOut`; `startAt`/`endAt` now `liveTimes?.x || eventDetail?.x`
    (also feeds `schemaDates`); `soldOutLabel` (5 locales) passed to the hero checkout;
    picker `dates` map carries `lowestAvailablePrice` + `soldOut`; `PICKER_I18N` gains
    `from` / `soldOut` for all 5 locales.
22. ✅ `EventDatePicker.tsx`: `PickerDate` gains `lowestAvailablePrice?` / `soldOut?`;
    `PickerLabels` gains optional `from?` / `soldOut?` (optional + English fallback, so a
    second caller can't break). Render order: sold-out chip → `From €{n}` (+ range as
    subline) → price string → "Available". `EventTicketSelector` gets `soldOut`.
23. ✅ `EventTicketSelector.tsx`: `soldOut?` prop — `disabled`, dimmed, click guarded.
    `EventCheckoutButton.tsx`: `soldOut?` / `soldOutLabel?` — renders a visible disabled
    `<span>` (not `null`) when sold out.
24. **Verify (run locally):**
    - `npm run build` + `npm test` + `npm run check:seo`;
    - load a club event page — live prices in the HTML, matching clubtickets.com;
    - set `CLUBTICKETS_API_KEY=nope` (or offline) → page identical to `master`, no console
      errors. `mergeEventDates` passing `live: null` through is the regression guard.
    - sibling category pages (`activities` etc.) still pass `eventDates as any` → compile and
      render unchanged; real wiring is Phase 9.
25. **Commit:** `feat: live prices + sold-out state on club-tickets event pages`

### Phase 6 — schema — DONE (code), verify pending

26. ✅ `src/components/seo/EventSchema.tsx`: `EventDate` gains `lowestAvailablePrice?` /
    `soldOut?`. Price source is now `lowestAvailablePrice` (live, confirmed integer) first,
    then the existing regex parse of the `prices` string as fallback. `offers.availability`
    is `SoldOut` when `d.soldOut`, else `InStock`. `offers` is still emitted **only when a
    price exists** — never `price: 0`.
    `EventDetailPage.tsx` `schemaDates` now carries `lowestAvailablePrice` + `soldOut`.
    **Nuance:** after `mergeEventDates`, a live-sold-out date has `prices: ''` and
    `lowestAvailablePrice: null`, so it produces **no `offers`** (the date still emits as an
    `Event`). That satisfies "omit the Offer when sold out". The `SoldOut` availability
    branch is wired and forward-safe but only fires if a price ever coexists with `soldOut`.
    Kept a single `Offer` (not `AggregateOffer`/`lowPrice`) — smaller change, Google accepts
    it, `check:schema` already validates that shape.
27. **Verify (run locally):** `npm run check:schema`; Rich Results Test on a live club URL;
    with `CLUBTICKETS_API_KEY=nope` the emitted JSON-LD is byte-identical to `master`.
28. **Commit:** `feat: live price + availability in EventSchema`

### Phase 7 — observability — DONE (code), verify pending

29. ✅ `clubtickets-live.ts` `warn()` and `yacht-broker.ts` `waarschuw()` now also fire
    `Sentry.captureMessage(..., 'warning')` via a **fire-and-forget `void import('@sentry/nextjs')`**
    — no top-level import (keeps the vitest module load clean) and it can never throw into
    the fallback path. `clubtickets-live.test.ts` gains `vi.mock('@sentry/nextjs', …)`.
30. **Verify (run locally):** `npm test`; with a DSN set, force a failure and confirm the
    event lands in Sentry.
31. **Commit:** `chore: report live-layer degradation to Sentry`

### Phase 8 — probe + check + CI — DONE (code), verify pending

32. ✅ `src/app/api/event-live/[venueId]/[eventId]/route.ts` — `revalidate = 900`, optional
    `?locale=`, JSON on success, `503` on `null`, `400` on non-numeric ids.
33. ✅ `scripts/event-live-check.mjs` + `"check:event"` in `package.json`. Bare node, no
    deps. Picks the clubbing event with the most future dates from `clubtickets_en.json`
    (override with `CHECK_EVENT="venueId/eventId"`), fetches the same endpoint as
    `clubtickets-live.ts`, and exits non-zero on: unreachable / non-OK, zero dates, the
    `lowestAvailablePrice` field gone from every date, or live dates < 50% of the JSON count.
    A partial `lowestAvailablePrice` gap is a warning, not a failure.
34. ✅ `.github/workflows/live-health.yml`: `check:event` step added with `if: always()`
    after `check:fleet`.
35. **Verify (run locally / CI):** `npm run check:event`; open
    `/api/event-live/319/1901` in a browser (from the sandbox both 403 on the proxy — expected).
36. **Commit:** `test: check:event live-health probe`

### Phase 9 — roll out to the other event-detail routes — DONE (code), verify pending

37. ✅ Wired the same four additions (imports, `revalidate` 900, `getLiveEvent` + `mergeEventDates`,
    the three props) into **every** `[slug]/[eventSlug]` route that renders `<EventDetailPage>`:
    `activities`, `boat-trip`, `ferry-formentera`, `tours`, `water-sports` (plus `club-tickets`
    from Phase 5). Non-clubbing events: if the endpoint 404s or returns a different shape,
    `getLiveEvent` → `null` → merge passes JSON through → no regression.
    **Confirm nothing was missed:** `grep -rl EventDetailPage src/app` should list exactly
    those six.
38. **Verify (run locally):** one event per category renders; `CLUBTICKETS_API_KEY=nope`
    leaves them identical to `master`.
39. **Commit:** `feat: live prices on all event-detail routes`

### Phase 10 — nightly sync improvement (independent) — DONE (code), verify pending

40. ✅ `scripts/sync-clubtickets.mjs`: explicit
    `lowestAvailablePrice: typeof d.lowestAvailablePrice === 'number' ? d.lowestAvailablePrice : null`
    on each written date (the `...d` spread already carried it; this normalises `undefined`
    → `null` and documents intent).
41. **Verify:** run `npm run sync-clubtickets` locally — the JSON diff is the new field on
    ~2.7k dates × 5 locales (large but expected). Commit the regenerated JSON separately.
42. **Commit:** `feat: capture lowestAvailablePrice in nightly sync` (code); the regenerated
    JSON lands on its own via the `price-snapshot.yml` cron or a manual run.

### Phase 11 — final acceptance (verification only)

43. On staging: `npm run build`, `npm test`, `npm run check:seo`, `npm run check:schema`,
    `npm run check:live`, `npm run check:event` all green.
44. Cross-check three live event prices against clubtickets.com.
45. Open a fully sold-out event (or force one): route renders, hero + tiles show sold-out,
    JSON-LD has no `Offer` for those dates and never `price: 0`.
46. Cold-start an event URL; first render fast, 3.5 s timeout as the ceiling.
47. `CLUBTICKETS_API_KEY=nope` build → event pages + JSON-LD byte-identical to `master`.
48. With a Sentry DSN, confirm a forced degradation reaches Sentry as a `warning`.

## Phase 0 — findings (completed 2026-09-04)

Probed venue `319` ([UNVRS]) events `1901` / `1903` / `1911` / `1975` in `en` and `es`
(via browser — the affiliate API is reachable, contrary to the `check:fleet` proxy note).

Confirmed:

- Endpoint live at `https://affiliates.clubtickets.com/...` — same host as `BASE_URL`.
- Envelope is `{ "locale", "data": {...} }` exactly as documented.
- `data.dates[].lowestAvailablePrice` is present and numeric (`85` / `70` / `50`).
- Currency is **EUR** in every locale; `prices` renders as `"85 € - 250 €"`. No currency param.
- `data.dates[]`: `id`, `date` (`YYYY-MM-DD`), `name` (usually `""`), `lineUp` (HTML),
  `prices`, `lowestAvailablePrice`, `affLink`.
- Event level carries `startAt` / `endAt` / `endIsDefined` / `startAtNextDay` /
  `endAtNextDay`, `type.slug`, `venue.{id,slug}`.

Gotchas folded into the plan:

- The `apiEndpoint` string **inside** responses points at `admin.clubtickets.com`. Ignore
  it — keep `BASE_URL` on `affiliates.`.
- `lineUp` is `<p>…</p>` HTML → must go through `stripHtml` in `getLiveEvent`.
- Per-date `affLink` already has `?aff=CT219` (and an `/es/` segment for non-`en`) → pass it
  straight through the merge; `ctLink()` still wraps it at click time.
- **Sold-out shape not seen live** (4 events, 14 date rows, all available). Code treats
  `!prices && lowestAvailablePrice == null` as sold out per ClubTickets' docs; `check:event`
  logs the first real one it sees so we can add a true fixture.

Fixtures written to `src/lib/__fixtures__/`:

- `clubtickets-event-1901.json` — real elrow response (dates verbatim, prose truncated).
- `clubtickets-event-soldout.synthetic.json` — synthetic, one sold-out + one live date.
- `README.md` — provenance.

Open questions — **decided**:

| Question | Decision |
|---|---|
| Page + fetch `revalidate` | **900 s**, matching the boats page. Raise both to 1800 only if the partner pushes back. |
| Currency | Hardcode **`EUR`** in `EventSchema`. Verified across locales. |
| Live layer in dev / CI | **Active in all environments.** The fetch has a 3.5 s timeout and returns `null` on failure, and the CI build has no network → it simply renders from JSON, which is the regression baseline anyway. |

## Risks / open questions

- **More partner calls.** Dropping the page `revalidate` to 900 quadruples revalidation
  frequency. If the affiliate API pushes back, raise both numbers to 1800 — the freshness
  target is "within a click of correct", not real‑time.
- **`lowestAvailablePrice` currency.** Docs imply EUR; confirm there is no per‑locale
  currency before feeding it into schema.
- **Date `id` stability.** Merge keys on the `date` string, not `id`, because the JSON date
  `id` and the live date `id` are assumed equal but not guaranteed. Keying on `date` is safe
  for a single event.
- **`name` on live‑only appended dates** is empty; `EventDatePicker` already falls back to
  `eventName`, so acceptable.
