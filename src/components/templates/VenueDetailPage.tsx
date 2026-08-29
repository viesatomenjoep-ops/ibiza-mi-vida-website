'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cleanHtml } from '@/lib/html-utils'
import { VenueLocationMap } from '@/components/ui/VenueLocationMap'
import { BackButton } from '@/components/ui/BackButton'
import { VenueSchema } from '@/components/seo/VenueSchema'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'

interface VenueDetailPageProps {
  club: any;
  allDates: any[];
  locale: string;
  basePath: string;
}

const BCP: Record<string, string> = { en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' }

interface VenueLabels {
  night: string; daytime: string; ibizaSpain: string;
  weeklyKicker: string; weeklyTitlePrefix: string;
  posterFromApi: string; tickets: string; ticketsUpper: string; buyTickets: string;
  allEvents: string; agendaPrefix: string;
  aboutPrefix: string; guestlistVip: string;
  practicalInfo: string; location: string; openingHours: string; atNight: string; genre: string; clubbing: string;
  faqKicker: string; stickyAgenda: string; events: string; viewTickets: string;
  faqs: (name: string) => { q: string; a: string }[];
}

const VENUE_I18N: Record<string, VenueLabels> = {
  en: {
    night: 'Night', daytime: 'Daytime', ibizaSpain: 'Ibiza, Spain',
    weeklyKicker: 'Weekly parties 2026', weeklyTitlePrefix: 'Regular nights at',
    posterFromApi: 'Poster from API', tickets: 'Tickets', ticketsUpper: 'TICKETS', buyTickets: 'Buy Tickets',
    allEvents: 'All events', agendaPrefix: 'Schedule',
    aboutPrefix: 'About', guestlistVip: 'Package deals & VIP via WhatsApp',
    practicalInfo: 'Practical info', location: 'Location', openingHours: 'Opening hours', atNight: 'At night', genre: 'Genre', clubbing: 'Clubbing',
    faqKicker: 'Frequently asked questions', stickyAgenda: 'Schedule', events: 'Events', viewTickets: 'View Tickets',
    faqs: (name) => [
      { q: `Which nights is ${name} open in 2026?`, a: `The weekly parties and exact days come live from the ClubTickets API and are shown above under "Weekly parties 2026". The programme can vary from month to month.` },
      { q: 'What does a ticket cost?', a: 'Prices vary per party and line-up and are shown live. Booking early is usually cheaper.' },
      { q: 'Is there a dress code?', a: 'Most Ibiza clubs have a smart-casual dress code. Specific rules per party are shown with the ticket information.' },
      { q: 'How do I get to the club?', a: "The address and route are in the info block. Shuttles and taxis run at night from Ibiza Town and Playa d'en Bossa." },
    ],
  },
  nl: {
    night: 'Nacht', daytime: 'Overdag', ibizaSpain: 'Ibiza, Spanje',
    weeklyKicker: 'Wekelijkse parties 2026', weeklyTitlePrefix: 'Vaste avonden in',
    posterFromApi: 'Poster uit API', tickets: 'Tickets', ticketsUpper: 'TICKETS', buyTickets: 'Koop tickets',
    allEvents: 'Alle events', agendaPrefix: 'Agenda',
    aboutPrefix: 'Over', guestlistVip: 'Package deals & VIP via WhatsApp',
    practicalInfo: 'Praktische info', location: 'Locatie', openingHours: 'Openingstijden', atNight: "'s Nachts", genre: 'Genre', clubbing: 'Clubbing',
    faqKicker: 'Veelgestelde vragen', stickyAgenda: 'Agenda', events: 'Events', viewTickets: 'Bekijk tickets',
    faqs: (name) => [
      { q: `Welke avonden is ${name} open in 2026?`, a: `De weekly parties en exacte dagen komen live uit de ClubTickets API en zie je hierboven bij "Wekelijkse parties 2026". Het programma kan per maand verschillen.` },
      { q: 'Wat kost een ticket?', a: 'Prijzen verschillen per party en line-up en worden live getoond. Vroeg boeken is meestal voordeliger.' },
      { q: 'Is er een dresscode?', a: 'De meeste Ibiza-clubs hanteren een nette-casual dresscode. Specifieke regels per party tonen we bij de ticketinformatie.' },
      { q: 'Hoe kom ik bij de club?', a: "Adres en route staan in het info-blok. Vanuit Ibiza-stad en Playa den Bossa rijden 's nachts shuttles en taxi's." },
    ],
  },
  de: {
    night: 'Nacht', daytime: 'Tagsüber', ibizaSpain: 'Ibiza, Spanien',
    weeklyKicker: 'Wöchentliche Partys 2026', weeklyTitlePrefix: 'Feste Abende im',
    posterFromApi: 'Poster aus API', tickets: 'Tickets', ticketsUpper: 'TICKETS', buyTickets: 'Tickets kaufen',
    allEvents: 'Alle Events', agendaPrefix: 'Programm',
    aboutPrefix: 'Über', guestlistVip: 'Package Deals & VIP über WhatsApp',
    practicalInfo: 'Praktische Infos', location: 'Standort', openingHours: 'Öffnungszeiten', atNight: 'Nachts', genre: 'Genre', clubbing: 'Clubbing',
    faqKicker: 'Häufige Fragen', stickyAgenda: 'Programm', events: 'Events', viewTickets: 'Tickets ansehen',
    faqs: (name) => [
      { q: `An welchen Abenden ist ${name} 2026 geöffnet?`, a: `Die wöchentlichen Partys und genauen Tage kommen live aus der ClubTickets-API und werden oben unter "Wöchentliche Partys 2026" angezeigt. Das Programm kann von Monat zu Monat variieren.` },
      { q: 'Was kostet ein Ticket?', a: 'Die Preise variieren je nach Party und Line-up und werden live angezeigt. Früh buchen ist meist günstiger.' },
      { q: 'Gibt es einen Dresscode?', a: 'Die meisten Ibiza-Clubs haben einen Smart-Casual-Dresscode. Spezifische Regeln pro Party werden bei den Ticketinformationen angezeigt.' },
      { q: 'Wie komme ich zum Club?', a: "Adresse und Route stehen im Info-Block. Nachts fahren Shuttles und Taxis von Ibiza-Stadt und Playa d'en Bossa." },
    ],
  },
  es: {
    night: 'Noche', daytime: 'De día', ibizaSpain: 'Ibiza, España',
    weeklyKicker: 'Fiestas semanales 2026', weeklyTitlePrefix: 'Noches fijas en',
    posterFromApi: 'Póster de la API', tickets: 'Entradas', ticketsUpper: 'ENTRADAS', buyTickets: 'Comprar entradas',
    allEvents: 'Todos los eventos', agendaPrefix: 'Agenda',
    aboutPrefix: 'Sobre', guestlistVip: 'Package deals y VIP por WhatsApp',
    practicalInfo: 'Información práctica', location: 'Ubicación', openingHours: 'Horario', atNight: 'Por la noche', genre: 'Género', clubbing: 'Clubbing',
    faqKicker: 'Preguntas frecuentes', stickyAgenda: 'Agenda', events: 'Eventos', viewTickets: 'Ver entradas',
    faqs: (name) => [
      { q: `¿Qué noches abre ${name} en 2026?`, a: `Las fiestas semanales y los días exactos vienen en directo de la API de ClubTickets y se muestran arriba en "Fiestas semanales 2026". El programa puede variar de un mes a otro.` },
      { q: '¿Cuánto cuesta una entrada?', a: 'Los precios varían según la fiesta y el line-up y se muestran en directo. Reservar con antelación suele ser más barato.' },
      { q: '¿Hay código de vestimenta?', a: 'La mayoría de los clubs de Ibiza tienen un código de vestimenta smart-casual. Las reglas específicas por fiesta se muestran con la información de la entrada.' },
      { q: '¿Cómo llego al club?', a: "La dirección y la ruta están en el bloque de información. Por la noche circulan lanzaderas y taxis desde Ibiza ciudad y Playa d'en Bossa." },
    ],
  },
  fr: {
    night: 'Nuit', daytime: 'En journée', ibizaSpain: 'Ibiza, Espagne',
    weeklyKicker: 'Soirées hebdomadaires 2026', weeklyTitlePrefix: 'Soirées régulières au',
    posterFromApi: 'Affiche via API', tickets: 'Billets', ticketsUpper: 'BILLETS', buyTickets: 'Acheter des billets',
    allEvents: 'Tous les événements', agendaPrefix: 'Agenda',
    aboutPrefix: 'À propos de', guestlistVip: 'Package deals & VIP via WhatsApp',
    practicalInfo: 'Infos pratiques', location: 'Emplacement', openingHours: 'Horaires', atNight: 'La nuit', genre: 'Genre', clubbing: 'Clubbing',
    faqKicker: 'Questions fréquentes', stickyAgenda: 'Agenda', events: 'Événements', viewTickets: 'Voir les billets',
    faqs: (name) => [
      { q: `Quels soirs ${name} est-il ouvert en 2026 ?`, a: `Les soirées hebdomadaires et les dates exactes proviennent en direct de l'API ClubTickets et sont affichées ci-dessus sous "Soirées hebdomadaires 2026". Le programme peut varier d'un mois à l'autre.` },
      { q: "Combien coûte un billet ?", a: 'Les prix varient selon la soirée et le line-up et sont affichés en direct. Réserver tôt est généralement plus avantageux.' },
      { q: 'Y a-t-il un code vestimentaire ?', a: 'La plupart des clubs d\'Ibiza appliquent un code vestimentaire smart-casual. Les règles spécifiques par soirée sont indiquées avec les informations de billetterie.' },
      { q: 'Comment me rendre au club ?', a: "L'adresse et l'itinéraire figurent dans le bloc d'infos. La nuit, des navettes et des taxis circulent depuis Ibiza-ville et Playa d'en Bossa." },
    ],
  },
}

export function VenueDetailPage({ club, allDates, locale, basePath }: VenueDetailPageProps) {
  const T = VENUE_I18N[locale] || VENUE_I18N.en;
  const bcp = BCP[locale] || 'en-GB';
  const imageUrl = club.cover || club.picture || '/hi-ibiza-2026/FB_IMG_1779623220486.jpg';

  const cleanDescription = club.description
    ? cleanHtml(club.description)
    : '';

  // Accept both the flat JSON shape (club.type.name / club.isDayClub — from
  // lib/clubtickets.ts) and a legacy Supabase-column shape.
  const typeName = club.type_name ?? club.type?.name;
  const isDayClub = club.is_day_club ?? club.isDayClub;

  // Process unique events and determine if they are "Weekly" or "More"
  const eventStats = new Map<string, { count: number, days: Set<string>, dayIdx: number, firstEvent: any }>();

  allDates.forEach(dateObj => {
    const d = new Date(dateObj.date);
    const dayIdx = d.getUTCDay(); // 0=Sun..6=Sat — locale-independent for sorting
    const dayOfWeek = d.toLocaleDateString(bcp, { weekday: 'long', timeZone: 'UTC' }).toUpperCase();
    // Accept both the flat JSON shape (eventSlug/eventName/eventCover — from
    // lib/clubtickets.ts) and a legacy nested `ct_events` shape, so this keeps
    // working regardless of which data source feeds this page.
    const eventGrp = dateObj.ct_events || {
      id: dateObj.eventId,
      name: dateObj.eventName || dateObj.name,
      slug: dateObj.eventSlug,
      cover: dateObj.eventCover,
      logo: dateObj.eventLogo,
    };
    if (!eventGrp?.slug) return;

    if (!eventStats.has(eventGrp.slug)) {
      eventStats.set(eventGrp.slug, {
        count: 0,
        days: new Set(),
        dayIdx: dayIdx,
        firstEvent: {
          id: eventGrp.id,
          name: eventGrp.name,
          slug: eventGrp.slug,
          cover: eventGrp.cover || eventGrp.logo,
          logo: eventGrp.whitelogo || eventGrp.logo,
          venueName: club.name
        }
      });
    }
    const stat = eventStats.get(eventGrp.slug)!;
    stat.count++;
    stat.days.add(dayOfWeek);
    stat.dayIdx = dayIdx;
  });

  const weeklyParties: any[] = [];
  const moreParties: any[] = [];

  Array.from(eventStats.values()).forEach(stat => {
    // If it happens on mostly 1 or 2 specific days of the week, and happens multiple times, it's a Weekly Party
    const daysArray = Array.from(stat.days);
    if (stat.count >= 3 && daysArray.length <= 2) {
      weeklyParties.push({
        ...stat.firstEvent,
        dayOfWeek: daysArray[0],
        dayIdx: stat.dayIdx
      });
    } else {
      moreParties.push({
        ...stat.firstEvent,
        dayOfWeek: undefined,
        dayIdx: stat.dayIdx
      });
    }
  });

  // Sort weekly parties by day of week (Mon-first, locale-independent)
  const mondayFirst = (i: number) => (i + 6) % 7; // Sun(0)->6, Mon(1)->0 ...
  weeklyParties.sort((a, b) => mondayFirst(a.dayIdx ?? 0) - mondayFirst(b.dayIdx ?? 0));

  // Refs for sliders
  const weeklyRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const scrollRail = (ref: React.RefObject<HTMLDivElement>, dir: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  // FAQ — localized
  const faqs = T.faqs(club.name);

  return (
    <>
      <VenueSchema
        name={club.name}
        slug={club.slug}
        description={club.cleanDescription || club.description}
        image={club.cover || club.picture}
        basePath={basePath}
        type={basePath === 'club-tickets' ? 'NightClub' : 'TouristAttraction'}
        locale={locale}
      />
      <FaqJsonLd faqs={faqs} />
      <div className="bg-white min-h-screen text-black pb-20 pt-0">
        
        {/* Hero Section */}
      <section className="relative h-[340px] md:h-[400px] rounded-b-[36px] overflow-hidden bg-gradient-to-br from-[#1a2e29] to-[#2C4A42] flex items-end">
        <Image
          src={imageUrl}
          alt={club.name}
          fill
          priority
          className="object-cover object-center mix-blend-overlay opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14221E]/90 via-transparent to-transparent z-10" />
        <BackButton locale={locale} fallbackHref={`/${locale}/clubs`} variant="top" />

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 pb-8 flex items-end gap-5 text-white">
          <div className="w-[88px] h-[88px] rounded-[22px] bg-white/95 shrink-0 flex items-center justify-center p-2 text-velvet-obsidian text-center text-xs font-bold shadow-lg">
            {club.whitelogo ? (
              <Image src={club.whitelogo} alt={`${club.name} logo`} width={72} height={72} className="object-contain filter invert" />
            ) : (
              <span>{club.name}</span>
            )}
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-2 drop-shadow-md">
              {club.name}
            </h1>
            <div className="flex gap-2 flex-wrap">
              {typeName && (
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                  {typeName}
                </span>
              )}
              {isDayClub !== undefined && (
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                  {isDayClub ? T.daytime : T.night}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick bar */}
      <div className="flex gap-2 flex-wrap -mt-[26px] relative z-30 px-4 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white shadow-md rounded-full px-5 py-3 font-bold text-sm cursor-pointer hover:bg-ibiza-mint transition-colors text-neutral-900">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/></svg>
          {T.ibizaSpain}
        </div>
      </div>

      {/* Weekly Parties */}
      {weeklyParties.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-6 gap-5">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2">{T.weeklyKicker}</div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold">{T.weeklyTitlePrefix} {club.name}</h2>
              </div>
              <div className="flex gap-2 shrink-0 hidden md:flex">
                <button onClick={() => scrollRail(weeklyRef, -1)} className="w-11 h-11 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-ibiza-green transition-colors text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button onClick={() => scrollRail(weeklyRef, 1)} className="w-11 h-11 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-ibiza-green transition-colors text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            <div ref={weeklyRef} className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
              {weeklyParties.map((party, i) => (
                <Link href={`/${locale}/${basePath}/${club.slug}/${party.slug}`} key={i} className="flex-none w-[260px] md:w-[280px] bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group snap-start">
                  <div className="h-[230px] relative bg-gradient-to-br from-ibiza-mint to-ibiza-blue overflow-hidden">
                    {party.cover ? (
                      <Image src={party.cover} alt={party.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 text-xs font-semibold text-center p-4">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-1"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 15l5-5 4 4 3-3 6 6"/></svg>
                        {T.posterFromApi}
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold z-10 text-neutral-900">{club.name}</span>
                    <span className="absolute top-3 right-3 bg-ibiza-green px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase z-10 text-white">{party.dayOfWeek}</span>
                  </div>
                  <div className="p-4 text-neutral-900">
                    <h3 className="text-lg font-bold leading-tight mb-2 truncate text-neutral-900">{party.name}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">{T.ticketsUpper}</div>
                      <button className="bg-ibiza-mint hover:bg-ibiza-green text-white font-bold text-xs px-4 py-2 rounded-full transition-colors">{T.tickets}</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event List (All Events) */}
      <section className="py-12 bg-white/50 text-neutral-900" id="tickets">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex items-end justify-between mb-6 gap-5">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-2">{T.allEvents}</div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900">{T.agendaPrefix} {club.name}</h2>
              </div>
           </div>
           
           <div className="flex flex-col gap-3">
             {allDates.slice(0, 10).map((date, i) => {
                const eventSlug = date.ct_events?.slug || date.eventSlug || 'event';
                const eventCover = date.ct_events?.cover || date.eventCover || date.eventLogo;
                const eventName = date.eventName || date.name;
                return (
                <Link href={`/${locale}/${basePath}/${club.slug}/${eventSlug}`} key={i} className="bg-white rounded-2xl p-3 md:p-4 border border-black/5 flex items-center gap-4 hover:shadow-md transition-shadow group">
                   <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden bg-ibiza-mint relative">
                     {eventCover && <Image src={eventCover} alt={eventName || 'Event'} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="text-neutral-500 text-xs font-bold tracking-wider uppercase mb-1">
                         {new Date(date.date).toLocaleDateString(bcp, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold truncate text-neutral-900">{eventName}</h3>
                   </div>
                   <div className="shrink-0 hidden md:block">
                      <button className="bg-ibiza-green text-white font-bold text-sm px-5 py-2.5 rounded-full hover:brightness-95 transition-all">
                        {T.buyTickets}
                      </button>
                   </div>
                </Link>
                );
             })}
           </div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-14 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 items-start">
            <div className="text-black text-lg leading-relaxed">
              <h2 className="text-3xl md:text-4xl font-serif font-black text-black tracking-tight mb-4">{T.aboutPrefix} {club.name}</h2>
              <div dangerouslySetInnerHTML={{ __html: cleanDescription }} className="prose prose-lg max-w-none text-black prose-p:text-black prose-li:text-black prose-strong:text-black mb-6" />
              
              <a href="https://wa.me/33666528412" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-ibiza-green text-velvet-obsidian font-bold text-sm px-6 py-3 rounded-full hover:brightness-95 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z"/></svg>
                {T.guestlistVip}
              </a>
            </div>
            
            <div className="bg-white border border-black/10 rounded-3xl p-7 md:p-8 shadow-sm text-black">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-black/40 mb-1">{T.practicalInfo}</h3>
              <div className="w-10 h-1 rounded-full bg-ibiza-green mb-6" />

              <div className="flex flex-col">
                <div className="flex items-center gap-4 py-4 border-b border-black/10">
                  <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center shrink-0 text-white">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                  </div>
                  <span className="text-sm font-semibold text-black/50 uppercase tracking-wider">{T.location}</span>
                  <span className="ml-auto text-base md:text-lg font-black text-black">{T.ibizaSpain}</span>
                </div>

                <div className="flex items-center gap-4 py-4 border-b border-black/10">
                  <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center shrink-0 text-white">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>
                  </div>
                  <span className="text-sm font-semibold text-black/50 uppercase tracking-wider">{T.openingHours}</span>
                  <span className="ml-auto text-base md:text-lg font-black text-black">{isDayClub ? T.daytime : T.atNight}</span>
                </div>

                <div className="flex items-center gap-4 py-4">
                  <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center shrink-0 text-white">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                  </div>
                  <span className="text-sm font-semibold text-black/50 uppercase tracking-wider">{T.genre}</span>
                  <span className="ml-auto text-base md:text-lg font-black text-black">{typeName || T.clubbing}</span>
                </div>
              </div>

              {/* Location map under the practical-info card */}
              <div className="mt-6">
                <VenueLocationMap venueName={club.name} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-10">
            <div className="text-xs font-black tracking-[0.25em] uppercase text-ibiza-green mb-3">{T.faqKicker}</div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black">{T.aboutPrefix} {club.name}</h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-[#0D0509] border border-white/10 rounded-2xl overflow-hidden transition-all open:border-ibiza-green/40" open={i === 0}>
                <summary className="flex items-center justify-between gap-4 p-6 text-xl md:text-2xl font-bold cursor-pointer list-none [&::-webkit-details-marker]:hidden [&::marker]:content-[''] text-white">
                  {faq.q}
                  <div className="w-8 h-8 rounded-full bg-ibiza-green/20 text-ibiza-green shrink-0 flex items-center justify-center transition-transform group-open:rotate-45 group-open:bg-ibiza-green group-open:text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                </summary>
                <div className="px-6 pb-6 text-white text-lg md:text-xl leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-black/10 z-50 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-black/50">{T.stickyAgenda}</span>
          <span className="font-black text-xl text-black">{allDates.length} {T.events}</span>
        </div>
        <button 
          onClick={() => {
            const el = document.getElementById('tickets');
            if (el) {
              window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
            }
          }}
          className="bg-ibiza-green text-white font-black uppercase tracking-wider px-8 py-3.5 rounded-full hover:brightness-95 transition-all shadow-lg active:scale-95"
        >
          {T.viewTickets}
        </button>
      </div>
    </>
  )
}
