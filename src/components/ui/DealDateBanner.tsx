'use client'

import { useEffect, useState } from 'react'

export function DealDateBanner() {
  const [mounted, setMounted] = useState(false)
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    const today = new Date()
    setDateStr(today.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="inline-block px-3 py-1 bg-gold text-velvet-obsidian text-xs font-bold uppercase tracking-widest rounded-full mb-4">Loading Date...</div>
  }

  return (
    <div className="inline-block px-4 py-1.5 bg-gold text-velvet-obsidian text-sm font-bold uppercase tracking-widest rounded-full mb-4 shadow-sm border border-gold/50">
      {dateStr}
    </div>
  )
}
