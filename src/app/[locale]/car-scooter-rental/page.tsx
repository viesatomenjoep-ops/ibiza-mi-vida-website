import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'car-scooter-rental')
}

import { getDictionary } from '@/lib/dictionary'
import CarScooterRentalClient from './CarScooterRentalClient'
import { CarRentalPromo } from '@/components/hub/CarRentalPromo'

/**
 * Deze pagina was een lege huls: een zoekbalk, een tab en "binnenkort vind je
 * hier het volledige aanbod" boven een WhatsApp-knop. Voor autoverhuur bestaat
 * dat aanbod wel — via Wiber — dus staat het er nu ook, server-gerenderd onder
 * de bestaande shell in plaats van erin, zodat het zichtbaar is voor crawlers
 * die geen JavaScript draaien.
 *
 * De shell blijft staan omdat deze pagina ook over scooters gaat en dat deel
 * echt nog leeg is. Zodra daar aanbod voor is, hoort het in dezelfde vorm.
 */
export default async function CarScooterRentalPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return (
    <>
      <CarScooterRentalClient locale={locale} />
      {/* Op .pl-shell, dat wit is — de promo brengt zijn eigen donkere
          achtergrond mee en leest daar dus even goed als op de donkere home. */}
      <div className="bg-white">
        <CarRentalPromo locale={locale} />
      </div>
    </>
  )
}
