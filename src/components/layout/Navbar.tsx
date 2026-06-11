'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Anchor, MessageCircle, Search, Music, Sun, Car, GlassWater, CheckCircle, Navigation, Ticket, Star, Heart, ChevronRight, Disc, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/cart-context'

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
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const pathname = usePathname()
  const { openDrawer, totalItems } = useCart()
  
  const isHome = pathname === '/'

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Track scroll on homepage to reveal categories
  useEffect(() => {
    if (!isHome) return
    
    const handleScroll = () => {
      // Show categories when scrolled 80vh down
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.8)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

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

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 bg-white shadow-sm border-b border-gray-200 pointer-events-auto flex flex-col transition-all duration-500">
        
        {/* Top Row: Logo, Cart, Hamburger */}
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          {/* Left: Logo and Name */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="flex items-center justify-center transition-transform hover:scale-105 shrink-0">
              <div className="relative w-[60px] h-[24px] sm:w-[100px] sm:h-[40px] md:w-[140px] md:h-[50px]">
                <Image 
                  src="/logo-clean.png" 
                  alt="Ibiza mi vida Logo" 
                  fill
                  className="object-contain brightness-0"
                  priority
                />
              </div>
            </Link>
            <div className="flex items-center justify-center px-3 py-1.5 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white shadow-sm text-velvet-obsidian">
              <span className="font-sans text-[18px] sm:text-[24px] md:text-[32px] lg:text-[46px] tracking-tight font-bold whitespace-nowrap">Ibizamivida</span>
            </div>
          </div>

          {/* Right: Cart, Hamburger */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={openDrawer}
              className="relative flex h-[44px] w-[44px] md:h-[56px] md:w-[56px] shrink-0 items-center justify-center rounded-full shadow-md transition-transform hover:scale-105 border border-black/5 bg-gray-100 text-velvet-obsidian hover:bg-gray-200"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} strokeWidth={2.5} className="md:w-[24px] md:h-[24px]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rustic-terracotta text-[10px] font-bold text-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-[44px] w-[44px] md:h-[56px] md:w-[56px] shrink-0 items-center justify-center rounded-full shadow-md transition-transform hover:scale-105 border border-black/5 bg-gray-100 text-velvet-obsidian hover:bg-gray-200"
              aria-label="Open menu"
            >
              {menuOpen ? <X size={20} strokeWidth={2.5} className="md:w-[24px] md:h-[24px]" /> : <Menu size={20} strokeWidth={2.5} className="md:w-[24px] md:h-[24px]" />}
            </button>
          </div>
        </div>

        {/* Bottom Row: 4 Icons (Animated on Homepage) */}
        <AnimatePresence>
          {(!isHome || scrolledPastHero) && (
            <motion.div 
              initial={isHome ? { height: 0, opacity: 0 } : false}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="flex items-center justify-between px-2 md:px-8 py-2 border-t border-gray-100 bg-white gap-2 overflow-hidden"
            >
              <Link href="/deals-of-the-day" className="flex flex-col items-center gap-1 group w-1/4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors border border-gray-200 text-velvet-obsidian">
                  <Star size={18} className="md:w-5 md:h-5" />
                </div>
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-velvet-obsidian text-center leading-tight mt-1 whitespace-nowrap">Deal of the Day</span>
              </Link>
              
              <Link href="/private-boat-charters" className="flex flex-col items-center gap-1 group w-1/4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors border border-gray-200 text-velvet-obsidian">
                  <Anchor size={18} className="md:w-5 md:h-5" />
                </div>
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-velvet-obsidian text-center leading-tight mt-1 whitespace-nowrap">Private Boats</span>
              </Link>
              
              <Link href="/artists" className="flex flex-col items-center gap-1 group w-1/4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors border border-gray-200 text-velvet-obsidian">
                  <Disc size={18} className="md:w-5 md:h-5" />
                </div>
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-velvet-obsidian text-center leading-tight mt-1 whitespace-nowrap">Artists</span>
              </Link>
              
              <Link href="/club-tickets" className="flex flex-col items-center gap-1 group w-1/4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors border border-gray-200 text-velvet-obsidian">
                  <Ticket size={18} className="md:w-5 md:h-5" />
                </div>
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-velvet-obsidian text-center leading-tight mt-1 whitespace-nowrap">Clubtickets</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
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
