'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, Star, Heart, Calendar, Music, MessageCircle, ArrowRight, Ticket } from 'lucide-react';
import type { CTEventDate } from '@/lib/clubtickets';
import '@/styles/club-tickets.css';

function parsePrice(priceStr?: string): number {
  if (!priceStr) return 50;
  const match = priceStr.match(/\d+([.,]\d+)?/);
  if (match) {
    return parseFloat(match[0].replace(',', '.'));
  }
  return 50;
}


const VENUE_CATEGORIES: Record<string, 'music' | 'boats' | 'activities' | 'sights'> = {
  // 1. Music Clubs
  'unvrs-ibiza': 'music',
  'ushuaia-ibiza': 'music',
  'hi-ibiza': 'music',
  'playa-soleil': 'music',
  'o-beach-ibiza': 'music',
  'bambuku-ibiza': 'music',
  'chinois-ibiza': 'music',
  'ibiza-rocks': 'music',
  'eden-ibiza': 'music',
  'es-paradis': 'music',
  '528-ibiza': 'music',
  'swag': 'music',
  'lio': 'music',
  'teatro-pereyra': 'music',
  'baloo-ibiza': 'music',
  
  // 2. Boats
  'ibiza-cruise-crush': 'boats',
  'the-formentera-cruise': 'boats',
  'the-beach-hopper': 'boats',
  'ulises-cat-sea-experience': 'boats',
  'float-your-boat': 'boats',
  'pukka-up': 'boats',
  'aquabus': 'boats',
  'balearia': 'boats',
  'capitan-nemo': 'boats',
  'lady-virginia-boat': 'boats',
  'sup-paradise-ibiza': 'boats',
  'chilli-pepper-boats': 'boats',
  'santa-eularia-ferry': 'boats',

  // 3. Buggies & Activities
  'emove-ibiza': 'activities',
  'into-the-island': 'activities',
  'ibiza-buggy-adventure': 'activities',
  'take-off': 'activities',
  'ibiza-jet-ski-beach-jetski': 'activities',
  'blue-coral-ibiza-jetski': 'activities',
  'es-vedra-charter-jetski': 'activities',
  'enjoy-water-sports-jetski': 'activities',
  
  // 4. Sights & Senses
  'cova-de-can-marca': 'sights',
  'excursiones-al-sabini': 'sights',
  'excursiones-ibiza': 'sights',
  'bibo-park-ibiza': 'sights'
};

export default function ClubTicketsClient({ 
  initialEvents = [], 
  venues = [],
  locale = 'nl',
  dict = {}
}: { 
  initialEvents: CTEventDate[], 
  venues: any[],
  locale: string,
  dict: any
}) {
  const [activeCategory, setActiveCategory] = useState<'music' | 'boats' | 'activities' | 'sights'>('music');
  const [filter, setFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'day' | 'night'>('all');
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<'date' | 'price_asc' | 'price_desc'>('date');
  const [visibleCount, setVisibleCount] = useState(12);

  const sliderRef = useRef<HTMLDivElement>(null);

  const CATEGORIES = [
    { id: 'music', label: locale === 'nl' ? 'Muziekevents' : 'Music Events', icon: '🎵' },
    { id: 'boats', label: locale === 'nl' ? 'Bootfeesten & Ferries' : 'Boats & Ferries', icon: '🚢' },
    { id: 'activities', label: locale === 'nl' ? 'Buggies & Active' : 'Buggies & Outdoor', icon: '🏎️' },
    { id: 'sights', label: locale === 'nl' ? 'Sights & Cultuur' : 'Sights & Culture', icon: '🏛️' }
  ];

  const handleCategoryChange = (catId: 'music' | 'boats' | 'activities' | 'sights') => {
    setActiveCategory(catId);
    setFilter('all');
    setVisibleCount(12);
  };

  const scrollSlider = (direction: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: direction * 280, behavior: 'smooth' });
    }
  };

  // Derive unique venues with logos from the venues list + events
  const uniqueVenues = useMemo(() => {
    const venueMap = new Map<string, { name: string; logo?: string; isDayClub?: boolean; typeSlug?: string }>();
    
    // First map from the venues list passed from server
    venues.forEach(v => {
      venueMap.set(v.slug, { name: v.name, logo: v.whitelogo || v.picture, isDayClub: v.isDayClub, typeSlug: v.type?.slug });
    });
    
    // Fallback/augment from initialEvents
    initialEvents.forEach(e => {
      if (e.venueSlug && e.venueName && !venueMap.has(e.venueSlug)) {
        venueMap.set(e.venueSlug, { name: e.venueName, logo: e.venueLogo, typeSlug: 'clubbing' });
      }
    });
    
    const list = Array.from(venueMap.entries()).map(([slug, data]) => ({ slug, ...data }));
    
    // Filter by active category mapping
    return list.filter(v => {
      const cat = VENUE_CATEGORIES[v.slug] || 'music';
      return cat === activeCategory;
    });
  }, [initialEvents, venues, activeCategory]);

  // Pre-parse prices and dates once to avoid massive CPU overhead in the filter/sort loop
  const parsedEvents = useMemo(() => {
    return initialEvents.map(e => ({
      ...e,
      priceNum: parsePrice(e.prices),
      timeNum: new Date(e.date).getTime()
    }));
  }, [initialEvents]);

  const filteredEvents = useMemo(() => {
    let result = parsedEvents;

    // Filter by active category
    result = result.filter(e => {
      const cat = VENUE_CATEGORIES[e.venueSlug || ''] || 'music';
      return cat === activeCategory;
    });

    if (filter !== 'all') {
      result = result.filter(e => e.venueSlug === filter);
    }

    if (timeFilter !== 'all') {
      result = result.filter(e => {
        const matchingVenue = uniqueVenues.find(v => v.slug === e.venueSlug);
        if (timeFilter === 'day') {
          return matchingVenue?.isDayClub === true;
        } else {
          return matchingVenue?.isDayClub === false || matchingVenue?.isDayClub === undefined;
        }
      });
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(e => 
        e.eventName?.toLowerCase().includes(s) || 
        e.venueName?.toLowerCase().includes(s) ||
        (e.lineUp && e.lineUp.toLowerCase().includes(s))
      );
    }

    result = [...result].sort((a, b) => {
      if (sort === 'price_asc') return a.priceNum - b.priceNum;
      if (sort === 'price_desc') return b.priceNum - a.priceNum;
      return a.timeNum - b.timeNum;
    });

    return result;
  }, [parsedEvents, filter, timeFilter, search, sort, uniqueVenues, activeCategory]);

  const displayedEvents = filteredEvents.slice(0, visibleCount);

  return (
    <div className="theme-monaco-vip bg-neutral-50 text-[var(--color-ink)] min-h-screen relative overflow-hidden">
      <section className="pt-[calc(var(--nav-h)+16px)] pb-6 relative z-10 flex flex-col items-center text-center px-4">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="flex flex-col gap-2 text-center mb-4">
            <h1 className="text-5xl md:text-7xl font-black font-serif text-black leading-tight uppercase m-0 tracking-tight drop-shadow-sm">
              Alle Club Tickets
            </h1>
          </div>
        </div>
      </section>

      <section className="block pt-2 relative z-10">
        <div className="wrap">
          
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-black/10">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-black text-white shadow-md scale-[1.02]'
                    : 'bg-white text-black/70 hover:text-black border border-black/10 hover:bg-black/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Slider of Round Club Tiles */}
          <div className="mb-4 relative group/slider">
            <div className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-3">
              {locale === 'nl' ? 'Kies een Locatie / Partner' : 'Choose a Location / Partner'}
            </div>
            
            <div className="relative flex items-center">
              {/* Prev Button */}
              <button 
                onClick={() => scrollSlider(-1)}
                className="absolute -left-4 z-40 bg-white hover:bg-black hover:text-white text-black border border-black/10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover/slider:opacity-100 hidden md:flex"
                aria-label="Previous"
              >
                &larr;
              </button>

              <div 
                ref={sliderRef}
                className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth hide-scrollbar py-3 px-2 items-center w-full"
              >
                {/* "Alle" Tile */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <button 
                    onClick={() => setFilter('all')}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 relative ${
                      filter === 'all' 
                        ? 'border-black bg-black text-white shadow-lg scale-[1.12] z-30 font-bold' 
                        : 'border-black/10 bg-transparent text-black font-semibold hover:border-black/20 hover:bg-black/5 hover:scale-105'
                    }`}
                  >
                    <Music size={18} className={filter === 'all' ? 'text-white' : 'text-black/60'} />
                  </button>
                  <span className={`text-[9px] uppercase font-bold tracking-wider text-center mt-2 max-w-[70px] truncate ${filter === 'all' ? 'text-black' : 'text-black/60'}`}>
                    {locale === 'nl' ? 'Alles' : 'All'}
                  </span>
                </div>

                {/* Individual Round Tiles */}
                {uniqueVenues.map(v => {
                  const isActive = filter === v.slug;
                  return (
                    <div key={v.slug} className="flex flex-col items-center justify-center shrink-0">
                      <button 
                        onClick={() => setFilter(v.slug)}
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] p-2 flex items-center justify-center transition-all duration-300 relative ${
                          isActive 
                            ? 'bg-white border-ibiza-green shadow-[0_0_15px_rgba(0,166,152,0.3)] scale-[1.12] z-30' 
                            : 'border-black/10 bg-transparent hover:border-black/20 hover:bg-black/5 hover:scale-105'
                        }`}
                      >
                        {v.logo ? (
                          <img 
                            src={v.logo} 
                            alt={v.name} 
                            className="w-full h-full object-contain filter brightness-0" 
                            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-[9px] font-bold text-black uppercase truncate">Logo</span>' }}
                          />
                        ) : (
                          <span className={`font-bold text-[10px] ${isActive ? 'text-ibiza-green' : 'text-black/80'}`}>
                            {v.name.substring(0, 3).toUpperCase()}
                          </span>
                        )}
                      </button>
                      <span className={`text-[9px] uppercase font-bold tracking-wider text-center mt-2 max-w-[80px] truncate ${isActive ? 'text-ibiza-green font-black' : 'text-black/60'}`}>
                        {v.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Next Button */}
              <button 
                onClick={() => scrollSlider(1)}
                className="absolute -right-4 z-40 bg-white hover:bg-ibiza-green hover:text-velvet-obsidian text-black border border-black/10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover/slider:opacity-100 hidden md:flex"
                aria-label="Next"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* Club Info Redirect Banner */}
          {filter !== 'all' && (
            <div className="mb-8 p-4 bg-transparent backdrop-blur-md rounded-2xl border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-transparent border border-black/10 rounded-xl flex items-center justify-center p-1.5 shrink-0">
                  {uniqueVenues.find(v => v.slug === filter)?.logo ? (
                    <img src={uniqueVenues.find(v => v.slug === filter)?.logo} alt="" className="object-contain max-w-full max-h-full filter brightness-0" />
                  ) : (
                    <Music className="text-ibiza-green" size={24} />
                  )}
                </div>
                <div>
                  <h4 className="text-black font-bold">{uniqueVenues.find(v => v.slug === filter)?.name}</h4>
                  <p className="text-xs text-black/60">Bekijk de volledige biografie, vaste wekelijkse feesten en route-informatie.</p>
                </div>
              </div>
              <Link 
                href={`/${locale}/club-tickets/${filter}`}
                className="bg-ibiza-green text-velvet-obsidian font-bold text-xs px-5 py-3 rounded-full hover:brightness-95 transition-all shadow-md shrink-0 uppercase tracking-wider"
              >
                Bekijk Club Info & Events →
              </Link>
            </div>
          )}

          {/* Filter Toolbar: Day/Night Filter, Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-end p-4 bg-transparent rounded-3xl border border-black/10 shadow-sm mb-8">
              {activeCategory === 'music' && (
                <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
                  <button 
                    onClick={() => setTimeFilter('all')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                      timeFilter === 'all' 
                        ? 'bg-ibiza-green text-velvet-obsidian shadow-sm' 
                        : 'text-black hover:text-ibiza-green'
                    }`}
                  >
                    Alle
                  </button>
                  <button 
                    onClick={() => setTimeFilter('day')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                      timeFilter === 'day' 
                        ? 'bg-ibiza-green text-velvet-obsidian shadow-sm' 
                        : 'text-black hover:text-ibiza-green'
                    }`}
                  >
                    Day Clubs
                  </button>
                  <button 
                    onClick={() => setTimeFilter('night')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                      timeFilter === 'night' 
                        ? 'bg-ibiza-green text-velvet-obsidian shadow-sm' 
                        : 'text-black hover:text-ibiza-green'
                    }`}
                  >
                    Night Clubs
                  </button>
                </div>
              )}
              
              <select
                value={sort}
                onChange={e => setSort(e.target.value as any)}
                className="bg-transparent border border-black/20 text-black rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-ibiza-green transition-all cursor-pointer"
              >
                <option value="date" className="bg-white text-black">Sorteer: Datum</option>
                <option value="price_asc" className="bg-white text-black">Prijs: Laag - Hoog</option>
                <option value="price_desc" className="bg-white text-black">Prijs: Hoog - Laag</option>
              </select>
            </div>

          
          <div className="listing" id="listingGrid">
            {displayedEvents.map((event, i) => {
              const price = parsePrice(event.prices);
              const matchingVenue = venues.find(v => v.slug === event.venueSlug);
              const cardLogo = event.venueLogo || matchingVenue?.whitelogo;

              return (
                <Link key={`${event.id}-${i}`} href={`/${locale}/club-tickets/${event.venueSlug}/${event.eventSlug}`} className="lcard in group">
                  <div className="media">
                    {i < 3 && <span className="lbadge hot">Populair</span>}
                    <button className="lfav" aria-label="Bewaar" onClick={(e) => { e.preventDefault(); }}><Heart size={18} /></button>
                    <div className="ph">
                      {event.eventCover || event.eventLogo || event.venueCover ? (
                         <img src={event.eventCover || event.eventLogo || event.venueCover} alt={event.eventName || event.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 0 }} />
                      ) : (
                         <div style={{textAlign: 'center'}}><Star size={32}/><div className="text-xs text-neutral-500">Foto laadt...</div></div>
                      )}
                    </div>
                    {/* Unified Logo Overlay Badge */}
                    {cardLogo && (
                      <div className="absolute bottom-3 left-3 w-12 h-12 rounded-2xl bg-white border border-white/20 p-1.5 flex items-center justify-center shadow-lg z-10">
                        <img 
                          src={cardLogo} 
                          alt="" 
                          style={{ filter: !['o-beach-ibiza', 'playa-soleil', 'bambuku-ibiza'].includes(event.venueSlug || '') ? 'brightness(0)' : 'none' }}
                          className="object-contain max-w-full max-h-full" 
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-black leading-tight mb-2 truncate group-hover:text-ibiza-green transition-colors">{event.eventName || event.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-black/60 mb-2">
                        <MapPin size={12} className="text-black/40" />
                        {event.venueName} · {event.date}
                      </div>
                      {event.lineUp && (
                        <div className="text-xs text-black/50 line-clamp-2 leading-relaxed mb-4">
                          <span className="font-bold text-black/70">Line-up: </span>
                          {event.lineUp}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-end border-t border-white/10 pt-3 mt-auto">
                      <div className="flex flex-col">
                        <small className="text-[10px] uppercase tracking-wider text-black/40">Vanaf</small>
                        <b className="text-black font-bold text-lg">€{price.toFixed(0)}</b>
                      </div>
                      <span className="bg-ibiza-green text-velvet-obsidian font-bold text-xs px-4 py-2 rounded-full hover:brightness-95 transition-all">Bekijk</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {visibleCount < filteredEvents.length && (
            <button className="loadmore" onClick={() => setVisibleCount(v => v + 12)}>Meer laden</button>
          )}

          {filteredEvents.length === 0 && (
            <div className="no-results" style={{textAlign: 'center', padding: '50px 20px', color: 'var(--sage-55)', fontWeight: 600}}>
              Geen resultaten voor deze filter. 
              <button onClick={() => { setFilter('all'); setTimeFilter('all'); setSearch(''); }} style={{background: 'var(--mint)', border: 'none', fontFamily: 'inherit', fontWeight: 700, color: 'var(--sage)', padding: '8px 16px', borderRadius: '999px', cursor: 'pointer', marginLeft: '6px'}}>
                Wis filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="wa-band">
            <svg className="wave-deco" viewBox="0 0 100 100" fill="currentColor" style={{ position: 'absolute', right: '-30px', top: '-30px', width: '230px', opacity: 0.1 }}>
              <path d="M0 50 Q 25 25 50 50 T 100 50 V 100 H 0 Z" />
            </svg>
            <div>
              <div className="kicker" style={{ color: 'var(--green)' }}>Heb je vragen over tickets?</div>
              <h2>Wij staan voor je klaar</h2>
              <p>Chat met ons via WhatsApp voor advies, VIP reserveringen of hulp bij het boeken van je tickets.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Chat met ons
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
