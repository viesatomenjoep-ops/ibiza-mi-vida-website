import { getDictionary } from '@/lib/dictionary'
import DrinkPackagesClient from './DrinkPackagesClient'

export default async function DrinkPackagesPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <DrinkPackagesClient locale={locale} />
}
