import { getDictionary } from '@/dictionaries'
import IbizaTipsClient from './IbizaTipsClient'

export default async function IbizaTipsPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <IbizaTipsClient dict={dict} />
}
