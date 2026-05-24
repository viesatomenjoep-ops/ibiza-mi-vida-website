'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Anchor, MessageCircle, Search, Music, Sun, Car, GlassWater, CheckCircle, Navigation, Ticket } from 'lucide-react'

const allCategories = [
  { label: 'Private Boat Charters', href: '/private-boat-charters', icon: Anchor, desc: 'Yachts & exclusive rentals' },
  { label: 'Club Tickets', href: '/club-tickets', icon: Ticket, desc: 'Pacha, Amnesia, Hi Ibiza & more' },
  { label: 'Boat Parties', href: '/boat-parties', icon: Music, desc: 'Sunset cruises & music events' },
  { label: 'VIP Catamaran', href: '/vip-catamaran', icon: Navigation, desc: 'Luxury sailing experiences' },
  { label: 'Formentera Trips', href: '/formentera-boat-trips', icon: Sun, desc: 'Day trips to paradise' },
  { label: 'Guestlist', href: '/guestlist', icon: CheckCircle, desc: 'Free entry & priority access' },
  { label: 'Drink Packages', href: '/drink-packages', icon: GlassWater, desc: 'VIP tables & bottle service' },
  { label: 'Car & Scooter Rental', href: '/car-scooter-rental', icon: Car, desc: 'Explore at your own pace' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMenuOpen(false)
    setSearchQuery('')
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
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredCategories = allCategories.filter(c => 
    c.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearchClick = () => {
    setMenuOpen(true)
    setTimeout(() => {
      document.getElementById('category-search')?.focus()
    }, 100)
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '31683052875'

  return (
    <>
      <header className={[
        "fixed left-0 right-0 z-50 pointer-events-none flex items-center justify-between transition-all duration-300 px-4 md:px-8",
        scrolled ? "top-0 py-3 bg-midnight/95 backdrop-blur-md shadow-lg" : "top-4 md:top-6"
      ].join(' ')}>
        
        {/* Left: Search Button */}
        <div className="pointer-events-auto flex items-center">
          <button 
            onClick={handleSearchClick}
            className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-white text-midnight shadow-xl transition-transform hover:scale-105 hover:bg-gray-50 border border-black/5"
            aria-label="Search categories"
          >
            <Search size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Center: Scalable Logo */}
        <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out" style={{ transform: `translate(-50%, -50%) scale(${scrolled ? 0.8 : 1.1})` }}>
          <Link href="/" className="flex items-center justify-center transition-transform hover:scale-105 p-2">
            <Image
              src="/logo.png"
              alt="Ibiza mi vida"
              width={90}
              height={90}
              className="object-contain invert brightness-0 drop-shadow-md"
              priority
            />
          </Link>
        </div>

        {/* Right: Explore Pill & Menu */}
        <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
          


          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-midnight text-white shadow-xl transition-transform hover:scale-105 hover:bg-midnight/90 border border-black/5"
            aria-label="Open menu"
          >
            {menuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
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
            className="fixed inset-0 z-40 flex flex-col bg-soft-white px-4 pb-20 pt-28 md:px-8 md:pt-32 overflow-y-auto"
          >
            <div className="mx-auto w-full max-w-5xl flex-1 flex flex-col">
              
              {/* Search Bar */}
              <div className="relative mb-10 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-midnight/40 transition-colors group-focus-within:text-teal" size={24} />
                <input
                  id="category-search"
                  type="text"
                  placeholder="Search experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full bg-white py-6 pl-16 pr-6 font-serif text-xl md:text-2xl text-midnight shadow-sm outline-none placeholder:text-midnight/30 focus:ring-4 focus:ring-teal/10 transition-shadow border border-black/5"
                />
              </div>

              {/* Grid of Categories */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filteredCategories.map((cat, i) => (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={cat.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-[32px] bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-midnight/5"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sandstone/30 text-midnight transition-all duration-300 group-hover:scale-110 group-hover:bg-teal group-hover:text-white">
                        <cat.icon size={28} strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-serif text-lg md:text-xl font-medium text-midnight group-hover:text-teal transition-colors leading-tight">
                          {cat.label}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                
                {filteredCategories.length === 0 && (
                  <div className="col-span-full py-12 text-center text-midnight/50 font-serif text-lg">
                    No categories found for "{searchQuery}"
                  </div>
                )}
              </div>

              {/* WhatsApp Contact inside Menu */}
              <div className="mt-16 pb-12 flex justify-center lg:mt-auto">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-midnight px-8 py-4 font-sans text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
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
