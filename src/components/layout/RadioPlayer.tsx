'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('https://ibizaglobalradio.streaming-pro.com:8024/stream')
    
    const handleCanPlay = () => setIsLoading(false)
    const handlePlaying = () => {
      setIsLoading(false)
      setIsPlaying(true)
    }
    const handlePause = () => setIsPlaying(false)
    const handleWaiting = () => setIsLoading(true)

    audioRef.current.addEventListener('canplay', handleCanPlay)
    audioRef.current.addEventListener('playing', handlePlaying)
    audioRef.current.addEventListener('pause', handlePause)
    audioRef.current.addEventListener('waiting', handleWaiting)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current.removeEventListener('canplay', handleCanPlay)
        audioRef.current.removeEventListener('playing', handlePlaying)
        audioRef.current.removeEventListener('pause', handlePause)
        audioRef.current.removeEventListener('waiting', handleWaiting)
      }
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      setIsLoading(true)
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err)
        setIsLoading(false)
        setIsPlaying(false)
      })
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!audioRef.current) return
    const newMuted = !isMuted
    audioRef.current.muted = newMuted
    setIsMuted(newMuted)
  }

  return (
    <div className="flex justify-start">
      <motion.button
        onClick={togglePlay}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex items-center gap-1.5 rounded-full border border-white/20 bg-black/20 p-1 pr-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-black/40 text-white"
        whileTap={{ scale: 0.95 }}
      >
        <div className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${isPlaying ? 'bg-[#25D366] text-white shadow-[0_0_15px_rgba(37,211,102,0.5)]' : 'bg-white text-velvet-obsidian'}`}>
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : isPlaying ? (
            <div className="flex gap-[2px] items-center justify-center h-3">
              <motion.div animate={{ height: [3, 10, 3] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className="w-[3px] bg-current rounded-full" />
              <motion.div animate={{ height: [5, 8, 5] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }} className="w-[3px] bg-current rounded-full" />
              <motion.div animate={{ height: [3, 10, 3] }} transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut", delay: 0.4 }} className="w-[3px] bg-current rounded-full" />
            </div>
          ) : (
            <Play size={14} className="ml-0.5 fill-current" />
          )}
        </div>

        <div className="flex flex-col items-start px-1.5 overflow-hidden">
          <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-white/70">
            {isPlaying ? 'Live Now' : 'Listen Live'}
          </span>
          <span className="font-serif text-xs md:text-sm font-bold whitespace-nowrap">
            Ibiza Global Radio
          </span>
        </div>

        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="ml-2 overflow-hidden"
            >
              <button
                onClick={toggleMute}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20 transition-colors text-white"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
