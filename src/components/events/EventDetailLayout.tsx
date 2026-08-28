'use client'

import React from 'react'
import Image from 'next/image'
import { Clock, MapPin, Ticket, ChevronLeft, Share2, MessageCircle } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

interface TicketOption {
  id: string
  title: string
  description: string
  priceLabel: string
  icon?: React.ReactNode
  onSelect: () => void
}

interface EventDetailLayoutProps {
  title: string
  timeLabel: string
  dateLabel: { day: string; month: string }
  heroImage: string
  description: string
  organizerName: string
  organizerSubtitle: string
  organizerLogo?: string
  galleryImages?: string[]
  ticketsTitle: string
  tickets: TicketOption[]
  onBack?: () => void
  onShare?: () => void
  onBookPrimary?: () => void
  bookButtonLabel?: string
  whatsappNumber?: string
}

export function EventDetailLayout({
  title,
  timeLabel,
  dateLabel,
  heroImage,
  description,
  organizerName,
  organizerSubtitle,
  organizerLogo,
  galleryImages = [],
  ticketsTitle,
  tickets,
  onBack,
  onShare,
  onBookPrimary,
  bookButtonLabel = 'Book Now',
  whatsappNumber = '33666528412'
}: EventDetailLayoutProps) {
  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-ibiza-sand pb-32">
      {/* ── Top Nav / Status Chrome ── */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-6">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white/80 backdrop-blur-md border border-[#EFF2F6] rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
        >
          <ChevronLeft size={20} className="text-velvet-obsidian" />
        </button>
        <button 
          onClick={onShare}
          className="w-12 h-12 bg-white/80 backdrop-blur-md border border-[#EFF2F6] rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
        >
          <Share2 size={20} className="text-velvet-obsidian" />
        </button>
      </div>

      {/* ── Hero Image & Floating Header ── */}
      <div className="relative h-[350px] w-full">
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Floating Card Content */}
        <div className="absolute -bottom-8 left-4 right-4 bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex justify-between items-center shadow-lg">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-2xl font-normal text-velvet-obsidian">{title}</h1>
            <div className="flex items-center gap-1.5 text-velvet-obsidian/70">
              <Clock size={16} />
              <span className="font-sans text-sm">{timeLabel}</span>
            </div>
          </div>
          {/* Date Badge */}
          <div className="w-16 h-16 shrink-0 bg-[#7086F8] rounded-full flex flex-col items-center justify-center text-white shadow-md">
            <span className="font-sans text-xl font-semibold leading-none">{dateLabel.day}</span>
            <span className="font-sans text-xs font-light mt-0.5">{dateLabel.month}</span>
          </div>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="px-4 pt-16 flex flex-col gap-8">
        
        {/* About */}
        <AnimatedSection>
          <h2 className="font-serif text-[18px] text-velvet-obsidian mb-3">About {title}</h2>
          <p className="font-sans text-[14px] text-[#7C8690] leading-[140%] font-light">
            {description}
          </p>
        </AnimatedSection>

        {/* Organizer */}
        <AnimatedSection>
          <div className="bg-white border border-[#EFF2F6] rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-sandstone/30 flex items-center justify-center shrink-0 overflow-hidden relative">
              {organizerLogo ? (
                 <Image src={organizerLogo} alt={organizerName} fill className="object-cover" />
              ) : (
                <MessageCircle size={20} className="text-velvet-obsidian/50" />
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <span className="font-sans text-[16px] text-velvet-obsidian">{organizerName}</span>
              <span className="font-sans text-[12px] text-[#7C8690] font-light">{organizerSubtitle}</span>
            </div>
            <a 
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-velvet-obsidian text-white text-[12px] px-4 py-2 rounded-full font-sans hover:bg-velvet-obsidian/80 transition-colors shrink-0"
            >
              Contact
            </a>
          </div>
        </AnimatedSection>

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <AnimatedSection>
            <h2 className="font-serif text-[18px] text-velvet-obsidian mb-3">Gallery</h2>
            <div className="flex overflow-x-auto gap-3 pb-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {galleryImages.map((img, i) => (
                <div key={i} className="relative w-[110px] h-[110px] shrink-0 bg-[#F7F8FA] rounded-2xl overflow-hidden">
                  <Image src={img} alt="Gallery" fill className="object-cover" />
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Available Tickets / Events */}
        <AnimatedSection>
          <h2 className="font-serif text-[18px] text-velvet-obsidian mb-3">{ticketsTitle}</h2>
          <div className="flex flex-col gap-3">
            {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                onClick={ticket.onSelect}
                className="bg-[#F7F8FA] rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-[#EFF2F6] transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
                  {ticket.icon ? ticket.icon : <Ticket size={20} className="text-velvet-obsidian" />}
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="font-sans text-[16px] text-velvet-obsidian truncate">{ticket.title}</span>
                  <span className="font-sans text-[12px] text-[#7C8690] font-light line-clamp-1">{ticket.description}</span>
                </div>
                <div className="font-sans text-[18px] font-semibold text-[#7086F8] shrink-0">
                  {ticket.priceLabel}
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-8 text-[#7C8690] text-sm">
                No tickets currently available.
              </div>
            )}
          </div>
        </AnimatedSection>

      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-16 pb-8 px-4 z-40">
        <button 
          onClick={onBookPrimary}
          className="w-full bg-velvet-obsidian text-white font-sans text-[16px] py-4 rounded-full shadow-xl hover:scale-[1.02] transition-transform flex justify-center items-center gap-2"
        >
          {bookButtonLabel}
        </button>
      </div>

    </div>
  )
}
