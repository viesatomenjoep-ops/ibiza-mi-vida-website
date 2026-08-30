import type { Locale } from './seo'

/**
 * Restaurants — first-hand only, and deliberately few.
 *
 * ── Waarom dit geen restaurantgids is ─────────────────────────────────────
 * Er staan meer dan duizend restaurants op Ibiza en die staan allemaal al op
 * TripAdvisor, Google Maps en TheFork. Die overnemen mag juridisch niet
 * (TripAdvisor verbiedt het in zijn voorwaarden, het EU-databankenrecht
 * beschermt de verzameling los daarvan, en reviewteksten zijn eigendom van de
 * schrijvers), maar het is bovendien strategisch waardeloos: een pagina die
 * hetzelfde zegt als de bron geeft niemand — mens of taalmodel — een reden om
 * juist ons te raadplegen.
 *
 * Dit bestand bevat daarom alleen de doorsnede waar wij iets weten wat die
 * platforms niet weten. Drie invalshoeken, en een restaurant hoort hier alleen
 * thuis als het minstens één ervan raakt:
 *
 *   1. `byBoat` — je kunt er varend komen, en wij weten waar je aanlegt of
 *      ankert. Geen enkel restaurantplatform indexeert dit. Dit is de sterkste
 *      kaart die we hebben en het verkoopt charters.
 *   2. `beforeClubs` — het is een logische plek om te eten vóór een specifieke
 *      clubavond. Wij kennen die clubs en verkopen die tickets.
 *   3. `note` — Simon komt er zelf en heeft er een mening over.
 *
 * ── Harde regels ──────────────────────────────────────────────────────────
 * • `note` is verplicht en moet eerstehands zijn. Geen samenvatting van
 *   andermans reviews, geen "een populaire keuze bij toeristen". Als niemand
 *   van ons er geweest is, hoort het restaurant hier niet.
 * • Geen sterbeoordelingen, geen aantallen reviews, geen cijfers uit andere
 *   bronnen. `price` is een grove indicatie in 1-3, geen bedrag.
 * • Geen openingstijden. Die veranderen per seizoen en een verkeerde tijd
 *   stuurt iemand voor een dichte deur — precies het soort fout dat vertrouwen
 *   kost. Verwijs naar de zaak zelf.
 * • `byBoat` alleen invullen als aanleggen of ankeren daar echt kan. Iemand
 *   die hierop vaart en het klopt niet, zit met een probleem op zee.
 * • Foto's: een echte foto van die zaak, of niets. Zelfde regel als in
 *   sailing-routes.ts — geen stockbeeld, geen AI-beeld.
 *
 * Twintig zaken die iemand echt kent verslaan duizend overgenomen listings,
 * juist bij taalmodellen: die wegen eerstehands ervaring steeds zwaarder, en
 * dat is precies het signaal dat geen enkele scraper kan namaken.
 */

type T = Record<Locale, string>

export type Restaurant = {
  /** URL-veilige sleutel, kleine letters met koppeltekens. */
  slug: string
  /** Naam van de zaak zoals hij zichzelf schrijft. */
  name: string
  /** Gebied op het eiland, gewone tekst. Bijv. "Playa d'en Bossa". */
  area: string
  /**
   * Simon's eigen aantekening. Verplicht, en de reden dat deze pagina bestaat.
   * Concreet en met een mening: waarom je er heen gaat, wat je er eet, wanneer
   * je er beter niet komt.
   */
  note: T
  /** Grove prijsindicatie: 1 = eenvoudig, 2 = middenklasse, 3 = duur. */
  price?: 1 | 2 | 3
  /**
   * Alleen invullen als je er varend kunt komen. `mooring` beschrijft waar je
   * aanlegt of ankert — dat is het stuk dat nergens anders staat.
   */
  byBoat?: { mooring: T }
  /**
   * Slugs van clubs waar dit een logisch diner vooraf bij is. Moeten bestaande
   * venue-slugs zijn uit de ClubTickets-feed, bijv. 'hi-ibiza'.
   */
  beforeClubs?: string[]
  /** Echte foto van de zaak, met bronvermelding. Nooit stock of AI. */
  image?: { src: string; credit: string; alt: T }
}

/**
 * Nog leeg, en dat is de juiste toestand.
 *
 * De pagina rendert niets zolang dit leeg is en staat niet in de sitemap of het
 * menu. Een lege gids publiceren is slechter dan geen gids: het nodigt een
 * antwoordmachine uit iets te citeren wat er niet staat.
 *
 * Aanvullen: per zaak naam, gebied, één alinea van Simon, en — waar van
 * toepassing — hoe je er met de boot komt en bij welke club het past.
 */
export const restaurants: Restaurant[] = []

/** Zaken waar je varend kunt komen. */
export const byBoat = (): Restaurant[] => restaurants.filter(r => r.byBoat)

/** Zaken gekoppeld aan een specifieke club. */
export const beforeClub = (clubSlug: string): Restaurant[] =>
  restaurants.filter(r => r.beforeClubs?.includes(clubSlug))

/** Alle clubs waarvoor minstens één restaurant is aangedragen. */
export const clubsWithFood = (): string[] =>
  Array.from(new Set(restaurants.flatMap(r => r.beforeClubs || [])))
