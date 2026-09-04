'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Music } from 'lucide-react';
import { ClubLogoSlider } from '@/components/ui/ClubLogoSlider';
import type { PickerEvent } from '@/lib/picker-event';
import { type DealsData } from '@/components/home/HomeDeals';
import { HomeEventSlider } from '@/components/ui/HomeEventSlider';
import { HomeHeroVideo } from '@/components/home/HomeHeroVideo';
import { HeroShowIntro } from '@/components/home/HeroShowIntro';
import { HomeCategoryCarousel } from '@/components/home/HomeCategoryCarousel';
import { HomeUSP } from '@/components/home/HomeUSP';
import { HomeInstagram } from '@/components/home/HomeInstagram';
import { HomeNewsletter } from '@/components/home/HomeNewsletter';
import { HomeRingCarousel } from '@/components/home/HomeRingCarousel';
import { ArrowCircle } from '@/components/ui/ArrowCircle';
import { HomeTonight } from '@/components/home/HomeTonight';
import { HeroRatingBadge, type HeroRating } from '@/components/home/HeroRatingBadge';
import { HomeRail } from '@/components/home/HomeRail'
import { HomeVimeo } from '@/components/home/HomeVimeo'
import { FeaturedDayRotator } from '@/components/home/FeaturedDayRotator';
import { fmtShortDate } from '@/lib/date-label';

import { Reveal } from '@/components/ui/Reveal';
// Category-grid labels for the boat pages. These live here rather than in the
// shared dictionaries because the dictionaries have no keys for them yet and
// adding three keys x 5 locale JSON files for one grid is more churn than it
// is worth.
const CAT_BOATS: Record<string, string> = {
  nl: 'Ibiza per boot', en: 'Ibiza by boat', de: 'Ibiza per Boot', es: 'Ibiza en barco', fr: 'Ibiza en bateau',
}

const CAT_BOAT_PARTY: Record<string, string> = {
  nl: 'Boat parties', en: 'Boat parties', de: 'Boat Partys', es: 'Boat parties', fr: 'Boat parties',
}
const CAT_CHARTER: Record<string, string> = {
  nl: 'Privéboot huren', en: 'Private boat charter', de: 'Privatboot mieten', es: 'Barco privado', fr: 'Bateau privé',
}

interface HomePageProps {
  /**
   * Server-gerenderde verhuursectie, als slot doorgegeven.
   *
   * Deze component is een client component, maar de verhuurblokken hoeven
   * dat niet te zijn — en mogen het niet zijn: het zijn commerciële links
   * die een crawler zonder JavaScript moet kunnen lezen. React staat toe
   * een server component als prop door te geven aan een client component,
   * dus dat gebeurt hier, in plaats van het blok onderaan de pagina buiten
   * deze component te hangen waar niemand het ziet.
   */
  rentalsSlot?: React.ReactNode;
  /** Server-gerenderde FAQ: als import stond hij mét 127 kB faq-content in de clientbundle. */
  faqSlot?: React.ReactNode;
  locale?: string;
  translations?: any;
  featuredClubs?: any[];
  clubDays?: { date: string; items: any[] }[];
  /** Non-club events happening soon: boats, ferries, catamarans, activities. */
  experienceDays?: { date: string; items: any[] }[];
  pickerEvents?: PickerEvent[];
  deals?: DealsData;
  allVenues?: any[]; // includes typeSlug: 'clubbing' | 'boat' | ...
  liveByClub?: Record<string, { today: { name: string; slug?: string }[]; lastNight: { name: string; slug?: string }[]; isDayClub: boolean }>;
  /** Server-rendered ISO yyyy-mm-dd, so date labels are hydration-safe. */
  todayStr?: string;
  /** Live Google rating, or null when the profile has none to show. */
  rating?: HeroRating | null;
}

export default function HomePageClient({ locale = 'nl', translations = {}, featuredClubs = [], clubDays = [], experienceDays = [], pickerEvents = [], deals, allVenues = [], liveByClub = {}, todayStr = '', rating = null, rentalsSlot = null, faqSlot = null }: HomePageProps) {
  const base = `/${locale}`;
  const router = useRouter();

  const clubLogos = useMemo(() => {
    const clubs = allVenues.filter(v => v.typeSlug === 'clubbing');
    // Shuffle deterministically so columns look varied
    return clubs.length > 0 ? clubs : allVenues;
  }, [allVenues]);


  // Column config: 4 columns (was 10 — reduces image requests from 300→~60)
  const LIFT_COLS = 4;
  const liftCols = useMemo(() => {
    return Array.from({ length: LIFT_COLS }, (_, i) => ({
      id: i,
      duration: 32 + i * 5,
      reverse: i % 2 === 1,
      delay: -(i * 6),
    }));
  }, []);

  return (
    <div className="theme-monaco-vip is-home bg-white text-[var(--color-ink)] min-h-screen">

      {/* ── HERO — the video fills the whole first screen (behind the navbar, down to
          the dock), object-cover so it's completely filling. ── */}
      <header className="relative w-full overflow-hidden bg-black text-white" style={{ height: '100svh' }}>
        <HomeHeroVideo
          style={{ objectPosition: 'center', filter: 'brightness(0.62) contrast(1.5) saturate(1.05)' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Legibility gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/70" />
        {/* Extra dark band under the navbar so the brand, partner strip and
            hamburger stay white and readable over any bright video frame */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] bg-gradient-to-b from-black/70 to-transparent" style={{ height: 'calc(var(--nav-h) + 40px)' }} />

        {/* Animated show-intro over the video — three lines type in on a loop */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center" style={{ paddingBottom: '14vh' }}>
          <HeroShowIntro locale={locale} />
          <Link
            href={`${base}/calendar`}
            className="pointer-events-auto mt-10 inline-flex items-center gap-2 rounded-full border border-gold/60 bg-gold/10 px-8 py-3.5 font-serif text-xs font-bold uppercase tracking-[0.25em] text-gold-soft backdrop-blur-sm transition-all hover:border-gold hover:bg-gold hover:text-white"
            style={{
              boxShadow: '0 0 18px 1px rgba(14,124,102,0.55), inset 0 0 12px rgba(14,124,102,0.25)',
              textShadow: '0 0 10px rgba(14,124,102,0.85)',
            }}
          >
            {({ nl: 'Bekijk de agenda', en: 'View the calendar', es: 'Ver la agenda', de: 'Zum Kalender', fr: 'Voir l’agenda' } as Record<string, string>)[locale] || 'View the calendar'}
          </Link>
          {/* Directly under the call to action: the moment someone is deciding
              whether to click is the moment social proof is worth anything. */}
          {rating ? <HeroRatingBadge {...rating} locale={locale as any} /> : null}
        </div>

        {/* Live picker, in the first viewport. It was below the fold with a
            small legend, so the whole traffic-light system — which is real,
            time-based data — was invisible to anyone who did not scroll. Each
            item links straight to that event's page, so a visitor can go from
            landing to booking without scrolling once. */}
        {pickerEvents.length > 0 && (
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 pb-[max(10px,env(safe-area-inset-bottom))]">
            <div className="bg-gradient-to-t from-black/80 via-black/55 to-transparent pb-2 pt-8">
              <HomeEventSlider
                /* 14, not 30. The slider repeats its list four times for the
                   seamless loop, so 30 events meant 120 club logos loading
                   inside the first viewport — measured at LCP 2.5s -> 2.9s.
                   Fourteen still fills the marquee; nobody sees item 15. */
                events={pickerEvents.slice(0, 14)}
                liveByClub={liveByClub}
                locale={locale}
                className="w-full bg-transparent"
                speed={0.7}
                showLegend
                legendWide
              />
            </div>
          </div>
        )}

      </header>

      <HomeCategoryCarousel deals={deals} base={base} locale={locale} />

      <HomeTonight events={pickerEvents} todayStr={todayStr} locale={locale} base={base} />

      {/* Vlootcarrousel: tussen "Vanavond op Ibiza" en Featured Events, op
          aanwijzing van de plek in de schermafbeelding. Wie net de agenda van
          vanavond heeft gezien, is precies in de stemming voor de dag ervoor —
          en dit is de sectie met de hoogste orderwaarde van de site. Dure en
          goedkope boten om en om; zie de selectie-functie voor waarom. */}
      {/* 3D-ring met boten, excursies en events — verving de platte rij van
          twaalf boten. Zie HomeRingCarousel voor waarom de animatie de site
          niet zwaarder maakt. */}
      <HomeRingCarousel locale={locale} base={base} events={pickerEvents} experienceDays={experienceDays} />

      {/* UPCOMING EVENTS — now above Populaire Clubs */}
      {clubDays.length > 0 && (
        <FeaturedDayRotator
          id="home-white-start"
          days={clubDays}
          locale={locale}
          todayStr={todayStr}
          calendarHref={`${base}/calendar`}
          weekMax={60}
          title={({ nl: 'Uitgelichte events', en: 'Featured events', es: 'Eventos destacados', de: 'Ausgewählte Events', fr: 'Événements en vedette' } as Record<string, string>)[locale] || 'Featured events'}
        >
          {(items) => (
          <>
            <HomeRail label={translations.home_featured_events || 'Events'} locale={locale}>
              {items.map((dateObj: any, di: number) => {
                const venue = dateObj.ct_venues;
                const event = dateObj.ct_events;
                const image = event?.cover || event?.logo;
                
                return (
                  <Link key={dateObj.id} href={`${base}/club-tickets/${venue?.slug || 'club'}/${event?.slug || 'event'}`}
                    className="w-[290px] shrink-0 snap-start bg-white rounded-[24px] p-4 flex gap-4 items-center hover:shadow-lg transition-shadow group border border-black/5 sm:w-[330px]"
                  >
                    <div className="w-24 h-24 rounded-[18px] bg-ibiza-mint relative overflow-hidden shrink-0 shadow-inner">
                      {image ? (
                        <Image src={image} alt="" fill sizes="96px" loading={di < 3 ? 'eager' : 'lazy'} className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ibiza-green opacity-50">
                          <Music size={32} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0 py-1 text-neutral-900">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-ibiza-green text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                          {fmtShortDate(dateObj.date, locale)}
                        </span>
                      </div>
                      
                      {/* De naam van de avond staat op ct_events, niet op de datum:
                          `dateObj.name` is bij deze feed vrijwel altijd leeg, dus
                          deze kop rendeerde als lege <h3>. De kaart heette daardoor
                          "DI 1 SEPT [UNVRS] vanaf 85 € - 500 €" — datum, zaak, prijs,
                          geen event. Elk ander oppervlak leest het al goed
                          (EventsExplorer, CalendarClient, calendar/page). */}
                      <h3 className="text-xl md:text-2xl font-bold text-neutral-900 leading-tight truncate mb-1">
                        {event?.name || dateObj.name}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-neutral-600 mb-2">
                        <MapPin size={14} /> {venue?.name}
                      </div>

                      {dateObj.prices ? (
                        <div className="text-sm font-bold text-neutral-950">
                          {translations.home_from} {dateObj.prices}
                        </div>
                      ) : null}
                    </div>
                    
                  </Link>
                );
              })}
            </HomeRail>

            <div className="mt-8 text-center md:hidden">
              <Link href={`${base}/calendar`} className="inline-flex items-center justify-center gap-2 w-full text-xs font-black tracking-widest uppercase text-black border-2 border-black/10 bg-white hover:border-black rounded-full px-6 py-4 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                {translations.home_full_calendar}
              </Link>
            </div>
          </>
          )}
        </FeaturedDayRotator>
      )}

      {/* Second featured strip: everything that is not a nightclub. The homepage
          only ever showed the club side of the business, so boats, ferries,
          catamarans and activities — well over half the bookable inventory —
          were invisible unless you found them in the nav. Links go through the
          venue's own basePath, because only 'clubbing' lives under
          /club-tickets and sending a boat there is a guaranteed 404. */}
      {experienceDays.length > 0 && (
        <FeaturedDayRotator
          id="home-experiences"
          days={experienceDays}
          locale={locale}
          todayStr={todayStr}
          calendarHref={`${base}/activities-calendar`}
          weekMax={60}
          title={({ nl: 'Op het water & activiteiten', en: 'On the water & activities', es: 'En el agua y actividades', de: 'Auf dem Wasser & Aktivitäten', fr: 'Sur l’eau & activités' } as Record<string, string>)[locale] || 'On the water & activities'}
        >
          {(items) => (
            <HomeRail label={({ nl: 'Op het water & activiteiten', en: 'On the water & activities' } as Record<string, string>)[locale] || 'On the water & activities'} locale={locale}>
              {items.map((dateObj: any, di: number) => {
                const venue = dateObj.ct_venues;
                const event = dateObj.ct_events;
                const image = event?.cover || event?.logo;
                const href = `${base}/${venue?.basePath || 'boat-trip'}/${venue?.slug || ''}/${event?.slug || ''}`;
                return (
                  <Link key={dateObj.id} href={href}
                    className="group flex w-[290px] shrink-0 snap-start items-center gap-4 rounded-[24px] border border-black/5 bg-white p-4 text-neutral-900 transition-shadow hover:shadow-lg sm:w-[330px]"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[18px] bg-ibiza-mint shadow-inner">
                      {image ? (
                        <Image src={image} alt={event?.name || dateObj.name} fill sizes="96px" loading={di < 3 ? 'eager' : 'lazy'} className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-black uppercase tracking-widest text-gold">{fmtShortDate(dateObj.date, locale)}</div>
                      <div className="mt-1 line-clamp-2 font-serif text-base font-black leading-tight sm:text-lg">{event?.name || dateObj.name}</div>
                      <div className="mt-0.5 truncate text-sm text-neutral-600">{venue?.name}</div>
                      {dateObj.prices ? (
                        <div className="mt-1 text-sm font-bold">{translations.home_from} {dateObj.prices}</div>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </HomeRail>
          )}
        </FeaturedDayRotator>
      )}

      {/* Zelfde uitgang als bij de clubstrook: wie meer wil dan drie kaarten
          per dag moet ergens heen kunnen. /calendar is de clubagenda en toont
          alles door elkaar; deze knop gaat naar de agenda met álles behalve
          clubavonden — boottochten, jetski's, buggy's, grotten, Formentera. */}
      {experienceDays.length > 0 && (
        <div className="mx-auto -mt-2 mb-10 flex max-w-7xl px-4 md:px-8">
          <Link
            href={`${base}/activities-calendar`}
            className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-neutral-700 transition-colors hover:border-ibiza-green hover:text-ibiza-green"
          >
            {({ nl: 'Hele activiteitenagenda', en: 'Full activities calendar', de: 'Ganzer Aktivitätenkalender', es: 'Agenda completa de actividades', fr: 'Agenda complet des activités' } as Record<string, string>)[locale] || 'Full activities calendar'}
            <span aria-hidden>↗</span>
          </Link>
        </div>
      )}

      {/* De film staat hier en niet onder de hero. Onder de hero kwam hij vóór
          alles wat te koop is: je zag een kop, een knop en dan een video, en
          moest daar eerst langs om bij een event te komen. Hier heeft de
          bezoeker net de hele agenda gezien -- clubs, boten, activiteiten --
          en is dit de adempauze erna in plaats van een drempel ervoor.
          Laadt als poster met een afspeelknop; de speler van Vimeo komt pas in
          de pagina als je erop tikt. Zie HomeVimeo. */}
      <HomeVimeo id="352653740" hash="36444999f9" locale={locale} />

      {/* Boten en auto's. Stond onderaan de pagina, onder Instagram en de
          nieuwsbrief; hier volgt het direct op de strip met alles wat geen
          nachtclub is, waar het thuishoort en waar mensen nog kijken. */}
      {rentalsSlot}

      {/* Club logo marquee — just the logos — right below "Volledige kalender", above Populaire clubs */}
      <Reveal className="flex items-center bg-neutral-100 py-3 border-t border-b border-black/10">
        <ClubLogoSlider
          clubLogos={clubLogos}
          base={base}
          locale={locale}
          speed={0.9}
          onLight
          className="w-full bg-transparent"
        />
      </Reveal>

      {/* FEATURED CLUBS — premium card grid */}
      {featuredClubs.length > 0 && (
        <section className="py-8 md:py-12" style={{ background: '#0a0a0a' }}>
          <Reveal className="max-w-7xl mx-auto px-4">

            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="m-0 font-serif text-[1.625rem] font-black tracking-tight text-white">{translations.home_popular_clubs}</h2>
              </div>
              <Link
                href={`${base}/clubs`}
                className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-white border-2 border-white/25 hover:bg-white hover:text-black rounded-full px-6 py-3 transition-colors"
              >
                {translations.home_all_clubs} &rarr;
              </Link>
            </div>

            {/* Card grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }} className="clubs-grid-md">
              {featuredClubs.map((club, idx) => (
                <Link
                  href={`${base}/club-tickets/${club.slug}`}
                  key={club.slug}
                  className="club-card-premium"
                  style={{ '--idx': idx } as React.CSSProperties}
                >
                  {/* Background image */}
                  {(club.cover || club.picture) && (
                    <Image
                      src={club.cover || club.picture}
                      alt={club.name}
                      fill
                      className="club-card-img"
                      sizes="(max-width:768px) 50vw, 25vw"
                    />
                  )}

                  {/* Always-on dark gradient at bottom */}
                  <div className="club-card-base-grad" />

                  {/* Hover slide-up panel */}
                  <div className="club-card-hover-panel">
                    <div className="club-card-hover-inner">
                      {club.whitelogo && (
                        <div className="club-card-logo-wrap">
                          <Image src={club.whitelogo} alt={club.name} width={120} height={28} className="club-card-logo" />
                        </div>
                      )}
                      <div className="club-card-name">{club.name}</div>
                      <div className="club-card-cta">{translations.home_view_events} →</div>
                    </div>
                  </div>

                  {/* Default bottom logo (visible when not hovering) */}
                  <div className="club-card-bottom">
                    {club.whitelogo ? (
                      <Image src={club.whitelogo} alt={club.name} width={100} height={22} className="club-card-bottom-logo" />
                    ) : (
                      <span className="club-card-bottom-name">{club.name}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile: all clubs link */}
            <div className="mt-8 text-center md:hidden">
              <Link href={`${base}/clubs`} className="btn fill w-full justify-center">
                {translations.home_view_all_clubs}
              </Link>
            </div>
          </Reveal>
        </section>
      )}

      {/* WHY US — trust-building USP row */}
      <HomeUSP locale={locale} />

      {/* INSTAGRAM — the island's vibe on your feed */}
      <HomeInstagram locale={locale} />

      {/* NEWSLETTER — lead capture */}
      <HomeNewsletter locale={locale} rating={rating} />

      {/* CATEGORIES GRID */}
      <section className="section bg-white text-neutral-900">
        <Reveal className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker !text-neutral-900">{translations.home_discover_all}</span>
              <h2 className="text-neutral-900 !font-serif !text-[1.625rem] !font-black !tracking-tight" style={{ marginTop: '12px' }}>{translations.home_popular_on_ibiza}</h2>
            </div>
          </div>
          
          <div className="cat-grid">
            <Link href={`${base}/calendar`} className="cat">
              <span className="num">01</span>
              <strong>{translations.home_cat_calendar}</strong>
              <span className="arrow">→</span>
            </Link>
            <Link href={`${base}/clubs`} className="cat">
              <span className="num">02</span>
              <strong>{translations.home_cat_clubs_venues}</strong>
              <span className="arrow">→</span>
            </Link>

            {/* SEO: /boats and /boat-party previously had ZERO internal links
                from the homepage, so nothing on the site signalled they matter.
                Both are target pages for "boat charter Ibiza" / "boat party
                Ibiza", so they belong in the main category grid. */}
            <Link href={`${base}/boat-party`} className="cat">
              <span className="num">03</span>
              <strong>{CAT_BOAT_PARTY[locale] || CAT_BOAT_PARTY.en}</strong>
              <span className="arrow">→</span>
            </Link>
            <Link href={`${base}/private-boat-charters`} className="cat">
              <span className="num">04</span>
              <strong>{CAT_CHARTER[locale] || CAT_CHARTER.en}</strong>
              <span className="arrow">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FAQ — condensed sitewide FAQ, deliberately the very last section */}
      {faqSlot}
    </div>
  );
}
