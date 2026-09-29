import Link from 'next/link'
import { CalendarDays, Ticket } from 'lucide-react'

import { getArtists, getAllDates, getVenues, getArtistDates } from '@/lib/clubtickets'
import { venuePagePublished } from '@/lib/pending-venues'
import { eventBasePath } from '@/lib/event-path'
import { withDate } from '@/lib/event-date-param'
import { priceNumbers } from '@/lib/price-parse'
import { fmtShortDate } from '@/lib/date-label'
import { ARTIST_NEXT_STEP_COPY } from '@/lib/artist-next-step-copy'
import type { Locale } from '@/lib/seo'

/**
 * De vervolgstap onderaan een artiestpagina.
 *
 * De artiestpagina's zijn het grootste paginatype na de venues en liepen dood:
 * binnen `<main>` gemeten twee uitgaande links, allebei naar het overzicht.
 * Zie de toelichting in artist-next-step-copy.ts.
 *
 * Server-gerenderd, zoals alles hier: de kaarten staan in de eerste HTML, dus
 * een crawler zonder JavaScript ziet deze route ook.
 */

const MAX = 6

interface Kaart {
  slug: string
  naam: string
  dag: string
  club: string
  href: string
  prijs: number | null
}

export async function ArtistNextStep({
  locale,
  currentSlug,
}: {
  locale: Locale
  currentSlug: string
}) {
  const C = ARTIST_NEXT_STEP_COPY[locale]
  const [artiesten, dates, venues] = await Promise.all([
    getArtists(locale),
    getAllDates(locale),
    getVenues(locale),
  ])

  // Venue-type per slug: bepaalt onder welke routefamilie de eventpagina leeft.
  // Een activiteit onder /club-tickets linken is een gegarandeerde 404.
  const typeBySlug = new Map<string, string>()
  for (const v of venues) {
    if (v.slug) typeBySlug.set(v.slug, String((v as any).type?.slug || ''))
  }

  // `getAllDates()` geeft alleen wat nog komt, dus een artiest zonder
  // eerstvolgende datum valt hier vanzelf af — net als in de sitemap.
  const kaarten: Kaart[] = []
  for (const a of artiesten) {
    if (!a.slug || a.slug === currentSlug) continue
    const eigen = await getArtistDates(a.name, locale, a.slug)
    if (eigen.length === 0) continue
    // Eerstvolgende avond van deze artiest. De lijst is oplopend gesorteerd,
    // maar we nemen expliciet het minimum: op de volgorde van een partnerfeed
    // vertrouwen is precies hoe je stil de verkeerde datum toont.
    let eerste = eigen[0]
    for (const d of eigen) {
      if (String(d.date).localeCompare(String(eerste.date)) < 0) eerste = d
    }
    if (!eerste.venueSlug || !eerste.eventSlug) continue
    // Een club die nog achter een afspraak zit heeft geen pagina; een kaart
    // die naar een 404 wijst is erger dan geen kaart.
    if (!venuePagePublished(eerste.venueSlug)) continue
    const prijzen = priceNumbers(eerste.prices)
    kaarten.push({
      slug: a.slug,
      naam: a.name,
      dag: String(eerste.date).slice(0, 10),
      club: eerste.venueName || '',
      // `?date=` want deze kaart is per avond: zonder die parameter opent de
      // eventpagina op de eerstvolgende datum van dát event.
      href: withDate(
        `/${locale}/${eventBasePath(typeBySlug.get(eerste.venueSlug))}/${eerste.venueSlug}/${eerste.eventSlug}`,
        String(eerste.date).slice(0, 10),
      ),
      prijs: prijzen.length ? prijzen[0] : null,
    })
  }

  // Deterministisch: op datum, en bij gelijke datum op naam. Dit rendert
  // server-side, dus geen Math.random en geen Date.now.
  kaarten.sort((a, b) => a.dag.localeCompare(b.dag) || a.naam.localeCompare(b.naam))
  const tonen = kaarten.slice(0, MAX)
  if (tonen.length === 0) return null

  return (
    // Eigen achtergrond, want deze pagina is donker (theme-monaco-vip) en een
    // blok zonder eigen ondergrond erft die van body. Zie CLAUDE.md.
    <section className="border-t border-white/15 bg-[var(--imv-ink)] pb-28 text-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* h2: de pagina heeft al een h1 met de artiestnaam. */}
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{C.heading}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{C.intro(tonen.length)}</p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tonen.map((k) => (
            <li key={k.slug}>
              <Link
                href={k.href}
                className="group flex h-full flex-col rounded-2xl border border-white/15 bg-white/5 p-4 transition-colors hover:border-ibiza-green hover:bg-white/10"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/60">
                  <CalendarDays size={12} className="text-ibiza-green" />
                  {fmtShortDate(k.dag, locale)}
                </div>
                <div className="mt-1.5 font-serif text-base font-bold leading-tight">{k.naam}</div>
                {k.club && <div className="mt-0.5 line-clamp-1 text-sm text-white/70">{k.club}</div>}
                <div className="mt-3 flex items-end justify-between gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ibiza-green">
                    <Ticket size={14} />
                    {C.tickets}
                  </span>
                  {/* Geen prijs in de feed, geen prijs op de kaart. */}
                  {k.prijs != null && (
                    <span className="whitespace-nowrap text-sm text-white/70">
                      {C.from} €{k.prijs}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={`/${locale}/artists`}
            className="inline-flex items-center rounded-full border border-white/25 px-4 py-2 text-sm font-bold transition-colors hover:bg-white hover:text-black"
          >
            {C.allArtists}
          </Link>
          <Link
            href={`/${locale}/calendar`}
            className="inline-flex items-center rounded-full border border-white/25 px-4 py-2 text-sm font-bold transition-colors hover:bg-white hover:text-black"
          >
            {C.calendar}
          </Link>
        </div>
      </div>
    </section>
  )
}
