import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Users, Music, ExternalLink, MessageCircle } from 'lucide-react'
import { CTEventCard } from '@/components/cards/CTEventCard'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { VenueSchema } from '@/components/seo/VenueSchema'
import { getVenues, getVenue, CTVenue } from '@/lib/clubtickets'

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
  const venues = await getVenues('en');
  return venues.map((v) => ({ slug: v.slug }));
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

  const events = club.events || []
  const imageUrl = club.cover || club.picture || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1920&q=85'

  return (
    <>
      {/* Venue schema */}
      <VenueSchema
        name={club.name}
        slug={club.slug}
        description={club.description ? club.description.replace(/<[^>]+>/g, '') : undefined}
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
                <AnimatedSection className="prose prose-velvet max-w-none prose-p:text-velvet-obsidian/70">
                  <h2 className="font-serif text-3xl font-bold text-velvet-obsidian">About {club.name}</h2>
                  <div dangerouslySetInnerHTML={{ __html: club.description }} />
                </AnimatedSection>
              )}

              {/* Events list */}
              <AnimatedSection delay={100} className="flex flex-col gap-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-velvet-obsidian">Events at {club.name}</h2>
                    <p className="mt-2 font-sans text-velvet-obsidian/60">
                      {club.activeEvents || events.length} official events coming up.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <CTEventCard 
                        key={event.id} 
                        event={event} 
                        venueSlug={club.slug} 
                      />
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
