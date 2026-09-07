import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { WIBER_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'
const LOCALE: Locale = 'es'
const PAGE_KEY = 'alquiler-descapotable-ibiza'

/**
 * Versión en español. No es una traducción de la inglesa.
 *
 * El enfoque es la hora del día, porque es el error que comete quien no ha
 * pasado un agosto aquí: bajar la capota a las tres de la tarde. Parado en el
 * tráfico, a pleno sol y sin sombra, eso no es un placer sino una insolación.
 *
 * Las horas de capota bajada son primera hora y a partir de las seis, que
 * resulta ser exactamente cuando las carreteras de costa se ven mejor. Quien lo
 * sabe planifica la ruta a esa hora y el coche cumple; quien no, lo lleva
 * cerrado toda la semana y paga el suplemento igual.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Alquiler de descapotable en Ibiza',
    description:
      'Alquilar un descapotable en Ibiza: qué carreteras lo justifican, a qué hora se baja la capota de verdad y qué pega práctica nadie cuenta antes.',
    alternates: localizedAlternates('convertible-rental', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Alquiler de descapotable en Ibiza',
      description: 'Las carreteras que lo justifican y las horas en que de verdad se baja la capota.',
      locale: 'es_ES',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Alquiler de descapotable en Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Alquiler de coches Ibiza', path: 'alquiler-coches-ibiza' },
  { name: 'Descapotable' },
]

const FAQS: Faq[] = [
  { q: '¿No hace demasiado calor con la capota bajada?', a: 'A media tarde de julio, sinceramente sí: estás parado en el tráfico, a pleno sol y sin sombra. Las horas de capota bajada aquí son primera hora de la mañana y a partir de las seis, que es justo cuando las carreteras de costa se ven mejor. Planifica la ruta a esa hora y el coche cumple; hazlo a las tres y lo llevarás cerrado como cualquier otro.' },
  { q: '¿Merece la pena un descapotable en Ibiza?', a: 'Para las carreteras de costa sí. El tramo de Sant Josep a Cala d’Hort y la carretera del norte hacia Portinatx son mejores con la capota bajada, y son las rutas que se recuerdan. Para una semana de trayectos al aeropuerto y al supermercado no: pagas más por un maletero más pequeño y por un coche que hay que vaciar en cada parada.' },
  { q: '¿Cuánto equipaje cabe?', a: 'Menos de lo que parece, y con la capota bajada menos todavía, porque la capota vive en el maletero. Dos personas con equipaje de mano van cómodas. Cuatro con maletas no, diga lo que diga la descripción de la categoría. Si llegáis cuatro, coged el compacto y alquilad el descapotable un día.' },
  { q: '¿Puedo dejar cosas dentro mientras me baño?', a: 'No, y esta es la pega práctica que estropea semanas enteras. Un coche abierto en el aparcamiento de una playa es una invitación, y con la capota subida una lona tampoco es un maletero cerrado. Significa vaciar el coche en cada parada: una molestia menor en una ruta y un fastidio real en un día de playa.' },
  { q: '¿Cuánto cuesta frente a un coche normal?', a: 'Más por día que un economy o un compacto, y la diferencia crece en julio y agosto porque la categoría se agota antes. La forma honesta de reservarlo es para los días en que de verdad vas a hacer costa, aunque en un viaje corto suele ganar la sencillez de una sola reserva.' },
  { q: '¿Hay que reservarlo con más antelación?', a: 'Sí. Los descapotables son una parte pequeña de cualquier flota de Ibiza y la primera categoría que se agota en semanas punta. Reservar en primavera para agosto es lo normal; hacerlo en julio para agosto suele significar que no queda ninguno a ningún precio.' },
]

export default function AlquilerDescapotablePage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Alquiler de descapotable en Ibiza',
        description: 'Alquiler de descapotable en Ibiza para las carreteras del oeste y del norte, todo incluido con Wiber Rent a Car.',
        brand: 'Wiber Rent a Car', price: null, path: 'alquiler-descapotable-ibiza',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Alquiler de descapotable en Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Un descapotable se gana su suplemento en unas tres carreteras de aquí, y la mejor son los
            veinte minutos de Sant Josep a Cala d’Hort con Es Vedrà de frente. Pero hay una condición que
            nadie pone por delante: la hora. A las tres de una tarde de julio, parado al sol y sin sombra,
            la capota bajada no es un placer. Las horas buenas son primera hora y a partir de las seis —
            justo cuando la costa se ve mejor.
          </p>
        }
      />

      <ItemGrid
        heading="Las carreteras que lo justifican"
        intro="Tres rutas que valen la categoría, y una que no."
        items={[
          { name: 'Sant Josep a Cala d’Hort', body: 'El tramo del suroeste, bajando entre pinos y bancales con Es Vedrà llenando el parabrisas al final. Los mejores veinte minutos de conducción de la isla, y mejores aún en la última hora de luz.' },
          { name: 'La carretera del norte a Portinatx', body: 'Más larga, más verde y más vacía, serpenteando por Sant Joan. Más lenta de lo que sugiere el mapa y mejor por eso. Esta se hace por la mañana, antes del calor.' },
          { name: 'Ibiza ciudad a Santa Eulària', body: 'La opción de costa fácil, corta y civilizada, buena para una salida por la tarde. No es espectacular, pero sí agradable con la capota bajada y sin ningún esfuerzo.' },
          { name: 'No: la carretera del aeropuerto', body: 'Recta, cargada y caliente, con obras en algún punto casi cada temporada. Nadie ha disfrutado esta con la capota bajada en el tráfico de agosto.' },
        ]}
      />

      <PriceTable
        heading="Lo que cuesta"
        locale={LOCALE}
        caption="Precio de entrada del alquiler de descapotable"
        intro="Más por día que un economy o un compacto, y la categoría se agota antes en semanas punta. Pregúntanos la cifra para tus fechas: se mueve más por temporada que por modelo."
        rows={[{ label: 'Descapotable', note: '2 adultos, maletero pequeño, carreteras de costa', amount: null, unit: RENTAL_PRICES.carPerDay.unit.es }]}
      />

      <ProseSection
        heading="Las pegas que nadie cuenta"
        paragraphs={[
          'La capota vive en el maletero, así que el espacio que figura en la categoría es la cifra con la capota subida. Dos personas con equipaje de mano van cómodas; cuatro con maletas no caben, y descubrirlo en el mostrador a las once de la noche con la familia esperando es una mala noche.',
          'La otra es el aparcamiento. Una lona no es un maletero cerrado, y un coche abierto en el aparcamiento de una playa es una invitación. En la práctica significa vaciar el coche en cada parada: una molestia menor en una ruta y un fastidio real en un día de playa. Si tu semana es sobre todo de playas, alquila el descapotable dos días y coge algo con maletero cerrado para el resto.',
        ]}
      />

      <TrustBlock
        heading="Reservar con Wiber"
        locale={LOCALE}
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Ver disponibilidad de descapotables"
        points={[
          { title: 'Reserva pronto', body: 'Los descapotables son una parte pequeña de cualquier flota de Ibiza y la primera categoría que se agota para julio y agosto.' },
          { title: 'Tarifa todo incluido', body: 'Seguro en el precio, así que el suplemento que pagas es por el coche y no por una cobertura vendida en el mostrador.' },
          { title: 'Mismas condiciones', body: 'Edad mínima 21, carné con 12 meses, recargo de 9 € al día para conductores de 21 a 24, tarjeta de crédito a nombre del conductor principal.' },
          { title: 'A cinco minutos del aeropuerto', body: 'La misma oficina y la misma lanzadera gratuita que cualquier otra categoría — Ctra. Aeropuerto km 5, Sant Josep.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Seguir leyendo" locale={LOCALE} links={[
        { label: 'Alquiler de coches en Ibiza', href: 'alquiler-coches-ibiza', body: 'La página pilar: todas las categorías, condiciones y consejos de aparcamiento.' },
        { label: 'Alquiler en el aeropuerto', href: 'alquiler-coches-aeropuerto-ibiza', body: 'La recogida, la lanzadera y la devolución en un vuelo de madrugada.' },
        { label: 'Alquiler de barcos en Ibiza', href: 'boats', body: 'Cala d’Hort desde el agua en lugar de desde la carretera del acantilado.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="alquiler de descapotable en Ibiza" />
    </>
  )
}
