import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'artists')
}

import React from 'react'
import Link from 'next/link'
import { Disc } from 'lucide-react'
import { getArtists } from '@/lib/clubtickets'

export const revalidate = 3600

export default async function ArtistsPage({ params }: { params: { locale: string } }) {
  const artists = await getArtists(params.locale)

  return (
    <main className="theme-monaco-vip bg-neutral-50 min-h-screen text-[var(--color-ink)] pb-24 relative overflow-hidden">
      <section className="pt-[calc(var(--nav-h)+12px)] pb-2 relative z-10 flex flex-col items-center text-center px-4">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-black font-serif text-black leading-tight uppercase m-0 tracking-tight drop-shadow-sm">
            Ibiza Artists
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-[5%] relative z-10">

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {artists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/${params.locale}/artists/${artist.slug}`}
              className="group relative h-[220px] md:h-[280px] rounded-2xl overflow-hidden bg-black shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-black/5"
            >
              {artist.image ? (
                <img 
                  src={artist.image} 
                  alt={artist.name || 'Artist'}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-neutral-800 flex items-center justify-center">
                  <Disc className="w-16 h-16 text-neutral-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 flex flex-col justify-end">
                <span className="text-[var(--color-sea)] font-sans text-[9px] font-bold uppercase tracking-widest mb-0.5 line-clamp-1">
                  {artist.venueName}
                </span>
                <h2 className="font-serif text-lg md:text-2xl leading-tight text-white font-bold line-clamp-2 group-hover:text-[var(--color-sea)] transition-colors">
                  {artist.name}
                </h2>

                <div className="mt-2 hidden items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 md:flex">
                  <span className="text-white font-sans text-[11px] font-bold uppercase tracking-widest">
                    View Events
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[var(--color-sea)] flex items-center justify-center text-[var(--color-paper)] text-xs">
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
