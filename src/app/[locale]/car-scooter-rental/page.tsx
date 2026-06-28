import { getDictionary } from '@/dictionaries'
import CarScooterRentalClient from './CarScooterRentalClient'

export default async function CarScooterRentalPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <CarScooterRentalClient dict={dict} />
}
