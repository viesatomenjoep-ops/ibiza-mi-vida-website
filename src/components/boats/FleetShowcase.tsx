'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search, MessageCircle, Anchor, Ship, Waves, Percent, Users, Ruler,
  MapPin, X, Check, Euro, Lock, LockOpen, SlidersHorizontal,
} from 'lucide-react';
import { FLEET, FLEET_FROM_PRICE, type Boat, type FleetCategory } from '@/data/fleet';
import { priceForDate, statusForDate, type LiveFleet } from '@/lib/yacht-broker';
import { FileText, CalendarDays } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { FavouriteButton } from '@/components/boats/FavouriteButton';
import { getFavourites, onFavouritesChange } from '@/lib/boat-favourites';

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
    seasonLowNote: "Rest of the year", seasonMidNote: "Shoulder season — window differs per boat", seasonMidNoteCompact: "Shoulder season — window differs per boat", seasonHighNote: "Around July / August",
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
    catAll: 'All boats', catYacht: 'Yachts 50 ft+', catMotorboat: 'Motorboats 20–50 ft',
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
    title: 'Private Boot Charters Ibiza',
    subtitle: "94 boten uit onze partnervloot — van 22 ft dagboten tot 92 ft superjachten, met live beschikbaarheid per dag. Op het water rond Ibiza & Formentera.",
    fromPrice: `Vanaf €${FLEET_FROM_PRICE.toLocaleString('nl-NL')} / dag`,
    searchPlaceholder: 'Zoek een jacht…',
    allMarinas: 'Alle haventjes',
    pax: 'gasten', length: 'lengte',
    seasonLow: 'Laagseizoen', seasonMid: 'Middenseizoen', seasonHigh: 'Hoogseizoen',
    seasonLowNote: "Rest van het jaar", seasonMidNote: "Tussenseizoen — venster verschilt per boot", seasonMidNoteCompact: "Tussenseizoen — venster verschilt per boot", seasonHighNote: "Rond juli / augustus",
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
    catAll: 'Alle boten', catYacht: 'Jachten 50 ft+', catMotorboat: 'Motorboten 20–50 ft',
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
    title: 'Private Bootscharter Ibiza',
    subtitle: "94 Boote aus unserer Partnerflotte — vom 22-ft-Tagesboot bis zur 92-ft-Superyacht, mit Live-Verfügbarkeit pro Tag. Rund um Ibiza & Formentera.",
    fromPrice: `Ab €${FLEET_FROM_PRICE.toLocaleString('de-DE')} / Tag`,
    searchPlaceholder: 'Yacht suchen…',
    allMarinas: 'Alle Häfen',
    pax: 'Gäste', length: 'Länge',
    seasonLow: 'Nebensaison', seasonMid: 'Zwischensaison', seasonHigh: 'Hauptsaison',
    seasonLowNote: "Rest des Jahres", seasonMidNote: "Zwischensaison — Zeitraum je Boot verschieden", seasonMidNoteCompact: "Zwischensaison — Zeitraum je Boot verschieden", seasonHighNote: "Etwa Juli / August",
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
    catAll: 'Alle Boote', catYacht: 'Yachten 50 ft+', catMotorboat: 'Motorboote 20–50 ft',
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
    title: 'Chárter de Barcos Privados en Ibiza',
    subtitle: "94 barcos de nuestra flota asociada — desde lanchas de 22 pies hasta superyates de 92, con disponibilidad en vivo por día. Por Ibiza y Formentera.",
    fromPrice: `Desde €${FLEET_FROM_PRICE.toLocaleString('es-ES')} / día`,
    searchPlaceholder: 'Buscar un yate…',
    allMarinas: 'Todos los puertos',
    pax: 'personas', length: 'eslora',
    seasonLow: 'Temporada baja', seasonMid: 'Temporada media', seasonHigh: 'Temporada alta',
    seasonLowNote: "Resto del año", seasonMidNote: "Temporada media — la ventana varía por barco", seasonMidNoteCompact: "Temporada media — la ventana varía por barco", seasonHighNote: "Hacia julio / agosto",
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
    catAll: 'Todos los barcos', catYacht: 'Yates 50 ft+', catMotorboat: 'Lanchas 20–50 ft',
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
    title: 'Location de Bateaux Privés à Ibiza',
    subtitle: "94 bateaux de notre flotte partenaire — du day-boat de 22 pieds au superyacht de 92, avec disponibilité en direct par jour. Autour d'Ibiza et Formentera.",
    fromPrice: `À partir de €${FLEET_FROM_PRICE.toLocaleString('fr-FR')} / jour`,
    searchPlaceholder: 'Rechercher un yacht…',
    allMarinas: 'Tous les ports',
    pax: 'invités', length: 'longueur',
    seasonLow: 'Basse saison', seasonMid: 'Moyenne saison', seasonHigh: 'Haute saison',
    seasonLowNote: "Reste de l'année", seasonMidNote: "Moyenne saison — la fenêtre varie selon le bateau", seasonMidNoteCompact: "Moyenne saison — la fenêtre varie selon le bateau", seasonHighNote: "Vers juillet / août",
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
    catAll: 'Tous les bateaux', catYacht: 'Yachts 50 ft+', catMotorboat: 'Bateaux à moteur 20–50 ft',
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

const fmt = (n: number, locale: string) => n.toLocaleString(({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as Record<string, string>)[locale] || 'en-GB');

function boatLabel(boat: Boat) {
  return boat.name ? `${boat.model} "${boat.name}"` : boat.model;
}

function waLink(boat: Boat, T: FleetLabels) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(T.waMessage(boatLabel(boat)))}`;
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
  // geen live regel; de statische banden hieronder blijven altijd staan.
  const st = live && date ? statusForDate(live, date) : null;
  const liveP = live && date ? priceForDate(live, date, season) : null;
  const stKleur = st === 'free' ? 'bg-ibiza-green' : st === 'option' ? 'bg-amber-500' : 'bg-red-500';
  const stTekst = st === 'free' ? T.availFree : st === 'option' ? T.availOption : T.availBooked;
  return (
    <article id={`boat-${boat.slug}`} style={{ scrollMarginTop: 'calc(var(--nav-h) + 6px)' }} className="group relative flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-ibiza-green hover:shadow-2xl target:ring-2 target:ring-ibiza-green">
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

        {/* Live: status + dagprijs voor de gekozen datum — alleen wanneer de
            partnerfeed er echt is. In eigen stijl (groen/amber/rood bolletje),
            geen kopie van hun kalender. */}
        {st && (
          <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-neutral-50 px-3 py-2 ring-1 ring-black/5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-black/70">
              <span aria-hidden className={`h-2 w-2 rounded-full ${stKleur}`} />
              {stTekst}
            </span>
            {liveP != null && st === 'free' && (
              <span className="font-serif text-sm font-bold text-black">€{fmt(liveP, locale)} <span className="font-sans text-[10px] font-normal text-black/40">{T.perDay}</span></span>
            )}
          </div>
        )}

        {/* Seasonal prices */}
        <div className="mt-2.5 space-y-1 border-t border-black/10 pt-2.5">
          <PriceRow label={T.seasonLow} note={T.seasonLowNote} value={p.low} T={T} locale={locale} />
          {p.mid != null && <PriceRow label={T.seasonMid} note={boat.category === 'motorboat' ? T.seasonMidNoteCompact : T.seasonMidNote} value={p.mid} T={T} locale={locale} />}
          <PriceRow label={T.seasonHigh} note={p.highWindow || T.seasonHighNote} value={p.high} T={T} locale={locale} highlight />
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
        <a
          href={waLink(boat, T)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-ibiza-green px-4 py-2 text-sm font-bold text-white transition-all hover:brightness-95 active:scale-[0.98]"
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

// ── Main showcase ────────────────────────────────────────────────────────────
export default function FleetShowcase({ locale = 'nl' }: { locale: string }) {
  const T = FLEET_I18N[locale] || FLEET_I18N.en;
  const P = PRICE_I18N[locale] || PRICE_I18N.en;
  const bcp = ({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as Record<string, string>)[locale] || 'en-GB';
  const [search, setSearch] = useState('');
  const [marina, setMarina] = useState<string>('all');
  const [category, setCategory] = useState<FleetCategory | 'all'>('all');

  // Price filter state
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [priceLocked, setPriceLocked] = useState(false);

  // ── Live laag: partnerfeed + gekozen datum ────────────────────────────────
  // `date` start op null en wordt pas na mount op vandaag gezet: new Date()
  // tijdens de render zou een hydration-mismatch geven (server en client
  // renderen op verschillende momenten). Tot die tijd is er simpelweg geen
  // live regel — de statische banden staan er dan al.
  const [live, setLive] = useState<LiveFleet | null>(null);
  // Favorieten: pas na mount uit localStorage (hydration-veilig), daarna live
  // synchroon met elk hartje — ook op de dossierpagina in hetzelfde tabblad.
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => { setFavs(getFavourites()); return onFavouritesChange(setFavs); }, []);
  const [date, setDate] = useState<string | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10));
    let dood = false;
    fetch('/api/fleet-live')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (!dood && d?.boats) setLive(d as LiveFleet); })
      .catch(() => {}); // feed onbereikbaar → geen live laag, geen foutmelding
    return () => { dood = true; };
  }, []);
  // Buiten het opgehaalde bereik valt er niets live te zeggen — de kiezer
  // begrenst daarop, en wie verder vooruit wil komt bij Simon uit.
  const dateInRange = !!(live && date && date >= live.rangeStart && date < live.rangeEnd);

  // Deep-link: bij binnenkomst met #boat-<slug> naar die kaart scrollen — en
  // blijven corrigeren tot de layout stilstaat. De browser doet zelf een
  // vroege anker-scroll, maar daarna schuift de pagina nog: de live balk
  // verschijnt zodra de feed geladen is en duwt het grid omlaag. Eén scroll
  // op een vast moment eindigde daardoor aantoonbaar ~1700px boven de kaart.
  // Dit interval kijkt 5 seconden lang elke 400ms of de kaart nog ongeveer
  // bovenin beeld staat, corrigeert instant (geen smooth: die animatie zou
  // met de volgende controle wedijveren) en stopt na twee opeenvolgende
  // goede metingen — wie zelf scrolt wordt dus hooguit even gecorrigeerd,
  // daarna nooit meer.
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
      if (goed >= 2 || beurten >= 13) clearInterval(iv);
    }, 400);
    return () => clearInterval(iv);
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
      const matchAvail = !onlyAvailable || !dateInRange || !live || !date
        ? true
        : statusForDate(live.boats[b.brokerKey] ?? { days: {}, price: null, priceBands: null }, date) === 'free';
      return matchCategory && matchMarina && matchSearch && matchPrice && matchAvail;
    });
  }, [search, marina, category, maxPrice, onlyAvailable, dateInRange, live, date]);

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
              <span className="rounded-full bg-ibiza-green px-3 py-1 text-white">
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
              style={{ background: `linear-gradient(to right, #0E7C66 0%, #0E7C66 ${pricePct}%, #e5e5e5 ${pricePct}%, #e5e5e5 100%)` }}
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
                    on ? 'bg-ibiza-green text-white shadow-sm' : 'bg-neutral-100 text-black/70 hover:bg-neutral-200'
                  }`}
                >
                  ≤ €{v.toLocaleString(bcp)}
                </button>
              );
            })}
            <button
              onClick={resetPrice}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                !isPriceActive ? 'bg-ibiza-green text-white shadow-sm' : 'bg-neutral-100 text-black/70 hover:bg-neutral-200'
              }`}
            >
              {P.any}
            </button>
          </div>
        </div>
      </section>

      {/* Live beschikbaarheid: datumkiezer + filter. Alleen zichtbaar wanneer
          de partnerfeed er is — een datumkiezer die niets doet is erger dan
          geen datumkiezer. */}
      {live && date && (
        <section className="sticky top-[var(--nav-h)] z-40 mx-auto max-w-6xl px-4 pt-4 md:static">
          {/* Sticky op mobiel: wie door 94 kaarten scrolt moet de datum en het
              beschikbaarheidsfilter kunnen wisselen zonder terug omhoog te
              klimmen. Op desktop is dat niet nodig (alles staat in beeld) en
              zou de balk alleen ruimte vreten — vandaar md:static. */}
          <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-black/10 bg-white/95 p-3 shadow-md backdrop-blur-md md:gap-3 md:bg-neutral-50 md:p-4 md:shadow-none md:backdrop-blur-none">
            <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black">
              <CalendarDays size={16} className="text-ibiza-green" /> {T.pickDate}
            </span>
            <input
              type="date"
              value={date}
              min={live.rangeStart}
              max={live.rangeEnd}
              onChange={e => e.target.value && setDate(e.target.value)}
              className="min-w-[8.5rem] flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black md:flex-none"
              aria-label={T.pickDate}
            />
            <button
              onClick={() => setOnlyAvailable(v => !v)}
              aria-pressed={onlyAvailable}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                onlyAvailable ? 'bg-ibiza-green text-white shadow-sm' : 'bg-neutral-100 text-black/70 hover:bg-neutral-200'
              }`}
            >
              {T.availOnly}
            </button>
            {/* Tijdstempel van de feed: een claim "live" zonder tijdstip erbij
                is niet controleerbaar. */}
            <span className="w-full text-right text-[10px] text-black/40 md:ml-auto md:w-auto md:text-[11px]">
              {T.liveStamp(new Date(live.generatedAt).toLocaleTimeString(bcp, { hour: '2-digit', minute: '2-digit' }))}
            </span>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pt-4">
        <div className="px-1 text-sm font-semibold text-black/50">{T.boatsCount(filtered.length)}</div>
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
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
            <span className="inline-flex items-center gap-2 text-sm font-black text-black">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-red-500/10 text-red-500">♥</span>
              {T.favCount(favBoats.length)}
            </span>
            <span className="hidden min-w-0 flex-1 truncate text-xs text-black/50 sm:block">
              {favBoats.map(b => b.name ?? b.model).join(' · ')}
            </span>
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
