import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPriceStats } from '@/lib/price-stats'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { AuthorByline } from '@/components/seo/AuthorByline'
import {
  KICKER, TITLE, META_TITLE, metaDescription, answer,
  H_VENUES, H_CATEGORIES, H_NOT_INCLUDED, H_METHOD,
  TH_VENUE, TH_TYPICAL, TH_RANGE, TH_DATES,
  CATEGORY_LABEL, FROM_LABEL, notIncluded, method, faqs,
} from '@/lib/price-page-copy'

export const revalidate = 3600

const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const l = loc(params.locale)
  const stats = await getPriceStats(params.locale)
  return pageMetadata({
    locale: l,
    path: 'ibiza-prices',
    title: META_TITLE[l] || META_TITLE.en,
    // Falls back to the title when there is no data, rather than shipping a
    // description with holes where the numbers should be.
    description: stats ? metaDescription(stats, l) : META_TITLE[l] || META_TITLE.en,
  })
}

/**
 * "What does a night out in Ibiza cost?" — answered by counting.
 *
 * This is the one question about Ibiza that gets asked constantly and answered
 * almost entirely by guesswork. We hold the dated agenda for every major venue
 * on the island with advertised prices attached, so we can answer it from data
 * instead of repeating a figure someone published in 2019. That is the point:
 * a page that says what ten other pages already say gives an answer engine no
 * reason to cite it, and gives a visitor no reason to trust it.
 *
 * Three structural choices, all for the same reason — this page is written to
 * be read by extraction, not just by people:
 *
 *  • The answer is the first paragraph. No hero copy, no brand voice ahead of
 *    it. One claim per sentence, each figure next to its own scope, and the
 *    "tickets only" caveat attached rather than buried, so that quoting half
 *    of it still quotes something true.
 *  • The FAQs render open as plain headings and paragraphs instead of a
 *    <details> accordion. Partly so a crawler that runs no JavaScript reads
 *    them, partly because globals.css carries a legacy
 *    `details{background:var(--black)}` rule that has already rendered two
 *    other FAQ blocks on this site as near-black text on near-black.
 *  • A real <table>, not a grid of divs, because the rows are genuinely
 *    tabular and parse cleanly as such.
 *
 * Everything on the page is computed at request time. There is no path here
 * for a hardcoded price to creep in and quietly go stale.
 */
export default async function IbizaPricesPage({ params }: { params: { locale: string } }) {
  const l = loc(params.locale)
  const stats = await getPriceStats(params.locale)

  // No data means no page. An empty price page is worse than a 404: the title
  // and the meta description still promise measured figures, the URL is still
  // in the sitemap, and an answer engine arriving on it is invited to cite a
  // number that is not there.
  //
  // This block used to say exactly that in a comment and then render a bare
  // <h1> anyway — the failure mode it warned about, shipped. getPriceStats()
  // returns null whenever the feed is empty or nothing is left in the agenda,
  // so this fires on its own the moment the season runs out, silently, on the
  // best-performing page on the site.
  if (!stats) notFound()

  const questions = faqs(stats, l)

  return (
    <main className="bg-white text-neutral-900">
      <BreadcrumbJsonLd
        locale={l}
        items={[{ name: homeLabel(l), path: `${l}` }, { name: TITLE[l] || TITLE.en }]}
      />
      <FaqJsonLd faqs={questions} />

      {/* ── The answer, first ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-[calc(var(--nav-h)+48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
          {KICKER[l] || KICKER.en}
        </p>
        <h1 className="mt-3 font-serif text-[2rem] font-black leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
          {TITLE[l] || TITLE.en}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-neutral-800">
          {answer(stats, l)}
        </p>
      </section>

      {/* ── Per club ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="font-serif text-2xl font-black tracking-tight">{H_VENUES[l] || H_VENUES.en}</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/15 text-[11px] font-black uppercase tracking-widest text-neutral-600">
                <th scope="col" className="py-2 pr-3 font-black">{TH_VENUE[l] || TH_VENUE.en}</th>
                <th scope="col" className="py-2 px-3 font-black">{TH_TYPICAL[l] || TH_TYPICAL.en}</th>
                <th scope="col" className="py-2 px-3 font-black">{TH_RANGE[l] || TH_RANGE.en}</th>
                <th scope="col" className="py-2 pl-3 text-right font-black">{TH_DATES[l] || TH_DATES.en}</th>
              </tr>
            </thead>
            <tbody>
              {stats.venues.map(v => (
                <tr key={v.slug} className="border-b border-black/5">
                  <th scope="row" className="py-2.5 pr-3 font-semibold">
                    <Link href={`/${l}/club-tickets/${v.slug}`} className="text-neutral-900 underline decoration-black/20 underline-offset-2 hover:decoration-ibiza-green">
                      {v.name}
                    </Link>
                  </th>
                  <td className="py-2.5 px-3 font-black tabular-nums text-ibiza-green">€{v.median}</td>
                  <td className="py-2.5 px-3 tabular-nums text-neutral-600">€{v.min}–€{v.max}</td>
                  <td className="py-2.5 pl-3 text-right tabular-nums text-neutral-500">{v.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Other categories ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="font-serif text-2xl font-black tracking-tight">{H_CATEGORIES[l] || H_CATEGORIES.en}</h2>
        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {stats.categories.map(c => (
            <div key={c.key} className="rounded-2xl bg-ibiza-mint px-5 py-4">
              <dt className="text-sm font-bold text-neutral-800">
                {CATEGORY_LABEL[c.key]?.[l] || CATEGORY_LABEL[c.key]?.en || c.key}
              </dt>
              <dd className="mt-1 font-serif text-2xl font-black tabular-nums text-ibiza-green">
                €{c.median}
                <span className="ml-2 font-sans text-xs font-semibold text-neutral-600">
                  · {FROM_LABEL[l] || FROM_LABEL.en} €{c.min} · n={c.n}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── What is not included ──────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="font-serif text-2xl font-black tracking-tight">{H_NOT_INCLUDED[l] || H_NOT_INCLUDED.en}</h2>
        <p className="mt-4 leading-relaxed text-neutral-700">{notIncluded(l)}</p>
      </section>

      {/* ── FAQs, rendered open ───────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="font-serif text-2xl font-black tracking-tight">
          {({ nl: 'Veelgestelde vragen', en: 'Frequently asked questions', de: 'Häufige Fragen', es: 'Preguntas frecuentes', fr: 'Questions fréquentes' } as Record<string, string>)[l] || 'Frequently asked questions'}
        </h2>
        <div className="mt-5 space-y-6">
          {questions.map(f => (
            <div key={f.q}>
              <h3 className="font-serif text-lg font-black leading-snug">{f.q}</h3>
              <p className="mt-1.5 leading-relaxed text-neutral-700">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Method ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-14">
        <h2 className="font-serif text-2xl font-black tracking-tight">{H_METHOD[l] || H_METHOD.en}</h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">{method(stats, l)}</p>
      </section>

      <AuthorByline locale={l} topic="Ibiza prices" />
    </main>
  )
}
