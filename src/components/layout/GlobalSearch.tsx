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
      .limit(5)

    // Search Events (by name or lineUp)
    const { data: events } = await supabase
      .from('ct_events')
      .select('name, slug, cover, logo, ct_venues(slug)')
      .or(`name.ilike.%${searchTerm}%,lineUp.ilike.%${searchTerm}%`)
      .limit(6)

    // Search Custom Listings
    const { data: customListings } = await supabase
      .from('custom_listings')
      .select('title, slug, cover_image_url, category')
      .ilike('title', `%${searchTerm}%`)
      .limit(3)

    const newResults: { type: string; item: any }[] = []
    
    if (venues) venues.forEach(v => newResults.push({ type: 'venue', item: v }))
    if (artists) artists.forEach(a => newResults.push({ type: 'artist', item: a }))
    if (events) events.forEach(e => newResults.push({ type: 'event', item: e }))
    if (customListings) customListings.forEach(c => newResults.push({ type: 'custom', item: c }))

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
    } else if (result.type === 'custom') {
      // Assuming custom listings use their category as basePath
      router.push(`/${locale}/${result.item.category}/${result.item.slug}`)
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
        <div className="absolute right-0 top-14 w-[90vw] max-w-[340px] md:max-w-[450px] bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden z-[100] transform transition-all origin-top-right">
          <div className="p-3 md:p-4 border-b border-black/10 flex items-center gap-3">
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

          <div className="max-h-[70vh] overflow-y-auto hide-scrollbar">
            {isSearching ? (
              <div className="p-8 text-center text-neutral-400 font-bold text-sm">
                Aan het zoeken...
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col py-2">
                {results.map((res, i) => (
                  <button 
                    key={i} 
                    onClick={() => navigateTo(res)}
                    className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0 text-left group"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-ibiza-mint flex items-center justify-center overflow-hidden relative shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      {((res.type === 'venue' || res.type === 'event') && res.item.cover) ? (
                        <Image src={res.item.cover} alt={res.item.name} fill className="object-cover" />
                      ) : (res.type === 'custom' && res.item.cover_image_url) ? (
                        <Image src={res.item.cover_image_url} alt={res.item.title} fill className="object-cover" />
                      ) : res.type === 'artist' ? (
                        <Music size={18} className="text-ibiza-green" />
                      ) : res.type === 'venue' ? (
                        <MapPin size={18} className="text-ibiza-green" />
                      ) : (
                        <Calendar size={18} className="text-ibiza-green" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-ibiza-green mb-0.5">
                        {res.type === 'venue' ? 'Club' : res.type === 'artist' ? 'Artiest' : res.type === 'custom' ? res.item.category : 'Event'}
                      </div>
                      <div className="text-xs md:text-sm font-bold text-black truncate pr-2" style={{ color: '#000' }}>
                        {res.item.name || res.item.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length > 1 ? (
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
      )}
    </div>
  )
}
