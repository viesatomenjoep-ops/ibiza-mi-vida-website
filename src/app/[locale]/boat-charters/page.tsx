import { getDictionary } from '@/dictionaries'
import BoatChartersClient from './BoatChartersClient'

export default async function BoatChartersPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <BoatChartersClient dict={dict} />
}
