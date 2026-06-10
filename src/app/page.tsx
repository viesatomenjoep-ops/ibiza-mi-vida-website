'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';

const CONFIG = {
  whatsapp: '31683052875',
};

const DEALS = [
  { id:'boat',  kind:'PRIVATE BOAT', title:'VIP Sunset Boat Charter', when:'Today',          price:499, glow:'rgba(46,90,107,.16)', image: 'https://images.unsplash.com/photo-1504735689966-4f12eb87a84e?w=900&q=85' },
  { id:'amni',  kind:'CLUB TICKET',  title:'Amnesia VIP Balcony',     when:'Tonight',         price:129, glow:'rgba(143,166,176,.25)', image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=900&q=85' },
  { id:'ocean', kind:'BOAT PARTY',   title:'Oceanbeat Boat Party',    when:'Today · 14:00',   price:59,  glow:'rgba(46,90,107,.12)', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=900&q=85' },
  { id:'form',  kind:'EXCURSION',    title:'Formentera Day Trip',     when:'Tomorrow',         price:149, glow:'rgba(143,166,176,.2)', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=85' },
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
  <rect width="1440" height="620" fill="url(#skyL)"/>
  <circle cx="660" cy="130" r="120" fill="url(#hazeSun)"/>
  <circle cx="660" cy="130" r="42" fill="#FFFFFF" opacity=".9"/>
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
  <rect y="620" width="1440" height="280" fill="url(#seaL)"/>
  <g stroke="#FFFFFF" stroke-opacity=".35" stroke-width="2" fill="none">
    <path id="w1" d="M-100 668 Q 80 658 260 668 T 620 668 T 980 668 T 1340 668 T 1700 668"/>
    <path id="w2" d="M-100 726 Q 80 714 260 726 T 620 726 T 980 726 T 1340 726 T 1700 726"/>
    <path id="w3" d="M-100 796 Q 80 782 260 796 T 620 796 T 980 796 T 1340 796 T 1700 796"/>
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
    <text x="-78" y="2" font-family="Marcellus, serif" font-size="13" letter-spacing="2.6" fill="#2E5A6B">IBIZA MI VIDA</text>
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

      const yx = lerp(1060, 150, pe);
      const yy = lerp(796, 644, pe) + Math.sin(time * 1.4) * 4 * (1.1 - pe * 0.6);
      const ys = lerp(1.2, 0.5, pe);
      const roll = Math.sin(time * 1.05) * 1.2 * (1 - pe * 0.4);
      liveYacht.setAttribute('transform', `translate(${yx.toFixed(1)}, ${yy.toFixed(1)}) rotate(${roll.toFixed(2)}) scale(${ys.toFixed(3)})`);
      
      const wake = document.getElementById('wake');
      if (wake) wake.setAttribute('opacity', (0.4 + 0.5 * Math.min(1, (pe * (1 - pe)) * 4)).toFixed(3));

      const jet = document.getElementById('jet');
      const trail = document.getElementById('trail');
      if (jet && trail) {
        // Fly steeply downwards towards bottom center-right
        const jx = lerp(-100, 950, pe);
        const jy = lerp(-50, 1000, pe);
        const bank = 35 * (1 - pe * 0.15); // steep downward bank angle
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

      <section id="deals" className="section section--paper">
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

      <section id="week" className="section section--card">
        <div className="container">
          <p className="section__eyebrow reveal">EDITOR'S PICKS</p>
          <h2 className="section__heading reveal" style={{ marginBottom: '2.5rem' }}>Deal of the week.</h2>
          <div className="week-grid">
            <article className="ticket week-feature reveal" style={{ overflow: 'hidden', position: 'relative' }}>
              {/* Added Real Image */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <Image src="/hi-ibiza-2026/FB_IMG_1779623220486.jpg" alt="Hi Ibiza" fill className="object-cover" />
                <div className="panImg" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(420px 300px at 75% 20%, rgba(46,90,107,.16), transparent 70%)' }}></div>
              </div>
              <div style={{ position: 'relative', padding: '2rem 2.25rem', background: 'linear-gradient(to top,#fff,rgba(255,255,255,.88),transparent)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', marginTop: 'auto' }}>
                <p className="section__eyebrow" style={{ marginBottom: '.5rem' }}>CLUB TICKET · VALID ALL WEEK</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3vw,2.25rem)' }}>Hï Ibiza — Access All Areas</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.5rem' }}>€199</span>
                  <a href="https://wa.me/31683052875?text=Hi%20Ibiza%20Mi%20Vida!%20I'd%20like%20to%20book%20H%C3%AF%20Ibiza%20Access%20All%20Areas%20(%E2%82%AC199)"
                     target="_blank" rel="noopener noreferrer" className="btn btn--primary" style={{ fontSize: '14px', padding: '.75rem 1.5rem' }}>Book now</a>
                </div>
              </div>
            </article>

            <div className="week-stack">
              <article className="ticket week-article reveal" style={{ overflow: 'hidden', position: 'relative' }}>
                {/* Added Real Image */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <Image src="/fotos/Vanquish 1.jpg" alt="Luxury Catamaran" fill className="object-cover" />
                  <div className="panImg" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(260px 180px at 70% 20%, rgba(143,166,176,.25), transparent 70%)' }}></div>
                </div>
                <div style={{ position: 'relative', padding: '1.5rem', background: 'linear-gradient(to top,#fff,rgba(255,255,255,.88),transparent)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', marginTop: 'auto' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '.3em', color: 'var(--color-sea)', fontWeight: 700, marginBottom: '.25rem' }}>CATAMARAN · 12 PAX</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Luxury Catamaran</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.75rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>€1,200</span>
                    <a href="https://wa.me/31683052875?text=Hi!%20I'd%20like%20to%20book%20the%20Luxury%20Catamaran%20(%E2%82%AC1%2C200)"
                       target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--color-slate)', fontWeight: 700 }}><span className="kin">Book →</span></a>
                  </div>
                </div>
              </article>

              <article className="ticket week-article reveal" style={{ overflow: 'hidden', position: 'relative' }}>
                {/* Added Real Image */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <Image src="https://images.unsplash.com/photo-1574347781078-d4dd21af64e8?w=900&q=85" alt="O Beach VIP Bed" fill className="object-cover" />
                  <div className="panImg" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(260px 180px at 70% 20%, rgba(46,90,107,.12), transparent 70%)' }}></div>
                </div>
                <div style={{ position: 'relative', padding: '1.5rem', background: 'linear-gradient(to top,#fff,rgba(255,255,255,.88),transparent)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', marginTop: 'auto' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '.3em', color: 'var(--color-sea)', fontWeight: 700, marginBottom: '.25rem' }}>BEACH CLUB</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>O Beach VIP Bed</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.75rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>€450</span>
                    <a href="https://wa.me/31683052875?text=Hi!%20I'd%20like%20to%20book%20an%20O%20Beach%20VIP%20Bed%20(%E2%82%AC450)"
                       target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--color-slate)', fontWeight: 700 }}><span className="kin">Book →</span></a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="charter" className="section section--paper">
        <div className="container">
          <div className="charter-grid">
            <div className="reveal">
              <p className="section__eyebrow">UPGRADE YOUR EXPERIENCE</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.1 }}>
                Make it exclusive — <span style={{ color: 'var(--color-sea)' }}>private</span> yacht charter.
              </h2>
              <p style={{ color: 'var(--color-slate)', marginTop: '1.25rem', fontSize: '15px', lineHeight: 1.65, maxWidth: '28rem' }}>
                Skip the shared crowds. A private boat gives your group the full Ibiza coastline to yourselves — custom route, your own music, your own schedule. Groups of 2–20.
              </p>
              <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <a href="https://wa.me/31683052875?text=Hi!%20I'd%20like%20to%20enquire%20about%20a%20private%20yacht%20charter"
                   target="_blank" rel="noopener noreferrer" className="btn btn--primary">Enquire now</a>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>from €500 <span style={{ color: 'var(--color-slate)', fontWeight: 400 }}>/ charter</span></span>
              </div>
            </div>
            <div className="reveal charter-image" style={{ position: 'relative', overflow: 'hidden' }}>
              <Image src="https://images.unsplash.com/photo-1504735689966-4f12eb87a84e?w=900&q=85" alt="Private Charter" fill className="object-cover" />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(380px 280px at 70% 25%, rgba(46,90,107,.14), transparent 70%)' }}></div>
              <span style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', fontSize: '10px', letterSpacing: '.3em', color: 'white', fontWeight: 700, zIndex: 10 }}>PRIVATE CHARTER</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--card">
        <div className="container">
          <div className="trust-grid">
            <div className="reveal">
              <p className="trust-stat">500+</p>
              <p className="trust-label">Happy guests</p>
              <p className="trust-desc">Every season we help hundreds of guests create unforgettable Ibiza memories.</p>
            </div>
            <div className="reveal">
              <p className="trust-stat">5.0 ★</p>
              <p className="trust-label">Rated excellent</p>
              <p className="trust-desc">Based on 982 reviews across Google and TripAdvisor.</p>
            </div>
            <div className="reveal">
              <p className="trust-stat">~2 min</p>
              <p className="trust-label">WhatsApp reply</p>
              <p className="trust-desc">Real humans, real fast. We reply to every message within minutes — not hours.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="clubs" className="section section--paper">
        <div className="container">
          <div className="section__header reveal">
            <div>
              <p className="section__eyebrow">CLUB TICKETS 2026</p>
              <h2 className="section__heading">The super-clubs.</h2>
            </div>
            <div className="chips">
              {GENRES.map(g => (
                <button key={g} className={`chip ${filter === g ? 'chip--on' : 'chip--off'}`}
                        onClick={() => setFilter(filter === g ? 'All' : g)}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="club-grid">
            {filteredClubs.map(c => (
              <article key={c.name} className="club-card reveal">
                {/* Added Real Image */}
                <div className="club-card__bg">
                  <Image src={c.image} alt={c.name} fill className="object-cover panImg" />
                  <div className="panImg" style={{ position: 'absolute', inset: 0, opacity: .7, background: `radial-gradient(300px 220px at 70% 25%, ${c.glow}, transparent 72%)` }}></div>
                </div>
                <div className="club-card__foot">
                  <div className="club-card__genres">
                    {c.genres.map(tg => (
                      <span key={tg} className="club-card__genre">{tg}</span>
                    ))}
                  </div>
                  <h3 className="club-card__name">{c.name}</h3>
                  <p className="club-card__tag">{c.tag}</p>
                  <a href={waLinkClub(c.name)} target="_blank" rel="noopener noreferrer" className="club-card__cta">
                    See events <span className="club-card__arrow">→</span>
                  </a>
                </div>
              </article>
            ))}
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
