import type { Metadata } from 'next'
import { Hero } from '@/components/hero/Hero'
import { ClubCard } from '@/components/cards/ClubCard'
import { CategoryCard } from '@/components/cards/CategoryCard'
import { CategoryGrid } from '@/components/cards/CategoryGrid'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { createServerClient } from '@/lib/supabase/server'
import { FALLBACK_EXPERIENCES } from '@/lib/fallback-experiences'
import type { Club } from '@/types/club'
import type { Experience } from '@/types/experience'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Deals of the Day | Ibiza mi vida',
  description: 'Discover the best deals of the day for Ibiza clubs, boat parties, excursions, and drink packages. Book everything in one place instantly via WhatsApp.',
}

async function getClubs(): Promise<Club[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('clubs')
      .select('*')
      .eq('active', true)
      .order('sort_order')
    return data ?? []
  } catch {
    return []
  }
}

async function getAllExperiences(): Promise<Experience[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .eq('available', true)
      .order('sort_order')
    if (data && data.length > 0) return data
  } catch {
    // fall through
  }
  
  // Combine all fallbacks just in case
  return [
    ...(FALLBACK_EXPERIENCES['boat-party'] ?? []),
    ...(FALLBACK_EXPERIENCES['formentera'] ?? []),
    ...(FALLBACK_EXPERIENCES['drink-packages'] ?? [])
  ]
}

export default async function DealsOfTheDayPage() {
  const [clubs, allExperiences] = await Promise.all([getClubs(), getAllExperiences()])

  const boatParties = allExperiences.filter(e => e.category === 'boat-party')
  const excursions = allExperiences.filter(e => e.category === 'formentera' || e.category === 'catamaran')
  const drinkPackages = allExperiences.filter(e => e.category === 'drink-packages')

  return (
    <>
      <Hero
        title="Deals of the Day"
        subtitle="Your ultimate overview. Find the best club tickets, boat parties, excursions, and drink packages all in one place."
        backgroundImage="/fotos/deals-of-the-day.webp"
        eyebrow="Special Offers"
        minHeight="min-h-[60vh]"
      />

      {/* BOAT PARTIES SECTION */}
      {boatParties.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <AnimatedSection className="mb-12">
            <SectionHeader
              eyebrow="On the Water"
              title="Boat Parties"
              subtitle="Dance on the open sea with the best boat parties of the day."
            />
          </AnimatedSection>

          <CategoryGrid columns={3}>
            {boatParties.map((party, i) => (
              <AnimatedSection key={party.id || i} delay={i * 0.05}>
                <CategoryCard
                  title={party.title}
                  tagline={party.tagline ?? undefined}
                  imageUrl={party.image_url ?? 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=900&q=85'}
                  href={`/experiences/${party.slug}`}
                  bookingConfig={{
                    serviceType: party.category,
                    serviceName: party.title,
                    sourcePage: '/deals-of-the-day',
                  }}
                  badge={party.price_from ? `From €${party.price_from}` : undefined}
                />
              </AnimatedSection>
            ))}
          </CategoryGrid>
        </section>
      )}

      {/* CLUBS SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 bg-sandstone/20 rounded-3xl mb-16">
        <AnimatedSection className="mb-12">
          <SectionHeader
            eyebrow="Nightlife"
            title="Club Tickets"
            subtitle="The biggest venues and the best DJs in Ibiza."
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
          <div className="text-center py-12 text-midnight/50 font-serif text-lg">
            No clubs available at the moment.
          </div>
        )}
      </section>

      {/* EXCURSIONS SECTION */}
      {excursions.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <AnimatedSection className="mb-12">
            <SectionHeader
              eyebrow="Explore Ibiza"
              title="Excursions & Trips"
              subtitle="Discover hidden gems, beautiful beaches, and luxury catamarans."
            />
          </AnimatedSection>

          <CategoryGrid columns={3}>
            {excursions.map((exp, i) => (
              <AnimatedSection key={exp.id || i} delay={i * 0.05}>
                <CategoryCard
                  title={exp.title}
                  tagline={exp.tagline ?? undefined}
                  imageUrl={exp.image_url ?? 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=85'}
                  href={`/experiences/${exp.slug}`}
                  bookingConfig={{
                    serviceType: exp.category,
                    serviceName: exp.title,
                    sourcePage: '/deals-of-the-day',
                  }}
                  badge={exp.price_from ? `From €${exp.price_from}` : undefined}
                />
              </AnimatedSection>
            ))}
          </CategoryGrid>
        </section>
      )}

      {/* DRINK PACKAGES SECTION */}
      {drinkPackages.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 bg-teal/5 rounded-3xl mb-16">
          <AnimatedSection className="mb-12">
            <SectionHeader
              eyebrow="VIP Service"
              title="Drink Packages"
              subtitle="Elevate your experience with exclusive drink packages and VIP tables."
            />
          </AnimatedSection>

          <CategoryGrid columns={3}>
            {drinkPackages.map((exp, i) => (
              <AnimatedSection key={exp.id || i} delay={i * 0.05}>
                <CategoryCard
                  title={exp.title}
                  tagline={exp.tagline ?? undefined}
                  imageUrl={exp.image_url ?? 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=85'}
                  href={`/experiences/${exp.slug}`}
                  bookingConfig={{
                    serviceType: exp.category,
                    serviceName: exp.title,
                    sourcePage: '/deals-of-the-day',
                  }}
                  badge={exp.price_from ? `From €${exp.price_from}` : undefined}
                />
              </AnimatedSection>
            ))}
          </CategoryGrid>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection>
          <CrossSellBanner triggerPage="/deals-of-the-day" fromPrice={500} />
        </AnimatedSection>
      </section>
    </>
  )
}
