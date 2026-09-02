import { MessageCircle } from 'lucide-react'
import {
  BEACH_AREAS,
  BEACH_CLOSING_NOTE,
  BEACH_CTA,
  BEACH_HEADING,
  BEACH_HOW_IT_WORKS,
  BEACH_INTRO,
  BEACH_LABELS,
} from '@/lib/beach-clubs'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Beach clubs and sunbeds, grouped by area and rendered as real ordered lists.
 *
 * Shaped the same way as SailingRoutes: each area is its own <section> with an
 * <h2>, and every club is an <h3> inside a genuine <ol>. A crawler that strips
 * CSS still reads "area → clubs in order → honest caveat", which is the shape
 * answer engines lift most reliably. Divs styled to look like a list lose all
 * of that.
 *
 * All copy lives in @/lib/beach-clubs, where the guardrails are documented:
 * these are real third-party businesses, so there are no prices, no bed rates,
 * no opening hours and — deliberately — no outbound links to their sites. A
 * wrong or dead URL for someone else's business is worse than no URL, and we
 * are not their reseller: the copy says plainly that beds are reserved with the
 * club itself and that our part is planning the day.
 *
 * Contrast note: this whole block sits on white and the legacy theme sets a
 * near-white link colour (measured at 1.09:1 on white). The only <a> here is
 * the WhatsApp button, which sits on a dark pill with text-white. Any link
 * added later must carry an explicit text-neutral-900, and body copy never goes
 * lighter than text-black/60.
 */
export function BeachClubs({ locale }: { locale: string }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(BEACH_CTA.prefill[l])}`

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">
          {BEACH_HEADING[l]}
        </h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">
          {BEACH_INTRO[l]}
        </p>
        <p className="mt-4 max-w-3xl rounded-2xl border border-black/10 bg-neutral-50 px-5 py-4 text-[14px] leading-relaxed text-neutral-600">
          {BEACH_HOW_IT_WORKS[l]}
        </p>

        <div className="mt-10 space-y-8">
          {BEACH_AREAS.map((area, ai) => (
            <section
              key={area.id}
              id={`area-${area.id}`}
              className="rounded-2xl border border-black/10 bg-neutral-50 p-6 md:p-8"
            >
              <span className="font-serif text-[13px] font-bold uppercase tracking-widest text-gold">
                {String(ai + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-1 font-serif text-xl font-black leading-snug tracking-tight text-neutral-900 md:text-2xl">
                {area.title[l]}
              </h2>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-neutral-600">
                {area.intro[l]}
              </p>

              <ol className="mt-6 list-none space-y-5 border-t border-black/10 pt-6">
                {/* scroll-mt-24 was 96px en dus kleiner dan de vaste balk (116px
                    mobiel, 134px desktop): een #club-anker landde erachter.
                    --nav-h is de enige juiste bron voor die hoogte. */}
                {area.clubs.map((club, ci) => (
                  <li key={club.id} id={`club-${club.id}`} className="flex scroll-mt-[calc(var(--nav-h)+12px)] gap-4">
                    <span
                      aria-hidden
                      className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/10 bg-white font-serif text-[12px] font-bold text-gold"
                    >
                      {ci + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-serif text-base font-bold leading-snug text-neutral-900 md:text-lg">
                        {club.name}
                      </h3>
                      <p className="mt-1 text-[13px] font-semibold uppercase tracking-wide text-neutral-500">
                        {BEACH_LABELS.beach[l]}: {club.beach}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">
                        {club.blurb[l]}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">
                        <span className="font-serif font-bold text-neutral-900">
                          {BEACH_LABELS.suits[l]}:{' '}
                        </span>
                        {club.suits[l]}
                      </p>
                      <p className="mt-2.5 rounded-xl border-l-2 border-gold bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-neutral-600">
                        <span className="font-serif text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                          {BEACH_LABELS.note[l]}
                        </span>
                        <br />
                        {club.note[l]}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-neutral-500">
          {BEACH_CLOSING_NOTE[l]}
        </p>

        {/* WhatsApp CTA — dark pill, text-white, so the legacy link colour never applies. */}
        <div className="mt-10 rounded-3xl border border-black/10 bg-neutral-50 p-6 md:p-8">
          <h2 className="font-serif text-xl font-black tracking-tight text-neutral-900 md:text-2xl">
            {BEACH_CTA.heading[l]}
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-neutral-600">
            {BEACH_CTA.body[l]}
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-black"
          >
            <MessageCircle size={16} aria-hidden />
            {BEACH_CTA.button[l]}
          </a>
        </div>
      </div>
    </section>
  )
}
