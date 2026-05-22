import type { Metadata } from 'next'
import { Hero } from '@/components/hero/Hero'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ibiza Club Guestlist — Free Entry & Priority Access',
  description:
    'Get on the Ibiza club guestlist for free entry and priority access. Ibiza mi vida gives you access to guestlists at all major Ibiza venues. Book via WhatsApp.',
}

const faqs = [
  { q: 'What is a guestlist?', a: 'A guestlist gives you free or discounted entry to a club, often with priority access past the queue. Most venues offer guestlist for the first hour or two of the night.' },
  { q: 'Which clubs can I get on the guestlist for?', a: 'We have guestlist access at many of Ibiza\'s best clubs including Amnesia, Pacha, Hi Ibiza, Ushaia, and more. Contact us for current availability.' },
  { q: 'How do I get on the guestlist?', a: 'Simply message us on WhatsApp with your name, the venue, and the date. We\'ll confirm your spot within minutes.' },
  { q: 'Is guestlist always free?', a: 'For most nights, guestlist means free entry before a certain time. Some events may have a reduced ticket price instead of free entry.' },
]

const benefits = [
  'Free or discounted entry',
  'Priority queue access',
  'Instant WhatsApp confirmation',
  'Available at all major venues',
  'No hidden fees',
  'Change your plans easily',
]

export default function GuestlistPage() {
  return (
    <>
      <Hero
        title="Ibiza Club Guestlist"
        subtitle="Skip the queue and skip the full price. We get you on the guestlist at Ibiza's best clubs — free entry, priority access, instant confirmation."
        backgroundImage="https://images.unsplash.com/photo-1571266028243-e4d811c95a1f?w=1920&q=85"
        eyebrow="Free Entry Ibiza"
        minHeight="min-h-[65vh]"
      />

      {/* Benefits */}
      <section className="bg-sandstone/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <CheckCircle size={16} className="shrink-0 text-teal" />
                <span className="font-sans text-sm text-midnight/70">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <AnimatedSection className="mb-12">
          <SectionHeader eyebrow="How It Works" title="Guestlist made simple" subtitle="Three steps to free entry at the best clubs in Ibiza." />
        </AnimatedSection>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { step: '01', title: 'Choose your club & date', body: 'Tell us which venue you want and when you\'re going. We\'ll check guestlist availability.' },
            { step: '02', title: 'We add your name', body: 'Your full name goes on the door list. It\'s that simple — no ticket, no voucher, just your name.' },
            { step: '03', title: 'Walk in for free', body: 'Arrive before the guestlist closes, give your name at the door, and walk straight in.' },
          ].map(({ step, title, body }) => (
            <AnimatedSection key={step}>
              <span className="font-serif text-5xl font-light text-teal/30">{step}</span>
              <h3 className="mt-2 font-serif text-2xl font-light text-midnight">{title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-midnight/60">{body}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-midnight py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <AnimatedSection className="mb-12 text-center">
            <SectionHeader eyebrow="FAQ" title="Common questions" light />
          </AnimatedSection>
          <div className="flex flex-col gap-6">
            {faqs.map(({ q, a }) => (
              <AnimatedSection key={q}>
                <h3 className="font-serif text-xl font-light text-soft-white">{q}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-soft-white/60">{a}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <AnimatedSection><CrossSellBanner triggerPage="/guestlist" fromPrice={500} /></AnimatedSection>
      </section>
    </>
  )
}
