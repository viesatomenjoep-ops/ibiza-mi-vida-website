'use client'

import { useEffect, useState } from 'react'

export function WeekRange() {
  const [mounted, setMounted] = useState(false)
  const [weekStr, setWeekStr] = useState('')

  useEffect(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    
    const monday = new Date(today)
    monday.setDate(diff)
    
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    
    const format = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
    setWeekStr(`${format(monday)} — ${format(sunday)}`)
    setMounted(true)
  }, [])

  if (!mounted) {
    return <p className="text-xs text-sandstone/60 uppercase tracking-wider">Weekly Overview</p>
  }

  return (
    <p className="text-xs text-sandstone/80 uppercase tracking-wider font-semibold">
      {weekStr}
    </p>
  )
}
