import { ArrowRight } from 'lucide-react'

/**
 * Circular arrow affordance with a "launch" hover.
 *
 * On hover the arrow slides up and out of the circle while an identical arrow
 * rises from below to take its place, so the icon appears to travel without
 * ever leaving the circle. Moving away reverses it. The motion is pure CSS
 * (`.arrow-swap` in globals.css) driven by a `.group` ancestor, so it also
 * fires when the user hovers the whole card rather than just the circle.
 *
 * Both copies are aria-hidden: this is decoration on top of a link or button
 * that already carries its own accessible name.
 */
export function ArrowCircle({
  size = 48,
  className = '',
  iconSize = 20,
}: {
  /** Diameter in px. */
  size?: number
  /** Extra classes for colour/state — the layout and motion are handled here. */
  className?: string
  iconSize?: number
}) {
  return (
    <span
      className={`arrow-swap grid shrink-0 rounded-full transition-colors ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <ArrowRight size={iconSize} strokeWidth={2.4} />
      <ArrowRight size={iconSize} strokeWidth={2.4} />
    </span>
  )
}
