import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DEFAULT_LOCALE, LOCALES, SITE_URL, type Locale } from '@/lib/seo'
import {
  getMonthData, monthName, publishableMonths, type MonthSlug,
} from '@/lib/month-pages'
import { MONTH_COPY, fill } from '@/lib/month-copy'
import { ItemListJsonLd } from '@/components/seo/ItemListJsonLd'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { Reveal } from '@/components/ui/Reveal'

export const revalidate = 3600

/** Only months with a real programme — see MIN_EVENTS in month-pages.ts. */
export async function generateStaticParams() {
  const months = await publishableMonths(DEFAULT_LOCALE)
  return LOCALES.flatMap((locale) => months.map((month) => ({ locale, month })))
}

const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata(
  { params }: { params: { locale: string; month: string } },
): Promise<Metadata> {
  const l = loc(params.locale)
  const data = await getMonthData(params.month as MonthSlug, l)
  if (!data) return {}

  const vars = {
    month: monthName(data.slug, l),
    year: data.year,
    events: data.eventCount,
    venues: data.venues.length,
  }
  const path = `ibiza-in/${data.slug}`
  const languages: Record<string, string> = {}
  for (const x of LOCALES) languages[x] = `${SITE_URL}/${x}/${path}`
  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}/${path}`

  return {
    title: fill(MONTH_COPY.title[l], vars),
    description: fill(MONTH_COPY.metaDescription[l], vars),
    alternates: { canonical: `${SITE_URL}/${l}/${path}`, languages },
  }
}

/**
 * "Ibiza in <month>" — a month-shaped view of the calendar.
 *
 * People plan a trip by month, and the site had nothing answering "what's on in
 * Ibiza in September"; the calendar answers "what's on tonight". Everything
 * here is counted from the live feed rather than written, so the page restates
 * itself on every sync instead of decaying — which is the whole point, since
 * stale pages are what makes a neglected blog a liability.
 */
export default async function MonthPage(
  { params }: { params: { locale: string; month: string } },
) {
  const l = loc(params.locale)
  const data = await getMonthData(params.month as MonthSlug, l)
  if (!data) notFound()

  const name = monthName(data.slug, l)
  const vars = { month: name, year: data.year, events: data.eventCount, venues: data.venues.length }
  const base = `/${l}`
  const SHOWN = 60
  const shown = data.events.slice(0, SHOWN)
  // Only link months that actually have a page. Linking all twelve would point
  // internal links at 404s for every out-of-season month.
  const others = (await publishableMonths(l)).filter((m) => m !== data.slug)

  const dateFmt = (iso: string) => {
    const [y, mo, d] = iso.split('-').map(Number)
    return new Date(Date.UTC(y, mo - 1, d)).toLocaleDateString(
      { nl: 'nl-NL', en: 'en-GB', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' }[l],
      { day: 'numeric', month: 'short', weekday: 'short', timeZone: 'UTC' },
    )
  }

  return (
    <main className="bg-white text-neutral-900">
      <BreadcrumbJsonLd
        locale={l}
        items={[
          { name: homeLabel(l), path: `${l}` },
          { name: fill(MONTH_COPY.title[l], vars) },
        ]}
      />
      <ItemListJsonLd
        entries={shown.map((e) => ({ name: `${e.name} — ${e.venueName}`, path: e.path }))}
        locale={l}
        name={fill(MONTH_COPY.title[l], vars)}
        totalCount={data.eventCount}
      />

      <section className="mx-auto max-w-5xl px-4 pb-10 pt-[calc(var(--nav-h)+48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
          {MONTH_COPY.kicker[l]}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black tracking-tight md:text-6xl">
          {fill(MONTH_COPY.title[l], vars)}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600">
          {fill(MONTH_COPY.intro[l], vars)}
        </p>
        {data.lastUpdated ? (
          <p className="mt-4 text-xs text-black/60">
            {MONTH_COPY.updated[l]} {data.lastUpdated.toISOString().slice(0, 10)}
          </p>
        ) : null}
      </section>

      {/* Venues open this month */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <Reveal>
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">
            {fill(MONTH_COPY.venuesTitle[l], vars)}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">{MONTH_COPY.venuesIntro[l]}</p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.venues.map((v) => (
              <Link
                key={v.slug}
                href={`${base}/${v.basePath}/${v.slug}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 text-neutral-900 transition-colors hover:border-gold"
              >
                <span className="truncate font-serif text-base font-black">{v.name}</span>
                <span className="shrink-0 rounded-full bg-ibiza-green px-2.5 py-1 text-xs font-black text-white">
                  {v.eventCount}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Artists */}
      {data.artists.length > 0 && (
        <section className="border-y border-black/5 bg-neutral-50 py-12">
          <Reveal className="mx-auto max-w-5xl px-4">
            <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">
              {fill(MONTH_COPY.artistsTitle[l], vars)}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-neutral-600">{MONTH_COPY.artistsIntro[l]}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {data.artists.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-neutral-800"
                >
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Event list */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Reveal>
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">
            {fill(MONTH_COPY.eventsTitle[l], vars)}
          </h2>
          {data.eventCount > SHOWN ? (
            <p className="mt-2 text-sm text-neutral-600">
              {fill(MONTH_COPY.showingAll[l], { ...vars, shown: shown.length })}
            </p>
          ) : null}
          <ul className="mt-6 divide-y divide-black/8 border-y border-black/8">
            {shown.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/${e.path}`}
                  className="group flex items-center gap-4 py-3.5 text-neutral-900 transition-colors hover:bg-neutral-50"
                >
                  <span className="w-24 shrink-0 text-xs font-black uppercase tracking-wide text-gold">
                    {dateFmt(e.date)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-serif text-base font-bold">{e.name}</span>
                    <span className="block truncate text-xs text-neutral-600">{e.venueName}</span>
                  </span>
                  {e.price > 0 ? (
                    <span className="shrink-0 text-sm font-bold">
                      {MONTH_COPY.from[l]} €{e.price}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`${base}/calendar`}
            className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-black/10 px-6 py-3 text-xs font-black uppercase tracking-widest text-neutral-900 transition-colors hover:border-black"
          >
            {MONTH_COPY.fullCalendar[l]} →
          </Link>
        </Reveal>
      </section>

      {/* Sibling months — internal linking between the set */}
      <section className="border-t border-black/5 bg-neutral-50 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="font-serif text-lg font-black">{MONTH_COPY.otherMonths[l]}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {others.map((m) => (
              <Link
                key={m}
                href={`${base}/ibiza-in/${m}`}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:border-gold hover:text-gold"
              >
                {monthName(m, l)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AuthorByline locale={l} topic={`Ibiza in ${name}`} />
    </main>
  )
}
