'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Music } from 'lucide-react';
import { ClubLogoSlider } from '@/components/ui/ClubLogoSlider';
import { HeroTypewriter } from '@/components/ui/HeroTypewriter';

const OFFICIAL_PARTNER: Record<string, string> = {
  en: 'Official ticket partner',
  nl: 'Officiële ticketpartner',
  de: 'Offizieller Ticketpartner',
  es: 'Socio oficial de entradas',
  fr: 'Partenaire officiel de billetterie',
};

interface HomePageProps {
  locale?: string;
  translations?: any;
  featuredClubs?: any[];
  upcomingDates?: any[];
  allVenues?: any[]; // includes typeSlug: 'clubbing' | 'boat' | ...
  liveByClub?: Record<string, { today: { name: string; slug?: string }[]; lastNight: { name: string; slug?: string }[]; isDayClub: boolean }>;
}

export default function HomePageClient({ locale = 'nl', translations = {}, featuredClubs = [], upcomingDates = [], allVenues = [], liveByClub = {} }: HomePageProps) {
  const base = `/${locale}`;
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState('club-tickets');

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

      <header className="hero bg-black relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-between overflow-hidden w-full">
        {/* ── VIDEO BACKGROUND ── */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video 
            src="/achtergrond-homepage.mp4" 
            poster="/hi-ibiza-2026/FB_IMG_1779623220486.jpg"
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          {/* Gradients to fade out the top and bottom of the video */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Spacer Top (Fixed to push text up) */}
        <div className="h-[var(--nav-h)] w-full shrink-0" />

        {/* TOP: the three categories (were at the bottom) */}
        <div className="relative z-20 w-full flex flex-col items-center px-4">
          {/* Desktop: text buttons (hidden on mobile) */}
          <div className="hidden md:flex md:flex-row items-center justify-center gap-4 w-full max-w-3xl mx-auto md:pt-6">
            <Link className="bg-transparent border-2 border-white text-white font-black uppercase tracking-widest px-8 py-3 rounded-full md:w-auto hover:border-ibiza-green hover:text-ibiza-green active:border-ibiza-green active:text-ibiza-green transition-colors text-center shadow-lg hover:scale-105" href={`${base}/calendar`}>{translations.home_full_calendar}</Link>
            <Link className="bg-transparent border-2 border-white text-white font-black uppercase tracking-widest px-8 py-3 rounded-full md:w-auto hover:border-ibiza-green hover:text-ibiza-green active:border-ibiza-green active:text-ibiza-green transition-colors text-center shadow-lg hover:scale-105" href={`${base}/club-tickets`}>{translations.home_clubs_venues}</Link>
            <Link className="bg-transparent border-2 border-white text-white font-black uppercase tracking-widest px-8 py-3 rounded-full md:w-auto hover:border-ibiza-green hover:text-ibiza-green active:border-ibiza-green active:text-ibiza-green transition-colors text-center shadow-lg hover:scale-105" href={`${base}/private-boat-charters`}>{translations.nav_private_boat}</Link>
          </div>

          {/* Mobile: sleek category icons */}
          <div className="mcat-row md:hidden">
            <Link href={`${base}/calendar`} className="mcat" aria-label={translations.home_full_calendar}>
              <span className="mcat-ico" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <rect x="7" y="12" width="34" height="29" rx="5" fill="#fff" />
                  <path d="M7 17a5 5 0 0 1 5-5h24a5 5 0 0 1 5 5v3H7Z" fill="#14FF00" />
                  <line x1="15" y1="8" x2="15" y2="15" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="33" y1="8" x2="33" y2="15" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  <g fill="#0D0509">
                    <circle cx="15" cy="28" r="1.7" /><circle cx="24" cy="28" r="1.7" /><circle cx="33" cy="28" r="1.7" />
                    <circle cx="15" cy="35" r="1.7" /><circle cx="33" cy="35" r="1.7" />
                  </g>
                  <circle cx="24" cy="35" r="3.4" fill="#14FF00" />
                </svg>
              </span>
              <span className="mcat-label">{translations.home_full_calendar}</span>
            </Link>

            <Link href={`${base}/club-tickets`} className="mcat" aria-label={translations.home_clubs_venues}>
              <span className="mcat-ico" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <line x1="24" y1="4" x2="24" y2="11" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
                  <circle cx="24" cy="27" r="15" fill="#fff" />
                  <g stroke="#0D0509" strokeWidth="1.1" opacity="0.55">
                    <line x1="9" y1="27" x2="39" y2="27" />
                    <line x1="11" y1="20" x2="37" y2="20" />
                    <line x1="11" y1="34" x2="37" y2="34" />
                    <line x1="24" y1="12" x2="24" y2="42" />
                    <path d="M17 13c3 14 3 14 0 28" />
                    <path d="M31 13c-3 14-3 14 0 28" />
                  </g>
                  <circle cx="19" cy="23" r="1.7" fill="#14FF00" />
                  <circle cx="29" cy="31" r="1.7" fill="#14FF00" />
                  <circle cx="28" cy="20" r="1.2" fill="#14FF00" />
                </svg>
              </span>
              <span className="mcat-label">{translations.home_clubs_venues}</span>
            </Link>

            <Link href={`${base}/private-boat-charters`} className="mcat" aria-label={translations.nav_private_boat}>
              <span className="mcat-ico" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <path d="M6 30h36l-5 7H11Z" fill="#fff" />
                  <path d="M12 30v-7h21l4 7Z" fill="#fff" />
                  <path d="M15 23v-5h12l4 5Z" fill="#fff" />
                  <g fill="#14FF00">
                    <rect x="14.5" y="25" width="3.2" height="2.6" rx="0.6" />
                    <rect x="19" y="25" width="3.2" height="2.6" rx="0.6" />
                    <rect x="23.5" y="25" width="3.2" height="2.6" rx="0.6" />
                    <rect x="18" y="19.4" width="6" height="2.4" rx="0.6" />
                  </g>
                  <path d="M4 40q5-3 10 0t10 0 10 0 10 0" stroke="#14FF00" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              <span className="mcat-label">{translations.nav_private_boat}</span>
            </Link>
          </div>
        </div>

        {/* Spacer Middle */}
        <div className="flex-1 w-full" />

        {/* ── SLOGAN (were at the top) + HORIZONTAL LOGO MARQUEE BAR ── */}
        <div className="w-full relative z-20 mt-auto pt-8 pb-2 md:pt-10 md:pb-3">
          {/* Slogan now sits directly above the slider, where the categories used to be */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto px-4 mb-5 md:mb-6">
            <HeroTypewriter
              title={translations.home_hero_title || 'Ibiza mi Vida'}
              subtitle={translations.home_hero_subtitle || 'Entertainment · Boat · Nightlife — Reimagined'}
            />
          </div>
          <ClubLogoSlider
            clubLogos={clubLogos}
            base={base}
            liveByClub={liveByClub}
            locale={locale}
            showLegend
            speed={0.3}
            className="w-full bg-transparent pt-2 pb-1"
          />

          {/* Official ticket partner — right under the slider, visible at first glance */}
          <div className="mt-1.5 flex items-center justify-center gap-2 px-4 text-white">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 shrink-0">
              <circle cx="12" cy="12" r="11" fill="#14FF00" />
              <path d="M7 12.5l3.2 3.2L17 9" stroke="#0D0509" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em]">{OFFICIAL_PARTNER[locale] || OFFICIAL_PARTNER.en}</span>
          </div>
        </div>
      </header>

      {/* UPCOMING EVENTS — now above Populaire Clubs */}
      {upcomingDates.length > 0 && (
        <section className="pb-12 pt-6 md:pb-16 md:pt-8 bg-white text-neutral-900 border-t border-black/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-10">
              <div className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2">{translations.home_live_from_calendar}</div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight mb-4">{translations.home_upcoming_parties}</h2>
              {/* Small calendar widget button — fixed width, never stretches */}
              <Link
                href={`${base}/calendar`}
                className="inline-flex items-center gap-2 w-fit text-[11px] font-black tracking-widest uppercase text-black border-2 border-black/10 bg-white hover:border-black rounded-full px-5 py-2.5 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                {translations.home_full_calendar}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {upcomingDates.map((dateObj) => {
                const venue = dateObj.ct_venues;
                const event = dateObj.ct_events;
                const image = event?.cover || event?.logo;
                
                return (
                  <Link 
                    href={`${base}/club-tickets/${venue?.slug || 'club'}/${event?.slug || 'event'}`} 
                    key={dateObj.id} 
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
                  </Link>
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
      )}

      {/* FEATURED CLUBS — premium card grid */}
      {featuredClubs.length > 0 && (
        <section className="py-16 md:py-24" style={{ background: '#0a0a0a' }}>
          <div className="max-w-7xl mx-auto px-4">

            {/* Section header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '8px',
                }}></div>
                <h2 style={{
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  fontFamily: 'var(--display, sans-serif)',
                  margin: 0,
                }}>{translations.home_popular_clubs}</h2>
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
          </div>
        </section>
      )}

      {/* CATEGORIES GRID */}
      <section className="section bg-white text-neutral-900">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker !text-neutral-900">{translations.home_discover_all}</span>
              <h2 className="text-neutral-900" style={{ marginTop: '12px' }}>{translations.home_popular_on_ibiza}</h2>
            </div>
          </div>
          
          <div className="cat-grid">
            <Link href={`${base}/calendar`} className="cat">
              <span className="num">01</span>
              <strong>{translations.home_cat_calendar}</strong>
              <span className="arrow">→</span>
            </Link>
            <Link href={`${base}/club-tickets`} className="cat">
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
        </div>
      </section>
    </div>
  );
}
