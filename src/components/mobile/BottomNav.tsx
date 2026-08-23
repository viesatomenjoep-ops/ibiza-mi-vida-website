'use client'

import { CalendarDays, Ticket, Sailboat, Search, Map, ListChecks } from 'lucide-react'
import type { TabId } from './types'
import type { AppLabels } from './i18n'

// Two rows of 3: PRIMARY sits flush at the very bottom (thumb-reach, most
// frequent actions); SECONDARY sits directly above it.
const PRIMARY: { id: TabId; icon: typeof Search; labelKey: keyof AppLabels }[] = [
  { id: 'agenda', icon: CalendarDays, labelKey: 'tabAgenda' },
  { id: 'search', icon: Search, labelKey: 'tabSearch' },
  { id: 'map', icon: Map, labelKey: 'tabMap' },
]
const SECONDARY: { id: TabId; icon: typeof Search; labelKey: keyof AppLabels }[] = [
  { id: 'events', icon: Ticket, labelKey: 'tabEvents' },
  { id: 'boats', icon: Sailboat, labelKey: 'tabBoats' },
  { id: 'guestlist', icon: ListChecks, labelKey: 'tabGuestlist' },
]

function Row({ items, tab, setTab, t, compact = false }: { items: typeof PRIMARY; tab: TabId; setTab: (t: TabId) => void; t: AppLabels; compact?: boolean }) {
  return (
    <div className="grid grid-cols-3">
      {items.map(({ id, icon: Icon, labelKey }) => {
        const active = tab === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-current={active ? 'page' : undefined}
            className={`group flex flex-col items-center gap-1 outline-none transition-colors motion-reduce:transition-none focus-visible:bg-white/5 active:scale-95 motion-reduce:active:scale-100 ${
              compact ? 'py-1.5' : 'py-2.5'
            } ${active ? 'text-gold-soft' : 'text-white/40 hover:text-white/70'}`}
          >
            <span className={`grid place-items-center rounded-full transition-colors motion-reduce:transition-none ${compact ? 'h-6 w-10' : 'h-7 w-11'} ${active ? 'bg-gold/20' : 'bg-transparent group-hover:bg-white/5'}`}>
              <Icon size={compact ? 16 : 19} strokeWidth={active ? 2.4 : 2} />
            </span>
            <span className={`text-[10px] tracking-wide ${active ? 'font-bold' : 'font-medium'}`}>{t[labelKey]}</span>
          </button>
        )
      })}
    </div>
  )
}

/** Fixed glass bottom bar — 6 tabs as two stacked rows of 3. */
export function BottomNav({ tab, setTab, t }: { tab: TabId; setTab: (t: TabId) => void; t: AppLabels }) {
  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-obsidian/85 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-lg">
        <Row items={SECONDARY} tab={tab} setTab={setTab} t={t} compact />
        <div className="mx-4 h-px bg-white/[0.06]" aria-hidden />
        <Row items={PRIMARY} tab={tab} setTab={setTab} t={t} />
      </div>
    </nav>
  )
}
