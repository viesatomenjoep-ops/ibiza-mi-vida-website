'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Ticket, Anchor, MessageCircle, Search, Music, Sun, Compass, Calendar, Car, Tag, GlassWater, CheckCircle, Navigation } from 'lucide-react'

const pillLinks = [
  { label: 'Clubbing', href: '/club-tickets', icon: Music },
  { label: 'Next events', href: '/boat-parties', icon: Calendar },
  { label: 'Ibiza Boat', href: '/private-boat-charters', icon: Anchor },
  { label: 'Activities', href: '/formentera-boat-trips', icon: Sun },
]

const allCategories = [
  { label: 'Home', href: '/', icon: Home, desc: 'Back to the start' },
  { label: 'Club Tickets', href: '/club-tickets', icon: Ticket, desc: 'Pacha, Amnesia, Hi Ibiza & more' },
  { label: 'Boat Parties', href: '/boat-parties', icon: Music, desc: 'Sunset cruises & music events' },
  { label: 'Private Boat Charters', href: '/private-boat-charters', icon: Anchor, desc: 'Yachts & exclusive rentals' },
  { label: 'VIP Catamaran', href: '/vip-catamaran', icon: Navigation, desc: 'Luxury sailing experiences' },
  { label: 'Formentera Trips', href: '/formentera-boat-trips', icon: Sun, desc: 'Day trips to paradise' },
  { label: 'Car & Scooter Rental', href: '/car-scooter-rental', icon: Car, desc: 'Explore at your own pace' },
  { label: 'Drink Packages', href: '/drink-packages', icon: GlassWater, desc: 'VIP tables & bottle service' },
  { label: 'Guestlist', href: '/guestlist', icon: CheckCircle, desc: 'Free entry & priority access' },
  { label: 'Free & Discount', href: '/free-discount-ibiza', icon: Tag, desc: 'Budget tips & passes' },
  { label: 'Ibiza Tips', href: '/tips', icon: Compass, desc: 'Local secrets & guides' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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
      <header className="fixed top-4 left-0 right-0 z-50 pointer-events-none flex justify-center px-4 md:top-6 lg:justify-between lg:px-8">
        
        {/* Logo (hidden on mobile, centered pill takes over) */}
        <Link href="/" className="pointer-events-auto hidden items-center gap-2 lg:flex" aria-label="Ibiza mi vida — home">
          <div className="relative h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center p-2">
            <Image
              src="/logo.png"
              alt="Ibiza mi vida"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Central Pill Nav */}
        <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
          
          {/* Mobile Logo (only visible on mobile, alongside pill) */}
          <Link href="/" className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-white shadow-lg lg:hidden transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="Ibiza mi vida"
              width={26}
              height={26}
              className="object-contain"
            />
          </Link>

          {/* Pill Container */}
          <div className="hidden items-center rounded-[32px] bg-white/90 p-1.5 shadow-lg backdrop-blur-md lg:flex border border-black/5">
            {pillLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'flex items-center gap-2 rounded-full px-5 py-2.5 font-sans text-[13px] font-semibold transition-all duration-300',
                    isActive
                      ? 'bg-midnight text-white shadow-sm'
                      : 'text-midnight/70 hover:bg-black/5 hover:text-midnight',
                  ].join(' ')}
                >
                  <link.icon size={16} className={isActive ? 'text-white' : 'text-midnight/50'} />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Search Button */}
          <button 
            onClick={handleSearchClick}
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-white text-midnight shadow-lg transition-transform hover:scale-105 hover:bg-gray-50 border border-black/5"
            aria-label="Search categories"
          >
            <Search size={20} strokeWidth={2.5} />
          </button>

          {/* Menu Button (Green background like screenshot) */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#BEE9CD] text-midnight shadow-lg transition-transform hover:scale-105 hover:bg-[#a6dcb8] border border-black/5"
            aria-label="Open menu"
          >
            {menuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
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
                  placeholder="Search for club tickets, boat parties, rentals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full bg-white py-6 pl-16 pr-6 font-serif text-xl md:text-2xl text-midnight shadow-sm outline-none placeholder:text-midnight/30 focus:ring-4 focus:ring-teal/10 transition-shadow border border-black/5"
                />
              </div>

              {/* Grid of Categories */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCategories.map((cat, i) => (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={cat.href}
                      className="group flex items-start gap-4 rounded-3xl bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-transparent hover:border-midnight/5"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sandstone/50 text-midnight transition-colors group-hover:bg-teal group-hover:text-white">
                        <cat.icon size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-serif text-lg font-medium text-midnight group-hover:text-teal transition-colors">
                          {cat.label}
                        </span>
                        <span className="font-sans text-xs text-midnight/50 mt-1 leading-relaxed">
                          {cat.desc}
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
