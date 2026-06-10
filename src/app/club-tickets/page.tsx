'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CLUBS = [
  { 
    id: 'hi-ibiza',
    name: 'Hï Ibiza',      
    category: 'Techno',
    tagline: 'Beleef de #1 club ter wereld met grensverleggende techno en spectaculaire lichtshows.',
    image: '/hi-ibiza-2026/FB_IMG_1779623300180.jpg' 
  },
  { 
    id: 'amnesia',
    name: 'Amnesia',       
    category: 'House',
    tagline: 'De ultieme house en techno ervaring sinds de jaren \'70 in deze legendarische tempel.',
    image: '/hi-ibiza-2026/FB_IMG_1779623220486.jpg' 
  },
  { 
    id: 'ushuaia',
    name: 'Ushuaïa Ibiza', 
    category: 'Commercial',
    tagline: 'Feest in de buitenlucht met \'s werelds beste en grootste DJ\'s rondom het indrukwekkende zwembad.',
    image: '/ushuaia-2026/image_search_1779624236635.jpg' 
  },
  { 
    id: 'pacha',
    name: 'Pacha Ibiza',   
    category: 'Disco',
    tagline: 'Glamour, house en disco in de meest iconische club met de beroemde kersen.',
    image: '/hi-ibiza-2026/FB_IMG_1779623247060.jpg' 
  },
  { 
    id: 'obeach',
    name: 'O Beach Ibiza', 
    category: 'Pool Party',
    tagline: 'De ultieme day-club experience in San Antonio met spectaculaire shows overdag in de zon.',
    image: '/ushuaia-2026/image_search_1779624261942.jpg' 
  },
  { 
    id: 'ibizarocks',
    name: 'Ibiza Rocks',   
    category: 'Live / Commercial',
    tagline: 'Hét iconische poolparty hotel waar live artiesten en de beste UK dj\'s het podium overnemen.',
    image: '/ushuaia-2026/image_search_1779624290030.jpg' 
  },
];

const FAQS = [
  {
    question: "Hoe ontvang ik mijn tickets?",
    answer: "Tickets worden direct na betaling als PDF of mobiele QR-code naar je e-mailadres gestuurd. Bewaar deze goed op je telefoon."
  },
  {
    question: "Zijn de tickets 100% origineel?",
    answer: "Absoluut. Wij zijn officiële partners van alle grote clubs in Ibiza, dus je loopt nooit risico aan de deur."
  },
  {
    question: "Hoe laat moet ik binnen zijn?",
    answer: "Let op het tijdslot op je ticket. Early-entry tickets vereisen vaak dat je voor een bepaald tijdstip (bijv. 01:00) binnen bent."
  },
  {
    question: "Kan ik ook VIP tafels boeken?",
    answer: "Ja, we bieden VIP-tafels met flessen en persoonlijke service aan voor vrijwel elke club. Neem contact met ons op via WhatsApp voor de prijzen."
  }
];

export default function ClubTicketsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-background-primary min-h-screen pt-24 pb-16">
      
      {/* Hero Section */}
      <section className="px-[5%] py-16 md:py-24">
        <div className="container max-w-3xl text-center mx-auto">
          <p className="mb-4 font-semibold text-blue-500 tracking-widest uppercase">Ibiza 2026</p>
          <h1 className="mb-6 text-5xl font-serif font-bold md:text-7xl lg:text-8xl">
            Officiële Club Tickets
          </h1>
          <p className="md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Verzeker je plek op de grootste en beste feesten ter wereld. Koop gegarandeerd echte tickets voor alle topclubs zonder verborgen kosten.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#clubs" className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
              Alle Feesten
            </a>
            <a href="https://wa.me/31683052875?text=Hi,%20I'm%20interested%20in%20a%20VIP%20Table" target="_blank" rel="noopener noreferrer" className="border border-black px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors">
              VIP Tafels
            </a>
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section id="clubs" className="px-[5%] py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="mb-4 text-4xl font-serif font-bold md:text-5xl">Ontdek De Beste Clubs</h2>
            <p className="text-gray-600">Selecteer je favoriete club om de actuele agenda, line-ups en ticketprijzen te bekijken.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CLUBS.map((club) => (
              <div key={club.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image 
                    src={club.image} 
                    alt={club.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {club.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-serif font-bold mb-3">{club.name}</h3>
                  <p className="text-gray-600 mb-6 flex-1">{club.tagline}</p>
                  <Link href={`/club-tickets/${club.id}`} className="inline-flex items-center gap-2 text-black font-semibold hover:text-blue-500 transition-colors group/link">
                    Bekijk Line-up
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/link:translate-x-1">
                      <path d="M5 12h14m-7-7 7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-[5%] py-20 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-blue-500 font-semibold tracking-widest uppercase mb-2">Tickets FAQ</p>
            <h2 className="text-4xl font-serif font-bold mb-4">Veelgestelde Vragen</h2>
            <p className="text-gray-600">Vind snel antwoord op veelgestelde vragen over het boeken van club tickets.</p>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button 
                  className="w-full text-left px-6 py-5 font-semibold text-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  {faq.question}
                  <svg className={`w-6 h-6 transform transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="px-6 py-5 bg-white text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="px-[5%] py-20 bg-black text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-blue-400 font-semibold tracking-widest uppercase mb-4">Blijf Op De Hoogte</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Mis Geen Enkel Feest</h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg">
            Schrijf je in voor onze nieuwsbrief en ontvang als eerste updates over ticket sales, exclusieve line-up onthullingen en de beste VIP deals voor jouw Ibiza trip.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Jouw e-mailadres" 
              className="px-6 py-4 rounded-full text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-500 transition-colors shrink-0">
              Meld je aan
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            Door je aan te melden ga je akkoord met onze Privacy Policy.
          </p>
        </div>
      </section>

    </div>
  );
}
