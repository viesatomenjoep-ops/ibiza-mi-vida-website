'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CTEventDate, CTVenue } from '@/lib/clubtickets';

// --- SVGs ---
const SearchIcon = () => <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>;
const ChevronRight = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>;
const MapPin = () => <svg viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2"/></svg>;
const CalendarIcon = () => <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>;
const ImagePlaceholderIcon = () => <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 15l5-5 4 4 3-3 6 6"/><circle cx="9" cy="9" r="1.5"/></svg>;
const ArrowRight = () => <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>;

// --- Helper Functions ---
function parsePrice(priceStr?: string): number {
  if (!priceStr) return 0;
  const match = priceStr.match(/\d+([.,]\d+)?/);
  if (match) return parseFloat(match[0].replace(',', '.'));
  return 0;
}

function generateDatesUntilOct31(locale: string) {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let endYear = today.getFullYear();
  if (today.getMonth() > 9) endYear++;
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
      dayName: isToday ? 'Vandaag' : new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(current).toUpperCase(),
      dayNum: current.getDate(),
      monthName: new Intl.DateTimeFormat(locale, { month: 'short' }).format(current).toUpperCase(),
      year: current.getFullYear(),
    });
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// --- Component ---
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
  const router = useRouter();
  const generatedDates = useMemo(() => generateDatesUntilOct31(locale), [locale]);
  const [activeDateStr, setActiveDateStr] = useState<string>(generatedDates[0]?.dateStr || '');
  
  const evtRailRef = useRef<HTMLDivElement>(null);
  const featTrackRef = useRef<HTMLDivElement>(null);

  const scrollRail = (ref: React.RefObject<HTMLDivElement>, dir: number) => {
    if (ref.current) {
      const scrollAmount = Math.max(ref.current.clientWidth * 0.8, 260);
      ref.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    }
  };

  const selectedEvents = useMemo(() => {
    return allEventDates.filter(e => e.date === activeDateStr);
  }, [allEventDates, activeDateStr]);

  const featuredEvents = useMemo(() => {
    return allEventDates.slice(0, 6);
  }, [allEventDates]);
  
  const dealEvents = useMemo(() => {
    return allEventDates.slice(6, 10);
  }, [allEventDates]);

  // Entrance animation for cards
  useEffect(() => {
    const cards = document.querySelectorAll('.ecard:not(.in)');
    if (!('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const rail = e.target.parentElement;
          const sibs = Array.from(rail?.querySelectorAll('.ecard') || []);
          const idx = sibs.indexOf(e.target as Element);
          (e.target as HTMLElement).style.transitionDelay = (Math.min(idx, 6) * 0.07) + 's';
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(c => io.observe(c));
    setTimeout(() => cards.forEach(c => c.classList.add('in')), 1400);
    return () => io.disconnect();
  }, [activeDateStr, selectedEvents]);

  // Search/Hero logic
  const [activeChip, setActiveChip] = useState('Alles');
  const [searchValue, setSearchValue] = useState('');

  const handleHeroSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchValue) {
      // In a real app we'd open the search overlay here.
      // For now, since the overlay logic is usually in a global Layout or Navbar, 
      // we can simulate it or navigate to a search page.
      // Easiest is to trigger a custom event that the navbar listens to:
      window.dispatchEvent(new CustomEvent('open-search', { detail: searchValue }));
    } else {
      const dest: Record<string, string> = { 'Alles': '', 'Clubbing': `/${locale}/nightlife`, 'Boot': `/${locale}/boats`, 'Beleven': `/${locale}/activities` };
      if (dest[activeChip]) {
        router.push(dest[activeChip]);
      } else {
        window.dispatchEvent(new CustomEvent('open-search', { detail: '' }));
      }
    }
  };

  const renderEventCard = (event: CTEventDate) => {
    const priceNum = parsePrice(event.prices);
    const dateObj = generatedDates.find(d => d.dateStr === event.date);
    const dayBadge = dateObj ? dateObj.dayName : 'Day';
    const isNight = event.eventLogo?.toLowerCase().includes('night') ? 'Night' : 'Day';

    return (
      <Link key={`${event.id}-${event.date}`} href={`/${locale}/club-tickets/${event.venueSlug}/${event.eventSlug}`} className="ecard">
        <div className="media">
          <span className="badge">{event.venueName || 'Ibiza'}</span>
          <span className={`badge day ${isNight === 'Night' ? '' : 'day'}`}>{isNight}</span>
          <div className="ph">
            <div style={{ textAlign: 'center' }}>
              <ImagePlaceholderIcon />
              <div>Afbeelding uit API</div>
            </div>
          </div>
          {(event.eventCover || event.eventLogo || event.venueCover) && (
            <img src={event.eventCover || event.eventLogo || event.venueCover} alt={event.eventName || event.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
          )}
        </div>
        <div className="body">
          <h3>{event.eventName || event.name}</h3>
          <div className="meta"><CalendarIcon/> {dateObj?.dayNum} {dateObj?.monthName} · {event.venueName}</div>
          <div className="meta"><ClockIcon/> 23:00 - 06:00</div>
          <div className="foot">
            <div className="price"><small>Vanaf</small><b>{priceNum > 0 ? `€${priceNum.toFixed(2)}` : '—€'}</b></div>
            <span className="mini">Tickets</span>
          </div>
        </div>
      </Link>
    );
  };

  const renderFeaturedCard = (event: CTEventDate, idx: number) => {
    const priceNum = parsePrice(event.prices);
    const badges = ['Tonight', 'Populair', 'Nieuw', 'Hot', 'Sunset', 'Deal'];
    const badge = badges[idx % badges.length];
    
    return (
      <Link key={`feat-${event.id}`} href={`/${locale}/club-tickets/${event.venueSlug}/${event.eventSlug}`} className="featcard">
        <span className="fbadge">{badge}</span>
        <div className="ph">Foto laadt uit API</div>
        {(event.eventCover || event.eventLogo || event.venueCover) && (
          <img src={event.eventCover || event.eventLogo || event.venueCover} alt={event.eventName || event.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
        )}
        <span className="fcat">Clubbing</span>
        <h3>{event.eventName || event.name}</h3>
        <div className="fpr">
          <div><small>Vanaf</small><b>{priceNum > 0 ? `€${priceNum.toFixed(2)}` : '—€'}</b></div>
          <span className="fgo"><ArrowRight /></span>
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
            <path className="w w1" d="M-40 250 C 320 180 560 300 820 250 S 1240 190 1480 250 L1480 500 -40 500 Z" fill="var(--blue)" opacity=".40"/>
            <path className="w w2" d="M-40 320 C 360 250 640 360 960 310 S 1280 270 1480 320 L1480 500 -40 500 Z" fill="var(--mint)" opacity=".75"/>
            <path className="w w3" d="M-40 380 C 380 330 680 420 1020 375 S 1300 350 1480 385 L1480 500 -40 500 Z" fill="var(--green)" opacity=".55"/>
          </svg>
        </div>
        
        <div className="wrap hero-grid">
          <div className="hero-search-col">
            <span className="eyebrow">
              <span className="dot"></span>Ibiza {new Date().getFullYear()} seizoen
            </span>
            <h1 className="hero-search-title">Wat zoek je op <span className="accent">Ibiza</span>?</h1>
            
            <form className="searchbox" onSubmit={handleHeroSearch}>
              <div className="chip-row">
                {['Alles', 'Clubbing', 'Boot', 'Beleven'].map(chip => (
                  <button 
                    key={chip} 
                    type="button" 
                    className={`chip ${activeChip === chip ? 'on' : ''}`}
                    onClick={() => setActiveChip(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="search-row">
                <input 
                  type="text" 
                  placeholder="Welke dagen ben je op Ibiza?" 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="submit" className="btn-primary">
                  Zoek <SearchIcon />
                </button>
              </div>
              <p className="cal-hint">Of blader door de volledige kalender <Link href={`/${locale}/calendar`} className="cal-link">→ open kalender</Link></p>
              <div className="month-row">
                <Link href={`/${locale}/calendar`} className="month on">Jun {new Date().getFullYear()}</Link>
                <Link href={`/${locale}/calendar`} className="month">Jul {new Date().getFullYear()}</Link>
                <Link href={`/${locale}/calendar`} className="month">Aug {new Date().getFullYear()}</Link>
                <Link href={`/${locale}/calendar`} className="month">Sep {new Date().getFullYear()}</Link>
                <Link href={`/${locale}/calendar`} className="month">Okt {new Date().getFullYear()}</Link>
              </div>
            </form>
          </div>
          
          <div className="triptile">
            <Link className="tseg s1" href={`/${locale}/club-tickets/ushuaia-ibiza`}>
              <div className="ph">Foto Ushuaia</div>
              <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600" alt="Ushuaia" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              <b>Ushuaïa Ibiza</b>
              <span className="go">Bekijk <ChevronRight /></span>
            </Link>
            <Link className="tseg s2" href={`/${locale}/club-tickets/hi-ibiza`}>
              <div className="ph">Foto Hi</div>
              <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600" alt="Hï Ibiza" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              <b>Hï Ibiza</b>
              <span className="go">Bekijk <ChevronRight /></span>
            </Link>
            <Link className="tseg s3" href={`/${locale}/club-tickets/unvrs`}>
              <div className="ph">Foto UNVRS</div>
              <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600" alt="[UNVRS]" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              <b>[UNVRS]</b>
              <span className="go">Bekijk <ChevronRight /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY RAIL */}
      <div className="cats">
        <div className="wrap">
          <div className="cat-scroll">
            <Link className="cat" href={`/${locale}/calendar`}><div className="bubble"><svg viewBox="0 0 24 24"><path d="M3 4h18v18H3zM3 10h18M8 2v4M16 2v4"/></svg></div><small>Kalender</small></Link>
            <Link className="cat" href={`/${locale}/deals-of-the-day`}><div className="bubble"><svg viewBox="0 0 24 24"><path d="M20 12V8a2 2 0 0 0-2-2h-3l-1.5 9L12 6l-1.5 9L9 6H6a2 2 0 0 0-2 2v4M4 12l1 8h14l1-8"/></svg></div><small>Deals of the Day</small></Link>
            <Link className="cat" href={`/${locale}/club-tickets`}><div className="bubble"><svg viewBox="0 0 24 24"><path d="M2 18l10-7 10 7M4 18v3h16v-3M9 18v-4h6v4"/></svg></div><small>Club Tickets</small></Link>
            <Link className="cat" href={`/${locale}/nightlife`}><div className="bubble"><svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 9v.01M9 13v.01"/></svg></div><small>Clubs Ibiza</small></Link>
            <Link className="cat" href={`/${locale}/bootfeesten`}><div className="bubble"><svg viewBox="0 0 24 24"><path d="M3 14l9-4 9 4-2 6H5l-2-6zM12 10V4"/></svg></div><small>Bootfeesten</small></Link>
            <Link className="cat" href={`/${locale}/boat-charters`}><div className="bubble"><svg viewBox="0 0 24 24"><path d="M4 16s1-2 8-2 8 2 8 2M6 16l-2 4M18 16l2 4M9 6a3 3 0 1 1 6 0"/></svg></div><small>Boat Charters</small></Link>
            <Link className="cat" href={`/${locale}/activities`}><div className="bubble"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></div><small>Activities</small></Link>
            <Link className="cat" href={`/${locale}/ferry-formentera`}><div className="bubble"><svg viewBox="0 0 24 24"><path d="M5 16l14-7M5 9l14 7M3 18h18"/></svg></div><small>Ferry Formentera</small></Link>
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
              <button onClick={() => scrollRail(evtRailRef, -1)} aria-label="Vorige">
                <ChevronRight className="rotate-180" style={{ transform: 'rotate(180deg)' }} />
              </button>
              <button onClick={() => scrollRail(evtRailRef, 1)} aria-label="Volgende">
                <ChevronRight />
              </button>
            </div>
          </div>
          
          <div className="datestrip" id="dateStrip">
            {generatedDates.slice(0, 14).map(d => (
              <div key={d.dateStr} className={`dpill ${activeDateStr === d.dateStr ? 'on' : ''}`} onClick={() => setActiveDateStr(d.dateStr)}>
                <b>{d.dayNum}</b>
                <small>{d.dayName}</small>
              </div>
            ))}
          </div>
          
          <div className="evt-rail" id="evtRail" ref={evtRailRef}>
            {selectedEvents.length > 0 ? (
              selectedEvents.map(e => renderEventCard(e))
            ) : (
              <div style={{ padding: '20px', color: 'var(--sage-55)', fontWeight: 600 }}>Geen events gevonden op deze datum.</div>
            )}
          </div>
          
          <div style={{ marginTop: '14px' }}>
            <span className="api-note">
              <span className="pulse"></span>Events laden uit ClubTickets API
            </span>
          </div>
        </div>
      </section>

      {/* ONZE UITGELICHTE */}
      <section className="block alt" id="featured">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Handgekozen</div>
              <h2>Onze uitgelichte</h2>
              <p>De parties, boats en experiences waar wij deze week niet over uitgepraat raken.</p>
            </div>
          </div>
          
          <div className="slider">
            <div className="slider-arrows" style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => scrollRail(featTrackRef, -1)} aria-label="Vorige" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(44,74,66,.14)', background: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <ChevronRight className="rotate-180" style={{ transform: 'rotate(180deg)' }} />
              </button>
              <button onClick={() => scrollRail(featTrackRef, 1)} aria-label="Volgende" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(44,74,66,.14)', background: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <ChevronRight />
              </button>
            </div>
            <div className="slider-track" ref={featTrackRef} style={{ display: 'flex', gap: '18px', overflowX: 'auto', scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
              {featuredEvents.length > 0 ? (
                featuredEvents.map((e, i) => (
                  <div key={e.id} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
                    {renderFeaturedCard(e, i)}
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px' }}>Laden...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DEALS BAND */}
      <section className="block">
        <div className="wrap">
          <div className="deal-band">
            <img className="wave-deco" src="data:image/png;base64,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" alt="" />
            <div className="txt" style={{ position: 'relative', zIndex: 2, flex: 1 }}>
              <div className="kicker" style={{ color: 'var(--green)' }}>Flash kortingen</div>
              <h2>Deals of the Day</h2>
              <p>Elke dag nieuwe scherpe aanbiedingen voor de heetste events. Wees er snel bij, want op = op.</p>
              <Link href={`/${locale}/deals-of-the-day`} className="btn-primary" style={{ display: 'inline-flex', marginTop: '20px', width: 'auto' }}>
                Alle deals bekijken
              </Link>
            </div>
            
            <div className="deal-grid" style={{ flex: 1.5, position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {dealEvents.length > 0 ? (
                dealEvents.map(e => renderDealCard(e))
              ) : (
                <div style={{ color: 'var(--sage-55)' }}>Geen deals momenteel.</div>
              )}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
             {[
               { name: "Playa d'en Bossa", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600", link: "playa-den-bossa" },
               { name: "San Antonio", img: "https://images.unsplash.com/photo-1567606403063-832128ce3a00?q=80&w=600", link: "san-antonio" },
               { name: "Ibiza Town", img: "https://images.unsplash.com/photo-1510444589-9807fa7de323?q=80&w=600", link: "ibiza-town" },
               { name: "Formentera", img: "https://images.unsplash.com/photo-1601004146039-49339e723cc5?q=80&w=600", link: "formentera" }
             ].map(loc => (
               <Link key={loc.name} href={`/${locale}/locations/${loc.link}`} style={{ position: 'relative', height: '180px', borderRadius: '24px', overflow: 'hidden', display: 'block', transition: 'transform 0.3s' }}>
                  <img src={loc.img} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)' }} />
                  <h4 style={{ position: 'absolute', bottom: '20px', left: '20px', color: 'white', fontWeight: 900, fontSize: '20px', letterSpacing: '-0.5px' }}>{loc.name}</h4>
               </Link>
             ))}
          </div>
        </div>
      </section>
      
      {/* WA & TIPS CARDS */}
      <section className="block">
        <div className="wrap">
           <div className="three">
             <div className="tcard">
               <div className="ic"><svg viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2"/></svg></div>
               <h3>Ibiza Tips van insiders</h3>
               <p>De beste verborgen strandjes, heerlijke restaurants en tips die je in geen enkele reisgids vindt.</p>
               <Link href={`/${locale}/ibiza-tips`} className="seeall" style={{ padding: '9px 18px', fontSize: '13.5px' }}>Lees onze tips <ChevronRight size={14}/></Link>
             </div>
             <div className="tcard">
               <div className="ic"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
               <h3>Vraag het ons via WhatsApp</h3>
               <p>Twijfel je welk feest het beste bij je past? App ons even, we kennen het eiland en de kalender uit ons hoofd.</p>
               <a href="https://wa.me/34600000000" className="wa" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24"><path d="M17.47 16.22c-.22.61-1.31 1.15-1.83 1.22-.44.05-1.02.13-2.92-.66-2.31-.96-3.79-3.32-3.9-3.48-.12-.15-.94-1.25-.94-2.39 0-1.13.58-1.69.79-1.92.21-.22.46-.28.61-.28.16 0 .31 0 .44.02.14.01.33-.05.51.37.19.44.66 1.62.72 1.74.05.12.09.26.01.42-.08.15-.12.25-.24.39-.12.15-.26.33-.37.44-.12.13-.25.26-.11.5.14.24.62 1.02 1.34 1.65.92.83 1.68 1.08 1.93 1.2.25.12.4.09.55-.07.15-.17.65-.75.82-1.01.17-.26.34-.22.56-.13.23.08 1.45.68 1.7.81.25.12.41.19.47.29.06.1.06.58-.16 1.19zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg> Whatsapp ons</a>
             </div>
             <div className="tcard">
               <div className="ic"><svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
               <h3>Luister naar Ibiza sounds</h3>
               <p>Kom alvast in de stemming met onze samengestelde Spotify playlists met de klanken van het eiland.</p>
               <a href="#" className="seeall" style={{ padding: '9px 18px', fontSize: '13.5px' }}>Speel playlist <ChevronRight size={14}/></a>
             </div>
           </div>
        </div>
      </section>
    </main>
  );
}
