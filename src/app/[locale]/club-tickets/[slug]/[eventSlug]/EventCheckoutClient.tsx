'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Calendar, MapPin, ExternalLink, Ticket, CheckCircle2, ChevronDown, Lock } from 'lucide-react'
import type { CTEventDate, CTEvent } from '@/lib/clubtickets'

interface Props {
  selectedDateObj: CTEventDate
  allEventDates: CTEventDate[]
  fullEvent?: CTEvent
  locale: string
}

export function EventCheckoutClient({ selectedDateObj, allEventDates, fullEvent, locale }: Props) {
  const [ticketCount, setTicketCount] = useState(1)

  const dateFormatted = new Date(selectedDateObj.date).toLocaleDateString(locale, { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  })

  // Parse price
  let priceNum = 50;
  if (selectedDateObj.prices) {
    const match = selectedDateObj.prices.match(/\d+([.,]\d+)?/);
    if (match) priceNum = parseFloat(match[0].replace(',', '.'));
  }

  const imageUrl = selectedDateObj.eventCover || selectedDateObj.eventLogo || selectedDateObj.venueCover || selectedDateObj.venueLogo || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=85'

  const handleCheckout = () => {
    // We send them to ClubTickets where they can finalize their basket
    window.open(selectedDateObj.affLink, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] pt-20 pb-24">
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden bg-black border-b border-white/10">
        <Image 
          src={imageUrl} 
          alt={selectedDateObj.eventName || ''} 
          fill 
          className="object-cover opacity-60 mix-blend-screen"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 z-10">
          <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
            <span className="bg-[#00A698]/20 text-[#00A698] px-3 py-1 rounded-md text-xs md:text-sm uppercase tracking-wider font-bold border border-[#00A698]/30">
              Official Tickets
            </span>
            <h1 className="text-4xl md:text-6xl font-black font-serif text-white leading-tight drop-shadow-md">
              {selectedDateObj.eventName}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/80 font-medium">
              <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <Calendar size={16} className="text-[#00A698]" /> {dateFormatted}
              </span>
              <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <MapPin size={16} className="text-amber-500" /> {selectedDateObj.venueName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {selectedDateObj.lineUp && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Ticket className="text-[#00A698]" /> Line Up
              </h2>
              <p className="text-[#1A1A1A]/80 leading-relaxed text-lg">
                {selectedDateObj.lineUp}
              </p>
            </div>
          )}

          {fullEvent?.description && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About this Event</h2>
              <div className="prose prose-lg max-w-none text-[#1A1A1A]/70">
                <p>{fullEvent.description}</p>
              </div>
            </div>
          )}

          {fullEvent?.requirements && (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-red-600 mb-2">Important Information</h2>
              <p className="text-[#1A1A1A]/70 text-sm md:text-base">
                {fullEvent.requirements}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md">
            <h3 className="text-xl font-bold mb-6 border-b border-slate-100 pb-4">
              Select Tickets
            </h3>

            <div className="flex flex-col gap-4 mb-8">
              {/* Standard Ticket Option */}
              <div className="flex flex-col border-2 border-[#00A698] bg-[#00A698]/5 rounded-2xl p-4 cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#00A698] text-white text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg">
                  Best Seller
                </div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-[#1A1A1A]">Standard Entry</span>
                    <span className="text-xs text-[#1A1A1A]/50">Official general admission</span>
                  </div>
                  <span className="font-bold text-xl text-[#00A698]">€{priceNum.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between mt-4 border-t border-slate-200/50 pt-4">
                  <span className="text-sm text-[#1A1A1A]/70">Quantity</span>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-50 transition-colors text-[#1A1A1A]"
                      onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    >
                      -
                    </button>
                    <span className="font-bold w-4 text-center text-[#1A1A1A]">{ticketCount}</span>
                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-50 transition-colors text-[#1A1A1A]"
                      onClick={() => setTicketCount(ticketCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-[#1A1A1A]/80">Total</span>
              <span className="font-black text-3xl text-[#1A1A1A]">€{(priceNum * ticketCount).toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-[#00A698] hover:bg-[#008f82] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00A698]/30 hover:scale-[1.02]"
            >
              Checkout <ExternalLink size={18} />
            </button>
            <p className="text-center text-[11px] text-[#1A1A1A]/40 mt-3 flex items-center justify-center gap-1">
              <Lock size={10} /> Secure payment via ClubTickets
            </p>

            <ul className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-6">
              <li className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                <CheckCircle2 size={14} className="text-[#00A698]" /> Instant ticket delivery
              </li>
              <li className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                <CheckCircle2 size={14} className="text-[#00A698]" /> Official partner guarantee
              </li>
              <li className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                <CheckCircle2 size={14} className="text-[#00A698]" /> No hidden booking fees
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
