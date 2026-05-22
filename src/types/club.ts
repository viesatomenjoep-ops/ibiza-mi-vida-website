export type BookingType = 'promoter_link' | 'whatsapp'

export interface Club {
  id: string
  created_at: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  image_url: string | null
  logo_url: string | null
  booking_type: BookingType
  promoter_url: string | null
  location: string | null
  capacity: number | null
  music_genre: string | null
  active: boolean
  sort_order: number
}

export interface ClubEvent {
  id: string
  created_at: string
  club_id: string
  title: string
  slug: string
  description: string | null
  image_url: string | null
  event_date: string
  doors_open: string | null
  price_from: number | null
  currency: string
  lineup: string[] | null
  genre_tags: string[] | null
  booking_type: BookingType
  promoter_url: string | null
  sold_out: boolean
  featured: boolean
  published: boolean
}
