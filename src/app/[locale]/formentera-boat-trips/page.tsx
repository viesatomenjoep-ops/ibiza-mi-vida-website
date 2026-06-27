import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getVenues } from '@/lib/clubtickets';
import { CategoryHero } from '@/components/hero/CategoryHero';
import { getPageContent } from '@/lib/page-content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Formentera Day Trips & Boat Excursions',
  description:
    'Book the best day trips and ferry tickets from Ibiza to Formentera.',
}

interface Props {
  params: {
    locale: string;
  };
}

export default async function FormenteraTripsPage({ params }: Props) {
  const allVenues = await getVenues(params.locale);
  // Only show formentera day trips
  const trips = allVenues.filter(v => v.type.slug === 'formentera-day-trip');

  const pageContent = await getPageContent('formentera-boat-trips', {
    title: "Formentera Day Trips",
    subtitle: "Explore the Caribbean of the Mediterranean. Book your ferry tickets and guided day trips from Ibiza to Formentera.",
    backgroundImage: "https://images.unsplash.com/photo-1544211158-b6df3db0f671?w=1920&q=85"
  });

  return (
    <>
      <div className="theme-water bg-[var(--color-paper)] min-h-screen text-[var(--color-ink)] pb-20">
        <CategoryHero
          title={pageContent.title}
          subtitle={pageContent.subtitle}
          backgroundImage={pageContent.backgroundImage}
          colorTheme="indigo"
          eyebrow="Ibiza 2026"
        />

        <section id="formentera" className="mx-auto max-w-7xl px-4 pt-8 pb-16 md:px-8 md:pb-24 -mt-16 md:-mt-24 bg-ibiza-sand/90 backdrop-blur-md rounded-3xl relative z-20 border border-white/50 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <Link href={`/${params.locale}/formentera-boat-trips/${trip.slug}`} key={trip.id} className="bg-white/95 text-velvet-obsidian rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-[380px]">
                <div className="relative h-full w-full overflow-hidden">
                  <Image 
                    src={trip.cover || trip.picture || 'https://images.unsplash.com/photo-1544211158-b6df3db0f671?w=800&q=80'} 
                    alt={trip.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {trip.type && (
                    <div className="absolute top-4 right-4 bg-[#00CED1]/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                      {trip.type.name}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center transform transition-transform duration-300">
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 drop-shadow-md">{trip.name}</h3>
                    
                    <span className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-[#00CED1] text-white backdrop-blur-md px-6 py-3 rounded-full font-semibold transition-all duration-300">
                      View Available Dates
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                        <path d="M5 12h14m-7-7 7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {trips.length === 0 && (
            <div className="text-center py-20 text-velvet-obsidian/60">
              <p>No Formentera trips available at the moment. Please check back later.</p>
            </div>
          )}

          {/* SEO Text Block */}
          <div className="mt-16 text-white max-w-4xl mx-auto space-y-6 bg-[var(--color-paper)] p-8 rounded-2xl border border-[var(--color-line)] shadow-lg">
            <h2 className="text-2xl font-bold font-display">San Antonio naar Es Vedrà Boottocht</h2>
            <p>
              Bezoek een van de mooiste en meest magische natuurlijke omgevingen aan de kust van Ibiza. Tijdens deze 4-uur durende cruise kun je talrijke baaien van Ibiza ontdekken.
            </p>
            <p>
              De excursie begint met een schilderachtige reis naar Es Vedrà, het grootste en meest iconische natuurreservaat van het eiland. Onderweg geniet je van adembenemende uitzichten op enkele van de mooiste baaien van Ibiza, waaronder Port des Torrent, Cala Bassa, Cala Conta, Cala Tarida, Cala Molí, Cala Vadella, Cala Carbó en Cala d’Hort.
            </p>
            <p>
              Eenmaal aangekomen bij Es Vedrà, vaart de boot rond dit spectaculaire natuurlijke herkenningspunt terwijl de bemanning de geschiedenis en legendes ervan uitlegt. Daarna, afhankelijk van de zeecondities, ga je richting Cala Conta of Cala Bassa, waar je kunt stoppen voor een verfrissende duik in kristalhelder water voordat je terugkeert naar de haven van San Antonio.
            </p>
            <p>
              De prijs is inclusief drankjes en Finger Food.
            </p>

            <h3 className="text-xl font-bold mt-8">Wat is inbegrepen?</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>4 uur durende boottocht van San Antonio naar Es Vedrà (10:00-14:00)</li>
              <li>Lokale gids aan boord</li>
              <li>Drankjes (water, frisdranken, sangria, witte wijn en bier)</li>
              <li>Finger Food</li>
              <li>Zwemstop bij Cala Bassa of Cala Conta (afhankelijk van de zeecondities)</li>
              <li>Onderwaterzicht</li>
            </ul>

            <h3 className="text-xl font-bold mt-8">Wat te verwachten</h3>
            <p>
              Bezoek een van de mooiste natuurlijke omgevingen op Ibiza. Vertrekkend vanuit San Antonio, kun je tijdens de route de stranden van Cala Bassa, Cala Conta, Cala Molí, Cala Vadella, Cala Carbó en Cala D'Hort bewonderen, evenals de eilanden Conejera, del Bosque, Ses Bledes, S'Espartà en Es Vedrà.
            </p>

            <h3 className="text-xl font-bold mt-8">Belangrijke informatie</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vertrek vanuit de haven van San Antonio, kiosko Capitán Nemo (Zie kaart)</li>
              <li>Aanbevolen voor alle leeftijden</li>
              <li>Er zal een zwemstop zijn, dus je moet een zwempak en handdoek meenemen. Neem zonbescherming, zonnebril, zonnebrandcrème, een hoed mee...</li>
            </ul>

            <p className="mt-8 italic text-slate-300">
              Als je van deze excursie wilt genieten maar dan in de middag met zonsondergang, kun je hier je plek boeken: San Antonio naar Es Vedra Boottocht Zonsondergang
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
