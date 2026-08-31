import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Visible FAQ accordion that renders an explicit array.
 *
 * Deliberately emits NO structured data of its own. The page passes the very
 * same array to <SchemaMarkup faqs={…}>, which is what makes "the schema can
 * never claim something the page does not say" true by construction rather than
 * by discipline. A component that rendered both halves from two arguments would
 * reintroduce exactly the drift this arrangement prevents — and
 * `npm run check:schema` asserts the invariant by comparing every schema answer
 * against the visible text.
 *
 * Native <details>, so the answers are in the DOM and expandable with no
 * JavaScript at all: a crawler that runs no scripts still reads every answer.
 *
 * The `!` overrides are load-bearing, inherited from PageFaq: globals.css
 * carries a legacy `details{background:var(--black)}` rule written for a dark
 * accordion elsewhere on the site, which renders these FAQs as dark grey on
 * near-black — measured at 1.12:1, i.e. invisible — unless overridden here.
 */

const HEADING: Record<Locale, string> = {
  nl: 'Veelgestelde vragen',
  en: 'Frequently asked questions',
  de: 'Häufige Fragen',
  es: 'Preguntas frecuentes',
  fr: 'Questions fréquentes',
}

export interface Faq {
  q: string
  a: string
}

export function FaqAccordion({
  faqs,
  locale,
  heading,
}: {
  faqs: Faq[]
  locale: string
  heading?: string
}) {
  if (!faqs.length) return null
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">
          {heading ?? HEADING[l]}
        </h2>
        <div className="mt-7 divide-y divide-black/8 border-y border-black/8">
          {faqs.map((f, i) => (
            <details key={i} className="group !bg-transparent !border-0 !px-0 !py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-serif text-base font-bold normal-case leading-snug tracking-normal text-neutral-900 marker:hidden">
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
      </div>
    </section>
  )
}
