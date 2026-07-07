'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import type { PickerEvent } from '@/components/events/EventPickerWheel'

/**
 * Horizontal marquee of live ClubTickets events (event name + small club logo).
 * Auto-scrolls, is draggable by thumb/mouse (left↔right), and each item links
 * straight to the event page. Vertical swipes still scroll the page.
 */
export function HomeEventSlider({
  events,
  className = 'w-full relative z-20 bg-transparent py-2',
  speed = 0.7,
}: {
  events: PickerEvent[]
  className?: string
  speed?: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const unitRef = useRef(0)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartOffset = useRef(0)
  const dragMoved = useRef(false)
  const velRef = useRef(0)
  const prevMoveX = useRef(0)
  const momentumRef = useRef(0)
  const hasCapture = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track || events.length === 0) return
    let animationId: number
    const measure = () => { unitRef.current = track.scrollWidth / 4 }
    measure()
    const play = () => {
      if (!isDragging.current && track) {
        const unit = unitRef.current
        if (Math.abs(momentumRef.current) > 0.3) { offsetRef.current += momentumRef.current; momentumRef.current *= 0.9 }
        else offsetRef.current -= speed
        if (unit) { while (offsetRef.current <= -unit) offsetRef.current += unit; while (offsetRef.current > 0) offsetRef.current -= unit }
        track.style.transform = `translate3d(${offsetRef.current}px,0,0)`
      }
      animationId = requestAnimationFrame(play)
    }
    play()
    window.addEventListener('resize', measure)
    const remeasure = setTimeout(measure, 400)
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', measure); clearTimeout(remeasure) }
  }, [events, speed])

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true; dragMoved.current = false; hasCapture.current = false
    dragStartX.current = e.clientX; dragStartOffset.current = offsetRef.current
    prevMoveX.current = e.clientX; velRef.current = 0; momentumRef.current = 0
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const track = trackRef.current; if (!track) return
    const dx = e.clientX - dragStartX.current
    if (Math.abs(dx) > 6) { dragMoved.current = true; if (!hasCapture.current) { try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); hasCapture.current = true } catch {} } }
    velRef.current = velRef.current * 0.7 + (e.clientX - prevMoveX.current) * 0.3
    prevMoveX.current = e.clientX
    let off = dragStartOffset.current + dx
    const u = unitRef.current
    if (u) { while (off <= -u) off += u; while (off > 0) off -= u }
    offsetRef.current = off
    track.style.transform = `translate3d(${off}px,0,0)`
  }
  const onPointerUp = (e: React.PointerEvent) => {
    isDragging.current = false
    if (hasCapture.current) { try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId) } catch {}; hasCapture.current = false }
    if (dragMoved.current) momentumRef.current = Math.max(-16, Math.min(16, velRef.current * 0.6))
  }
  const onClickCapture = (e: React.MouseEvent) => { if (dragMoved.current) { e.preventDefault(); e.stopPropagation(); dragMoved.current = false } }

  if (!events || events.length === 0) return null

  return (
    <div className={className}>
      <div
        className="w-full cursor-grab select-none overflow-hidden active:cursor-grabbing"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          touchAction: 'pan-y',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        onClickCapture={onClickCapture}
      >
        <div ref={trackRef} className="flex w-max items-center py-1 will-change-transform">
          {[...events, ...events, ...events, ...events].map((e, idx) => (
            <Link
              key={`${e.id}-${idx}`}
              href={e.href}
              draggable={false}
              className="mx-2 inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pl-2 pr-4 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10"
            >
              <span className="grid h-7 w-9 shrink-0 place-items-center">
                {e.clubLogo ? <img src={e.clubLogo} alt="" className="max-h-6 max-w-full object-contain brightness-0 invert pointer-events-none" loading="lazy" /> : <span className="text-[10px] font-black text-white">{e.clubName.slice(0, 3).toUpperCase()}</span>}
              </span>
              <span className="whitespace-nowrap text-sm font-bold text-white">{e.eventName}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
