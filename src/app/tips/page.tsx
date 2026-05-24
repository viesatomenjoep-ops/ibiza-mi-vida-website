import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Hero } from '@/components/hero/Hero'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { createServerClient } from '@/lib/supabase/server'
import { getPageContent } from '@/lib/page-content'
import type { BlogPost } from '@/types/blog'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Ibiza Tips & Travel Guide — What to Do in Ibiza',
  description:
    'Expert Ibiza tips from the Ibiza mi vida team. Best beaches, nightlife guide, what to eat, when to visit, and everything you need to know before you go.',
}

async function getTips(): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('category', 'tips')
      .order('published_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function TipsPage() {
  const [tips, pageContent] = await Promise.all([
    getTips(),
    getPageContent('ibiza-tips', {
      title: "Ibiza Tips & Travel Guide",
      subtitle: "Everything you need to know for the perfect Ibiza trip — from the best beaches to the clubs, the secret spots, and the inside knowledge most tourists never find.",
      backgroundImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=85"
    })
  ])

  return (
    <>
      <Hero
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        backgroundImage={pageContent.backgroundImage}
        eyebrow="Insider Guide"
        minHeight="min-h-[65vh]"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <AnimatedSection className="mb-12">
          <SectionHeader eyebrow="Ibiza Tips" title="Expert advice, real experience" subtitle="Our team lives in Ibiza. These are the tips we'd tell our closest friends." />
        </AnimatedSection>

        {tips.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tips.map((post) => (
              <AnimatedSection key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                  {post.cover_image && (
                    <div className="relative aspect-video overflow-hidden rounded-xl">
                      <Image src={post.cover_image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  )}
                  <h3 className="font-serif text-xl font-light text-midnight group-hover:text-teal transition-colors">{post.title}</h3>
                  {post.excerpt && <p className="font-sans text-sm leading-relaxed text-midnight/60 line-clamp-2">{post.excerpt}</p>}
                </Link>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-midnight/10 p-16 text-center">
            <p className="font-serif text-2xl font-light text-midnight/40">Tips coming soon</p>
            <p className="mt-2 font-sans text-sm text-midnight/30">Our Ibiza team is writing the best tips guide on the island.</p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <AnimatedSection><CrossSellBanner triggerPage="/tips" fromPrice={500} /></AnimatedSection>
      </section>
    </>
  )
}
