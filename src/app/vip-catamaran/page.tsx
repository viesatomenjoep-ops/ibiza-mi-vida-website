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
  title: 'VIP Catamaran Cruise Ibiza — Luxury Sailing',
  description:
    'Book a VIP catamaran cruise in Ibiza with Ibiza mi vida. Luxury sailing with catering, open bar, and stunning Mediterranean views. Book via WhatsApp.',
}

const inclusions = [
  'Experienced skipper and crew',
  'Swimming & snorkelling stops',
  'Open bar (beer, wine, soft drinks)',
  'Catering package available',
  'Premium sound system',
  'Sun loungers and shade areas',
]

async function getCatamarans(): Promise<Experience[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .eq('category', 'catamaran')
      .eq('available', true)
      .order('sort_order')
    if (data && data.length > 0) return data
  } catch {
    // fall through
  }
  return FALLBACK_EXPERIENCES['catamaran']
}

export default async function VipCatamaranPage() {
  const [catamarans, pageContent] = await Promise.all([
    getCatamarans(),
    getPageContent('vip-catamaran', {
      title: "VIP Catamaran Cruise Ibiza",
      subtitle: "The most beautiful way to experience Ibiza. Sail in luxury with an open bar, catering, and breathtaking views across the Mediterranean.",
      backgroundImage: "https://images.unsplash.com/photo-1527004611998-0c6fde22b1ca?w=1920&q=85"
    })
  ])

  return (
    <>
      <ProductSchema
        name="VIP Catamaran Cruise Ibiza"
        description="Luxury VIP catamaran cruises around Ibiza. Open bar, catering, swimming stops, and stunning Mediterranean scenery with Ibiza mi vida."
        priceFrom={120}
        url={`${siteUrl}/vip-catamaran`}
      />

      <CategoryHero
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        colorTheme="midnight"
        eyebrow="Luxury Sailing"
        minHeight="min-h-[45vh]"
      />

      {/* Inclusions */}
      <section className="bg-sandstone/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {inclusions.map((item) => (
              <div key={item} className="flex items-center gap-4 font-sans text-lg md:text-xl lg:text-2xl font-medium text-midnight/90">
                <span className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-teal shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <AnimatedSection className="mb-12">
          <SectionHeader eyebrow="Catamaran Experiences" title="Choose your cruise" subtitle="Half-day, full-day, and sunset options available." />
        </AnimatedSection>
        <CategoryGrid columns={3}>
          {catamarans.map((c: Experience) => (
            <CategoryCard
              key={c.id}
              title={c.title}
              tagline={c.tagline ?? undefined}
              imageUrl={c.image_url ?? 'https://images.unsplash.com/photo-1527004611998-0c6fde22b1ca?w=900&q=85'}
              href={`/experiences/${c.slug}`}
              bookingConfig={{ serviceType: 'catamaran', serviceName: c.title, sourcePage: '/vip-catamaran' }}
              badge={c.price_from ? `From €${c.price_from}` : undefined}
            />
          ))}
        </CategoryGrid>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection><CrossSellBanner triggerPage="/vip-catamaran" fromPrice={500} /></AnimatedSection>
      </section>
    </>
  )
}
