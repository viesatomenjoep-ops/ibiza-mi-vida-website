import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, ArrowRight } from 'lucide-react'
import type { BoatCategory } from '@/lib/boat-categories'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'

/**
 * The boats hub.
 *
 * ── What changed and why ──────────────────────────────────────────────────
 * This was a client component rendering five identical cards, each with a
 * Lucide icon on a flat panel. Two problems, and the second is the expensive
 * one:
 *
 *  1. `"use client"` on a page whose only interactivity is a native <details>.
 *     Nothing here needs JavaScript, and this site's whole premise is being
 *     readable by crawlers that run none. It is a server component now.
 *
 *  2. Five equal cards with icons made a DJ boat party, a quiet cove cruise, a
 *     private yacht, a beach shuttle and a Formentera ferry look like the same
 *     product. The only job of a hub page is to route someone to the right one
 *     of five, and an icon of a boat next to an icon of a boat routes nobody.
 *
 * So: real photography per category, pulled from the same venue data that sits
 * behind each link (see src/lib/boat-categories.ts), and an asymmetric grid —
 * two wide cards, then three — rather than a uniform row. The wide pair carries
 * the two categories people actually arrive for; the trio below is transport,
 * which is a decision, not a daydream.
 *
 * ── Colour ────────────────────────────────────────────────────────────────
 * Tokens from tailwind.config.ts, not invented: `gold` fills surfaces and
 * `gold-soft` writes on dark ones — the config measures gold on obsidian at
 * 3.68:1, which fails AA for text. The photographs supply the colour; the
 * chrome stays neutral so they can.
 *
 * Hover motion is behind `motion-safe:`, so a visitor with reduced-motion set
 * gets the colour change without the zoom.
 */

export interface BoatsHubProps {
  locale: string
  covers: Record<BoatCategory, string | null>
}

// ── Full 5-locale copy for the boats hub ──
interface BoatsLabels {
  eyebrow: string; h1: string; lead: string;
  partiesTag: string; partiesTitle: string; partiesText: string; discover: string;
  tripsTag: string; tripsTitle: string; tripsText: string; view: string;
  charterTag: string; charterTitle: string; charterText: string; request: string;
  shuttleTag: string; shuttleTitle: string; shuttleText: string; tickets: string;
  ferryTag: string; ferryTitle: string; ferryText: string;
  waKicker: string; waTitle: string; waText: string; waBtn: string;
  seoTitle: string; seoP1: string; seoP2: string;
  faqKicker: string; faqTitle: string;
  faqs: { q: string; a: string }[];
}

const I18N: Record<string, BoatsLabels> = {
  nl: {
    eyebrow: 'Alles op het water', h1: 'Ibiza per Boot',
    lead: 'Van all-inclusive boat parties tot het huren van een privé jacht. Jouw ultieme dag op het water begint hier.',
    partiesTag: 'Feesten', partiesTitle: 'Bootfeesten (Boat Parties)', partiesText: "De legendarische feesten op zee. Met top dj's, open bar en honderden party-gangers langs de kust van Ibiza.", discover: 'Ontdekken',
    tripsTag: 'Dagtrips', tripsTitle: 'Boat Trips & Excursies', tripsText: 'Ontspannen varen naar verborgen baaien. Inclusief zwemstops, snorkelen en vaak een verzorgde paella-lunch.', view: 'Bekijken',
    charterTag: 'Privé', charterTitle: 'Privé Boat Charters', charterText: 'Huur een complete boot met schipper voor jouw eigen groep. Vanaf betaalbare sloepen tot luxe jachten.', request: 'Aanvragen',
    shuttleTag: 'Vanaf €8', shuttleTitle: "Shuttle Ferry's (Ibiza)", shuttleText: "Goedkope en leuke watertaxi's die je snel naar de populaire stranden op Ibiza zelf brengen (bijv. Cala Bassa).", tickets: 'Tickets',
    ferryTag: 'Vanaf €25', ferryTitle: 'Ferry Ibiza – Formentera', ferryText: 'In ± 30 minuten naar het paradijselijke Formentera en zijn turquoise stranden.',
    waKicker: 'Niet zeker welke?', waTitle: 'Wij helpen je kiezen', waText: 'Vertel ons je groep en wensen via WhatsApp — we adviseren de beste optie op het water.', waBtn: 'Chat met ons',
    seoTitle: 'Ibiza beleven vanaf het water',
    seoP1: 'Het water is de mooiste kant van Ibiza. Of je nu wilt feesten op een varende dansvloer, in alle rust de verborgen baaien wilt ontdekken, je eigen boot wilt huren of snel naar Formentera wilt — alle opties vind je hier overzichtelijk bij elkaar.',
    seoP2: 'Kies een categorie om het actuele aanbod, de tijden en de prijzen te bekijken. Voor groepen of privé-arrangementen helpen we je graag persoonlijk via WhatsApp.',
    faqKicker: 'Veelgestelde vragen', faqTitle: 'Goed om te weten',
    faqs: [
      { q: 'Wat is het verschil tussen een boat party en een boat trip?', a: "Een boat party draait om feesten met dj's en drank, vaak 's middags of bij zonsondergang. Een boat trip is rustiger en gericht op de mooiste plekken langs de kust." },
      { q: 'Hoe boek ik een privé boot?', a: 'Open Private Boat Charters en neem contact op via WhatsApp. We sturen je passende boten met info en prijzen.' },
      { q: 'Welke optie is het snelst naar Formentera?', a: 'De Ferry Ibiza – Formentera brengt je in ongeveer 30 tot 45 minuten van Ibiza-Stad naar de haven van Formentera (La Savina).' },
    ],
  },
  en: {
    eyebrow: 'Everything on the water', h1: 'Ibiza by Boat',
    lead: 'From all-inclusive boat parties to renting a private yacht. Your ultimate day on the water starts here.',
    partiesTag: 'Parties', partiesTitle: 'Boat Parties', partiesText: 'The legendary parties at sea. Top DJs, open bar and hundreds of party-goers along the Ibiza coast.', discover: 'Discover',
    tripsTag: 'Day trips', tripsTitle: 'Boat Trips & Excursions', tripsText: 'Relaxed cruising to hidden coves. Including swim stops, snorkelling and often a catered paella lunch.', view: 'View',
    charterTag: 'Private', charterTitle: 'Private Boat Charters', charterText: 'Rent a complete boat with skipper for your own group. From affordable day boats to luxury yachts.', request: 'Enquire',
    shuttleTag: 'From €8', shuttleTitle: 'Shuttle Ferries (Ibiza)', shuttleText: 'Cheap and fun water taxis that quickly take you to the popular beaches on Ibiza itself (e.g. Cala Bassa).', tickets: 'Tickets',
    ferryTag: 'From €25', ferryTitle: 'Ferry Ibiza – Formentera', ferryText: 'Reach paradisiacal Formentera and its turquoise beaches in ± 30 minutes.',
    waKicker: 'Not sure which one?', waTitle: 'We help you choose', waText: 'Tell us your group and wishes on WhatsApp — we advise the best option on the water.', waBtn: 'Chat with us',
    seoTitle: 'Experiencing Ibiza from the water',
    seoP1: 'The water is the most beautiful side of Ibiza. Whether you want to party on a floating dance floor, quietly discover hidden coves, rent your own boat or get to Formentera fast — all options are gathered here.',
    seoP2: 'Pick a category to see the current offer, times and prices. For groups or private arrangements we are happy to help personally via WhatsApp.',
    faqKicker: 'Frequently asked questions', faqTitle: 'Good to know',
    faqs: [
      { q: 'What is the difference between a boat party and a boat trip?', a: 'A boat party is about partying with DJs and drinks, usually in the afternoon or at sunset. A boat trip is calmer and focused on the most beautiful spots along the coast.' },
      { q: 'How do I book a private boat?', a: 'Open Private Boat Charters and contact us via WhatsApp. We send you suitable boats with info and prices.' },
      { q: 'Which option is fastest to Formentera?', a: 'The Ferry Ibiza – Formentera takes you from Ibiza Town to Formentera’s port (La Savina) in about 30 to 45 minutes.' },
    ],
  },
  de: {
    eyebrow: 'Alles auf dem Wasser', h1: 'Ibiza per Boot',
    lead: 'Von All-inclusive-Boat-Partys bis zur privaten Yacht. Dein ultimativer Tag auf dem Wasser beginnt hier.',
    partiesTag: 'Partys', partiesTitle: 'Boat Partys', partiesText: 'Die legendären Partys auf See. Top-DJs, Open Bar und Hunderte Feiernde entlang der Küste Ibizas.', discover: 'Entdecken',
    tripsTag: 'Tagesausflüge', tripsTitle: 'Bootstouren & Ausflüge', tripsText: 'Entspannt zu versteckten Buchten. Mit Badestopps, Schnorcheln und oft einem Paella-Lunch.', view: 'Ansehen',
    charterTag: 'Privat', charterTitle: 'Private Bootscharter', charterText: 'Miete ein komplettes Boot mit Skipper für deine Gruppe. Von günstigen Booten bis zu Luxusyachten.', request: 'Anfragen',
    shuttleTag: 'Ab €8', shuttleTitle: 'Shuttle-Fähren (Ibiza)', shuttleText: 'Günstige Wassertaxis, die dich schnell zu den beliebten Stränden Ibizas bringen (z. B. Cala Bassa).', tickets: 'Tickets',
    ferryTag: 'Ab €25', ferryTitle: 'Fähre Ibiza – Formentera', ferryText: 'In ± 30 Minuten zum paradiesischen Formentera mit seinen türkisfarbenen Stränden.',
    waKicker: 'Nicht sicher, welche?', waTitle: 'Wir helfen bei der Wahl', waText: 'Nenn uns deine Gruppe und Wünsche per WhatsApp — wir empfehlen die beste Option auf dem Wasser.', waBtn: 'Chatte mit uns',
    seoTitle: 'Ibiza vom Wasser aus erleben',
    seoP1: 'Das Wasser ist die schönste Seite Ibizas. Ob Feiern auf einer schwimmenden Tanzfläche, versteckte Buchten entdecken, ein eigenes Boot mieten oder schnell nach Formentera — alle Optionen findest du hier.',
    seoP2: 'Wähle eine Kategorie für Angebot, Zeiten und Preise. Für Gruppen oder private Arrangements helfen wir gern persönlich per WhatsApp.',
    faqKicker: 'Häufige Fragen', faqTitle: 'Gut zu wissen',
    faqs: [
      { q: 'Was ist der Unterschied zwischen Boat Party und Bootstour?', a: 'Bei einer Boat Party geht es ums Feiern mit DJs und Getränken, meist nachmittags oder zum Sonnenuntergang. Eine Bootstour ist ruhiger und zeigt die schönsten Orte entlang der Küste.' },
      { q: 'Wie buche ich ein privates Boot?', a: 'Öffne Private Boat Charters und kontaktiere uns per WhatsApp. Wir schicken dir passende Boote mit Infos und Preisen.' },
      { q: 'Welche Option ist am schnellsten nach Formentera?', a: 'Die Fähre Ibiza – Formentera bringt dich in etwa 30 bis 45 Minuten von Ibiza-Stadt zum Hafen von Formentera (La Savina).' },
    ],
  },
  es: {
    eyebrow: 'Todo en el agua', h1: 'Ibiza en Barco',
    lead: 'De boat parties con todo incluido al alquiler de un yate privado. Tu día perfecto en el mar empieza aquí.',
    partiesTag: 'Fiestas', partiesTitle: 'Boat Parties', partiesText: 'Las fiestas legendarias en el mar. Top DJs, barra libre y cientos de personas de fiesta por la costa de Ibiza.', discover: 'Descubrir',
    tripsTag: 'Excursiones', tripsTitle: 'Paseos y Excursiones en Barco', tripsText: 'Navegación relajada a calas escondidas. Con paradas para nadar, snorkel y a menudo paella incluida.', view: 'Ver',
    charterTag: 'Privado', charterTitle: 'Chárter de Barco Privado', charterText: 'Alquila un barco completo con patrón para tu grupo. Desde barcos asequibles hasta yates de lujo.', request: 'Solicitar',
    shuttleTag: 'Desde €8', shuttleTitle: 'Ferris Lanzadera (Ibiza)', shuttleText: 'Taxis acuáticos baratos y divertidos que te llevan rápido a las playas populares de Ibiza (p. ej. Cala Bassa).', tickets: 'Billetes',
    ferryTag: 'Desde €25', ferryTitle: 'Ferry Ibiza – Formentera', ferryText: 'En ± 30 minutos al paraíso de Formentera y sus playas turquesas.',
    waKicker: '¿No sabes cuál?', waTitle: 'Te ayudamos a elegir', waText: 'Cuéntanos tu grupo y tus planes por WhatsApp — te recomendamos la mejor opción en el agua.', waBtn: 'Chatea con nosotros',
    seoTitle: 'Vivir Ibiza desde el mar',
    seoP1: 'El mar es el lado más bonito de Ibiza. Ya sea fiesta en una pista de baile flotante, descubrir calas escondidas con calma, alquilar tu propio barco o llegar rápido a Formentera — aquí tienes todas las opciones.',
    seoP2: 'Elige una categoría para ver la oferta actual, horarios y precios. Para grupos o planes privados te ayudamos personalmente por WhatsApp.',
    faqKicker: 'Preguntas frecuentes', faqTitle: 'Bueno saberlo',
    faqs: [
      { q: '¿Cuál es la diferencia entre una boat party y un paseo en barco?', a: 'La boat party es fiesta con DJs y bebida, normalmente por la tarde o al atardecer. El paseo en barco es más tranquilo y se centra en los rincones más bonitos de la costa.' },
      { q: '¿Cómo reservo un barco privado?', a: 'Abre Private Boat Charters y contáctanos por WhatsApp. Te enviamos barcos adecuados con información y precios.' },
      { q: '¿Cuál es la opción más rápida a Formentera?', a: 'El Ferry Ibiza – Formentera te lleva de Ibiza ciudad al puerto de Formentera (La Savina) en unos 30 a 45 minutos.' },
    ],
  },
  fr: {
    eyebrow: 'Tout sur l’eau', h1: 'Ibiza en Bateau',
    lead: 'Des boat parties tout compris à la location d’un yacht privé. Votre journée ultime sur l’eau commence ici.',
    partiesTag: 'Fêtes', partiesTitle: 'Boat Parties', partiesText: 'Les fêtes légendaires en mer. Top DJs, open bar et des centaines de fêtards le long de la côte d’Ibiza.', discover: 'Découvrir',
    tripsTag: 'Excursions', tripsTitle: 'Sorties & Excursions en Bateau', tripsText: 'Navigation détendue vers des criques cachées. Pauses baignade, snorkeling et souvent un déjeuner paella.', view: 'Voir',
    charterTag: 'Privé', charterTitle: 'Location de Bateau Privé', charterText: 'Louez un bateau complet avec skipper pour votre groupe. Du bateau abordable au yacht de luxe.', request: 'Demander',
    shuttleTag: 'Dès €8', shuttleTitle: 'Navettes Maritimes (Ibiza)', shuttleText: 'Des taxis de mer économiques et fun qui vous emmènent vite aux plages populaires d’Ibiza (ex. Cala Bassa).', tickets: 'Billets',
    ferryTag: 'Dès €25', ferryTitle: 'Ferry Ibiza – Formentera', ferryText: 'En ± 30 minutes vers le paradis de Formentera et ses plages turquoise.',
    waKicker: 'Pas sûr de votre choix ?', waTitle: 'Nous vous aidons à choisir', waText: 'Décrivez votre groupe et vos envies sur WhatsApp — nous conseillons la meilleure option sur l’eau.', waBtn: 'Discutez avec nous',
    seoTitle: 'Vivre Ibiza depuis la mer',
    seoP1: 'La mer est le plus beau visage d’Ibiza. Faire la fête sur une piste de danse flottante, découvrir des criques cachées, louer votre propre bateau ou rejoindre Formentera rapidement — toutes les options sont réunies ici.',
    seoP2: 'Choisissez une catégorie pour voir l’offre actuelle, les horaires et les prix. Pour les groupes ou arrangements privés, nous vous aidons personnellement via WhatsApp.',
    faqKicker: 'Questions fréquentes', faqTitle: 'Bon à savoir',
    faqs: [
      { q: 'Quelle est la différence entre une boat party et une sortie en bateau ?', a: 'La boat party, c’est la fête avec DJs et boissons, souvent l’après-midi ou au coucher du soleil. La sortie en bateau est plus calme et axée sur les plus beaux coins de la côte.' },
      { q: 'Comment réserver un bateau privé ?', a: 'Ouvrez Private Boat Charters et contactez-nous via WhatsApp. Nous vous envoyons des bateaux adaptés avec infos et prix.' },
      { q: 'Quelle option est la plus rapide vers Formentera ?', a: 'Le Ferry Ibiza – Formentera vous emmène d’Ibiza-ville au port de Formentera (La Savina) en 30 à 45 minutes environ.' },
    ],
  },
};
/** Alt text per category, in the page language — describes the photo's subject. */
const ALT: Record<string, Record<BoatCategory, string>> = {
  nl: {
    'boat-party': 'Bootfeest op zee voor de kust van Ibiza',
    'boat-trip': 'Boottocht langs een baai op Ibiza',
    'private-boat-charters': 'Privéjacht uit onze vloot op Ibiza',
    'shuttle-ferry': 'Shuttleboot naar een strand op Ibiza',
    'ferry-formentera': 'Ferry tussen Ibiza en Formentera',
  },
  en: {
    'boat-party': 'Boat party at sea off the Ibiza coast',
    'boat-trip': 'Boat trip along a cove in Ibiza',
    'private-boat-charters': 'Private yacht from our Ibiza fleet',
    'shuttle-ferry': 'Shuttle boat to a beach in Ibiza',
    'ferry-formentera': 'Ferry between Ibiza and Formentera',
  },
  de: {
    'boat-party': 'Bootsparty auf See vor der Küste Ibizas',
    'boat-trip': 'Bootstour entlang einer Bucht auf Ibiza',
    'private-boat-charters': 'Privatyacht aus unserer Flotte auf Ibiza',
    'shuttle-ferry': 'Shuttleboot zu einem Strand auf Ibiza',
    'ferry-formentera': 'Fähre zwischen Ibiza und Formentera',
  },
  es: {
    'boat-party': 'Fiesta en barco en la costa de Ibiza',
    'boat-trip': 'Excursión en barco por una cala de Ibiza',
    'private-boat-charters': 'Yate privado de nuestra flota en Ibiza',
    'shuttle-ferry': 'Barco lanzadera a una playa de Ibiza',
    'ferry-formentera': 'Ferry entre Ibiza y Formentera',
  },
  fr: {
    'boat-party': 'Boat party en mer au large d’Ibiza',
    'boat-trip': 'Sortie en bateau le long d’une crique à Ibiza',
    'private-boat-charters': 'Yacht privé de notre flotte à Ibiza',
    'shuttle-ferry': 'Navette maritime vers une plage d’Ibiza',
    'ferry-formentera': 'Ferry entre Ibiza et Formentera',
  },
}

interface Card {
  key: BoatCategory
  href: string
  tag: string
  title: string
  text: string
  cta: string
  /** Wide cards lead the grid; the rest are the transport row. */
  feature?: boolean
}

function CategoryCard({
  card,
  cover,
  alt,
  priority,
}: {
  card: Card
  cover: string | null
  alt: string
  priority: boolean
}) {
  return (
    <Link
      href={card.href}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white outline-none transition-shadow hover:shadow-xl focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
        card.feature ? 'lg:col-span-3' : 'lg:col-span-2'
      }`}
    >
      <div className={`relative w-full overflow-hidden bg-neutral-200 ${card.feature ? 'aspect-[16/10]' : 'aspect-[16/11]'}`}>
        {cover ? (
          <Image
            src={cover}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
          />
        ) : (
          // No usable photo in the feed — a flat panel rather than a broken image.
          <div className="absolute inset-0 bg-obsidian-light" />
        )}
        {/* Scrim: the tag sits on photography, so it needs a guaranteed ground. */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
          {card.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* h2, not h3: these five categories are the page's top-level sections,
            and with nothing between them and the h1 an h3 would skip a level —
            which is both a real screen-reader problem and what check:onpage
            flagged here. */}
        <h2 className={`font-serif font-black leading-tight tracking-tight text-neutral-900 ${card.feature ? 'text-xl md:text-2xl' : 'text-lg'}`}>
          {card.title}
        </h2>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-neutral-600">{card.text}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-serif text-[13px] font-black uppercase tracking-widest text-gold transition-colors group-hover:text-neutral-900">
          {card.cta}
          <ArrowRight size={16} className="transition-transform motion-safe:group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export default function BoatsHub({ locale, covers }: BoatsHubProps) {
  const T = I18N[locale] || I18N.en
  const alt = ALT[locale] || ALT.en
  const base = `/${locale}`

  const cards: Card[] = [
    { key: 'boat-party', href: `${base}/boat-party`, tag: T.partiesTag, title: T.partiesTitle, text: T.partiesText, cta: T.discover, feature: true },
    { key: 'private-boat-charters', href: `${base}/private-boat-charters`, tag: T.charterTag, title: T.charterTitle, text: T.charterText, cta: T.request, feature: true },
    { key: 'boat-trip', href: `${base}/boat-trip`, tag: T.tripsTag, title: T.tripsTitle, text: T.tripsText, cta: T.view },
    { key: 'shuttle-ferry', href: `${base}/shuttle-ferry`, tag: T.shuttleTag, title: T.shuttleTitle, text: T.shuttleText, cta: T.tickets },
    { key: 'ferry-formentera', href: `${base}/ferry-formentera`, tag: T.ferryTag, title: T.ferryTitle, text: T.ferryText, cta: T.view },
  ]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-obsidian text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gold/20 blur-[140px]"
        />
        {/* pt via --nav-h: de site-header is fixed (134px desktop / 116px mobiel).
            Met een vaste py-16 verdween de kicker eronder — dat is wat er op de
            oude versie van deze pagina misging. */}
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-[calc(var(--nav-h)+40px)] md:pb-24 md:pt-[calc(var(--nav-h)+64px)]">
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-soft">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-soft" />
            {T.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            {T.h1}
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/75 md:text-lg">{T.lead}</p>
        </div>
        <svg aria-hidden viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-10 w-full text-white md:h-14">
          <path d="M0 30 Q 360 60 720 30 T 1440 30 V 60 H 0 Z" fill="currentColor" opacity="0.12" />
          <path d="M0 42 Q 360 14 720 42 T 1440 42 V 60 H 0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* ── Category grid — 2 wide, then 3 ───────────────────────────────── */}
      <section className="bg-white py-14 text-neutral-900 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {cards.map((c, i) => (
              <CategoryCard key={c.key} card={c} cover={covers[c.key]} alt={alt[c.key]} priority={i < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp band ────────────────────────────────────────────────── */}
      <section className="bg-white pb-16 text-neutral-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-6 rounded-3xl bg-obsidian p-7 text-white md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-soft">{T.waKicker}</p>
              <h2 className="mt-3 font-serif text-2xl font-black tracking-tight md:text-3xl">{T.waTitle}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/75">{T.waText}</p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit shrink-0 items-center gap-2.5 rounded-full bg-gold px-7 py-4 font-serif text-[13px] font-black uppercase tracking-widest text-white outline-none transition-colors hover:bg-gold-soft hover:text-obsidian focus-visible:ring-2 focus-visible:ring-gold-soft focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
            >
              <MessageCircle size={19} />
              {T.waBtn}
            </a>
          </div>
        </div>
      </section>

      {/* ── Editorial ────────────────────────────────────────────────────── */}
      <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{T.seoTitle}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-neutral-700">{T.seoP1}</p>
          <p className="mt-4 text-[16px] leading-relaxed text-neutral-700">{T.seoP2}</p>
        </div>
      </section>

      {/* ── FAQ — native <details>, readable with no JavaScript ──────────── */}
      <section className="border-t border-black/5 bg-neutral-50 py-14 text-neutral-900">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">{T.faqKicker}</p>
          <h2 className="mt-2 font-serif text-2xl font-black tracking-tight md:text-3xl">{T.faqTitle}</h2>
          <div className="mt-7 divide-y divide-black/8 border-y border-black/8">
            {T.faqs.map((f, i) => (
              <details key={i} className="group !bg-transparent !border-0 !px-0 !py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-serif text-base font-bold normal-case leading-snug tracking-normal text-neutral-900 marker:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-neutral-500 transition-transform group-open:rotate-45 group-open:border-gold group-open:text-gold"
                  >
                    +
                  </span>
                </summary>
                <p className="!mt-0 pb-5 pr-11 text-[15px] leading-relaxed !text-neutral-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
