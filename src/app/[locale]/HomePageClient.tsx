'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronRight, Calendar, MapPin, Flame, Ticket, Headphones, Ship, Anchor, Map as MapIcon, Sailboat, Wine, Car, ClipboardList, Lightbulb, Newspaper, Tag } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import type { CTEventDate, CTVenue } from '@/lib/clubtickets';
import { locations } from '@/lib/locations';
import { WaveTop, WaveBottom, WaveAsym } from '@/components/ui/Waves';

// 1. PRICE PARSER
function parsePrice(priceStr?: string): number {
  if (!priceStr) return 50;
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

// 3. 12 CATEGORIES DEFINITION WITH THEMES
const ALL_CATEGORIES = [
  { id: 'deals', slug: 'deals-of-the-day', dictTitleKey: 'cat_deals_title', dictDescKey: 'cat_deals_desc', label: 'Deals of the Day', theme: 'theme-monaco-breeze', icon: <Flame />, wave: 'var(--wave-fill)', 
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1920',
    desc: 'Ontdek de scherpste aanbiedingen en last-minute kortingen voor de heetste events van vandaag.' },
  { id: 'clubtickets', slug: 'club-tickets', dictTitleKey: 'cat_clubtickets_title', dictDescKey: 'cat_clubtickets_desc', label: 'Club Tickets', theme: 'theme-monaco-vip', icon: <Ticket />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920',
    desc: 'Beleef de beste clubavonden op Ibiza. Koop je tickets veilig en snel en sla de wachtrijen over.' },
  { id: 'artiesten', slug: 'artists', dictTitleKey: 'cat_artists_title', dictDescKey: 'cat_artists_desc', label: 'Artiesten', theme: 'theme-monaco-vip', icon: <Headphones />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920',
    desc: 'Ontdek welke wereldberoemde DJ\'s deze zomer op Ibiza draaien. Bekijk hun line-ups en boek direct je tickets.' },
  { id: 'boatparties', slug: 'boat-parties', dictTitleKey: 'cat_boatparties_title', dictDescKey: 'cat_boatparties_desc', label: 'Bootfeesten', theme: 'theme-monaco-water', icon: <Ship />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1920',
    desc: 'Dans op de golven met de beste dj\'s tijdens een onvergetelijke zonsondergang op de Middellandse Zee.' },
  { id: 'privateboat', slug: 'private-boat-charters', dictTitleKey: 'cat_privateboat_title', dictDescKey: 'cat_privateboat_desc', label: 'Private Boat Charters', theme: 'theme-monaco-water', icon: <Anchor />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1567606403063-832128ce3a00?q=80&w=1920',
    desc: 'Huur je eigen privéjacht voor een exclusieve ervaring op zee. Perfect voor vriendengroepen en speciale gelegenheden.' },
  { id: 'formentera', slug: 'formentera-boat-trips', dictTitleKey: 'cat_formentera_title', dictDescKey: 'cat_formentera_desc', label: 'Formentera Trips', theme: 'theme-monaco-water', icon: <MapIcon />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1601004146039-49339e723cc5?q=80&w=1920',
    desc: 'Ontdek het adembenemende zustereiland Formentera. Helderblauw water en witte zandstranden wachten op je.' },
  { id: 'vipcatamaran', slug: 'vip-catamaran', dictTitleKey: 'cat_vipcatamaran_title', dictDescKey: 'cat_vipcatamaran_desc', label: 'VIP Catamaran', theme: 'theme-monaco-water', icon: <Sailboat />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=1920',
    desc: 'Ervaar ultieme luxe op een spectaculaire catamaran, compleet met VIP-service, drankjes en entertainment.' },
  { id: 'drankpakketten', slug: 'drink-packages', dictTitleKey: 'cat_drinks_title', dictDescKey: 'cat_drinks_desc', label: 'Drankpakketten', theme: 'theme-monaco-sand', icon: <Wine />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1574096079513-d8259312b78a?q=80&w=1920',
    desc: 'Maak je clubavond compleet met onze premium drankpakketten en exclusieve flessenservice.' },
  { id: 'carrental', slug: 'car-scooter-rental', dictTitleKey: 'cat_carrental_title', dictDescKey: 'cat_carrental_desc', label: 'Car & Scooter Rental', theme: 'theme-monaco-sand', icon: <Car />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1582046830509-0d2875b2b005?q=80&w=1920',
    desc: 'Verken het eiland in je eigen tempo. Huur betrouwbaar en snel een auto of scooter zonder gedoe.' },
  { id: 'gastenlijst', slug: 'guestlist', dictTitleKey: 'cat_guestlist_title', dictDescKey: 'cat_guestlist_desc', label: 'Gastenlijst', theme: 'theme-monaco-vip', icon: <ClipboardList />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920',
    desc: 'Meld je aan voor de exclusieve gastenlijsten van de beste feesten en profiteer van VIP-voordelen.' },
  { id: 'ibizatips', slug: 'tips', dictTitleKey: 'cat_tips_title', dictDescKey: 'cat_tips_desc', label: 'Ibiza Tips', theme: 'theme-monaco-breeze', icon: <Lightbulb />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=1920',
    desc: 'Onze insider tips en hotspots. Ontdek de verborgen parels, beste restaurants en mooiste stranden.' },
  { id: 'blog', slug: 'blog', dictTitleKey: 'cat_blog_title', dictDescKey: 'cat_blog_desc', label: 'Blog', theme: 'theme-monaco-breeze', icon: <Newspaper />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1510444589-9807fa7de323?q=80&w=1920',
    desc: 'Lees de laatste nieuwtjes, trends en verhalen over het partyleven en de cultuur op Ibiza.' },
  { id: 'freediscount', slug: 'free-discount-ibiza', dictTitleKey: 'cat_free_title', dictDescKey: 'cat_free_desc', label: 'Free & Discount Ibiza', theme: 'theme-monaco-breeze', icon: <Tag />, wave: 'var(--wave-fill)',
    imageUrl: 'https://images.unsplash.com/photo-1558522195-e1201b090344?q=80&w=1920',
    desc: 'Bespaar op je vakantie met onze gratis toegangen, kortingscodes en speciale aanbiedingen.' }
];

function getCategoryForEvent(event: CTEventDate, venues: CTVenue[]): string {
  if (!venues || venues.length === 0) return 'clubtickets';
  const venue = venues.find(v => v.slug === event.venueSlug);
  if (!venue) return 'clubtickets';
  const typeSlug = venue.type?.slug;
  if (typeSlug === 'boat') return 'boatparties';
  if (typeSlug === 'formentera-day-trip') return 'formentera';
  if (venue.name?.toLowerCase().includes('catamaran')) return 'vipcatamaran';
  return 'clubtickets'; 
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
  artists = [],
  venues = []
}: { 
  allEventDates?: CTEventDate[], 
  dict?: any, 
  locale?: string,
  artists?: any[],
  venues?: CTVenue[]
}) {
  const { addToCart, openDrawer } = useCart();
  const generatedDates = useMemo(() => generateDatesUntilOct31(locale, dict), [locale, dict]);
  
  const [periodMode, setPeriodMode] = useState<PeriodMode>('day');
  const [activeDateStr, setActiveDateStr] = useState<string>(generatedDates[0]?.dateStr || '');
  const [activeWeek, setActiveWeek] = useState<number>(generatedDates[0]?.weekNum || 1);
  const [activeMonth, setActiveMonth] = useState<number>(generatedDates[0]?.dateObj.getMonth() || 0);

  const topChoicesRef = React.useRef<HTMLDivElement>(null);
  const artistsRef = React.useRef<HTMLDivElement>(null);

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollTopChoices = (direction: 'left' | 'right') => {
    if (topChoicesRef.current) {
      const { scrollLeft, clientWidth } = topChoicesRef.current;
      const scrollAmount = clientWidth * 0.8;
      topChoicesRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollArtists = (direction: 'left' | 'right') => {
    if (artistsRef.current) {
      const { scrollLeft, clientWidth } = artistsRef.current;
      const scrollAmount = clientWidth * 0.8;
      artistsRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  const weeks = useMemo(() => {
    const map = new Map<number, { weekNum: number, label: string, startObj: Date }>();
    generatedDates.forEach(d => {
      if (!map.has(d.weekNum)) map.set(d.weekNum, { weekNum: d.weekNum, label: `Week ${d.weekNum}`, startObj: d.dateObj });
    });
    return Array.from(map.values());
  }, [generatedDates]);

  const months = useMemo(() => {
    const map = new Map<number, { monthNum: number, label: string }>();
    generatedDates.forEach(d => {
      const m = d.dateObj.getMonth();
      if (!map.has(m)) map.set(m, { monthNum: m, label: `${d.monthName} ${d.year}` });
    });
    return Array.from(map.values());
  }, [generatedDates]);

  const selectedEvents = useMemo(() => {
    return allEventDates.filter(e => {
      const eDate = new Date(e.date);
      if (periodMode === 'day') return e.date === activeDateStr;
      if (periodMode === 'week') return getWeekNumber(eDate) === activeWeek;
      if (periodMode === 'month') return eDate.getMonth() === activeMonth;
      return false;
    });
  }, [allEventDates, periodMode, activeDateStr, activeWeek, activeMonth]);

  const top30Events = useMemo(() => {
    const uniqueCategories = new Set<string>();
    const top30: CTEventDate[] = [];
    for (const e of selectedEvents) {
      if (top30.length >= 30) break;
      const cat = getCategoryForEvent(e, venues);
      if (!uniqueCategories.has(cat)) {
        uniqueCategories.add(cat);
        top30.push(e);
      }
    }
    for (const e of selectedEvents) {
      if (top30.length >= 30) break;
      if (!top30.includes(e)) top30.push(e);
    }
    return top30;
  }, [selectedEvents]);

  const eventsByCategory = useMemo(() => {
    const grouped: Record<string, CTEventDate[]> = {};
    ALL_CATEGORIES.forEach(c => grouped[c.id] = []);
    const remainingEvents = selectedEvents.filter(e => !top30Events.includes(e));
    remainingEvents.forEach(e => {
      const cat = getCategoryForEvent(e, venues);
      if (grouped[cat]) grouped[cat].push(e);
    });
    // For Deals of the day, add some high profile ones manually for demo logic
    if (top30Events.length > 0 && grouped['deals']) {
        grouped['deals'] = top30Events.slice(0, 4);
    }
    return grouped;
  }, [selectedEvents, top30Events]);

  const handleBook = (event: CTEventDate) => {
    const localePrefix = ['en', 'nl', 'de', 'es', 'fr'].includes(locale) ? `/${locale}` : '';
    window.location.href = `${localePrefix}/club-tickets/${event.venueSlug}/${event.eventSlug}`;
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
    const dateFormatted = dateObj.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
    
    return (
      <div key={`${event.id}-${event.date}`} className={`flex-shrink-0 snap-center flex flex-col bg-[var(--color-card)] border border-[var(--color-line)] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer ${isFeatured ? 'shadow-md' : 'shadow-sm'} ${isCompact ? 'w-[90vw] md:w-[350px]' : 'w-full'}`} onClick={() => handleBook(event)}>
        <div className={`relative w-full overflow-hidden bg-black/10 ${isCompact ? 'h-32' : (isFeatured ? 'h-64' : 'h-48')}`}>
          {(event.eventCover || event.eventLogo || event.venueCover || event.venueLogo) ? (
            <Image 
              src={event.eventCover || event.eventLogo || event.venueCover || event.venueLogo || ''} 
              alt={event.eventName || event.name} 
              fill 
              priority={isFeatured}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-slate)]">
              <Star size={48} />
            </div>
          )}
          <div className="absolute top-3 right-3 bg-[var(--color-paper)]/90 backdrop-blur-md text-[var(--color-ink)] px-2.5 py-1 rounded-lg text-xs font-bold shadow-md border border-[var(--color-line)] flex items-center gap-1.5">
            <Calendar size={12} className="text-[var(--color-sea)]" />
            {dateFormatted}
          </div>
        </div>
        <div className={`flex-1 flex flex-col ${isCompact ? 'p-3' : 'p-5'}`}>
          <h3 className={`font-bold text-[var(--color-ink)] leading-tight mb-1 group-hover:text-[var(--color-sea)] transition-colors line-clamp-2 ${isCompact ? 'text-base' : (isFeatured ? 'text-xl' : 'text-lg')}`}>
            {event.eventName || event.name}
          </h3>
          <p className="text-xs font-semibold text-[var(--color-slate)] mb-2 flex items-center gap-1">
            <MapPin size={12} /> {event.venueName || 'Ibiza'}
          </p>
          {!isCompact && (
            <ul className="space-y-1.5 mb-4 text-sm text-[var(--color-slate)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-sea)] font-bold">✓</span>
                <span className="line-clamp-1">{formatLineUp(event.lineUp)}</span>
              </li>
            </ul>
          )}
          <div className={`mt-auto flex justify-between items-end border-[var(--color-line)] ${isCompact ? 'pt-2 mt-2 border-t' : 'pt-4 border-t'}`}>
            <div className="flex items-center gap-1 text-sm font-bold text-[var(--color-slate)]">
              <Star size={12} fill="var(--color-sea)" className="text-[var(--color-sea)]" />
              <span className="text-xs">4.9</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[var(--color-slate)] uppercase tracking-wide">{dict.from || 'Vanaf'}</div>
              <div className={`font-bold text-[var(--color-ink)] ${isCompact ? 'text-base' : 'text-xl'}`}>
                € {priceNum > 0 ? priceNum.toFixed(2) : '50.00'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans antialiased pb-20">
      
      {/* Hero (Monaco Soft Theme) */}
      <div className="relative w-full h-[60vh] md:h-[70vh] theme-monaco-water bg-[var(--color-paper)] flex items-center justify-center overflow-hidden snap-start">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1920')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-paper)] via-transparent to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[var(--color-ink)] font-display mb-6 drop-shadow-lg leading-tight">
            {dict.hero_title || 'Ontdek het beste van Ibiza'}
          </h1>
          <p className="text-lg md:text-2xl text-[var(--color-ink)]/90 font-medium mb-10 max-w-2xl mx-auto drop-shadow-md">
            {dict.hero_subtitle || 'Boek de dikste feesten, mooiste boottochten en leukste excursies voor jouw vakantie.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => scrollToCategory('clubtickets')} className="bg-[var(--color-sea)] text-[var(--color-paper)] px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl">
              {dict.cat_discover || 'Ontdek'} {dict.cat_clubtickets_title || 'Club Tickets'}
            </button>
            <button onClick={() => scrollToCategory('boatparties')} className="bg-[var(--color-card)] text-[var(--color-ink)] px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl">
              {dict.cat_view || 'Bekijk'} {dict.cat_boatparties_title || 'Bootfeesten'}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full relative z-20">
        
        {/* Sub-Navbars for Category quick-links */}
        <div className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-[68px] z-50 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="max-w-7xl mx-auto flex items-center p-2 gap-2">
            {ALL_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => scrollToCategory(cat.id)} className="px-4 py-2 text-xs md:text-sm font-semibold rounded-full border border-slate-200 hover:border-[#4ba296] hover:text-[#4ba296] transition-all bg-white shadow-sm flex items-center gap-2">
                <span className="w-4 h-4 flex items-center justify-center">{cat.icon}</span> {dict[cat.dictTitleKey] || cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Selector */}
        <div className="w-full bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto flex border-b border-slate-100">
            <button onClick={() => setPeriodMode('day')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${periodMode === 'day' ? 'border-[#4ba296] text-[#4ba296]' : 'border-transparent text-slate-500'}`}>{dict.tab_day}</button>
            <button onClick={() => setPeriodMode('week')} className={`flex-1 py-3 text-sm font-bold border-b-2 border-l border-r border-slate-100 ${periodMode === 'week' ? 'border-b-[#4ba296] text-[#4ba296]' : 'border-b-transparent text-slate-500'}`}>{dict.tab_week}</button>
            <button onClick={() => setPeriodMode('month')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${periodMode === 'month' ? 'border-[#4ba296] text-[#4ba296]' : 'border-transparent text-slate-500'}`}>{dict.tab_month}</button>
          </div>
          <div className="max-w-7xl mx-auto p-4 flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {periodMode === 'day' && generatedDates.map((d, i) => (
              <button key={`day-${i}`} onClick={() => setActiveDateStr(d.dateStr)} className={`min-w-[80px] flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${activeDateStr === d.dateStr ? 'border-[#4ba296] bg-[#4ba296] text-white shadow-md scale-105' : 'border-slate-200 bg-white text-slate-600'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider mb-1">{d.dayName}</span>
                <span className="text-xl font-black">{d.dayNum}</span>
                <span className="text-[10px] font-medium mt-1">{d.monthName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories Sections */}
        {ALL_CATEGORIES.map((cat, index) => {
          const events = eventsByCategory[cat.id] || [];
          const hasEvents = events.length > 0;
          const nextCat = ALL_CATEGORIES[index + 1];

          return (
            <section key={cat.id} id={cat.id} className={`${cat.theme} bg-[var(--color-paper)] relative snap-start`}>
              {/* If first section, give some padding */}
              {index === 0 && <div className="pt-8"></div>}
              
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
                <div className={`flex flex-col ${hasEvents ? 'lg:flex-row' : 'md:flex-row items-center justify-center'} gap-8 lg:gap-12`}>
                  
                  {/* Left Column: Visual Hero Block */}
                  <div className={`w-full ${hasEvents ? 'lg:w-1/3' : 'md:w-1/2 max-w-2xl'} flex flex-col`}>
                    <div className="relative w-full h-[400px] md:h-[480px] rounded-[32px] overflow-hidden shadow-2xl group">
                      <Image 
                        src={cat.imageUrl} 
                        alt={cat.label} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                      
                      <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                        <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center text-white mb-5 border border-white/30 shadow-lg">
                          {cat.icon}
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white font-display mb-4 leading-tight drop-shadow-md">
                          {dict[cat.dictTitleKey] || cat.label}
                        </h2>
                        <h3 className="text-xl md:text-2xl font-bold text-white/90 mb-4 font-serif">
                          {dict.cat_discover || 'Ontdek'} {dict[cat.dictTitleKey] || cat.label}
                        </h3>
                        <p className="text-base text-white/80 font-medium leading-relaxed drop-shadow-sm mb-6 max-w-sm hidden md:block">
                          {dict[cat.dictDescKey] || cat.desc}
                        </p>
                        <p className="text-base text-white/80 font-medium leading-relaxed drop-shadow-sm mb-8 max-w-sm">
                          {dict.cat_view_all_info || 'Bekijk alle informatie en mogelijkheden voor'} {dict[cat.dictTitleKey] || cat.label} {dict.cat_on_our_special_page || 'op onze speciale pagina.'}
                        </p>
                        <div>
                          <Link href={`/${locale}/${cat.slug}`} className="inline-block px-8 py-4 bg-white/20 hover:bg-white text-white hover:text-[var(--color-ink)] backdrop-blur-md border border-white/40 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            {dict.cat_view || 'Bekijken'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Events Grid OR Artists Slider */}
                  {(hasEvents || cat.id === 'artiesten') && (
                    <div className="w-full lg:w-2/3 flex flex-col justify-center">
                      
                      {cat.id === 'artiesten' ? (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-[var(--color-ink)] font-display">{dict.cat_top_artists || 'Top Artiesten'}</h3>
                            <Link href={`/${locale}/${cat.slug}`} className="text-[var(--color-sea)] font-bold hover:brightness-125 transition-colors hidden sm:flex items-center gap-1">
                              {dict.cat_view_all || 'Bekijk alle'} artiesten <ChevronRight size={16} />
                            </Link>
                          </div>
                          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide">
                            {artists && artists.slice(0, 10).map(artist => (
                              <Link key={artist.id} href={`/${locale}/artists/${artist.slug}`} className="snap-center flex-shrink-0 w-40 md:w-48 group flex flex-col items-center">
                                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden relative mb-4 border-4 border-[var(--color-card)] shadow-lg group-hover:border-[var(--color-sea)] transition-all duration-300 group-hover:scale-105">
                                  <Image src={artist.cover || artist.logo || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920'} alt={artist.name} fill className="object-cover" />
                                </div>
                                <h4 className="text-center font-bold text-lg text-[var(--color-ink)] group-hover:text-[var(--color-sea)] transition-colors">{artist.name}</h4>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-[var(--color-ink)] font-display">{dict.cat_featured || 'Uitgelicht'}</h3>
                            <Link href={`/${locale}/${cat.slug}`} className="text-[var(--color-sea)] font-bold hover:brightness-125 transition-colors hidden sm:flex items-center gap-1">
                              {dict.cat_view_all || 'Bekijk alles'} <ChevronRight size={16} />
                            </Link>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                            {events.slice(0, 4).map(e => renderEventCard(e, false))}
                          </div>
                          <Link href={`/${locale}/${cat.slug}`} className="mt-6 text-[var(--color-sea)] font-bold hover:brightness-125 transition-colors sm:hidden flex items-center gap-1 justify-center">
                            {dict.cat_view_all || 'Bekijk alles'} <ChevronRight size={16} />
                          </Link>
                        </>
                      )}

                    </div>
                  )}

                </div>
              </div>
              
              {/* Wave transition to next section */}
              {nextCat && <WaveAsym fill={`var(--color-paper)`} className={`text-${nextCat.theme} bg-[var(--color-paper)]`} />}
            </section>
          );
        })}

        {/* Regions/Cities Section (Using info theme) */}
        <section className="theme-monaco-breeze bg-[var(--color-paper)] py-16 snap-start">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h3 className="text-3xl md:text-5xl font-black text-[var(--color-ink)] mb-8 font-display">{dict.home_explore_locations || 'Ontdek de top locaties'}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {locations.map((loc) => (
                <Link key={loc.id} href={`/${locale}/locations/${loc.slug}`} className="group relative h-40 rounded-2xl overflow-hidden flex flex-col justify-end p-5 border border-[var(--color-line)] shadow-lg hover:shadow-2xl transition-all">
                  <Image src={loc.imageUrl} alt={loc.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-card)]/90 via-black/40 to-transparent" />
                  <h4 className="relative z-10 font-black text-[var(--color-ink)] text-lg md:text-xl drop-shadow-md">{loc.name}</h4>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
