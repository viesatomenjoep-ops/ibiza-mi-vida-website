import type { Metadata } from 'next'
import Link from 'next/link'
import { getSeasonStats, type SeasonStats } from '@/lib/season-stats'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { localeTag } from '@/lib/date-label'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { DatasetJsonLd } from '@/components/seo/DatasetJsonLd'
import { AuthorByline } from '@/components/seo/AuthorByline'

export const revalidate = 3600

const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

type L = Record<string, string>
const t = (m: L, l: string) => m[l] || m.en

const KICKER: L = {
  nl: 'Het seizoen', en: 'The season', de: 'Die Saison', es: 'La temporada', fr: 'La saison',
}
const TITLE: L = {
  nl: 'Wanneer sluit Ibiza? Welke clubs zijn nog open',
  en: 'When does Ibiza close? Which clubs are still open',
  de: 'Wann schließt Ibiza? Welche Clubs noch offen sind',
  es: '¿Cuándo cierra Ibiza? Qué clubs siguen abiertos',
  fr: 'Quand Ibiza ferme-t-elle ? Quels clubs sont encore ouverts',
}
const H_TABLE: L = {
  nl: 'Laatste geplande avond per club', en: 'Last scheduled night per club',
  de: 'Letzte geplante Nacht pro Club', es: 'Última noche programada por club',
  fr: 'Dernière soirée programmée par club',
}
const H_MONTHS: L = {
  nl: 'Hoeveel er per maand open is', en: 'How much is open each month',
  de: 'Was pro Monat geöffnet ist', es: 'Cuánto hay abierto cada mes',
  fr: 'Ce qui est ouvert chaque mois',
}
const H_CAVEAT: L = {
  nl: 'Wat dit wel en niet zegt', en: 'What this does and does not tell you',
  de: 'Was das aussagt und was nicht', es: 'Lo que esto dice y lo que no',
  fr: "Ce que cela dit et ne dit pas",
}
const TH_CLUB: L = { nl: 'Club', en: 'Club', de: 'Club', es: 'Club', fr: 'Club' }
const TH_LAST: L = {
  nl: 'Laatste avond', en: 'Last night', de: 'Letzte Nacht', es: 'Última noche', fr: 'Dernière soirée',
}
const TH_LEFT: L = {
  nl: 'Nog te gaan', en: 'Still to come', de: 'Noch übrig', es: 'Aún por venir', fr: 'À venir',
}
const TH_MONTH: L = { nl: 'Maand', en: 'Month', de: 'Monat', es: 'Mes', fr: 'Mois' }
const TH_CLUBS: L = { nl: 'Clubs', en: 'Clubs', de: 'Clubs', es: 'Clubs', fr: 'Clubs' }
const TH_NIGHTS: L = {
  nl: 'Clubavonden', en: 'Club nights', de: 'Clubnächte', es: 'Noches', fr: 'Soirées',
}
const FAQ_H: L = {
  nl: 'Veelgestelde vragen', en: 'Frequently asked questions', de: 'Häufige Fragen',
  es: 'Preguntas frecuentes', fr: 'Questions fréquentes',
}

function fmtDay(iso: string, l: string): string {
  const [y, m, d] = String(iso || '').split('-').map(Number)
  if (!y) return iso
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(localeTag(l), {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}
function fmtMonth(ym: string, l: string): string {
  const [y, m] = String(ym || '').split('-').map(Number)
  if (!y) return ym
  const s = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(localeTag(l), {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  })
  // Only English and German capitalise month names.
  return ['en', 'de'].includes(l) ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

function answer(s: SeasonStats, l: string): string {
  const last = s.venues[0]
  const firstToClose = s.venues[s.venues.length - 1]
  const n = s.venues.length
  const m: L = {
    nl: `Van de ${n} clubs in onze agenda sluit ${firstToClose.name} als eerste, met ${fmtDay(firstToClose.lastScheduled, l)} als laatste geplande avond; ${last.name} gaat het langst door, tot ${fmtDay(last.lastScheduled, l)}. Het seizoen dooft dus geleidelijk uit in plaats van op één datum te stoppen. Op dit moment hebben ${s.openNow} clubs nog avonden staan. Dit zijn de data die de clubs zelf gepubliceerd hebben, niet onze schatting.`,
    en: `Of the ${n} clubs in our agenda, ${firstToClose.name} finishes first with ${fmtDay(firstToClose.lastScheduled, l)} as its last scheduled night; ${last.name} runs longest, to ${fmtDay(last.lastScheduled, l)}. The season therefore fades out gradually rather than stopping on one date. Right now ${s.openNow} clubs still have nights on the books. These are the dates the clubs themselves have published, not our estimate.`,
    de: `Von den ${n} Clubs in unserem Kalender endet ${firstToClose.name} zuerst, mit ${fmtDay(firstToClose.lastScheduled, l)} als letzter geplanter Nacht; ${last.name} macht am längsten weiter, bis ${fmtDay(last.lastScheduled, l)}. Die Saison läuft also allmählich aus statt an einem Datum zu enden. Aktuell haben ${s.openNow} Clubs noch Termine stehen. Das sind die von den Clubs selbst veröffentlichten Daten, keine Schätzung von uns.`,
    es: `De los ${n} clubs de nuestra agenda, ${firstToClose.name} termina primero, con ${fmtDay(firstToClose.lastScheduled, l)} como última noche programada; ${last.name} es el que más aguanta, hasta el ${fmtDay(last.lastScheduled, l)}. La temporada se apaga por tanto poco a poco en lugar de parar en una sola fecha. Ahora mismo ${s.openNow} clubs siguen teniendo noches en agenda. Son las fechas que los propios clubs han publicado, no una estimación nuestra.`,
    fr: `Sur les ${n} clubs de notre agenda, ${firstToClose.name} termine en premier, avec le ${fmtDay(firstToClose.lastScheduled, l)} comme dernière soirée programmée ; ${last.name} tient le plus longtemps, jusqu'au ${fmtDay(last.lastScheduled, l)}. La saison s'éteint donc progressivement plutôt qu'à une date unique. Actuellement ${s.openNow} clubs ont encore des dates. Ce sont les dates publiées par les clubs eux-mêmes, pas notre estimation.`,
  }
  return t(m, l)
}

function caveat(l: string): string {
  const m: L = {
    nl: 'De laatste avond in deze tabel is de laatste avond die wíj hebben. Dat is niet hetzelfde als "daarna dicht". Clubs kondigen hun closing party ruim van tevoren aan, dus in de praktijk vallen die twee meestal samen — maar een club die zijn laatste data nog niet heeft vrijgegeven ziet er in deze data precies hetzelfde uit. Twijfel je over een specifieke datum, app ons dan even; we checken het bij de club zelf voordat je iets boekt.',
    en: 'The last night in this table is the last night WE hold. That is not the same as "shut after that". Clubs announce their closing party well in advance, so in practice the two usually coincide — but a club that has not yet released its final dates looks identical in this data. If a specific date matters, message us and we will check it with the club before you book anything.',
    de: 'Die letzte Nacht in dieser Tabelle ist die letzte Nacht, die WIR haben. Das ist nicht dasselbe wie "danach geschlossen". Clubs kündigen ihre Closing Party lange vorher an, in der Praxis fällt beides also meist zusammen — aber ein Club, der seine letzten Termine noch nicht veröffentlicht hat, sieht in diesen Daten genauso aus. Wenn ein bestimmtes Datum wichtig ist, schreib uns: wir fragen beim Club nach, bevor du etwas buchst.',
    es: 'La última noche de esta tabla es la última noche que TENEMOS nosotros. No es lo mismo que "cerrado a partir de ahí". Los clubs anuncian su closing con mucha antelación, así que en la práctica suelen coincidir — pero un club que aún no ha publicado sus últimas fechas se ve exactamente igual en estos datos. Si una fecha concreta te importa, escríbenos y lo confirmamos con el club antes de que reserves nada.',
    fr: "La dernière soirée de ce tableau est la dernière soirée que NOUS avons. Ce n'est pas la même chose que « fermé ensuite ». Les clubs annoncent leur closing longtemps à l'avance, donc en pratique les deux coïncident généralement — mais un club qui n'a pas encore publié ses dernières dates paraît identique dans ces données. Si une date précise compte, écrivez-nous : nous vérifions auprès du club avant que vous réserviez.",
  }
  return t(m, l)
}

function faqs(s: SeasonStats, l: string): { q: string; a: string }[] {
  const last = s.venues[0]
  const firstToClose = s.venues[s.venues.length - 1]
  const oct = s.months.find(m => m.month.endsWith('-10'))
  const out: { q: string; a: string }[] = []
  const add = (q: L, a: L) => out.push({ q: t(q, l), a: t(a, l) })

  add(
    { nl: 'Wanneer sluit het clubseizoen op Ibiza?', en: 'When does the Ibiza club season end?', de: 'Wann endet die Clubsaison auf Ibiza?', es: '¿Cuándo termina la temporada de clubs en Ibiza?', fr: "Quand se termine la saison des clubs à Ibiza ?" },
    {
      nl: `De laatste geplande clubavond in onze agenda is ${fmtDay(last.lastScheduled, l)}, bij ${last.name}. De eerste clubs sluiten al vanaf ${fmtDay(firstToClose.lastScheduled, l)}, dus het seizoen dooft geleidelijk uit in plaats van op één datum te stoppen.`,
      en: `The last scheduled club night in our agenda is ${fmtDay(last.lastScheduled, l)}, at ${last.name}. The first clubs finish as early as ${fmtDay(firstToClose.lastScheduled, l)}, so the season fades out gradually rather than stopping on one date.`,
      de: `Die letzte geplante Clubnacht in unserem Kalender ist ${fmtDay(last.lastScheduled, l)} bei ${last.name}. Die ersten Clubs schließen schon ab ${fmtDay(firstToClose.lastScheduled, l)}, die Saison läuft also allmählich aus statt an einem Datum zu enden.`,
      es: `La última noche programada en nuestra agenda es el ${fmtDay(last.lastScheduled, l)}, en ${last.name}. Los primeros clubs cierran ya desde el ${fmtDay(firstToClose.lastScheduled, l)}, así que la temporada se apaga poco a poco en lugar de parar en una sola fecha.`,
      fr: `La dernière soirée programmée dans notre agenda est le ${fmtDay(last.lastScheduled, l)}, au ${last.name}. Les premiers clubs terminent dès le ${fmtDay(firstToClose.lastScheduled, l)} : la saison s'éteint progressivement plutôt qu'à une date unique.`,
    },
  )

  if (oct) {
    add(
      { nl: 'Welke clubs zijn in oktober nog open op Ibiza?', en: 'Which clubs are still open in October in Ibiza?', de: 'Welche Clubs haben im Oktober auf Ibiza noch offen?', es: '¿Qué clubs siguen abiertos en octubre en Ibiza?', fr: 'Quels clubs sont encore ouverts en octobre à Ibiza ?' },
      {
        nl: `In oktober staan er nog ${oct.nights} clubavonden gepland bij ${oct.clubs} clubs. De tabel hierboven laat per club zien tot welke datum er geprogrammeerd is.`,
        en: `In October there are still ${oct.nights} club nights scheduled across ${oct.clubs} clubs. The table above shows, per club, the date the programming runs to.`,
        de: `Im Oktober sind noch ${oct.nights} Clubnächte in ${oct.clubs} Clubs geplant. Die Tabelle oben zeigt pro Club, bis wann programmiert ist.`,
        es: `En octubre quedan ${oct.nights} noches programadas en ${oct.clubs} clubs. La tabla de arriba muestra, por club, hasta qué fecha hay programación.`,
        fr: `En octobre il reste ${oct.nights} soirées programmées dans ${oct.clubs} clubs. Le tableau ci-dessus indique, par club, jusqu'à quelle date la programmation va.`,
      },
    )
  }

  add(
    { nl: 'Is Ibiza in de winter helemaal dicht?', en: 'Is Ibiza completely closed in winter?', de: 'Ist Ibiza im Winter komplett geschlossen?', es: '¿Ibiza está completamente cerrada en invierno?', fr: "Ibiza est-elle complètement fermée en hiver ?" },
    {
      nl: 'De grote clubs sluiten na hun closing party en gaan pas in het voorjaar weer open. Het eiland zelf niet: bars, restaurants en de stranden blijven, en de ferry naar Formentera vaart door. Wij programmeren in die periode geen clubtickets, dus deze pagina toont dan alleen wat er wél is.',
      en: 'The big clubs shut after their closing party and reopen in spring. The island itself does not: bars, restaurants and the beaches stay, and the Formentera ferry keeps running. We list no club tickets in that period, so this page then shows only what genuinely is on.',
      de: 'Die großen Clubs schließen nach ihrer Closing Party und öffnen erst im Frühjahr wieder. Die Insel selbst nicht: Bars, Restaurants und Strände bleiben, und die Fähre nach Formentera fährt weiter. Wir führen in dieser Zeit keine Clubtickets, diese Seite zeigt dann nur, was tatsächlich läuft.',
      es: 'Los grandes clubs cierran tras su closing y no reabren hasta la primavera. La isla no: bares, restaurantes y playas siguen, y el ferry a Formentera continúa. En ese periodo no vendemos entradas de club, así que esta página muestra solo lo que realmente hay.',
      fr: "Les grands clubs ferment après leur closing et rouvrent au printemps. L'île, elle, non : bars, restaurants et plages restent, et le ferry pour Formentera continue. Nous ne proposons pas de billets de club à cette période : cette page n'affiche alors que ce qui a réellement lieu.",
    },
  )

  return out
}

/**
 * "When does Ibiza close?" — read off the agenda instead of recalled.
 *
 * Companion to /ibiza-prices and built on the same principle: the one thing we
 * hold that nobody else does is the published, dated programme for every major
 * venue, so the questions worth writing pages about are the ones that data can
 * answer and a travel blog cannot.
 *
 * The load-bearing caution is in season-stats.ts and repeated in the visible
 * copy: a venue's last scheduled night is the last night WE HAVE, which is not
 * the same as the club being shut afterwards. That distinction is carried in
 * the field name, in the column header, in the answer paragraph and in its own
 * section, because it is the one error here that would actually cost a visitor
 * their night out.
 */
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const l = loc(params.locale)
  const s = await getSeasonStats(params.locale)
  const desc: L = s
    ? {
        nl: `De laatste geplande clubavond is ${fmtDay(s.venues[0].lastScheduled, l)} bij ${s.venues[0].name}. Per club de laatste avond en hoeveel er nog te gaan is, uit de gepubliceerde agenda.`,
        en: `The last scheduled club night is ${fmtDay(s.venues[0].lastScheduled, l)} at ${s.venues[0].name}. Per club: the final night and how much is still to come, from the published agenda.`,
        de: `Die letzte geplante Clubnacht ist ${fmtDay(s.venues[0].lastScheduled, l)} im ${s.venues[0].name}. Pro Club die letzte Nacht und was noch aussteht, aus dem veröffentlichten Kalender.`,
        es: `La última noche programada es el ${fmtDay(s.venues[0].lastScheduled, l)} en ${s.venues[0].name}. Por club: la última noche y lo que queda, según la agenda publicada.`,
        fr: `La dernière soirée programmée est le ${fmtDay(s.venues[0].lastScheduled, l)} au ${s.venues[0].name}. Par club : la dernière soirée et ce qu'il reste, d'après l'agenda publié.`,
      }
    : TITLE
  return pageMetadata({
    locale: l,
    path: 'ibiza-season',
    title: t(TITLE, l),
    description: t(desc, l),
  })
}

export default async function IbizaSeasonPage({ params }: { params: { locale: string } }) {
  const l = loc(params.locale)
  const s = await getSeasonStats(params.locale)

  if (!s) {
    return (
      <main className="bg-white text-neutral-900">
        <section className="mx-auto max-w-3xl px-4 pb-24 pt-[calc(var(--nav-h)+64px)]">
          <h1 className="font-serif text-3xl font-black">{t(TITLE, l)}</h1>
        </section>
      </main>
    )
  }

  const questions = faqs(s, l)

  return (
    <main className="bg-white text-neutral-900">
      <BreadcrumbJsonLd locale={l} items={[{ name: homeLabel(l), path: `${l}` }, { name: t(TITLE, l) }]} />
      <FaqJsonLd faqs={questions} />
      <DatasetJsonLd
        locale={l}
        path="ibiza-season"
        name={`Ibiza club season dates ${s.from.slice(0, 4)}`}
        description={`Scheduled club nights per venue in Ibiza: first and last published date for ${s.venues.length} clubs, and how many nights each month holds. Read off a live ticketing agenda.`}
        from={s.from}
        to={s.to}
        variable="Scheduled club nights per venue, with first and last published date"
        observations={s.venues.reduce((n, v) => n + v.upcoming, 0)}
        technique="Read off the published agenda of an official ticketing partner; the last date held is not proof a venue closes after it."
      />

      <section className="mx-auto max-w-3xl px-4 pb-10 pt-[calc(var(--nav-h)+48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{t(KICKER, l)}</p>
        <h1 className="mt-3 font-serif text-[2rem] font-black leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
          {t(TITLE, l)}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-neutral-800">{answer(s, l)}</p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="font-serif text-2xl font-black tracking-tight">{t(H_TABLE, l)}</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/15 text-[11px] font-black uppercase tracking-widest text-neutral-600">
                <th scope="col" className="py-2 pr-3 font-black">{t(TH_CLUB, l)}</th>
                <th scope="col" className="py-2 px-3 font-black">{t(TH_LAST, l)}</th>
                <th scope="col" className="py-2 pl-3 text-right font-black">{t(TH_LEFT, l)}</th>
              </tr>
            </thead>
            <tbody>
              {s.venues.map(v => (
                <tr key={v.slug} className="border-b border-black/5">
                  <th scope="row" className="py-2.5 pr-3 font-semibold">
                    <Link href={`/${l}/club-tickets/${v.slug}`} className="flex items-center gap-2.5 text-neutral-900 hover:text-ibiza-green">
                      {/* Vaste doos, zodat een breed en een smal merk dezelfde
                          voetafdruk krijgen en de namen op één lijn blijven. */}
                      {v.logo ? (
                        <span className="relative hidden h-5 w-14 shrink-0 items-center justify-start sm:inline-flex">
                          <img
                            src={v.logo}
                            alt=""
                            aria-hidden
                            className="max-h-full max-w-full object-contain object-left opacity-75 brightness-0"
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                      ) : null}
                      <span className="underline decoration-black/20 underline-offset-2">{v.name}</span>
                    </Link>
                  </th>
                  <td className="py-2.5 px-3 font-semibold tabular-nums text-ibiza-green">{fmtDay(v.lastScheduled, l)}</td>
                  <td className="py-2.5 pl-3 text-right tabular-nums text-neutral-600">{v.upcoming}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="font-serif text-2xl font-black tracking-tight">{t(H_MONTHS, l)}</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/15 text-[11px] font-black uppercase tracking-widest text-neutral-600">
                <th scope="col" className="py-2 pr-3 font-black">{t(TH_MONTH, l)}</th>
                <th scope="col" className="py-2 px-3 font-black">{t(TH_CLUBS, l)}</th>
                <th scope="col" className="py-2 pl-3 text-right font-black">{t(TH_NIGHTS, l)}</th>
              </tr>
            </thead>
            <tbody>
              {s.months.map(m => (
                <tr key={m.month} className="border-b border-black/5">
                  <th scope="row" className="py-2.5 pr-3 font-semibold">{fmtMonth(m.month, l)}</th>
                  <td className="py-2.5 px-3 tabular-nums">{m.clubs}</td>
                  <td className="py-2.5 pl-3 text-right tabular-nums text-neutral-600">{m.nights}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="font-serif text-2xl font-black tracking-tight">{t(H_CAVEAT, l)}</h2>
        <p className="mt-4 leading-relaxed text-neutral-700">{caveat(l)}</p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14">
        <h2 className="font-serif text-2xl font-black tracking-tight">{t(FAQ_H, l)}</h2>
        <div className="mt-5 space-y-6">
          {questions.map(f => (
            <div key={f.q}>
              <h3 className="font-serif text-lg font-black leading-snug">{f.q}</h3>
              <p className="mt-1.5 leading-relaxed text-neutral-700">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <AuthorByline locale={l} topic="the Ibiza club season" />
    </main>
  )
}
