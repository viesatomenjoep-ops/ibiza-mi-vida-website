'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
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
    <section className="relative z-20 -mt-16 mb-8 px-[5%]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-rustic-terracotta/10 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-4 z-10 w-full md:w-auto">
            <div 
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-velvet-obsidian shadow-inner flex items-center justify-center shrink-0 border-[3px] border-white relative group cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-black/40 hover:bg-black/60 transition-colors z-10">
                {isPlaying ? (
                  <div className="flex gap-1">
                    <div className="w-1 h-3 bg-white" />
                    <div className="w-1 h-3 bg-white" />
                  </div>
                ) : (
                  <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white ml-1" />
                )}
              </div>
            </div>
            <div>
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-rustic-terracotta mb-1 block">Live Broadcast</span>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-velvet-obsidian leading-none">Ibiza Global Radio</h3>
            </div>
          </div>

          <div className="flex-1 w-full flex items-center justify-center md:justify-end gap-1 z-10 h-8 px-4 md:px-0">
             {/* Animated Equalizer */}
             {Array.from({length: 24}).map((_, i) => (
               <motion.div 
                 key={i} 
                 className="w-1.5 bg-velvet-obsidian rounded-full" 
                 animate={{ 
                   height: isPlaying ? [`${Math.max(20, Math.random() * 100)}%`, `${Math.max(20, Math.random() * 100)}%`, `${Math.max(20, Math.random() * 100)}%`] : '20%',
                   opacity: isPlaying ? Math.max(0.4, Math.random()) : 0.2
                 }}
                 transition={{ 
                   repeat: isPlaying ? Infinity : 0, 
                   duration: 0.3 + Math.random() * 0.5, 
                   ease: 'easeInOut' 
                 }}
               />
             ))}
          </div>
        </div>
      </div>
    </section>
  )
}
