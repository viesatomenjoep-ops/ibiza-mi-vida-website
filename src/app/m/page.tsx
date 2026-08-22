import { getVenues, getAllDates } from '@/lib/clubtickets'
import { MobileApp } from '@/components/mobile/MobileApp'
import type { AppEvent, AppVenue } from '@/components/mobile/types'
import { getLabels, APP_LOCALES } from '@/components/mobile/i18n'

export const revalidate = 3600

const priceOf = (s: unknown) => {
  const m = String(s || '').match(/\d+([.,]\d+)?/)
  return m ? Math.round(parseFloat(m[0].replace(',', '.'))) : 0
}

export default async function MobileAppPage({
  searchParams,
}: {
  searchParams: { lang?: string }
}) {
  const locale = (APP_LOCALES as string[]).includes(searchParams.lang || '')
    ? (searchParams.lang as string)
    : 'en'

  const [venuesRaw, datesRaw] = await Promise.all([getVenues(locale), getAllDates(locale)])

  const typeBySlug = new Map(venuesRaw.map(v => [v.slug, v.type?.slug || '']))
  const logoBySlug = new Map(venuesRaw.map(v => [v.slug, v.whitelogo || v.picture || '']))
  const todayStr = new Date().toISOString().slice(0, 10)

  // Next ~90 days, capped — plenty for every screen without bloating the payload.
  const horizon = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10)
  const events: AppEvent[] = datesRaw
    .filter(d => /^\d{4}-\d{2}-\d{2}/.test(d.date || '') && d.date.slice(0, 10) >= todayStr && d.date.slice(0, 10) <= horizon)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .slice(0, 600)
    .map(d => ({
      id: `${d.id}-${d.eventSlug || ''}`,
      date: d.date.slice(0, 10),
      time: d.date.length >= 16 ? d.date.slice(11, 16) : undefined,
      name: d.eventName || d.name || 'Event',
      venueName: d.venueName || '',
      venueSlug: d.venueSlug || '',
      venueTypeSlug: typeBySlug.get(d.venueSlug || '') || '',
      cover: d.eventCover || d.eventLogo || d.venueCover || '',
      venueLogo: logoBySlug.get(d.venueSlug || '') || d.venueLogo || '',
      price: priceOf(d.prices),
      lineUp: (d.lineUp || '').replace(/<[^>]+>/g, ' ').replace(/(\s*-\s*)+/g, ', ').replace(/\s+/g, ' ').replace(/^,\s*/, '').trim(),
      affLink: d.affLink || '',
    }))

  const venues: AppVenue[] = venuesRaw
    .filter(v => v.slug && v.name)
    .map(v => ({
      slug: v.slug,
      name: v.name,
      typeSlug: v.type?.slug || '',
      isDayClub: !!v.isDayClub,
      whitelogo: v.whitelogo || '',
      cover: v.cover || '',
      picture: v.picture || '',
      activeEvents: v.activeEvents || 0,
    }))

  return <MobileApp events={events} venues={venues} labels={getLabels(locale)} locale={locale} />
}
