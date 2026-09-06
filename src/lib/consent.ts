/**
 * Toestemming voor trackers van derden.
 *
 * ── Wat hier wel en niet onder valt ───────────────────────────────────────
 * Onder de ePrivacy-regels heb je toestemming nodig voordat je iets opslaat op
 * of uitleest van het apparaat van een bezoeker, tenzij het strikt noodzakelijk
 * is voor een dienst die de bezoeker zelf vroeg. Op deze site betekent dat:
 *
 *   NODIG   — Google Analytics 4, Impact affiliate-tracking en de TikTok-feed
 *             onderaan de homepage. Alle drie zetten identifiers en delen data
 *             met derden. De feed haalt daarom niets op zolang hier geen
 *             'granted' staat; zie HomeTikTok, die ook op CONSENT_EVENT
 *             luistert zodat een latere ja meteen aankomt.
 *   NIET    — de winkelwagen, de taalkeuze-cookie en de first-touch attributie
 *             in sessionStorage. Die laatste is bewust zo gebouwd: hij verlaat
 *             de browser alleen op een lead die de bezoeker zelf verstuurt,
 *             sterft met het tabblad en volgt niemand tussen sites. Zie de kop
 *             van lib/attribution.ts.
 *
 * ── Waarom localStorage en geen cookie ────────────────────────────────────
 * Ironisch maar juist: de toestemming zelf vastleggen mag zonder toestemming,
 * want zonder die registratie zou je het bij elke pagina opnieuw moeten vragen.
 * localStorage is hier eenvoudiger dan een cookie en wordt niet meegestuurd
 * met elk verzoek.
 *
 * ── Juridische randvoorwaarden die in de UI zitten ────────────────────────
 * Weigeren moet net zo makkelijk zijn als accepteren — dus twee knoppen naast
 * elkaar met gelijk gewicht, geen weggemoffelde tekstlink. Niets staat vooraf
 * aangevinkt. En de keuze moet herroepbaar zijn, vandaar `clearConsent()` en
 * de link in de footer.
 */

const KEY = 'imv_consent'

export type ConsentState = 'granted' | 'denied' | 'unset'

/** Verandert wanneer de gebruiker kiest, zodat componenten kunnen reageren. */
export const CONSENT_EVENT = 'imv:consent'

export function getConsent(): ConsentState {
  if (typeof window === 'undefined') return 'unset'
  try {
    const v = localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : 'unset'
  } catch {
    // Privémodus of opslag uit: dan is er geen toestemming vastgelegd, en
    // "geen toestemming" is de veilige aanname.
    return 'unset'
  }
}

export function setConsent(value: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, value)
  } catch {
    /* niet kunnen opslaan mag de keuze niet laten mislukken */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

/** Keuze intrekken — de banner komt daarna terug. */
export function clearConsent(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* leeg */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: 'unset' }))
}
