'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronRight, Calendar, Info, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import type { CTEventDate } from '@/lib/clubtickets';
import { locations } from '@/lib/locations';

const DAYS_NL = ['ZO', 'MA', 'DI', 'WO', 'DO', 'VR', 'ZA'];
const MONTHS_NL = ['JAN', 'FEB', 'MRT', 'APR', 'MEI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEC'];

// Helper to generate dates from today until Oct 31
function generateDatesUntilOct31() {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let endYear = today.getFullYear();
  if (today.getMonth() > 9) { // 9 is October
    endYear++;
  }
  const endDate = new Date(endYear, 9, 31); // Oct 31

  const current = new Date(today);
  while (current <= endDate) {
    const isToday = current.getTime() === today.getTime();
    // Use local YYYY-MM-DD
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    
    dates.push({
      dateObj: new Date(current),
      dateStr: `${yyyy}-${mm}-${dd}`,
      dayName: isToday ? 'VANDAAG' : DAYS_NL[current.getDay()],
      dayNum: current.getDate(),
      monthName: MONTHS_NL[current.getMonth()],
      year: current.getFullYear()
    });
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

const categories = [
  "Formentera Tours", "Boat Parties", "VIP Catamaran", "Jet Ski Rentals", 
  "Pacha Tickets", "Amnesia Tickets", "Ushuaïa Tickets", "Hï Ibiza Tickets",
  "Sunset Cruises", "Scooter Rentals"
];

// Locations are imported from @/lib/locations

export default function HomePageClient({ allEventDates = [] }: { allEventDates?: CTEventDate[] }) {
  const { addToCart, openDrawer } = useCart();
  
  const generatedDates = useMemo(() => generateDatesUntilOct31(), []);
  const [activeDateStr, setActiveDateStr] = useState<string>(generatedDates[0]?.dateStr || '');

  // Extract events for the specifically selected date
  const selectedDateEvents = useMemo(() => {
    if (!activeDateStr) return [];
    return allEventDates.filter(e => e.date === activeDateStr);
  }, [allEventDates, activeDateStr]);

  // Extract events for the next 7 days starting tomorrow
  const weekEvents = useMemo(() => {
    if (!activeDateStr) return [];
    
    const startDate = new Date(activeDateStr);
    const endDate = new Date(activeDateStr);
    endDate.setDate(endDate.getDate() + 7);

    return allEventDates.filter(e => {
      const eDate = new Date(e.date);
      // Only include events STRICTLY after the selected date, up to 7 days.
      return eDate > startDate && eDate <= endDate;
    }).slice(0, 12); // Limit to 12 for UI performance
  }, [allEventDates, activeDateStr]);

  const activeDateObj = generatedDates.find(d => d.dateStr === activeDateStr)?.dateObj || new Date();
  const nextMonthObj = new Date(activeDateObj);
  nextMonthObj.setMonth(nextMonthObj.getMonth() + 1);

  const activeMonthStr = `${MONTHS_NL[activeDateObj.getMonth()]} ${activeDateObj.getFullYear()}`;
  const nextMonthStr = `${MONTHS_NL[nextMonthObj.getMonth()]} ${nextMonthObj.getFullYear()}`;

  const handleBook = (event: CTEventDate) => {
    const priceNum = parseFloat(event.prices?.replace(/[^0-9.]/g, '')) || 50;
    addToCart({
      serviceId: String(event.id),
      title: event.eventName || event.name,
      price: priceNum,
      image: event.venueCover || event.venueLogo || '/placeholder.png',
      date: event.date
    });
    openDrawer();
  };

  const renderEventCard = (event: CTEventDate) => {
    const priceNum = parseFloat(event.prices?.replace(/[^0-9.]/g, '')) || 0;
    
    return (
      <div key={event.id} className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => handleBook(event)}>
        <div className="relative h-48 md:h-56 w-full overflow-hidden bg-slate-100">
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
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <span className="inline-block bg-[#00A698]/10 text-[#00A698] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-3 self-start">
            CLUB TICKET
          </span>
          <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-[#00A698] transition-colors line-clamp-2">
            {event.eventName || event.name}
          </h3>
          <p className="text-sm font-semibold text-slate-500 mb-3">
            @ {event.venueName || 'Club'}
          </p>
          
          <ul className="space-y-1.5 mb-4 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-slate-900 font-bold">✓</span>
              <span>Officiële Tickets</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400">•</span>
              <span>Line-up: {event.lineUp ? (event.lineUp.length > 30 ? event.lineUp.substring(0, 30) + '...' : event.lineUp) : 'TBA'}</span>
            </li>
          </ul>

          <div className="mt-auto flex justify-between items-end pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
              <Star size={14} fill="#F59E0B" className="text-amber-500" />
              <span>4.9 <span className="text-slate-400 font-normal">({Math.floor(Math.random() * 200) + 50})</span></span>
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
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased pb-20">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:underline">Ibiza</Link>
        <ChevronRight size={12} />
        <span className="font-medium text-slate-700">Activiteiten & Excursies</span>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="relative w-full h-[400px] md:h-[450px] rounded-2xl overflow-hidden flex items-end p-6 md:p-10 shadow-lg">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="https://res.cloudinary.com/daj1lyfgk/video/upload/q_auto:good,f_auto,so_30,du_30,w_1920/v1781127267/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p_bqyeg4.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-0"></div>
          
          <div className="relative z-10 w-full">
            <div className="flex items-center gap-1 text-amber-400 text-sm font-bold mb-2">
              <Star size={16} fill="currentColor" />
              <span>4.8 (1.2k+ reviews)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">
              Activiteiten & Excursies in <br/>Ibiza
            </h1>
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg text-sm md:text-base font-medium shadow-sm">
              Verken de mooiste stranden, feesten en verborgen parels van het eiland
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Availability Section */}
        <div className="mb-8 border-b border-slate-200 pb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Bekijk beschikbaarheid</h2>
          <div className="flex justify-between items-end text-xs text-slate-500 font-bold mb-2 px-1 uppercase tracking-wider">
            <span>{activeMonthStr}</span>
            <span>{nextMonthStr}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
            {generatedDates.map((d, i) => (
              <button 
                key={i}
                onClick={() => setActiveDateStr(d.dateStr)}
                className={`min-w-[100px] flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-xl border transition-all shadow-sm hover:shadow-md ${
                  activeDateStr === d.dateStr 
                    ? 'border-[#00A698] bg-[#00A698]/5 ring-1 ring-[#00A698] text-[#00A698]' 
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`text-xs font-semibold mb-1 ${activeDateStr === d.dateStr ? 'text-[#00A698]' : 'text-slate-500'}`}>{d.dayName}</span>
                <span className="text-2xl font-bold">{d.dayNum}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Date Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-slate-600 flex items-center gap-1">
            <span className="font-bold text-slate-900">{selectedDateEvents.length} events</span> 
            <Info size={14} className="text-slate-400" /> 
            <span>op {activeDateObj.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <button className="text-sm font-semibold text-slate-700 flex items-center gap-1 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-slate-200">
            Sorteer op <ChevronDown size={16} />
          </button>
        </div>

        {/* Cards Grid for Selected Date */}
        {selectedDateEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {selectedDateEvents.map(renderEventCard)}
          </div>
        ) : (
          <div className="w-full bg-slate-50 rounded-2xl border border-slate-100 p-8 text-center mb-16">
            <Calendar className="mx-auto text-slate-300 mb-3" size={48} />
            <h3 className="text-lg font-bold text-slate-700 mb-1">Geen events gevonden</h3>
            <p className="text-slate-500">Er zijn momenteel geen club tickets beschikbaar voor deze specifieke datum.</p>
          </div>
        )}

        {/* Events of the Week Section */}
        {weekEvents.length > 0 && (
          <div className="mb-16 border-t border-slate-200 pt-10">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Events in die week</h2>
                <p className="text-slate-500 text-sm">Aankomende feesten in de 7 dagen na de geselecteerde datum.</p>
              </div>
              <Link href="/club-tickets" className="text-[#00A698] font-bold text-sm hover:underline hidden sm:block">
                Bekijk alle events
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {weekEvents.map(renderEventCard)}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link href="/club-tickets" className="inline-block border border-[#00A698] text-[#00A698] font-bold text-sm px-6 py-3 rounded-full hover:bg-[#00A698]/5">
                Bekijk alle events
              </Link>
            </div>
          </div>
        )}

        {/* Categories Section */}
        <div className="mb-12 border-t border-slate-200 pt-10">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Leukste activiteiten in Ibiza</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat, i) => (
              <button key={i} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors">
                {cat}
              </button>
            ))}
          </div>
          <button className="mt-4 text-sm font-bold text-[#00A698] hover:underline flex items-center gap-1">
            Ontdek Ibiza <ChevronRight size={16} />
          </button>
        </div>

        {/* Regions/Cities Section */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Top locaties in Ibiza</h3>
          <div className="flex flex-wrap gap-3">
            {locations.map((loc) => (
              <Link key={loc.id} href={`/locations/${loc.slug}`} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors">
                {loc.name}
              </Link>
            ))}
          </div>
          <Link href="/locations/ibiza-stad" className="mt-4 text-sm font-bold text-[#00A698] hover:underline flex items-center gap-1 w-fit">
            Ontdek Locaties <ChevronRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
