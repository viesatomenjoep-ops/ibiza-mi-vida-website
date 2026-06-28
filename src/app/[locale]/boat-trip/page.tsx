import { getDictionary } from '@/lib/dictionary'
import BoatTripClient from './BoatTripClient'

export default async function BoatTripPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <BoatTripClient dict={dict} />
}
