import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { HeroRatingBadge, type HeroRating } from '@/components/home/HeroRatingBadge'
import { DEFAULT_LOCALE, LOCALES as SEO_LOCALES, type Locale } from '@/lib/seo'

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

/**
 * Direct line to Simon.
 *
 * This block used to be a newsletter signup, but the form was never wired to
 * anything: submitting it only flipped local React state and showed "You're in!
 * Check your inbox." No address was stored or sent anywhere, so every visitor
 * who signed up was told they had subscribed to a list that did not exist.
 * Replaced with the channel bookings actually run on — WhatsApp.
 */

const KICKER: L = {
  nl: 'Direct contact',
  en: 'Direct contact',
  es: 'Contacto directo',
  de: 'Direkter Kontakt',
  fr: 'Contact direct',
}
const HEAD: L = {
  nl: 'Vraag het Simon',
  en: 'Just ask Simon',
  es: 'Pregúntale a Simon',
  de: 'Frag einfach Simon',
  fr: 'Demandez à Simon',
}
const SUB: L = {
  nl: 'Simon zit op Ibiza en regelt je tafels, package deals en boten via WhatsApp. Stuur een bericht met je datum en je groepsgrootte — je krijgt persoonlijk antwoord, geen automatische mail.',
  en: 'Simon is on the island and arranges your tables, package deals and boats over WhatsApp. Send him your dates and group size — you get a personal reply, not an autoresponder.',
  es: 'Simon está en Ibiza y organiza tus mesas, packs y barcos por WhatsApp. Escríbele con tus fechas y el tamaño de tu grupo — te responde en persona, no un correo automático.',
  de: 'Simon ist auf der Insel und organisiert deine Tische, Package Deals und Boote über WhatsApp. Schick ihm dein Datum und die Gruppengröße — du bekommst eine persönliche Antwort, keine Auto-Mail.',
  fr: 'Simon est sur l’île et organise vos tables, packages et bateaux via WhatsApp. Envoyez vos dates et la taille du groupe — vous aurez une réponse personnelle, pas un message automatique.',
}
const BUTTON: L = {
  nl: 'Whatsapp Simon',
  en: 'WhatsApp Simon',
  es: 'WhatsApp a Simon',
  de: 'Simon per WhatsApp',
  fr: 'WhatsApp à Simon',
}
const NOTE: L = {
  nl: 'Meestal binnen een paar uur antwoord, in het hoogseizoen soms later.',
  en: 'Usually answered within a few hours, sometimes later in peak season.',
  es: 'Normalmente responde en unas horas, a veces más tarde en temporada alta.',
  de: 'Antwort meist innerhalb weniger Stunden, in der Hochsaison manchmal später.',
  fr: 'Réponse généralement en quelques heures, parfois plus tard en haute saison.',
}
const PREFILL: L = {
  nl: 'Hoi Simon! Ik heb een vraag over Ibiza — ',
  en: 'Hi Simon! I have a question about Ibiza — ',
  es: '¡Hola Simon! Tengo una pregunta sobre Ibiza — ',
  de: 'Hallo Simon! Ich habe eine Frage zu Ibiza — ',
  fr: 'Salut Simon ! J’ai une question sur Ibiza — ',
}

export function HomeNewsletter({ locale = 'nl', rating = null }: { locale?: string; rating?: HeroRating | null }) {
  const l: Locale = (SEO_LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t(PREFILL, locale))}`

  return (
    <section className="relative overflow-hidden bg-obsidian py-16 text-white md:py-20">
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-soft">
          {t(KICKER, locale)}
        </span>
        <h2 className="mt-4 font-serif text-3xl font-black tracking-tight md:text-5xl">
          {t(HEAD, locale)}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
          {t(SUB, locale)}
        </p>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group mx-auto mt-9 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 font-serif text-sm font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03] active:scale-100"
        >
          <MessageCircle size={20} strokeWidth={2.5} />
          {t(BUTTON, locale)}
        </a>

        <p className="mx-auto mt-4 max-w-md text-xs text-white/55">
          {t(NOTE, locale)}
        </p>

        {/* Onder de WhatsApp-knop, want dit is het moment waarop iemand besluit
            of hij een vreemde gaat aanschrijven. Een beoordeling doet daar meer
            werk dan waar dan ook op de pagina.

            De donkere badge uit de hero en niet GoogleRatingLine: deze sectie
            staat op bg-obsidian, en de lichte variant zou hier zwarte tekst op
            een zwarte achtergrond zijn. */}
        {rating && (
          <div className="flex justify-center">
            <HeroRatingBadge {...rating} locale={l} />
          </div>
        )}
      </div>
    </section>
  )
}
