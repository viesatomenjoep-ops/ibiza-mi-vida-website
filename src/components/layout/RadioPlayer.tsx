'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Only initialize once on client
    if (!audioRef.current) {
      audioRef.current = new Audio('https://listenssl.ibizaglobalradio.com:8024/stream')
      audioRef.current.preload = 'none'
    }

    const tryAutoplay = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play()
          setIsPlaying(true)
        }
      } catch (err) {
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
    // Instant UI feedback
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);

    if (!audioRef.current) return

    if (!newPlayState) {
      audioRef.current.pause()
    } else {
      // Catch error silently if it fails to buffer immediately
      audioRef.current.play().catch(() => {
        setIsPlaying(false)
      })
    }
  }

  const isHomepageTop = pathname === '/' && !scrolled;
  const showExpandedText = isHomepageTop || isHovered || isPlaying;

  return (
    <div className="fixed top-[90px] md:top-[100px] right-4 md:right-8 z-[60]">
      <motion.button
        onClick={togglePlay}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group flex items-center gap-2 rounded-full border p-1 md:p-1.5 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 ${
          isPlaying 
            ? 'bg-velvet-obsidian/90 text-white border-black/10' 
            : (scrolled || pathname !== '/') 
              ? 'bg-white text-velvet-obsidian border-black/10 hover:bg-ibiza-sand' 
              : 'bg-black/20 text-white border-white/20 hover:bg-black/30'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <div className={`flex h-6 w-6 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
          isPlaying ? 'bg-[#25D366] text-white' : ((scrolled || pathname !== '/') ? 'bg-velvet-obsidian/5 text-velvet-obsidian' : 'bg-white/20 text-white')
        }`}>
          {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="ml-0.5 fill-current" />}
        </div>
        
        {/* Expanded state */}
        <AnimatePresence>
          {showExpandedText && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden whitespace-nowrap pr-3 md:pr-4"
            >
              <div className="flex flex-col items-start text-left">
                <span className="font-sans text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-current opacity-70">
                  Live Radio
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-[11px] md:text-[13px] font-semibold leading-none text-current">
                    Ibiza Global Radio
                  </span>
                  {isPlaying && (
                    <div className="flex items-end gap-[1px] h-2.5 ml-1">
                      <motion.div animate={{ height: ['3px', '10px', '3px'] }} transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }} className="w-[2px] bg-current opacity-80" />
                      <motion.div animate={{ height: ['6px', '3px', '8px', '6px'] }} transition={{ repeat: Infinity, duration: 0.4, ease: 'easeInOut' }} className="w-[2px] bg-current opacity-80" />
                      <motion.div animate={{ height: ['4px', '10px', '4px'] }} transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }} className="w-[2px] bg-current opacity-80" />
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
