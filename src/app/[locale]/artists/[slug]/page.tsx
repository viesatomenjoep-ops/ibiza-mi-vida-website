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
    description: artist.description ? artist.description.replace(new RegExp('<[^>]+>', 'g'), '').substring(0, 160) : `Buy official tickets for ${artist.name} at ${artist.venueName} in Ibiza.`,
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
    <main className="theme-monaco-vip bg-[var(--color-paper)] min-h-screen text-[var(--color-ink)]">
      <section className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden" aria-label={`${artist.name} hero`}>
        <Image src={mainImage} alt={artist.name} fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-paper)] via-transparent to-black/50" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 container mx-auto">
          <div className="max-w-4xl">
            <AnimatedSection>
              <Link href={`/${params.locale}/artists`} className="text-[var(--color-slate)] hover:text-[var(--color-sea)] font-sans text-xs uppercase tracking-widest font-bold mb-6 inline-flex items-center gap-2 transition-colors">
                ← Back to Artists
              </Link>
              <div className="mb-4">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-card)] px-4 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-[var(--color-sea)] shadow-sm">
                  <MapPin size={12} />
                  {artist.venueName}
                </span>
              </div>
              <h1 className="font-serif text-5xl font-bold text-[var(--color-ink)] md:text-7xl lg:text-8xl drop-shadow-md">
                {artist.name}
              </h1>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-10">
            <AnimatedSection delay={100} className="prose prose-invert max-w-none prose-p:text-[var(--color-slate)] prose-a:text-[var(--color-sea)]">
              <h2 className="font-serif text-3xl font-bold text-[var(--color-ink)]">About {artist.name}</h2>
              {artist.description ? (
                <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: artist.description }} />
              ) : (
                <p>Catch {artist.name} live in Ibiza for an unforgettable night of incredible music and atmosphere.</p>
              )}
            </AnimatedSection>

            {artist.requirements && (
              <AnimatedSection delay={150} className="prose prose-invert max-w-none prose-p:text-[var(--color-slate)] p-6 bg-[var(--color-card)] border border-[var(--color-line)] rounded-2xl shadow-sm">
                <h3 className="font-serif text-xl font-bold text-[var(--color-ink)] mb-4">Important Information</h3>
                <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: artist.requirements }} />
              </AnimatedSection>
            )}

            <AnimatedSection delay={200} className="flex flex-col gap-6">
              <h2 className="font-serif text-3xl font-bold text-[var(--color-ink)]">Upcoming Shows</h2>
              
              <div className="flex flex-col gap-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((eventObj: any, idx: number) => (
                    <div key={`${eventObj.id}-${idx}`} className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border border-[var(--color-line)] rounded-2xl bg-[var(--color-card)] transition-all hover:border-[var(--color-sea)] hover:shadow-lg">
                      <div className="flex flex-col">
                        <span className="font-serif text-xl font-bold text-[var(--color-ink)] group-hover:text-[var(--color-sea)] transition-colors">
                          {artist.name} @ {artist.venueName}
                        </span>
                        <span className="text-sm text-[var(--color-slate)] font-medium mt-2 flex items-center gap-3" suppressHydrationWarning>
                          <span className="bg-black/20 text-[var(--color-sea)] px-3 py-1 rounded-md text-xs uppercase tracking-wider font-bold border border-[var(--color-line)]">
                            {new Date(eventObj.date).toLocaleDateString(params.locale, { weekday: 'short', timeZone: 'UTC' })}
                          </span>
                          {new Date(eventObj.date).toLocaleDateString(params.locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                        </span>
                        {eventObj.lineUp && (
                           <div className="mt-3 text-xs text-[var(--color-slate)] max-w-xl" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: eventObj.lineUp }} />
                        )}
                      </div>
                      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 mt-4 md:mt-0">
                        <span className="font-bold text-lg text-[var(--color-ink)] whitespace-nowrap">
                          {eventObj.prices ? `From ${eventObj.prices}` : 'Available'}
                        </span>
                        <a 
                          href={eventObj.affLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-[var(--color-sea)] hover:scale-105 whitespace-nowrap shadow-md text-center"
                        >
                          Buy Tickets
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-[var(--color-card)] p-8 text-center">
                    <p className="font-sans text-[var(--color-slate)]">
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
