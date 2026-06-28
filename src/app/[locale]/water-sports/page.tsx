import { getDictionary } from '@/dictionaries'
import WaterSportsClient from './WaterSportsClient'

export default async function WaterSportsPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <WaterSportsClient dict={dict} />
}
