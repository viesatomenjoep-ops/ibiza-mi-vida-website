import type { Metadata } from 'next'
import Link from 'next/link'
import { staticMetadata } from '@/lib/seo-pages'
import { FAQ_GROUPS } from '@/lib/faq-content'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'faq')
}

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const KICKER: T = L('Veelgestelde vragen', 'Frequently asked questions', 'Häufige Fragen', 'Preguntas frecuentes', 'Questions fréquentes')
const TITLE: T = L('Alles over jouw Ibiza-trip', 'Everything about your Ibiza trip', 'Alles über deinen Ibiza-Trip', 'Todo sobre tu viaje a Ibiza', 'Tout sur votre séjour à Ibiza')
const INTRO: T = L(
  'Tickets kopen, boten huren, Formentera, betalen en meer — de antwoorden op de vragen die we het vaakst krijgen. Staat je vraag er niet tussen? App ons via WhatsApp.',
  'Buying tickets, renting boats, Formentera, payments and more — answers to the questions we get most. Question not listed? Message us on WhatsApp.',
  'Tickets kaufen, Boote mieten, Formentera, Bezahlung und mehr — Antworten auf die häufigsten Fragen. Deine Frage fehlt? Schreib uns per WhatsApp.',
  'Comprar entradas, alquilar barcos, Formentera, pagos y más — respuestas a las preguntas más frecuentes. ¿No está tu pregunta? Escríbenos por WhatsApp.',
  'Acheter des billets, louer un bateau, Formentera, paiements et plus — les réponses aux questions les plus fréquentes. Votre question manque ? Écrivez-nous sur WhatsApp.',
)
const CONTACT_CTA: T = L('Stel je vraag via WhatsApp', 'Ask us on WhatsApp', 'Frag uns per WhatsApp', 'Pregúntanos por WhatsApp', 'Posez votre question sur WhatsApp')

export default function FaqPage({ params }: { params: { locale: string } }) {
  const locale = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const allFaqs = FAQ_GROUPS.flatMap((g) => g.items.map((i) => ({ q: i.q[locale], a: i.a[locale] })))

  return (
    <div className="bg-white text-neutral-900 min-h-screen">
      <FaqJsonLd faqs={allFaqs} />

      {/* Header */}
      <section className="pt-[calc(var(--nav-h)+40px)] pb-10 px-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{KICKER[locale]}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl font-black tracking-tight text-neutral-900">{TITLE[locale]}</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500">{INTRO[locale]}</p>
      </section>

      {/* Groups */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        {FAQ_GROUPS.map((group) => (
          <div key={group.id} className="mb-10">
            <div className="mb-4 flex items-center gap-4">
              <h2 className="shrink-0 font-serif text-xl md:text-2xl font-black tracking-tight text-neutral-900">{group.title[locale]}</h2>
              <span className="h-px flex-1 bg-black/10" />
            </div>
            <div className="space-y-3">
              {group.items.map((item, i) => (
                <details key={i} className="group rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-colors open:border-gold/40 open:bg-white md:p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-base md:text-lg font-black text-neutral-900 marker:content-[''] [&::-webkit-details-marker]:hidden [&::marker]:content-['']">
                    {item.q[locale]}
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-neutral-500 transition-transform group-open:rotate-45 group-open:border-gold group-open:text-gold" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{item.a[locale]}</p>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 font-serif text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-gold hover:text-neutral-900"
            >
              {CONTACT_CTA[locale]}
            </a>
          ) : (
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 font-serif text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-gold hover:text-neutral-900"
            >
              {CONTACT_CTA[locale]}
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
