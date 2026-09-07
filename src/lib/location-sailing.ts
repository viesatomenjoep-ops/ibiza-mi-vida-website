import { SAILING_ROUTES, type RouteStop, type SailingRoute } from './sailing-routes'

/**
 * Welke plaatspagina hoort bij welke stop op een vaarroute.
 *
 * ── Waarom dit bestaat ────────────────────────────────────────────────────
 * Twee bestanden beschrijven al hetzelfde stuk kust vanuit een andere hoek, en
 * ze wisten niets van elkaar:
 *
 *   • locations.ts     — 21 plaatsen: karakter, geschiedenis, wat er tegenvalt
 *   • sailing-routes.ts — 16 baaien: waarom een charter er stopt, waar je
 *                         ankert, en bij welke wind het er niet werkt
 *
 * Iemand die op /locations/es-vedra leest, staat op precies het punt waarop
 * "hoe kom ik daar" de volgende vraag is — en voor Es Vedrà, Ses Illetes en
 * Benirràs is het eerlijke antwoord dat je er over zee het beste komt. Dat
 * antwoord stond twee bestanden verderop.
 *
 * Dit is dezelfde ingreep als route-beach-clubs.ts: koppelen wat er al staat.
 * Er komt hier geen enkele nieuwe bewering bij; klopt de koppeling, dan klopt
 * hij omdat beide bronnen al klopten.
 *
 * ── Waarom een expliciete tabel en geen naammatch ─────────────────────────
 * Verleidelijk om op genormaliseerde namen te matchen, en dat gaat hier stuk:
 * de plaatspagina heet "Cala Comte (Cala Conta)" en de vaarstop "Cala Conta" —
 * twee gangbare spellingen van dezelfde baai, waar geen normalisatie op
 * uitkomt. Andersom zou een losse match "Ses Salines" (het strand én het
 * natuurpark én de zoutvlakten) aan de verkeerde kant kunnen koppelen.
 *
 * Dus met de hand, één regel per koppeling, en wie een plaats toevoegt ziet
 * meteen dat er een keuze te maken valt. Een plaats die hier niet in staat
 * rendert het blok gewoon niet.
 */
const STOP_BY_LOCATION: Record<string, string> = {
  'ses-salines': 'Ses Salines',
  // De pagina heet "Cala Comte (Cala Conta)", de vaarstop "Cala Conta".
  // Dezelfde baai, twee gangbare spellingen.
  'cala-comte': 'Cala Conta',
  'es-vedra': 'Es Vedrà',
  benirras: 'Cala Benirràs',
  portinatx: 'Portinatx',
  'cala-llonga': 'Cala Llonga',
  'ses-illetes': 'Ses Illetes',
}

export interface LocationSailing {
  stop: RouteStop
  route: SailingRoute
}

/** De vaarstop en de route waar deze plaats op ligt, of null. */
export function sailingForLocation(slug: string): LocationSailing | null {
  const naam = STOP_BY_LOCATION[slug]
  if (!naam) return null
  for (const route of SAILING_ROUTES) {
    const stop = route.stops.find((s) => s.name === naam)
    if (stop) return { stop, route }
  }
  // Een stop die uit sailing-routes.ts verdwijnt mag geen kapotte sectie
  // opleveren; null is hier de goede uitkomst.
  return null
}
