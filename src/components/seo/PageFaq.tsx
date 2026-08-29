import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { PAGE_FAQ } from '@/lib/page-faq'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

const HEADING: Record<Locale, string> = {
  nl: 'Veelgestelde vragen',
  en: 'Frequently asked questions',
  de: 'Häufige Fragen',
  es: 'Preguntas frecuentes',
  fr: 'Questions fréquentes',
}

/**
 * Per-page FAQ block: visible accordion + FAQPage structured data.
 *
 * Both halves matter and for different reasons. The markup earns FAQ rich
 * results in Google, while the visible prose is what answer engines actually
 * quote — LLMs reproduce question/answer pairs close to verbatim, which makes
 * a real FAQ the cheapest way onto a cited answer. Rendering the same strings
 * twice also keeps the two in sync by construction: the schema can never claim
 * something the page does not say, which is a structured-data requirement.
 *
 * Uses native <details> so the answers are in the DOM and expandable with no
 * JavaScript at all — a crawler that does not run scripts still reads them.
 */
export function PageFaq({ pageKey, locale }: { pageKey: string; locale: string }) {
  const items = PAGE_FAQ[pageKey]
  if (!items?.length) return null

  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const faqs = items.map((f) => ({ q: f.q[l], a: f.a[l] }))

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <FaqJsonLd faqs={faqs} />
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">
          {HEADING[l]}
        </h2>
        <div className="mt-7 divide-y divide-black/8 border-y border-black/8">
          {faqs.map((f, i) => (
            <details key={i} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-serif text-base font-bold leading-snug marker:hidden">
                {f.q}
                <span
                  aria-hidden
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-neutral-500 transition-transform group-open:rotate-45 group-open:border-gold group-open:text-gold"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 pr-11 text-[15px] leading-relaxed text-neutral-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
