'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CLUBS = [
  { 
    id: 'hi-ibiza',
    name: 'Hï Ibiza',      
    category: 'Techno',
    tagline: 'Experience the #1 club in the world with groundbreaking techno and spectacular light shows.',
    image: '/hi-ibiza-2026/FB_IMG_1779623300180.jpg' 
  },
  { 
    id: 'amnesia',
    name: 'Amnesia',       
    category: 'House',
    tagline: 'The ultimate house and techno experience since the \'70s in this legendary temple.',
    image: '/hi-ibiza-2026/FB_IMG_1779623220486.jpg' 
  },
  { 
    id: 'ushuaia',
    name: 'Ushuaïa Ibiza', 
    category: 'Commercial',
    tagline: 'Party outdoors with the world\'s best and biggest DJs around the impressive pool.',
    image: '/ushuaia-2026/image_search_1779624236635.jpg' 
  },
  { 
    id: 'pacha',
    name: 'Pacha Ibiza',   
    category: 'Disco',
    tagline: 'Glamour, house, and disco in the most iconic club with the famous cherries.',
    image: '/hi-ibiza-2026/FB_IMG_1779623247060.jpg' 
  },
  { 
    id: 'obeach',
    name: 'O Beach Ibiza', 
    category: 'Pool Party',
    tagline: 'The ultimate day-club experience in San Antonio with spectacular daytime shows in the sun.',
    image: '/ushuaia-2026/image_search_1779624261942.jpg' 
  },
  { 
    id: 'ibizarocks',
    name: 'Ibiza Rocks',   
    category: 'Live / Commercial',
    tagline: 'The iconic pool party hotel where live artists and the best UK DJs take over the stage.',
    image: '/ushuaia-2026/image_search_1779624290030.jpg' 
  },
];

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

export default function ClubTicketsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
            className="absolute inset-0 size-full object-cover opacity-80" 
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
            {CLUBS.map((club) => (
              <div key={club.id} className="bg-white text-velvet-obsidian rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image 
                    src={club.image} 
                    alt={club.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-black">
                    {club.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-serif font-bold mb-3">{club.name}</h3>
                  <p className="text-gray-600 mb-6 flex-1">{club.tagline}</p>
                  <Link href={`/club-tickets/${club.id}`} className="inline-flex items-center gap-2 text-black font-semibold hover:text-blue-500 transition-colors group/link">
                    View Line-up
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
            <h2 className="text-4xl font-serif font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find quick answers to frequently asked questions about booking club tickets.</p>
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
          <p className="text-blue-400 font-semibold tracking-widest uppercase mb-4">Stay Updated</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Don't Miss Any Party</h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg">
            Subscribe to our newsletter and be the first to receive updates on ticket sales, exclusive line-up reveals, and the best VIP deals for your Ibiza trip.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-6 py-4 rounded-full text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-500 transition-colors shrink-0">
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            By subscribing you agree to our Privacy Policy.
          </p>
        </div>
      </section>

    </div>
  );
}
