// Approximate, stylised positions of Ibiza's main clubbing venues on the
// interactive island map used by the Events explorer. Values are percentages
// (0–100) relative to the map container; they are NOT precise GPS coordinates
// but are grouped by real-world area (San Antonio = west, Playa d'en Bossa =
// south, Ibiza Town / Marina = south-east, San Rafael = centre).

export interface VenueSpot {
  x: number // % from left
  y: number // % from top
  color: string // accent used for the pin ring / glow
  area: string // human label for the cluster
}

export const VENUE_SPOTS: Record<string, VenueSpot> = {
  // ── West coast · San Antonio ─────────────────────────────
  'o-beach-ibiza': { x: 24, y: 39, color: '#22D3EE', area: 'San Antonio Bay' },
  'es-paradis': { x: 20, y: 47, color: '#A855F7', area: 'San Antonio' },
  'eden-ibiza': { x: 25, y: 52, color: '#F43F5E', area: 'San Antonio' },
  'ibiza-rocks': { x: 29, y: 57, color: '#F59E0B', area: 'San Antonio' },
  'baloo': { x: 17, y: 58, color: '#38BDF8', area: 'Cala de Bou' },

  // ── Centre · San Rafael ──────────────────────────────────
  'unvrs-ibiza': { x: 49, y: 45, color: '#14FF00', area: 'San Rafael' },
  'swag': { x: 43, y: 59, color: '#EC4899', area: 'Ibiza' },

  // ── South-east · Ibiza Town / Marina ─────────────────────
  'lio': { x: 76, y: 57, color: '#FACC15', area: 'Marina Botafoch' },
  'club-chinois-ibiza': { x: 72, y: 62, color: '#F97316', area: 'Ibiza Town' },
  'teatro-pereyra': { x: 67, y: 60, color: '#E11D48', area: 'Ibiza Town' },

  // ── South · Playa d'en Bossa ─────────────────────────────
  'ushuaia-ibiza': { x: 61, y: 72, color: '#34D399', area: "Playa d'en Bossa" },
  'hi-ibiza': { x: 66, y: 75, color: '#818CF8', area: "Playa d'en Bossa" },
  '528-ibiza': { x: 56, y: 70, color: '#FB7185', area: "Playa d'en Bossa" },
  'playa-soleil': { x: 60, y: 78, color: '#2DD4BF', area: "Playa d'en Bossa" },
  'bambuku-ibiza': { x: 64, y: 80, color: '#C084FC', area: "Playa d'en Bossa" },
}

// A smooth, stylised silhouette of Ibiza (viewBox 0 0 100 100).
export const IBIZA_ISLAND_PATH =
  'M 68 18 C 80 20, 89 30, 88 44 C 87 57, 82 67, 73 76 C 64 84, 54 88, 44 86 C 33 84, 24 78, 18 68 C 12 58, 11 47, 17 38 C 23 29, 33 22, 45 19 C 53 17, 61 16, 68 18 Z'

export function getVenueSpot(slug?: string): VenueSpot | undefined {
  if (!slug) return undefined
  return VENUE_SPOTS[slug]
}
