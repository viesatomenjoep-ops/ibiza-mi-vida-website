import { ArrowUpRight } from 'lucide-react'

/**
 * Circular arrow affordance with a "launch" hover.
 *
 * On hover the arrow leaves through the top-right corner while an identical
 * arrow enters from the bottom-left, so the icon appears to travel without
 * ever leaving the circle. Moving away reverses it. The motion is pure CSS
 * (`.arrow-swap` in globals.css) driven by a `.group` ancestor, so it also
 * fires when the user hovers the whole card rather than just the circle.
 *
 * The glyph and the motion are deliberately on the same diagonal. It used to
 * be a straight ArrowRight that slid vertically, which read as two unrelated
 * directions at once — the arrow pointed one way and moved another. Pointing
 * and travelling north-east makes the affordance read as a single gesture.
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
      <ArrowUpRight size={iconSize} strokeWidth={2.4} />
      <ArrowUpRight size={iconSize} strokeWidth={2.4} />
    </span>
  )
}
