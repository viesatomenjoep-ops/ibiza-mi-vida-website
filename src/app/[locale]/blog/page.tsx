import { redirect } from 'next/navigation'

// The blog was removed at the owner's request — send readers to the tips guide.
export default function BlogPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/tips`)
}
