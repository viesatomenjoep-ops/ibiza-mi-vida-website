import Link from 'next/link'
import { Plane, FileCheck, CalendarDays } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { US_NONSTOP, nonstopBookable, usDate } from '@/lib/us-travel'

/**
 * Homepage entry point to the American-traveler cluster.
 *
 * ── Why it renders on /en only ────────────────────────────────────────────
 * The four US pages exist in English alone (ROUTE_LOCALES['us-hub'] = ['en']).
 * Linking to them from the Dutch or German homepage would either 301 through
 * a translated slug that does not render — and link value evaporates in a
 * redirect — or send a visitor content written for a different audience.
 * So this returns null for every other locale instead of linking sideways.
 *
 * ── Why the flight fact lives in us-travel.ts ─────────────────────────────
 * The hook is United's announced Newark nonstop. It is ANNOUNCED, not on
 * sale, and the copy below says so by reading `status`. The day it goes on
 * sale, one field in src/lib/us-travel.ts rewrites this band, the hub, the
 * flights page and llms.txt together. Never type the date or the status here.
 *
 * ── Why it is this small ──────────────────────────────────────────────────
 * A homepage promo block does not carry the whole pitch (see CLAUDE.md): the
 * hub and its three spokes already hold the detail. This is a name, one fact,
 * three doors and a button.
 *
 * Own light background, because `body` is dark and a block without one
 * inherits it — dark text on near-black is the failure this rule exists for.
 */

const SPOKES = [
  {
    icon: Plane,
    href: '/en/flights-to-ibiza-from-usa',
    title: 'Flights from the US',
    body: 'Where to connect, and how long it takes from your airport.',
  },
  {
    icon: FileCheck,
    href: '/en/ibiza-travel-requirements-us-citizens',
    title: 'What you need',
    body: 'Passport, ETIAS status and the driving permit Spain requires.',
  },
  {
    icon: CalendarDays,
    href: '/en/luxury-ibiza-itinerary-5-days',
    title: '5-day luxury plan',
    body: 'Day by day, with costs in euros and dollars.',
  },
]

export function HomeUsBand({ locale }: { locale: string }) {
  if (locale !== 'en') return null

  const ns = US_NONSTOP[0]
  const lead = !ns
    ? 'Every US departure connects once, usually in Madrid or Barcelona: 11 to 13 hours from New York, 15 to 18 from the West Coast.'
    : nonstopBookable()
      ? `${ns.airline} now flies nonstop from ${ns.from.city} to Ibiza, around eight hours. From everywhere else in the States you connect once, usually in Madrid or Barcelona.`
      : `${ns.airline} has announced the first nonstop between the United States and Ibiza, from ${ns.from.city} (${ns.from.iata}) starting ${usDate(ns.starts)} — announced, not yet on sale. Until then every US departure connects once, 11 to 13 hours from New York.`

  return (
    <section className="border-t border-black/5 bg-white py-16 text-neutral-900">
      <Reveal className="mx-auto max-w-5xl px-4">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.28em] text-neutral-900">
          Travelling from the United States
        </span>
        <h2 className="mt-3 max-w-3xl font-serif text-[1.625rem] font-black tracking-tight md:text-4xl">
          Ibiza for American travelers
        </h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">{lead}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SPOKES.map((s) => {
            const Icon = s.icon
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-[22px] border border-neutral-200/90 bg-[#FAF8F5] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black/30 hover:bg-white"
              >
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/5 text-[#141414] ring-1 ring-black/15 transition-colors duration-300 group-hover:bg-[#141414] group-hover:text-white">
                  <Icon size={20} strokeWidth={2} />
                </span>
                <h3 className="font-serif text-base font-black leading-snug">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.body}</p>
              </Link>
            )
          })}
        </div>

        <Link
          href="/en/ibiza-for-americans"
          className="mt-8 inline-flex items-center rounded-full bg-neutral-900 px-7 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-neutral-700"
        >
          The complete US traveler&apos;s guide →
        </Link>
      </Reveal>
    </section>
  )
}
