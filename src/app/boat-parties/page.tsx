import type { Metadata } from 'next'
import { CategoryHero } from '@/components/hero/CategoryHero'
import { CategoryCard } from '@/components/cards/CategoryCard'
import { CategoryGrid } from '@/components/cards/CategoryGrid'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { createServerClient } from '@/lib/supabase/server'
import { getPageContent } from '@/lib/page-content'
import { FALLBACK_EXPERIENCES } from '@/lib/fallback-experiences'
import type { Experience } from '@/types/experience'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Ibiza Boat Party Tickets — Sunset & Party Cruises',
  description:
    'Book Ibiza boat party tickets with Ibiza mi vida. Sunset cruises, music boat parties, and group celebrations on the Mediterranean. Reserve your spot via WhatsApp.',
}

async function getBoatParties(): Promise<Experience[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .eq('category', 'boat-party')
      .eq('available', true)
      .order('sort_order')
    if (data && data.length > 0) return data
  } catch {
    // fall through
  }
  return FALLBACK_EXPERIENCES['boat-party']
}

export default async function BoatPartiesPage() {
  const [parties, pageContent] = await Promise.all([
    getBoatParties(),
    getPageContent('boat-party', {
      title: "Ibiza Boat Parties",
      subtitle: "Dance on the open sea. Ibiza's best boat parties — sunset cruises, full-day music events, and private group celebrations.",
      backgroundImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=85"
    })
  ])

  return (
    <>
       <div className="bg-white min-h-screen pb-20">
      <CategoryHero
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        colorTheme="rose"
        eyebrow="Party on the Water"
        minHeight="min-h-[45vh]"
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
          {parties.map((party) => (
            <AnimatedSection key={party.id} delay={0.05}>
              <CategoryCard
                title={party.title}
                tagline={party.tagline ?? undefined}
                imageUrl={
                  party.image_url ??
                  'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=900&q=85'
                }
                href={`/experiences/${party.slug}`}
                bookingConfig={{
                  serviceType: 'boat-party',
                  serviceName: party.title,
                  sourcePage: '/boat-parties',
                }}
                badge={party.price_from ? `From €${party.price_from}` : undefined}
              />
            </AnimatedSection>
          ))}
        </CategoryGrid>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection>
          <CrossSellBanner triggerPage="/boat-parties" fromPrice={500} />
        </AnimatedSection>
      </section>
    </div>
    </>
  )
}
