import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { PageFaq } from '@/components/seo/PageFaq'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates, slugFor, pathFor, localesFor, type RouteKey } from '@/lib/route-slugs'
import { SERVICE_COPY } from '@/lib/service-schema-copy'
import { getAllEvents } from '@/lib/clubtickets'
import { ctLink } from '@/lib/ct-link'
import { ibizaToday } from '@/lib/date-label'
import { ES_VEDRA_TRIP as C } from '@/lib/es-vedra-trip-copy'
import { SITE_NAME, type Locale } from '@/lib/seo'

/**
 * De Es Vedrà + Formentera-dagtocht, één structuur voor vijf talen — zelfde
 * opzet als de concierge- en dresscode-gidsen: de routebestanden zeggen alleen
 * welke taal ze zijn, alle tekst staat in es-vedra-trip-copy.ts.
 *
 * Het verschil met die gidsen: dit is de eerste redactionele pagina bovenop
 * één Clubtickets-feed-event (zie docs in de VISOR-repo,
 * clubtickets-excursies-gap-plan.md §2.1). De regel die dat afdwingbaar
 * maakt: ALLE veranderlijke feiten — afvaartdata, prijzen, de boeklink —
 * komen bij elke render uit de feed zelf; in de copy staat geen enkel getal
 * dat de feed kan tegenspreken. Verdwijnt het event uit de feed, dan toont de
 * pagina de seizoensmelding in plaats van verouderde data.
 */

const EVENT_SLUG = 'excursion-es-vedra-formentera'
const ROUTE_KEY: RouteKey = 'es-vedra-trip'
const PAGE_KEY = 'es-vedra-trip'

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_GB', nl: 'nl_NL', de: 'de_DE', es: 'es_ES', fr: 'fr_FR',
}

export function esVedraTripMetadata(locale: Locale): Metadata {
  const sc = SERVICE_COPY[PAGE_KEY]!
  return {
    title: C.title[locale],
    description: sc.description[locale],
    alternates: localizedAlternates(ROUTE_KEY, locale),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: C.title[locale],
      description: sc.description[locale],
      locale: OG_LOCALE[locale],
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: C.title[locale] }],
    },
  }
}

/** Datumlabel in de eigen taal: "wo 24 sep". Puur presentatie, data blijft ISO. */
function dateLabel(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(
    new Date(`${iso}T12:00:00`),
  )
}

export async function EsVedraTripGuide({ locale }: { locale: Locale }) {
  const events = await getAllEvents(locale)
  const event = events.find((e) => e.slug === EVENT_SLUG)

  const todayStr = ibizaToday()
  // Zelfde venster als de agenda-pagina's: alleen de komende 31 dagen.
  const windowEndStr = new Date(Date.now() + 31 * 86400000).toISOString().split('T')[0]!
  const upcoming = (event?.dates ?? [])
    .filter((d) => d.date >= todayStr && d.date <= windowEndStr)
    .sort((a, b) => a.date.localeCompare(b.date))

  const crumbs: Crumb[] = [
    { name: 'Home', path: '' },
    { name: C.title[locale] },
  ]

  const sc = SERVICE_COPY[PAGE_KEY]!

  /**
   * Interne links naar de pagina's die deze vraag flankeren: de volledige
   * boottochten-agenda en de ferry (voor wie alleen de overtocht zoekt).
   * Vaste slugs, dus in elke taal geldig.
   */
  const links = [
    {
      href: '/boat-trip',
      label: {
        nl: 'Alle boottochten op Ibiza', en: 'All boat trips in Ibiza', de: 'Alle Bootstouren auf Ibiza',
        es: 'Todas las excursiones en barco', fr: 'Toutes les excursions en bateau',
      }[locale],
    },
    {
      href: '/ferry-formentera',
      label: {
        nl: 'Alleen de overtocht? De ferry naar Formentera', en: 'Just the crossing? The Formentera ferry',
        de: 'Nur die Überfahrt? Die Fähre nach Formentera', es: '¿Solo el trayecto? El ferry a Formentera',
        fr: 'Juste la traversée ? Le ferry pour Formentera',
      }[locale],
    },
    {
      href: '/private-boat-charters',
      label: {
        nl: 'Liever een eigen boot? Privécharters', en: 'Rather have your own boat? Private charters',
        de: 'Lieber ein eigenes Boot? Privatcharter', es: '¿Prefieres barco propio? Chárter privado',
        fr: 'Plutôt un bateau privé ? Nos charters',
      }[locale],
    },
  ]

  return (
    <>
      <SchemaMarkup locale={locale} breadcrumbs={crumbs} />
      <ServiceSchema
        name={sc.name[locale]}
        description={sc.description[locale]}
        serviceType={sc.serviceType}
        path={`${locale}/${slugFor(ROUTE_KEY, locale)}`}
        pageKey={PAGE_KEY}
      />
      <Breadcrumbs items={crumbs} locale={locale} />

      <HubHero
        h1={C.title[locale]}
        locale={locale}
        lead={
          <>
            <p>{C.intro[locale]}</p>
            <p className="mt-4">{C.introSecond[locale]}</p>
          </>
        }
      />

      {/* Komende afvaarten, live uit de feed. Prijzen en data staan bewust
          nergens in de copy — dit blok is de enige plek, en hij kan dus niet
          verouderen zonder dat de hele feed veroudert. */}
      <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{C.datesHeading[locale]}</h2>
          {upcoming.length === 0 ? (
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">{C.noDates[locale]}</p>
          ) : (
            <ul className="mt-8 divide-y divide-black/5 rounded-2xl border border-black/10">
              {upcoming.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <span className="font-medium">{dateLabel(d.date, locale)}</span>
                  <span className="text-[15px] text-neutral-600">{d.prices}</span>
                  <a
                    href={ctLink(d.affLink || event?.affLink, locale, 'event', event?.name ?? EVENT_SLUG)}
                    target="_blank"
                    rel="sponsored noopener"
                    className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
                  >
                    {C.bookCta[locale]}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {event && (
            <p className="mt-6 text-[15px]">
              <a href={`/${locale}/boat-trip/${event.venue?.slug ?? 'excursiones-ibiza'}/${event.slug}`} className="underline underline-offset-4 hover:no-underline">
                {C.detailLinkLabel[locale]}
              </a>
            </p>
          )}
        </div>
      </section>

      {/* Geen ItemGrid: dit zijn zeven korte feiten, geen zeven kaartjes met
          kop + toelichting. Een lijst is hier de eerlijke vorm. */}
      <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{C.includedHeading[locale]}</h2>
          <ul className="mt-6 grid gap-x-8 gap-y-3 md:grid-cols-2">
            {C.included.map((i) => (
              <li key={i.en} className="flex items-start gap-3 text-[16px] leading-relaxed text-neutral-700">
                <span aria-hidden className="mt-1 text-neutral-400">✓</span>
                {i[locale]}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ProseSection
        heading={C.itineraryHeading[locale]}
        paragraphs={C.itinerary.map((p) => p[locale])}
      />

      <ItemGrid
        heading={C.practicalHeading[locale]}
        items={C.practical.map((p) => ({ name: p.label[locale], body: p.value[locale] }))}
        columns={2}
      />

      <PageFaq pageKey={PAGE_KEY} locale={locale} />

      <InternalLinks
        heading={{ nl: 'Verder lezen', en: 'Keep exploring', de: 'Weiterlesen', es: 'Sigue explorando', fr: 'Pour aller plus loin' }[locale]}
        locale={locale}
        links={links}
      />

      <AuthorByline locale={locale} topic="the Es Vedrà + Formentera boat trip" />
    </>
  )
}
