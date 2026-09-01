import { permanentRedirect } from 'next/navigation'

/**
 * Weggehaald om dezelfde reden als /car-scooter-rental: een lege huls met
 * "binnenkort vind je hier het volledige aanbod" en een WhatsApp-knop, meer
 * niet. Zulke pagina's indexeren kost meer dan het oplevert.
 *
 * 301 naar /package-deals: drankpakketten zijn onderdeel van wat daar wél
 * geregeld wordt, dus dat is het dichtstbijzijnde echte antwoord in plaats van
 * een 404 voor iedereen die de oude URL nog volgt.
 */
export default function DrinkPackagesPage({ params }: { params: { locale: string } }) {
  permanentRedirect(`/${params.locale}/package-deals`)
}
