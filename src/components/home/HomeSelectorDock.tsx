'use client'

import { HOME_CATEGORIES, type CatKey } from './homeCategories'

export function HomeSelectorDock({
  locale,
  selected,
  onSelect,
}: {
  locale: string
  selected: CatKey | null
  onSelect: (key: CatKey) => void
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[55] border-t border-black/10 bg-white/95 shadow-[0_-8px_30px_rgba(0,0,0,0.14)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-4xl px-2 pt-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        <div className="grid grid-cols-5 gap-1.5">
          {HOME_CATEGORIES.map(t => {
            const Icon = t.Icon
            const on = selected === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => onSelect(t.key)}
                aria-pressed={on}
                className={`hdock-tile group flex h-16 flex-col items-center justify-start gap-1 rounded-xl px-1 pt-2 text-center ${on ? 'ring-[3px] ring-ibiza-green ring-offset-1 ring-offset-white' : ''}`}
                style={{ backgroundColor: t.bg, color: t.fg, boxShadow: `0 6px 18px -6px ${t.glow}` }}
              >
                <Icon size={18} strokeWidth={2.4} className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="w-full font-serif text-[10px] font-black uppercase leading-[1.05] tracking-tight sm:text-[11px]">
                  {t.label[locale] || t.label.en}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
