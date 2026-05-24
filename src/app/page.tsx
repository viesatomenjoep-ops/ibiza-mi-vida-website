import type { Metadata } from 'next'
import { Star, Users, MessageCircle } from 'lucide-react'
import { CategoryHero } from '@/components/hero/CategoryHero'
import { CategoryCard } from '@/components/cards/CategoryCard'
import { CategoryGrid } from '@/components/cards/CategoryGrid'
import { ColorfulCategoryList } from '@/components/home/ColorfulCategoryList'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema'
import { FeaturedEventsSlider } from '@/components/home/FeaturedEventsSlider'
import { createServerClient } from '@/lib/supabase/server'
import { getPageContent } from '@/lib/page-content'
import { FALLBACK_FEATURED_EVENTS } from '@/lib/fallback-events'
import type { Experience } from '@/types/experience'
import type { BlogPost } from '@/types/blog'
import type { FeaturedEvent } from '@/types/featured-event'
import Link from 'next/link'
import Image from 'next/image'
import { HomeSearchWidget } from '@/components/home/HomeSearchWidget'
import { DealTimer } from '@/components/ui/DealTimer'
import { DealDateBanner } from '@/components/ui/DealDateBanner'
import { WeekRange } from '@/components/ui/WeekRange'
import { CalendarModal } from '@/components/ui/CalendarModal'
import { DealOfTheWeekList } from '@/components/home/DealOfTheWeekList'
import { HomeSearchFigma } from '@/components/home/HomeSearchFigma'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Ibiza Events, Club Tickets & Private Boat Charters | Ibiza mi vida',
  description:
    'Ibiza mi vida — your premium Ibiza events agency. Book private boat charters, club tickets, boat parties, VIP catamarans and Formentera trips. Instant WhatsApp booking.',
}

const categories = [
  {
    title: 'Deals of the Day',
    tagline: 'Best daily offers · Clubs & Parties',
    imageUrl: 'https://images.unsplash.com/photo-1574347781078-d4dd21af64e8?w=900&q=85',
    href: '/deals-of-the-day',
    bookingConfig: {
      serviceType: 'deals',
      serviceName: 'Deals of the Day Ibiza',
      sourcePage: '/',
    },
    badge: 'Hot Deals',
  },
  {
    title: 'Private Boat Charters',
    tagline: 'Exclusive · Custom routes · From €500',
    imageUrl: 'https://images.unsplash.com/photo-1504735689966-4f12eb87a84e?w=900&q=85',
    href: '/private-boat-charters',
    bookingConfig: {
      serviceType: 'private-boat-charter',
      serviceName: 'Private Boat Charter Ibiza',
      sourcePage: '/',
    },
    badge: 'Most Popular',
  },
  {
    title: 'Club Tickets',
    tagline: 'Pacha · Amnesia · Hi Ibiza & more',
    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=900&q=85',
    href: '/club-tickets',
    bookingConfig: {
      serviceType: 'club-tickets',
      serviceName: 'Ibiza Club Tickets',
      sourcePage: '/',
    },
  },
  {
    title: 'Ibiza Boat Parties',
    tagline: 'Sunset · Music · Mediterranean sea',
    imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=900&q=85',
    href: '/boat-parties',
    bookingConfig: {
      serviceType: 'boat-party',
      serviceName: 'Ibiza Boat Party',
      sourcePage: '/',
    },
  },
  {
    title: 'VIP Catamaran',
    tagline: 'Luxury cruising · Catering included',
    imageUrl: 'https://images.unsplash.com/photo-1527004611998-0c6fde22b1ca?w=900&q=85',
    href: '/vip-catamaran',
    bookingConfig: {
      serviceType: 'catamaran',
      serviceName: 'VIP Catamaran Cruise Ibiza',
      sourcePage: '/',
    },
  },
  {
    title: 'Formentera Boat Trips',
    tagline: 'Pristine beaches · Crystal water',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=85',
    href: '/formentera-boat-trips',
    bookingConfig: {
      serviceType: 'formentera',
      serviceName: 'Formentera Day Trip',
      sourcePage: '/',
    },
  },
  {
    title: 'Car & Scooter Rental',
    tagline: 'Explore at your own pace',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&q=85',
    href: '/car-scooter-rental',
    bookingConfig: {
      serviceType: 'car-rental',
      serviceName: 'Car & Scooter Rental Ibiza',
      sourcePage: '/',
    },
  },
]

const trustPillars = [
  {
    icon: Users,
    title: '500+ Happy Guests',
    body: 'Every season we help hundreds of guests create unforgettable Ibiza memories.',
  },
  {
    icon: Star,
    title: '5-Star Rated',
    body: 'Consistently rated 5 stars by our guests across Google and TripAdvisor.',
  },
  {
    icon: MessageCircle,
    title: 'Instant WhatsApp Reply',
    body: 'Real humans, real fast. We reply to every message within minutes — not hours.',
  },
]

async function getFeaturedEvents(): Promise<FeaturedEvent[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('featured_events')
      .select('*')
      .eq('active', true)
      .order('sort_order')
    if (error || !data || data.length === 0) return FALLBACK_FEATURED_EVENTS
    return data
  } catch {
    return FALLBACK_FEATURED_EVENTS
  }
}

async function getFeaturedExperiences(): Promise<Experience[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .eq('featured', true)
      .eq('available', true)
      .order('sort_order')
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

async function getLatestPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_image, category, published_at, created_at, updated_at, content, published')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [featuredEvents, featuredExperiences, latestPosts, pageContent] = await Promise.all([
    getFeaturedEvents(),
    getFeaturedExperiences(),
    getLatestPosts(),
    getPageContent('homepage', {
      title: "Ibiza Events, Club Tickets & Private Yachts",
      subtitle: "Your premium Ibiza booking agency. From exclusive boat charters to the island's best club nights — we handle every detail so you don't have to.",
      backgroundImage: "/fotos/Vanquish%201.jpg"
    })
  ])

  return (
    <>
      <LocalBusinessSchema />

      {/* Hero */}
      <CategoryHero
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        eyebrow="Ibiza mi vida"
        colorTheme="midnight"
        backgroundImage="/fotos/hero-pattern.jpg"
        backgroundOpacity={0.3}
      />

      {/* New Figma Search Component placed directly under the Hero */}
      <div className="bg-white">
        <HomeSearchFigma />
      </div>

      {/* DASHBOARD TOP: Deal of the Day vs Deal of the Week */}
      <section className="px-4 pb-12 md:pb-12 md:px-8 mt-8 md:mt-12 relative z-20">
        <div className="mx-auto max-w-5xl flex flex-col gap-10">
          
          {/* TOP: Deal of the Day Active Banner */}
          <AnimatedSection>
            <div className="bg-gold/10 border-2 border-gold/30 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              </div>
              <div className="z-10 text-center md:text-left flex-1">
                <DealDateBanner />
                <h2 className="text-3xl md:text-5xl font-serif text-midnight mb-4">Deal of the Day</h2>
                <p className="text-midnight/70 font-sans text-lg max-w-lg">The best hand-picked offers, strictly valid until midnight. Book now before the timer runs out!</p>
              </div>
              <div className="z-10 bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white shrink-0">
                <DealTimer />
              </div>
            </div>
          </AnimatedSection>

          {/* BOTTOM: Deal of the Week */}
          <AnimatedSection>
            <div className="bg-midnight rounded-3xl p-6 md:p-10 flex flex-col relative overflow-hidden text-sandstone shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-midnight">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gold">Deal of the Week</h3>
                  <WeekRange />
                </div>
              </div>
              
              <DealOfTheWeekList />
              
              <CalendarModal />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Featured events slider ── */}
      <div className="bg-sys-bg">
        <FeaturedEventsSlider events={featuredEvents} />
      </div>

      {/* ── Colorful Category List ── */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-16" aria-label="Our services">
        <AnimatedSection>
          <ColorfulCategoryList />
        </AnimatedSection>
      </section>

      {/* ── Trust pillars ── */}
      <section className="bg-midnight py-16 md:py-20" aria-label="Why Ibiza mi vida">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <AnimatedSection className="mb-12 text-center">
            <SectionHeader
              eyebrow="Why Ibiza mi vida"
              title="The Ibiza experts"
              subtitle="We've been helping guests experience Ibiza at its finest since day one."
              light
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {trustPillars.map(({ icon: Icon, title, body }, i) => (
              <AnimatedSection
                key={title}
                delay={i * 0.1}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-teal">
                  <Icon size={24} />
                </div>
                <h3 className="font-serif text-2xl font-light text-soft-white">{title}</h3>
                <p className="font-sans text-sm leading-relaxed text-soft-white/60">{body}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured experiences (from DB) ── */}
      {featuredExperiences.length > 0 && (
        <section
          className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24"
          aria-label="Featured experiences"
        >
          <AnimatedSection className="mb-12">
            <SectionHeader
              eyebrow="Featured"
              title="Hand-picked for you"
              subtitle="Our most popular experiences this season."
            />
          </AnimatedSection>
          <CategoryGrid columns={3}>
            {featuredExperiences.map((exp) => (
              <CategoryCard
                key={exp.id}
                title={exp.title}
                tagline={exp.tagline ?? undefined}
                imageUrl={
                  exp.image_url ??
                  'https://images.unsplash.com/photo-1504735689966-4f12eb87a84e?w=900&q=85'
                }
                bookingConfig={{
                  serviceType: exp.category,
                  serviceName: exp.title,
                  sourcePage: '/',
                }}
                badge={exp.price_from ? `From €${exp.price_from}` : undefined}
              />
            ))}
          </CategoryGrid>
        </section>
      )}

      {/* ── Blog preview ── */}
      {latestPosts.length > 0 && (
        <section className="bg-sandstone/50 py-16 md:py-20" aria-label="Latest from the blog">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <AnimatedSection className="mb-12 flex items-end justify-between gap-6">
              <SectionHeader eyebrow="Ibiza Guide" title="Tips & inspiration" align="left" />
              <Link
                href="/blog"
                className="hidden shrink-0 rounded-full border border-midnight/20 px-5 py-2.5 font-sans text-sm font-medium text-midnight transition-colors hover:bg-midnight hover:text-soft-white md:inline-block"
              >
                All articles →
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {latestPosts.map((post) => (
                <AnimatedSection key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {post.cover_image && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div>
                      {post.category && (
                        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-teal">
                          {post.category}
                        </span>
                      )}
                      <h3 className="mt-1 font-serif text-xl font-light text-midnight transition-colors group-hover:text-teal">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-1.5 line-clamp-2 font-sans text-sm leading-relaxed text-midnight/60">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/blog"
                className="rounded-full border border-midnight/20 px-6 py-2.5 font-sans text-sm font-medium text-midnight"
              >
                All articles →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Cross-sell banner ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <AnimatedSection>
          <CrossSellBanner triggerPage="/" fromPrice={500} />
        </AnimatedSection>
      </section>
    </>
  )
}
