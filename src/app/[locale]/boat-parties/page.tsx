import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { Ship, MapPin } from 'lucide-react'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Ibiza Boat Parties & Private Charters | Ibiza mi vida',
  description: 'Book the best Ibiza boat parties, private boat charters, and catamarans. Official partner for Ibiza boat tickets.',
}

export default async function BoatPartiesPage({ params }: { params: { locale: string } }) {
  // Fetch venues that are marked as boat parties
  const { data: boats } = await supabase
    .from('ct_venues')
    .select('*')
    .eq('type_slug', 'boat')
    .order('name');

  return (
    <div className="theme-monaco-vip bg-[var(--color-paper)] text-[var(--color-ink)] min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-ibiza-blue/10 text-ibiza-blue px-4 py-2 rounded-full font-bold text-sm tracking-wider uppercase mb-4">
            <Ship size={16} /> Op Het Water
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-serif text-velvet-obsidian leading-tight drop-shadow-md mb-4">
            Ibiza Boat Parties
          </h1>
          <p className="text-lg text-velvet-obsidian/70 max-w-2xl mx-auto">
            Ontdek de beste boat parties en catamarans rondom Ibiza. Vaar langs de prachtige kustlijn met de beste DJ's en onbeperkte drankjes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!boats || boats.length === 0 ? (
            <div className="col-span-full text-center py-12 text-velvet-obsidian/60 bg-white rounded-3xl border border-black/5 shadow-sm">
              <p>Geen boat parties gevonden op dit moment.</p>
            </div>
          ) : (
            boats.map(boat => (
              <Link 
                href={`/${params.locale}/club-tickets/${boat.slug}`} 
                key={boat.id} 
                className="group relative h-96 rounded-[32px] overflow-hidden bg-ibiza-mint block shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 border border-black/5"
              >
                {boat.cover && (
                  <Image src={boat.cover} alt={boat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian/90 via-velvet-obsidian/20 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-ibiza-blue text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    Boat Party
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start">
                  {boat.whitelogo ? (
                    <div className="w-24 h-12 relative mb-4">
                      <Image src={boat.whitelogo} alt={boat.name} fill className="object-contain filter invert drop-shadow-md object-left" />
                    </div>
                  ) : (
                    <h3 className="font-black font-serif text-3xl text-white mb-2 drop-shadow-md">{boat.name}</h3>
                  )}
                  
                  <div className="flex items-center gap-1.5 text-white/80 font-medium text-sm">
                    <MapPin size={16} /> Ibiza
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
