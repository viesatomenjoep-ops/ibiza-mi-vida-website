'use client'

import React, { useEffect, useState } from 'react'
import { Instagram } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SocialBrandMark } from '@/components/home/SocialBrandMark'

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
const SUB: L = {
  nl: 'Sfeer, line-ups en het echte eilandleven — dagelijks op Instagram.',
  en: 'Vibes, line-ups and real island life — daily on Instagram.',
  es: 'Ambiente, line-ups y la vida real de la isla — a diario en Instagram.',
  de: 'Vibes, Line-ups und echtes Inselleben — täglich auf Instagram.',
  fr: 'Ambiance, line-ups et vraie vie insulaire — chaque jour sur Instagram.',
}
const CTA: L = {
  nl: 'Volgen op Instagram',
  en: 'Follow on Instagram',
  es: 'Seguir en Instagram',
  de: 'Auf Instagram folgen',
  fr: 'Suivre sur Instagram',
}

type Post = { image: string; link: string; alt?: string }

/**
 * Instagram section. No placeholder imagery — the photo grid only renders with
 * REAL posts. Instagram can't be scraped server-side (login wall + expiring CDN
 * URLs), so real posts come from a feed-provider JSON endpoint set via
 * NEXT_PUBLIC_INSTAGRAM_FEED_URL (e.g. a free Behold.so feed for @ibizamivida,
 * or an own Instagram Graph API proxy). Tolerated shapes:
 *   - Behold:  { posts: [{ mediaUrl, permalink, sizes, caption }] }
 *   - Generic: [{ image|mediaUrl|thumbnailUrl, link|permalink }]
 * Until that env var is set, the section is a clean follow banner.
 */
function normalize(data: any): Post[] {
  const arr: any[] = Array.isArray(data) ? data : data?.posts || data?.data || []
  return arr
    .map((p) => {
      const image =
        p.thumbnailUrl || p.mediaUrl || p.image || p.media_url || p.sizes?.small?.mediaUrl || ''
      const link = p.permalink || p.link || p.url || INSTA_URL
      if (!image) return null
      return { image, link, alt: (p.caption || '').toString().slice(0, 120) }
    })
    .filter(Boolean) as Post[]
}

export function HomeInstagram({ locale = 'nl' }: { locale?: string }) {
  const feedUrl = process.env.NEXT_PUBLIC_INSTAGRAM_FEED_URL
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    if (!feedUrl) return
    let cancelled = false
    fetch(feedUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        if (!cancelled) setPosts(normalize(json).slice(0, 6))
      })
      .catch(() => {/* stay a follow banner */})
    return () => { cancelled = true }
  }, [feedUrl])

  return (
    <section className="bg-white text-neutral-900 py-12 md:py-16 border-t border-black/5">
      <Reveal className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <SocialBrandMark />
          <span className="mt-4 text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            {t(KICKER, locale)}
          </span>
          <h2 className="mt-3 font-serif text-[1.625rem] md:text-4xl font-black tracking-tight text-neutral-900">
            {t(HEAD, locale)}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
            {t(SUB, locale)}
          </p>
          <a
            href={INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 font-serif text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-gold hover:text-neutral-900"
          >
            <Instagram size={16} />
            {t(CTA, locale)}
          </a>
          <a
            href={INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-sm font-semibold text-neutral-400 hover:text-gold"
          >
            @{HANDLE}
          </a>
        </div>

        {posts.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 md:gap-3">
            {posts.map((post, i) => (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-100"
              >
                {/* Live feed images come from Instagram's CDN with rotating URLs —
                    a plain <img> avoids next/image caching an expiring source. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.alt || `Ibiza Mi Vida Instagram ${i + 1}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                  <Instagram size={26} className="text-white" />
                </div>
              </a>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  )
}
