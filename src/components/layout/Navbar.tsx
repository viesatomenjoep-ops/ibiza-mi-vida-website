'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Anchor, MessageCircle, Search, Music, Sun, Car, GlassWater, CheckCircle, Navigation, Ticket, Star, Heart, ChevronRight } from 'lucide-react'

const allCategories = [
  { label: 'Deals of the Day', href: '/deals-of-the-day', icon: Star, desc: 'Best daily offers & events' },
  { label: 'Private Boat Charters', href: '/private-boat-charters', icon: Anchor, desc: 'Yachts & exclusive rentals' },
  { label: 'Club Tickets', href: '/club-tickets', icon: Ticket, desc: 'Pacha, Amnesia, Hi Ibiza & more' },
  { label: 'Boat Parties', href: '/boat-parties', icon: Music, desc: 'Sunset cruises & music events' },
  { label: 'VIP Catamaran', href: '/vip-catamaran', icon: Navigation, desc: 'Luxury sailing experiences' },
  { label: 'Formentera Trips', href: '/formentera-boat-trips', icon: Sun, desc: 'Day trips to paradise' },
  { label: 'Guestlist', href: '/guestlist', icon: CheckCircle, desc: 'Free entry & priority access' },
  { label: 'Drink Packages', href: '/drink-packages', icon: GlassWater, desc: 'VIP tables & bottle service' },
  { label: 'Car & Scooter Rental', href: '/car-scooter-rental', icon: Car, desc: 'Explore at your own pace' },
  { label: 'Reviews', href: '/reviews', icon: Heart, desc: 'What our guests say' },
]


export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [menuOpen])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      setPastHero(window.scrollY > window.innerHeight - 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initialize state
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '31683052875'

  return (
    <>
      <header className={[
        "fixed left-0 right-0 z-50 pointer-events-none flex items-center justify-between transition-all duration-300 px-4 md:px-8",
        scrolled 
          ? (pathname === '/' && pastHero ? "top-0 py-3 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "top-0 py-3 bg-velvet-obsidian/95 backdrop-blur-md shadow-lg") 
          : "top-4 md:top-6"
      ].join(' ')}>
        
        {/* Left: Logo */}
        <div className="pointer-events-auto flex items-center gap-3 transition-transform duration-500 ease-out" style={{ transform: `scale(${scrolled ? 0.9 : 1})`, transformOrigin: 'left center' }}>
          <Link href="/" className="flex items-center justify-center transition-transform hover:scale-105 shrink-0">
            <div className={`rounded-full w-[60px] h-[60px] md:w-[70px] md:h-[70px] flex items-center justify-center shadow-lg border overflow-hidden transition-colors duration-300 ${
              pathname === '/' 
                ? (pastHero ? 'bg-white border-velvet-obsidian/10' : 'bg-transparent border-white/10') 
                : 'bg-white border-velvet-obsidian/10'
            }`}>
              <Image
                src="/logo-clean.png"
                alt="Ibiza mi vida"
                width={70}
                height={70}
                className={`object-contain transition-all duration-300 ${
                  pathname === '/' 
                    ? (pastHero ? 'brightness-0 hover:opacity-80 w-[70%] h-[70%]' : 'brightness-0 invert hover:opacity-80 w-[70%] h-[70%]')
                    : 'brightness-0 hover:opacity-80 w-[85%] h-[85%]'
                }`}
                priority
              />
            </div>
          </Link>
          <div className={`hidden sm:flex items-center justify-center px-4 py-2 rounded-xl border backdrop-blur-md transition-colors duration-300 ${
            pathname === '/' 
              ? (pastHero ? 'bg-gray-50/80 border-black/5 text-velvet-obsidian shadow-sm' : (scrolled ? 'bg-velvet-obsidian/40 border-white/10 text-white' : 'bg-white/10 border-white/20 text-white')) 
              : 'bg-white border-velvet-obsidian/10 text-velvet-obsidian shadow-sm'
          }`}>
            <span className="font-serif text-[18px] md:text-[22px] tracking-wide font-medium italic">Ibiza mi vida</span>
          </div>
        </div>

        {/* Right: DOD, Menu */}
        <div className="pointer-events-auto flex items-center gap-2 md:gap-3">

          <Link
            href="/deals-of-the-day"
            className="hidden sm:flex items-center gap-2 rounded-full bg-rustic-terracotta px-5 py-2.5 md:px-7 md:py-[17px] shadow-xl transition-all hover:bg-rustic-terracotta/90 hover:scale-105 border border-black/5"
          >
            <span className="font-serif text-sm md:text-[15px] font-semibold tracking-wide text-white whitespace-nowrap">Deals of the Day</span>
          </Link>
          <Link
            href="/deals-of-the-day"
            className="flex sm:hidden items-center gap-2 rounded-full bg-rustic-terracotta px-4 py-2.5 shadow-xl transition-all hover:bg-rustic-terracotta/90 hover:scale-105 border border-black/5"
          >
            <span className="font-serif text-[13px] font-semibold tracking-wide text-white whitespace-nowrap">DOD</span>
          </Link>

          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-[44px] w-[44px] md:h-[56px] md:w-[56px] shrink-0 items-center justify-center rounded-full bg-velvet-obsidian text-white shadow-xl transition-transform hover:scale-105 hover:bg-velvet-obsidian/90 border border-black/5"
            aria-label="Open menu"
          >
            {menuOpen ? <X size={20} strokeWidth={2.5} className="md:w-[24px] md:h-[24px]" /> : <Menu size={20} strokeWidth={2.5} className="md:w-[24px] md:h-[24px]" />}
          </button>

        </div>
      </header>

      {/* The Huge Selector (Fullscreen Overlay) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="fullscreen-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 flex flex-col bg-ibiza-sand px-4 pb-20 pt-28 md:px-8 md:pt-32 overflow-y-auto"
          >
            <div className="mx-auto w-full max-w-5xl flex-1 flex flex-col">
              
              {/* Grid of Categories */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
                {allCategories.map((cat, i) => (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={cat.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex flex-col justify-between w-full h-[120px] rounded-[20px] bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg border border-velvet-obsidian/5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ibiza-sand text-velvet-obsidian transition-transform group-hover:scale-110 group-hover:bg-rustic-terracotta group-hover:text-white">
                          <cat.icon size={20} strokeWidth={1.5} />
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/40 text-velvet-obsidian opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                      <div className="flex flex-col mt-auto">
                        <span className="font-sans text-[11px] font-light tracking-wide text-velvet-obsidian/70 line-clamp-1">
                          {cat.desc}
                        </span>
                        <span className="font-sans text-[18px] font-medium leading-[120%] tracking-tight text-velvet-obsidian line-clamp-1 group-hover:text-rustic-terracotta transition-colors">
                          {cat.label}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                
              </div>

              {/* WhatsApp Contact inside Menu */}
              <div className="mt-16 pb-12 flex justify-center lg:mt-auto">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-velvet-obsidian px-8 py-4 font-sans text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
                >
                  <MessageCircle size={18} />
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
