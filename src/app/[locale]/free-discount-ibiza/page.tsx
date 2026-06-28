import { getDictionary } from '@/lib/dictionary'
import FreeDiscountIbizaClient from './FreeDiscountIbizaClient'

export default async function FreeDiscountIbizaPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <FreeDiscountIbizaClient dict={dict} />
}
