'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { DealsData } from '@/components/home/HomeDeals'

type CatKey = 'clubs' | 'boats' | 'land' | 'water'

const CONTENT: Record<CatKey, { href: string; title: Record<string, string>; text: Record<string, string> }> = {
  clubs: {
    href: 'club-tickets',
    title: { nl: 'Club Tickets Ibiza', en: 'Club Tickets Ibiza', es: 'Club Tickets Ibiza', de: 'Club Tickets Ibiza', fr: 'Club Tickets Ibiza' },
    text: {
      nl: 'De heetste clubnachten van het eiland — Hï, UNVRS, Pacha, Amnesia, DC-10 en meer. Reserveer je tickets voor de grootste dj’s van de zomer.',
      en: 'The island’s hottest club nights — Hï, UNVRS, Pacha, Amnesia, DC-10 and more. Book tickets for the biggest DJs of the summer.',
      es: 'Las mejores noches de club de la isla — Hï, UNVRS, Pacha, Amnesia, DC-10 y más. Reserva entradas para los mayores DJs del verano.',
      de: 'Die heißesten Clubnächte der Insel — Hï, UNVRS, Pacha, Amnesia, DC-10 und mehr. Sichere dir Tickets für die größten DJs des Sommers.',
      fr: 'Les meilleures nuits de club de l’île — Hï, UNVRS, Pacha, Amnesia, DC-10 et plus. Réserve tes billets pour les plus grands DJs de l’été.',
    },
  },
  boats: {
    href: 'private-boat-charters',
    title: { nl: 'Private Boats', en: 'Private Boats', es: 'Barcos privados', de: 'Private Boote', fr: 'Bateaux privés' },
    text: {
      nl: 'Huur je eigen jacht of catamaran. Vaar langs Es Vedrà, anker in verborgen baaien en beleef Ibiza vanaf het water.',
      en: 'Charter your own yacht or catamaran. Cruise past Es Vedrà, anchor in hidden coves and experience Ibiza from the water.',
      es: 'Alquila tu propio yate o catamarán. Navega junto a Es Vedrà, fondea en calas escondidas y vive Ibiza desde el agua.',
      de: 'Chartere deine eigene Yacht oder Katamaran. Segle an Es Vedrà vorbei, ankere in versteckten Buchten und erlebe Ibiza vom Wasser aus.',
      fr: 'Louez votre propre yacht ou catamaran. Longez Es Vedrà, mouillez dans des criques cachées et vivez Ibiza depuis l’eau.',
    },
  },
  land: {
    href: 'activities',
    title: { nl: 'Op het land', en: 'On land', es: 'En tierra', de: 'An Land', fr: 'Sur terre' },
    text: {
      nl: 'Buggy-tours, quads, jetski en excursies. Ontdek het ruige binnenland en de mooiste verborgen plekjes van het eiland.',
      en: 'Buggy tours, quads, jet skis and excursions. Discover the rugged interior and the island’s most beautiful hidden spots.',
      es: 'Tours en buggy, quads, motos de agua y excursiones. Descubre el interior salvaje y los rincones más bonitos de la isla.',
      de: 'Buggy-Touren, Quads, Jetskis und Ausflüge. Entdecke das raue Hinterland und die schönsten versteckten Orte der Insel.',
      fr: 'Tours en buggy, quads, jet-skis et excursions. Découvre l’arrière-pays sauvage et les plus beaux coins cachés de l’île.',
    },
  },
  water: {
    href: 'water-sports',
    title: { nl: 'Op het water', en: 'On the water', es: 'En el agua', de: 'Auf dem Wasser', fr: "Sur l'eau" },
    text: {
      nl: 'Boottochten, sunset cruises en watersport. Van Formentera-trips tot parasailing — alles op en rond de zee.',
      en: 'Boat trips, sunset cruises and water sports. From Formentera trips to parasailing — everything on and around the sea.',
      es: 'Excursiones en barco, cruceros al atardecer y deportes acuáticos. De viajes a Formentera al parasailing — todo en el mar.',
      de: 'Bootstouren, Sunset-Cruises und Wassersport. Von Formentera-Trips bis Parasailing — alles auf und rund ums Meer.',
      fr: 'Excursions en bateau, croisières au coucher du soleil et sports nautiques. Des sorties à Formentera au parachute ascensionnel.',
    },
  },
}

const ORDER: CatKey[] = ['clubs', 'boats', 'land', 'water']
const TOPS = [104, 128, 152, 176]
const HEAD: Record<string, string> = { nl: 'Ontdek Ibiza', en: 'Discover Ibiza', es: 'Descubre Ibiza', de: 'Entdecke Ibiza', fr: 'Découvrez Ibiza' }
const CTA: Record<string, string> = { nl: 'Bekijk alles', en: 'View all', es: 'Ver todo', de: 'Alles ansehen', fr: 'Tout voir' }

export function HomeStackedCards({ deals, base = '/nl', locale = 'nl' }: { deals?: DealsData; base?: string; locale?: string }) {
  const imageFor: Record<CatKey, string | undefined> = {
    clubs: deals?.clubs?.[0]?.image,
    boats: deals?.boats?.[0]?.image,
    land: deals?.land?.[0]?.image,
    water: deals?.water?.[0]?.image,
  }

  return (
    <section className="w-full bg-neutral-100 px-4 py-10 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="mb-8 text-center font-serif text-[1.75rem] font-black uppercase tracking-tight text-neutral-900 md:text-4xl">
          {HEAD[locale] || HEAD.en}
        </h2>

        {/* Flex column — NO overflow:hidden on this wrapper (would break sticky) */}
        <div className="flex flex-col gap-[26px]">
          {ORDER.map((key, i) => {
            const dark = i % 2 === 0
            const c = CONTENT[key]
            const img = imageFor[key]
            const num = String(i + 1).padStart(2, '0')
            return (
              <article
                key={key}
                className="overflow-hidden rounded-[26px]"
                style={{
                  position: 'sticky',
                  top: TOPS[i],
                  minHeight: '56vh',
                  boxShadow: '0 -20px 50px -30px rgba(0,0,0,.5)',
                  background: dark ? '#1B1917' : '#FBFAF8',
                  color: dark ? '#EFEDEA' : '#1B1917',
                  border: dark ? '1px solid rgba(255,255,255,.08)' : '1px solid rgba(27,25,23,.1)',
                }}
              >
                <div className="grid h-full min-h-[56vh] grid-cols-1 md:grid-cols-2">
                  {/* Text column */}
                  <div className="order-2 flex flex-col justify-center gap-4 p-8 md:order-1 md:p-12">
                    <span
                      className="font-serif text-6xl font-black leading-none md:text-7xl"
                      style={{ color: dark ? 'rgba(239,237,234,.22)' : 'rgba(27,25,23,.14)' }}
                    >
                      {num}
                    </span>
                    <h3 className="font-serif text-3xl font-black uppercase leading-tight tracking-tight md:text-5xl">
                      {c.title[locale] || c.title.en}
                    </h3>
                    <p className="max-w-md text-[15px] leading-relaxed" style={{ opacity: 0.82 }}>
                      {c.text[locale] || c.text.en}
                    </p>
                    <Link
                      href={`${base}/${c.href}`}
                      className="mt-2 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.16em] transition-transform hover:-translate-y-0.5"
                      style={{
                        background: dark ? '#EFEDEA' : '#1B1917',
                        color: dark ? '#1B1917' : '#EFEDEA',
                      }}
                    >
                      {CTA[locale] || CTA.en} <ArrowRight size={15} />
                    </Link>
                  </div>

                  {/* Image column */}
                  <div className="relative order-1 min-h-[220px] md:order-2 md:min-h-full">
                    {img ? (
                      <img src={img} alt={c.title[locale] || c.title.en} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <div className="absolute inset-0" style={{ background: dark ? '#111' : '#e7e3dd' }} />
                    )}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{ background: dark ? 'linear-gradient(90deg,#1B1917 0%,rgba(27,25,23,.15) 55%,transparent 100%)' : 'linear-gradient(90deg,#FBFAF8 0%,rgba(251,250,248,.1) 55%,transparent 100%)' }}
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
