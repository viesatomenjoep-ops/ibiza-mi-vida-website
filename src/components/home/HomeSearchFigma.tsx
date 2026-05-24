'use client'

import React, { useState } from 'react'
import { Search, SlidersHorizontal, MapPin, X, Ticket, Anchor, Star, Navigation } from 'lucide-react'
import type { FeaturedEvent } from '@/types/featured-event'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface HomeSearchFigmaProps {
  events: FeaturedEvent[]
}

const colors = ['bg-rustic-terracotta', 'bg-velvet-obsidian', 'bg-champagne-bronze']

const CATEGORIES = [
  { id: 'club-tickets', label: 'Club Tickets', icon: Ticket },
  { id: 'private-boat-charters', label: 'Private Boats', icon: Anchor },
  { id: 'deals-of-the-day', label: 'Deals of the Day', icon: Star },
  { id: 'vip-catamaran', label: 'VIP Catamaran', icon: Navigation },
]

const CLUBS = [
  { name: 'Amnesia', href: '/club-tickets/amnesia' },
  { name: 'Pacha', href: '/club-tickets/pacha' },
  { name: 'Hï Ibiza', href: '/club-tickets/hi-ibiza' },
  { name: 'Ushuaïa', href: '/club-tickets/ushuaia' },
  { name: 'O Beach', href: '/club-tickets/o-beach' },
  { name: 'Eden', href: '/club-tickets/eden' },
]

export function HomeSearchFigma({ events }: HomeSearchFigmaProps) {
  const [query, setQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  // If no search, show 6 popular events
  const displayEvents = events.slice(0, 6)

  // Search Results
  const searchResultsClubs = CLUBS.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
  const searchResultsEvents = events.filter(e => 
    e.title.toLowerCase().includes(query.toLowerCase()) || 
    (e.venue_name && e.venue_name.toLowerCase().includes(query.toLowerCase()))
  )

  const hasSearch = query.trim().length > 0

  return (
    <div className="w-full max-w-5xl mx-auto bg-ibiza-sand pt-6 pb-8 px-4 flex flex-col gap-6 relative">
      
      {/* Search Header */}
      <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto w-full relative z-20">
        <h2 className="font-sans text-[18px] text-velvet-obsidian text-center">Find Perfect Event</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Input 1 */}
          <div className="relative w-full">
            <div className="w-full h-12 bg-white border border-velvet-obsidian/10 rounded-[20px] flex items-center px-4 gap-3 shadow-sm focus-within:ring-2 focus-within:ring-rustic-terracotta transition-all relative z-30">
              <Search size={20} className="text-velvet-obsidian shrink-0" />
              <input 
                type="text" 
                placeholder="Search events, clubs..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-sans text-[14px] text-velvet-obsidian placeholder:text-velvet-obsidian/40"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1">
                  <X size={16} className="text-velvet-obsidian/60" />
                </button>
              )}
              <button onClick={() => setIsFilterOpen(true)} className="p-1 hover:bg-velvet-obsidian/5 rounded-md transition-colors">
                <SlidersHorizontal size={20} className="text-velvet-obsidian shrink-0" />
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {hasSearch && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-14 left-0 right-0 bg-white rounded-[20px] shadow-xl border border-velvet-obsidian/10 overflow-hidden z-50 py-2"
                >
                  {searchResultsClubs.length > 0 && (
                    <div className="px-4 py-2 border-b border-velvet-obsidian/5">
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-velvet-obsidian/40">Clubs</span>
                      <div className="mt-2 flex flex-col gap-1">
                        {searchResultsClubs.map(c => (
                          <Link href={c.href} key={c.name} className="font-sans text-[14px] text-velvet-obsidian py-2 px-3 hover:bg-ibiza-sand rounded-xl transition-colors">
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResultsEvents.length > 0 && (
                    <div className="px-4 py-2">
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-velvet-obsidian/40">Events</span>
                      <div className="mt-2 flex flex-col gap-1">
                        {searchResultsEvents.slice(0, 5).map(e => (
                          <Link href={e.cta_href || '#'} key={e.id} className="font-sans text-[14px] text-velvet-obsidian py-2 px-3 hover:bg-ibiza-sand rounded-xl transition-colors flex flex-col">
                            <span className="font-medium">{e.title}</span>
                            <span className="text-[12px] opacity-60">{e.venue_name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResultsClubs.length === 0 && searchResultsEvents.length === 0 && (
                    <div className="px-4 py-6 text-center">
                      <span className="font-sans text-[14px] text-velvet-obsidian/60">No matching clubs or events found.</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input 2 */}
          <div className="w-full h-12 bg-white border border-velvet-obsidian/10 rounded-[20px] flex items-center px-4 gap-3 shadow-sm opacity-90 z-10">
            <MapPin size={20} className="text-velvet-obsidian" />
            <input 
              type="text" 
              placeholder="Ibiza, Spain" 
              className="flex-1 bg-transparent border-none outline-none font-sans text-[14px] text-velvet-obsidian placeholder:text-velvet-obsidian/40"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-velvet-obsidian/40 backdrop-blur-sm sm:items-center"
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-[24px] text-velvet-obsidian">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="w-10 h-10 bg-ibiza-sand rounded-full flex items-center justify-center text-velvet-obsidian hover:bg-rustic-terracotta hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-sans text-[14px] font-semibold text-velvet-obsidian/60 uppercase tracking-wider">Categories</span>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-[16px] border font-sans text-[14px] transition-all ${selectedCategories.includes(cat.id) ? 'bg-velvet-obsidian text-white border-velvet-obsidian' : 'bg-white text-velvet-obsidian border-velvet-obsidian/10 hover:border-velvet-obsidian/30'}`}
                    >
                      <cat.icon size={16} />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-rustic-terracotta text-white rounded-full py-4 font-sans text-[16px] font-semibold mt-4 shadow-lg shadow-rustic-terracotta/20 hover:bg-rustic-terracotta/90 transition-colors"
              >
                Show Results
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Event List (Only show when not searching) */}
      {!hasSearch && (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full mt-4 z-10">
          <h3 className="font-sans text-[18px] text-velvet-obsidian mb-1 text-center md:text-left">Popular Events</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className={`w-full ${colorBg} rounded-[20px] p-5 flex flex-col gap-6 shadow-sm hover:scale-[1.02] transition-transform`}>
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
      )}
    </div>
  )
}
