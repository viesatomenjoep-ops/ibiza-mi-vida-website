'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { format, isSameDay, isSameMonth, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isAfter, startOfDay } from 'date-fns';
import { nl, enUS, de, es } from 'date-fns/locale';
import '@/styles/calendar.css';
import { Calendar, ChevronLeft, ChevronRight, Music, Sunrise, Search, MapPin } from 'lucide-react';
import { CTEventDate, CTVenue, CTArtist } from '@/lib/clubtickets';

interface CalendarClientProps {
  allEventDates: CTEventDate[];
  venues: CTVenue[];
  artists: CTArtist[];
  dict: any;
  locale: string;
}

const getLocaleObj = (locale: string) => {
  switch (locale) {
    case 'nl': return nl;
    case 'de': return de;
    case 'es': return es;
    default: return enUS;
  }
};

export default function CalendarClient({ allEventDates, venues, artists, dict, locale }: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // Defaulting to May 2026 as per calendar
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 4, 1));
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const localeObj = getLocaleObj(locale);
  const today = new Date();

  // Filters logic
  const filteredEvents = useMemo(() => {
    return allEventDates.filter(e => {
      const isCorrectDate = isSameDay(new Date(e.date), selectedDate);
      if (!isCorrectDate) return false;
      
      const venue = venues.find(v => v.id === e.venue_id);
      if (activeFilter === 'clubbing') return venue?.type === 'club';
      if (activeFilter === 'boat') return venue?.type === 'boat';
      if (activeFilter === 'day') return venue?.type === 'beach_club';
      return true;
    });
  }, [allEventDates, selectedDate, activeFilter, venues]);

  // Calendar logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Determine if a day has events
  const dayHasEvents = (day: Date, filter: string) => {
    return allEventDates.some(e => {
      const isCorrectDate = isSameDay(new Date(e.date), day);
      if (!isCorrectDate) return false;
      const venue = venues.find(v => v.id === e.venue_id);
      if (filter === 'clubbing') return venue?.type === 'club';
      if (filter === 'boat') return venue?.type === 'boat';
      if (filter === 'day') return venue?.type === 'beach_club';
      return true;
    });
  };

  return (
    <>
      {/* Subhero */}
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
          {/* Filters */}
          <div className="catfilter">
            <button className={`cf ${activeFilter === 'all' ? 'on' : ''}`} onClick={() => setActiveFilter('all')}>
              <Music /> Alle events
            </button>
            <button className={`cf ${activeFilter === 'clubbing' ? 'on' : ''}`} onClick={() => setActiveFilter('clubbing')}>
              <Sunrise /> Clubbing
            </button>
            <button className={`cf ${activeFilter === 'boat' ? 'on' : ''}`} onClick={() => setActiveFilter('boat')}>
              <MapPin /> Boat Parties
            </button>
            <button className={`cf ${activeFilter === 'day' ? 'on' : ''}`} onClick={() => setActiveFilter('day')}>
              <Sunrise /> Day Clubs
            </button>
          </div>

          <div className="cal-shell">
            {/* Calendar Panel */}
            <div className="cal-panel">
              <div className="cal-top">
                <div className="mlabel">{format(currentDate, 'MMMM yyyy', { locale: localeObj })}</div>
                <div className="cal-nav">
                  <button onClick={prevMonth} aria-label="Vorige maand"><ChevronLeft /></button>
                  <button onClick={nextMonth} aria-label="Volgende maand"><ChevronRight /></button>
                </div>
              </div>
              
              <div className="cal-grid">
                {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(d => (
                  <div key={d} className="cal-dow">{d}</div>
                ))}
                
                {calendarDays.map((day, idx) => {
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, today);
                  const hasEvents = dayHasEvents(day, activeFilter);

                  if (!isCurrentMonth) {
                    return <div key={idx} className="cal-cell empty"></div>;
                  }

                  return (
                    <div 
                      key={idx} 
                      className={`cal-cell ${isSelected ? 'sel' : ''} ${isToday ? 'today' : ''} ${!hasEvents ? 'none' : ''}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {format(day, 'd')}
                      <div className="dots">
                        <div className="dot"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="legend">
                <span><i style={{background: 'var(--blue)'}}></i> Geselecteerd</span>
                <span><i style={{background: 'var(--sage)'}}></i> Vandaag</span>
                <span><i style={{background: 'var(--green)'}}></i> Heeft events</span>
              </div>
            </div>

            {/* Day Panel */}
            <div className="daypanel">
              <div className="dphead">
                <b>{format(selectedDate, 'EEEE d MMMM', { locale: localeObj })}</b>
                <small>{filteredEvents.length} events</small>
              </div>

              {filteredEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--sage-55)' }}>
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Geen events gevonden op deze datum voor de geselecteerde filter.</p>
                </div>
              ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                  {filteredEvents.map(event => {
                    const venue = venues.find(v => v.id === event.venue_id);
                    return (
                      <Link href={`/${locale}/club-tickets/${venue?.slug || ''}/${event.id}`} key={event.id} className="devt">
                        <div className="thumb">
                          {event.image ? (
                            <img src={event.image} alt={event.name} />
                          ) : (
                            <Music />
                          )}
                        </div>
                        <div className="di">
                          <b>{event.name}</b>
                          <div className="row">
                            <MapPin /> {venue?.name || 'Onbekende Locatie'}
                          </div>
                          {venue?.type && (
                            <span className="tag">{venue.type.replace('_', ' ')}</span>
                          )}
                        </div>
                        <div className="pr">
                          <small>vanaf</small>
                          <b>€{event.price || ' TBA'}</b>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SEO Intro block as in HTML */}
      <section className="block alt">
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
