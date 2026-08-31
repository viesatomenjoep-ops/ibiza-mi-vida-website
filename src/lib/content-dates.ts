/**
 * When each evergreen page's content was last genuinely revised.
 *
 * Answer engines and Google both weight recency for travel and event content,
 * and the site exposed no `dateModified` anywhere. But the fix has to be honest:
 * the sitemap previously stamped every URL with `new Date()`, which claimed the
 * whole site changed on every rebuild — a uniformly false signal that crawlers
 * learn to discount, and worse than saying nothing.
 *
 * So this map is HAND-MAINTAINED and deliberately not derived from the build
 * date. Update the entry only when you actually rewrite that page's content.
 * If you are unsure whether a change counts, leave the date alone.
 *
 * Pages whose content changes on its own — the calendar, the agendas, event and
 * venue detail pages — must NOT be listed here. They take their date from the
 * ClubTickets sync via `getDataLastUpdated()`, which is the real thing.
 */
export const CONTENT_UPDATED: Record<string, string> = {
  // All four rewritten when per-page FAQs and Service schema were added.
  'private-boat-charters': '2026-08-29',
  boats: '2026-08-29',
  'ferry-formentera': '2026-08-29',
  'boat-party': '2026-08-29',
  // Package-deal picker + H1 rewrite.
  guestlist: '2026-08-29',
  // Both rebuilt from scratch, replacing placeholder boilerplate.
  'about-us': '2026-08-30',
  contact: '2026-08-30',
  // Keyword pillar pages, written from scratch.
  'boat-rental-ibiza': '2026-08-31',
  'jet-ski-rental-ibiza': '2026-08-31',
  'car-rental-ibiza': '2026-08-31',
  'ibiza-club-tickets': '2026-08-31',
  'ibiza-guestlist': '2026-08-31',
  'boat-hire-ibiza-no-licence': '2026-08-31',
  'boat-rental-with-skipper-ibiza': '2026-08-31',
  'car-rental-ibiza-airport': '2026-08-31',
  'convertible-car-rental-ibiza': '2026-08-31',
}

/** ISO date for a page key, or undefined if we have no honest date for it. */
export function contentUpdated(pageKey: string): string | undefined {
  return CONTENT_UPDATED[pageKey]
}
