import type { Metadata } from 'next'
import Link from 'next/link'
import { CategoryHero } from '@/components/hero/CategoryHero'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { ArrowRight } from 'lucide-react'
import { getPageContent } from '@/lib/page-content'

export const metadata: Metadata = {
  title: 'Car & Scooter Rental Ibiza — Cheap Hire from €25',
  description:
    'Rent a car or scooter in Ibiza with Ibiza mi vida. Cheap, reliable, and instant booking via WhatsApp. Explore the island on your own terms from €25/day.',
}

const fleet = [
  {
    type: 'Scooter 50cc',
    price: 'From €25/day',
    ideal: 'Solo or couple · City & beaches · No licence required in most EU countries',
    emoji: '🛵',
    href: '/experiences/scooter-rental-ibiza',
  },
  {
    type: 'Scooter 125cc',
    price: 'From €35/day',
    ideal: 'Solo or couple · Island-wide · A1 licence or car licence required',
    emoji: '🛵',
    href: '/experiences/scooter-rental-ibiza',
  },
  {
    type: 'Small City Car',
    price: 'From €45/day',
    ideal: 'Group of 4 · Air-conditioned · Full island access',
    emoji: '🚗',
    href: '/experiences/car-rental-ibiza',
  },
  {
    type: 'SUV / Family Car',
    price: 'From €75/day',
    ideal: 'Group of 5–7 · Comfort · Perfect for Formentera ferry days',
    emoji: '🚙',
    href: '/experiences/car-rental-ibiza',
  },
]

export default async function CarScooterRentalPage() {
  const pageContent = await getPageContent('car-scooter', {
    title: "Car & Scooter Rental Ibiza",
    subtitle: "Freedom to explore. Rent a scooter or car and discover Ibiza's hidden beaches, mountain villages, and sunset spots at your own pace.",
    backgroundImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=85"
  })

  return (
    <>
       <div className="min-h-screen text-white pb-20">
      <CategoryHero
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        colorTheme="rose"
        eyebrow="Explore Ibiza"
        minHeight="min-h-[45vh]"
      />

      <section className="mx-auto max-w-7xl px-4 pt-8 pb-16 md:px-8 md:pb-24 mt-8 bg-ibiza-sand/90 backdrop-blur-md rounded-3xl relative z-20 border border-white/50 shadow-xl">
        

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fleet.map(({ type, price, ideal, emoji, href }, i) => (
            <AnimatedSection key={type} delay={i * 0.08}>
              <Link
                href={href}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-velvet-obsidian/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="text-4xl">{emoji}</div>
                <div className="flex-1">
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-rustic-terracotta">
                    {price}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-light text-velvet-obsidian">{type}</h3>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-velvet-obsidian/50">{ideal}</p>
                </div>
                <span className="flex items-center justify-center gap-1.5 rounded-full bg-rustic-terracotta py-2.5 font-sans text-sm font-semibold text-white transition-colors group-hover:bg-rustic-terracotta/90">
                  View Details
                  <ArrowRight size={14} />
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection>
          <CrossSellBanner triggerPage="/car-scooter-rental" fromPrice={500} />
        </AnimatedSection>
      </section>
    </div>
    </>
  )
}
