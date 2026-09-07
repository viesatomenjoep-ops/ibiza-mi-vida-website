import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { Proof } from '@/components/hub/Proof'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { CLICKANDBOAT_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600
const LOCALE: Locale = 'es'
const PAGE_KEY = 'alquiler-barco-ibiza-sin-titulacion'
const precio = RENTAL_PRICES.boatNoLicence.amount

/**
 * Versión en español. No es una traducción de la inglesa.
 *
 * Aquí no hay malentendido legal que deshacer: quien busca en español ya sabe
 * que existe un límite sin titulación. Lo que no sabe es qué se puede hacer de
 * verdad con 15 CV, y ese es el enfoque — expectativa, no normativa.
 *
 * Importa porque el error caro aquí no es legal sino de planificación: reservar
 * pensando en cruzar a Formentera, o en dar la vuelta a la isla, y descubrir en
 * el pantalán que el barco hace ocho nudos y el área de navegación acaba dos
 * calas más allá.
 *
 * Las cuatro condiciones son ley española y no norma de la casa, y así se dice.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Alquiler de barco en Ibiza sin titulación',
    description:
      'Alquilar barco en Ibiza sin titulación: máximo 15 CV, eslora menor de seis metros, patrón desde 18 años y un área de navegación pactada. Hasta dónde llegas.',
    alternates: localizedAlternates('boat-no-licence', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Alquiler de barco en Ibiza sin titulación',
      description: 'Qué se puede hacer de verdad con 15 CV, y hasta dónde llega el área de navegación.',
      locale: 'es_ES',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Alquiler de barco en Ibiza sin titulación' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza en el agua', path: 'boats' },
  { name: 'Sin titulación' },
]

const FAQS: Faq[] = [
  { q: '¿Se puede alquilar un barco en Ibiza sin titulación?', a: 'Sí, dentro de un límite fijo. Las normas españolas permiten a cualquier persona de 18 años o más llevar una embarcación de hasta 15 CV con una eslora inferior a seis metros, sin titulación y sin experiencia acreditada. Antes de salir recibes un briefing y un área de navegación en la que te mantienes. Todo lo que tenga más potencia o más eslora exige titulación reconocida, y ninguna empresa puede saltárselo.' },
  { q: '¿Qué se puede hacer realmente con 15 CV?', a: 'Mover una embarcación pequeña con cuatro a seis personas a un ritmo entre andar y trotar, y poco más. No planea y no gana terreno contra el viento. Piénsalo como llegar a la cala de al lado en veinte minutos, no como recorrer la isla. Quien imagina una lancha se lleva un chasco; quien imagina un picnic flotante, no.' },
  { q: '¿Puedo cruzar a Formentera con uno de estos?', a: 'No, y conviene saberlo antes de reservar y no en el pantalán. La travesía no entra en el área de navegación, es agua abierta y exige otra embarcación y, siendo realistas, un patrón. Si el plan del día era Formentera, la opción correcta es el ferry o un chárter con patrón, y te lo decimos antes de que pagues.' },
  { q: '¿Hasta dónde puedo llegar?', a: 'Dentro del área que la base marca en una carta antes de salir, normalmente el tramo de costa alrededor de tu puerto de salida. Desde San Antonio suele cubrir la bahía y las calas hacia el sur, hasta Cala Bassa y Cala Comte. Salirse es lo que anula la cobertura, y aquí se controla de verdad.' },
  { q: '¿Cuánto cuesta?', a: 'Los barcos sin titulación son la forma más barata de salir al agua en Ibiza y cuestan menos que cualquier chárter con patrón. El combustible se factura aparte por consumo, y con 15 CV es realmente poco. La tarifa se mueve con la temporada, así que mándanos tu fecha y el número de personas para la cifra del día.' },
  { q: '¿Cuántas personas caben?', a: 'De cuatro a seis, según el certificado de la embarcación y no según el sitio que haya en cubierta. Dinos el número real al consultar, niños incluidos: presentarse siete con un certificado para seis significa que alguien se queda en el pantalán.' },
  { q: '¿Hace falta experiencia?', a: 'No, y la mayoría de quienes salen con estas embarcaciones no la tiene. El briefing cubre arrancar, parar, gobernar, fondear y qué hacer si se para el motor, y los barcos son deliberadamente lentos y nobles. Si sabes aparcar marcha atrás, sabes llevar uno de estos.' },
]

export default function AlquilerBarcoSinTitulacionPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Alquiler de barco en Ibiza sin titulación',
        description: 'Alquiler de barco en Ibiza sin titulación: hasta 15 CV, eslora inferior a seis metros, patrón desde 18 años.',
        brand: 'Click&Boat', price: precio, path: 'alquiler-barco-ibiza-sin-titulacion',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Alquiler de barco en Ibiza sin titulación"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Puedes llevar un barco en Ibiza sin ninguna titulación, siempre que se cumplan cuatro
            condiciones: máximo 15 CV, eslora inferior a seis metros, patrón de 18 años o más, y un área
            de navegación pactada en la que te mantienes tras el briefing.
            {precio ? ` Barcos desde ${precio} € al día.` : ''} Eso da para cuatro a seis personas y las
            calas de tu tramo de costa — no para cruzar a Formentera.
          </p>
        }
      />

      <ItemGrid
        heading="Las cuatro reglas, completas"
        columns={2}
        intro="Son límites legales, no normas de la casa. Una empresa que se ofrezca a estirar una de ellas se está ofreciendo a dejarte fuera del seguro."
        items={[
          { name: 'Máximo 15 CV', body: 'El techo de potencia para navegar sin titulación. Esa cifra decide todo lo demás del día: lento, estable y perfecto para saltar entre calas cercanas.' },
          { name: 'Eslora menor de seis metros', body: 'La longitud pesa tanto como la potencia. Un barco puede quedarse por debajo de 15 CV y aun así exigir titulación si la eslora se pasa, y por eso la flota para esto es pequeña y concreta.' },
          { name: 'Patrón de 18 o más', body: 'Quien va al timón debe tener 18 años y documento. Los acompañantes pueden tener cualquier edad, con chaleco de su talla. Solo firma el patrón.' },
          { name: 'Un área de navegación fija', body: 'Marcada en una carta durante el briefing, normalmente la costa alrededor de tu puerto de salida. Salirse es lo que anula la cobertura, y Salvamento controla.' },
        ]}
      />

      <PriceTable
        heading="Lo que cuesta"
        locale={LOCALE}
        caption="Precio de entrada del alquiler sin titulación"
        intro="Por barco y día, repartido entre cuatro y seis personas. El combustible va aparte y el consumo de un motor de 15 CV es modesto."
        rows={[{ label: 'Barco sin titulación', note: '4–6 personas, máx. 15 CV', amount: precio, unit: RENTAL_PRICES.boatNoLicence.unit.es }]}
      />

      <ItemGrid
        heading="Hasta dónde se llega de verdad"
        intro="Destinos realistas con 15 CV desde San Antonio, donde está la mayoría de los barcos sin titulación."
        items={[
          { name: 'Cala Bassa', body: 'De veinte a treinta minutos costa abajo, resguardada y de arena. La primera parada estándar y la que funciona con niños a bordo.' },
          { name: 'Cala Comte', body: 'Algo más al sur, poco profunda y turquesa. Alcanzable en un día tranquilo; mira la previsión, porque la vuelta contra el viento con 15 CV es lenta.' },
          { name: 'La bahía de San Antonio', body: 'La bahía en sí es el plan B y no es un premio de consolación: agua plana, fondeo fácil y lo bastante cerca para volver a comer.' },
        ]}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <AffiliateLink href={CLICKANDBOAT_URL} partner="Click&Boat" locale={LOCALE}>
            Ver barcos sin titulación en Click&amp;Boat
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Seguir leyendo" locale={LOCALE} links={[
        { label: 'Alquiler de barcos en Ibiza', href: 'boats', body: 'La página pilar: las tres formas de salir al agua, con precios y puertos.' },
        { label: 'Alquiler de barco con patrón', href: 'alquiler-barco-ibiza-con-patron', body: 'Cuando conduce otro, y por qué suele salir más a cuenta.' },
        { label: 'Motos de agua en Ibiza', href: 'alquiler-motos-agua-ibiza', body: 'La versión rápida y corta, con sus propias reglas de titulación.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="alquiler de barco en Ibiza sin titulación" />
    </>
  )
}
