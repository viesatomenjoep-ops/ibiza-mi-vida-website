'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Anchor, MessageCircle, Search, Music, Sun, Car, GlassWater, CheckCircle, Navigation, Ticket, Star, Heart, ChevronRight, Disc } from 'lucide-react'

const allCategories = [
  { label: 'Deals of the Day', href: '/deals-of-the-day', icon: Star, desc: 'Best daily offers & events' },
  { label: 'Artists', href: '/artists', icon: Disc, desc: 'Top DJs & headliners' },
  { label: 'Club Tickets', href: '/club-tickets', icon: Ticket, desc: 'Pacha, Amnesia, Hi Ibiza & more' },
  { label: 'Private Boat Charters', href: '/private-boat-charters', icon: Anchor, desc: 'Yachts & exclusive rentals' },
  { label: 'Boat Parties', href: '/boat-parties', icon: Music, desc: 'Sunset cruises & music events' },
  { label: 'VIP Catamaran', href: '/vip-catamaran', icon: Navigation, desc: 'Luxury sailing experiences' },
  { label: 'Formentera Trips', href: '/formentera-boat-trips', icon: Sun, desc: 'Day trips to paradise' },
  { label: 'Guestlist', href: '/guestlist', icon: CheckCircle, desc: 'Free entry & priority access' },
  { label: 'Drink Packages', href: '/drink-packages', icon: GlassWater, desc: 'VIP tables & bottle service' },
  { label: 'Car & Scooter Rental', href: '/car-scooter-rental', icon: Car, desc: 'Explore at your own pace' },
  { label: 'Reviews', href: '/reviews', icon: Heart, desc: 'What our guests say' },
]

type Artist = {
  id: number
  name: string
  slug: string
  image: string
  href: string
}

export function Navbar({ artists = [] }: { artists?: Artist[] }) {
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
      setPastHero(window.scrollY > (window.innerHeight * 0.6))
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
        "fixed left-0 right-0 z-50 pointer-events-none flex items-center justify-between transition-all duration-500 px-4 md:px-8",
        scrolled ? "top-0 py-3 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200" : "top-4 md:top-6 bg-transparent border-transparent"
      ].join(' ')}>
        
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center justify-center transition-transform hover:scale-105 shrink-0 pointer-events-auto">
            <div className={`rounded-full w-[60px] h-[60px] md:w-[70px] md:h-[70px] flex items-center justify-center shadow-lg border overflow-hidden transition-colors duration-500 ${
              scrolled 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-transparent border-white/20'
            }`}>
              <div className="relative w-full h-full">
                <Image 
                  src="/logo-clean.png" 
                  alt="Ibiza mi vida Logo" 
                  fill
                  className={`object-contain p-2 md:p-3 transition-all duration-500 ${scrolled ? 'brightness-0' : 'brightness-0 invert'}`}
                  priority
                />
              </div>
            </div>
          </Link>
          <div className={`hidden sm:flex items-center justify-center px-5 py-3 rounded-xl border transition-colors duration-500 pointer-events-auto ${
            scrolled 
              ? 'bg-white border-gray-200 text-velvet-obsidian shadow-sm' 
              : 'bg-transparent border-transparent text-white drop-shadow-md'
          }`}>
            <span className="font-sans text-[36px] md:text-[46px] tracking-tight font-bold">Ibiza mi vida</span>
          </div>
        </div>

        {/* Right: DOD, Menu */}
        <div className="pointer-events-auto flex items-center gap-2 md:gap-3">

          <Link
            href="/deals-of-the-day"
            className={`hidden sm:flex items-center gap-2 rounded-full px-6 py-3.5 md:px-8 md:py-4 shadow-xl transition-all hover:scale-105 border border-black/5 ${
              scrolled ? 'bg-gray-100 text-velvet-obsidian hover:bg-gray-200' : 'bg-rustic-terracotta text-white hover:bg-rustic-terracotta/90'
            }`}
          >
            <span className="font-serif text-[28px] md:text-[32px] font-semibold tracking-wide whitespace-nowrap">Deals of the Day</span>
          </Link>
          <Link
            href="/deals-of-the-day"
            className={`flex sm:hidden items-center gap-1.5 rounded-full px-3.5 py-2 shadow-md transition-all hover:scale-105 border border-black/5 ${
              scrolled ? 'bg-gray-100 text-velvet-obsidian hover:bg-gray-200' : 'bg-rustic-terracotta text-white hover:bg-rustic-terracotta/90'
            }`}
          >
            <span className="font-serif text-[14px] font-semibold tracking-wide whitespace-nowrap">Deals of the Day</span>
          </Link>

          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex h-[44px] w-[44px] md:h-[56px] md:w-[56px] shrink-0 items-center justify-center rounded-full shadow-xl transition-transform hover:scale-105 border border-black/5 ${
              scrolled ? 'bg-gray-100 text-velvet-obsidian hover:bg-gray-200' : 'bg-velvet-obsidian text-white hover:bg-velvet-obsidian/90'
            }`}
            aria-label="Open menu"
          >
            {menuOpen ? <X size={20} strokeWidth={2.5} className="md:w-[24px] md:h-[24px]" /> : <Menu size={20} strokeWidth={2.5} className="md:w-[24px] md:h-[24px]" />}
          </button>

        </div>
      </header>

      {/* Fullscreen Hamburger Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="fullscreen-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[45] flex flex-col bg-white px-4 pb-20 pt-16 md:px-8 md:pt-20 overflow-y-auto"
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
                      className="group flex flex-col justify-between w-full h-[100px] rounded-[16px] bg-gray-50 p-3 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md border border-velvet-obsidian/5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-velvet-obsidian transition-transform group-hover:scale-110 border border-black/5">
                            <cat.icon size={16} strokeWidth={1.5} />
                          </div>
                        </div>
                        <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-velvet-obsidian" />
                      </div>
                      <div className="flex flex-col mt-auto">
                        <span className="font-sans text-[16px] font-bold tracking-tight text-velvet-obsidian line-clamp-1 group-hover:text-rustic-terracotta transition-colors">
                          {cat.label}
                        </span>
                        <span className="font-sans text-[11px] font-light tracking-wide text-velvet-obsidian/70 line-clamp-1">
                          {cat.desc}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                
              </div>

              {/* Featured Artists Section */}
              {artists.length > 0 && (
                <div className="mt-8 mb-4">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-serif text-2xl font-bold text-velvet-obsidian">Featured Artists</h3>
                    <Link href="/club-tickets" onClick={() => setMenuOpen(false)} className="text-sm font-bold text-rustic-terracotta hover:underline">
                      View all events
                    </Link>
                  </div>
                  <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }`}} />
                    {artists.map((artist, i) => (
                      <motion.div
                        key={artist.id}
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.05) }}
                      >
                        <Link 
                          href={artist.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex flex-col items-center gap-2 group w-[90px] md:w-[110px]"
                        >
                          <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden border-2 border-transparent group-hover:border-rustic-terracotta transition-all shadow-md group-hover:shadow-xl relative">
                            <Image 
                              src={artist.image} 
                              alt={artist.name} 
                              fill 
                              className="object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                          </div>
                          <span className="font-sans text-[12px] md:text-[14px] font-bold text-velvet-obsidian text-center leading-tight line-clamp-2 group-hover:text-rustic-terracotta transition-colors">
                            {artist.name}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp Contact inside Menu */}
              <div className="mt-16 pb-12 flex justify-center lg:mt-auto">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-velvet-obsidian/10 px-8 py-4 font-sans text-xl font-semibold text-velvet-obsidian shadow-lg transition-transform hover:scale-105 hover:bg-gray-50"
                >
                  <MessageCircle size={22} className="text-[#25D366]" />
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
