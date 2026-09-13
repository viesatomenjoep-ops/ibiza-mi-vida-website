import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates, slugFor, pathFor, localesFor, type RouteKey } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SERVICE_COPY } from '@/lib/service-schema-copy'
import { SITE_NAME, type Locale } from '@/lib/seo'
import * as C from '@/lib/concierge-copy'

/**
 * De conciergegids, één structuur voor vijf talen.
 *
 * Zelfde opzet als de dresscode-gids: de routebestanden zeggen alleen welke
 * taal ze zijn, alle tekst staat in `concierge-copy.ts`. De afweging waarom
 * dit één bestand is en geen vijf aparte pagina's staat in de kop van dat
 * bestand.
 *
 * Wat deze pagina anders maakt dan de andere gidsen is waar hij op mikt. De
 * verhuurpillars beantwoorden een transactionele vraag ("boot huren ibiza");
 * deze beantwoordt een vergelijkende ("beste concierge ibiza", "wat kost een
 * concierge"). Dat verandert de vorm: de koppen zijn de vraag zelf, het
 * antwoord staat in de eerste zin eronder, en de sectie over kiezen geeft de
 * toetsen in plaats van een claim. Een antwoordmachine die "beste concierge
 * Ibiza" krijgt voorgelegd, citeert de bron die uitlegt hóe je kiest — niet de
 * partij die zichzelf tot winnaar uitroept.
 *
 * De OG-locale hoort bij de taal, niet bij het land — zelfde reden als bij de
 * dresscode-gids.
 */

const PAGE_KEY = 'concierge-ibiza'
const ROUTE_KEY: RouteKey = 'concierge'

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_GB', nl: 'nl_NL', de: 'de_DE', es: 'es_ES', fr: 'fr_FR',
}

export function conciergeMetadata(locale: Locale): Metadata {
  return {
    title: C.META_TITLE[locale],
    description: C.META_DESC[locale],
    alternates: localizedAlternates(ROUTE_KEY, locale),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: C.META_TITLE[locale],
      description: C.OG_DESC[locale],
      locale: OG_LOCALE[locale],
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: C.H1[locale] }],
    },
  }
}

export function ConciergeGuide({ locale }: { locale: Locale }) {
  const crumbs: Crumb[] = [
    { name: 'Home', path: '' },
    { name: C.CRUMB_SELF[locale] },
  ]

  const faqs: Faq[] = C.FAQS.map((f) => ({ q: f.q[locale], a: f.a[locale] }))

  /**
   * Interne links, altijd naar een pagina die in deze taal bestaat — zelfde
   * val als bij de dresscode-gids: een gelokaliseerde route heeft wél een slug
   * maar niet per se een gepubliceerde pagina, en een interne link naar een
   * 301 is linkwaarde die onderweg verdampt.
   */
  const links = C.LINKS.map((l) => {
    if (!l.localized) return { href: l.key, label: l.label[locale], body: l.body[locale] }
    const key = l.key as RouteKey
    const talen = localesFor(key)
    const doel = talen.includes(locale) ? locale : talen[0]
    return {
      href: doel ? pathFor(key, doel) : slugFor(key, locale),
      label: l.label[locale],
      body: l.body[locale],
    }
  })

  const sc = SERVICE_COPY.concierge

  return (
    <>
      <SchemaMarkup locale={locale} breadcrumbs={crumbs} faqs={faqs} />
      <ServiceSchema
        name={sc.name[locale]}
        description={sc.description[locale]}
        serviceType={sc.serviceType}
        path={`${locale}/${slugFor(ROUTE_KEY, locale)}`}
        pageKey={PAGE_KEY}
      />
      <Breadcrumbs items={crumbs} locale={locale} />

      <HubHero
        h1={C.H1[locale]}
        locale={locale}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>{C.LEAD_1[locale]}</p>
            <p className="mt-4">{C.LEAD_2[locale]}</p>
          </>
        }
      />

      <ItemGrid
        heading={C.H_REGELT[locale]}
        intro={C.INTRO_REGELT[locale]}
        items={C.REGELT.map((i) => ({ name: i.name[locale], body: i.body[locale] }))}
      />

      <ProseSection
        heading={C.H_KOSTEN[locale]}
        paragraphs={C.KOSTEN_PARAGRAPHS.map((p) => p[locale])}
      />

      <ItemGrid
        heading={C.H_KIEZEN[locale]}
        intro={C.INTRO_KIEZEN[locale]}
        items={C.KIEZEN.map((i) => ({ name: i.name[locale], body: i.body[locale] }))}
        columns={2}
      />

      <WhatsAppCta
        locale={locale}
        heading={C.CTA_HEADING[locale]}
        body={C.CTA_BODY[locale]}
        prefill={C.CTA_PREFILL[locale]}
      />

      <FaqAccordion faqs={faqs} locale={locale} />

      <InternalLinks heading={C.H_LINKS[locale]} locale={locale} links={links} />

      <AuthorByline locale={locale} topic={C.BYLINE_TOPIC[locale]} />
    </>
  )
}
