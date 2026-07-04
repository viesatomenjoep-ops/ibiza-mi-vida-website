import React from 'react'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { getDictionary } from '@/lib/dictionary'
import HomePageClient from './HomePageClient'

export const revalidate = 3600

export default async function Home({ params }: { params: { locale: string } }) {
  const dict = getDictionary(params.locale)

  // Fetch top featured clubs from local compiled JSON
  const allVenues = await getVenues(params.locale);
  const featuredClubs = allVenues
    .filter(v => ['hi-ibiza', 'ushuaia-ibiza', 'eden-ibiza', 'es-paradis'].includes(v.slug))
    .map(v => ({
      name: v.name,
      slug: v.slug,
      whitelogo: v.whitelogo,
      cover: v.cover
    }));

  // Fetch upcoming dates from local compiled JSON
  const allDates = await getAllDates(params.locale);
  const todayStr = new Date().toISOString().split('T')[0];

  // ── LIVE EVENT TRACKER ──
  // Build a per-club map of events happening today (and last night) so the
  // homepage slider can show live status dots. Time-of-day logic runs client-side.
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const dayClubBySlug = new Map(allVenues.map(v => [v.slug, !!(v as any).isDayClub]));
  const liveByClub: Record<string, { today: { name: string; slug?: string }[]; lastNight: { name: string; slug?: string }[]; isDayClub: boolean }> = {};
  for (const d of allDates) {
    const day = (d.date || '').slice(0, 10);
    const isToday = day === todayStr;
    const isYesterday = day === yesterdayStr;
    if ((!isToday && !isYesterday) || !d.venueSlug) continue;
    const rec = liveByClub[d.venueSlug] || (liveByClub[d.venueSlug] = {
      today: [], lastNight: [], isDayClub: dayClubBySlug.get(d.venueSlug) || false,
    });
    const item = { name: d.eventName || d.name || 'Event', slug: d.eventSlug };
    if (isToday && rec.today.length < 3) rec.today.push(item);
    if (isYesterday && rec.lastNight.length < 3) rec.lastNight.push(item);
  }

  const upcomingDates = allDates
    .filter(d => d.date >= todayStr)
    .slice(0, 10)
    .map(d => ({
      id: d.id,
      name: d.name,
      date: d.date,
      prices: d.prices,
      ct_events: {
        name: d.eventName,
        slug: d.eventSlug,
        logo: d.eventLogo,
        cover: d.eventCover
      },
      ct_venues: {
        name: d.venueName,
        slug: d.venueSlug
      }
    }));

  return (
    <HomePageClient 
      locale={params.locale} 
      translations={dict}
      featuredClubs={featuredClubs}
      upcomingDates={upcomingDates}
      liveByClub={liveByClub}
      allVenues={allVenues.map(v => ({
        slug: v.slug,
        name: v.name,
        picture: v.picture,
        whitelogo: v.whitelogo,
        isDayClub: (v as any).isDayClub,
        typeSlug: (v as any).type?.slug || ''
      }))}
    />
  )
}
