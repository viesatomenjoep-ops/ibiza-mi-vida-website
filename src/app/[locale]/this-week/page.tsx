import type { Metadata } from 'next'
import Link from 'next/link'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { localeTag, addDays } from '@/lib/date-label'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { AuthorByline } from '@/components/seo/AuthorByline'

// Hourly: the whole value of this page is that it is current.
export const revalidate = 3600

const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

type L = Record<string, string>
const t = (m: L, l: string) => m[l] || m.en

const KICKER: L = {
  nl: 'Deze week', en: 'This week', de: 'Diese Woche', es: 'Esta semana', fr: 'Cette semaine',
}
const TITLE: L = {
  nl: 'Wie draait er deze week op Ibiza?',
  en: 'Who is playing in Ibiza this week?',
  de: 'Wer legt diese Woche auf Ibiza auf?',
  es: '¿Quién pincha esta semana en Ibiza?',
  fr: 'Qui joue à Ibiza cette semaine ?',
}
const H_NOTE: L = {
  nl: 'Over deze lijst', en: 'About this list', de: 'Zu dieser Liste',
  es: 'Sobre esta lista', fr: 'À propos de cette liste',
}
const TONIGHT: L = {
  nl: 'Vanavond', en: 'Tonight', de: 'Heute Abend', es: 'Esta noche', fr: 'Ce soir',
}
const TOMORROW: L = {
  nl: 'Morgen', en: 'Tomorrow', de: 'Morgen', es: 'Mañana', fr: 'Demain',
}
const NOTHING: L = {
  nl: 'Geen clubavonden gepland deze dag.', en: 'No club nights scheduled this day.',
  de: 'An diesem Tag keine Clubnächte geplant.', es: 'No hay noches programadas este día.',
  fr: 'Aucune soirée programmée ce jour.',
}

function dayHeading(iso: string, todayStr: string, l: string): string {
  if (iso === todayStr) return t(TONIGHT, l)
  if (iso === addDays(todayStr, 1)) return t(TOMORROW, l)
  const [y, m, d] = iso.split('-').map(Number)
  const s = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(localeTag(l), {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
  })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

interface Night {
  id: string
  day: string
  venueName: string
  venueSlug: string
  eventName: string
  eventSlug: string
  lineUp: string
  prices: string
}

/**
 * The week's programme as plain readable text.
 *
 * The data behind this has always been on the site, but only inside a calendar
 * widget: to see who plays on Thursday you had to click Thursday. That is fine
 * for a visitor and useless for everything else — a crawler, an answer engine,
 * or anyone searching "who is playing in Ibiza this week" gets nothing out of
 * a control they cannot operate.
 *
 * So this is the same feed rendered as headings, names and line-ups in the
 * HTML, one section per day, seven days out. No filtering UI on purpose: the
 * page has one job, which is to be legible without interaction.
 *
 * Deliberately not marked up as Event schema. Google's Event rich results are
 * for the organiser or the ticketing platform, and we are a reseller — venue
 * pages already carry that markup where it belongs. Duplicating it here would
 * be competing with our own pages for the same events.
 */
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const l = loc(params.locale)
  const desc: L = {
    nl: 'Het clubprogramma van Ibiza voor de komende zeven dagen: welke dj waar draait, per avond, met line-up en ticketprijs. Elk uur bijgewerkt uit de officiële agenda.',
    en: "Ibiza's club programme for the next seven days: which DJ plays where, night by night, with line-up and ticket price. Updated hourly from the official agenda.",
    de: 'Das Clubprogramm Ibizas für die nächsten sieben Tage: welcher DJ wo auflegt, Abend für Abend, mit Line-up und Ticketpreis. Stündlich aus dem offiziellen Kalender aktualisiert.',
    es: 'La programación de clubs de Ibiza para los próximos siete días: qué DJ pincha dónde, noche a noche, con cartel y precio. Actualizado cada hora desde la agenda oficial.',
    fr: "Le programme des clubs d'Ibiza pour les sept prochains jours : quel DJ joue où, soir par soir, avec line-up et prix. Mis à jour toutes les heures depuis l'agenda officiel.",
  }
  return pageMetadata({ locale: l, path: 'this-week', title: t(TITLE, l), description: t(desc, l) })
}

export default async function ThisWeekPage({ params }: { params: { locale: string } }) {
  const l = loc(params.locale)
  const [venues, dates] = await Promise.all([getVenues(params.locale), getAllDates(params.locale)])

  const clubbing = new Set(
    venues.filter(v => (v as any).type?.slug === 'clubbing').map(v => v.slug),
  )
  const todayStr = new Date().toISOString().slice(0, 10)
  const until = addDays(todayStr, 6)

  const nights: Night[] = dates
    .filter(d => {
      const day = String(d.date || '').slice(0, 10)
      return clubbing.has(d.venueSlug || '') && day >= todayStr && day <= until
    })
    .map(d => ({
      id: `${d.id}-${d.eventSlug}`,
      day: String(d.date).slice(0, 10),
      venueName: d.venueName || '',
      venueSlug: d.venueSlug || '',
      eventName: d.eventName || d.name || '',
      eventSlug: d.eventSlug || '',
      lineUp: String(d.lineUp || '').trim(),
      prices: String(d.prices || '').trim(),
    }))

  const days = Array.from({ length: 7 }, (_, i) => addDays(todayStr, i))
  const byDay = new Map<string, Night[]>()
  for (const n of nights) {
    const g = byDay.get(n.day)
    if (g) g.push(n)
    else byDay.set(n.day, [n])
  }
  for (const g of Array.from(byDay.values())) g.sort((a, b) => a.venueName.localeCompare(b.venueName))

  const total = nights.length
  const clubCount = new Set(nights.map(n => n.venueSlug)).size

  const answer: L = {
    nl: `Voor de komende zeven dagen staan er ${total} clubavonden gepland bij ${clubCount} clubs op Ibiza. Hieronder per avond welke dj waar draait, met de line-up en de ticketprijs zoals die nu in de officiële agenda staat. Deze pagina wordt elk uur opnieuw opgebouwd, dus wat je hier ziet is wat er op dit moment open staat.`,
    en: `For the next seven days there are ${total} club nights scheduled across ${clubCount} clubs in Ibiza. Below, night by night, is which DJ plays where, with the line-up and the ticket price as it currently stands in the official agenda. This page rebuilds every hour, so what you see is what is open right now.`,
    de: `Für die nächsten sieben Tage sind ${total} Clubnächte in ${clubCount} Clubs auf Ibiza geplant. Unten steht Abend für Abend, welcher DJ wo auflegt, mit Line-up und dem Ticketpreis, wie er aktuell im offiziellen Kalender steht. Diese Seite baut sich stündlich neu auf, du siehst also, was gerade offen ist.`,
    es: `Para los próximos siete días hay ${total} noches programadas en ${clubCount} clubs de Ibiza. Abajo, noche a noche, qué DJ pincha dónde, con el cartel y el precio tal y como figura ahora en la agenda oficial. Esta página se reconstruye cada hora, así que lo que ves es lo que está abierto en este momento.`,
    fr: `Pour les sept prochains jours, ${total} soirées sont programmées dans ${clubCount} clubs à Ibiza. Ci-dessous, soir par soir, quel DJ joue où, avec le line-up et le prix du billet tels qu'ils figurent actuellement dans l'agenda officiel. Cette page se reconstruit chaque heure : vous voyez ce qui est ouvert maintenant.`,
  }

  const note: L = {
    nl: 'De line-ups komen rechtstreeks uit de agenda van onze ticketpartner en kunnen door de club worden gewijzigd — een naam die er vandaag bij staat kan er volgende week af zijn. Prijzen zijn de laagste beschikbare ticketprijs voor die avond, exclusief drankjes en tafels. Staat een club er niet bij, dan heeft die voor die dag niets gepubliceerd; dat is niet hetzelfde als gesloten.',
    en: "Line-ups come straight from our ticketing partner's agenda and can be changed by the club — a name listed today may be gone next week. Prices are the cheapest available ticket for that night, excluding drinks and tables. A club not listed has published nothing for that day, which is not the same as being closed.",
    de: 'Die Line-ups stammen direkt aus dem Kalender unseres Ticketpartners und können vom Club geändert werden — ein heute gelisteter Name kann nächste Woche fehlen. Preise sind das günstigste verfügbare Ticket für den Abend, ohne Getränke und Tische. Ein nicht gelisteter Club hat für den Tag nichts veröffentlicht, was nicht dasselbe ist wie geschlossen.',
    es: 'Los carteles vienen directamente de la agenda de nuestro socio de entradas y el club puede cambiarlos — un nombre que hoy aparece puede no estar la semana que viene. Los precios son la entrada más barata disponible esa noche, sin bebidas ni mesas. Un club que no aparece no ha publicado nada para ese día, que no es lo mismo que estar cerrado.',
    fr: "Les line-ups proviennent directement de l'agenda de notre partenaire billetterie et peuvent être modifiés par le club — un nom présent aujourd'hui peut disparaître la semaine prochaine. Les prix correspondent au billet le moins cher disponible ce soir-là, hors boissons et tables. Un club absent n'a rien publié pour ce jour, ce qui n'est pas la même chose qu'être fermé.",
  }

  return (
    <main className="bg-white text-neutral-900">
      <BreadcrumbJsonLd locale={l} items={[{ name: homeLabel(l), path: `${l}` }, { name: t(TITLE, l) }]} />

      <section className="mx-auto max-w-3xl px-4 pb-10 pt-[calc(var(--nav-h)+48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{t(KICKER, l)}</p>
        <h1 className="mt-3 font-serif text-[2rem] font-black leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
          {t(TITLE, l)}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-neutral-800">{t(answer, l)}</p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        {days.map(day => {
          const list = byDay.get(day) || []
          return (
            <div key={day} className="mb-9">
              <h2 className="border-b border-black/10 pb-2 font-serif text-xl font-black tracking-tight sm:text-2xl">
                {dayHeading(day, todayStr, l)}
              </h2>
              {list.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-500">{t(NOTHING, l)}</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {list.map(n => (
                    <li key={n.id}>
                      <h3 className="font-serif text-base font-black leading-snug sm:text-lg">
                        <Link
                          href={`/${l}/club-tickets/${n.venueSlug}/${n.eventSlug}`}
                          className="text-neutral-900 underline decoration-black/20 underline-offset-2 hover:decoration-ibiza-green"
                        >
                          {n.eventName}
                        </Link>
                        <span className="font-sans text-sm font-semibold text-neutral-500"> · {n.venueName}</span>
                      </h3>
                      {n.lineUp ? (
                        <p className="mt-0.5 text-sm leading-relaxed text-neutral-700">{n.lineUp}</p>
                      ) : null}
                      {n.prices ? (
                        <p className="mt-0.5 text-sm font-bold text-ibiza-green">{n.prices}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14">
        <h2 className="font-serif text-2xl font-black tracking-tight">{t(H_NOTE, l)}</h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">{t(note, l)}</p>
      </section>

      <AuthorByline locale={l} topic="this week in Ibiza" />
    </main>
  )
}
