import { WATER_FACTS } from '@/lib/water-facts'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Compact comparison table for the water pages.
 *
 * The agenda widget answers "what is on"; this answers "which of these is the
 * one for me", which is the question a visitor actually arrives with — and the
 * question an answer engine gets asked. Comparison tables are extracted and
 * quoted disproportionately often, so this renders genuine <table> markup with
 * a <caption>, a <thead> and scoped headers rather than a grid of divs: the
 * relationship between a cell and its column has to survive being read without
 * the CSS.
 *
 * All content lives in @/lib/water-facts, under the same factual guardrails as
 * the per-page FAQ — no invented prices, times, capacities or operator names.
 */
export function QuickFacts({ pageKey, locale }: { pageKey: string; locale: string }) {
  const table = WATER_FACTS[pageKey]
  if (!table?.rows.length) return null

  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">
          {table.heading[l]}
        </h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">
          {table.intro[l]}
        </p>

        {/* Horizontal scroll on phones beats squeezing five columns into 360px. */}
        <div className="mt-7 overflow-x-auto rounded-2xl border border-black/8 bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left text-[14px]">
            <caption className="sr-only">{table.caption[l]}</caption>
            <thead>
              <tr className="border-b border-black/8 bg-neutral-50">
                {table.columns.map((c, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-3.5 font-serif text-[13px] font-bold uppercase tracking-wide text-neutral-500"
                  >
                    {c[l]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/8">
              {table.rows.map((row, ri) => (
                <tr key={ri} className="align-top">
                  {row.map((cell, ci) =>
                    ci === 0 ? (
                      <th
                        key={ci}
                        scope="row"
                        className="px-4 py-4 font-serif text-[15px] font-bold leading-snug text-gold"
                      >
                        {cell[l]}
                      </th>
                    ) : (
                      <td key={ci} className="px-4 py-4 leading-relaxed text-neutral-600">
                        {cell[l]}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-neutral-500">
          {table.note[l]}
        </p>
      </div>
    </section>
  )
}
