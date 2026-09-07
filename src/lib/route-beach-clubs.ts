import { BEACH_AREAS, type BeachClub } from './beach-clubs'
import { SAILING_ROUTES } from './sailing-routes'

/**
 * Welke beachclub ligt aan welke baai die een vaarroute aandoet.
 *
 * ── Waarom dit een afleiding is en geen nieuwe inhoud ─────────────────────
 * "Waar kun je eten als je met de boot gaat" is een echte vraag en geen enkel
 * restaurantplatform beantwoordt hem: TripAdvisor kent adressen, geen baaien.
 * De verleiding is dan om restaurants te gaan verzinnen. Dat hoeft niet — we
 * hebben het antwoord al twee keer in huis staan, alleen nooit verbonden:
 *
 *   • sailing-routes.ts beschrijft 16 baaien waar een charter stopt
 *   • beach-clubs.ts beschrijft 20 echte zaken, elk mét het strand waar hij ligt
 *
 * Allebei geschreven onder strikte feitelijke regels. Deze module doet niets
 * anders dan ze op strandnaam aan elkaar koppelen. Er komt hier geen enkele
 * nieuwe bewering bij; als de koppeling klopt, klopt hij omdat beide bronnen
 * al klopten.
 *
 * ── Wat hier NIET beweerd wordt ───────────────────────────────────────────
 * Niet dat je bij die zaak kunt aanleggen, en niet dat aan land gaan die dag
 * kan. Ankeren en aan land gaan hangen af van wind, drukte en de zeebodem —
 * de stops in sailing-routes.ts zeggen daar per baai zelf iets over, en de
 * schipper beslist op de dag. Deze module zegt uitsluitend: aan dit strand
 * ligt deze zaak. Alles daarbuiten zou operationeel advies zijn over een boot,
 * en dat verzin je niet.
 */

/** Accenten en leestekens weg, zodat "Benirràs" en "Cala Benirràs" matchen. */
function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z ]/g, '')
    .trim()
}

const ALL: BeachClub[] = BEACH_AREAS.flatMap(a => a.clubs)

/**
 * Zaken aan het strand van deze routestop.
 *
 * Matcht in beide richtingen omdat de twee bestanden dezelfde plek soms anders
 * benoemen: de routestop heet "Cala Benirràs", de beachclub staat op strand
 * "Benirràs". Exacte gelijkheid zou die koppeling missen.
 */
export function clubsAtStop(stopName: string): BeachClub[] {
  const stop = norm(stopName)
  if (!stop) return []
  return ALL.filter(c => matcht(c.beach, stop))
}

/** Eén plek voor de vergelijking, zodat beide richtingen niet uit elkaar lopen. */
function matcht(beachNaam: string, genormaliseerdeStop: string): boolean {
  const beach = norm(beachNaam)
  return !!beach && (beach === genormaliseerdeStop || genormaliseerdeStop.includes(beach) || beach.includes(genormaliseerdeStop))
}

/**
 * De andere kant op: ligt het strand van deze beachclub op een vaarroute?
 *
 * `clubsAtStop()` hierboven beantwoordt "wat ligt er aan deze baai" en wordt
 * gebruikt op de charterpagina. Op /beach-clubs is de vraag omgekeerd — je
 * leest over een zaak aan Cala Bassa of Ses Illetes, en de nuttige vervolgvraag
 * is dat je daar per boot komt in plaats van via een parkeerplaats die in
 * augustus om elf uur vol is.
 *
 * Dat is voor sommige stranden hier niet cosmetisch maar het échte antwoord.
 * Ses Illetes ligt op Formentera: daar kom je hoe dan ook over zee.
 *
 * Geeft de naam van de routestop terug, niet de hele route — de aanroeper heeft
 * alleen iets om naartoe te linken nodig. Geen stop: null, en dan rendert er
 * niets.
 */
export function stopForBeach(beachNaam: string): string | null {
  const beach = norm(beachNaam)
  if (!beach) return null
  for (const route of SAILING_ROUTES) {
    for (const stop of route.stops) {
      if (matcht(beachNaam, norm(stop.name))) return stop.name
    }
  }
  return null
}
