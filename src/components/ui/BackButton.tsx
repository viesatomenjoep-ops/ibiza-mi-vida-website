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
 * Round back button — icon only (the label lives in aria-label), permanently
 * visible on event/venue pages. `variant`:
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
    ? 'fixed left-3 top-[calc(var(--nav-h)+4px)] z-[120] border-black/10 bg-white/90 text-black backdrop-blur-md hover:bg-ibiza-green md:left-5'
    : 'absolute bottom-3 right-3 z-30 border-white/20 bg-black/55 text-white backdrop-blur-md hover:bg-ibiza-green hover:text-black md:bottom-4 md:right-4'

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={label}
      title={label}
      className={`grid h-11 w-11 place-items-center rounded-full border shadow-lg transition-colors ${cls}`}
    >
      <ArrowLeft size={19} strokeWidth={2.5} />
    </button>
  )
}
