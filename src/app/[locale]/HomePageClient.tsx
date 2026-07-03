'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Music } from 'lucide-react';
import { HomeDateFinder } from '@/components/home/HomeDateFinder';

interface HomePageProps {
  locale?: string;
  translations?: any;
  featuredClubs?: any[];
  upcomingDates?: any[];
  allVenues?: any[]; // includes typeSlug: 'clubbing' | 'boat' | ...
}

export default function HomePageClient({ locale = 'nl', translations = {}, featuredClubs = [], upcomingDates = [], allVenues = [] }: HomePageProps) {
  const base = `/${locale}`;
  const router = useRouter();

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Auto-scroll logic for slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId: number;
    const speed = 0.5; // pixels per frame

    const play = () => {
      if (!isDragging.current && slider) {
        slider.scrollLeft += speed;
        // Reset scroll when reaching the end of the duplicated blocks
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(play);
    };

    play();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (sliderRef.current?.offsetLeft || 0);
    scrollLeft.current = sliderRef.current?.scrollLeft || 0;
  };
  const handleMouseLeave = () => {
    isDragging.current = false;
  };
  const handleMouseUp = () => {
    isDragging.current = false;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (sliderRef.current) sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
    scrollLeft.current = sliderRef.current?.scrollLeft || 0;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (sliderRef.current) sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const handleTouchEnd = () => {
    isDragging.current = false;
  };

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

      <header className="hero bg-black relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden w-full">
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

        <div className="relative z-20 pt-[80px] md:pt-[100px] pb-8 flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto px-4 mt-auto mb-auto">
          <h1 className="text-white text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold font-serif uppercase tracking-tight drop-shadow-lg leading-none">
            {translations.home_hero_title}
            <span className="block font-serif font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-3 tracking-tight leading-none text-white/90">{translations.home_hero_subtitle}</span>
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6 w-full px-4 max-w-2xl">
            <Link className="bg-ibiza-green text-white font-black uppercase tracking-widest px-8 py-3 rounded-full w-full md:w-auto hover:bg-white hover:text-black active:bg-white active:text-black transition-colors text-center shadow-lg hover:scale-105" href={`${base}/calendar`}>{translations.home_full_calendar}</Link>
            <Link className="bg-transparent border-2 border-white text-white font-black uppercase tracking-widest px-8 py-3 rounded-full w-full md:w-auto hover:bg-white hover:text-black active:bg-white active:text-black transition-colors text-center shadow-lg hover:scale-105" href={`${base}/club-tickets`}>{translations.home_clubs_venues}</Link>
          </div>
          
          <div className="mt-6 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white shadow-xl">
            <small className="text-xs font-bold uppercase tracking-widest text-neutral-300 mr-2">{translations.home_today_island}</small>
            <strong className="text-sm font-black text-ibiza-green" id="todayDate">{new Date().toLocaleDateString(locale === 'nl' ? 'nl-NL' : locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long' })}</strong>
          </div>
        </div>

        {/* ── HORIZONTAL LOGO MARQUEE BAR ── */}
        {clubLogos.length > 0 && (
          <div className="w-full relative z-20 mt-auto mb-8 bg-transparent py-4 border-t border-white/10 border-b">
            <div 
              className="w-full overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing" 
              style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex items-center w-max">
                {[...clubLogos, ...clubLogos, ...clubLogos, ...clubLogos]
                  .filter(club => club.whitelogo || club.picture)
                  .map((club, idx) => (
                  <Link 
                    href={`${base}/club-tickets/${club.slug}`}
                    key={`${club.slug}-${idx}`} 
                    className="inline-flex items-center justify-center px-8 opacity-80 hover:opacity-100 transition-opacity"
                    draggable={false}
                  >
                    <img
                      src={club.whitelogo || club.picture}
                      alt={club.name}
                      className="h-8 md:h-10 w-auto object-contain brightness-0 invert drop-shadow-md pointer-events-none"
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* UPCOMING EVENTS — now above Populaire Clubs */}
      {upcomingDates.length > 0 && (
        <section className="py-12 md:py-16 bg-white text-neutral-900 border-t border-black/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-10">
              <div className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2">{translations.home_live_from_calendar}</div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight mb-4">{translations.home_upcoming_parties}</h2>
              {/* Small calendar widget button — fixed width, never stretches */}
              <Link
                href={`${base}/calendar`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: 'fit-content',
                  maxWidth: '220px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.6)',
                  border: '1.5px solid rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  textDecoration: 'none',
                  background: 'rgba(0,0,0,0.04)',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
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
                        vanaf €{dateObj.prices || ' ??'}
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-ibiza-mint items-center justify-center group-hover:bg-ibiza-green transition-colors text-neutral-900 mr-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link href={`${base}/calendar`} className="btn fill w-full justify-center">Volledige Kalender</Link>
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
                }}>Populaire Clubs</h2>
              </div>
              <Link
                href={`${base}/club-tickets`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  borderRadius: '6px',
                  padding: '10px 18px',
                  textDecoration: 'none',
                  transition: 'border-color .2s, background .2s',
                }}
                className="club-all-btn"
              >
                Alle Clubs &rarr;
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
                      <div className="club-card-cta">Bekijk Events →</div>
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
                Alle Clubs Bekijken
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
              <span className="kicker !text-neutral-900">Ontdek alles</span>
              <h2 className="text-neutral-900" style={{ marginTop: '12px' }}>Populair op Ibiza</h2>
            </div>
          </div>
          
          <div className="cat-grid">
            <Link href={`${base}/calendar`} className="cat">
              <span className="num">01</span>
              <strong>Kalender 2026</strong>
              <span className="arrow">→</span>
            </Link>
            <Link href={`${base}/club-tickets`} className="cat">
              <span className="num">02</span>
              <strong>Clubs & Venues</strong>
              <span className="arrow">→</span>
            </Link>

            <Link href={`${base}/calendar?filter=day`} className="cat">
              <span className="num">04</span>
              <strong>Day Clubs</strong>
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
