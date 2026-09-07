import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
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
const PAGE_KEY = 'alquiler-barco-ibiza-con-patron'
const precio = RENTAL_PRICES.boatWithSkipper.amount

/**
 * Versión en español. No es una traducción de la inglesa.
 *
 * Aquí la titulación no es el problema: quien busca en español suele tenerla o
 * saber exactamente cuál le falta. El enfoque es otro — qué aporta el patrón
 * cuando NO es obligatorio, porque esa es la decisión real: pagar por alguien
 * que podrías sustituir tú.
 *
 * La respuesta honesta es el ruteo. Ibiza tiene un lado a barlovento y otro a
 * sotavento que cambian según el día, y saber cuál toca es lo que separa un
 * buen día de uno incómodo. Eso no se consulta en ninguna app.
 *
 * Lo que no afirmamos: qué titulación cubre qué barco. Depende del tipo y la
 * eslora, así que lo comprobamos antes de cerrar fecha.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Alquiler de barco en Ibiza con patrón',
    description:
      'Barco con patrón en Ibiza: cuándo es obligatorio, cuánto cuesta y qué aporta de verdad cuando no lo es. El ruteo y el fondeo según el viento del día.',
    alternates: localizedAlternates('boat-with-skipper', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Alquiler de barco en Ibiza con patrón',
      description: 'Cuándo es obligatorio el patrón, y qué aporta cuando no lo es.',
      locale: 'es_ES',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Alquiler de barco en Ibiza con patrón' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza en el agua', path: 'boats' },
  { name: 'Con patrón' },
]

const FAQS: Faq[] = [
  { q: 'Si tengo titulación, ¿para qué quiero patrón?', a: 'Para el ruteo, y esa es la respuesta honesta. Ibiza tiene un lado a barlovento y otro a sotavento que cambian según el día, y un patrón que trabaja estas aguas sabe al desayuno en qué calas se podrá nadar a las dos de la tarde. Eso no se consulta en ninguna aplicación. La segunda razón es el fondeo: dónde agarra el fondo en cada cala no viene en la carta.' },
  { q: '¿Cuándo es obligatorio el patrón?', a: 'En cuanto la embarcación excede lo que cubre tu titulación, y además en la mayoría de yates a motor grandes y en prácticamente todos los catamaranes, que se alquilan con patrón sea cual sea tu titulación. Eso lo fijan el armador y la aseguradora, y no se negocia en el pantalán.' },
  { q: '¿Cuánto cuesta el patrón?', a: 'En la mayoría de chárteres de día el patrón va dentro de la tarifa en lugar de como línea aparte. Cuando se cobra por separado es una cuota diaria que no cambia con el tamaño del grupo, así que se reparte entre los que vayáis a bordo. El combustible va aparte en ambos casos. Pregúntanos por el barco concreto y te decimos cuál de los dos se aplica.' },
  { q: '¿Los patrones hablan español?', a: 'Por descontado, y el inglés está muy extendido. Alemán, neerlandés y francés existen pero en menos barcos, así que pedirlo reduce la flota en lugar de añadir coste. Dilo al consultar: filtrarlo después suele implicar cambiar de barco.' },
  { q: '¿Sigue siendo mi día o decide el patrón?', a: 'Tuyo, con una excepción. Tú eliges adónde ir y cuánto tiempo quedarte en cada cala; el patrón decide qué es seguro, y esa decisión es firme. En la práctica su criterio mejora el día más de lo que lo limita, porque sabe qué calas funcionan con el viento que sopla ese día.' },
  { q: '¿Hay que dar propina?', a: 'No es obligatoria, y se agradece de verdad tras un buen día. Aquí no hay un porcentaje estándar. Trátalo como tratarías a un buen guía, no como una cuenta de restaurante.' },
  { q: '¿El patrón cuenta en el número máximo de personas?', a: 'En unos certificados sí y en otros no, y esa diferencia ha dejado a grupos con una plaza de menos en el pantalán. Dinos el número real y lo cotejamos con el barco concreto antes de que pagues.' },
]

export default function AlquilerBarcoConPatronPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Alquiler de barco en Ibiza con patrón',
        description: 'Chárteres de día con patrón en Ibiza desde puertos de toda la isla, con patrones locales que trabajan en varios idiomas.',
        brand: 'Click&Boat', price: precio, path: 'alquiler-barco-ibiza-con-patron',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Alquiler de barco en Ibiza con patrón"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            El patrón es obligatorio en la mayoría de embarcaciones que superan lo que cubre una titulación
            corriente, y en casi todos los yates a motor grandes y catamaranes de aquí.
            {precio ? ` Chárteres de día con patrón desde ${precio} € al día.` : ''} Donde es opcional,
            sigue siendo casi siempre la mejor decisión: lo que pagas es el ruteo, no el volante.
          </p>
        }
      />

      <ItemGrid
        heading="Cuándo hace falta y cuándo simplemente conviene"
        columns={2}
        items={[
          { name: 'Lo exige el barco', body: 'La mayoría de yates a motor por encima de las categorías pequeñas y casi todos los catamaranes se alquilan con patrón, tengas la titulación que tengas. Lo fijan el armador y la aseguradora, y no se negocia en el pantalán.' },
          { name: 'Lo exige tu titulación', body: 'Una titulación extranjera no se reconoce en España para todas las categorías. Mándanos la titulación y el barco y comprobamos la pareja antes de que cierres fecha.' },
          { name: 'Conviene por el tiempo', body: 'La tramuntana cierra el norte de la isla durante días mientras el sur y el oeste siguen bien. Un patrón cambia la ruta esa misma mañana; quien navega por primera vez normalmente ni sabe que debería.' },
          { name: 'Conviene por el fondeo', body: 'Saber dónde agarra el fondo en cada cala no se aprende de una carta. Es la mayor diferencia práctica entre un día con patrón y uno sin él.' },
        ]}
      />

      <PriceTable
        heading="Lo que cuesta un día con patrón"
        locale={LOCALE}
        caption="Precio de entrada del chárter con patrón"
        intro="Por barco y día. En la mayoría de chárteres el patrón va incluido en esta tarifa; cuando es aparte, es una cuota diaria fija independiente del grupo. El combustible se factura por consumo en ambos casos."
        rows={[{ label: 'Chárter de día con patrón', note: 'Patrón incluido en la tarifa', amount: precio, unit: RENTAL_PRICES.boatWithSkipper.unit.es }]}
      />

      <ProseSection
        heading="Lo que cambia de verdad un buen patrón"
        paragraphs={[
          'La respuesta obvia es que no tienes que llevar tú el barco. La respuesta real es el ruteo. Ibiza tiene un lado a barlovento y otro a sotavento que se intercambian según el día, y un patrón que conoce estas aguas sabe al desayuno en qué calas se podrá nadar a las dos de la tarde. Eso no se consulta en ningún sitio.',
          'Lo segundo es el horario. Llegar a Cala Comte a las once en agosto es dar vueltas buscando sitio; llegar a las nueve o a las cinco es fondear donde quieras. Los patrones planifican el día alrededor de eso por costumbre, y es justo el tipo de cosa que si no, se aprende equivocándose una vez.',
        ]}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <AffiliateLink href={CLICKANDBOAT_URL} partner="Click&Boat" locale={LOCALE}>
            Ver barcos con patrón en Click&amp;Boat
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Seguir leyendo" locale={LOCALE} links={[
        { label: 'Alquiler de barcos en Ibiza', href: 'boats', body: 'La página pilar: las tres formas de salir al agua, con puertos y rutas.' },
        { label: 'Alquiler de barco sin titulación', href: 'alquiler-barco-ibiza-sin-titulacion', body: 'El otro extremo: 15 CV, sin papeles, calas cercanas.' },
        { label: 'Boat party en Ibiza', href: 'boat-party', body: 'Cuando quieres el ambiente en lugar del barco para ti solo.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="alquiler de barco en Ibiza con patrón" />
    </>
  )
}
