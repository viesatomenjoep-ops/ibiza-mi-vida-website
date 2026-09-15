import Link from 'next/link'
import { US_NONSTOP, GATEWAYS, ETIAS, usDate, type FxRate } from '@/lib/us-travel'

/**
 * Building blocks shared by the four American-traveler pages. Server
 * components only: these render facts into HTML that a crawler reads without
 * JavaScript, which is the whole point of the cluster.
 *
 * American English throughout — "traveler", "license", "airplane". The rest
 * of the site writes British English; these pages are written for a US
 * reader and an answer engine matching a US query, and mixed spelling reads
 * as machine-translated.
 */

const STATUS_LABEL: Record<(typeof US_NONSTOP)[number]['status'], string> = {
  announced: 'Announced, not yet on sale',
  'on-sale': 'On sale',
  flying: 'Flying',
}

/**
 * The nonstop table, or the "not yet" paragraph when nothing is on sale.
 * Both branches print the verification date, because the single most useful
 * thing this section can tell a reader in 2027 is whether it is current.
 */
export function NonstopStatus({ heading = 'Nonstop flights from the US to Ibiza' }: { heading?: string }) {
  const rows = US_NONSTOP
  const asOf = rows.reduce((m, r) => (r.asOf > m ? r.asOf : m), '')
  return (
    <section id="nonstop" className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{heading}</h2>
        {rows.length === 0 ? (
          <p className="mt-4 text-[16px] leading-relaxed text-neutral-700">
            No airline has a nonstop flight between the United States and Ibiza on sale. Every US departure
            connects once, in Madrid, Barcelona, Lisbon or London. We list a nonstop here the day an airline
            puts one on sale. Last checked {asOf ? usDate(asOf) : 'recently'}.
          </p>
        ) : (
          <>
            <p className="mt-4 text-[16px] leading-relaxed text-neutral-700">
              {rows.every((r) => r.status === 'announced')
                ? `A nonstop has been announced but is not bookable yet. Until it goes on sale, every US departure connects once, in Madrid, Barcelona, Lisbon or London. Status last checked ${usDate(asOf)}.`
                : `These are the nonstop routes between the United States and Ibiza. Status last checked ${usDate(asOf)}.`}
            </p>
            <div className="mt-7 overflow-x-auto rounded-2xl border border-black/8">
              <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
                <caption className="sr-only">Nonstop flights between the United States and Ibiza</caption>
                <thead>
                  <tr className="border-b border-black/8 bg-neutral-50 font-serif text-[13px] uppercase tracking-wide text-neutral-500">
                    <th scope="col" className="px-4 py-3">Route</th>
                    <th scope="col" className="px-4 py-3">Airline</th>
                    <th scope="col" className="px-4 py-3">First flight</th>
                    <th scope="col" className="px-4 py-3">Frequency</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/8">
                  {rows.map((r) => (
                    <tr key={`${r.from.iata}-${r.airline}`} className="align-top">
                      <th scope="row" className="px-4 py-4 font-serif font-bold text-neutral-900">
                        {r.from.city} ({r.from.iata}) → Ibiza (IBZ)
                      </th>
                      <td className="px-4 py-4">{r.airline}{r.aircraft ? <span className="block text-[13px] text-neutral-500">{r.aircraft}</span> : null}</td>
                      <td className="px-4 py-4">{usDate(r.starts)}</td>
                      <td className="px-4 py-4">{r.frequency}</td>
                      <td className="px-4 py-4">
                        <span className="font-semibold">{STATUS_LABEL[r.status]}</span>
                        {r.note ? <span className="mt-1 block text-[13px] leading-snug text-neutral-500">{r.note}</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

/** One-stop gateways: the table an American reader actually scans for their home airport. */
export function GatewayTable({ heading = 'One-stop connections by US airport' }: { heading?: string }) {
  return (
    <section id="gateways" className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{heading}</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">
          Hours are total travel time with one connection on a typical summer schedule, from the US departure
          to landing in Ibiza. Carriers are the airlines that fly the ocean leg in summer; the short hop from
          Madrid or Barcelona to Ibiza is usually Iberia, Vueling or Air Europa and takes about an hour.
          Schedules change every season, so treat this as where to look, not as a timetable.
        </p>
        <div className="mt-7 overflow-x-auto rounded-2xl border border-black/8">
          <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
            <caption className="sr-only">One-stop connections from US airports to Ibiza</caption>
            <thead>
              <tr className="border-b border-black/8 bg-neutral-50 font-serif text-[13px] uppercase tracking-wide text-neutral-500">
                <th scope="col" className="px-4 py-3">From</th>
                <th scope="col" className="px-4 py-3">Total hours</th>
                <th scope="col" className="px-4 py-3">Connect in</th>
                <th scope="col" className="px-4 py-3">Ocean leg flown by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/8">
              {GATEWAYS.map((g) => (
                <tr key={g.iata} className="align-top">
                  <th scope="row" className="px-4 py-4 font-serif font-bold text-neutral-900">{g.city} ({g.iata})</th>
                  <td className="px-4 py-4 whitespace-nowrap">{g.hours} h</td>
                  <td className="px-4 py-4">{g.via}</td>
                  <td className="px-4 py-4 text-neutral-600">{g.carriers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

/** The footnote under any dollar estimate. Always prints the rate and its date. */
export function RateNote({ fx }: { fx: FxRate }) {
  return (
    <p className="mx-auto mt-6 max-w-3xl px-4 text-[13px] leading-relaxed text-neutral-500">
      Dollar amounts are estimates at €1 = ${fx.rate.toFixed(2)} ({fx.source}, {usDate(fx.asOf)}). Everything on
      the island is priced and charged in euros; your card issuer sets the rate you actually pay.
    </p>
  )
}

/** One sentence on ETIAS that stays correct on either side of its launch. */
export function etiasSentence(): string {
  if (ETIAS.live && ETIAS.since) {
    return `Since ${usDate(ETIAS.since)}, US passport holders need an ETIAS travel authorization before boarding: a €${ETIAS.feeEur} online application valid ${ETIAS.validityYears} years, usually approved in minutes.`
  }
  return `As of ${usDate(ETIAS.asOf)}, US passport holders still enter Spain visa-free with no pre-registration. The EU's ETIAS authorization (a €${ETIAS.feeEur} online form valid ${ETIAS.validityYears} years) is not in force yet; the EU now points to 2027, with a transition period before it becomes mandatory.`
}

/** The cluster's own navigation, so each page links to the other three. */
const CLUSTER: { path: string; label: string; body: string }[] = [
  { path: 'ibiza-for-americans', label: 'Ibiza for Americans: the hub', body: 'Everything a US traveler needs before booking, on one page.' },
  { path: 'flights-to-ibiza-from-usa', label: 'Flights from the US to Ibiza', body: 'The Newark nonstop, and the one-stop routes from ten US airports.' },
  { path: 'ibiza-travel-requirements-us-citizens', label: 'Entry requirements for US citizens', body: 'Passport rules, ETIAS status, the driving permit and what to carry.' },
  { path: 'luxury-ibiza-itinerary-5-days', label: '5-day luxury Ibiza itinerary', body: 'Day by day, with what each part costs in euros and dollars.' },
]

export function UsClusterLinks({ current }: { current: string }) {
  const links = CLUSTER.filter((c) => c.path !== current)
  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">More for American travelers</h2>
        <ul className="mt-7 grid gap-4 md:grid-cols-3">
          {links.map((l) => (
            <li key={l.path} className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
              <Link href={`/en/${l.path}`} className="font-serif text-base font-black leading-snug text-neutral-900 underline-offset-2 hover:underline">
                {l.label}
              </Link>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">{l.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
