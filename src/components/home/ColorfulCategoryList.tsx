'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Anchor, Ticket, Music, Navigation, Sun, CheckCircle, GlassWater, Car, Star, ChevronRight } from 'lucide-react'

const allCategories = [
  { label: 'Deals of the Day', href: '/deals-of-the-day', icon: Star, desc: 'Best daily offers', color: 'bg-velvet-obsidian', group: 'Deals' },
  { label: 'Private Boat Charters', href: '/private-boat-charters', icon: Anchor, desc: 'Yachts & rentals', color: 'bg-champagne-bronze', group: 'Boats' },
  
  // Specific Clubs
  { label: 'Pacha', href: '/club-tickets/pacha', icon: Ticket, desc: 'Ibiza Town', color: 'bg-velvet-obsidian', group: 'Clubs' },
  { label: 'Amnesia', href: '/club-tickets/amnesia', icon: Ticket, desc: 'San Rafael', color: 'bg-champagne-bronze', group: 'Clubs' },
  { label: 'Hï Ibiza', href: '/club-tickets/hi-ibiza', icon: Ticket, desc: 'Playa d\'en Bossa', color: 'bg-rustic-terracotta', group: 'Clubs' },
  { label: 'Ushuaïa', href: '/club-tickets/ushuaia', icon: Ticket, desc: 'Playa d\'en Bossa', color: 'bg-velvet-obsidian', group: 'Clubs' },
  { label: 'O Beach', href: '/club-tickets/o-beach', icon: Ticket, desc: 'San Antonio', color: 'bg-champagne-bronze', group: 'Clubs' },
  { label: 'Eden', href: '/club-tickets/eden', icon: Ticket, desc: 'San Antonio', color: 'bg-rustic-terracotta', group: 'Clubs' },
  { label: 'Swag Ibiza', href: '/club-tickets/swag-ibiza', icon: Ticket, desc: 'Playa d\'en Bossa', color: 'bg-velvet-obsidian', group: 'Clubs' },
  { label: '528 Ibiza', href: '/club-tickets/528-ibiza', icon: Ticket, desc: 'San Antonio Hills', color: 'bg-champagne-bronze', group: 'Clubs' },
  { label: 'UNVRS', href: '/club-tickets/universe', icon: Ticket, desc: 'San Rafael', color: 'bg-rustic-terracotta', group: 'Clubs' },
  { label: 'Lío', href: '/club-tickets/lio', icon: Ticket, desc: 'Ibiza Marina', color: 'bg-velvet-obsidian', group: 'Clubs' },
  { label: 'Ibiza Rocks', href: '/club-tickets/ibiza-rocks', icon: Ticket, desc: 'San Antonio', color: 'bg-champagne-bronze', group: 'Clubs' },
  { label: 'Es Paradis', href: '/club-tickets/es-paradis', icon: Ticket, desc: 'San Antonio', color: 'bg-rustic-terracotta', group: 'Clubs' },
  { label: 'Playa Soleil', href: '/club-tickets/playa-soleil', icon: Ticket, desc: 'Playa d\'en Bossa', color: 'bg-velvet-obsidian', group: 'Clubs' },
  { label: 'Bam Bu Ku', href: '/club-tickets/bam-bu-ku', icon: Ticket, desc: 'San Antonio', color: 'bg-champagne-bronze', group: 'Clubs' },
  { label: 'Chinois', href: '/club-tickets/chinois', icon: Ticket, desc: 'Ibiza Marina', color: 'bg-rustic-terracotta', group: 'Clubs' },
  
  { label: 'VIP Catamaran', href: '/vip-catamaran', icon: Navigation, desc: 'Luxury sailing', color: 'bg-champagne-bronze', group: 'VIP' },
  { label: 'Formentera Trips', href: '/formentera-boat-trips', icon: Sun, desc: 'Day trips', color: 'bg-rustic-terracotta', group: 'Boats' },
  { label: 'Package Deals', href: '/package-deals', icon: CheckCircle, desc: 'Ticket + table + transfer', color: 'bg-champagne-bronze', group: 'Clubs' },
  { label: 'Guestlist', href: '/guestlist', icon: CheckCircle, desc: 'Free sign-up via WhatsApp', color: 'bg-velvet-obsidian', group: 'Clubs' },
  { label: 'Car Rental Ibiza', href: '/car-rental-ibiza', icon: Car, desc: 'All-in, from the airport', color: 'bg-rustic-terracotta', group: 'Deals' },
]

const tabs = ['All', 'Boats', 'Clubs', 'VIP', 'Deals']

export function ColorfulCategoryList() {
  const [activeTab, setActiveTab] = useState<string | null>(null)

  // Filter categories based on active tab
  const displayedCategories = activeTab === 'All' 
    ? allCategories.filter(cat => cat.group !== 'Clubs') // Show high level when All is selected
    : activeTab === null
      ? allCategories.filter(cat => cat.label === 'Deals of the Day' || cat.label === 'Private Boat Charters' || cat.label === 'Club Tickets') // Show defaults
      : allCategories.filter(cat => cat.group === activeTab)

  return (
    <div className="w-full max-w-5xl mx-auto pb-8">
      
      {/* Tabs */}
      <div className="mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden flex gap-2 pb-2">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-sans text-[14px] font-medium transition-colors shadow-sm ${activeTab === tab ? 'bg-velvet-obsidian text-ibiza-sand' : 'bg-white text-velvet-obsidian/60 border border-black/5'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section Title */}
      <div className="mb-6 flex justify-between items-center">
        <h3 className="font-serif text-[24px] md:text-[32px] text-velvet-obsidian">Explore Categories</h3>
        <Link href="/club-tickets" className="font-sans text-[16px] text-champagne-bronze font-medium cursor-pointer transition-colors hover:text-rustic-terracotta">See All</Link>
      </div>

      {/* Cards List (Smaller sizing) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {displayedCategories.map((cat) => {
          const isDarkBg = cat.color === 'bg-velvet-obsidian' || cat.color === 'bg-rustic-terracotta'
          const textColor = isDarkBg ? 'text-ibiza-sand' : 'text-velvet-obsidian'
          const subtitleColor = isDarkBg ? 'text-ibiza-sand/80' : 'text-velvet-obsidian/70'
          const badgeBg = isDarkBg ? 'bg-white/10' : 'bg-white/40'
          const badgeText = isDarkBg ? 'text-ibiza-sand' : 'text-velvet-obsidian'

          return (
            <Link href={cat.href} key={cat.label}>
              <div className={`w-full rounded-[20px] p-4 flex flex-col justify-between ${cat.color} h-[130px] shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all relative overflow-hidden group`}>
                <div className="flex justify-between items-start z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${badgeBg} ${badgeText} shadow-sm group-hover:scale-110 transition-transform`}>
                    <cat.icon size={20} strokeWidth={1.5} />
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${badgeBg} ${badgeText} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <ChevronRight size={16} />
                  </div>
                </div>
                
                <div className="flex flex-col mt-auto z-10">
                  <span className={`font-sans text-[11px] font-light tracking-wide ${subtitleColor} line-clamp-1`}>
                    {cat.desc}
                  </span>
                  <span className={`font-sans text-[18px] font-medium leading-[120%] tracking-tight ${textColor} line-clamp-1`}>
                    {cat.label}
                  </span>
                </div>
                
                {/* Decoration blob */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:bg-white/20 transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
