/**
 * Water of land? De scheiding tussen de twee activiteitenwerelden.
 *
 * ── Waarom dit niet op venuetype kan ──────────────────────────────────────
 * ClubTickets kent vier venuetypes: clubbing, boat, formentera-day-trip en
 * activities. Die eerste drie zijn eenduidig, maar 'activities' is een
 * verzamelbak waar twaalf aanbieders in zitten die van alles doen:
 *
 *   Cova de Can Marça      grot                    land
 *   Emove Ibiza            buggy, quad, motocross  land
 *   BIBO Park Ibiza        park                    land
 *   Ibiza Buggy Adventure  buggy, quad             land
 *   Blue Coral, Es Vedra,
 *   Enjoy Water Sports,
 *   Ibiza Jet Ski Beach    jetski                  water
 *   SUP Paradise           paddle, boottocht       water
 *   TAKE OFF               water toys, boottocht   water
 *   Excursiones Al Sabini  jeepsafari EN Formentera Tour -- allebei
 *   INTO THE ISLAND        4x4-safari EN boot+4x4  -- allebei
 *
 * Twee aanbieders verkopen dus zowel land als water. Op venue splitsen zou
 * betekenen dat een jeepsafari bij het water belandt of een boottocht bij het
 * land. Daarom splitsen we per event, op de naam.
 *
 * ── De regel ──────────────────────────────────────────────────────────────
 * Venuetype 'boat' en 'formentera-day-trip' zijn per definitie water. Voor
 * alles daaronder beslist de eventnaam: staat er iets in dat alleen op het
 * water bestaat (jetski, boot, catamaran, ferry, snorkel, paddle), dan water;
 * anders land.
 *
 * De volgorde is niet willekeurig. "Into the Island - Boat, 4x4 & Es Vedrà
 * Sunset Adventure" bevat zowel 'boat' als '4x4'; dat is een tocht die
 * daadwerkelijk vaart, dus water wint. Andersom zou een boottocht met een
 * strandwandeling erin op het land eindigen.
 *
 * Wat hier NIET staat is een keyword dat allebei kan betekenen. 'tour',
 * 'excursion' en 'adventure' zijn bewust weggelaten: die zeggen niets over
 * waar je bent.
 */

/** Venuetypes die altijd water zijn, ongeacht de eventnaam. */
const WATER_TYPES = new Set(['boat', 'formentera-day-trip'])

/**
 * Woorden die alleen op het water voorkomen, in de vijf talen van de feed.
 * Los van elkaar getest tegen de kleingeschreven eventnaam.
 */
const WATER_WOORDEN = [
  'jet ski', 'jetski', 'jet-ski', 'moto de agua',
  'boat', 'boot', 'barco', 'bateau',
  'catamaran', 'katamaran', 'catamarán',
  'ferry', 'veerboot',
  'cruise', 'crucero', 'croisière',
  'sail', 'zeil', 'vela', 'voile',
  'snorkel', 'buceo', 'diving', 'duiken',
  'paddle', 'sup ', 'kayak', 'kajak',
  'water toys', 'watersport', 'water sports',
  'formentera',
]

/** Is dit event op het water? */
export function isOpHetWater(typeSlug: string | undefined, eventNaam: string | undefined): boolean {
  if (WATER_TYPES.has(typeSlug || '')) return true
  const n = (eventNaam || '').toLowerCase()
  return WATER_WOORDEN.some(w => n.includes(w))
}

/** Is dit event op het land? Alles wat geen clubavond en geen water is. */
export function isOpHetLand(typeSlug: string | undefined, eventNaam: string | undefined): boolean {
  if ((typeSlug || '') === 'clubbing') return false
  return !isOpHetWater(typeSlug, eventNaam)
}
