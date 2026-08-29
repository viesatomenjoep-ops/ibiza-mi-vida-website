export type FeaturedEventCategory =
  | 'boat-charter'
  | 'club-ticket'
  | 'boat-party'
  | 'catamaran'
  | 'formentera'
  | 'car-rental'
  | 'guestlist'
  | 'drink-package'

export type FeaturedEventBookingType = 'whatsapp' | 'external_link' | 'internal_link'

export interface FeaturedEvent {
  id: string
  created_at: string
  updated_at: string
  title: string
  subtitle: string | null
  description: string | null
  image_url: string
  category: FeaturedEventCategory
  venue_name: string | null
  event_date: string | null
  price_from: number | null
  currency: string
  badge_text: string | null
  cta_label: string
  cta_href: string | null
  booking_type: FeaturedEventBookingType
  external_url: string | null
  sort_order: number
  active: boolean
}

export const CATEGORY_LABELS: Record<FeaturedEventCategory, string> = {
  'boat-charter': 'Private Charter',
  'club-ticket': 'Club Night',
  'boat-party': 'Boat Party',
  'catamaran': 'Catamaran',
  'formentera': 'Formentera',
  'car-rental': 'Car Rental',
  'guestlist': 'Package Deals',
  'drink-package': 'VIP Package',
}
