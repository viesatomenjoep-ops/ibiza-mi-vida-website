'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CTEventDate } from '@/lib/clubtickets';

interface DealsClientProps {
  dates: CTEventDate[];
  translations: {
    title: string;
    description: string;
    allDeals: string;
    clubbing: string;
    boat: string;
    searchPlaceholder: string;
    sortBy: string;
    date: string;
    priceLowHigh: string;
    priceHighLow: string;
    results: string;
    loadMore: string;
    buyTickets: string;
    from: string;
    dealBadge: string;
    hotBadge: string;
  };
}

export default function DealsClient({ dates, translations }: DealsClientProps) {
  const [filter, setFilter] = useState('*');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [visibleCount, setVisibleCount] = useState(24);

  // Parse prices for sorting
  const getMinPrice = (priceString: string) => {
    if (!priceString) return 999;
    const p = parseFloat(priceString.replace(',', '.'));
    return isNaN(p) ? 999 : p;
  };

  const filteredAndSortedDates = useMemo(() => {
    let result = [...dates];

    // Search filter
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        d => 
          (d.eventName?.toLowerCase() || '').includes(s) || 
          (d.venueName?.toLowerCase() || '').includes(s) ||
          (d.lineUp || '').toLowerCase().includes(s)
      );
    }

    // Category filter (mocked based on venue name or event name keywords)
    if (filter !== '*') {
      result = result.filter(d => {
        const str = `${d.eventName} ${d.venueName}`.toLowerCase();
        if (filter === 'boat') {
          return str.includes('boat') || str.includes('boot') || str.includes('cruise') || str.includes('party boat');
        }
        if (filter === 'clubbing') {
          return !str.includes('boat') && !str.includes('boot') && !str.includes('cruise') && !str.includes('party boat');
        }
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sort === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      const pA = getMinPrice(a.prices);
      const pB = getMinPrice(b.prices);
      if (sort === 'price-asc') return pA - pB;
      if (sort === 'price-desc') return pB - pA;
      return 0;
    });

    return result;
  }, [dates, filter, search, sort]);

  const visibleDates = filteredAndSortedDates.slice(0, visibleCount);

  return (
    <>
      <section className="pt-[108px] md:pt-[128px] pb-4 relative z-10 flex flex-col items-center text-center">
        <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex flex-col gap-2 text-center mb-8">
            <span className="text-sm font-bold tracking-widest text-neutral-500 uppercase mb-2">Deals of the Day</span>
            <h1 className="text-5xl md:text-7xl font-black font-serif text-black leading-tight uppercase m-0 tracking-tight">
              Deals of the <span className="text-red-500">Day</span>
            </h1>
            <p className="font-sans text-lg text-neutral-600 max-w-2xl mx-auto mt-4">
              {translations.description}
            </p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="toolbar">
            <div className="fchips" id="fchips">
              <button 
                className={`fchip ${filter === '*' ? 'on' : ''}`} 
                onClick={() => setFilter('*')}
              >
                {translations.allDeals}
              </button>
              <button 
                className={`fchip ${filter === 'clubbing' ? 'on' : ''}`} 
                onClick={() => setFilter('clubbing')}
              >
                <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/></svg>
                {translations.clubbing}
              </button>
              <button 
                className={`fchip ${filter === 'boat' ? 'on' : ''}`} 
                onClick={() => setFilter('boat')}
              >
                <svg viewBox="0 0 24 24"><path d="M3 16h18l-2 5H5z"/></svg>
                {translations.boat}
              </button>
            </div>
            
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
            
            <select 
              className="sortsel" 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="date">{translations.date}</option>
              <option value="price-asc">{translations.priceLowHigh}</option>
              <option value="price-desc">{translations.priceHighLow}</option>
            </select>
          </div>
          
          <p className="results-meta">
            {filteredAndSortedDates.length} {translations.results}
          </p>

          <div className="listing">
            {visibleDates.map((date, idx) => {
              const price = getMinPrice(date.prices);
              const isDeal = price < 40 && price > 0;
              const isHot = price >= 40 && price < 60;
              
              const d = new Date(date.date);
              const dayStr = d.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' });
              const timeStr = d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

              return (
                <Link href={date.affLink} key={date.id || idx} className="lcard in" target="_blank" rel="noopener noreferrer">
                  <div className="media">
                    {isDeal && <div className="lbadge deal">{translations.dealBadge}</div>}
                    {isHot && !isDeal && <div className="lbadge hot">{translations.hotBadge}</div>}
                    <div className="lfav">
                      <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.9 7.9 7.9-7.9 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
                    </div>
                    {date.eventCover || date.venueCover ? (
                      <img src={date.eventCover || date.venueCover} alt={date.eventName || date.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                    ) : (
                      <div className="ph">
                        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        {date.eventName || 'Event'}
                      </div>
                    )}
                  </div>
                  <div className="body">
                    <h3>{date.eventName || date.name}</h3>
                    <div className="lrow">
                      <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {date.venueName || 'Ibiza'}
                    </div>
                    <div className="lrow">
                      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {dayStr} • {timeStr}
                    </div>
                    
                    <div className="lfoot">
                      <div>
                        <small>{translations.from}</small>
                        {price < 999 ? <b>€{price.toFixed(2)}</b> : <b>N/A</b>}
                      </div>
                      <button className="mini">{translations.buyTickets}</button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredAndSortedDates.length > visibleCount && (
            <button 
              className="loadmore" 
              onClick={() => setVisibleCount(prev => prev + 24)}
            >
              {translations.loadMore}
            </button>
          )}

        </div>
      </section>
    </>
  );
}
