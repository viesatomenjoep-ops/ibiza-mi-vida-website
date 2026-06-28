'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CTArtist, CTEventDate } from '@/lib/clubtickets';

interface ArtistClientProps {
  artist: CTArtist;
  dates: CTEventDate[];
  similarArtists: CTArtist[];
  translations: {
    dates: string;
    story: string;
    noDates: string;
    buyTickets: string;
    from: string;
    biographyTitle: string;
    biographyIntro: string;
    biographyContent: string;
    similarArtistsTitle: string;
  };
}

export default function ArtistClient({ artist, dates, similarArtists, translations }: ArtistClientProps) {
  const [activeTab, setActiveTab] = useState<'dates' | 'story'>('dates');

  // Parse price helper
  const getMinPrice = (priceString: string) => {
    if (!priceString) return 0;
    const p = parseFloat(priceString.replace(',', '.'));
    return isNaN(p) ? 0 : p;
  };

  return (
    <>
      <section className="art-hero">
        <div 
          className="ph" 
          style={{
            backgroundImage: `url(${artist.image})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="inner">
          <div className="avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 32, height: 32}}>
              <circle cx="12" cy="8" r="5"/>
              <path d="M3 21v-2a7 7 0 0 1 14 0v2"/>
            </svg>
          </div>
          <div>
            <h1>{artist.name}</h1>
            <div className="htags">
              <span>DJ / Producer</span>
              <span>{artist.venueName || 'Ibiza'}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="toggle-bar">
        <button 
          className={activeTab === 'dates' ? 'on' : ''} 
          onClick={() => setActiveTab('dates')}
        >
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {translations.dates}
        </button>
        <button 
          className={activeTab === 'story' ? 'on' : ''} 
          onClick={() => setActiveTab('story')}
        >
          <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          {translations.story}
        </button>
      </div>

      <section className="block">
        <div className="wrap">
          {activeTab === 'dates' && (
            <div>
              {dates.length > 0 ? (
                <div className="dates-rail" style={{ flexWrap: 'wrap' }}>
                  {dates.map((date, idx) => {
                    const price = getMinPrice(date.prices);
                    const dObj = new Date(date.date);
                    const dayStr = dObj.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' });
                    
                    return (
                      <Link href={date.affLink} key={date.id || idx} target="_blank" rel="noopener noreferrer" className="dcard" style={{ flex: '0 0 calc(33.333% - 16px)' }}>
                        <div className="dinfo">
                          <svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        </div>
                        <div className="ddate">{dayStr}</div>
                        <div className="drow">
                          <svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/></svg>
                          {date.venueName || 'Ibiza'}
                        </div>
                        <div className="club">{date.eventName || 'Event'}</div>
                        <div className="price">
                          <small>{translations.from}</small><br/>
                          €{price > 0 ? price.toFixed(2) : '50.00'}
                        </div>
                        <button className="see">{translations.buyTickets}</button>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div style={{padding: '40px 0', textAlign: 'center', color: 'var(--sage-80)'}}>
                  {translations.noDates}
                </div>
              )}
            </div>
          )}

          {activeTab === 'story' && (
            <div className="story">
              <div className="txt">
                <h2>{translations.biographyTitle}</h2>
                <div className="pull">
                  {translations.biographyIntro}
                </div>
                <p>{translations.biographyContent}</p>
                <p>
                  Met optredens in de grootste clubs en een steeds groeiende fanbase is {artist.name} niet meer weg te denken uit de line-ups van dit seizoen.
                </p>
              </div>
              <div className="side-card">
                <h3>Info</h3>
                <div className="srow">
                  <div className="ic">
                    <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <span>Residency</span>
                  <div className="v">{artist.venueName || 'Onbekend'}</div>
                </div>
                <div className="srow">
                  <div className="ic">
                    <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/></svg>
                  </div>
                  <span>Genre</span>
                  <div className="v">Electronic</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {similarArtists.length > 0 && (
        <section className="block alt">
          <div className="wrap">
            <div className="sec-head">
              <h2>{translations.similarArtistsTitle}</h2>
            </div>
            <div className="sim-rail">
              {similarArtists.map(sim => (
                <Link href={`/artists/${sim.slug}`} key={sim.id} className="acard">
                  <div 
                    className="av" 
                    style={{
                      backgroundImage: `url(${sim.image})`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center'
                    }}
                  >
                    {!sim.image && (
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0 1 14 0v2"/></svg>
                    )}
                  </div>
                  <b>{sim.name}</b>
                  <small>{sim.venueName}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
