'use client'

import React from 'react'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'
import type { FeaturedEvent } from '@/types/featured-event'
import Link from 'next/link'

interface HomeSearchFigmaProps {
  events: FeaturedEvent[]
}

const colors = ['bg-rustic-terracotta', 'bg-velvet-obsidian', 'bg-champagne-bronze']

export function HomeSearchFigma({ events }: HomeSearchFigmaProps) {
  // If no events, provide some fallbacks just in case
  const displayEvents = events.slice(0, 3)

  return (
    <div className="w-full max-w-5xl mx-auto bg-ibiza-sand pt-6 pb-8 px-4 flex flex-col gap-6">
      
      {/* Search Header */}
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto w-full">
        <h2 className="font-sans text-[18px] text-velvet-obsidian text-center">Find Perfect Event</h2>
        
        {/* Input 1 */}
        <div className="w-full h-12 bg-white border border-velvet-obsidian/10 rounded-full flex items-center px-4 gap-3 shadow-sm">
          <Search size={20} className="text-velvet-obsidian" />
          <input 
            type="text" 
            placeholder="Search events, clubs..." 
            className="flex-1 bg-transparent border-none outline-none font-sans text-[14px] text-velvet-obsidian placeholder:text-velvet-obsidian/40"
          />
          <SlidersHorizontal size={20} className="text-velvet-obsidian" />
        </div>

        {/* Input 2 */}
        <div className="w-full h-12 bg-white border border-velvet-obsidian/10 rounded-full flex items-center px-4 gap-3 shadow-sm">
          <MapPin size={20} className="text-velvet-obsidian" />
          <input 
            type="text" 
            placeholder="Ibiza, Spain" 
            className="flex-1 bg-transparent border-none outline-none font-sans text-[14px] text-velvet-obsidian placeholder:text-velvet-obsidian/40"
          />
        </div>
      </div>

      {/* Popular Event List */}
      <div className="flex flex-col gap-3 max-w-md mx-auto w-full mt-4">
        <h3 className="font-sans text-[18px] text-velvet-obsidian mb-1">Popular Events</h3>

        {displayEvents.map((evt, idx) => {
          const colorBg = colors[idx % colors.length]
          const isDarkBg = colorBg === 'bg-velvet-obsidian' || colorBg === 'bg-rustic-terracotta'
          const textColor = isDarkBg ? 'text-ibiza-sand' : 'text-velvet-obsidian'
          
          let day = '--'
          let month = '---'
          if (evt.event_date) {
            const d = new Date(evt.event_date)
            day = d.getDate().toString()
            month = d.toLocaleString('en-US', { month: 'short' })
          }

          // Random avatar mock for UI
          const randomCount = Math.floor(Math.random() * 20) + 5

          return (
            <Link href={evt.cta_href || '#'} key={evt.id}>
              <div className={`w-full ${colorBg} rounded-[20px] p-4 flex flex-col gap-5 shadow-sm hover:scale-[1.02] transition-transform`}>
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 ${isDarkBg ? 'bg-white/10' : 'bg-white/40'} rounded-full flex flex-col items-center justify-center -mt-1 shadow-sm shrink-0 backdrop-blur-sm`}>
                    <span className={`font-sans text-[18px] font-medium ${textColor} leading-tight`}>{day}</span>
                    <span className={`font-sans text-[10px] font-light ${textColor} opacity-80`}>{month}</span>
                  </div>
                  <h4 className={`font-sans text-[16px] font-light ${textColor} leading-[140%] max-w-[180px] line-clamp-2 opacity-90`}>
                    {evt.subtitle || evt.venue_name || 'Ibiza mi vida Selection'}
                  </h4>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex flex-col flex-1 gap-2 pr-2">
                    <span className={`font-sans text-[12px] font-light ${textColor} opacity-80`}>{evt.venue_name || 'Exclusive Provider'}</span>
                    <h3 className={`font-sans text-[24px] font-medium ${textColor} leading-[110%] max-w-[200px] line-clamp-2`}>
                      {evt.title}
                    </h3>
                  </div>
                  
                  <div className={`flex items-center ${isDarkBg ? 'bg-white/10' : 'bg-white/40'} rounded-full py-1 pr-3 pl-1 backdrop-blur-sm gap-1 shrink-0`}>
                    <div className="flex -space-x-3">
                      <div className="w-8 h-8 rounded-full border border-white/50 bg-gray-300 overflow-hidden z-[1]"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="user" className="w-full h-full object-cover" /></div>
                      <div className="w-8 h-8 rounded-full border border-white/50 bg-gray-400 overflow-hidden z-[2]"><img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80" alt="user" className="w-full h-full object-cover" /></div>
                      <div className="w-8 h-8 rounded-full border border-white/50 bg-white/20 z-[3]" />
                    </div>
                    <span className={`font-sans text-[12px] ${textColor} font-medium ml-1`}>{randomCount}+</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
