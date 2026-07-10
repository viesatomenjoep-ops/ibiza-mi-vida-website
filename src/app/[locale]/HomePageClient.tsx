'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Music } from 'lucide-react';
import { ClubLogoSlider } from '@/components/ui/ClubLogoSlider';
import { HomeCalendarLauncher, type PickerEvent } from '@/components/events/EventPickerWheel';
import { type DealsData } from '@/components/home/HomeDeals';
import { HomeEventSlider } from '@/components/ui/HomeEventSlider';
import { HomeSelectorDock } from '@/components/home/HomeSelectorDock';
import { HomeHeroVideo } from '@/components/home/HomeHeroVideo';
import { HeroShowIntro } from '@/components/home/HeroShowIntro';
import { HomeScrollHint } from '@/components/home/HomeScrollHint';
import { HomeMapWidget } from '@/components/home/HomeMapWidget';
import { HomeArtistRing, type RingItem } from '@/components/home/HomeArtistRing';
import { HomeStackedCards } from '@/components/home/HomeStackedCards';
import { HomePreviewSheet } from '@/components/home/HomePreviewSheet';
import type { CatKey } from '@/components/home/homeCategories';
import { Reveal } from '@/components/ui/Reveal';

interface HomePageProps {
  locale?: string;
  translations?: any;
  featuredClubs?: any[];
  upcomingDates?: any[];
  pickerEvents?: PickerEvent[];
  deals?: DealsData;
  ringItems?: RingItem[];
  previewPools?: Record<CatKey, string[]>;
  allVenues?: any[]; // includes typeSlug: 'clubbing' | 'boat' | ...
  liveByClub?: Record<string, { today: { name: string; slug?: string }[]; lastNight: { name: string; slug?: string }[]; isDayClub: boolean }>;
}

export default function HomePageClient({ locale = 'nl', translations = {}, featuredClubs = [], upcomingDates = [], pickerEvents = [], deals, ringItems = [], previewPools, allVenues = [], liveByClub = {} }: HomePageProps) {
  const base = `/${locale}`;
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState('club-tickets');

  // Homepage preview stage — tapping a dock tile shows a random image for that
  // category in the white area, with a "see all" button.
  const [previewCat, setPreviewCat] = useState<CatKey | null>(null);
  const [previewImg, setPreviewImg] = useState('');
  const pickPreview = (key: CatKey) => {
    // Every tap (same or other tile) shows another ad from that category — keeps
    // cycling through the events. Use the × to close.
    const pool = previewPools?.[key] || [];
    let img = '';
    if (pool.length) {
      img = pool[Math.floor(Math.random() * pool.length)];
      if (pool.length > 1 && img === previewImg) img = pool[(pool.indexOf(img) + 1) % pool.length];
    }
    setPreviewCat(key);
    setPreviewImg(img);
  };
  // Tap on the preview image itself also advances to the next ad.
  const advancePreview = () => { if (previewCat) pickPreview(previewCat); };

  // Selector dock choreography: the 5 tiles show in the hero, slide away while the
  // map section fills the screen (there the map has its own club selectors), then
  // come back from the deals section down to the bottom of the page.
  const [dockHidden, setDockHidden] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.getElementById('ibiza-map-section');
      const vh = window.innerHeight;
      let hide = false;
      if (el) {
        const r = el.getBoundingClientRect();
        // Hide while the map occupies the middle band of the viewport.
        hide = r.top < vh * 0.6 && r.bottom > vh * 0.4;
      }
      setDockHidden(prev => (prev === hide ? prev : hide));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

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
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center" style={{ paddingBottom: '14vh' }}>
          <HeroShowIntro locale={locale} />
        </div>

      </header>

      {/* 3D ring carousel — artists & parties from ClubTickets, just above "Ontdek Ibiza" */}
      {ringItems.length > 0 && <HomeArtistRing items={ringItems} locale={locale} />}

      {/* Interactive Ibiza map widget (standalone HTML) — just above Deals of the Day */}
      <HomeMapWidget locale={locale} />

      {/* Sticky stacked cards — the 4 category showcases */}
      <HomeStackedCards deals={deals} base={base} locale={locale} />

      {/* Live event slider — the price/date category tile carousels were removed */}
      {deals && pickerEvents.length > 0 && (
        <div className="w-full bg-neutral-100 py-6 md:py-8">
          <HomeEventSlider events={pickerEvents.slice(0, 30)} liveByClub={liveByClub} locale={locale} onLight className="w-full bg-transparent" speed={0.7} />
        </div>
      )}

      {/* ── Slide-up preview sheet (works anywhere on the page) + fixed dock ── */}
      <HomePreviewSheet
        base={base}
        locale={locale}
        selected={previewCat}
        image={previewImg}
        onClose={() => setPreviewCat(null)}
        onAdvance={advancePreview}
      />
      <HomeSelectorDock locale={locale} selected={previewCat} onSelect={pickPreview} hidden={dockHidden} />
      <HomeScrollHint locale={locale} />

      {/* UPCOMING EVENTS — now above Populaire Clubs */}
      {upcomingDates.length > 0 && (
        <>

        <section id="home-white-start" className="pb-12 pt-6 md:pb-16 md:pt-8 bg-white text-neutral-900 border-t border-black/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <h3 className="shrink-0 font-serif text-[1.625rem] font-black tracking-tight text-neutral-900">
                {({ nl: 'Uitgelichte events', en: 'Featured events', es: 'Eventos destacados', de: 'Ausgewählte Events', fr: 'Événements en vedette' } as Record<string, string>)[locale] || 'Featured events'}
              </h3>
              <span className="h-px flex-1 bg-black/10" />
              {pickerEvents.length > 0 && <div className="shrink-0"><HomeCalendarLauncher events={pickerEvents} locale={locale} persistKey="homeplanner" /></div>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingDates.map((dateObj, di) => {
                const venue = dateObj.ct_venues;
                const event = dateObj.ct_events;
                const image = event?.cover || event?.logo;
                
                return (
                  <Reveal key={dateObj.id} delay={(di % 3) * 110} as={Link as any} href={`${base}/club-tickets/${venue?.slug || 'club'}/${event?.slug || 'event'}`}
                    className="bg-white rounded-[24px] p-4 flex gap-5 items-center hover:shadow-lg transition-shadow group border border-black/5"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-[18px] bg-ibiza-mint relative overflow-hidden shrink-0 shadow-inner">
                      {image ? (
                        <Image src={image} alt={dateObj.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ibiza-green opacity-50">
                          <Music size={32} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0 py-1 text-neutral-900">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-ibiza-green text-neutral-950 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                          {new Date(dateObj.date).toLocaleDateString(locale === 'nl' ? 'nl-NL' : locale === 'es' ? 'es-ES' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold text-neutral-900 leading-tight truncate mb-1">
                        {dateObj.name}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-neutral-600 mb-2">
                        <MapPin size={14} /> {venue?.name}
                      </div>

                      <div className="text-sm font-bold text-neutral-950">
                        {translations.home_from} €{dateObj.prices || ' ??'}
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-ibiza-mint items-center justify-center group-hover:bg-ibiza-green transition-colors text-neutral-900 mr-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            
            <div className="mt-10 text-center md:hidden">
              <Link href={`${base}/calendar`} className="inline-flex items-center justify-center gap-2 w-full text-xs font-black tracking-widest uppercase text-black border-2 border-black/10 bg-white hover:border-black rounded-full px-6 py-4 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                {translations.home_full_calendar}
              </Link>
            </div>
          </div>
        </section>
        </>
      )}

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
                href={`${base}/club-tickets`}
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
                      priority={idx < 2}
                    />
                  )}

                  {/* Always-on dark gradient at bottom */}
                  <div className="club-card-base-grad" />

                  {/* Hover slide-up panel */}
                  <div className="club-card-hover-panel">
                    <div className="club-card-hover-inner">
                      {club.whitelogo && (
                        <div className="club-card-logo-wrap">
                          <img src={club.whitelogo} alt={club.name} className="club-card-logo" />
                        </div>
                      )}
                      <div className="club-card-name">{club.name}</div>
                      <div className="club-card-cta">{translations.home_view_events} →</div>
                    </div>
                  </div>

                  {/* Default bottom logo (visible when not hovering) */}
                  <div className="club-card-bottom">
                    {club.whitelogo ? (
                      <img src={club.whitelogo} alt={club.name} className="club-card-bottom-logo" />
                    ) : (
                      <span className="club-card-bottom-name">{club.name}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile: all clubs link */}
            <div className="mt-8 text-center md:hidden">
              <Link href={`${base}/club-tickets`} className="btn fill w-full justify-center">
                {translations.home_view_all_clubs}
              </Link>
            </div>
          </Reveal>
        </section>
      )}

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

            <Link href={`${base}/calendar?filter=day`} className="cat">
              <span className="num">04</span>
              <strong>{translations.home_cat_day_clubs}</strong>
              <span className="arrow">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Spacer so the fixed selector dock never hides the last content */}
      <div aria-hidden className="w-full" style={{ height: '84px' }} />
    </div>
  );
}
