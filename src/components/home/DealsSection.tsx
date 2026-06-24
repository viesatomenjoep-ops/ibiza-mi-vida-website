'use client'

import { DealTimer } from '@/components/ui/DealTimer'
import { DealDateBanner } from '@/components/ui/DealDateBanner'

export function DealsSection() {
  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8 md:gap-10">
      
      {/* ── Deal of the Day Banner ── */}
      <div className="bg-ibiza-sand rounded-[32px] overflow-hidden flex flex-col shadow-sm border border-black/5">
        <div className="bg-gradient-to-br from-[#00A698] to-teal-900 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <div className="z-10 text-center md:text-left flex-1">
            <DealDateBanner />
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-3 mt-4">Deal of the Day</h2>
            <p className="text-white/80 font-sans text-sm md:text-base max-w-lg">
              The best hand-picked offers across all categories. Book before the timer runs out!
            </p>
          </div>
          <div className="z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shrink-0 shadow-lg">
            <DealTimer />
          </div>
        </div>
      </div>

    </div>
  )
}
