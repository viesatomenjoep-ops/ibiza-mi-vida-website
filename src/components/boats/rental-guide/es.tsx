/**
 * Bootverhuurgids (es) — de inhoud van de vroegere pillar /alquiler-barco-ibiza.
 *
 * Die pagina is samengevoegd met /boats: één URL draagt nu het hele
 * bootaanbod, met deze gids onderaan. De oude URL's (vijf talen) doen een 308
 * naar /{locale}/boats, zodat inkomende links en de zoekmachine-index
 * meeverhuizen in plaats van te 404'en.
 *
 * Wat er anders is dan op de losse pagina: de hero is een H2 (de pagina heeft
 * al een H1), er is geen eigen breadcrumb meer (die van /boats geldt), en het
 * Product-schema wijst naar 'boats'. De copy zelf is ongewijzigd.
 */
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, ProseSection, InternalLinks } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { CLICKANDBOAT_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { type Locale } from '@/lib/seo'

const LOCALE: Locale = 'es'
const PAGE_KEY = 'alquiler-barco-ibiza'
const patron = RENTAL_PRICES.boatWithSkipper.amount
const sinTitulacion = RENTAL_PRICES.boatNoLicence.amount

/**
 * Página pilar en español, escrita y no traducida.
 *
 * El lector español conoce el marco legal mejor que el extranjero: sabe que
 * existe la licencia de navegación y no confunde categorías. Por eso esta
 * página dedica menos espacio a explicar que se puede navegar sin titulación y
 * más a lo que de verdad se pregunta aquí — de qué puerto sale cada ruta, qué
 * pasa con la fianza, y cuándo merece la pena ir.
 */



const FAQS: Faq[] = [
  { q: '¿Se puede alquilar un barco en Ibiza sin titulación?', a: 'Sí, dentro de unos límites concretos. La normativa española permite a cualquier persona mayor de 18 años gobernar una embarcación de hasta 15 CV con eslora inferior a seis metros, sin titulación y sin experiencia previa. Antes de salir recibes una instrucción básica y una zona de navegación que debes respetar, normalmente el tramo de costa alrededor de tu puerto de salida. Todo lo que sea mayor o más potente exige titulación reconocida.' },
  { q: '¿Cuánto cuesta alquilar un barco en Ibiza?', a: 'Depende de tres cosas: el tamaño del barco, si lleva patrón, y la fecha. Un barco sin titulación para cuatro a seis personas es la forma más económica de salir al mar; un chárter de día con patrón, la más cara. El combustible se factura casi siempre aparte, por consumo, y eso sorprende más que la propia tarifa. Escríbenos tu fecha y el número de personas y te damos el precio de los barcos que ese día están libres de verdad.' },
  { q: '¿Hay que dejar fianza?', a: 'Sí, prácticamente en todos los barcos. Se bloquea en la tarjeta de crédito del arrendatario principal y se libera cuando el barco vuelve sin daños, normalmente en pocos días. El importe va con el valor del barco. Lleva tarjeta de crédito real: en la mayoría de bases no aceptan tarjeta de débito ni una tarjeta a nombre de otra persona.' },
  { q: '¿Cuántas personas pueden subir?', a: 'Lo marca el certificado del barco, no el espacio en cubierta. Los barcos sin titulación suelen estar homologados para cuatro a seis personas y las embarcaciones a motor medianas para ocho a doce. En algunos certificados el patrón cuenta dentro del total y en otros no. Dinos el número real, niños incluidos — con nueve personas en un barco para seis, alguien se queda en el pantalán.' },
  { q: '¿El combustible está incluido?', a: 'Casi nunca. Lo habitual en la isla es coger el barco lleno y devolverlo lleno, o liquidar el consumo al final. Lo que gastas depende mucho más de cómo navegas que de la distancia: fondeado en una cala no cuesta nada, y a todo gas hasta Formentera y vuelta cuesta bastante. Pregunta por la capacidad del depósito y el consumo si quieres presupuestarlo.' },
  { q: '¿Qué pasa si cambia el tiempo?', a: 'Aquí la tramuntana del norte decide el día más a menudo que la lluvia. Si las condiciones no son seguras, cancela la base o el patrón y te dan otra fecha o el reembolso — la decisión es suya, no tuya. En días dudosos lo normal es cambiar la ruta y no la fecha: cuando el norte está cerrado, el sur y el oeste suelen funcionar perfectamente.' },
  { q: '¿Cuál es la mejor época?', a: 'De junio a agosto es temporada alta: agua más cálida, tiempo más fiable, precios más altos, y las calas conocidas llenas a mediodía. Mayo, septiembre y principios de octubre salen mejor: en septiembre el agua sigue caliente, los barcos cuestan menos y Cala Comte no está saturada a las once. Entre semana es más barato y más tranquilo que el fin de semana en cualquier mes.' },
  { q: '¿Merece la pena ir a Formentera en barco?', a: 'Si tienes el día entero y el barco adecuado, sí: Ses Illetes y los bajos de arena son otra cosa. Pero necesita autonomía y, en la práctica, patrón. No es un plan para una embarcación de 15 CV sin titulación por mucho que el mapa lo sugiera, y salir de la zona de navegación asignada te deja fuera del seguro.' },
]

export function BoatRentalGuide() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} faqs={FAQS} product={{
        name: 'Alquiler de barco en Ibiza',
        description: 'Alquiler de barco en Ibiza con patrón, con titulación propia o sin ella hasta 15 CV, desde cuatro puertos de la isla.',
        brand: 'Click&Boat', price: patron, path: 'boats',
      }} />

      <HubHero as="h2"
        h1="Alquiler de barco en Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Tres formas de salir al mar: con patrón que gobierna, con tu propia titulación, o sin
              titulación en una embarcación limitada a 15 CV si tienes 18 años o más.
              {patron ? ` Un chárter de día con patrón parte de €${patron}.` : ''}
              {sinTitulacion ? ` Los barcos sin titulación parten de €${sinTitulacion}.` : ''} La temporada
              alta va de junio a agosto; entre semana es más barato y las calas están más vacías.
            </p>
            <p className="mt-4">
              Los barcos salen de cuatro puertos, y cuál elijas condiciona el día más que el propio barco.
            </p>
          </>
        }
      />

      <ItemGrid
        heading="Con o sin titulación: qué permite la ley"
        columns={3}
        intro="Es normativa española, no política de la empresa de alquiler. Quien te ofrezca otra cosa te está sacando de tu seguro."
        items={[
          { name: 'Sin titulación', body: 'Máximo 15 CV, eslora inferior a seis metros, patrón de 18 años o más, y una zona de navegación que te señalan en la carta antes de salir. No hace falta experiencia: la instrucción cubre arrancar, parar, gobernar y fondear. Pensado para las calas cercanas, no para cruzar a Formentera.' },
          { name: 'Con tu titulación', body: 'Se abre toda la flota: esloras mayores, autonomía real y Formentera como opción. Lleva el documento original; una foto no vale en el pantalán.' },
          { name: 'Con patrón', body: 'Obligatorio de todos modos en la mayoría de embarcaciones grandes a motor y en prácticamente todos los catamaranes. En el resto suele ser simplemente la mejor decisión.' },
        ]}
      />

      <PriceTable
        heading="Qué cuesta un barco en Ibiza"
        locale={LOCALE}
        caption="Precios desde, por tipo de barco"
        intro="Precios desde, por barco y día. El combustible se añade casi siempre aparte, por consumo — pregunta por depósito y consumo si quieres presupuestarlo bien."
        rows={[
          { label: 'Barco sin titulación', note: '4–6 personas, máx. 15 CV', amount: RENTAL_PRICES.boatNoLicence.amount, unit: RENTAL_PRICES.boatNoLicence.unit.es },
          { label: 'Embarcación a motor, navegas tú', note: 'Titulación requerida', amount: RENTAL_PRICES.boatWithLicence.amount, unit: RENTAL_PRICES.boatWithLicence.unit.es },
          { label: 'Chárter de día con patrón', note: 'Patrón incluido en la tarifa', amount: RENTAL_PRICES.boatWithSkipper.amount, unit: RENTAL_PRICES.boatWithSkipper.unit.es },
        ]}
      />

      <ItemGrid
        heading="De dónde salen los barcos"
        columns={2}
        intro="Cuatro puntos de salida, cada uno orientado a un tramo de costa. Elige el puerto más cercano a lo que quieres ver — una hora rodeando la isla es una hora sin bañarte."
        items={[
          { name: 'San Antonio', body: 'La base de la costa oeste y el trayecto más corto a Cala Bassa, Cala Comte y Cala Salada. También el más concurrido: en julio y agosto sal antes de las diez o harás cola en el surtidor y llegarás a una cala llena.' },
          { name: 'Santa Eulària', body: 'Puerto más tranquilo en la costa este, el más cercano a las calas del noreste y a Es Canar. La mejor opción si San Antonio te resulta demasiado caótico.' },
          { name: 'Ibiza ciudad', body: 'Directo hacia Formentera y la costa sur, con Talamanca y Ses Salines a mano. Práctico si te alojas en la ciudad y no quieres cruzar la isla en taxi.' },
          { name: 'Marina Botafoch', body: 'Aquí amarran los barcos más grandes, enfrente del casco antiguo. Mismo acceso a Formentera que Ibiza ciudad, con más espacio en el pantalán para embarcar en grupo.' },
        ]}
      />

      <TrustBlock
        heading="Con quién reservas"
        locale={LOCALE}
        intro="Somos un equipo local en Ibiza. Los barcos llegan a través de Click&Boat, la mayor plataforma de alquiler de barcos de Europa con más de 55.000 embarcaciones — por eso solemos encontrar algo libre en fechas que parecen completas."
        partner="Click&Boat"
        partnerHref={CLICKANDBOAT_URL}
        partnerCta="Consultar disponibilidad en Click&Boat"
        points={[
          { title: 'Seguro', body: 'Cada barco está asegurado por su propietario o armador; es requisito para aparecer en la plataforma. La responsabilidad civil es estándar. Lo que cambia es la franquicia, y ese es el dato que conviene preguntar antes de firmar.' },
          { title: 'La fianza', body: 'Bloqueada en la tarjeta de crédito del arrendatario principal y liberada al devolver el barco sin daños. El importe va con el valor del barco y te lo dicen antes. Lleva tarjeta de crédito real.' },
          { title: 'Qué hacemos nosotros', body: 'Cruzamos tu fecha, el tamaño del grupo y el idioma con los barcos realmente disponibles, y respondemos por WhatsApp en lugar de un formulario. Si un barco no encaja con lo que nos has descrito, te lo decimos.' },
          { title: 'Cancelaciones', body: 'Las cancelaciones por tiempo las decide la base o el patrón, no tú, y dan lugar a nueva fecha o reembolso. Las condiciones por arrepentimiento varían según el barco — pregúntanos por las del tuyo.' },
        ]}
      />

      <ProseSection
        heading="Lo que le diríamos a un amigo"
        paragraphs={[
          'Planifica el barco alrededor del tiempo, y no al revés. La tramuntana sopla del norte y deja esa cara de la isla inservible durante días, mientras el sur y el oeste siguen perfectos. Un patrón simplemente invierte la ruta; si navegas tú, pregunta esa mañana en la base y ve dispuesto a cambiar de plan.',
          'Sal pronto. No por el amanecer, sino por el fondeo. Cala Comte y Cala Bassa están llenas a mediodía en julio y agosto, y la diferencia entre llegar a las diez y llegar a la una es bañarte desde el barco o dar vueltas buscando sitio.',
          'Lleva más agua y más sombra de la que crees necesitar. Casi ningún barco de menos de diez metros tiene ninguna de las dos cosas, y seis horas de sol mediterráneo sin toldo es la forma más fiable de estropear el día.',
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Páginas relacionadas" locale={LOCALE} links={[
        { label: 'Alquiler de coches en Ibiza', href: 'alquiler-coches-ibiza', body: 'Cómo llegar al puerto, y las calas a las que no llega ningún barco.' },
        { label: 'Boat party en Ibiza', href: 'boat-party', body: 'La versión organizada: entrada, DJ y grupo.' },
        { label: 'Chárter privado', href: 'private-boat-charters', body: 'Yates y catamaranes mayores, con o sin patrón.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="el alquiler de barcos en Ibiza" />
    </>
  )
}
