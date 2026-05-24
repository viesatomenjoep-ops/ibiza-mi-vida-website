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
import { DealsPreviewWrapper } from '@/components/admin/DealsPreviewWrapper'
import { DealTimer } from '@/components/ui/DealTimer'
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

export default async function DealsOfTheDayPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const isAdminPreview = searchParams.admin_preview === '1'
  const [clubs, allExperiences] = await Promise.all([getClubs(), getAllExperiences()])

  const boatParties = allExperiences.filter(e => e.category === 'boat-party')
  const excursions = allExperiences.filter(e => e.category === 'formentera' || e.category === 'catamaran')
  const drinkPackages = allExperiences.filter(e => e.category === 'drink-packages')

  return (
    <DealsPreviewWrapper isAdminPreview={isAdminPreview}>
      <Hero
        title="Deals of the Day"
        subtitle="Your ultimate overview. Find the best club tickets, boat parties, excursions, and drink packages all in one place."
        backgroundImage="/fotos/deals-of-the-day.webp"
        eyebrow="Special Offers"
        minHeight="min-h-[60vh]"
      />

      {/* DASHBOARD TOP: Deal of the Day vs Deal of the Week */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Deal of the Day Active Banner */}
          <AnimatedSection className="lg:col-span-2">
            <div className="bg-gold/10 border-2 border-gold/30 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              </div>
              <div className="z-10 text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-gold text-midnight text-xs font-bold uppercase tracking-widest rounded-full mb-4">Active Today</div>
                <h2 className="text-3xl md:text-4xl font-serif text-midnight mb-2">Deal of the Day</h2>
                <p className="text-midnight/70 font-sans max-w-md">The best hand-picked offers, strictly valid until midnight. Book now before the timer runs out!</p>
              </div>
              <div className="z-10 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white">
                <DealTimer />
              </div>
            </div>
          </AnimatedSection>

          {/* RIGHT: Deal of the Week */}
          <AnimatedSection className="lg:col-span-1">
            <div className="bg-midnight rounded-3xl p-6 md:p-8 h-full flex flex-col relative overflow-hidden text-sandstone">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-midnight">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gold">Deal of the Week</h3>
                  <p className="text-xs text-sandstone/60 uppercase tracking-wider">Weekly Overview</p>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-3">
                {/* Mock Weekly Events */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white text-sm">Oceanbeat VIP Boat</p>
                    <p className="text-xs text-sandstone/70">Thursday</p>
                  </div>
                  <span className="text-gold font-bold">€89</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white text-sm">Amnesia Balcony</p>
                    <p className="text-xs text-sandstone/70">Friday</p>
                  </div>
                  <span className="text-gold font-bold">€120</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white text-sm">Formentera Trip</p>
                    <p className="text-xs text-sandstone/70">Saturday</p>
                  </div>
                  <span className="text-gold font-bold">€150</span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 transition-colors text-white font-semibold rounded-xl text-sm border border-white/20">
                View Full Calendar
              </button>
            </div>
          </AnimatedSection>
          
        </div>
      </section>

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

      {/* ── Cross-sell banner ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection>
          <CrossSellBanner triggerPage="/deals-of-the-day" fromPrice={500} />
        </AnimatedSection>
      </section>
    </DealsPreviewWrapper>
  )
}
