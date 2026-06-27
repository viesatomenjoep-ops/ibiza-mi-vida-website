'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface VenueSliderEvent {
  id: number;
  name: string;
  slug: string;
  cover?: string | null;
  logo?: string | null;
  dayOfWeek?: string; // E.g., 'MONDAY'
  venueName?: string;
}

interface VenueEventsSliderProps {
  title: string;
  events: VenueSliderEvent[];
  venueSlug: string;
  basePath: string;
  theme?: 'light' | 'blue';
}

export function VenueEventsSlider({ title, events, venueSlug, basePath, theme = 'light' }: VenueEventsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (events.length === 0) return null

  const handleNext = () => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 240 : 340
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? -240 : -340
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Determine section background based on theme
  const sectionBg = theme === 'blue' ? 'bg-[#CCE7FF]' : 'bg-[#FAF9F6]';
  const cardBg = 'bg-white';

  return (
    <section className={`overflow-hidden py-10 md:py-16 ${sectionBg}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-serif text-[28px] md:text-[36px] font-medium text-[#1A1A1A] tracking-tight leading-none">
            {title}
          </h2>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-[#BBC0F9] text-[#1A1A1A] shadow-sm flex items-center justify-center hover:bg-[#A3A9F5] transition-all"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-[#BBC0F9] text-[#1A1A1A] shadow-sm flex items-center justify-center hover:bg-[#A3A9F5] transition-all"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="w-full relative mx-auto max-w-7xl">
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />
        
        <div 
          ref={scrollRef}
          className="hide-scrollbar flex gap-4 md:gap-6 px-4 md:px-8 overflow-x-auto snap-x snap-mandatory py-2 pb-6 w-full"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {events.map((event, i) => {
            const linkHref = venueSlug ? `/${basePath}/${venueSlug}/${event.slug}` : `/${basePath}/${event.slug}`;
            return (
            <Link 
              href={linkHref} 
              key={`${event.id}-${i}`}
              className={`block snap-start shrink-0 w-[240px] md:w-[320px] rounded-[24px] ${cardBg} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group`}
            >
              <div className="flex flex-col h-full">
                {/* Top Section */}
                <div className="p-5 flex justify-between items-start">
                  <h4 className="font-sans text-sm text-[#1A1A1A]/70 uppercase tracking-wider font-semibold">
                    {event.venueName || venueSlug.replace(/-/g, ' ')}
                  </h4>
                  {event.dayOfWeek && (
                    <div className="bg-[#1A1A1A] text-white px-3 py-1 rounded-full font-sans text-xs font-bold uppercase tracking-widest">
                      {event.dayOfWeek}
                    </div>
                  )}
                </div>

                {/* Image Section */}
                <div className="relative aspect-square w-full overflow-hidden px-4">
                  <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                    <Image
                      src={event.cover || 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80'}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 240px, 320px"
                    />
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="p-5 mt-auto">
                  <h3 className="font-serif text-[20px] md:text-[24px] font-bold leading-tight text-[#1A1A1A]">
                    {event.name}
                  </h3>
                </div>
              </div>
            </Link>
            );
          })}
          <div className="shrink-0 w-4 md:w-8" />
        </div>
      </div>
    </section>
  )
}
