/**
 * Eén meetpunt voor elke klik die de site verlaat richting een partner.
 *
 * ── Waarom dit er niet was, en waarom dat het probleem was ────────────────
 * Google Analytics stond wel op de site, maar er ging geen enkele gebeurtenis
 * af op de afrekenknop. Gemeten: nul verwijzingen naar gtag of dataLayer in
 * EventCheckoutButton, AffiliateLink of ct-link. Gevolg: in GA4 waren
 * paginaweergaves te zien en verder niets. De vraag "waarom koopt bijna
 * niemand" was daarmee onbeantwoordbaar — je kon niet zien of mensen wél
 * doorklikken en pas bij ClubTickets afhaken, of dat ze hier al blijven
 * steken. Dat zijn twee totaal verschillende problemen met twee totaal
 * verschillende oplossingen.
 *
 * Eén regel per uitgaande klik geeft een echte trechter: bezoek → eventpagina
 * → doorklik. Wat daarna bij de partner gebeurt is hun rapportage; wat hier
 * gebeurt is nu van ons.
 *
 * ── Toestemming ───────────────────────────────────────────────────────────
 * `gtag` bestaat alleen als de bezoeker toestemming heeft gegeven — zie
 * ConsentScripts, dat het script pas ná toestemming injecteert. Deze functie
 * controleert of het er is en doet anders niets. Geen eigen opslag, geen
 * cookies, geen tweede kanaal dat de toestemming omzeilt.
 *
 * ── Nooit in de weg ───────────────────────────────────────────────────────
 * Dit draait in de klik-handler van een link die de browser meteen daarna
 * volgt. Alles staat in een try/catch en er wordt niets afgewacht: een fout in
 * de meting mag nooit een verkoop kosten.
 */

export interface OutboundKlik {
  /** Naar wie: 'ClubTickets', 'Click&Boat', 'Wiber Rent a Car'. */
  partner: string
  /** Waar de klik vandaan kwam: 'event', 'homepage-tonight', 'boats'. */
  surface: string
  /** Wat er geklikt werd, voor zover we dat weten. */
  item?: string
  /** Vanafprijs in euro's, als die op het scherm stond. */
  value?: number
}

export function trackOutbound({ partner, surface, item, value }: OutboundKlik): void {
  try {
    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag
    if (typeof gtag !== 'function') return
    // 'select_promotion' bestaat al in GA4 en verschijnt vanzelf in de
    // standaardrapporten. Een eigen naam zou je eerst als aangepaste
    // dimensie moeten aanmelden voordat je er iets van ziet.
    gtag('event', 'select_promotion', {
      promotion_name: partner,
      creative_slot: surface,
      items: item ? [{ item_name: item, price: value }] : undefined,
      value,
      currency: value ? 'EUR' : undefined,
    })
  } catch {
    // Meten is nooit belangrijker dan de klik zelf.
  }
}
