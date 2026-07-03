'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, Users, MapPin, Clock, MessageCircle, Anchor, Star, Compass } from 'lucide-react';

interface Props {
  dict: any;
  locale: string;
}

export default function PrivateBoatChartersClient({ dict, locale }: Props) {
  const isNl = locale === 'nl';
  const whatsappNumber = '34683052875';

  const yachts = [
    {
      name: 'Vanguard Marine RIB 750',
      type: 'Sporty RIB',
      capacity: '12 pers.',
      length: '7.5m',
      engine: '250 HP',
      price: '650',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop',
      features: isNl 
        ? ['Inclusief kapitein', 'Brandstof inbegrepen (Formentera route)', 'Drankjes & ijsbox', 'Snorkelsets']
        : ['Captain included', 'Fuel included (Formentera route)', 'Drinks & icebox', 'Snorkel gear'],
      whatsappText: isNl
        ? `Hallo, ik wil graag de Vanguard Marine RIB 750 charter boeken op Ibiza!`
        : `Hello, I would like to book the Vanguard Marine RIB 750 charter in Ibiza!`
    },
    {
      name: 'Cranchi Endurance 39',
      type: 'Luxury Cruiser',
      capacity: '10 + 1 crew',
      length: '12m',
      engine: '2x 300 HP',
      price: '1.250',
      image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=600&auto=format&fit=crop',
      features: isNl
        ? ['Professionele kapitein', 'Grote ligbedden voor & achter', 'Cabin met badkamer', 'Paddleboard & Snorkelsets']
        : ['Professional captain', 'Large sunbeds front & back', 'Cabin with bathroom', 'Paddleboard & Snorkel gear'],
      whatsappText: isNl
        ? `Hallo, ik wil graag de Cranchi Endurance 39 jacht boeken op Ibiza!`
        : `Hello, I would like to book the Cranchi Endurance 39 yacht in Ibiza!`
    },
    {
      name: 'Fjord 40 Open VIP',
      type: 'Luxury Designer Yacht',
      capacity: '12 + 1 crew',
      length: '12.2m',
      engine: '2x 370 HP',
      price: '2.200',
      image: 'https://images.unsplash.com/photo-1605281317010-fe5fed93a4c8?q=80&w=600&auto=format&fit=crop',
      features: isNl
        ? ['Ervaren VIP kapitein', 'Premium geluidssysteem (Bluetooth)', 'Teak deck & open bar', 'Seabob optioneel beschikbaar']
        : ['Experienced VIP captain', 'Premium sound system (Bluetooth)', 'Teak deck & open bar', 'Seabob optionally available'],
      whatsappText: isNl
        ? `Hallo, ik wil graag de Fjord 40 Open VIP charter boeken op Ibiza!`
        : `Hello, I would like to book the Fjord 40 Open VIP charter in Ibiza!`
    }
  ];

  return (
    <div className="theme-monaco-vip bg-[var(--color-paper)] text-[var(--color-ink)] min-h-screen pb-24">
      {/* Back navigation pill */}
      <div className="wrap pt-5 pb-0">
        <Link
          href={`/${locale}/boat-parties`}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          <ChevronRight size={13} className="rotate-180" />
          Boats
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[380px] md:h-[460px] overflow-hidden flex items-end rounded-b-[40px] bg-black mt-4">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1400&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-paper)] via-[var(--color-paper)]/50 to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12">
          <div className="flex flex-col items-start gap-3">
            <span className="bg-ibiza-green text-velvet-obsidian px-4 py-1 rounded-full text-xs uppercase tracking-widest font-black shadow-sm flex items-center gap-1.5">
              <Anchor size={12} /> 100% Private Charters
            </span>
            <h1 className="text-4xl md:text-6xl font-black font-serif text-white tracking-tight leading-none uppercase drop-shadow-md">
              {isNl ? 'Privé Boot Huren Ibiza' : 'Private Boat Hire Ibiza'}
            </h1>
            <p className="text-base md:text-xl text-white/80 max-w-2xl leading-relaxed font-semibold">
              {isNl 
                ? 'Jouw eigen luxe jacht of motorboot voor de dag. Inclusief schipper, brandstof, drankjes en snorkeluitrusting. Vaar naar Formentera of Es Vedrà.' 
                : 'Your own luxury yacht or motorboat for the day. Including captain, fuel, drinks and snorkel gear. Sail to Formentera or Es Vedrà.'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Quickbar */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-[24px]">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-1">{isNl ? 'Kapitein' : 'Captain'}</span>
            <span className="text-sm md:text-base font-bold text-white flex items-center gap-1.5"><Star size={16} className="text-ibiza-green" /> {isNl ? 'Inbegrepen' : 'Included'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-1">{isNl ? 'Brandstof' : 'Fuel'}</span>
            <span className="text-sm md:text-base font-bold text-white flex items-center gap-1.5"><Compass size={16} className="text-ibiza-green" /> {isNl ? 'Inbegrepen' : 'Included'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-1">{isNl ? 'Capaciteit' : 'Capacity'}</span>
            <span className="text-sm md:text-base font-bold text-white flex items-center gap-1.5"><Users size={16} className="text-ibiza-green" /> {isNl ? 'Tot 12 personen' : 'Up to 12 guests'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-1">{isNl ? 'Extra\'s' : 'Extras'}</span>
            <span className="text-sm md:text-base font-bold text-white flex items-center gap-1.5"><Users size={16} className="text-ibiza-green" /> {isNl ? 'Drankjes & snorkels' : 'Drinks & snorkels'}</span>
          </div>
        </div>
      </div>

      {/* Main Yacht Fleet Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex flex-col items-start mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-ibiza-green mb-2">{isNl ? 'Selecteer een Boot' : 'Select a Yacht'}</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-white uppercase">{isNl ? 'Onze Premium Vloot' : 'Our Premium Fleet'}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {yachts.map((y, idx) => (
            <div 
              key={idx} 
              className="bg-black/30 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/20 flex flex-col justify-between"
            >
              {/* Image box */}
              <div className="relative h-60 w-full overflow-hidden">
                <img 
                  src={y.image} 
                  alt={y.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                />
                <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                  {y.type}
                </span>
                <span className="absolute top-4 right-4 bg-ibiza-green text-velvet-obsidian px-3 py-1 rounded-full text-xs font-black uppercase">
                  Vanaf €{y.price}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight uppercase font-serif">{y.name}</h3>
                  
                  {/* Specifications */}
                  <div className="grid grid-cols-3 gap-2 border-b border-white/10 pb-4 mb-4 text-white/60 text-xs font-bold uppercase">
                    <div className="flex items-center gap-1"><Users size={12} /> {y.capacity}</div>
                    <div className="flex items-center gap-1"><Compass size={12} /> {y.length}</div>
                    <div className="flex items-center gap-1"><Anchor size={12} /> {y.engine}</div>
                  </div>

                  {/* Included features list */}
                  <ul className="flex flex-col gap-2 mb-6">
                    {y.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/95 font-semibold leading-tight">
                        <span className="text-ibiza-green text-sm">✔</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Booking CTA button */}
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(y.whatsappText)}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-[var(--spring)] hover:brightness-110 text-white font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg uppercase tracking-wider"
                >
                  <MessageCircle size={18} fill="currentColor" stroke="none" />
                  {isNl ? 'Beschikbaarheid checken ↗' : 'Check availability ↗'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp banner call to action */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="bg-gradient-to-r from-ibiza-green/20 via-ibiza-green/5 to-transparent border border-ibiza-green/20 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 flex-1">
            <span className="text-xs uppercase font-bold tracking-widest text-ibiza-green mb-2 block">
              {isNl ? 'Direct Offerte Ontvangen?' : 'Want an instant proposal?'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-white uppercase mb-4 leading-none">
              {isNl ? 'Boek Jouw Droomdag op het Water' : 'Book Your Dream Day on the Water'}
            </h2>
            <p className="text-white/80 font-semibold leading-relaxed max-w-2xl">
              {isNl
                ? 'Stuur ons je gewenste datum en aantal personen via WhatsApp. Je ontvangt binnen 1 uur een volledig voorstel op maat met de op die dag beschikbare boten!'
                : 'Send us your preferred date and group size via WhatsApp. You will receive a customized proposal with all available yachts within 1 hour!'}
            </p>
          </div>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(isNl ? 'Hallo, ik wil graag info over een boot charter!' : 'Hello, I want info about a yacht charter!')}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-10 shrink-0 bg-[#25D366] text-black font-black text-base px-8 py-5 rounded-2xl flex items-center gap-2.5 transition-all shadow-xl hover:scale-[1.03]"
          >
            <MessageCircle size={24} fill="currentColor" stroke="none" />
            {isNl ? 'Stuur WhatsApp' : 'Send WhatsApp'}
          </a>
        </div>
      </section>

      {/* Itineraries / Routes Section */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="flex flex-col items-start mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-ibiza-green mb-2">{isNl ? 'Kies je route' : 'Choose your route'}</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-white uppercase">{isNl ? 'Populaire Vaarroutes' : 'Popular Sailing Itineraries'}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-black/30 border border-white/10 p-8 rounded-3xl flex flex-col gap-4">
            <span className="text-4xl">🏝</span>
            <h3 className="text-2xl font-serif font-black text-white uppercase">Route 1: Formentera &amp; Espalmador</h3>
            <p className="text-white/70 font-semibold text-sm leading-relaxed">
              {isNl
                ? 'De absolute bestseller. We varen in ca. 45 minuten van de haven van Ibiza naar het idyllische onbewoonde eilandje Espalmador voor een verfrissende duik. Vervolgens varen we langs Playa de ses Illetes en ankeren we voor een exclusieve lunch bij hotspots zoals Beso Beach, Juan y Andrea of Chezz Gerdi.'
                : 'The absolute bestseller. We sail in about 45 minutes from Ibiza harbor to the idyllic uninhabited island of Espalmador for a swim. Next, we cruise along Playa de ses Illetes and anchor for an exclusive lunch at hotspots like Beso Beach, Juan y Andrea or Chezz Gerdi.'}
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 p-8 rounded-3xl flex flex-col gap-4">
            <span className="text-4xl">🌅</span>
            <h3 className="text-2xl font-serif font-black text-white uppercase">Route 2: Mystiek Es Vedrà &amp; Cala Comte</h3>
            <p className="text-white/70 font-semibold text-sm leading-relaxed">
              {isNl
                ? 'Een prachtige tocht langs de rotsachtige westkust van Ibiza. We varen naar de iconische en mystieke Es Vedrà rots, waar je de energie van dichtbij ervaart. Onderweg stoppen we bij de kristalheldere baaien van Cala Tarida en Cala Comte voor snorkelen en zwemmen, met als afsluiter een adembenemende zonsondergang vanaf de boot.'
                : 'A beautiful trip along the rocky west coast of Ibiza. We sail to the iconic and mystical Es Vedrà rock, where you can feel the energy up close. On the way, we stop at the crystal-clear bays of Cala Tarida and Cala Comte for snorkeling and swimming, ending with a breathtaking sunset from the boat.'}
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-black/20 border-t border-b border-white/10 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-ibiza-green mb-2">{isNl ? 'Stappenplan' : 'Steps'}</span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-white uppercase">{isNl ? 'Hoe werkt het?' : 'How It Works'}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl text-center">
              <span className="w-10 h-10 rounded-full bg-ibiza-green text-black font-black text-lg flex items-center justify-center mx-auto mb-4">1</span>
              <h4 className="text-lg font-bold text-white uppercase mb-2">{isNl ? 'Wensen Doorsturen' : 'Share Preferences'}</h4>
              <p className="text-white/60 text-sm font-semibold">{isNl ? 'Stuur ons je groepsgrootte en gewenste datum via WhatsApp.' : 'Send us your group size and desired date via WhatsApp.'}</p>
            </div>
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl text-center">
              <span className="w-10 h-10 rounded-full bg-ibiza-green text-black font-black text-lg flex items-center justify-center mx-auto mb-4">2</span>
              <h4 className="text-lg font-bold text-white uppercase mb-2">{isNl ? 'Voorstel Ontvangen' : 'Receive Proposal'}</h4>
              <p className="text-white/60 text-sm font-semibold">{isNl ? 'Wij sturen je direct een overzicht van alle beschikbare jachten en prijzen.' : 'We instantly send you an overview of all available yachts and prices.'}</p>
            </div>
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl text-center">
              <span className="w-10 h-10 rounded-full bg-ibiza-green text-black font-black text-lg flex items-center justify-center mx-auto mb-4">3</span>
              <h4 className="text-lg font-bold text-white uppercase mb-2">{isNl ? 'Vaar Uit!' : 'Sail Out!'}</h4>
              <p className="text-white/60 text-sm font-semibold">{isNl ? 'Na bevestiging staat de boot met gekoelde drankjes voor je klaar.' : 'Upon confirmation, the boat with chilled drinks will be ready for you.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Introduction block */}
      <section className="max-w-7xl mx-auto px-6 mt-20 intro-seo text-white/80 font-semibold leading-relaxed">
        <h2>{isNl ? 'Exclusieve Jacht en Boot Verhuur op Ibiza' : 'Exclusive Yacht and Boat Rental in Ibiza'}</h2>
        <p>
          {isNl
            ? 'Een dag varen op een privé jacht of motorboot is ongetwijfeld het hoogtepunt van elke vakantie op Ibiza. Bij Ibiza mi Vida maken we het huren van een boot uiterst eenvoudig en transparant. Geen verborgen kosten, geen onverwachte toeslagen aan de kade. Al onze charters worden verhuurd inclusief een ervaren lokale kapitein die de mooiste verborgen grotten en baaien van Ibiza en Formentera weet te vinden.'
            : 'Sailing on a private yacht or motorboat is undoubtedly the highlight of any vacation in Ibiza. At Ibiza mi Vida we make renting a boat extremely simple and transparent. No hidden costs, no unexpected surcharges at the quay. All our charters are rented including an experienced local captain who knows how to find the most beautiful hidden caves and bays of Ibiza and Formentera.'}
        </p>
        <p>
          {isNl
            ? 'Of je nu op zoek bent naar een sportieve RIB om snel de oversteek naar de zandstranden van Formentera te maken, of de voorkeur geeft aan een luxe motorjacht zoals de Fjord 40 met grote zonnebedden en een hoogwaardig geluidssysteem; onze vloot biedt voor elke groep de perfecte boot. Vraag vandaag nog geheel vrijblijvend de beschikbaarheid en prijzen aan voor jouw gewenste datum.'
            : 'Whether you are looking for a sporty RIB to quickly cross over to the sandy beaches of Formentera, or prefer a luxury motor yacht like the Fjord 40 with large sun beds and a high-quality sound system; our fleet offers the perfect boat for every group. Request availability and prices for your preferred date today without any obligation.'}
        </p>
      </section>
    </div>
  );
}
