'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Radio } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function RadioPlayer() {
  const pathname = usePathname()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Only show on the homepage
  if (pathname !== '/') return null

  useEffect(() => {
    // Initialize audio object only on client side
    if (!audioRef.current) {
      audioRef.current = new Audio('https://listenssl.ibizaglobalradio.com:8024/stream')
      audioRef.current.preload = 'none'
    }

    // Try to autoplay
    const tryAutoplay = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play()
          setIsPlaying(true)
        }
      } catch (err) {
        // Autoplay blocked by browser policy, wait for user interaction
        console.log('Autoplay prevented by browser policy. User must manually click play.')
        setIsPlaying(false)
      }
    }

    tryAutoplay()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(err => {
        console.error("Error playing audio:", err)
      })
    }
  }

  return (
    <div className="fixed top-[90px] md:top-[100px] right-4 md:right-8 z-40">
      <motion.button
        onClick={togglePlay}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group flex items-center gap-2 md:gap-3 rounded-full border border-black/10 p-2 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 ${
          isPlaying ? 'bg-velvet-obsidian/90 text-white' : 'bg-white/90 text-velvet-obsidian hover:bg-ibiza-sand'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <div className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
          isPlaying ? 'bg-[#25D366] text-white' : 'bg-velvet-obsidian/5 text-velvet-obsidian'
        }`}>
          {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="ml-1 fill-current" />}
        </div>
        
        {/* Expanded state on desktop or when playing/hovered */}
        <AnimatePresence>
          {(isHovered || isPlaying) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden whitespace-nowrap pr-4"
            >
              <div className="flex flex-col items-start text-left">
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-current opacity-70">
                  Live Radio
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-[15px] font-semibold leading-none text-current">
                    Ibiza Global Radio
                  </span>
                  {isPlaying && (
                    <div className="flex items-end gap-0.5 h-3 ml-1">
                      <motion.div animate={{ height: ['4px', '12px', '4px'] }} transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }} className="w-1 bg-current opacity-80" />
                      <motion.div animate={{ height: ['8px', '4px', '10px', '8px'] }} transition={{ repeat: Infinity, duration: 0.4, ease: 'easeInOut' }} className="w-1 bg-current opacity-80" />
                      <motion.div animate={{ height: ['6px', '12px', '6px'] }} transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }} className="w-1 bg-current opacity-80" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
