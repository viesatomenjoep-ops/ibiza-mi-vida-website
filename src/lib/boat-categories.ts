import { FLEET } from '@/data/fleet'

/**
 * Cover images for the five categories on the boats hub.
 *
 * The page showed a Lucide icon on a flat panel for each category, which made
 * five very different days out — a DJ boat party, a quiet cove cruise, a
 * private yacht, a beach shuttle, a Formentera ferry — look identical. On a hub
 * page whose only job is to send you to the right one, that is the whole
 * failure.
 *
 * ── Where the images come from ────────────────────────────────────────────
 * The same ClubTickets venue data that sits behind each link, so the picture on
 * the card belongs to something the reader will actually find when they click.
 * Private charters are the exception: those boats are ours, and their photos
 * live in src/data/fleet.ts and public/fleet.
 *
 * ── Why preferences rather than a hardcoded slug ──────────────────────────
 * A venue can leave the feed between syncs. Each category names the venues it
 * would like, in order, then falls back to any venue of the right type that has
 * a cover, and finally to nothing — in which case the card renders without an
 * image rather than with a broken one. A hardcoded slug would have produced a
 * dead <img> the first time a partner was delisted.
 */

export interface VenueLike {
  slug?: string
  name?: string
  cover?: string | null
  picture?: string | null
  type?: { slug?: string } | null
}

export type BoatCategory =
  | 'boat-party'
  | 'boat-trip'
  | 'private-boat-charters'
  | 'shuttle-ferry'
  | 'ferry-formentera'

/**
 * Preferred venues per category, most representative first.
 *
 * Chosen so the two categories that share a venue type ('boat' covers both
 * parties and excursions) never land on the same photo: a card grid where two
 * entries show the same boat tells the reader they are the same thing.
 */
const PREFERRED: Record<Exclude<BoatCategory, 'private-boat-charters'>, { type: string; slugs: string[] }> = {
  'boat-party': { type: 'boat', slugs: ['pukka-up', 'float-your-boat', 'ibiza-cruise-crush'] },
  'boat-trip': { type: 'boat', slugs: ['the-beach-hopper', 'excursiones-ibiza', 'chilli-pepper-boats'] },
  'shuttle-ferry': { type: 'formentera-day-trip', slugs: ['santa-eularia-ferry', 'cruceros-portmany', 'aquabus'] },
  'ferry-formentera': { type: 'formentera-day-trip', slugs: ['aquabus', 'barco-a-formentera-ulises-cat', 'balearia'] },
}

/** `cover` is the wide crop; `picture` is the fallback where a venue has none. */
const imageOf = (v: VenueLike): string | null => v.cover || v.picture || null

/**
 * A representative photo for the private fleet.
 *
 * Prefers a yacht, because that is what the card promises ("from affordable day
 * boats to luxury yachts") and the yacht is the half people cannot picture.
 */
function fleetCover(): string | null {
  const yacht = FLEET.find((b) => (b as any).category === 'yacht' && (b as any).image)
  const any = FLEET.find((b) => (b as any).image)
  return ((yacht || any) as any)?.image ?? null
}

export function categoryCover(category: BoatCategory, venues: VenueLike[]): string | null {
  if (category === 'private-boat-charters') return fleetCover()

  const spec = PREFERRED[category]
  const ofType = venues.filter((v) => v.type?.slug === spec.type && imageOf(v))

  for (const slug of spec.slugs) {
    const hit = ofType.find((v) => v.slug === slug)
    if (hit) return imageOf(hit)
  }
  return ofType.length ? imageOf(ofType[0]) : null
}

/** All five covers in one call, for the hub page. */
export function boatCategoryCovers(venues: VenueLike[]): Record<BoatCategory, string | null> {
  return {
    'boat-party': categoryCover('boat-party', venues),
    'boat-trip': categoryCover('boat-trip', venues),
    'private-boat-charters': categoryCover('private-boat-charters', venues),
    'shuttle-ferry': categoryCover('shuttle-ferry', venues),
    'ferry-formentera': categoryCover('ferry-formentera', venues),
  }
}
