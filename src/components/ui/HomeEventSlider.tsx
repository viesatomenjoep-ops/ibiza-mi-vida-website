'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import type { PickerEvent } from '@/components/events/EventPickerWheel'

type LiveEvent = { name: string; slug?: string }
type LiveRecord = { today: LiveEvent[]; lastNight: LiveEvent[]; isDayClub: boolean }
type Status = 'green' | 'orange' | 'red' | null

const DOT_COLORS: Record<Exclude<Status, null>, string> = { green: '#22e07a', orange: '#ff9f1c', red: '#ff3b3b' }
const LEGEND: Record<string, { live: string; tonight: string; last: string }> = {
  en: { live: 'Live now on Ibiza', tonight: 'Party today', last: 'Last-minute entry' },
  nl: { live: 'Nu live op Ibiza', tonight: 'Feest vandaag', last: 'Last-minute entree' },
  de: { live: 'Jetzt live auf Ibiza', tonight: 'Party heute', last: 'Last-Minute-Einlass' },
  es: { live: 'En directo en Ibiza', tonight: 'Fiesta hoy', last: 'Entrada de última hora' },
  fr: { live: 'En direct à Ibiza', tonight: 'Fête aujourd’hui', last: 'Entrée de dernière minute' },
}

function computeStatus(live: LiveRecord | undefined, now: Date): Status {
  if (!live) return null
  const h = now.getHours() + now.getMinutes() / 60
  const todayCount = live.today.length
  if (live.isDayClub) {
    if (todayCount === 0) return null
    if (h < 14) return 'green'
    if (h < 21) return 'orange'
    if (h < 23) return 'red'
    return null
  }
  if (h < 6 && live.lastNight.length > 0) return h < 3 ? 'orange' : 'red'
  if (todayCount > 0) return h >= 23 ? 'orange' : 'green'
  return null
}

/**
 * Horizontal marquee of live ClubTickets events — just the club logo + event name
 * (no card behind it), each with a live status dot. Auto-scrolls, draggable by
 * thumb/mouse, taps through to the event page. Vertical swipes still scroll the page.
 */
export function HomeEventSlider({
  events,
  liveByClub,
  locale = 'nl',
  showLegend = false,
  className = 'w-full relative z-20 bg-transparent py-2',
  speed = 0.7,
}: {
  events: PickerEvent[]
  liveByClub?: Record<string, LiveRecord>
  locale?: string
  showLegend?: boolean
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
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => { setNow(new Date()); const id = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(id) }, [])

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
  const L = LEGEND[locale] || LEGEND.en
  const hasTracker = !!liveByClub && Object.keys(liveByClub).length > 0

  return (
    <div className={className}>
      <style>{`@keyframes hesPing{75%,100%{transform:scale(2.2);opacity:0}}.hes-ping{animation:hesPing 1.4s cubic-bezier(0,0,.2,1) infinite}`}</style>

      {showLegend && hasTracker && (
        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-white/70 md:text-[11px]">
          <span className="flex items-center gap-1.5 text-white/90"><span className="inline-flex h-2 w-2 rounded-full" style={{ background: DOT_COLORS.orange }} /> {L.live}</span>
          <span className="flex items-center gap-1.5"><span className="inline-flex h-2 w-2 rounded-full" style={{ background: DOT_COLORS.green }} /> {L.tonight}</span>
          <span className="flex items-center gap-1.5"><span className="inline-flex h-2 w-2 rounded-full" style={{ background: DOT_COLORS.red }} /> {L.last}</span>
        </div>
      )}

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
          {[...events, ...events, ...events, ...events].map((e, idx) => {
            const status = hasTracker && now ? computeStatus(liveByClub![e.clubSlug], now) : null
            return (
              <Link
                key={`${e.id}-${idx}`}
                href={e.href}
                draggable={false}
                className="mx-3 inline-flex shrink-0 items-center gap-2.5 opacity-90 transition-opacity hover:opacity-100 md:mx-4"
              >
                <span className="relative inline-flex h-7 w-9 shrink-0 items-center justify-center">
                  {status && (
                    <span className="absolute -right-1 -top-1 z-10 flex h-2.5 w-2.5">
                      {status !== 'green' && <span className="hes-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: DOT_COLORS[status] }} />}
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full ring-1 ring-black/30" style={{ background: DOT_COLORS[status] }} />
                    </span>
                  )}
                  {e.clubLogo ? <img src={e.clubLogo} alt="" className="pointer-events-none max-h-6 max-w-full object-contain brightness-0 invert" loading="lazy" /> : <span className="text-[10px] font-black text-white">{e.clubName.slice(0, 3).toUpperCase()}</span>}
                </span>
                <span className="whitespace-nowrap text-sm font-bold text-white drop-shadow">{e.eventName}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
