import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates, slugFor, pathFor, localesFor, type RouteKey } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'
import * as C from '@/lib/dress-code-copy'

/**
 * De dresscode-gids, één structuur voor vijf talen.
 *
 * De vijf routebestanden zijn hierdoor drie regels lang: ze zeggen welke taal
 * ze zijn en verder niets. Alle tekst staat in `dress-code-copy.ts`.
 *
 * Waarom niet vijf losse pagina's zoals bij de verhuurpillars: daar zit per
 * taal een eigen invalshoek achter (de Nederlandse vaarbewijsregel is een
 * andere regel dan de Spaanse). Een deurbeleid is dat niet — dezelfde vier
 * dingen worden geweigerd, ongeacht waar je vandaan komt. Vijf keer dezelfde
 * structuur uitschrijven levert dan alleen vijf plekken op waar een correctie
 * vergeten kan worden.
 *
 * De OG-locale hoort bij de taal en niet bij het land: `en_GB` was hardgecodeerd
 * toen deze pagina alleen Engels was, en dat zou op de Spaanse variant een
 * verkeerde taal aan Facebook doorgeven.
 */

const PAGE_KEY = 'ibiza-club-dress-code'

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_GB', nl: 'nl_NL', de: 'de_DE', es: 'es_ES', fr: 'fr_FR',
}

export function dressCodeMetadata(locale: Locale): Metadata {
  return {
    title: C.META_TITLE[locale],
    description: C.META_DESC[locale],
    alternates: localizedAlternates('dress-code', locale),
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

export function DressCodeGuide({ locale }: { locale: Locale }) {
  /**
   * Het kruimelpad, met de bovenliggende gids alleen als die in deze taal bestaat.
   *
   * `Breadcrumbs` en `SchemaMarkup` plakken allebei de taalcode voor het pad,
   * dus een kruimel naar `ibiza-uitgaan` zou op /nl naar een 301 wijzen zolang
   * de uitgaansgids alleen in het Engels staat. Google gooit een kruimelpad weg
   * waarvan het `item` niet klopt, en een kruimel die van taal wisselt is voor
   * een lezer ook geen kruimel meer.
   *
   * Bestaat de gids in deze taal niet, dan is het pad gewoon Home › Dresscode.
   * Twee niveaus is een geldig kruimelpad; een kloppend kort pad is beter dan
   * een lang pad dat ergens anders uitkomt. Zodra de gids vertaald is, staat de
   * tussenstap er vanzelf weer.
   */
  const heeftGids = localesFor('nightlife-guide').includes(locale)
  const crumbs: Crumb[] = [
    { name: 'Home', path: '' },
    ...(heeftGids
      ? [{ name: C.CRUMB_NIGHTLIFE[locale], path: slugFor('nightlife-guide', locale) }]
      : []),
    { name: C.CRUMB_SELF[locale] },
  ]

  const faqs: Faq[] = C.FAQS.map((f) => ({ q: f.q[locale], a: f.a[locale] }))

  /**
   * Interne links, altijd naar een pagina die bestáát.
   *
   * Twee vallen zitten hier vlak naast elkaar. De slug verschilt per taal
   * (`ibiza-nightlife` heet in het Nederlands `ibiza-uitgaan`), dus een
   * hardgecodeerde slug wijst op vier van de vijf talen naar niets. En een
   * route die in deze taal nog niet gepubliceerd is heeft wél een slug maar
   * geen pagina: `/nl/vervoer-op-ibiza` bestaat pas als `ROUTE_LOCALES` het
   * zegt, en tot die tijd 301't de middleware hem naar het Engels.
   *
   * Dus: `localesFor()` bepaalt of deze taal de route draagt, en zo niet gaat
   * de link rechtstreeks naar de taal die hem wél heeft. Geen 404, en ook geen
   * interne link naar een omleiding — dat laatste is linkwaarde die onderweg
   * verdampt. Zodra een vertaling erbij komt, wijst de link vanzelf naar de
   * eigen taal.
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
        heading={C.H_REFUSED[locale]}
        intro={C.INTRO_REFUSED[locale]}
        items={C.REFUSED.map((i) => ({ name: i.name[locale], body: i.body[locale] }))}
        columns={2}
      />

      <ItemGrid
        heading={C.H_EXCEPTIONS[locale]}
        intro={C.INTRO_EXCEPTIONS[locale]}
        items={C.EXCEPTIONS.map((i) => ({ name: i.name[locale], body: i.body[locale] }))}
      />

      <ProseSection
        heading={C.H_REAL[locale]}
        paragraphs={C.REAL_PARAGRAPHS.map((p) => p[locale])}
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
