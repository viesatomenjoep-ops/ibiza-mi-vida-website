'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cleanHtml } from '@/lib/html-utils'

interface VenueDetailPageProps {
  club: any;
  allDates: any[];
  locale: string;
  basePath: string;
}

export function VenueDetailPage({ club, allDates, locale, basePath }: VenueDetailPageProps) {
  const imageUrl = club.cover || club.picture || '/hi-ibiza-2026/FB_IMG_1779623220486.jpg';

  const cleanDescription = club.description 
    ? cleanHtml(club.description)
    : 'Informatie over deze club.';

  // Process unique events and determine if they are "Weekly" or "More"
  const eventStats = new Map<string, { count: number, days: Set<string>, firstEvent: any }>();
  
  allDates.forEach(dateObj => {
    const dayOfWeek = new Date(dateObj.date).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { weekday: 'long', timeZone: 'UTC' }).toUpperCase();
    const eventGrp = dateObj.ct_events;
    if (!eventGrp) return;
    
    if (!eventStats.has(eventGrp.slug)) {
      eventStats.set(eventGrp.slug, { 
        count: 0, 
        days: new Set(), 
        firstEvent: {
          id: eventGrp.id,
          name: eventGrp.name,
          slug: eventGrp.slug,
          cover: eventGrp.cover || eventGrp.logo,
          logo: eventGrp.whitelogo || eventGrp.logo,
          venueName: club.name
        } 
      });
    }
    const stat = eventStats.get(eventGrp.slug)!;
    stat.count++;
    stat.days.add(dayOfWeek);
  });

  const weeklyParties: any[] = [];
  const moreParties: any[] = [];

  Array.from(eventStats.values()).forEach(stat => {
    // If it happens on mostly 1 or 2 specific days of the week, and happens multiple times, it's a Weekly Party
    const daysArray = Array.from(stat.days);
    if (stat.count >= 3 && daysArray.length <= 2) {
      weeklyParties.push({
        ...stat.firstEvent,
        dayOfWeek: daysArray[0]
      });
    } else {
      moreParties.push({
        ...stat.firstEvent,
        dayOfWeek: undefined
      });
    }
  });

  // Sort weekly parties by day of week
  const daysOrder = locale === 'nl' 
    ? ['MAANDAG', 'DINSDAG', 'WOENSDAG', 'DONDERDAG', 'VRIJDAG', 'ZATERDAG', 'ZONDAG']
    : ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    
  weeklyParties.sort((a, b) => {
    return daysOrder.indexOf(a.dayOfWeek || '') - daysOrder.indexOf(b.dayOfWeek || '');
  });

  // Refs for sliders
  const weeklyRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const scrollRail = (ref: React.RefObject<HTMLDivElement>, dir: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  // Faq state
  const faqs = [
    {
      q: `Welke avonden is ${club.name} open in 2026?`,
      a: `De weekly parties en exacte dagen komen live uit de ClubTickets API en zie je hierboven bij "Weekly parties 2026". Het programma kan per maand verschillen.`
    },
    {
      q: 'Wat kost een ticket?',
      a: 'Prijzen verschillen per party en line-up en worden live getoond. Vroeg boeken is meestal voordeliger.'
    },
    {
      q: 'Is er een dresscode?',
      a: 'De meeste Ibiza-clubs hanteren een nette-casual dresscode. Specifieke regels per party tonen we bij de ticketinformatie.'
    },
    {
      q: 'Hoe kom ik bij de club?',
      a: 'Adres en route staan in het info-blok. Vanuit Ibiza-stad en Playa den Bossa rijden \'s nachts shuttles en taxi\'s.'
    }
  ];

  return (
    <div className="theme-monaco-vip bg-[var(--color-paper)] min-h-screen text-[var(--color-ink)] pb-20 pt-0">
      
      {/* Hero Section */}
      <section className="relative h-[340px] md:h-[400px] rounded-b-[36px] overflow-hidden bg-gradient-to-br from-[#1a2e29] to-[#2C4A42] flex items-end">
        <Image
          src={imageUrl}
          alt={club.name}
          fill
          priority
          className="object-cover object-center mix-blend-overlay opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14221E]/90 via-transparent to-transparent z-10" />
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 pb-8 flex items-end gap-5 text-white">
          <div className="w-[88px] h-[88px] rounded-[22px] bg-white/95 shrink-0 flex items-center justify-center p-2 text-velvet-obsidian text-center text-xs font-bold shadow-lg">
            {club.whitelogo ? (
              <Image src={club.whitelogo} alt={`${club.name} logo`} width={72} height={72} className="object-contain filter invert" />
            ) : (
              <span>{club.name}</span>
            )}
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-2 drop-shadow-md">
              {club.name}
            </h1>
            <div className="flex gap-2 flex-wrap">
              {club.type_name && (
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                  {club.type_name}
                </span>
              )}
              {club.is_day_club !== undefined && (
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                  {club.is_day_club ? 'Daytime' : 'Night'}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick bar */}
      <div className="flex gap-2 flex-wrap -mt-[26px] relative z-30 px-4 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white shadow-md rounded-full px-5 py-3 font-bold text-sm cursor-pointer hover:bg-ibiza-mint transition-colors text-neutral-900">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/></svg>
          Ibiza, Spain
        </div>
      </div>

      {/* Weekly Parties */}
      {weeklyParties.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-6 gap-5">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2">Weekly parties 2026</div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold">Vaste avonden in {club.name}</h2>
              </div>
              <div className="flex gap-2 shrink-0 hidden md:flex">
                <button onClick={() => scrollRail(weeklyRef, -1)} className="w-11 h-11 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-ibiza-green transition-colors text-neutral-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button onClick={() => scrollRail(weeklyRef, 1)} className="w-11 h-11 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-ibiza-green transition-colors text-neutral-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            <div ref={weeklyRef} className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
              {weeklyParties.map((party, i) => (
                <Link href={`/${locale}/${basePath}/${club.slug}/${party.slug}`} key={i} className="flex-none w-[260px] md:w-[280px] bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group snap-start">
                  <div className="h-[230px] relative bg-gradient-to-br from-ibiza-mint to-ibiza-blue overflow-hidden">
                    {party.cover ? (
                      <Image src={party.cover} alt={party.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 text-xs font-semibold text-center p-4">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-1"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 15l5-5 4 4 3-3 6 6"/></svg>
                        Poster uit API
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold z-10 text-neutral-900">{club.name}</span>
                    <span className="absolute top-3 right-3 bg-ibiza-green px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase z-10 text-neutral-900">{party.dayOfWeek}</span>
                  </div>
                  <div className="p-4 text-neutral-900">
                    <h3 className="text-lg font-bold leading-tight mb-2 truncate text-neutral-900">{party.name}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">TICKETS</div>
                      <button className="bg-ibiza-mint hover:bg-ibiza-green text-neutral-900 font-bold text-xs px-4 py-2 rounded-full transition-colors">Tickets</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event List (All Events) */}
      <section className="py-12 bg-white/50 text-neutral-900">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex items-end justify-between mb-6 gap-5">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-2">Alle events</div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900">Agenda {club.name}</h2>
              </div>
           </div>
           
           <div className="flex flex-col gap-3">
             {allDates.slice(0, 10).map((date, i) => (
                <Link href={`/${locale}/${basePath}/${club.slug}/${date.ct_events?.slug || 'event'}`} key={i} className="bg-white rounded-2xl p-3 md:p-4 border border-black/5 flex items-center gap-4 hover:shadow-md transition-shadow group">
                   <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden bg-ibiza-mint relative">
                     {date.ct_events?.cover && <Image src={date.ct_events.cover} alt={date.name || 'Event'} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="text-neutral-500 text-xs font-bold tracking-wider uppercase mb-1">
                         {new Date(date.date).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold truncate text-neutral-900">{date.name}</h3>
                   </div>
                   <div className="shrink-0 hidden md:block">
                      <button className="bg-ibiza-green text-neutral-900 font-bold text-sm px-5 py-2.5 rounded-full hover:brightness-95 transition-all">
                        Buy Tickets
                      </button>
                   </div>
                </Link>
             ))}
           </div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 items-start">
            <div className="text-velvet-obsidian/80 text-lg leading-relaxed">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-velvet-obsidian tracking-tight mb-4">Over {club.name}</h2>
              <div dangerouslySetInnerHTML={{ __html: cleanDescription }} className="prose prose-lg mb-6" />
              
              <a href="https://wa.me/31612345678" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-ibiza-green text-velvet-obsidian font-bold text-sm px-6 py-3 rounded-full hover:brightness-95 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z"/></svg>
                Gastenlijst & VIP via WhatsApp
              </a>
            </div>
            
            <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Praktische info</h3>
              
              <div className="flex items-center gap-3 py-3 border-b border-black/5 text-sm">
                <div className="w-9 h-9 rounded-xl bg-ibiza-mint flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/></svg>
                </div>
                <span>Locatie</span>
                <span className="font-bold ml-auto text-velvet-obsidian">Ibiza, Spain</span>
              </div>
              
              <div className="flex items-center gap-3 py-3 border-b border-black/5 text-sm">
                <div className="w-9 h-9 rounded-xl bg-ibiza-mint flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>
                </div>
                <span>Openingstijden</span>
                <span className="font-bold ml-auto text-velvet-obsidian">{club.is_day_club ? 'Daytime' : 'Night'}</span>
              </div>
              
              <div className="flex items-center gap-3 py-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-ibiza-mint flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/></svg>
                </div>
                <span>Genre</span>
                <span className="font-bold ml-auto text-velvet-obsidian">{club.type_name || 'Electronic'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-12 bg-ibiza-sand/30">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <div className="text-xs font-bold tracking-widest uppercase text-ibiza-blue mb-2">Veelgestelde vragen</div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Over {club.name}</h2>
          </div>
          
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white border border-black/5 rounded-2xl overflow-hidden transition-all open:shadow-sm" open={i === 0}>
                <summary className="flex items-center justify-between gap-4 p-5 font-bold cursor-pointer list-none [&::-webkit-details-marker]:hidden text-neutral-950">
                  {faq.q}
                  <div className="w-7 h-7 rounded-full bg-ibiza-mint shrink-0 flex items-center justify-center transition-transform group-open:rotate-45 group-open:bg-ibiza-green">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                </summary>
                <div className="px-5 pb-5 text-neutral-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
