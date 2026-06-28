'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, MessageCircle, Star, Search, SlidersHorizontal, Heart, Navigation, Sailboat, LifeBuoy } from 'lucide-react';
import '@/styles/club-tickets.css'; // Re-using styles

export default function WaterSportsClient({ dict }: { dict?: any }) {
  const [filter, setFilter] = useState('*');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('pop');

  const sports = [
    { id: 1, title: 'Titel laadt uit API', cat: 'jetski', price: 25, rating: 4.8, pop: 8, badge: 'Populair', badgeClass: 'hot' },
    { id: 2, title: 'Titel laadt uit API', cat: 'duiken', price: 32, rating: 4.5, pop: 7, badge: 'Item 2', badgeClass: '' },
    { id: 3, title: 'Titel laadt uit API', cat: 'paddle', price: 39, rating: 4.8, pop: 6, badge: 'Item 3', badgeClass: '' },
    { id: 4, title: 'Titel laadt uit API', cat: 'parasail', price: 46, rating: 4.3, pop: 5, badge: 'Item 4', badgeClass: '' },
    { id: 5, title: 'Titel laadt uit API', cat: 'jetski', price: 53, rating: 4.6, pop: 4, badge: 'Item 5', badgeClass: '' },
    { id: 6, title: 'Titel laadt uit API', cat: 'duiken', price: 60, rating: 4.9, pop: 3, badge: 'Item 6', badgeClass: '' },
    { id: 7, title: 'Titel laadt uit API', cat: 'paddle', price: 67, rating: 4.4, pop: 2, badge: 'Item 7', badgeClass: '' },
    { id: 8, title: 'Titel laadt uit API', cat: 'parasail', price: 74, rating: 4.7, pop: 1, badge: 'Item 8', badgeClass: '' },
  ];

  const filteredAndSorted = useMemo(() => {
    let result = sports;
    if (filter !== '*') result = result.filter(a => a.cat === filter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(q) || a.cat.toLowerCase().includes(q));
    }
    result = [...result].sort((a, b) => {
      if (sortBy === 'pop') return b.pop - a.pop;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
    return result;
  }, [sports, filter, searchQuery, sortBy]);

  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Watersport</b>
      </div>

      <section className="boat-hero subhero" style={{ background: 'transparent' }}>
        <div className="subhero-bg" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(70% 90% at 0% 0%, var(--mint), transparent 55%), radial-gradient(70% 90% at 100% 0%, rgba(140,191,212,.45), transparent 50%), var(--cotton)' }}></div>
        <div className="inner">
          <div className="eyebrow" style={{ background: 'var(--sage)', color: 'var(--cotton)' }}><div className="dot" style={{ background: 'var(--green)' }}></div> Ervaar Ibiza</div>
          <h1 style={{ color: 'var(--sage)' }}>Watersport op <span className="accent" style={{ color: 'var(--blue)' }}>de zee</span></h1>
          <p className="lead" style={{ color: 'var(--sage-80)' }}>Verken het water rondom Ibiza. Voor actie op een jetski of de rust van het suppen tijdens een zonsondergang.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="toolbar">
            <div className="fchips" id="fchips">
              <button className={`fchip ${filter === '*' ? 'on' : ''}`} onClick={() => setFilter('*')}>Alle sporten</button>
              <button className={`fchip ${filter === 'jetski' ? 'on' : ''}`} onClick={() => setFilter('jetski')}>
                <Navigation size={16} style={{transform:'rotate(90deg)'}} />Jetski
              </button>
              <button className={`fchip ${filter === 'duiken' ? 'on' : ''}`} onClick={() => setFilter('duiken')}>
                <LifeBuoy size={16} />Duiken
              </button>
              <button className={`fchip ${filter === 'paddle' ? 'on' : ''}`} onClick={() => setFilter('paddle')}>
                <Sailboat size={16} />Paddle
              </button>
              <button className={`fchip ${filter === 'parasail' ? 'on' : ''}`} onClick={() => setFilter('parasail')}>
                <LifeBuoy size={16} />Parasail
              </button>
            </div>
            
            <div className="searchmini">
              <input 
                type="text" 
                placeholder="Zoeken…" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button aria-label="Zoek">
                <Search size={18} />
              </button>
            </div>
            
            <div style={{ position: 'relative' }}>
              <button className="sortsel" onClick={() => setSortBy(sortBy === 'pop' ? 'price-asc' : 'pop')}>
                <SlidersHorizontal size={15} />
                <span>{sortBy === 'pop' ? 'Sorteer' : sortBy}</span>
              </button>
            </div>
          </div>
          
          <div className="results-meta"><span>{filteredAndSorted.length}</span> resultaten · live uit ClubTickets API</div>
          
          <div className="listing" id="listingGrid">
            {filteredAndSorted.map((item) => (
              <div key={item.id} className="lcard in">
                <div className="media">
                  {item.badge && <span className={`lbadge ${item.badgeClass}`}>{item.badge}</span>}
                  <button className="lfav" aria-label="Bewaar">
                    <Heart size={18} />
                  </button>
                  <div className="ph">
                    <div style={{textAlign:'center'}}>
                      <LifeBuoy size={32} style={{ margin: '0 auto 6px' }} />
                      <div>Foto laadt uit API</div>
                    </div>
                  </div>
                </div>
                <div className="body">
                  <h3>{item.title}</h3>
                  <div className="lrow"><MapPin size={14} /> Locatie · duur uit API</div>
                  <div className="lrow">
                    <span className="lrating">
                      <Star size={14} fill="currentColor" stroke="none" style={{ color: 'var(--green)' }} /> 
                      {item.rating} <span style={{color:'var(--sage-55)', fontWeight:600}}>(uit API)</span>
                    </span>
                  </div>
                  <div className="lfoot">
                    <div className="price"><small>Vanaf</small><b>{item.price}€</b></div>
                    <button className="mini">Bekijk</button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredAndSorted.length === 0 && (
              <div style={{ padding: '40px 0', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--sage-55)' }}>
                Geen watersport gevonden voor deze filters.
              </div>
            )}
          </div>
          
          <button className="loadmore">Laad meer sporten</button>

        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="wa-band">
            <svg className="wave-deco" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0 50 Q 25 25 50 50 T 100 50 V 100 H 0 Z" />
            </svg>
            <div>
              <div className="kicker" style={{color:'var(--green)'}}>Met de hele groep?</div>
              <h2>Groepsactiviteit</h2>
              <p>Stuur een bericht via WhatsApp en wij maken een gereduceerde pakketprijs voor grote groepen.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Neem contact op
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>Watersport op Ibiza</h2>
          <p>Het kristalheldere water van Ibiza is perfect voor watersport. Van een adrenalinestoot op de jetski tot rustig peddelen bij zonsopgang of de onderwaterwereld ontdekken tijdens een duik — er is iets voor elk niveau.</p>
          <p>Kies je sport, check het vereiste niveau en boek je sessie online.</p>
        </div>
      </section>
    </>
  );
}
