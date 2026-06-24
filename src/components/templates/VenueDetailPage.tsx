import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Users, Music, ExternalLink, MessageCircle } from 'lucide-react'
import { CTEventCard } from '@/components/cards/CTEventCard'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { VenueSchema } from '@/components/seo/VenueSchema'
import { CTVenue, CTEventDate } from '@/lib/clubtickets'

interface VenueDetailPageProps {
  club: CTVenue;
  allDates: CTEventDate[];
  locale: string;
  basePath: string; // e.g. "club-tickets" or "boat-parties"
}

export function VenueDetailPage({ club, allDates, locale, basePath }: VenueDetailPageProps) {
  const imageUrl = club.cover || club.picture || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1920&q=85'

  // The API now provides clean HTML without <style> blocks.
  // We extract just the text before the promo garbage starts if necessary.
  const cleanDescription = club.description 
    ? club.description.split('.promo-hz')[0].trim()
    : '';

  // Reconstruct unique events from allDates
  const uniqueEventsMap = new Map();
  allDates.forEach(date => {
    if (!uniqueEventsMap.has(date.eventSlug)) {
      uniqueEventsMap.set(date.eventSlug, {
        id: date.eventId,
        name: date.eventName,
        slug: date.eventSlug,
        cover: date.eventCover,
        logo: date.eventLogo,
        startAt: date.date
      });
    }
  });
  const venueEvents = Array.from(uniqueEventsMap.values());

  return (
    <>
      {/* Venue schema */}
      <VenueSchema
        name={club.name}
        slug={club.slug}
        description={club.description ? club.description.replace(/<[^>]+>/g, ' ') : undefined}
        image={club.cover ?? undefined}
      />
      <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A1A]">

      {/* Club hero */}
      <section className="relative flex min-h-[65vh] flex-col justify-end overflow-hidden" aria-label={`${club.name} hero`}>
        <Image
          src={imageUrl}
          alt={club.name}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-[#1A1A1A]/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-32 md:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              {club.type && (
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-rustic-terracotta/50 bg-rustic-terracotta/10 px-4 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-rustic-terracotta">
                  <Music size={12} />
                  {club.type.name}
                </span>
              )}
              {club.isDayClub !== undefined && (
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-blue-500">
                  {club.isDayClub ? 'Daytime' : 'Night'}
                </span>
              )}
            </div>
            <h1 className="font-serif text-5xl font-bold text-[#FAF9F6] md:text-6xl lg:text-7xl">
              {club.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-[#FAF9F6]/50">
              <span className="flex items-center gap-1.5 font-sans text-sm">
                <MapPin size={14} className="text-rustic-terracotta" />
                Ibiza
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <div className="flex flex-col gap-12">
              {/* About */}
              {club.description && (
              <AnimatedSection delay={100}>
                <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-6">About {club.name}</h2>
                <div className="prose prose-lg max-w-none text-[#1A1A1A]/70 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: cleanDescription }} />
                </div>
              </AnimatedSection>
              )}

              {/* Calendar Events List */}
              <AnimatedSection delay={100} className="flex flex-col gap-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">Event Calendar</h2>
                    <p className="font-sans text-[#1A1A1A]/60 mt-2">
                      Upcoming events and parties at {club.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pr-2 rounded-2xl">
                  {venueEvents.length > 0 ? (
                    venueEvents.map((ev, idx) => (
                      <div key={`${ev.slug}-${idx}`} className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                        <CTEventCard event={ev} venueSlug={club.slug} basePath={basePath} />
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#1A1A1A]/20 bg-[#1A1A1A]/5 p-8 text-center">
                      <p className="font-sans text-[#1A1A1A]/60">
                        Er zijn momenteel geen evenementen gepland voor deze locatie.
                      </p>
                    </div>
                  )}
                </div>
              </AnimatedSection>

              {/* Drink Package Promo */}
              <AnimatedSection delay={200} className="rounded-3xl bg-gradient-to-br from-slate-100 to-white border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="rounded-full bg-[#00A698]/10 p-4">
                    <MessageCircle size={32} className="text-[#00A698]" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                    Group Booking?
                  </h3>
                  <p className="font-sans text-[#1A1A1A]/70">
                    Planning a trip with your friends? Contact us on WhatsApp for exclusive VIP tables, drink packages, and group discounts at {club.name}.
                  </p>
                  <a
                    href={`https://wa.me/31612345678?text=Hi, I want to book a VIP experience at ${club.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#25D366]/20"
                  >
                    <MessageCircle size={20} />
                    Chat on WhatsApp
                  </a>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Sidebar: Booking strip */}
          <aside className="lg:col-span-1">
            <AnimatedSection className="sticky top-24">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-serif text-2xl font-bold text-[#1A1A1A]">
                  Book Tickets
                </h3>
                <p className="mb-6 font-sans text-sm leading-relaxed text-[#1A1A1A]/60">
                  Book official {club.name} tickets securely. We partner with ClubTickets to guarantee authentic entry and the best prices.
                </p>

                <a
                  href={club.affLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-4 font-sans font-bold text-white transition-colors hover:bg-[#333]"
                  aria-label={`Buy ${club.name} tickets`}
                >
                  <ExternalLink size={16} />
                  See All Tickets
                </a>

                <div className="mt-6 border-t border-slate-100 pt-6 flex flex-col gap-2 text-center">
                  <p className="font-sans text-xs text-[#1A1A1A]/40">Official Affiliate Partner</p>
                </div>
              </div>
            </AnimatedSection>
          </aside>
        </div>

        {/* Cross-sell */}
        <AnimatedSection className="mt-16">
          <CrossSellBanner triggerPage={`/${basePath}/${club.slug}`} fromPrice={500} />
        </AnimatedSection>
      </div>
      </div>
    </>
  )
}
