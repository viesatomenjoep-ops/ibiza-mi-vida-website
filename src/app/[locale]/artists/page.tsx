import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Disc } from 'lucide-react'
import { getArtists } from '@/lib/clubtickets'

export const revalidate = 3600

export default async function ArtistsPage({ params }: { params: { locale: string } }) {
  const artists = await getArtists(params.locale)

  return (
    <main className="theme-monaco-vip bg-[var(--color-paper)] min-h-screen text-[var(--color-ink)] pt-20 pb-24">
      <div className="container mx-auto px-[5%]">
        <div className="mb-16 max-w-3xl">
          <p className="text-[var(--color-sea)] font-sans text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <Disc size={16} /> Featured Headliners & Parties
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">Ibiza Artists</h1>
          <p className="font-sans text-lg text-[var(--color-slate)]">
            Discover where the world's biggest DJs are playing. From underground tech-house to mainstage EDM, find your favorite artist and secure your tickets immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {artists.map((artist) => (
            <Link 
              key={artist.slug}
              href={`/${params.locale}/artists/${artist.slug}`}
              className="group relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden bg-black shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-black/5"
            >
              <Image 
                src={artist.image} 
                alt={artist.name}
                fill
                className="object-cover opacity-70 transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                <span className="text-[var(--color-sea)] font-sans text-[10px] font-bold uppercase tracking-widest mb-2">
                  {artist.venueName}
                </span>
                <h2 className="font-serif text-4xl text-white font-bold group-hover:text-[var(--color-sea)] transition-colors">
                  {artist.name}
                </h2>
                
                <div className="mt-6 flex items-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-[var(--color-ink)] font-sans text-sm font-bold uppercase tracking-widest">
                    View Events
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--color-sea)] flex items-center justify-center text-[var(--color-paper)]">
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
