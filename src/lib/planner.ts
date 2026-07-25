/**
 * Ibiza Planner — front-end data layer.
 *
 * The shapes below deliberately mirror the future MySQL schema
 * (`planner_requests` table, Docker/RDS) so that swapping the
 * localStorage mock for a real API route is a drop-in change.
 */

// ── Enums (map 1:1 to MySQL ENUM columns) ─────────────────────────────

export type Companionship = 'couple' | 'friends' | 'family'
export type Duration = '3' | '5' | '7' | '10+'
export type ArrivalMethod = 'commercial' | 'private_jet'
export type TransportOption = 'vip_van' | 'taxi' | 'car_rental' | 'scooter'
export type VipExtra =
  | 'beach_clubs'
  | 'vip_tables'
  | 'boat_charter'
  | 'massage'
  | 'private_chef'

export interface PlannerState {
  companionship: Companionship | null
  duration: Duration | null
  hasLodging: boolean | null
  selectedVilla: string | null // villa slug when hasLodging === false
  arrivalMethod: ArrivalMethod | null
  hasTransport: boolean | null
  transportOption: TransportOption | null
  extras: VipExtra[]
}

export const initialPlannerState: PlannerState = {
  companionship: null,
  duration: null,
  hasLodging: null,
  selectedVilla: null,
  arrivalMethod: null,
  hasTransport: null,
  transportOption: null,
  extras: [],
}

/** Row shape of the future `planner_requests` MySQL table. */
export interface PlannerRecord {
  uuid: string
  created_at: string // ISO timestamp (DATETIME)
  status: 'confirmed' | 'pending'
  data: PlannerState // JSON column
}

// ── Catalogs (labels used by both wizard and dashboard) ───────────────

export const COMPANIONSHIP_LABELS: Record<Companionship, string> = {
  couple: 'Couple',
  friends: 'Friends Group',
  family: 'Family',
}

export const DURATION_DAYS: Record<Duration, number> = {
  '3': 3,
  '5': 5,
  '7': 7,
  '10+': 10,
}

export const ARRIVAL_LABELS: Record<ArrivalMethod, string> = {
  commercial: 'Commercial Flight',
  private_jet: 'Private Jet',
}

export const TRANSPORT_LABELS: Record<TransportOption, string> = {
  vip_van: 'VIP Mercedes V-Class Van',
  taxi: 'Taxi',
  car_rental: 'Premium Car Rental',
  scooter: 'Scooter Rental',
}

export const EXTRA_LABELS: Record<VipExtra, string> = {
  beach_clubs: 'Beach Clubs',
  vip_tables: 'VIP Club Tables',
  boat_charter: 'Private Boat Charter',
  massage: 'In-Villa Massages',
  private_chef: 'Private Chef',
}

export interface MockVilla {
  slug: string
  name: string
  area: string
  bedrooms: number
  pricePerNight: number
  image: string
}

export const MOCK_VILLAS: MockVilla[] = [
  {
    slug: 'casa-blanca-vista',
    name: 'Casa Blanca Vista',
    area: 'Es Cubells',
    bedrooms: 5,
    pricePerNight: 2400,
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'villa-sa-talaia',
    name: 'Villa Sa Talaia',
    area: 'San José',
    bedrooms: 6,
    pricePerNight: 3100,
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'finca-del-mar',
    name: 'Finca Del Mar',
    area: 'Cala Comte',
    bedrooms: 4,
    pricePerNight: 1850,
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop',
  },
]

// ── Mock persistence (stands in for MySQL writes/reads) ───────────────

const STORAGE_PREFIX = 'imv_planner_'
const SESSION_PREFIX = 'imv_planner_session_'

export function generateUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  // RFC4122-ish fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/** Simulates `INSERT INTO planner_requests ...` and returns the UUID. */
export function createPlannerRecord(data: PlannerState): PlannerRecord {
  const record: PlannerRecord = {
    uuid: generateUuid(),
    created_at: new Date().toISOString(),
    status: 'confirmed',
    data,
  }
  try {
    const payload = JSON.stringify(record)
    localStorage.setItem(STORAGE_PREFIX + record.uuid, payload)
    sessionStorage.setItem(SESSION_PREFIX + record.uuid, payload)
  } catch {
    // Private-mode/quota failures are fine for the prototype
  }
  return record
}

/** Simulates `SELECT * FROM planner_requests WHERE uuid = ?`. */
export function loadPlannerRecord(uuid: string): PlannerRecord | null {
  try {
    const raw =
      localStorage.getItem(STORAGE_PREFIX + uuid) ??
      sessionStorage.getItem(SESSION_PREFIX + uuid)
    if (raw) return JSON.parse(raw) as PlannerRecord
  } catch {
    /* fall through to demo record */
  }
  return null
}

/** Demo record so a shared/unknown link still renders a full dashboard. */
export function demoPlannerRecord(uuid: string): PlannerRecord {
  return {
    uuid,
    created_at: new Date().toISOString(),
    status: 'confirmed',
    data: {
      companionship: 'friends',
      duration: '5',
      hasLodging: false,
      selectedVilla: 'villa-sa-talaia',
      arrivalMethod: 'private_jet',
      hasTransport: false,
      transportOption: 'vip_van',
      extras: ['beach_clubs', 'vip_tables', 'boat_charter'],
    },
  }
}
