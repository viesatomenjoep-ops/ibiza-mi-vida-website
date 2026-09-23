import Link from 'next/link'
import { getAllEvents } from '@/lib/clubtickets'
import { pathFor, localesFor, type RouteKey } from '@/lib/route-slugs'
import { ibizaToday } from '@/lib/date-label'
import { FEATURED_TRIPS } from '@/lib/featured-trips-copy'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Redactioneel uitlicht-blok op de water-agendapagina's. Copy in
 * featured-trips-copy.ts; naam, laagste prijs en resterende afvaarten komen
 * bij elke render live uit de Clubtickets-feed — staat een event niet (meer)
 * in de feed of heeft het geen komende datums, dan valt zijn kaart weg in
 * plaats van verouderde cijfers te tonen.
 */

const FROM_LABEL: Record<Locale, string> = { nl: 'vanaf', en: 'from', de: 'ab', es: 'desde', fr: 'dès' }
const DEPARTURES_LABEL: Record<Locale, (n: number, until: string) => string> = {
  nl: (n, until) => `${n} afvaart${n === 1 ? '' : 'en'} t/m ${until}`,
  en: (n, until) => `${n} departure${n === 1 ? '' : 's'} until ${until}`,
  de: (n, until) => `${n} Abfahrt${n === 1 ? '' : 'en'} bis ${until}`,
  es: (n, until) => `${n} salida${n === 1 ? '' : 's'} hasta ${until}`,
  fr: (n, until) => `${n} départ${n === 1 ? '' : 's'} jusqu’au ${until}`,
}

/** Laagste bedrag uit een feed-prijsstring als "45 € - 80 €" of "70 €". */
function lowestPrice(prices: string[]): number | null {
  let min: number | null = null
  for (const p of prices) {
    // .match i.p.v. .matchAll: de tsconfig-target van deze repo staat onder
    // es2015 en downlevelIteration staat uit.
    const matches = p.match(/(\d+(?:[.,]\d+)?)\s*€/g) ?? []
    for (const m of matches) {
      const v = Number(m.replace('€', '').trim().replace(',', '.'))
      if (Number.isFinite(v) && (min === null || v < min)) min = v
    }
  }
  return min
}

function fmtDay(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(`${iso}T12:00:00`))
}

export async function FeaturedTrips({ pageKey, locale }: { pageKey: string; locale: string }) {
  const block = FEATURED_TRIPS[pageKey]
  if (!block) return null

  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const events = await getAllEvents(locale)
  const todayStr = ibizaToday()

  const cards = block.trips.flatMap((trip) => {
    const event = events.find((e) => e.slug === trip.eventSlug)
    if (!event) return []
    const upcoming = (event.dates ?? []).filter((d) => d.date >= todayStr)
    if (upcoming.length === 0) return []
    const last = upcoming[upcoming.length - 1]!.date
    const min = lowestPrice(upcoming.map((d) => d.prices))

    // 'route:<key>' = een gelokaliseerde route uit ROUTE_SLUGS; anders een
    // vast, locale-onafhankelijk pad.
    let href: string
    if (trip.href.startsWith('route:')) {
      const key = trip.href.slice(6) as RouteKey
      const talen = localesFor(key)
      href = pathFor(key, talen.includes(l) ? l : (talen[0] ?? 'en'))
    } else {
      href = `/${locale}${trip.href}`
    }

    return [{ event, blurb: trip.blurb[l], href, count: upcoming.length, last, min }]
  })

  if (cards.length === 0) return null

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{block.heading[l]}</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">{block.intro[l]}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.event.slug}
              href={c.href}
              className="group rounded-2xl border border-black/10 bg-neutral-50 p-6 transition-colors hover:border-black/30"
            >
              <h3 className="font-serif text-lg font-black leading-snug tracking-tight text-neutral-900 group-hover:underline">
                {c.event.name}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{c.blurb}</p>
              <p className="mt-4 text-sm font-medium text-neutral-900">
                {c.min !== null ? `${FROM_LABEL[l]} €${c.min % 1 === 0 ? c.min : c.min.toFixed(2)} · ` : ''}
                {DEPARTURES_LABEL[l](c.count, fmtDay(c.last, l))}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
