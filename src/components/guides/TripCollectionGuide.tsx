import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import { HubHero, ItemGrid, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { PageFaq } from '@/components/seo/PageFaq'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates, slugFor, type RouteKey } from '@/lib/route-slugs'
import { SERVICE_COPY } from '@/lib/service-schema-copy'
import { getAllEvents, type CTEvent } from '@/lib/clubtickets'
import { ctLink } from '@/lib/ct-link'
import { ibizaToday } from '@/lib/date-label'
import { SITE_NAME, type Locale } from '@/lib/seo'

/**
 * Generieke redactionele pagina bovenop één of meer Clubtickets-feed-events —
 * de structuur achter de Calas-, Pukka Up-, Float Your Boat- en Cruise
 * Crush-pagina's (Clubtickets-gap-plan, stap 3–5). Zelfde kernregel als de
 * Es Vedrà-pagina: alle veranderlijke feiten (afvaarten, prijzen, boeklinks)
 * komen bij elke render live uit de feed; in de copy staat geen getal dat de
 * feed kan tegenspreken. Een event zonder komende afvaarten toont zijn
 * seizoensmelding; een event dat helemaal uit de feed verdwijnt, valt weg.
 */

type T = Record<Locale, string>

export interface TripPageCopy {
  routeKey: RouteKey
  /** Key voor ServiceSchema (SERVICE_COPY), PageFaq (PAGE_FAQ) en de kruimel. */
  pageKey: string
  bylineTopic: string
  title: T
  intro: T
  introSecond?: T
  /** Eén sectie per feed-event, in deze volgorde. */
  events: { eventSlug: string; heading?: T; body: T }[]
  includedHeading?: T
  included?: T[]
  practicalHeading?: T
  practical?: { label: T; value: T }[]
  datesHeading: T
  noDates: T
  bookCta: T
  detailLinkLabel: T
  linksHeading: T
  links: { href: string; label: T }[]
  /** Alleen true als er een PAGE_FAQ-entry voor pageKey bestaat. */
  hasFaq?: boolean
}

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_GB', nl: 'nl_NL', de: 'de_DE', es: 'es_ES', fr: 'fr_FR',
}

export function tripPageMetadata(copy: TripPageCopy, locale: Locale): Metadata {
  const sc = SERVICE_COPY[copy.pageKey]!
  return {
    title: copy.title[locale],
    description: sc.description[locale],
    alternates: localizedAlternates(copy.routeKey, locale),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: copy.title[locale],
      description: sc.description[locale],
      locale: OG_LOCALE[locale],
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: copy.title[locale] }],
    },
  }
}

function dateLabel(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(
    new Date(`${iso}T12:00:00`),
  )
}

/** Venue-detailpad voor de doorkliklink, afgeleid van het feed-type. */
function detailBasePath(event: CTEvent): string {
  return event.type?.slug === 'formentera-day-trip' ? 'ferry-formentera' : 'boat-trip'
}

export async function TripCollectionGuide({ copy, locale }: { copy: TripPageCopy; locale: Locale }) {
  const events = await getAllEvents(locale)
  const todayStr = ibizaToday()
  // Zelfde venster als de agenda-pagina's: alleen de komende 31 dagen.
  const windowEndStr = new Date(Date.now() + 31 * 86400000).toISOString().split('T')[0]!

  const crumbs: Crumb[] = [{ name: 'Home', path: '' }, { name: copy.title[locale] }]
  const sc = SERVICE_COPY[copy.pageKey]!

  return (
    <>
      <SchemaMarkup locale={locale} breadcrumbs={crumbs} />
      <ServiceSchema
        name={sc.name[locale]}
        description={sc.description[locale]}
        serviceType={sc.serviceType}
        path={`${locale}/${slugFor(copy.routeKey, locale)}`}
        pageKey={copy.pageKey}
      />
      <Breadcrumbs items={crumbs} locale={locale} />

      <HubHero
        h1={copy.title[locale]}
        locale={locale}
        lead={
          <>
            <p>{copy.intro[locale]}</p>
            {copy.introSecond ? <p className="mt-4">{copy.introSecond[locale]}</p> : null}
          </>
        }
      />

      {copy.events.map((section) => {
        const event = events.find((e) => e.slug === section.eventSlug)
        if (!event) return null
        const upcoming = (event.dates ?? [])
          .filter((d) => d.date >= todayStr && d.date <= windowEndStr)
          .sort((a, b) => a.date.localeCompare(b.date))

        return (
          <section key={section.eventSlug} className="border-t border-black/5 bg-white py-14 text-neutral-900">
            <div className="mx-auto max-w-4xl px-4">
              <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">
                {section.heading?.[locale] ?? event.name}
              </h2>
              <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-neutral-700">{section.body[locale]}</p>

              <h3 className="mt-8 font-serif text-lg font-black tracking-tight">{copy.datesHeading[locale]}</h3>
              {upcoming.length === 0 ? (
                <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-neutral-600">{copy.noDates[locale]}</p>
              ) : (
                <ul className="mt-4 divide-y divide-black/5 rounded-2xl border border-black/10">
                  {upcoming.map((d) => (
                    <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <span className="font-medium">{dateLabel(d.date, locale)}</span>
                      <span className="text-[15px] text-neutral-600">{d.prices}</span>
                      <a
                        href={ctLink(d.affLink || event.affLink, locale, 'event', event.name)}
                        target="_blank"
                        rel="sponsored noopener"
                        className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
                      >
                        {copy.bookCta[locale]}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-5 text-[15px]">
                <a
                  href={`/${locale}/${detailBasePath(event)}/${event.venueSlug ?? event.venue?.slug}/${event.slug}`}
                  className="underline underline-offset-4 hover:no-underline"
                >
                  {copy.detailLinkLabel[locale]}
                </a>
              </p>
            </div>
          </section>
        )
      })}

      {copy.included && copy.includedHeading ? (
        <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{copy.includedHeading[locale]}</h2>
            <ul className="mt-6 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {copy.included.map((i) => (
                <li key={i.en} className="flex items-start gap-3 text-[16px] leading-relaxed text-neutral-700">
                  <span aria-hidden className="mt-1 text-neutral-400">✓</span>
                  {i[locale]}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {copy.practical && copy.practicalHeading ? (
        <ItemGrid
          heading={copy.practicalHeading[locale]}
          items={copy.practical.map((p) => ({ name: p.label[locale], body: p.value[locale] }))}
          columns={2}
        />
      ) : null}

      {copy.hasFaq ? <PageFaq pageKey={copy.pageKey} locale={locale} /> : null}

      <InternalLinks
        heading={copy.linksHeading[locale]}
        locale={locale}
        links={copy.links.map((l) => ({ href: l.href, label: l.label[locale] }))}
      />

      <AuthorByline locale={locale} topic={copy.bylineTopic} />
    </>
  )
}
