# Implementation plan — artist page event links open the wrong date

## Status — implemented (artist page + both related instances), verified via eslint + tsc

## Bug

On the artist detail page (`src/app/[locale]/artists/[slug]/page.tsx`), the
"Events" list shows every upcoming date an artist plays, each with its own
date label. Clicking any card always opens the event detail page on the
*next upcoming* occurrence, never on the date that was actually clicked —
e.g. clicking "Fri 14 Nov" lands on the detail page for the nearest date
(say "Sat 5 Sep") instead.

## Root cause

This is the exact bug class already documented and solved elsewhere in this
codebase (see `src/lib/event-date-param.ts` and the CLAUDE.md rule about
recurring club nights): a club/artist can have dozens of dates under the
*same* `eventSlug`. The event detail route picks which date to display with:

```ts
// src/components/templates/EventDetailPage.tsx:267
const gekozen = (selectedDate && eventDates.find(d => String(d.date).slice(0, 10) === selectedDate)) || eventDates[0]
```

`selectedDate` comes from the `?date=` query param via `dateParam()`. Without
it, `gekozen` falls back to `eventDates[0]` — the next upcoming date —
regardless of which card was clicked.

The artist page builds its event links **without** that param:

```tsx
// src/app/[locale]/artists/[slug]/page.tsx:409-410
<Link
  href={`/${locale}/${date.basePath}/${date.venueSlug || 'club'}/${date.eventSlug || 'event'}`}
  key={i}
  ...
```

Every `date` item already carries the ISO date (`date.date`, set at line 105
in the same file), it's just not appended to the href.

The fix pattern (`withDate()`) already exists in
`src/lib/event-date-param.ts` and is already used on the agenda
(`EventsExplorer.tsx`), `this-week/page.tsx`, `club-tickets/ClubTicketsClient.tsx`,
the homepage, and the home activity rails. All seven event-detail routes
(`club-tickets`, `activities`, `boat-trip`, `ferry-formentera`,
`shuttle-ferry`, `tours`, `water-sports`) already read `dateParam()` — no
downstream change is needed, this is purely a missing call at the link site.

## Fix

In `src/app/[locale]/artists/[slug]/page.tsx`:

1. Import `withDate`:
   ```ts
   import { withDate } from '@/lib/event-date-param'
   ```
2. Wrap the href (line 410):
   ```tsx
   href={withDate(
     `/${locale}/${date.basePath}/${date.venueSlug || 'club'}/${date.eventSlug || 'event'}`,
     date.date
   )}
   ```

That's the entire required change. `withDate()` already no-ops safely when
`date.date` is missing or not a valid `YYYY-MM-DD` (falls back to current
behavior), so this can't introduce a broken link.

## Testing

- `npm run lint` / `tsc` — no type changes beyond the new import, should be clean.
- Manual: open an artist page for an artist with 2+ future dates at the same
  venue/event slug (e.g. a resident DJ), click a date further out than the
  next one, confirm the detail page opens showing that date's line-up/price
  (not the nearest date's).
- Confirm the URL on the destination page carries `?date=YYYY-MM-DD`.
- Confirm `generateMetadata` on the destination route still ignores
  `searchParams` (canonical must stay the bare URL — this is already the
  existing behavior per `dateParam()`'s docstring, not something this fix
  touches).

## Related instances found (same bug pattern) — also fixed

Two more per-night date lists built event links the same unguarded way.
Fixed with the identical one-line pattern:

- `src/components/templates/VenueDetailPage.tsx:371` — the club/venue
  detail page's "All Events" list (`allDates.slice(0, 10).map(...)`).
  Wrapped with `withDate(href, date.date)`. Left the `weeklyParties` list
  (line 324) alone on purpose — it groups by recurring weekly series
  (day-of-week, no specific date), which is exactly the "whole event"
  listing `withDate()`'s own docstring says not to touch.
- `src/components/boats/WaterAgendaClient.tsx:393-396` — `EventTile`'s
  `internal` link. Wrapped with `withDate(href, ev.date)`.

Both verified with `eslint` + `tsc --noEmit` (run under Node 22 — see PATH
note below; no new errors, only pre-existing unrelated warnings in
`WaterAgendaClient.tsx`).

## Environment note

`~/.bash_profile` resolves `node` to a stale v10.23.1 by default (leftover
hardcoded nvm path), which breaks modern `eslint`. Verification here used
`export PATH="$HOME/.nvm/versions/node/v22.22.1/bin:$PATH"` before running
`npm`/`npx` commands. Worth fixing the profile's PATH order separately.

## Notes for CLAUDE.md

Per this repo's own convention ("Elke ontdekte fout die terug kan komen: als
regel toevoegen aan dit bestand"), once fixed this is worth a line noting
that *any* new per-night list must route its link through `withDate()` —
the helper already says so in its docstring, but three independent misses
(artist page, venue page, water agenda) suggest the convention isn't
consistently enforced from the link-authoring side.
