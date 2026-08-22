'use client'

import { CalendarDays, Ticket, Search, Map, ListChecks } from 'lucide-react'
import type { TabId } from './types'
import type { AppLabels } from './i18n'

const ITEMS: { id: TabId; icon: typeof Search; labelKey: keyof AppLabels }[] = [
  { id: 'agenda', icon: CalendarDays, labelKey: 'tabAgenda' },
  { id: 'events', icon: Ticket, labelKey: 'tabEvents' },
  { id: 'search', icon: Search, labelKey: 'tabSearch' },
  { id: 'map', icon: Map, labelKey: 'tabMap' },
  { id: 'guestlist', icon: ListChecks, labelKey: 'tabGuestlist' },
]

/** Fixed glass bottom bar — the app's primary navigation. */
export function BottomNav({ tab, setTab, t }: { tab: TabId; setTab: (t: TabId) => void; t: AppLabels }) {
  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-obsidian/85 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {ITEMS.map(({ id, icon: Icon, labelKey }) => {
          const active = tab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={active ? 'page' : undefined}
              className={`group flex flex-col items-center gap-1 py-2.5 outline-none transition-colors motion-reduce:transition-none focus-visible:bg-white/5 active:scale-95 motion-reduce:active:scale-100 ${
                active ? 'text-gold-soft' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span className={`grid h-7 w-11 place-items-center rounded-full transition-colors motion-reduce:transition-none ${active ? 'bg-gold/20' : 'bg-transparent group-hover:bg-white/5'}`}>
                <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              </span>
              <span className={`text-[10px] tracking-wide ${active ? 'font-bold' : 'font-medium'}`}>{t[labelKey]}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
