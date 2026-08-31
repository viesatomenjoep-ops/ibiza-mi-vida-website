import Image from 'next/image'
import { PARTNER_LOGOS } from '@/lib/partners'

/**
 * A partner's logo, or their name set as a wordmark until the file exists.
 *
 * The fallback is the point. Every surface that names a partner can call this
 * today and get exactly what it renders now; the moment a real logo lands in
 * `public/partners/` and PARTNER_LOGOS is filled in, all of them switch over
 * at once with no further edits. That beats scattering <Image> tags across
 * nineteen call sites and having to find them all later.
 *
 * There is deliberately no drawn-by-hand approximation behind the fallback — a
 * traced or re-typeset logo is a trademark problem, not a placeholder. Plain
 * text set in our own type is honest about being our text.
 *
 * `on` picks which variant to use: 'dark' for our obsidian cards, 'light' for
 * white sections. A brand that only supplies one gets that one, and if neither
 * exists the wordmark carries the colour instead.
 */

export function PartnerLogo({
  partner,
  name,
  on = 'dark',
  className,
}: {
  partner: keyof typeof PARTNER_LOGOS
  /** Written name, used for the alt text and as the fallback wordmark. */
  name: string
  on?: 'dark' | 'light'
  className?: string
}) {
  const logo = PARTNER_LOGOS[partner]
  const src = on === 'dark' ? logo.dark ?? logo.light : logo.light ?? logo.dark

  if (!src) {
    return (
      <span
        className={
          className ??
          `text-[11px] font-bold uppercase tracking-[0.2em] ${on === 'dark' ? 'text-gold-soft' : 'text-gold'}`
        }
      >
        {name}
      </span>
    )
  }

  return (
    <Image
      src={src}
      alt={name}
      width={logo.width}
      height={logo.height}
      className={className ?? 'h-7 w-auto object-contain'}
    />
  )
}
