'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, CalendarDays } from 'lucide-react'
import { ArrowCircle } from '@/components/ui/ArrowCircle'

export interface ActivityCard {
  slug: string
  name: string
  image: string
  /** Upcoming dates we hold for this provider. */
  count: number
  /** Lowest advertised price in EUR across those dates, 0 when unknown. */
  fromPrice: number
  /** ISO yyyy-mm-dd of the next date, empty when none. */
  nextDate: string
}

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

const SEARCH_PH: L = {
  nl: 'Zoek een activiteit…', en: 'Search an activity…', de: 'Aktivität suchen…',
  es: 'Buscar una actividad…', fr: 'Rechercher une activité…',
}
const FROM: L = { nl: 'vanaf', en: 'from', de: 'ab', es: 'desde', fr: 'dès' }
const DATES: L = { nl: 'data beschikbaar', en: 'dates available', de: 'Termine verfügbar', es: 'fechas disponibles', fr: 'dates disponibles' }
const NEXT: L = { nl: 'eerstvolgende', en: 'next', de: 'nächster', es: 'próxima', fr: 'prochaine' }
const NONE: L = {
  nl: 'Niets gevonden. Probeer een andere zoekterm.',
  en: 'Nothing found. Try a different search.',
  de: 'Nichts gefunden. Versuche einen anderen Suchbegriff.',
  es: 'No hay resultados. Prueba con otra búsqueda.',
  fr: 'Aucun résultat. Essayez un autre terme.',
}
const COUNT_LBL: L = {
  nl: '{n} aanbieders', en: '{n} providers', de: '{n} Anbieter', es: '{n} proveedores', fr: '{n} prestataires',
}

const LOCALE_TAG: Record<string, string> = {
  nl: 'nl-NL', en: 'en-GB', de: 'de-DE', es: 'es-ES', fr: 'fr-FR',
}

/**
 * Activity selection grid, built to work like the club-tickets flow: browse a
 * grid, pick one, then choose a date on the detail page — rather than the
 * date-first agenda widget this page used to share with the ferry and boat
 * pages. Browsing by date is the wrong first question for an activity, where
 * people decide *what* before *when*.
 *
 * Every figure on a card is counted from the live feed: how many upcoming dates
 * we hold, the lowest advertised price among them, and the next one. Nothing is
 * shown when the data does not have it — a card with no price simply omits the
 * price line rather than inventing a "from" figure.
 */
export function ActivitiesGrid({ items, locale }: { items: ActivityCard[]; locale: string }) {
  const [q, setQ] = useState('')

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const list = needle ? items.filter((a) => a.name.toLowerCase().includes(needle)) : items
    // Most to choose from first — that is the most useful default ordering.
    return [...list].sort((a, b) => b.count - a.count)
  }, [items, q])

  const fmtDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    if (!y) return ''
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(LOCALE_TAG[locale] || 'en-GB', {
      day: 'numeric', month: 'short', timeZone: 'UTC',
    })
  }

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center gap-4">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(SEARCH_PH, locale)}
            className="w-full rounded-full border border-black/12 bg-white py-3 pl-11 pr-5 text-sm text-neutral-900 placeholder:text-black/45 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </label>
        <span className="text-xs font-black uppercase tracking-widest text-black/60">
          {t(COUNT_LBL, locale).replace('{n}', String(shown.length))}
        </span>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-black/10 bg-neutral-50 py-12 text-center text-sm text-neutral-600">
          {t(NONE, locale)}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => (
            <Link
              key={a.slug}
              href={`/${locale}/activities/${a.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white text-neutral-900 transition-all hover:border-gold hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-ibiza-mint">
                {a.image ? (
                  <Image
                    src={a.image}
                    alt={a.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                {a.fromPrice > 0 ? (
                  <span className="absolute right-3 top-3 rounded-full bg-ibiza-green px-3 py-1 text-xs font-black text-white shadow">
                    {t(FROM, locale)} €{a.fromPrice}
                  </span>
                ) : null}
              </span>

              <span className="flex flex-1 flex-col gap-2 p-5">
                <strong className="font-serif text-lg font-black leading-tight">{a.name}</strong>
                <span className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <CalendarDays size={13} />
                  {a.count} {t(DATES, locale)}
                  {a.nextDate ? ` · ${t(NEXT, locale)} ${fmtDate(a.nextDate)}` : ''}
                </span>
                <span className="mt-auto flex items-center justify-end pt-2">
                  <ArrowCircle
                    size={34}
                    iconSize={15}
                    className="bg-ibiza-mint text-ibiza-green group-hover:bg-ibiza-green group-hover:text-white"
                  />
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
