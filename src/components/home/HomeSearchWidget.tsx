'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react'

const allCategories = [
  { label: 'Deals of the Day', href: '/deals-of-the-day' },
  { label: 'Private Boat Charters', href: '/private-boat-charters' },
  { label: 'Club Tickets', href: '/club-tickets' },
  { label: 'Boat Parties', href: '/boat-parties' },
  { label: 'VIP Catamaran', href: '/vip-catamaran' },
  { label: 'Formentera Trips', href: '/formentera-boat-trips' },
  { label: 'Guestlist', href: '/guestlist' },
  { label: 'Drink Packages', href: '/drink-packages' },
  { label: 'Car & Scooter Rental', href: '/car-scooter-rental' },
]

export function HomeSearchWidget() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(allCategories[0].href)
  const [date, setDate] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSearch = () => {
    const params = date ? `?date=${date}` : ''
    router.push(`${activeTab}${params}`)
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      
      {/* Search Bar Container */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-2 md:p-3 overflow-hidden border border-white">
        
        {/* Tabs - Scrollable horizontally */}
        <div className="relative border-b border-black/10 flex items-center">
          
          <button 
            onClick={scrollLeft}
            className="absolute left-0 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md text-midnight hover:bg-gold transition-colors ml-2 md:hidden block"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 z-10 p-2 bg-white shadow-md rounded-full text-midnight hover:bg-gold hover:text-white transition-all transform -translate-x-1/2"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          <div 
            ref={scrollRef}
            className="flex flex-1 overflow-x-auto gap-4 px-8 md:px-12 pt-4 pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {allCategories.map(tab => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.href)
                  const params = date ? `?date=${date}` : ''
                  router.push(`${tab.href}${params}`)
                }}
                className={`shrink-0 px-8 py-4 rounded-full text-base md:text-lg font-bold tracking-wide transition-all ${
                  activeTab === tab.href 
                    ? 'bg-midnight text-white shadow-xl scale-105 border border-midnight' 
                    : 'bg-white/50 text-midnight hover:bg-white border border-black/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={scrollRight}
            className="absolute right-0 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md text-midnight hover:bg-gold transition-colors mr-2 md:hidden block"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
          
          <button 
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 z-10 p-2 bg-white shadow-md rounded-full text-midnight hover:bg-gold hover:text-white transition-all transform translate-x-1/2"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Input & Search */}
        <div className="flex flex-col md:flex-row items-center gap-2 p-2 mt-2">
          <div className="flex-1 flex flex-col px-4 py-3 bg-white hover:bg-sandstone/10 transition-colors rounded-2xl w-full">
            <label htmlFor="search-date" className="text-xs font-bold uppercase tracking-wider text-midnight/50 mb-1 flex items-center gap-2">
              <Calendar size={12} />
              Dates
            </label>
            <input
              id="search-date"
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent font-sans text-lg font-medium text-midnight focus:outline-none cursor-pointer"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full md:w-auto h-[68px] px-10 bg-gold hover:bg-gold/90 transition-colors text-midnight font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search size={20} />
            Search
          </button>
        </div>
      </div>
    </div>
  )
}
