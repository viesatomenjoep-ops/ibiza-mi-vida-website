# Implementation plan — filters on the calendar

## Status — implemented, verified via eslint + tsc

## Scope

Add three filters to `EventsExplorer.tsx` (shared by `/calendar` and
`/activities-calendar`):

1. **Venue** — which club/operator
2. **Artist** — free-text search against the line-up
3. **Price** — max budget per ticket

These were picked because all three parse from data the component already
receives — no new fetch, no new field from the feed. Other suggested filters
(day-club vs night-club, activities sub-type, start-time) need either a small
prop addition upstream (`page.tsx` → `LightVenue`) or a data check I haven't
done yet, so they're left out of this plan — see **Not in this plan** at the
bottom.

## Where this plugs into the existing component

`EventsExplorer.tsx` already has one filtering step:

```ts
const clubEvents = useMemo(
  () => events.filter(e => hoortErbij(mode, venueOf(e)?.type_slug || '') && e.date >= todayStr),
  [events, todayStr, mode]
)
```

`clubEvents` feeds `rangeEvents` (day-picker filter) → `grouped` (per-date,
shuffled) → the card grid. The new filters slot in as one more `useMemo`
between `clubEvents` and `rangeEvents`, so they compose with the existing
day-picker and the lazy month/year loading (`extra`) for free — nothing about
those two systems needs to change.

```ts
const filteredEvents = useMemo(() => {
  return clubEvents.filter(e => {
    const matchVenue = venueFilter === 'all' || e.ct_venues?.slug === venueFilter
    const matchArtist = !artistQuery.trim() || lineupArtists(e.lineUp)
      .some(a => a.toLowerCase().includes(artistQuery.trim().toLowerCase()))
    const price = priceFromNumber(e.prices) // new helper, see below
    const matchPrice = maxPrice == null || price == null || price <= maxPrice
    return matchVenue && matchArtist && matchPrice
  })
}, [clubEvents, venueFilter, artistQuery, maxPrice])

const rangeEvents = activeDay ? filteredEvents.filter(e => e.date === activeDay) : filteredEvents
```

## New state (in `EventsExplorer`)

```ts
const [venueFilter, setVenueFilter] = useState<string>('all')
const [artistQuery, setArtistQuery] = useState('')
const [maxPrice, setMaxPrice] = useState<number | null>(null)
```

## Filter option sources

- **Venues** — derive from `clubEvents`, not from `allVenues`, so the
  dropdown never offers a club with zero events in the loaded window (dead
  options). Sort by name:
  ```ts
  const venueOptions = useMemo(() => {
    const seen = new Map<string, string>() // slug -> name
    clubEvents.forEach(e => {
      const slug = e.ct_venues?.slug
      if (slug && !seen.has(slug)) seen.set(slug, e.ct_venues?.name || venueOf({ ct_venues: { slug } } as ExEvent)?.name || slug)
    })
    return Array.from(seen.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [clubEvents])
  ```
- **Artist** — plain text input, matched against `lineupArtists(e.lineUp)`
  (existing helper). No dropdown/autocomplete in this pass — the calendar
  currently has ~13% of nights with a published line-up (per the code's own
  comment: 587/678 don't), so a free-text box that silently no-ops on empty
  input costs nothing on the 87% of nights without one, and a full
  autocomplete list isn't worth the extra UI for that hit rate. Can revisit
  if this turns out to be well-used.
- **Price** — need a small new helper, `priceFromNumber()`, next to the
  existing `priceFrom()` (which returns a formatted string like `€45`) —
  reuse its regex, return the raw number instead:
  ```ts
  function priceFromNumber(prices?: string): number | null {
    if (!prices) return null
    const m = prices.match(/\d+([.,]\d+)?/)
    return m ? parseFloat(m[0].replace(',', '.')) : null
  }
  ```
  Budget UI: reuse the preset-chip pattern from `FleetFilterBar`/
  `BUDGET_STEPS` (`FleetShowcase.tsx`) rather than a full slider — fewer
  moving parts, and it's already the site's established language for "pick a
  max price" (`€25` / `€50` / `€100` / `Any`, computed from the actual min/max
  across `clubEvents` the way `PRICE_MIN`/`PRICE_MAX` are computed from
  `FLEET_LOWS` today).

## UI placement

A single filter row above the day/upcoming header
(`{activeDay ? dayHeader(activeDay) : T.upcoming}` block, around line 356),
same width as the content column (`max-w-7xl`), horizontally scrollable on
mobile like the existing favourites bar pattern:

- Venue: a pill-style `<select>` or a small dropdown (styled like the
  category pills already used in `FleetSteps`), defaulting to "All clubs" /
  "Alle clubs" per `T.allVenues`-style label.
- Artist: a compact text input with a search icon, placeholder "Search an
  artist…" / "Zoek een artiest…".
- Price: 3–4 preset chips + "Any budget", same visual weight as the venue
  pill.
- A "Clear filters" text link, shown only when any filter is active — same
  role as `wisFilters()` in `FleetShowcase.tsx`.

**Hide the artist filter entirely on `/activities-calendar`** (`mode ===
'activities'`): boat trips/tours essentially never have a `lineUp`, so an
artist search box there would filter against empty data on every event —
a UI element that can never do anything. Gate it on whether any event in
`clubEvents` actually has a parsed line-up:
```ts
const hasAnyLineup = useMemo(() => clubEvents.some(e => lineupArtists(e.lineUp).length > 0), [clubEvents])
```

## i18n

Add to `T_I18N` (all 5 locales, same object this file already keeps
everything else in):
```ts
allVenues: string       // "All clubs" / "Alle clubs" / …
searchArtist: string    // placeholder
anyBudget: string       // "Any budget"
clearFilters: string    // "Clear filters"
noMatchFiltered: string // distinct from noEvents — "No events match your filters"
```
`noMatchFiltered` matters: right now `T.noEvents` fires both when a day
genuinely has nothing on, and (after this change) when filters exclude
everything. Those need different copy — the first is a fact about Ibiza that
night, the second is "loosen your filters," ideally with the existing
`T.noEvents` block also rendering a "Clear filters" button when any filter is
active, matching `noResults` + `wisFilters` on the boat page.

## Filter reset behaviour

- Switching `period` (day/week/month/year) or `activeDay`: **keep filters**
  — someone filtering to a venue browsing across days wants that venue kept
  as they move through the calendar.
- Switching `mode` isn't user-triggered within one mounted instance (`/calendar`
  and `/activities-calendar` are separate pages, separate mounts), so no
  reset logic needed there.

## Testing

- `npm run lint` / `tsc` on the touched files.
- Manual: pick a venue with few events, confirm the day-picker dock counts
  (`countForDay`, currently counts unfiltered `clubEvents`) still make sense
  next to a filtered grid — **note**: `countForDay` should probably switch to
  counting `filteredEvents` too, otherwise the dock will show a day has events
  that the filtered grid then reports as empty. Flagging this as part of the
  same change, not a separate one — `countForDay`'s single call site
  (`WeekDockBar`'s `imageFor`/count props) just needs its filter source
  swapped from `clubEvents` to `filteredEvents`.
- Confirm the artist filter is invisible on `/activities-calendar` (or on any
  day range where nothing has a line-up).
- Confirm filters compose correctly with lazy month/year loading — apply a
  venue filter, switch to "Month", verify newly-fetched (`extra`) events are
  filtered too (they should be, since `filteredEvents` derives from
  `clubEvents` which derives from `events` = `initialEvents + extra`).

## Not in this plan (from the earlier suggestions list)

- **Day club vs night club** (`CTVenue.isDayClub`) — exists upstream but is
  stripped out when `page.tsx` builds the trimmed `LightVenue` sent to this
  component. Needs one field added to that mapping before it's usable here.
- **Activities sub-type** (Activities / Boat trips / Formentera day-trips) —
  real, data-backed filter (`type_slug` already distinguishes these), but
  scoped out here since it's specific to `/activities-calendar` and the user
  asked for calendar filters in general. Easy follow-up once this lands, same
  pattern as the venue filter.
- **Start time (before/after midnight)** — `startAt`/`endAt` exist on
  `CTVenueEvent`, but I haven't confirmed they're carried through per-date in
  `calendarWindow()`'s mapper. Needs that check before it's plannable.
