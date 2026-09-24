import type { Locale } from '@/lib/seo'

/**
 * Venues die uit de ClubTickets-feed zijn verdwenen.
 *
 * ── Waarom dit bestaat ────────────────────────────────────────────────────
 * De venuepagina's worden volledig uit de feed opgebouwd: `getVenues()` levert
 * de lijst, de sitemap zet er URL's van, en de route roept `notFound()` zodra
 * een slug er niet in staat. Dat betekent dat een club die de partner uit zijn
 * catalogus haalt, bij de eerstvolgende synchronisatie stilletjes een 404
 * wordt — zonder omleiding, zonder melding, en uit de sitemap verdwenen.
 *
 * Dat is precies wat er op 19/20 september 2026 gebeurde: de feed ging van 42
 * naar 40 venues. Bambuku en SWAG hadden een pagina in vijf talen, stonden in
 * de sitemap en waren intern gelinkt. Google kende die URL's dus, en kreeg er
 * vanaf dat moment een 404 op.
 *
 * De regel uit CLAUDE.md is hier dezelfde als bij een teruggetrokken route:
 * een URL die in de sitemap stond en intern gelinkt was, haal je weg met een
 * 308 naar de pagina die de intentie wél draagt — niet met een 404. Een 404
 * gooit de linkwaarde weg en laat de bezoeker op een muur lopen; een 308
 * consolideert hem naar de pagina die er nog wel is.
 *
 * ── Hoe je hem vult ───────────────────────────────────────────────────────
 * `npm run sync-clubtickets` meldt welke venues sinds de vorige synchronisatie
 * uit de feed zijn verdwenen. Elke naam die daar verschijnt, hoort hier als
 * regel bij te komen voordat de nieuwe feed gecommit wordt. Verdwijnt een club
 * tijdelijk en komt hij terug, dan haal je de regel weer weg: een venue die
 * wél in de feed staat, wint altijd van deze lijst.
 */

export interface RetiredVenue {
  /**
   * Waar de intentie nu heen gaat, als pad zonder taalcode. De middleware zet
   * de taal van het oorspronkelijke verzoek ervoor, zodat een Duitser op de
   * Duitse overzichtspagina landt en niet op de Engelse.
   */
  target: string
  /** Datum waarop de venue uit de feed verdween (YYYY-MM-DD). */
  removed: string
  /** Wat we wél weten. Nooit een reden verzinnen die de partner niet gaf. */
  note: string
}

/**
 * De routefamilies die hun slugs uit de ClubTickets-feed halen. Alleen binnen
 * deze paden telt een slug als venue; `/en/locations/es-canar` is een eigen
 * pagina uit `locations.ts` en heeft met de feed niets te maken.
 */
export const VENUE_ROUTE_FAMILIES = [
  'club-tickets',
  'activities',
  'boat-trip',
  'ferry-formentera',
  'shuttle-ferry',
  'tours',
  'water-sports',
] as const

export const RETIRED_VENUES: Record<string, RetiredVenue> = {
  'bambuku-ibiza': {
    target: 'clubs',
    removed: '2026-09-20',
    note: 'Uit de ClubTickets-catalogus gehaald; de partner gaf geen reden. Wij verkopen er geen tickets meer voor, dus de overzichtspagina met de clubs die we wél voeren is de dichtstbijzijnde intentie.',
  },
  swag: {
    target: 'clubs',
    removed: '2026-09-20',
    note: 'Uit de ClubTickets-catalogus gehaald; de partner gaf geen reden. Zelfde afweging als Bambuku.',
  },
}

/**
 * Het doelpad voor een venue-URL die niet meer bestaat, of `null` wanneer deze
 * slug nergens op slaat. Geeft een compleet pad inclusief taalcode, zoals de
 * rest van de site dat verwacht.
 *
 * `family` moet meekomen zodat `/en/locations/swag` — mocht die ooit bestaan —
 * hier niet per ongeluk in valt. Een slug is alleen een venue binnen een van
 * de feedfamilies.
 */
export function retiredVenuePath(family: string, slug: string, locale: Locale): string | null {
  if (!(VENUE_ROUTE_FAMILIES as readonly string[]).includes(family)) return null
  const hit = RETIRED_VENUES[slug]
  return hit ? `/${locale}/${hit.target}` : null
}
