import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'
import { BeachClubs } from '@/components/beach/BeachClubs'
import { PageFaq } from '@/components/seo/PageFaq'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { ItemListJsonLd, type ListEntry } from '@/components/seo/ItemListJsonLd'
import { ALL_BEACH_CLUBS, BEACH_AREAS } from '@/lib/beach-clubs'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return staticMetadata(params.locale, 'beach-clubs')
}

const CRUMB: Record<Locale, string> = {
  nl: 'Beachclubs',
  en: 'Beach clubs',
  de: 'Beachclubs',
  es: 'Beach clubs',
  fr: 'Beach clubs',
}

const H1: Record<Locale, string> = {
  nl: 'Beachclubs, ligbedden en VIP-bedden op Ibiza',
  en: 'Beach clubs, sunbeds and VIP beds in Ibiza',
  de: 'Beachclubs, Liegen und VIP-Betten auf Ibiza',
  es: 'Beach clubs, hamacas y camas VIP en Ibiza',
  fr: 'Beach clubs, transats et lits VIP à Ibiza',
}

const LEAD: Record<Locale, string> = {
  nl: 'Van Cala Bassa tot Ses Salines, van Playa d’en Bossa tot Benirràs: welke beachclub bij je past, hangt af van de wind, het gezelschap en de tijd van het jaar. Hieronder de bekendste adressen per gebied, met eerlijke kanttekeningen — en hulp om er een kloppende dag van te maken.',
  en: 'From Cala Bassa to Ses Salines, from Playa d’en Bossa to Benirràs: which beach club suits you depends on the wind, the company and the time of year. Below are the island’s best-known addresses by area, with honest caveats — and help turning it into a day that actually works.',
  de: 'Von der Cala Bassa bis Ses Salines, von der Playa d’en Bossa bis Benirràs: Welcher Beachclub zu dir passt, hängt vom Wind, der Gesellschaft und der Jahreszeit ab. Unten die bekanntesten Adressen nach Gebieten, mit ehrlichen Einschränkungen — und Hilfe, daraus einen stimmigen Tag zu machen.',
  es: 'De Cala Bassa a Ses Salines, de Playa d’en Bossa a Benirràs: qué beach club te encaja depende del viento, de la compañía y de la época del año. Abajo, las direcciones más conocidas por zonas, con matices honestos — y ayuda para que el día cuadre.',
  fr: 'De Cala Bassa à Ses Salines, de Playa d’en Bossa à Benirràs : le beach club qui vous convient dépend du vent, de la compagnie et de la saison. Voici les adresses les plus connues par zone, avec des réserves honnêtes — et de l’aide pour en faire une journée qui tient.',
}

const COUNT_CLUBS: Record<Locale, string> = {
  nl: 'beachclubs', en: 'beach clubs', de: 'Beachclubs', es: 'beach clubs', fr: 'beach clubs',
}
const COUNT_AREAS: Record<Locale, string> = {
  nl: 'gebieden', en: 'areas', de: 'Gebiete', es: 'zonas', fr: 'zones',
}

const LIST_NAME: Record<Locale, string> = {
  nl: 'Beachclubs en ligbedden op Ibiza',
  en: 'Beach clubs and sunbeds in Ibiza',
  de: 'Beachclubs und Liegen auf Ibiza',
  es: 'Beach clubs y hamacas en Ibiza',
  fr: 'Beach clubs et transats à Ibiza',
}

export default function BeachClubsPage({ params: { locale } }: { params: { locale: string } }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  // Each club resolves to its own anchor on this page — a real, reachable URL.
  // No third-party sites are linked anywhere: see the guardrails in
  // @/lib/beach-clubs for why.
  const entries: ListEntry[] = ALL_BEACH_CLUBS.map((c) => ({
    name: c.name,
    path: `${l}/beach-clubs#club-${c.id}`,
  }))

  return (
    <>
      <BreadcrumbJsonLd
        locale={l}
        items={[{ name: homeLabel(l), path: '' }, { name: CRUMB[l] }]}
      />
      <ItemListJsonLd entries={entries} locale={l} name={LIST_NAME[l]} maxItems={40} />

      <section className="bg-white pt-28 pb-4 text-neutral-900 md:pt-32">
        <div className="mx-auto max-w-5xl px-4">
          <p className="font-serif text-[12px] font-bold uppercase tracking-[0.24em] text-gold">
            Ibiza
          </p>
          <h1 className="mt-3 font-serif text-3xl font-black leading-tight tracking-tight md:text-5xl">
            {H1[l]}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-neutral-600">{LEAD[l]}</p>
          <p className="mt-4 text-[13px] font-semibold uppercase tracking-wide text-neutral-500">
            {ALL_BEACH_CLUBS.length} {COUNT_CLUBS[l]} · {BEACH_AREAS.length} {COUNT_AREAS[l]}
          </p>
        </div>
      </section>

      <BeachClubs locale={l} />
      <PageFaq pageKey="beach-clubs" locale={l} />
      <AuthorByline locale={l} topic="beach clubs and sunbeds in Ibiza" />
    </>
  )
}
