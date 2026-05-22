import type { Metadata } from 'next'
import { Hero } from '@/components/hero/Hero'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'Car & Scooter Rental Ibiza — Cheap Hire from €25',
  description:
    'Rent a car or scooter in Ibiza with Ibiza mi vida. Cheap, reliable, and instant booking via WhatsApp. Explore the island on your own terms from €25/day.',
}

const fleet = [
  { type: 'Scooter 50cc', price: 'From €25/day', ideal: 'Solo or couple · City & beaches · No licence required in most EU countries', emoji: '🛵' },
  { type: 'Scooter 125cc', price: 'From €35/day', ideal: 'Solo or couple · Island-wide · A1 licence or car licence required', emoji: '🛵' },
  { type: 'Small City Car', price: 'From €45/day', ideal: 'Group of 4 · Air-conditioned · Full island access', emoji: '🚗' },
  { type: 'SUV / Family Car', price: 'From €75/day', ideal: 'Group of 5–7 · Comfort · Perfect for Formentera ferry days', emoji: '🚙' },
]

export default function CarScooterRentalPage() {
  return (
    <>
      <Hero
        title="Car & Scooter Rental Ibiza"
        subtitle="Freedom to explore. Rent a scooter or car and discover Ibiza's hidden beaches, mountain villages, and sunset spots at your own pace."
        backgroundImage="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=85"
        eyebrow="Explore Ibiza"
        minHeight="min-h-[65vh]"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <AnimatedSection className="mb-12">
          <SectionHeader eyebrow="Our Fleet" title="Choose your ride" subtitle="Scooters, city cars, and SUVs available daily or weekly. Delivered to your hotel or villa." />
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fleet.map(({ type, price, ideal, emoji }, i) => (
            <AnimatedSection key={type} delay={i * 0.08} className="flex flex-col gap-4 rounded-2xl border border-midnight/10 bg-white p-6 shadow-sm">
              <div className="text-4xl">{emoji}</div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-teal">{price}</p>
                <h3 className="mt-1 font-serif text-xl font-light text-midnight">{type}</h3>
                <p className="mt-2 font-sans text-xs leading-relaxed text-midnight/50">{ideal}</p>
              </div>
              <button className="mt-auto w-full rounded-full bg-teal py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-teal-dark">
                Book Now
              </button>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection><CrossSellBanner triggerPage="/car-scooter-rental" fromPrice={500} /></AnimatedSection>
      </section>
    </>
  )
}
