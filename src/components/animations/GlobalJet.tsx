'use client'

import { useEffect, useState } from 'react'

export function GlobalJet() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll <= 0) return
      
      const currentScroll = window.scrollY
      // value between 0 and 1
      let p = Math.min(1, Math.max(0, currentScroll / totalScroll))
      
      // We want to ease the movement so it looks smooth
      setProgress(p)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate jet position based on progress (0 to 1)
  // X: from -20vw (left off-screen) to 120vw (right off-screen)
  // Y: from -10vh (top off-screen) to 110vh (bottom off-screen)
  const x = -20 + progress * 140
  const y = -10 + progress * 120
  
  // Bank angle to make it point towards its trajectory
  const dy = 120
  const dx = 140
  const bank = Math.atan2(dy, dx) * (180 / Math.PI)

  return (
    <div 
      className="fixed z-50 pointer-events-none transition-transform duration-75 ease-out"
      style={{
        top: `${y}vh`,
        left: `${x}vw`,
        transform: `translate(-50%, -50%) rotate(${bank}deg) scale(0.6)`
      }}
      aria-hidden="true"
    >
      <svg width="240" height="120" viewBox="-100 -60 200 120" className="drop-shadow-2xl">
        <defs>
          <linearGradient id="jetL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E8ECEE"/>
            <stop offset="60%" stop-color="#C8D4DA"/>
            <stop offset="100%" stop-color="#93A6B0"/>
          </linearGradient>
          <linearGradient id="trailL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".9"/>
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <g transform="scale(-1,1)">
          <g id="trail">
            <rect x="58" y="-7" width="360" height="2.8" rx="1.4" fill="url(#trailL)"/>
            <rect x="64" y="2" width="300" height="2.4" rx="1.2" fill="url(#trailL)" opacity=".7"/>
          </g>
          <path d="M 6 -2 L 64 16 L 50 19 L -2 4 Z" fill="#AFBCC4"/>
          <path d="M -78 -4 C -70 -9 -58 -11 -40 -11 L 38 -11 C 56 -11 66 -8 70 -4 C 73 -1 72 3 66 4 L -52 4 C -68 4 -76 1 -78 -4 Z" fill="url(#jetL)"/>
          <path d="M -70 -8 C -64 -10 -58 -10.6 -52 -10.7 L -52 -6.5 L -68 -6.2 Z" fill="#2B3947"/>
          <g fill="#2B3947" opacity=".85">
            <circle cx="-38" cy="-7.4" r="1.6"/><circle cx="-28" cy="-7.4" r="1.6"/>
            <circle cx="-18" cy="-7.4" r="1.6"/><circle cx="-8" cy="-7.4" r="1.6"/>
            <circle cx="2" cy="-7.4" r="1.6"/><circle cx="12" cy="-7.4" r="1.6"/>
            <circle cx="22" cy="-7.4" r="1.6"/>
          </g>
          <ellipse cx="42" cy="-12" rx="13" ry="4.6" fill="#CBD4D9"/>
          <ellipse cx="30" cy="-12" rx="2.6" ry="4" fill="#2B3947"/>
          <path d="M 56 -10 L 74 -34 L 80 -34 L 70 -10 Z" fill="#E2E7EA"/>
          <path d="M 62 -34 L 92 -38 L 90 -33 L 64 -31 Z" fill="#C4CFD5"/>
          <path d="M -74 0 C -60 3 60 3 66 1 L 66 4 L -52 4 C -66 4 -73 2 -74 0 Z" fill="#93A3AD" opacity=".6"/>
          <circle cx="-77" cy="-4" r="2" fill="#2E5A6B" className="animate-pulse"/>
          <circle cx="90" cy="-36" r="2" fill="#B0563B" className="animate-pulse" style={{ animationDelay: '0.5s' }}/>
        </g>
        <text x="-36" y="1.6" fontFamily="Marcellus, serif" fontSize="7.2" letterSpacing="1.6" fill="#2E5A6B">IBIZA MI VIDA</text>
        <text x="-78" y="-30" fontFamily="Marcellus, serif" fontSize="7" fill="#2E5A6B">MV</text>
      </svg>
    </div>
  )
}
