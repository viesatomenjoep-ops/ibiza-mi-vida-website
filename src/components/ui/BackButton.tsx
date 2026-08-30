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
 * It fades out after a few seconds so it stops covering the photo, and returns
 * on hover or keyboard focus. Two details that matter:
 *
 *  - It fades but is never unmounted, and pointer events stay on. Hovering the
 *    spot brings it back, and it stays in the tab order throughout.
 *  - The auto-hide only runs where a hover state actually exists. On a phone
 *    there is no hover, so a button that hid itself would be gone for good —
 *    for a back control that is a trap, not a flourish.
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
    if (!canHover.current) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    timer.current = setTimeout(() => setDimmed(true), IDLE_MS)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [])

  const wake = () => {
    setDimmed(false)
    if (timer.current) clearTimeout(timer.current)
  }
  const rest = () => {
    if (!canHover.current) return
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
        dimmed ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      <ArrowLeft size={19} strokeWidth={2.5} />
    </button>
  )
}
