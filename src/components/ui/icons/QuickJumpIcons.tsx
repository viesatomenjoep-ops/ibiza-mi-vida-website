/**
 * Icon set for the mobile quick-jump strip.
 *
 * ── Why these are drawn by hand ───────────────────────────────────────────
 * The strip used to run on six stock lucide glyphs (CalendarDays, Music,
 * Sailboat, ListChecks, MessageCircle, Smartphone). Two problems with that.
 *
 * First, half of them were semantically wrong: ListChecks is a to-do list, not
 * a deal; Music is a quaver, not a nightclub; Sailboat is a dinghy, and this
 * business charters motor yachts. An icon that depicts the wrong noun makes a
 * user hesitate, and hesitation on a six-tile grid is the whole cost.
 *
 * Second, six unrelated library glyphs dropped into six identical tinted
 * squares is the visual signature of a template. What makes a set read as
 * *designed* rather than *assembled* is shared construction, so every icon
 * here is built on the same rules:
 *
 *   • 24×24 viewBox, artwork kept inside a ~19×19 optical box
 *   • 1.75 stroke, round caps and joins, no fills except where noted
 *   • currentColor throughout, so the strip themes itself
 *   • one filled accent per icon — the lit date, the ceiling mount, the
 *     porthole, the map dot — giving the set a common focal signature
 *
 * The one deliberate exception is Concierge, which uses WhatsApp's real mark
 * rather than an abstract stand-in. The tile opens wa.me; showing the actual
 * brand tells the user what happens when they tap it, which beats consistency.
 * Solid marks read optically larger than stroked ones at the same box size, so
 * the strip renders it a couple of px smaller to match — see HomeMobileAppStrip.
 *
 * Everything is sized to survive at 20–26px. That budget is roughly six strokes
 * per icon, which is why none of them carry decorative detail.
 */

interface IconProps {
  size?: number
  className?: string
}

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className,
  'aria-hidden': true,
  focusable: 'false' as const,
})

/**
 * Agenda — a calendar with a single date filled in, rather than lucide's grid
 * of six identical dots. The point of this page is one night at a time.
 */
export function AgendaIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 2.6v3.4M16 2.6v3.4M3 9.6h18" />
      <rect x="6.6" y="12.4" width="4.2" height="3.4" rx="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * Clubs — a PA cabinet. This was drawn as a mirror ball first, which was the
 * obvious choice and the wrong one: a sphere carrying one meridian and one
 * equator is exactly how a globe is drawn, so under a "CLUBS" label it read as
 * "language". Adding facets to rescue it is not an option, because at 26px the
 * extra curves close up against the outline and turn to mush.
 *
 * A speaker survives the size and is true to the subject — Ibiza's clubs are
 * known for their sound systems. It is drawn upright, with a large woofer low
 * and a small tweeter high: laid on its side, a cabinet holding two equal
 * circles reads as a cassette instead. The cabinet is deliberately squatter and
 * squarer-cornered than the phone in AppIcon so the two silhouettes stay apart.
 */
export function ClubsIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="4.8" y="3.2" width="14.4" height="17.6" rx="1.8" />
      <circle cx="12" cy="14.4" r="3.6" />
      <circle cx="12" cy="7" r="1.5" />
      <circle cx="12" cy="14.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * Boats — a motor yacht in profile with a waterline, not a sailing dinghy. The
 * wave echoes the wordmark and is what stops this reading as stock clip-art.
 */
export function BoatsIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M2.8 12.8h18.4l-2.4 4.2a1.4 1.4 0 0 1-1.2.7H7.2a1.4 1.4 0 0 1-1.2-.7Z" />
      <path d="M7.8 12.8V9.2a1 1 0 0 1 1-1h4.4a1 1 0 0 1 .84.46l2.66 4.14" />
      <path d="M2.4 20.6q2.4-2.6 4.8 0t4.8 0t4.8 0t4.8 0" />
      <circle cx="10.4" cy="10.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * Package deals — a ticket: side notches and a perforated stub. Reads as
 * "something you buy and are handed", which ListChecks never did.
 */
export function DealsIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M5 6.6h14a2 2 0 0 1 2 2v1.2a2.4 2.4 0 0 0 0 4.8v1.2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.2a2.4 2.4 0 0 0 0-4.8V8.6a2 2 0 0 1 2-2Z" />
      <path d="M15.4 8.2v1.6M15.4 11.4v1.6M15.4 14.6v1.6" />
      <circle cx="8.6" cy="12.2" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * App — a phone showing a pin, because /m is a map-first mini app. A bare
 * handset would only have said "mobile", which the user already knows.
 */
export function AppIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="5.6" y="2.4" width="12.8" height="19.2" rx="2.6" />
      <path d="M10.4 5.2h3.2" />
      <path d="M12 8.6a2.7 2.7 0 0 1 2.7 2.7c0 2-2.7 4.8-2.7 4.8s-2.7-2.8-2.7-4.8A2.7 2.7 0 0 1 12 8.6Z" />
      <circle cx="12" cy="11.3" r="0.95" fill="currentColor" stroke="none" />
    </svg>
  )
}
