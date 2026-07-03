import { getDictionary } from '@/lib/dictionary'
import CarScooterRentalClient from './CarScooterRentalClient'

export default async function CarScooterRentalPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <CarScooterRentalClient locale={locale} />
}
