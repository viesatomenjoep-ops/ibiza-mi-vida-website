import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { staticMetadata } from '@/lib/seo-pages'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { Reveal } from '@/components/ui/Reveal'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'guestlist')
}

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const KICKER: T = L('VIP Gastenlijst', 'VIP Guestlist', 'VIP-Gästeliste', 'Lista VIP', 'Guestlist VIP')
const TITLE: T = L('Kom op de gastenlijst', 'Get on the guestlist', 'Komm auf die Gästeliste', 'Entra en la lista', 'Rejoins la guestlist')
const INTRO: T = L(
  'Gratis of met korting naar binnen bij de beste clubs van Ibiza — zonder rij, zonder gedoe. Wij zetten je naam op de lijst; jij hoeft alleen maar te komen.',
  'Free or discounted entry to Ibiza’s best clubs — no queue, no hassle. We put your name on the list; all you have to do is show up.',
  'Gratis oder vergünstigt in die besten Clubs Ibizas — ohne Schlange, ohne Stress. Wir setzen deinen Namen auf die Liste; du musst nur kommen.',
  'Entrada gratis o con descuento en los mejores clubs de Ibiza — sin cola, sin complicaciones. Ponemos tu nombre en la lista; tú solo tienes que venir.',
  'Entrée gratuite ou à prix réduit dans les meilleurs clubs d’Ibiza — sans file, sans stress. Nous mettons votre nom sur la liste ; vous n’avez qu’à venir.',
)

const WHY_TITLE: T = L('Waarom via Ibiza Mi Vida?', 'Why through Ibiza Mi Vida?', 'Warum über Ibiza Mi Vida?', '¿Por qué con Ibiza Mi Vida?', 'Pourquoi via Ibiza Mi Vida ?')
const WHY: { title: T; text: T }[] = [
  {
    title: L('Gratis of met korting', 'Free or discounted', 'Gratis oder günstiger', 'Gratis o con descuento', 'Gratuit ou réduit'),
    text: L(
      'Afhankelijk van de club en de avond kom je gratis binnen of betaal je flink minder dan de deurprijs.',
      'Depending on the club and the night, you get in free or pay well below the door price.',
      'Je nach Club und Abend kommst du gratis rein oder zahlst deutlich weniger als an der Tür.',
      'Según el club y la noche, entras gratis o pagas bastante menos que en la puerta.',
      'Selon le club et la soirée, vous entrez gratuitement ou payez bien moins qu’à la porte.',
    ),
  },
  {
    title: L('Sla de rij over', 'Skip the queue', 'Überspringe die Schlange', 'Sáltate la cola', 'Évitez la file'),
    text: L(
      'Gastenlijst betekent meestal een eigen ingang of snellere entree — meer dansen, minder wachten.',
      'Guestlist usually means a dedicated entrance or faster entry — more dancing, less waiting.',
      'Gästeliste heißt meist eigener Eingang oder schnellerer Einlass — mehr Tanzen, weniger Warten.',
      'La lista suele significar entrada propia o acceso más rápido — más baile, menos espera.',
      'La guestlist signifie souvent une entrée dédiée ou un accès plus rapide — plus de danse, moins d’attente.',
    ),
  },
  {
    title: L('Lokaal geregeld', 'Arranged locally', 'Lokal organisiert', 'Gestionado en la isla', 'Organisé sur place'),
    text: L(
      'Ons team woont op Ibiza en kent de promotors persoonlijk. Jouw naam staat écht op de lijst.',
      'Our team lives on Ibiza and knows the promoters personally. Your name is really on the list.',
      'Unser Team lebt auf Ibiza und kennt die Promoter persönlich. Dein Name steht wirklich auf der Liste.',
      'Nuestro equipo vive en Ibiza y conoce a los promotores en persona. Tu nombre está de verdad en la lista.',
      'Notre équipe vit à Ibiza et connaît personnellement les promoteurs. Votre nom est vraiment sur la liste.',
    ),
  },
  {
    title: L('Binnen een uur antwoord', 'Reply within the hour', 'Antwort innerhalb einer Stunde', 'Respuesta en una hora', 'Réponse dans l’heure'),
    text: L(
      'Stuur een appje en je hoort vrijwel altijd binnen een uur of het gelukt is — ook ’s avonds.',
      'Send a message and you almost always hear back within the hour — evenings included.',
      'Schick eine Nachricht und du hörst fast immer innerhalb einer Stunde zurück — auch abends.',
      'Envía un mensaje y casi siempre tendrás respuesta en una hora — también por la noche.',
      'Envoyez un message et vous aurez presque toujours une réponse dans l’heure — même le soir.',
    ),
  },
]

const RULES_TITLE: T = L('De spelregels', 'The ground rules', 'Die Spielregeln', 'Las reglas del juego', 'Les règles du jeu')
const RULES: T[] = [
  L(
    'Meld je uiterlijk op de dag zelf vóór 20:00 aan — hoe eerder, hoe groter de kans.',
    'Sign up no later than 8 PM on the day itself — the earlier, the better your chances.',
    'Melde dich spätestens am selben Tag bis 20 Uhr an — je früher, desto besser die Chancen.',
    'Apúntate como muy tarde el mismo día antes de las 20:00 — cuanto antes, más posibilidades.',
    'Inscrivez-vous au plus tard le jour même avant 20 h — plus tôt, plus de chances.',
  ),
  L(
    'Minimumleeftijd 18 jaar; neem een geldig legitimatiebewijs mee, dit wordt aan de deur gecontroleerd.',
    'Minimum age 18; bring valid photo ID, it is checked at the door.',
    'Mindestalter 18 Jahre; bring einen gültigen Ausweis mit, er wird am Eingang kontrolliert.',
    'Edad mínima 18 años; lleva un documento de identidad válido, lo comprueban en la puerta.',
    'Âge minimum 18 ans ; apportez une pièce d’identité valide, elle est contrôlée à l’entrée.',
  ),
  L(
    'Wees op tijd: gastenlijst-entree geldt meestal tot een bepaald tijdstip (vaak 00:00–01:00).',
    'Be on time: guestlist entry usually applies until a set hour (often midnight–1 AM).',
    'Sei pünktlich: Der Gästelisten-Einlass gilt meist bis zu einer bestimmten Uhrzeit (oft 0–1 Uhr).',
    'Llega a tiempo: la entrada por lista suele valer hasta cierta hora (a menudo 00:00–01:00).',
    'Soyez à l’heure : l’entrée guestlist vaut généralement jusqu’à une heure donnée (souvent minuit–1 h).',
  ),
  L(
    'Nette-casual kleding: geen zwemkleding of voetbalshirts. De deur beslist altijd.',
    'Smart-casual dress: no swimwear or football shirts. The door always has the final say.',
    'Smart-Casual-Kleidung: keine Badekleidung oder Fußballtrikots. Die Tür entscheidet immer.',
    'Vestimenta smart-casual: nada de bañadores ni camisetas de fútbol. La puerta siempre decide.',
    'Tenue smart-casual : pas de maillot de bain ni de maillot de foot. La porte a toujours le dernier mot.',
  ),
  L(
    'Niet elke avond heeft een gastenlijst — grote headliner-nachten zijn vaak alleen met ticket. Vraag het ons gewoon.',
    'Not every night has a guestlist — big headliner nights are often ticket-only. Just ask us.',
    'Nicht jede Nacht hat eine Gästeliste — große Headliner-Nächte sind oft nur mit Ticket. Frag uns einfach.',
    'No todas las noches hay lista — las noches de grandes cabezas de cartel suelen ser solo con entrada. Pregúntanos.',
    'Toutes les soirées n’ont pas de guestlist — les grandes soirées à têtes d’affiche sont souvent sur billet uniquement. Demandez-nous.',
  ),
]

const CLUBS_TITLE: T = L('De clubs die we aanbieden', 'The clubs we cover', 'Die Clubs, die wir anbieten', 'Los clubs que ofrecemos', 'Les clubs que nous proposons')
const CLUBS_SUB: T = L(
  'Tik op een club voor het volledige programma en de tickets.',
  'Tap a club for the full programme and tickets.',
  'Tippe auf einen Club für das volle Programm und Tickets.',
  'Toca un club para ver todo el programa y las entradas.',
  'Touchez un club pour voir tout le programme et les billets.',
)

const EVENTS_TITLE: T = L('Aankomende events', 'Upcoming events', 'Kommende Events', 'Próximos eventos', 'Événements à venir')

const CTA_Q: T = L('Wil je op de gastenlijst?', 'Want to get on the guestlist?', 'Willst du auf die Gästeliste?', '¿Quieres entrar en la lista?', 'Vous voulez être sur la guestlist ?')
const CTA_SUB: T = L(
  'App Simon met de club, de datum en met hoeveel je komt — hij regelt de rest.',
  'Message Simon with the club, the date and your group size — he arranges the rest.',
  'Schreib Simon den Club, das Datum und eure Gruppengröße — er regelt den Rest.',
  'Escribe a Simon con el club, la fecha y cuántos sois — él se encarga del resto.',
  'Écrivez à Simon le club, la date et la taille de votre groupe — il s’occupe du reste.',
)
const CTA_BTN: T = L('WhatsApp Simon', 'WhatsApp Simon', 'WhatsApp Simon', 'WhatsApp Simon', 'WhatsApp Simon')
const WA_PREFILL: T = L(
  'Hoi Simon! Ik wil graag op de gastenlijst. Club: … Datum: … Aantal personen: …',
  'Hi Simon! I’d like to get on the guestlist. Club: … Date: … Group size: …',
  'Hi Simon! Ich möchte gern auf die Gästeliste. Club: … Datum: … Personen: …',
  '¡Hola Simon! Quiero entrar en la lista. Club: … Fecha: … Personas: …',
  'Salut Simon ! Je voudrais être sur la guestlist. Club : … Date : … Personnes : …',
)

const GL_FAQS: { q: T; a: T }[] = [
  {
    q: L('Is de gastenlijst echt gratis?', 'Is the guestlist really free?', 'Ist die Gästeliste wirklich gratis?', '¿La lista es realmente gratis?', 'La guestlist est-elle vraiment gratuite ?'),
    a: L(
      'Aanmelden via ons kost niets. Bij sommige clubs is de entree dan gratis, bij andere krijg je korting op de deurprijs — we vertellen je vooraf precies wat er geldt.',
      'Signing up through us costs nothing. At some clubs entry is then free, at others you get a discount on the door price — we tell you exactly what applies beforehand.',
      'Die Anmeldung über uns kostet nichts. In manchen Clubs ist der Eintritt dann gratis, in anderen gibt es Rabatt auf den Türpreis — wir sagen dir vorher genau, was gilt.',
      'Apuntarse con nosotros no cuesta nada. En algunos clubs la entrada es gratis, en otros hay descuento sobre el precio de puerta — te decimos antes exactamente qué aplica.',
      'S’inscrire via nous ne coûte rien. Dans certains clubs l’entrée est gratuite, dans d’autres vous avez une réduction — nous vous précisons à l’avance ce qui s’applique.',
    ),
  },
  {
    q: L('Hoe snel weet ik of het gelukt is?', 'How fast do I know if it worked?', 'Wie schnell weiß ich Bescheid?', '¿Cuándo sabré si está confirmado?', 'Quand saurai-je si c’est confirmé ?'),
    a: L(
      'Vrijwel altijd binnen een uur via WhatsApp, ook ’s avonds en in het weekend.',
      'Almost always within the hour via WhatsApp, evenings and weekends included.',
      'Fast immer innerhalb einer Stunde per WhatsApp, auch abends und am Wochenende.',
      'Casi siempre en menos de una hora por WhatsApp, también por la noche y el fin de semana.',
      'Presque toujours dans l’heure via WhatsApp, soirs et week-ends compris.',
    ),
  },
  {
    q: L('Kan ik met een grote groep komen?', 'Can I come with a big group?', 'Geht das auch mit einer großen Gruppe?', '¿Puedo venir con un grupo grande?', 'Puis-je venir en grand groupe ?'),
    a: L(
      'Ja — geef het aantal door in je bericht. Voor grote groepen of speciale avonden denken we ook mee over VIP-tafels.',
      'Yes — mention the group size in your message. For big groups or special nights we can also arrange VIP tables.',
      'Ja — nenn die Gruppengröße in deiner Nachricht. Für große Gruppen oder besondere Nächte organisieren wir auch VIP-Tische.',
      'Sí — indica cuántos sois en tu mensaje. Para grupos grandes o noches especiales también gestionamos mesas VIP.',
      'Oui — indiquez la taille du groupe dans votre message. Pour les grands groupes ou soirées spéciales, nous organisons aussi des tables VIP.',
    ),
  },
]

export default async function GuestlistPage({ params }: { params: { locale: string } }) {
  const locale = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const base = `/${locale}`
  const waHref = `https://wa.me/33666528412?text=${encodeURIComponent(WA_PREFILL[locale])}`

  const venues = await getVenues(locale)
  const clubs = venues.filter(v => v.type?.slug === 'clubbing')

  const todayStr = new Date().toISOString().split('T')[0]
  const clubSlugs = new Set(clubs.map(c => c.slug))
  const allDates = await getAllDates(locale)
  const upcoming = allDates
    .filter(d => d.venueSlug && clubSlugs.has(d.venueSlug) && d.date >= todayStr)
    .slice(0, 9)

  const faqs = GL_FAQS.map(f => ({ q: f.q[locale], a: f.a[locale] }))

  const waButton = (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 font-serif text-sm font-black uppercase tracking-widest text-black shadow-lg transition-all hover:brightness-95"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15L2.1 21.7l4.8-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.1.1.3 0 .4-.1.2-.1.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.3.1 1.6.8 1.9.9.3.2.5.2.5.4.1.1.1.7-.1 1.3z"/></svg>
      {CTA_BTN[locale]}
    </a>
  )

  return (
    <div className="bg-white text-neutral-900 min-h-screen">
      <FaqJsonLd faqs={faqs} />

      {/* ── Hero ── */}
      <section className="pt-[calc(var(--nav-h)+40px)] pb-12 px-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{KICKER[locale]}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl font-black tracking-tight text-neutral-900">{TITLE[locale]}</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500">{INTRO[locale]}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <span className="font-serif text-sm font-black uppercase tracking-widest text-neutral-900">{CTA_Q[locale]}</span>
          {waButton}
        </div>
      </section>

      {/* ── Why guestlist ── */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <h2 className="shrink-0 font-serif text-2xl md:text-3xl font-black tracking-tight">{WHY_TITLE[locale]}</h2>
            <span className="h-px flex-1 bg-black/10" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <div key={i} className="rounded-[22px] border border-black/8 bg-neutral-50 p-6 transition-all hover:border-gold/50 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]">
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-gold/12 font-serif text-sm font-black text-gold ring-1 ring-gold/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-lg font-black leading-tight">{w.title[locale]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{w.text[locale]}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── The rules ── */}
      <section className="bg-neutral-50 border-y border-black/5 py-14">
        <Reveal className="mx-auto max-w-3xl px-4">
          <h2 className="mb-6 text-center font-serif text-2xl md:text-3xl font-black tracking-tight">{RULES_TITLE[locale]}</h2>
          <ul className="flex flex-col gap-3">
            {RULES.map((r, i) => (
              <li key={i} className="flex items-start gap-3.5 rounded-2xl border border-black/8 bg-white p-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-[11px] font-black text-white">✓</span>
                <span className="text-[15px] leading-relaxed text-neutral-700">{r[locale]}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ── Club logos ── */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="mb-2 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-black tracking-tight">{CLUBS_TITLE[locale]}</h2>
            <p className="mt-2 text-sm text-neutral-500">{CLUBS_SUB[locale]}</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {clubs.map(club => (
              <Link
                key={club.slug}
                href={`${base}/club-tickets/${club.slug}`}
                className="group relative flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-neutral-900 p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                {club.cover || club.picture ? (
                  <Image
                    src={club.cover || club.picture}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover opacity-30 transition-opacity group-hover:opacity-45"
                  />
                ) : null}
                {club.whitelogo ? (
                  <Image
                    src={club.whitelogo}
                    alt={club.name}
                    width={160}
                    height={48}
                    className="relative max-h-12 w-auto max-w-[80%] object-contain"
                  />
                ) : (
                  <span className="relative text-center font-serif text-sm font-black uppercase tracking-wide text-white">{club.name}</span>
                )}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Upcoming events ── */}
      {upcoming.length > 0 && (
        <section className="bg-neutral-50 border-y border-black/5 py-14">
          <Reveal className="mx-auto max-w-6xl px-4">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="shrink-0 font-serif text-2xl md:text-3xl font-black tracking-tight">{EVENTS_TITLE[locale]}</h2>
              <span className="h-px flex-1 bg-black/10" />
              <Link href={`${base}/calendar`} className="shrink-0 text-xs font-black uppercase tracking-widest text-gold hover:underline">
                {({ nl: 'Volledige agenda', en: 'Full calendar', de: 'Ganzer Kalender', es: 'Agenda completa', fr: 'Agenda complet' } as Record<string, string>)[locale]} →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((d) => {
                const image = d.eventCover || d.eventLogo || d.venueCover
                return (
                  <Link
                    key={`${d.id}-${d.eventSlug}`}
                    href={`${base}/club-tickets/${d.venueSlug}/${d.eventSlug}`}
                    className="group flex items-center gap-4 rounded-[22px] border border-black/8 bg-white p-3.5 transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-neutral-200">
                      {image && <Image src={image} alt={d.eventName || d.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gold">
                        {new Date(d.date).toLocaleDateString(locale === 'nl' ? 'nl-NL' : locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}
                      </span>
                      <h3 className="truncate font-serif text-base font-black leading-tight text-neutral-900">{d.eventName || d.name}</h3>
                      <p className="truncate text-xs font-semibold text-neutral-500">{d.venueName}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </Reveal>
        </section>
      )}

      {/* ── Big closing CTA ── */}
      <section className="relative overflow-hidden bg-obsidian py-16 md:py-20 text-center text-white">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]" />
        <div className="relative mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight">{CTA_Q[locale]}</h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/65">{CTA_SUB[locale]}</p>
          <div className="mt-8">{waButton}</div>
        </div>
      </section>
    </div>
  )
}
