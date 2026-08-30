import React from 'react'
import type { Metadata } from 'next'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { getDictionary } from '@/lib/dictionary'
import HomePageClient from './HomePageClient'
import { HomeJsonLd } from '@/components/seo/HomeJsonLd'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { HOME_TITLE, HOME_DESC } from '@/lib/seo-pages'
import { FLEET } from '@/data/fleet'
import { pickCover } from '@/lib/blank-covers';
import { eventBasePath } from '@/lib/event-path';
import { addDays } from '@/lib/date-label';

export const revalidate = 3600

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  return pageMetadata({
    locale,
    path: '',
    title: HOME_TITLE[locale],
    description: HOME_DESC[locale],
  })
}

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

  // Full set of upcoming events for the homepage calendar picker.
  // Only REAL nightclubs (venue type 'clubbing') — boats, ferries, day trips and
  // activities (e.g. Thera, Beach Hopper) are filtered out of the homepage planner.
  const venueLogoBySlug = new Map(allVenues.map(v => [v.slug, v.whitelogo || v.picture || '']));
  const clubbingSlugs = new Set(
    allVenues.filter(v => ((v as any).type?.slug || '') === 'clubbing').map(v => v.slug)
  );
  const pickerEvents = allDates
    .filter(d => /^\d{4}-\d{2}-\d{2}/.test(d.date || '') && (d.date || '') >= todayStr && clubbingSlugs.has(d.venueSlug || ''))
    .map(d => {
      const m = String(d.prices || '').match(/\d+([.,]\d+)?/);
      return {
        id: `${d.id}-${d.eventSlug}`,
        clubSlug: d.venueSlug || '',
        clubName: d.venueName || '',
        clubLogo: venueLogoBySlug.get(d.venueSlug || '') || d.venueLogo || '',
        eventSlug: d.eventSlug || '',
        eventName: d.eventName || d.name || '',
        // Skip ClubTickets' blank placeholders so the fallback reaches a real
        // picture instead of rendering a black box.
        image: pickCover(d.eventCover, d.eventLogo, d.venueCover, venueLogoBySlug.get(d.venueSlug || '')),
        date: d.date || '',
        price: m ? parseFloat(m[0].replace(',', '.')) : 0,
        lineUp: d.lineUp || '',
        href: `/${params.locale}/club-tickets/${d.venueSlug}/${d.eventSlug}`,
        affLink: d.affLink || '',
      };
    });

  // ── Deals of the Day: soonest upcoming events per category (+ private boats) ──
  const typeBySlug = new Map(allVenues.map(v => [v.slug, (v as any).type?.slug || '']))
  const dLabel = (iso: string) => { try { return new Date(iso).toLocaleDateString(params.locale === 'nl' ? 'nl-NL' : params.locale === 'es' ? 'es-ES' : params.locale === 'de' ? 'de-DE' : params.locale === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) } catch { return '' } }
  const priceOf = (s: any) => { const m = String(s || '').match(/\d+([.,]\d+)?/); return m ? parseFloat(m[0].replace(',', '.')) : 0 }
  // Which of our own category pages exists per venue type (so water/land deals open
  // OUR event page first, then the user clicks through to ClubTickets to pay).
  const BASEPATH_BY_TYPE: Record<string, string> = { activities: 'activities', 'formentera-day-trip': 'ferry-formentera', boat: 'boat-trip' }
  const dealFrom = (d: any, kind: 'clubs' | 'water' | 'land') => {
    const vtype = typeBySlug.get(d.venueSlug || '') || ''
    const basePath = kind === 'clubs' ? 'club-tickets' : BASEPATH_BY_TYPE[vtype]
    const internal = basePath ? `/${params.locale}/${basePath}/${d.venueSlug}/${d.eventSlug}` : undefined
    return {
      id: `${d.id}-${d.eventSlug}`,
      title: d.eventName || d.name || '',
      sub: d.venueName || '',
      image: pickCover(d.eventCover, d.eventLogo, d.venueCover),
      price: priceOf(d.prices),
      dateLabel: dLabel(d.date),
      href: internal,
      ext: internal ? undefined : (d.affLink || ''),
    }
  }
  const upcomingSorted = allDates.filter(d => (d.date || '') >= todayStr).sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  const bucket = (pred: (t: string) => boolean, kind: 'clubs' | 'water' | 'land') => {
    const out: any[] = []; const seen = new Set<string>()
    for (const d of upcomingSorted) {
      const t = typeBySlug.get(d.venueSlug || '') || ''
      if (!pred(t)) continue
      const key = d.venueSlug + '|' + d.eventSlug
      if (seen.has(key)) continue
      seen.add(key); out.push(dealFrom(d, kind))
      if (out.length >= 8) break
    }
    return out
  }
  const deals = {
    clubs: bucket(t => t === 'clubbing', 'clubs'),
    water: bucket(t => t === 'boat' || t === 'formentera-day-trip', 'water'),
    land: bucket(t => t === 'activities', 'land'),
    boats: FLEET.slice(0, 6).map(b => ({
      id: b.slug,
      title: b.name ? `${b.name} · ${b.model}` : b.model,
      sub: b.marina,
      image: b.image,
      price: b.price.low,
      priceLabel: '/dag',
      dateLabel: dLabel(todayStr),
      href: `/${params.locale}/private-boat-charters#boat-${b.slug}`,
    })),
  }

  // Everything that is NOT a nightclub — boats, ferries, catamarans, jet skis,
  // buggies, excursions. These sit in the same feed but were never surfaced on
  // the homepage, so a visitor saw only the club side of the business.
  const mapDate = (d: typeof allDates[number]) => ({
    id: d.id,
    name: d.name,
    date: d.date,
    prices: d.prices,
    ct_events: {
      name: d.eventName,
      slug: d.eventSlug,
      logo: d.eventLogo,
      cover: pickCover(d.eventCover, d.eventLogo, d.venueCover)
    },
    ct_venues: {
      name: d.venueName,
      slug: d.venueSlug,
      // The section links through eventBasePath(), because only 'clubbing'
      // lives under /club-tickets — sending a boat there is a guaranteed 404.
      basePath: eventBasePath(typeBySlug.get(d.venueSlug || ''))
    }
  });

  // Both featured strips cycle through this many days rather than showing one.
  // A visitor arriving in the evening was being shown a programme that had
  // largely already happened.
  const DAYS = 3;
  const dayList = Array.from({ length: DAYS }, (_, i) => addDays(todayStr, i));
  const onDay = (iso: string) => allDates.filter(d => (d.date || '').slice(0, 10) === iso);

  // One event per provider before any provider gets a second slot. Without
  // this, a single operator running eight jet-ski departures a day eats most
  // of the grid and the buggy and quad tours never appear at all.
  const spreadByVenue = <T extends { venueSlug?: string }>(rows: T[]): T[] => {
    const groups = new Map<string, T[]>();
    for (const r of rows) {
      const k = r.venueSlug || '';
      const g = groups.get(k);
      if (g) g.push(r); else groups.set(k, [r]);
    }
    const lists = Array.from(groups.values());
    const out: T[] = [];
    for (let i = 0; ; i++) {
      const before = out.length;
      for (const l of lists) if (i < l.length) out.push(l[i]);
      if (out.length === before) return out;
    }
  };

  // Weighted round-robin across venue types instead of the feed's own order.
  // Straight slicing gave twelve boats and ferries every time: the feed lists
  // water first and there is enough of it to fill the grid before a single
  // land activity is reached. The section is called "on the water AND
  // activities", so it has to actually contain both.
  //
  // 'activities' is weighted double because ClubTickets files land and water
  // sport under that one type — jet skis and SUP sit next to buggies, quads
  // and jeep safaris — so an equal share would still come out mostly wet.
  const weave = <T,>(buckets: { rows: T[]; weight: number }[], max: number): T[] => {
    const out: T[] = [];
    const at = buckets.map(() => 0);
    for (;;) {
      const before = out.length;
      buckets.forEach((b, bi) => {
        for (let w = 0; w < b.weight && out.length < max; w++) {
          if (at[bi] < b.rows.length) out.push(b.rows[at[bi]++]);
        }
      });
      if (out.length >= max || out.length === before) return out;
    }
  };

  const experienceDays = dayList.map(iso => {
    const rows = onDay(iso);
    const ofType = (t: string) =>
      spreadByVenue(rows.filter(d => (typeBySlug.get(d.venueSlug || '') || '') === t));
    return {
      date: iso,
      items: weave(
        [
          { rows: ofType('activities'), weight: 2 },
          { rows: ofType('boat'), weight: 1 },
          { rows: ofType('formentera-day-trip'), weight: 1 },
        ],
        12,
      ).map(mapDate),
    };
  }).filter(d => d.items.length > 0);

  const clubDays = dayList.map(iso => ({
    date: iso,
    // Same provider-spread as the experiences grid: a club with four rooms
    // billed as four events should not take a third of the night's line-up.
    items: spreadByVenue(onDay(iso).filter(d => clubbingSlugs.has(d.venueSlug || '')))
      .slice(0, 12)
      .map(d => ({
        id: d.id,
        name: d.name,
        date: d.date,
        prices: d.prices,
        ct_events: {
          name: d.eventName,
          slug: d.eventSlug,
          logo: d.eventLogo,
          cover: pickCover(d.eventCover, d.eventLogo, d.venueCover)
        },
        ct_venues: {
          name: d.venueName,
          slug: d.venueSlug
        }
      })),
  })).filter(d => d.items.length > 0);

  return (
    <>
    <HomeJsonLd locale={params.locale} />
    <HomePageClient
      locale={params.locale} 
      translations={dict}
      featuredClubs={featuredClubs}
      clubDays={clubDays}
      experienceDays={experienceDays}
      pickerEvents={[...pickerEvents].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 250)}
      deals={deals}
      liveByClub={liveByClub}
      todayStr={todayStr}
      allVenues={allVenues.map(v => ({
        slug: v.slug,
        name: v.name,
        picture: v.picture,
        whitelogo: v.whitelogo,
        isDayClub: (v as any).isDayClub,
        typeSlug: (v as any).type?.slug || ''
      }))}
    />
    </>
  )
}
