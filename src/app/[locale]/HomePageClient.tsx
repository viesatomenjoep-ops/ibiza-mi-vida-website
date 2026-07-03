'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Music } from 'lucide-react';

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
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const months = ['JAN', 'FEB', 'MRT', 'APR', 'MEI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEC'];


  // 1. All club logos from allVenues (only type=clubbing, not boats)
  const clubLogos = useMemo(() => {
    const clubs = allVenues.filter(v => v.typeSlug === 'clubbing');
    // Shuffle deterministically so columns look varied
    return clubs.length > 0 ? clubs : allVenues;
  }, [allVenues]);

  // Column config: 10 columns, alternating speeds and directions
  const LIFT_COLS = 10;
  const liftCols = useMemo(() => {
    return Array.from({ length: LIFT_COLS }, (_, i) => ({
      id: i,
      // speeds: 25s to 55s, staggered
      duration: 28 + i * 3,
      // odd columns go up, even go down
      reverse: i % 2 === 1,
      // stagger start so columns are offset
      delay: -(i * 4.5),
    }));
  }, []);

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
                            src={club.picture || club.whitelogo}
                            alt={club.name}
                            className="lift-logo"
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
