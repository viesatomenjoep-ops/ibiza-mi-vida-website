'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const LABELS: Record<string, string> = {
  nl: 'Terug',
  en: 'Back',
  es: 'Atrás',
  de: 'Zurück',
  fr: 'Retour',
}

/**
 * Floating "back" pill, top-left, tucked under the navbar.
 * Works on every device/browser: uses router.back() with a safe fallback.
 */
/**
 * Back pill. `variant`:
 *  - "hero" (default): absolute, bottom-right of a relative hero image
 *  - "top": fixed, just under the navbar (top-left)
 */
export function BackButton({ locale = 'nl', fallbackHref, variant = 'hero' }: { locale?: string; fallbackHref?: string; variant?: 'hero' | 'top' }) {
  const router = useRouter()
  const label = LABELS[locale] || LABELS.en

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else if (fallbackHref) {
      router.push(fallbackHref)
    } else {
      router.push(`/${locale}`)
    }
  }

  const cls = variant === 'top'
    ? 'fixed left-3 top-[calc(var(--nav-h)+12px)] z-[120] border-black/10 bg-white/90 text-black backdrop-blur-md hover:bg-ibiza-green md:left-5'
    : 'absolute bottom-3 right-3 z-30 border-white/20 bg-black/55 text-white backdrop-blur-md hover:bg-ibiza-green hover:text-black md:bottom-4 md:right-4'

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-black uppercase tracking-wide shadow-lg transition-all ${cls}`}
    >
      <ArrowLeft size={17} strokeWidth={2.5} />
      {label}
    </button>
  )
}
