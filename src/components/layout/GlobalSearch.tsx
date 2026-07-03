'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Music, MapPin, Calendar, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

export function GlobalSearch({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ type: string; item: any }[]>([])
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
      if (query.trim().length > 1) {
        performSearch(query.trim())
      } else {
        setResults([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const performSearch = async (searchTerm: string) => {
    setIsSearching(true)
    
    // Search Venues
    const { data: venues } = await supabase
      .from('ct_venues')
      .select('name, slug, cover, whitelogo')
      .ilike('name', `%${searchTerm}%`)
      .limit(3)

    // Search Artists
    const { data: artists } = await supabase
      .from('ct_artists')
      .select('name, slug')
      .ilike('name', `%${searchTerm}%`)
      .limit(3)

    // Search Events
    const { data: events } = await supabase
      .from('ct_events')
      .select('name, slug, cover, logo, ct_venues(slug)')
      .ilike('name', `%${searchTerm}%`)
      .limit(3)

    const newResults: { type: string; item: any }[] = []
    
    if (venues) venues.forEach(v => newResults.push({ type: 'venue', item: v }))
    if (artists) artists.forEach(a => newResults.push({ type: 'artist', item: a }))
    if (events) events.forEach(e => newResults.push({ type: 'event', item: e }))

    setResults(newResults)
    setIsSearching(false)
  }

  const navigateTo = (result: { type: string; item: any }) => {
    setIsOpen(false)
    setQuery('')
    
    if (result.type === 'venue') {
      router.push(`/${locale}/club-tickets/${result.item.slug}`)
    } else if (result.type === 'artist') {
      router.push(`/${locale}/artists/${result.item.slug}`)
    } else if (result.type === 'event') {
      router.push(`/${locale}/club-tickets/${result.item.ct_venues?.slug || 'club'}/${result.item.slug}`)
    }
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
        <div className="absolute right-0 top-12 w-[300px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden z-50">
          <div className="p-4 border-b border-black/5 flex items-center gap-2">
            <Search size={18} className="text-velvet-obsidian/40" />
            <input 
              type="text" 
              placeholder="Zoek DJ's, clubs of feesten..." 
              className="flex-1 outline-none text-velvet-obsidian font-semibold"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-velvet-obsidian/40 hover:text-velvet-obsidian">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {isSearching ? (
              <div className="p-6 text-center text-velvet-obsidian/40 font-semibold text-sm">
                Aan het zoeken...
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col">
                {results.map((res, i) => (
                  <button 
                    key={i} 
                    onClick={() => navigateTo(res)}
                    className="flex items-center gap-4 p-4 hover:bg-ibiza-sand/20 transition-colors border-b border-black/5 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-ibiza-mint flex items-center justify-center overflow-hidden relative shrink-0">
                      {(res.type === 'venue' || res.type === 'event') && res.item.cover ? (
                        <Image src={res.item.cover} alt={res.item.name} fill className="object-cover" />
                      ) : res.type === 'artist' ? (
                        <Music size={18} className="text-ibiza-green" />
                      ) : res.type === 'venue' ? (
                        <MapPin size={18} className="text-ibiza-green" />
                      ) : (
                        <Calendar size={18} className="text-ibiza-green" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-ibiza-blue mb-0.5">
                        {res.type === 'venue' ? 'Club' : res.type === 'artist' ? 'Artiest' : 'Event'}
                      </div>
                      <div className="text-sm font-bold text-velvet-obsidian truncate">
                        {res.item.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length > 1 ? (
              <div className="p-6 text-center text-velvet-obsidian/40 font-semibold text-sm">
                Geen resultaten gevonden voor "{query}".
              </div>
            ) : (
              <div className="p-6 text-center text-velvet-obsidian/40 font-semibold text-sm bg-ibiza-sand/20">
                Type een naam om te zoeken.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
