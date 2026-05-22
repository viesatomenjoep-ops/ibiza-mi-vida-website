export type BlogCategory = 'tips' | 'guides' | 'nightlife' | 'boats'

export interface BlogPost {
  id: string
  created_at: string
  updated_at: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  category: BlogCategory | null
  published: boolean
  published_at: string | null
}
