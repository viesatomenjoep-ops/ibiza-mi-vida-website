import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, PriceTable, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { getPriceStats, type PriceStats } from '@/lib/price-stats'
import { getSeasonStats, type SeasonStats } from '@/lib/season-stats'
import { getVenues } from '@/lib/clubtickets'
import { longDate } from '@/lib/date-label'
import { MAP_CLUBS } from '@/data/ibiza-map-clubs'
import { ctBrowseLink } from '@/lib/ct-link'
import { localizedAlternates, pathFor, localesFor, type RouteKey } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'
import * as C from '@/lib/nightlife-copy'

/**
 * Uitgaansgids, vijf talen uit één structuur.
 *
 * Derde in de reeks na DressCodeGuide en GettingAroundGuide, en de eerste met
 * live data erin: gemeten entreeprijzen, de verdeling over prijsklassen, de
 * vergelijking tussen twee clubs en het seizoensvenster. Die passages staan in
 * nightlife-copy.ts als functies met de getallen als argument, zodat een cijfer
 * nooit in één taal blijft hangen terwijl het in de andere vier meebeweegt.
 */

const PAGE_KEY = 'ibiza-nightlife'

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_GB', nl: 'nl_NL', de: 'de_DE', es: 'es_ES', fr: 'fr_FR',
}

export function nightlifeMetadata(locale: Locale): Metadata {
  return {
    title: C.META_TITLE[locale],
    description: C.META_DESC[locale],
    alternates: localizedAlternates('nightlife-guide', locale),
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

/**
 * "Hï of UNVRS?" — beantwoord uit de agenda in plaats van uit een mening.
 *
 * Wat hier beweerd wordt en waarom dat mag: prijzen, avonden en seizoensdata
 * komen uit de live agenda; Hï voerde de DJ Mag-clubpoll aan van 2022 tot en
 * met 2025 en UNVRS opende op 30 mei 2025. Dat zijn bevestigde feiten, geen
 * lezingen van de data.
 *
 * Wat er bewust níét staat is een oordeel. We hebben geen grondslag om twee
 * zalen op kwaliteit te rangschikken, en een voorkeur die als feit wordt
 * gepresenteerd maakt de rest van de pagina minder betrouwbaar.
 *
 * De ligging komt uit onze eigen kaartdata en niet uit het hoofd: een eerdere
 * versie beweerde dat beide clubs aan Playa d'en Bossa liggen, terwijl UNVRS in
 * San Rafael staat — landinwaarts, en juist dát verschil bepaalt de rit om zes
 * uur 's ochtends.
 *
 * Rendert niets zodra een van de twee uit de geprijsde set valt (eind seizoen,
 * of onder het minimum van tien avonden). Een vergelijking met één kant is
 * geen vergelijking.
 */
function ClubCompare({ prices, season, locale }: { prices: PriceStats; season: SeasonStats | null; locale: Locale }) {
  const hi = prices.venues.find((v) => v.slug === 'hi-ibiza')
  const unvrs = prices.venues.find((v) => v.slug === 'unvrs-ibiza')
  if (!hi || !unvrs) return null

  const seizoen = (slug: string) => season?.venues.find((v) => v.slug === slug)
  const hiS = seizoen('hi-ibiza')
  const unS = seizoen('unvrs-ibiza')
  const gebied = (slug: string) => MAP_CLUBS.find((c) => c.slug === slug)?.area
  const hiGebied = gebied('hi-ibiza')
  const unGebied = gebied('unvrs-ibiza')

  const rijen: { label: string; hi: string; un: string }[] = []
  if (hiGebied && unGebied) rijen.push({ label: C.CMP_WHERE[locale], hi: hiGebied, un: unGebied })
  rijen.push({ label: C.CMP_TYPICAL[locale], hi: `€${hi.median}`, un: `€${unvrs.median}` })
  rijen.push({ label: C.CMP_CHEAPEST[locale], hi: `€${hi.min}`, un: `€${unvrs.min}` })
  rijen.push({ label: C.CMP_NIGHTS[locale], hi: String(hi.n), un: String(unvrs.n) })
  // Ook hier voluit: een kale ISO-datum in een tabelcel leest in geen enkele taal.
  if (hiS && unS) rijen.push({ label: C.CMP_LAST[locale], hi: longDate(hiS.lastScheduled, locale), un: longDate(unS.lastScheduled, locale) })

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{C.H_COMPARE[locale]}</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-neutral-700">
          {C.compareLead(locale, hi.name, unvrs.name, hi.median, unvrs.median, hi.n, unvrs.n)}
          {hiGebied && unGebied && hiGebied !== unGebied
            ? C.compareAreas(locale, hi.name, hiGebied, unvrs.name, unGebied)
            : ''}
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/15 text-[11px] font-black uppercase tracking-widest text-neutral-600">
                <th scope="col" className="py-2 pr-3 font-black" />
                <th scope="col" className="py-2 px-3 text-right font-black">{hi.name}</th>
                <th scope="col" className="py-2 pl-3 text-right font-black">{unvrs.name}</th>
              </tr>
            </thead>
            <tbody>
              {rijen.map((r) => (
                <tr key={r.label} className="border-b border-black/5">
                  <th scope="row" className="py-2.5 pr-3 font-semibold">{r.label}</th>
                  <td className="py-2.5 px-3 text-right tabular-nums">{r.hi}</td>
                  <td className="py-2.5 pl-3 text-right tabular-nums">{r.un}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">{C.CMP_VERDICT[locale]}</p>
      </div>
    </section>
  )
}

export async function NightlifeGuide({ locale }: { locale: Locale }) {
  const [prices, season, venues] = await Promise.all([
    getPriceStats(locale),
    getSeasonStats(locale),
    getVenues(locale),
  ])
  const clubCount = venues.filter((v) => (v as any).type?.slug === 'clubbing').length

  const crumbs: Crumb[] = [
    { name: 'Home', path: '' },
    { name: C.CRUMB_SELF[locale] },
  ]
  const faqs: Faq[] = C.FAQS.map((f) => ({ q: f.q[locale], a: f.a[locale] }))

  // Zie DressCodeGuide: een route die in deze taal niet rendert krijgt een link
  // naar de taal die hem wél heeft, in plaats van naar de 301 van de middleware.
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
            <p>
              {C.lead1(
                locale,
                clubCount,
                prices?.clubN ?? 0,
                prices?.clubMedian ?? 0,
                prices?.clubQ1 ?? 0,
                prices?.clubQ3 ?? 0,
                Boolean(prices),
              )}
            </p>
            <p className="mt-4">
              {C.lead2(
                locale,
                prices?.clubBuckets.under40 ?? 0,
                prices?.clubBuckets.over80 ?? 0,
                Boolean(prices),
              )}
            </p>
          </>
        }
      >
        <div className="mt-7">
          <AffiliateLink href={ctBrowseLink(locale)} partner="ClubTickets" locale={locale}>
            {C.CTA_LINK[locale]}
          </AffiliateLink>
        </div>
      </HubHero>

      <ItemGrid
        heading={C.H_SEQUENCE[locale]}
        intro={C.INTRO_SEQUENCE[locale]}
        items={C.SEQUENCE.map((s) => ({ name: s.name[locale], body: s.body[locale] }))}
        columns={2}
      />

      {prices && (
        <PriceTable
          heading={C.H_PRICES[locale]}
          locale={locale}
          caption={C.PRICE_CAPTION[locale]}
          intro={C.priceIntro(locale, prices.clubN, prices.venues.length, longDate(prices.from, locale), longDate(prices.to, locale))}
          rows={[
            { label: C.ROW_CHEAPEST[locale], amount: prices.clubMin, unit: C.PER_PERSON[locale] },
            { label: C.ROW_MEDIAN[locale], note: C.ROW_MEDIAN_NOTE[locale], amount: prices.clubMedian, unit: C.PER_PERSON[locale] },
            { label: C.ROW_RANGE[locale], note: C.ROW_RANGE_NOTE[locale], amount: prices.clubQ3, unit: `€${prices.clubQ1} – €${prices.clubQ3}` },
          ]}
        />
      )}

      {prices && <ClubCompare prices={prices} season={season} locale={locale} />}

      <ProseSection heading={C.H_BASE[locale]} paragraphs={C.BASE.map((p) => p[locale])} />

      {season && (
        <ProseSection
          heading={C.H_SEASON[locale]}
          paragraphs={[
            C.season1(locale, longDate(season.from, locale), longDate(season.to, locale), season.openNow, season.venues.length),
            ...C.SEASON_REST.map((p) => p[locale]),
          ]}
        />
      )}

      <Proof locale={locale} />
      <FaqAccordion faqs={faqs} locale={locale} />

      <InternalLinks heading={C.H_LINKS[locale]} locale={locale} links={links} />

      <AuthorByline locale={locale} topic={C.BYLINE_TOPIC[locale]} />
    </>
  )
}
