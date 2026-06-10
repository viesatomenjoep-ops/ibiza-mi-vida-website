import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getVenues } from '@/lib/clubtickets';
import { ClubFaq } from '@/components/sections/ClubFaq';
import { Newsletter } from '@/components/sections/Newsletter';

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
    <div className="bg-background-primary min-h-screen pt-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative px-[5%] py-16 md:py-24 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 bg-velvet-obsidian">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            className="absolute inset-0 size-full object-cover opacity-80 scale-[1.35]" 
            src="https://res.cloudinary.com/daj1lyfgk/video/upload/q_auto,f_auto,so_30,du_30/v1781127267/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p_bqyeg4.mp4" 
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>

        <div className="container relative z-10 max-w-3xl text-center mx-auto text-white">
          <p className="mb-4 font-semibold text-white/80 tracking-widest uppercase drop-shadow-md">Ibiza 2026</p>
          <h1 className="mb-6 text-5xl font-serif font-bold md:text-7xl lg:text-8xl drop-shadow-lg">
            Official Club Tickets
          </h1>
          <p className="md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Secure your spot at the biggest and best parties in the world. Buy guaranteed authentic tickets for all top clubs without hidden fees.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#clubs" className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors shadow-lg">
              All Parties
            </a>
            <a href="https://wa.me/31683052875?text=Hi,%20I'm%20interested%20in%20a%20VIP%20Table" target="_blank" rel="noopener noreferrer" className="border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors shadow-lg">
              VIP Tables
            </a>
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section id="clubs" className="px-[5%] py-16 bg-velvet-obsidian text-white">
        <div className="container mx-auto">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="mb-4 text-4xl font-serif font-bold md:text-5xl drop-shadow-sm">Discover The Best Clubs</h2>
            <p className="text-white/80">Select your favorite club to view the current schedule, line-ups, and ticket prices.</p>
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
        </div>
      </section>

      <ClubFaq />
      <Newsletter />
    </div>
  );
}
