'use client'

import React from 'react'
import Image from 'next/image'
import { Calendar, MapPin, ExternalLink, Ticket, CheckCircle2, Lock, Clock } from 'lucide-react'
import type { CTEventDate, CTEvent } from '@/lib/clubtickets'
import { cleanHtml, stripHtml } from '@/lib/html-utils'
import { VenueLocationMap } from '@/components/ui/VenueLocationMap'

interface Props {
  selectedDateObj: CTEventDate
  allEventDates: CTEventDate[]
  fullEvent?: CTEvent
  locale: string
}

export function EventCheckoutClient({ selectedDateObj, allEventDates, fullEvent, locale }: Props) {
  let dateFormatted = ''
  try {
    if (selectedDateObj?.date) {
      dateFormatted = new Date(selectedDateObj.date).toLocaleDateString(locale || 'nl', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    }
  } catch (err) {
    console.error('Invalid date format:', selectedDateObj?.date, err)
  }

  // Parse price
  let priceNum = 50
  if (selectedDateObj?.prices !== null && selectedDateObj?.prices !== undefined) {
    if (typeof selectedDateObj.prices === 'number') {
      priceNum = selectedDateObj.prices
    } else if (typeof selectedDateObj.prices === 'string') {
      const match = selectedDateObj.prices.match(/\d+([.,]\d+)?/)
      if (match) priceNum = parseFloat(match[0].replace(',', '.'))
    }
  }

  const rawImg = (selectedDateObj as any)?.image || (selectedDateObj as any)?.eventCover
  const imageUrl = rawImg && rawImg.trim() ? rawImg : '/hi-ibiza-2026/FB_IMG_1779623220486.jpg'

  const lineUpClean = cleanHtml(selectedDateObj.lineUp)
  const descriptionClean = cleanHtml(fullEvent?.description)

  const handleCheckout = () => {
    window.open(selectedDateObj.affLink, '_blank')
  }

  return (
    <div className="bg-white text-black min-h-screen pt-20 pb-28">
      {/* Hero Section */}
      <div className="relative w-full h-[38vh] md:h-[48vh] overflow-hidden bg-neutral-900 rounded-b-[36px]">
        <Image
          src={imageUrl}
          alt={selectedDateObj.eventName || ''}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
          <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
            <span className="bg-ibiza-green text-black px-4 py-1.5 rounded-full text-xs md:text-sm uppercase tracking-wider font-bold shadow-sm">
              Official Tickets
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-serif text-white leading-tight drop-shadow-lg">
              {selectedDateObj.eventName}
            </h1>
            <div className="flex flex-wrap gap-3 text-white font-semibold">
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <Calendar size={18} className="text-ibiza-green" /> <span className="capitalize">{dateFormatted}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <MapPin size={18} className="text-ibiza-green" /> {selectedDateObj.venueName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        {/* Left Column: Details */}
        <div className="lg:col-span-2 flex flex-col gap-10">

          {/* Line Up / Timetable */}
          {lineUpClean && (
            <section className="bg-white border border-black/10 rounded-3xl p-7 md:p-10 shadow-sm">
              <h2 className="text-3xl md:text-4xl font-serif font-black mb-6 flex items-center gap-3 text-black">
                <div className="w-11 h-11 rounded-xl bg-ibiza-green/20 flex items-center justify-center shrink-0">
                  <Clock size={22} className="text-black" />
                </div>
                Line Up &amp; Times
              </h2>
              <div
                className="prose prose-lg md:prose-xl max-w-none text-black leading-relaxed prose-p:my-2 prose-p:text-black prose-strong:text-black prose-li:text-black prose-a:text-black prose-headings:text-black"
                dangerouslySetInnerHTML={{ __html: lineUpClean }}
              />
            </section>
          )}

          {/* About this Event */}
          {descriptionClean && (
            <section className="bg-white border border-black/10 rounded-3xl p-7 md:p-10 shadow-sm">
              <h2 className="text-3xl md:text-4xl font-serif font-black mb-6 text-black">About this Event</h2>
              <div
                className="prose prose-lg md:prose-xl max-w-none text-black leading-relaxed prose-p:text-black prose-strong:text-black prose-li:text-black prose-a:text-black prose-headings:text-black"
                dangerouslySetInnerHTML={{ __html: descriptionClean }}
              />
            </section>
          )}

          {/* Important Information */}
          {fullEvent?.requirements && (
            <section className="bg-neutral-50 rounded-3xl p-7 md:p-10 shadow-sm border border-black/10">
              <h2 className="text-3xl md:text-4xl font-serif font-black mb-6 text-black">
                Important Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stripHtml(fullEvent.requirements)
                  .replace(/\[\s*\]/g, '')
                  .split(/\r?\n/)
                  .map(l => l.trim())
                  .filter(Boolean)
                  .map((req, idx) => {
                    const r = req.toLowerCase()
                    let icon = null
                    if (r.includes('duration') || r.includes('time')) icon = <Calendar className="w-5 h-5 text-black" />
                    else if (r.includes('driver') || r.includes('license') || r.includes('age') || r.includes('years')) icon = <Lock className="w-5 h-5 text-black" />
                    else if (r.includes('booking') || r.includes('people') || r.includes('min')) icon = <Ticket className="w-5 h-5 text-black" />
                    else icon = <CheckCircle2 className="w-5 h-5 text-black" />

                    return (
                      <div key={idx} className="flex items-start gap-3 bg-white border border-black/10 p-4 rounded-2xl">
                        <div className="mt-0.5 shrink-0">{icon}</div>
                        <span className="text-black font-medium text-base leading-snug">{req.replace(/^[-•]\s*/, '')}</span>
                      </div>
                    )
                  })}
              </div>
            </section>
          )}

          {/* Venue location map */}
          {selectedDateObj.venueName && (
            <VenueLocationMap venueName={selectedDateObj.venueName} locale={locale} />
          )}
        </div>

        {/* Right Column: Checkout Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-black/10 rounded-3xl p-7 md:p-8 shadow-xl">
            <h3 className="text-2xl md:text-3xl font-serif font-black mb-6 text-black">
              Book your ticket
            </h3>

            {/* Standard Ticket Option */}
            <div className="flex flex-col border-2 border-ibiza-green bg-ibiza-green/10 rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg md:text-xl text-black">Standard Entry</span>
                  <span className="text-xs text-black/60 font-semibold uppercase tracking-wider mt-1">Official general admission</span>
                </div>
                <span className="font-black text-2xl md:text-3xl text-black whitespace-nowrap">€{priceNum.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-ibiza-green text-black font-black text-lg md:text-xl uppercase tracking-wider py-5 md:py-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] hover:brightness-95"
            >
              Book on ClubTickets <ExternalLink size={22} />
            </button>
            <p className="text-center text-xs font-semibold text-black/50 mt-4 flex items-center justify-center gap-1.5">
              <Lock size={12} /> Secure payment via ClubTickets
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              <li className="flex items-center gap-3 text-sm font-semibold text-black/70">
                <CheckCircle2 size={18} className="text-ibiza-green" /> Instant ticket delivery
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-black/70">
                <CheckCircle2 size={18} className="text-ibiza-green" /> Official partner guarantee
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-black/70">
                <CheckCircle2 size={18} className="text-ibiza-green" /> No hidden booking fees
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
