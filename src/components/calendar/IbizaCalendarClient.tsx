'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CTVenue, CTEventDate } from '@/lib/clubtickets'

interface Props {
  venues: CTVenue[]
  allDates: CTEventDate[]
  locale: string
}

const CATEGORIES = [
  { id: '*', name: 'Alle', icon: 'M4 6h16M4 12h16M4 18h16' },
  { id: '1', name: 'Clubbing', icon: 'M3 21h18M5 21V7l8-4 8 4v14' },
  { id: '2', name: 'Boat party', icon: 'M3 14l9-4 9 4-2 6H5z' },
  { id: '3', name: 'Activities', icon: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
  { id: '4', name: 'Tours', icon: 'M9 20l-5-5 9-9 5 5z' }
]

export default function IbizaCalendarClient({ venues, allDates, locale }: Props) {
  const [activeCat, setActiveCat] = useState('*')
  
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selDate, setSelDate] = useState<Date | null>(today)

  // Quick lookup for venue type id
  const venueTypeMap = useMemo(() => {
    const map = new Map<number, number>()
    venues.forEach(v => map.set(v.id, v.type.id))
    return map
  }, [venues])

  // Get dates matching current category
  const filteredDates = useMemo(() => {
    if (activeCat === '*') return allDates;
    const catIdNum = parseInt(activeCat, 10);
    return allDates.filter(d => {
      if (!d.venueId) return false;
      return venueTypeMap.get(d.venueId) === catIdNum;
    })
  }, [allDates, activeCat, venueTypeMap])

  // Get days in current month
  const viewY = viewDate.getFullYear()
  const viewM = viewDate.getMonth()
  
  const firstDay = new Date(viewY, viewM, 1)
  const lastDay = new Date(viewY, viewM + 1, 0)
  const daysInMonth = lastDay.getDate()
  
  // Adjust day of week so Monday is 0
  const startOffset = (firstDay.getDay() + 6) % 7
  
  // Create calendar cells
  const calCells = useMemo(() => {
    const cells = []
    
    // Empty cells before start of month
    for (let i = 0; i < startOffset; i++) {
      cells.push({ empty: true, day: 0 })
    }
    
    // Days in month
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDateStr = new Date(Date.UTC(viewY, viewM, d)).toISOString().split('T')[0]
      // Count events on this day
      const evCount = filteredDates.filter(ev => {
        const evDateStr = new Date(ev.date).toISOString().split('T')[0]
        return evDateStr === cellDateStr
      }).length
      
      cells.push({ empty: false, day: d, count: evCount })
    }
    return cells
  }, [viewY, viewM, daysInMonth, startOffset, filteredDates])

  const nextMonth = () => {
    setViewDate(new Date(viewY, viewM + 1, 1))
  }
  
  const prevMonth = () => {
    setViewDate(new Date(viewY, viewM - 1, 1))
  }

  // Events for selected day
  const selEvents = useMemo(() => {
    if (!selDate) return []
    // Treat selDate as UTC so it matches API date string
    const targetDateStr = new Date(Date.UTC(selDate.getFullYear(), selDate.getMonth(), selDate.getDate())).toISOString().split('T')[0]
    
    return filteredDates.filter(ev => {
      const evDateStr = new Date(ev.date).toISOString().split('T')[0]
      return evDateStr === targetDateStr
    })
  }, [selDate, filteredDates])

  // Formatting helpers
  const DOW = locale === 'nl' ? ['Ma','Di','Wo','Do','Vr','Za','Zo'] : ['Mo','Tu','We','Th','Fr','Sa','Su']
  const monthName = viewDate.toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { month: 'long', year: 'numeric' })
  
  let dayTitle = 'Selecteer een dag'
  if (selDate) {
    dayTitle = selDate.toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return (
    <>
      <section className="subhero">
        <div className="subhero-bg"></div>
        <div className="max-w-7xl mx-auto px-5">
          <span className="kicker">Alles wat er speelt</span>
          <h1>De volledige <span className="text-ibiza-blue">Ibiza kalender</span></h1>
          <p className="lead mt-4 text-velvet-obsidian/80 text-lg max-w-2xl">
            Kies een dag en zie precies welke clubs, boat parties en activiteiten er die avond zijn. Navigeer per maand en boek direct.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-5">
          {/* Category Filter */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 mb-6 hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`flex-none inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-[1.5px] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap
                  ${activeCat === cat.id 
                    ? 'bg-velvet-obsidian text-white border-velvet-obsidian' 
                    : 'bg-white border-black/10 hover:bg-ibiza-mint text-velvet-obsidian'}`}
                onClick={() => setActiveCat(cat.id)}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[1.8]"><path d={cat.icon} /></svg>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-7 items-start">
            
            {/* Calendar Panel */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="text-2xl font-black tracking-tight capitalize">{monthName}</div>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="w-11 h-11 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-ibiza-green transition-colors cursor-pointer" aria-label="Vorige maand">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-velvet-obsidian fill-none stroke-2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button onClick={nextMonth} className="w-11 h-11 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-ibiza-green transition-colors cursor-pointer" aria-label="Volgende maand">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-velvet-obsidian fill-none stroke-2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1.5 mb-1.5">
                {DOW.map(d => <div key={d} className="text-center text-[11.5px] font-bold text-velvet-obsidian/55 uppercase py-1.5">{d}</div>)}
              </div>
              
              <div className="grid grid-cols-7 gap-1.5">
                {calCells.map((cell, i) => {
                  if (cell.empty) {
                    return <div key={`empty-${i}`} className="aspect-square bg-transparent"></div>
                  }
                  
                  const isToday = cell.day === today.getDate() && viewM === today.getMonth() && viewY === today.getFullYear()
                  const isSel = selDate?.getDate() === cell.day && selDate?.getMonth() === viewM && selDate?.getFullYear() === viewY
                  
                  let cellClass = "aspect-square rounded-2xl border border-transparent bg-ibiza-sand/30 cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors relative font-bold text-[15px]"
                  let dotClass = "w-1.5 h-1.5 rounded-full bg-ibiza-green"
                  
                  if (isToday) {
                    cellClass += " bg-velvet-obsidian text-white"
                    dotClass = "w-1.5 h-1.5 rounded-full bg-white"
                  } else if (isSel) {
                    cellClass += " bg-ibiza-blue text-white border-ibiza-blue"
                    dotClass = "w-1.5 h-1.5 rounded-full bg-white"
                  } else {
                    cellClass += " hover:bg-white hover:border-ibiza-blue text-velvet-obsidian"
                  }
                  
                  if (cell.count === 0) {
                    cellClass += " !bg-transparent border-none text-velvet-obsidian/40"
                  }

                  // Up to 3 dots
                  const dots = Array.from({ length: Math.min(cell.count, 3) })

                  return (
                    <div 
                      key={`day-${cell.day}`} 
                      className={cellClass}
                      onClick={() => setSelDate(new Date(viewY, viewM, cell.day))}
                    >
                      <span>{cell.day}</span>
                      {cell.count > 0 && (
                        <span className="flex gap-[3px] h-1.5">
                          {dots.map((_, idx) => <span key={idx} className={dotClass}></span>)}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
              
              <div className="flex gap-4 flex-wrap mt-5 text-[12.5px] text-velvet-obsidian/60 font-semibold">
                <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-[4px] bg-velvet-obsidian inline-block"></i>Vandaag</span>
                <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-[4px] bg-ibiza-blue inline-block"></i>Geselecteerd</span>
                <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-full bg-ibiza-green inline-block"></i>Events op deze dag</span>
              </div>
            </div>

            {/* Day Panel */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
              <div className="flex items-baseline justify-between mb-4">
                <b className="text-xl font-black capitalize">{dayTitle}</b>
                <small className="text-[13px] text-velvet-obsidian/55 font-semibold">
                  {selEvents.length ? `${selEvents.length} event${selEvents.length > 1 ? 's' : ''}` : 'Geen events'}
                </small>
              </div>
              
              <div>
                {!selEvents.length ? (
                  <div className="p-5 text-center text-velvet-obsidian/55 font-semibold">
                    Geen events op deze dag.<br/>Kies een andere datum.
                  </div>
                ) : (
                  selEvents.map((ev, i) => (
                    <Link href={`/${locale}/club-tickets/${ev.venueSlug}/${ev.eventSlug}`} key={ev.id || i} className="flex gap-3.5 p-3.5 rounded-[18px] bg-ibiza-sand/30 mb-3 cursor-pointer hover:bg-ibiza-mint transition-colors group">
                      <div className="w-[62px] h-[62px] rounded-xl shrink-0 bg-gradient-to-br from-ibiza-mint to-ibiza-blue overflow-hidden relative border border-black/5">
                        {(ev.eventCover || ev.eventLogo) ? (
                          <Image src={ev.eventCover || ev.eventLogo as string} alt={ev.eventName || 'Event'} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-velvet-obsidian/40">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-[1.5]"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 15l5-5 4 4 3-3 6 6"/></svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <b className="text-[14.5px] font-bold block leading-tight truncate text-velvet-obsidian group-hover:text-ibiza-blue transition-colors">
                          {ev.eventName || ev.name}
                        </b>
                        <div className="flex items-center gap-1.5 text-velvet-obsidian/55 text-xs mt-1">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none stroke-[1.8]"><path d="M3 21h18M5 21V7l8-4 8 4v14"/></svg>
                          {ev.venueName}
                        </div>
                        {ev.lineUp && (
                          <div className="text-xs text-velvet-obsidian/50 mt-0.5 truncate">
                            {ev.lineUp.replace(/<[^>]*>?/gm, '')}
                          </div>
                        )}
                        <span className="inline-block bg-ibiza-green text-velvet-obsidian text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase mt-1.5">
                          Tickets
                        </span>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <small className="text-[10px] text-velvet-obsidian/55 block">Vanaf</small>
                        <b className="text-[15px] font-black text-velvet-obsidian">{ev.prices ? ev.prices : '€50.00'}</b>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-8 bg-ibiza-sand/50 mt-12">
        <div className="max-w-3xl mx-auto px-5 intro-seo text-velvet-obsidian/80 text-[15.5px] leading-relaxed">
          <h2 className="text-velvet-obsidian text-2xl font-black tracking-tight mb-3">De complete agenda van Ibiza 2026</h2>
          <p className="mb-3">Of je nu een weekend komt of het hele seizoen blijft — met de Ibiza mi Vida kalender plan je elke avond. Bekijk per dag welke dj's draaien, welke boat parties uitvaren en welke activiteiten je overdag kunt doen.</p>
          <p>De kalender wordt live gevoed door de ClubTickets API, dus prijzen en beschikbaarheid kloppen altijd. Klik op een event om door te gaan naar de tickets.</p>
        </div>
      </section>
    </>
  )
}
