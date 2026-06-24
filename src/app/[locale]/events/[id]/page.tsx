import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, ArrowLeft, Users, Music, Anchor, Sun } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { FALLBACK_FEATURED_EVENTS } from '@/lib/fallback-events'
import { CATEGORY_LABELS } from '@/types/featured-event'
import type { FeaturedEvent, FeaturedEventCategory } from '@/types/featured-event'
import { EventBookingCTA } from '@/components/events/EventBookingCTA'
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema'

export const revalidate = 60

/* ── Data fetching ── */
async function getEvent(id: string): Promise<FeaturedEvent | null> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('featured_events')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single()
    if (data) return data as FeaturedEvent
  } catch {
    // fall through to static fallback
  }
  return FALLBACK_FEATURED_EVENTS.find((e) => e.id === id) ?? null
}

export async function generateStaticParams() {
  // Return empty array to generate pages on-demand and prevent Vercel build timeouts from API rate limiting
  return []
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const event = await getEvent(params.id)
  if (!event) return { title: 'Event not found | Ibiza mi vida' }

  const desc = event.subtitle
    ? `${event.subtitle}. ${event.venue_name ? `At ${event.venue_name}, Ibiza.` : 'Ibiza.'} From €${event.price_from ?? '—'}.`
    : `Book ${event.title} in Ibiza. ${event.venue_name ? `At ${event.venue_name}.` : ''} Instant WhatsApp booking with Ibiza mi vida.`

  return {
    title: `${event.title} | Ibiza mi vida`,
    description: desc,
    openGraph: {
      title: `${event.title} | Ibiza mi vida`,
      description: desc,
      images: [{ url: event.image_url, width: 1200, height: 630, alt: event.title }],
    },
  }
}

/* ── Helpers ── */
function formatEventDateLong(dateStr: string | null): string | null {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const CATEGORY_HIGHLIGHTS: Record<
  FeaturedEventCategory,
  { icon: React.ElementType; items: string[] }
> = {
  'club-ticket': {
    icon: Music,
    items: ['World-class DJ lineup', 'State-of-the-art sound system', 'VIP table options available', 'Dress code: smart casual'],
  },
  'boat-charter': {
    icon: Anchor,
    items: ['Fully crewed private yacht', 'Custom route — your choice', 'Snorkelling equipment included', 'Complimentary drinks on board'],
  },
  'boat-party': {
    icon: Anchor,
    items: ['Live DJ sets on the water', 'Open bar package included', 'Stunning sunset views', 'Swimming stops en route'],
  },
  catamaran: {
    icon: Anchor,
    items: ['Luxury catamaran — full catering', 'Open bar included', 'Multiple swimming stops', 'Professional crew & guide'],
  },
  formentera: {
    icon: Sun,
    items: ["World's most beautiful beach", 'Crystal turquoise water', 'Full day trip — approx. 8 hrs', 'Snorkelling & paddleboard hire'],
  },
  'car-rental': {
    icon: Users,
    items: ['Wide range of vehicles', 'Unlimited mileage', 'Full insurance included', 'Free delivery to your hotel'],
  },
  guestlist: {
    icon: Users,
    items: ['Skip the queue entry', 'Discounted or free admission', 'Valid for select nights', 'Arrives before velvet-obsidian'],
  },
  'drink-package': {
    icon: Music,
    items: ['Premium drinks included', 'Valid for the full night', 'At select VIP venues', 'Book in advance to secure'],
  },
}

/* ── Page ── */
export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const event = await getEvent(params.id)
  if (!event) notFound()

  const formattedDate = formatEventDateLong(event.event_date)
  const highlights = CATEGORY_HIGHLIGHTS[event.category]
  const HighlightIcon = highlights.icon

  return (
    <>
      <LocalBusinessSchema />

      {/* ── Hero ── */}
      <section className="relative h-[65vh] min-h-[440px] w-full">
        <Image
          src={event.image_url || 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=85'}
          alt={event.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian via-velvet-obsidian/60 to-velvet-obsidian/10" />

        {/* Back button */}
        <div className="absolute left-4 top-24 z-10 md:left-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-sans text-sm text-ibiza-sand backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </div>

        {/* Category + badge — top-left */}
        <div className="absolute left-4 top-36 z-10 flex items-center gap-2 md:left-8 md:top-40">
          <span className="rounded-full bg-velvet-obsidian/60 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-ibiza-sand backdrop-blur-sm">
            {CATEGORY_LABELS[event.category]}
          </span>
          {event.badge_text && (
            <span className="rounded-full bg-rustic-terracotta px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-white">
              {event.badge_text}
            </span>
          )}
        </div>

        {/* Hero text — bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-10 md:px-8 md:pb-14">
          <div className="mx-auto max-w-4xl">
            {(event.venue_name || formattedDate) && (
              <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {event.venue_name && (
                  <span className="flex items-center gap-1.5 font-sans text-sm text-ibiza-sand/70">
                    <MapPin size={13} className="text-rustic-terracotta" />
                    {event.venue_name}
                  </span>
                )}
                {formattedDate && (
                  <span className="flex items-center gap-1.5 font-sans text-sm text-ibiza-sand/70">
                    <Calendar size={13} className="text-rustic-terracotta" />
                    {formattedDate}
                  </span>
                )}
              </div>
            )}
            <h1 className="font-serif text-4xl font-light leading-tight text-ibiza-sand md:text-6xl">
              {event.title}
            </h1>
            {event.subtitle && (
              <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-ibiza-sand/70">
                {event.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-14">

          {/* ── Left: details ── */}
          <div className="md:col-span-2 space-y-10">

            {/* Description */}
            <div>
              <h2 className="font-serif text-3xl font-light text-velvet-obsidian">About this event</h2>
              <p className="mt-4 font-sans text-base leading-relaxed text-velvet-obsidian/70">
                {event.description ??
                  (event.category === 'club-ticket'
                    ? `Join us for an unforgettable night at ${event.venue_name ?? "one of Ibiza's iconic venues"}. ${event.subtitle ?? ''} Get your tickets now and secure your spot — these nights sell out fast.`
                    : `Experience the very best of Ibiza with this hand-picked ${CATEGORY_LABELS[event.category].toLowerCase()} experience. ${event.subtitle ?? ''} Book instantly via WhatsApp and our team will take care of every detail.`)}
              </p>
            </div>

            {/* What's included / highlights */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rustic-terracotta/10 text-rustic-terracotta">
                  <HighlightIcon size={20} />
                </div>
                <h2 className="font-serif text-2xl font-light text-velvet-obsidian">
                  {event.category === 'club-ticket' ? 'Night highlights' : "What's included"}
                </h2>
              </div>
              <ul className="space-y-3">
                {highlights.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rustic-terracotta" />
                    <span className="font-sans text-sm leading-relaxed text-velvet-obsidian/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instant booking note */}
            <div className="rounded-2xl bg-sandstone/50 px-6 py-5">
              <p className="font-sans text-sm leading-relaxed text-velvet-obsidian/70">
                <span className="font-semibold text-velvet-obsidian">Instant booking via WhatsApp.</span>{' '}
                Our team replies within minutes — just tap the button, tell us your group size and
                date, and we&apos;ll handle everything else.
              </p>
            </div>
          </div>

          {/* ── Right: sticky booking card ── */}
          <div className="md:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-velvet-obsidian/10 bg-ibiza-sand p-6 shadow-sm">
              {/* Price */}
              {event.price_from !== null && (
                <div className="mb-5 border-b border-velvet-obsidian/10 pb-5">
                  <span className="font-sans text-xs uppercase tracking-wide text-velvet-obsidian/40">
                    From
                  </span>
                  <p className="font-serif text-4xl font-light leading-none text-velvet-obsidian">
                    €{event.price_from.toFixed(0)}
                    <span className="font-sans text-sm font-normal text-velvet-obsidian/40"> / person</span>
                  </p>
                </div>
              )}

              {/* Meta pills */}
              <div className="mb-6 space-y-2">
                {event.venue_name && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-sandstone/40 px-4 py-3">
                    <MapPin size={14} className="shrink-0 text-rustic-terracotta" />
                    <span className="font-sans text-sm text-velvet-obsidian">{event.venue_name}</span>
                  </div>
                )}
                {formattedDate && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-sandstone/40 px-4 py-3">
                    <Calendar size={14} className="shrink-0 text-rustic-terracotta" />
                    <span className="font-sans text-sm text-velvet-obsidian">{formattedDate}</span>
                  </div>
                )}
              </div>

              {/* CTA — client component (needs booking context) */}
              <EventBookingCTA event={event} />

              <p className="mt-4 text-center font-sans text-xs text-velvet-obsidian/40">
                Free cancellation · No booking fees
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
