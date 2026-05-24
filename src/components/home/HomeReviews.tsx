import React from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'

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
  }
]

export function HomeReviews() {
  return (
    <div className="w-full max-w-5xl mx-auto bg-ibiza-sand px-4 py-8">
      {/* Ratings Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
        
        {/* Ratings Header (Left Column on Desktop) */}
        <div className="w-full md:w-1/3 shrink-0">
          <div className="bg-white rounded-[16px] p-6 flex flex-col gap-4 shadow-sm border border-velvet-obsidian/5">
            <h2 className="font-serif text-[24px] text-velvet-obsidian">Ratings & Reviews</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-end gap-3">
                <span className="font-sans font-medium text-[48px] text-velvet-obsidian leading-none">5.0</span>
                <div className="flex flex-col gap-1 pb-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-6 h-6 bg-champagne-bronze rounded flex items-center justify-center">
                        <Star size={14} className="text-white fill-white" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-velvet-obsidian text-ibiza-sand text-[12px] px-3 py-1 rounded-full font-sans uppercase tracking-wider font-bold">Excellent</span>
                <span className="font-sans text-[14px] text-velvet-obsidian/60">Based on 982 Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List (Right Column on Desktop, Grid layout) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-white rounded-[20px] p-5 flex flex-col gap-4 shadow-sm border border-velvet-obsidian/5 h-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0">
                  <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-sans text-[16px] font-medium text-velvet-obsidian">{rev.name}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <div key={star} className={`w-3.5 h-3.5 rounded-[3px] flex items-center justify-center ${star <= Math.floor(rev.rating) ? 'bg-champagne-bronze' : 'bg-gray-300'}`}>
                          <Star size={8} className="text-white fill-white" />
                        </div>
                      ))}
                    </div>
                    <span className="font-sans text-[12px] text-velvet-obsidian/60 ml-1">{rev.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <p className="font-sans text-[14px] text-velvet-obsidian/80 leading-[150%]">
                {rev.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
