'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Music } from 'lucide-react';

interface HomePageProps {
  locale?: string;
  featuredClubs?: any[];
  upcomingDates?: any[];
  allVenues?: any[];
}

export default function HomePageClient({ locale = 'nl', featuredClubs = [], upcomingDates = [], allVenues = [] }: HomePageProps) {
  const base = `/${locale}`;
  const router = useRouter();

  // State for the finder widget
  const [selectedCategory, setSelectedCategory] = useState('club-tickets');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [floatingElements, setFloatingElements] = useState<{
    id: number;
    logo: string;
    style: React.CSSProperties;
  }[]>([]);

  const months = ['JAN', 'FEB', 'MRT', 'APR', 'MEI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEC'];

  // 1. Extract unique club logos from featuredClubs and upcomingDates
  const uniqueClubLogos = useMemo(() => {
    const logos = new Map<string, string>();
    
    // Add default major silhouettes as fallbacks
    logos.set('hi-ibiza', 'https://media.clubtickets.com/migrated/venue/0fa16bfa-51a4-4f22-8069-326d43a57f40.png');
    logos.set('ushuaia-ibiza', 'https://media.clubtickets.com/migrated/venue/b1c671d7-4d79-46a1-88ef-c28dd3a49eb7.png');
    logos.set('eden-ibiza', 'https://media.clubtickets.com/migrated/venue/5c451614-22cb-4e1b-9903-06a6aa8760a3.png');
    logos.set('playa-soleil', 'https://media.clubtickets.com/migrated/venue/cd579d60-cd2e-4948-bf6b-f6b8aa6156de.png');

    featuredClubs.forEach(c => {
      if (c.slug && c.whitelogo) {
        logos.set(c.slug, c.whitelogo);
      }
    });
    upcomingDates.forEach(d => {
      const v = d.ct_venues;
      if (v?.slug && v?.whitelogo) {
        logos.set(v.slug, v.whitelogo);
      }
    });
    return Array.from(logos.entries()).map(([slug, logo]) => ({ slug, logo }));
  }, [featuredClubs, upcomingDates]);

  // 2. Generate 14 floating logo watermarks spread across the hero viewport
  useEffect(() => {
    if (uniqueClubLogos.length === 0) return;
    const elements = [];
    for (let i = 0; i < 14; i++) {
      const club = uniqueClubLogos[i % uniqueClubLogos.length];
      const size = Math.floor(Math.random() * 70) + 70; // 70px to 140px size
      const left = Math.floor(Math.random() * 88); // 0% to 88% width
      const top = Math.floor(Math.random() * 80); // 0% to 80% height (confined inside hero area)
      const duration = Math.floor(Math.random() * 45) + 45; // 45s to 90s drift duration
      const delay = Math.floor(Math.random() * -30); // Random offset delay to start immediately

      elements.push({
        id: i,
        logo: club.logo,
        style: {
          position: 'absolute' as const,
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: 0.038, // Subtle luxury opacity matching mockup
          filter: !['o-beach-ibiza', 'playa-soleil', 'bambuku-ibiza'].includes(club.slug) ? 'none' : 'brightness(0) invert(1)',
          animation: `floatDrift ${duration}s ease-in-out ${delay}s infinite`,
          pointerEvents: 'none' as const,
        }
      });
    }
    setFloatingElements(elements);
  }, [uniqueClubLogos]);

  const handleSearch = () => {
    let query = '';
    if (selectedMonth) {
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const formattedMonth = monthIndex.toString().padStart(2, '0');
      query = `?month=2026-${formattedMonth}`;
      router.push(`${base}/calendar${query}`);
    } else {
      router.push(`${base}/calendar`);
    }
  };

  return (
    <div className="theme-monaco-vip bg-[var(--color-paper)] text-[var(--color-ink)] min-h-screen">

      {/* HERO with left + right vertical logo strips */}
<header className="hero relative overflow-hidden" id="top">
        
        {/* 10 symmetrical vertical columns with logos floating up and down */}
        <div className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden">
          {/* Vertical grid lines */}
          <div className="absolute inset-0 flex justify-between px-4">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="w-px bg-black/[0.04] h-full" />
            ))}
          </div>
          {/* Logo columns: 10 columns, each with stacked logos floating up then down */}
          <div className="absolute inset-0 flex items-stretch">
            {Array.from({ length: 10 }).map((_, colIdx) => {
              const logos = uniqueClubLogos;
              if (!logos.length) return null;
              const logo = logos[colIdx % logos.length];
              // Alternate odd/even columns: odd go down-up, even go up-down
              const even = colIdx % 2 === 0;
              const duration = 6 + colIdx * 0.4; // stagger durations per column
              const delay = colIdx * 0.3;
              return (
                <div
                  key={colIdx}
                  className="flex-1 flex justify-center items-center"
                  style={{ animationDelay: `${delay}s` }}
                >
                  <div
                    className="flex justify-center items-center"
                    style={{
                      animation: `${even ? 'colFloatDown' : 'colFloatUp'} ${duration}s ease-in-out ${delay}s infinite`,
                      opacity: 0.07,
                    }}
                  >
                    <img
                      src={logo.logo}
                      alt=""
                      className="w-12 h-12 object-contain"
                      style={{ filter: 'brightness(0)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="wrap hero-inner relative z-10">
          <h1>
            Ibiza mi Vida
            <span className="thin">Entertainment · Boat · Nightlife — Reimagined</span>
          </h1>
          
          <p className="lead">
            Alle clubs, boat parties, artiesten en deals van het eiland op één plek. 
            Vind direct je tickets en plan je perfecte vakantie.
            Officiële tickets via Clubtickets, 100% veilig.
          </p>
          
          <div className="cta-row">
            <Link className="btn fill" href={`${base}/calendar`}>Bekijk de Kalender</Link>
            <Link className="btn" href={`${base}/club-tickets`}>Clubs & Venues</Link>
          </div>
          
          <div className="finder">
            <div className="chips">
              <button 
                className={`chip ${selectedCategory === 'club-tickets' ? 'on' : ''}`}
                onClick={() => setSelectedCategory('club-tickets')}
              >Clubbing</button>
              <button 
                className={`chip ${selectedCategory === 'boat-parties' ? 'on' : ''}`}
                onClick={() => setSelectedCategory('boat-parties')}
              >Ibiza Boat</button>
              <button 
                className={`chip ${selectedCategory === 'private-boat-charters' ? 'on' : ''}`}
                onClick={() => setSelectedCategory('private-boat-charters')}
              >Private Boats</button>
            </div>
            
            <div className="row">
              <button 
                className="date-fake" 
                onClick={() => alert('Kies hieronder een maand')}
                style={{ textAlign: 'left', cursor: 'pointer' }}
              >
                {selectedMonth ? `Geselecteerd: ${selectedMonth} 2026` : 'Wanneer ben je op Ibiza?'}
              </button>
              <button className="btn fill" onClick={handleSearch}>Zoek Feesten</button>
            </div>
            
            <div className="month-pills">
              {months.map(month => (
                <button 
                  key={month}
                  className={`mp ${selectedMonth === month ? 'on' : ''}`}
                  onClick={() => setSelectedMonth(month === selectedMonth ? null : month)}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
          
          <div className="today-badge">
            <small>Vandaag op het eiland</small>
            <strong id="todayDate">{new Date().toLocaleDateString(locale === 'nl' ? 'nl-NL' : locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long' })}</strong>
          </div>
        </div>
      </header>


      {/* FEATURED CLUBS */}
      {featuredClubs.length > 0 && (
        <section className="py-16 md:py-24 bg-white/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-ibiza-blue mb-2">Ibiza's Finest</div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-velvet-obsidian tracking-tight">Populaire Clubs</h2>
              </div>
              <Link href={`${base}/club-tickets`} className="hidden md:inline-flex items-center gap-2 font-bold text-sm hover:text-ibiza-green transition-colors">
                Alle Clubs Bekijken &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredClubs.map(club => (
                <Link href={`${base}/club-tickets/${club.slug}`} key={club.slug} className="group relative h-48 md:h-64 rounded-3xl overflow-hidden bg-ibiza-mint block shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                  {club.cover && (
                    <Image src={club.cover} alt={club.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    {club.whitelogo ? (
                      <div className="w-16 h-8 relative">
                        <Image src={club.whitelogo} alt={club.name} fill className="object-contain filter invert drop-shadow-md" />
                      </div>
                    ) : (
                      <span className="font-bold text-white text-lg">{club.name}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING EVENTS */}
      {upcomingDates.length > 0 && (
        <section className="py-16 md:py-24 bg-ibiza-sand/20 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-white/60 mb-2">Live vanuit de kalender</div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">Eerstvolgende Feesten</h2>
              </div>
              <Link href={`${base}/calendar`} className="btn fill hidden md:flex">Volledige Kalender</Link>
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
