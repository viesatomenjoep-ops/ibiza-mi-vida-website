'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Calendar, MapPin, ExternalLink, Ticket, CheckCircle2, ChevronDown, Lock } from 'lucide-react'
import type { CTEventDate, CTEvent } from '@/lib/clubtickets'
import { cleanHtml, stripHtml } from '@/lib/html-utils'

interface Props {
  selectedDateObj: CTEventDate
  allEventDates: CTEventDate[]
  fullEvent?: CTEvent
  locale: string
}

export function EventCheckoutClient({ selectedDateObj, allEventDates, fullEvent, locale }: Props) {
  const [ticketCount, setTicketCount] = useState(1)

  let dateFormatted = '';
  try {
    if (selectedDateObj?.date) {
      dateFormatted = new Date(selectedDateObj.date).toLocaleDateString(locale || 'nl', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
      });
    }
  } catch (err) {
    console.error('Invalid date format:', selectedDateObj?.date, err);
  }

  // Parse price
  let priceNum = 50;
  if (selectedDateObj?.prices !== null && selectedDateObj?.prices !== undefined) {
    if (typeof selectedDateObj.prices === 'number') {
      priceNum = selectedDateObj.prices;
    } else if (typeof selectedDateObj.prices === 'string') {
      const match = selectedDateObj.prices.match(/\d+([.,]\d+)?/);
      if (match) priceNum = parseFloat(match[0].replace(',', '.'));
    }
  }

  const rawImg = (selectedDateObj as any)?.image || (selectedDateObj as any)?.eventCover;
  const imageUrl = rawImg && rawImg.trim() ? rawImg : '/hi-ibiza-2026/FB_IMG_1779623220486.jpg';

  const handleCheckout = () => {
    // We send them to ClubTickets where they can finalize their basket
    window.open(selectedDateObj.affLink, '_blank')
  }

  return (
    <div className="theme-monaco-vip bg-[var(--color-paper)] text-[var(--color-ink)] min-h-screen pt-20 pb-24">
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden bg-velvet-obsidian rounded-b-[36px]">
        <Image 
          src={imageUrl} 
          alt={selectedDateObj.eventName || ''} 
          fill 
          className="object-cover opacity-60 mix-blend-screen"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian/90 via-velvet-obsidian/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
          <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
            <span className="bg-ibiza-green text-velvet-obsidian px-4 py-1.5 rounded-full text-xs md:text-sm uppercase tracking-wider font-bold shadow-sm">
              Official Tickets
            </span>
            <h1 className="text-4xl md:text-6xl font-black font-serif text-white leading-tight drop-shadow-md">
              {selectedDateObj.eventName}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90 font-semibold">
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <Calendar size={18} className="text-ibiza-mint" /> <span className="capitalize">{dateFormatted}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <MapPin size={18} className="text-ibiza-mint" /> {selectedDateObj.venueName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {selectedDateObj.lineUp && (
            <div className="bg-[var(--color-card)] border border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3 text-velvet-obsidian">
                <div className="w-10 h-10 rounded-xl bg-ibiza-green/20 flex items-center justify-center shrink-0">
                  <Ticket size={20} className="text-ibiza-green" />
                </div>
                Line Up
              </h2>
              <div 
                className="prose prose-lg max-w-none text-velvet-obsidian/80 font-medium prose-p:my-1 prose-p:text-velvet-obsidian/80 prose-a:text-ibiza-green"
                dangerouslySetInnerHTML={{ __html: selectedDateObj.lineUp }}
              />
            </div>
          )}

          {fullEvent?.description && (
            <div className="bg-[var(--color-card)] border border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-6 text-velvet-obsidian">About this Event</h2>
              <div className="prose prose-lg max-w-none text-velvet-obsidian/80 font-medium prose-p:text-velvet-obsidian/80 prose-a:text-[var(--spring)]">
                <div dangerouslySetInnerHTML={{ __html: cleanHtml(fullEvent.description) }} />
              </div>
            </div>
          )}

          {fullEvent?.requirements && (
            <div className="bg-gradient-to-br from-velvet-obsidian to-[var(--color-midnight)] rounded-3xl p-6 md:p-8 shadow-lg border border-white/10">
              <h2 className="text-2xl font-serif font-bold mb-6 text-white flex items-center gap-3">
                Important Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stripHtml(fullEvent.requirements)
                  .replace(/\[\s*\]/g, '')
                  .split(/\r?\n/)
                  .map(l => l.trim())
                  .filter(Boolean)
                  .map((req, idx) => {
                    const r = req.toLowerCase();
                    let icon = null;
                    if (r.includes('duration') || r.includes('time')) icon = <Calendar className="w-5 h-5 text-[var(--spring)]" />;
                    else if (r.includes('driver') || r.includes('license') || r.includes('age') || r.includes('years')) icon = <Lock className="w-5 h-5 text-[var(--spring)]" />;
                    else if (r.includes('booking') || r.includes('people') || r.includes('min')) icon = <Ticket className="w-5 h-5 text-[var(--spring)]" />;
                    else icon = <CheckCircle2 className="w-5 h-5 text-[var(--spring)]" />;
                    
                    return (
                      <div key={idx} className="flex items-start gap-3 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                        <div className="mt-0.5 shrink-0">{icon}</div>
                        <span className="text-white/90 font-medium text-sm leading-snug">{req.replace(/^[-•]\s*/, '')}</span>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[var(--color-card)] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 className="text-2xl font-serif font-bold mb-6 text-velvet-obsidian">
              Select Tickets
            </h3>

            <div className="flex flex-col gap-4 mb-8">
              {/* Standard Ticket Option */}
              <div className="flex flex-col border-2 border-ibiza-green bg-ibiza-green/10 rounded-2xl p-5 cursor-pointer relative overflow-hidden transition-all hover:bg-ibiza-green/20">

                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-velvet-obsidian">Standard Entry</span>
                    <span className="text-xs text-velvet-obsidian/60 font-semibold uppercase tracking-wider mt-1">Official general admission</span>
                  </div>
                  <span className="font-bold text-2xl text-velvet-obsidian">€{priceNum.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                  <span className="text-sm font-bold text-velvet-obsidian/70">Quantity</span>
                  <div className="flex items-center gap-3 bg-black/40 rounded-xl p-1 border border-white/10 shadow-sm">
                    <button 
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl font-bold text-velvet-obsidian"
                      onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    >
                      -
                    </button>
                    <span className="font-bold text-lg w-6 text-center text-velvet-obsidian">{ticketCount}</span>
                    <button 
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl font-bold text-velvet-obsidian"
                      onClick={() => setTicketCount(ticketCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-8 bg-black/40 border border-white/5 p-4 rounded-2xl">
              <span className="font-bold text-lg text-velvet-obsidian/80">Total</span>
              <span className="font-black font-serif text-4xl text-velvet-obsidian">€{(priceNum * ticketCount).toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-[var(--spring)] text-white font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] hover:brightness-110"
            >
              Checkout <ExternalLink size={20} />
            </button>
            <p className="text-center text-xs font-semibold text-velvet-obsidian/40 mt-4 flex items-center justify-center gap-1.5">
              <Lock size={12} /> Secure payment via ClubTickets
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              <li className="flex items-center gap-3 text-sm font-semibold text-velvet-obsidian/70">
                <CheckCircle2 size={18} className="text-ibiza-green" /> Instant ticket delivery
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-velvet-obsidian/70">
                <CheckCircle2 size={18} className="text-ibiza-green" /> Official partner guarantee
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-velvet-obsidian/70">
                <CheckCircle2 size={18} className="text-ibiza-green" /> No hidden booking fees
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
