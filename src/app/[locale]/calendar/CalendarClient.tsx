'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { format, isSameDay, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addDays, parse } from 'date-fns';
import { nl, enUS, de, es } from 'date-fns/locale';
import '@/styles/calendar.css';
import { Calendar, ChevronRight, Music, Sunrise, MapPin, Heart, Search, Check, X, Grid, List } from 'lucide-react';

interface CalendarClientProps {
  events: any[]; 
  allVenues: any[];
  allArtists: any[];
  dict: any;
  locale: string;
  initialMonth: string; 
}

const getLocaleObj = (locale: string) => {
  switch (locale) {
    case 'nl': return nl;
    case 'de': return de;
    case 'es': return es;
    default: return enUS;
  }
};

export default function CalendarClient({ 
  events, 
  allVenues, 
  allArtists, 
  dict, 
  locale, 
  initialMonth 
}: CalendarClientProps) {
  const [activeMonth, setActiveMonth] = useState<string>('all'); // format: 'YYYY-MM'
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modal / Dropdown visibility
  const [venuesModalOpen, setVenuesModalOpen] = useState(false);
  const [artistsModalOpen, setArtistsModalOpen] = useState(false);
  const [datepickerOpen, setDatepickerOpen] = useState(false);
  const [artistSearchQuery, setArtistSearchQuery] = useState('');

  const localeObj = getLocaleObj(locale);
  const today = new Date();

  // Load favorites
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('ibizaFavorites') || '[]');
      setFavorites(favs);
    } catch(e) {}
  }, []);

  const toggleFavorite = (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId];
      localStorage.setItem('ibizaFavorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  // Determine unique months with events to build the tabs row
  const uniqueMonths = useMemo(() => {
    const months = new Set<string>();
    events.forEach(e => {
      if (e.date) {
        months.add(e.date.substring(0, 7)); // 'YYYY-MM'
      }
    });
    return Array.from(months).sort();
  }, [events]);

  // If initialMonth matches a month in uniqueMonths, default to it
  useEffect(() => {
    if (uniqueMonths.includes(initialMonth)) {
      setActiveMonth(initialMonth);
    } else if (uniqueMonths.length > 0) {
      // Find current month or default to first month in dates
      const currentMonthStr = format(new Date(), 'yyyy-MM');
      if (uniqueMonths.includes(currentMonthStr)) {
        setActiveMonth(currentMonthStr);
      } else {
        setActiveMonth(uniqueMonths[0]);
      }
    }
  }, [uniqueMonths, initialMonth]);

  // Main client filter logic
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // 1. Month Filter
      if (activeMonth !== 'all') {
        const eMonth = e.date.substring(0, 7);
        if (eMonth !== activeMonth) return false;
      }
      
      // 2. Venue Filter
      if (selectedVenue && e.ct_venues?.slug !== selectedVenue) {
        return false;
      }
      
      // 3. Artist Filter
      if (selectedArtist) {
        const searchArtist = selectedArtist.toLowerCase();
        const inLineup = e.lineUp?.toLowerCase().includes(searchArtist);
        const inEventName = e.ct_events?.name?.toLowerCase().includes(searchArtist);
        if (!inLineup && !inEventName) return false;
      }
      
      // 4. Category Filter
      if (selectedCategory === 'favorites') {
        return favorites.includes(e.id);
      }
      const venue = e.ct_venues;
      if (selectedCategory === 'nightclubs') {
        return venue?.type_slug === 'clubbing' && !venue?.is_day_club;
      }
      if (selectedCategory === 'boat') {
        return venue?.type_slug === 'boat';
      }
      if (selectedCategory === 'day') {
        return venue?.type_slug === 'clubbing' && venue?.is_day_club === true;
      }
      
      return true;
    });
  }, [events, activeMonth, selectedVenue, selectedArtist, selectedCategory, favorites]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredEvents.forEach(e => {
      const d = e.date;
      if (!groups[d]) groups[d] = [];
      groups[d].push(e);
    });
    return Object.keys(groups).sort().map(d => ({
      dateStr: d,
      dateObj: new Date(d + 'T00:00:00Z'),
      events: groups[d]
    }));
  }, [filteredEvents]);

  // Datepicker navigation grid based on activeMonth
  const datepickerDays = useMemo(() => {
    if (activeMonth === 'all') return [];
    try {
      const parts = activeMonth.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const monthStart = startOfMonth(new Date(year, month, 1));
      const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
      const endDate = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });
      return eachDayOfInterval({ start: startDate, end: endDate });
    } catch(err) {
      return [];
    }
  }, [activeMonth]);

  const activeMonthLabel = useMemo(() => {
    if (activeMonth === 'all') return '';
    try {
      const parts = activeMonth.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      return format(new Date(year, month, 1), 'MMMM yyyy', { locale: localeObj });
    } catch(e) {
      return '';
    }
  }, [activeMonth, localeObj]);

  const dayHasEvents = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return events.some(e => e.date === dayStr);
  };

  const handleDateClick = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    setSelectedDate(day);
    setDatepickerOpen(false);

    // Scroll smoothly to this date group in the list
    const el = document.getElementById(`date-group-${dateStr}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Filtered artists for the list
  const filteredArtists = useMemo(() => {
    const query = artistSearchQuery.toLowerCase().trim();
    if (!query) return allArtists;
    return allArtists.filter(a => a.name.toLowerCase().includes(query));
  }, [allArtists, artistSearchQuery]);

  return (
    <>
      {/* Hero Header */}
      <section className="subhero">
        <div className="subhero-bg"></div>
        <div className="wrap">
          <div className="crumb">
            <Link href={`/${locale}`}><Calendar className="w-4 h-4" /> Home</Link>
            <ChevronRight className="w-3 h-3" />
            <b>Kalender</b>
          </div>
          <h1>Ibiza <span className="accent">Kalender</span></h1>
          <p className="lead">Ontdek alle evenementen, club nights en boat parties. Plan je Ibiza trip en scoor je tickets in één overzicht.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">

          {/* Month selector Tabs */}
          <div className="month-tabs-container">
            <div className="month-tabs">
              <button 
                className={`month-tab ${activeMonth === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setActiveMonth('all');
                  setDatepickerOpen(false);
                }}
              >
                Alles
              </button>
              {uniqueMonths.map(m => {
                const isSelected = activeMonth === m;
                let label = m;
                try {
                  const parts = m.split('-');
                  const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 2);
                  label = format(date, 'MMM yyyy', { locale: localeObj });
                } catch(e) {}
                return (
                  <button 
                    key={m} 
                    className={`month-tab ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setActiveMonth(m);
                      setDatepickerOpen(false);
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Filter Bar Controls */}
          <div className="filter-bar">
            <button 
              className={`filter-btn ${selectedVenue ? 'active' : ''}`}
              onClick={() => {
                setVenuesModalOpen(!venuesModalOpen);
                setArtistsModalOpen(false);
                setDatepickerOpen(false);
              }}
            >
              Clubs {selectedVenue ? `(${selectedVenue})` : ''} ▾
            </button>

            {activeMonth !== 'all' && (
              <button 
                className={`filter-btn ${datepickerOpen ? 'active' : ''}`}
                onClick={() => {
                  setDatepickerOpen(!datepickerOpen);
                  setVenuesModalOpen(false);
                  setArtistsModalOpen(false);
                }}
              >
                Datum grid ▾
              </button>
            )}

            <button 
              className={`filter-btn ${selectedArtist ? 'active' : ''}`}
              onClick={() => {
                setArtistsModalOpen(!artistsModalOpen);
                setVenuesModalOpen(false);
                setDatepickerOpen(false);
              }}
            >
              Artiest {selectedArtist ? `(${selectedArtist})` : ''} ▾
            </button>

            {/* Total event stats label */}
            <div className="filter-stats">
              {filteredEvents.length} events • {eventsByDate.length} dagen
            </div>

            {/* Grid vs List layout togglers */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                aria-label="Lijstweergave"
                className={`layout-toggle-btn ${layoutMode === 'list' ? 'active' : ''}`}
                onClick={() => setLayoutMode('list')}
              >
                <List size={16} />
              </button>
              <button 
                aria-label="Gridweergave"
                className={`layout-toggle-btn ${layoutMode === 'grid' ? 'active' : ''}`}
                onClick={() => setLayoutMode('grid')}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>

          {/* Venues filter board */}
          {venuesModalOpen && (
            <div className="filter-board">
              <div className="filter-board-header">
                <span className="filter-board-title">Kies een Club</span>
                <X className="filter-board-close w-4 h-4" onClick={() => setVenuesModalOpen(false)} />
              </div>
              <div className="venues-filter-grid">
                <button 
                  className={`venue-filter-tag ${!selectedVenue ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedVenue(null);
                    setVenuesModalOpen(false);
                  }}
                >
                  Alle clubs
                </button>
                {allVenues.map(v => (
                  <button 
                    key={v.slug} 
                    className={`venue-filter-tag ${selectedVenue === v.slug ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedVenue(v.slug);
                      setVenuesModalOpen(false);
                    }}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Artists filter board */}
          {artistsModalOpen && (
            <div className="filter-board">
              <div className="filter-board-header">
                <span className="filter-board-title">Zoek op Artiest</span>
                <X className="filter-board-close w-4 h-4" onClick={() => setArtistsModalOpen(false)} />
              </div>
              <div className="artist-search-box">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Typ naam..." 
                  value={artistSearchQuery} 
                  onChange={(e) => setArtistSearchQuery(e.target.value)} 
                />
              </div>
              <div className="artists-scroll-list">
                <div 
                  className={`artist-list-item ${!selectedArtist ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedArtist(null);
                    setArtistsModalOpen(false);
                  }}
                >
                  <span>Geen selectie</span>
                </div>
                {filteredArtists.map(a => (
                  <div 
                    key={a.slug} 
                    className={`artist-list-item ${selectedArtist === a.name ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedArtist(a.name);
                      setArtistsModalOpen(false);
                    }}
                  >
                    <span>{a.name}</span>
                    {a.venueName && <span className="artist-item-club-tag">{a.venueName}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compact Calendar Datepicker Grid */}
          {datepickerOpen && activeMonth !== 'all' && (
            <div className="filter-board inline-datepicker-board">
              <div className="filter-board-header" style={{ marginBottom: '12px' }}>
                <span className="filter-board-title">{activeMonthLabel}</span>
                <X className="filter-board-close w-4 h-4" onClick={() => setDatepickerOpen(false)} />
              </div>
              <div className="datepicker-grid">
                {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(dow => (
                  <div key={dow} className="datepicker-dow">{dow}</div>
                ))}
                {datepickerDays.map((day, idx) => {
                  const dayMonthStr = format(day, 'yyyy-MM');
                  const isCurrentMonth = dayMonthStr === activeMonth;
                  const isSelected = isSameDay(day, selectedDate);
                  const isTodayObj = isSameDay(day, today);
                  const hasEvents = dayHasEvents(day);

                  if (!isCurrentMonth) {
                    return <div key={idx} className="datepicker-cell empty"></div>;
                  }

                  return (
                    <div 
                      key={idx}
                      className={`datepicker-cell ${isSelected ? 'selected' : ''} ${isTodayObj ? 'today' : ''} ${!hasEvents ? 'none' : ''}`}
                      onClick={() => handleDateClick(day)}
                    >
                      {format(day, 'd')}
                      <div className="datepicker-cell-dot"></div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Category filter tabs */}
          <div className="category-pills">
            <button 
              className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Alle Vibes
            </button>
            <button 
              className={`category-pill ${selectedCategory === 'nightclubs' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('nightclubs')}
            >
              Nightclubs
            </button>
            <button 
              className={`category-pill ${selectedCategory === 'day' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('day')}
            >
              Day Clubs
            </button>
            <button 
              className={`category-pill ${selectedCategory === 'boat' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('boat')}
            >
              Boats
            </button>
            <button 
              className={`category-pill ${selectedCategory === 'favorites' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('favorites')}
            >
              Mijn Favorieten ({favorites.length})
            </button>
          </div>

          {/* Unified Compact Events Stream */}
          {eventsByDate.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p style={{ fontFamily: 'var(--display), sans-serif', textTransform: 'uppercase', letterSpacing: '.1em', fontSize: '12px', fontWeight: 'bold' }}>Geen feesten gevonden voor deze selectie.</p>
            </div>
          ) : (
            <div className={`calendar-stream ${layoutMode === 'grid' ? 'grid-view' : ''}`}>
              {eventsByDate.map(group => {
                const isTodayGroup = isSameDay(group.dateObj, today);
                return (
                  <div key={group.dateStr} id={`date-group-${group.dateStr}`} className="date-group">
                    {/* Date banner */}
                    <div className={`date-stream-header ${isTodayGroup ? 'today' : ''}`}>
                      <span>{format(group.dateObj, 'EEEE d MMMM yyyy', { locale: localeObj })}</span>
                      {isTodayGroup && <span className="date-stream-today-badge">Vandaag</span>}
                    </div>

                    {/* Events listed under this date */}
                    {group.events.map(dateObj => {
                      const evt = dateObj.ct_events;
                      const venue = dateObj.ct_venues;
                      const isFav = favorites.includes(dateObj.id);
                      
                      return (
                        <Link 
                          href={`/${locale}/club-tickets/${venue?.slug || 'club'}/${evt?.slug || 'event'}`} 
                          key={dateObj.id} 
                          className="event-compact-row"
                        >
                          {/* Club Badge (Black block, white text) */}
                          <div className="event-club-badge">
                            {venue?.name || 'Ibiza'}
                          </div>

                          {/* Event info (Artist/Event details) */}
                          <div className="event-compact-info">
                            <span className="event-compact-name">{dateObj.name}</span>
                            <span className="event-compact-subtitle">
                              {evt?.name ? `${evt.name}` : 'Ibiza Residency'}
                            </span>
                          </div>

                          {/* Price representation */}
                          <div className="event-compact-price">
                            <small>Vanaf</small>
                            <b>€{dateObj.prices || '0.00'}</b>
                          </div>

                          {/* Tickets button */}
                          <button 
                            className="event-tickets-btn"
                            aria-label={`Koop tickets voor ${dateObj.name}`}
                          >
                            Tickets ↗
                          </button>
                        </Link>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </section>

      {/* SEO Introduction block */}
      <section className="block alt" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="wrap">
          <div className="intro-seo">
            <h2>De ultieme Ibiza kalender 2026</h2>
            <p>Op zoek naar het perfecte feest tijdens jouw vakantie? Onze Ibiza kalender biedt een compleet overzicht van alle club nights, boat parties en day clubs. Filter eenvoudig op jouw favoriete vibe of check direct wat er vanavond te doen is.</p>
            <p>Boek je tickets ruim van tevoren via Ibiza mi Vida. Wij werken direct samen met ClubTickets, de officiële ticketing partner van het eiland. 100% veilig, gegarandeerde toegang en geen verborgen kosten aan de deur.</p>
          </div>
        </div>
      </section>
    </>
  );
}
