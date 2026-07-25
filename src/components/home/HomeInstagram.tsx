'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Instagram } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

const HANDLE = 'ibizamivida'
const INSTA_URL = `https://www.instagram.com/${HANDLE}/`

const KICKER: L = {
  nl: 'Volg de vibe',
  en: 'Follow the vibe',
  es: 'Sigue el ambiente',
  de: 'Folge dem Vibe',
  fr: 'Suis l’ambiance',
}
const HEAD: L = {
  nl: 'Ibiza op je feed',
  en: 'Ibiza on your feed',
  es: 'Ibiza en tu feed',
  de: 'Ibiza in deinem Feed',
  fr: 'Ibiza sur ton feed',
}
const CTA: L = {
  nl: 'Volgen op Instagram',
  en: 'Follow on Instagram',
  es: 'Seguir en Instagram',
  de: 'Auf Instagram folgen',
  fr: 'Suivre sur Instagram',
}

type Post = { image: string; link: string; alt?: string }

// Fallback imagery — shown until a real feed source is connected (see below).
const FALLBACK: Post[] = [
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
].map((image) => ({ image, link: INSTA_URL }))

/**
 * Live Instagram feed.
 *
 * Instagram cannot be scraped server-side (the public page is a login wall and
 * its CDN image URLs expire within hours). To show REAL, always-current posts,
 * set NEXT_PUBLIC_INSTAGRAM_FEED_URL to a feed-provider JSON endpoint — e.g. a
 * free Behold.so feed (https://behold.so) or your own Instagram Graph API proxy.
 * The parser below is tolerant of the common shapes:
 *   - Behold:  { posts: [{ mediaUrl, permalink, sizes, caption }] }
 *   - Generic: [{ image|mediaUrl|thumbnailUrl, link|permalink }]
 * Until that env var is set, the tasteful fallback grid is shown.
 */
function normalize(data: any): Post[] {
  const arr: any[] = Array.isArray(data) ? data : data?.posts || data?.data || []
  return arr
    .map((p) => {
      const image =
        p.thumbnailUrl || p.mediaUrl || p.image || p.media_url || p.sizes?.small?.mediaUrl || ''
      const link = p.permalink || p.link || p.url || INSTA_URL
      if (!image) return null
      return { image, link, alt: (p.caption || p.prompt || '').toString().slice(0, 120) }
    })
    .filter(Boolean) as Post[]
}

export function HomeInstagram({ locale = 'nl' }: { locale?: string }) {
  const feedUrl = process.env.NEXT_PUBLIC_INSTAGRAM_FEED_URL
  const [posts, setPosts] = useState<Post[]>(FALLBACK)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!feedUrl) return
    let cancelled = false
    fetch(feedUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        if (cancelled) return
        const p = normalize(json).slice(0, 6)
        if (p.length) {
          setPosts(p)
          setLive(true)
        }
      })
      .catch(() => {/* keep fallback */})
    return () => { cancelled = true }
  }, [feedUrl])

  return (
    <section className="bg-white text-neutral-900 py-12 md:py-16 border-t border-black/5">
      <Reveal className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
              {t(KICKER, locale)}
            </span>
            <h2 className="mt-3 font-serif text-[1.625rem] md:text-4xl font-black tracking-tight text-neutral-900">
              {t(HEAD, locale)}
            </h2>
            <a href={INSTA_URL} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-semibold text-neutral-500 hover:text-gold">
              @{HANDLE}
            </a>
          </div>
          <a
            href={INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-serif text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-gold hover:text-neutral-900"
          >
            <Instagram size={16} />
            {t(CTA, locale)}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 md:gap-3">
          {posts.map((post, i) => (
            <a
              key={i}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-100"
            >
              {live ? (
                // Live feed images come from Instagram's CDN with rotating URLs —
                // a plain <img> avoids next/image caching an expiring source.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.image}
                  alt={post.alt || `Ibiza Mi Vida Instagram ${i + 1}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <Image
                  src={post.image}
                  alt={`Ibiza Mi Vida Instagram ${i + 1}`}
                  fill
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                <Instagram size={26} className="text-white" />
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
