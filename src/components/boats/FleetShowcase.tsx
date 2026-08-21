'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Search, MessageCircle, Anchor, Ship, Waves, Percent, Users, Ruler,
  MapPin, Maximize2, X, ChevronLeft, ChevronRight, Check, Euro, Lock, LockOpen, SlidersHorizontal,
} from 'lucide-react';
import { FLEET, FLEET_FROM_PRICE, boatIncludes, type Boat, type FleetInclude, type FleetCategory } from '@/data/fleet';
import { BackButton } from '@/components/ui/BackButton';

/** WhatsApp business number (digits only). */
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33666528412';

// ── Price range (from real fleet "low season" day rates) ──────────────────────
const FLEET_LOWS = FLEET.map(b => b.price.low);
const PRICE_MIN = Math.floor(Math.min(...FLEET_LOWS) / 50) * 50;   // ~350
const PRICE_MAX = Math.ceil(Math.max(...FLEET_LOWS) / 100) * 100;  // ~6600
const PRICE_STEP = 50;
/** Tactical budget presets (per day). Trimmed to the real fleet range. */
const PRICE_PRESETS = [500, 1000, 2000, 3500, 5000].filter(v => v > PRICE_MIN && v < PRICE_MAX);

// ── Price filter i18n ─────────────────────────────────────────────────────────
interface PriceLabels {
  heading: string;                    // "Budget per day"
  sub: string;                        // helper line
  any: string;                        // "Any budget"
  upTo: (v: string) => string;        // "Up to €{v} / day"
  placeholder: string;                // input placeholder
  lock: string;                       // "Lock"
  locked: string;                     // "Locked"
  reset: string;                      // "Reset"
  quick: string;                      // "Quick budgets"
}
const PRICE_I18N: Record<string, PriceLabels> = {
  en: { heading: 'Budget per day', sub: 'Slide, or type an exact max and lock it', any: 'Any budget', upTo: (v) => `Up to €${v} / day`, placeholder: 'Type a max…', lock: 'Lock', locked: 'Locked', reset: 'Reset', quick: 'Quick budgets' },
  nl: { heading: 'Budget per dag', sub: 'Schuif, of tik een exact maximum in en zet het vast', any: 'Elk budget', upTo: (v) => `Tot €${v} / dag`, placeholder: 'Tik een max…', lock: 'Vastzetten', locked: 'Vastgezet', reset: 'Herstel', quick: 'Snelle budgetten' },
  de: { heading: 'Budget pro Tag', sub: 'Schieben oder ein genaues Maximum eingeben und fixieren', any: 'Jedes Budget', upTo: (v) => `Bis €${v} / Tag`, placeholder: 'Max eingeben…', lock: 'Fixieren', locked: 'Fixiert', reset: 'Zurücksetzen', quick: 'Schnelle Budgets' },
  es: { heading: 'Presupuesto por día', sub: 'Desliza, o escribe un máximo exacto y fíjalo', any: 'Cualquier presupuesto', upTo: (v) => `Hasta €${v} / día`, placeholder: 'Escribe un máx…', lock: 'Fijar', locked: 'Fijado', reset: 'Reiniciar', quick: 'Presupuestos rápidos' },
  fr: { heading: 'Budget par jour', sub: 'Glissez, ou saisissez un maximum exact et verrouillez-le', any: 'Tout budget', upTo: (v) => `Jusqu'à €${v} / jour`, placeholder: 'Saisir un max…', lock: 'Verrouiller', locked: 'Verrouillé', reset: 'Réinitialiser', quick: 'Budgets rapides' },
};

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
    <article id={`boat-${boat.slug}`} style={{ scrollMarginTop: 'calc(var(--nav-h) + 6px)' }} className="group flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-ibiza-green hover:shadow-2xl target:ring-2 target:ring-ibiza-green">
      {/* Photo */}
      <button
        onClick={onOpen}
        className="relative aspect-[4/3] w-full overflow-hidden cursor-zoom-in"
        aria-label={T.enlarge}
      >
        <Image
          src={boat.image}
          alt={`${boat.model} ${boat.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {/* Spec badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm ring-1 ring-white/15">
            <Users size={12} className="text-ibiza-green" /> {boat.pax}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm ring-1 ring-white/15">
            <Ruler size={12} className="text-ibiza-green" /> {boat.length}M
          </span>
        </div>
        {/* Enlarge hint */}
        <span className="absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur-sm ring-1 ring-white/15 transition-opacity group-hover:opacity-100">
          <Maximize2 size={15} />
        </span>
      </button>

      {/* Info / price panel */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-black/50">
          <MapPin size={11} className="text-ibiza-green" /> {boat.marina}
        </div>
        <h3 className="font-serif text-base font-bold leading-tight text-black">
          {boat.model}{boat.name && <span className="text-ibiza-green"> {boat.name}</span>}
        </h3>

        {/* Seasonal prices */}
        <div className="mt-2.5 space-y-1 border-t border-black/10 pt-2.5">
          <PriceRow label={T.seasonLow} note={T.seasonLowNote} value={p.low} T={T} locale={locale} />
          {p.mid != null && <PriceRow label={T.seasonMid} note={boat.category === 'motorboat' ? T.seasonMidNoteCompact : T.seasonMidNote} value={p.mid} T={T} locale={locale} />}
          <PriceRow label={T.seasonHigh} note={p.highWindow || T.seasonHighNote} value={p.high} T={T} locale={locale} highlight />
        </div>

        {/* Includes */}
        <div className="mt-2.5">
          <div className="flex flex-wrap gap-1">
            {boatIncludes(boat).map(inc => (
              <span key={inc} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-black/70 ring-1 ring-black/5">
                <span className="text-ibiza-green">{INCLUDE_ICON[inc]}</span> {T.includes[inc]}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[10px] italic text-black/40">{boat.captainIncluded ? T.fuelNote : T.fuelNoteCaptain(boat.captainExtra ?? 180)}</p>
        </div>

        {/* WhatsApp inquiry */}
        <a
          href={waLink(boat, T)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-ibiza-green px-4 py-2 text-sm font-bold text-black transition-all hover:brightness-95 active:scale-[0.98]"
        >
          <MessageCircle size={16} /> {T.inquire}
        </a>
      </div>
    </article>
  );
}

function PriceRow({ label, note, value, T, locale, highlight }: { label: string; note: string; value: number; T: FleetLabels; locale: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <div className="min-w-0">
        <div className={`truncate text-[11px] font-bold uppercase tracking-wider ${highlight ? 'text-ibiza-green' : 'text-black/70'}`}>{label}</div>
        <div className="truncate text-[10px] text-black/40">{note}</div>
      </div>
      <div className={`shrink-0 whitespace-nowrap font-serif font-bold ${highlight ? 'text-lg text-black' : 'text-base text-black/85'}`}>
        €{fmt(value, locale)} <span className="text-[10px] font-sans font-normal text-black/40">{T.perDay}</span>
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
  const P = PRICE_I18N[locale] || PRICE_I18N.en;
  const bcp = ({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as Record<string, string>)[locale] || 'en-GB';
  const [search, setSearch] = useState('');
  const [marina, setMarina] = useState<string>('all');
  const [category, setCategory] = useState<FleetCategory | 'all'>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Price filter state
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [priceLocked, setPriceLocked] = useState(false);

  // Deep-link: when arriving with #boat-<slug>, scroll straight to that boat's card
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    return () => clearTimeout(t);
  }, []);
  const [priceDraft, setPriceDraft] = useState<string>('');
  const isPriceActive = maxPrice < PRICE_MAX;
  const pricePct = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const applyDraft = useCallback(() => {
    const n = parseInt(priceDraft.replace(/[^\d]/g, ''), 10);
    if (!isNaN(n)) {
      setMaxPrice(Math.min(PRICE_MAX, Math.max(PRICE_MIN, Math.round(n / PRICE_STEP) * PRICE_STEP)));
      setPriceLocked(true);
    }
    setPriceDraft('');
  }, [priceDraft]);

  const resetPrice = useCallback(() => { setMaxPrice(PRICE_MAX); setPriceLocked(false); setPriceDraft(''); }, []);

  const marinas = useMemo(() => Array.from(new Set(FLEET.map(b => b.marina))), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FLEET.filter(b => {
      const matchCategory = category === 'all' || b.category === category;
      const matchMarina = marina === 'all' || b.marina === marina;
      const matchSearch = !q || `${b.model} ${b.name ?? ''} ${b.marina}`.toLowerCase().includes(q);
      const matchPrice = b.price.low <= maxPrice;
      return matchCategory && matchMarina && matchSearch && matchPrice;
    });
  }, [search, marina, category, maxPrice]);

  const openAt = useCallback((slug: string) => {
    const i = filtered.findIndex(b => b.slug === slug);
    setLightbox(i >= 0 ? i : 0);
  }, [filtered]);

  const nav = useCallback((dir: number) => {
    setLightbox(prev => prev == null ? prev : (prev + dir + filtered.length) % filtered.length);
  }, [filtered.length]);

  return (
    <div className="min-h-screen bg-white text-black">
      <BackButton locale={locale} fallbackHref={`/${locale}`} variant="top" />
      <style dangerouslySetInnerHTML={{ __html: `
        .fleet-range { -webkit-appearance: none; appearance: none; height: 8px; border-radius: 9999px; outline: none; cursor: pointer; }
        .fleet-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px; border-radius: 9999px; background: #fff; border: 3px solid #3D6A96; box-shadow: 0 2px 8px rgba(0,0,0,0.25); cursor: grab; transition: transform .15s ease; }
        .fleet-range::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
        .fleet-range::-moz-range-thumb { width: 26px; height: 26px; border-radius: 9999px; background: #fff; border: 3px solid #3D6A96; box-shadow: 0 2px 8px rgba(0,0,0,0.25); cursor: grab; }
        .fleet-range:disabled::-webkit-slider-thumb { cursor: not-allowed; border-color: #9ca3af; }
      ` }} />
      {/* Hero — boat image as a full-bleed background; on mobile it fills the first viewport so the
          budget bar only appears once you scroll down. */}
      <section className="relative w-full overflow-hidden flex min-h-[97vh] flex-col justify-center md:block md:min-h-0">
        <Image src="/fleet/cover.jpeg" alt="Ibiza private boat charter" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 pt-[calc(var(--nav-h)+16px)] pb-12 text-center md:pb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ibiza-green ring-1 ring-white/25 backdrop-blur-sm">
            <Anchor size={13} /> {T.fromPrice}
          </span>
          <h1 className="text-5xl md:text-7xl font-black font-serif text-white leading-tight uppercase m-0 tracking-tight drop-shadow-lg">{T.title}</h1>
          <p className="font-sans text-base md:text-lg text-white/90 max-w-2xl mx-auto mt-1 drop-shadow">{T.subtitle}</p>
          {/* Category selector — sits directly on the image */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <FilterTab active={category === 'all'} onClick={() => setCategory('all')}>{T.catAll}</FilterTab>
            <FilterTab active={category === 'yacht'} onClick={() => setCategory('yacht')}>{T.catYacht}</FilterTab>
            <FilterTab active={category === 'motorboat'} onClick={() => setCategory('motorboat')}>{T.catMotorboat}</FilterTab>
          </div>
        </div>
      </section>

      {/* Price / budget slider — now first under the hero */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="rounded-3xl border border-black/10 bg-neutral-50 p-5 md:p-6">
          {/* Header row: label + live value + type-and-lock */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-ibiza-green/15 text-black">
                <SlidersHorizontal size={18} />
              </span>
              <div>
                <div className="text-sm font-black uppercase tracking-wider text-black">{P.heading}</div>
                <div className="text-xs text-black/50">{P.sub}</div>
              </div>
            </div>

          </div>

          {/* The range slider */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm font-bold text-black">
              <span className="text-black/50">€{PRICE_MIN.toLocaleString(bcp)}</span>
              <span className="rounded-full bg-ibiza-green px-3 py-1 text-black">
                {isPriceActive ? P.upTo(maxPrice.toLocaleString(bcp)) : P.any}
              </span>
              <span className="text-black/50">€{PRICE_MAX.toLocaleString(bcp)}+</span>
            </div>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={maxPrice}
              disabled={priceLocked}
              onChange={e => setMaxPrice(parseInt(e.target.value, 10))}
              className="fleet-range w-full disabled:opacity-60"
              style={{ background: `linear-gradient(to right, #3D6A96 0%, #3D6A96 ${pricePct}%, #e5e5e5 ${pricePct}%, #e5e5e5 100%)` }}
              aria-label={P.heading}
            />
          </div>

          {/* Tactical preset chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 hidden text-xs font-bold uppercase tracking-wider text-black/40 sm:inline">{P.quick}</span>
            {PRICE_PRESETS.map(v => {
              const on = maxPrice === v;
              return (
                <button
                  key={v}
                  onClick={() => { setMaxPrice(v); setPriceLocked(true); setPriceDraft(''); }}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    on ? 'bg-ibiza-green text-black shadow-sm' : 'bg-neutral-100 text-black/70 hover:bg-neutral-200'
                  }`}
                >
                  ≤ €{v.toLocaleString(bcp)}
                </button>
              );
            })}
            <button
              onClick={resetPrice}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                !isPriceActive ? 'bg-ibiza-green text-black shadow-sm' : 'bg-neutral-100 text-black/70 hover:bg-neutral-200'
              }`}
            >
              {P.any}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4">
        <div className="px-1 text-sm font-semibold text-black/50">{T.boatsCount(filtered.length)}</div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-6">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(boat => (
              <BoatCard key={boat.slug} boat={boat} T={T} locale={locale} onOpen={() => openAt(boat.slug)} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-black/10 bg-neutral-50 py-20 text-center text-black/50">{T.noResults}</div>
        )}
      </section>

      {/* WhatsApp banner */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="flex flex-col items-center justify-between gap-5 rounded-3xl border border-ibiza-green/40 bg-ibiza-green/10 p-7 md:flex-row md:p-10">
          <div>
            <h3 className="font-serif text-2xl font-bold text-black md:text-3xl">{T.bannerTitle}</h3>
            <p className="mt-1 max-w-xl text-black/60">{T.bannerText}</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ibiza-green px-7 py-4 font-bold text-black transition-all hover:brightness-95 active:scale-95"
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
      className={`rounded-full px-6 py-3 text-sm font-bold transition-all duration-200 md:text-base ${
        active ? 'bg-ibiza-green text-black shadow-sm' : 'bg-neutral-100 text-black/70 hover:bg-neutral-200 hover:text-black'
      }`}
    >
      {children}
    </button>
  );
}
