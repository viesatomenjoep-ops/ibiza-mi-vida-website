'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Search } from 'lucide-react'
import { CalendarModal } from '@/components/ui/CalendarModal'
import Image from 'next/image'

export function HomeSearchWidget() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Clubbing')
  const [date, setDate] = useState('')

  const tabs = ['Clubbing', 'Ibiza Boat', 'Activities', 'Ferry']
  const months = ['May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26']
  
  const handleSearch = () => {
    let route = '/club-tickets'
    if (activeTab === 'Ibiza Boat') route = '/boat-parties'
    if (activeTab === 'Activities') route = '/deals-of-the-day'
    if (activeTab === 'Ferry') route = '/formentera-boat-trips'
    
    const params = date ? `?date=${date}` : ''
    router.push(`${route}${params}`)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      
      {/* Search Bar Container */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-2 md:p-3 overflow-hidden border border-white">
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 px-3 pt-2 pb-4 border-b border-black/10">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? 'bg-midnight text-white shadow-md scale-105' 
                  : 'bg-transparent text-midnight hover:bg-black/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Input & Search */}
        <div className="flex flex-col md:flex-row items-center gap-2 p-2">
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

      {/* Calendar Browse & Months */}
      <div className="mt-4 flex flex-col gap-4 text-center md:text-left">
        <p className="text-midnight/70 font-semibold drop-shadow-sm text-sm">Or browse our full calendar and discover everything thats going on:</p>
        
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {months.map(m => (
            <button key={m} className="px-4 py-2 rounded-full bg-white/60 hover:bg-white/90 backdrop-blur-md text-midnight text-sm font-bold shadow-sm transition-all hover:scale-105 border border-white">
              {m}
            </button>
          ))}
        </div>
        
        {/* Quick Club Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
          {['UNVRS', 'Ushuaïa Ibiza', 'Hï Ibiza'].map(club => (
            <div key={club} className="flex items-center gap-2 bg-midnight/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide border border-white/20">
              <span className="w-2 h-2 rounded-full bg-gold"></span>
              {club}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
