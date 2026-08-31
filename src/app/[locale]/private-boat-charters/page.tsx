import type { Metadata } from 'next'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import { FleetPriceBlock } from '@/components/boats/FleetPriceBlock'
import { SERVICE_COPY } from '@/lib/service-schema-copy'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { getDictionary } from '@/lib/dictionary'
import PrivateBoatChartersClient from './PrivateBoatChartersClient'
import { PageFaq } from '@/components/seo/PageFaq'
import { BoatAdviceCta } from '@/components/boats/BoatAdviceCta'
import { SailingRoutes } from '@/components/boats/SailingRoutes'
import { AuthorByline } from '@/components/seo/AuthorByline'

export const revalidate = 3600

/**
 * Metadata voor de charterpagina.
 *
 * Stond hier als kaal Metadata-object met `isNl ? nl : en`. Twee gevolgen, en
 * allebei op de commercieel belangrijkste pagina van de site:
 *
 *  1. Duitse, Spaanse en Franse bezoekers kregen een Engelse titel en
 *     omschrijving. De pagina zelf is wel vertaald, alleen wat Google toont
 *     niet — dus in drie van de vijf markten stond er iets anders in de
 *     zoekresultaten dan op de pagina.
 *  2. Geen canonical en geen hreflang. Elke andere pagina krijgt die via
 *     pageMetadata; deze sloeg dat over, waardoor vijf taalversies zonder
 *     onderlinge koppeling naast elkaar stonden.
 *
 * De oude omschrijving beloofde "inclusief brandstof, drankjes en snorkels".
 * Dat is een commerciële toezegging die per boot en per boeking verschilt en
 * die ik niet kan verifiëren; een verkeerde belofte hier eindigt in een
 * verrassing op de rekening. Wat eronder staat is wel te controleren: de
 * vloot, met of zonder schipper, de jachthavens en de bestemmingen.
 */
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const TITLE: Record<Locale, string> = {
    nl: 'Privéboot of jacht huren op Ibiza | Met of zonder schipper',
    en: 'Private boat and yacht charter Ibiza | With or without skipper',
    de: 'Privatboot und Yacht mieten auf Ibiza | Mit oder ohne Skipper',
    es: 'Alquiler de barco y yate privado en Ibiza | Con o sin patrón',
    fr: 'Location de bateau et yacht privé à Ibiza | Avec ou sans skipper',
  }
  const DESC: Record<Locale, string> = {
    nl: 'Huur een privéboot of jacht op Ibiza, met of zonder schipper, vanaf jachthavens rond het eiland. Vaarroutes langs Es Vedrà, de noordkust en Formentera, met de baaien waar je ankert.',
    en: 'Charter a private boat or yacht in Ibiza, with or without a skipper, from marinas around the island. Sailing routes past Es Vedrà, the north coast and Formentera, with the bays you anchor in.',
    de: 'Chartere ein Privatboot oder eine Yacht auf Ibiza, mit oder ohne Skipper, ab Marinas rund um die Insel. Routen entlang Es Vedrà, der Nordküste und Formentera, mit den Buchten zum Ankern.',
    es: 'Alquila un barco o yate privado en Ibiza, con o sin patrón, desde puertos de toda la isla. Rutas por Es Vedrà, la costa norte y Formentera, con las calas donde se fondea.',
    fr: 'Louez un bateau ou yacht privé à Ibiza, avec ou sans skipper, au départ des ports de l\'île. Itinéraires vers Es Vedrà, la côte nord et Formentera, avec les criques où mouiller.',
  }
  return pageMetadata({
    locale: l,
    path: 'private-boat-charters',
    title: TITLE[l],
    description: DESC[l],
  })
}

export default async function PrivateBoatChartersPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const sc = SERVICE_COPY['private-boat-charters']

  return (
    <>
      <ServiceSchema name={sc.name[l]} description={sc.description[l]} serviceType={sc.serviceType} path={`${l}/private-boat-charters`} />
      <PrivateBoatChartersClient locale={locale} />
      {/* Direct onder de hero: "wat kost het" is de eerste vraag, en het
          antwoord stond nergens op de pagina. Ranges uit de eigen vloot,
          niet als marktcijfer — zie FleetPriceBlock voor het waarom. */}
      <FleetPriceBlock locale={l} />
      <SailingRoutes locale={locale} />
      <BoatAdviceCta locale={locale} />
      <PageFaq pageKey="private-boat-charters" locale={locale} />
      <AuthorByline locale={locale} topic="private boat charters in Ibiza" />
    </>
  )
}
