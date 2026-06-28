'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, Globe, Menu, X, Calendar, Ticket, Ship, ShoppingCart, User } from 'lucide-react'
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
        className="icon-btn"
        aria-label="Select language"
      >
        <Globe size={21} className="text-[var(--sage)]" />
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
  { label: 'Ibiza Calendar', href: '/calendar', icon: Calendar },
  { label: 'Club Tickets', href: '/club-tickets', icon: Ticket },
  { label: 'Boat Parties', href: '/boat-parties', icon: Ship },
  { label: 'Deals of the Day', href: '/deals-of-the-day', icon: Ticket },
  { label: 'Private Boat Charters', href: '/private-boat-charters', icon: Ship },
  { label: 'Formentera Trips', href: '/formentera-boat-trips', icon: Ship },
  { label: 'VIP Catamaran', href: '/vip-catamaran', icon: Ship },
  { label: 'Drink Packages', href: '/drink-packages', icon: Ticket },
  { label: 'Car & Scooter Rental', href: '/car-scooter-rental', icon: Ticket },
  { label: 'Guestlist', href: '/guestlist', icon: Ticket },
  { label: 'Ibiza Tips', href: '/tips', icon: Ticket },
  { label: 'Blog', href: '/blog', icon: Ticket },
  { label: 'Free & Discount Ibiza', href: '/free-discount-ibiza', icon: Ticket },
]

export function Navbar({ artists = [], dict }: { artists?: Artist[], dict?: any }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const { openDrawer, totalItems } = useCart()

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentLocale = LOCALES.find(l => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`) || LOCALES[0]

  return (
    <>
      <header id="header" className={scrolled ? 'scrolled' : ''}>
        <div className="wrap nav">
          <Link href={`/${currentLocale.code}`} className="brand">
            <span className="mark">
              <img src="/logo-clean.png" alt="Ibiza mi Vida" className="w-[30px] h-[30px] object-contain invert brightness-0" />
            </span>
            <b>Ibiza mi <span>Vida</span></b>
          </Link>
          
          <nav className="nav-center">
            <Link href={`/${currentLocale.code}/calendar`} className={pathname.includes('/calendar') ? 'active' : ''}>
              <Calendar className="ic" /> Calendar
            </Link>
            <Link href={`/${currentLocale.code}/club-tickets`} className={pathname.includes('/club-tickets') ? 'active' : ''}>
              <Ticket className="ic" /> Club Tickets
            </Link>
            <Link href={`/${currentLocale.code}/boat-parties`} className={pathname.includes('/boat-parties') ? 'active' : ''}>
              <Ship className="ic" /> Boat Parties
            </Link>
          </nav>
          
          <div className="nav-right">
            <LanguageSelector />
            
            <button className="icon-btn relative" onClick={openDrawer}>
              <ShoppingCart size={21} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--green)] text-xs font-bold text-[var(--sage)] border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
            
            <button className="icon-btn hidden md:flex" onClick={() => setSearchOpen(true)}>
              <Search size={21} />
            </button>
            
            <button className="icon-btn burger" onClick={() => setMenuOpen(true)}>
              <Menu size={21} className="stroke-[var(--sage)]" />
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      <div className={`search-overlay ${searchOpen ? 'open' : ''}`}>
        <div className="search-panel">
          <div className="search-bar">
            <Search size={22} className="stroke-[var(--sage-55)]" />
            <input type="text" placeholder={dict?.search_placeholder || "Search destinations & clubs..."} autoFocus={searchOpen} />
            <button className="icon-btn" onClick={() => setSearchOpen(false)}>
              <X size={21} />
            </button>
          </div>
          <div className="search-results">
             <div className="search-empty">
               Start typing to search clubs, tickets, and more...
             </div>
          </div>
          <div className="search-hint">
             <kbd>ESC</kbd> to close
          </div>
        </div>
      </div>
      
      {/* MENU DRAWER */}
      <div className={`drawer-scrim ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}></div>
      <div className={`drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-head">
          <div className="brand">
            <b>Ibiza mi <span>Vida</span></b>
          </div>
          <button className="icon-btn" onClick={() => setMenuOpen(false)}>
            <X size={21} />
          </button>
        </div>
        
        <div className="drawer-search">
           <Search size={19} />
           <input type="text" placeholder="Search menu..." />
        </div>
        
        <div className="drawer-nav">
          <div className="drawer-sec">
             <h4>Explore</h4>
             {categories.slice(0, 7).map((cat, i) => (
                <Link key={i} href={`/${currentLocale.code}${cat.href}`} className="drawer-link" onClick={() => setMenuOpen(false)}>
                  <div className="di"><cat.icon size={20} /></div>
                  {cat.label}
                  <svg className="arrow" viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
             ))}
          </div>
          <div className="drawer-sec">
             <h4>More</h4>
             {categories.slice(7).map((cat, i) => (
                <Link key={i} href={`/${currentLocale.code}${cat.href}`} className="drawer-link" onClick={() => setMenuOpen(false)}>
                  <div className="di"><cat.icon size={20} /></div>
                  {cat.label}
                  <svg className="arrow" viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
             ))}
          </div>
        </div>
        
        <div className="drawer-foot">
           <a href="https://wa.me/31612345678" className="wa" target="_blank" rel="noreferrer">
             <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
             WhatsApp Support
           </a>
        </div>
      </div>
    </>
  )
}
