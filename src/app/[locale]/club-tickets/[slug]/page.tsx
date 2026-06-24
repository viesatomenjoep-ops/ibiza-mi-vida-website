import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Users, Music, ExternalLink, MessageCircle } from 'lucide-react'
import { CTEventCard } from '@/components/cards/CTEventCard'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { VenueSchema } from '@/components/seo/VenueSchema'
import { getVenues, getVenue, CTVenue, getEvent, getAllDates } from '@/lib/clubtickets'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

async function fetchVenueData(slug: string): Promise<CTVenue | null> {
  const venues = await getVenues('en');
  const venueRef = venues.find(v => v.slug === slug);
  if (!venueRef) return null;
  const fullVenue = await getVenue(venueRef.id, 'en');
  return fullVenue;
}

export async function generateStaticParams() {
  // Return empty array to generate pages on-demand and prevent Vercel build timeouts from API rate limiting
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const club = await fetchVenueData(params.slug)
  if (!club) return { title: 'Club Not Found | Ibiza mi vida' }

  return {
    title: `${club.name} Ibiza Tickets 2026`,
    description: club.description ? club.description.replace(/<[^>]+>/g, '').substring(0, 160) : `Buy ${club.name} tickets in Ibiza. Browse upcoming events at ${club.name}.`,
    openGraph: {
      title: `${club.name} Ibiza Tickets 2026 | Ibiza mi vida`,
      description: `Upcoming events and tickets for ${club.name} Ibiza.`,
      images: club.cover ? [{ url: club.cover, width: 1200, height: 630 }] : undefined,
    },
  }
}

export default async function ClubDetailPage({ params }: Props) {
  const club = await fetchVenueData(params.slug)
  if (!club) notFound()

  // Fetch dates directly from cache
  const allDatesGlobal = await getAllDates()
  const allDates = allDatesGlobal.filter(d => d.venueSlug === club.slug)
  
  // Sort chronologically
  allDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const imageUrl = club.cover || club.picture || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1920&q=85'

  // The API returns raw HTML with CSS for their promo banners. Sometimes without even <style> tags! 
  // We extract just the plain text before the promo garbage starts.
  const cleanDescription = club.description 
    ? club.description.split('.promo-hz')[0]
                      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim()
    : '';

  return (
    <>
      {/* Venue schema */}
      <VenueSchema
        name={club.name}
        slug={club.slug}
        description={cleanDescription || undefined}
        image={club.cover ?? undefined}
      />

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
        <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian via-velvet-obsidian/50 to-velvet-obsidian/20" />

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
                  {club.isDayClub ? 'Day Club' : 'Night Club'}
                </span>
              )}
            </div>
            <h1 className="font-serif text-5xl font-bold text-ibiza-sand md:text-6xl lg:text-7xl">
              {club.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-ibiza-sand/50">
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
                <h2 className="font-serif text-3xl font-bold text-velvet-obsidian mb-6">About {club.name}</h2>
                <div className="prose prose-lg max-w-none text-velvet-obsidian/70">
                  <p>{cleanDescription}</p>
                </div>
              </AnimatedSection>
              )}

              {/* Calendar Events List */}
              <AnimatedSection delay={100} className="flex flex-col gap-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-velvet-obsidian">Event Calendar</h2>
                    <p className="mt-2 font-sans text-velvet-obsidian/60">
                      All upcoming parties at {club.name}. Book your tickets securely.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 max-h-[800px] overflow-y-auto pr-2 rounded-2xl" style={{ scrollbarWidth: 'thin' }}>
                  {allDates.length > 0 ? (
                    allDates.map((dateObj, idx) => (
                      <div key={`${dateObj.id}-${idx}`} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-velvet-obsidian/10 rounded-2xl bg-white transition-all hover:border-velvet-obsidian/30 hover:shadow-md">
                        <div className="flex flex-col">
                          <span className="font-serif text-xl font-bold text-velvet-obsidian group-hover:text-blue-600 transition-colors">
                            {dateObj.eventName}
                          </span>
                          <span className="text-sm text-velvet-obsidian/60 font-medium mt-1 flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs uppercase tracking-wider font-bold">
                              {new Date(dateObj.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            {new Date(dateObj.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                          <span className="font-bold text-lg text-velvet-obsidian">
                            {dateObj.prices ? `From ${dateObj.prices}` : 'Available'}
                          </span>
                          <a 
                            href={dateObj.affLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-black text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-gray-800 hover:scale-105 whitespace-nowrap shadow-sm"
                          >
                            Buy Tickets
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-velvet-obsidian/20 bg-velvet-obsidian/5 p-8 text-center">
                      <p className="font-sans text-velvet-obsidian/60">
                        No upcoming events found for this venue yet.
                      </p>
                    </div>
                  )}
                </div>
              </AnimatedSection>

              {/* Drink Package Promo */}
              <AnimatedSection delay={200} className="mt-8">
                <div className="flex flex-col md:flex-row bg-white border border-velvet-obsidian/10 rounded-3xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
                  <div className="relative flex-1 min-h-[220px] md:min-h-full">
                    <Image 
                      src={imageUrl} 
                      alt={`Drink packages for ${club.name}`} 
                      fill 
                      className="object-cover" 
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 bg-[#B0EED0] text-[#151515] px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm">
                      SPECIAL ONLINE OFFER
                    </div>
                  </div>
                  <div className="flex-[1.5] p-6 md:p-8 flex flex-col justify-center gap-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-velvet-obsidian leading-tight">
                      Saving pack 5 drinks in {club.name}
                    </h3>
                    <p className="text-sm md:text-base text-velvet-obsidian/60 leading-relaxed">
                      Buy now your 5 drinks package in {club.name} and save up to 30€. Drink packages are valid for all regular events.
                    </p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-lg text-[#DC143C] line-through opacity-70">130€</span>
                      <span className="text-3xl font-bold text-velvet-obsidian">99.99€</span>
                    </div>
                    <a 
                      href={club.affLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-fit px-6 py-3 bg-velvet-obsidian text-white rounded-xl font-semibold text-sm md:text-base transition-colors hover:bg-gray-800 mt-2"
                    >
                      Buy Drink Package
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Sidebar: Booking strip */}
          <aside className="lg:col-span-1">
            <AnimatedSection className="sticky top-24">
              <div className="rounded-2xl border border-velvet-obsidian/10 bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-serif text-2xl font-bold text-velvet-obsidian">
                  Book Tickets
                </h3>
                <p className="mb-6 font-sans text-sm leading-relaxed text-velvet-obsidian/60">
                  Book official {club.name} tickets securely. We partner with ClubTickets to guarantee authentic entry and the best prices.
                </p>

                <a
                  href={club.affLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 font-sans font-semibold text-white transition-colors hover:bg-gray-800"
                  aria-label={`Buy ${club.name} tickets`}
                >
                  <ExternalLink size={16} />
                  See All Tickets
                </a>

                <div className="mt-6 border-t border-velvet-obsidian/10 pt-6 flex flex-col gap-2 text-center">
                  <p className="font-sans text-xs text-velvet-obsidian/40">Official Affiliate Partner</p>
                </div>
              </div>
            </AnimatedSection>
          </aside>
        </div>

        {/* Cross-sell */}
        <AnimatedSection className="mt-16">
          <CrossSellBanner triggerPage={`/club-tickets/${club.slug}`} fromPrice={500} />
        </AnimatedSection>
      </div>
    </>
  )
}
