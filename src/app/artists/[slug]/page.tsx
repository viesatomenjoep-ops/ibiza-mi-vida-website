import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getVenues, getEvent } from '@/lib/clubtickets'
import { ArrowRight, Calendar, MapPin, Disc } from 'lucide-react'

// Dummy mapping since we don't have an artist API endpoint
const ARTIST_META: Record<string, {name: string, image: string, bio: string}> = {
  'david-guetta': { name: 'David Guetta', image: 'https://images.unsplash.com/photo-1574155376614-2576b91176b9?q=80&w=1920', bio: 'The undisputed king of EDM returns to Ibiza.' },
  'martin-garrix': { name: 'Martin Garrix', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920', bio: 'High-energy progressive house from the Dutch prodigy.' },
  'calvin-harris': { name: 'Calvin Harris', image: 'https://images.unsplash.com/photo-1598387181032-a310322db565?q=80&w=1920', bio: 'Chart-topping anthems under the Ibiza sun.' },
  'black-coffee': { name: 'Black Coffee', image: 'https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?q=80&w=1920', bio: 'Deep, soulful afro-house magic.' },
  'fisher': { name: 'Fisher', image: 'https://images.unsplash.com/photo-1543807535-ece20bfc652c?q=80&w=1920', bio: 'Losing it on the dancefloor with high-octane tech house.' },
  'tale-of-us': { name: 'Tale Of Us', image: 'https://images.unsplash.com/photo-1520092363653-b1d5bd3647f2?q=80&w=1920', bio: 'Melodic techno journeys into the Afterlife.' }
}

export default async function ArtistSlugPage({ params }: { params: { slug: string } }) {
  const meta = ARTIST_META[params.slug] || { 
    name: params.slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920',
    bio: 'Catch this incredible artist live in Ibiza.'
  }

  // Fetch all venues to find events for this artist
  const venues = await getVenues('en')
  const eventPromises = []
  
  for (const venue of venues) {
    if (!venue.events) continue
    for (const eventRef of venue.events) {
      // Very naive matching: if the event slug or name contains the artist name
      if (eventRef.slug.toLowerCase().includes(params.slug.replace('-', '')) || 
          eventRef.slug.toLowerCase().includes(params.slug) ||
          eventRef.name.toLowerCase().includes(meta.name.toLowerCase())) {
        
        eventPromises.push(
          getEvent(venue.id, eventRef.id, 'en').then(full => full ? { ...full, venueName: venue.name, venueSlug: venue.slug, venueLogo: venue.whitelogo } : null)
        )
      }
    }
  }
  
  const fetchedEvents = (await Promise.all(eventPromises)).filter(Boolean)
  
  // Extract dates
  const dates = fetchedEvents.flatMap(e => 
    e?.dates ? e.dates.map((d: any) => ({
      ...d,
      eventName: e.name,
      eventSlug: e.slug,
      venueName: e.venueName,
      venueSlug: e.venueSlug,
      venueLogo: e.venueLogo,
      image: e.cover || e.logo || meta.image
    })) : []
  )
  
  dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // If no dates found, we still show the page but state no upcoming events.
  return (
    <main className="bg-ibiza-sand min-h-screen text-velvet-obsidian">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] w-full bg-black">
        <Image src={meta.image} alt={meta.name} fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ibiza-sand via-transparent to-black/50" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 container mx-auto">
          <div className="max-w-4xl">
            <Link href="/artists" className="text-white/70 hover:text-white font-sans text-xs uppercase tracking-widest font-bold mb-6 inline-flex items-center gap-2 transition-colors">
              ← Back to Artists
            </Link>
            <h1 className="font-serif text-5xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg">{meta.name}</h1>
            <p className="font-sans text-xl text-white/90 drop-shadow-md max-w-2xl">{meta.bio}</p>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-[5%]">
          <div className="flex items-center gap-3 mb-12">
            <Calendar className="text-rustic-terracotta" size={24} />
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Upcoming Ibiza Dates</h2>
          </div>

          {dates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {dates.map((d, i) => {
                const eventDate = new Date(d.date)
                return (
                  <Link 
                    key={i}
                    href={d.affLink || `/club-tickets/${d.venueSlug}/${d.eventSlug}`}
                    target={d.affLink ? "_blank" : undefined}
                    className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5"
                  >
                    <div className="relative h-48 w-full bg-black overflow-hidden">
                      <Image src={d.image} alt={d.eventName} fill className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                      {d.venueLogo && (
                        <div className="absolute top-4 left-4 w-12 h-12 z-10 drop-shadow-lg">
                          <Image src={d.venueLogo} alt={d.venueName} fill className="object-contain" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex flex-col">
                          <span className="text-rustic-terracotta font-sans text-xs font-bold uppercase tracking-widest mb-1">
                            {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                          </span>
                          <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-rustic-terracotta transition-colors">
                            {d.eventName}
                          </h3>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-ibiza-sand rounded-xl p-3 min-w-[60px] border border-black/5">
                          <span className="text-xs font-bold uppercase text-velvet-obsidian/60">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-2xl font-black text-velvet-obsidian leading-none">{eventDate.getDate()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-velvet-obsidian/70 font-sans text-sm mb-6 mt-auto">
                        <MapPin size={16} />
                        <span className="font-medium">{d.venueName}</span>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-black/5 pt-4">
                        <span className="font-bold text-velvet-obsidian">
                          {d.prices || 'Tickets Available'}
                        </span>
                        <div className="bg-velvet-obsidian text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest group-hover:bg-rustic-terracotta transition-colors">
                          Book Now
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
             <div className="bg-white rounded-[2rem] p-12 text-center border border-black/5 shadow-sm">
               <Disc size={48} className="mx-auto text-velvet-obsidian/20 mb-4" />
               <h3 className="font-serif text-2xl font-bold mb-2">No Dates Announced Yet</h3>
               <p className="text-velvet-obsidian/70 max-w-md mx-auto">
                 We're waiting for {meta.name}'s Ibiza schedule to drop. Check back soon or follow our socials for lineup announcements!
               </p>
             </div>
          )}
        </div>
      </section>
    </main>
  )
}
