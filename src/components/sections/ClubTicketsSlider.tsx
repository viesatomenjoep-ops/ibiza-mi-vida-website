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
    <section className="py-16 md:py-24 bg-[#f9fafb] w-full overflow-hidden">
      <div className="container mx-auto px-[5%] mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-blue-600 font-semibold tracking-widest uppercase mb-3 text-sm">Official Club Tickets</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold transition-all duration-500 hover:text-blue-500 text-velvet-obsidian">Trending Venues</h2>
          </div>
          <Link href="/club-tickets" className="inline-flex items-center gap-2 text-velvet-obsidian font-semibold hover:text-blue-500 transition-colors group">
            See all clubs
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="w-full pb-8">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-8 px-4 md:px-[5%] pb-12 pt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}} />
          
          {clubbingVenues.map((venue) => (
            <Link 
              key={venue.id} 
              href={`/club-tickets/${venue.slug}`}
              className="group relative flex flex-col justify-end snap-center shrink-0 w-[calc(100vw-2rem)] sm:w-[350px] md:w-[400px] h-[500px] md:h-[560px] rounded-3xl overflow-hidden bg-black shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/5"
            >
              <Image 
                src={venue.cover || venue.picture || '/hi-ibiza-2026/FB_IMG_1779623220486.jpg'} 
                alt={venue.name}
                fill
                className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                sizes="(max-width: 768px) 85vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              
              <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest text-white border border-white/20">
                {venue.type.name}
              </div>
              
              {venue.whitelogo && (
                <div className="absolute top-5 left-5 w-14 h-14 md:w-16 md:h-16 opacity-90 drop-shadow-xl">
                  <Image src={venue.whitelogo} alt={`${venue.name} logo`} fill className="object-contain" />
                </div>
              )}

              <div className="relative z-10 p-6 md:p-8 flex flex-col w-full mt-auto">
                <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md mb-3">{venue.name}</h3>
                <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-6 font-sans leading-relaxed" dangerouslySetInnerHTML={{ __html: venue.description || 'Experience the ultimate party.' }}></p>
                
                <div className="flex items-center justify-between border-t border-white/20 pt-5">
                  <span className="text-xs md:text-sm font-semibold text-white/70 uppercase tracking-widest">
                    {venue.activeEvents} Upcoming Events
                  </span>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors duration-300 border border-white/20 group-hover:border-transparent">
                    <ArrowRight size={20} className="transform transition-transform group-hover:translate-x-0.5" />
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
