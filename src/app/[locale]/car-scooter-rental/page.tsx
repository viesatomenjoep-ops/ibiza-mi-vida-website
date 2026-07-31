import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'car-scooter-rental')
}

import { getDictionary } from '@/lib/dictionary'
import CarScooterRentalClient from './CarScooterRentalClient'

export default async function CarScooterRentalPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <CarScooterRentalClient locale={locale} />
}
