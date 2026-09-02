'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search, MessageCircle, Anchor, Ship, Waves, Percent, Users, Ruler,
  MapPin, X, Check, Euro, Lock, LockOpen, SlidersHorizontal,
} from 'lucide-react';
import { FLEET, FLEET_FROM_PRICE, type Boat, type FleetCategory } from '@/data/fleet';
import { priceForDate, statusForDate, seasonForDate, ibizaToday, liveStampTime, type LiveFleet } from '@/lib/yacht-broker';
import { FileText, CalendarDays } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { FavouriteButton } from '@/components/boats/FavouriteButton';
import { FleetFilterBar, type SortKey } from '@/components/boats/FleetFilterBar';
import { getFavourites, onFavouritesChange, toggleFavourite } from '@/lib/boat-favourites';

/** WhatsApp business number (digits only). */
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33666528412';

// ── Price range (from real fleet "low season" day rates) ──────────────────────
const FLEET_LOWS = FLEET.map(b => b.price.low);
const PRICE_MIN = Math.floor(Math.min(...FLEET_LOWS) / 50) * 50;   // ~350
const PRICE_MAX = Math.ceil(Math.max(...FLEET_LOWS) / 100) * 100;  // ~6600
const PRICE_STEP = 50;
const PAX_MAX = Math.max(...FLEET.map(b => b.pax));
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
  /* Live beschikbaarheid — de partnerfeed. */
  pickDate: string;                  // label bij de datumkiezer
  availOnly: string;                 // "Alleen beschikbaar"
  availFree: string;
  availOption: string;
  availBooked: string;
  liveStamp: (time: string) => string; // "Live stand van HH:MM"
  /* Per boot: dossier + eerlijke voorwaardenregel (vervangt de badge-rij). */
  dossier: string;
  termsNote: string;
  /* Favorieten → één WhatsApp-aanvraag naar Simon. */
  favCount: (n: number) => string;
  favSend: string;
  favClear: string;
  favWaIntro: string;                // eerste regel van het verzamelbericht
  favWaDate: (d: string) => string;  // "Datum: {d}" — alleen als er een datum gekozen is
  favWaOutro: string;
  favRemove: string;                 // voorleeslabel bij het kruisje
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
    title: 'Private Boat Charters Ibiza',
    subtitle: "94 boats from our partner fleet — 22 ft day boats to 92 ft superyachts, with live availability per day. On the water around Ibiza & Formentera.",
    fromPrice: `From €${FLEET_FROM_PRICE.toLocaleString('en-GB')} / day`,
    searchPlaceholder: 'Search a yacht…',
    allMarinas: 'All marinas',
    pax: 'guests', length: 'length',
    seasonLow: 'Low season', seasonMid: 'Mid season', seasonHigh: 'High season',
    seasonLowNote: "Rest of the year", seasonMidNote: "Shoulder season — window differs per boat", seasonMidNoteCompact: "Shoulder season — window differs per boat", seasonHighNote: "July and August",
    perDay: '/ day',
    pickDate: 'Your date', availOnly: 'Only available', availFree: 'Available', availOption: 'On option', availBooked: 'Booked',
    liveStamp: (t) => `Live status, ${t}`,
    dossier: 'Boat dossier (PDF)',
    termsNote: 'What the rate includes (skipper, fuel, VAT) differs per boat — it is in the dossier and Simon confirms it before you book.',
    favCount: (n) => `${n} favourite${n === 1 ? '' : 's'}`,
    favSend: 'Send to Simon in one message',
    favClear: 'Clear list',
    favWaIntro: "Hi Ibiza mi Vida! These are my favourite boats:",
    favWaDate: (d) => `Preferred date: ${d}`,
    favWaOutro: 'Could you check availability and prices for these?',
    favRemove: 'Remove',
    catAll: 'All boats', catYacht: 'Yachts 50 ft+', catMotorboat: 'Motorboats 20–50 ft',
    inquire: 'Book this boat now',
    waMessage: (boat) => `Hi Ibiza mi Vida! I would like to book the private boat ${boat}. Could you confirm availability and the price?`,
    bannerTitle: 'Not sure which yacht fits you?',
    bannerText: 'Tell us your dates and group size — we\'ll match you with the perfect boat and handle everything.',
    whatsapp: 'WhatsApp us',
    noResults: 'No yachts match your search.',
    enlarge: 'Enlarge photo',
    boatsCount: (n) => `${n} ${n === 1 ? 'yacht' : 'yachts'}`,
  },
  nl: {
    title: 'Private Boot Charters Ibiza',
    subtitle: "94 boten uit onze partnervloot — van 22 ft dagboten tot 92 ft superjachten, met live beschikbaarheid per dag. Op het water rond Ibiza & Formentera.",
    fromPrice: `Vanaf €${FLEET_FROM_PRICE.toLocaleString('nl-NL')} / dag`,
    searchPlaceholder: 'Zoek een jacht…',
    allMarinas: 'Alle haventjes',
    pax: 'gasten', length: 'lengte',
    seasonLow: 'Laagseizoen', seasonMid: 'Middenseizoen', seasonHigh: 'Hoogseizoen',
    seasonLowNote: "Rest van het jaar", seasonMidNote: "Tussenseizoen — venster verschilt per boot", seasonMidNoteCompact: "Tussenseizoen — venster verschilt per boot", seasonHighNote: "Juli en augustus",
    perDay: '/ dag',
    pickDate: 'Jouw datum', availOnly: 'Alleen beschikbaar', availFree: 'Beschikbaar', availOption: 'In optie', availBooked: 'Bezet',
    liveStamp: (t) => `Live stand, ${t}`,
    dossier: 'Bootdossier (PDF)',
    termsNote: 'Wat er bij de prijs inzit (schipper, brandstof, btw) verschilt per boot — het staat in het dossier en Simon bevestigt het voordat je boekt.',
    favCount: (n) => `${n} favoriet${n === 1 ? '' : 'en'}`,
    favSend: 'Stuur in één bericht naar Simon',
    favClear: 'Lijst wissen',
    favWaIntro: 'Hoi Ibiza mi Vida! Dit zijn mijn favoriete boten:',
    favWaDate: (d) => `Voorkeursdatum: ${d}`,
    favWaOutro: 'Kunnen jullie hiervoor beschikbaarheid en prijzen checken?',
    favRemove: 'Verwijder',
    catAll: 'Alle boten', catYacht: 'Jachten 50 ft+', catMotorboat: 'Motorboten 20–50 ft',
    inquire: 'Boek deze boot direct',
    waMessage: (boat) => `Hoi Ibiza mi Vida! Ik wil de private boot ${boat} graag boeken. Kunnen jullie de beschikbaarheid en de prijs bevestigen?`,
    bannerTitle: 'Niet zeker welk jacht bij je past?',
    bannerText: 'Geef je datums en groepsgrootte door — wij regelen de perfecte boot en alles eromheen.',
    whatsapp: 'WhatsApp ons',
    noResults: 'Geen jachten gevonden voor je zoekopdracht.',
    enlarge: 'Foto vergroten',
    boatsCount: (n) => `${n} ${n === 1 ? 'jacht' : 'jachten'}`,
  },
  de: {
    title: 'Private Bootscharter Ibiza',
    subtitle: "94 Boote aus unserer Partnerflotte — vom 22-ft-Tagesboot bis zur 92-ft-Superyacht, mit Live-Verfügbarkeit pro Tag. Rund um Ibiza & Formentera.",
    fromPrice: `Ab €${FLEET_FROM_PRICE.toLocaleString('de-DE')} / Tag`,
    searchPlaceholder: 'Yacht suchen…',
    allMarinas: 'Alle Häfen',
    pax: 'Gäste', length: 'Länge',
    seasonLow: 'Nebensaison', seasonMid: 'Zwischensaison', seasonHigh: 'Hauptsaison',
    seasonLowNote: "Rest des Jahres", seasonMidNote: "Zwischensaison — Zeitraum je Boot verschieden", seasonMidNoteCompact: "Zwischensaison — Zeitraum je Boot verschieden", seasonHighNote: "Juli und August",
    perDay: '/ Tag',
    pickDate: 'Dein Datum', availOnly: 'Nur verfügbare', availFree: 'Verfügbar', availOption: 'Auf Option', availBooked: 'Belegt',
    liveStamp: (t) => `Live-Stand, ${t}`,
    dossier: 'Bootsdossier (PDF)',
    termsNote: 'Was im Preis enthalten ist (Skipper, Kraftstoff, MwSt.) unterscheidet sich je Boot — es steht im Dossier und Simon bestätigt es vor der Buchung.',
    favCount: (n) => `${n} Favorit${n === 1 ? '' : 'en'}`,
    favSend: 'In einer Nachricht an Simon senden',
    favClear: 'Liste leeren',
    favWaIntro: 'Hallo Ibiza mi Vida! Das sind meine Lieblingsboote:',
    favWaDate: (d) => `Wunschdatum: ${d}`,
    favWaOutro: 'Könnt ihr dafür Verfügbarkeit und Preise prüfen?',
    favRemove: 'Entfernen',
    catAll: 'Alle Boote', catYacht: 'Yachten 50 ft+', catMotorboat: 'Motorboote 20–50 ft',
    inquire: 'Dieses Boot direkt buchen',
    waMessage: (boat) => `Hallo Ibiza mi Vida! Ich möchte das Privatboot ${boat} buchen. Können Sie Verfügbarkeit und Preis bestätigen?`,
    bannerTitle: 'Nicht sicher, welche Yacht zu Ihnen passt?',
    bannerText: 'Nennen Sie uns Ihre Daten und Gruppengröße — wir finden das perfekte Boot und kümmern uns um alles.',
    whatsapp: 'WhatsApp',
    noResults: 'Keine Yachten für Ihre Suche gefunden.',
    enlarge: 'Foto vergrößern',
    boatsCount: (n) => `${n} ${n === 1 ? 'Yacht' : 'Yachten'}`,
  },
  es: {
    title: 'Chárter de Barcos Privados en Ibiza',
    subtitle: "94 barcos de nuestra flota asociada — desde lanchas de 22 pies hasta superyates de 92, con disponibilidad en vivo por día. Por Ibiza y Formentera.",
    fromPrice: `Desde €${FLEET_FROM_PRICE.toLocaleString('es-ES')} / día`,
    searchPlaceholder: 'Buscar un yate…',
    allMarinas: 'Todos los puertos',
    pax: 'personas', length: 'eslora',
    seasonLow: 'Temporada baja', seasonMid: 'Temporada media', seasonHigh: 'Temporada alta',
    seasonLowNote: "Resto del año", seasonMidNote: "Temporada media — la ventana varía por barco", seasonMidNoteCompact: "Temporada media — la ventana varía por barco", seasonHighNote: "Julio y agosto",
    perDay: '/ día',
    pickDate: 'Tu fecha', availOnly: 'Solo disponibles', availFree: 'Disponible', availOption: 'En opción', availBooked: 'Ocupado',
    liveStamp: (t) => `Estado en vivo, ${t}`,
    dossier: 'Dossier del barco (PDF)',
    termsNote: 'Lo que incluye la tarifa (patrón, combustible, IVA) varía según el barco: está en el dossier y Simon lo confirma antes de reservar.',
    favCount: (n) => `${n} favorito${n === 1 ? '' : 's'}`,
    favSend: 'Enviar a Simon en un mensaje',
    favClear: 'Vaciar lista',
    favWaIntro: '¡Hola Ibiza mi Vida! Estos son mis barcos favoritos:',
    favWaDate: (d) => `Fecha preferida: ${d}`,
    favWaOutro: '¿Podéis comprobar disponibilidad y precios?',
    favRemove: 'Quitar',
    catAll: 'Todos los barcos', catYacht: 'Yates 50 ft+', catMotorboat: 'Lanchas 20–50 ft',
    inquire: 'Reserva este barco ya',
    waMessage: (boat) => `¡Hola Ibiza mi Vida! Quiero reservar el barco privado ${boat}. ¿Podéis confirmar la disponibilidad y el precio?`,
    bannerTitle: '¿No sabes qué yate elegir?',
    bannerText: 'Dinos tus fechas y el tamaño del grupo — te buscamos el barco perfecto y lo organizamos todo.',
    whatsapp: 'Escríbenos por WhatsApp',
    noResults: 'Ningún yate coincide con tu búsqueda.',
    enlarge: 'Ampliar foto',
    boatsCount: (n) => `${n} ${n === 1 ? 'yate' : 'yates'}`,
  },
  fr: {
    title: 'Location de Bateaux Privés à Ibiza',
    subtitle: "94 bateaux de notre flotte partenaire — du day-boat de 22 pieds au superyacht de 92, avec disponibilité en direct par jour. Autour d'Ibiza et Formentera.",
    fromPrice: `À partir de €${FLEET_FROM_PRICE.toLocaleString('fr-FR')} / jour`,
    searchPlaceholder: 'Rechercher un yacht…',
    allMarinas: 'Tous les ports',
    pax: 'invités', length: 'longueur',
    seasonLow: 'Basse saison', seasonMid: 'Moyenne saison', seasonHigh: 'Haute saison',
    seasonLowNote: "Reste de l'année", seasonMidNote: "Moyenne saison — la fenêtre varie selon le bateau", seasonMidNoteCompact: "Moyenne saison — la fenêtre varie selon le bateau", seasonHighNote: "Juillet et août",
    perDay: '/ jour',
    pickDate: 'Votre date', availOnly: 'Disponibles seulement', availFree: 'Disponible', availOption: 'En option', availBooked: 'Réservé',
    liveStamp: (t) => `État en direct, ${t}`,
    dossier: 'Dossier du bateau (PDF)',
    termsNote: "Ce que le tarif inclut (skipper, carburant, TVA) varie selon le bateau — c'est dans le dossier et Simon le confirme avant de réserver.",
    favCount: (n) => `${n} favori${n === 1 ? '' : 's'}`,
    favSend: 'Envoyer à Simon en un message',
    favClear: 'Vider la liste',
    favWaIntro: 'Bonjour Ibiza mi Vida ! Voici mes bateaux favoris :',
    favWaDate: (d) => `Date souhaitée : ${d}`,
    favWaOutro: 'Pouvez-vous vérifier la disponibilité et les prix ?',
    favRemove: 'Retirer',
    catAll: 'Tous les bateaux', catYacht: 'Yachts 50 ft+', catMotorboat: 'Bateaux à moteur 20–50 ft',
    inquire: 'Réservez ce bateau',
    waMessage: (boat) => `Bonjour Ibiza mi Vida ! Je souhaite réserver le bateau privé ${boat}. Pouvez-vous confirmer la disponibilité et le tarif ?`,
    bannerTitle: 'Vous ne savez pas quel yacht choisir ?',
    bannerText: 'Indiquez-nous vos dates et la taille du groupe — nous trouvons le bateau parfait et nous nous occupons de tout.',
    whatsapp: 'WhatsApp',
    noResults: 'Aucun yacht ne correspond à votre recherche.',
    enlarge: 'Agrandir la photo',
    boatsCount: (n) => `${n} ${n === 1 ? 'yacht' : 'yachts'}`,
  },
};

const fmt = (n: number, locale: string) => n.toLocaleString(({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as Record<string, string>)[locale] || 'en-GB');

function boatLabel(boat: Boat) {
  return boat.name ? `${boat.model} "${boat.name}"` : boat.model;
}

function waLink(boat: Boat, T: FleetLabels, date?: string | null) {
  // De gekozen datum gaat mee. Zonder datum is een "boek deze boot"-bericht
  // alsnog een vraag om informatie, en moet Simon eerst terugvragen wanneer.
  const tekst = T.waMessage(boatLabel(boat)) + (date ? `\n${T.favWaDate(date)}` : '');
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(tekst)}`;
}

// ── Boat advertisement card ─────────────────────────────────────────────────────
function BoatCard({ boat, T, locale, live, date, season }: {
  boat: Boat; T: FleetLabels; locale: string;
  /* Live gegevens voor deze boot, of null zolang de feed niet geladen/bereikbaar is. */
  live: { days: Record<string, 'booked' | 'option'>; price: Partial<Record<'low'|'mid'|'high'|'top', number>> | null; priceBands: { from: string; to: string; price: number }[] | null } | null;
  date: string | null; season: 'low'|'mid'|'high'|'top';
}) {
  const p = boat.price;
  // Live status + dagprijs voor de gekozen datum. Geen feed of geen datum →
  // geen live regel; de statische band hieronder staat er dan alleen.
  const st = live && date ? statusForDate(live, date) : null;
  const liveP = live && date ? priceForDate(live, date, season) : null;
  const stKleur = st === 'free' ? 'bg-ibiza-green' : st === 'option' ? 'bg-amber-500' : 'bg-red-500';
  const stTekst = st === 'free' ? T.availFree : st === 'option' ? T.availOption : T.availBooked;

  // ── Eén prijs: die van de gekozen datum ────────────────────────────────
  //
  // Hier stonden drie regels onder elkaar — laag-, tussen- en hoogseizoen —
  // plús de live dagprijs erboven. Op een dag in het laagseizoen betekende dat
  // vier prijzen op één kaart waarvan er twee hetzelfde getal waren, en 94
  // kaarten lang. Een bezoeker die 2 september kiest hoeft niet te weten wat
  // augustus kost; die kiest augustus wel als hij dat wil weten.
  //
  // De volgorde van betrouwbaarheid: de live dagprijs van de partner als die
  // er is (exact, voor precies die datum), anders de statische band van het
  // seizoen waar de datum in valt.
  const dag = date ?? ibizaToday();
  const seizoen = seasonForDate(dag);
  // Een boot zonder tussenseizoensprijs valt in die maanden op de lage band —
  // dan hoort het label dat ook te zeggen in plaats van een prijs onder de
  // verkeerde kop te zetten.
  const band = seizoen === 'mid' && p.mid == null ? 'low' : seizoen;
  const bandPrijs = band === 'high' ? p.high : band === 'mid' ? (p.mid as number) : p.low;
  const prijs = liveP ?? bandPrijs;
  const seizoenLabel = band === 'high' ? T.seasonHigh : band === 'mid' ? T.seasonMid : T.seasonLow;
  const seizoenNoot =
    band === 'high' ? (p.highWindow || T.seasonHighNote)
    : band === 'mid' ? (boat.category === 'motorboat' ? T.seasonMidNoteCompact : T.seasonMidNote)
    : T.seasonLowNote;
  return (
    <article id={`boat-${boat.slug}`} style={{ scrollMarginTop: 'calc(var(--nav-h) + 6px)' }} className="fleet-card group relative flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-ibiza-green hover:shadow-2xl target:ring-2 target:ring-ibiza-green">
      {/* Foto → rechtstreeks het dossier in, op uitdrukkelijk verzoek. De
          lightbox is vervallen: het plaatje van een advertentie hoort naar de
          advertentie zelf te leiden, en de dossierpagina heeft de terugknop
          die de PDF-weergave mist. Link in hetzelfde tabblad, zodat het
          terugpijltje ook werkt. */}
      <Link
        href={`/${locale}/private-boat-charters/dossier/${boat.slug}`}
        className="relative block aspect-[4/3] w-full overflow-hidden"
        aria-label={`${T.dossier} — ${boat.model} ${boat.name ?? ''}`}
      >
        {/* Gewone <img> met een srcset van drie Cloudinary-breedtes — zie
            FLEET in src/data/fleet.ts voor waarom niet next/image. lazy +
            async: 94 foto's mogen nooit de eerste paint ophouden. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={boat.image}
          srcSet={boat.imageSet}
          alt={`${boat.model} ${boat.name}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {/* Spec badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm ring-1 ring-white/15">
            <Users size={12} className="text-ibiza-green" /> {boat.pax}
          </span>
          {boat.length != null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm ring-1 ring-white/15">
              <Ruler size={12} className="text-ibiza-green" /> {boat.length}M
            </span>
          )}
        </div>
        {/* Hint dat de foto het dossier opent */}
        <span className="absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur-sm ring-1 ring-white/15 transition-opacity group-hover:opacity-100">
          <FileText size={14} />
        </span>
      </Link>
      {/* Hartje BUITEN de fotoknop: een button in een button is ongeldig HTML
          en de klik zou ook de lightbox openen. Absoluut gepositioneerd op
          dezelfde hoek, over de foto heen. */}
      <FavouriteButton slug={boat.slug} locale={locale} className="absolute right-3 top-3 z-10" />

      {/* Info / price panel */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-black/50">
          <MapPin size={11} className="text-ibiza-green" /> {boat.marina}
        </div>
        <h3 className="font-serif text-base font-bold leading-tight text-black">
          {boat.model}{boat.name && <span className="text-ibiza-green"> {boat.name}</span>}
        </h3>

        {/* Live beschikbaarheid voor de gekozen datum — alleen wanneer de
            partnerfeed er echt is. In eigen stijl (groen/amber/rood bolletje),
            geen kopie van hun kalender. De prijs stond hier ook nog eens; die
            staat nu één keer, hieronder. */}
        {st && (
          <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-neutral-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black/70 ring-1 ring-black/5">
            <span aria-hidden className={`h-2 w-2 rounded-full ${stKleur}`} />
            {stTekst}
          </div>
        )}

        {/* De prijs voor de gekozen datum, met het seizoen als bijschrift. */}
        <div className="mt-2.5 flex items-end justify-between gap-2 border-t border-black/10 pt-2.5">
          <div className="min-w-0">
            <div className={`truncate text-[11px] font-bold uppercase tracking-wider ${band === 'high' ? 'text-ibiza-green' : 'text-black/70'}`}>
              {seizoenLabel}
            </div>
            <div className="truncate text-[10px] text-black/40">{seizoenNoot}</div>
          </div>
          <div className="shrink-0 whitespace-nowrap font-serif text-lg font-bold text-black">
            €{fmt(prijs, locale)} <span className="font-sans text-[10px] font-normal text-black/40">{T.perDay}</span>
          </div>
        </div>

        {/* Dossier + voorwaarden. Hier stond een vaste badge-rij (kapitein,
            btw, drankjes…) uit de tijd dat de hele vloot van één leverancier
            met één pakket kwam. Deze vloot komt van negen verhuurders met elk
            eigen voorwaarden — dezelfde badges zouden voor een deel van de
            boten aantoonbaar onwaar zijn. Wat geldt staat in het dossier. */}
        <div className="mt-2.5">
          {/* Naar de dossierpagina in eigen huisstijl, zelfde tabblad — de
              kale PDF was een doodlopende steeg zonder logo of weg terug. De
              pagina bedt /api/dossier in (eigen edge-cache) en linkt terug
              naar precies deze kaart via het #boat-anker. */}
          <a
            href={`/${locale}/private-boat-charters/dossier/${boat.slug}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-ibiza-green underline underline-offset-2 hover:text-black"
          >
            <FileText size={12} /> {T.dossier}
          </a>
          <p className="mt-1.5 text-[10px] italic leading-relaxed text-black/40">{T.termsNote}</p>
        </div>

        {/* WhatsApp inquiry */}
        {/* De bestelknop van de kaart. Gloed via .book-cta — statisch, want er
            staan er 94 op deze pagina; zie de kop van die regel in globals.css. */}
        <a
          href={waLink(boat, T, date)}
          target="_blank"
          rel="noopener noreferrer"
          className="book-cta mt-3.5 inline-flex items-center justify-center gap-2 rounded-full bg-ibiza-green px-4 py-2.5 text-sm font-black text-white"
        >
          <MessageCircle size={16} /> {T.inquire}
        </a>
      </div>
    </article>
  );
}

// ── Main showcase ────────────────────────────────────────────────────────────
export default function FleetShowcase({ locale = 'nl', initialLive = null, initialDate }: {
  locale: string;
  /**
   * Live laag, server-side opgehaald door de pagina. Stond hier eerst als
   * fetch('/api/fleet-live') na mount: een extra verzoek per bezoeker, de
   * live regel die pas ná hydration in elke kaart verscheen (layout shift
   * over 94 kaarten) en een crawler zonder JavaScript die de beschikbaarheid
   * nooit zag. Nu staat hij in de eerste HTML.
   */
  initialLive?: LiveFleet | null;
  /** Vandaag (Ibiza-tijd) zoals de server hem rendert; zie ibizaToday(). */
  initialDate?: string | null;
}) {
  const T = FLEET_I18N[locale] || FLEET_I18N.en;
  const P = PRICE_I18N[locale] || PRICE_I18N.en;
  const bcp = ({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as Record<string, string>)[locale] || 'en-GB';
  const [search, setSearch] = useState('');
  const [marina, setMarina] = useState<string>('all');
  const [category, setCategory] = useState<FleetCategory | 'all'>('all');

  // Price filter state
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [minPax, setMinPax] = useState(0);
  const [sort, setSort] = useState<SortKey>('default');

  // ── Live laag: partnerfeed + gekozen datum ────────────────────────────────
  // `date` start op null en wordt pas na mount op vandaag gezet: new Date()
  // tijdens de render zou een hydration-mismatch geven (server en client
  // renderen op verschillende momenten). Tot die tijd is er simpelweg geen
  // live regel — de statische banden staan er dan al.
  const live = initialLive;
  // Favorieten: pas na mount uit localStorage (hydration-veilig), daarna live
  // synchroon met elk hartje — ook op de dossierpagina in hetzelfde tabblad.
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => { setFavs(getFavourites()); return onFavouritesChange(setFavs); }, []);
  // Start op de serverdatum (zelfde waarde als in de HTML, dus geen
  // hydration-mismatch) en corrigeer na mount alleen als de dag intussen
  // verstreken is — een pagina uit de cache rond middernacht.
  const [date, setDate] = useState<string | null>(initialDate ?? null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  useEffect(() => {
    const vandaag = ibizaToday();
    setDate(d => (d === null || d === initialDate) && d !== vandaag ? vandaag : d);
  }, [initialDate]);
  // Buiten het opgehaalde bereik valt er niets live te zeggen — de kiezer
  // begrenst daarop, en wie verder vooruit wil komt bij Simon uit.
  const dateInRange = !!(live && date && date >= live.rangeStart && date < live.rangeEnd);

  // Deep-link: bij binnenkomst met #boat-<slug> naar die kaart scrollen — en
  // even blijven corrigeren tot de layout stilstaat. De browser doet zelf een
  // vroege anker-scroll, maar daarna kan de pagina nog schuiven (webfonts,
  // de favorietenbalk). Vroeger was de grote verschuiver de live balk die pas
  // na de fetch in elke kaart verscheen (~1700px); die staat nu al in de
  // HTML, dus 2,4 seconden volstaat waar het 5 was. Instant scroll (geen
  // smooth: die animatie zou met de volgende controle wedijveren), stopt na
  // twee opeenvolgende goede metingen — wie zelf scrolt wordt hooguit even
  // gecorrigeerd, daarna nooit meer.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    let goed = 0;
    let beurten = 0;
    const iv = setInterval(() => {
      beurten++;
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top;
        const inBeeld = top >= -60 && top <= Math.max(200, window.innerHeight * 0.4);
        if (inBeeld) goed++;
        else { goed = 0; el.scrollIntoView({ behavior: 'auto', block: 'start' }); }
      }
      if (goed >= 2 || beurten >= 6) clearInterval(iv);
    }, 400);
    return () => clearInterval(iv);
  }, []);
  const isPriceActive = maxPrice < PRICE_MAX;
  const pricePct = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;


  const marinas = useMemo(() => Array.from(new Set(FLEET.map(b => b.marina))), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FLEET.filter(b => {
      const matchCategory = category === 'all' || b.category === category;
      const matchMarina = marina === 'all' || b.marina === marina;
      const matchSearch = !q || `${b.model} ${b.name ?? ''} ${b.marina}`.toLowerCase().includes(q);
      const matchPrice = b.price.low <= maxPrice;
      const matchPax = minPax === 0 || b.pax >= minPax;
      // "Alleen beschikbaar" toont uitsluitend boten waarvan de feed het
      // zégt. Een boot die niet in de feed staat kreeg eerst een lege
      // dagenlijst mee en gold daarmee als vrij — de kaart toonde geen
      // status, maar het filter beloofde wél beschikbaarheid.
      const lb = live && dateInRange ? live.boats[b.brokerKey] : undefined;
      const matchAvail = !onlyAvailable || !dateInRange || !live || !date
        ? true
        : !!lb && statusForDate(lb, date) === 'free';
      return matchCategory && matchMarina && matchSearch && matchPrice && matchPax && matchAvail;
    })
      // Sorteren op de laagseizoensprijs, want dat is ook het bedrag dat op de
      // kaart als "vanaf" staat. Sorteren op de hoogseizoensprijs zou een
      // andere volgorde geven dan de getallen die de bezoeker ziet.
      .sort((a, b) =>
        sort === 'price-asc' ? a.price.low - b.price.low
        : sort === 'price-desc' ? b.price.low - a.price.low
        : 0);
  }, [search, marina, category, maxPrice, minPax, sort, onlyAvailable, dateInRange, live, date]);

  // Actieve filters tellen voor de wis-knop. `date` telt niet mee: die staat
  // altijd op vandaag en is geen filter tot je "alleen beschikbaar" aanzet.
  const actieveFilters =
    (minPax > 0 ? 1 : 0) + (maxPrice < PRICE_MAX ? 1 : 0) + (marina !== 'all' ? 1 : 0) +
    (sort !== 'default' ? 1 : 0) + (onlyAvailable ? 1 : 0) + (category !== 'all' ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const wisFilters = useCallback(() => {
    setMinPax(0); setMaxPrice(PRICE_MAX); setMarina('all'); setSort('default');
    setOnlyAvailable(false); setCategory('all'); setSearch('');
  }, []);

  const favBoats = useMemo(() => FLEET.filter(b => favs.includes(b.slug)), [favs]);
  const favWa = useMemo(() => {
    if (!favBoats.length) return '#';
    const regels = favBoats.map(b => `• ${b.model} "${b.name ?? ''}" — https://www.ibizamivida.com/${locale}/private-boat-charters/dossier/${b.slug}`);
    const delen = [T.favWaIntro, ...regels];
    if (date) delen.push(T.favWaDate(date));
    delen.push(T.favWaOutro);
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(delen.join('\n'))}`;
  }, [favBoats, date, locale, T]);

  return (
    // pb-24 wanneer de favorietenbalk vast onderin staat, anders valt de
    // laatste kaart er half achter weg.
    <div className={`min-h-screen bg-white text-black ${favBoats.length > 0 ? 'pb-24' : ''}`}>
      <BackButton locale={locale} fallbackHref={`/${locale}`} variant="top" />
      <style dangerouslySetInnerHTML={{ __html: `
        .fleet-range { -webkit-appearance: none; appearance: none; height: 8px; border-radius: 9999px; outline: none; cursor: pointer; }
        .fleet-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px; border-radius: 9999px; background: #fff; border: 3px solid #0E7C66; box-shadow: 0 2px 8px rgba(0,0,0,0.25); cursor: grab; transition: transform .15s ease; }
        .fleet-range::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
        .fleet-range::-moz-range-thumb { width: 26px; height: 26px; border-radius: 9999px; background: #fff; border: 3px solid #0E7C66; box-shadow: 0 2px 8px rgba(0,0,0,0.25); cursor: grab; }
        .fleet-range:disabled::-webkit-slider-thumb { cursor: not-allowed; border-color: #9ca3af; }
        /* PERF: 94 kaarten staan allemaal in de HTML (crawlers zonder JS moeten
           de hele vloot zien), maar de browser hoeft alleen te lay-outen en te
           schilderen wat in beeld is. content-visibility:auto slaat de rest
           over tot je erheen scrolt; de intrinsic-size houdt de scrollbalk
           stabiel en 'auto' onthoudt de echte hoogte zodra een kaart één keer
           gerenderd is. scrollIntoView op een #boat-anker werkt er gewoon
           doorheen. */
        .fleet-card { content-visibility: auto; contain-intrinsic-size: auto 560px; }
      ` }} />
      {/* Hero — boat image as a full-bleed background; on mobile it fills the first viewport so the
          budget bar only appears once you scroll down. */}
      <section className="relative w-full overflow-hidden flex min-h-[97vh] flex-col justify-center md:block md:min-h-0">
        <Image src="/fleet/cover.jpeg" alt="Ibiza private boat charter" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 pt-[calc(var(--nav-h)+16px)] pb-12 text-center md:pb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-ibiza-green px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white ring-1 ring-white/30 shadow-lg backdrop-blur-sm">
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

      {/* Filterbalk in Airbnb-stijl. Verving een brede budgetschuif plus een
          losse datumbalk die samen het halve scherm vulden — zie
          FleetFilterBar voor waarom pillen hier beter werken. */}
      <FleetFilterBar
        locale={locale}
        marinas={marinas}
        priceMin={PRICE_MIN}
        priceMax={PRICE_MAX}
        paxMax={PAX_MAX}
        date={date}
        setDate={setDate}
        dateRange={live ? { start: live.rangeStart, end: live.rangeEnd } : null}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
        liveStamp={live ? liveStampTime(live.generatedAt, bcp) : null}
        minPax={minPax}
        setMinPax={setMinPax}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        marina={marina}
        setMarina={setMarina}
        sort={sort}
        setSort={setSort}
        onClear={wisFilters}
        activeCount={actieveFilters}
      />

      <section className="mx-auto max-w-6xl px-4 pt-4">
        {/* Het tijdstempel van de feed hoort te staan wáár de beschikbaarheid
            staat. Het stond alleen in het datumpaneel, en dat is dicht tot je
            het opent — de kaarten zeiden dus "Beschikbaar" zonder erbij te
            zeggen wanneer dat gemeten is. Dit blok is server-gerenderd, dus
            ook zonder JavaScript zie je hoe vers de stand is. Geen feed, geen
            regel: dan doen we ook geen uitspraak. */}
        <div className="flex flex-wrap items-baseline gap-x-2 px-1 text-sm font-semibold text-black/50">
          <span>{T.boatsCount(filtered.length)}</span>
          {live && (
            <span className="text-[12px] font-normal text-black/40">
              · {T.liveStamp(liveStampTime(live.generatedAt, bcp))}
            </span>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-6">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(boat => (
              <BoatCard
                key={boat.slug}
                boat={boat}
                T={T}
                locale={locale}
                live={dateInRange ? (live!.boats[boat.brokerKey] ?? null) : null}
                date={date}
                season={live?.season ?? 'mid'}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-black/10 bg-neutral-50 py-20 text-center text-black/50">{T.noResults}</div>
        )}
      </section>

      {/* Favorietenbalk — verschijnt zodra er iets bewaard is. bottom-14 op
          mobiel: onderin zit op sommige pagina's al de partnerbalk, en twee
          lagen op elkaar maakt beide onleesbaar. */}
      {favBoats.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-black/10 bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2.5 sm:gap-3 sm:py-3">
            <span className="inline-flex items-center gap-2 text-sm font-black text-black">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-red-500/10 text-red-500">♥</span>
              {T.favCount(favBoats.length)}
            </span>
            {/* Elke favoriet als chipje met een kruisje. Stond eerst als een
                platte opsomming van namen: je zag wél wat er in zat maar kon er
                niets uit halen zonder terug te scrollen naar het hartje op de
                kaart — en bij 94 kaarten is dat ver. Horizontaal scrollbaar,
                want vier namen passen niet op een telefoon. */}
            <div className="hide-scrollbar order-3 -mx-1 flex w-full min-w-0 gap-1.5 overflow-x-auto px-1 sm:order-none sm:w-auto sm:flex-1">
              {favBoats.map(b => (
                <span key={b.slug} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-neutral-100 py-1 pl-3 pr-1 text-[11px] font-bold text-neutral-700">
                  {b.name ?? b.model}
                  <button
                    type="button"
                    onClick={() => toggleFavourite(b.slug)}
                    aria-label={`${T.favRemove} ${b.name ?? b.model}`}
                    className="grid h-5 w-5 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-300 hover:text-black"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <a
              href={favWa}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-ibiza-green px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-95 active:scale-[0.98]"
            >
              <MessageCircle size={15} /> {T.favSend}
            </a>
          </div>
        </div>
      )}

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
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ibiza-green px-7 py-4 font-bold text-white transition-all hover:brightness-95 active:scale-95"
          >
            <MessageCircle size={19} /> {T.whatsapp}
          </a>
        </div>
      </section>

    </div>
  );
}

function FilterTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-6 py-3 text-sm font-bold transition-all duration-200 md:text-base ${
        active ? 'bg-ibiza-green text-white shadow-sm' : 'bg-neutral-100 text-black/70 hover:bg-neutral-200 hover:text-black'
      }`}
    >
      {children}
    </button>
  );
}
