'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronRight, Calendar, Info, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { boatCharters, boatParties, formenteraTrips } from '@/data/mockData';

// Combine some data into unified activities list to match Tiqets view
const activities = [
  ...formenteraTrips.map(t => ({
    id: t.id,
    title: t.name,
    category: 'EXCURSIES',
    duration: t.duration,
    features: ['Vandaag beschikbaar', t.frequency],
    price: parseFloat(t.price) || 46,
    discountPrice: null,
    rating: 4.8,
    reviews: 145,
    image: t.image
  })),
  ...boatParties.map(bp => ({
    id: bp.id,
    title: bp.name,
    category: 'BOOTTOCHTEN',
    duration: bp.duration,
    features: ['Vandaag beschikbaar', 'Gids in het Engels, Spaans'],
    price: parseFloat(bp.price) || 79,
    discountPrice: (parseFloat(bp.price) || 79) * 0.85,
    rating: 4.5,
    reviews: 89,
    image: bp.image
  })),
  ...boatCharters.map(bc => ({
    id: bc.id,
    title: bc.name,
    category: 'PRIVÉ BOTEN',
    duration: 'Hele dag (8 uur)',
    features: ['Direct reserveren', `Capaciteit: ${bc.capacity} personen`],
    price: parseFloat(bc.pricePerDay.replace(/,/g, '')) || 1450,
    discountPrice: null,
    rating: 5.0,
    reviews: 24,
    image: bc.image
  }))
];

const categories = [
  "Formentera Tours", "Boat Parties", "VIP Catamaran", "Jet Ski Rentals", 
  "Pacha Tickets", "Amnesia Tickets", "Ushuaïa Tickets", "Hï Ibiza Tickets",
  "Sunset Cruises", "Scooter Rentals"
];

const tags = [
  "San Antonio", "Ibiza Stad", "Playa d'en Bossa", "Santa Eulalia", 
  "Formentera", "Cala Jondal", "Es Vedra", "San Juan"
];

export default function HomePageClient() {
  const { addToCart, openDrawer } = useCart();
  const [activeDate, setActiveDate] = useState<number>(24);

  // Generate some dates
  const dates = [
    { day: 'MA', date: 23 },
    { day: 'VANDAAG', date: 24 },
    { day: 'WO', date: 25 },
    { day: 'DO', date: 26 },
    { day: 'VR', date: 27 },
    { day: 'ZA', date: 28 },
    { day: 'ZO', date: 29 },
    { day: 'MA', date: 30 },
  ];

  const handleBook = (activity: any) => {
    addToCart({
      serviceId: activity.id,
      title: activity.title,
      price: activity.discountPrice || activity.price,
      image: activity.image,
      date: `June ${activeDate}, 2026`
    });
    openDrawer();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased pb-20">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:underline">Ibiza</Link>
        <ChevronRight size={12} />
        <span className="font-medium text-slate-700">Activiteiten & Excursies</span>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="relative w-full h-[400px] md:h-[450px] rounded-2xl overflow-hidden flex items-end p-6 md:p-10 shadow-lg">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="https://res.cloudinary.com/daj1lyfgk/video/upload/q_auto:good,f_auto,so_30,du_30,w_1920/v1781127267/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p_bqyeg4.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-0"></div>
          
          <div className="relative z-10 w-full">
            <div className="flex items-center gap-1 text-amber-400 text-sm font-bold mb-2">
              <Star size={16} fill="currentColor" />
              <span>4.8 (1.2k+ reviews)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">
              Activiteiten & Excursies in <br/>Ibiza
            </h1>
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg text-sm md:text-base font-medium shadow-sm">
              Verken de mooiste stranden, feesten en verborgen parels van het eiland
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Availability Section */}
        <div className="mb-8 border-b border-slate-200 pb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Bekijk beschikbaarheid</h2>
          <div className="flex justify-between items-end text-xs text-slate-500 font-bold mb-2 px-1 uppercase tracking-wider">
            <span>JUN 2026</span>
            <span>JUL 2026</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {dates.map((d, i) => (
              <button 
                key={i}
                onClick={() => setActiveDate(d.date)}
                className={`min-w-[100px] flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  activeDate === d.date 
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600 text-blue-700' 
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`text-xs font-semibold mb-1 ${activeDate === d.date ? 'text-blue-700' : 'text-slate-500'}`}>{d.day}</span>
                <span className="text-2xl font-bold">{d.date}</span>
              </button>
            ))}
            <button className="min-w-[100px] flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all">
              <Calendar size={20} className="mb-1 text-slate-500" />
              <span className="text-xs font-semibold">Meer data</span>
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-slate-600 flex items-center gap-1">
            <span className="font-bold text-slate-900">{activities.length} opties</span> 
            <Info size={14} className="text-slate-400" /> 
            <span>• vanaf € 46,00</span>
          </div>
          <button className="text-sm font-semibold text-slate-700 flex items-center gap-1 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
            Sorteer op <ChevronDown size={16} />
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {activities.map((activity) => (
            <div key={activity.id} className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => handleBook(activity)}>
              <div className="relative h-56 w-full overflow-hidden">
                <Image 
                  src={activity.image} 
                  alt={activity.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-3 self-start">
                  {activity.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                  {activity.title}
                </h3>
                
                <ul className="space-y-1.5 mb-4 text-sm text-slate-600">
                  {activity.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {idx === 0 ? <span className="text-slate-900 font-bold">✓</span> : <span className="text-slate-400">•</span>}
                      <span>{feature}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400">•</span>
                    <span>Duur: {activity.duration}</span>
                  </li>
                </ul>

                <button className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-600 self-start mb-6 flex items-center gap-1">
                  Toon inbegrepen items <Info size={14} className="text-slate-400 no-underline" />
                </button>

                <div className="mt-auto flex justify-between items-end pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                    <Star size={14} fill="#F59E0B" className="text-amber-500" />
                    <span>{activity.rating} <span className="text-slate-400 font-normal">({activity.reviews})</span></span>
                  </div>
                  <div className="text-right">
                    {activity.discountPrice && (
                      <div className="flex items-center justify-end gap-2 mb-0.5">
                        <span className="text-xs text-slate-500 line-through">Vanaf € {activity.price.toFixed(2)}</span>
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          -{Math.round((1 - activity.discountPrice / activity.price) * 100)}%
                        </span>
                      </div>
                    )}
                    <div className="text-xs text-slate-500">Vanaf</div>
                    <div className="text-xl font-bold text-slate-900">
                      € {(activity.discountPrice || activity.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Leukste activiteiten in Ibiza</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat, i) => (
              <button key={i} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors">
                {cat}
              </button>
            ))}
          </div>
          <button className="mt-4 text-sm font-bold text-slate-900 hover:underline flex items-center gap-1">
            Ontdek Ibiza <ChevronRight size={16} />
          </button>
        </div>

        {/* Regions/Cities Section */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Top locaties in Ibiza</h3>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, i) => (
              <button key={i} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors">
                {tag}
              </button>
            ))}
          </div>
          <button className="mt-4 text-sm font-bold text-slate-900 hover:underline flex items-center gap-1">
            Ontdek Locaties <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
