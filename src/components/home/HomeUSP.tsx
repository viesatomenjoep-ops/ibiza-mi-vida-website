import React from 'react'
import { ShieldCheck, BadgePercent, Headset, MapPin } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

const HEAD: L = {
  nl: 'Waarom Ibiza Mi Vida',
  en: 'Why Ibiza Mi Vida',
  es: 'Por qué Ibiza Mi Vida',
  de: 'Warum Ibiza Mi Vida',
  fr: 'Pourquoi Ibiza Mi Vida',
}
const KICKER: L = {
  nl: 'Jouw eiland, geregeld',
  en: 'Your island, handled',
  es: 'Tu isla, resuelta',
  de: 'Deine Insel, geregelt',
  fr: 'Ton île, organisée',
}

const USPS: { icon: any; title: L; text: L }[] = [
  {
    icon: MapPin,
    title: { nl: 'Lokale experts', en: 'Local experts', es: 'Expertos locales', de: 'Lokale Experten', fr: 'Experts locaux' },
    text: {
      nl: 'Een team dat op het eiland woont en elke club, strand en boot van binnen kent.',
      en: 'A team that lives on the island and knows every club, beach and boat inside out.',
      es: 'Un equipo que vive en la isla y conoce cada club, playa y barco al detalle.',
      de: 'Ein Team, das auf der Insel lebt und jeden Club, Strand und jedes Boot kennt.',
      fr: 'Une équipe qui vit sur l’île et connaît chaque club, plage et bateau.',
    },
  },
  {
    icon: BadgePercent,
    title: { nl: 'Beste prijs, geen verrassingen', en: 'Best price, no surprises', es: 'Mejor precio, sin sorpresas', de: 'Bester Preis, keine Überraschungen', fr: 'Meilleur prix, sans surprises' },
    text: {
      nl: 'Officiële tickets en charters tegen scherpe tarieven — nooit verborgen kosten.',
      en: 'Official tickets and charters at sharp rates — never hidden fees.',
      es: 'Entradas y chárteres oficiales a tarifas ajustadas, sin costes ocultos.',
      de: 'Offizielle Tickets und Charter zu fairen Preisen — keine versteckten Kosten.',
      fr: 'Billets et charters officiels à tarifs serrés — jamais de frais cachés.',
    },
  },
  {
    icon: Headset,
    title: { nl: '24/7 concierge', en: '24/7 concierge', es: 'Conserjería 24/7', de: '24/7 Concierge', fr: 'Conciergerie 24/7' },
    text: {
      nl: 'Van je eerste vraag tot de laatste afterparty — via WhatsApp altijd bereikbaar.',
      en: 'From your first question to the last afterparty — always reachable via WhatsApp.',
      es: 'Desde tu primera duda hasta el último afterparty — siempre por WhatsApp.',
      de: 'Von der ersten Frage bis zur letzten Afterparty — jederzeit per WhatsApp.',
      fr: 'De ta première question au dernier afterparty — toujours joignable sur WhatsApp.',
    },
  },
  {
    icon: ShieldCheck,
    title: { nl: 'Veilig & vertrouwd', en: 'Safe & trusted', es: 'Seguro y de confianza', de: 'Sicher & vertrauenswürdig', fr: 'Sûr et fiable' },
    text: {
      nl: 'Beveiligd betalen en directe bevestiging. Duizenden gasten gingen je voor.',
      en: 'Secure payment and instant confirmation. Thousands of guests came before you.',
      es: 'Pago seguro y confirmación instantánea. Miles de clientes ya confiaron.',
      de: 'Sichere Zahlung und sofortige Bestätigung. Tausende Gäste waren schon dabei.',
      fr: 'Paiement sécurisé et confirmation instantanée. Des milliers de clients avant toi.',
    },
  },
]

export function HomeUSP({ locale = 'nl' }: { locale?: string }) {
  return (
    /* Wit. Geen overvloei nodig: hierboven eindigt het donkere clubvel met
       een afgeronde onderrand, en die ronding ís de overgang. */
    <section className="text-neutral-900 py-12 md:py-16" style={{ background: 'var(--surface-white)' }}>
      <Reveal className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.28em] text-neutral-900">
            {t(KICKER, locale)}
          </span>
          <h2 className="mt-3 font-serif text-[1.625rem] md:text-4xl font-black tracking-tight text-neutral-900">
            {t(HEAD, locale)}
          </h2>
        </div>

        {/* Lichte luxe tegels met verfijnde schaduwen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {USPS.map((u, i) => {
            const Icon = u.icon
            // Wit op wit, dus de kaart komt van zijn ondergrond af met een
            // rand en een schaduw en niet met een eigen tint. Hier stond
            // #FAF8F5: op een witte sectie is dat geen kaart maar een vlek.
            return (
              <Reveal
                key={i}
                delay={i * 90}
                className="group relative overflow-hidden rounded-[22px] border border-[var(--line-soft)] bg-white p-6 shadow-[0_4px_20px_-6px_rgba(26,23,20,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--line-soft-strong)] hover:shadow-[0_18px_38px_-12px_rgba(26,23,20,0.16)]"
              >
                {/* Zachte gloed rechtsboven, subtiel op hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-black/0 blur-2xl transition-colors duration-500 group-hover:bg-black/5"
                />
                <div className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-[#141414] ring-1 ring-black/15 transition-all duration-300 group-hover:bg-[#141414] group-hover:text-white group-hover:ring-[#141414]">
                  <Icon size={22} strokeWidth={2} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="relative font-serif text-lg font-black leading-tight text-neutral-900">
                  {t(u.title, locale)}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-neutral-600">
                  {t(u.text, locale)}
                </p>
              </Reveal>
            )
          })}
        </div>
      </Reveal>
    </section>
  )
}
