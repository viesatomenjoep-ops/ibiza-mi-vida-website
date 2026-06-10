'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';

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
<svg id="sceneSvg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#DCE2E5"/>
    </linearGradient>
    <linearGradient id="jetL" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#E8ECEE"/>
      <stop offset="100%" stop-color="#B9C5CC"/>
    </linearGradient>
    <linearGradient id="trailL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="beamG" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#7E97A4" stop-opacity=".22"/>
      <stop offset="100%" stop-color="#7E97A4" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <g id="jet">
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

  <g id="yacht">
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
  const [sel, setSel] = useState<string[]>([]);
  const [filter, setFilter] = useState('All');
  const [t, setT] = useState({ h: '00', m: '00', s: '00', flip: { h: false, m: false, s: false } });

  const filteredClubs = useMemo(() => {
    return filter === 'All' ? CLUBS : CLUBS.filter(c => c.genres.includes(filter));
  }, [filter]);

  const total = useMemo(() => {
    return DEALS
      .filter(d => sel.includes(d.id))
      .reduce((s, d) => s + d.price, 0)
      .toLocaleString('en-US');
  }, [sel]);

  const waLink = useMemo(() => {
    const picked = DEALS.filter(d => sel.includes(d.id));
    const lines = picked.map(d => `• ${d.title} (${d.when}) — €${d.price}`).join('\n');
    const sum = picked.reduce((s, d) => s + d.price, 0);
    const msg = `Hi Ibiza Mi Vida! I'd like to book:\n${lines}\n\nTotal: €${sum}`;
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  }, [sel]);

  const waLinkClub = (clubName: string) => {
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Hi! Which events are coming up at ' + clubName + '?')}`;
  };

  const toggle = (id: string) => {
    setSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
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

      const time = (now - t0) / 1000;
      smooth = lerp(smooth, target, .08);
      const p = smooth, pe = ease(p);

      // YACHT: groot blijven (ys=1), van horizon (y=644) naar beneden (y=850), zigzaggend op X
      const yx = lerp(800, 200, pe) + Math.sin(pe * Math.PI * 4) * 80;
      const yy = lerp(644, 850, pe) + Math.sin(time * 2) * 5;
      const ys = 1.0; 
      const roll = Math.sin(time * 1.5) * 2 + Math.cos(pe * Math.PI * 4) * 8;
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
    <>

      <div id="top"></div>
      <section id="scene" aria-label="Branded yacht departing as the Ibiza Mi Vida jet arrives">
        <div id="sceneSticky">
          <video autoPlay loop muted playsInline className="scene-video" src="/ocean.mp4" />
          <div dangerouslySetInnerHTML={{ __html: SVG_SCENE }} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
          <div className="scene-copy">
            <p className="scene-copy__eyebrow">IBIZA MI VIDA · SEASON 2026</p>
            <h1 className="scene-copy__h1">
              Experience the <span className="accent">real</span> Ibiza.
            </h1>
            <p className="scene-copy__p">
              Club tickets, private charters and boat parties — hand-picked by locals, confirmed within minutes on WhatsApp.
            </p>
            <div className="scene-copy__actions">
              <a href="#deals" className="btn btn--primary">See today's deals ↓</a>
              <span className="scene-copy__hint">Keep scrolling — the crossing has begun.</span>
            </div>
          </div>
          <span className="scene-scroll-hint">SCROLL</span>
        </div>
      </section>

      <div className="wave-divider" aria-hidden="true">
        <svg className="wave-track waveTrack" viewBox="0 0 2880 54" preserveAspectRatio="none">
          <path d="M0 30 Q 120 14 240 30 T 480 30 T 720 30 T 960 30 T 1200 30 T 1440 30 T 1680 30 T 1920 30 T 2160 30 T 2400 30 T 2640 30 T 2880 30 V54 H0 Z" fill="#F6F5F1"/>
        </svg>
      </div>

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
              const isSelected = sel.includes(d.id);
              return (
                <button key={d.id} className={`ticket ${isSelected ? 'sel' : ''}`} onClick={() => toggle(d.id)} aria-pressed={isSelected}>
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


<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
  <div className="container">
    <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
      <p className="mb-3 font-semibold md:mb-4">IBIZA 2026</p>
      <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
        Jouw Ultieme Ibiza Party Experience
      </h1>
      <p className="md:text-md">
        Ontdek de beste feesten, boek exclusieve VIP-tafels en bemachtig tickets voor de meest legendarische clubs op Ibiza. Wij regelen jouw onvergetelijke nacht.
      </p>
    </div>
    <div className="flex items-center justify-center gap-4">
      <a href="#clubs" className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
        Boek Club Tickets
      </a>
      <a href="#deals" className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
        Bekijk VIP Tafels
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
            Hï Ibiza access all areas
          </h2>
          <div className="overflow-hidden" style={{ "height": "auto", "opacity": 1 } as React.CSSProperties}>
            <p className="mt-3 md:mt-4">
              Valid all week. €199 per person. Full venue access included.
            </p>
          </div>
        </div>
        <div
          className="cursor-pointer border-b border-border-primary py-6 opacity-25"
        >
          <h2
            className="text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl"
          >
            Hï Ibiza access all areas
          </h2>
          <div className="overflow-hidden" style={{ "height": "0px", "opacity": 0 } as React.CSSProperties}>
            <p className="mt-3 md:mt-4">
              Valid all week. €199 per person. Full venue access included.
            </p>
          </div>
        </div>
        <div
          className="cursor-pointer border-b border-border-primary py-6 opacity-25"
        >
          <h2
            className="text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl"
          >
            Hï Ibiza access all areas
          </h2>
          <div className="overflow-hidden" style={{ "height": "0px", "opacity": 0 } as React.CSSProperties}>
            <p className="mt-3 md:mt-4">
              Valid all week. €199 per person. Full venue access included.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<link
  rel="preload"
  as="image"
  href="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
/>
<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
  <div className="container">
    <div className="flex flex-col items-start">
      <div className="mx-auto mb-12 max-w-lg md:mb-18 lg:mb-20">
        <div>
          <p className="mb-3 text-center font-semibold md:mb-4">
            Ontdek het nachtleven
          </p>
          <h2 className="mb-5 text-center text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            De meest iconische clubs ter wereld
          </h2>
          <p className="text-center md:text-md">
            Ibiza is dé thuisbasis van elektronische muziek. Beleef legendarische feesten in wereldberoemde locaties en dans tot de zon opkomt.
          </p>
        </div>
      </div>
      <div
       
        className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-4"
      >
        <div className="w-full">
          <div className="mb-5 flex justify-center md:mb-6">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
              className="size-12"
              alt="Ibiza Clubs"
            />
          </div>
          <h3 className="mb-3 text-center text-xl font-bold md:mb-4 md:text-2xl">
            Premium VIP Tafels
          </h3>
          <p className="text-center">
            Boek een exclusieve VIP tafel en geniet van de beste service, flessen en een fenomenaal uitzicht op de DJ.
          </p>
        </div>
      </div>
      <div className="mt-12 flex w-full flex-wrap items-center justify-center gap-4 md:mt-18 lg:mt-20">
        <a href="#deals" className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
          Bekijk VIP Tafels
        </a>
        <a href="#clubs" className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
          Meer Info<svg
            stroke="currentColor"
            fill="none"
            strokeWidth="0"
            viewBox="0 0 15 15"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>


<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
  <div className="container">
    <div className="mb-12 md:mb-18 lg:mb-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="mb-3 font-semibold md:mb-4">Clubs & Tickets</p>
        <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          Vind jouw perfecte feest
        </h2>
        <p className="md:text-md">
          Van de hypnotiserende techno in Hï Ibiza tot de klassieke house beats in Pacha. Kies jouw favoriete club en koop direct officiële tickets via Ibiza Mi Vida.
        </p>
      </div>
    </div>
    <div
      className="grid auto-cols-fr grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4"
    >
      <div className="flex flex-col border border-border-primary">
        <div className="flex flex-1 flex-col justify-center p-6">
          <div>
            <p className="mb-2 text-sm font-semibold">House</p>
            <h3 className="mb-2 text-lg font-bold leading-[1.4] md:text-2xl">
              Amnesia
            </h3>
            <p>Ervaar de legendarische sfeer van Amnesia. De ultieme plek voor meeslepende techno en ongeëvenaarde energie.</p>
          </div>
          <div className="mt-5 md:mt-6">
            <button
              className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0"
              title="View"
            >
              View<svg
                stroke="currentColor"
                fill="none"
                strokeWidth="0"
                viewBox="0 0 15 15"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div
          className="flex w-full flex-col items-center justify-center self-start"
        >
          <img
            src="/hi-ibiza-2026/FB_IMG_1779623220486.jpg"
            alt="Amnesia Ibiza"
            className="size-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col border border-border-primary">
        <div className="flex flex-1 flex-col justify-center p-6">
          <div>
            <p className="mb-2 text-sm font-semibold">Disco</p>
            <h3 className="mb-2 text-lg font-bold leading-[1.4] md:text-2xl">
              Pacha Ibiza
            </h3>
            <p>De oudste club van Ibiza. Geniet van iconische house, disco klassiekers en een luxueuze sfeer.</p>
          </div>
          <div className="mt-5 md:mt-6">
            <button
              className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0"
              title="View"
            >
              View<svg
                stroke="currentColor"
                fill="none"
                strokeWidth="0"
                viewBox="0 0 15 15"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div
          className="flex w-full flex-col items-center justify-center self-start"
        >
          <img
            src="/hi-ibiza-2026/FB_IMG_1779623247060.jpg"
            alt="Pacha Ibiza"
            className="size-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col border border-border-primary">
        <div className="flex flex-1 flex-col justify-center p-6">
          <div>
            <p className="mb-2 text-sm font-semibold">Techno</p>
            <h3 className="mb-2 text-lg font-bold leading-[1.4] md:text-2xl">
              Hï Ibiza
            </h3>
            <p>Verkozen tot de #1 club ter wereld. Laat je overdonderen door de spectaculaire lichtshows en cutting-edge elektronische muziek.</p>
          </div>
          <div className="mt-5 md:mt-6">
            <button
              className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0"
              title="View"
            >
              View<svg
                stroke="currentColor"
                fill="none"
                strokeWidth="0"
                viewBox="0 0 15 15"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div
          className="flex w-full flex-col items-center justify-center self-start"
        >
          <img
            src="/hi-ibiza-2026/FB_IMG_1779623300180.jpg"
            alt="Hï Ibiza"
            className="size-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col border border-border-primary">
        <div className="flex flex-1 flex-col justify-center p-6">
          <div>
            <p className="mb-2 text-sm font-semibold">Commercial</p>
            <h3 className="mb-2 text-lg font-bold leading-[1.4] md:text-2xl">
              Ushuaïa Ibiza
            </h3>
            <p>Dans in de openlucht rond het zwembad. De place to be voor de grootste house artiesten en commerciële hits, van zonsondergang tot middernacht.</p>
          </div>
          <div className="mt-5 md:mt-6">
            <button
              className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0"
              title="View"
            >
              View<svg
                stroke="currentColor"
                fill="none"
                strokeWidth="0"
                viewBox="0 0 15 15"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div
          className="flex w-full flex-col items-center justify-center self-start"
        >
          <img
            src="/ushuaia-2026/image_search_1779624236635.jpg"
            alt="Ushuaïa Ibiza"
            className="size-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</section>

      <div className={`drawer ${sel.length > 0 ? 'up' : ''}`} role="status" aria-label={`${sel.length} deals selected, total €${total}`}>
        <div className="drawer__inner">
          <div className="drawer__left">
            <div className={`drawer__counter ${sel.length > 0 ? 'pop' : ''}`}>{sel.length}</div>
            <div className="drawer__meta">
              <p className="drawer__label">{sel.length} deal{sel.length > 1 ? 's' : ''} selected</p>
              <p className="drawer__total">€{total}</p>
            </div>
          </div>
          <div className="drawer__right">
            <button className="drawer__clear" onClick={() => setSel([])}>Clear</button>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn--wa">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.5-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5 0-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.4.6.2 1 .4 1.3.5.6.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3z"/></svg>
              Book via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
