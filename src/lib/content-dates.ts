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
  // Nieuw geschreven conciergepagina in vijf talen. Eén sleutel voor alle vijf
  // de slugs: het is één tekst met één herzieningsdatum, en vijf regels die
  // altijd hetzelfde moeten zeggen zijn vier plekken om te vergeten.
  'concierge-ibiza': '2026-09-13',
  // All four rewritten when per-page FAQs and Service schema were added.
  'private-boat-charters': '2026-08-29',
  // 07-09 de sectie "welke boot onder €1000", berekend uit fleet.ts.
  boats: '2026-09-07',
  'ferry-formentera': '2026-08-29',
  'boat-party': '2026-08-29',
  // Package-deal picker + H1 rewrite; 07-09 de sectie "Is de gastenlijst
  // gratis?" met de drie uitkomsten en de deurprijs erbij.
  guestlist: '2026-09-07',
  'package-deals': '2026-08-31',
  // Both rebuilt from scratch, replacing placeholder boilerplate.
  'about-us': '2026-08-30',
  contact: '2026-08-30',
  // Keyword pillar pages, written from scratch.
  'boat-rental-ibiza': '2026-09-04',
  'jet-ski-rental-ibiza': '2026-08-31',
  'jetski-huren-ibiza': '2026-09-07',
  'jetski-mieten-ibiza': '2026-09-07',
  'alquiler-motos-agua-ibiza': '2026-09-07',
  'location-jet-ski-ibiza': '2026-09-07',
  'car-rental-ibiza': '2026-08-31',
  'ibiza-club-tickets': '2026-08-31',
  // De vier vertaalde clubticket-pillars, elk met een eigen invalshoek.
  'ibiza-clubtickets': '2026-09-07',
  'ibiza-club-tickets-kaufen': '2026-09-07',
  'entradas-discotecas-ibiza': '2026-09-07',
  'billets-clubs-ibiza': '2026-09-07',
  // Gidspagina's voor de drie clubs die niet in de ClubTickets-feed zitten,
  // plus luchthavenvervoer. Alle vier nieuw geschreven.
  'pacha-ibiza': '2026-09-07',
  'amnesia-ibiza': '2026-09-07',
  'dc10-ibiza': '2026-09-07',
  'ibiza-airport-transfer': '2026-09-07',
  // Gidsen, nieuw geschreven.
  'ibiza-nightlife': '2026-09-07',
  'ibiza-club-dress-code': '2026-09-07',
  'getting-around-ibiza': '2026-09-07',
  'ibiza-guestlist': '2026-08-31',
  'boat-hire-ibiza-no-licence': '2026-08-31',
  'boot-huren-ibiza-zonder-vaarbewijs': '2026-09-07',
  'boot-mieten-ibiza-ohne-fuehrerschein': '2026-09-07',
  'alquiler-barco-ibiza-sin-titulacion': '2026-09-07',
  'location-bateau-ibiza-sans-permis': '2026-09-07',
  'boot-huren-ibiza-met-schipper': '2026-09-07',
  'boot-mieten-ibiza-mit-skipper': '2026-09-07',
  'alquiler-barco-ibiza-con-patron': '2026-09-07',
  'location-bateau-ibiza-avec-skipper': '2026-09-07',
  'boat-rental-with-skipper-ibiza': '2026-08-31',
  'car-rental-ibiza-airport': '2026-08-31',
  'auto-huren-ibiza-luchthaven': '2026-09-07',
  'mietwagen-ibiza-flughafen': '2026-09-07',
  'alquiler-coches-aeropuerto-ibiza': '2026-09-07',
  'location-voiture-ibiza-aeroport': '2026-09-07',
  'convertible-car-rental-ibiza': '2026-08-31',
  'cabrio-huren-ibiza': '2026-09-07',
  'cabrio-mieten-ibiza': '2026-09-07',
  'alquiler-descapotable-ibiza': '2026-09-07',
  'location-cabriolet-ibiza': '2026-09-07',
  'boot-huren-ibiza': '2026-08-31',
  'auto-huren-ibiza': '2026-08-31',
  'boot-mieten-ibiza': '2026-08-31',
  'mietwagen-ibiza': '2026-08-31',
  'location-bateau-ibiza': '2026-08-31',
  'location-voiture-ibiza': '2026-08-31',
  'alquiler-barco-ibiza': '2026-08-31',
  'alquiler-coches-ibiza': '2026-08-31',
  'wiber-car-rental-ibiza': '2026-08-31',
  'click-and-boat-ibiza': '2026-08-31',
}

/** ISO date for a page key, or undefined if we have no honest date for it. */
export function contentUpdated(pageKey: string): string | undefined {
  return CONTENT_UPDATED[pageKey]
}
