import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { locations, getLocationBySlug } from '@/lib/locations'

export function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }))
}

export default function LocationPage({ params }: { params: { slug: string } }) {
  const location = getLocationBySlug(params.slug)

  if (!location) {
    notFound()
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] bg-slate-900 mt-[72px]">
        <Image 
          src={location.imageUrl} 
          alt={location.name} 
          fill 
          className="object-cover opacity-70" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 md:px-8 pb-16 max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 w-fit transition-colors">
            <ArrowLeft size={16} /> Terug naar Home
          </Link>
          <div className="flex items-center gap-2 text-[#00A698] font-bold tracking-widest uppercase text-sm mb-3">
            <MapPin size={18} /> Ibiza Locaties
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-md">
            {location.name}
          </h1>
          <p className="font-sans text-xl text-white/90 max-w-2xl font-light">
            {location.tagline}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <article className="prose prose-lg md:prose-xl prose-slate max-w-none">
          <p className="lead text-slate-600 font-light leading-relaxed">
            {location.description}
          </p>
        </article>
      </section>

      {/* Other Locations Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-100">
        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-8">Ontdek andere locaties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {locations.filter(l => l.slug !== location.slug).slice(0, 4).map(loc => (
            <Link 
              key={loc.slug} 
              href={`/locations/${loc.slug}`}
              className="group relative h-48 rounded-2xl overflow-hidden flex flex-col justify-end p-4"
            >
              <Image src={loc.imageUrl} alt={loc.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <h3 className="relative z-10 font-bold text-white text-lg">{loc.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
