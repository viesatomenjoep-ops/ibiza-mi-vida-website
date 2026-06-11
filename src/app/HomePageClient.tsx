'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Music, Crown, Zap } from 'lucide-react';

const CONFIG = {
  whatsapp: '31683052875',
};

const DEALS = [
  { id:'boat',  kind:'PRIVATE BOAT', title:'VIP Sunset Boat Charter', when:'Today',          price:499, glow:'rgba(46,90,107,.16)', image: '/fotos/Vanquish 1.jpg' },
  { id:'amni',  kind:'CLUB TICKET',  title:'Amnesia VIP Balcony',     when:'Tonight',         price:129, glow:'rgba(143,166,176,.25)', image: '/fotos/amnesia-ibiza-8196.jpg' },
  { id:'ocean', kind:'BOAT PARTY',   title:'Oceanbeat Boat Party',    when:'Today · 14:00',   price:59,  glow:'rgba(46,90,107,.12)', image: '/fotos/Zodiac Medline 1.webp' },
  { id:'form',  kind:'EXCURSION',    title:'Formentera Day Trip',     when:'Tomorrow',         price:149, glow:'rgba(143,166,176,.2)', image: '/fotos/Sacs Rebel 47.webp' },
];

const CLUBS = [
  { name:'Amnesia',       genres:['House','Techno'],      tag:'Underground legends since 1976',           glow:'rgba(46,90,107,.14)', image: '/hi-ibiza-2026/FB_IMG_1779623220486.jpg' },
  { name:'Pacha Ibiza',   genres:['House','Disco'],       tag:'The original Ibiza super-club',             glow:'rgba(143,166,176,.22)', image: '/hi-ibiza-2026/FB_IMG_1779623247060.jpg' },
  { name:'Hï Ibiza',      genres:['Techno','House'],      tag:'Ibiza\'s most awarded club',                glow:'rgba(46,90,107,.12)', image: '/hi-ibiza-2026/FB_IMG_1779623300180.jpg' },
  { name:'Ushuaïa Ibiza', genres:['House','Commercial'],  tag:'The open-air beach club experience',       glow:'rgba(143,166,176,.2)', image: '/ushuaia-2026/image_search_1779624236635.jpg' },
  { name:'O Beach Ibiza', genres:['Commercial','House'],  tag:'Pool parties done properly',                glow:'rgba(46,90,107,.1)', image: '/ushuaia-2026/image_search_1779624261942.jpg' },
  { name:'Ibiza Rocks',   genres:['Rock','Commercial'],   tag:'Live music meets nightlife',                glow:'rgba(143,166,176,.18)', image: '/ushuaia-2026/image_search_1779624290030.jpg' },
];

const GENRES = ['All','House','Techno','Commercial','Disco','Chill','Latin','Rock'];

export default function HomePageClient({ clubTicketsSlider, dailyEventsSection }: { clubTicketsSlider: React.ReactNode, dailyEventsSection?: React.ReactNode }) {
  const { items, addToCart, removeFromCart } = useCart();
  const [filter, setFilter] = useState('All');
  const [t, setT] = useState({ h: '00', m: '00', s: '00', flip: { h: false, m: false, s: false } });

  const filteredClubs = useMemo(() => {
    return filter === 'All' ? CLUBS : CLUBS.filter(c => c.genres.includes(filter));
  }, [filter]);

  const toggle = (id: string, d: any) => {
    const existingItem = items.find(i => i.serviceId === id);
    if (existingItem) {
      removeFromCart(existingItem.id);
    } else {
      addToCart({
        serviceId: id,
        title: d.title,
        price: d.price,
        image: d.image,
        date: d.when
      });
    }
  };

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now); end.setHours(24, 0, 0, 0);
      const diff = Math.max(0, (end.getTime() - now.getTime()) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      const s = String(Math.floor(diff % 60)).padStart(2, '0');
      
      setT(prev => {
        let n = { ...prev };
        if (h !== prev.h) { n.h = h; n.flip.h = true; setTimeout(() => setT(x => ({ ...x, flip: { ...x.flip, h: false } })), 500); }
        if (m !== prev.m) { n.m = m; n.flip.m = true; setTimeout(() => setT(x => ({ ...x, flip: { ...x.flip, m: false } })), 500); }
        if (s !== prev.s) { n.s = s; n.flip.s = true; setTimeout(() => setT(x => ({ ...x, flip: { ...x.flip, s: false } })), 500); }
        return n;
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });

    requestAnimationFrame(() => {
      document.querySelectorAll('.reveal').forEach((el, i) => {
        (el as HTMLElement).style.transitionDelay = (Math.min(i, 6) * 60) + 'ms';
        io.observe(el);
      });
    });
  }, [filter]); // re-run when filter changes since DOM elements mount/unmount



  return (
    <main className="bg-ibiza-sand text-velvet-obsidian relative">
      <div id="top"></div>
      
      {/* Hero Section */}
      <section className="relative w-full h-[95vh] md:h-[100vh] bg-velvet-obsidian overflow-hidden">
        
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover scale-[1.35] opacity-90"
          src="https://res.cloudinary.com/daj1lyfgk/video/upload/q_auto,f_auto,so_30,du_30/v1781127267/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p_bqyeg4.mp4"
        />
        
        {/* Gradients for smooth blending */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10" />

        {/* Hero Content - Placed over video on both mobile and desktop */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end md:justify-center text-center px-4 md:px-8 pb-[20vh] md:pb-0 pt-32">
          <div className="w-full max-w-7xl mx-auto md:absolute md:bottom-24 md:left-0 md:right-0">
            <h2 className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-white/90 mb-4 md:mb-6 drop-shadow-md">
              IBIZA MI VIDA &middot; SEASON 2026
            </h2>
            
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.0] md:leading-[0.9] tracking-tight mb-5 md:mb-8 drop-shadow-xl">
              Experience the <br/>
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 font-light pl-2 pr-2">real</span> Ibiza.
            </h1>
            
            <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-5 md:p-8 mb-8 md:mb-10 mx-auto max-w-3xl shadow-2xl">
              <p className="font-sans text-sm sm:text-base md:text-lg text-white font-medium tracking-wide leading-relaxed drop-shadow-md px-2">
                Club tickets, private charters and boat parties — hand-picked by locals, confirmed within minutes on WhatsApp.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-2">
              <Link href="/club-tickets" className="w-[90%] sm:w-auto px-6 py-4 md:py-4 rounded-full border border-white/60 bg-white/10 backdrop-blur-sm text-white font-bold tracking-widest text-sm uppercase hover:bg-white hover:text-velvet-obsidian transition-colors duration-300 min-w-[200px]">Book Club Tickets</Link>
              <Link href="/vip-experiences" className="w-[90%] sm:w-auto px-6 py-4 md:py-4 rounded-full border border-white/60 bg-white/10 backdrop-blur-sm text-white font-bold tracking-widest text-sm uppercase hover:bg-white hover:text-velvet-obsidian transition-colors duration-300 min-w-[200px]">View VIP Tables</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Deals of the Day / Live Offers */}
      <section id="deals" className="section section--paper pt-12 md:pt-16 pb-4 relative z-30">
        <div className="container">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-velvet-obsidian/60">Live Offers</h2>
          </div>
          
          <div className="section__header reveal pt-4 md:pt-6">
            <div>
              <p className="section__eyebrow">LIMITED TIME</p>
              <h2 className="section__heading">Deals of the day.</h2>
              <p style={{ color: 'var(--color-slate)', marginTop: '.75rem', maxWidth: '30rem', fontSize: '14px' }}>
                Select the deals you want and book them all at once via WhatsApp — before the timer runs out.
              </p>
            </div>
            <div className="countdown">
              <span className="countdown__label">ENDS MIDNIGHT</span>
              <div className="countdown__digits">
                <span className={`flip ${t.flip.h ? 'tick' : ''}`}>{t.h}</span>
                <span className="countdown__sep">:</span>
                <span className={`flip ${t.flip.m ? 'tick' : ''}`}>{t.m}</span>
                <span className="countdown__sep">:</span>
                <span className={`flip countdown__sep ${t.flip.s ? 'tick' : ''}`}>{t.s}</span>
              </div>
            </div>
          </div>

          <div className="deal-grid mt-4">
            {DEALS.map((d, i) => {
              const isSelected = i === 1;
              return (
                <button key={d.id} className="ticket flex flex-col items-center justify-center text-center shrink-0 w-[85vw] md:w-[320px] snap-center snap-always">
                  <div className="ticket__body">
                    <div className="ticket__image">
                      <Image src={d.image} alt={d.title} fill className="object-cover" />
                      <div className="ticket__glow" style={{ background: d.glow }}></div>
                      <span className="ticket__kind">{d.kind}</span>
                      <span className={`ticket__badge ${isSelected ? 'ticket__badge--on' : 'ticket__badge--off'}`}>{isSelected ? '✓' : '+'}</span>
                    </div>
                    <h3 className="ticket__title text-center leading-tight">{d.title}</h3>
                    <p className="ticket__when">{d.when}</p>
                  </div>
                  <div className="ticket__perf"></div>
                  <div className="ticket__foot w-full flex items-center justify-between">
                    <span className="ticket__price">€{d.price}</span>
                    <span className={`ticket__select ${isSelected ? 'ticket__select--on' : 'ticket__select--off'}`}>{isSelected ? 'Selected' : 'Select'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Daily Events Section */}
      <div className="-mt-8 md:-mt-12 relative z-20">
        {dailyEventsSection}
      </div>

      {clubTicketsSlider}

<section id="relume" className="px-[5%] py-4 md:py-8 lg:py-12 group">
  <div className="container">
    <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
      <p className="mb-3 font-semibold md:mb-4 tracking-widest uppercase text-blue-600">IBIZA 2026</p>
      <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl transition-all duration-500 hover:text-blue-500">
        Your Ultimate Ibiza Party Experience
      </h1>
      <p className="md:text-lg text-gray-600">
        Discover the best parties, book exclusive VIP tables, and secure tickets to Ibiza&apos;s most legendary clubs. We organize your unforgettable night.
      </p>
    </div>
    <div className="flex items-center justify-center gap-4 mb-16 md:mb-24">
      <a href="#clubs" className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary hover:bg-black hover:text-white hover:scale-105 shadow-md hover:shadow-xl px-6 py-3">
        Book Club Tickets
      </a>
      <a href="#deals" className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary hover:bg-black hover:text-white hover:scale-105 shadow-md hover:shadow-xl px-6 py-3">
        View VIP Tables
      </a>
    </div>
    <div
      className="grid grid-cols-1 items-center gap-x-12 md:grid-cols-2 lg:gap-x-20"
    >
      <div
        className="mb-6 flex max-h-full w-full items-center justify-center overflow-hidden md:mb-0"
      >
        <div style={{ "opacity": 1 } as React.CSSProperties}>
          <img
            src="/hi-ibiza-2026/FB_IMG_1779623220486.jpg"
            alt="Hï Ibiza"
            className="size-full object-cover"
          />
        </div>
      </div>
      <div
        className="relative grid auto-cols-fr grid-cols-1 grid-rows-[auto_auto] items-start md:items-stretch"
      >
        <div
          className="cursor-pointer border-b border-border-primary py-6 opacity-100"
        >
          <h2
            className="text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl"
          >
            Exclusive VIP Tables
          </h2>
          <div className="overflow-hidden" style={{ "height": "auto", "opacity": 1 } as React.CSSProperties}>
            <p className="mt-3 md:mt-4 text-gray-600">
              Enjoy premium bottle service, skip the line, and get the best views of the DJ at world-renowned clubs like Hï, Ushuaïa, and Amnesia.
            </p>
          </div>
        </div>
        <div
          className="cursor-pointer border-b border-border-primary py-6 opacity-25 hover:opacity-100 transition-opacity duration-300"
        >
          <h2
            className="text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl"
          >
            Boat Parties & Catamarans
          </h2>
          <div className="overflow-hidden" style={{ "height": "0px", "opacity": 0 } as React.CSSProperties}>
            <p className="mt-3 md:mt-4 text-gray-600">
              Experience the Mediterranean sea with all-inclusive drinks, spectacular sunset views, and live DJs.
            </p>
          </div>
        </div>
        <div
          className="cursor-pointer border-b border-border-primary py-6 opacity-25 hover:opacity-100 transition-opacity duration-300"
        >
          <h2
            className="text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl"
          >
            Official Club Tickets
          </h2>
          <div className="overflow-hidden" style={{ "height": "0px", "opacity": 0 } as React.CSSProperties}>
            <p className="mt-3 md:mt-4 text-gray-600">
              100% authentic tickets for all major superclubs. Book safely and get instant confirmation directly via WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </main>
  );
}
