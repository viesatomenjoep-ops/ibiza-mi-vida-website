import type { Metadata } from 'next'
import { MessageCircle } from 'lucide-react'
import { CategoryHero } from '@/components/hero/CategoryHero'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { getPageContent } from '@/lib/page-content'

export const metadata: Metadata = {
  title: 'VIP Bottle Service & Drink Packages Ibiza',
  description:
    'Book VIP bottle service and drink packages at Ibiza\'s top clubs. Champagne towers, premium spirits, and table service arranged by Ibiza mi vida. Book via WhatsApp.',
}

const packages = [
  { title: 'Entry + Drink Package', price: '€45', description: 'Club entry + 2 drinks of your choice. Perfect for a budget-conscious night out.', tags: ['Entry included', '2 drinks'] },
  { title: 'VIP Table Package', price: 'From €300', description: 'Reserved table with a bottle of premium spirits and mixers for your group.', tags: ['Table included', '1 bottle', 'Mixers', 'Up to 4 guests'] },
  { title: 'Champagne VIP', price: 'From €500', description: 'Premium VIP table with Moët & Chandon, priority entry, and dedicated service.', tags: ['Champagne', 'Priority entry', 'Dedicated host', 'Up to 6 guests'] },
]

export default async function DrinkPackagesPage() {
  const pageContent = await getPageContent('drink-package', {
    title: "VIP Bottle Service & Drink Packages Ibiza",
    subtitle: "Arrive in style. From entry + drink packages to full champagne VIP tables — we arrange everything so you can enjoy the night.",
    backgroundImage: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1920&q=85"
  })

  return (
    <>
       <div className="bg-white min-h-screen pb-20">
      <CategoryHero
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        colorTheme="gold"
        eyebrow="VIP Experience"
        minHeight="min-h-[45vh]"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <AnimatedSection className="mb-12">
          <SectionHeader eyebrow="Packages" title="Choose your package" subtitle="Every package is arranged directly with the venue. We handle the details, you enjoy the night." />
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {packages.map(({ title, price, description, tags }, i) => (
            <AnimatedSection key={title} delay={i * 0.1} className="flex flex-col gap-4 rounded-2xl border border-velvet-obsidian/10 bg-white p-6 shadow-sm">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-rustic-terracotta">{price}</p>
                <h3 className="mt-1 font-serif text-2xl font-light text-velvet-obsidian">{title}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-velvet-obsidian/60">{description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-sandstone px-3 py-1 font-sans text-xs text-velvet-obsidian/60">{tag}</span>
                ))}
              </div>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '31683052875'}?text=${encodeURIComponent(`Hi! I'm interested in the ${title} (${price}) drink package in Ibiza.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-rustic-terracotta py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-rustic-terracotta/90"
              >
                <MessageCircle size={15} />
                Enquire Now
              </a>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection><CrossSellBanner triggerPage="/drink-packages" fromPrice={500} /></AnimatedSection>
      </section>
    </div>
    </>
  )
}
