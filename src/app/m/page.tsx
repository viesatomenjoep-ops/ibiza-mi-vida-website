import { getVenues, getAllDates, getArtists } from '@/lib/clubtickets'
import { MobileApp } from '@/components/mobile/MobileApp'
import type { AppEvent, AppVenue, AppArtist, AppBoat } from '@/components/mobile/types'
import { getLabels, APP_LOCALES } from '@/components/mobile/i18n'
import { FLEET } from '@/data/fleet'
import { cloudinaryVideo, cloudinaryVideoPoster, MEDIA } from '@/lib/cloudinary'
import { eventBasePath } from '@/lib/event-path'
import { ibizaTonight } from '@/lib/date-label'

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

  const [venuesRaw, datesRaw, artistsRaw] = await Promise.all([
    getVenues(locale),
    getAllDates(locale),
    getArtists(locale, 40),
  ])

  const typeBySlug = new Map(venuesRaw.map(v => [v.slug, v.type?.slug || '']))
  const tonightStr = ibizaTonight()

  // Payload discipline: this whole array ships twice (SSR HTML + hydration),
  // so every byte counts double. 60 days / 450 rows covers every screen;
  // venue logos are NOT per-event — the client derives them from `venues`.
  const horizon = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10)
  const events: AppEvent[] = datesRaw
    .filter(d => /^\d{4}-\d{2}-\d{2}/.test(d.date || '') && d.date.slice(0, 10) >= tonightStr && d.date.slice(0, 10) <= horizon)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .slice(0, 450)
    .map(d => ({
      id: `${d.id}-${d.eventSlug || ''}`,
      date: d.date.slice(0, 10),
      time: d.date.length >= 16 ? d.date.slice(11, 16) : undefined,
      name: d.eventName || d.name || 'Event',
      venueName: d.venueName || '',
      venueSlug: d.venueSlug || '',
      venueTypeSlug: typeBySlug.get(d.venueSlug || '') || '',
      cover: d.eventCover || d.eventLogo || d.venueCover || '',
      price: priceOf(d.prices),
      lineUp: (d.lineUp || '').replace(/<[^>]+>/g, ' ').replace(/(\s*-\s*)+/g, ', ').replace(/\s+/g, ' ').replace(/^,\s*/, '').trim().slice(0, 180),
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

  // The sync script writes every artist href as /club-tickets/<venue>/<event>,
  // but the "artists" list also contains boat trips and activities — those
  // event pages live under /activities, /boat-trip or /ferry-formentera, and
  // the club-tickets page hard-404s on non-club venues. Rebuild the href from
  // the venue's actual type.
  const artists: AppArtist[] = artistsRaw
    .filter(a => a.slug && a.name)
    .slice(0, 24)
    .map(a => ({
      slug: a.slug,
      name: a.name,
      image: a.image || '',
      venueName: a.venueName || '',
      href: a.venueSlug
        ? `/${eventBasePath(typeBySlug.get(a.venueSlug))}/${a.venueSlug}/${a.slug}`
        : a.href || '',
    }))

  // Fleet is a small, already-Cloudinary-optimized local dataset (see data/fleet.ts) —
  // safe to ship in full without repeating the payload-diet the events list needed.
  const boats: AppBoat[] = FLEET.map(b => ({
    slug: b.slug,
    name: b.name || b.model,
    model: b.model,
    image: b.image,
    marina: b.marina,
    pax: b.pax,
    priceFrom: b.price.low,
  }))

  // Hero video for the Agenda/Calendar start screen — same clips as the
  // marketing homepage, delivered through the same width-capped pipeline.
  const heroVideoSrc = cloudinaryVideo(MEDIA.homeHero[0])
  const heroVideoPoster = cloudinaryVideoPoster(heroVideoSrc) || ''

  return (
    <MobileApp
      events={events}
      venues={venues}
      artists={artists}
      boats={boats}
      labels={getLabels(locale)}
      locale={locale}
      heroVideoSrc={heroVideoSrc}
      heroVideoPoster={heroVideoPoster}
    />
  )
}
