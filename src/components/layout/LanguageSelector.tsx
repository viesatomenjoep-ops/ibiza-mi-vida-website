'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, Globe } from 'lucide-react'

export const LOCALES = [
  { code: 'nl', label: 'NL', name: 'Nederlands' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'fr', label: 'FR', name: 'Français' },
]

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Find current locale from URL
  const currentLocale = LOCALES.find(l => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`) || LOCALES[0]

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (newCode: string) => {
    setIsOpen(false)
    if (newCode === currentLocale.code) return

    // Replace the locale part of the path
    // Pathname usually looks like /nl/calendar
    const segments = pathname.split('/')
    if (segments[1] === currentLocale.code) {
      segments[1] = newCode
    } else {
      segments.splice(1, 0, newCode)
    }
    
    const newPath = segments.join('/') || '/'
    router.push(newPath)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-white font-bold text-xs tracking-wider"
        aria-label="Kies taal"
        aria-expanded={isOpen}
      >
        <Globe size={14} />
        {currentLocale.label}
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-black/10 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1.5">
            {LOCALES.map((loc) => (
              <button
                key={loc.code}
                onClick={() => changeLanguage(loc.code)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  currentLocale.code === loc.code 
                    ? 'bg-black text-white' 
                    : 'text-black hover:bg-black/5'
                }`}
              >
                {loc.name}
                <span className="text-[10px] uppercase opacity-60 tracking-widest">{loc.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
