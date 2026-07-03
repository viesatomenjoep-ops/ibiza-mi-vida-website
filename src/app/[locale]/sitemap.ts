import type { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibizamivida.com'

const staticRoutes: MetadataRoute.Sitemap = [
  { url: siteUrl, changeFrequency: 'daily', priority: 1 },
  { url: `${siteUrl}/private-boat-charters`, changeFrequency: 'daily', priority: 0.9 },
  { url: `${siteUrl}/club-tickets`, changeFrequency: 'daily', priority: 0.8 },
  { url: `${siteUrl}/vip-catamaran`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${siteUrl}/formentera-boat-trips`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${siteUrl}/guestlist`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${siteUrl}/drink-packages`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${siteUrl}/car-scooter-rental`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${siteUrl}/free-discount-ibiza`, changeFrequency: 'weekly', priority: 0.5 },
  { url: `${siteUrl}/tips`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${siteUrl}/blog`, changeFrequency: 'daily', priority: 0.6 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createServerClient()

    // Dynamic club pages
    const { data: clubs } = await supabase.from('clubs').select('slug, created_at').eq('active', true)
    const clubRoutes: MetadataRoute.Sitemap = (clubs ?? []).map((club) => ({
      url: `${siteUrl}/club-tickets/${club.slug}`,
      changeFrequency: 'daily',
      priority: 0.75,
      lastModified: club.created_at,
    }))

    // Dynamic blog posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)

    const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      changeFrequency: 'weekly',
      priority: 0.5,
      lastModified: post.updated_at,
    }))

    return [...staticRoutes, ...clubRoutes, ...blogRoutes]
  } catch {
    return staticRoutes
  }
}
