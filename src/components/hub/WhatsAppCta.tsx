import { WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * De concierge-CTA voor pagina's zonder boekknop.
 *
 * Drie clubs — Pacha, Amnesia en DC-10 — staan niet in de ClubTickets-feed
 * (zie docs/seo/AUDIT.md, A6). Die pagina's mogen dus geen ticketknop dragen:
 * een knop die belooft te verkopen wat we niet verkopen is precies de
 * teleurstelling waar een bezoeker niet mee terugkomt, en een `sponsored`-link
 * naar een partner die de club niet voert helpt niemand.
 *
 * Wat er wél is, is Simon. Deze CTA is daarom een `<a href>` naar WhatsApp —
 * geen `<button>` met window.open, want een crawler zonder JavaScript moet de
 * route zien en een agent moet hem kunnen volgen. Zelfde reden als bij de
 * afrekenknoppen op de ticketroute.
 *
 * Eigen lichte achtergrond, want `body` is donker en een blok zonder eigen
 * ondergrond erft dat.
 */

const HEADING: Record<Locale, string> = {
  nl: 'Vraag het Simon',
  en: 'Ask Simon',
  de: 'Frag Simon',
  es: 'Pregúntale a Simon',
  fr: 'Demandez à Simon',
}

const BUTTON: Record<Locale, string> = {
  nl: 'Stuur een WhatsApp',
  en: 'Message on WhatsApp',
  de: 'WhatsApp schreiben',
  es: 'Escribir por WhatsApp',
  fr: 'Écrire sur WhatsApp',
}

export function WhatsAppCta({
  locale,
  body,
  prefill,
  heading,
}: {
  locale: string
  /** Eén of twee zinnen: wat deze pagina concreet voor je kan regelen. */
  body: string
  /** Voorgevulde openingszin, zodat Simon meteen weet waar het over gaat. */
  prefill: string
  heading?: string
}) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(prefill)}`

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{heading ?? HEADING[l]}</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-neutral-700">{body}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center rounded-full bg-neutral-900 px-6 py-3 text-[15px] font-semibold text-white hover:bg-neutral-700"
        >
          {BUTTON[l]}
        </a>
      </div>
    </section>
  )
}
