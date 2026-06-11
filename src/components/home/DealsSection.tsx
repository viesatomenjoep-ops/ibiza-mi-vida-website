'use client'

import { useState } from 'react'
import { Calendar, CheckCircle2, Circle, MessageCircle } from 'lucide-react'
import { DealTimer } from '@/components/ui/DealTimer'
import { DealDateBanner } from '@/components/ui/DealDateBanner'
import { useCart } from '@/context/cart-context'

interface Deal {
  id: string
  name: string
  day: string
  price: string
  type: string
}

const mockDailyDeals: Deal[] = [
  { id: 'd1', name: 'VIP Sunset Boat Charter', day: 'Today', price: '€499', type: 'Private Boat' },
  { id: 'd2', name: 'Amnesia VIP Balcony', day: 'Tonight', price: '€129', type: 'Club Ticket' },
  { id: 'd3', name: 'Oceanbeat Boat Party', day: 'Today 14:00', price: '€59', type: 'Boat Party' },
  { id: 'd4', name: 'Formentera Day Trip', day: 'Tomorrow', price: '€149', type: 'Excursion' },
]

const mockWeeklyDeals: Deal[] = [
  { id: 'w1', name: 'Hï Ibiza Access All Areas', day: 'Valid all week', price: '€199', type: 'Club Ticket' },
  { id: 'w2', name: 'Luxury Catamaran (12 pax)', day: 'Valid all week', price: '€1,200', type: 'Catamaran' },
  { id: 'w3', name: 'O Beach VIP Bed', day: 'Valid all week', price: '€450', type: 'Beach Club' },
]

export function DealsSection() {
  const { addToCart, openDrawer } = useCart()
  const [selectedDailyDeals, setSelectedDailyDeals] = useState<string[]>([])

  const toggleDailyDeal = (id: string) => {
    setSelectedDailyDeals(prev => 
      prev.includes(id) ? prev.filter(dealId => dealId !== id) : [...prev, id]
    )
  }

  const handleAddToCart = () => {
    const selected = mockDailyDeals.filter(d => selectedDailyDeals.includes(d.id))
    if (selected.length === 0) return

    selected.forEach(d => {
      addToCart({
        serviceId: 'deal-of-the-day-' + d.id,
        title: d.name,
        price: parseInt(d.price.replace('€', '').replace(',', ''), 10) || 0,
        image: '/fotos/hero-pattern.jpg',
        date: d.day
      })
    })
    
    setSelectedDailyDeals([])
    openDrawer()
  }

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8 md:gap-10">
      
      {/* ── Deal of the Day ── */}
      <div className="bg-ibiza-sand rounded-[32px] overflow-hidden flex flex-col shadow-sm border border-black/5">
        
        {/* Banner */}
        <div className="bg-white border-b border-velvet-obsidian/5 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-velvet-obsidian"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <div className="z-10 text-center md:text-left flex-1">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-rustic-terracotta/10 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wider text-rustic-terracotta border border-rustic-terracotta/20">
              <span className="h-1.5 w-1.5 rounded-full bg-rustic-terracotta shadow-[0_0_8px_rgba(206,108,71,0.8)] animate-pulse" />
              Live Offers
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-velvet-obsidian mb-3">Deal of the Day</h2>
            <p className="text-velvet-obsidian/70 font-sans text-sm md:text-base max-w-lg">The best hand-picked offers across all categories. Select the deals you want and book via WhatsApp before the timer runs out!</p>
          </div>
          <div className="z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shrink-0 shadow-lg">
            <DealTimer />
          </div>
        </div>

        {/* Content (Checkboxes) */}
        <div className="p-4 md:p-8 flex flex-col gap-4 max-w-3xl mx-auto w-full">
          {mockDailyDeals.map((deal) => {
            const isSelected = selectedDailyDeals.includes(deal.id)
            return (
              <button
                key={deal.id}
                onClick={() => toggleDailyDeal(deal.id)}
                className={`w-full bg-white rounded-[20px] p-4 flex justify-between items-center transition-all shadow-sm border ${isSelected ? 'border-rustic-terracotta ring-1 ring-rustic-terracotta bg-rustic-terracotta/5' : 'border-velvet-obsidian/10 hover:border-velvet-obsidian/30'}`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="shrink-0 text-rustic-terracotta transition-colors">
                    {isSelected ? <CheckCircle2 size={24} className="fill-rustic-terracotta text-white" /> : <Circle size={24} className="text-velvet-obsidian/30" />}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-wider text-rustic-terracotta mb-0.5">{deal.type}</span>
                    <span className="font-sans text-[16px] md:text-[18px] font-medium text-velvet-obsidian leading-tight">{deal.name}</span>
                    <span className="font-sans text-[12px] font-medium text-velvet-obsidian/60 mt-1">{deal.day}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span className="font-sans text-[18px] md:text-[22px] font-bold text-velvet-obsidian">{deal.price}</span>
                </div>
              </button>
            )
          })}
          
          <div className="mt-4 pt-6 border-t border-velvet-obsidian/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-sans text-sm text-velvet-obsidian/60 font-medium text-center md:text-left">
              {selectedDailyDeals.length} deal{selectedDailyDeals.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={handleAddToCart}
              disabled={selectedDailyDeals.length === 0}
              className="flex w-full md:w-auto items-center justify-center gap-2 rounded-full bg-black px-8 py-3.5 font-sans text-sm font-semibold text-white shadow-lg shadow-black/30 transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Selected to Cart
            </button>
          </div>
        </div>
      </div>


      {/* ── Deal of the Week ── */}
      <div className="bg-ibiza-sand rounded-[32px] overflow-hidden flex flex-col shadow-sm border border-black/5">
        
        {/* Banner */}
        <div className="bg-gradient-to-br from-rustic-terracotta to-orange-900 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <div className="z-10 text-center md:text-left flex-1">
            <DealDateBanner />
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-3 mt-4">Deal of the Week</h2>
            <p className="text-white/70 font-sans text-sm md:text-base max-w-lg">Incredible weekly offers. Explore these events and add them to your Ibiza itinerary before they sell out.</p>
          </div>
          <div className="z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shrink-0 shadow-lg">
            <DealTimer />
          </div>
        </div>

        {/* Content (Clickable Modals) */}
        <div className="p-4 md:p-8 flex flex-col gap-4 max-w-3xl mx-auto w-full">
          {mockWeeklyDeals.map((deal) => (
            <button
              key={deal.id}
              onClick={() => {
                addToCart({
                  serviceId: 'deal-of-the-week-' + deal.id,
                  title: deal.name,
                  price: parseInt(deal.price.replace('€', '').replace(',', ''), 10) || 0,
                  image: '/fotos/hero-pattern.jpg',
                  date: deal.day
                });
                openDrawer();
              }}
              className="w-full bg-white rounded-[20px] p-4 flex justify-between items-center transition-all shadow-sm border border-velvet-obsidian/10 hover:border-velvet-obsidian/30 hover:scale-[1.01] hover:shadow-md group"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-full bg-ibiza-sand flex items-center justify-center shadow-inner border border-velvet-obsidian/5 shrink-0 transition-transform group-hover:scale-110">
                  <Calendar size={20} className="text-rustic-terracotta" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-wider text-rustic-terracotta mb-0.5">{deal.type}</span>
                  <span className="font-sans text-[16px] md:text-[18px] font-medium text-velvet-obsidian leading-tight">{deal.name}</span>
                  <span className="font-sans text-[12px] font-medium text-velvet-obsidian/60 mt-1">{deal.day}</span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="font-sans text-[18px] md:text-[22px] font-bold text-velvet-obsidian">{deal.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
