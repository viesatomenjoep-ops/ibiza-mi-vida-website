import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Disc } from 'lucide-react'

// Dummy fallback data just in case we don't have API access to all artists globally yet,
// but the user specifically asked for David Guetta, Martin Garrix, etc.
const FEATURED_ARTISTS = [
  { slug: 'david-guetta', name: 'David Guetta', image: 'https://images.unsplash.com/photo-1574155376614-2576b91176b9?q=80&w=800', desc: 'F\*\*\* Me I\'m Famous & Future Rave' },
  { slug: 'martin-garrix', name: 'Martin Garrix', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800', desc: 'Ushuaïa Thursdays' },
  { slug: 'calvin-harris', name: 'Calvin Harris', image: 'https://images.unsplash.com/photo-1598387181032-a310322db565?q=80&w=800', desc: 'Ushuaïa Fridays' },
  { slug: 'black-coffee', name: 'Black Coffee', image: 'https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?q=80&w=800', desc: 'Hï Ibiza Saturdays' },
  { slug: 'fisher', name: 'Fisher', image: 'https://images.unsplash.com/photo-1543807535-ece20bfc652c?q=80&w=800', desc: 'Hï Ibiza Wednesdays' },
  { slug: 'tale-of-us', name: 'Tale Of Us', image: 'https://images.unsplash.com/photo-1520092363653-b1d5bd3647f2?q=80&w=800', desc: 'Afterlife @ Hï Ibiza' },
]

export default function ArtistsPage() {
  return (
    <main className="bg-ibiza-sand min-h-screen text-velvet-obsidian pt-32 pb-24">
      <div className="container mx-auto px-[5%]">
        <div className="mb-16 max-w-3xl">
          <p className="text-rustic-terracotta font-sans text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <Disc size={16} /> Featured Headliners
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">Ibiza Artists</h1>
          <p className="font-sans text-lg text-velvet-obsidian/70">
            Discover where the world's biggest DJs are playing. From underground tech-house to mainstage EDM, find your favorite artist and secure your tickets immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURED_ARTISTS.map((artist) => (
            <Link 
              key={artist.slug}
              href={`/artists/${artist.slug}`}
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
                <span className="text-rustic-terracotta font-sans text-[10px] font-bold uppercase tracking-widest mb-2">
                  {artist.desc}
                </span>
                <h2 className="font-serif text-4xl text-white font-bold group-hover:text-rustic-terracotta transition-colors">
                  {artist.name}
                </h2>
                
                <div className="mt-6 flex items-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-white font-sans text-sm font-bold uppercase tracking-widest">
                    View Events
                  </span>
                  <div className="w-8 h-8 rounded-full bg-rustic-terracotta flex items-center justify-center text-white">
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
