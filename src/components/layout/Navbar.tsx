'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, Globe, HelpCircle, User, ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { SearchBar } from '@/components/ui/SearchBar'

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
        className="flex items-center gap-1.5 text-base font-bold text-slate-700 hover:text-[#00A698] transition-colors uppercase"
      >
        <Globe size={20} /> {currentLocale.code}
      </button>
      
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden py-2 animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-center font-bold text-slate-800 py-3 border-b border-slate-100 text-lg">Select Language</h3>
            {LOCALES.map(l => (
              <button 
                key={l.code}
                onClick={() => switchLanguage(l.code)}
                className={`w-full text-center px-4 py-4 text-base font-bold hover:bg-slate-50 transition-colors ${currentLocale.code === l.code ? 'text-[#00A698] bg-[#00A698]/5' : 'text-slate-700'}`}
              >
                <span className="mr-3 text-xl">{l.flag}</span> {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const categories = [
  { label: 'Ibiza Calendar', href: '/calendar' },
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
  { label: 'Ibiza Calendar', href: '/calendar' },
  { label: 'Club Tickets', href: '/club-tickets' },
  { label: 'Boat Parties', href: '/boat-parties' },
  { label: 'Deals of the Day', href: '/deals-of-the-day' },
  { label: 'Private Boat Charters', href: '/private-boat-charters' },
]

export function Navbar({ artists = [], dict }: { artists?: Artist[], dict?: any }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const pathname = usePathname()
  const { openDrawer, totalItems } = useCart()

  useEffect(() => {
    setMenuOpen(false)
    setMobileSearchOpen(false)
  }, [pathname])

  const isHomepage = ['/', '/nl', '/en', '/es'].includes(pathname)
  const currentLocale = LOCALES.find(l => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`) || LOCALES[0]

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 h-[96px] flex items-center justify-between gap-4 md:gap-8">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center shrink-0 group">
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
          <SearchBar 
            placeholder={dict?.search_placeholder || "Zoek bestemmingen & ervaringen"} 
            locale={currentLocale.code} 
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {!isHomepage && (
            <Link href="/" className="font-bold text-base text-slate-700 hover:text-[#00A698] transition-colors mr-1">
              IBZMV
            </Link>
          )}

          <div className="block">
            <LanguageSelector />
          </div>

          <button className="hidden sm:flex items-center gap-2 text-base font-bold text-slate-700 hover:text-[#00A698] transition-colors">
            <User size={24} /> {dict?.nav_login || 'Log in'}
          </button>

          {/* Mobile Search Toggle */}
          <button 
            className="md:hidden p-2 text-slate-700 hover:text-[#00A698]"
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen)
              setMenuOpen(false)
            }}
          >
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
            onClick={() => {
              setMenuOpen(!menuOpen)
              setMobileSearchOpen(false)
            }}
            className="p-2 text-slate-700 hover:text-[#00A698] z-[60] relative"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Secondary Bar: Categories (Desktop) */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-4 h-12 items-center gap-8 overflow-x-auto no-scrollbar border-t border-slate-100">
            {mainCategories.map((cat) => {
              const label = dict ? dict[`nav_${cat.href.replace('/', '').replace(/-/g, '_')}`] : cat.label;
              return (
                <Link 
                  key={cat.href} 
                  href={cat.href}
                  className="px-4 py-2 text-[15px] font-bold text-slate-700 hover:text-[#00A698] hover:bg-slate-50 rounded-full transition-colors whitespace-nowrap"
                >
                  {label || cat.label}
                </Link>
              )
            })}
      </div>

      {/* Mobile Menu Dropdown (Full Screen) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col pt-24 pb-8 overflow-y-auto">
          <div className="px-6 pb-6">
            <h2 className="text-xl font-black text-slate-900 mb-4">Ontdek Ibiza</h2>
            <div className="flex flex-col gap-2">
                    {categories.map((cat) => {
                      const label = dict ? dict[`nav_${cat.href.replace('/', '').replace(/-/g, '_')}`] : cat.label;
                      return (
                        <Link 
                          key={cat.href} 
                          href={cat.href}
                          className="px-4 py-3 font-semibold text-slate-700 hover:text-[#00A698] hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100"
                        >
                          {label || cat.label}
                        </Link>
                      )
                    })}
            </div>
          </div>
          
          <div className="px-6 py-6 bg-slate-50 mt-auto border-t border-slate-200">
            <button className="flex items-center gap-4 text-lg font-bold text-slate-700 hover:text-[#00A698] w-full py-3">
              <User size={24} /> Log in of account aanmaken
            </button>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col pt-24 pb-8 px-4 md:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900">Zoeken</h2>
            <button 
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          <div className="w-full relative z-50">
            <SearchBar 
              placeholder={dict?.search_placeholder || "Zoek bestemmingen & ervaringen"} 
              locale={currentLocale.code} 
            />
          </div>
        </div>
      )}
    </header>
  )
}
