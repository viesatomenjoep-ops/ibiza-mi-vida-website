'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Music } from 'lucide-react';
import { HomeDateFinder } from '@/components/home/HomeDateFinder';

interface HomePageProps {
  locale?: string;
  featuredClubs?: any[];
  upcomingDates?: any[];
  allVenues?: any[]; // includes typeSlug: 'clubbing' | 'boat' | ...
}

export default function HomePageClient({ locale = 'nl', featuredClubs = [], upcomingDates = [], allVenues = [] }: HomePageProps) {
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
    <div className="theme-monaco-vip bg-white text-[var(--color-ink)] min-h-screen">

      {/* HERO with left + right vertical logo strips */}
<header className="hero relative overflow-hidden" id="top">
        
        {/* ── LIFT ELEVATOR: 10 columns, all 15+ club logos scrolling ── */}
        {clubLogos.length > 0 && (
          <div className="lift-bg" aria-hidden="true">
            {/* Subtle vertical grid lines */}
            <div className="lift-grid-lines">
              {Array.from({ length: 11 }).map((_, i) => <div key={i} className="lift-line" />)}
            </div>

            {/* 10 elevator columns */}
            <div className="lift-cols">
              {liftCols.map(col => {
                // Each column gets a different starting logo to look varied
                const offset = (col.id * 3) % clubLogos.length;
                const rotated = [...clubLogos.slice(offset), ...clubLogos.slice(0, offset)];
                // Duplicate for seamless loop
                const items = [...rotated, ...rotated];

                return (
                  <div key={col.id} className="lift-col">
                    <div
                      className="lift-track"
                      style={{
                        animationDuration: `${col.duration}s`,
                        animationDirection: col.reverse ? 'reverse' : 'normal',
                        animationDelay: `${col.delay}s`,
                      }}
                    >
                      {items.map((club, idx) => (
                        <div key={`${club.slug}-${idx}`} className="lift-item">
                          <img
                            src={club.whitelogo || club.picture}
                            alt=""
                            className="lift-logo"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="wrap hero-inner relative z-10">
          <h1>
            Ibiza mi Vida
            <span className="thin">Entertainment · Boat · Nightlife — Reimagined</span>
          </h1>

          {/* Spacer — pushes CTA to bottom on mobile fullscreen hero */}
          <div className="hero-spacer" aria-hidden="true" />
          
          <div className="cta-row">
            <Link className="btn fill" href={`${base}/calendar`}>Bekijk de Kalender</Link>
            <Link className="btn" href={`${base}/club-tickets`}>Clubs & Venues</Link>
          </div>
          
          <div className="today-badge">
            <small>Vandaag op het eiland</small>
            <strong id="todayDate">{new Date().toLocaleDateString(locale === 'nl' ? 'nl-NL' : locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long' })}</strong>
          </div>
        </div>
      </header>

      {/* ── FINDER SECTION — below the hero, visible on scroll ── */}
      <section className="hero-finder-section">
        <div className="wrap">
          {/* Category chips */}
          <div className="finder">
            <div className="chips">
              <button
                className={`chip ${selectedCategory === 'club-tickets' ? 'on' : ''}`}
                onClick={() => { setSelectedCategory('club-tickets'); router.push(`${base}/club-tickets`); }}
              >Clubbing</button>
              <button
                className={`chip ${selectedCategory === 'boat-parties' ? 'on' : ''}`}
                onClick={() => { setSelectedCategory('boat-parties'); router.push(`${base}/boat-parties`); }}
              >Ibiza Boot</button>
              <button
                className={`chip ${selectedCategory === 'private-boat-charters' ? 'on' : ''}`}
                onClick={() => { setSelectedCategory('private-boat-charters'); router.push(`${base}/private-boat-charters`); }}
              >Private Boats</button>
              <button
                className={`chip ${selectedCategory === 'artists' ? 'on' : ''}`}
                onClick={() => { setSelectedCategory('artists'); router.push(`${base}/artists`); }}
              >Artiesten</button>
            </div>

            {/* ── NEW: Professional date finder ── */}
            <HomeDateFinder locale={locale} base={base} />

            {/* Lead text — below the finder, white fade-in */}
            <p className="hero-lead-below">
              {locale === 'nl'
                ? 'Alle clubs, boat parties, artiesten en deals van het eiland op één plek. Officiële tickets via Clubtickets, 100% veilig.'
                : 'All clubs, boat parties, artists and deals on the island in one place. Official tickets via Clubtickets, 100% safe.'}
            </p>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS — now above Populaire Clubs */}
      {upcomingDates.length > 0 && (
        <section className="py-12 md:py-16 bg-white text-neutral-900 border-t border-black/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-10">
              <div className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2">Live vanuit de kalender</div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight mb-4">Eerstvolgende Feesten</h2>
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
                Volledige Kalender
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
                }}>Ibiza's Finest</div>
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
            <Link href={`${base}/calendar?filter=boat`} className="cat">
              <span className="num">03</span>
              <strong>Boat Parties</strong>
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
