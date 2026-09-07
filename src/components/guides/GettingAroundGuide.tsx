import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { MAP_CLUBS } from '@/data/ibiza-map-clubs'
import { venuePagePublished } from '@/lib/pending-venues'
import { localizedAlternates, pathFor, localesFor, type RouteKey } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'
import * as C from '@/lib/getting-around-copy'

/**
 * "Hoe kom je rond op Ibiza", vijf talen uit één structuur.
 *
 * Zelfde opzet als DressCodeGuide: de tekst staat in getting-around-copy.ts,
 * de vijf routebestanden zeggen alleen welke slug ze zijn en lezen de taal uit
 * `params.locale`.
 *
 * Wat hier bovenop komt is de carloze sectie, en die is gerekend in plaats van
 * geschreven: de tellingen per gebied komen uit MAP_CLUBS. Verhuist een club
 * of komt er een bij, dan schuiven de getallen in alle vijf de talen mee.
 */

const PAGE_KEY = 'getting-around-ibiza'

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_GB', nl: 'nl_NL', de: 'de_DE', es: 'es_ES', fr: 'fr_FR',
}

/**
 * De clubs die we mogen noemen.
 *
 * `pending-venues.ts` is de enige bron voor "zit nog achter een afspraak".
 * Die drie hier weglaten is geen cosmetiek: hun eigen pagina's 404'en met
 * opzet, en ze in nieuwe tekst opvoeren wekt precies de indruk die we tot het
 * akkoord niet willen wekken. Gaat de vlag om, dan verschijnen ze vanzelf.
 */
const KAART = MAP_CLUBS.filter((c) => !c.slug || venuePagePublished(c.slug))

const clubsIn = (...gebieden: string[]) =>
  KAART.filter((c) => gebieden.some((g) => c.area.toLowerCase().startsWith(g.toLowerCase())))

const SAN_ANTONIO = clubsIn('San Antonio')
const BOSSA = clubsIn("Playa d'en Bossa")
const STAD = clubsIn('Ibiza-Stad', 'Marina Botafoch')
const RIT_NODIG = KAART.filter((c) => ![...SAN_ANTONIO, ...BOSSA, ...STAD].includes(c))
const noem = (lijst: typeof KAART) => lijst.map((c) => c.name).join(', ')

export function gettingAroundMetadata(locale: Locale): Metadata {
  return {
    title: C.META_TITLE[locale],
    description: C.META_DESC[locale],
    alternates: localizedAlternates('getting-around', locale),
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

export function GettingAroundGuide({ locale }: { locale: Locale }) {
  const crumbs: Crumb[] = [
    { name: 'Home', path: '' },
    { name: C.CRUMB_SELF[locale] },
  ]

  const faqs: Faq[] = C.FAQS.map((f) => ({ q: f.q[locale], a: f.a[locale] }))

  // Zie DressCodeGuide voor de toelichting: een route die in deze taal niet
  // rendert krijgt een link naar de taal die hem wél heeft, in plaats van naar
  // de 301 van de middleware.
  const links = C.LINKS.map((l) => {
    if (!l.localized) return { href: l.key, label: l.label[locale], body: l.body[locale] }
    const key = l.key as RouteKey
    const talen = localesFor(key)
    const doel = talen.includes(locale) ? locale : talen[0]
    return { href: doel ? pathFor(key, doel) : l.key, label: l.label[locale], body: l.body[locale] }
  })

  const carless = [
    { name: C.CARLESS_SA.name(SAN_ANTONIO.length)[locale], body: C.CARLESS_SA.body(noem(SAN_ANTONIO))[locale] },
    { name: C.CARLESS_BOSSA.name(BOSSA.length)[locale], body: C.CARLESS_BOSSA.body(noem(BOSSA))[locale] },
    { name: C.CARLESS_STAD.name(STAD.length)[locale], body: C.CARLESS_STAD.body(noem(STAD))[locale] },
    {
      name: C.CARLESS_RIDE.name[locale],
      body: RIT_NODIG.length
        ? C.CARLESS_RIDE.body(noem(RIT_NODIG))[locale]
        : C.CARLESS_RIDE.fallback[locale],
    },
  ]

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
      />

      {/* Staat vóór "de rit naar huis bepaalt alles", want dat stuk is het
          vervolg op dit antwoord en niet andersom. */}
      <ItemGrid
        heading={C.H_CARLESS[locale]}
        intro={C.carlessIntro(locale, KAART.length, SAN_ANTONIO.length, BOSSA.length, STAD.length)}
        items={carless}
        columns={2}
      />

      <ProseSection
        heading={C.H_RIDE_HOME[locale]}
        paragraphs={C.RIDE_HOME.map((p) => p[locale])}
      />

      <ProseSection
        heading={C.H_DRIVING[locale]}
        paragraphs={C.DRIVING.map((p) => p[locale])}
      />

      <WhatsAppCta locale={locale} body={C.CTA_BODY[locale]} prefill={C.CTA_PREFILL[locale]} />

      <FaqAccordion faqs={faqs} locale={locale} />

      <InternalLinks heading={C.H_LINKS[locale]} locale={locale} links={links} />

      <AuthorByline locale={locale} topic={C.BYLINE_TOPIC[locale]} />
    </>
  )
}
