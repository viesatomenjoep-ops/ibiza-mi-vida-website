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
    <div className="w-full max-w-5xl mx-auto bg-white px-4 py-8">
      {/* Ratings Header */}
      <div className="max-w-md mx-auto">
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
        <div className="flex flex-col gap-4">
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
