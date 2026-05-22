'use client'

import { Anchor, ArrowRight } from 'lucide-react'
import { useBooking } from '@/context/booking-context'

interface CrossSellBannerProps {
  triggerPage: string
  fromPrice?: number
}

export function CrossSellBanner({ triggerPage, fromPrice = 500 }: CrossSellBannerProps) {
  const { openModal } = useBooking()

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-midnight px-6 py-10 md:px-12 md:py-14"
      aria-label="Private boat charter upgrade"
    >
      {/* Decorative teal accent bar */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-teal" aria-hidden="true" />

      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 50%, #169C90 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Text */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Anchor size={16} className="text-teal" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-teal">
              Upgrade Your Experience
            </span>
          </div>
          <h2 className="font-serif text-3xl font-light leading-tight text-soft-white md:text-4xl">
            Make it exclusive — Private Yacht Charter
          </h2>
          <p className="max-w-xl font-sans text-sm leading-relaxed text-soft-white/60">
            Skip the shared crowds. A private boat gives your group the full Ibiza coastline to
            yourselves — custom route, your own music, your own schedule. Groups of 2–20.
          </p>
          <p className="font-sans text-base font-medium text-driftwood">
            From <span className="text-2xl font-light text-soft-white font-serif">€{fromPrice}</span> per charter
          </p>
        </div>

        {/* CTA */}
        <div className="shrink-0">
          <button
            onClick={() =>
              openModal({
                serviceType: 'private-boat-charter',
                serviceName: 'Private Boat Charter Ibiza',
                sourcePage: triggerPage,
              })
            }
            className="group inline-flex items-center gap-2 rounded-full bg-teal px-7 py-4 font-sans font-semibold text-white transition-all hover:bg-teal-dark hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
            aria-label="Enquire about a private boat charter"
          >
            Enquire Now
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </section>
  )
}
