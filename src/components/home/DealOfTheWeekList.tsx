'use client'

import { useBooking } from '@/context/booking-context'

const mockDeals = [
  { name: 'Oceanbeat VIP Boat', day: 'Thursday', price: '€89', type: 'Boat Party' },
  { name: 'Amnesia Balcony', day: 'Friday', price: '€120', type: 'Club Ticket' },
  { name: 'Formentera Trip', day: 'Saturday', price: '€150', type: 'Excursion' },
]

export function DealOfTheWeekList() {
  const { openModal } = useBooking()

  return (
    <div className="flex-1 flex flex-col gap-3">
      {mockDeals.map((deal) => (
        <button
          key={deal.name}
          onClick={() => openModal({
            serviceType: deal.type,
            serviceName: deal.name,
            sourcePage: '/homepage (Deal of the week)'
          })}
          className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center transition-all hover:bg-white/10 hover:border-gold/30 hover:scale-[1.02]"
        >
          <div>
            <p className="font-semibold text-white text-sm">{deal.name}</p>
            <p className="text-xs text-sandstone/70">{deal.day}</p>
          </div>
          <span className="text-gold font-bold">{deal.price}</span>
        </button>
      ))}
    </div>
  )
}
