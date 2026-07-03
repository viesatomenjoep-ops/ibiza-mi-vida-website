import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, ArrowLeft } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { CTVenue, CTEventDate } from '@/lib/clubtickets'

interface EventDetailPageProps {
  club: CTVenue;
  eventDates: CTEventDate[];
  eventSlug: string;
  locale: string;
  basePath: string; // e.g. "club-tickets" or "boat-parties"
}

export function EventDetailPage({ club, eventDates, eventSlug, locale, basePath }: EventDetailPageProps) {
  // Get event details from the first date object, or from the club's event list
  const eventDetail = club.events?.find(e => e.slug === eventSlug)
  
  const eventName = eventDetail?.name || eventDates[0]?.eventName || 'Event'
  const eventCover = eventDetail?.cover || eventDetail?.logo || club.cover || club.picture || ''
  const description = eventDetail?.description || club.description || ''

  const cleanDescription = description 
    ? description.split('.promo-hz')[0]
                      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim()
    : '';

  const formatLineUp = (lineUp?: string) => {
    if (!lineUp) return '';
    let text = lineUp.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    text = text.replace(/(\s*-\s*)+/g, ', ');
    if (text.startsWith(',')) text = text.substring(1).trim();
    return text;
  };

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
            href={`/${locale}/${basePath}/${club.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-sans text-sm text-ibiza-sand backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft size={14} />
            Back to {club.name}
          </Link>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-32 md:px-8">
          <div className="flex flex-col gap-4">
            <h1 className="font-serif text-4xl font-bold text-ibiza-sand md:text-5xl lg:text-6xl">
              {eventName}
            </h1>
            <div className="flex flex-wrap gap-4 text-ibiza-sand/80 font-bold">
              <Link href={`/${locale}/${basePath}/${club.slug}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
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
            {/* Calendar Events List */}
            <AnimatedSection delay={100} className="flex flex-col gap-6" id="tickets">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-velvet-obsidian">Select Date & Book</h2>
                  <p className="mt-2 font-sans text-velvet-obsidian/60">
                    All upcoming dates for {eventName} at {club.name}. Book securely via ClubTickets.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {eventDates.map((dateObj, idx) => (
                  <div key={`${dateObj.id}-${idx}`} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-velvet-obsidian/10 rounded-2xl bg-white transition-all hover:border-[#00A698]/30 hover:shadow-md">
                    <div className="flex flex-col gap-1 w-full sm:w-2/3">
                      <span className="font-serif text-xl font-bold text-velvet-obsidian group-hover:text-[#00A698] transition-colors">
                        {dateObj.eventName}
                      </span>
                      <span className="text-sm text-velvet-obsidian/60 font-medium flex items-center gap-2">
                        <span className="bg-[#00A698]/10 text-[#00A698] px-2 py-0.5 rounded-md text-xs uppercase tracking-wider font-bold shrink-0">
                          {new Date(dateObj.date).toLocaleDateString(locale, { weekday: 'short' })}
                        </span>
                        {new Date(dateObj.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      {formatLineUp(dateObj.lineUp) && (
                        <p className="text-sm text-slate-500 mt-2 flex items-start gap-1.5">
                          <span className="text-[#00A698] shrink-0 mt-0.5">✓</span>
                          <span className="line-clamp-2">{formatLineUp(dateObj.lineUp)}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 mt-4 sm:mt-0 shrink-0">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Price</span>
                        <span className="font-bold text-lg text-velvet-obsidian">
                          {dateObj.prices ? dateObj.prices : 'Available'}
                        </span>
                      </div>
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
                ))}
              </div>
            </AnimatedSection>

            {cleanDescription && (
              <AnimatedSection delay={200}>
                <h2 className="font-serif text-3xl font-bold text-velvet-obsidian mb-6">About {eventName}</h2>
                <div className="prose prose-lg max-w-none text-velvet-obsidian">
                  <p>{cleanDescription}</p>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>

      {/* Floating Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-black/10 z-50 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-black/50">Vanaf</span>
          <span className="font-black text-xl text-black">{eventDates[0]?.prices || '€30'}</span>
        </div>
        <button 
          onClick={() => {
            const el = document.getElementById('tickets');
            if (el) {
              window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
            }
          }}
          className="bg-ibiza-green text-black font-black uppercase tracking-wider px-8 py-3.5 rounded-full hover:brightness-95 transition-all shadow-lg active:scale-95"
        >
          Select Tickets
        </button>
      </div>
    </>
  )
}
