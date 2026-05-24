'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Anchor, Ticket, Music, Navigation, Sun, CheckCircle, GlassWater, Car, Star, ChevronRight } from 'lucide-react'

const allCategories = [
  { label: 'Deals of the Day', href: '/deals-of-the-day', icon: Star, desc: 'Best daily offers & events', color: 'bg-[#7086F8]', group: 'Deals' },
  { label: 'Private Boat Charters', href: '/private-boat-charters', icon: Anchor, desc: 'Yachts & exclusive rentals', color: 'bg-[#89F4C7]', group: 'Boats' },
  { label: 'Club Tickets', href: '/club-tickets', icon: Ticket, desc: 'Pacha, Amnesia, Hi Ibiza', color: 'bg-[#F8B5E5]', group: 'Clubs' },
  { label: 'Boat Parties', href: '/boat-parties', icon: Music, desc: 'Sunset cruises & music', color: 'bg-[#F6FE80]', group: 'Boats' },
  { label: 'VIP Catamaran', href: '/vip-catamaran', icon: Navigation, desc: 'Luxury sailing experiences', color: 'bg-[#7086F8]', group: 'VIP' },
  { label: 'Formentera Trips', href: '/formentera-boat-trips', icon: Sun, desc: 'Day trips to paradise', color: 'bg-[#89F4C7]', group: 'Boats' },
  { label: 'Guestlist', href: '/guestlist', icon: CheckCircle, desc: 'Free entry & access', color: 'bg-[#F8B5E5]', group: 'Clubs' },
  { label: 'Drink Packages', href: '/drink-packages', icon: GlassWater, desc: 'VIP tables & bottle service', color: 'bg-[#F6FE80]', group: 'VIP' },
  { label: 'Car & Scooter', href: '/car-scooter-rental', icon: Car, desc: 'Explore at your own pace', color: 'bg-[#7086F8]', group: 'Deals' },
]

const tabs = ['All', 'Boats', 'Clubs', 'VIP', 'Deals']

export function ColorfulCategoryList() {
  const [activeTab, setActiveTab] = useState<string | null>(null)

  // Filter categories based on active tab
  const displayedCategories = activeTab === 'All' 
    ? allCategories 
    : activeTab === null
      ? allCategories.slice(0, 3) // Show Deals, Private Boats, Club Tickets by default
      : allCategories.filter(cat => cat.group === activeTab)

  return (
    <div className="w-full max-w-5xl mx-auto pb-8">
      
      {/* Tabs */}
      <div className="mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden flex gap-2 pb-2">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-6 py-3.5 rounded-full font-sans text-[15px] font-medium transition-colors shadow-sm ${activeTab === tab ? 'bg-midnight text-white' : 'bg-white text-midnight/60 border border-black/5'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section Title */}
      <div className="mb-6 flex justify-between items-center">
        <h3 className="font-serif text-[24px] md:text-[32px] text-midnight">Explore Categories</h3>
        <Link href="/club-tickets" className="font-sans text-[16px] text-[#007AFF] font-medium cursor-pointer transition-colors hover:text-[#0056b3]">See All</Link>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {displayedCategories.map((cat) => {
          const isDarkText = cat.color !== 'bg-[#7086F8]'
          const textColor = isDarkText ? 'text-midnight' : 'text-white'
          const subtitleColor = isDarkText ? 'text-midnight/70' : 'text-white/80'
          const badgeBg = isDarkText ? 'bg-white/50' : 'bg-midnight'
          const badgeText = isDarkText ? 'text-midnight' : 'text-white'

          return (
            <Link href={cat.href} key={cat.label}>
              <div className={`w-full rounded-[24px] p-6 flex flex-col justify-between ${cat.color} h-[200px] shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all relative overflow-hidden group`}>
                <div className="flex justify-between items-start z-10">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${badgeBg} ${badgeText} shadow-sm group-hover:scale-110 transition-transform`}>
                    <cat.icon size={26} strokeWidth={1.5} />
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${badgeBg} ${badgeText} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <ChevronRight size={20} />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 mt-auto z-10">
                  <span className={`font-sans text-[13px] font-light tracking-wide ${subtitleColor}`}>
                    {cat.desc}
                  </span>
                  <span className={`font-sans text-[26px] font-medium leading-[120%] tracking-tight ${textColor}`}>
                    {cat.label}
                  </span>
                </div>
                
                {/* Decoration blob */}
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/20 transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
