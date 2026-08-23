'use client'

import { useLayoutEffect, useRef } from 'react'
import type { AppLabels } from './i18n'

/**
 * Persistent brand header — logo mark + wordmark, always on screen above
 * whichever tab is active (not just Agenda). Sits above TopTabs when Agenda
 * is showing; on other tabs it's the only sticky top bar.
 *
 * Publishes its own rendered height as `--m-header-h` on <html> so TopTabs
 * (nested screens below, not a DOM sibling) can stick directly beneath it
 * instead of both fighting over `top: 0`. Same measure-and-publish pattern
 * as the marketing site's ScrollProgress.tsx.
 */
export function AppHeader({ t, onOpenPlanner }: { t: AppLabels; onOpenPlanner: () => void }) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const publish = () => document.documentElement.style.setProperty('--m-header-h', `${el.getBoundingClientRect().height}px`)
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <header
      ref={ref}
      className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-obsidian/90 px-4 py-2.5 backdrop-blur-xl"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 10px)' }}
    >
      <span className="flex items-center gap-2">
        <img src="/logo-white.png" alt="" className="h-6 w-6 object-contain opacity-90" />
        <span className="font-display text-[13px] font-black uppercase tracking-[0.14em] text-white">
          {t.brandName}
        </span>
      </span>
      <button
        type="button"
        onClick={onOpenPlanner}
        className="rounded-full bg-gold/15 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-gold-soft outline-none transition-colors motion-reduce:transition-none hover:bg-gold/25 focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-95 motion-reduce:active:scale-100"
      >
        {t.plannerBanner}
      </button>
    </header>
  )
}
