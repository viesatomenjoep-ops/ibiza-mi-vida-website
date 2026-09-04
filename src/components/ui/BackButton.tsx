'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const LABELS: Record<string, string> = {
  nl: 'Terug',
  en: 'Back',
  es: 'Atrás',
  de: 'Zurück',
  fr: 'Retour',
}

/** How long the button stays visible before fading out of the way. */
const IDLE_MS = 3000

/**
 * Round back button.
 *
 * The arrow is always the emerald accent, never white. The "top" variant used
 * to be `bg-white/90 text-white` — a white arrow on a white circle, invisible
 * until hovered. Same trap that has bitten several components here: on a light
 * surface the icon colour has to be stated, not inherited.
 *
 * Hij vervaagt na drie seconden zodat hij de inhoud niet blijft afdekken, en
 * komt terug bij hover, toetsenbordfocus of een opwaartse veeg.
 *
 * ── Waarom dat nu ook op een telefoon gebeurt ─────────────────────────────
 * Dit stond eerst alleen aan waar hover bestaat, met de redenering dat een
 * knop die zichzelf verbergt op een touchscreen voorgoed weg is. Dat klopte
 * niet met de praktijk: juist op mobiel bleef hij dus altijd staan en dekte
 * hij de kop en de eerste regels tekst af — zichtbaar op de agenda, de
 * eventpagina en de dossierpagina.
 *
 * Twee dingen maken het op touch alsnog veilig. Een telefoonbrowser heeft
 * zijn eigen terugknop onderin beeld, dus onze zwevende knop is daar een
 * extra en niet de enige uitweg. En hij komt terug zodra je omhoog scrolt —
 * de beweging die vrijwel altijd vooafgaat aan "ik wil hier weg".
 *
 * Hij wordt nooit uit de DOM gehaald en behoudt zijn plek in de tabvolgorde;
 * alleen de dekking gaat naar nul.
 *
 * `variant`:
 *  - "hero" (default): absolute, bottom-right of a relative hero image
 *  - "top": fixed, just under the navbar (top-left)
 */
export function BackButton({
  locale = 'nl',
  fallbackHref,
  variant = 'hero',
}: {
  locale?: string
  fallbackHref?: string
  variant?: 'hero' | 'top'
}) {
  const router = useRouter()
  const label = LABELS[locale] || LABELS.en
  const [dimmed, setDimmed] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const canHover = useRef(true)

  useEffect(() => {
    canHover.current = window.matchMedia?.('(hover: hover)').matches ?? true
    timer.current = setTimeout(() => setDimmed(true), IDLE_MS)

    // Omhoog scrollen brengt hem terug: dat is de beweging die voorafgaat aan
    // "ik wil hier weg", en op touch het enige signaal dat we hebben.
    let vorige = window.scrollY
    const opScroll = () => {
      const nu = window.scrollY
      if (nu < vorige - 8) {
        setDimmed(false)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setDimmed(true), IDLE_MS)
      }
      vorige = nu
    }
    window.addEventListener('scroll', opScroll, { passive: true })
    return () => {
      if (timer.current) clearTimeout(timer.current)
      window.removeEventListener('scroll', opScroll)
    }
  }, [])

  const wake = () => {
    setDimmed(false)
    if (timer.current) clearTimeout(timer.current)
  }
  const rest = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDimmed(true), IDLE_MS)
  }

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else if (fallbackHref) {
      router.push(fallbackHref)
    } else {
      router.push(`/${locale}`)
    }
  }

  // Emerald arrow on a light disc in both variants, so the icon reads against
  // a photo and against the page.
  const cls = variant === 'top'
    ? 'fixed left-3 top-[calc(var(--nav-h)+4px)] z-[120] border-black/10 bg-white/95 text-ibiza-green backdrop-blur-md hover:bg-white md:left-5'
    : 'absolute bottom-3 right-3 z-30 border-black/10 bg-white/95 text-ibiza-green backdrop-blur-md hover:bg-white md:bottom-4 md:right-4'

  return (
    <button
      type="button"
      onClick={goBack}
      onMouseEnter={wake}
      onMouseLeave={rest}
      onFocus={wake}
      onBlur={rest}
      aria-label={label}
      title={label}
      className={`grid h-11 w-11 place-items-center rounded-full border shadow-lg transition-[opacity,background-color,transform] duration-500 ${cls} ${
        dimmed ? 'pointer-events-none scale-90 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      <ArrowLeft size={19} strokeWidth={2.5} />
    </button>
  )
}
