import { getVenues, getAllDates } from '@/lib/clubtickets'
import { pickCover } from '@/lib/blank-covers'
import { eventBasePath } from '@/lib/event-path'
import { addDays } from '@/lib/date-label'

/**
 * De dagenlijsten die de vier homepage-werelden voeden.
 *
 * ── Waarom dit uit page.tsx is gehaald ────────────────────────────────────
 * De dagkiezer boven elke wereld toonde zeven dagen en verder kwam je niet.
 * Om ook volgende weken te kunnen kiezen moet er een tweede ingang zijn die
 * dezelfde dagen kan opbouwen voor een willekeurige begindatum: de route
 * /api/home-days.
 *
 * Twee keer dezelfde opbouw met de hand schrijven is twee keer de kans dat ze
 * uit elkaar lopen -- en dat merk je pas als de bijgeladen week er nét anders
 * uitziet dan de eerste. Vandaar één functie, gebruikt door de pagina én door
 * de route.
 *
 * ── Waarom niet gewoon 28 dagen meesturen ─────────────────────────────────
 * Dan was er geen route nodig. Maar de homepage weegt nu al 675 kB, en drie
 * van de vier werelden dragen tot veertien kaarten per dag: vier weken vooruit
 * betekent grofweg een kwart megabyte extra bij élke bezoeker, ook bij de
 * negen van de tien die nooit verder dan deze week kijkt. Bijladen kost alleen
 * iets bij wie er ook echt om vraagt.
 */

/** Wat een clubavond van de feed meekrijgt naar de client. Bewust smal. */
export interface ClubDay {
  date: string
  items: {
    id: number
    name: string
    date: string
    prices: string
    ct_events: { name?: string; slug?: string; logo?: string; cover?: string }
    ct_venues: { name?: string; slug?: string }
  }[]
}

/** Excursies, boten en ferry's: hetzelfde, plus het venuetype en het pad. */
export interface ExperienceDay {
  date: string
  items: {
    id: number
    name: string
    date: string
    prices: string
    ct_events: { name?: string; slug?: string; logo?: string; cover?: string }
    ct_venues: { name?: string; slug?: string; basePath?: string; typeSlug?: string }
  }[]
}

/**
 * Alles wat er die dag is, tot een bovengrens die in de praktijk niet geraakt
 * wordt. Gemeten over de eerstvolgende negen dagen: hoogstens zestien
 * clubavonden en tweeënveertig activiteiten per dag. De grens blijft staan als
 * vangnet, mocht ClubTickets ooit een dag met tweehonderd regels teruggeven.
 */
const PER_DAY = 60

/**
 * Eén event per aanbieder voordat een aanbieder een tweede plek krijgt.
 *
 * Zonder dit vult één operator met acht jetski-vertrekken per dag het grootste
 * deel van de rij, en komen de buggy- en quadtochten er nooit in.
 */
function spreadByVenue<T extends { venueSlug?: string }>(rows: T[]): T[] {
  const groups = new Map<string, T[]>()
  for (const r of rows) {
    const k = r.venueSlug || ''
    const g = groups.get(k)
    if (g) g.push(r); else groups.set(k, [r])
  }
  const lists = Array.from(groups.values())
  const out: T[] = []
  for (let i = 0; ; i++) {
    const before = out.length
    for (const l of lists) if (i < l.length) out.push(l[i])
    if (out.length === before) return out
  }
}

/**
 * Gewogen rondgang over de venuetypes in plaats van de volgorde van de feed.
 *
 * Recht afsnijden gaf elke keer twaalf boten en ferry's: de feed zet water
 * vooraan en daar is genoeg van om de rij te vullen voordat er één
 * landactiviteit aan bod komt.
 *
 * 'activities' telt dubbel omdat ClubTickets land én watersport onder dat ene
 * type schaart -- jetski's en SUP staan naast buggy's, quads en jeepsafari's --
 * zodat een gelijke verdeling alsnog overwegend nat uitpakt.
 */
function weave<T>(buckets: { rows: T[]; weight: number }[], max: number): T[] {
  const out: T[] = []
  const at = buckets.map(() => 0)
  for (;;) {
    const before = out.length
    buckets.forEach((b, bi) => {
      for (let w = 0; w < b.weight && out.length < max; w++) {
        if (at[bi] < b.rows.length) out.push(b.rows[at[bi]++])
      }
    })
    if (out.length >= max || out.length === before) return out
  }
}

/**
 * Bouwt beide dagenlijsten op vanaf een begindatum.
 *
 * `fromNight` en `fromDay` zijn bewust twee aparte parameters. Clubavonden
 * staan in de feed op hun begindatum en lopen door tot een uur of zes 's
 * ochtends, dus tussen middernacht en 06:00 begint de clubreeks nog bij de
 * avond die op dat moment loopt terwijl de excursiereeks al bij de nieuwe
 * kalenderdag begint -- een boottocht van gisterochtend hoeft daar niet meer
 * tussen te staan. Zie ibizaTonight() en ibizaToday().
 *
 * Anders dan de vorige versie in page.tsx worden lege dagen NIET weggefilterd.
 * De dagkiezer toont zeven knoppen, en een dag zonder programma hoort daar als
 * lege knop tussen te staan in plaats van de week te laten verspringen.
 */
export async function buildHomeDays(
  locale: string,
  fromNight: string,
  fromDay: string,
  count = 7,
): Promise<{ clubDays: ClubDay[]; experienceDays: ExperienceDay[] }> {
  const [allDates, venues] = await Promise.all([getAllDates(locale), getVenues(locale)])

  const typeBySlug = new Map(venues.map(v => [v.slug, (v as any).type?.slug || '']))
  const clubbingSlugs = new Set(
    venues.filter(v => ((v as any).type?.slug || '') === 'clubbing').map(v => v.slug),
  )

  const onDay = (iso: string) => allDates.filter(d => (d.date || '').slice(0, 10) === iso)

  const mapDate = (d: any) => ({
    id: d.id,
    name: d.name,
    date: d.date,
    prices: d.prices,
    ct_events: {
      name: d.eventName,
      slug: d.eventSlug,
      logo: d.eventLogo,
      cover: pickCover(d.eventCover, d.eventLogo, d.venueCover),
    },
    ct_venues: {
      name: d.venueName,
      slug: d.venueSlug,
      basePath: eventBasePath(typeBySlug.get(d.venueSlug || '')),
      typeSlug: typeBySlug.get(d.venueSlug || '') || '',
    },
  })

  const clubDays: ClubDay[] = Array.from({ length: count }, (_, i) => {
    const iso = addDays(fromNight, i)
    return {
      date: iso,
      // Dezelfde spreiding als de excursies: een club die vier zalen als vier
      // events aanbiedt hoort niet een derde van de avond op te eisen.
      items: spreadByVenue(onDay(iso).filter(d => clubbingSlugs.has(d.venueSlug || '')))
        .slice(0, PER_DAY)
        .map(d => {
          const m = mapDate(d)
          // De clubkaarten hebben basePath en typeSlug niet nodig: ze staan
          // per definitie onder /club-tickets.
          return { ...m, ct_venues: { name: m.ct_venues.name, slug: m.ct_venues.slug } }
        }),
    }
  })

  const experienceDays: ExperienceDay[] = Array.from({ length: count }, (_, i) => {
    const iso = addDays(fromDay, i)
    const rows = onDay(iso)
    const ofType = (t: string) =>
      spreadByVenue(rows.filter(d => (typeBySlug.get(d.venueSlug || '') || '') === t))
    return {
      date: iso,
      items: weave(
        [
          { rows: ofType('activities'), weight: 2 },
          { rows: ofType('boat'), weight: 1 },
          { rows: ofType('formentera-day-trip'), weight: 1 },
        ],
        PER_DAY,
      ).map(mapDate),
    }
  })

  return { clubDays, experienceDays }
}
