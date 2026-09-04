import type { Metadata } from 'next'
import Link from 'next/link'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { localeTag, addDays } from '@/lib/date-label'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { pickCover } from '@/lib/blank-covers'
import { optImg } from '@/lib/img'
import { withDate } from '@/lib/event-date-param'
import { ibizaToday } from '@/lib/date-label'

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
  /** Affiche van de avond. Leeg wanneer alle bronnen een placeholder zijn. */
  image: string
}

/** Eén club op één avond, met wat daar draait. */
interface ClubNight {
  slug: string
  name: string
  /** Het witte clublogo, of leeg — dan draagt de naam de herkenning. */
  whiteLogo: string
  nights: Night[]
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
 * ── Waarom er nu beeld bij staat, en in deze vorm ─────────────────────────
 * De pagina was een kale opsomming, terwijl de ClubTickets-feed voor élke
 * avond een affiche meelevert en voor een deel van de clubs een wit logo. Dat
 * ongebruikt laten kost herkenning: een clubnacht koop je op de naam die je
 * kent en het beeld dat je eerder zag, niet op een regel tekst.
 *
 * Het is bewust géén kaartenraster geworden. Dit is de pagina die "wie draait
 * er deze week" moet beantwoorden, ook voor een antwoordmachine, en een raster
 * duwt de line-ups — het eigenlijke antwoord — onder de vouw. Het blijft dus
 * een lijst; elke avond krijgt er alleen een affiche naast.
 *
 * De avonden zijn nu per club gegroepeerd in plaats van als platte rij. Dat
 * scheelde niet alleen "· EDEN IBIZA" achter elke regel: het geeft het
 * clublogo een plek waar het op leesbare grootte kan staan in plaats van als
 * postzegel op een miniatuur. Zestien van de 42 clubs leveren een wit logo;
 * de rest toont alleen de naam. Daarom staat de naam er áltijd en is het logo
 * de toevoeging — nooit andersom, anders wordt de lijst ongelijk.
 *
 * `pickCover` filtert de zwarte placeholders van ClubTickets weg, zodat een
 * avond zonder affiche een rustig vlak krijgt in plaats van een zwart gat.
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
  const todayStr = ibizaToday()
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
      // Volgorde van voorkeur: de affiche van het event, dan het eventlogo,
      // dan de foto van de club. pickCover slaat de bekende zwarte
      // placeholders over in plaats van ze als plaatje te tonen.
      image: pickCover(d.eventCover, d.eventLogo, d.venueCover),
    }))

  // Het witte clublogo hoort bij de venue, niet bij de avond — dus één keer
  // opzoeken in plaats van per event meeslepen.
  const whiteLogoBySlug = new Map(
    venues.map(v => [v.slug, String((v as any).whitelogo || '')]),
  )

  const days = Array.from({ length: 7 }, (_, i) => addDays(todayStr, i))
  const byDay = new Map<string, Night[]>()
  for (const n of nights) {
    const g = byDay.get(n.day)
    if (g) g.push(n)
    else byDay.set(n.day, [n])
  }

  /** Eén avond, gegroepeerd per club en alfabetisch op clubnaam. */
  const clubsFor = (day: string): ClubNight[] => {
    const perClub = new Map<string, ClubNight>()
    for (const n of byDay.get(day) || []) {
      const g = perClub.get(n.venueSlug)
      if (g) g.nights.push(n)
      else perClub.set(n.venueSlug, {
        slug: n.venueSlug,
        name: n.venueName,
        whiteLogo: whiteLogoBySlug.get(n.venueSlug) || '',
        nights: [n],
      })
    }
    return Array.from(perClub.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(c => ({ ...c, nights: c.nights.sort((a, b) => a.eventName.localeCompare(b.eventName)) }))
  }

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
      <BreadcrumbJsonLd locale={l} items={[{ name: homeLabel(l), path: '' }, { name: t(TITLE, l) }]} />

      <section className="mx-auto max-w-3xl px-4 pb-10 pt-[calc(var(--nav-h)+48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{t(KICKER, l)}</p>
        <h1 className="mt-3 font-serif text-[2rem] font-black leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
          {t(TITLE, l)}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-neutral-800">{t(answer, l)}</p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        {days.map(day => {
          const clubs = clubsFor(day)
          const isTonight = day === todayStr
          return (
            /* content-visibility: zeven avonden met tachtig affiches staan
               allemaal in de HTML (dat is de hele bedoeling van deze pagina),
               maar de browser hoeft alleen te lay-outen wat in beeld komt. */
            <div key={day} className="mb-10 [contain-intrinsic-size:auto_640px] [content-visibility:auto]">
              <h2 className="flex items-center gap-2.5 border-b border-black/10 pb-2 font-serif text-xl font-black tracking-tight sm:text-2xl">
                {isTonight && <span className="live-dot" aria-hidden />}
                <span className={isTonight ? 'text-ibiza-green' : undefined}>
                  {dayHeading(day, todayStr, l)}
                </span>
              </h2>

              {clubs.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-500">{t(NOTHING, l)}</p>
              ) : (
                <div className="mt-5 space-y-6">
                  {clubs.map(club => (
                    <div key={club.slug}>
                      {/* Clubkop: de naam draagt het altijd, het logo komt
                          erbij als de club er een levert. Wit logo dus op een
                          donkere chip — rechtstreeks op wit is het onzichtbaar. */}
                      <h3 className="flex items-center gap-2.5">
                        {club.whiteLogo ? (
                          /* Klein en donker: het logo is de herkenning, niet de
                             kop. Groter gaf een zwarte balk die zwaarder woog
                             dan de naam van het event eronder. */
                          <span className="inline-flex h-6 shrink-0 items-center rounded-md bg-obsidian px-2">
                            <img
                              src={optImg(club.whiteLogo, 208)}
                              alt=""
                              aria-hidden
                              loading="lazy"
                              decoding="async"
                              className="h-3 w-auto max-w-[84px] object-contain"
                            />
                          </span>
                        ) : null}
                        <span className="font-sans text-xs font-black uppercase tracking-[0.16em] text-neutral-900">
                          {club.name}
                        </span>
                      </h3>

                      <ul className="mt-3 space-y-1">
                        {club.nights.map(n => (
                          <li key={n.id}>
                            <Link
                              href={withDate(`/${l}/club-tickets/${n.venueSlug}/${n.eventSlug}`, n.day)}
                              className="group -mx-2 flex gap-3 rounded-2xl px-2 py-2 outline-none transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-ibiza-green focus-visible:ring-offset-2 sm:gap-4"
                            >
                              {/* self-start: zonder dat rekt de affiche als flex-kind mee met de
                                    tekst ernaast, en dan klopt 4:3 niet meer — een avond
                                    met een lange line-up kreeg een uitgerekte poster. */}
                              <span className="relative block w-[104px] shrink-0 self-start overflow-hidden rounded-xl bg-ibiza-mint sm:w-[152px]">
                                <span className="block aspect-[4/3]" />
                                {n.image ? (
                                  <img
                                    src={optImg(n.image, 384)}
                                    srcSet={`${optImg(n.image, 208)} 208w, ${optImg(n.image, 384)} 384w`}
                                    sizes="(max-width: 640px) 104px, 152px"
                                    alt=""
                                    aria-hidden
                                    loading="lazy"
                                    decoding="async"
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                  />
                                ) : null}
                              </span>

                              <span className="min-w-0 flex-1 py-0.5">
                                <h4 className="font-serif text-base font-black leading-snug text-neutral-900 decoration-ibiza-green decoration-2 underline-offset-2 group-hover:underline sm:text-lg">
                                  {n.eventName}
                                </h4>
                                {n.lineUp ? (
                                  <span className="mt-1 line-clamp-2 block text-[13px] leading-relaxed text-neutral-600 sm:text-sm">
                                    {n.lineUp}
                                  </span>
                                ) : null}
                                {n.prices ? (
                                  <span className="mt-1 block text-sm font-bold text-ibiza-green">{n.prices}</span>
                                ) : null}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
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
