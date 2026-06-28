import { getDictionary } from '@/dictionaries'
import DrinkPackagesClient from './DrinkPackagesClient'

export default async function DrinkPackagesPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <DrinkPackagesClient dict={dict} />
}
