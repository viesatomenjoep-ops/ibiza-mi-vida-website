'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Music, Crown, Zap } from 'lucide-react';
import { GlobalJet } from '@/components/animations/GlobalJet';

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

export default function HomePageClient({ clubTicketsSlider }: { clubTicketsSlider: React.ReactNode }) {
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
    <main>
      <GlobalJet />

      <div id="top"></div>
      
      <section id="hero-video" className="relative h-screen w-full overflow-hidden bg-white">
        <video autoPlay loop muted playsInline preload="auto" className="absolute inset-0 size-full object-cover scale-[1.35]" src="https://res.cloudinary.com/daj1lyfgk/video/upload/q_auto,f_auto,so_30,du_30/v1781127267/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p_bqyeg4.mp4" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" /> {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="mb-4 tracking-[0.2em] uppercase text-sm md:text-base font-semibold drop-shadow-md">IBIZA MI VIDA · SEASON 2026</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 drop-shadow-xl">
            Experience the <span className="text-blue-300">real</span> Ibiza.
          </h1>
          <p className="max-w-2xl text-lg md:text-xl drop-shadow-lg mb-8 font-medium">
            Club tickets, private charters and boat parties — hand-picked by locals, confirmed within minutes on WhatsApp.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a href="#deals" className="btn btn--primary hover:scale-105 transition-transform duration-300">See today&apos;s deals ↓</a>
            <span className="text-sm opacity-80 uppercase tracking-widest mt-4">Keep scrolling to discover the magic.</span>
          </div>
        </div>
      </section>

      <section id="deals" className="section section--paper" style={{ paddingTop: '2rem' } as React.CSSProperties}>
        <div className="container">
          <div className="section__header reveal">
            <div>
              <p className="section__eyebrow">LIVE OFFERS</p>
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

          <div className="deal-grid">
            {DEALS.map(d => {
              const isSelected = items.some(i => i.serviceId === d.id);
              return (
                <button key={d.id} className={`ticket ${isSelected ? 'sel' : ''}`} onClick={() => toggle(d.id, d)} aria-pressed={isSelected}>
                  <div className="ticket__body">
                    {/* REAL IMAGE USING next/image */}
                    <div className="ticket__image">
                      <Image src={d.image} alt={d.title} fill className="object-cover" />
                      <div className="panImg" style={{ position: 'absolute', inset: 0, opacity: .7, background: `radial-gradient(140px 100px at 70% 30%, ${d.glow}, transparent 70%)` }}></div>
                      <span className="ticket__kind">{d.kind}</span>
                      <span className={`ticket__badge ${isSelected ? 'ticket__badge--on' : 'ticket__badge--off'}`}>{isSelected ? '✓' : '+'}</span>
                    </div>
                    <h3 className="ticket__title">{d.title}</h3>
                    <p className="ticket__when">{d.when}</p>
                  </div>
                  <div className="ticket__perf"></div>
                  <div className="ticket__foot">
                    <span className="ticket__price">€{d.price}</span>
                    <span className="ticket__barcode"></span>
                    <span className={`ticket__select ${isSelected ? 'ticket__select--on' : 'ticket__select--off'}`}>{isSelected ? 'Selected' : 'Select'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {clubTicketsSlider}

<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28 group">
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


<section id="clubs" className="px-[5%] py-16 md:py-24 lg:py-28 bg-gray-50 group">
  <div className="container">
    <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
      <h2 className="mb-5 text-4xl font-bold md:mb-6 md:text-5xl lg:text-6xl transition-all duration-500 hover:text-blue-500">
        The World&apos;s Most Iconic Clubs
      </h2>
      <p className="md:text-lg text-gray-600">
        Ibiza is the home of electronic music. Experience legendary parties in world-renowned venues and dance until the sun comes up.
      </p>
    </div>
    <div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
      <div className="flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 p-6 rounded-2xl hover:shadow-xl bg-white">
        <div className="mb-5 md:mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <Music size={32} strokeWidth={1.5} />
        </div>
        <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
          Ibiza Clubs
        </h3>
        <p className="text-gray-600">
          From open-air superclubs to legendary techno temples. We provide guaranteed access to the biggest events on the island.
        </p>
      </div>
      <div className="flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 p-6 rounded-2xl hover:shadow-xl bg-white">
        <div className="mb-5 md:mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <Crown size={32} strokeWidth={1.5} />
        </div>
        <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
          Premium VIP Tables
        </h3>
        <p className="text-gray-600">
          Book an exclusive VIP table and enjoy the best service, premium bottles, and a phenomenal view of the DJ.
        </p>
      </div>
      <div className="flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 p-6 rounded-2xl hover:shadow-xl bg-white">
        <div className="mb-5 md:mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <Zap size={32} strokeWidth={1.5} />
        </div>
        <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
          Confirmed Within Minutes
        </h3>
        <p className="text-gray-600">
          Our local concierges confirm your booking directly via WhatsApp. Fast, reliable, and completely stress-free.
        </p>
      </div>
    </div>
    <div className="mt-12 flex items-center justify-center gap-4 md:mt-18 lg:mt-20">
      <a href="#deals" className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary hover:bg-black hover:text-white hover:scale-105 shadow-md hover:shadow-xl px-6 py-3">
        View VIP Tables
      </a>
      <a href="/club-tickets" className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary hover:bg-black hover:text-white hover:scale-105 shadow-md hover:shadow-xl px-6 py-3">
        More Info
      </a>
    </div>
  </div>
</section>


<section id="more-clubs" className="px-[5%] py-16 md:py-24 lg:py-28 group">
  <div className="container">
    <div className="mb-12 md:mb-18 lg:mb-20">
      <div className="mx-auto w-full max-w-lg text-center">
        <p className="mb-3 font-semibold md:mb-4 tracking-widest uppercase text-blue-600">Clubs & Tickets</p>
        <h2 className="mb-5 text-4xl font-bold md:mb-6 md:text-5xl lg:text-6xl transition-all duration-500 hover:text-blue-500">
          Find your perfect party
        </h2>
        <p className="md:text-lg text-gray-600">
          From hypnotic techno at Hï Ibiza to classic house beats at Pacha. Choose your favorite club and buy official tickets directly via Ibiza Mi Vida.
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-4 lg:gap-x-12">
      <div className="flex flex-col transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
        <div className="mb-5 flex w-full flex-col items-center justify-center md:mb-6 overflow-hidden rounded-xl shadow-lg">
          <img
            src="/hi-ibiza-2026/FB_IMG_1779623220486.jpg"
            alt="Amnesia Ibiza"
            className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center p-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">House</p>
            <h3 className="mb-2 text-xl font-bold md:text-2xl">
              Amnesia
            </h3>
            <p className="text-gray-600">
              Experience the legendary atmosphere of Amnesia. The ultimate place for immersive techno and unmatched energy.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
        <div className="mb-5 flex w-full flex-col items-center justify-center md:mb-6 overflow-hidden rounded-xl shadow-lg">
          <img
            src="/hi-ibiza-2026/FB_IMG_1779623247060.jpg"
            alt="Pacha Ibiza"
            className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center p-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">Disco</p>
            <h3 className="mb-2 text-xl font-bold md:text-2xl">
              Pacha Ibiza
            </h3>
            <p className="text-gray-600">
              The oldest club in Ibiza. Enjoy iconic house, disco classics, and a luxurious atmosphere.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
        <div className="mb-5 flex w-full flex-col items-center justify-center md:mb-6 overflow-hidden rounded-xl shadow-lg">
          <img
            src="/hi-ibiza-2026/FB_IMG_1779623300180.jpg"
            alt="Hï Ibiza"
            className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center p-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">Techno</p>
            <h3 className="mb-2 text-xl font-bold md:text-2xl">
              Hï Ibiza
            </h3>
            <p className="text-gray-600">
              Voted the #1 club in the world. Let yourself be overwhelmed by spectacular light shows and cutting-edge electronic music.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
        <div className="mb-5 flex w-full flex-col items-center justify-center md:mb-6 overflow-hidden rounded-xl shadow-lg">
          <img
            src="/ushuaia-2026/image_search_1779624236635.jpg"
            alt="Ushuaïa Ibiza"
            className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center p-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">Commercial</p>
            <h3 className="mb-2 text-xl font-bold md:text-2xl">
              Ushuaïa Ibiza
            </h3>
            <p className="text-gray-600">
              Dance open-air around the pool. The place to be for the biggest house artists and commercial hits, from sunset to midnight.
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
