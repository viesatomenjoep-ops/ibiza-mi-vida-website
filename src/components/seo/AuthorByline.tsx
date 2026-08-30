import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { FOUNDER, founderNode } from '@/lib/team'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

const CHECKED: Record<Locale, string> = {
  nl: 'Samengesteld en gecontroleerd door',
  en: 'Written and checked by',
  de: 'Zusammengestellt und geprüft von',
  es: 'Redactado y revisado por',
  fr: 'Rédigé et vérifié par',
}
const ASK: Record<Locale, string> = {
  nl: 'Stel Simon een vraag',
  en: 'Ask Simon a question',
  de: 'Frag Simon',
  es: 'Pregúntale a Simon',
  fr: 'Posez une question à Simon',
}
const MORE: Record<Locale, string> = {
  nl: 'Over ons', en: 'About us', de: 'Über uns', es: 'Sobre nosotros', fr: 'À propos',
}
const PREFILL: Record<Locale, string> = {
  nl: 'Hoi Simon! Ik heb een vraag over ',
  en: 'Hi Simon! I have a question about ',
  de: 'Hallo Simon! Ich habe eine Frage zu ',
  es: '¡Hola Simon! Tengo una pregunta sobre ',
  fr: 'Salut Simon ! J’ai une question sur ',
}

/**
 * Visible author byline + `Person` structured data.
 *
 * This is the E-E-A-T workhorse. The commercial pages previously had no author
 * at all, so nothing connected the advice on them to a person who could be held
 * responsible for it — an anonymous brand voice, which Google's quality
 * guidelines rate poorly and which gives an answer engine no one to attribute.
 *
 * Rendering the byline *and* the Person node together keeps them consistent by
 * construction: the markup can never claim an author the page does not show.
 * The node uses a stable @id so every page references the same person rather
 * than declaring five unrelated Simons.
 */
export function AuthorByline({
  locale,
  /** Short topic, woven into the WhatsApp prefill (e.g. "private boat charters"). */
  topic,
}: {
  locale: string
  topic?: string
}) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILL[l] + (topic || 'Ibiza'))}`

  return (
    <aside className="border-t border-black/5 bg-neutral-50 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ '@context': 'https://schema.org', ...founderNode() }),
        }}
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 sm:flex-row sm:items-start">
        <span
          aria-hidden
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold font-serif text-lg font-black text-white"
        >
          S
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-black/60">
            {CHECKED[l]}
          </p>
          <p className="mt-1 font-serif text-lg font-black leading-tight text-neutral-900">
            {FOUNDER.name} <span className="font-sans text-sm font-semibold text-black/60">· {FOUNDER.role[l]}</span>
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{FOUNDER.bio[l]}</p>
          <p className="mt-2 text-xs text-black/60">{FOUNDER.languages.join(' · ')}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03]"
            >
              <MessageCircle size={16} strokeWidth={2.5} />
              {ASK[l]}
            </a>
            <Link
              href={`/${l}/about-us`}
              className="text-xs font-black uppercase tracking-widest text-gold hover:underline"
            >
              {MORE[l]} →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}

/** Bare `Person` node with no visible byline — for pages that render their own. */
export function FounderJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', ...founderNode() }),
      }}
    />
  )
}
