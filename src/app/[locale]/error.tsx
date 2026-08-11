'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

type Locale = 'nl' | 'en' | 'de' | 'es' | 'fr'
type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const TITLE: T = L('Er ging iets mis', 'Something went wrong', 'Etwas ist schiefgelaufen', 'Algo salió mal', 'Une erreur est survenue')
const BODY: T = L(
  'Onze excuses — deze pagina kon niet worden geladen. Probeer het opnieuw, of ga terug naar de homepage.',
  'Sorry — this page could not be loaded. Please try again, or head back to the homepage.',
  'Entschuldigung — diese Seite konnte nicht geladen werden. Bitte versuche es erneut oder kehre zur Startseite zurück.',
  'Lo sentimos — no se pudo cargar esta página. Inténtalo de nuevo o vuelve al inicio.',
  'Désolé — cette page n’a pas pu être chargée. Réessayez, ou retournez à l’accueil.',
)
const RETRY: T = L('Opnieuw proberen', 'Try again', 'Erneut versuchen', 'Intentar de nuevo', 'Réessayer')
const HOME: T = L('Naar de homepage', 'Back to homepage', 'Zur Startseite', 'Ir al inicio', 'Retour à l’accueil')

// This is the boundary that would have caught the Supabase crash on
// /club-tickets/[slug]/[eventSlug] — instead of the generic Next.js
// "Application error" screen, visitors now see an on-brand page and the
// error is always logged (console + Sentry once a DSN is configured).
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname()
  const seg = pathname.split('/')[1]
  const locale = (['nl', 'en', 'de', 'es', 'fr'] as const).includes(seg as Locale) ? (seg as Locale) : 'nl'
  const base = `/${locale}`

  useEffect(() => {
    console.error('[LocaleErrorBoundary]', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="theme-monaco-vip flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center text-white">
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]" />
      <div className="relative">
        <h1 className="font-serif text-3xl font-black tracking-tight md:text-5xl">{TITLE[locale]}</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/65">{BODY[locale]}</p>
        {error.digest && (
          <p className="mt-3 text-xs text-white/30">ID: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-gold px-7 py-3.5 font-serif text-xs font-black uppercase tracking-widest text-obsidian transition-colors hover:bg-white"
          >
            {RETRY[locale]}
          </button>
          <Link
            href={base}
            className="rounded-full border border-white/25 px-7 py-3.5 font-serif text-xs font-black uppercase tracking-widest text-white transition-colors hover:border-white"
          >
            {HOME[locale]}
          </Link>
        </div>
      </div>
    </div>
  )
}
