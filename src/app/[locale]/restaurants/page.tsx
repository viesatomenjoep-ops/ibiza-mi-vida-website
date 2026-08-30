import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getVenues } from '@/lib/clubtickets'
import { restaurants, byBoat, clubsWithFood, beforeClub, type Restaurant } from '@/lib/restaurants'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { AuthorByline } from '@/components/seo/AuthorByline'

export const revalidate = 3600

const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

type L = Record<string, string>
const t = (m: L, l: string) => m[l] || m.en

const KICKER: L = {
  nl: 'Eten op Ibiza', en: 'Eating on Ibiza', de: 'Essen auf Ibiza',
  es: 'Comer en Ibiza', fr: 'Manger à Ibiza',
}
const TITLE: L = {
  nl: 'Waar wij zelf eten op Ibiza',
  en: 'Where we actually eat on Ibiza',
  de: 'Wo wir auf Ibiza selbst essen',
  es: 'Dónde comemos nosotros en Ibiza',
  fr: 'Où nous mangeons vraiment à Ibiza',
}
const H_BOAT: L = {
  nl: 'Met de boot ernaartoe', en: 'Reachable by boat', de: 'Mit dem Boot erreichbar',
  es: 'A los que se llega en barco', fr: 'Accessibles en bateau',
}
const H_CLUB: L = {
  nl: 'Eten vóór het uitgaan', en: 'Dinner before the club', de: 'Essen vor dem Club',
  es: 'Cenar antes del club', fr: 'Dîner avant le club',
}
const H_ALL: L = {
  nl: 'De hele lijst', en: 'The full list', de: 'Die ganze Liste',
  es: 'La lista completa', fr: 'La liste complète',
}
const MOORING: L = {
  nl: 'Aanleggen', en: 'Mooring', de: 'Anlegen', es: 'Atraque', fr: 'Amarrage',
}
const BEFORE: L = {
  nl: 'Vóór', en: 'Before', de: 'Vor', es: 'Antes de', fr: 'Avant',
}

function answer(l: string, n: number, boats: number, clubs: number): string {
  const m: L = {
    nl: `Dit is geen restaurantgids. Er staan meer dan duizend zaken op Ibiza en die vind je al op TripAdvisor en Google. Dit zijn de ${n} zaken waar wij zelf komen, met één ding erbij dat op die platforms niet staat: bij ${boats} ervan kun je varend aankomen en staat erbij waar je aanlegt, en ${clubs} passen als diner vóór een specifieke clubavond. Geen sterren, geen overgenomen reviews, geen openingstijden — die veranderen per seizoen en een verkeerde tijd stuurt je voor een dichte deur.`,
    en: `This is not a restaurant guide. Ibiza has over a thousand places and they are already on TripAdvisor and Google. These are the ${n} we eat at ourselves, with one thing those platforms do not carry: ${boats} of them can be reached by boat and we say where you moor, and ${clubs} work as dinner before a specific club night. No stars, no borrowed reviews, no opening hours — those shift by season and a wrong one sends you to a closed door.`,
    de: `Das ist kein Restaurantführer. Ibiza hat über tausend Lokale und die stehen längst auf TripAdvisor und Google. Das hier sind die ${n}, in denen wir selbst essen, mit einem Zusatz, den diese Plattformen nicht haben: ${boats} davon erreichst du mit dem Boot und wir sagen, wo du anlegst, und ${clubs} passen als Abendessen vor einer bestimmten Clubnacht. Keine Sterne, keine übernommenen Bewertungen, keine Öffnungszeiten — die ändern sich je Saison und eine falsche schickt dich vor eine geschlossene Tür.`,
    es: `Esto no es una guía de restaurantes. Ibiza tiene más de mil y ya están en TripAdvisor y Google. Estos son los ${n} en los que comemos nosotros, con algo que esas plataformas no tienen: a ${boats} de ellos se llega en barco y decimos dónde se atraca, y ${clubs} funcionan como cena antes de una noche concreta de club. Sin estrellas, sin reseñas prestadas, sin horarios — cambian según la temporada y uno equivocado te manda a una puerta cerrada.`,
    fr: `Ce n'est pas un guide de restaurants. Ibiza en compte plus de mille et ils sont déjà sur TripAdvisor et Google. Voici les ${n} où nous mangeons nous-mêmes, avec une chose que ces plateformes n'ont pas : ${boats} d'entre eux sont accessibles en bateau et nous indiquons où l'on amarre, et ${clubs} conviennent pour dîner avant une soirée précise. Pas d'étoiles, pas d'avis empruntés, pas d'horaires — ils changent selon la saison et un mauvais horaire vous envoie devant une porte close.`,
  }
  return t(m, l)
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const l = loc(params.locale)
  const desc: L = {
    nl: 'De zaken waar wij zelf eten, met waar je aanlegt als je varend komt en welke passen vóór een clubavond. Geen overgenomen reviews.',
    en: 'The places we eat at ourselves, with where to moor if you arrive by boat and which ones work before a club night. No borrowed reviews.',
    de: 'Die Lokale, in denen wir selbst essen, mit Anlegestelle für Bootsgäste und passend vor einer Clubnacht. Keine übernommenen Bewertungen.',
    es: 'Los sitios donde comemos nosotros, con dónde atracar si llegas en barco y cuáles funcionan antes de una noche de club. Sin reseñas prestadas.',
    fr: "Les adresses où nous mangeons, avec le point d'amarrage si vous venez en bateau et celles qui conviennent avant une soirée. Sans avis empruntés.",
  }
  return pageMetadata({ locale: l, path: 'restaurants', title: t(TITLE, l), description: t(desc, l) })
}

function Card({ r, l, clubName }: { r: Restaurant; l: string; clubName?: (s: string) => string }) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-serif text-lg font-black leading-snug text-neutral-900">{r.name}</h3>
        <span className="text-sm text-neutral-500">{r.area}</span>
        {r.price ? (
          <span className="text-sm font-bold text-neutral-400" aria-hidden>{'€'.repeat(r.price)}</span>
        ) : null}
      </div>

      {r.image ? (
        <figure className="mt-3">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-ibiza-mint">
            <Image src={r.image.src} alt={r.image.alt[l as Locale]} fill sizes="(max-width:768px) 100vw, 560px" className="object-cover" />
          </div>
          <figcaption className="mt-1.5 text-[11px] text-neutral-500">{r.image.credit}</figcaption>
        </figure>
      ) : null}

      <p className="mt-2.5 leading-relaxed text-neutral-700">{r.note[l as Locale]}</p>

      {r.byBoat ? (
        <p className="mt-3 rounded-xl border-l-2 border-ibiza-green bg-ibiza-mint/60 px-3.5 py-2.5 text-sm leading-relaxed text-neutral-700">
          <span className="font-serif text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            {t(MOORING, l)}
          </span>
          <br />
          {r.byBoat.mooring[l as Locale]}
        </p>
      ) : null}

      {r.beforeClubs?.length && clubName ? (
        <p className="mt-3 text-sm text-neutral-600">
          <span className="font-bold">{t(BEFORE, l)}:</span>{' '}
          {r.beforeClubs.map((slug, i) => (
            <span key={slug}>
              {i > 0 ? ', ' : ''}
              <Link href={`/${l}/club-tickets/${slug}`} className="text-neutral-900 underline decoration-black/20 underline-offset-2 hover:decoration-ibiza-green">
                {clubName(slug)}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </article>
  )
}

/**
 * "Waar eten we op Ibiza" — de doorsnede, niet de gids.
 *
 * De pagina bestaat alleen zolang er iets eerstehands te vertellen is. Bij een
 * lege lijst geeft hij een 404 in plaats van een skelet: een gepubliceerde lege
 * gids is slechter dan geen gids, want hij nodigt een antwoordmachine uit iets
 * te citeren wat er niet staat, en hij verwatert een site die verder scherp
 * over nachtleven en boten gaat.
 *
 * Om dezelfde reden staat hij nog niet in de sitemap of het menu. Zodra
 * lib/restaurants.ts gevuld is, moet dat er alsnog bij.
 */
export default async function RestaurantsPage({ params }: { params: { locale: string } }) {
  const l = loc(params.locale)
  if (restaurants.length === 0) notFound()

  const venues = await getVenues(params.locale)
  const nameOf = new Map(venues.map(v => [v.slug, v.name]))
  const clubName = (slug: string) => nameOf.get(slug) || slug

  const boats = byBoat()
  const clubSlugs = clubsWithFood().filter(s => nameOf.has(s))

  return (
    <main className="bg-white text-neutral-900">
      <BreadcrumbJsonLd locale={l} items={[{ name: homeLabel(l), path: `${l}` }, { name: t(TITLE, l) }]} />

      <section className="mx-auto max-w-3xl px-4 pb-10 pt-[calc(var(--nav-h)+48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{t(KICKER, l)}</p>
        <h1 className="mt-3 font-serif text-[2rem] font-black leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
          {t(TITLE, l)}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-neutral-800">
          {answer(l, restaurants.length, boats.length, clubSlugs.length)}
        </p>
      </section>

      {boats.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pb-12">
          <h2 className="font-serif text-2xl font-black tracking-tight">{t(H_BOAT, l)}</h2>
          <div className="mt-5 space-y-4">
            {boats.map(r => <Card key={r.slug} r={r} l={l} clubName={clubName} />)}
          </div>
        </section>
      )}

      {clubSlugs.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pb-12">
          <h2 className="font-serif text-2xl font-black tracking-tight">{t(H_CLUB, l)}</h2>
          {clubSlugs.map(slug => (
            <div key={slug} className="mt-6">
              <h3 className="font-serif text-lg font-black text-neutral-900">{clubName(slug)}</h3>
              <div className="mt-3 space-y-4">
                {beforeClub(slug).map(r => <Card key={r.slug} r={r} l={l} />)}
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 pb-14">
        <h2 className="font-serif text-2xl font-black tracking-tight">{t(H_ALL, l)}</h2>
        <div className="mt-5 space-y-4">
          {restaurants.map(r => <Card key={r.slug} r={r} l={l} clubName={clubName} />)}
        </div>
      </section>

      <AuthorByline locale={l} topic="eating on Ibiza" />
    </main>
  )
}
