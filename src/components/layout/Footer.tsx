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

export function Footer({ dict }: { dict?: any }) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '31683052875'

  return (
    <footer className="bg-[#0A0A0A] text-white pt-16 pb-8 border-t border-white/10" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col gap-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2" aria-label="Ibiza mi vida — home">
                <div className="relative h-10 w-10">
                  <Image src="/logo-clean.png" alt="Ibiza mi vida" fill className="object-contain brightness-0 invert" />
                </div>
                <span className="font-serif text-xl font-light text-white">
                  Ibiza <span className="text-champagne-bronze">mi vida</span>
                </span>
              </Link>
              <p className="font-sans text-[14px] leading-relaxed text-white/70 pr-4">
                {dict?.footer_description || 'Your premium Ibiza events & booking agency. Club tickets, private boat charters, and everything you need for the perfect experience.'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/ibizamivida" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-gray-100 hover:shadow-md text-white shadow-sm border border-white/10" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-gray-100 hover:shadow-md text-white shadow-sm border border-white/10" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-gray-100 hover:shadow-md text-white shadow-sm border border-white/10" aria-label="TikTok">
                <Music2 size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-gray-100 hover:shadow-md text-white shadow-sm border border-white/10" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="mb-6 font-sans text-sm font-semibold uppercase tracking-widest text-champagne-bronze">
              {dict?.footer_services || 'Services'}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {services.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans text-[15px] text-white/70 transition-colors hover:text-rustic-terracotta"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Guides */}
          <div>
            <h3 className="mb-6 font-sans text-sm font-semibold uppercase tracking-widest text-champagne-bronze">
              {dict?.footer_guides || 'Ibiza Guides'}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {guides.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans text-[15px] text-white/70 transition-colors hover:text-rustic-terracotta"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Book Now */}
          <div className="flex flex-col gap-6">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-champagne-bronze">
              {dict?.book_button || 'Book Now'}
            </h3>
            <p className="font-sans text-[15px] text-white/70 leading-relaxed">
              {dict?.footer_ready_plan || 'Ready to plan your Ibiza experience?'} {dict?.footer_chat_instant || 'Chat with us on WhatsApp for instant replies.'}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rustic-terracotta px-6 py-3.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-rustic-terracotta/90 shadow-sm"
              >
                <MessageCircle size={18} />
                {dict?.footer_chat_btn || 'Chat on WhatsApp'}
              </a>
              <a
                href="mailto:hello@ibizamivida.com"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white px-6 py-3.5 font-sans text-sm font-bold text-white transition-all duration-300 hover:bg-gray-100 hover:shadow-md"
              >
                <Mail size={18} />
                hello@ibizamivida.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="font-sans text-sm text-white/40">
            © {new Date().getFullYear()} Ibiza mi vida. {dict?.footer_all_rights || 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="font-sans text-sm text-white/40 hover:text-white transition-colors">
              {dict?.footer_privacy || 'Privacy Policy'}
            </Link>
            <Link href="/cookie-policy" className="font-sans text-sm text-white/40 hover:text-white transition-colors">
              {dict?.footer_cookie || 'Cookie Policy'}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
