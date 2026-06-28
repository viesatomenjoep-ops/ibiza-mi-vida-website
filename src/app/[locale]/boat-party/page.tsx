import { getDictionary } from '@/lib/dictionary'
import BoatPartyClient from './BoatPartyClient'

export default async function BoatPartyPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <BoatPartyClient dict={dict} />
}
