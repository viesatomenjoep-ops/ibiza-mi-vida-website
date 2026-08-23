'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MoonStar, Radar, Compass, Disc3, Sailboat, KeyRound } from 'lucide-react'
import type { TabId } from './types'
import type { AppLabels } from './i18n'

// Single ordered ring — most-used first. Deliberately avoiding the first,
// most-obvious dictionary icon for each label (Calendar/Search/Ticket are
// what any icon-library search returns first, which is exactly what reads
// as templated): MoonStar for the nightlife-native "Tonight" view, Radar
// for search (ties into the app's tactical/HUD map language instead of a
// generic magnifying glass), Disc3 for events (a record, not a ticket stub
// — every event app uses a ticket icon). Compass and KeyRound already made
// this swap in an earlier pass and stay.
const ITEMS: { id: TabId; icon: typeof Compass; labelKey: keyof AppLabels }[] = [
  { id: 'agenda', icon: MoonStar, labelKey: 'tabAgenda' },
  { id: 'search', icon: Radar, labelKey: 'tabSearch' },
  { id: 'map', icon: Compass, labelKey: 'tabMap' },
  { id: 'events', icon: Disc3, labelKey: 'tabEvents' },
  { id: 'boats', icon: Sailboat, labelKey: 'tabBoats' },
  { id: 'guestlist', icon: KeyRound, labelKey: 'tabGuestlist' },
]
const COUNT = ITEMS.length

const SPRING_LEFT = 'left 320ms cubic-bezier(0.34,1.56,0.64,1)'
const SPRING_BOTH = 'left 320ms cubic-bezier(0.34,1.56,0.64,1), width 320ms cubic-bezier(0.34,1.56,0.64,1)'

/**
 * "Click-wheel" navigation: one floating oval capsule holding all 6 tabs, with
 * a soft glowing puck that glides between them. Three ways to move it:
 *  - tap an icon (instant)
 *  - drag anywhere along the capsule — the puck follows your finger/cursor
 *    continuously and snaps to whichever icon it's nearest, live, like
 *    scrubbing an iPod wheel unrolled into a line; releasing commits
 *  - hover an icon (mouse only) — a light per-icon glow previews it without
 *    moving the puck or committing anything
 * A small label above the capsule travels with the puck, naming whichever
 * tab is currently under it. All position math uses `left` as a percentage
 * of the track's own width (not `transform`, which is relative to the
 * MOVING element's own box and compounds awkwardly with a fixed-px inset) —
 * simpler to keep correct across all 6 slots.
 */
export function BottomNav({ tab, setTab, t }: { tab: TabId; setTab: (t: TabId) => void; t: AppLabels }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const draggingRef = useRef(false)

  // `left: calc(N% + 6px)` on an absolutely-positioned child of a flex
  // container resolves inconsistently in some WebKit builds (computed style
  // collapses to just the px term, dropping the percentage) — measure the
  // track's real width and position the puck/label in plain pixels instead,
  // which every engine resolves the same way.
  const [trackWidth, setTrackWidth] = useState(0)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const update = () => setTrackWidth(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const slotPx = trackWidth / COUNT

  const activeIndex = Math.max(0, ITEMS.findIndex(i => i.id === tab))
  const puckIndex = dragIndex ?? activeIndex

  const indexFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    return Math.min(COUNT - 1, Math.max(0, Math.floor(ratio * COUNT)))
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    draggingRef.current = true
    trackRef.current?.setPointerCapture(e.pointerId)
    setDragIndex(indexFromClientX(e.clientX))
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    setDragIndex(indexFromClientX(e.clientX))
  }
  const endDrag = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragIndex(current => {
      if (current !== null) setTab(ITEMS[current].id)
      return null
    })
  }

  // Keyboard: arrow keys step through tabs when focus is inside the capsule.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = Math.min(COUNT - 1, Math.max(0, activeIndex + (e.key === 'ArrowRight' ? 1 : -1)))
    setTab(ITEMS[next].id)
  }

  const previewLabelKey = ITEMS[puckIndex]?.labelKey

  return (
    <nav aria-label="App" className="fixed inset-x-0 bottom-0 z-40 flex justify-center" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 14px)' }}>
      <div className="relative w-[calc(100%-32px)] max-w-lg">
        {/* Traveling label — glides with the puck, names whichever tab is under it */}
        <div className="pointer-events-none absolute -top-9 left-0 flex w-full" aria-hidden>
          <div
            className="flex justify-center motion-reduce:transition-none"
            style={{ position: 'absolute', left: puckIndex * slotPx, width: slotPx, transition: SPRING_LEFT }}
          >
            <span className="w-max rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/90 backdrop-blur-sm">
              {previewLabelKey ? t[previewLabelKey] : ''}
            </span>
          </div>
        </div>

        {/* The oval capsule */}
        <div
          ref={trackRef}
          role="tablist"
          aria-label="App navigation"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative flex h-16 w-full touch-none items-center rounded-full border border-white/10 bg-obsidian/90 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          {/* Glowing puck */}
          <span
            aria-hidden
            className="absolute top-1.5 bottom-1.5 rounded-full bg-gradient-to-b from-app-accent-soft to-app-accent shadow-[0_0_22px_4px_rgba(185,117,74,0.55)] motion-reduce:transition-none"
            style={{ left: puckIndex * slotPx + 6, width: Math.max(0, slotPx - 12), transition: SPRING_BOTH }}
          />

          {ITEMS.map(({ id, icon: Icon, labelKey }, i) => {
            const isPuck = i === puckIndex
            const isHover = i === hoverIndex
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={t[labelKey]}
                onClick={() => setTab(id)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(current => (current === i ? null : current))}
                onKeyDown={onKeyDown}
                className="relative z-10 flex flex-1 items-center justify-center outline-none"
              >
                <span
                  className={`grid place-items-center rounded-full transition-all duration-200 motion-reduce:transition-none ${
                    isPuck ? 'h-10 w-10 scale-100 text-obsidian' : isHover ? 'h-9 w-9 scale-110 text-white/85' : 'h-9 w-9 scale-100 text-white/40'
                  }`}
                  style={isHover && !isPuck ? { filter: 'drop-shadow(0 0 8px rgba(185,117,74,0.65)) brightness(1.3)' } : undefined}
                >
                  <Icon size={19} strokeWidth={isPuck ? 2.4 : 1.5} />
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
