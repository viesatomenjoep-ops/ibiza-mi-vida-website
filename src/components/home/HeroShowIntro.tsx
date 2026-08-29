'use client'

import { useEffect, useState } from 'react'

// The fixed headline, plus the supporting lines that rotate underneath it.
const HEADLINE: Record<string, string> = {
  nl: 'Jouw exclusieve sleutel tot Ibiza.',
  en: 'Your exclusive key to Ibiza.',
  es: 'Tu llave exclusiva a Ibiza.',
  de: 'Dein exklusiver Schlüssel zu Ibiza.',
  fr: 'Votre clé exclusive pour Ibiza.',
}

const SUBLINES: Record<string, string[]> = {
  nl: [
    'Van privéjachten tot de beste clubs en unieke activiteiten.',
    'Boek jouw ultieme eilandervaring op één platform.',
  ],
  en: [
    'From private yachts to the best clubs and unique activities.',
    'Book your ultimate island experience on one platform.',
  ],
  es: [
    'Desde yates privados hasta los mejores clubs y actividades únicas.',
    'Reserva tu experiencia isleña definitiva en una sola plataforma.',
  ],
  de: [
    'Von Privatyachten bis zu den besten Clubs und einzigartigen Aktivitäten.',
    'Buche dein ultimatives Inselerlebnis auf einer Plattform.',
  ],
  fr: [
    'Des yachts privés aux meilleurs clubs et activités uniques.',
    'Réservez votre expérience insulaire ultime sur une seule plateforme.',
  ],
}

/**
 * Hero headline + rotating subline.
 *
 * PERF — why this is no longer a typewriter:
 *
 * This block contains the largest text on the page, so it is the LCP element.
 * The previous version typed three lines character-by-character on a loop,
 * starting from an empty string. Two things made that catastrophic for LCP:
 *
 *  1. The text did not exist in the server HTML at all, so the largest element
 *     on the page only appeared after hydration + a 350ms delay + ~3.2s of
 *     typing.
 *  2. LCP tracks the largest text rect painted *so far*, and typing makes the
 *     rect grow monotonically — measured 3,735px² → 31,952px² for a single
 *     line. Every growth step registered a new, later LCP candidate, so LCP
 *     kept being pushed back for as long as the loop ran.
 *
 * Point 2 is the important one: it means no amount of reordering or
 * pre-rendering can fix a typewriter. Any animation that grows the biggest text
 * on the page will always drag LCP out with it. Measured: LCP 7.0s, of which
 * 6.26s was render delay attributable to this component alone.
 *
 * So the headline is now static and fully server-rendered — its rect is final
 * at first paint — and the rotating copy moved to a subline that cross-fades
 * (opacity only, never resizing) at a much smaller font size, so it can never
 * become a larger candidate than the headline above it. Its height is reserved
 * to keep CLS at zero.
 */
export function HeroShowIntro({ locale = 'nl' }: { locale?: string }) {
  const headline = HEADLINE[locale] || HEADLINE.en
  const sublines = SUBLINES[locale] || SUBLINES.en
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    // Hold the line, fade it out, swap it, fade the next one in.
    timers.push(setTimeout(() => {
      if (cancelled) return
      setVisible(false)
      timers.push(setTimeout(() => {
        if (cancelled) return
        setI(p => (p + 1) % sublines.length)
        setVisible(true)
      }, 450))
    }, 4200))
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [i, sublines])

  return (
    <div className="flex w-full max-w-3xl flex-col items-center">
      <h2
        className="hero-line-in font-serif font-black uppercase leading-[1.06] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]"
        style={{ fontSize: 'clamp(2rem, 6.4vw, 3.8rem)' }}
      >
        {headline}
      </h2>
      {/* Fixed height: the two sublines wrap to different line counts, and
          without a reserved box the swap would shift the layout. */}
      <p
        className="mt-4 flex min-h-[3.2em] items-start justify-center text-balance px-2 font-sans text-sm font-medium leading-[1.5] text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.8)] transition-opacity duration-[450ms] sm:text-base"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {sublines[i]}
      </p>
    </div>
  )
}
