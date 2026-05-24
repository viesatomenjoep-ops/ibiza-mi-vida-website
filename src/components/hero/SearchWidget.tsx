'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

const serviceOptions = [
  { label: 'Private Boat Charter', href: '/private-boat-charters' },
  { label: 'Club Tickets', href: '/club-tickets' },
  { label: 'Boat Parties', href: '/boat-parties' },
  { label: 'VIP Catamaran', href: '/vip-catamaran' },
  { label: 'Formentera Trip', href: '/formentera-boat-trips' },
  { label: 'Car & Scooter Rental', href: '/car-scooter-rental' },
]

export function SearchWidget() {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState(serviceOptions[0].href)
  const [date, setDate] = useState('')

  const handleSearch = () => {
    const params = date ? `?date=${date}` : ''
    router.push(`${selectedService}${params}`)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div
      className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:flex-row md:rounded-full md:items-stretch border border-black/5 p-1 md:p-2"
      role="search"
      aria-label="Find your Ibiza experience"
    >
      {/* Service selector */}
      <div className="flex flex-1 flex-col border-b border-black/5 px-5 py-4 md:border-b-0 md:border-r md:py-0 md:justify-center transition-colors hover:bg-black/5 md:rounded-l-full">
        <label
          htmlFor="search-service"
          className="mb-1 font-sans text-[11px] font-bold uppercase tracking-wider text-velvet-obsidian/50"
        >
          What are you planning?
        </label>
        <select
          id="search-service"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full bg-transparent font-serif text-lg font-medium text-velvet-obsidian focus:outline-none cursor-pointer"
          aria-label="Select service type"
        >
          {serviceOptions.map((opt) => (
            <option key={opt.href} value={opt.href} className="bg-white text-velvet-obsidian">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date selector */}
      <div className="flex flex-1 flex-col border-b border-black/5 px-5 py-4 md:border-b-0 md:py-0 md:justify-center transition-colors hover:bg-black/5">
        <label
          htmlFor="search-date"
          className="mb-1 font-sans text-[11px] font-bold uppercase tracking-wider text-velvet-obsidian/50"
        >
          When are you arriving?
        </label>
        <input
          id="search-date"
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-transparent font-sans text-base font-medium text-velvet-obsidian placeholder-velvet-obsidian/40 focus:outline-none cursor-pointer"
          aria-label="Select arrival date"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-center p-3">
        <button
          onClick={handleSearch}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-velvet-obsidian px-8 py-4 font-sans text-[15px] font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-velvet-obsidian/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rustic-terracotta md:w-auto"
          aria-label="Search for experiences"
        >
          <Search size={16} />
          <span>Search</span>
        </button>
      </div>
    </div>
  )
}
