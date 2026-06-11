'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Anchor, MessageCircle, Search, Music, Sun, Car, GlassWater, CheckCircle, Navigation, Ticket, Star, Heart, ChevronRight, Disc, ShoppingCart, Smartphone, Sliders } from 'lucide-react'
import { useCart } from '@/context/cart-context'

const allCategories = [
  { label: 'Deals of the Day', href: '/deals-of-the-day', icon: Star, desc: 'Best daily offers' },
  { label: 'Artists', href: '/artists', icon: Disc, desc: 'Top DJs' },
  { label: 'Club Tickets', href: '/club-tickets', icon: Ticket, desc: 'Pacha, Hi Ibiza' },
  { label: 'Boats', href: '/private-boat-charters', icon: Anchor, desc: 'Yachts & rentals' },
  { label: 'Boat Parties', href: '/boat-parties', icon: Music, desc: 'Sunset cruises' },
  { label: 'VIP Catamaran', href: '/vip-catamaran', icon: Navigation, desc: 'Luxury sailing' },
  { label: 'Formentera', href: '/formentera-boat-trips', icon: Sun, desc: 'Day trips' },
  { label: 'Guestlist', href: '/guestlist', icon: CheckCircle, desc: 'Free entry' },
  { label: 'VIP Tables', href: '/drink-packages', icon: GlassWater, desc: 'Bottle service' },
  { label: 'Car Rental', href: '/car-scooter-rental', icon: Car, desc: 'Explore' },
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
  const pathname = usePathname()
  const { openDrawer, totalItems } = useCart()
  
  const isHome = pathname === '/'
  const accentColor = '#FF4E00' // Ibiza Orange

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

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '31683052875'
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello! I want to consult on VIP tables and fast club bookings.")}`

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 pointer-events-auto flex flex-col transition-all duration-500">
        
        {/* Navbar */}
        <div className="flex items-center justify-between px-4 md:px-8 py-4 lg:py-6">
          
          {/* Left: Design 2.0 Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 shrink-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform group-hover:rotate-12">
              <Image 
                src="/logo-clean.png" 
                alt="Ibiza mi vida Logo" 
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
            <div>
              <span className="font-display text-xl sm:text-2xl font-black tracking-tighter uppercase block text-white">Ibiza Mi Vida</span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-bold block -mt-1">Balearic Agency</span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Categories */}
          <div className="hidden lg:flex gap-5 xl:gap-8 text-[13px] font-bold uppercase tracking-widest text-white">
            <Link href="/club-tickets" className="hover:text-amber-500 transition-colors cursor-pointer">Clubs</Link>
            <Link href="/private-boat-charters" className="hover:text-amber-500 transition-colors cursor-pointer">Yachts & Boats</Link>
            <Link href="/vip-catamaran" className="hover:text-amber-500 transition-colors cursor-pointer">VIP Catamaran</Link>
            <Link href="/drink-packages" className="hover:text-amber-500 transition-colors cursor-pointer">Drink Packages</Link>
            <Link href="/car-scooter-rental" className="hover:text-amber-500 transition-colors cursor-pointer">Car & Scooter</Link>
            <Link href="/guestlist" className="hover:text-white transition-colors cursor-pointer" style={{ color: accentColor }}>Guestlist</Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            
            {/* Desktop WhatsApp Concierge Button */}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-opacity-90 transition-all items-center gap-1.5 shadow-lg shadow-white/5 active:scale-95"
            >
              <Smartphone size={14} /> WhatsApp Concierge
            </a>

            {/* Cart Icon */}
            <button
              onClick={openDrawer}
              className="relative p-2.5 rounded-full border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
              aria-label="Open cart"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: accentColor }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger Mobile Menu */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2.5 rounded-full border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
              aria-label="Open menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu - Dark Theme */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="fullscreen-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[45] flex flex-col bg-[#0A0A0A] px-4 pb-20 pt-20 md:px-8 md:pt-24 overflow-y-auto"
          >
            <div className="mx-auto w-full max-w-5xl flex-1 flex flex-col">
              
              {/* Grid of Categories */}
              <div className="grid grid-cols-2 gap-3 mt-4">
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
                      className="group flex flex-col justify-between w-full h-[100px] rounded-[16px] bg-[#141414] p-4 shadow-sm transition-all hover:border-[#FF4E00]/30 border border-white/5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-zinc-400 group-hover:text-white transition-colors border border-white/5">
                          <cat.icon size={16} strokeWidth={1.5} />
                        </div>
                        <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                      </div>
                      <div className="flex flex-col mt-auto">
                        <span className="font-display text-[16px] font-bold tracking-tight text-white line-clamp-1 group-hover:text-amber-500 transition-colors uppercase">
                          {cat.label}
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
                    <h3 className="font-display text-2xl font-black uppercase tracking-tight text-white">Featured Artists</h3>
                    <Link href="/club-tickets" onClick={() => setMenuOpen(false)} className="text-xs uppercase font-bold text-zinc-400 hover:text-white">
                      View all
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
                          <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden border border-white/10 group-hover:border-[#FF4E00] transition-all shadow-md group-hover:shadow-xl relative">
                            <Image 
                              src={artist.image} 
                              alt={artist.name} 
                              fill 
                              className="object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                          </div>
                          <span className="font-sans text-[12px] md:text-[14px] font-bold text-white text-center leading-tight line-clamp-2 transition-colors">
                            {artist.name}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp Contact inside Menu */}
              <div className="mt-12 pb-12 flex justify-center lg:mt-auto">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-sans text-sm font-bold text-black uppercase shadow-lg transition-transform hover:scale-105"
                >
                  <MessageCircle size={18} className="text-[#25D366]" />
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
