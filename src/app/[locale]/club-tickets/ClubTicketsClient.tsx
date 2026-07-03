'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, Star, Heart, Calendar, Music, MessageCircle } from 'lucide-react';
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

  const filteredEvents = useMemo(() => {
    let result = initialEvents;

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
      if (sort === 'price_asc') return parsePrice(a.prices) - parsePrice(b.prices);
      if (sort === 'price_desc') return parsePrice(b.prices) - parsePrice(a.prices);
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return result;
  }, [initialEvents, filter, timeFilter, search, sort, uniqueVenues, activeCategory]);

  const displayedEvents = filteredEvents.slice(0, visibleCount);

  return (
    <>
      <section className="subhero pt-8 pb-10">
        <div className="subhero-bg"></div>
        <div className="wrap">
          <div className="crumb">
            <Link href={`/${locale}`}>Home</Link>
            <ChevronRight size={13}/>
            <b>Club Tickets</b>
          </div>
          <span className="eyebrow" style={{marginTop: '20px'}}><span className="dot"></span>Ibiza {new Date().getFullYear()}</span>
          <h1>Alle <span className="accent">Clubtickets</span></h1>
          <p className="lead">Eén plek voor alle clubtickets en activiteiten op het eiland. Filter op club, datum of categorie en vergelijk direct.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-white/5">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-ibiza-green text-velvet-obsidian shadow-[0_0_15px_rgba(0,166,152,0.3)] scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Slider of Round Club Tiles */}
          <div className="mb-12 relative group/slider">
            <div className="text-xs font-bold tracking-widest uppercase text-white/50 mb-6">
              {locale === 'nl' ? 'Kies een Locatie / Partner' : 'Choose a Location / Partner'}
            </div>
            
            <div className="relative flex items-center">
              {/* Prev Button */}
              <button 
                onClick={() => scrollSlider(-1)}
                className="absolute -left-4 z-40 bg-black/80 hover:bg-ibiza-green hover:text-velvet-obsidian text-white border border-white/10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover/slider:opacity-100 hidden md:flex"
                aria-label="Previous"
              >
                &larr;
              </button>

              <div 
                ref={sliderRef}
                className="flex gap-8 md:gap-12 overflow-x-auto scroll-smooth hide-scrollbar py-6 px-8 items-center w-full"
              >
                {/* "Alle" Tile */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <button 
                    onClick={() => setFilter('all')}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 relative ${
                      filter === 'all' 
                        ? 'border-ibiza-green bg-ibiza-green text-velvet-obsidian shadow-[0_0_20px_rgba(0,166,152,0.4)] scale-[1.3] z-30 font-bold' 
                        : 'border-white/10 bg-white/5 text-ibiza-green hover:border-ibiza-green/50 hover:bg-white/10 hover:scale-105'
                    }`}
                  >
                    <Music size={24} className={filter === 'all' ? 'text-velvet-obsidian' : 'text-ibiza-green'} />
                  </button>
                  <span className={`text-[10px] uppercase font-bold tracking-widest text-center mt-3 max-w-[90px] truncate ${filter === 'all' ? 'text-ibiza-green' : 'text-white/60'}`}>
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
                        className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 p-3.5 flex items-center justify-center transition-all duration-300 relative ${
                          isActive 
                            ? 'bg-white/10 border-ibiza-green shadow-[0_0_25px_rgba(0,166,152,0.6)] scale-[1.3] z-30' 
                            : 'border-white/10 bg-white/5 hover:border-ibiza-green/50 hover:bg-white/10 hover:scale-105'
                        }`}
                      >
                        {v.logo ? (
                          <img 
                            src={v.logo} 
                            alt={v.name} 
                            className={`w-full h-full object-contain transition-all duration-300 ${
                              isActive ? 'scale-110 opacity-100' : 'scale-100 opacity-70 hover:opacity-100'
                            }`}
                          />
                        ) : (
                          <span className={`font-bold text-xs ${isActive ? 'text-ibiza-green' : 'text-white/80'}`}>
                            {v.name.substring(0, 3).toUpperCase()}
                          </span>
                        )}
                      </button>
                      <span className={`text-[10px] uppercase font-bold tracking-widest text-center mt-3 max-w-[95px] truncate ${isActive ? 'text-ibiza-green font-black' : 'text-white/60'}`}>
                        {v.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Next Button */}
              <button 
                onClick={() => scrollSlider(1)}
                className="absolute -right-4 z-40 bg-black/80 hover:bg-ibiza-green hover:text-velvet-obsidian text-white border border-white/10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover/slider:opacity-100 hidden md:flex"
                aria-label="Next"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* Club Info Redirect Banner */}
          {filter !== 'all' && (
            <div className="mb-8 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center p-1.5 shrink-0">
                  {uniqueVenues.find(v => v.slug === filter)?.logo ? (
                    <img src={uniqueVenues.find(v => v.slug === filter)?.logo} alt="" className="object-contain max-w-full max-h-full filter invert" />
                  ) : (
                    <Music className="text-ibiza-green" size={24} />
                  )}
                </div>
                <div>
                  <h4 className="text-white font-bold">{uniqueVenues.find(v => v.slug === filter)?.name}</h4>
                  <p className="text-xs text-white/60">Bekijk de volledige biografie, vaste wekelijkse feesten en route-informatie.</p>
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

          {/* Filter Toolbar: Search, Day/Night Filter, Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg mb-8">
            <div className="relative w-full md:w-auto md:flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                placeholder="Zoeken op feest, club of DJ..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-ibiza-green focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              {activeCategory === 'music' && (
                <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
                  <button 
                    onClick={() => setTimeFilter('all')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                      timeFilter === 'all' 
                        ? 'bg-ibiza-green text-velvet-obsidian shadow-sm' 
                        : 'text-white hover:text-ibiza-green'
                    }`}
                  >
                    Alle
                  </button>
                  <button 
                    onClick={() => setTimeFilter('day')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                      timeFilter === 'day' 
                        ? 'bg-ibiza-green text-velvet-obsidian shadow-sm' 
                        : 'text-white hover:text-ibiza-green'
                    }`}
                  >
                    Day Clubs
                  </button>
                  <button 
                    onClick={() => setTimeFilter('night')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                      timeFilter === 'night' 
                        ? 'bg-ibiza-green text-velvet-obsidian shadow-sm' 
                        : 'text-white hover:text-ibiza-green'
                    }`}
                  >
                    Night Clubs
                  </button>
                </div>
              )}
              
              <select
                value={sort}
                onChange={e => setSort(e.target.value as any)}
                className="bg-white/5 border border-white/10 text-white rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-ibiza-green transition-all cursor-pointer"
              >
                <option value="date" className="bg-[#0D0509] text-white">Sorteer: Datum</option>
                <option value="price_asc" className="bg-[#0D0509] text-white">Prijs: Laag - Hoog</option>
                <option value="price_desc" className="bg-[#0D0509] text-white">Prijs: Hoog - Laag</option>
              </select>
            </div>
          </div>
          
          <div className="results-meta mb-6 text-white">
            <span>{filteredEvents.length}</span> resultaten · live uit ClubTickets API
          </div>
          
          <div className="listing" id="listingGrid">
            {displayedEvents.map((event, i) => {
              const price = parsePrice(event.prices);
              const matchingVenue = uniqueVenues.find(v => v.slug === event.venueSlug);
              const cardLogo = event.eventLogo || matchingVenue?.logo;

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
                        <img src={cardLogo} alt="" className="object-contain max-w-full max-h-full" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white leading-tight mb-2 truncate group-hover:text-ibiza-green transition-colors">{event.eventName || event.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-white/60 mb-2">
                        <MapPin size={12} className="text-white/40" />
                        {event.venueName} · {event.date}
                      </div>
                      {event.lineUp && (
                        <div className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-4">
                          <span className="font-bold text-white/70">Line-up: </span>
                          {event.lineUp}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-end border-t border-white/10 pt-3 mt-auto">
                      <div className="flex flex-col">
                        <small className="text-[10px] uppercase tracking-wider text-white/40">Vanaf</small>
                        <b className="text-white font-bold text-lg">€{price.toFixed(0)}</b>
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
    </>
  );
}
