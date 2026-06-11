import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getVenues } from '@/lib/clubtickets';
import { ClubFaq } from '@/components/sections/ClubFaq';
import { Newsletter } from '@/components/sections/Newsletter';
import { CategoryHero } from '@/components/hero/CategoryHero';

const FAQS = [
  {
    question: "How do I receive my tickets?",
    answer: "Tickets are sent to your email address as a PDF or mobile QR code immediately after payment. Keep them safe on your phone."
  },
  {
    question: "Are the tickets 100% authentic?",
    answer: "Absolutely. We are official partners of all major clubs in Ibiza, so you never run any risk at the door."
  },
  {
    question: "What time do I need to be inside?",
    answer: "Pay attention to the time slot on your ticket. Early-entry tickets often require you to be inside before a specific time (e.g., 01:00)."
  },
  {
    question: "Can I also book VIP tables?",
    answer: "Yes, we offer VIP tables with bottles and personalized service for almost every club. Contact us via WhatsApp for prices."
  }
];

export const revalidate = 3600;

export default async function ClubTicketsPage() {
  const allVenues = await getVenues('en');
  // Only show clubbing venues for this page
  const clubs = allVenues.filter(v => v.type.slug === 'clubbing');

  return (
    <>
      <CategoryHero
        title="Official Club Tickets"
        subtitle="Secure your spot at the biggest and best parties in the world. Buy guaranteed authentic tickets for all top clubs without hidden fees."
        colorTheme="velvet-obsidian"
        eyebrow="Ibiza 2026"
      />

      {/* Clubs Grid */}
      <section id="clubs" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="mb-4 text-4xl font-serif font-bold md:text-5xl text-velvet-obsidian drop-shadow-sm">Discover The Best Clubs</h2>
          <p className="text-velvet-obsidian/80">Select your favorite club to view the current schedule, line-ups, and ticket prices.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club) => (
            <Link href={`/club-tickets/${club.slug}`} key={club.id} className="bg-white text-velvet-obsidian rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-[380px]">
              <div className="relative h-full w-full overflow-hidden">
                <Image 
                  src={club.cover || club.picture || '/hi-ibiza-2026/FB_IMG_1779623220486.jpg'} 
                  alt={club.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {club.type && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-black shadow-sm">
                    {club.type.name}
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center transform transition-transform duration-300">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 drop-shadow-md">{club.name}</h3>
                  
                  <span className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white text-white hover:text-velvet-obsidian backdrop-blur-md px-6 py-3 rounded-full font-semibold transition-all duration-300">
                    View Club Calendar
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14m-7-7 7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ClubFaq />
      <Newsletter />
    </>
  );
}
