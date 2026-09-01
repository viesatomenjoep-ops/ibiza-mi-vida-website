import { permanentRedirect } from 'next/navigation'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * 301 to /guestlist.
 *
 * This page was added earlier today as a keyword-slug hub for "ibiza
 * guestlist" — while /[locale]/guestlist already existed and covered the same
 * query in five languages. That is two of our own URLs competing for one
 * search, which splits their links and leaves Google to pick one, usually not
 * the one you wanted. It is the exact mistake written down as a rule in
 * CLAUDE.md, made by the person who wrote the rule.
 *
 * The correct shape is one page per query, so /guestlist keeps the topic — it
 * has the working sign-up form, five locales, and the nav and footer already
 * point at it — and this slug redirects into it permanently rather than being
 * deleted, because it was live and may have been linked.
 */
export default function IbizaGuestlistRedirect({ params }: { params: { locale: string } }) {
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  permanentRedirect(`/${l}/guestlist`)
}
