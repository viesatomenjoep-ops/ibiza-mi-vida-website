import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Music, ExternalLink, ChevronLeft } from 'lucide-react'
import { getEventBySlugs, CTEvent } from '@/lib/clubtickets'
import { CTEventDateCard } from '@/components/events/CTEventDateCard'

export const revalidate = 3600

interface Props {
  params: { slug: string; eventSlug: string }
}

async function fetchEventData(slug: string, eventSlug: string): Promise<CTEvent | null> {
  return await getEventBySlugs(slug, eventSlug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await fetchEventData(params.slug, params.eventSlug)
  if (!event) return { title: 'Event Not Found | Ibiza mi vida' }

  return {
    title: `${event.name} at ${event.venue.name} Ibiza Tickets 2026`,
    description: event.description?.replace(/<[^>]+>/g, '').substring(0, 160) || `Buy tickets for ${event.name} at ${event.venue.name} in Ibiza.`,
    openGraph: {
      title: `${event.name} at ${event.venue.name} Ibiza Tickets 2026 | Ibiza mi vida`,
      description: `Get official tickets for ${event.name} at ${event.venue.name} Ibiza.`,
      images: event.cover ? [{ url: event.cover, width: 1200, height: 630 }] : undefined,
    },
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function EventDetailPage({ params }: Props) {
  const event = await fetchEventData(params.slug, params.eventSlug)
  if (!event) notFound()

  const imageUrl = event.cover || event.logo || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1920&q=85'

  return (
    <>
      {/* Event hero */}
      <section className="relative flex min-h-[65vh] flex-col justify-end overflow-hidden" aria-label={`${event.name} hero`}>
        <Image
          src={imageUrl}
          alt={event.name}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian via-velvet-obsidian/50 to-velvet-obsidian/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-32 md:px-8">
          <div className="mb-8">
            <Link 
              href={`/club-tickets/${params.slug}`}
              className="inline-flex items-center gap-2 text-ibiza-sand/80 hover:text-white transition-colors text-sm font-semibold tracking-wide uppercase"
            >
              <ChevronLeft size={16} />
              Back to {event.venue.name}
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-rustic-terracotta/50 bg-rustic-terracotta/10 px-4 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-rustic-terracotta">
              <Music size={12} />
              {event.type?.name || 'Clubbing'}
            </span>
            <h1 className="font-serif text-5xl font-bold text-ibiza-sand md:text-6xl lg:text-7xl">
              {event.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-ibiza-sand/80 mt-2">
              <span className="flex items-center gap-1.5 font-sans text-lg font-medium">
                <MapPin size={18} className="text-rustic-terracotta" />
                {event.venue.name}, Ibiza
              </span>
              {(event.startAt || event.endAt) && (
                <span className="flex items-center gap-1.5 font-sans text-lg font-medium">
                  <Calendar size={18} className="text-rustic-terracotta" />
                  {event.startAt ? new Date(event.startAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''}
                  {event.startAt && event.endAt ? ' - ' : ''}
                  {event.endAt ? new Date(event.endAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="bg-background-primary py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left: Description */}
            <div className="lg:col-span-2 flex flex-col gap-12">
              {event.description && (
                <div className="prose prose-velvet max-w-none prose-p:text-velvet-obsidian/70">
                  <h2 className="font-serif text-3xl font-bold text-velvet-obsidian mb-6">About the Party</h2>
                  <div dangerouslySetInnerHTML={{ __html: event.description }} />
                </div>
              )}

              {event.requirements && (
                <div className="prose prose-velvet max-w-none prose-p:text-velvet-obsidian/70">
                  <h2 className="font-serif text-3xl font-bold text-velvet-obsidian mb-6">Important Information & Rules</h2>
                  <div dangerouslySetInnerHTML={{ __html: event.requirements }} />
                </div>
              )}
            </div>

            {/* Right: Dates & Tickets */}
            <div className="flex flex-col gap-6">
              <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="font-serif text-2xl font-bold text-velvet-obsidian mb-6">Available Dates</h3>
                
                <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                  {event.dates && event.dates.length > 0 ? (
                    event.dates.map((date) => (
                      <CTEventDateCard 
                        key={date.id} 
                        date={date} 
                        eventName={event.name} 
                        venueName={event.venue.name} 
                        imageUrl={imageUrl} 
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No upcoming dates announced yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
