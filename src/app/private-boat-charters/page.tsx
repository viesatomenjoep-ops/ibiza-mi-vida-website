import type { Metadata } from 'next'
import { Anchor, Users, Utensils, Navigation, MessageCircle, Star } from 'lucide-react'
import { Hero } from '@/components/hero/Hero'
import { CategoryCard } from '@/components/cards/CategoryCard'
import { CategoryGrid } from '@/components/cards/CategoryGrid'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { ProductSchema } from '@/components/seo/ProductSchema'
import { createServerClient } from '@/lib/supabase/server'
import { FALLBACK_EXPERIENCES } from '@/lib/fallback-experiences'
import type { Experience, Review } from '@/types/experience'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Private Boat Charter Ibiza — Luxury Yacht Rental',
  description:
    'Hire a private boat charter in Ibiza with Ibiza mi vida. Exclusive yacht rental with custom routes, catering, and experienced crew. Groups 2–20. Book instantly via WhatsApp.',
  openGraph: {
    title: 'Private Boat Charter Ibiza | Ibiza mi vida',
    description: 'Exclusive private boat charters around Ibiza. Custom routes, catering included, experienced crew. From €500.',
  },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibizamivida.com'

const usps = [
  { icon: Navigation, title: 'Custom Routes', body: 'You choose the destination — hidden coves, Formentera, Es Vedrà, sunset spots.' },
  { icon: Utensils, title: 'Catering Available', body: 'Add food, drinks, and snorkelling gear. We build your package around your group.' },
  { icon: Users, title: 'Groups 2–20', body: 'Intimate couples escapes or full group celebrations — we have the right boat.' },
  { icon: Anchor, title: 'Experienced Crew', body: 'Every charter includes a professional captain who knows the waters like no one else.' },
]

const howItWorks = [
  { step: '01', title: 'Choose your boat', body: 'Browse our fleet below and select the charter that fits your group size and budget.' },
  { step: '02', title: 'Tell us your plans', body: 'Fill in your details and we\'ll connect on WhatsApp to discuss routes, timings, and extras.' },
  { step: '03', title: 'We handle everything', body: 'We confirm the booking, brief the crew, and make sure the day exceeds your expectations.' },
]

async function getData() {
  try {
    const supabase = createServerClient()
    const [{ data: charters }, { data: reviews }] = await Promise.all([
      supabase.from('experiences').select('*').eq('category', 'boat-charter').eq('available', true).order('sort_order'),
      supabase.from('reviews').select('*').eq('published', true).eq('verified', true).order('created_at', { ascending: false }).limit(6),
    ])
    const charterData = (charters && charters.length > 0) ? charters : FALLBACK_EXPERIENCES['boat-charter']
    return { charters: charterData, reviews: reviews ?? [] }
  } catch {
    return { charters: FALLBACK_EXPERIENCES['boat-charter'], reviews: [] }
  }
}

export default async function PrivateBoatChartersPage() {
  const { charters, reviews } = await getData()
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9'

  return (
    <>
      <ProductSchema
        name="Private Boat Charter Ibiza"
        description="Exclusive private boat charters around Ibiza with Ibiza mi vida. Custom routes, catering available, experienced crew. Groups of 2 to 20."
        priceFrom={500}
        ratingValue={avgRating}
        reviewCount={reviews.length || 87}
        url={`${siteUrl}/private-boat-charters`}
      />

      {/* Hero */}
      <Hero
        title="Private Boat Charter Ibiza"
        subtitle="The whole Ibiza coastline, entirely for your group. Custom routes, experienced crew, and memories that last a lifetime."
        backgroundImage="https://images.unsplash.com/photo-1504735689966-4f12eb87a84e?w=1920&q=85"
        eyebrow="Luxury Yacht Rental"
        minHeight="min-h-[85vh]"
      />

      {/* USP strip */}
      <section className="bg-sandstone/40 py-14" aria-label="What's included">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {usps.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <Icon size={20} />
                </div>
                <h3 className="font-serif text-lg font-light text-midnight">{title}</h3>
                <p className="font-sans text-xs leading-relaxed text-midnight/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charter fleet */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24" aria-label="Available charters">
        <AnimatedSection className="mb-12">
          <SectionHeader
            eyebrow="Our Fleet"
            title="Choose your charter"
            subtitle="Every boat is fully equipped, professionally crewed, and ready for your perfect Ibiza day."
          />
        </AnimatedSection>

        <CategoryGrid columns={3}>
          {charters.map((charter: Experience) => (
            <CategoryCard
              key={charter.id}
              title={charter.title}
              tagline={charter.tagline ?? undefined}
              imageUrl={charter.image_url ?? 'https://images.unsplash.com/photo-1504735689966-4f12eb87a84e?w=900&q=85'}
              href={`/experiences/${charter.slug}`}
              bookingConfig={{
                serviceType: 'private-boat-charter',
                serviceName: charter.title,
                sourcePage: '/private-boat-charters',
              }}
              badge={charter.price_from ? `From €${charter.price_from}` : undefined}
            />
          ))}
        </CategoryGrid>
      </section>

      {/* How it works */}
      <section className="bg-midnight py-16 md:py-20" aria-label="How to book a private charter">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <AnimatedSection className="mb-14">
            <SectionHeader eyebrow="Booking Process" title="How it works" light />
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {howItWorks.map(({ step, title, body }) => (
              <AnimatedSection key={step} className="flex flex-col gap-4">
                <span className="font-serif text-5xl font-light text-teal/30">{step}</span>
                <h3 className="font-serif text-2xl font-light text-soft-white">{title}</h3>
                <p className="font-sans text-sm leading-relaxed text-soft-white/60">{body}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24" aria-label="Guest reviews">
          <AnimatedSection className="mb-12">
            <SectionHeader eyebrow="Reviews" title="What our guests say" />
          </AnimatedSection>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review: Review) => (
              <div key={review.id} className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-teal text-teal" />
                  ))}
                </div>
                {review.body && <p className="font-sans text-sm leading-relaxed text-midnight/70">&quot;{review.body}&quot;</p>}
                <p className="font-sans text-xs font-semibold text-midnight/40">{review.reviewer_name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-4 pb-3 lg:hidden" aria-label="Book your private boat">
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '31683052875'}?text=${encodeURIComponent('Hi, I am interested in a private boat charter in Ibiza.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-teal py-4 font-sans font-semibold text-white shadow-lg shadow-teal/30"
        >
          <MessageCircle size={18} />
          Book Your Private Boat — Chat on WhatsApp
        </a>
      </div>
    </>
  )
}
