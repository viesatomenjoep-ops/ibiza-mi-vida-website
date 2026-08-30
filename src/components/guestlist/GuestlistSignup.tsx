'use client'

import { useState } from 'react'
import { MessageCircle, ListChecks } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'

/**
 * Guestlist sign-up — the second route on this page, next to the package-deal
 * picker.
 *
 * Why it exists separately: the UI rename to "Package Deals" made the guestlist
 * invisible as an action, even though it is a different thing (your name on a
 * club's list for one night) and "guestlist" is the term with the search
 * volume. The word now appears prominently in visible copy, not only in the
 * title tag and schema — which is what an answer engine actually reads.
 *
 * Deliberately promises nothing. Not every night has a list, terms differ per
 * club and per day, and the door has the final say. The form's only job is to
 * compose a precise WhatsApp message so Simon can answer with what is actually
 * possible for that date.
 */

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

const KICKER: L = {
  nl: 'Guestlist', en: 'Guestlist', de: 'Guestlist', es: 'Guestlist', fr: 'Guestlist',
}
const HEAD: L = {
  nl: 'Op de guestlist van een club',
  en: 'Get on a club guestlist',
  de: 'Auf die Guestlist eines Clubs',
  es: 'Entrar en la guestlist de un club',
  fr: 'Être sur la guestlist d’un club',
}
const SUB: L = {
  nl: 'Je naam op de lijst van een club voor één avond. Wat er die avond geldt — vrije entree, een gereduceerde prijs of alleen met ticket — verschilt per club en per dag. Simon kijkt wat er voor jouw datum mogelijk is en bevestigt dat vooraf.',
  en: 'Your name on a club’s list for one night. What applies that night — free entry, a reduced price or ticket-only — differs per club and per day. Simon checks what is possible for your date and confirms it in advance.',
  de: 'Dein Name für einen Abend auf der Liste eines Clubs. Was an dem Abend gilt — freier Eintritt, ermäßigter Preis oder nur mit Ticket — hängt vom Club und vom Tag ab. Simon prüft, was für dein Datum möglich ist, und bestätigt es vorher.',
  es: 'Tu nombre en la lista de un club para una noche. Lo que aplica esa noche — entrada libre, precio reducido o solo con entrada — varía según el club y el día. Simon comprueba qué es posible para tu fecha y lo confirma antes.',
  fr: 'Votre nom sur la liste d’un club pour une soirée. Ce qui s’applique ce soir-là — entrée libre, tarif réduit ou billet uniquement — varie selon le club et le jour. Simon vérifie ce qui est possible pour votre date et le confirme à l’avance.',
}
const CLUB_LBL: L = { nl: 'Welke club?', en: 'Which club?', de: 'Welcher Club?', es: '¿Qué club?', fr: 'Quel club ?' }
const CLUB_PH: L = {
  nl: 'Bijv. Hï Ibiza — of laat leeg', en: 'e.g. Hï Ibiza — or leave blank',
  de: 'z. B. Hï Ibiza — oder leer lassen', es: 'Ej. Hï Ibiza — o déjalo vacío', fr: 'Ex. Hï Ibiza — ou laissez vide',
}
const DATE_LBL: L = { nl: 'Datum', en: 'Date', de: 'Datum', es: 'Fecha', fr: 'Date' }
const PEOPLE_LBL: L = { nl: 'Aantal personen', en: 'How many of you', de: 'Wie viele Personen', es: 'Cuántos sois', fr: 'Combien êtes-vous' }
const CTA: L = {
  nl: 'App Simon voor de mogelijkheden',
  en: 'Message Simon for what’s possible',
  de: 'Simon nach den Möglichkeiten fragen',
  es: 'Escribe a Simon para ver las opciones',
  fr: 'Écrire à Simon pour les possibilités',
}
const HONEST: L = {
  nl: 'Eerlijk: niet elke avond heeft een guestlist. Grote headliner-nachten zijn vaak alleen met ticket, en de deur beslist altijd. Simon zegt het als het niet kan.',
  en: 'Honestly: not every night has a guestlist. Big headliner nights are often ticket-only, and the door always has the final say. Simon will tell you when it is not possible.',
  de: 'Ehrlich: nicht jeder Abend hat eine Guestlist. Große Headliner-Nächte sind oft nur mit Ticket, und die Tür entscheidet immer. Simon sagt dir, wenn es nicht geht.',
  es: 'Con franqueza: no todas las noches hay guestlist. Las noches de gran headliner suelen ser solo con entrada, y la puerta siempre decide. Simon te dirá si no es posible.',
  fr: 'Honnêtement : toutes les soirées n’ont pas de guestlist. Les grandes soirées headliner sont souvent sur billet uniquement, et la porte décide toujours. Simon vous le dira si ce n’est pas possible.',
}
const MSG_OPEN: L = {
  nl: 'Hoi Simon! Ik wil graag op de guestlist.',
  en: 'Hi Simon! I’d like to get on the guestlist.',
  de: 'Hallo Simon! Ich möchte gern auf die Guestlist.',
  es: '¡Hola Simon! Me gustaría entrar en la guestlist.',
  fr: 'Salut Simon ! Je voudrais être sur la guestlist.',
}
const MSG_CLUB: L = { nl: 'Club', en: 'Club', de: 'Club', es: 'Club', fr: 'Club' }
const MSG_DATE: L = { nl: 'Datum', en: 'Date', de: 'Datum', es: 'Fecha', fr: 'Date' }
const MSG_PEOPLE: L = { nl: 'Personen', en: 'People', de: 'Personen', es: 'Personas', fr: 'Personnes' }

export function GuestlistSignup({ locale = 'nl' }: { locale?: string }) {
  const [club, setClub] = useState('')
  const [date, setDate] = useState('')
  const [people, setPeople] = useState('')

  const message =
    `${t(MSG_OPEN, locale)}` +
    (club ? `\n${t(MSG_CLUB, locale)}: ${club}` : '') +
    (date ? `\n${t(MSG_DATE, locale)}: ${date}` : '') +
    (people ? `\n${t(MSG_PEOPLE, locale)}: ${people}` : '')

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  const field =
    'w-full rounded-full border border-black/12 bg-white px-5 py-2.5 text-sm text-neutral-900 placeholder:text-black/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30'
  const legend = 'mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-black/60'

  return (
    <div className="rounded-3xl border border-black/10 bg-neutral-50 p-6 shadow-sm md:p-8">
      <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-gold">
        <ListChecks size={14} /> {t(KICKER, locale)}
      </span>
      <h3 className="mt-3 font-serif text-xl font-black tracking-tight text-neutral-900 md:text-2xl">
        {t(HEAD, locale)}
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">{t(SUB, locale)}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="gl-club" className={legend}>{t(CLUB_LBL, locale)}</label>
          <input id="gl-club" type="text" value={club} onChange={(e) => setClub(e.target.value)} placeholder={t(CLUB_PH, locale)} className={field} />
        </div>
        <div>
          <label htmlFor="gl-date" className={legend}>{t(DATE_LBL, locale)}</label>
          <input id="gl-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="gl-people" className={legend}>{t(PEOPLE_LBL, locale)}</label>
          <input id="gl-people" type="number" min={1} max={99} value={people} onChange={(e) => setPeople(e.target.value)} placeholder="4" className={field} />
        </div>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 font-serif text-sm font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.02] active:scale-100 sm:w-auto"
      >
        <MessageCircle size={20} strokeWidth={2.5} />
        {t(CTA, locale)}
      </a>

      <p className="mt-4 max-w-xl text-xs leading-relaxed text-black/60">{t(HONEST, locale)}</p>
    </div>
  )
}
