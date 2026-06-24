'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, Globe, HelpCircle, User, ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/context/cart-context'

type Artist = {
  id: number
  name: string
  slug: string
  image: string
  href: string
}

const LOCALES = [
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
]

function LanguageSelector() {
  const pathname = usePathname()
  const currentLocale = LOCALES.find(l => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`) || LOCALES[0]
  const [open, setOpen] = useState(false)

  const switchLanguage = (code: string) => {
    // Vervang de locale in de URL
    const segments = pathname.split('/')
    if (LOCALES.some(l => l.code === segments[1])) {
      segments[1] = code
    } else {
      segments.splice(1, 0, code)
    }
    window.location.href = segments.join('/') || '/'
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-[#00A698] transition-colors"
      >
        <Globe size={18} /> {currentLocale.code.toUpperCase()}
      </button>
      
      {open && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden py-1 z-50">
          {LOCALES.map(l => (
            <button 
              key={l.code}
              onClick={() => switchLanguage(l.code)}
              className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 ${currentLocale.code === l.code ? 'text-[#00A698] bg-[#00A698]/5' : 'text-slate-700'}`}
            >
              <span className="mr-2">{l.flag}</span> {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const categories = [
  { label: 'Deals of the Day', href: '/deals-of-the-day' },
  { label: 'Club Tickets', href: '/club-tickets' },
  { label: 'Boat Parties', href: '/boat-parties' },
  { label: 'Private Boat Charters', href: '/private-boat-charters' },
  { label: 'Formentera Trips', href: '/formentera-boat-trips' },
  { label: 'VIP Catamaran', href: '/vip-catamaran' },
  { label: 'Drink Packages', href: '/drink-packages' },
  { label: 'Car & Scooter Rental', href: '/car-scooter-rental' },
  { label: 'Guestlist', href: '/guestlist' },
  { label: 'Ibiza Tips', href: '/tips' },
  { label: 'Blog', href: '/blog' },
  { label: 'Free & Discount Ibiza', href: '/free-discount-ibiza' },
]

const mainCategories = [
  { label: 'Club Tickets', href: '/club-tickets' },
  { label: 'Boat Parties', href: '/boat-parties' },
  { label: 'Deals of the Day', href: '/deals-of-the-day' },
  { label: 'Private Boat Charters', href: '/private-boat-charters' },
]

export function Navbar({ artists = [] }: { artists?: Artist[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { openDrawer, totalItems } = useCart()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 h-[96px] flex items-center justify-between gap-4 md:gap-8">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 mr-3">
            <Image 
              src="/logo-clean.png" 
              alt="Ibiza Mi Vida" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-black text-2xl sm:text-3xl tracking-tighter text-[#00A698] hidden sm:block">ibizamivida</span>
        </Link>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:flex">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search size={26} className="text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Zoek bestemmingen & ervaringen" 
              className="w-full pl-14 pr-5 py-4 bg-white border border-slate-300 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#00A698]/20 focus:border-[#00A698] transition-all text-slate-900 placeholder:text-slate-500 shadow-inner"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          
          <div className="block scale-125 origin-right">
            <LanguageSelector />
          </div>

          <button className="hidden sm:flex items-center gap-2 text-base font-bold text-slate-700 hover:text-[#00A698] transition-colors">
            <User size={24} /> Log in
          </button>

          {/* Mobile Search Toggle */}
          <button className="md:hidden p-2 text-slate-700 hover:text-[#00A698]">
            <Search size={26} />
          </button>

          {/* Cart */}
          <button
            onClick={openDrawer}
            className="relative p-2 text-slate-700 hover:text-[#00A698] transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={26} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#00A698] text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-700 hover:text-[#00A698] z-[60] relative"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Secondary Bar: Categories (Desktop) */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-4 h-12 items-center gap-8 overflow-x-auto no-scrollbar border-t border-slate-100">
        {mainCategories.map((cat, idx) => (
          <Link 
            key={idx} 
            href={cat.href}
            className="text-sm font-semibold text-slate-600 hover:text-[#00A698] whitespace-nowrap transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Dropdown (Full Screen) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col pt-24 pb-8 overflow-y-auto">
          <div className="px-6 pb-6">
            <h2 className="text-xl font-black text-slate-900 mb-4">Ontdek Ibiza</h2>
            <div className="flex flex-col gap-2">
              {categories.map((cat, idx) => (
                <Link 
                  key={idx} 
                  href={cat.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-4 text-lg font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A698] rounded-xl transition-colors border border-slate-100"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="px-6 py-6 bg-slate-50 mt-auto border-t border-slate-200">
            <button className="flex items-center gap-4 text-lg font-bold text-slate-700 hover:text-[#00A698] w-full py-3">
              <User size={24} /> Log in of account aanmaken
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
