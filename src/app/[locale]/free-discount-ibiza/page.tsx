import { redirect } from 'next/navigation'

// Free & Discount was removed at the owner's request — the guestlist covers it.
export default function FreeDiscountPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/guestlist`)
}
