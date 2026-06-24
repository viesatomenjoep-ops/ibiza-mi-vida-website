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

const categories = [
  { label: 'Club Tickets', href: '/club-tickets' },
  { label: 'Boottochten', href: '/boat-parties' },
  { label: 'Privé Boten', href: '/private-boat-charters' },
  { label: 'Formentera', href: '/formentera-boat-trips' },
  { label: 'VIP Tafels', href: '/drink-packages' },
  { label: 'Auto & Scooter', href: '/car-scooter-rental' },
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
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between gap-4 md:gap-8">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 mr-2">
            <Image 
              src="/logo-clean.png" 
              alt="Ibiza Mi Vida" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tighter text-[#00A698] hidden sm:block">ibizamivida</span>
        </Link>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:flex">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Zoek bestemmingen & ervaringen" 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00A698]/20 focus:border-[#00A698] transition-all text-slate-900 placeholder:text-slate-500 shadow-inner"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          
          <button className="hidden lg:flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-[#00A698] transition-colors">
            <Globe size={18} /> NL / EUR
          </button>

          <button className="hidden lg:flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-[#00A698] transition-colors">
            <HelpCircle size={18} /> Help
          </button>

          <button className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-[#00A698] transition-colors">
            <User size={18} /> Log in
          </button>

          {/* Mobile Search Toggle */}
          <button className="md:hidden p-2 text-slate-700 hover:text-[#00A698]">
            <Search size={20} />
          </button>

          {/* Cart */}
          <button
            onClick={openDrawer}
            className="relative p-2 text-slate-700 hover:text-[#00A698] transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#00A698] text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#00A698]"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Secondary Bar: Categories (Desktop) */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-4 h-12 items-center gap-8 overflow-x-auto no-scrollbar border-t border-slate-100">
        {categories.map((cat, idx) => (
          <Link 
            key={idx} 
            href={cat.href}
            className="text-sm font-semibold text-slate-600 hover:text-[#00A698] whitespace-nowrap transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg flex flex-col py-2">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              href={cat.href}
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A698] border-b border-slate-100 last:border-0"
            >
              {cat.label}
            </Link>
          ))}
          <div className="px-6 py-4 flex flex-col gap-4 bg-slate-50 mt-2">
            <button className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-[#00A698]">
              <Globe size={18} /> NL / EUR
            </button>
            <button className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-[#00A698]">
              <HelpCircle size={18} /> Help
            </button>
            <button className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-[#00A698]">
              <User size={18} /> Log in
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
