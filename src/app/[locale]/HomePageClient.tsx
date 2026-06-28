'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight, Star } from 'lucide-react';
import type { CTEventDate, CTVenue } from '@/lib/clubtickets';

// Helper to parse price string to number
function parsePrice(priceStr?: string): number {
  if (!priceStr) return 50;
  const match = priceStr.match(/\d+([.,]\d+)?/);
  if (match) {
    return parseFloat(match[0].replace(',', '.'));
  }
  return 50;
}

// Generate dates until Oct 31st for the datestrip
function generateDatesUntilOct31(locale: string, dict: any) {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let endYear = today.getFullYear();
  if (today.getMonth() > 9) { // past October
    endYear++;
  }
  const endDate = new Date(endYear, 9, 31);

  const current = new Date(today);
  while (current <= endDate) {
    const isToday = current.getTime() === today.getTime();
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    
    dates.push({
      dateObj: new Date(current),
      dateStr: `${yyyy}-${mm}-${dd}`,
      dayName: isToday ? (dict?.today || 'VANDAAG') : new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(current).toUpperCase(),
      dayNum: current.getDate(),
      monthName: new Intl.DateTimeFormat(locale, { month: 'short' }).format(current).toUpperCase(),
      year: current.getFullYear(),
    });
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function HomePageClient({ 
  allEventDates = [], 
  dict = {}, 
  locale = 'nl',
  artists = [],
  venues = []
}: { 
  allEventDates?: CTEventDate[], 
  dict?: any, 
  locale?: string,
  artists?: any[],
  venues?: CTVenue[]
}) {
  const generatedDates = useMemo(() => generateDatesUntilOct31(locale, dict), [locale, dict]);
  const [activeDateStr, setActiveDateStr] = useState<string>(generatedDates[0]?.dateStr || '');
  
  const evtRailRef = useRef<HTMLDivElement>(null);
  const featTrackRef = useRef<HTMLDivElement>(null);

  const scrollRail = (ref: React.RefObject<HTMLDivElement>, dir: number) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.8;
      ref.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    }
  };

  const selectedEvents = useMemo(() => {
    return allEventDates.filter(e => e.date === activeDateStr);
  }, [allEventDates, activeDateStr]);

  const featuredEvents = useMemo(() => {
    return allEventDates.slice(0, 8); // Just grab some events for featured
  }, [allEventDates]);
  
  const dealEvents = useMemo(() => {
    return allEventDates.slice(8, 12); // Just grab some events for deals
  }, [allEventDates]);

  const renderEventCard = (event: CTEventDate, customClass = "ecard") => {
    const priceNum = parsePrice(event.prices);
    return (
      <Link key={`${event.id}-${event.date}`} href={`/${locale}/club-tickets/${event.venueSlug}/${event.eventSlug}`} className={customClass}>
        <div className="media">
          <div className="ph">Foto laadt uit API</div>
          {event.eventCover || event.eventLogo || event.venueCover ? (
             <img src={event.eventCover || event.eventLogo || event.venueCover} alt={event.eventName || event.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 2 }} />
          ) : null}
        </div>
        <div className="body">
          <div className="venue"><MapPin size={12}/> {event.venueName || 'Ibiza'}</div>
          <h3>{event.eventName || event.name}</h3>
          <div className="bot">
            <span className="price">€{priceNum > 0 ? priceNum.toFixed(2) : '50.00'}</span>
            <span className="btn">Tickets <ChevronRight size={14}/></span>
          </div>
        </div>
      </Link>
    );
  };

  const renderDealCard = (event: CTEventDate) => {
    const priceNum = parsePrice(event.prices);
    const origPrice = priceNum + 15; // Fake original price for deals
    return (
      <Link key={`deal-${event.id}`} href={`/${locale}/club-tickets/${event.venueSlug}/${event.eventSlug}`} className="deal-card">
        <div className="media">
          <img src={event.eventCover || event.eventLogo || event.venueCover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600'} alt={event.eventName || event.name} />
          <div className="badge">Deal</div>
        </div>
        <div className="body">
          <div className="venue"><MapPin size={12}/> {event.venueName || 'Ibiza'}</div>
          <h4>{event.eventName || event.name}</h4>
          <div className="bot">
            <div className="price-stack">
              <span className="old">€{origPrice.toFixed(2)}</span>
              <span className="new">€{priceNum.toFixed(2)}</span>
            </div>
            <span className="btn">Boek nu</span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-sun"></div>
        <div className="hero-grain"></div>
        <div className="hero-waves">
          <svg viewBox="0 0 1440 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path className="w w1" d="M-40 250 C 320 180 560 300 820 250 S 1240 190 1480 250 L1480 500 -40 500 Z" fill="#8CBFD4" opacity=".40"/>
            <path className="w w2" d="M-40 320 C 360 250 640 360 960 310 S 1280 270 1480 320 L1480 500 -40 500 Z" fill="#C7EAE3" opacity=".75"/>
            <path className="w w3" d="M-40 380 C 380 330 680 420 1020 375 S 1300 350 1480 385 L1480 500 -40 500 Z" fill="#B3E2A7" opacity=".55"/>
          </svg>
        </div>
        <div className="wrap hero-grid">
          <div className="hero-search-col">
            <span className="eyebrow"><span className="dot"></span>Ibiza {new Date().getFullYear()} seizoen</span>
            <h1 className="hero-search-title">Wat zoek je op <span className="accent">Ibiza</span>?</h1>
            <div className="searchbox">
              <div className="chip-row">
                <button className="chip on">Alles</button>
                <button className="chip">Clubbing</button>
                <button className="chip">Boot</button>
                <button className="chip">Beleven</button>
              </div>
              <div className="search-row">
                <input type="text" placeholder="Welke dagen ben je op Ibiza?" />
                <button className="btn-primary">Zoek</button>
              </div>
              <p className="cal-hint">Of blader door de volledige kalender <Link href={`/${locale}/calendar`} className="cal-link">→ open kalender</Link></p>
              <div className="month-row">
                <span className="month on">Jun {new Date().getFullYear()}</span>
                <span className="month">Jul {new Date().getFullYear()}</span>
                <span className="month">Aug {new Date().getFullYear()}</span>
                <span className="month">Sep {new Date().getFullYear()}</span>
                <span className="month">Okt {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
          <div className="triptile">
            <Link className="tseg s1" href={`/${locale}/club-tickets/ushuaia-ibiza`}>
              <div className="ph" style={{backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600')", backgroundSize: 'cover'}} />
              <b>Ushuaïa Ibiza</b>
              <span className="go">Bekijk <ChevronRight size={14}/></span>
            </Link>
            <Link className="tseg s2" href={`/${locale}/club-tickets/hi-ibiza`}>
              <div className="ph" style={{backgroundImage: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600')", backgroundSize: 'cover'}} />
              <b>Hï Ibiza</b>
              <span className="go">Bekijk <ChevronRight size={14}/></span>
            </Link>
            <Link className="tseg s3" href={`/${locale}/club-tickets/unvrs`}>
              <div className="ph" style={{backgroundImage: "url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600')", backgroundSize: 'cover'}} />
              <b>[UNVRS]</b>
              <span className="go">Bekijk <ChevronRight size={14}/></span>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY RAIL */}
      <div className="cats">
        <div className="wrap">
          <div className="cat-scroll" id="catScroll">
            <Link className="cat" href={`/${locale}/calendar`}><div className="bubble"><Calendar /></div><small>Kalender</small></Link>
            <Link className="cat" href={`/${locale}/deals-of-the-day`}><div className="bubble"><Star /></div><small>Deals of the Day</small></Link>
            <Link className="cat" href={`/${locale}/artists`}><div className="bubble"><Star /></div><small>Artiesten</small></Link>
            <Link className="cat" href={`/${locale}/club-tickets`}><div className="bubble"><Star /></div><small>Club Tickets</small></Link>
            <Link className="cat" href={`/${locale}/clubs`}><div className="bubble"><Star /></div><small>Clubs Ibiza</small></Link>
            <Link className="cat" href={`/${locale}/boat-parties`}><div className="bubble"><Star /></div><small>Bootfeesten</small></Link>
            <Link className="cat" href={`/${locale}/private-boat-charters`}><div className="bubble"><Star /></div><small>Boat Charters</small></Link>
            <Link className="cat" href={`/${locale}/boat-party`}><div className="bubble"><Star /></div><small>Boat Party</small></Link>
            <Link className="cat" href={`/${locale}/formentera-boat-trips`}><div className="bubble"><Star /></div><small>Ferry Formentera</small></Link>
          </div>
        </div>
      </div>

      {/* NEXT EVENTS */}
      <section className="block" id="events">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Wat speelt er nu</div>
              <h2>Eerstvolgende events</h2>
              <p>Kies een dag en zie precies welke feesten er die avond zijn.</p>
            </div>
            <div className="arrows">
              <button onClick={() => scrollRail(evtRailRef, -1)} aria-label="Vorige"><ChevronRight className="rotate-180" /></button>
              <button onClick={() => scrollRail(evtRailRef, 1)} aria-label="Volgende"><ChevronRight /></button>
            </div>
          </div>
          <div className="datestrip" id="dateStrip">
            {generatedDates.slice(0, 14).map(d => (
               <div key={d.dateStr} className={`dpill ${activeDateStr === d.dateStr ? 'on' : ''}`} onClick={() => setActiveDateStr(d.dateStr)}>
                 <small>{d.dayName}</small>
                 <b>{d.dayNum}</b>
               </div>
            ))}
          </div>
          <div className="evt-rail" id="evtRail" ref={evtRailRef}>
            {selectedEvents.length > 0 ? (
               selectedEvents.map(e => renderEventCard(e))
            ) : (
               <p style={{padding: '20px'}}>Geen events gevonden op deze datum.</p>
            )}
          </div>
        </div>
      </section>

      {/* ONZE UITGELICHTE */}
      <section className="block alt" id="featured">
        <div className="wrap">
          <div className="sec-head">
            <div className="l"><div className="kicker">Handgekozen</div><h2>Onze uitgelichte</h2>
              <p>De parties, boats en experiences waar wij deze week niet over uitgepraat raken.</p></div>
              <div className="arrows">
                <button onClick={() => scrollRail(featTrackRef, -1)} aria-label="Vorige"><ChevronRight className="rotate-180" /></button>
                <button onClick={() => scrollRail(featTrackRef, 1)} aria-label="Volgende"><ChevronRight /></button>
              </div>
          </div>
          <div className="slider">
            <div className="slider-track" ref={featTrackRef} style={{display: 'flex', gap: '18px', overflowX: 'auto', scrollbarWidth: 'none', scrollSnapType: 'x mandatory'}}>
              {featuredEvents.map(e => renderEventCard(e, "ecard feat"))}
            </div>
          </div>
        </div>
      </section>

      {/* DEALS BAND */}
      <section className="block">
        <div className="wrap">
          <div className="deal-band" style={{position: 'relative', borderRadius: '26px', background: 'var(--sage)', color: 'var(--cotton)', padding: '50px', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '40px'}}>
            <div className="deal-bg" style={{position: 'absolute', inset: 0, opacity: 0.15, background: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"2\" cy=\"2\" r=\"1\" fill=\"%23fff\"/%3E%3C/svg%3E')"}}></div>
            <div className="txt" style={{flex: 1, position: 'relative', zIndex: 2}}>
              <div className="kicker" style={{color: 'var(--green)'}}>Flash kortingen</div>
              <h2 style={{fontSize: '34px', fontWeight: 900, marginBottom: '10px'}}>Deals of the Day</h2>
              <p style={{opacity: 0.8, maxWidth: '40ch'}}>Elke dag nieuwe scherpe aanbiedingen voor de heetste events. Wees er snel bij, want op = op.</p>
              <Link href={`/${locale}/deals-of-the-day`} className="btn-primary" style={{marginTop: '20px', display: 'inline-flex', width: 'auto'}}>Alle deals bekijken</Link>
            </div>
            <div className="deal-grid" style={{flex: 1.5, position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px'}}>
              {dealEvents.map(e => renderDealCard(e))}
            </div>
          </div>
        </div>
      </section>

      {/* REGIONS/CITIES SECTION */}
      <section className="block alt" id="regions">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Locaties</div>
              <h2>Ontdek de top locaties</h2>
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px'}}>
             <Link href={`/${locale}/locations/playa-den-bossa`} style={{position: 'relative', height: '160px', borderRadius: '20px', overflow: 'hidden'}}>
                <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600" alt="Playa d'en Bossa" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'}} />
                <h4 style={{position: 'absolute', bottom: '16px', left: '16px', color: 'white', fontWeight: 900, fontSize: '18px'}}>Playa d'en Bossa</h4>
             </Link>
             <Link href={`/${locale}/locations/san-antonio`} style={{position: 'relative', height: '160px', borderRadius: '20px', overflow: 'hidden'}}>
                <img src="https://images.unsplash.com/photo-1567606403063-832128ce3a00?q=80&w=600" alt="San Antonio" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'}} />
                <h4 style={{position: 'absolute', bottom: '16px', left: '16px', color: 'white', fontWeight: 900, fontSize: '18px'}}>San Antonio</h4>
             </Link>
             <Link href={`/${locale}/locations/ibiza-town`} style={{position: 'relative', height: '160px', borderRadius: '20px', overflow: 'hidden'}}>
                <img src="https://images.unsplash.com/photo-1510444589-9807fa7de323?q=80&w=600" alt="Ibiza Town" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'}} />
                <h4 style={{position: 'absolute', bottom: '16px', left: '16px', color: 'white', fontWeight: 900, fontSize: '18px'}}>Ibiza Town</h4>
             </Link>
             <Link href={`/${locale}/locations/formentera`} style={{position: 'relative', height: '160px', borderRadius: '20px', overflow: 'hidden'}}>
                <img src="https://images.unsplash.com/photo-1601004146039-49339e723cc5?q=80&w=600" alt="Formentera" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'}} />
                <h4 style={{position: 'absolute', bottom: '16px', left: '16px', color: 'white', fontWeight: 900, fontSize: '18px'}}>Formentera</h4>
             </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
