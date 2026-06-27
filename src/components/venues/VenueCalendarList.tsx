'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ExternalLink, Filter } from 'lucide-react'
import { CTEventDate } from '@/lib/clubtickets'

interface VenueCalendarListProps {
  dates: CTEventDate[];
  venueName: string;
  locale: string;
  basePath?: string;
}

export function VenueCalendarList({ dates, venueName, locale, basePath = 'club-tickets' }: VenueCalendarListProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Filter out past dates and sort chronologically
  const upcomingDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dates
      .filter(d => new Date(d.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [dates]);

  // Extract unique months for the filter
  const months = useMemo(() => {
    const uniqueMonths = new Set<string>();
    upcomingDates.forEach(d => {
      const dateObj = new Date(d.date);
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      uniqueMonths.add(monthKey);
    });
    return Array.from(uniqueMonths).sort();
  }, [upcomingDates]);

  // Format month key to readable string (e.g. "June 2026")
  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  };

  // Filter dates based on selection
  const filteredDates = useMemo(() => {
    if (selectedMonth === 'all') return upcomingDates;
    return upcomingDates.filter(d => {
      const dateObj = new Date(d.date);
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      return monthKey === selectedMonth;
    });
  }, [upcomingDates, selectedMonth]);

  if (upcomingDates.length === 0) return null;

  return (
    <section className="py-12 bg-white" id="tickets">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#1A1A1A]/10">
          <div>
            <h2 className="font-serif text-[28px] md:text-[36px] font-medium text-[#1A1A1A] tracking-tight leading-none mb-3">
              {venueName} Calendar 2026
            </h2>
            <p className="font-sans text-[#1A1A1A]/60 text-sm">
              Select a date below to book official tickets for {venueName}.
            </p>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
            <button
              onClick={() => setSelectedMonth('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-sans text-sm font-semibold transition-all ${
                selectedMonth === 'all' 
                  ? 'bg-[#1A1A1A] text-white shadow-md' 
                  : 'bg-[#FAF9F6] text-[#1A1A1A]/70 hover:bg-[#EAE8E1]'
              }`}
            >
              All Events
            </button>
            {months.map(monthKey => (
              <button
                key={monthKey}
                onClick={() => setSelectedMonth(monthKey)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-sans text-sm font-semibold transition-all ${
                  selectedMonth === monthKey 
                    ? 'bg-[#1A1A1A] text-white shadow-md' 
                    : 'bg-[#FAF9F6] text-[#1A1A1A]/70 hover:bg-[#EAE8E1]'
                }`}
              >
                {formatMonth(monthKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div className="flex flex-col gap-4">
          {filteredDates.map((event, idx) => {
            const dateObj = new Date(event.date);
            const weekday = dateObj.toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' });
            const dayNum = dateObj.toLocaleDateString(locale, { day: 'numeric', timeZone: 'UTC' });
            const monthStr = dateObj.toLocaleDateString(locale, { month: 'short', timeZone: 'UTC' });

            return (
              <div 
                key={`${event.id}-${idx}`} 
                className="group flex flex-col md:flex-row md:items-center bg-white border border-[#1A1A1A]/10 rounded-[20px] p-4 md:p-5 gap-6 shadow-sm hover:shadow-md transition-all hover:border-[#1A1A1A]/30"
              >
                {/* Date Badge */}
                <div className="flex flex-row md:flex-col items-center justify-center gap-2 md:gap-0 bg-[#FAF9F6] border border-[#1A1A1A]/5 rounded-xl p-3 min-w-[90px] shrink-0 text-center">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/50">
                    {weekday}
                  </span>
                  <span className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-none my-1">
                    {dayNum}
                  </span>
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                    {monthStr}
                  </span>
                </div>

                {/* Event Info */}
                <div className="flex-1 flex flex-col justify-center">
                  <Link href={`/${basePath}/${event.venueSlug}/${event.eventSlug}`} className="hover:text-blue-600 transition-colors">
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1A1A1A] mb-2 leading-tight">
                      {event.eventName || event.name}
                    </h3>
                  </Link>
                  {event.lineUp && (
                    <p className="font-sans text-sm text-[#1A1A1A]/60 line-clamp-2 md:line-clamp-1 leading-relaxed">
                      <span className="font-semibold text-[#1A1A1A]/80">Line-up:</span> {event.lineUp}
                    </p>
                  )}
                </div>

                {/* Pricing & CTA */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t border-[#1A1A1A]/10 pt-4 md:border-0 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/50 mb-1">
                      Tickets
                    </span>
                    <span className="font-sans text-lg font-bold text-[#1A1A1A]">
                      {event.prices ? `From ${event.prices}` : 'Available'}
                    </span>
                  </div>
                  
                  <a
                    href={event.affLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 rounded-xl font-sans text-sm font-bold shadow-sm hover:bg-[#333] hover:shadow-md transition-all hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    Buy Tickets
                    <ExternalLink size={16} className="opacity-70" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  )
}
