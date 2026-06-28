import { getDictionary } from '@/dictionaries'
import FerryFormenteraClient from './FerryFormenteraClient'

export default async function FerryFormenteraPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <FerryFormenteraClient dict={dict} />
}
