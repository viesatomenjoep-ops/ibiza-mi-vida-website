# ClubTickets live-event fixtures

Captured for the "live API layer for event detail pages" work (see
`/implementation_plan.md`). Used by the unit tests for `clubtickets-live.ts` and
`merge-event-dates.ts`.

## Provenance

| File | Source | Captured | Real? |
|---|---|---|---|
| `clubtickets-event-1901.json` | `GET https://affiliates.clubtickets.com/api/affiliate/<key>/get/venue/319/event/1901?locale=en` ([UNVRS] / elrow Ibiza) | 2026-09-04 | Real. `dates[]`, ids, prices and `lowestAvailablePrice` are verbatim. `description` / `requirements` prose truncated with `…` — the live layer never reads those fields, they are kept only so a test can assert we ignore them. |
| `clubtickets-event-soldout.synthetic.json` | Hand-built | — | **Synthetic.** Follows ClubTickets' documented sold-out contract (`prices: ""`, `lowestAvailablePrice: null`) because no live sold-out date was found across 4 probed events. Replace with a real capture once `check:event` surfaces one. |

## Notes

- Host is `affiliates.clubtickets.com` (matches `BASE_URL` in `src/lib/clubtickets.ts`).
  The `apiEndpoint` echoed inside responses says `admin.clubtickets.com` — do **not**
  switch to it.
- `lineUp` is `<p>…</p>` HTML and must be passed through `stripHtml`.
- Currency is EUR for every locale; there is no currency parameter.
