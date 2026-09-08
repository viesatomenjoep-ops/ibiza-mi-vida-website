import React from 'react'
import type { Metadata } from 'next'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { getDictionary } from '@/lib/dictionary'
import HomePageClient from './HomePageClient'
import { HomeJsonLd } from '@/components/seo/HomeJsonLd'
import { RentalsSection } from '@/components/hub/RentalsSection'
import { HomeFaq } from '@/components/home/HomeFaq'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { HOME_TITLE, HOME_DESC } from '@/lib/seo-pages'
import { FLEET } from '@/data/fleet'
import { pickCover } from '@/lib/blank-covers';
import { eventBasePath } from '@/lib/event-path';
import { withDate } from '@/lib/event-date-param'
import { addDays } from '@/lib/date-label';
import { buildHomeDays } from '@/lib/home-days';
import { getGoogleReviews } from '@/lib/google-reviews';
import { GoogleReviews } from '@/components/reviews/GoogleReviews';
import { ReviewSchema } from '@/components/seo/ReviewSchema';
import { ibizaToday, ibizaTonight } from '@/lib/date-label';

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

  // Real Google Business Profile rating, or null. Null is the expected result
  // until the profile is verified and the two env vars are set — the hero then
  // simply carries no badge rather than a made-up one.
  const reviews = await getGoogleReviews()

  const allVenues = await getVenues(params.locale);

  // Fetch upcoming dates from local compiled JSON
  const allDates = await getAllDates(params.locale);
  const todayStr = ibizaToday();
  // Clubavonden staan in de feed op de datum waarop ze BEGINNEN en lopen door
  // tot zes uur 's ochtends. Tussen middernacht en 06:00 is "vanavond" dus de
  // vórige kalenderdag; op todayStr filteren liet het feest dat op dat moment
  // aan de gang was uit de lijst vallen, precies op het uur dat mensen kopen.
  // Dagactiviteiten houden todayStr — zie de toelichting bij ibizaTonight().
  const tonightStr = ibizaTonight();

  /**
   * Uitgelichte clubs, roulerend in plaats van vier vaste namen.
   *
   * Stond hardgecodeerd op Hi, Ushuaia, Eden en Es Paradis. Wie twee dagen op
   * rij kijkt zag dus twee keer hetzelfde, terwijl er vijftien clubs in de
   * agenda staan — en de club die vanavond zijn openingsavond heeft stond er
   * misschien niet bij.
   *
   * De volgorde draait mee met de dag van het jaar. Dat is bewust geen
   * willekeur: dezelfde dag geeft dezelfde volgorde, dus server en browser
   * renderen hetzelfde en er ontstaat geen hydration-mismatch. Elke dag
   * schuift het venster vier clubs op, zodat over vier dagen de hele lijst
   * langskomt.
   *
   * Clubs zonder logo vallen af: een kaart met een lege plek is slechter dan
   * een kaart minder.
   */
  const clubPool = allVenues.filter(v => v.type?.slug === 'clubbing' && v.whitelogo);
  const dagVanJaar = Math.floor(
    (Date.parse(todayStr) - Date.parse(todayStr.slice(0, 4) + '-01-01')) / 86400000,
  );
  const start = clubPool.length ? (dagVanJaar * 4) % clubPool.length : 0;
  const featuredClubs = Array.from({ length: Math.min(4, clubPool.length) }, (_, i) => {
    const v = clubPool[(start + i) % clubPool.length];
    return { name: v.name, slug: v.slug, whitelogo: v.whitelogo, cover: v.cover };
  });

  // ── LIVE EVENT TRACKER ──
  // Build a per-club map of events happening today (and last night) so the
  // homepage slider can show live status dots. Time-of-day logic runs client-side.
  const yesterdayStr = addDays(todayStr, -1);
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
    .filter(d => /^\d{4}-\d{2}-\d{2}/.test(d.date || '') && (d.date || '') >= tonightStr && clubbingSlugs.has(d.venueSlug || ''))
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
        href: withDate(`/${params.locale}/club-tickets/${d.venueSlug}/${d.eventSlug}`, d.date),
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
  // Ruim filteren op de nacht; per soort wordt hieronder bijgesteld, want een
  // boottocht van vanochtend hoort na middernacht wél weg en een clubavond niet.
  const upcomingSorted = allDates.filter(d => (d.date || '') >= tonightStr).sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  const bucket = (pred: (t: string) => boolean, kind: 'clubs' | 'water' | 'land') => {
    const out: any[] = []; const seen = new Set<string>()
    for (const d of upcomingSorted) {
      const t = typeBySlug.get(d.venueSlug || '') || ''
      if (!pred(t)) continue
      // Alleen clubavonden mogen over middernacht heen blijven staan. Een
      // jetski of jeepsafari van gisteren is om 01:00 echt voorbij.
      if (kind !== 'clubs' && (d.date || '') < todayStr) continue
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

  // De mapping van een feedregel naar een kaart stond hier; die woont nu in
  // lib/home-days.ts, samen met de dagenopbouw, zodat de route die een volgende
  // week bijlaadt dezelfde vorm teruggeeft.

  // Beide uitgelichte stroken lopen door dit aantal dagen heen in plaats van
  // één dag te tonen. Wie 's avonds binnenkomt kreeg anders een programma dat
  // grotendeels al geweest was.
  //
  // Zeven dagen: een hele week. Bij vier dagen kon je op woensdag niet zien wat
  // er zondag speelt, terwijl juist dat de dag is waarop mensen hun weekend
  // indelen. Zeven is ook de eenheid waarin de bezoeker zelf denkt -- "wie
  // draait er deze week" -- en het is precies één rij in de dagkiezer.
  const DAYS = 7;
  // Alles wat er die dag is, tot een bovengrens die in de praktijk niet
  // geraakt wordt. Gemeten over de eerstvolgende negen dagen: hoogstens
  // zestien clubavonden en tweeenveertig activiteiten per dag.
  //
  // Dat kan omdat de stroken hieronder geen raster meer zijn maar een rij die
  // je naar rechts schuift (zie HomeRail). Een raster van drie kaarten kon
  // niet meer tonen zonder de pagina te laten uitdijen; een rij houdt dezelfde
  // hoogte, ongeacht hoeveel erin staat. En er staat altijd maar een dag in de
  // DOM, met lui geladen afbeeldingen, dus van tweeenveertig kaarten laden er
  // drie een plaatje tot je schuift.
  //
  // De grens van zestig blijft staan als vangnet: als ClubTickets ooit een dag
  // met tweehonderd regels teruggeeft hoort dat de homepage niet om te leggen.
  //
  // Dit voedt ook de ringcarrousel bovenaan. Die had bij drie per dag maar
  // twaalf excursies om uit te putten, en na aftrek van dubbele aanbieders en
  // items zonder afbeelding bleven er soms drie over -- te weinig voor een
  // ring, laat staan voor vier categorieen.
  // De dagenlijsten voor de vier werelden komen uit buildHomeDays(), zodat de
  // route /api/home-days -- die de kiezer gebruikt om een volgende week bij te
  // laden -- exact dezelfde opbouw hanteert. Stond dit hier nog met de hand,
  // dan zou een bijgeladen week er ongemerkt anders uit kunnen gaan zien dan
  // de week ervoor.
  //
  // nachtStr en todayStr apart: clubavonden lopen door tot een uur of zes 's
  // ochtends, dagactiviteiten niet. Zie ibizaTonight().
  const { clubDays, experienceDays } = await buildHomeDays(params.locale, tonightStr, todayStr, DAYS);

  // reviewsSlot: zichtbare reviews én hun Review/AggregateRating-markup op
  // dezelfde pagina, uit dezelfde gecachte fetch. Schema zonder zichtbare
  // tegenhanger is een overtreding van Google's beleid, en zichtbaar zonder
  // schema laat rich results liggen. Allebei renderen niets zonder echte data.
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
      tonightStr={tonightStr}
      todayStr={todayStr}
      rating={reviews ? { rating: reviews.rating, total: reviews.total, url: reviews.url } : null}
      allVenues={allVenues.map(v => ({
        slug: v.slug,
        name: v.name,
        picture: v.picture,
        whitelogo: v.whitelogo,
        isDayClub: (v as any).isDayClub,
        typeSlug: (v as any).type?.slug || ''
      }))}
      rentalsSlot={<RentalsSection locale={params.locale} />}
      reviewsSlot={<><GoogleReviews locale={params.locale} /><ReviewSchema /></>}
      faqSlot={<HomeFaq locale={params.locale} />}
    />
    </>
  )
}
