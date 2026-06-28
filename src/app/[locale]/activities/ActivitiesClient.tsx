'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, Users, MapPin, Clock, MessageCircle, Star, Search, SlidersHorizontal, Heart, Navigation, Sunrise, Shield, Baby, Tent } from 'lucide-react';
import '@/styles/club-tickets.css'; // Has similar grid / filter styles

export default function ActivitiesClient({ dict }: { dict?: any }) {
  const [filter, setFilter] = useState('*');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('pop'); // pop, price-asc, price-desc, rating

  const activities = [
    { id: 1, title: 'Titel laadt uit API', cat: 'avontuur', price: 25, rating: 4.8, pop: 8, badge: 'Populair', badgeClass: 'hot' },
    { id: 2, title: 'Titel laadt uit API', cat: 'wellness', price: 32, rating: 4.5, pop: 7, badge: 'Item 2', badgeClass: '' },
    { id: 3, title: 'Titel laadt uit API', cat: 'cultuur', price: 39, rating: 4.8, pop: 6, badge: 'Item 3', badgeClass: '' },
    { id: 4, title: 'Titel laadt uit API', cat: 'familie', price: 46, rating: 4.3, pop: 5, badge: 'Item 4', badgeClass: '' },
    { id: 5, title: 'Titel laadt uit API', cat: 'avontuur', price: 53, rating: 4.6, pop: 4, badge: 'Item 5', badgeClass: '' },
    { id: 6, title: 'Titel laadt uit API', cat: 'wellness', price: 60, rating: 4.9, pop: 3, badge: 'Item 6', badgeClass: '' },
    { id: 7, title: 'Titel laadt uit API', cat: 'cultuur', price: 67, rating: 4.4, pop: 2, badge: 'Item 7', badgeClass: '' },
    { id: 8, title: 'Titel laadt uit API', cat: 'familie', price: 74, rating: 4.7, pop: 1, badge: 'Item 8', badgeClass: '' },
  ];

  const filteredAndSorted = useMemo(() => {
    let result = activities;
    
    // Filter cat
    if (filter !== '*') {
      result = result.filter(a => a.cat === filter);
    }
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(q) || a.cat.toLowerCase().includes(q));
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'pop') return b.pop - a.pop;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
    
    return result;
  }, [activities, filter, searchQuery, sortBy]);

  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Activities</b>
      </div>

      <section className="boat-hero subhero" style={{ background: 'transparent' }}>
        <div className="subhero-bg" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(70% 90% at 0% 0%, var(--mint), transparent 55%), radial-gradient(70% 90% at 100% 0%, rgba(140,191,212,.45), transparent 50%), var(--cotton)' }}></div>
        <div className="inner">
          <div className="eyebrow" style={{ background: 'var(--sage)', color: 'var(--cotton)' }}><div className="dot" style={{ background: 'var(--green)' }}></div> Ervaar Ibiza</div>
          <h1 style={{ color: 'var(--sage)' }}>Activiteiten op <span className="accent" style={{ color: 'var(--blue)' }}>Ibiza</span></h1>
          <p className="lead" style={{ color: 'var(--sage-80)' }}>Meer dan feesten alleen — ontdek wellness, avontuur, cultuur en familie-uitjes op het eiland. Filter en boek je activiteit.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="toolbar">
            <div className="fchips" id="fchips">
              <button className={`fchip ${filter === '*' ? 'on' : ''}`} onClick={() => setFilter('*')}>Alle activiteiten</button>
              <button className={`fchip ${filter === 'avontuur' ? 'on' : ''}`} onClick={() => setFilter('avontuur')}>
                <Tent size={16} />Avontuur
              </button>
              <button className={`fchip ${filter === 'wellness' ? 'on' : ''}`} onClick={() => setFilter('wellness')}>
                <Sunrise size={16} />Wellness
              </button>
              <button className={`fchip ${filter === 'cultuur' ? 'on' : ''}`} onClick={() => setFilter('cultuur')}>
                <Shield size={16} />Cultuur
              </button>
              <button className={`fchip ${filter === 'familie' ? 'on' : ''}`} onClick={() => setFilter('familie')}>
                <Baby size={16} />Familie
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
                      <Sunrise size={32} style={{ margin: '0 auto 6px' }} />
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
                Geen activiteiten gevonden voor deze filters.
              </div>
            )}
          </div>
          
          <button className="loadmore">Laad meer activiteiten</button>

        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="wa-band">
            <svg className="wave-deco" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0 50 Q 25 25 50 50 T 100 50 V 100 H 0 Z" />
            </svg>
            <div>
              <div className="kicker" style={{color:'var(--green)'}}>Speciale wensen?</div>
              <h2>Activiteit op maat</h2>
              <p>Stuur een bericht via WhatsApp en wij regelen een onvergetelijke ervaring voor je groep.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Neem contact op
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>Activiteiten op Ibiza</h2>
          <p>Ibiza is overdag net zo veelzijdig als 's nachts. Van yoga bij zonsopgang en kajakken langs de kust tot het verkennen van het oude Dalt Vila — er is voor elk type bezoeker iets te beleven.</p>
          <p>Filter op categorie, bekijk beoordelingen en boek je activiteit direct online.</p>
        </div>
      </section>
    </>
  );
}
