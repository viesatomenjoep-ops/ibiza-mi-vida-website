import Link from 'next/link'
import { CalendarDays, Ticket } from 'lucide-react'

import { getVenues, getAllDates } from '@/lib/clubtickets'
import { venuePagePublished } from '@/lib/pending-venues'
import { eventBasePath } from '@/lib/event-path'
import { withDate } from '@/lib/event-date-param'
import { priceNumbers } from '@/lib/price-parse'
import { fmtShortDate, ibizaTonight, addDays } from '@/lib/date-label'
import { PLACE_NEXT_STEP_COPY } from '@/lib/place-next-step-copy'
import type { Locale } from '@/lib/seo'
import type { Island } from '@/lib/locations'

/**
 * De vervolgstap onderaan een plaatspagina.
 *
 * De plaatspagina's waren doodlopend: in `<main>` stonden vijf links, en dat
 * waren "terug naar alle plaatsen" plus vier andere plaatspagina's. Geen
 * agenda, geen ticket, geen boot. Wie via Google op "es canar" binnenkwam kon
 * dus alleen zijwaarts naar de volgende plaatspagina of weg.
 *
 * Wat dit blok bewust NIET doet is beweren dat een club in de buurt ligt. De
 * venues in de ClubTickets-feed hebben geen adresveld, en de plaatsnaam komt
 * maar bij 5 van de 21 plaatsen in de venuetekst voor — bij Playa d'en Bossa
 * zou die match Ushuaïa en Hï juist overslaan. Zie `place-next-step-copy.ts`.
 *
 * Server-gerenderd, zoals alles op deze site: de avonden staan in de eerste
 * HTML, dus een crawler zonder JavaScript ziet de commerciële route ook.
 */

const MAX = 6
/** Zeven dagen vooruit: hetzelfde venster als /this-week. */
const DAGEN = 6

interface Avond {
  key: string
  day: string
  venueSlug: string
  venueName: string
  href: string
  eventName: string
  /** Laagste geadverteerde entree; ontbreekt hij, dan tonen we geen prijs. */
  price: number | null
}

export async function PlaceNextStep({
  locale,
  island,
  placeName,
}: {
  locale: Locale
  island: Island
  placeName: string
}) {
  const C = PLACE_NEXT_STEP_COPY[locale]
  const [venues, dates] = await Promise.all([getVenues(locale), getAllDates(locale)])

  // Formentera-plaatsen krijgen de overtocht, Ibiza-plaatsen de clubagenda.
  // Dat is het enige geografische onderscheid dat de data wél draagt: het
  // eiland staat in `locations.ts`, de afstand tot een club nergens.
  const soort = island === 'formentera' ? 'formentera-day-trip' : 'clubbing'
  const typeBySlug = new Map<string, string>()
  for (const v of venues) {
    if (!v.slug) continue
    typeBySlug.set(v.slug, String((v as any).type?.slug || ''))
  }
  const passend = new Set(
    venues
      .filter((v) => String((v as any).type?.slug || '') === soort)
      // Een club die nog achter een afspraak zit heeft geen pagina; die hoort
      // hier dus ook niet als kaart te staan (zie pending-venues.ts).
      .filter((v) => v.slug && venuePagePublished(v.slug))
      .map((v) => v.slug as string),
  )

  const vanaf = ibizaTonight()
  const tot = addDays(vanaf, DAGEN)
  const gezien = new Set<string>()
  const perDag = new Map<string, Avond[]>()
  for (const d of dates) {
    const dag = String(d.date || '').slice(0, 10)
    if (!d.venueSlug || !d.eventSlug || !passend.has(d.venueSlug)) continue
    if (dag < vanaf || dag > tot) continue
    // Eén kaart per club per dag: een club die drie zalen tegelijk draait zou
    // het blok anders in zijn eentje vullen.
    const sleutel = `${d.venueSlug}|${dag}`
    if (gezien.has(sleutel)) continue
    gezien.add(sleutel)
    const basis = eventBasePath(typeBySlug.get(d.venueSlug))
    const prijzen = priceNumbers(d.prices)
    const rij = perDag.get(dag) ?? []
    rij.push({
      key: `${d.id}-${d.eventSlug}`,
      day: dag,
      venueSlug: d.venueSlug,
      venueName: d.venueName || '',
      eventName: d.eventName || d.name || '',
      // `?date=` want deze lijst is per avond: zonder die parameter opent de
      // eventpagina op de eerstvolgende datum en niet op de datum die hier
      // op de kaart staat. Zie event-date-param.ts.
      href: withDate(`/${locale}/${basis}/${d.venueSlug}/${d.eventSlug}`, dag),
      price: prijzen.length ? prijzen[0] : null,
    })
    perDag.set(dag, rij)
  }

  // Een ronde langs de dagen in plaats van de kop van de lijst, en per club
  // hooguit één kaart. Zonder het eerste stonden alle zes de kaarten op
  // vanavond — wie op dinsdag voor zaterdag plant zag zijn eigen weekend niet.
  // Zonder het tweede stonden er zes avonden van dezelfde club, want die staat
  // elke dag bovenaan in de feed. Zes dagen én zes clubs laat zien dat er wat
  // te kiezen valt, en dat is wat dit blok moet doen.
  //
  // Deterministisch (dagen op datum, binnen een dag de feedvolgorde): dit
  // rendert server-side, dus geen Math.random en geen Date.now.
  const dagen = Array.from(perDag.keys()).sort()
  const avonden: Avond[] = []
  const gekozen = new Set<string>()
  const clubs = new Set<string>()
  const vul = (clubUniek: boolean) => {
    for (let ronde = 0; avonden.length < MAX; ronde++) {
      let gepakt = false
      for (const dag of dagen) {
        if (avonden.length >= MAX) break
        const kandidaat = (perDag.get(dag) ?? []).find(
          (c) => !gekozen.has(c.key) && (!clubUniek || !clubs.has(c.venueSlug)),
        )
        if (!kandidaat) continue
        avonden.push(kandidaat)
        gekozen.add(kandidaat.key)
        clubs.add(kandidaat.venueSlug)
        gepakt = true
      }
      if (!gepakt) break
    }
  }
  vul(true)
  // Buiten het hoogseizoen draaien er minder clubs dan er dagen zijn; dan vult
  // een tweede ronde het blok aan in plaats van het half leeg te laten.
  vul(false)
  avonden.sort((a, b) => a.day.localeCompare(b.day) || a.venueName.localeCompare(b.venueName))

  const routes =
    island === 'formentera'
      ? [
          { href: `/${locale}/ferry-formentera`, label: C.moreFerry },
          { href: `/${locale}/private-boat-charters`, label: C.moreBoats },
          { href: `/${locale}/calendar`, label: C.moreCalendar },
        ]
      : [
          { href: `/${locale}/calendar`, label: C.moreCalendar },
          { href: `/${locale}/this-week`, label: C.moreWeek },
          { href: `/${locale}/private-boat-charters`, label: C.moreBoats },
        ]

  return (
    <section className="border-t border-black/10 bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* h2: de pagina heeft al een h1 met de plaatsnaam. */}
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{C.heading(placeName)}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/65">
          {avonden.length === 0
            ? C.nothingScheduled
            : island === 'formentera'
              ? C.introFormentera
              : C.introIbiza(avonden.length)}
        </p>

        {avonden.length > 0 && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {avonden.map((a) => (
              <li key={a.key}>
                <Link
                  href={a.href}
                  className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white p-4 transition-colors hover:border-ibiza-green"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-black/55">
                    <CalendarDays size={12} className="text-ibiza-green" />
                    {fmtShortDate(a.day, locale)}
                  </div>
                  <div className="mt-1.5 font-serif text-base font-bold leading-tight">{a.venueName}</div>
                  <div className="mt-0.5 line-clamp-2 text-sm text-black/70">{a.eventName}</div>
                  <div className="mt-3 flex items-end justify-between gap-2 pt-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ibiza-green group-hover:text-black">
                      <Ticket size={14} />
                      {island === 'formentera' ? C.crossing : C.tickets}
                    </span>
                    {/* Geen prijs in de feed, geen prijs op de kaart — nooit een
                        placeholder, zie CLAUDE.md. */}
                    {a.price != null && (
                      <span className="whitespace-nowrap text-sm text-black/60">
                        {C.from} €{a.price}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
