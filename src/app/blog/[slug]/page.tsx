import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { createServerClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/types/blog'

export const revalidate = 0

interface Props {
  params: { slug: string }
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = createServerClient()
  const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single()
  return data ?? null
}

export async function generateStaticParams() {
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('blog_posts').select('slug').eq('published', true)
    return (data ?? []).map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Post Not Found | Ibiza mi vida' }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image ? [{ url: post.cover_image, width: 1200, height: 630 }] : undefined,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <>
      {/* Back link */}
      <div className="mx-auto max-w-3xl px-4 pt-24 md:px-8">
        <Link href="/blog" className="inline-flex items-center gap-2 font-sans text-sm text-midnight/50 transition-colors hover:text-midnight">
          <ArrowLeft size={14} />
          Back to blog
        </Link>
      </div>

      {/* Article header */}
      <article className="mx-auto max-w-3xl px-4 py-8 md:px-8" itemScope itemType="https://schema.org/BlogPosting">
        {post.category && (
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-teal">{post.category}</span>
        )}
        <h1 className="mt-3 font-serif text-4xl font-light leading-tight text-midnight md:text-5xl lg:text-6xl" itemProp="headline">
          {post.title}
        </h1>
        {post.published_at && (
          <time className="mt-3 block font-sans text-sm text-midnight/40" dateTime={post.published_at} itemProp="datePublished">
            {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </time>
        )}

        {post.cover_image && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Article body (Markdown stored as plain text for now) */}
        {post.content && (
          <div className="prose prose-lg prose-midnight mt-10 max-w-none font-sans" itemProp="articleBody">
            {post.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-5 leading-relaxed text-midnight/75">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </article>

      {/* Cross-sell injected mid-content */}
      <AnimatedSection className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        <CrossSellBanner triggerPage={`/blog/${post.slug}`} fromPrice={500} />
      </AnimatedSection>
    </>
  )
}
