'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Search, MessageCircle, Anchor, Ship, Waves, Percent, Users, Ruler,
  MapPin, Maximize2, X, ChevronLeft, ChevronRight, Check,
} from 'lucide-react';
import { FLEET, FLEET_FROM_PRICE, boatIncludes, type Boat, type FleetInclude, type FleetCategory } from '@/data/fleet';

/** WhatsApp business number (digits only). */
const WHATSAPP = '34600000000';

// ── i18n ──────────────────────────────────────────────────────────────────────
interface FleetLabels {
  title: string;
  subtitle: string;
  fromPrice: string;                 // "From {price} / day"
  searchPlaceholder: string;
  allMarinas: string;
  pax: string;                       // "guests"
  length: string;                    // "length"
  seasonLow: string;
  seasonMid: string;
  seasonHigh: string;
  seasonLowNote: string;             // "Rest of the year"
  seasonMidNote: string;             // yachts: "June / September"
  seasonMidNoteCompact: string;      // motorboats: "May, June & September"
  seasonHighNote: string;            // "July / August"
  perDay: string;                    // "/ day"
  includedTitle: string;
  includes: Record<FleetInclude, string>;
  fuelNote: string;                  // "*Price does not include fuel."
  fuelNoteCaptain: (extra: number) => string; // captain +€X or fuel
  catAll: string;
  catYacht: string;                  // "Yachts 50–70 ft"
  catMotorboat: string;              // "Motorboats 20–30 ft"
  inquire: string;                   // WhatsApp button text
  waMessage: (boat: string) => string;
  bannerTitle: string;
  bannerText: string;
  whatsapp: string;
  noResults: string;
  enlarge: string;
  boatsCount: (n: number) => string;
}

const FLEET_I18N: Record<string, FleetLabels> = {
  en: {
    title: 'Private Boat Charters',
    subtitle: 'A hand-picked fleet of luxury yachts from 50 to 70 feet — captain, drinks and water toys included. On the water around Ibiza & Formentera.',
    fromPrice: `From €${FLEET_FROM_PRICE.toLocaleString('en-GB')} / day`,
    searchPlaceholder: 'Search a yacht…',
    allMarinas: 'All marinas',
    pax: 'guests', length: 'length',
    seasonLow: 'Low season', seasonMid: 'Mid season', seasonHigh: 'High season',
    seasonLowNote: 'Rest of the year', seasonMidNote: 'June / September', seasonMidNoteCompact: 'May, June & September', seasonHighNote: 'July / August',
    perDay: '/ day',
    includedTitle: 'Included in the price',
    includes: { captain: 'Captain', mooring: 'Mooring', paddleSurf: 'Paddle surf', towels: 'Towels', drinks: 'Drinks', snorkels: 'Snorkels', vat: 'VAT' },
    fuelNote: '*Price does not include fuel.',
    fuelNoteCaptain: (e) => `*Price does not include captain (+€${e}) or fuel.`,
    catAll: 'All boats', catYacht: 'Yachts 50–70 ft', catMotorboat: 'Motorboats 20–30 ft',
    inquire: 'Inquire information',
    waMessage: (boat) => `Hi Ibiza mi Vida! I'm interested in the private boat ${boat}. Could you send me more information about availability and prices?`,
    bannerTitle: 'Not sure which yacht fits you?',
    bannerText: 'Tell us your dates and group size — we\'ll match you with the perfect boat and handle everything.',
    whatsapp: 'WhatsApp us',
    noResults: 'No yachts match your search.',
    enlarge: 'Enlarge photo',
    boatsCount: (n) => `${n} ${n === 1 ? 'yacht' : 'yachts'}`,
  },
  nl: {
    title: 'Private Boot Charters',
    subtitle: 'Een zorgvuldig samengestelde vloot luxe jachten van 50 tot 70 voet — kapitein, drankjes en watersportspullen inbegrepen. Op het water rond Ibiza & Formentera.',
    fromPrice: `Vanaf €${FLEET_FROM_PRICE.toLocaleString('nl-NL')} / dag`,
    searchPlaceholder: 'Zoek een jacht…',
    allMarinas: 'Alle haventjes',
    pax: 'gasten', length: 'lengte',
    seasonLow: 'Laagseizoen', seasonMid: 'Middenseizoen', seasonHigh: 'Hoogseizoen',
    seasonLowNote: 'Rest van het jaar', seasonMidNote: 'Juni / September', seasonMidNoteCompact: 'Mei, juni & september', seasonHighNote: 'Juli / Augustus',
    perDay: '/ dag',
    includedTitle: 'Inbegrepen in de prijs',
    includes: { captain: 'Kapitein', mooring: 'Ligplaats', paddleSurf: 'Paddle surf', towels: 'Handdoeken', drinks: 'Drankjes', snorkels: 'Snorkels', vat: 'BTW' },
    fuelNote: '*Prijs is exclusief brandstof.',
    fuelNoteCaptain: (e) => `*Prijs is exclusief kapitein (+€${e}) en brandstof.`,
    catAll: 'Alle boten', catYacht: 'Jachten 50–70 ft', catMotorboat: 'Motorboten 20–30 ft',
    inquire: 'Voor meer informatie',
    waMessage: (boat) => `Hoi Ibiza mi Vida! Ik heb interesse in de private boot ${boat}. Kunnen jullie mij meer informatie sturen over de beschikbaarheid en prijzen?`,
    bannerTitle: 'Niet zeker welk jacht bij je past?',
    bannerText: 'Geef je datums en groepsgrootte door — wij regelen de perfecte boot en alles eromheen.',
    whatsapp: 'WhatsApp ons',
    noResults: 'Geen jachten gevonden voor je zoekopdracht.',
    enlarge: 'Foto vergroten',
    boatsCount: (n) => `${n} ${n === 1 ? 'jacht' : 'jachten'}`,
  },
  de: {
    title: 'Private Bootscharter',
    subtitle: 'Eine handverlesene Flotte von Luxusyachten von 50 bis 70 Fuß — Kapitän, Getränke und Wasserspielzeug inklusive. Auf dem Wasser rund um Ibiza & Formentera.',
    fromPrice: `Ab €${FLEET_FROM_PRICE.toLocaleString('de-DE')} / Tag`,
    searchPlaceholder: 'Yacht suchen…',
    allMarinas: 'Alle Häfen',
    pax: 'Gäste', length: 'Länge',
    seasonLow: 'Nebensaison', seasonMid: 'Zwischensaison', seasonHigh: 'Hauptsaison',
    seasonLowNote: 'Restliches Jahr', seasonMidNote: 'Juni / September', seasonMidNoteCompact: 'Mai, Juni & September', seasonHighNote: 'Juli / August',
    perDay: '/ Tag',
    includedTitle: 'Im Preis enthalten',
    includes: { captain: 'Kapitän', mooring: 'Liegeplatz', paddleSurf: 'Paddle Surf', towels: 'Handtücher', drinks: 'Getränke', snorkels: 'Schnorchel', vat: 'MwSt.' },
    fuelNote: '*Preis versteht sich ohne Kraftstoff.',
    fuelNoteCaptain: (e) => `*Preis ohne Kapitän (+€${e}) und Kraftstoff.`,
    catAll: 'Alle Boote', catYacht: 'Yachten 50–70 ft', catMotorboat: 'Motorboote 20–30 ft',
    inquire: 'Informationen anfragen',
    waMessage: (boat) => `Hallo Ibiza mi Vida! Ich interessiere mich für das private Boot ${boat}. Können Sie mir mehr Informationen zu Verfügbarkeit und Preisen senden?`,
    bannerTitle: 'Nicht sicher, welche Yacht zu Ihnen passt?',
    bannerText: 'Nennen Sie uns Ihre Daten und Gruppengröße — wir finden das perfekte Boot und kümmern uns um alles.',
    whatsapp: 'WhatsApp',
    noResults: 'Keine Yachten für Ihre Suche gefunden.',
    enlarge: 'Foto vergrößern',
    boatsCount: (n) => `${n} ${n === 1 ? 'Yacht' : 'Yachten'}`,
  },
  es: {
    title: 'Chárter de Barcos Privados',
    subtitle: 'Una flota seleccionada de yates de lujo de 50 a 70 pies — capitán, bebidas y material acuático incluidos. En el agua alrededor de Ibiza y Formentera.',
    fromPrice: `Desde €${FLEET_FROM_PRICE.toLocaleString('es-ES')} / día`,
    searchPlaceholder: 'Buscar un yate…',
    allMarinas: 'Todos los puertos',
    pax: 'personas', length: 'eslora',
    seasonLow: 'Temporada baja', seasonMid: 'Temporada media', seasonHigh: 'Temporada alta',
    seasonLowNote: 'Resto del año', seasonMidNote: 'Junio / Septiembre', seasonMidNoteCompact: 'Mayo, junio y septiembre', seasonHighNote: 'Julio / Agosto',
    perDay: '/ día',
    includedTitle: 'Incluido en el precio',
    includes: { captain: 'Capitán', mooring: 'Amarre', paddleSurf: 'Paddle surf', towels: 'Toallas', drinks: 'Bebidas', snorkels: 'Snorkel', vat: 'IVA' },
    fuelNote: '*El precio no incluye combustible.',
    fuelNoteCaptain: (e) => `*El precio no incluye capitán (+€${e}) ni combustible.`,
    catAll: 'Todos los barcos', catYacht: 'Yates 50–70 ft', catMotorboat: 'Lanchas 20–30 ft',
    inquire: 'Solicitar información',
    waMessage: (boat) => `¡Hola Ibiza mi Vida! Me interesa el barco privado ${boat}. ¿Podrían enviarme más información sobre disponibilidad y precios?`,
    bannerTitle: '¿No sabes qué yate elegir?',
    bannerText: 'Dinos tus fechas y el tamaño del grupo — te buscamos el barco perfecto y lo organizamos todo.',
    whatsapp: 'Escríbenos por WhatsApp',
    noResults: 'Ningún yate coincide con tu búsqueda.',
    enlarge: 'Ampliar foto',
    boatsCount: (n) => `${n} ${n === 1 ? 'yate' : 'yates'}`,
  },
  fr: {
    title: 'Location de Bateaux Privés',
    subtitle: 'Une flotte sélectionnée de yachts de luxe de 50 à 70 pieds — capitaine, boissons et équipements nautiques inclus. Sur l\'eau autour d\'Ibiza et Formentera.',
    fromPrice: `À partir de €${FLEET_FROM_PRICE.toLocaleString('fr-FR')} / jour`,
    searchPlaceholder: 'Rechercher un yacht…',
    allMarinas: 'Tous les ports',
    pax: 'invités', length: 'longueur',
    seasonLow: 'Basse saison', seasonMid: 'Moyenne saison', seasonHigh: 'Haute saison',
    seasonLowNote: 'Reste de l\'année', seasonMidNote: 'Juin / Septembre', seasonMidNoteCompact: 'Mai, juin & septembre', seasonHighNote: 'Juillet / Août',
    perDay: '/ jour',
    includedTitle: 'Inclus dans le prix',
    includes: { captain: 'Capitaine', mooring: 'Amarrage', paddleSurf: 'Paddle', towels: 'Serviettes', drinks: 'Boissons', snorkels: 'Tubas', vat: 'TVA' },
    fuelNote: '*Le prix ne comprend pas le carburant.',
    fuelNoteCaptain: (e) => `*Le prix ne comprend pas le capitaine (+€${e}) ni le carburant.`,
    catAll: 'Tous les bateaux', catYacht: 'Yachts 50–70 ft', catMotorboat: 'Bateaux 20–30 ft',
    inquire: 'Demander des informations',
    waMessage: (boat) => `Bonjour Ibiza mi Vida ! Je suis intéressé(e) par le bateau privé ${boat}. Pourriez-vous m'envoyer plus d'informations sur la disponibilité et les tarifs ?`,
    bannerTitle: 'Vous ne savez pas quel yacht choisir ?',
    bannerText: 'Indiquez-nous vos dates et la taille du groupe — nous trouvons le bateau parfait et nous nous occupons de tout.',
    whatsapp: 'WhatsApp',
    noResults: 'Aucun yacht ne correspond à votre recherche.',
    enlarge: 'Agrandir la photo',
    boatsCount: (n) => `${n} ${n === 1 ? 'yacht' : 'yachts'}`,
  },
};

const INCLUDE_ICON: Record<FleetInclude, React.ReactNode> = {
  captain: <Ship size={13} />, mooring: <Anchor size={13} />, paddleSurf: <Waves size={13} />,
  towels: <Check size={13} />, drinks: <Check size={13} />, snorkels: <Check size={13} />, vat: <Percent size={13} />,
};

const fmt = (n: number, locale: string) => n.toLocaleString(({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as Record<string, string>)[locale] || 'en-GB');

function boatLabel(boat: Boat) {
  return boat.name ? `${boat.model} "${boat.name}"` : boat.model;
}

function waLink(boat: Boat, T: FleetLabels) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(T.waMessage(boatLabel(boat)))}`;
}

// ── Boat advertisement card ─────────────────────────────────────────────────────
function BoatCard({ boat, T, locale, onOpen }: { boat: Boat; T: FleetLabels; locale: string; onOpen: () => void }) {
  const p = boat.price;
  return (
    <article className="group grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-ibiza-green/40 hover:shadow-2xl">
      {/* Photo */}
      <button
        onClick={onOpen}
        className="relative h-64 md:h-full min-h-[280px] w-full overflow-hidden cursor-zoom-in"
        aria-label={T.enlarge}
      >
        <Image
          src={boat.image}
          alt={`${boat.model} ${boat.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r" />
        {/* Spec badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm ring-1 ring-white/15">
            <Users size={13} className="text-ibiza-green" /> {boat.pax} PAX
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm ring-1 ring-white/15">
            <Ruler size={13} className="text-ibiza-green" /> {boat.length} M
          </span>
        </div>
        {/* Enlarge hint */}
        <span className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur-sm ring-1 ring-white/15 transition-opacity group-hover:opacity-100">
          <Maximize2 size={16} />
        </span>
      </button>

      {/* Info / price panel */}
      <div className="flex flex-col p-6 md:p-7">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/50">
          <MapPin size={12} className="text-ibiza-green" /> {boat.marina}
        </div>
        <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white">
          {boat.model}{boat.name && <span className="text-ibiza-green"> {boat.name}</span>}
        </h3>

        {/* Seasonal prices */}
        <div className="mt-5 space-y-2.5 border-t border-white/10 pt-4">
          <PriceRow label={T.seasonLow} note={T.seasonLowNote} value={p.low} T={T} locale={locale} />
          {p.mid != null && <PriceRow label={T.seasonMid} note={boat.category === 'motorboat' ? T.seasonMidNoteCompact : T.seasonMidNote} value={p.mid} T={T} locale={locale} />}
          <PriceRow label={T.seasonHigh} note={p.highWindow || T.seasonHighNote} value={p.high} T={T} locale={locale} highlight />
        </div>

        {/* Includes */}
        <div className="mt-5">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">{T.includedTitle}</div>
          <div className="flex flex-wrap gap-1.5">
            {boatIncludes(boat).map(inc => (
              <span key={inc} className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">
                <span className="text-ibiza-green">{INCLUDE_ICON[inc]}</span> {T.includes[inc]}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] italic text-white/35">{boat.captainIncluded ? T.fuelNote : T.fuelNoteCaptain(boat.captainExtra ?? 180)}</p>
        </div>

        {/* WhatsApp inquiry */}
        <a
          href={waLink(boat, T)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-ibiza-green px-6 py-3 font-bold text-velvet-obsidian transition-all hover:brightness-95 active:scale-[0.98]"
        >
          <MessageCircle size={18} /> {T.inquire}
        </a>
      </div>
    </article>
  );
}

function PriceRow({ label, note, value, T, locale, highlight }: { label: string; note: string; value: number; T: FleetLabels; locale: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="min-w-0">
        <div className={`text-xs font-bold uppercase tracking-wider ${highlight ? 'text-ibiza-green' : 'text-white/70'}`}>{label}</div>
        <div className="truncate text-[11px] text-white/40">{note}</div>
      </div>
      <div className={`shrink-0 font-serif font-bold ${highlight ? 'text-2xl text-white' : 'text-xl text-white/85'}`}>
        €{fmt(value, locale)} <span className="text-[11px] font-sans font-normal text-white/40">{T.perDay}</span>
      </div>
    </div>
  );
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ boats, index, onClose, onNav }: { boats: Boat[]; index: number; onClose: () => void; onNav: (dir: number) => void }) {
  const boat = boats[index];
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose, onNav]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20" aria-label="Close">
        <X size={22} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNav(-1); }} className="absolute left-4 md:left-8 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20" aria-label="Previous">
        <ChevronLeft size={26} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNav(1); }} className="absolute right-4 md:right-8 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20" aria-label="Next">
        <ChevronRight size={26} />
      </button>
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image src={boat.image} alt={`${boat.model} ${boat.name}`} fill sizes="90vw" className="object-contain" priority />
        </div>
        <div className="mt-4 text-center text-white">
          <h3 className="font-serif text-2xl font-bold">{boat.model}{boat.name && <span className="text-ibiza-green"> {boat.name}</span>}</h3>
          <p className="text-sm text-white/50">{boat.marina} · {boat.pax} PAX · {boat.length} M</p>
        </div>
      </div>
    </div>
  );
}

// ── Main showcase ────────────────────────────────────────────────────────────
export default function FleetShowcase({ locale = 'nl' }: { locale: string }) {
  const T = FLEET_I18N[locale] || FLEET_I18N.en;
  const [search, setSearch] = useState('');
  const [marina, setMarina] = useState<string>('all');
  const [category, setCategory] = useState<FleetCategory | 'all'>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const marinas = useMemo(() => Array.from(new Set(FLEET.map(b => b.marina))), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FLEET.filter(b => {
      const matchCategory = category === 'all' || b.category === category;
      const matchMarina = marina === 'all' || b.marina === marina;
      const matchSearch = !q || `${b.model} ${b.name ?? ''} ${b.marina}`.toLowerCase().includes(q);
      return matchCategory && matchMarina && matchSearch;
    });
  }, [search, marina, category]);

  const openAt = useCallback((slug: string) => {
    const i = filtered.findIndex(b => b.slug === slug);
    setLightbox(i >= 0 ? i : 0);
  }, [filtered]);

  const nav = useCallback((dir: number) => {
    setLightbox(prev => prev == null ? prev : (prev + dir + filtered.length) % filtered.length);
  }, [filtered.length]);

  return (
    <div className="theme-monaco-vip min-h-screen bg-[var(--color-paper)] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/fleet/cover.jpeg" alt="Ibiza private boat charter" fill priority className="object-cover object-center opacity-40" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-paper)]/70 via-[var(--color-paper)]/60 to-[var(--color-paper)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-[120px] md:pt-[150px] pb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ibiza-green ring-1 ring-white/15">
            <Anchor size={13} /> {T.fromPrice}
          </span>
          <h1 className="mt-5 font-serif text-4xl md:text-6xl font-black tracking-tight text-white">{T.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-white/70">{T.subtitle}</p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-3">
        <div className="flex flex-wrap justify-center gap-2">
          <FilterTab active={category === 'all'} onClick={() => setCategory('all')}>{T.catAll}</FilterTab>
          <FilterTab active={category === 'yacht'} onClick={() => setCategory('yacht')}>{T.catYacht}</FilterTab>
          <FilterTab active={category === 'motorboat'} onClick={() => setCategory('motorboat')}>{T.catMotorboat}</FilterTab>
        </div>
      </section>

      {/* Filters */}
      <section className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            <FilterTab active={marina === 'all'} onClick={() => setMarina('all')}>{T.allMarinas}</FilterTab>
            {marinas.map(m => (
              <FilterTab key={m} active={marina === m} onClick={() => setMarina(m)}>{m}</FilterTab>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder-white/40 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ibiza-green"
              placeholder={T.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 px-1 text-sm font-semibold text-white/40">{T.boatsCount(filtered.length)}</div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-6">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
            {filtered.map(boat => (
              <BoatCard key={boat.slug} boat={boat} T={T} locale={locale} onOpen={() => openAt(boat.slug)} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center text-white/50">{T.noResults}</div>
        )}
      </section>

      {/* WhatsApp banner */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="flex flex-col items-center justify-between gap-5 rounded-3xl border border-ibiza-green/20 bg-gradient-to-r from-ibiza-green/10 to-transparent p-7 md:flex-row md:p-9">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white">{T.bannerTitle}</h3>
            <p className="mt-1 max-w-xl text-white/60">{T.bannerText}</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ibiza-green px-7 py-3.5 font-bold text-velvet-obsidian transition-all hover:brightness-95 active:scale-95"
          >
            <MessageCircle size={19} /> {T.whatsapp}
          </a>
        </div>
      </section>

      {lightbox != null && filtered[lightbox] && (
        <Lightbox boats={filtered} index={lightbox} onClose={() => setLightbox(null)} onNav={nav} />
      )}
    </div>
  );
}

function FilterTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
        active ? 'bg-ibiza-green text-velvet-obsidian' : 'bg-white/[0.06] text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
