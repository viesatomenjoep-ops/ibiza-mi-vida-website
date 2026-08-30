import { ArrowUpRight } from 'lucide-react'

/**
 * Circular arrow affordance.
 *
 * Static by design. This used to hold two arrows and animate a "launch" on
 * hover: one slid out through the top-right corner while a second entered from
 * the bottom-left, so the icon appeared to travel without ever leaving the
 * circle. It was removed on request — a card that already lifts and changes
 * colour on hover does not also need its icon to move, and across a grid of
 * cards the effect fired on whichever one the cursor happened to cross, which
 * reads as restlessness rather than as response.
 *
 * The colour transition stays: that is feedback, not decoration.
 *
 * aria-hidden because this sits on top of a link or button that already
 * carries its own accessible name.
 */
export function ArrowCircle({
  size = 48,
  className = '',
  iconSize = 20,
}: {
  /** Diameter in px. */
  size?: number
  /** Extra classes for colour/state — layout is handled here. */
  className?: string
  iconSize?: number
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full transition-colors ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <ArrowUpRight size={iconSize} strokeWidth={2.4} />
    </span>
  )
}
