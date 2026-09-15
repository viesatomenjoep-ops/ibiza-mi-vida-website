/**
 * The real numbers used as social proof — one file, updated monthly.
 *
 * ── Wat hier op 15-09-2026 uit is gehaald ─────────────────────────────────
 * `soldFor`, de lijst met artiestennamen waarvoor we tickets verkochten
 * (CamelPhat, Anyma, ANTS, KISS Pool Party). Op verzoek van de eigenaar
 * weg: vier losse namen zonder context zeggen een bezoeker niets over of wij
 * betrouwbaar zijn, en ze verouderen zodra het seizoen draait. Wil je dit
 * terug, dan hoort er een aantal of een datum bij.
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
   * Total tickets sold this season, or null when the figure has not been
   * pulled from the records. null renders nothing; it never renders "0".
   */
  ticketsSold: number | null
}

export const PROOF: ProofData = {
  season: '2026',
  verified: '2026-08-31',
  /**
   * Totaal aantal verkochte tickets dit seizoen, of null zolang het niet uit
   * de boekingsadministratie is gehaald.
   *
   * NIET INVULLEN MET EEN SCHATTING. Dit getal is de enige harde claim die de
   * site over de eigen omzet doet; een geschat of opgehoogd cijfer is een
   * misleidende handelspraktijk (Richtlijn 2005/29/EG) en niet terug te
   * draaien zodra het geciteerd is. Zie ook `TICKETS_TODAY` hieronder.
   */
  ticketsSold: null,
}

/**
 * "Vandaag al X tickets verkocht" — de teller die gevraagd is, en die BEWUST
 * leeg staat.
 *
 * Er is om een dagteller gevraagd die "tussen de 10 en 200 per dag varieert"
 * om vertrouwen te wekken. Dat is precies wat hier niet mag, om drie redenen
 * die allemaal los van elkaar al genoeg zijn:
 *
 *  1. Het is een verzonnen getal over consumentengedrag. De Richtlijn
 *     oneerlijke handelspraktijken (2005/29/EG, art. 6) rekent een onware
 *     mededeling over de populariteit van een aanbod tot misleidende
 *     handelspraktijk; de Omnibus-richtlijn scherpte dat aan voor precies dit
 *     patroon. Een concurrent of een ACM-melding is genoeg.
 *  2. Een willekeurig getal in de render van een server-gerenderd component
 *     geeft een hydration-mismatch — zie de `Math.random()`-regel in
 *     CLAUDE.md, die de agenda op mobiel liet vastlopen.
 *  3. De site heeft al een eerlijke tegenhanger: `getGoogleReviews()` toont
 *     echte beoordelingen en rendert niets zodra ze er niet zijn. Dezelfde
 *     regel geldt hier.
 *
 * Zodra de dagcijfers WEL uit de boekingsadministratie komen, zet je ze hier
 * neer en rendert `<Proof>` de teller vanzelf:
 *
 *   TICKETS_TODAY = { count: 42, date: '2026-09-15' }
 *
 * `date` is er zodat een teller van gisteren niet als "vandaag" op de site
 * blijft staan: `<Proof>` toont hem alleen op de dag zelf.
 */
export interface TicketsToday {
  /** Aantal vandaag verkochte tickets, uit de administratie. */
  count: number
  /** ISO-datum waarop dat aantal geldt. */
  date: string
}

export const TICKETS_TODAY: TicketsToday | null = null
