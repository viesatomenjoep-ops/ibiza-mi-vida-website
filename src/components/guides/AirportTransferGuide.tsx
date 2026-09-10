import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { QuickFacts } from '@/components/water/QuickFacts'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates, pathFor, localesFor, type RouteKey } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'
import * as C from '@/lib/airport-transfer-copy'

/**
 * Luchthaventransfer-gids, vijf talen uit één structuur.
 *
 * Vierde in de reeks; zie DressCodeGuide voor waarom dit één component is en
 * geen vijf pagina's, en voor hoe de interne links met de publicatiestand
 * meebewegen.
 *
 * Geen tarieven en geen lijnnummers, in geen enkele taal — die staan als
 * [[VERIFY]] in docs/seo/NIGHT-REPORT.md tot Simon ze bevestigt.
 */

const PAGE_KEY = 'ibiza-airport-transfer'

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_GB', nl: 'nl_NL', de: 'de_DE', es: 'es_ES', fr: 'fr_FR',
}

export function airportTransferMetadata(locale: Locale): Metadata {
  return {
    title: C.META_TITLE[locale],
    description: C.META_DESC[locale],
    alternates: localizedAlternates('airport-transfer', locale),
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

export function AirportTransferGuide({ locale }: { locale: Locale }) {
  const crumbs: Crumb[] = [
    { name: 'Home', path: '' },
    { name: C.CRUMB_SELF[locale] },
  ]
  const faqs: Faq[] = C.FAQS.map((f) => ({ q: f.q[locale], a: f.a[locale] }))

  const links = C.LINKS.map((l) => {
    if (!l.localized) return { href: l.key, label: l.label[locale], body: l.body[locale] }
    const key = l.key as RouteKey
    const talen = localesFor(key)
    const doel = talen.includes(locale) ? locale : talen[0]
    return { href: doel ? pathFor(key, doel) : l.key, label: l.label[locale], body: l.body[locale] }
  })

  return (
    <>
      <SchemaMarkup locale={locale} breadcrumbs={crumbs} faqs={faqs} />
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
        heading={C.H_OPTIONS[locale]}
        items={C.OPTIONS.map((o) => ({ name: o.name[locale], body: o.body[locale] }))}
        columns={2}
      />

      <QuickFacts pageKey="airport-transfer" locale={locale} />

      <ProseSection heading={C.H_WHICH[locale]} paragraphs={C.WHICH.map((p) => p[locale])} />

      <WhatsAppCta locale={locale} body={C.CTA_BODY[locale]} prefill={C.CTA_PREFILL[locale]} />

      <FaqAccordion faqs={faqs} locale={locale} />

      <InternalLinks heading={C.H_LINKS[locale]} locale={locale} links={links} />

      <AuthorByline locale={locale} topic={C.BYLINE_TOPIC[locale]} />
    </>
  )
}
