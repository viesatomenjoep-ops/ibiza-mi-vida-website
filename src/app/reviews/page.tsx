import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reviews & Ratings | Ibiza mi vida',
  description: 'See what our guests say about their Ibiza mi vida experience.',
}

const reviews = [
  {
    name: 'Lucy Bennett',
    rating: 4.6,
    text: 'I booked a private boat charter through Ibiza mi vida, and it made everything so smooth. The captain was amazing!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  },
  {
    name: 'Sophia Carter',
    rating: 4.7,
    text: 'As an event planner, the VIP table booking service is a game-changer. Absolutely flawless execution.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
  },
  {
    name: 'David Harper',
    rating: 4.8,
    text: 'The push notifications and instant WhatsApp messaging were incredibly useful for our group trip. 10/10.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
  },
  {
    name: 'Sarah Mitchell',
    rating: 4.9,
    text: 'We had a few hiccups setting up our itinerary, but the customer support team was amazing and fixed it instantly.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
  },
  {
    name: 'James Wilson',
    rating: 5.0,
    text: 'Booked our club tickets for Amnesia here. Skip the line worked perfectly. Will definitely use again.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  }
]

export default function ReviewsPage() {
  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-[#EFF2F6] pb-32">
      {/* ── Top Nav Chrome ── */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-6">
        <Link 
          href="/"
          className="w-12 h-12 bg-white/30 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
        >
          <ChevronLeft size={22} className="text-white" />
        </Link>
      </div>

      {/* ── Hero Image & Floating Header ── */}
      <div className="relative h-[311px] w-full bg-midnight overflow-hidden">
        <Image
          src="/fotos/Vanquish 1.jpg"
          alt="Ibiza mi vida Experience"
          fill
          className="object-cover opacity-80"
          priority
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-60" />

        {/* Organizer Float Box */}
        <div className="absolute bottom-6 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-[12px] p-4 flex justify-between items-center shadow-lg">
          <div className="flex flex-col gap-1">
            <h1 className="font-sans text-[16px] text-white">Ibiza mi vida Concierge</h1>
            <span className="font-sans text-[10px] text-[#EFF2F6] font-light">
              100+ upcoming events: VIP tables, boat charters, club nights.
            </span>
          </div>
          <Link href="/" className="bg-[#030527] text-white text-[12px] px-5 py-2 rounded-full font-sans hover:bg-[#030527]/80 transition-colors whitespace-nowrap">
            Book Now
          </Link>
        </div>
      </div>

      {/* ── Body Container ── */}
      <div className="bg-white min-h-[600px] w-full rounded-t-[20px] -mt-2 relative z-10 p-4">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden pt-2">
          <Link href="/" className="px-5 py-3 rounded-full bg-[#F7F8FA] text-[#7C8690] font-sans text-[14px] whitespace-nowrap transition-colors">
            All
          </Link>
          <Link href="/club-tickets" className="px-5 py-3 rounded-full bg-[#F7F8FA] text-[#7C8690] font-sans text-[14px] whitespace-nowrap transition-colors">
            Events
          </Link>
          <button className="px-5 py-3 rounded-full bg-[#7086F8] text-white font-sans text-[14px] font-medium whitespace-nowrap shadow-sm">
            Reviews
          </button>
        </div>

        {/* Ratings Header */}
        <div className="bg-[#F7F8FA] rounded-[16px] p-4 flex flex-col gap-4 mb-6">
          <h2 className="font-serif text-[18px] text-[#030527]">Ratings & Review</h2>
          <div className="flex items-center gap-3">
            <span className="font-sans font-medium text-[34px] text-[#030527] leading-none">5.0</span>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-5 h-5 bg-[#FFB11A] rounded flex items-center justify-center">
                    <Star size={12} className="text-white fill-white" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#7086F8] text-white text-[10px] px-2 py-0.5 rounded-full font-sans">Excellent</span>
                <span className="font-sans text-[12px] text-[#7C8690]">Based on 982 Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex flex-col gap-4 pb-20">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-[#F7F8FA] rounded-[20px] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden relative shrink-0">
                  <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-sans text-[16px] font-medium text-[#030527]">{rev.name}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <div key={star} className={`w-3 h-3 rounded-[3px] flex items-center justify-center ${star <= Math.floor(rev.rating) ? 'bg-[#FFB11A]' : 'bg-gray-300'}`}>
                          <Star size={8} className="text-white fill-white" />
                        </div>
                      ))}
                    </div>
                    <span className="font-sans text-[12px] text-[#7C8690] ml-1">{rev.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <p className="font-sans text-[14px] text-[#7C8690] leading-[140%]">
                {rev.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
