'use client'

import type { AgendaView } from './types'
import type { AppLabels } from './i18n'

const VIEWS: { id: AgendaView; labelKey: keyof AppLabels }[] = [
  { id: 'calendar', labelKey: 'viewCalendar' },
  { id: 'explore', labelKey: 'viewExplore' },
  { id: 'upcoming', labelKey: 'viewUpcoming' },
]

/** Sticky top segmented tabs inside the Agenda screen (Calendar / Explore / Upcoming). */
export function TopTabs({ view, setView, t }: { view: AgendaView; setView: (v: AgendaView) => void; t: AppLabels }) {
  return (
    <div
      className="sticky z-20 border-b border-white/[0.06] bg-obsidian/85 backdrop-blur-xl"
      style={{ top: 'var(--m-header-h, 52px)' }}
    >
      <div role="tablist" aria-label="Agenda" className="mx-auto flex max-w-lg items-center justify-center gap-2 px-4 py-3">
        {VIEWS.map(({ id, labelKey }) => {
          const active = view === id
          return (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setView(id)}
              className={`relative rounded-full px-5 py-2 text-[13px] font-extrabold uppercase tracking-wide outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-95 motion-reduce:active:scale-100 ${
                active
                  ? 'bg-gold text-white shadow-lg shadow-gold/25'
                  : 'text-white/45 hover:bg-white/[0.06] hover:text-white/80'
              }`}
            >
              {t[labelKey]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
