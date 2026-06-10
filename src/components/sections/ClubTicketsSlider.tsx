import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getVenues } from '@/lib/clubtickets'
import { Music, ArrowRight } from 'lucide-react'

export async function ClubTicketsSlider() {
  const venues = await getVenues('en')
  // We filter on clubbing venues, or just show all of them!
  const clubbingVenues = venues.filter(v => v.type.slug === 'clubbing')

  if (clubbingVenues.length === 0) return null

  return (
    <section className="py-16 bg-background-primary w-full overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-blue-500 font-semibold tracking-widest uppercase mb-2 text-sm">Official Club Tickets</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-velvet-obsidian">Trending Venues</h2>
          </div>
          <Link href="/club-tickets" className="inline-flex items-center gap-2 text-velvet-obsidian font-semibold hover:text-blue-500 transition-colors group">
            See all clubs
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="w-full pb-8">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 md:px-8 pb-8 pt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}} />
          
          {clubbingVenues.map((venue) => (
            <Link 
              key={venue.id} 
              href={`/club-tickets/${venue.slug}`}
              className="group relative flex flex-col snap-start shrink-0 w-[300px] md:w-[380px] h-[450px] rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-2/3 w-full overflow-hidden">
                <Image 
                  src={venue.cover || venue.picture || '/hi-ibiza-2026/FB_IMG_1779623220486.jpg'} 
                  alt={venue.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 300px, 380px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-black">
                  {venue.type.name}
                </div>
                
                {venue.whitelogo && (
                  <div className="absolute top-4 left-4 w-12 h-12 opacity-90 drop-shadow-md">
                    <Image src={venue.whitelogo} alt={`${venue.name} logo`} fill className="object-contain" />
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-3xl font-serif font-bold text-white drop-shadow-md">{venue.name}</h3>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between bg-white">
                <p className="text-gray-600 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: venue.description || 'Experience the ultimate party.' }}></p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {venue.activeEvents} Upcoming Events
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Spacer to allow scrolling past the last item comfortably */}
          <div className="snap-start shrink-0 w-4 md:w-8"></div>
        </div>
      </div>
    </section>
  )
}
