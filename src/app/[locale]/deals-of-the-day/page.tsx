import type { Metadata } from 'next'
import { CategoryHero } from '@/components/hero/CategoryHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { DealsPreviewWrapper } from '@/components/admin/DealsPreviewWrapper'
import { CalendarModal } from '@/components/ui/CalendarModal'
import { DealsSection } from '@/components/home/DealsSection'
import { getAllDates } from '@/lib/clubtickets'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Star } from 'lucide-react'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Deals of the Day | Ibiza mi vida',
  description: 'Discover the best deals of the day for Ibiza clubs, boat parties, excursions, and drink packages. Book everything in one place.',
}

export default async function DealsOfTheDayPage({
  params,
  searchParams,
}: {
  params: { locale: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const isAdminPreview = searchParams.admin_preview === '1'
  
  // Fetch all upcoming dates
  const allDates = await getAllDates(params.locale)
  
  // Pick 9 random dates to feature as "Deals of the Day"
  // We use a simple seeded random to avoid hydration mismatch if needed,
  // but since this is a server component with revalidate, Math.random() is fine.
  const shuffled = [...allDates].sort(() => 0.5 - Math.random())
  const deals = shuffled.slice(0, 9)

  return (
    <DealsPreviewWrapper isAdminPreview={isAdminPreview}>
      <CategoryHero
        title="Deals of the Day"
        subtitle="De heetste evenementen van dit moment. Boek nu je tickets voor de beste feesten en boat parties op Ibiza."
        colorTheme="rustic-terracotta"
        eyebrow="Special Offers"
      />

      {/* DASHBOARD TOP */}
      <section className="bg-ibiza-sand px-4 pt-2 pb-12 md:pt-12 md:pb-12 md:px-8 -mt-8 md:mt-0 relative z-20">
        <AnimatedSection>
          <DealsSection />
        </AnimatedSection>
        <div className="hidden">
          <CalendarModal />
        </div>
      </section>

      {/* DEALS SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <AnimatedSection className="mb-12">
          <SectionHeader
            eyebrow="Trending Nu"
            title="Exclusieve Deals"
            subtitle="Bekijk onze topkeuzes van vandaag uit alle beschikbare ClubTickets evenementen."
          />
        </AnimatedSection>

        {deals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {deals.map((deal, i) => {
              const dateObj = new Date(deal.date);
              const dateFormatted = dateObj.toLocaleDateString(params.locale, { weekday: 'short', day: 'numeric', month: 'short' });
              
              // Parse price
              let priceNum = 50;
              if (deal.prices) {
                const match = deal.prices.match(/\d+([.,]\d+)?/);
                if (match) priceNum = parseFloat(match[0].replace(',', '.'));
              }

              return (
                <AnimatedSection key={`${deal.id}-${i}`} delay={i * 0.05}>
                  <Link href={`/${params.locale}/club-tickets/${deal.venueSlug}/${deal.eventSlug}`} className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                      {(deal.eventCover || deal.eventLogo || deal.venueCover || deal.venueLogo) ? (
                        <Image 
                          src={deal.eventCover || deal.eventLogo || deal.venueCover || deal.venueLogo || ''} 
                          alt={deal.eventName || deal.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Star size={48} />
                        </div>
                      )}
                      
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md border border-white/10 flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#00A698]" />
                        {dateFormatted}
                      </div>

                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg shadow-md">
                        Hot Deal
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col p-5">
                      <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 group-hover:text-[#00A698] transition-colors line-clamp-2">
                        {deal.eventName || deal.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 mb-4 flex items-center gap-1">
                        <MapPin size={12} /> {deal.venueName || 'Ibiza'}
                      </p>
                      
                      <div className="mt-auto flex justify-between items-end border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                          <Star size={12} fill="#F59E0B" className="text-amber-500" />
                          <span className="text-xs">Trending</span>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Vanaf</div>
                          <div className="font-bold text-slate-900 text-xl">
                            € {priceNum > 0 ? priceNum.toFixed(2) : '50.00'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-velvet-obsidian/50 font-serif text-lg">
            Geen deals beschikbaar op dit moment.
          </div>
        )}
      </section>

      {/* ── Cross-sell banner ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection>
          <CrossSellBanner triggerPage="/deals-of-the-day" fromPrice={500} />
        </AnimatedSection>
      </section>
    </DealsPreviewWrapper>
  )
}
