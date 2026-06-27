import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Music, ExternalLink, MessageCircle } from 'lucide-react'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { VenueSchema } from '@/components/seo/VenueSchema'
import { CTVenue, CTEventDate } from '@/lib/clubtickets'
import { VenueEventsSlider, VenueSliderEvent } from '@/components/venues/VenueEventsSlider'
import { VenueCalendarList } from '@/components/venues/VenueCalendarList'

interface VenueDetailPageProps {
  club: CTVenue;
  allDates: CTEventDate[];
  locale: string;
  basePath: string;
}

export function VenueDetailPage({ club, allDates, locale, basePath }: VenueDetailPageProps) {
  const imageUrl = club.cover || club.picture || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1920&q=85'

  const cleanDescription = club.description 
    ? club.description.split('.promo-hz')[0].trim()
    : '';

  // Process unique events and determine if they are "Weekly" or "More"
  const eventStats = new Map<string, { count: number, days: Set<string>, firstEvent: any }>();
  
  allDates.forEach(date => {
    const dayOfWeek = new Date(date.date).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }).toUpperCase();
    if (!eventStats.has(date.eventSlug || '')) {
      eventStats.set(date.eventSlug || '', { 
        count: 0, 
        days: new Set(), 
        firstEvent: {
          id: date.eventId,
          name: date.eventName || date.name,
          slug: date.eventSlug,
          cover: date.eventCover,
          logo: date.eventLogo,
          venueName: date.venueName
        } 
      });
    }
    const stat = eventStats.get(date.eventSlug || '')!;
    stat.count++;
    stat.days.add(dayOfWeek);
  });

  const weeklyParties: VenueSliderEvent[] = [];
  const moreParties: VenueSliderEvent[] = [];

  Array.from(eventStats.values()).forEach(stat => {
    // If it happens on mostly 1 or 2 specific days of the week, and happens multiple times, it's a Weekly Party
    const daysArray = Array.from(stat.days);
    if (stat.count >= 3 && daysArray.length <= 2) {
      weeklyParties.push({
        ...stat.firstEvent,
        dayOfWeek: daysArray[0]
      });
    } else {
      moreParties.push({
        ...stat.firstEvent,
        dayOfWeek: undefined
      });
    }
  });

  // Sort weekly parties by day of week
  const daysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  weeklyParties.sort((a, b) => {
    return daysOrder.indexOf(a.dayOfWeek || '') - daysOrder.indexOf(b.dayOfWeek || '');
  });

  return (
    <>
      <VenueSchema
        name={club.name}
        slug={club.slug}
        description={club.description ? club.description.replace(/<[^>]+>/g, ' ') : undefined}
        image={club.cover ?? undefined}
      />
      <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A1A]">

        {/* Club hero */}
        <section className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden" aria-label={`${club.name} hero`}>
          <Image
            src={imageUrl}
            alt={club.name}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-32 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  {club.type && (
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-4 py-1.5 font-sans text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                      <Music size={12} />
                      {club.type.name}
                    </span>
                  )}
                  {club.isDayClub !== undefined && (
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 backdrop-blur-md px-4 py-1.5 font-sans text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                      {club.isDayClub ? 'Daytime' : 'Night'}
                    </span>
                  )}
                </div>
                <h1 className="font-serif text-5xl font-bold text-white md:text-7xl lg:text-8xl drop-shadow-md">
                  {club.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/80">
                  <span className="flex items-center gap-1.5 font-sans text-sm font-medium">
                    <MapPin size={16} className="text-white" />
                    Ibiza, Spain
                  </span>
                </div>
              </div>
              
              {/* Club Logo */}
              {(club.whitelogo || club.logo) && (
                <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                  <Image 
                    src={(club.whitelogo || club.logo) as string} 
                    alt={`${club.name} logo`}
                    fill
                    className="object-contain filter drop-shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Weekly Parties Slider */}
        {weeklyParties.length > 0 && (
          <VenueEventsSlider 
            title={`${club.name} weekly parties 2026`}
            events={weeklyParties}
            venueSlug={club.slug}
            basePath={basePath}
            theme="light"
          />
        )}

        {/* More Parties Slider */}
        {moreParties.length > 0 && (
          <VenueEventsSlider 
            title={`${club.name} more parties 2026`}
            events={moreParties}
            venueSlug={club.slug}
            basePath={basePath}
            theme="blue"
          />
        )}

        {/* About Section */}
        {club.description && (
          <section className="py-16 md:py-24 bg-white border-y border-[#1A1A1A]/10">
            <div className="mx-auto max-w-4xl px-4 md:px-8 text-center">
              <AnimatedSection delay={100}>
                <h2 className="font-serif text-[32px] md:text-[42px] font-bold text-[#1A1A1A] mb-8">
                  {club.name} information
                </h2>
                <div className="prose prose-lg mx-auto text-[#1A1A1A]/70 leading-relaxed font-sans prose-p:mb-6">
                  <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: cleanDescription }} />
                </div>
              </AnimatedSection>
            </div>
          </section>
        )}

        {/* Full Interactive Calendar List */}
        <VenueCalendarList 
          dates={allDates} 
          venueName={club.name} 
          locale={locale} 
          basePath={basePath} 
        />

        {/* VIP / Group Booking Promo */}
        <section className="py-12 bg-[#FAF9F6]">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            <AnimatedSection className="rounded-[32px] bg-gradient-to-br from-[#1A1A1A] to-[#333] p-8 md:p-12 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Music size={200} className="text-white transform rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="flex-1">
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                    VIP Tables & Drink Packages
                  </h3>
                  <p className="font-sans text-white/80 max-w-xl text-lg">
                    Elevate your {club.name} experience. Contact our concierge on WhatsApp for exclusive VIP tables, drink packages, and group discounts.
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto">
                  <a
                    href={`https://wa.me/31612345678?text=Hi, I want to book a VIP experience at ${club.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full md:w-auto items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-8 py-5 font-sans text-lg font-bold text-white shadow-lg transition-all hover:bg-[#20bd5a] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#25D366]/20 whitespace-nowrap"
                  >
                    <MessageCircle size={24} />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Cross-sell */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <AnimatedSection>
              <CrossSellBanner triggerPage={`/${basePath}/${club.slug}`} fromPrice={500} />
            </AnimatedSection>
          </div>
        </section>

      </div>
    </>
  )
}
