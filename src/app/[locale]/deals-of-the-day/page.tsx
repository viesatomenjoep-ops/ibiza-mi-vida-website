import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Tag, ChevronRight, Music } from 'lucide-react'
import { CSSClock } from '@/components/ui/CSSClock'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Deals of the Day | Ibiza mi vida',
  description: 'Find the cheapest club tickets and best deals for Ibiza boat parties and events.',
}

function parsePrice(priceStr?: string): number {
  if (!priceStr) return 50;
  const match = priceStr.match(/\d+([.,]\d+)?/);
  if (match) {
    return parseFloat(match[0].replace(',', '.'));
  }
  return 50;
}

export default async function DealsPage({ params }: { params: { locale: string } }) {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Fetch Today's events
  const { data: todayDbEvents } = await supabase
    .from('ct_dates')
    .select('*, ct_events(name, slug, logo, cover), ct_venues(name, slug, logo, whitelogo)')
    .eq('date', todayStr);

  // 2. Fetch Upcoming events
  const { data: upcomingDbEvents } = await supabase
    .from('ct_dates')
    .select('*, ct_events(name, slug, logo, cover), ct_venues(name, slug, logo, whitelogo)')
    .gt('date', todayStr)
    .order('date', { ascending: true })
    .limit(40);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const localeMap: Record<string, string> = { 'nl': 'nl-NL', 'de': 'de-DE', 'es': 'es-ES' };
    return dateObj.toLocaleDateString(localeMap[params.locale] || 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const getTodayFormatted = () => {
    const localeMap: Record<string, string> = { 'nl': 'nl-NL', 'de': 'de-DE', 'es': 'es-ES' };
    return new Date().toLocaleDateString(localeMap[params.locale] || 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const todayEvents = (todayDbEvents || []).map(d => ({
    ...d,
    priceNum: parsePrice(d.prices)
  }));

  const upcomingEvents = (upcomingDbEvents || []).map(d => ({
    ...d,
    priceNum: parsePrice(d.prices)
  }));

  return (
    <div className="theme-monaco-vip bg-[var(--color-paper)] text-[var(--color-ink)] min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="crumb mb-6 flex items-center gap-1.5 text-xs text-white/50">
          <Link href={`/${params.locale}`} className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} className="opacity-50" />
          <span className="text-white font-semibold">Deals of the Day</span>
        </div>

        {/* Hero title */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-6xl font-black font-serif text-white leading-tight drop-shadow-md mb-3 uppercase">
            Deals of the Day
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl">
            {params.locale === 'nl' 
              ? 'Mis vandaag geen enkele beat. Ontdek alle muziekevenementen en deals die vandaag op het eiland plaatsvinden.' 
              : 'Don\'t miss a beat today. Discover all music events and deals happening on the island right now.'}
          </p>
        </div>

        {/* Real-time ticking Clock date banner */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <CSSClock />
            <div>
              <small className="text-[10px] font-black uppercase tracking-widest text-ibiza-green block mb-0.5">
                {params.locale === 'nl' ? 'Live Tijd & Datum' : 'Live Time & Date'}
              </small>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white capitalize leading-tight">
                {getTodayFormatted()}
              </h2>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-ibiza-green/20 border border-ibiza-green/30 text-ibiza-green px-4.5 py-2 rounded-full font-bold text-xs tracking-wider uppercase shrink-0">
            <Tag size={14} /> {params.locale === 'nl' ? 'Vandaag op Ibiza' : 'Today in Ibiza'}
          </div>
        </div>

        {/* SECTION 1: TODAY EVENTS */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-ibiza-green animate-ping shrink-0" />
            <h2 className="text-xl md:text-2xl font-serif font-black text-white uppercase tracking-wide">
              {params.locale === 'nl' ? 'Vandaag op de agenda' : 'Happening Today'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {todayEvents.length === 0 ? (
              <div className="col-span-full text-center py-12 text-white/50 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30 text-ibiza-green" />
                <p className="font-semibold text-sm">
                  {params.locale === 'nl' 
                    ? 'Geen geplande events meer voor vandaag. Bekijk aankomende deals hieronder!' 
                    : 'No more events scheduled for today. Check upcoming deals below!'}
                </p>
              </div>
            ) : (
              todayEvents.map((deal) => {
                const venue = deal.ct_venues;
                const event = deal.ct_events;
                const image = event?.cover || event?.logo || venue?.cover;
                const logoSrc = venue?.whitelogo;

                return (
                  <Link 
                    href={`/${params.locale}/club-tickets/${venue?.slug || 'club'}/${event?.slug || 'event'}`}
                    key={deal.id}
                    className="bg-white/5 hover:bg-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl border border-white/10 hover:border-ibiza-green/60 transition-all duration-300 group flex flex-col hover:scale-[1.02]"
                  >
                    <div className="h-48 relative bg-[#0D0509] overflow-hidden shrink-0">
                      {image ? (
                        <Image src={image} alt={deal.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                          <Music className="w-12 h-12 text-white/20" />
                        </div>
                      )}
                      
                      {/* Price badge */}
                      <div className="absolute top-4 right-4 bg-ibiza-green text-velvet-obsidian font-black text-sm px-3.5 py-1.5 rounded-xl shadow-lg transform rotate-3">
                        €{deal.priceNum.toFixed(0)}
                      </div>

                      {/* Today indicator */}
                      <div className="absolute top-4 left-4 bg-red-500 text-white font-bold text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-lg shadow-md">
                        {params.locale === 'nl' ? 'Vandaag' : 'Today'}
                      </div>

                      {/* Unified Logo Overlay Badge */}
                      {logoSrc && (
                        <div className="absolute bottom-3 left-3 w-12 h-12 rounded-2xl bg-white border border-white/20 p-1.5 flex items-center justify-center shadow-lg z-10">
                          <img 
                            src={logoSrc} 
                            alt="" 
                            style={{ filter: !['o-beach-ibiza', 'playa-soleil', 'bambuku-ibiza'].includes(venue?.slug || '') ? 'brightness(0)' : 'none' }}
                            className="object-contain max-w-full max-h-full" 
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1 text-white">
                      <h3 className="text-lg font-bold text-white leading-snug mb-1 group-hover:text-ibiza-green transition-colors line-clamp-2">
                        {deal.name}
                      </h3>
                      <div className="text-xs font-semibold text-white/50 flex items-center gap-1.5 mb-4 mt-auto pt-3">
                        <MapPin size={14} className="text-white/40" /> {venue?.name || 'Ibiza'}
                      </div>
                      
                      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                        <span className="font-bold text-white/40">Official Partner</span>
                        <span className="text-ibiza-green font-bold group-hover:translate-x-1 transition-transform">
                          Tickets &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* SECTION 2: UPCOMING EVENTS */}
        <div>
          <div className="flex items-center gap-3 mb-6 border-t border-white/5 pt-10">
            <Calendar className="w-5 h-5 text-white/40 shrink-0" />
            <h2 className="text-xl md:text-2xl font-serif font-black text-white uppercase tracking-wide">
              {params.locale === 'nl' ? 'Aankomende budget deals' : 'Upcoming Budget Deals'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcomingEvents.map((deal) => {
              const venue = deal.ct_venues;
              const event = deal.ct_events;
              const image = event?.cover || event?.logo || venue?.cover;
              const logoSrc = venue?.whitelogo;

              return (
                <Link 
                  href={`/${params.locale}/club-tickets/${venue?.slug || 'club'}/${event?.slug || 'event'}`}
                  key={deal.id}
                  className="bg-white/5 hover:bg-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl border border-white/10 hover:border-ibiza-green/60 transition-all duration-300 group flex flex-col hover:scale-[1.02]"
                >
                  <div className="h-48 relative bg-[#0D0509] overflow-hidden shrink-0">
                    {image ? (
                      <Image src={image} alt={deal.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                        <Music className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                    
                    {/* Price badge */}
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black text-sm px-3.5 py-1.5 rounded-xl shadow-lg">
                      €{deal.priceNum.toFixed(0)}
                    </div>

                    {/* Unified Logo Overlay Badge */}
                    {logoSrc && (
                      <div className="absolute bottom-3 left-3 w-12 h-12 rounded-2xl bg-white border border-white/20 p-1.5 flex items-center justify-center shadow-lg z-10">
                        <img 
                          src={logoSrc} 
                          alt="" 
                          style={{ filter: !['o-beach-ibiza', 'playa-soleil', 'bambuku-ibiza'].includes(venue?.slug || '') ? 'brightness(0)' : 'none' }}
                          className="object-contain max-w-full max-h-full" 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1 text-white">
                    <div className="text-ibiza-green text-[10px] font-black tracking-widest uppercase mb-1.5">
                      {formatDate(deal.date)}
                    </div>
                    <h3 className="text-lg font-bold text-white leading-snug mb-1 group-hover:text-ibiza-green transition-colors line-clamp-2">
                      {deal.name}
                    </h3>
                    <div className="text-xs font-semibold text-white/50 flex items-center gap-1.5 mb-4 mt-auto pt-3">
                      <MapPin size={14} className="text-white/40" /> {venue?.name || 'Ibiza'}
                    </div>
                    
                    <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                      <span className="font-bold text-white/40">Official Partner</span>
                      <span className="text-white font-bold group-hover:translate-x-1 transition-transform">
                        Tickets &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
