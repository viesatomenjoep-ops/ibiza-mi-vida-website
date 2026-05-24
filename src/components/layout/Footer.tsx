import Link from 'next/link'
import Image from 'next/image'
import { Instagram, MessageCircle, Mail, Anchor } from 'lucide-react'

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
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34XXXXXXXXX'

  return (
    <footer className="bg-midnight text-soft-white" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2" aria-label="Ibiza mi vida — home">
              <div className="relative h-10 w-10 md:h-12 md:w-12">
                <Image src="/logo.png" alt="Ibiza mi vida" fill className="object-contain invert brightness-0 transition-opacity hover:opacity-90" />
              </div>
              <span className="font-serif text-xl font-light">
                Ibiza <span className="text-teal">mi vida</span>
              </span>
            </Link>
            <p className="font-sans text-base leading-relaxed text-soft-white/60 mt-2">
              Your premium Ibiza events & booking agency. Club tickets, private boat charters,
              and everything you need for the perfect Ibiza experience.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://instagram.com/ibizamivida"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-soft-white/60 transition-colors hover:border-teal hover:text-teal"
                aria-label="Ibiza mi vida on Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-soft-white/60 transition-colors hover:border-teal hover:text-teal"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="mailto:hello@ibizamivida.com"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-soft-white/60 transition-colors hover:border-teal hover:text-teal"
                aria-label="Email us"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-5 font-sans text-sm font-semibold uppercase tracking-widest text-driftwood">
              Services
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {services.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans text-base text-soft-white/60 transition-colors hover:text-soft-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h3 className="mb-5 font-sans text-sm font-semibold uppercase tracking-widest text-driftwood">
              Ibiza Guides
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {guides.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans text-base text-soft-white/60 transition-colors hover:text-soft-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact CTA */}
          <div className="flex flex-col gap-5">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-driftwood">
              Book Now
            </h3>
            <p className="font-sans text-base text-soft-white/60 leading-relaxed">
              Ready to plan your Ibiza experience? Chat with us on WhatsApp for instant replies.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 font-sans text-base font-semibold text-white transition-colors hover:bg-teal-dark shadow-lg"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
            <Link
              href="/private-boat-charters"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-sans text-base font-medium text-soft-white/80 transition-colors hover:border-white hover:text-white"
            >
              <Anchor size={18} />
              Private Boat Charters
            </Link>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="font-sans text-sm text-soft-white/40">
            © {new Date().getFullYear()} Ibiza mi vida. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="font-sans text-sm text-soft-white/40 hover:text-soft-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="font-sans text-sm text-soft-white/40 hover:text-soft-white/70 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
