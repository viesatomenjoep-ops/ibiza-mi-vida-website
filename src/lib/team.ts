import { SITE_URL, type Locale } from '@/lib/seo'

/**
 * The people behind the business — single source of truth.
 *
 * This exists for E-E-A-T. Google's quality guidelines weigh "who is
 * responsible for this content" heavily, and until now the site spoke in an
 * anonymous brand voice, which is the weakest possible signal. A named person
 * with a stable @id, referenced as `founder` on the Organization and as
 * `author` on the commercial pages, ties the whole site to a real human.
 *
 * HARD RULE — everything in here must be verifiable.
 * We publish first name, role, that he is based on Ibiza, the languages he
 * works in and the WhatsApp number. We deliberately do NOT publish a surname,
 * a founding year, years of experience, certifications or a photo, because
 * none of that has been confirmed. Inventing credentials to look more
 * authoritative is precisely the failure mode E-E-A-T is designed to catch,
 * and a fabricated `Person` in structured data is a misrepresentation.
 *
 * To strengthen this later, add — only once confirmed — a surname, a real
 * photo (`image`), a `sameAs` profile link, and a founding year.
 */

export const FOUNDER_ID = `${SITE_URL}/#simon`

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export const FOUNDER = {
  /** First name only — no surname has been confirmed. */
  name: 'Simon',
  id: FOUNDER_ID,
  role: L(
    'Oprichter — Ibiza Mi Vida',
    'Founder — Ibiza Mi Vida',
    'Gründer — Ibiza Mi Vida',
    'Fundador — Ibiza Mi Vida',
    'Fondateur — Ibiza Mi Vida',
  ),
  /** Schema.org jobTitle is a stable English label, independent of UI language. */
  jobTitle: 'Founder',
  languages: ['Nederlands', 'English', 'Deutsch', 'Español', 'Français'],
  /** BCP-47 tags for `knowsLanguage`. */
  languageTags: ['nl', 'en', 'de', 'es', 'fr'],
  bio: L(
    'Simon woont op Ibiza en regelt elke boeking persoonlijk via WhatsApp — boten, ferrytickets, clubtickets en package deals. Hij kent de marina’s, de promotors en wat er die avond echt speelt, en zegt het ook wanneer iets niet kan.',
    'Simon lives on Ibiza and arranges every booking personally over WhatsApp — boats, ferry tickets, club tickets and package deals. He knows the marinas, the promoters and what is actually on that night, and he will tell you when something is not possible.',
    'Simon lebt auf Ibiza und organisiert jede Buchung persönlich per WhatsApp — Boote, Fährtickets, Club-Tickets und Package Deals. Er kennt die Marinas, die Promoter und was an dem Abend wirklich läuft — und sagt auch, wenn etwas nicht geht.',
    'Simon vive en Ibiza y gestiona cada reserva personalmente por WhatsApp — barcos, billetes de ferry, entradas de club y package deals. Conoce las marinas, a los promotores y lo que de verdad hay esa noche, y también te dice cuándo algo no es posible.',
    'Simon vit à Ibiza et organise chaque réservation personnellement via WhatsApp — bateaux, billets de ferry, entrées en club et package deals. Il connaît les marinas, les promoteurs et ce qui se passe vraiment ce soir-là, et il vous dit aussi quand quelque chose n’est pas possible.',
  ),
} as const

/** `Person` node for Simon. Referenced by @id elsewhere, never redeclared. */
export function founderNode() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: FOUNDER.name,
    jobTitle: FOUNDER.jobTitle,
    worksFor: { '@id': `${SITE_URL}/#organization` },
    knowsLanguage: FOUNDER.languageTags,
    ...(phone ? { telephone: `+${phone}` } : {}),
  }
}
