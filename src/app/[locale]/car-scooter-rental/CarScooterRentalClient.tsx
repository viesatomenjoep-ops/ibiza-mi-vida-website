'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, MessageCircle, Star, Search, SlidersHorizontal, Heart, CarFront, Bike, Car, Navigation } from 'lucide-react';
import '@/styles/club-tickets.css'; // Re-using styles

export default function CarScooterRentalClient({ dict }: { dict?: any }) {
  const [filter, setFilter] = useState('*');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('pop');

  const rentals = [
    { id: 1, title: 'Titel laadt uit API', cat: 'auto', price: 25, rating: 4.2, pop: 6, badge: 'Populair', badgeClass: 'hot' },
    { id: 2, title: 'Titel laadt uit API', cat: 'scooter', price: 32, rating: 4.5, pop: 5, badge: 'Item 2', badgeClass: '' },
    { id: 3, title: 'Titel laadt uit API', cat: 'cabrio', price: 39, rating: 4.8, pop: 4, badge: 'Item 3', badgeClass: '' },
    { id: 4, title: 'Titel laadt uit API', cat: 'quad', price: 46, rating: 4.3, pop: 3, badge: 'Item 4', badgeClass: '' },
    { id: 5, title: 'Titel laadt uit API', cat: 'auto', price: 53, rating: 4.6, pop: 2, badge: 'Item 5', badgeClass: '' },
    { id: 6, title: 'Titel laadt uit API', cat: 'scooter', price: 60, rating: 4.9, pop: 1, badge: 'Item 6', badgeClass: '' },
  ];

  const filteredAndSorted = useMemo(() => {
    let result = rentals;
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
  }, [rentals, filter, searchQuery, sortBy]);

  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Car & Scooter Rental</b>
      </div>

      <section className="boat-hero subhero" style={{ background: 'transparent' }}>
        <div className="subhero-bg" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(70% 90% at 0% 0%, var(--mint), transparent 55%), radial-gradient(70% 90% at 100% 0%, rgba(140,191,212,.45), transparent 50%), var(--cotton)' }}></div>
        <div className="inner">
          <div className="eyebrow" style={{ background: 'var(--sage)', color: 'var(--cotton)' }}><div className="dot" style={{ background: 'var(--green)' }}></div> Ibiza Vervoer</div>
          <h1 style={{ color: 'var(--sage)' }}>Huur je <span className="accent" style={{ color: 'var(--blue)' }}>vervoer op Ibiza</span></h1>
          <p className="lead" style={{ color: 'var(--sage-80)' }}>Vrijheid om het eiland te ontdekken. Van een wendbare scooter voor de stad tot een comfortabele huurauto of snelle quad.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="toolbar">
            <div className="fchips" id="fchips">
              <button className={`fchip ${filter === '*' ? 'on' : ''}`} onClick={() => setFilter('*')}>Alle voertuigen</button>
              <button className={`fchip ${filter === 'auto' ? 'on' : ''}`} onClick={() => setFilter('auto')}>
                <CarFront size={16} />Auto
              </button>
              <button className={`fchip ${filter === 'scooter' ? 'on' : ''}`} onClick={() => setFilter('scooter')}>
                <Bike size={16} />Scooter
              </button>
              <button className={`fchip ${filter === 'cabrio' ? 'on' : ''}`} onClick={() => setFilter('cabrio')}>
                <Car size={16} />Cabrio
              </button>
              <button className={`fchip ${filter === 'quad' ? 'on' : ''}`} onClick={() => setFilter('quad')}>
                <Navigation size={16} />Quad
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
                      <CarFront size={32} style={{ margin: '0 auto 6px' }} />
                      <div>Foto laadt uit API</div>
                    </div>
                  </div>
                </div>
                <div className="body">
                  <h3>{item.title}</h3>
                  <div className="lrow"><MapPin size={14} /> Ophaallocatie uit API</div>
                  <div className="lrow">
                    <span className="lrating">
                      <Star size={14} fill="currentColor" stroke="none" style={{ color: 'var(--green)' }} /> 
                      {item.rating} <span style={{color:'var(--sage-55)', fontWeight:600}}>(uit API)</span>
                    </span>
                  </div>
                  <div className="lfoot">
                    <div className="price"><small>Vanaf</small><b>{item.price}€ / dag</b></div>
                    <button className="mini">Huur</button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredAndSorted.length === 0 && (
              <div style={{ padding: '40px 0', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--sage-55)' }}>
                Geen voertuigen gevonden voor deze filters.
              </div>
            )}
          </div>
          
          <button className="loadmore">Laad meer voertuigen</button>

        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="wa-band">
            <svg className="wave-deco" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0 50 Q 25 25 50 50 T 100 50 V 100 H 0 Z" />
            </svg>
            <div>
              <div className="kicker" style={{color:'var(--green)'}}>Luxe of speciaal vervoer?</div>
              <h2>Exclusieve verhuur</h2>
              <p>Stuur een bericht via WhatsApp als je op zoek bent naar een luxe SUV, sportwagen of VIP-vervoer met chauffeur.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Neem contact op
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>Vervoer huren op Ibiza</h2>
          <p>Een eigen voertuig geeft je de vrijheid om Ibiza in je eigen tempo te ontdekken. Rijd naar afgelegen stranden die met de bus onbereikbaar zijn, of pak snel een scooter om de drukte van Ibiza-stad te vermijden.</p>
          <p>Vergelijk prijzen, kies het voertuig dat bij jouw plannen past, en boek online zodat je bij aankomst direct kunt instappen.</p>
        </div>
      </section>
    </>
  );
}
