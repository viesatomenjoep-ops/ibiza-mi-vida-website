import React from 'react'
import { Phone, Mail, Globe, ChevronRight, Instagram, Facebook, MessageCircle, Youtube, Music2 } from 'lucide-react'

export function HomeContact() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34XXXXXXXXX'

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-16 pt-8 flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
      
      {/* Contact Info Container */}
      <div className="flex-1 bg-white rounded-[20px] p-4 flex flex-col gap-4 shadow-sm border border-velvet-obsidian/5">
        
        {/* Call */}
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 pb-3 border-b border-velvet-obsidian/5 group">
          <div className="w-9 h-9 rounded-full bg-champagne-bronze flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <Phone size={16} className="text-white fill-white" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-sans text-[16px] text-velvet-obsidian leading-tight">Call</span>
            <span className="font-sans text-[12px] text-velvet-obsidian/60 leading-tight mt-0.5">+{whatsappNumber}</span>
          </div>
          <ChevronRight size={18} className="text-velvet-obsidian/40 group-hover:text-rustic-terracotta transition-colors" />
        </a>

        {/* Text */}
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 pb-3 border-b border-velvet-obsidian/5 group">
          <div className="w-9 h-9 rounded-full bg-champagne-bronze flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <MessageCircle size={16} className="text-white fill-white" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-sans text-[16px] text-velvet-obsidian leading-tight">Text</span>
            <span className="font-sans text-[12px] text-velvet-obsidian/60 leading-tight mt-0.5">For inquiries, bookings, or more information, don't hesitate to text us!</span>
          </div>
          <ChevronRight size={18} className="text-velvet-obsidian/40 group-hover:text-rustic-terracotta transition-colors" />
        </a>

        {/* E-Mail */}
        <a href="mailto:hello@ibizamivida.com" className="flex items-center gap-3 pb-3 border-b border-velvet-obsidian/5 group">
          <div className="w-9 h-9 rounded-full bg-champagne-bronze flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <Mail size={16} className="text-white fill-white" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-sans text-[16px] text-velvet-obsidian leading-tight">E-Mail</span>
            <span className="font-sans text-[12px] text-velvet-obsidian/60 leading-tight mt-0.5">hello@ibizamivida.com</span>
          </div>
          <ChevronRight size={18} className="text-velvet-obsidian/40 group-hover:text-rustic-terracotta transition-colors" />
        </a>

        {/* Website */}
        <div className="flex items-center gap-3 pb-1 group cursor-default">
          <div className="w-9 h-9 rounded-full bg-champagne-bronze flex items-center justify-center shrink-0">
            <Globe size={16} className="text-white" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-sans text-[16px] text-velvet-obsidian leading-tight">Our Website</span>
            <span className="font-sans text-[12px] text-velvet-obsidian/60 leading-tight mt-0.5">www.ibizamivida.com</span>
          </div>
        </div>

      </div>

      {/* Social Media Container */}
      <div className="flex-1 md:max-w-sm bg-white rounded-[20px] p-6 flex flex-col gap-4 shadow-sm border border-velvet-obsidian/5">
        <h3 className="font-sans text-[18px] text-velvet-obsidian mb-2">Our Social Media</h3>
        
        <div className="flex flex-wrap items-center gap-4">
          <a href="https://instagram.com/ibizamivida" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-ibiza-sand flex items-center justify-center transition-transform hover:scale-110 hover:bg-rustic-terracotta hover:text-white text-velvet-obsidian group shadow-sm border border-velvet-obsidian/5">
            <Instagram size={20} />
          </a>
          <a href="#" className="w-12 h-12 rounded-full bg-ibiza-sand flex items-center justify-center transition-transform hover:scale-110 hover:bg-rustic-terracotta hover:text-white text-velvet-obsidian group shadow-sm border border-velvet-obsidian/5">
            <Facebook size={20} />
          </a>
          <a href="#" className="w-12 h-12 rounded-full bg-ibiza-sand flex items-center justify-center transition-transform hover:scale-110 hover:bg-rustic-terracotta hover:text-white text-velvet-obsidian group shadow-sm border border-velvet-obsidian/5">
            <Music2 size={20} /> {/* TikTok icon placeholder */}
          </a>
          <a href="#" className="w-12 h-12 rounded-full bg-ibiza-sand flex items-center justify-center transition-transform hover:scale-110 hover:bg-rustic-terracotta hover:text-white text-velvet-obsidian group shadow-sm border border-velvet-obsidian/5">
            <Youtube size={20} />
          </a>
        </div>
      </div>

    </div>
  )
}
