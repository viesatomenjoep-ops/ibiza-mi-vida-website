'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CTVenue } from '@/lib/clubtickets';

interface ClubsClientProps {
  venues: CTVenue[];
  translations: {
    title: string;
    description: string;
    allClubs: string;
    searchPlaceholder: string;
  };
}

export default function ClubsClient({ venues, translations }: ClubsClientProps) {
  const [filter, setFilter] = useState('*');
  const [search, setSearch] = useState('');

  // Extract unique types for filters
  const types = useMemo(() => {
    const typeSet = new Set<string>();
    venues.forEach(v => {
      if (v.type && v.type.name) {
        typeSet.add(v.type.name);
      }
    });
    return Array.from(typeSet).sort();
  }, [venues]);

  const filteredVenues = useMemo(() => {
    let result = [...venues];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(v => v.name.toLowerCase().includes(s));
    }

    if (filter !== '*') {
      result = result.filter(v => v.type && v.type.name === filter);
    }

    return result;
  }, [venues, filter, search]);

  // Group by type for display
  const groupedVenues = useMemo(() => {
    const groups: Record<string, CTVenue[]> = {};
    filteredVenues.forEach(v => {
      const typeName = v.type?.name || 'Overig';
      if (!groups[typeName]) groups[typeName] = [];
      groups[typeName].push(v);
    });
    return groups;
  }, [filteredVenues]);

  return (
    <>
      <section className="subhero">
        <div className="subhero-bg"></div>
        <div className="wrap">
          <h1>Clubs <span className="accent">Ibiza</span></h1>
          <p className="lead">{translations.description}</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="filterbar">
            <button 
              className={`fchip ${filter === '*' ? 'on' : ''}`} 
              onClick={() => setFilter('*')}
            >
              {translations.allClubs}
            </button>
            {types.map(type => (
              <button 
                key={type}
                className={`fchip ${filter === type ? 'on' : ''}`} 
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
            
            <div className="searchmini">
              <input 
                type="text" 
                placeholder={translations.searchPlaceholder} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button aria-label="Search">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
            </div>
          </div>

          {Object.entries(groupedVenues).sort().map(([groupName, groupVenues]) => (
            <div key={groupName}>
              <div className="group-head">
                <div className="gi">
                  <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <h2>{groupName}</h2>
                <div className="cnt">{groupVenues.length}</div>
              </div>
              <div className="club-grid">
                {groupVenues.map(venue => (
                  <Link href={venue.affLink} target="_blank" rel="noopener noreferrer" key={venue.id} className="clubcard in">
                    {venue.cover ? (
                      <div className="ph" style={{backgroundImage: `url(${venue.cover})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6}}></div>
                    ) : (
                      <div className="ph">IMAGE</div>
                    )}
                    {venue.whitelogo && (
                      <div className="clublogo">
                        <img src={venue.whitelogo} alt={venue.name} style={{width:'100%', height:'auto'}} />
                      </div>
                    )}
                    <b>{venue.name}</b>
                    <div className="tags">
                      <span>{venue.type?.name || 'Club'}</span>
                      {venue.isDayClub && <span>Day Club</span>}
                    </div>
                    <div className="arrow">
                      <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedVenues).length === 0 && (
            <div style={{padding: '40px 0', textAlign: 'center', color: 'var(--sage-80)'}}>
              Geen clubs gevonden voor deze zoekopdracht.
            </div>
          )}

        </div>
      </section>
    </>
  );
}
