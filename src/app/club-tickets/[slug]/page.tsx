import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Users, Music, ExternalLink, MessageCircle } from 'lucide-react'
import { EventCard } from '@/components/cards/EventCard'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { EventSchema } from '@/components/seo/EventSchema'
import { VenueSchema } from '@/components/seo/VenueSchema'
import { createServerClient } from '@/lib/supabase/server'
import { FALLBACK_CLUB_EVENTS } from '@/lib/fallback-club-events'
import type { Club, ClubEvent } from '@/types/club'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

async function getClub(slug: string): Promise<Club | null> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('clubs').select('*').eq('slug', slug).eq('active', true).single()
    return data ?? null
  } catch {
    return null
  }
}

async function getUpcomingEvents(clubId: string, clubSlug: string): Promise<ClubEvent[]> {
  try {
    const supabase = createServerClient()
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('club_id', clubId)
      .eq('published', true)
      .gte('event_date', today)
      .order('event_date', { ascending: true })
    if (data && data.length > 0) return data
  } catch {
    // fall through to static fallback
  }
  return FALLBACK_CLUB_EVENTS[clubSlug] ?? []
}

export async function generateStaticParams() {
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('clubs').select('slug').eq('active', true)
    if (data && data.length > 0) return data.map((c) => ({ slug: c.slug }))
  } catch {
    // fall through
  }
  return Object.keys(FALLBACK_CLUB_EVENTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const club = await getClub(params.slug)
  if (!club) return { title: 'Club Not Found | Ibiza mi vida' }

  return {
    title: `${club.name} Ibiza Tickets 2026`,
    description: `Buy ${club.name} tickets in Ibiza. Browse upcoming events at ${club.name} and book instantly via WhatsApp with Ibiza mi vida — your premium Ibiza events agency.`,
    openGraph: {
      title: `${club.name} Ibiza Tickets 2026 | Ibiza mi vida`,
      description: `Upcoming events and tickets for ${club.name} Ibiza. Browse the lineup and book via WhatsApp with Ibiza mi vida.`,
      images: club.image_url ? [{ url: club.image_url, width: 1200, height: 630 }] : undefined,
    },
  }
}

export default async function ClubDetailPage({ params }: Props) {
  const club = await getClub(params.slug)
  if (!club) notFound()

  const events = await getUpcomingEvents(club.id, club.slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibizamivida.com'
  const pageUrl = `${siteUrl}/club-tickets/${club.slug}`
  const imageUrl = club.image_url ?? 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1920&q=85'

  return (
    <>
      {/* Venue schema */}
      <VenueSchema
        name={club.name}
        slug={club.slug}
        description={club.description ?? undefined}
        image={club.image_url ?? undefined}
      />

      {/* Event schemas — one per upcoming event */}
      {events.map((event) => (
        <EventSchema
          key={event.id}
          name={event.title}
          startDate={event.event_date}
          venueName={club.name}
          description={event.description ?? undefined}
          priceFrom={event.price_from ?? undefined}
          image={event.image_url ?? undefined}
          lineup={event.lineup ?? []}
          pageUrl={pageUrl}
        />
      ))}

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
            {club.music_genre && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-rustic-terracotta/50 bg-rustic-terracotta/10 px-4 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-rustic-terracotta">
                <Music size={12} />
                {club.music_genre}
              </span>
            )}
            <h1 className="font-serif text-5xl font-light text-ibiza-sand md:text-6xl lg:text-7xl">
              {club.name}
            </h1>
            {club.tagline && (
              <p className="max-w-xl font-sans text-lg text-ibiza-sand/70">{club.tagline}</p>
            )}
            <div className="flex flex-wrap gap-4 text-ibiza-sand/50">
              {club.location && (
                <span className="flex items-center gap-1.5 font-sans text-sm">
                  <MapPin size={14} className="text-rustic-terracotta" />
                  {club.location}
                </span>
              )}
              {club.capacity && (
                <span className="flex items-center gap-1.5 font-sans text-sm">
                  <Users size={14} className="text-rustic-terracotta" />
                  {club.capacity.toLocaleString()} capacity
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* About */}
            {club.description && (
              <AnimatedSection>
                <h2 className="mb-4 font-serif text-3xl font-light text-velvet-obsidian">
                  About {club.name}
                </h2>
                <div className="prose prose-velvet-obsidian max-w-none font-sans text-base leading-relaxed text-velvet-obsidian/70">
                  {club.description.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Upcoming events */}
            <AnimatedSection>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="font-serif text-3xl font-light text-velvet-obsidian">
                  Upcoming Events
                </h2>
                <span className="rounded-full bg-sandstone px-3 py-1 font-sans text-xs font-semibold text-velvet-obsidian/60">
                  {events.length} {events.length === 1 ? 'event' : 'events'}
                </span>
              </div>

              {events.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      clubName={club.name}
                      clubSlug={club.slug}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-velvet-obsidian/10 p-10 text-center">
                  <p className="font-serif text-2xl font-light text-velvet-obsidian/40">No events scheduled yet</p>
                  <p className="mt-2 font-sans text-sm text-velvet-obsidian/30">
                    Contact us for availability — we often have access to events not listed here.
                  </p>
                </div>
              )}
            </AnimatedSection>
          </div>

          {/* Sidebar: Booking strip */}
          <aside className="lg:col-span-1">
            <AnimatedSection className="sticky top-24">
              <div className="rounded-2xl border border-velvet-obsidian/10 bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-serif text-2xl font-light text-velvet-obsidian">
                  Book Tickets
                </h3>
                <p className="mb-6 font-sans text-sm leading-relaxed text-velvet-obsidian/60">
                  {club.booking_type === 'promoter_link'
                    ? `${club.name} sells tickets through their official promoter. Click below to access the official ticket page.`
                    : `Book your ${club.name} tickets instantly via WhatsApp. We confirm quickly and keep it simple.`}
                </p>

                {club.booking_type === 'promoter_link' ? (
                  <a
                    href={club.promoter_url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-velvet-obsidian px-6 py-4 font-sans font-semibold text-white transition-colors hover:bg-velvet-obsidian/80"
                    aria-label={`Buy ${club.name} tickets — official promoter site`}
                  >
                    <ExternalLink size={16} />
                    Official Ticket Page
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34XXXXXXXXX'}?text=${encodeURIComponent(`Hi! I'd like to book tickets for ${club.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-rustic-terracotta px-6 py-4 font-sans font-semibold text-white transition-colors hover:bg-rustic-terracotta/90"
                    aria-label={`Book ${club.name} tickets via WhatsApp`}
                  >
                    <MessageCircle size={16} />
                    Book via WhatsApp
                  </a>
                )}

                <div className="mt-6 border-t border-velvet-obsidian/10 pt-6 flex flex-col gap-2 text-center">
                  <p className="font-sans text-xs text-velvet-obsidian/40">Instant reply · No booking fee · Secure</p>
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
