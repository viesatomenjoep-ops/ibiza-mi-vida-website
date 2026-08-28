// Venue type → the site section that hosts its detail pages. Every category's
// [slug]/[eventSlug] page hard-filters on its own venue type (e.g. the
// club-tickets page notFound()s for anything that isn't type 'clubbing'), so
// linking an activity/boat event through /club-tickets/... is a guaranteed
// 404 — the exact bug that broke every date row for activity "artists".
// Mirrors the homepage's BASEPATH_BY_TYPE; kept here so all link builders
// share one mapping.
const BASEPATH_BY_TYPE: Record<string, string> = {
  clubbing: 'club-tickets',
  activities: 'activities',
  'formentera-day-trip': 'ferry-formentera',
  boat: 'boat-trip',
}

export function eventBasePath(venueTypeSlug: string | undefined | null): string {
  return BASEPATH_BY_TYPE[venueTypeSlug || ''] || 'club-tickets'
}
