'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2, MapPin, Calendar, Star, Building } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchResult {
  id: string
  type: 'Club' | 'Event' | 'Location' | 'Experience'
  title: string
  subtitle: string
  image: string | null
  url: string
}

export function SearchBar({ placeholder = "Zoek bestemmingen & ervaringen", locale = "nl" }: { placeholder?: string, locale?: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      const fetchResults = async () => {
        setIsLoading(true)
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&locale=${locale}`)
          const data = await res.json()
          setResults(data.results || [])
          setIsOpen(true)
        } catch (err) {
          console.error("Failed to fetch search results", err)
        } finally {
          setIsLoading(false)
        }
      }
      fetchResults()
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [debouncedQuery, locale])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Club': return <Building size={16} className="text-purple-500" />
      case 'Event': return <Calendar size={16} className="text-[#00A698]" />
      case 'Location': return <MapPin size={16} className="text-blue-500" />
      case 'Experience': return <Star size={16} className="text-amber-500" />
      default: return <Search size={16} className="text-slate-400" />
    }
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
        {isLoading ? (
          <Loader2 size={24} className="text-[#00A698] animate-spin" />
        ) : (
          <Search size={24} className={query.length > 0 ? "text-[#00A698]" : "text-slate-400"} />
        )}
      </div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          if (!isOpen && e.target.value.length >= 2 && results.length > 0) setIsOpen(true)
        }}
        onFocus={() => {
          if (query.length >= 2 && results.length > 0) setIsOpen(true)
        }}
        placeholder={placeholder}
        className="w-full pl-14 pr-5 py-4 bg-white border border-slate-300 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#00A698]/20 focus:border-[#00A698] transition-all text-slate-900 placeholder:text-slate-500 shadow-inner"
      />
      
      {/* Search Dropdown Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-[100] max-h-[60vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="flex flex-col py-2">
              {results.map((res) => (
                <Link 
                  key={res.id} 
                  href={res.url}
                  onClick={handleResultClick}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center">
                    {res.image ? (
                      <Image 
                        src={res.image} 
                        alt={res.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    ) : (
                      getIconForType(res.type)
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                        {getIconForType(res.type)} {res.type}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 truncate group-hover:text-[#00A698] transition-colors">{res.title}</span>
                    <span className="text-xs font-medium text-slate-500 truncate">{res.subtitle}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center flex flex-col items-center justify-center">
              <Search size={48} className="text-slate-200 mb-3" />
              <h3 className="text-slate-900 font-bold mb-1">Geen resultaten gevonden</h3>
              <p className="text-sm text-slate-500">Probeer een andere zoekterm, bijvoorbeeld "Ushuaia" of "Boot".</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
