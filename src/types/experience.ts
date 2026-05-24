export type ExperienceCategory =
  | 'deals-of-the-day'
  | 'boat-charter'
  | 'club-ticket'
  | 'boat-party'
  | 'catamaran'
  | 'formentera'
  | 'guestlist'
  | 'drink-packages'
  | 'car-rental'

export interface Experience {
  id: string
  created_at: string
  slug: string
  category: ExperienceCategory
  title: string
  tagline: string | null
  description: string | null
  image_url: string | null
  price_from: number | null
  currency: string
  duration: string | null
  capacity: number | null
  available: boolean
  featured: boolean
  sort_order: number
}

export interface Review {
  id: string
  created_at: string
  experience_id: string
  reviewer_name: string
  rating: number
  body: string | null
  verified: boolean
  published: boolean
}
