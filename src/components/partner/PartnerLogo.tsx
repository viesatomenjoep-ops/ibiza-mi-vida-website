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
 *
 * ── De chip ───────────────────────────────────────────────────────────────
 * Alle drie de plekken die dit component gebruiken staan op obsidian, en
 * partners leveren doorgaans eerst hun standaardlogo: donkere letters op wit.
 * Dat rechtstreeks op een donkere kaart zetten levert een onzichtbaar logo op —
 * slechter dan de wordmark die er nu staat.
 *
 * Dus zodra we alleen een light-variant hebben en de ondergrond donker is,
 * krijgt het logo een eigen witte chip: een afgerond wit vlakje waar het merk
 * in zijn eigen kleuren op staat. Dat is hoe partnerlogo's op donkere sites
 * normaal getoond worden, het respecteert de huisstijl, en het vraagt geen
 * omgekeerde variant die we misschien nooit krijgen.
 *
 * Is er wél een `dark`-bestand, dan komt het rechtstreeks op de kaart en
 * verschijnt de chip niet — een reversed-out logo hoort vrij te staan.
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
  // Donkere ondergrond, maar alleen een logo voor lichte ondergrond: chip erom.
  const needsChip = on === 'dark' && !logo.dark && !!logo.light

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

  const img = (
    <Image
      src={src}
      alt={name}
      width={logo.width}
      height={logo.height}
      className={className ?? (needsChip ? 'h-5 w-auto object-contain' : 'h-7 w-auto object-contain')}
    />
  )

  if (!needsChip) return img

  return (
    <span className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 shadow-sm">
      {img}
    </span>
  )
}
