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
export function BackButton({ locale = 'nl', fallbackHref }: { locale?: string; fallbackHref?: string }) {
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

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={label}
      className="absolute bottom-3 right-3 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-3.5 py-2 text-sm font-black uppercase tracking-wide text-white shadow-lg backdrop-blur-md transition-all hover:bg-ibiza-green hover:text-black md:bottom-4 md:right-4"
    >
      <ArrowLeft size={17} strokeWidth={2.5} />
      {label}
    </button>
  )
}
