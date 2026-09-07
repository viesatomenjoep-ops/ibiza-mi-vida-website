import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { PartnerDossier } from '@/components/partner/PartnerDossier'
import { Breadcrumbs, InternalLinks, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { PARTNER_LOGOS } from '@/lib/partners'
import { localizedAlternates, pathFor, localesFor, type RouteKey } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

/**
 * De twee partnerdossiers (Wiber, Click&Boat), vijf talen uit één structuur.
 *
 * Vijfde en zesde in de reeks. De opzet is dezelfde als bij de vier gidsen —
 * de tekst in een `*-copy.ts`, de structuur hier — maar met één verschil: deze
 * twee pagina's delen ook hun structuur mét elkaar, want een dossier over een
 * partner heeft altijd dezelfde vorm (kop, feiten, wat we controleren, voor wie
 * wel en niet, ons oordeel, FAQ). Vandaar één component voor allebei, met de
 * inhoud als argument.
 *
 * Wat níét gedeeld wordt is het oordeel. Elk dossier schrijft zijn eigen
 * "onze eerlijke lezing"; dat is precies het stuk waar een sjabloon de waarde
 * uit zou halen.
 */

export type T = Record<Locale, string>

export interface DossierCopy {
  routeKey: RouteKey
  pageKey: string
  /** Merknaam zoals de partner hem schrijft. Vertaalt niet. */
  partner: string
  logoKey?: keyof typeof PARTNER_LOGOS
  /** Affiliate-URL; gaat via <AffiliateLink> binnen PartnerDossier. */
  href: string
  /**
   * De pillar waar dit dossier onder hangt, als routesleutel of als kaal pad.
   * Een kaal pad heeft in alle talen dezelfde slug.
   */
  pillar: { key: string; localized: boolean; label: T }
  crumbParent: { key: string; localized: boolean; label: T }
  crumbSelf: T

  metaTitle: T
  metaDesc: T
  ogDesc: T
  ogAlt: T

  kicker: T
  h1: T
  cta: T
  disclaimer: T
  lead1: T
  lead2: T

  headline: { label: T; value: T }[]
  factsHeading: T
  facts: { label: T; value: T }[]
  stepsHeading: T
  steps: { title: T; body: T }[]
  suitsHeading: T
  suits: T[]
  notSuitsHeading: T
  notSuits: T[]
  verdictHeading: T
  verdict: T[]

  faqs: { q: T; a: T }[]
  linksHeading: T
  links: { key: string; localized: boolean; label: T; body: T }[]
  bylineTopic: T

  /** Product-schema. `price` mag null zijn; dan laat SchemaMarkup het Offer weg. */
  productName: T
  productDescription: T
  productBrand: string
  price: number | null
}

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_GB', nl: 'nl_NL', de: 'de_DE', es: 'es_ES', fr: 'fr_FR',
}

/** Pad naar een route die in déze taal bestaat; anders naar de taal die hem wél heeft. */
function href(key: string, localized: boolean, locale: Locale): string {
  if (!localized) return key
  const k = key as RouteKey
  const talen = localesFor(k)
  const doel = talen.includes(locale) ? locale : talen[0]
  return doel ? pathFor(k, doel) : key
}

export function dossierMetadata(c: DossierCopy, locale: Locale): Metadata {
  return {
    title: c.metaTitle[locale],
    description: c.metaDesc[locale],
    alternates: localizedAlternates(c.routeKey, locale),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: c.metaTitle[locale],
      description: c.ogDesc[locale],
      locale: OG_LOCALE[locale],
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: c.ogAlt[locale] }],
    },
  }
}

export function PartnerDossierPage({ copy: c, locale }: { copy: DossierCopy; locale: Locale }) {
  const ouder = href(c.crumbParent.key, c.crumbParent.localized, locale)
  const crumbs: Crumb[] = [
    { name: 'Home', path: '' },
    // Breadcrumbs plakt de taalcode zelf voor het pad, dus hier alleen de slug
    // wanneer de ouder in deze taal bestaat. Bestaat hij niet, dan valt de
    // kruimel weg in plaats van naar een andere taal te wijzen — zie
    // DressCodeGuide voor waarom dat de goede kant op is.
    ...(ouder.startsWith('/') ? [] : [{ name: c.crumbParent.label[locale], path: ouder }]),
    { name: c.crumbSelf[locale] },
  ]

  const faqs: Faq[] = c.faqs.map((f) => ({ q: f.q[locale], a: f.a[locale] }))
  const links = c.links.map((l) => ({
    href: href(l.key, l.localized, locale),
    label: l.label[locale],
    body: l.body[locale],
  }))

  return (
    <>
      <SchemaMarkup
        locale={locale}
        breadcrumbs={crumbs}
        faqs={faqs}
        product={{
          name: c.productName[locale],
          description: c.productDescription[locale],
          brand: c.productBrand,
          price: c.price,
          path: c.pageKey,
        }}
      />

      <Breadcrumbs items={crumbs} locale={locale} />

      <PartnerDossier
        locale={locale}
        partner={c.partner}
        logoKey={c.logoKey}
        kicker={c.kicker[locale]}
        h1={c.h1[locale]}
        href={c.href}
        cta={c.cta[locale]}
        pillarPath={href(c.pillar.key, c.pillar.localized, locale)}
        pillarLabel={c.pillar.label[locale]}
        disclaimer={c.disclaimer[locale]}
        lead={
          <>
            <p>{c.lead1[locale]}</p>
            <p className="mt-4">{c.lead2[locale]}</p>
          </>
        }
        headline={c.headline.map((f) => ({ label: f.label[locale], value: f.value[locale] }))}
        factsHeading={c.factsHeading[locale]}
        facts={c.facts.map((f) => ({ label: f.label[locale], value: f.value[locale] }))}
        stepsHeading={c.stepsHeading[locale]}
        steps={c.steps.map((s) => ({ title: s.title[locale], body: s.body[locale] }))}
        suitsHeading={c.suitsHeading[locale]}
        suits={c.suits.map((s) => s[locale])}
        notSuitsHeading={c.notSuitsHeading[locale]}
        notSuits={c.notSuits.map((s) => s[locale])}
        verdictHeading={c.verdictHeading[locale]}
        verdict={c.verdict.map((v) => v[locale])}
      >
        <FaqAccordion faqs={faqs} locale={locale} />
      </PartnerDossier>

      <InternalLinks heading={c.linksHeading[locale]} locale={locale} links={links} />

      <AuthorByline locale={locale} topic={c.bylineTopic[locale]} />
    </>
  )
}

export { contentUpdated }
