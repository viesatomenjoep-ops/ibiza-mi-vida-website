/**
 * Netjes naar een sectie scrollen, mét de vaste kop erboven ingecalculeerd.
 *
 * ── Wat er misging ────────────────────────────────────────────────────────
 * `.site-header` is `position:fixed` en er is geen compensatie op `main`.
 * `el.scrollIntoView({ block: 'start' })` zet de sectie tegen de bovenrand van
 * het VIEWPORT, en dus achter die balk. Een `scroll-margin-top` lost dat op
 * voor de sectie zelf, maar niet voor wat er vlak bóven staat: op de agenda
 * zit de H1 ("Ibiza clubagenda 2026") daar, en die werd na het kiezen van een
 * datum precies doormidden gesneden door de balk. Er viel maar ~90px te
 * scrollen, dus de titel kon ook nooit netjes uit beeld raken — hij bleef half
 * hangen.
 *
 * ── De regel hieronder ────────────────────────────────────────────────────
 * Valt er minder dan een half scherm te scrollen, ga dan naar de bovenkant van
 * de pagina in plaats van naar de sectie. Je ziet dan de complete paginakop mét
 * de sectie eronder — precies zoals de pagina er bij binnenkomst uitziet — in
 * plaats van een afgesneden titel. Staat de sectie wél ver naar beneden, dan is
 * er echt iets om naartoe te scrollen en komt hij onder de balk te staan met
 * een marge eronder.
 *
 * Gebruik dit overal waar een datumkiezer, tab of knop de pagina verplaatst.
 * Nooit een vast getal voor de balkhoogte: die is 134px op desktop en 116px op
 * mobiel, en staat als `--nav-h` in globals.css.
 */

/** Hoogte van de vaste kop, uit `--nav-h`. */
export function navHeight(): number {
  if (typeof window === 'undefined') return 0
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
  const n = parseFloat(raw)
  if (Number.isFinite(n) && n > 0) return n
  // Valt de variabele weg, meet dan de balk zelf; nooit terugvallen op een
  // hardgecodeerd getal dat op één van de twee formaten fout is.
  const header = document.querySelector('.site-header') as HTMLElement | null
  return header?.offsetHeight ?? 0
}

export function scrollSectionIntoView(
  el: HTMLElement | null,
  opts: { gap?: number; behavior?: ScrollBehavior } = {},
): void {
  if (typeof window === 'undefined' || !el) return

  const gap = opts.gap ?? 16
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const behavior: ScrollBehavior = reduced ? 'auto' : opts.behavior ?? 'smooth'

  const docTop = window.scrollY + el.getBoundingClientRect().top
  const onder = docTop - navHeight() - gap

  // Minder dan een half scherm te winnen → naar boven; zie de kop hierboven.
  const target = onder < window.innerHeight * 0.5 ? 0 : onder

  window.scrollTo({ top: Math.max(0, target), behavior })
}
