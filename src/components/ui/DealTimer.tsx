'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

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
      <div className="w-32 h-40 bg-midnight rounded-[2.5rem] border-[6px] border-[#2A2A2A] shadow-2xl relative flex items-center justify-center">
         <div className="animate-pulse w-10 h-10 bg-white/10 rounded-full" />
      </div>
    )
  }

  return (
    <div className="relative group perspective-1000">
      {/* Apple Watch Band (Top) */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#1A1A1A] rounded-t-lg -z-10 shadow-inner" />
      
      {/* Watch Case */}
      <div className="w-[140px] h-[170px] bg-black rounded-[2.5rem] border-[6px] border-[#333] shadow-2xl relative flex flex-col items-center justify-between p-4 overflow-hidden transform transition-transform duration-500 hover:rotate-y-12 hover:rotate-x-12">
        
        {/* Screen Bezel inner glow */}
        <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] pointer-events-none" />
        
        {/* Watch Crown (Right side) */}
        <div className="absolute right-[-8px] top-10 w-2 h-8 bg-[#444] rounded-r-md border-l border-[#222]" />
        {/* Side Button */}
        <div className="absolute right-[-6px] top-24 w-1.5 h-10 bg-[#333] rounded-r-sm border-l border-[#222]" />

        {/* Watch Face Content */}
        
        {/* Logo at Top */}
        <div className="relative w-16 h-16 mt-1 flex-shrink-0 animate-pulse-slow">
          <Image 
            src="/logo-clean.png" 
            alt="Ibiza mi vida" 
            fill 
            className="object-contain filter brightness-0 invert opacity-90"
          />
        </div>

        {/* Digital Time Display */}
        <div className="flex flex-col items-center w-full mt-auto mb-2 relative z-10">
          <div className="flex items-center justify-center gap-1 w-full">
            <div className="flex flex-col items-center">
              <span className="text-white font-mono text-2xl tracking-tighter font-bold">
                {timeLeft.hours.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-white/50 text-xl pb-1 animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <span className="text-white font-mono text-2xl tracking-tighter font-bold">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-white/50 text-xl pb-1 animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <span className="text-[#FF2D55] font-mono text-2xl tracking-tighter font-bold">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 mt-1 font-semibold">Ends Midnight</span>
        </div>

        {/* Activity Rings subtle background effect */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="url(#gradient)" strokeWidth="4" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (timeLeft.seconds / 60))} className="transition-all duration-1000 ease-linear" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF2D55" />
                <stop offset="100%" stopColor="#FF9F0A" />
              </linearGradient>
            </defs>
          </svg>
        </div>

      </div>

      {/* Apple Watch Band (Bottom) */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#1A1A1A] rounded-b-lg -z-10 shadow-inner" />
    </div>
  )
}
