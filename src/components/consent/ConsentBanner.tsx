'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getConsent, setConsent, CONSENT_EVENT } from '@/lib/consent'

type L = Record<string, string>
const t = (m: L, l: string) => m[l] || m.en

const BODY: L = {
  nl: 'We gebruiken cookies van derden voor statistieken, om te zien welke boekingen via ons lopen, en voor de TikTok-feed. Zonder toestemming laden die niet. De site werkt gewoon als je weigert.',
  en: 'We use third-party cookies for statistics, to see which bookings come through us, and for the TikTok feed. Without consent they do not load. The site works fine if you decline.',
  de: 'Wir nutzen Cookies Dritter für Statistiken, um zu sehen welche Buchungen über uns laufen, und für den TikTok-Feed. Ohne Zustimmung werden sie nicht geladen. Die Seite funktioniert auch, wenn du ablehnst.',
  es: 'Usamos cookies de terceros para estadísticas, para ver qué reservas pasan por nosotros y para el feed de TikTok. Sin consentimiento no se cargan. La web funciona igual si lo rechazas.',
  fr: 'Nous utilisons des cookies tiers pour les statistiques, pour voir quelles réservations passent par nous, et pour le fil TikTok. Sans consentement ils ne se chargent pas. Le site fonctionne si vous refusez.',
}
const ACCEPT: L = {
  nl: 'Accepteren', en: 'Accept', de: 'Akzeptieren', es: 'Aceptar', fr: 'Accepter',
}
const DECLINE: L = {
  nl: 'Weigeren', en: 'Decline', de: 'Ablehnen', es: 'Rechazar', fr: 'Refuser',
}
const MORE: L = {
  nl: 'Privacybeleid', en: 'Privacy policy', de: 'Datenschutz',
  es: 'Política de privacidad', fr: 'Politique de confidentialité',
}
const LABEL: L = {
  nl: 'Cookietoestemming', en: 'Cookie consent', de: 'Cookie-Einwilligung',
  es: 'Consentimiento de cookies', fr: 'Consentement aux cookies',
}

/**
 * Toestemmingsbalk onderaan het scherm.
 *
 * ── Waarom een balk en geen modaal venster ────────────────────────────────
 * Een venster dat het hele scherm afdekt en dat je moet wegklikken voordat je
 * iets ziet, is precies wat Google een "intrusive interstitial" noemt, en daar
 * wordt sinds de core-updates van eind 2025 strenger op afgerekend. Een balk
 * onderin dekt niets af: crawler en bezoeker zien dezelfde pagina.
 *
 * ── Waarom hij niets verschuift ───────────────────────────────────────────
 * `position: fixed`, dus hij duwt geen inhoud naar beneden. Een banner die dat
 * wel doet is de meest voorkomende manier waarop sites hun CLS over de drempel
 * van 0,10 tillen — en dan kost je toestemmingsbalk je Core Web Vitals.
 *
 * Hij verschijnt ook pas na de eerste render (`useEffect`), dus hij zit LCP
 * niet in de weg. De keerzijde is een korte flits waarin hij er nog niet is;
 * dat is de juiste ruil, want zichtbaar zijn vóór de tekst zou betekenen dat
 * hij de tekst vertraagt.
 *
 * ── Juridisch ─────────────────────────────────────────────────────────────
 * Twee knoppen naast elkaar, gelijk van formaat en even zichtbaar: weigeren
 * moet net zo makkelijk zijn als accepteren. Geen vooraf aangevinkte keuzes,
 * geen "X" die stilzwijgend als toestemming telt — wegklikken zonder te kiezen
 * kan niet, want er is geen sluitknop. Wie niets kiest krijgt geen trackers.
 */
export function ConsentBanner({ locale = 'nl' }: { locale?: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(getConsent() === 'unset')
    const onChange = () => setShow(getConsent() === 'unset')
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  if (!show) return null

  return (
    <div
      role="region"
      aria-label={t(LABEL, locale)}
      className="fixed inset-x-0 bottom-0 z-[9998] border-t border-black/10 bg-white/95 px-4 py-4 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <p className="flex-1 text-[13px] leading-relaxed text-neutral-700">
          {t(BODY, locale)}{' '}
          <Link
            href={`/${locale}/privacy-policy`}
            className="whitespace-nowrap text-neutral-900 underline decoration-black/30 underline-offset-2 hover:decoration-ibiza-green"
          >
            {t(MORE, locale)}
          </Link>
        </p>
        {/* Gelijk formaat, gelijke prominentie — dat is de eis, niet een
            vormkeuze. Accepteren mag niet aantrekkelijker ogen dan weigeren. */}
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent('denied')}
            className="min-w-[110px] rounded-full border border-black/20 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-widest text-neutral-900 transition-colors hover:border-black/50"
          >
            {t(DECLINE, locale)}
          </button>
          <button
            type="button"
            onClick={() => setConsent('granted')}
            className="min-w-[110px] rounded-full border border-ibiza-green bg-ibiza-green px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:brightness-95"
          >
            {t(ACCEPT, locale)}
          </button>
        </div>
      </div>
    </div>
  )
}
