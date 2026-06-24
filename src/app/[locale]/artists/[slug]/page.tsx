import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { getVenues, getEvent } from '@/lib/clubtickets'

export const revalidate = 3600

interface Props {
  params: { slug: string; locale: string }
}

async function fetchArtistData(slug: string, locale: string) {
  const venues = await getVenues(locale)
  const topVenues = venues.filter(v => v.events && v.events.length > 0)
  
  let targetVenueId = -1
  let targetEventId = -1
  let venueName = ''
  
  for (const venue of topVenues) {
    if (!venue.events) continue
    const found = venue.events.find(e => e.slug === slug)
    if (found) {
      targetVenueId = venue.id
      targetEventId = found.id
      venueName = venue.name
      break
    }
  }
  
  if (targetVenueId === -1) return null
  
  const fullEvent = await getEvent(targetEventId, locale)
  if (!fullEvent) return null
  
  return { ...fullEvent, venueName }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await fetchArtistData(params.slug, params.locale)
  if (!artist) return { title: 'Artist Not Found | Ibiza mi vida' }

  return {
    title: `${artist.name} in Ibiza 2026 | Tickets & Lineup`,
    description: artist.description ? artist.description.replace(/<[^>]+>/g, '').substring(0, 160) : `Buy official tickets for ${artist.name} at ${artist.venueName} in Ibiza.`,
    openGraph: {
      title: `${artist.name} Ibiza 2026 | Ibiza mi vida`,
      description: `Get official tickets for ${artist.name} in Ibiza.`,
      images: artist.cover || artist.logo ? [{ url: (artist.cover || artist.logo) as string, width: 1200, height: 630 }] : undefined,
    },
  }
}

export default async function ArtistDetailPage({ params }: Props) {
  const artist = await fetchArtistData(params.slug, params.locale)
  if (!artist) notFound()

  const upcomingEvents = artist.dates || []
  upcomingEvents.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const mainImage = artist.cover || artist.logo || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920'

  return (
    <main className="bg-ibiza-sand min-h-screen text-velvet-obsidian">
      <section className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden" aria-label={`${artist.name} hero`}>
        <Image src={mainImage} alt={artist.name} fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ibiza-sand via-transparent to-black/50" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 container mx-auto">
          <div className="max-w-4xl">
            <AnimatedSection>
              <Link href="/artists" className="text-white/70 hover:text-white font-sans text-xs uppercase tracking-widest font-bold mb-6 inline-flex items-center gap-2 transition-colors">
                ← Back to Artists
              </Link>
              <div className="mb-4">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-rustic-terracotta/50 bg-rustic-terracotta/10 px-4 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-rustic-terracotta">
                  <MapPin size={12} />
                  {artist.venueName}
                </span>
              </div>
              <h1 className="font-serif text-5xl font-bold text-ibiza-sand md:text-7xl lg:text-8xl">
                {artist.name}
              </h1>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-10">
            <AnimatedSection delay={100} className="prose prose-velvet max-w-none prose-p:text-velvet-obsidian/70">
              <h2 className="font-serif text-3xl font-bold text-velvet-obsidian">About {artist.name}</h2>
              {artist.description ? (
                <div dangerouslySetInnerHTML={{ __html: artist.description }} />
              ) : (
                <p>Catch {artist.name} live in Ibiza for an unforgettable night of incredible music and atmosphere.</p>
              )}
            </AnimatedSection>

            <AnimatedSection delay={200} className="flex flex-col gap-6">
              <h2 className="font-serif text-3xl font-bold text-velvet-obsidian">Upcoming Shows</h2>
              
              <div className="flex flex-col gap-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((eventObj: any, idx: number) => (
                    <div key={`${eventObj.id}-${idx}`} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-velvet-obsidian/10 rounded-2xl bg-white transition-all hover:border-velvet-obsidian/30 hover:shadow-md">
                      <div className="flex flex-col">
                        <span className="font-serif text-xl font-bold text-velvet-obsidian group-hover:text-blue-600 transition-colors">
                          {artist.name} @ {artist.venueName}
                        </span>
                        <span className="text-sm text-velvet-obsidian/60 font-medium mt-1 flex items-center gap-2">
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs uppercase tracking-wider font-bold">
                            {new Date(eventObj.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          {new Date(eventObj.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                        <span className="font-bold text-lg text-velvet-obsidian">
                          {eventObj.prices ? `From ${eventObj.prices}` : 'Available'}
                        </span>
                        <a 
                          href={eventObj.affLink} 
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
                      No upcoming shows found for this artist right now. Check back soon!
                    </p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </main>
  )
}
