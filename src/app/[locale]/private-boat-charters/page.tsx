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
import { BoatRentalPromo } from '@/components/hub/BoatRentalPromo'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { getLiveFleet, ibizaToday } from '@/lib/yacht-broker'

// 900 en niet 3600: de live beschikbaarheid staat nu in de HTML zelf (zie
// hieronder) en de partnerfeed wordt 15 minuten gecachet. Een pagina die een
// uur blijft staan zou een boot als vrij tonen die al drie kwartier weg is.
export const revalidate = 900

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
    nl: 'Privéboot huren op Ibiza',
    en: 'Private boat charter Ibiza',
    de: 'Privatboot mieten auf Ibiza',
    es: 'Alquiler de barco privado Ibiza',
    fr: 'Location de bateau privé Ibiza',
  }
  const DESC: Record<Locale, string> = {
    nl: 'Huur een privéboot of jacht op Ibiza, met of zonder schipper, vanaf jachthavens rond het eiland. Routes langs Es Vedrà en Formentera, met eigen dagtarieven.',
    en: 'Charter a private boat or yacht in Ibiza, with or without a skipper, from marinas around the island. Routes past Es Vedrà and Formentera, with our day rates.',
    de: 'Chartere ein Privatboot oder eine Yacht auf Ibiza, mit oder ohne Skipper, ab Marinas der Insel. Routen zu Es Vedrà und Formentera, mit unseren Tagespreisen.',
    es: 'Alquila un barco o yate privado en Ibiza, con o sin patrón, desde puertos de la isla. Rutas por Es Vedrà y Formentera, con nuestras tarifas diarias.',
    fr: 'Louez un bateau ou yacht privé à Ibiza, avec ou sans skipper, au départ des ports. Itinéraires vers Es Vedrà et Formentera, avec nos tarifs journaliers.',
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

  // De live laag (beschikbaarheid + dagprijs per boot) komt hier server-side
  // op, uit dezelfde 15-minutencache als /api/fleet-live. Eerst haalde de
  // client hem na mount op: één extra verzoek per bezoeker, een layout shift
  // over 94 kaarten zodra de statusregels verschenen, en een crawler zonder
  // JavaScript zag de beschikbaarheid nooit. `null` bij storing — dan staan
  // de statische prijsbanden er gewoon, zonder live regel; niets verzonnen.
  const live = await getLiveFleet()

  return (
    <>
      <ServiceSchema name={sc.name[l]} description={sc.description[l]} serviceType={sc.serviceType} path={`${l}/private-boat-charters`} />
      <PrivateBoatChartersClient locale={locale} live={live} today={ibizaToday()} />
      {/* Direct onder de hero: "wat kost het" is de eerste vraag, en het
          antwoord stond nergens op de pagina. Ranges uit de eigen vloot,
          niet als marktcijfer — zie FleetPriceBlock voor het waarom. */}
      <FleetPriceBlock locale={l} />
      <SailingRoutes locale={locale} />
      <BoatAdviceCta locale={locale} />
      <BoatRentalPromo locale={locale} />
      <PageFaq pageKey="private-boat-charters" locale={locale} />
      <AuthorByline locale={locale} topic="private boat charters in Ibiza" />
    </>
  )
}
