'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

/**
 * Native-style half-screen drawer.
 *
 * Mechanics: `open` drives a two-phase mount — the component stays in the DOM
 * for 320ms after close so the slide-down can play, then unmounts. The panel
 * position is a CSS transform (translate-y), so open/close is compositor-only.
 * Swipe-to-dismiss tracks touchmove on the grab-handle region and follows the
 * finger 1:1 downward; past 90px on release it closes, otherwise it springs
 * back. Backdrop tap and Escape also close. Scroll of the page behind is
 * locked by the shell while open.
 */
export function BottomSheet({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean
  onClose: () => void
  label?: string
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      // double-rAF so the closed transform paints before the open one animates
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    } else {
      setShown(false)
      const id = setTimeout(() => { setMounted(false); setDragY(0) }, 320)
      return () => clearTimeout(id)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!mounted) return null

  const onTouchStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY }
  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return
    setDragY(Math.max(0, e.touches[0].clientY - startY.current))
  }
  const onTouchEnd = () => {
    if (dragY > 90) onClose()
    else setDragY(0)
    startY.current = null
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={label}>
      {/* Dimmed backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none ${shown ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`absolute inset-x-0 bottom-0 mx-auto flex max-h-[86dvh] w-full max-w-lg flex-col rounded-t-[28px] border-t border-x border-white/10 bg-obsidian-light shadow-[0_-20px_60px_rgba(0,0,0,0.6)] outline-none transition-transform duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${shown ? 'translate-y-0' : 'translate-y-full'}`}
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
      >
        {/* Grab handle + close */}
        <div
          className="relative shrink-0 touch-none pt-3 pb-1"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <span className="mx-auto block h-1.5 w-12 rounded-full bg-white/20" aria-hidden />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/60 outline-none transition-colors motion-reduce:transition-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-95 motion-reduce:active:scale-100"
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(20px+env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  )
}
