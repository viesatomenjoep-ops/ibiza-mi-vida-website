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
    <section className="bg-white text-neutral-900 py-12 md:py-16 border-t border-black/5">
      <Reveal className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            {t(KICKER, locale)}
          </span>
          <h2 className="mt-3 font-serif text-[1.625rem] md:text-4xl font-black tracking-tight text-neutral-900">
            {t(HEAD, locale)}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {USPS.map((u, i) => {
            const Icon = u.icon
            return (
              <Reveal
                key={i}
                delay={i * 90}
                className="group rounded-[22px] border border-black/8 bg-white p-6 transition-all hover:border-gold/50 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/12 text-gold ring-1 ring-gold/25 transition-colors group-hover:bg-gold group-hover:text-white">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <h3 className="font-serif text-lg font-black leading-tight text-neutral-900">
                  {t(u.title, locale)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
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
