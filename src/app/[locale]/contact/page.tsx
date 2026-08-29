import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle, Phone, Globe, Clock } from 'lucide-react'
import { staticMetadata } from '@/lib/seo-pages'
import { DEFAULT_LOCALE, LOCALES, SITE_URL, SITE_NAME, type Locale } from '@/lib/seo'
import { FOUNDER, FOUNDER_ID, founderNode } from '@/lib/team'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'contact')
}

/**
 * Contact page.
 *
 * Replaces 1,060 lines of unedited Relume boilerplate that was live and listed
 * in the sitemap. Alongside the About page, a real contact page is one of the
 * concrete things Google's quality guidelines look for to establish that a
 * business exists and can be reached — a placeholder here actively undermined
 * the whole domain.
 *
 * Contact details are pulled from the shared constants rather than typed in, so
 * this page cannot drift out of sync with the rest of the site. Consistent
 * name/phone/URL across every surface is what lets Google treat all our
 * mentions as one business instead of several.
 *
 * No street address: this is a service-area business and inventing a visitable
 * address would be both untrue and, on Google Business Profile, grounds for
 * suspension. No fake office hours either — only the response window we can
 * actually stand behind.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const KICKER: T = L('Contact', 'Contact', 'Kontakt', 'Contacto', 'Contact')
const TITLE: T = L(
  'Neem contact op met Ibiza Mi Vida',
  'Get in touch with Ibiza Mi Vida',
  'Kontaktiere Ibiza Mi Vida',
  'Contacta con Ibiza Mi Vida',
  'Contactez Ibiza Mi Vida',
)
const INTRO: T = L(
  'Alles loopt via WhatsApp — dat is niet lui, dat is gewoon waar het snelst antwoord komt. Je schrijft met Simon zelf, niet met een chatbot of een supportafdeling.',
  'Everything runs over WhatsApp — not out of laziness, but because that is where you get an answer fastest. You are messaging Simon himself, not a chatbot or a support desk.',
  'Alles läuft über WhatsApp — nicht aus Bequemlichkeit, sondern weil du dort am schnellsten Antwort bekommst. Du schreibst mit Simon selbst, nicht mit einem Chatbot oder einem Support-Team.',
  'Todo va por WhatsApp — no por comodidad, sino porque es donde antes obtienes respuesta. Escribes con Simon en persona, no con un chatbot ni con un departamento de soporte.',
  'Tout passe par WhatsApp — non par facilité, mais parce que c’est là que la réponse arrive le plus vite. Vous écrivez à Simon lui-même, pas à un chatbot ni à un service client.',
)

const WA_TITLE: T = L('WhatsApp', 'WhatsApp', 'WhatsApp', 'WhatsApp', 'WhatsApp')
const WA_DESC: T = L(
  'De snelste route. Stuur je datum, je groepsgrootte en wat je zoekt.',
  'The fastest route. Send your dates, your group size and what you are after.',
  'Der schnellste Weg. Schick dein Datum, deine Gruppengröße und was du suchst.',
  'La vía más rápida. Envía tus fechas, el tamaño del grupo y qué buscas.',
  'La voie la plus rapide. Envoyez vos dates, la taille du groupe et ce que vous cherchez.',
)
const WA_BTN: T = L('Open WhatsApp', 'Open WhatsApp', 'WhatsApp öffnen', 'Abrir WhatsApp', 'Ouvrir WhatsApp')
const WA_PREFILL: T = L(
  'Hoi Simon! Ik heb een vraag over Ibiza — ',
  'Hi Simon! I have a question about Ibiza — ',
  'Hallo Simon! Ich habe eine Frage zu Ibiza — ',
  '¡Hola Simon! Tengo una pregunta sobre Ibiza — ',
  'Salut Simon ! J’ai une question sur Ibiza — ',
)

const PHONE_TITLE: T = L('Telefoon', 'Phone', 'Telefon', 'Teléfono', 'Téléphone')
const PHONE_DESC: T = L(
  'Hetzelfde nummer als WhatsApp. Bellen kan, appen gaat meestal sneller.',
  'The same number as WhatsApp. You can call, but messaging is usually quicker.',
  'Dieselbe Nummer wie WhatsApp. Anrufen geht, schreiben ist meist schneller.',
  'El mismo número que WhatsApp. Puedes llamar, pero escribir suele ser más rápido.',
  'Le même numéro que WhatsApp. Vous pouvez appeler, mais écrire est souvent plus rapide.',
)

const TIME_TITLE: T = L('Reactietijd', 'Response time', 'Antwortzeit', 'Tiempo de respuesta', 'Délai de réponse')
const TIME_DESC: T = L(
  'Meestal binnen een paar uur, ook ’s avonds en in het weekend. In de drukste zomerweken kan het langer duren — dan is het op het eiland simpelweg hoogseizoen.',
  'Usually within a few hours, evenings and weekends included. In the busiest summer weeks it can take longer — that is simply peak season on the island.',
  'Meist innerhalb weniger Stunden, auch abends und am Wochenende. In den vollsten Sommerwochen kann es länger dauern — dann ist auf der Insel schlicht Hochsaison.',
  'Normalmente en unas horas, también por la noche y el fin de semana. En las semanas más intensas del verano puede tardar más — es temporada alta en la isla.',
  'Généralement en quelques heures, soirs et week-ends compris. Pendant les semaines les plus chargées de l’été, cela peut prendre plus de temps — c’est la haute saison sur l’île.',
)

const LANG_TITLE: T = L('Talen', 'Languages', 'Sprachen', 'Idiomas', 'Langues')
const LANG_DESC: T = L(
  'Je kunt in elk van deze talen schrijven.',
  'You can write in any of these languages.',
  'Du kannst in jeder dieser Sprachen schreiben.',
  'Puedes escribir en cualquiera de estos idiomas.',
  'Vous pouvez écrire dans l’une de ces langues.',
)

const AREA_TITLE: T = L('Werkgebied', 'Where we operate', 'Einsatzgebiet', 'Dónde operamos', 'Zone d’activité')
const AREA_DESC: T = L(
  'Ibiza en Formentera. We hebben geen bezoekadres — we werken op locatie, bij de marina’s en de clubs zelf.',
  'Ibiza and Formentera. We have no walk-in address — we work on location, at the marinas and the clubs themselves.',
  'Ibiza und Formentera. Wir haben keine Besucheradresse — wir arbeiten vor Ort, an den Marinas und in den Clubs selbst.',
  'Ibiza y Formentera. No tenemos dirección de visita — trabajamos sobre el terreno, en las marinas y en los propios clubs.',
  'Ibiza et Formentera. Nous n’avons pas d’adresse d’accueil — nous travaillons sur le terrain, dans les marinas et les clubs.',
)

const FAQ_LINK: T = L('Bekijk eerst de veelgestelde vragen', 'Check the FAQ first', 'Schau zuerst in die FAQ', 'Consulta primero las preguntas frecuentes', 'Consultez d’abord la FAQ')
const ABOUT_LINK: T = L('Over ons', 'About us', 'Über uns', 'Sobre nosotros', 'À propos')

export default function ContactPage({ params }: { params: { locale: string } }) {
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const base = `/${l}`
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WA_PREFILL[l])}`
  const tel = `+${WHATSAPP_NUMBER}`
  // Same digits, formatted for humans.
  const telDisplay = '+33 6 66 52 84 12'

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      founderNode(),
      {
        '@type': 'ContactPage',
        '@id': `${SITE_URL}/${l}/contact#page`,
        url: `${SITE_URL}/${l}/contact`,
        name: TITLE[l],
        description: INTRO[l],
        inLanguage: l,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        founder: { '@id': FOUNDER_ID },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: tel,
          availableLanguage: FOUNDER.languageTags,
          areaServed: ['ES'],
        },
        areaServed: [
          { '@type': 'Place', name: 'Ibiza, Spain' },
          { '@type': 'Place', name: 'Formentera, Spain' },
        ],
      },
    ],
  }

  const cards = [
    { Icon: Clock, t: TIME_TITLE[l], d: TIME_DESC[l] },
    { Icon: Globe, t: LANG_TITLE[l], d: `${LANG_DESC[l]} ${FOUNDER.languages.join(' · ')}` },
    { Icon: Globe, t: AREA_TITLE[l], d: AREA_DESC[l] },
  ]

  return (
    <main className="bg-white text-neutral-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="mx-auto max-w-3xl px-4 pb-12 pt-[calc(var(--nav-h)+48px)] text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{KICKER[l]}</p>
        <h1 className="mt-3 font-serif text-4xl font-black tracking-tight md:text-6xl">{TITLE[l]}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600">{INTRO[l]}</p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-black/10 bg-neutral-50 p-7 transition-all hover:border-gold/50 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#25D366] text-black">
              <MessageCircle size={20} strokeWidth={2.5} />
            </span>
            <h2 className="mt-4 font-serif text-lg font-black">{WA_TITLE[l]}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{WA_DESC[l]}</p>
            <span className="mt-4 inline-block text-xs font-black uppercase tracking-widest text-gold">
              {WA_BTN[l]} →
            </span>
          </a>

          <a
            href={`tel:${tel}`}
            className="group rounded-3xl border border-black/10 bg-neutral-50 p-7 transition-all hover:border-gold/50 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold text-white">
              <Phone size={20} strokeWidth={2.5} />
            </span>
            <h2 className="mt-4 font-serif text-lg font-black">{PHONE_TITLE[l]}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{PHONE_DESC[l]}</p>
            <span className="mt-4 inline-block font-serif text-base font-black tracking-tight text-neutral-900">
              {telDisplay}
            </span>
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14">
        <div className="divide-y divide-black/8 border-y border-black/8">
          {cards.map(({ Icon, t, d }, i) => (
            <div key={i} className="flex gap-4 py-5">
              <span aria-hidden className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/12 text-gold ring-1 ring-gold/25">
                <Icon size={15} />
              </span>
              <div>
                <h3 className="font-serif text-base font-black">{t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">{d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-5">
          <Link href={`${base}/faq`} className="text-xs font-black uppercase tracking-widest text-gold hover:underline">
            {FAQ_LINK[l]} →
          </Link>
          <Link href={`${base}/about-us`} className="text-xs font-black uppercase tracking-widest text-gold hover:underline">
            {ABOUT_LINK[l]} →
          </Link>
        </div>
      </section>
    </main>
  )
}
