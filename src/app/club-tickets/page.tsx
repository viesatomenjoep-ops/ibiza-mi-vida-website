import type { Metadata } from 'next'
import { Hero } from '@/components/hero/Hero'
import { ClubCard } from '@/components/cards/ClubCard'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { createServerClient } from '@/lib/supabase/server'
import type { Club } from '@/types/club'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Ibiza Club Tickets — Book All Ibiza Venues',
  description:
    'Buy Ibiza club tickets for Pacha, Amnesia, Hi Ibiza, Ushaia and more. Browse upcoming events at every venue and book instantly via WhatsApp with Ibiza mi vida.',
}

const howItWorks = [
  { step: '01', title: 'Pick your club', body: 'Browse all 14 of Ibiza\'s best venues below and click through to see upcoming events.' },
  { step: '02', title: 'Fill your details', body: 'Leave your name and email so we can confirm your booking and keep you updated.' },
  { step: '03', title: 'We confirm via WhatsApp', body: 'We\'ll send your tickets and all event info directly on WhatsApp. Fast and simple.' },
]

async function getClubs(): Promise<Club[]> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('clubs')
    .select('*')
    .eq('active', true)
    .order('sort_order')
  return data ?? []
}

export default async function ClubTicketsPage() {
  const clubs = await getClubs()

  return (
    <>
      <Hero
        title="Ibiza Club Tickets"
        subtitle="From Pacha to Amnesia, Hi Ibiza to Ushaia — browse every venue, every event, and book your tickets instantly via WhatsApp."
        backgroundImage="https://images.unsplash.com/photo-1571266028243-e4d811c95a1f?w=1920&q=85"
        eyebrow="All Ibiza Venues"
        minHeight="min-h-[70vh]"
      />

      {/* How it works */}
      <section className="bg-sandstone/40 py-14" aria-label="How to book club tickets">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {howItWorks.map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-2">
                <span className="font-serif text-4xl font-light text-teal/40">{step}</span>
                <h3 className="font-serif text-xl font-light text-midnight">{title}</h3>
                <p className="font-sans text-sm leading-relaxed text-midnight/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Club grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24" aria-label="Ibiza clubs and venues">
        <AnimatedSection className="mb-12">
          <SectionHeader
            eyebrow="All Venues"
            title="Choose your club"
            subtitle="14 of Ibiza's finest venues. Click any club to see upcoming events."
          />
        </AnimatedSection>

        {clubs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {clubs.map((club, i) => (
              <AnimatedSection key={club.id} delay={i * 0.04}>
                <ClubCard club={club} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          /* Placeholder grid while DB is seeded */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {[
              'Amnesia', 'Pacha Ibiza', 'Hi Ibiza', 'Ushaia',
              'Universe', 'O Beach', 'Ibiza Rocks', 'Es Paradis',
              'Eden', 'Playa Soleil', 'Bam-Bu-Ku', 'Chinois',
              '528 Ibiza', 'Swag Ibiza', 'Lío',
            ].map((name) => (
              <div
                key={name}
                className="flex min-h-[400px] items-end rounded-3xl bg-midnight/10 p-6"
              >
                <p className="font-serif text-2xl text-midnight/30">{name}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cross-sell */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection>
          <CrossSellBanner triggerPage="/club-tickets" fromPrice={500} />
        </AnimatedSection>
      </section>
    </>
  )
}
