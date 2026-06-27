import React from 'react'
import Image from 'next/image'
import { CTVenue, CTEventDate } from '@/lib/clubtickets'

interface Props {
  days: Date[]
  venues: CTVenue[]
  events: CTEventDate[]
  locale: string
}

export function CalendarGrid({ days, venues, events, locale }: Props) {
  
  // Helper to format day header (e.g. "Mon 22 Jun")
  const formatDayHeader = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
  }

  // Helper to get events for a specific venue and day
  const getEventsForCell = (venueId: number, day: Date) => {
    const targetDateStr = day.toISOString().split('T')[0]
    return events.filter(e => {
      // Event date in our JSON might be YYYY-MM-DD
      const eDateStr = new Date(e.date).toISOString().split('T')[0]
      return e.venueId === venueId && eDateStr === targetDateStr
    })
  }

  // Find the exact event time if available, or just fallback to 23:30h 
  // (In our current data, start time is in the parent event, but we can just use a placeholder or omit if not in CTEventDate)

  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className="min-w-[1200px] w-full border-t border-l border-white/20 shadow-xl rounded-2xl overflow-hidden bg-white">
        
        {/* Header Row */}
        <div className="flex bg-[#c8caff]">
          {/* Top-Left empty corner for Venues column */}
          <div className="w-48 shrink-0 border-r border-white/50 p-4"></div>
          
          {/* Day Headers */}
          {days.map((day, i) => (
            <div key={i} className="flex-1 min-w-[200px] border-r border-white/50 p-3 text-center text-black font-bold text-sm">
              {formatDayHeader(day)}
            </div>
          ))}
        </div>

        {/* Venue Rows */}
        {venues.map(venue => (
          <div key={venue.id} className="flex border-t border-[#e2e4ff] bg-[#f8f9ff]">
            
            {/* Venue Info Column */}
            <div className="w-48 shrink-0 border-r border-[#e2e4ff] p-4 flex flex-col items-center bg-white">
              <div className="w-24 h-24 rounded-2xl overflow-hidden relative mb-3 border border-black/10 shadow-sm bg-black flex items-center justify-center">
                {venue.whitelogo ? (
                  <Image src={venue.whitelogo as string} alt={venue.name} fill className="object-contain p-2" />
                ) : venue.cover ? (
                  <Image src={venue.cover} alt={venue.name} fill className="object-cover" />
                ) : null}
              </div>
              <span className="text-black font-bold text-center text-sm">{venue.name}</span>
            </div>
            
            {/* Day Cells */}
            {days.map((day, i) => {
              const cellEvents = getEventsForCell(venue.id, day)
              
              return (
                <div key={i} className="flex-1 min-w-[200px] border-r border-[#e2e4ff] p-2 flex flex-col gap-2">
                  {cellEvents.map(event => {
                    const priceText = event.prices ? `From ${event.prices}` : 'Available'
                    
                    return (
                      <div key={event.id} className="bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                        {/* Event Header */}
                        <div className="bg-[#c8caff] px-3 py-2 flex justify-between items-center text-[10px] font-bold text-black/70">
                          <span>{day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</span>
                          <span>23:30h</span>
                        </div>
                        
                        {/* Event Body */}
                        <div className="p-4 flex flex-col grow">
                          <h4 className="font-bold text-black text-sm mb-2 leading-tight">
                            {event.eventName || event.name}
                          </h4>
                          
                          {event.lineUp && (
                            <div 
                              className="text-xs text-gray-500 mb-4 line-clamp-4"
                              dangerouslySetInnerHTML={{ __html: event.lineUp }}
                            />
                          )}
                          
                          <div className="mt-auto flex flex-col items-center gap-3 pt-2">
                            <span className="font-bold text-black">{priceText}</span>
                            <a 
                              href={event.affLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full bg-[#1A1A1A] text-white text-center py-2.5 rounded-lg text-sm font-bold hover:bg-black transition-colors"
                            >
                              Buy now
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
        
        {venues.length === 0 && (
          <div className="p-12 text-center text-gray-500 font-medium">
            No events found for this week.
          </div>
        )}
      </div>
    </div>
  )
}
