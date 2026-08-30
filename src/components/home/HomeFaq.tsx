import Link from 'next/link'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { FAQ_GROUPS } from '@/lib/faq-content'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Condensed homepage FAQ — the broadly useful subset of the sitewide FAQ.
 *
 * The strings are NOT duplicated here: we select them out of FAQ_GROUPS by
 * group id and index, so /faq and the homepage can never drift apart and the
 * FAQPage JSON-LD below can only ever claim what the page actually renders.
 *
 * Two styling rules in this file are load-bearing, both learned the hard way:
 *
 * 1. The `!bg-transparent !border-0 !px-0` overrides on <details>. globals.css
 *    carries a legacy `details{background:var(--black)}` rule (plus padding,
 *    uppercase summaries and a grey `details p`) written for a dark accordion
 *    elsewhere on the site. A bare <details> inherits all of it and renders as
 *    dark grey on near-black — measured at 1.12:1, i.e. invisible. Same fix as
 *    components/seo/PageFaq.tsx.
 * 2. Every piece of text inside a <Link> on this white section carries an
 *    explicit text-neutral-900. The legacy theme sets a near-white link colour
 *    which renders at 1.09:1 here. And never text-black/50 (3.94:1) — /60 or
 *    darker only.
 */

/** Which Q&As make the homepage cut, as [group id, index into that group]. */
const PICKS: [string, number][] = [
  ['tickets', 0], // how do I buy Ibiza club tickets
  ['tickets', 5], // can tickets sell out
  ['tickets', 6], // online vs at the door
  ['entry', 0], // opening and closing times
  ['entry', 4], // what "entry before a certain time" means
  ['guestlist', 1], // is the guestlist free
  ['boats', 4], // boat trip cancelled by weather
  ['island', 1], // getting back at night
  ['booking', 4], // cancel or refund
  ['planning', 0], // best time to visit
]

const KICKER: Record<Locale, string> = {
  nl: 'Goed om te weten',
  en: 'Good to know',
  de: 'Gut zu wissen',
  es: 'Bueno saberlo',
  fr: 'Bon à savoir',
}

const HEADING: Record<Locale, string> = {
  nl: 'Veelgestelde vragen',
  en: 'Frequently asked questions',
  de: 'Häufige Fragen',
  es: 'Preguntas frecuentes',
  fr: 'Questions fréquentes',
}

const LINK_LABEL: Record<Locale, string> = {
  nl: 'Bekijk alle veelgestelde vragen',
  en: 'See all frequently asked questions',
  de: 'Alle häufigen Fragen ansehen',
  es: 'Ver todas las preguntas frecuentes',
  fr: 'Voir toutes les questions fréquentes',
}

export function HomeFaq({ locale }: { locale?: string }) {
  const l = (LOCALES as readonly string[]).includes(locale ?? '')
    ? (locale as Locale)
    : DEFAULT_LOCALE

  const faqs = PICKS.map(([groupId, index]) => {
    const item = FAQ_GROUPS.find((g) => g.id === groupId)?.items[index]
    return item ? { q: item.q[l], a: item.a[l] } : null
  }).filter((f): f is { q: string; a: string } => f !== null)

  if (!faqs.length) return null

  return (
    <section className="border-t border-black/5 bg-white py-16 text-neutral-900">
      <FaqJsonLd faqs={faqs} />
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{KICKER[l]}</p>
        <h2 className="mt-3 font-serif text-2xl font-black tracking-tight text-neutral-900 md:text-3xl">
          {HEADING[l]}
        </h2>

        <div className="mt-7 divide-y divide-black/10 border-y border-black/10">
          {faqs.map((f, i) => (
            <details key={i} className="group !bg-transparent !border-0 !px-0 !py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-serif text-base font-bold normal-case leading-snug tracking-normal text-neutral-900 marker:hidden [&::-webkit-details-marker]:hidden [&::marker]:content-['']">
                {f.q}
                <span
                  aria-hidden
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-neutral-500 transition-transform group-open:rotate-45 group-open:border-gold group-open:text-gold"
                >
                  +
                </span>
              </summary>
              <p className="!mt-0 pb-5 pr-11 text-[15px] leading-relaxed !text-neutral-600">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href={`/${l}/faq`}
            className="inline-flex items-center gap-2 !text-neutral-900 font-serif text-sm font-black tracking-tight underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:!text-neutral-600"
          >
            <span className="text-neutral-900">{LINK_LABEL[l]}</span>
            <span aria-hidden className="text-neutral-900">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
