'use client';

import React from 'react';
import Link from 'next/link';
import { Anchor, Navigation, Waves, Users, Ship, ArrowRight, MessageCircle } from 'lucide-react';
import '@/styles/boats.css';

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

const PlusIcon = () => (
  <span className="pm">
    <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" fill="none" strokeWidth="2.4"/></svg>
  </span>
);

export default function BoatsClient({ locale = 'nl' }: { locale?: string; dict?: any }) {
  const T = I18N[locale] || I18N.en;
  const base = `/${locale}`;

  const cards = [
    { href: `${base}/boat-party`, icon: <Anchor size={24} />, tag: T.partiesTag, title: T.partiesTitle, text: T.partiesText, cta: T.discover },
    { href: `${base}/boat-trip`, icon: <Navigation size={24} />, tag: T.tripsTag, title: T.tripsTitle, text: T.tripsText, cta: T.view },
    { href: `${base}/private-boat-charters`, icon: <Users size={24} />, tag: T.charterTag, title: T.charterTitle, text: T.charterText, cta: T.request },
    { href: `${base}/shuttle-ferry`, icon: <Waves size={24} />, tag: T.shuttleTag, title: T.shuttleTitle, text: T.shuttleText, cta: T.tickets },
    { href: `${base}/ferry-formentera`, icon: <Ship size={24} />, tag: T.ferryTag, title: T.ferryTitle, text: T.ferryText, cta: T.view },
  ];

  return (
    <>
      <section className="boat-hero">
        <div className="waveline">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
            <path d="M0 30 Q 360 60 720 30 T 1440 30 V 60 H 0 Z" fill="rgba(255,255,255,0.1)"></path>
            <path d="M0 40 Q 360 10 720 40 T 1440 40 V 60 H 0 Z" fill="rgba(255,255,255,0.2)"></path>
          </svg>
        </div>
        <div className="inner">
          <div className="eyebrow"><div className="dot"></div> {T.eyebrow}</div>
          <h1>{T.h1}</h1>
          <p className="lead">{T.lead}</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="hubgrid">
            {cards.map((c) => (
              <Link key={c.href} href={c.href} className="hubcard in">
                <div className="media">
                  <div className="bigicon">{c.icon}</div>
                  <div className="mtag">{c.tag}</div>
                </div>
                <div className="body">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <span className="go">{c.cta} <ArrowRight size={17} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="wa-band">
            <svg className="wave-deco" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0 50 Q 25 25 50 50 T 100 50 V 100 H 0 Z" />
            </svg>
            <div>
              <div className="kicker" style={{color:'var(--green)'}}>{T.waKicker}</div>
              <h2>{T.waTitle}</h2>
              <p>{T.waText}</p>
            </div>
            <a className="wa-big" href="https://wa.me/33666528412" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> {T.waBtn}
            </a>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap intro-seo">
          <h2>{T.seoTitle}</h2>
          <p>{T.seoP1}</p>
          <p>{T.seoP2}</p>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">{T.faqKicker}</div>
              <h2>{T.faqTitle}</h2>
            </div>
          </div>
          <div className="faq">
            {T.faqs.map((f, i) => (
              <details key={i} open={i === 0}>
                <summary>{f.q}<PlusIcon /></summary>
                <div className="ans">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
