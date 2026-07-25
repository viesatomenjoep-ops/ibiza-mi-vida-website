'use client'

import React, { useState } from 'react'
import { Mail, Check } from 'lucide-react'

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

const KICKER: L = {
  nl: 'Blijf op de hoogte',
  en: 'Stay in the loop',
  es: 'Mantente al día',
  de: 'Bleib informiert',
  fr: 'Reste informé',
}
const HEAD: L = {
  nl: 'Mis geen enkel feest',
  en: 'Never miss a party',
  es: 'No te pierdas ninguna fiesta',
  de: 'Verpasse keine Party',
  fr: 'Ne rate aucune fête',
}
const SUB: L = {
  nl: 'Schrijf je in voor de nieuwsbrief en ontvang als eerste line-ups, ticketverkoop en exclusieve VIP-deals voor je Ibiza-trip.',
  en: 'Subscribe to our newsletter and be first to get line-ups, ticket drops and exclusive VIP deals for your Ibiza trip.',
  es: 'Suscríbete a nuestra newsletter y recibe primero line-ups, entradas y ofertas VIP exclusivas para tu viaje a Ibiza.',
  de: 'Abonniere unseren Newsletter und erhalte als Erste:r Line-ups, Ticketverkäufe und exklusive VIP-Deals für deinen Ibiza-Trip.',
  fr: 'Abonne-toi à notre newsletter et reçois en avant-première line-ups, billets et offres VIP exclusives pour ton séjour à Ibiza.',
}
const PLACEHOLDER: L = {
  nl: 'Je e-mailadres', en: 'Your email address', es: 'Tu correo electrónico', de: 'Deine E-Mail-Adresse', fr: 'Ton adresse e-mail',
}
const BUTTON: L = {
  nl: 'Inschrijven', en: 'Subscribe', es: 'Suscribirse', de: 'Abonnieren', fr: "S'abonner",
}
const DISCLAIMER: L = {
  nl: 'Door je in te schrijven ga je akkoord met ons privacybeleid. Uitschrijven kan altijd.',
  en: 'By subscribing you agree to our privacy policy. Unsubscribe anytime.',
  es: 'Al suscribirte aceptas nuestra política de privacidad. Cancela cuando quieras.',
  de: 'Mit der Anmeldung stimmst du unserer Datenschutzrichtlinie zu. Jederzeit abmeldbar.',
  fr: 'En t’abonnant, tu acceptes notre politique de confidentialité. Désabonnement à tout moment.',
}
const SUCCESS: L = {
  nl: 'Je bent ingeschreven! Check je inbox.',
  en: 'You’re in! Check your inbox.',
  es: '¡Listo! Revisa tu bandeja de entrada.',
  de: 'Du bist dabei! Schau in dein Postfach.',
  fr: 'C’est fait ! Regarde ta boîte mail.',
}

export function HomeNewsletter({ locale = 'nl' }: { locale?: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <section className="relative overflow-hidden bg-obsidian text-white py-16 md:py-20">
      {/* soft gold glow */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
          {t(KICKER, locale)}
        </span>
        <h2 className="mt-4 font-serif text-3xl md:text-5xl font-black tracking-tight">
          {t(HEAD, locale)}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/65">
          {t(SUB, locale)}
        </p>

        {submitted ? (
          <div className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 rounded-full border border-gold/40 bg-gold/10 px-6 py-4 text-gold">
            <Check size={20} />
            <span className="font-semibold">{t(SUCCESS, locale)}</span>
          </div>
        ) : (
          <form
            className="mx-auto mt-9 flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              if (email.trim()) setSubmitted(true)
            }}
          >
            <div className="relative flex-1">
              <Mail size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t(PLACEHOLDER, locale)}
                className="w-full rounded-full border border-white/15 bg-white/5 py-4 pl-12 pr-5 text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gold px-8 py-4 font-serif text-sm font-black uppercase tracking-widest text-obsidian transition-colors hover:bg-white"
            >
              {t(BUTTON, locale)}
            </button>
          </form>
        )}

        <p className="mx-auto mt-4 max-w-md text-xs text-white/40">
          {t(DISCLAIMER, locale)}
        </p>
      </div>
    </section>
  )
}
