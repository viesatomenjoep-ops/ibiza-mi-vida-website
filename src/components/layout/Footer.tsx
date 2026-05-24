import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, Globe, ChevronRight, Instagram, Facebook, MessageCircle, Youtube, Music2, Anchor } from 'lucide-react'

const services = [
  { label: 'Deals of the Day', href: '/deals-of-the-day' },
  { label: 'Private Boat Charters', href: '/private-boat-charters' },
  { label: 'Club Tickets', href: '/club-tickets' },
  { label: 'Boat Parties', href: '/boat-parties' },
  { label: 'VIP Catamaran', href: '/vip-catamaran' },
  { label: 'Formentera Trips', href: '/formentera-boat-trips' },
  { label: 'Guestlist', href: '/guestlist' },
  { label: 'Drink Packages', href: '/drink-packages' },
  { label: 'Car & Scooter Rental', href: '/car-scooter-rental' },
]

const guides = [
  { label: 'Ibiza Tips', href: '/tips' },
  { label: 'Blog', href: '/blog' },
  { label: 'Free & Discount Ibiza', href: '/free-discount-ibiza' },
]

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '31683052875'

  return (
    <footer className="bg-ibiza-sand text-velvet-obsidian pt-16 pb-8 border-t border-velvet-obsidian/10" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col gap-12">
        
        {/* Top Section: Contact & Brand Info (Figma Style) */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Brand & Socials Card */}
          <div className="flex-1 bg-white rounded-[20px] p-6 flex flex-col gap-6 shadow-sm border border-velvet-obsidian/5 justify-between">
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2" aria-label="Ibiza mi vida — home">
                <div className="relative h-10 w-10 md:h-12 md:w-12">
                  <Image src="/logo-clean.png" alt="Ibiza mi vida" fill className="object-contain brightness-0 transition-opacity hover:opacity-90" />
                </div>
                <span className="font-serif text-xl font-light text-velvet-obsidian">
                  Ibiza <span className="text-champagne-bronze">mi vida</span>
                </span>
              </Link>
              <p className="font-sans text-[14px] leading-relaxed text-velvet-obsidian/60">
                Your premium Ibiza events & booking agency. Club tickets, private boat charters, and everything you need for the perfect Ibiza experience.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="font-sans text-[16px] text-velvet-obsidian">Our Social Media</h3>
              <div className="flex flex-wrap items-center gap-3">
                <a href="https://instagram.com/ibizamivida" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-ibiza-sand flex items-center justify-center transition-transform hover:scale-110 hover:bg-rustic-terracotta hover:text-white text-velvet-obsidian group shadow-sm border border-velvet-obsidian/5">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-ibiza-sand flex items-center justify-center transition-transform hover:scale-110 hover:bg-rustic-terracotta hover:text-white text-velvet-obsidian group shadow-sm border border-velvet-obsidian/5">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-ibiza-sand flex items-center justify-center transition-transform hover:scale-110 hover:bg-rustic-terracotta hover:text-white text-velvet-obsidian group shadow-sm border border-velvet-obsidian/5">
                  <Music2 size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-ibiza-sand flex items-center justify-center transition-transform hover:scale-110 hover:bg-rustic-terracotta hover:text-white text-velvet-obsidian group shadow-sm border border-velvet-obsidian/5">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="flex-[1.5] bg-white rounded-[20px] p-6 flex flex-col gap-4 shadow-sm border border-velvet-obsidian/5 justify-between">
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
            <div className="flex items-center gap-3 group cursor-default">
              <div className="w-9 h-9 rounded-full bg-champagne-bronze flex items-center justify-center shrink-0">
                <Globe size={16} className="text-white" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-sans text-[16px] text-velvet-obsidian leading-tight">Our Website</span>
                <span className="font-sans text-[12px] text-velvet-obsidian/60 leading-tight mt-0.5">www.ibizamivida.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Links Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Services */}
          <div>
            <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-champagne-bronze">
              Services
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {services.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans text-[15px] text-velvet-obsidian/70 transition-colors hover:text-rustic-terracotta"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-champagne-bronze">
              Ibiza Guides
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {guides.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans text-[15px] text-velvet-obsidian/70 transition-colors hover:text-rustic-terracotta"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Book Now */}
          <div className="flex flex-col gap-4">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-champagne-bronze">
              Book Now
            </h3>
            <p className="font-sans text-[15px] text-velvet-obsidian/70 leading-relaxed">
              Ready to plan your Ibiza experience? Chat with us on WhatsApp for instant replies.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-rustic-terracotta px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-rustic-terracotta/90 shadow-sm"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
              <Link
                href="/private-boat-charters"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-velvet-obsidian/20 bg-white px-6 py-3 font-sans text-sm font-medium text-velvet-obsidian transition-colors hover:bg-velvet-obsidian hover:text-white"
              >
                <Anchor size={16} />
                Private Boat Charters
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-velvet-obsidian/10 pt-6 md:flex-row">
          <p className="font-sans text-sm text-velvet-obsidian/40">
            © {new Date().getFullYear()} Ibiza mi vida. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="font-sans text-sm text-velvet-obsidian/40 hover:text-velvet-obsidian transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="font-sans text-sm text-velvet-obsidian/40 hover:text-velvet-obsidian transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
