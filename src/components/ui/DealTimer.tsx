'use client'

import { useEffect, useState } from 'react'

export function DealTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const calculateTimeLeft = () => {
      const now = new Date()
      // Calculate time until next midnight
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight.getTime() - now.getTime()

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="flex gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-midnight text-xl font-bold text-white">--</div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-midnight text-xl font-bold text-white">--</div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-midnight text-xl font-bold text-red-500">--</div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-midnight text-xl sm:text-2xl font-bold text-white shadow-inner border border-white/10">
          {timeLeft.hours.toString().padStart(2, '0')}
        </div>
        <span className="text-[10px] uppercase tracking-wider text-midnight/60 font-semibold mt-1">Hrs</span>
      </div>
      <span className="text-2xl font-bold text-midnight pb-4">:</span>
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-midnight text-xl sm:text-2xl font-bold text-white shadow-inner border border-white/10">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </div>
        <span className="text-[10px] uppercase tracking-wider text-midnight/60 font-semibold mt-1">Min</span>
      </div>
      <span className="text-2xl font-bold text-midnight pb-4">:</span>
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-midnight text-xl sm:text-2xl font-bold text-red-500 shadow-inner border border-white/10">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
        <span className="text-[10px] uppercase tracking-wider text-midnight/60 font-semibold mt-1">Sec</span>
      </div>
    </div>
  )
}
