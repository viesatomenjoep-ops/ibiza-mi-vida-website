import { redirect } from 'next/navigation'

// The Ibiza Tips content lives at /tips (where the nav and footer point).
export default function IbizaTipsPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/tips`)
}
