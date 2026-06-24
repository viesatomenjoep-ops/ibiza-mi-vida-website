import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, ArrowLeft } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { getVenues, getVenue, getAllDates } from '@/lib/clubtickets'

export const revalidate = 3600

interface Props {
  params: { slug: string; eventSlug: string; locale: string }
}

export async function generateStaticParams() {
  return [];
}

export default async function EventDetailPage({ params }: Props) {
  const { slug, eventSlug } = params
  
  // Find venue
  const venues = await getVenues(params.locale)
  const venueRef = venues.find(v => v.slug === slug)
  if (!venueRef) notFound()
  
  const club = await getVenue(venueRef.id, params.locale)
  if (!club) notFound()

  // Find event dates
  const allDatesGlobal = await getAllDates(params.locale)
  const eventDates = allDatesGlobal.filter(d => d.venueSlug === slug && d.eventSlug === eventSlug)
  
  if (!eventDates || eventDates.length === 0) notFound()

  // Sort chronologically
  eventDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get event details from the first date object, or from the club's event list
  const eventDetail = club.events?.find(e => e.slug === eventSlug)
  
  const eventName = eventDetail?.name || eventDates[0].eventName || 'Event'
  const eventCover = eventDetail?.cover || eventDetail?.logo || club.cover || club.picture || ''
  const description = eventDetail?.description || club.description || ''

  const cleanDescription = description 
    ? description.split('.promo-hz')[0]
                      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim()
    : '';

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] flex-col justify-end overflow-hidden" aria-label={`${eventName} hero`}>
        <Image
          src={eventCover}
          alt={eventName}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian via-velvet-obsidian/50 to-transparent" />

        <div className="absolute left-4 top-24 z-10 md:left-8">
          <Link
            href={`/club-tickets/${slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-sans text-sm text-ibiza-sand backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft size={14} />
            Terug naar {club.name}
          </Link>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-32 md:px-8">
          <div className="flex flex-col gap-4">
            <h1 className="font-serif text-4xl font-bold text-ibiza-sand md:text-5xl lg:text-6xl">
              {eventName}
            </h1>
            <div className="flex flex-wrap gap-4 text-ibiza-sand/80 font-bold">
              <Link href={`/club-tickets/${slug}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <MapPin size={16} className="text-[#00A698]" />
                {club.name}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {cleanDescription && (
              <AnimatedSection delay={100}>
                <h2 className="font-serif text-3xl font-bold text-velvet-obsidian mb-6">Over {eventName}</h2>
                <div className="prose prose-lg max-w-none text-velvet-obsidian/70">
                  <p>{cleanDescription}</p>
                </div>
              </AnimatedSection>
            )}

            {/* Calendar Events List */}
            <AnimatedSection delay={100} className="flex flex-col gap-6">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-velvet-obsidian">Selecteer Datum & Boek</h2>
                  <p className="mt-2 font-sans text-velvet-obsidian/60">
                    Alle aankomende data voor {eventName} bij {club.name}. Boek veilig via ClubTickets.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {eventDates.map((dateObj, idx) => (
                  <div key={`${dateObj.id}-${idx}`} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-velvet-obsidian/10 rounded-2xl bg-white transition-all hover:border-[#00A698]/30 hover:shadow-md">
                    <div className="flex flex-col">
                      <span className="font-serif text-xl font-bold text-velvet-obsidian group-hover:text-[#00A698] transition-colors">
                        {dateObj.eventName}
                      </span>
                      <span className="text-sm text-velvet-obsidian/60 font-medium mt-1 flex items-center gap-2">
                        <span className="bg-[#00A698]/10 text-[#00A698] px-2 py-0.5 rounded-md text-xs uppercase tracking-wider font-bold">
                          {new Date(dateObj.date).toLocaleDateString('nl-NL', { weekday: 'short' })}
                        </span>
                        {new Date(dateObj.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                      <span className="font-bold text-lg text-velvet-obsidian">
                        {dateObj.prices ? `Vanaf ${dateObj.prices}` : 'Beschikbaar'}
                      </span>
                      <a 
                        href={dateObj.affLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-black text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-gray-800 hover:scale-105 whitespace-nowrap shadow-sm"
                      >
                        Tickets
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </>
  )
}
