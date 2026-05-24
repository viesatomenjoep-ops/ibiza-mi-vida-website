import type { Metadata } from 'next'
import { Hero } from '@/components/hero/Hero'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Tag } from 'lucide-react'
import { getPageContent } from '@/lib/page-content'

export const metadata: Metadata = {
  title: 'Free & Cheap Things to Do in Ibiza — Discount Passes',
  description:
    'Discover the best free and cheap things to do in Ibiza. Discount event passes, free beaches, happy hours, and budget tips from Ibiza mi vida.',
}

const freeTips = [
  { title: 'Free beaches', description: 'Ibiza has dozens of stunning public beaches. Cala Conta, Cala Bassa, and Benirras are among the best — no entry fee, ever.' },
  { title: 'Sunset at Es Vedrà', description: 'Watching the sun set behind Es Vedrà from Cala D\'Hort is one of Ibiza\'s most magical experiences. Completely free.' },
  { title: 'Ibiza Old Town (Dalt Vila)', description: 'The UNESCO World Heritage walled town is free to walk around. Perfect for an afternoon exploring history and views.' },
  { title: 'Free guestlists', description: 'Most clubs offer free early-entry guestlists. We can get you on the guestlist — completely free before a certain time.' },
  { title: 'Happy hour bar crawls', description: 'The West End in San Antonio has some of the cheapest drinks on the island during happy hours (typically 6–10pm).' },
  { title: 'Hippy markets', description: 'Las Dalias and Punta Arabí markets are free to browse. A classic Ibiza cultural experience.' },
]

export default async function FreeDiscountIbizaPage() {
  const pageContent = await getPageContent('free-discount', {
    title: "Free & Cheap Things to Do in Ibiza",
    subtitle: "Ibiza doesn't have to be expensive. Our guide to the best free beaches, free entry nights, discount passes, and budget-friendly ways to have an incredible time.",
    backgroundImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=85"
  })

  return (
    <>
      <Hero
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        backgroundImage={pageContent.backgroundImage}
        eyebrow="Budget Ibiza Guide"
        minHeight="min-h-[65vh]"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <AnimatedSection className="mb-12">
          <SectionHeader eyebrow="Free Ibiza" title="Best free experiences" subtitle="Hand-picked tips from the Ibiza mi vida team." />
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {freeTips.map(({ title, description }, i) => (
            <AnimatedSection key={title} delay={i * 0.07} className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm border border-midnight/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
                <Tag size={18} />
              </div>
              <h3 className="font-serif text-xl font-light text-midnight">{title}</h3>
              <p className="font-sans text-sm leading-relaxed text-midnight/60">{description}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection><CrossSellBanner triggerPage="/free-discount-ibiza" fromPrice={500} /></AnimatedSection>
      </section>
    </>
  )
}
