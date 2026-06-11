'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Check, ArrowRight, ChevronRight, Compass, Ticket, Anchor, Sparkles, Navigation, Car, Users } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { fallbackVenues, dealsOfTheDay, artistsData, boatCharters, boatParties } from '@/data/mockData';

export default function HomePageClient() {
  const { addToCart, openDrawer } = useCart();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const accentColor = '#FF4E00'; // Ibiza Orange

  // Filter & Search calculation
  const filteredVenues = useMemo(() => {
    if (!searchQuery) return fallbackVenues;
    return fallbackVenues.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleClaimDeal = (deal: any) => {
    const numericPrice = parseFloat(deal.discountPrice.replace(/[^0-9.]/g, '')) || 0;
    addToCart({
      serviceId: deal.id,
      title: deal.title,
      price: numericPrice,
      image: deal.image,
      date: 'Today'
    });
    // Tiny delay to let react state update before opening drawer
    setTimeout(() => openDrawer(), 50);
  };

  return (
    <div id="ibiza-root-view" className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col justify-between selection:bg-orange-600 selection:text-white antialiased pt-20">
      
      {/* Top Section with Video Background */}
      <div className="relative w-full overflow-hidden">
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          poster="https://res.cloudinary.com/daj1lyfgk/video/upload/q_auto,f_auto,so_30,du_30,w_1920/v1781127267/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p_bqyeg4.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen scale-105 pointer-events-none"
          src="https://res.cloudinary.com/daj1lyfgk/video/upload/q_auto:good,f_auto,so_30,du_30,w_1920/v1781127267/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p_bqyeg4.mp4"
        />
        
        {/* Gradients for smooth blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-[#0A0A0A]/60 to-[#0A0A0A] pointer-events-none z-0" />
        
        {/* Dynamic Visual Gradient Aurora */}
        <div className="absolute top-0 left-0 right-0 h-full pointer-events-none z-0 mix-blend-plus-lighter" style={{ backgroundImage: `linear-gradient(to bottom, ${accentColor}15, ${accentColor}02, transparent)` }} />

        {/* HERO SECTION */}
      <header id="main-hero" className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column text details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accentColor }}></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: accentColor }}></span>
            </span>
            Live Availability: Tonight in Ibiza
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tight uppercase font-display">
            Your Island <br/>
            <span className="inline-block relative">
              <span className="relative z-10 selection:text-[#0A0A0A] selection:bg-white" style={{ color: accentColor }}>Access.</span>
            </span>
          </h1>

          <p className="text-zinc-400 max-w-lg text-sm sm:text-base leading-relaxed">
            Premium Ibiza event booking and local experiences agency. Club passes, private boat charters, and exclusive table services with instant fast ticket checkout.
          </p>

          {/* Quick Search & Filters API bar */}
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-4 max-w-xl flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-[#0A0A0A] p-2.5 px-4 rounded-xl border border-white/5">
              <Search className="text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search DJs, Pacha, Amnesia..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 text-white w-full placeholder-zinc-500 focus:outline-none text-sm"
              />
            </div>
            
            <button 
              onClick={() => { const el = document.getElementById('main-sections'); el?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black flex items-center justify-center gap-1 cursor-pointer hover:bg-zinc-100 transition-all active:scale-95 min-w-[120px]"
              style={{ backgroundColor: accentColor }}
            >
              Explore Listings
            </button>
          </div>

          <div id="service-ticker" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Check size={14} style={{ color: accentColor }} /> Instant Fast Ferry</span>
            <span className="flex items-center gap-1.5"><Check size={14} style={{ color: accentColor }} /> Verified Official Affiliate</span>
            <span className="flex items-center gap-1.5"><Check size={14} style={{ color: accentColor }} /> WhatsApp concierge 24/7</span>
          </div>
        </div>

        {/* Right column highlights & Daily Deals widget */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl border-l border-b border-white/5" style={{ color: accentColor, backgroundColor: `${accentColor}15` }}>
              Deals of the Day #1
            </div>

            <div className="flex items-center gap-4">
              <Image 
                src={dealsOfTheDay[0].image} 
                alt="Highlight Deal" 
                width={80}
                height={80}
                className="w-20 h-20 rounded-xl object-cover border border-white/10"
              />
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>Combo Deal</span>
                <h4 className="text-lg font-bold text-white line-clamp-1 leading-tight">{dealsOfTheDay[0].title}</h4>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{dealsOfTheDay[0].description}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase tracking-widest line-through block">{dealsOfTheDay[0].originalPrice}</span>
                <span className="text-xl font-black text-white">{dealsOfTheDay[0].discountPrice} <span className="text-xs font-normal text-zinc-400 tracking-wider">/ entry</span></span>
              </div>
              <button 
                onClick={() => handleClaimDeal(dealsOfTheDay[0])}
                className="px-5 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1 text-black bg-white hover:bg-zinc-100 cursor-pointer"
              >
                Claim Deal <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => { setActiveTab('clubs'); const el = document.getElementById('main-sections'); el?.scrollIntoView({ behavior: 'smooth' }); }}
              className="bg-[#18181b] p-4 rounded-xl border border-white/5 hover:border-[#FF4E00]/30 transition-all group cursor-pointer text-left"
            >
              <div className="font-black italic text-xl uppercase font-display" style={{ color: accentColor }}>Clubs</div>
              <div className="text-xs text-zinc-400 mt-1 group-hover:text-white transition-colors">Buy Passes Instantly</div>
            </div>
            
            <div 
              onClick={() => { setActiveTab('boats'); const el = document.getElementById('main-sections'); el?.scrollIntoView({ behavior: 'smooth' }); }}
              className="bg-[#18181b] p-4 rounded-xl border border-white/5 hover:border-[#FF4E00]/30 transition-all group cursor-pointer text-left"
            >
              <div className="font-black italic text-xl uppercase font-display" style={{ color: accentColor }}>Yachts</div>
              <div className="text-xs text-zinc-400 mt-1 group-hover:text-white transition-colors">Private Boat Rentals</div>
            </div>
          </div>
        </div>
      </header>

      {/* QUICK STATUS TICKER BAR */}
      <div id="status-bar" className="bg-zinc-950 border-t border-b border-white/5 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-450">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-zinc-400">ClubTickets API status:</span>
            <span className="font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Live Connected
            </span>
          </div>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
            <span>25 Active Open Venues</span>
            <span>Est. load time: <span className="text-emerald-400">0.1ms</span></span>
            <span>100% Secure Checkout</span>
          </div>
        </div>
      </div>
      </div>

      {/* MAIN VIEWPORT BODY & SECTIONS */}
      <main id="main-sections" className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 flex-1">
        
        {/* INTERACTIVE NAVIGATION CONTROL */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/5 pb-5">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: 'All Services', icon: Compass },
              { id: 'clubs', label: 'Club Tickets', icon: Ticket },
              { id: 'boats', label: 'Boats & Parties', icon: Anchor },
              { id: 'vip', label: 'VIP Tables', icon: Sparkles },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 ${
                    isSelected 
                      ? 'text-black shadow-lg shadow-white/5' 
                      : 'bg-[#18181b] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                  style={{ backgroundColor: isSelected ? accentColor : undefined }}
                >
                  <IconComp size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. SECTIE: DEALS OF THE DAY */}
        {(activeTab === 'all' || activeTab === 'all_specials') && (
          <section id="deals-of-the-day-section" className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-display">Deals of the Day</h2>
                <p className="text-xs text-zinc-400">Handpicked limited offers with premium Balearic agency discounts.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dealsOfTheDay.map((deal) => (
                <div key={deal.id} className="bg-[#18181b] border border-white/10 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <Image 
                        src={deal.image} 
                        alt={deal.title} 
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-[#0A0A0A] border border-white/10 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded">
                        {deal.badge}
                      </span>
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="font-bold text-lg text-white group-hover:text-amber-500 transition-colors leading-snug">{deal.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{deal.description}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-auto">
                    <div className="h-px bg-white/5 mb-4" />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-zinc-500 text-[10px] block line-through">{deal.originalPrice}</span>
                        <span className="text-xl font-black text-white">{deal.discountPrice}</span>
                      </div>
                      <button 
                        onClick={() => handleClaimDeal(deal)}
                        className="px-4 py-2 rounded-lg text-xs font-bold uppercase text-black cursor-pointer"
                        style={{ backgroundColor: accentColor }}
                      >
                        Claim Offer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. SECTIE: CLUB TICKETS */}
        {(activeTab === 'all' || activeTab === 'clubs') && (
          <section id="club-tickets" className="mb-14">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-display">Official Club Tickets</h2>
                <p className="text-xs text-zinc-400">Pacha, Amnesia, Hï Ibiza, Ushuaïa & more. Direct official affiliate booking links.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVenues.map((venue) => (
                <div key={venue.id} className="bg-[#18181b] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group">
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={venue.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600"} 
                        alt={venue.name} 
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div>
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded px-2.5 py-0.5 font-bold uppercase tracking-wider mb-1.5 inline-block">
                            {venue.isDayClub ? 'Open-Air Day Club' : 'Nightclub Temple'}
                          </span>
                          <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">{venue.name}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-xs text-zinc-400 leading-relaxed">{venue.description}</p>
                      
                      <div className="space-y-3 pt-2">
                        <div className="text-[10px] font-bold tracking-widest text-[#a1a1aa] uppercase border-b border-white/5 pb-2">
                          Featured Upcoming Residencies ({venue.events?.length || 0})
                        </div>
                        
                        {venue.events && venue.events.map((event: any) => (
                          <div key={event.id} className="bg-[#0A0A0A]/60 p-3 rounded-xl border border-white/5 flex items-start justify-between gap-3 hover:border-zinc-800 transition-colors">
                            <div className="flex-1">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase">{event.startAt} - {event.endAt || 'Late'}</span>
                              <h4 className="text-xs font-bold text-white mt-0.5">{event.name}</h4>
                              <p className="text-[10px] text-zinc-405 italic mt-1 line-clamp-1">Requirements: Casual elegant dress</p>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 items-end justify-center">
                              <Link 
                                href={`/club-tickets/${venue.slug}/${event.slug}`}
                                className="px-3 py-1.5 text-[9px] font-bold text-black uppercase rounded bg-indigo-500 hover:bg-indigo-600 tracking-wider flex items-center gap-0.5"
                                style={{ backgroundColor: accentColor }}
                              >
                                View Ticket <ChevronRight size={8} />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
