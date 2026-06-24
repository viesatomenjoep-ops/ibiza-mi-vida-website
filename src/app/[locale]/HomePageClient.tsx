'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronRight, Calendar, Info, MapPin } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import type { CTEventDate } from '@/lib/clubtickets';
import { locations } from '@/lib/locations';

const DAYS_NL = ['ZO', 'MA', 'DI', 'WO', 'DO', 'VR', 'ZA'];
const MONTHS_NL = ['JAN', 'FEB', 'MRT', 'APR', 'MEI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEC'];

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
      dayName: isToday ? 'VANDAAG' : DAYS_NL[current.getDay()],
      dayNum: current.getDate(),
      monthName: MONTHS_NL[current.getMonth()],
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
  locale = 'nl' 
}: { 
  allEventDates?: CTEventDate[], 
  dict?: any, 
  locale?: string 
}) {
  const { addToCart, openDrawer } = useCart();
  
  const generatedDates = useMemo(() => generateDatesUntilOct31(locale, dict), [locale, dict]);
  
  const [periodMode, setPeriodMode] = useState<PeriodMode>('day');
  const [activeDateStr, setActiveDateStr] = useState<string>(generatedDates[0]?.dateStr || '');
  const [activeWeek, setActiveWeek] = useState<number>(generatedDates[0]?.weekNum || 1);
  const [activeMonth, setActiveMonth] = useState<number>(generatedDates[0]?.dateObj.getMonth() || 0);

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

  // Sort by score or random to pick top 3
  const top3Events = useMemo(() => {
    // In a real app we'd sort by popularity. For now, take first 3 after grouping by category to ensure variety
    const uniqueCategories = new Set<string>();
    const top3: CTEventDate[] = [];
    
    for (const e of selectedEvents) {
      if (top3.length >= 3) break;
      const cat = getCategoryForEvent(e);
      if (!uniqueCategories.has(cat)) {
        uniqueCategories.add(cat);
        top3.push(e);
      }
    }
    
    // Fill up to 3 if we didn't have 3 unique categories
    for (const e of selectedEvents) {
      if (top3.length >= 3) break;
      if (!top3.includes(e)) top3.push(e);
    }
    
    return top3;
  }, [selectedEvents]);

  // Group remaining events by category
  const eventsByCategory = useMemo(() => {
    const grouped: Record<string, CTEventDate[]> = {};
    EVENT_CATEGORIES.forEach(c => grouped[c.id] = []);
    
    const remainingEvents = selectedEvents.filter(e => !top3Events.includes(e));
    
    remainingEvents.forEach(e => {
      const cat = getCategoryForEvent(e);
      if (grouped[cat]) {
        grouped[cat].push(e);
      }
    });
    return grouped;
  }, [selectedEvents, top3Events]);

  const handleBook = (event: CTEventDate) => {
    // Navigeer naar de detail pagina in plaats van direct boeken
    const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : '';
    const prefix = ['en', 'nl', 'de', 'es', 'fr'].includes(locale) ? `/${locale}` : '';
    window.location.href = `${prefix}/club-tickets/${event.venueSlug}/${event.eventSlug}`;
  };

  const renderEventCard = (event: CTEventDate, isFeatured = false) => {
    const priceNum = parsePrice(event.prices);
    
    return (
      <div key={event.id} className={`flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer ${isFeatured ? 'shadow-md' : 'shadow-sm'}`} onClick={() => handleBook(event)}>
        <div className={`relative w-full overflow-hidden bg-slate-100 ${isFeatured ? 'h-64' : 'h-48'}`}>
          {(event.venueCover || event.venueLogo) ? (
            <Image 
              src={event.venueCover || event.venueLogo || ''} 
              alt={event.eventName || event.name} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <Star size={48} />
            </div>
          )}
          {isFeatured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-[#00A698] to-teal-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md">
              Top Keuze
            </div>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className={`font-bold text-slate-900 leading-tight mb-1 group-hover:text-[#00A698] transition-colors line-clamp-2 ${isFeatured ? 'text-xl' : 'text-lg'}`}>
            {event.eventName || event.name}
          </h3>
          <p className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-1">
            <MapPin size={14} /> {event.venueName || 'Ibiza'}
          </p>
          
          <ul className="space-y-1.5 mb-4 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-[#00A698] font-bold">✓</span>
              <span className="line-clamp-1">{event.lineUp || 'Officiële Toegang'}</span>
            </li>
          </ul>

          <div className="mt-auto flex justify-between items-end pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
              <Star size={14} fill="#F59E0B" className="text-amber-500" />
              <span>4.9</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Vanaf</div>
              <div className="text-xl font-bold text-slate-900">
                € {priceNum > 0 ? priceNum.toFixed(2) : '50.00'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white font-sans antialiased pb-20">
      
      {/* 50vh Video Hero */}
      <div className="fixed inset-0 w-full h-[100vh] z-[-1] overflow-hidden bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-[1.15]"
          src="https://res.cloudinary.com/daj1lyfgk/video/upload/q_auto:good,f_auto,so_30,du_30,w_1920/v1781127267/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p_bqyeg4.mp4"
        />
        <div className="absolute inset-0 bg-black/50 z-0"></div>
      </div>
      <div className="relative w-full min-h-[60vh] md:min-h-[70vh] pt-28 pb-32 flex flex-col justify-center">
        
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            {dict.hero_title}
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl drop-shadow-md">
            {dict.hero_subtitle}
          </p>
          
          {/* Top 3 Section moved up */}
          {top3Events.length > 0 && (
            <div className="w-full max-w-5xl mx-auto mt-8 text-left">
              <h2 className="text-xl md:text-2xl font-black text-white mb-4 flex items-center gap-2 drop-shadow-md">
                <Star className="text-amber-400" fill="currentColor" size={24} /> {dict.top_choice}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {top3Events.map(e => renderEventCard(e, false))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Picker Section (Overlapping the hero slightly) */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 md:-mt-12 relative z-20 mb-12">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 md:p-6">
          
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 max-w-sm mx-auto">
            <button 
              onClick={() => setPeriodMode('day')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${periodMode === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {dict.tab_day}
            </button>
            <button 
              onClick={() => setPeriodMode('week')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${periodMode === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {dict.tab_week}
            </button>
            <button 
              onClick={() => setPeriodMode('month')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${periodMode === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {dict.tab_month}
            </button>
          </div>

          {/* Sliders based on Mode */}
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {periodMode === 'day' && generatedDates.map((d, i) => (
              <button 
                key={`day-${i}`}
                onClick={() => setActiveDateStr(d.dateStr)}
                className={`min-w-[80px] md:min-w-[100px] flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  activeDateStr === d.dateStr 
                    ? 'border-[#00A698] bg-[#00A698] text-white shadow-md scale-105' 
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 ${activeDateStr === d.dateStr ? 'text-white/90' : 'text-slate-500'}`}>{d.dayName}</span>
                <span className="text-xl md:text-2xl font-black">{d.dayNum}</span>
                <span className={`text-[10px] md:text-xs font-medium mt-1 ${activeDateStr === d.dateStr ? 'text-white/90' : 'text-slate-500'}`}>{d.monthName}</span>
              </button>
            ))}

            {periodMode === 'week' && weeks.map((w, i) => (
              <button 
                key={`week-${w.weekNum}`}
                onClick={() => setActiveWeek(w.weekNum)}
                className={`min-w-[120px] flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  activeWeek === w.weekNum 
                    ? 'border-[#00A698] bg-[#00A698] text-white shadow-md scale-105' 
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-bold">{w.label}</span>
                <span className={`text-xs mt-1 ${activeWeek === w.weekNum ? 'text-white/80' : 'text-slate-500'}`}>
                  Vanaf {w.startObj.getDate()} {MONTHS_NL[w.startObj.getMonth()]}
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
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg font-bold">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Results Info */}
        <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-4">
          <div className="text-white/80 flex items-center gap-2">
            <span className="font-black text-2xl text-white">{selectedEvents.length} {dict.all_events}</span> 
            <span className="text-sm font-medium">{dict.events_found}</span>
          </div>
        </div>

        {selectedEvents.length > 0 ? (
          <>
            

            {/* Categorized Remaining Events */}
            {EVENT_CATEGORIES.map(category => {
              const events = eventsByCategory[category.id];
              if (!events || events.length === 0) return null;
              
              return (
                <div key={category.id} className="mb-12">
                  <div className="flex justify-between items-end mb-6">
                    <h3 className="text-2xl font-bold text-white">{category.label}</h3>
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
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center mb-16">
            <Calendar className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Geen events gevonden</h3>
            <p className="text-slate-500">Er zijn momenteel geen activiteiten beschikbaar in deze specifieke periode. Probeer een andere datum of week.</p>
          </div>
        )}

        {/* Regions/Cities Section */}
        <div className="mt-20 pt-16 border-t border-white/20 mb-16">
          <h3 className="text-2xl font-bold text-white mb-6">Ontdek de top locaties in Ibiza</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {locations.map((loc) => (
              <Link key={loc.id} href={`/locations/${loc.slug}`} className="group relative h-32 rounded-xl overflow-hidden flex flex-col justify-end p-4 shadow-sm hover:shadow-md transition-shadow">
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
