'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Anchor, Ticket, Music, Navigation, Sun, CheckCircle, GlassWater, Car, Star, Home, Calendar, Settings, ChevronRight } from 'lucide-react'

const allCategories = [
  { label: 'Deals of the Day', href: '/deals-of-the-day', icon: Star, desc: 'Best daily offers & events' },
  { label: 'Private Boat Charters', href: '/private-boat-charters', icon: Anchor, desc: 'Yachts & exclusive rentals' },
  { label: 'Club Tickets', href: '/club-tickets', icon: Ticket, desc: 'Pacha, Amnesia, Hi Ibiza & more' },
  { label: 'Boat Parties', href: '/boat-parties', icon: Music, desc: 'Sunset cruises & music events' },
  { label: 'VIP Catamaran', href: '/vip-catamaran', icon: Navigation, desc: 'Luxury sailing experiences' },
  { label: 'Formentera Trips', href: '/formentera-boat-trips', icon: Sun, desc: 'Day trips to paradise' },
  { label: 'Guestlist', href: '/guestlist', icon: CheckCircle, desc: 'Free entry & priority access' },
  { label: 'Drink Packages', href: '/drink-packages', icon: GlassWater, desc: 'VIP tables & bottle service' },
  { label: 'Car & Scooter Rental', href: '/car-scooter-rental', icon: Car, desc: 'Explore at your own pace' },
]

const colors = ['bg-[#7086F8]', 'bg-[#89F4C7]', 'bg-[#F8B5E5]', 'bg-[#F6FE80]']
const tabs = ['All', 'Boats', 'Clubs', 'VIP', 'Rentals']

export function MobileCategoryExplorer() {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-sys-bg pb-32 pt-8">
      {/* Header */}
      <div className="px-4 pb-6">
        <h2 className="font-sans text-[18px] text-[#7C8690] font-light mb-1">Welcome to Ibiza</h2>
        <h1 className="font-sans text-[32px] text-[#030527] leading-[130%]">Find your next <br /> experience.</h1>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden flex gap-2">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-5 py-3 rounded-full font-sans text-[14px] transition-colors shadow-sm ${activeTab === tab ? 'bg-[#030527] text-white' : 'bg-white text-[#7C8690]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section Title */}
      <div className="px-4 mb-4 flex justify-between items-center">
        <h3 className="font-sans text-[18px] text-[#030527] font-medium">Explore Categories</h3>
        <span className="font-sans text-[14px] text-[#007AFF] font-medium cursor-pointer">See All</span>
      </div>

      {/* Cards List */}
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allCategories.map((cat, i) => {
          const colorClass = colors[i % colors.length]
          const isDarkText = colorClass !== 'bg-[#7086F8]'
          const textColor = isDarkText ? 'text-[#030527]' : 'text-white'
          const subtitleColor = isDarkText ? 'text-[#030527]/70' : 'text-white/70'
          const badgeBg = isDarkText ? 'bg-white/50' : 'bg-[#030527]'
          const badgeText = isDarkText ? 'text-[#030527]' : 'text-white'

          return (
            <Link href={cat.href} key={cat.label}>
              <div className={`w-full rounded-[20px] p-5 flex flex-col justify-between ${colorClass} min-h-[192px] shadow-sm hover:scale-[1.02] transition-transform relative overflow-hidden`}>
                <div className="flex justify-between items-start z-10">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${badgeBg} ${badgeText}`}>
                    <cat.icon size={24} />
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${badgeBg} ${badgeText} opacity-50`}>
                    <ChevronRight size={16} />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-auto z-10">
                  <span className={`font-sans text-[13px] font-light ${subtitleColor}`}>
                    {cat.desc}
                  </span>
                  <span className={`font-sans text-[24px] font-medium leading-[120%] ${textColor}`}>
                    {cat.label}
                  </span>
                </div>
                
                {/* Decoration blob */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto bg-[#030527]/95 backdrop-blur-xl rounded-full p-1.5 flex gap-1 shadow-2xl border border-white/10">
          <Link href="/" className="w-12 h-12 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-105">
            <Home size={22} className="text-[#030527]" />
          </Link>
          <Link href="/club-tickets" className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/10">
            <Ticket size={22} className="text-white/60" />
          </Link>
          <Link href="/deals-of-the-day" className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/10">
            <Calendar size={22} className="text-white/60" />
          </Link>
          <Link href="/admin" className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/10">
            <Settings size={22} className="text-white/60" />
          </Link>
        </div>
      </div>
    </div>
  )
}
