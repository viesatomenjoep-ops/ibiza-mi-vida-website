import type { Metadata } from 'next'
import { CategoryHero } from '@/components/hero/CategoryHero'
import { CategoryCard } from '@/components/cards/CategoryCard'
import { CategoryGrid } from '@/components/cards/CategoryGrid'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { ProductSchema } from '@/components/seo/ProductSchema'
import { createServerClient } from '@/lib/supabase/server'
import { getPageContent } from '@/lib/page-content'
import { FALLBACK_EXPERIENCES } from '@/lib/fallback-experiences'
import type { Experience } from '@/types/experience'

export const revalidate = 60

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibizamivida.com'

export const metadata: Metadata = {
  title: 'Formentera Boat Trip from Ibiza — Day Trips by Boat',
  description:
    'Book a Formentera boat trip from Ibiza with Ibiza mi vida. Pristine beaches, crystal-clear water, and the most beautiful island in the Mediterranean. Book via WhatsApp.',
}

async function getTrips(): Promise<Experience[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .eq('category', 'formentera')
      .eq('available', true)
      .order('sort_order')
    if (data && data.length > 0) return data
  } catch {
    // fall through
  }
  return FALLBACK_EXPERIENCES['formentera']
}

export default async function FormenteraBoatTripsPage() {
  const [trips, pageContent] = await Promise.all([
    getTrips(),
    getPageContent('formentera-boat', {
      title: "Formentera Boat Trips",
      subtitle: "One of the world's most beautiful islands, just a short boat ride from Ibiza. Pristine beaches, turquoise water, and effortless Mediterranean calm.",
      backgroundImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=85"
    })
  ])

  return (
    <>
      <ProductSchema
        name="Formentera Boat Trip from Ibiza"
        description="Day trips by boat from Ibiza to Formentera. Explore pristine beaches, crystal-clear water, and the Mediterranean's most beautiful island with Ibiza mi vida."
        priceFrom={80}
        url={`${siteUrl}/formentera-boat-trips`}
      />

       <div className="min-h-screen text-white pb-20">
      <CategoryHero
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        colorTheme="rustic-terracotta"
        eyebrow="Day Trips from Ibiza"
        minHeight="min-h-[45vh]"
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24 -mt-16 md:-mt-24 relative z-20">
        
        <CategoryGrid columns={3}>
          {trips.map((t: Experience) => (
            <CategoryCard
              key={t.id}
              title={t.title}
              tagline={t.tagline ?? undefined}
              imageUrl={t.image_url ?? 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=85'}
              href={`/experiences/${t.slug}`}
              bookingConfig={{ serviceType: 'formentera', serviceName: t.title, sourcePage: '/formentera-boat-trips' }}
              badge={t.price_from ? `From €${t.price_from}` : undefined}
            />
          ))}
        </CategoryGrid>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection>
          <CrossSellBanner triggerPage="/formentera-boat-trips" fromPrice={600} />
        </AnimatedSection>
      </section>
    </div>
    </>
  )
}
