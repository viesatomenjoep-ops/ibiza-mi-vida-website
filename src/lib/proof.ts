/**
 * The real numbers used as social proof — one file, updated monthly.
 *
 * Every figure a page shows about our own track record comes from here and is
 * passed to the <Proof> component as data. None of it may be written into page
 * copy as a literal: a number baked into a sentence is a number nobody
 * remembers to update, and a stale claim ("tickets sold this season") is a
 * false claim the moment the season turns over.
 *
 * ── What may go in here ───────────────────────────────────────────────────
 * Only things that are true and checkable. Artist names belong here when we
 * genuinely sold tickets for those shows. Counts belong here when they come
 * from the booking records.
 *
 * ── What may NOT ──────────────────────────────────────────────────────────
 * The Google rating and review count are deliberately ABSENT. They are not
 * ours to state: they live on the Google Business Profile and are fetched live
 * by src/lib/google-reviews.ts, which returns null when it cannot prove a
 * number is real. Adding `rating: 5.0, reviews: 8` here would recreate exactly
 * the hardcoded-AggregateRating problem that file exists to prevent — the
 * numbers would keep rendering long after the profile moved on. If you want
 * the rating on a page, pass it down from getGoogleReviews().
 *
 * `season` marks which season the figures describe, so a reader — and a
 * reviewer of this file — can tell at a glance when it went stale.
 */

export interface ProofData {
  /** The season these figures describe, e.g. '2026'. */
  season: string
  /** ISO date this file was last checked against the booking records. */
  verified: string
  /**
   * Shows we genuinely sold tickets for this season. Names only — no counts
   * per artist unless those are in the records too.
   */
  soldFor: string[]
  /**
   * Total tickets sold this season, or null when the figure has not been
   * pulled from the records. null renders nothing; it never renders "0".
   */
  ticketsSold: number | null
}

export const PROOF: ProofData = {
  season: '2026',
  verified: '2026-08-31',
  soldFor: [
    'CamelPhat',
    'Anyma Presents ÆDEN',
    'ANTS',
    'KISS Pool Party',
  ],
  // Not yet pulled from the booking records — see docs/content-todos.md.
  ticketsSold: null,
}
