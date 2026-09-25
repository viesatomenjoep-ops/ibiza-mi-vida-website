import Link from 'next/link'
import { CalendarDays, Ticket } from 'lucide-react'

import { getVenues, getAllDates } from '@/lib/clubtickets'
import { venuePagePublished } from '@/lib/pending-venues'
import { eventBasePath } from '@/lib/event-path'
import { withDate } from '@/lib/event-date-param'
import { priceNumbers } from '@/lib/price-parse'
import { fmtShortDate, ibizaTonight } from '@/lib/date-label'
import { sectionLabel } from '@/components/seo/BreadcrumbJsonLd'
import { VENUE_NEXT_STEP_COPY } from '@/lib/venue-next-step-copy'
import type { Locale } from '@/lib/seo'

/**
 * De vervolgstap onderaan een venuepagina.
 *
 * De venuepagina's zijn het grootste paginatype van de site en liepen dood:
 * binnen `<main>` gemeten had een clubpagina één uitgaande link en een
 * activiteitenpagina nul — alle links wezen naar de eigen avonden van die ene
 * venue. Zie de toelichting in venue-next-step-copy.ts.
 *
 * Wat dit blok bewust NIET doet is venues vergelijken of nabijheid beloven: de
 * feed draagt geen adres en geen oordeel. Het toont alleen andere venues van
 * dezelfde soort waarvoor we nú tickets verkopen, met hun eerstvolgende datum.
 *
 * Server-gerenderd: de kaarten staan in de eerste HTML, dus een crawler zonder
 * JavaScript ziet deze route ook. `VenueDetailPage` is een client-component en
 * kan dit dus niet zelf ophalen; dit blok staat er als los broertje naast.
 */

const MAX = 6

/** Waar "alles van deze soort" staat. Clubs hebben een eigen hub, de rest niet. */
const HUB_BY_FAMILY: Record<string, string> = {
  'club-tickets': 'clubs',
}

interface Kaart {
  key: string
  day: string
  venueSlug: string
  venueName: string
  eventName: string
  href: string
  price: number | null
}

export async function VenueNextStep({
  locale,
  typeSlug,
  currentSlug,
}: {
  locale: Locale
  /** De `type.slug` van de huidige venue, bv. `clubbing`. */
  typeSlug: string
  currentSlug: string
}) {
  const C = VENUE_NEXT_STEP_COPY[locale]
  // De familie komt uit het venue-type en niet uit de route waarop we staan:
  // /tours en /water-sports dragen allebei venues van het type `activities`,
  // en hun eventpagina's leven onder /activities. Kop, kaarten en de link naar
  // "alles van deze soort" moeten dus alle drie dezelfde familie noemen —
  // anders staat er "andere tours" boven een rij activiteiten.
  const familie = eventBasePath(typeSlug)
  const soort = sectionLabel(familie, locale)
  const [venues, dates] = await Promise.all([getVenues(locale), getAllDates(locale)])

  // Alleen venues van dezelfde soort, die een pagina hebben en niet de huidige
  // zijn. `venuePagePublished` houdt de clubs weg die nog achter een afspraak
  // zitten — een kaart naar een pagina die 404't is erger dan geen kaart.
  const passend = new Set(
    venues
      .filter((v) => String((v as any).type?.slug || '') === typeSlug)
      .filter((v) => v.slug && v.slug !== currentSlug && venuePagePublished(v.slug))
      .map((v) => v.slug as string),
  )
  if (passend.size === 0) return null

  const vanaf = ibizaTonight()
  // Eén kaart per venue: de eerstvolgende datum die hij heeft. Een club die
  // zeven avonden per week draait zou het blok anders in zijn eentje vullen.
  const eerste = new Map<string, Kaart>()
  for (const d of dates) {
    const dag = String(d.date || '').slice(0, 10)
    if (!d.venueSlug || !d.eventSlug || !passend.has(d.venueSlug)) continue
    if (dag < vanaf) continue
    const bestaand = eerste.get(d.venueSlug)
    if (bestaand && bestaand.day <= dag) continue
    const prijzen = priceNumbers(d.prices)
    eerste.set(d.venueSlug, {
      key: d.venueSlug,
      day: dag,
      venueSlug: d.venueSlug,
      venueName: d.venueName || '',
      eventName: d.eventName || d.name || '',
      // `?date=` want deze kaart is per avond: zonder die parameter opent de
      // eventpagina op de eerstvolgende datum van dát event en niet op de
      // datum die hier op de kaart staat. Zie event-date-param.ts.
      href: withDate(`/${locale}/${familie}/${d.venueSlug}/${d.eventSlug}`, dag),
      price: prijzen.length ? prijzen[0] : null,
    })
  }

  // Deterministisch: op datum, en bij gelijke datum op naam. Dit rendert
  // server-side, dus geen Math.random en geen Date.now.
  const kaarten = Array.from(eerste.values())
    .sort((a, b) => a.day.localeCompare(b.day) || a.venueName.localeCompare(b.venueName))
    .slice(0, MAX)
  if (kaarten.length === 0) return null

  const hub = `/${locale}/${HUB_BY_FAMILY[familie] || familie}`

  return (
    // pb-28: de pagina heeft een vaste balk onderin, dus het laatste blok moet
    // zelf ruimte reserveren of het verdwijnt eronder.
    <section className="border-t border-black/10 bg-neutral-50 pb-28">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* h2: de pagina heeft al een h1 met de naam van de venue. */}
        <h2 className="font-serif text-2xl font-black tracking-tight text-black md:text-3xl">{C.heading(soort)}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/65">{C.intro(kaarten.length, soort)}</p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kaarten.map((k) => (
            <li key={k.key}>
              <Link
                href={k.href}
                className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white p-4 transition-colors hover:border-ibiza-green"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-black/55">
                  <CalendarDays size={12} className="text-ibiza-green" />
                  {fmtShortDate(k.day, locale)}
                </div>
                <div className="mt-1.5 font-serif text-base font-bold leading-tight text-black">{k.venueName}</div>
                <div className="mt-0.5 line-clamp-2 text-sm text-black/70">{k.eventName}</div>
                <div className="mt-3 flex items-end justify-between gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ibiza-green group-hover:text-black">
                    <Ticket size={14} />
                    {C.tickets}
                  </span>
                  {/* Geen prijs in de feed, geen prijs op de kaart — nooit een
                      placeholder, zie CLAUDE.md. */}
                  {k.price != null && (
                    <span className="whitespace-nowrap text-sm text-black/60">
                      {C.from} €{k.price}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={hub}
            className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            {C.allOf(soort)}
          </Link>
          <Link
            href={`/${locale}/calendar`}
            className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            {C.calendar}
          </Link>
        </div>
      </div>
    </section>
  )
}
