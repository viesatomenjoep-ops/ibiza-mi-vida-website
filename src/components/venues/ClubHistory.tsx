import {
  clubHistory,
  HISTORY_DISCLAIMER,
  HISTORY_HEADING,
  HISTORY_LABELS,
} from '@/lib/club-history'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Venue background, rendered on the venue detail template between the info
 * grid and the FAQ.
 *
 * Why it exists: the detail pages carry a live schedule and a supplier-fed
 * description, and nothing that answers "what actually is this place?" — the
 * question a first-time visitor and an answer engine both ask. The copy lives
 * in @/lib/club-history under strict guardrails: no founding years, no opening
 * years, no former names unless the change is universally known, no
 * capacities, no prices. A wrong founding year is precisely the kind of claim
 * that gets repeated forever, so where we are not certain the sentence is
 * simply not written.
 *
 * Renders nothing for a venue we have no entry for. That is the intended
 * behaviour: several clubbing venues in the data set are deliberately not
 * covered because we could not write about them truthfully, and an empty
 * section is better than a guessed one.
 *
 * Contrast note: this sits on white. Body copy never goes lighter than
 * text-neutral-600, and any <a> added here must carry an explicit
 * text-neutral-900 — the legacy theme's link colour renders near-white on
 * white.
 */
export function ClubHistory({ slug, locale }: { slug?: string; locale: string }) {
  const entry = clubHistory(slug)
  if (!entry) return null

  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">
          {HISTORY_HEADING[l]}
        </h2>

        <p className="mt-5 text-[15px] leading-relaxed text-neutral-600">{entry.what[l]}</p>

        <div className="mt-6 space-y-4 rounded-2xl border border-black/10 bg-neutral-50 p-6 md:p-8">
          <div>
            <h3 className="font-serif text-[12px] font-bold uppercase tracking-widest text-neutral-500">
              {HISTORY_LABELS.known[l]}
            </h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">{entry.known[l]}</p>
          </div>
          <div>
            <h3 className="font-serif text-[12px] font-bold uppercase tracking-widest text-neutral-500">
              {HISTORY_LABELS.fits[l]}
            </h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">{entry.fits[l]}</p>
          </div>
        </div>

        <p className="mt-5 rounded-xl border-l-2 border-gold bg-neutral-50 px-4 py-3 text-[14px] leading-relaxed text-neutral-600">
          <span className="font-serif text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            {HISTORY_LABELS.note[l]}
          </span>
          <br />
          {entry.note[l]}
        </p>

        <p className="mt-5 text-[13px] leading-relaxed text-neutral-500">{HISTORY_DISCLAIMER[l]}</p>
      </div>
    </section>
  )
}
