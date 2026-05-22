import type { Metadata } from 'next'
import { Hero } from '@/components/hero/Hero'
import { CategoryCard } from '@/components/cards/CategoryCard'
import { CategoryGrid } from '@/components/cards/CategoryGrid'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { EventSchema } from '@/components/seo/EventSchema'
import { createServerClient } from '@/lib/supabase/server'
import type { Experience } from '@/types/experience'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Ibiza Boat Party Tickets — Sunset & Party Cruises',
  description:
    'Book Ibiza boat party tickets with Ibiza mi vida. Sunset cruises, music boat parties, and group celebrations on the Mediterranean. Reserve your spot via WhatsApp.',
}

async function getBoatParties(): Promise<Experience[]> {
  const supabase = createServerClient()
  const { data } = await supabase.from('experiences').select('*').eq('category', 'boat-party').eq('available', true).order('sort_order')
  return data ?? []
}

export default async function BoatPartiesPage() {
  const parties = await getBoatParties()

  return (
    <>
      <Hero
        title="Ibiza Boat Parties"
        subtitle="Dance on the open sea. Ibiza's best boat parties — sunset cruises, full-day music events, and private group celebrations."
        backgroundImage="https://images.unsplash.com/photo-1520759941054-c7a4e3fde7d3?w=1920&q=85"
        eyebrow="Party on the Water"
        minHeight="min-h-[70vh]"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <AnimatedSection className="mb-12">
          <SectionHeader
            eyebrow="Upcoming Parties"
            title="Choose your boat party"
            subtitle="From sunset cocktail cruises to full-day music events — the Mediterranean is your dancefloor."
          />
        </AnimatedSection>

        <CategoryGrid columns={3}>
          {parties.length > 0
            ? parties.map((party: Experience) => (
                <CategoryCard
                  key={party.id}
                  title={party.title}
                  tagline={party.tagline ?? undefined}
                  imageUrl={party.image_url ?? 'https://images.unsplash.com/photo-1520759941054-c7a4e3fde7d3?w=900&q=85'}
                  bookingConfig={{ serviceType: 'boat-party', serviceName: party.title, sourcePage: '/boat-parties' }}
                  badge={party.price_from ? `From €${party.price_from}` : undefined}
                />
              ))
            : [
                { title: 'Sunset Cruise', tagline: '3 hrs · DJ · Open bar · From €65', badge: 'From €65' },
                { title: 'Full Day Party', tagline: '8 hrs · Multiple DJs · Lunch · From €120', badge: 'From €120' },
                { title: 'Private Group Party', tagline: 'Your crew · Your music · From €400', badge: 'From €400' },
              ].map((c) => (
                <CategoryCard
                  key={c.title}
                  title={c.title}
                  tagline={c.tagline}
                  imageUrl="https://images.unsplash.com/photo-1520759941054-c7a4e3fde7d3?w=900&q=85"
                  bookingConfig={{ serviceType: 'boat-party', serviceName: c.title, sourcePage: '/boat-parties' }}
                  badge={c.badge}
                />
              ))}
        </CategoryGrid>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection>
          <CrossSellBanner triggerPage="/boat-parties" fromPrice={500} />
        </AnimatedSection>
      </section>
    </>
  )
}
