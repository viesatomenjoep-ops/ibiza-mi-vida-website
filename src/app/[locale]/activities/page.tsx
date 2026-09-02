import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { pickCover } from '@/lib/blank-covers'
import { ActivitiesGrid, type ActivityCard } from '@/components/activities/ActivitiesGrid'
import { ItemListJsonLd } from '@/components/seo/ItemListJsonLd'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { ibizaToday } from '@/lib/date-label'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'activities')
}

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const KICKER: T = L('Activiteiten', 'Activities', 'Aktivitäten', 'Actividades', 'Activités')
const TITLE: T = L(
  'Activiteiten op Ibiza',
  'Things to do in Ibiza',
  'Aktivitäten auf Ibiza',
  'Actividades en Ibiza',
  'Activités à Ibiza',
)
const INTRO: T = L(
  'Jetski, buggy, SUP, grotten en excursies — alles wat er naast het uitgaan te doen is, met de data die echt te boeken zijn. Kies eerst wát je wilt doen; de datum kies je op de volgende stap.',
  'Jet skis, buggies, SUP, caves and excursions — everything there is to do besides the clubs, with the dates that are genuinely bookable. Pick what you want to do first; you choose the date on the next step.',
  'Jetski, Buggy, SUP, Höhlen und Ausflüge — alles außer Clubbing, mit den Terminen, die wirklich buchbar sind. Wähle zuerst, was du machen willst; das Datum kommt im nächsten Schritt.',
  'Motos de agua, buggies, SUP, cuevas y excursiones — todo lo que hay que hacer además de los clubs, con las fechas realmente reservables. Elige primero qué quieres hacer; la fecha, en el paso siguiente.',
  'Jet-skis, buggies, SUP, grottes et excursions — tout ce qu’il y a à faire en dehors des clubs, avec les dates réellement réservables. Choisissez d’abord quoi faire ; la date vient ensuite.',
)
const NOTE: T = L(
  'Prijzen en beschikbaarheid komen rechtstreeks uit de agenda van onze ticketpartner en veranderen dagelijks. Wat je hier ziet, is wat er nu open staat.',
  'Prices and availability come straight from our ticket partner’s agenda and change daily. What you see here is what is open right now.',
  'Preise und Verfügbarkeit kommen direkt aus dem Kalender unseres Ticketpartners und ändern sich täglich. Was du hier siehst, ist aktuell buchbar.',
  'Los precios y la disponibilidad vienen directamente de la agenda de nuestro socio de entradas y cambian a diario. Lo que ves aquí es lo que está abierto ahora.',
  'Les prix et les disponibilités viennent directement de l’agenda de notre partenaire billetterie et changent chaque jour. Ce que vous voyez ici est ce qui est ouvert maintenant.',
)

/**
 * Activity selection.
 *
 * This page used to be the same date-first agenda widget as the ferry and
 * boat-party pages. That is the wrong first question here: for an activity
 * people decide *what* before *when*. It now works like the club-tickets flow —
 * browse a grid, pick one, choose a date on the detail page.
 *
 * Every number on a card is counted from the feed at request time: upcoming
 * date count, the lowest advertised price among them, and the next date. No
 * figure is shown that the data does not contain.
 */
export default async function ActivitiesPage({ params }: { params: { locale: string } }) {
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE

  const [allVenues, allDates] = await Promise.all([
    getVenues(params.locale),
    getAllDates(params.locale),
  ])

  const venues = allVenues.filter((v) => (v as any).type?.slug === 'activities')
  const todayStr = ibizaToday()

  const items: ActivityCard[] = venues
    .map((v) => {
      const dates = allDates
        .filter((d) => d.venueSlug === v.slug && (d.date || '') >= todayStr)
        .sort((a, b) => (a.date || '').localeCompare(b.date || ''))

      // Lowest advertised price across the upcoming dates. The feed writes
      // ranges like "125 € - 500 €", so take the first number of each and keep
      // the minimum; 0 means the feed simply had none and the card omits it.
      const prices = dates
        .map((d) => {
          const m = String(d.prices || '').match(/\d+([.,]\d+)?/)
          return m ? parseFloat(m[0].replace(',', '.')) : 0
        })
        .filter((n) => n > 0)

      return {
        slug: v.slug,
        name: v.name,
        image: pickCover((v as any).cover, (v as any).picture, dates[0]?.eventCover),
        count: dates.length,
        fromPrice: prices.length ? Math.min(...prices) : 0,
        nextDate: dates[0]?.date || '',
      }
    })
    .filter((a) => a.slug && a.count > 0)

  return (
    <main className="bg-white text-neutral-900">
      <BreadcrumbJsonLd locale={l} items={[{ name: homeLabel(l), path: '' }, { name: TITLE[l] }]} />
      <ItemListJsonLd
        entries={items.map((a) => ({ name: a.name, path: `${l}/activities/${a.slug}` }))}
        locale={l}
        name="Ibiza activities"
      />

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-[calc(var(--nav-h)+48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{KICKER[l]}</p>
        <h1 className="mt-3 font-serif text-[1.9rem] font-black leading-[1.1] tracking-tight [hyphens:auto] sm:text-4xl md:text-6xl">{TITLE[l]}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600">{INTRO[l]}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <ActivitiesGrid items={items} locale={l} />
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-black/60">{NOTE[l]}</p>
      </section>

      <AuthorByline locale={l} topic="activities in Ibiza" />
    </main>
  )
}
