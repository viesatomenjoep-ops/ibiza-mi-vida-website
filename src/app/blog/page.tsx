import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Hero } from '@/components/hero/Hero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { createServerClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/types/blog'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Ibiza Blog — Events, Nightlife & Travel Guides',
  description:
    'The Ibiza mi vida blog. Read our latest Ibiza event guides, nightlife reviews, travel tips, and insider knowledge from our team on the ground in Ibiza.',
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <Hero
        title="Ibiza Blog"
        subtitle="Event guides, nightlife reviews, travel tips, and insider knowledge. Everything you need to make the most of your time in Ibiza."
        backgroundImage="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=85"
        eyebrow="Ibiza mi vida Blog"
        minHeight="min-h-[55vh]"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <AnimatedSection className="mb-12">
          <SectionHeader eyebrow="Latest" title="From the blog" />
        </AnimatedSection>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <AnimatedSection key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md h-full">
                  {post.cover_image && (
                    <div className="relative aspect-video overflow-hidden rounded-xl">
                      <Image src={post.cover_image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  )}
                  {post.category && (
                    <span className="font-sans text-xs font-semibold uppercase tracking-wider text-teal">{post.category}</span>
                  )}
                  <h2 className="font-serif text-xl font-light text-midnight group-hover:text-teal transition-colors leading-snug">{post.title}</h2>
                  {post.excerpt && <p className="font-sans text-sm leading-relaxed text-midnight/60 line-clamp-3">{post.excerpt}</p>}
                  {post.published_at && (
                    <time className="mt-auto font-sans text-xs text-midnight/30" dateTime={post.published_at}>
                      {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                  )}
                </Link>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-midnight/10 p-16 text-center">
            <p className="font-serif text-2xl font-light text-midnight/40">Blog posts coming soon</p>
          </div>
        )}
      </section>
    </>
  )
}
