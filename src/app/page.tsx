'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';

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

const SVG_SCENE = `
<svg id="sceneSvg" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="skyL" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#DDE6EC"/>
      <stop offset="70%" stop-color="#EEF0EC"/>
      <stop offset="100%" stop-color="#F4F1E9"/>
    </linearGradient>
    <linearGradient id="seaL" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C6D3D9"/>
      <stop offset="100%" stop-color="#7E97A4"/>
    </linearGradient>
    <radialGradient id="hazeSun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".5"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hullL" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F4F7F8"/>
      <stop offset="100%" stop-color="#C2D0DA"/>
    </linearGradient>
    <linearGradient id="jetL" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8ECEE"/>
      <stop offset="60%" stop-color="#C8D4DA"/>
      <stop offset="100%" stop-color="#93A6B0"/>
    </linearGradient>
    <linearGradient id="trailL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="beamG" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#7E97A4" stop-opacity=".22"/>
      <stop offset="100%" stop-color="#7E97A4" stop-opacity="0"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-opacity="0.15" flood-color="#2B3947"/>
    </filter>
  </defs>
  <g id="jet" filter="url(#softShadow)">
    <g transform="scale(-1,1)">
      <g id="trail">
        <rect x="58" y="-7" width="360" height="2.8" rx="1.4" fill="url(#trailL)"/>
        <rect x="64" y="2" width="300" height="2.4" rx="1.2" fill="url(#trailL)" opacity=".7"/>
      </g>
      <path d="M 6 -2 L 64 16 L 50 19 L -2 4 Z" fill="#AFBCC4"/>
      <path d="M -78 -4 C -70 -9 -58 -11 -40 -11 L 38 -11 C 56 -11 66 -8 70 -4 C 73 -1 72 3 66 4 L -52 4 C -68 4 -76 1 -78 -4 Z" fill="url(#jetL)"/>
      <path d="M -70 -8 C -64 -10 -58 -10.6 -52 -10.7 L -52 -6.5 L -68 -6.2 Z" fill="#2B3947"/>
      <g fill="#2B3947" opacity=".85">
        <circle cx="-38" cy="-7.4" r="1.6"/><circle cx="-28" cy="-7.4" r="1.6"/>
        <circle cx="-18" cy="-7.4" r="1.6"/><circle cx="-8" cy="-7.4" r="1.6"/>
        <circle cx="2" cy="-7.4" r="1.6"/><circle cx="12" cy="-7.4" r="1.6"/>
        <circle cx="22" cy="-7.4" r="1.6"/>
      </g>
      <ellipse cx="42" cy="-12" rx="13" ry="4.6" fill="#CBD4D9"/>
      <ellipse cx="30" cy="-12" rx="2.6" ry="4" fill="#2B3947"/>
      <path d="M 56 -10 L 74 -34 L 80 -34 L 70 -10 Z" fill="#E2E7EA"/>
      <path d="M 62 -34 L 92 -38 L 90 -33 L 64 -31 Z" fill="#C4CFD5"/>
      <path d="M -74 0 C -60 3 60 3 66 1 L 66 4 L -52 4 C -66 4 -73 2 -74 0 Z" fill="#93A3AD" opacity=".6"/>
      <circle cx="-77" cy="-4" r="2" fill="#2E5A6B" class="blink"/>
      <circle cx="90" cy="-36" r="2" fill="#B0563B" class="blink" style="animation-delay:.5s"/>
    </g>
    <text x="-36" y="1.6" font-family="Marcellus, serif" font-size="7.2" letter-spacing="1.6" fill="#2E5A6B">IBIZA MI VIDA</text>
    <text x="-78" y="-30" font-family="Marcellus, serif" font-size="7" fill="#2E5A6B">MV</text>
  </g>
  <g>
    <path d="M0 620 L0 596 C 60 588 130 586 200 592 C 270 598 330 608 380 616 L 400 620 Z" fill="#9FB0B9"/>
    <rect x="86" y="566" width="8" height="30" fill="#8B9DA7"/>
    <rect x="84" y="560" width="12" height="8" rx="2" fill="#8B9DA7"/>
    <circle cx="90" cy="563" r="3" fill="#FFFFFF" class="lhouse"/>
    <text x="40" y="648" font-family="Mulish, sans-serif" font-weight="600" font-size="11" letter-spacing="4" fill="#FFFFFF" opacity=".85">FORMENTERA</text>
  </g>
  <g>
    <path d="M 980 620 C 1030 580 1090 556 1160 552 C 1250 548 1340 562 1440 588 L 1440 620 Z" fill="#93A6B0"/>
    <text x="1352" y="648" font-family="Mulish, sans-serif" font-weight="600" font-size="11" letter-spacing="4" fill="#FFFFFF" opacity=".85">IBIZA</text>
    <polygon class="led" points="1196,492 1186,150 1218,150 1206,492" fill="url(#beamG)"/>
    <polygon class="led l2" points="1252,492 1208,160 1244,150 1262,492" fill="url(#beamG)"/>
    <polygon class="led l3" points="1308,492 1330,160 1366,176 1318,492" fill="url(#beamG)"/>
    <path d="M 1078 472 Q 1252 366 1426 472 L 1426 486 Q 1252 384 1078 486 Z" fill="#62798A"/>
    <path d="M 1090 478 Q 1252 380 1414 478" fill="none" stroke="#7C93A3" stroke-width="3"/>
    <rect x="1072" y="472" width="14" height="148" fill="#6B8292"/>
    <rect x="1418" y="472" width="14" height="148" fill="#6B8292"/>
    <line x1="1072" y1="500" x2="1086" y2="528" stroke="#7E95A4" stroke-width="2.4"/>
    <line x1="1086" y1="500" x2="1072" y2="528" stroke="#7E95A4" stroke-width="2.4"/>
    <line x1="1418" y1="500" x2="1432" y2="528" stroke="#7E95A4" stroke-width="2.4"/>
    <line x1="1432" y1="500" x2="1418" y2="528" stroke="#7E95A4" stroke-width="2.4"/>
    <g fill="#54697A">
      <rect x="1090" y="540" width="26" height="22" rx="3"/>
      <rect x="1092" y="566" width="22" height="20" rx="3"/>
      <rect x="1388" y="540" width="26" height="22" rx="3"/>
      <rect x="1390" y="566" width="22" height="20" rx="3"/>
    </g>
    <rect class="led" x="1166" y="464" width="172" height="100" rx="6" fill="#7FA3AD"/>
    <g stroke="#F6F5F1" stroke-opacity=".35" stroke-width="1.5">
      <line x1="1209" y1="464" x2="1209" y2="564"/><line x1="1252" y1="464" x2="1252" y2="564"/>
      <line x1="1295" y1="464" x2="1295" y2="564"/><line x1="1166" y1="497" x2="1338" y2="497"/>
      <line x1="1166" y1="530" x2="1338" y2="530"/>
    </g>
    <polygon class="led l2" points="1120,486 1160,476 1160,560 1120,552" fill="#9FB8BD"/>
    <polygon class="led l3" points="1344,476 1384,486 1384,552 1344,560" fill="#B9CCD0"/>
    <rect x="1212" y="566" width="80" height="12" rx="3" fill="#4A5F70"/>
    <rect x="1206" y="576" width="92" height="16" rx="4" fill="#54697A"/>
    <g fill="#2B3947">
      <circle cx="1252" cy="552" r="6.5"/>
      <rect x="1244" y="558" width="16" height="13" rx="5"/>
      <rect class="djArm" x="1256" y="551" width="17" height="4.6" rx="2.3"/>
      <rect class="djArm" style="animation-delay:.23s" x="1230" y="554" width="15" height="4.4" rx="2.2"/>
    </g>
    <rect x="1056" y="612" width="384" height="8" rx="2" fill="#7E95A4"/>
  </g>

  <g id="yacht" filter="url(#softShadow)">
    <g transform="scale(-1,1)">
      <g id="wake" stroke="#FFFFFF" stroke-opacity=".75" stroke-width="2.4" fill="none">
        <path d="M -118 18 q -60 6 -120 18"/>
        <path d="M -112 24 q -76 12 -150 30"/>
      </g>
      <path d="M -120 2 C -110 20 -30 26 50 24 C 96 22 130 14 142 0 L 148 -8 L -124 -10 C -128 -5 -126 -1 -120 2 Z" fill="url(#hullL)"/>
      <path d="M -124 -10 L 148 -8 L 146 -4 L -123 -6 Z" fill="#2B3947" opacity=".25"/>
      <g fill="#2B3947" opacity=".5">
        <circle cx="-86" cy="8" r="2.1"/><circle cx="-58" cy="9" r="2.1"/>
        <circle cx="-30" cy="10" r="2.1"/><circle cx="-2" cy="10" r="2.1"/>
        <circle cx="26" cy="9" r="2.1"/> <circle cx="54" cy="8" r="2.1"/>
        <circle cx="82" cy="6" r="2.1"/>
      </g>
      <path d="M -92 -10 L 96 -9 C 92 -22 80 -28 58 -29 L -74 -28 C -86 -24 -92 -18 -92 -10 Z" fill="#F2F4F4"/>
      <rect x="-70" y="-25" width="120" height="9" rx="4.5" fill="#2B3947" opacity=".75"/>
      <path d="M -54 -28 L 36 -28 C 34 -38 26 -43 12 -44 L -40 -43 C -50 -40 -54 -34 -54 -28 Z" fill="#FAFBFB"/>
      <rect x="-38" y="-40" width="56" height="7" rx="3.5" fill="#2B3947" opacity=".65"/>
      <path d="M 8 -44 C 16 -54 26 -56 34 -52 L 32 -48 C 26 -51 18 -49 12 -43 Z" fill="#C4CFD5"/>
      <rect x="-20" y="-56" width="2.6" height="13" fill="#C4CFD5"/>
      <circle cx="-18.7" cy="-58" r="2" fill="#2E5A6B" class="blink" style="animation-delay:.3s"/>
      <path d="M 96 -9 L 142 -1" stroke="#C4CFD5" stroke-width="1.6"/>
    </g>
    <text x="-78" y="2" font-family="Marcellus, serif" font-size="13" letter-spacing="2.6" fill="#2E5A6B"></text>
  </g>
</svg>
`;

export default function Home() {
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

  // Scene animation
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let target = 0, smooth = 0;
    const t0 = performance.now();
    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
    const ease = (p: number) => p < .5 ? 2*p*p : 1 - Math.pow(-2*p + 2, 2) / 2;

    const measure = () => {
      const scene = document.getElementById('scene');
      if (!scene) return;
      const r = scene.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      target = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    };
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    measure();

    if (reduced) {
      const yacht = document.getElementById('yacht');
      const jet = document.getElementById('jet');
      if (yacht) yacht.setAttribute('transform', 'translate(640,716) scale(.85)');
      if (jet) jet.setAttribute('transform', 'translate(520,170) rotate(11) scale(1.5)');
      return;
    }

    let animationFrameId: number;

    const frame = (now: number) => {
      const liveScene = document.getElementById('scene');
      const liveYacht = document.getElementById('yacht');
      if (!liveScene || !liveYacht) {
        animationFrameId = requestAnimationFrame(frame);
        return;
      }

      // Calculate progress locally within the scene
      const rect = liveScene.getBoundingClientRect();
      const localScroll = -rect.top;
      // Scene is 300vh, so scrollable distance is 200vh
      let progress = 0;
      if (localScroll > 0) {
        progress = Math.min(1, localScroll / (window.innerHeight * 2));
      }
      
      target = progress;
      smooth = lerp(smooth, target, .08);
      const p = smooth, pe = ease(p);

      const time = (now - t0) / 1000;
      // YACHT: Van Formentera (links, x=200) naar Club Ibiza (rechts, x=1100) met een natuurlijke boog
      const yx = lerp(200, 1100, pe);
      const yy = 550 + Math.sin(pe * Math.PI) * 40 + Math.sin(time * 2) * 5;
      const ys = 1.0; 
      const roll = (yx - 200) / 900 * 5 + Math.sin(time * 1.5) * 2; // slight tilt forward plus bobbing
      liveYacht.setAttribute('transform', `translate(${yx.toFixed(1)}, ${yy.toFixed(1)}) rotate(${roll.toFixed(2)}) scale(${ys.toFixed(3)})`);
      
      const wake = document.getElementById('wake');
      if (wake) wake.setAttribute('opacity', (0.4 + 0.5 * Math.min(1, (pe * (1 - pe)) * 4)).toFixed(3));

      const jet = document.getElementById('jet');
      const trail = document.getElementById('trail');
      if (jet && trail) {
        const jx = lerp(-300, 1600, pe);
        // JET: meer naar onder (y=450 aan de randen, y=300 in het midden) in een boog
        const jy = 450 - Math.sin(pe * Math.PI) * 150;
        
        const dy = -Math.cos(pe * Math.PI) * Math.PI * 150;
        const dx = 1900;
        const bank = Math.atan2(dy, dx) * (180 / Math.PI);
        
        jet.setAttribute('transform', `translate(${jx.toFixed(1)}, ${jy.toFixed(1)}) rotate(${bank.toFixed(2)}) scale(1.5)`);
        trail.setAttribute('opacity', (0.4 + 0.5 * Math.min(1, (pe * (1 - pe)) * 4)).toFixed(3));
      }

      const waves = [document.getElementById('w1'), document.getElementById('w2'), document.getElementById('w3')];
      const drift = p * 120;
      if (waves[0]) waves[0].setAttribute('transform', `translate(${(-((time * 13 + drift) % 180)).toFixed(1)},0)`);
      if (waves[1]) waves[1].setAttribute('transform', `translate(${(-((time * 21 + drift * 1.4) % 180)).toFixed(1)},0)`);
      if (waves[2]) waves[2].setAttribute('transform', `translate(${(-((time * 8  + drift * 0.7) % 180)).toFixed(1)},0)`);

      const tracks = document.querySelectorAll('.waveTrack');
      const page = window.scrollY * 0.25;
      tracks.forEach(tr => {
        const half = tr.clientWidth / 2 || 1;
        (tr as HTMLElement).style.transform = `translateX(${-(page % half)}px)`;
      });

      animationFrameId = requestAnimationFrame(frame);
    };
    animationFrameId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main>

      <div id="top"></div>
      
      <section id="hero-video" className="relative h-screen w-full overflow-hidden bg-black">
        <video autoPlay loop muted playsInline className="absolute inset-0 size-full object-cover opacity-80 [mask-image:linear-gradient(to_bottom,white_60%,transparent)]" src="/hero-ocean.mp4" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="mb-4 tracking-[0.2em] uppercase text-sm md:text-base font-semibold">IBIZA MI VIDA · SEASON 2026</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 drop-shadow-lg">
            Experience the <span className="text-blue-400">real</span> Ibiza.
          </h1>
          <p className="max-w-2xl text-lg md:text-xl drop-shadow-md mb-8">
            Club tickets, private charters and boat parties — hand-picked by locals, confirmed within minutes on WhatsApp.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a href="#deals" className="btn btn--primary hover:scale-105 transition-transform duration-300">See today&apos;s deals ↓</a>
            <span className="text-sm opacity-80 uppercase tracking-widest mt-4">Keep scrolling — the crossing has begun.</span>
          </div>
        </div>
      </section>

      <section id="scene" className="relative h-[300vh] bg-white w-full" aria-label="Branded yacht departing as the Ibiza Mi Vida jet arrives">
        <div id="sceneSticky" className="sticky top-0 h-screen w-full overflow-hidden bg-[linear-gradient(to_bottom,#F4F7F6_0%,#FFFFFF_100%)]">
          {/* Background Video */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            className="absolute inset-0 size-full object-cover mix-blend-overlay opacity-60" 
            src="/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p.mp4#t=90" 
          />
          <div dangerouslySetInnerHTML={{ __html: SVG_SCENE }} className="absolute inset-0 w-full h-full" />
          
          <div className="wave-divider absolute bottom-0 w-full" aria-hidden="true" style={{ marginBottom: '-1px' }}>
            <svg className="wave-track waveTrack" viewBox="0 0 2880 54" preserveAspectRatio="none" style={{ width: '200%', height: '54px' }}>
              <path d="M0 30 Q 120 14 240 30 T 480 30 T 720 30 T 960 30 T 1200 30 T 1440 30 T 1680 30 T 1920 30 T 2160 30 T 2400 30 T 2640 30 T 2880 30 V54 H0 Z" fill="#F6F5F1"/>
            </svg>
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
    <div className="flex items-center justify-center gap-4">
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
        <div className="mb-5 md:mb-6 flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
          Ibiza Clubs
        </h3>
        <p className="text-gray-600">
          From open-air superclubs to legendary techno temples. We provide guaranteed access to the biggest events on the island.
        </p>
      </div>
      <div className="flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 p-6 rounded-2xl hover:shadow-xl bg-white">
        <div className="mb-5 md:mb-6 flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
        </div>
        <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
          Premium VIP Tables
        </h3>
        <p className="text-gray-600">
          Book an exclusive VIP table and enjoy the best service, premium bottles, and a phenomenal view of the DJ.
        </p>
      </div>
      <div className="flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 p-6 rounded-2xl hover:shadow-xl bg-white">
        <div className="mb-5 md:mb-6 flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
