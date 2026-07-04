'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Music, MapPin, Calendar, X } from 'lucide-react'
import Image from 'next/image'

export function GlobalSearch({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch(query.trim())
      } else {
        setResults([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const performSearch = async (searchTerm: string) => {
    setIsSearching(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&locale=${locale}`)
      const data = await res.json()
      setResults(Array.isArray(data.results) ? data.results : [])
    } catch {
      setResults([])
    }
    setIsSearching(false)
  }

  const navigateTo = (result: any) => {
    setIsOpen(false)
    setQuery('')
    if (result?.url) router.push(result.url)
  }

  return (
    <div className="relative" ref={searchRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="search-trigger-btn flex items-center justify-center rounded-full transition-colors"
        aria-label="Search"
      >
        <Search size={20} className="text-white" />
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop to close when clicking outside */}
          <div className="fixed inset-0 z-[90] md:hidden" onClick={() => setIsOpen(false)} />
          <div className="fixed left-3 right-3 top-[64px] md:absolute md:left-auto md:right-0 md:top-[70px] md:w-[420px] md:max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-black/10 overflow-hidden z-[100] flex flex-col max-h-[70vh] md:max-h-[85vh]">
            <div className="p-3 md:p-4 border-b border-black/10 flex items-center gap-3 shrink-0">
              <Search size={18} strokeWidth={2.5} className="text-neutral-400" />
            <input 
              type="text" 
              placeholder="Zoek DJ's, clubs of feesten..." 
              className="flex-1 outline-none text-black placeholder-neutral-400 font-bold text-sm md:text-base"
              style={{ color: '#000' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-black/30 hover:text-black transition-colors">
                <X size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {isSearching ? (
              <div className="p-8 text-center text-neutral-400 font-bold text-sm">
                Aan het zoeken...
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col py-2">
                {results.map((res, i) => (
                  <button
                    key={res.id || i}
                    onClick={() => navigateTo(res)}
                    className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0 text-left group"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-neutral-100 flex items-center justify-center overflow-hidden relative shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      {res.image ? (
                        <Image src={res.image} alt={res.title} fill className="object-cover" />
                      ) : res.type === 'Artiest' ? (
                        <Music size={18} className="text-ibiza-green" />
                      ) : res.type === 'Club' ? (
                        <MapPin size={18} className="text-ibiza-green" />
                      ) : (
                        <Calendar size={18} className="text-ibiza-green" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-ibiza-green mb-0.5">
                        {res.type}
                      </div>
                      <div className="text-xs md:text-sm font-bold text-black truncate pr-2" style={{ color: '#000' }}>
                        {res.title}
                      </div>
                      {res.subtitle && (
                        <div className="text-[10px] md:text-xs text-black/50 truncate pr-2">{res.subtitle}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length > 0 ? (
              <div className="p-8 text-center text-neutral-400 font-bold text-sm">
                Geen resultaten gevonden voor "{query}".
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-400 font-bold text-sm bg-neutral-50/50">
                Type een naam om te zoeken.
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  )
}
