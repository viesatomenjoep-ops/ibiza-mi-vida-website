'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Route } from 'lucide-react'
import type { AppLabels } from './i18n'
import { LOCALES } from '@/components/layout/LanguageSelector'

/**
 * Persistent brand header — logo mark + wordmark, always on screen above
 * whichever tab is active (not just Agenda). Sits above TopTabs when Agenda
 * is showing; on other tabs it's the only sticky top bar. Also carries the
 * app's language switcher (/m reads locale from ?lang=, no path segment).
 *
 * Publishes its own rendered height as `--m-header-h` on <html> so TopTabs
 * (nested screens below, not a DOM sibling) can stick directly beneath it
 * instead of both fighting over `top: 0`. Same measure-and-publish pattern
 * as the marketing site's ScrollProgress.tsx.
 */
export function AppHeader({ t, locale, onOpenPlanner }: { t: AppLabels; locale: string; onOpenPlanner: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const router = useRouter()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const current = LOCALES.find(l => l.code === locale) || LOCALES[0]

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const publish = () => document.documentElement.style.setProperty('--m-header-h', `${el.getBoundingClientRect().height}px`)
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!langOpen) return
    const onClick = (e: MouseEvent) => { if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [langOpen])

  const changeLocale = (code: string) => {
    setLangOpen(false)
    if (code === locale) return
    router.push(`/m?lang=${code}`)
  }

  return (
    <header
      ref={ref}
      className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-white/[0.06] bg-obsidian/90 px-4 py-2.5 backdrop-blur-xl"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 10px)' }}
    >
      <span className="flex min-w-0 items-center gap-2">
        <img src="/logo-white.png" alt="" className="h-6 w-6 shrink-0 object-contain opacity-90" />
        <span className="truncate font-display text-[13px] font-black uppercase tracking-[0.14em] text-white">
          {t.brandName}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-1.5">
        {/* Language switcher */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangOpen(o => !o)}
            aria-label="Language"
            aria-expanded={langOpen}
            className="flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white/70 outline-none transition-colors motion-reduce:transition-none hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-95 motion-reduce:active:scale-100"
          >
            {current.label}
            <ChevronDown size={12} className={`transition-transform motion-reduce:transition-none ${langOpen ? 'rotate-180' : ''}`} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-white/10 bg-obsidian-light shadow-2xl">
              <div className="p-1.5">
                {LOCALES.map(loc => (
                  <button
                    key={loc.code}
                    type="button"
                    onClick={() => changeLocale(loc.code)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-bold outline-none transition-colors motion-reduce:transition-none ${
                      loc.code === locale ? 'bg-app-accent text-white' : 'text-white/75 hover:bg-white/[0.08]'
                    }`}
                  >
                    {loc.name}
                    <span className="text-[10px] uppercase tracking-widest opacity-60">{loc.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Planner entry — icon-only to leave room for the language switcher */}
        <button
          type="button"
          onClick={onOpenPlanner}
          aria-label={t.plannerBanner}
          className="grid h-8 w-8 place-items-center rounded-full bg-app-accent/15 text-app-accent-soft outline-none transition-colors motion-reduce:transition-none hover:bg-app-accent/25 focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-95 motion-reduce:active:scale-100"
        >
          <Route size={15} />
        </button>
      </span>
    </header>
  )
}
