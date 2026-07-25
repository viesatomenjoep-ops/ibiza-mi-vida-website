import React from 'react'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

const KICKER: L = {
  nl: 'Wat gasten zeggen',
  en: 'What guests say',
  es: 'Lo que dicen los clientes',
  de: 'Was Gäste sagen',
  fr: 'Ce que disent les clients',
}
const HEAD: L = {
  nl: 'Beoordeeld met 4.9 / 5',
  en: 'Rated 4.9 / 5',
  es: 'Valorado 4.9 / 5',
  de: 'Bewertet mit 4.9 / 5',
  fr: 'Noté 4.9 / 5',
}
const SUB: L = {
  nl: 'Op basis van 980+ reviews van gasten wereldwijd',
  en: 'Based on 980+ reviews from guests worldwide',
  es: 'Basado en más de 980 reseñas de clientes de todo el mundo',
  de: 'Basierend auf 980+ Bewertungen von Gästen weltweit',
  fr: 'Sur la base de plus de 980 avis de clients du monde entier',
}

// NOTE: placeholder reviews — swap for real Google/Trustpilot data later.
const REVIEWS: { name: string; country: L; rating: number; avatar: string; text: L }[] = [
  {
    name: 'Lucy Bennett',
    country: { nl: '🇬🇧 Londen', en: '🇬🇧 London', es: '🇬🇧 Londres', de: '🇬🇧 London', fr: '🇬🇧 Londres' },
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80',
    text: {
      nl: 'Onze privé-boottocht was vlekkeloos geregeld. De kapitein was geweldig en de VIP-tafel daarna was het hoogtepunt van de reis.',
      en: 'Our private boat trip was arranged flawlessly. The captain was amazing and the VIP table afterwards was the highlight of the trip.',
      es: 'Nuestro paseo en barco privado se organizó a la perfección. El capitán fue increíble y la mesa VIP después fue lo mejor del viaje.',
      de: 'Unsere private Bootstour war makellos organisiert. Der Kapitän war fantastisch und der VIP-Tisch danach das Highlight der Reise.',
      fr: 'Notre sortie en bateau privé était parfaitement organisée. Le capitaine était formidable et la table VIP ensuite fut le point fort du voyage.',
    },
  },
  {
    name: 'Sophia Carter',
    country: { nl: '🇩🇪 München', en: '🇩🇪 Munich', es: '🇩🇪 Múnich', de: '🇩🇪 München', fr: '🇩🇪 Munich' },
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&q=80',
    text: {
      nl: 'Alles geregeld via WhatsApp binnen een paar minuten. Tickets, transfer en tafel — echt zorgeloos. Volgend jaar weer!',
      en: 'Everything sorted via WhatsApp within minutes. Tickets, transfer and table — truly stress-free. Coming back next year!',
      es: 'Todo resuelto por WhatsApp en minutos. Entradas, traslado y mesa — sin estrés. ¡Volveré el año que viene!',
      de: 'Alles in Minuten per WhatsApp geregelt. Tickets, Transfer und Tisch — völlig stressfrei. Nächstes Jahr wieder!',
      fr: 'Tout réglé sur WhatsApp en quelques minutes. Billets, transfert et table — sans stress. On revient l’an prochain !',
    },
  },
  {
    name: 'David Harper',
    country: { nl: '🇳🇱 Amsterdam', en: '🇳🇱 Amsterdam', es: '🇳🇱 Ámsterdam', de: '🇳🇱 Amsterdam', fr: '🇳🇱 Amsterdam' },
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80',
    text: {
      nl: 'Met een groep van tien was dit goud waard. Snelle antwoorden, beste prijzen en insider-tips die we nergens anders kregen.',
      en: 'With a group of ten this was worth its weight in gold. Fast replies, best prices and insider tips we got nowhere else.',
      es: 'Con un grupo de diez, valió su peso en oro. Respuestas rápidas, mejores precios y consejos de expertos únicos.',
      de: 'Mit einer Gruppe von zehn war das Gold wert. Schnelle Antworten, beste Preise und Insidertipps wie sonst nirgends.',
      fr: 'Pour un groupe de dix, ça valait de l’or. Réponses rapides, meilleurs prix et conseils d’initiés introuvables ailleurs.',
    },
  },
]

export function HomeTestimonials({ locale = 'nl' }: { locale?: string }) {
  return (
    <section className="bg-neutral-50 text-neutral-900 py-12 md:py-16 border-t border-black/5">
      <Reveal className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            {t(KICKER, locale)}
          </span>
          <h2 className="mt-3 font-serif text-[1.625rem] md:text-4xl font-black tracking-tight text-neutral-900">
            {t(HEAD, locale)}
          </h2>
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={20} className="fill-gold text-gold" />
            ))}
          </div>
          <p className="mt-2 text-sm text-neutral-500">{t(SUB, locale)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {REVIEWS.map((rev, i) => (
            <Reveal
              key={i}
              delay={i * 100}
              className="relative flex h-full flex-col rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(0,0,0,0.4)]"
            >
              <Quote size={30} className="mb-4 text-gold/35" />
              <p className="flex-1 text-[15px] leading-relaxed text-neutral-700">
                “{t(rev.text, locale)}”
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-black/5 pt-4">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/25">
                  <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold text-neutral-900">{rev.name}</div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="flex gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, s) => (
                        <Star key={s} size={11} className="fill-gold text-gold" />
                      ))}
                    </span>
                    <span>{t(rev.country, locale)}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
