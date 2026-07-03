'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, isSameDay, isSameMonth, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addDays, subDays, addWeeks, subWeeks } from 'date-fns';
import { nl, enUS, de, es } from 'date-fns/locale';
import '@/styles/calendar.css';
import { Calendar, ChevronLeft, ChevronRight, Music, Sunrise, MapPin, Heart } from 'lucide-react';

interface CalendarClientProps {
  events: any[]; 
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

export default function CalendarClient({ events, dict, locale, initialMonth }: CalendarClientProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [dynamicEvents, setDynamicEvents] = useState<any[]>(events);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const localeObj = getLocaleObj(locale);
  const today = new Date();

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

  useEffect(() => {
    async function fetchMonthEvents() {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
      try {
        const res = await fetch(`/api/calendar-events?month=${monthStr}`);
        if (res.ok) {
          const data = await res.json();
          setDynamicEvents(data.events || []);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const currentMonthStr = `${year}-${month.toString().padStart(2, '0')}`;
    
    if (currentMonthStr !== initialMonth) {
      fetchMonthEvents();
    } else {
      setDynamicEvents(events);
    }
  }, [currentDate, initialMonth, events]);

  const filteredEventsForSelectedDate = useMemo(() => {
    return dynamicEvents.filter(e => {
      if (!isSameDay(new Date(e.date), selectedDate)) return false;
      if (activeFilter === 'favorites') return favorites.includes(e.id);
      
      const venue = e.ct_venues;
      if (activeFilter === 'nightclubs') return venue?.type_slug === 'clubbing' && !venue?.is_day_club;
      if (activeFilter === 'boat') return venue?.type_slug?.includes('boat');
      if (activeFilter === 'day') return venue?.type_slug === 'clubbing' && venue?.is_day_club === true;
      return true;
    });
  }, [dynamicEvents, selectedDate, activeFilter, favorites]);

  let calendarDays: Date[] = [];
  let monthStart = startOfMonth(currentDate);
  if (view === 'month') {
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  } else if (view === 'week') {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  }

  const navigateTime = (amount: number) => {
    if (view === 'month') {
      const newDate = amount > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
      setCurrentDate(newDate);
      const monthStr = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}`;
      window.history.pushState(null, '', `/${locale}/calendar?month=${monthStr}`);
    } else if (view === 'week') {
      setCurrentDate(amount > 0 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    }
  };

  const dayHasEvents = (day: Date, filter: string) => {
    return dynamicEvents.some(e => {
      if (!isSameDay(new Date(e.date), day)) return false;
      if (filter === 'favorites') return favorites.includes(e.id);
      const venue = e.ct_venues;
      if (filter === 'nightclubs') return venue?.type_slug === 'clubbing' && !venue?.is_day_club;
      if (filter === 'boat') return venue?.type_slug?.includes('boat');
      if (filter === 'day') return venue?.type_slug === 'clubbing' && venue?.is_day_club === true;
      return true;
    });
  };

  return (
    <>
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
          <div className="catfilter" style={{ marginBottom: '16px' }}>
            <button className={`cf ${activeFilter === 'all' ? 'on' : ''}`} onClick={() => setActiveFilter('all')}>
              <Music /> Alle events
            </button>
            <button className={`cf ${activeFilter === 'nightclubs' ? 'on' : ''}`} onClick={() => setActiveFilter('nightclubs')}>
              <Music /> Nightclubs
            </button>
            <button className={`cf ${activeFilter === 'boat' ? 'on' : ''}`} onClick={() => setActiveFilter('boat')}>
              <MapPin /> Boat Parties
            </button>
            <button className={`cf ${activeFilter === 'day' ? 'on' : ''}`} onClick={() => setActiveFilter('day')}>
              <Sunrise /> Day Clubs
            </button>
            <button className={`cf ${activeFilter === 'favorites' ? 'on' : ''}`} onClick={() => setActiveFilter('favorites')}>
              <Heart /> Mijn Favorieten
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '26px' }}>
            <button className={`btn-sm btn ${view === 'month' ? 'fill' : ''}`} onClick={() => setView('month')}>Maand</button>
            <button className={`btn-sm btn ${view === 'week' ? 'fill' : ''}`} onClick={() => setView('week')}>Week</button>
            <button className={`btn-sm btn ${view === 'day' ? 'fill' : ''}`} onClick={() => setView('day')}>Dag Lijst</button>
          </div>

          {view === 'day' ? (
            <div className="day-viewer">
              <div className="cal-top" style={{ justifyContent: 'center', gap: '30px', marginBottom: '30px', background: 'var(--panel)', padding: '20px', borderRadius: '22px', border: '1px solid var(--line)' }}>
                <button className="cal-nav" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid var(--line-strong)', background: 'var(--panel2)', display: 'grid', placeItems: 'center', color: 'var(--white)' }} onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
                  <ChevronLeft />
                </button>
                <div className="mlabel" style={{ fontSize: '22px', fontFamily: 'var(--display)', color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: localeObj })}
                </div>
                <button className="cal-nav" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid var(--line-strong)', background: 'var(--panel2)', display: 'grid', placeItems: 'center', color: 'var(--white)' }} onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                  <ChevronRight />
                </button>
              </div>

              {filteredEventsForSelectedDate.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--grey)', background: 'var(--panel)', borderRadius: '24px', border: '1px solid var(--line)' }}>
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Geen events gevonden op deze datum.</p>
                </div>
              ) : (
                <div className="listing">
                  {filteredEventsForSelectedDate.map(dateObj => {
                    const evt = dateObj.ct_events;
                    const venue = dateObj.ct_venues;
                    const isFav = favorites.includes(dateObj.id);
                    return (
                      <Link href={`/${locale}/club-tickets/${venue?.slug || 'club'}/${evt?.slug || 'event'}`} key={dateObj.id} className="lcard in">
                        <div className="media">
                          {evt?.cover ? (
                            <img src={evt.cover} alt={dateObj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div className="ph"><Music /></div>
                          )}
                          <div className="lbadge hot" style={{ background: 'var(--panel)', color: 'var(--white)', borderColor: 'var(--line-strong)' }}>{format(new Date(dateObj.date), 'dd MMM')}</div>
                          <div className="lfav" onClick={(e) => toggleFavorite(dateObj.id, e)}>
                            <Heart size={18} fill={isFav ? 'var(--spring)' : 'none'} stroke={isFav ? 'var(--spring)' : 'white'} />
                          </div>
                        </div>
                        <div className="body">
                          <h3>{dateObj.name}</h3>
                          <div className="lrow"><MapPin /> {venue?.name || 'Ibiza'}</div>
                          <div className="lfoot">
                            <small>Vanaf</small>
                            <b>€{dateObj.prices || '0.00'}</b>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="cal-shell">
              <div className="cal-panel">
                <div className="cal-top">
                  <div className="mlabel">
                    {view === 'month' 
                      ? format(currentDate, 'MMMM yyyy', { locale: localeObj })
                      : `Week van ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM', { locale: localeObj })}`}
                  </div>
                  <div className="cal-nav">
                    <button onClick={() => navigateTime(-1)} aria-label="Vorige"><ChevronLeft /></button>
                    <button onClick={() => navigateTime(1)} aria-label="Volgende"><ChevronRight /></button>
                  </div>
                </div>
                
                <div className="cal-grid">
                  {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(d => (
                    <div key={d} className="cal-dow">{d}</div>
                  ))}
                  
                  {calendarDays.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, view === 'month' ? monthStart : day);
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, today);
                    const hasEvents = dayHasEvents(day, activeFilter);

                    if (view === 'month' && !isCurrentMonth) {
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
                  <span><i style={{background: 'var(--spring)'}}></i> Geselecteerd</span>
                  <span><i style={{background: 'var(--line-strong)'}}></i> Vandaag</span>
                  <span><i style={{background: 'var(--grey)'}}></i> Heeft events</span>
                </div>
              </div>

              <div className="daypanel">
                <div className="dphead">
                  <b>{format(selectedDate, 'EEEE d MMMM', { locale: localeObj })}</b>
                  <small>{filteredEventsForSelectedDate.length} events</small>
                </div>

                {filteredEventsForSelectedDate.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--grey)' }}>
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Geen events gevonden.</p>
                  </div>
                ) : (
                  <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                    {filteredEventsForSelectedDate.map(dateObj => {
                      const venue = dateObj.ct_venues;
                      const evt = dateObj.ct_events;
                      return (
                        <Link href={`/${locale}/club-tickets/${venue?.slug || 'club'}/${evt?.slug || 'event'}`} key={dateObj.id} className="devt">
                          <div className="thumb">
                            {evt?.cover ? (
                               <img src={evt.cover} alt={evt.name} />
                            ) : (
                               <Music />
                            )}
                          </div>
                          <div className="di">
                            <b>{dateObj.name}</b>
                            <div className="row">
                              <MapPin /> {venue?.name || 'Locatie'}
                            </div>
                          </div>
                          <div className="pr">
                            <small>vanaf</small>
                            <b>€{dateObj.prices || ' ??'}</b>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {view !== 'day' && (
            <div className="mt-12 bg-black/40 backdrop-blur-md p-6 md:p-8 rounded-[32px] border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl md:text-3xl">🔥</span>
                <h3 className="m-0 font-serif font-bold text-xl md:text-3xl text-white tracking-wide">
                  Top 5 Suggesties voor <span className="text-ibiza-spring">{format(selectedDate, 'd MMMM yyyy', { locale: localeObj })}</span>
                </h3>
              </div>
              
              {filteredEventsForSelectedDate.length === 0 ? (
                <p className="text-white/50 text-sm md:text-base">Geen events gevonden op deze datum. Probeer een andere filter of dag.</p>
              ) : (
                <div className="w-full pb-4">
                  <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 pt-2 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }` }} />
                    {filteredEventsForSelectedDate.slice(0, 5).map(dateObj => {
                      const evt = dateObj.ct_events;
                      const venue = dateObj.ct_venues;
                      const isFav = favorites.includes(dateObj.id);
                      return (
                        <Link 
                          href={`/${locale}/club-tickets/${venue?.slug || 'club'}/${evt?.slug || 'event'}`} 
                          key={`sug-${dateObj.id}`} 
                          className="group relative flex flex-col justify-end snap-center shrink-0 w-[260px] md:w-[320px] h-[340px] md:h-[420px] rounded-3xl overflow-hidden bg-black shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/10"
                        >
                          <img 
                            src={evt?.cover || venue?.picture || '/hi-ibiza-2026/FB_IMG_1779623220486.jpg'} 
                            alt={dateObj.name} 
                            className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                          
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest text-white border border-white/20 shadow-lg">
                              {format(new Date(dateObj.date), 'dd MMM')}
                            </div>
                            <div 
                              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                              onClick={(e) => toggleFavorite(dateObj.id, e)}
                            >
                              <Heart size={18} fill={isFav ? 'var(--spring)' : 'none'} stroke={isFav ? 'var(--spring)' : 'white'} />
                            </div>
                          </div>
                          
                          <div className="relative z-10 p-5 md:p-6 flex flex-col w-full mt-auto">
                            <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md mb-2 leading-tight">{dateObj.name}</h3>
                            <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm mb-4">
                              <MapPin size={14} /> {venue?.name || 'Ibiza'}
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-auto">
                              <div>
                                <small className="text-[10px] uppercase tracking-widest text-white/60 block mb-0.5">Vanaf</small>
                                <b className="text-white text-lg">€{dateObj.prices || '0.00'}</b>
                              </div>
                              <div className="text-ibiza-spring font-semibold text-xs md:text-sm group-hover:translate-x-1 transition-transform">
                                Tickets →
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                    <div className="snap-start shrink-0 w-2 md:w-4"></div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

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
