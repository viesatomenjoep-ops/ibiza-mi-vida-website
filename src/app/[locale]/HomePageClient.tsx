'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronRight, Calendar, Info, MapPin, Flame } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import type { CTEventDate } from '@/lib/clubtickets';
import { locations } from '@/lib/locations';

// Translations handled dynamically via Intl.DateTimeFormat

// 1. PRICE PARSER
function parsePrice(priceStr?: string): number {
  if (!priceStr) return 50;
  // Match first number sequence, allowing for decimals
  const match = priceStr.match(/\d+([.,]\d+)?/);
  if (match) {
    return parseFloat(match[0].replace(',', '.'));
  }
  return 50;
}

// 2. DATES GENERATOR
function generateDatesUntilOct31(locale: string, dict: any) {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let endYear = today.getFullYear();
  if (today.getMonth() > 9) { // past October
    endYear++;
  }
  const endDate = new Date(endYear, 9, 31);

  const current = new Date(today);
  while (current <= endDate) {
    const isToday = current.getTime() === today.getTime();
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    
    dates.push({
      dateObj: new Date(current),
      dateStr: `${yyyy}-${mm}-${dd}`,
      dayName: isToday ? (dict.today || 'TODAY') : new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(current).toUpperCase(),
      dayNum: current.getDate(),
      monthName: new Intl.DateTimeFormat(locale, { month: 'short' }).format(current).toUpperCase(),
      year: current.getFullYear(),
      weekNum: getWeekNumber(current),
    });
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// 3. CATEGORY LOGIC
const EVENT_CATEGORIES = [
  { id: 'boat-parties', label: 'Boat Parties & Excursions', keywords: ['boat', 'cruise', 'catamaran', 'sail', 'yacht', 'float', 'ferry', 'island'] },
  { id: 'club-tickets', label: 'Club Tickets', keywords: ['unvrs', 'ushuaïa', 'hï', 'pacha', 'amnesia', 'eden', 'chinois', 'swag', 'es paradis', 'lí', 'teatro'] },
  { id: 'pool-parties', label: 'Day Clubs & Pool Parties', keywords: ['beach', 'bambuku', 'rocks', 'soleil'] },
  { id: 'activities', label: 'Activities & Excursions', keywords: ['jet ski', 'buggy', 'sup', 'tour'] }
];

function getCategoryForEvent(event: CTEventDate): string {
  const name = (event.eventName || event.name || '').toLowerCase();
  const venue = (event.venueName || '').toLowerCase();
  const searchStr = name + ' ' + venue;

  for (const cat of EVENT_CATEGORIES) {
    if (cat.keywords.some(kw => searchStr.includes(kw))) {
      return cat.id;
    }
  }
  return 'club-tickets'; // Default fallback
}

type PeriodMode = 'day' | 'week' | 'month';

export default function HomePageClient({ 
  allEventDates = [], 
  dict = {
    hero_title: "Ontdek het beste van Ibiza",
    hero_subtitle: "Boek de dikste feesten, mooiste boottochten en leukste excursies voor jouw vakantie.",
    tab_day: "Dag",
    tab_week: "Week",
    tab_month: "Maand"
  }, 
  locale = 'nl',
  artists = []
}: { 
  allEventDates?: CTEventDate[], 
  dict?: any, 
  locale?: string,
  artists?: any[]
}) {
  const { addToCart, openDrawer } = useCart();
  
  const generatedDates = useMemo(() => generateDatesUntilOct31(locale, dict), [locale, dict]);
  
  const [periodMode, setPeriodMode] = useState<PeriodMode>('day');
  const [activeDateStr, setActiveDateStr] = useState<string>(generatedDates[0]?.dateStr || '');
  const [activeWeek, setActiveWeek] = useState<number>(generatedDates[0]?.weekNum || 1);
  const [activeMonth, setActiveMonth] = useState<number>(generatedDates[0]?.dateObj.getMonth() || 0);
  
  const topChoicesRef = React.useRef<HTMLDivElement>(null);
  const artistsRef = React.useRef<HTMLDivElement>(null);

  const scrollTopChoices = (direction: 'left' | 'right') => {
    if (topChoicesRef.current) {
      const { scrollLeft, clientWidth } = topChoicesRef.current;
      const scrollAmount = clientWidth * 0.8;
      topChoicesRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollArtists = (direction: 'left' | 'right') => {
    if (artistsRef.current) {
      const { scrollLeft, clientWidth } = artistsRef.current;
      const scrollAmount = clientWidth * 0.8;
      artistsRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Grouped periods
  const weeks = useMemo(() => {
    const map = new Map<number, { weekNum: number, label: string, startObj: Date }>();
    generatedDates.forEach(d => {
      if (!map.has(d.weekNum)) {
        map.set(d.weekNum, { 
          weekNum: d.weekNum, 
          label: `Week ${d.weekNum}`,
          startObj: d.dateObj 
        });
      }
    });
    return Array.from(map.values());
  }, [generatedDates]);

  const months = useMemo(() => {
    const map = new Map<number, { monthNum: number, label: string }>();
    generatedDates.forEach(d => {
      const m = d.dateObj.getMonth();
      if (!map.has(m)) {
        map.set(m, { monthNum: m, label: `${d.monthName} ${d.year}` });
      }
    });
    return Array.from(map.values());
  }, [generatedDates]);

  // Extract events for the selected period
  const selectedEvents = useMemo(() => {
    return allEventDates.filter(e => {
      const eDate = new Date(e.date);
      if (periodMode === 'day') {
        return e.date === activeDateStr;
      } else if (periodMode === 'week') {
        return getWeekNumber(eDate) === activeWeek;
      } else if (periodMode === 'month') {
        return eDate.getMonth() === activeMonth;
      }
      return false;
    });
  }, [allEventDates, periodMode, activeDateStr, activeWeek, activeMonth]);

  // Sort by score or random to pick top 30
  const top30Events = useMemo(() => {
    // In a real app we'd sort by popularity. For now, take first 30 after grouping by category to ensure variety
    const uniqueCategories = new Set<string>();
    const top30: CTEventDate[] = [];
    
    for (const e of selectedEvents) {
      if (top30.length >= 30) break;
      const cat = getCategoryForEvent(e);
      if (!uniqueCategories.has(cat)) {
        uniqueCategories.add(cat);
        top30.push(e);
      }
    }
    
    // Fill up to 30 if we didn't have 30 unique categories
    for (const e of selectedEvents) {
      if (top30.length >= 30) break;
      if (!top30.includes(e)) top30.push(e);
    }
    
    return top30;
  }, [selectedEvents]);

  // Group remaining events by category
  const eventsByCategory = useMemo(() => {
    const grouped: Record<string, CTEventDate[]> = {};
    EVENT_CATEGORIES.forEach(c => grouped[c.id] = []);
    
    const remainingEvents = selectedEvents.filter(e => !top30Events.includes(e));
    
    remainingEvents.forEach(e => {
      const cat = getCategoryForEvent(e);
      if (grouped[cat]) {
        grouped[cat].push(e);
      }
    });
    return grouped;
  }, [selectedEvents, top30Events]);

  const handleBook = (event: CTEventDate) => {
    // Navigeer naar de detail pagina in plaats van direct boeken
    const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : '';
    const prefix = ['en', 'nl', 'de', 'es', 'fr'].includes(locale) ? `/${locale}` : '';
    window.location.href = `${prefix}/club-tickets/${event.venueSlug}/${event.eventSlug}`;
  };

  const formatLineUp = (lineUp?: string) => {
    if (!lineUp) return 'Officiële Toegang';
    let text = lineUp.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    text = text.replace(/(\s*-\s*)+/g, ', ');
    if (text.startsWith(',')) text = text.substring(1).trim();
    return text || 'Officiële Toegang';
  };

  const renderEventCard = (event: CTEventDate, isFeatured = false, isCompact = false) => {
    const priceNum = parsePrice(event.prices);
    const dateObj = new Date(event.date);
    const dateFormatted = dateObj.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
    
    return (
      <div key={`${event.id}-${event.date}`} className={`flex-shrink-0 snap-center flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#00A698]/10 hover:border-[#00A698]/50 transition-all duration-300 group cursor-pointer ${isFeatured ? 'shadow-md' : 'shadow-sm'} ${isCompact ? 'w-[90vw] md:w-[350px]' : 'w-full'}`} onClick={() => handleBook(event)}>
        <div className={`relative w-full overflow-hidden bg-slate-100 ${isCompact ? 'h-32' : (isFeatured ? 'h-64' : 'h-48')}`}>
          {(event.eventCover || event.eventLogo || event.venueCover || event.venueLogo) ? (
            <Image 
              src={event.eventCover || event.eventLogo || event.venueCover || event.venueLogo || ''} 
              alt={event.eventName || event.name} 
              fill 
              priority={isFeatured}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <Star size={48} />
            </div>
          )}
          
          {/* Always show Date badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#1A1A1A] px-2.5 py-1 rounded-lg text-xs font-bold shadow-md border border-slate-200/50 flex items-center gap-1.5">
            <Calendar size={12} className="text-[#00A698]" />
            {dateFormatted}
          </div>

        </div>
        <div className={`flex-1 flex flex-col ${isCompact ? 'p-3' : 'p-5'}`}>
          <h3 className={`font-bold text-[#1A1A1A] leading-tight mb-1 group-hover:text-[#00A698] transition-colors line-clamp-2 ${isCompact ? 'text-base' : (isFeatured ? 'text-xl' : 'text-lg')}`}>
            {event.eventName || event.name}
          </h3>
          <p className="text-xs font-semibold text-[#1A1A1A]/50 mb-2 flex items-center gap-1">
            <MapPin size={12} /> {event.venueName || 'Ibiza'}
          </p>
          
          {!isCompact && (
            <ul className="space-y-1.5 mb-4 text-sm text-[#1A1A1A]/70">
              <li className="flex items-start gap-2">
                <span className="text-[#00A698] font-bold">✓</span>
                <span className="line-clamp-1">{formatLineUp(event.lineUp)}</span>
              </li>
            </ul>
          )}

          <div className={`mt-auto flex justify-between items-end border-slate-100 ${isCompact ? 'pt-2 mt-2 border-t' : 'pt-4 border-t'}`}>
            <div className="flex items-center gap-1 text-sm font-bold text-[#1A1A1A]/80">
              <Star size={12} fill="#F59E0B" className="text-amber-500" />
              <span className="text-xs">4.9</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#1A1A1A]/50 uppercase tracking-wide">{dict.from || 'Vanaf'}</div>
              <div className={`font-bold text-[#1A1A1A] ${isCompact ? 'text-base' : 'text-xl'}`}>
                € {priceNum > 0 ? priceNum.toFixed(2) : '50.00'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-[#1A1A1A] font-sans antialiased pb-20 bg-[#FAF9F6]">
      
      {/* 50vh Video Hero */}
      <div className="fixed inset-0 w-full h-[100vh] z-[-1] overflow-hidden bg-[#FAF9F6]">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-[1.15]"
          src="https://res.cloudinary.com/daj1lyfgk/video/upload/q_auto:good,f_auto,so_30,du_30,w_1920/v1781127267/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p_bqyeg4.mp4"
        />
        <div className="absolute inset-0 bg-white/70 z-0"></div>
      </div>
      {/* Interactive Picker Section with Sub-Navbars */}
      <div className="w-full relative z-20">
        
        {/* Second Navbar: Title Banner */}
        <div className="w-full bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-center shadow-sm">
          <p className="text-sm font-bold text-[#1A1A1A] text-center tracking-tight">
            {dict.home_top_banner || 'Ibiza Mivida, de beste plek voor alle events, boat parties en veel meer'}
          </p>
        </div>

        {/* Third Navbar: Tabs */}
        <div className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-[96px] z-40">
          <div className="max-w-7xl mx-auto flex">
            <button 
              onClick={() => setPeriodMode('day')}
              className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${periodMode === 'day' ? 'bg-[#FAF9F6] border-[#00A698] text-[#00A698]' : 'border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-[#FAF9F6]'}`}
            >
              {dict.tab_day}
            </button>
            <button 
              onClick={() => setPeriodMode('week')}
              className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 border-l border-r border-l-slate-100 border-r-slate-100 ${periodMode === 'week' ? 'bg-[#FAF9F6] border-b-[#00A698] text-[#00A698]' : 'border-b-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-[#FAF9F6]'}`}
            >
              {dict.tab_week}
            </button>
            <button 
              onClick={() => setPeriodMode('month')}
              className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${periodMode === 'month' ? 'bg-[#FAF9F6] border-[#00A698] text-[#00A698]' : 'border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-[#FAF9F6]'}`}
            >
              {dict.tab_month}
            </button>
          </div>
        </div>

        {/* Date Sliders container */}
        <div className="w-full bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 p-4 md:p-5 mb-4 md:mb-6">
          


          {/* Sliders based on Mode */}
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {periodMode === 'day' && generatedDates.map((d, i) => (
              <button 
                key={`day-${i}`}
                onClick={() => setActiveDateStr(d.dateStr)}
                className={`min-w-[80px] md:min-w-[100px] flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  activeDateStr === d.dateStr 
                    ? 'border-[#00A698] bg-[#00A698] text-white shadow-md scale-105' 
                    : 'border-slate-200 bg-white text-[#1A1A1A]/70 hover:border-[#00A698]/50 hover:bg-[#FAF9F6]'
                }`}
              >
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 ${activeDateStr === d.dateStr ? 'text-white/90' : 'text-[#1A1A1A]/50'}`}>{d.dayName}</span>
                <span className="text-xl md:text-2xl font-black">{d.dayNum}</span>
                <span className={`text-[10px] md:text-xs font-medium mt-1 ${activeDateStr === d.dateStr ? 'text-white/90' : 'text-[#1A1A1A]/50'}`}>{d.monthName}</span>
              </button>
            ))}

            {periodMode === 'week' && weeks.map((w, i) => (
              <button 
                key={`week-${w.weekNum}`}
                onClick={() => setActiveWeek(w.weekNum)}
                className={`min-w-[120px] flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  activeWeek === w.weekNum 
                    ? 'border-[#00A698] bg-[#00A698] text-white shadow-md scale-105' 
                    : 'border-slate-200 bg-white text-[#1A1A1A]/70 hover:border-[#00A698]/50 hover:bg-[#FAF9F6]'
                }`}
              >
                <span className="text-sm font-bold">{w.label}</span>
                <span className={`text-xs mt-1 ${activeWeek === w.weekNum ? 'text-white/80' : 'text-[#1A1A1A]/50'}`}>
                  {dict.from || 'Vanaf'} {w.startObj.getDate()} {new Intl.DateTimeFormat(locale, { month: 'short' }).format(w.startObj).toUpperCase()}
                </span>
              </button>
            ))}

            {periodMode === 'month' && months.map((m, i) => (
              <button 
                key={`month-${m.monthNum}`}
                onClick={() => setActiveMonth(m.monthNum)}
                className={`min-w-[140px] flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  activeMonth === m.monthNum 
                    ? 'border-[#00A698] bg-[#00A698] text-white shadow-md scale-105' 
                    : 'border-slate-200 bg-white text-[#1A1A1A]/70 hover:border-[#00A698]/50 hover:bg-[#FAF9F6]'
                }`}
              >
                <span className="text-lg font-bold">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        
        {/* Top 30 Section (Moved to be the very first thing after calendar) */}
        {top30Events.length > 0 && selectedEvents.length > 0 && (
          <div className="w-full mb-8 text-left group">
            <div 
              ref={topChoicesRef}
              className="flex overflow-x-auto gap-4 pb-4 px-4 md:px-0 snap-x snap-mandatory no-scrollbar w-full scroll-smooth"
            >
              {top30Events.map(e => renderEventCard(e, true, true))}
            </div>

            {/* Arrow Selector */}
            <div className="flex justify-center items-center gap-4 mt-2 px-4 md:px-0">
              <button 
                onClick={() => scrollTopChoices('left')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#FAF9F6] hover:border-[#00A698] hover:text-[#00A698] transition-colors shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronRight className="rotate-180" size={20} />
              </button>
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-[#00A698]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>
              <button 
                onClick={() => scrollTopChoices('right')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#FAF9F6] hover:border-[#00A698] hover:text-[#00A698] transition-colors shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}



        {/* Results Info */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-xl p-3 md:p-4 mb-4 md:mb-6 border border-slate-200 shadow-sm mx-4 md:mx-0">
          <div className="text-[#1A1A1A]/80 flex items-center gap-2">
            <span className="font-black text-2xl text-[#1A1A1A]">{selectedEvents.length} {dict.all_events}</span> 
            <span className="text-sm font-medium">{dict.events_found}</span>
          </div>
        </div>

        {/* Artists Section */}
        {artists && artists.length > 0 && (
          <div className="w-full mb-12 text-left group">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6 px-4 md:px-0 flex items-center gap-2">
              {dict.home_top_djs || "Top DJ's & Artiesten"}
            </h3>
            <div 
              ref={artistsRef}
              className="flex overflow-x-auto gap-4 md:gap-6 pb-4 px-4 md:px-0 snap-x snap-mandatory no-scrollbar w-full scroll-smooth"
            >
              {artists.slice(0, 30).map((artist, idx) => (
                <Link 
                  key={`artist-${artist.slug}-${idx}`} 
                  href={`/${locale}/artists/${artist.slug}`} 
                  className="group relative snap-center flex-shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden flex flex-col items-center justify-center p-2 shadow-sm hover:shadow-lg transition-all border-4 border-transparent hover:border-[#00A698]"
                >
                  <Image 
                    src={artist.image || '/placeholder-artist.jpg'} 
                    alt={artist.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <h4 className="relative z-10 font-black text-white text-center text-xs md:text-sm drop-shadow-md px-1 whitespace-normal leading-tight">
                    {artist.name}
                  </h4>
                </Link>
              ))}
            </div>

            {/* Arrow Selector */}
            <div className="flex justify-center items-center gap-4 mt-2 px-4 md:px-0">
              <button 
                onClick={() => scrollArtists('left')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#FAF9F6] hover:border-[#00A698] hover:text-[#00A698] transition-colors shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronRight className="rotate-180" size={20} />
              </button>
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-[#00A698]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>
              <button 
                onClick={() => scrollArtists('right')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#FAF9F6] hover:border-[#00A698] hover:text-[#00A698] transition-colors shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {selectedEvents.length > 0 ? (
          <>
            

            {/* Categorized Remaining Events */}
            {EVENT_CATEGORIES.map(category => {
              const events = eventsByCategory[category.id];
              if (!events || events.length === 0) return null;
              
              return (
                <div key={category.id} className="mb-12 px-4 md:px-0">
                  <div className="flex justify-between items-end mb-6">
                    <h3 className="text-2xl font-bold text-[#1A1A1A]">{category.label}</h3>
                    <Link href={`/${category.id}`} className="text-sm font-bold text-[#00A698] hover:underline flex items-center gap-1">
                      Bekijk alle <ChevronRight size={16} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {events.slice(0, 4).map(e => renderEventCard(e, false))}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center mb-16 mx-4 md:mx-0">
            <Calendar className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Geen events gevonden</h3>
            <p className="text-[#1A1A1A]/50">Er zijn momenteel geen activiteiten beschikbaar in deze specifieke periode. Probeer een andere datum of week.</p>
          </div>
        )}

        {/* Regions/Cities Section */}
        <div className="mt-12 pt-12 border-t border-slate-200 mb-16 px-4 md:px-0">
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">Ontdek de top locaties in Ibiza</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {locations.map((loc) => (
              <Link key={loc.id} href={`/${locale}/locations/${loc.slug}`} className="group relative h-32 rounded-xl overflow-hidden flex flex-col justify-end p-4 shadow-sm hover:shadow-md transition-shadow">
                <Image src={loc.imageUrl} alt={loc.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <h4 className="relative z-10 font-bold text-white text-sm md:text-base">{loc.name}</h4>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
