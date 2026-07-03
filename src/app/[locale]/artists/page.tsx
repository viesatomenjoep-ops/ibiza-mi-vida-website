import React from 'react'
import Link from 'next/link'
import { Disc } from 'lucide-react'
import { getArtists } from '@/lib/clubtickets'

export const revalidate = 3600

export default async function ArtistsPage({ params }: { params: { locale: string } }) {
  const artists = await getArtists(params.locale)

  return (
    <main className="theme-monaco-vip bg-neutral-50 min-h-screen text-[var(--color-ink)] pb-24 relative overflow-hidden">
      <section className="pt-[160px] md:pt-[180px] pb-12 relative z-10 flex flex-col items-center text-center px-4">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="flex flex-col gap-2 text-center mb-4">
            <span className="text-sm font-bold tracking-widest text-neutral-500 uppercase mb-4">Ibiza's Finest</span>
            <h1 className="text-5xl md:text-7xl font-black font-serif text-black leading-tight uppercase m-0 tracking-tight drop-shadow-sm">
              Ibiza Artists
            </h1>
            <p className="font-sans text-base md:text-lg text-neutral-600 max-w-2xl mx-auto mt-6">
              Discover where the world’s biggest DJs are playing. From underground tech-house to mainstage EDM, find your favorite artist and secure your tickets immediately.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-[5%] relative z-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {artists.map((artist) => (
            <Link 
              key={artist.slug}
              href={`/${params.locale}/artists/${artist.slug}`}
              className="group relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden bg-black shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-black/5"
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
