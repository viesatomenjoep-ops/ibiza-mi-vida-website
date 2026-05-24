'use client'

import { useBooking } from '@/context/booking-context'
import { Calendar } from 'lucide-react'

const mockDeals = [
  { name: 'Oceanbeat VIP Boat', day: 'Thursday', price: '€89', type: 'Boat Party' },
  { name: 'Amnesia Balcony', day: 'Friday', price: '€120', type: 'Club Ticket' },
  { name: 'Formentera Trip', day: 'Saturday', price: '€150', type: 'Excursion' },
]

export function DealOfTheWeekList() {
  const { openModal } = useBooking()

  return (
    <div className="w-full max-w-md mx-auto bg-ibiza-sand pt-2 pb-6 px-4 flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex flex-col gap-1 mb-2">
        <h3 className="font-sans text-[20px] font-medium text-velvet-obsidian">Deal of the Week</h3>
        <p className="font-sans text-[14px] text-velvet-obsidian/60">18 May — 24 May</p>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {mockDeals.map((deal) => (
          <button
            key={deal.name}
            onClick={() => openModal({
              serviceType: deal.type,
              serviceName: deal.name,
              sourcePage: '/homepage (Deal of the week)'
            })}
            className="w-full bg-white rounded-[16px] p-4 flex justify-between items-center transition-transform hover:scale-[1.02] shadow-sm border border-velvet-obsidian/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ibiza-sand flex items-center justify-center shadow-sm border border-velvet-obsidian/5 shrink-0">
                <Calendar size={18} className="text-rustic-terracotta" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="font-sans text-[16px] font-medium text-velvet-obsidian line-clamp-1">{deal.name}</span>
                <span className="font-sans text-[12px] font-light text-velvet-obsidian/60">{deal.day}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="font-sans text-[18px] font-medium text-champagne-bronze">{deal.price}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
