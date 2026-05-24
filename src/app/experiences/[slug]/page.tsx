import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Users, ArrowLeft, MessageCircle } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { FALLBACK_EXPERIENCES } from '@/lib/fallback-experiences'
import type { Experience } from '@/types/experience'
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema'
import { ExperienceBookingCTA } from '@/components/experiences/ExperienceBookingCTA'

export const revalidate = 0

/* ── All fallback experiences flat list ── */
const ALL_FALLBACK = Object.values(FALLBACK_EXPERIENCES).flat()

/* ── Data ── */
async function getExperience(slug: string): Promise<Experience | null> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .eq('slug', slug)
      .eq('available', true)
      .single()
    if (data) return data as Experience
  } catch {
    // fall through
  }
  return ALL_FALLBACK.find((e) => e.slug === slug) ?? null
}

export async function generateStaticParams() {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('experiences')
      .select('slug')
      .eq('available', true)
    if (data && data.length > 0) return data.map((e) => ({ slug: e.slug }))
  } catch {
    // fall through
  }
  return ALL_FALLBACK.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const exp = await getExperience(params.slug)
  if (!exp) return { title: 'Experience not found | Ibiza mi vida' }

  const desc =
    exp.description?.slice(0, 155) ??
    `Book ${exp.title} in Ibiza. ${exp.tagline ?? ''} Instant WhatsApp booking with Ibiza mi vida.`

  return {
    title: `${exp.title} Ibiza | Ibiza mi vida`,
    description: desc,
    openGraph: {
      title: `${exp.title} | Ibiza mi vida`,
      description: desc,
      images: exp.image_url
        ? [{ url: exp.image_url, width: 1200, height: 630, alt: exp.title }]
        : undefined,
    },
  }
}

/* ── Category labels ── */
const CATEGORY_LABELS: Record<string, string> = {
  'boat-charter': 'Private Charter',
  'club-ticket': 'Club Night',
  'boat-party': 'Boat Party',
  catamaran: 'Catamaran',
  formentera: 'Formentera',
  'car-rental': 'Car Rental',
}

/* ── Category includes ── */
const CATEGORY_INCLUDES: Record<string, string[]> = {
  'boat-party': [
    'DJ sets throughout the journey',
    'Open bar (beer, wine, spirits)',
    'Multiple swim stops',
    'Life jackets & safety equipment',
  ],
  'boat-charter': [
    'Fully crewed — experienced captain',
    'Custom route of your choice',
    'Snorkelling equipment',
    'Complimentary soft drinks on board',
  ],
  catamaran: [
    'Professional skipper & crew',
    'Open bar included',
    'Swimming & snorkelling stops',
    'Premium sound system',
  ],
  formentera: [
    'Return boat transfer',
    'Beach & swimming time',
    'Guide available on request',
    'Snorkelling equipment (optional add-on)',
  ],
  'car-rental': [
    'Full comprehensive insurance',
    'Free delivery to your hotel or villa',
    'Unlimited mileage',
    '24/7 roadside assistance',
  ],
  'club-ticket': [
    'Entry to the club',
    'Access to all areas',
    'No queue guarantee',
    'Dedicated host available',
  ],
}

const BACK_LINKS: Record<string, { href: string; label: string }> = {
  'boat-party': { href: '/boat-parties', label: 'All Boat Parties' },
  'boat-charter': { href: '/private-boat-charters', label: 'All Charters' },
  catamaran: { href: '/vip-catamaran', label: 'All Catamarans' },
  formentera: { href: '/formentera-boat-trips', label: 'All Formentera Trips' },
  'car-rental': { href: '/car-scooter-rental', label: 'All Rentals' },
  'club-ticket': { href: '/club-tickets', label: 'All Clubs' },
}

/* ── Page ── */
export default async function ExperienceDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const exp = await getExperience(params.slug)
  if (!exp) notFound()

  const includes = CATEGORY_INCLUDES[exp.category] ?? []
  const backLink = BACK_LINKS[exp.category]
  const categoryLabel = CATEGORY_LABELS[exp.category] ?? exp.category

  return (
    <>
      <LocalBusinessSchema />

      {/* ── Hero ── */}
      <section className="relative h-[60vh] min-h-[420px] w-full">
        <Image
          src={
            exp.image_url ??
            'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=85'
          }
          alt={exp.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/60 to-midnight/10" />

        {/* Back link */}
        <div className="absolute left-4 top-24 z-10 md:left-8">
          <Link
            href={backLink?.href ?? '/'}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-sans text-sm text-soft-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft size={14} />
            {backLink?.label ?? 'Back'}
          </Link>
        </div>

        {/* Category chip */}
        <div className="absolute left-4 top-36 z-10 md:left-8">
          <span className="rounded-full bg-midnight/60 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-soft-white backdrop-blur-sm">
            {categoryLabel}
          </span>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-10 md:px-8 md:pb-14">
          <div className="mx-auto max-w-4xl">
            {(exp.duration || exp.capacity) && (
              <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {exp.duration && (
                  <span className="flex items-center gap-1.5 font-sans text-sm text-soft-white/70">
                    <Clock size={13} className="text-teal" />
                    {exp.duration}
                  </span>
                )}
                {exp.capacity && (
                  <span className="flex items-center gap-1.5 font-sans text-sm text-soft-white/70">
                    <Users size={13} className="text-teal" />
                    Up to {exp.capacity} guests
                  </span>
                )}
              </div>
            )}
            <h1 className="font-serif text-4xl font-light leading-tight text-soft-white md:text-6xl">
              {exp.title}
            </h1>
            {exp.tagline && (
              <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-soft-white/70">
                {exp.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-14">

          {/* Left: details */}
          <div className="md:col-span-2 space-y-10">

            {/* About */}
            <div>
              <h2 className="font-serif text-3xl font-light text-midnight">About this experience</h2>
              <p className="mt-4 font-sans text-base leading-relaxed text-midnight/70">
                {exp.description ??
                  `Experience the best of Ibiza with this hand-picked ${categoryLabel.toLowerCase()} experience. Book instantly via WhatsApp and our team will take care of every detail.`}
              </p>
            </div>

            {/* What's included */}
            {includes.length > 0 && (
              <div>
                <h2 className="mb-5 font-serif text-2xl font-light text-midnight">
                  {"What's included"}
                </h2>
                <ul className="space-y-3">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                      <span className="font-sans text-sm leading-relaxed text-midnight/70">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Booking note */}
            <div className="rounded-2xl bg-sandstone/50 px-6 py-5">
              <p className="font-sans text-sm leading-relaxed text-midnight/70">
                <span className="font-semibold text-midnight">Instant booking via WhatsApp.</span>{' '}
                Message us with your group size and preferred date — we reply within minutes and
                confirm everything for you.
              </p>
            </div>
          </div>

          {/* Right: sticky booking card */}
          <div className="md:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-midnight/10 bg-soft-white p-6 shadow-sm">
              {/* Price */}
              {exp.price_from !== null && (
                <div className="mb-5 border-b border-midnight/10 pb-5">
                  <span className="font-sans text-xs uppercase tracking-wide text-midnight/40">
                    From
                  </span>
                  <p className="font-serif text-4xl font-light leading-none text-midnight">
                    €{exp.price_from.toFixed(0)}
                    <span className="font-sans text-sm font-normal text-midnight/40"> / person</span>
                  </p>
                </div>
              )}

              {/* Meta */}
              <div className="mb-6 space-y-2">
                {exp.duration && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-sandstone/40 px-4 py-3">
                    <Clock size={14} className="shrink-0 text-teal" />
                    <span className="font-sans text-sm text-midnight">{exp.duration}</span>
                  </div>
                )}
                {exp.capacity && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-sandstone/40 px-4 py-3">
                    <Users size={14} className="shrink-0 text-teal" />
                    <span className="font-sans text-sm text-midnight">
                      Up to {exp.capacity} guests
                    </span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <ExperienceBookingCTA experience={exp} />

              <p className="mt-4 text-center font-sans text-xs text-midnight/40">
                Free cancellation · No booking fees
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
