import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'
import { getVenues } from '@/lib/clubtickets'
import { boatCategoryCovers } from '@/lib/boat-categories'
import BoatsHub from './BoatsHub'
import { BoatRentalGuide as GuideEn } from '@/components/boats/rental-guide/en'
import { BoatRentalGuide as GuideNl } from '@/components/boats/rental-guide/nl'
import { BoatRentalGuide as GuideDe } from '@/components/boats/rental-guide/de'
import { BoatRentalGuide as GuideFr } from '@/components/boats/rental-guide/fr'
import { BoatRentalGuide as GuideEs } from '@/components/boats/rental-guide/es'
import { CheapBoats } from '@/components/boats/CheapBoats'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { crumbLabel } from '@/lib/breadcrumb-labels'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'boats')
}

/**
 * Covers are resolved here, on the server, from the live venue feed — so the
 * photo on each card belongs to something the visitor will actually find behind
 * the link, and the whole grid is in the HTML for a crawler that runs no
 * JavaScript.
 */
export default async function BoatsPage({ params: { locale } }: { params: { locale: string } }) {
  const venues = await getVenues(locale)
  const covers = boatCategoryCovers(venues as any)
  // Hero: een echte boottocht uit de feed als die er is, anders onze eigen
  // vlootfoto — nooit een leeg vlak.
  const heroImage = covers['boat-trip'] || covers['boat-party'] || covers['private-boat-charters'] || '/fleet/cover.jpeg'
  const loc: Locale = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const Guide = ({ en: GuideEn, nl: GuideNl, de: GuideDe, fr: GuideFr, es: GuideEs } as Record<string, () => JSX.Element>)[locale] ?? GuideEn

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[{ name: homeLabel(locale), path: '' }, { name: crumbLabel('boats', locale) }]}
      />
      <BoatsHub locale={locale} covers={covers} heroImage={heroImage} />
      {/* De goedkoopste kant van de eigen vloot, berekend uit fleet.ts. Staat
          vóór de gids: "wat kost de goedkoopste boot" is de vraag waarmee
          mensen binnenkomen, en die hoorde niet pas twee schermen lager als
          losse zin in een FAQ te staan. Eén component voor vijf talen, want de
          cijfers erin zijn taalonafhankelijk. */}
      <CheapBoats locale={loc} />
      {/* De bootverhuurgids — de vroegere pillar /boat-rental-ibiza en zijn
          vier vertalingen, hier samengevoegd. Eigen H2, prijstabel, FAQ (met
          schema uit dezelfde array) en byline. BoatRentalPromo stond hier
          eerst en linkte naar diezelfde pillar; dat is nu een link naar
          zichzelf en dus weg. PageFaq('boats') had nooit inhoud. */}
      <Guide />
    </>
  )
}
