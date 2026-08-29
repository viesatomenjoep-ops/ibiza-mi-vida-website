'use client'

import { useState } from 'react'
import { MessageCircle, Users, Sun, Moon, Sailboat, Crown } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'

/**
 * Package / group deal picker.
 *
 * Deliberately states NO prices. What a club offers on a given night — free
 * entry, a reduced rate, a table minimum or ticket-only — genuinely varies per
 * club, per day and per week, and Simon confirms it over WhatsApp. Publishing
 * indicative prices here would put claims on the page that are wrong most
 * nights, and any price echoed into structured data is a policy violation.
 *
 * So the picker's only job is to compose a precise, pre-filled WhatsApp message
 * — group size, deal type, optional date — so Simon can answer in one reply
 * instead of three back-and-forths.
 */

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

const GROUPS = [
  { id: '2-4', label: '2–4' },
  { id: '5-8', label: '5–8' },
  { id: '9-15', label: '9–15' },
  { id: '16+', label: '16+' },
] as const

const KINDS = [
  { id: 'day', Icon: Sun, label: { nl: 'Day club', en: 'Day club', de: 'Day Club', es: 'Day club', fr: 'Day club' } as L },
  { id: 'night', Icon: Moon, label: { nl: 'Night club', en: 'Night club', de: 'Night Club', es: 'Night club', fr: 'Night club' } as L },
  { id: 'boat', Icon: Sailboat, label: { nl: 'Boot + club', en: 'Boat + club', de: 'Boot + Club', es: 'Barco + club', fr: 'Bateau + club' } as L },
  { id: 'table', Icon: Crown, label: { nl: 'VIP-tafel', en: 'VIP table', de: 'VIP-Tisch', es: 'Mesa VIP', fr: 'Table VIP' } as L },
] as const

const HEAD: L = {
  nl: 'Stel je package deal samen',
  en: 'Build your package deal',
  de: 'Stell deinen Package Deal zusammen',
  es: 'Crea tu package deal',
  fr: 'Composez votre package deal',
}
const SUB: L = {
  nl: 'Kies je groepsgrootte en wat je zoekt. Wij sturen je een voorstel met wat er die dag mogelijk is — voorwaarden verschillen per club en per avond.',
  en: 'Pick your group size and what you are after. We come back with what is possible that day — terms differ per club and per night.',
  de: 'Wähle Gruppengröße und was du suchst. Wir melden uns mit dem, was an dem Tag möglich ist — die Konditionen unterscheiden sich je Club und Abend.',
  es: 'Elige el tamaño del grupo y qué buscas. Te decimos qué es posible ese día — las condiciones varían según el club y la noche.',
  fr: 'Choisissez la taille du groupe et ce que vous cherchez. Nous revenons vers vous avec ce qui est possible ce jour-là — les conditions varient selon le club et la soirée.',
}
const GROUP_LBL: L = { nl: 'Aantal personen', en: 'Group size', de: 'Gruppengröße', es: 'Número de personas', fr: 'Nombre de personnes' }
const KIND_LBL: L = { nl: 'Waar zoek je naar?', en: 'What are you after?', de: 'Wonach suchst du?', es: '¿Qué buscas?', fr: 'Que cherchez-vous ?' }
const DATE_LBL: L = { nl: 'Datum (optioneel)', en: 'Date (optional)', de: 'Datum (optional)', es: 'Fecha (opcional)', fr: 'Date (facultatif)' }
const CTA: L = {
  nl: 'Vraag je deal aan via WhatsApp',
  en: 'Request your deal on WhatsApp',
  de: 'Deal per WhatsApp anfragen',
  es: 'Pide tu deal por WhatsApp',
  fr: 'Demandez votre deal sur WhatsApp',
}
const NOTE: L = {
  nl: 'Groepen vanaf 9 personen krijgen meestal een ander voorstel dan kleine groepen — daarom vragen we het vooraf.',
  en: 'Groups of 9 and up usually get a different offer than small groups — that is why we ask up front.',
  de: 'Gruppen ab 9 Personen bekommen meist ein anderes Angebot als kleine Gruppen — deshalb fragen wir vorab.',
  es: 'Los grupos de 9 o más suelen recibir una propuesta distinta a los grupos pequeños — por eso lo preguntamos antes.',
  fr: 'Les groupes de 9 personnes et plus reçoivent généralement une offre différente — c’est pourquoi nous le demandons à l’avance.',
}
const MSG_GROUP: L = { nl: 'Aantal personen', en: 'Group size', de: 'Personen', es: 'Personas', fr: 'Personnes' }
const MSG_KIND: L = { nl: 'Type', en: 'Looking for', de: 'Gesucht', es: 'Busco', fr: 'Recherche' }
const MSG_DATE: L = { nl: 'Datum', en: 'Date', de: 'Datum', es: 'Fecha', fr: 'Date' }
const MSG_OPEN: L = {
  nl: 'Hoi Simon! Ik zoek een package deal.',
  en: 'Hi Simon! I’m looking for a package deal.',
  de: 'Hallo Simon! Ich suche einen Package Deal.',
  es: '¡Hola Simon! Busco un package deal.',
  fr: 'Salut Simon ! Je cherche un package deal.',
}

export function PackageDealPicker({ locale = 'nl' }: { locale?: string }) {
  const [group, setGroup] = useState<string>('2-4')
  const [kind, setKind] = useState<string>('night')
  const [date, setDate] = useState<string>('')

  const kindLabel = t(KINDS.find((k) => k.id === kind)!.label, locale)
  const message =
    `${t(MSG_OPEN, locale)}\n` +
    `${t(MSG_GROUP, locale)}: ${GROUPS.find((g) => g.id === group)!.label}\n` +
    `${t(MSG_KIND, locale)}: ${kindLabel}` +
    (date ? `\n${t(MSG_DATE, locale)}: ${date}` : '')

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  const pill = (active: boolean) =>
    `rounded-full border px-4 py-2.5 text-sm font-bold transition-all ${
      active
        ? 'border-gold bg-gold text-white shadow-sm'
        : 'border-black/12 bg-white text-black/70 hover:border-black/40 hover:text-black'
    }`

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
      <h3 className="font-serif text-xl font-black tracking-tight text-neutral-900 md:text-2xl">
        {t(HEAD, locale)}
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/60">{t(SUB, locale)}</p>

      <fieldset className="mt-6">
        <legend className="mb-2.5 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-black/50">
          <Users size={13} /> {t(GROUP_LBL, locale)}
        </legend>
        <div className="flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              aria-pressed={group === g.id}
              className={pill(group === g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="mb-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-black/50">
          {t(KIND_LBL, locale)}
        </legend>
        <div className="flex flex-wrap gap-2">
          {KINDS.map(({ id, Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setKind(id)}
              aria-pressed={kind === id}
              className={`inline-flex items-center gap-2 ${pill(kind === id)}`}
            >
              <Icon size={15} />
              {t(label, locale)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="pkg-date" className="mb-2.5 block text-[11px] font-black uppercase tracking-[0.18em] text-black/50">
          {t(DATE_LBL, locale)}
        </label>
        <input
          id="pkg-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full max-w-xs rounded-full border border-black/12 bg-white px-5 py-2.5 text-sm text-black focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 font-serif text-sm font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.02] active:scale-100 sm:w-auto"
      >
        <MessageCircle size={20} strokeWidth={2.5} />
        {t(CTA, locale)}
      </a>

      <p className="mt-3 text-xs leading-relaxed text-black/60">{t(NOTE, locale)}</p>
    </div>
  )
}
