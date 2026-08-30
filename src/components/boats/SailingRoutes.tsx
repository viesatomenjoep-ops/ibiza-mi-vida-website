import {
  ROUTES_HEADING,
  ROUTES_INTRO,
  ROUTES_NOTE,
  ROUTE_LABELS,
  SAILING_ROUTES,
} from '@/lib/sailing-routes'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * The three classic day routes from Ibiza, rendered as real ordered lists.
 *
 * This block exists for the question a visitor arrives with once they accept
 * that a private boat is affordable: "where would we actually go?" — and it is
 * shaped for the way answer engines read a page. Each route is its own
 * <section> with an <h2>, and every stop is an <h3> inside a genuine <ol>, so
 * the sequence survives being read without CSS: a crawler that strips styling
 * still gets "route → ordered stops → practical caveat" in the right order.
 * Divs styled to look like a numbered list would lose all of that.
 *
 * All content lives in @/lib/sailing-routes under the same factual guardrails
 * as the per-page FAQ: no invented prices, distances, sailing times, depths or
 * mooring fees, no named third-party businesses, and several passages that
 * state plainly when a bay does not work.
 *
 * Contrast note: this section sits on white, and the legacy theme sets a
 * near-white link colour. Any <a> added here must carry an explicit
 * text-neutral-900 (or sit on a dark pill with text-white) — never rely on the
 * inherited colour, and never use text-black/50 or lighter for body copy.
 */
export function SailingRoutes({ locale }: { locale: string }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">
          {ROUTES_HEADING[l]}
        </h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">
          {ROUTES_INTRO[l]}
        </p>

        <div className="mt-10 space-y-8">
          {SAILING_ROUTES.map((route, ri) => (
            <section
              key={route.id}
              id={`route-${route.id}`}
              className="rounded-2xl border border-black/10 bg-neutral-50 p-6 md:p-8"
            >
              <span className="font-serif text-[13px] font-bold uppercase tracking-widest text-gold">
                {String(ri + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-1 font-serif text-xl font-black leading-snug tracking-tight text-neutral-900 md:text-2xl">
                {route.title[l]}
              </h2>

              <p className="mt-3 text-[14px] leading-relaxed text-neutral-600">
                <span className="font-serif font-bold text-neutral-900">
                  {ROUTE_LABELS.suits[l]}:{' '}
                </span>
                {route.suits[l]}
              </p>

              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-neutral-600">
                {route.intro[l]}
              </p>

              <p className="mt-6 border-t border-black/10 pt-5 font-serif text-[12px] font-bold uppercase tracking-widest text-neutral-500">
                {ROUTE_LABELS.stops[l]}
              </p>
              <ol className="mt-4 list-none space-y-5">
                {route.stops.map((stop, si) => (
                  <li key={stop.name} className="flex gap-4">
                    <span
                      aria-hidden
                      className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/10 bg-white font-serif text-[12px] font-bold text-gold"
                    >
                      {si + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-serif text-base font-bold leading-snug text-neutral-900 md:text-lg">
                        {stop.name}
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">
                        {stop.blurb[l]}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">
                        <span className="font-serif font-bold text-neutral-900">
                          {ROUTE_LABELS.why[l]}:{' '}
                        </span>
                        {stop.why[l]}
                      </p>
                      <p className="mt-2.5 rounded-xl border-l-2 border-gold bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-neutral-600">
                        <span className="font-serif text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                          {ROUTE_LABELS.note[l]}
                        </span>
                        <br />
                        {stop.note[l]}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-6 border-t border-black/10 pt-4 text-[13px] leading-relaxed text-neutral-500">
                {route.note[l]}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-neutral-500">
          {ROUTES_NOTE[l]}
        </p>
      </div>
    </section>
  )
}
