import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { ctBrowseLink } from '@/lib/ct-link'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'es'
const PAGE_KEY = 'entradas-discotecas-ibiza'

/**
 * Página pilar en español. No es una traducción de la inglesa.
 *
 * El visitante que busca en español suele llegar desde la península y con otra
 * pregunta: no "cuánto cuesta" sino "por qué cuesta eso", porque el precio de
 * una entrada aquí no se parece al de una sala en Madrid o Barcelona. Ese es el
 * tema de esta página. Quien viene de fuera de España tampoco sabe que la
 * temporada manda: fuera de julio y agosto la misma sala es otra cosa.
 *
 * La versión inglesa responde sobre todo "cuánto cuesta", la neerlandesa "es
 * fiable", la alemana "cuándo comprar". Las cuatro son ciertas; juntarlas en
 * una sola página no responde bien a ninguna.
 *
 * Los rangos son mercado observable, no nuestra tarifa: revendemos a través de
 * ClubTickets y una temporada de precios dinámicos convierte "nuestro precio"
 * en una promesa que no podríamos sostener.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Entradas discotecas Ibiza 2026',
    description:
      'Entradas para discotecas de Ibiza 2026: 20–30 € entre semana, 50–125 €+ para un cabeza de cartel en UNVRS, Hï o Ushuaïa. Precios reales y temporada.',
    alternates: localizedAlternates('club-tickets-hub', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Entradas discotecas Ibiza 2026',
      description: 'Lo que cuesta entrar en Ibiza, y por qué no se parece a una sala de la península.',
      locale: 'es_ES',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Entradas discotecas Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Entradas discotecas Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: '¿Cuánto cuesta entrar en una discoteca de Ibiza?',
    a: 'Son dos mundos distintos. Una noche entre semana en una sala pequeña ronda los 20 a 30 €. Un cabeza de cartel en UNVRS, Hï Ibiza o Ushuaïa va de 50 a 125 € y más, según el artista y con cuánta antelación compres. El precio es dinámico: la misma entrada cuesta más en la última semana que en abril, y la tarifa más barata se agota primero.',
  },
  {
    q: '¿Por qué es más caro que una sala de la península?',
    a: 'Porque no es lo mismo. Aquí pagas por un cartel internacional en una sala construida para ese formato, con una temporada de cinco meses en la que la isla multiplica su población. En Madrid o Barcelona una sala programa todo el año y reparte sus costes; en Ibiza julio y agosto pagan el resto del calendario. Eso también explica por qué mayo, junio, septiembre y octubre son bastante más baratos con carteles muy parecidos.',
  },
  {
    q: '¿Compro online o en la puerta?',
    a: 'Online, por dos motivos que no tienen que ver con el precio. Tienes entrada garantizada una noche que puede agotarse, y pagas la tarifa oficial en lugar de lo que te pida alguien en la calle. La taquilla no es fiablemente más barata y en una noche llena la puerta simplemente está cerrada.',
  },
  {
    q: '¿Es oficial o es reventa?',
    a: 'Oficial. Somos partner de ClubTickets, que vende directamente para las salas, así que no compras una entrada de segunda mano: un QR revendido puede estar ya escaneado y entonces te quedas fuera. La otra cara de lo mismo: nunca somos más baratos que la propia discoteca.',
  },
  {
    q: '¿Qué noches se agotan de verdad?',
    a: 'Las fiestas de apertura de mayo, los closings de finales de septiembre y octubre, y cualquier sábado de agosto con un nombre grande. Un martes de junio normalmente no. Si el viaje gira en torno a una noche concreta, compra esa entrada cuando reserves el vuelo, no al aterrizar.',
  },
  {
    q: '¿Cuál es el código de vestimenta?',
    a: 'Menos estricto de lo que la gente teme y más de lo que se supone en la gama alta. Ropa de playa, camisetas de fútbol y chanclas se rechazan en las salas grandes. Las zapatillas valen en todas partes y nadie necesita americana. Ushuaïa es un club de día junto a la piscina y viste en consecuencia; Hï y UNVRS pasada la medianoche tiran más a ropa de salir.',
  },
  {
    q: '¿A qué hora abren y cierran?',
    a: 'Más tarde de lo habitual. Las salas de noche abren hacia medianoche y siguen hasta las seis de la mañana, con el artista principal normalmente entre las dos y las tres. Ushuaïa es la excepción y funciona de día, desde la tarde hasta cerca de medianoche. Llegar a Hï a las doce es ver un warm-up en una sala vacía.',
  },
  {
    q: '¿Qué incluye la entrada?',
    a: 'El acceso y nada más. Las copas se pagan dentro y son caras: esa es la parte del presupuesto que la gente subestima, no la entrada. Mesas, botellas y lista son cosas aparte; en la página de guestlist explicamos cómo funcionan de verdad.',
  },
  {
    q: '¿Hay edad mínima?',
    a: 'Dieciocho, y se comprueba con documento físico en la puerta de todas las salas grandes. Una foto del DNI o del pasaporte en el móvil no se acepta en la mayoría. Lleva el documento: es ley española, no norma del club, así que en la puerta no hay margen.',
  },
]

const CLUBS = [
  {
    name: 'UNVRS',
    body:
      'La sala más nueva y más grande de la isla, construida para un formato de show que antes pedía un estadio. Nombres grandes y precios grandes: aquí viven las entradas de 125 € para arriba.',
  },
  {
    name: 'Hï Ibiza',
    body:
      'Playa d’en Bossa, arriba en las listas mundiales desde hace años, con dos salas principales que la misma noche suenan distinto. La apuesta segura si solo sales una noche.',
  },
  {
    name: 'Ushuaïa',
    body:
      'La de aire libre, y la única sala grande que funciona de día. De la tarde hasta cerca de medianoche, junto a la piscina, con el público en bañador temprano y de salir más tarde.',
  },
  {
    name: 'Eden',
    body:
      'San Antonio, y la sala sobre la que el oeste monta su noche. Pista grande, cartel amplio, y una noche que cuesta bastante menos que la misma en Playa d’en Bossa.',
  },
  {
    name: 'O Beach',
    body:
      'La versión de día, también en San Antonio: desde mediodía junto a la piscina, con show, y terminada cuando abren las salas de noche. La otra mitad de un día completo, no su rival.',
  },
]

export default function EntradasDiscotecasIbizaPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Entradas discotecas Ibiza 2026"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Cuenta con 20 a 30 € para una noche entre semana en una sala pequeña y de 50 a 125 € o más
              para un cabeza de cartel en UNVRS, Hï Ibiza o Ushuaïa. Si vienes de la península, la
              diferencia sorprende: aquí la temporada son cinco meses y julio y agosto pagan el resto del
              calendario.
            </p>
            <p className="mt-4">
              Por eso mayo, junio, septiembre y octubre salen bastante más baratos con carteles muy
              parecidos. Vendemos como partner de ClubTickets, que trabaja directamente para las salas:
              nunca más barato que la discoteca, pero sin reventa y con alguien en la isla al otro lado.
            </p>
          </>
        }
      >
        <div className="mt-7">
          <AffiliateLink href={ctBrowseLink(LOCALE)} partner="ClubTickets" locale={LOCALE}>
            Ver qué hay esta semana
          </AffiliateLink>
        </div>
      </HubHero>

      <PriceTable
        heading="Lo que cuesta una noche"
        locale={LOCALE}
        caption="Rangos habituales de precio por tipo de noche"
        intro="Rangos de mercado observados, solo entrada, no nuestra tarifa. Las copas van aparte y ahí se va de verdad el presupuesto."
        rows={[
          { label: 'Entre semana, sala pequeña', note: 'Residentes, fuera de temporada alta', amount: 20, unit: 'desde, por persona' },
          { label: 'Fin de semana, noche consolidada', note: 'Eden, Es Paradis, Ushuaïa', amount: 40, unit: 'desde, por persona' },
          { label: 'Cabeza de cartel', note: 'UNVRS, Hï, grandes fechas de Ushuaïa', amount: 50, unit: 'desde, hasta más de 125 €' },
        ]}
      />

      <ItemGrid
        heading="Las salas"
        intro="Cinco salas cubren casi todo aquello por lo que se viene. Son noches realmente distintas, no cinco versiones de la misma."
        items={CLUBS}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-5xl px-4">
          <AffiliateLink href={ctBrowseLink(LOCALE)} partner="ClubTickets" locale={LOCALE}>
            Ver fechas y comprar entradas
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Seguir leyendo"
        locale={LOCALE}
        links={[
          { label: 'Lista y mesas VIP', href: 'guestlist', body: 'Qué significa aquí estar en lista, y qué no.' },
          { label: 'Agenda de clubs de Ibiza', href: 'calendar', body: 'Cada noche con fecha en la isla, por día.' },
          { label: 'Cuánto cuesta una noche', href: 'ibiza-prices', body: 'Precios medidos por sala, de nuestra propia agenda.' },
          { label: 'Cuándo cierra Ibiza', href: 'ibiza-season', body: 'La última noche programada por sala, leída de la agenda.' },
          { label: 'Boat party en Ibiza', href: 'boat-party', body: 'La versión de día, antes de que empiece la noche.' },
          { label: 'Alquiler de coches en Ibiza', href: 'alquiler-coches-ibiza', body: 'Ir a San Antonio y volver sin el recargo del taxi de madrugada.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="entradas para discotecas de Ibiza" />
    </>
  )
}
