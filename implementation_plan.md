# Implementation plan — live‑reconcile the dates on an event detail page

## Status — implemented (not yet verified by tooling)

Done:

- `src/lib/clubtickets-live.ts` — added `reconcileEventDates()` + `ReconciledEventDates`,
  `iso10()` helper; imported `type CTEventDate`. **Removed `liveVoorEvent()`** (only the
  7 routes below imported it).
- All 7 event routes migrated (`club-tickets`, `activities`, `boat-trip`,
  `ferry-formentera`, `shuttle-ferry`, `tours`, `water-sports`): `eventDates` →
  `snapshotDates` for the `notFound()` guard, `liveVoorEvent` → `reconcileEventDates`,
  `gekozenDatum` → `requestedDate`, `live={live}` → `live={banner}`.

Not needed after inspection:

- `EventDetailPage.tsx` — **no change.** `EventCheckoutButton` already returns `null` on
  empty `affLink`; `EventSchema` already returns `null` on empty `dates`;
  `EventDatePicker` already renders its `noDates` panel. Every `eventDates[0]` / `d0` /
  `gekozen` access is already optional‑chained, and `eventName` falls back to
  `eventDetail?.name`.
- `EventCheckoutButton.tsx` — no change (guard already present, line 83).

Still to do:

- Run `npm run check:seo` + `tsc` + `lint` — **could not run here** (shell is
  non‑functional this session; every Bash call hangs).
- Test `reconcileEventDates` against a stubbed `getLiveEventDates` (see Testing). The
  affiliate API 403s from this sandbox.
- Optional: grep `docs/` for prose references to `liveVoorEvent` and update.
- Decide the two open questions below (current code: sold‑out dates stay visible; extra
  live dates are logged, not shown).


## Goal

When someone opens an event detail page:

1. **Fetch the currently possible dates** for that event from ClubTickets (not just the
   bundled snapshot).
2. If the `?date=YYYY-MM-DD` in the URL points to a date that is **no longer in the live
   agenda**, keep showing the "not available" banner for that date.
3. Still render **the other dates that are live‑available** in the date picker / list /
   schema — not the stale snapshot list.

All of this must degrade to today's behaviour when the live call fails (timeout, HTTP
error, bad JSON): show the snapshot dates, no banner.

## Current behaviour (what exists today)

| Concern | Where | Behaviour |
| --- | --- | --- |
| Which dates render | `src/app/[locale]/<section>/[slug]/[eventSlug]/page.tsx` → `getAllDates()` filtered by `venueSlug` + `eventSlug` | Purely the local JSON snapshot (`src/data/clubtickets_*.json`), date‑filtered `>= ibizaTonight()`. Refreshed ~3×/day by the sync script. |
| Live check | `src/lib/clubtickets-live.ts` → `liveVoorEvent()` | Fetches `…/venue/{venueId}/event/{eventId}` (2.5 s timeout, `revalidate: 60`), computes a **status for one night only** (the `?date=` night, else `eventDates[0]`), and returns it **only** for `soldout` / `notonsale` / `gone` — `available` / `unknown` become `undefined`. The full live array is discarded. |
| Banner | `src/components/templates/EventDetailPage.tsx` (`MELDING`, `meldingTekst`) | Renders for `live.status` ∈ {`soldout`,`notonsale`,`gone`}. |
| Picker list | `EventDetailPage` → `EventDatePicker` | Receives **all** snapshot `eventDates`; filters only `d.date >= tonightStr`. Live availability never prunes it. |
| Schema | `EventSchema` in `EventDetailPage` | Emits every snapshot date; `soldOutDates` = the one selected night if `soldout`. |
| 404 guard | each `page.tsx` | `notFound()` when the snapshot has no matching venue or zero matching dates. |

### Consequences we want to fix

- A date that ClubTickets dropped after the last sync still shows in the picker (only the
  single selected night gets a `gone` banner).
- The `gone` banner is computed against `gekozen` (`?date=` night **or** the
  `eventDates[0]` fallback), not strictly against the URL's `date=` value — so a `?date=`
  pointing at a date missing from the snapshot never drives the banner.

## Desired behaviour (target)

Given the live array `L` (or `null` on failure) and the snapshot rows `S`:

| Situation | Picker / schema dates | Banner |
| --- | --- | --- |
| `L === null` (call failed) | `S` unchanged | none (`unknown`) |
| `?date=` present, in `L` and sellable | `S ∩ L` | none |
| `?date=` present, **absent from `L`** | `S ∩ L` (the other dates) | `gone` |
| `?date=` present, in `L` but no price / `lowestAvailablePrice === null`; snapshot had a price | `S ∩ L` | `soldout` |
| …same but snapshot never had a price | `S ∩ L` | `notonsale` |
| no `?date=` | `S ∩ L` | banner only if the **next** live date is `soldout`/`notonsale` (unchanged from today) |
| `S ∩ L` empty (every snapshot date gone) | empty → picker shows its `noDates` state | `gone` if `?date=` was set, else none |

Notes / decisions:

- **`S ∩ L` = snapshot rows whose date is present in the live array.** We keep the
  snapshot row as the base because live rows carry only `date` / `prices` /
  `lowestAvailablePrice` — no `affLink`, `lineUp`, `id`, `eventName`. Prices are
  **refreshed** from the live row when it has a non‑empty value.
- **Sold‑out dates stay in the list** (consistent with today's "de knop blijft altijd
  staan" rule in `EventDetailPage`). Only `gone` dates — absent from the live agenda —
  are removed. If we later want sold‑out dates hidden too, that is a one‑line change in
  the reconciler (see "Open questions").
- **Live dates not in the snapshot are ignored** (logged as a warning). ClubTickets
  between syncs almost always *removes* dates; adding one back would need an `affLink`
  we don't have. Out of scope; noted as a stretch goal.
- Never `notFound()` on an empty `S ∩ L`. The snapshot matched, so the URL is real —
  render the page with the banner and the picker's empty state.

## Design

### New helper: `reconcileEventDates()` in `src/lib/clubtickets-live.ts`

Lift the live fetch out of `liveVoorEvent()` so the full array is usable, and return
both the reconciled list and the selected‑night status in one call.

```ts
export interface ReconciledEventDates {
  /** Snapshot rows still present in the live agenda, prices refreshed from live. */
  dates: CTEventDate[]
  /** Status of the URL ?date= night (or the next live date when no param). */
  selected: { status: EventStatus; price: string | null }
  /** true = the live feed answered; false = we fell back to the snapshot. */
  live: boolean
}

export async function reconcileEventDates(
  snapshotDates: CTEventDate[],
  requestedDate: string | undefined,
  locale: string,
): Promise<ReconciledEventDates>
```

Algorithm:

1. `anchor = snapshotDates.find(d => d.venueId && d.eventId) ?? snapshotDates[0]`.
   If it has no `venueId`/`eventId` → `return { dates: snapshotDates, selected: { status: 'unknown', price: null }, live: false }`.
2. `live = await getLiveEventDates(anchor.venueId, anchor.eventId, locale)` (unchanged
   function). If `null` → same fallback return as step 1, `live: false`.
3. `liveByDate = new Map(live.map(d => [d.date, d]))`.
4. `dates = snapshotDates`
     `.filter(d => liveByDate.has(iso(d.date)))`
     `.map(d => ({ ...d, prices: liveByDate.get(iso(d.date))!.prices.trim() || d.prices }))`
   where `iso(x) = String(x || '').slice(0, 10)`.
5. Log once when `live.length` has dates not in the snapshot (`console.warn('[reconcile] live has N dates not in snapshot for event …')`) — visibility only, no behaviour change.
6. Selected‑night status:
   - `target = requestedDate ?? iso(dates[0]?.date ?? snapshotDates[0]?.date)`
   - `snapPrice = snapshotDates.find(d => iso(d.date) === target)?.prices`
   - `selected = liveStatus(live, target, snapPrice)` (existing function — returns
     `gone` when `target` is not in `live`).
7. `return { dates, selected, live: true }`.

`liveStatus()` and `getLiveEventDates()` are unchanged. `liveVoorEvent()` is **removed**
(its only callers are the event routes, all migrated below) — or kept as a thin wrapper
around `reconcileEventDates().selected` if we want a smaller diff; prefer removal to
avoid two code paths.

### Page component change (each event route)

Current tail of `EventPage()`:

```ts
const eventDates = allDates.filter(d => d.venueSlug === venue.slug && d.eventSlug === params.eventSlug)
if (eventDates.length === 0) notFound()
const gekozenDatum = dateParam(searchParams)
const live = await liveVoorEvent(eventDates as any, gekozenDatum, params.locale)
```

Becomes:

```ts
const snapshotDates = allDates.filter(d => d.venueSlug === venue.slug && d.eventSlug === params.eventSlug)
if (snapshotDates.length === 0) notFound()

const requestedDate = dateParam(searchParams)
const { dates: eventDates, selected } = await reconcileEventDates(snapshotDates, requestedDate, params.locale)

// Same rule as before: only soldout / notonsale / gone are worth a banner.
const banner = selected.status === 'available' || selected.status === 'unknown' ? undefined : selected
```

`<EventDetailPage>` props: `eventDates={eventDates}`, `selectedDate={requestedDate}`,
`live={banner}` — unchanged prop names, so the template only needs the empty‑list
handling below.

### `EventDetailPage.tsx` changes

- `gekozen` selection (line ~267) is unchanged — it already does
  `selectedDate` match `|| eventDates[0]`, now against the reconciled list.
- **Empty reconciled list** (`eventDates.length === 0`, every snapshot date gone):
  - `eventName` — already falls back to `eventDetail?.name` (from `club.events`); no
    change needed, but assert it never reads `eventDates[0]` unguarded. `d0` becomes
    `eventDates[0] as any | undefined`; every `d0?.…` access is already optional.
  - `checkoutAff` — resolves to `''`; pass through to `EventCheckoutButton`, which must
    render nothing (or a disabled state) when `affLink` is falsy. Add that guard in
    `EventCheckoutButton` if missing.
  - `<EventSchema>` — **only render when `schemaDates.length > 0`.** An `Event` node with
    no `startDate` is invalid structured data. Wrap the element in that guard.
  - The banner block already renders independently of the list, so the `gone` banner
    shows above an empty picker with no extra work.
  - `EventDatePicker` already renders its `L.noDates` panel when `upcoming` is empty —
    passing `[]` is safe.
- `schemaDates` / `gallery` / `lineupDates` now derive from the reconciled list — desired
  (gone dates drop out of schema automatically).

### `EventDatePicker.tsx` changes

None required. It receives fewer rows; its internal `d.date >= todayStr` filter is a
harmless second pass. When `initialDay` (the `?date=` value) is not in the list, the
existing guard

```ts
initialDay && upcoming.some(d => d.date === initialDay) ? initialDay : null
```

already leaves `activeDay = null`, so the picker opens on the week view and shows the
remaining available dates — exactly the requested "show the other available dates".

## Files to change

| File | Change |
| --- | --- |
| `src/lib/clubtickets-live.ts` | Add `reconcileEventDates()` + `ReconciledEventDates`. Remove `liveVoorEvent()` (or reduce to a wrapper). Keep `getLiveEventDates`, `liveStatus`, types. |
| `src/app/[locale]/club-tickets/[slug]/[eventSlug]/page.tsx` | Swap `liveVoorEvent` → `reconcileEventDates`; rename `eventDates`→`snapshotDates` for the guard; derive `banner`. |
| `src/app/[locale]/activities/[slug]/[eventSlug]/page.tsx` | Same. |
| `src/app/[locale]/boat-trip/[slug]/[eventSlug]/page.tsx` | Same. |
| `src/app/[locale]/ferry-formentera/[slug]/[eventSlug]/page.tsx` | Same. |
| `src/app/[locale]/shuttle-ferry/[slug]/[eventSlug]/page.tsx` | Same *(verify it exists / uses the template)*. |
| `src/app/[locale]/tours/[slug]/[eventSlug]/page.tsx` | Same *(verify)*. |
| `src/app/[locale]/water-sports/[slug]/[eventSlug]/page.tsx` | Same *(verify)*. |
| `src/components/templates/EventDetailPage.tsx` | Guard `<EventSchema>` on `schemaDates.length > 0`; make `d0` optional; tolerate empty `eventDates`. |
| `src/components/templates/EventCheckoutButton.tsx` | Render nothing / disabled when `affLink` is falsy (if not already). |

> **Step 0 — confirm the route list.** The `EventDetailPage` header comment names seven
> page types (clubavonden, boottochten, ferry's, shuttle, tours, activiteiten,
> watersport). Grep to be sure before editing:
> `grep -rl "EventDetailPage" src/app` and `grep -rn "liveVoorEvent" src`.
> Every file that renders `<EventDetailPage>` and currently calls `liveVoorEvent` gets
> the identical page‑tail change. Consider extracting the shared tail into
> `loadEventDetail({ locale, venueSlug, eventSlug, venueType, requestedDate })` in
> `src/lib/event-detail-data.ts` so the seven copies cannot drift (the codebase has been
> bitten by duplicated mappers before). Optional but recommended.

## Caching / revalidation

- `getLiveEventDates` uses `fetch(…, { next: { revalidate: 60 } })`. Because that fetch
  is now on the render path for the **visible list** (not just a throw‑away status), the
  route segment's effective revalidate drops to 60 s even though
  `export const revalidate = 3600` stays. That is the behaviour we want: a `gone` date
  disappears from the picker within ~a minute, not an hour. Leave `revalidate = 3600` as
  the ceiling; do **not** switch to `dynamic = 'force-dynamic'`.
- `getGoogleReviews()` keeps its own 6 h cache key — unaffected.
- The 2.5 s `AbortSignal.timeout` is the hard cap on added latency; on timeout we fall
  back to the snapshot list, same as a `null` response.

## Edge cases checklist

- [ ] Live call fails → snapshot list, no banner (`unknown`).
- [ ] `?date=` valid + live‑available → all live dates, no banner.
- [ ] `?date=` in snapshot, absent from live → `gone` banner + other live dates shown.
- [ ] `?date=` **not** in snapshot (stale/hand‑edited link), absent from live → `gone`
      banner; picker shows the week view of remaining dates (no 404, no crash).
- [ ] `?date=` present in live but sold out → `soldout`/`notonsale` banner, date still
      listed.
- [ ] No `?date=` at all → no spurious banner unless the next live date is
      sold out (unchanged).
- [ ] Every snapshot date gone from live → picker `noDates` panel; `gone` banner iff
      `?date=` was set; `<EventSchema>` not rendered; checkout button hidden/disabled.
- [ ] Live prices differ from snapshot → picker rows show the live price.
- [ ] `generateMetadata` still uses the snapshot only → canonical stays the bare URL,
      title unchanged. (No change.)
- [ ] Non‑UTC server → all date compares are `YYYY-MM-DD` string compares (`iso()` slice);
      no `Date` math introduced.

## Testing

- `npm run check:seo` — ssr / schema / hreflang / onpage must stay green;
  `scripts/seo-check/baseline.json` must not grow.
- `npm run check:live` — the post‑deploy live health check; run after deploy, not from
  the sandbox (it 403s here — network policy, not the site).
- Local: the ClubTickets affiliate API is unreachable from this sandbox (403). Test
  `reconcileEventDates` by temporarily pointing `ENDPOINT`/`BASE_URL` usage in
  `getLiveEventDates` at a local stub that returns a crafted `data.dates` array:
  - one run where the stub omits the `?date=` day → expect `gone` + shorter list;
  - one run where the stub returns `[]` → expect empty list + `gone` banner + no schema;
  - one run where the stub 500s / times out → expect the snapshot list unchanged.
- Manual matrix on a recurring club night (many dates) and a single‑date activity.

## Rollout

1. Add `reconcileEventDates` + tests/stub; keep `liveVoorEvent` temporarily.
2. Migrate `club-tickets` route; verify locally with the stub.
3. Migrate the remaining six routes (or land the shared `loadEventDetail` helper first).
4. `EventDetailPage` empty‑list + schema guard.
5. Remove `liveVoorEvent`.
6. `npm run check:seo`; open the PR; `npm run check:live` after the preview deploy.

## Risks

- **Seven near‑identical edits** — mitigate with the shared `loadEventDetail` helper.
- **Empty‑list render path in `EventDetailPage`** is the main new surface; the
  `<EventSchema>` guard and the checkout‑button guard are the two must‑nots.
- **More pages fall back to `unknown`** if the live API is flaky — acceptable, matches
  today's failure mode, and is logged by `getLiveEventDates`.
- **Effective 60 s revalidate** raises origin traffic to the affiliate API a little;
  bounded by the 60 s cache and the existing 2.5 s timeout.

## Open questions

1. Should sold‑out dates also be **hidden** from the picker (stricter reading of "show
   the other available dates"), or stay visible with an empty price like today?
   Default in this plan: stay visible; hiding is
   `available.has(iso(d.date))` instead of `liveByDate.has(iso(d.date))` in step 4.
2. Surface live dates that are **not** in the snapshot (using the event‑level `affLink`
   as the ticket link)? Default: no, log only.
3. Extract the shared `loadEventDetail()` helper now, or keep seven copies for a smaller
   diff? Recommendation: extract.
