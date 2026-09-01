import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { WiberDirect } from '@/components/partner/WiberDirect'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { WIBER_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600
const LOCALE: Locale = 'es'
const PAGE_KEY = 'alquiler-coches-ibiza'
const porDia = RENTAL_PRICES.carPerDay.amount

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Alquiler de coches en Ibiza, todo incluido',
    description:
      'Alquiler de coches en Ibiza con Wiber: tarifa todo incluido, oficina a cinco minutos del aeropuerto y shuttle gratuito. Condiciones, fianza y recargos.',
    alternates: localizedAlternates('car-rental', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Alquiler de coches en Ibiza, todo incluido',
      description: 'Alquiler de coches en Ibiza con Wiber: todo incluido, a cinco minutos del aeropuerto, shuttle gratuito.',
      locale: 'es_ES',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Alquiler de coches en Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Inicio', path: '' },
  { name: 'Alquiler de coches Ibiza' },
]

const FAQS: Faq[] = [
  { q: '¿Se puede alquilar coche en el aeropuerto de Ibiza?', a: 'Lo recoges a cinco minutos, no dentro de la terminal. La oficina de Wiber está en la Ctra. Aeropuerto km 5, en Sant Josep, con shuttle gratuito desde llegadas. Parece un inconveniente y en agosto es justo lo contrario: los mostradores de la terminal superan con frecuencia la hora de espera tras una tanda de vuelos de tarde.' },
  { q: '¿Qué significa exactamente todo incluido?', a: 'Que el precio que te dan es el que pagas: el seguro va en la tarifa en lugar de venderse en el mostrador, y no hay juego con la fianza del combustible. No significa que nunca pueda añadirse nada — daños fuera de cobertura, una llave perdida o repostar si lo devuelves vacío siguen siendo tuyos. La diferencia con un precio gancho es que no se añade nada solo porque dijiste que no en el mostrador.' },
  { q: '¿Puedo alquilar con 21 años?', a: 'Sí. La edad mínima es 21 años y el carné debe tener al menos 12 meses de antigüedad. Los conductores de 21 a 24 pagan un recargo por conductor joven de 9 € al día, que se suma a la tarifa y no lo absorbe el precio todo incluido. A partir de 25 no hay recargo.' },
  { q: '¿Necesito tarjeta de crédito y fianza?', a: 'Sí, tarjeta de crédito a nombre del conductor principal. Es con diferencia el motivo más común por el que se rechaza a alguien en un mostrador en España: no sirve una tarjeta de débito ni una a nombre de tu pareja. La fianza se preautoriza, no se cobra, y se libera al devolver el coche.' },
  { q: '¿Merece la pena un descapotable en Ibiza?', a: 'Para las carreteras de costa, sinceramente sí — bajar de Sant Josep a Cala d’Hort con la capota abierta es la razón por la que se alquilan. Para una semana de compras y traslados al aeropuerto, no: pagas más, el maletero es pequeño y un coche abierto en un aparcamiento de playa hay que vaciarlo en cada parada. Alquílalo para conducir, no para la semana.' },
  { q: '¿Hace falta coche en Ibiza?', a: 'Si te quedas en Ibiza ciudad o San Antonio y no te mueves, no: hay autobuses y taxis. Si quieres Cala Salada, Cala d’Hort, el norte por Sant Joan o cualquier cala al final de un camino de tierra, sí. Es justo de lo que habla la gente al volver, y allí no llega ningún autobús.' },
  { q: '¿Cómo está el aparcamiento?', a: 'Cuenta con ello, porque en agosto decide tu día. En Ibiza ciudad aparcas en subterráneo y pagas; plaza libre en la calle casi no hay en temporada. San Antonio es más fácil hacia la bahía. Los aparcamientos de Comte y Bassa se llenan a media mañana: antes de las diez o después de las cuatro, ese es todo el truco.' },
  { q: '¿Puedo circular por caminos de tierra?', a: 'Por los caminos arreglados, como el de Cala Salada, sí, y lo hace todo el mundo. En los tramos más duros del norte, lee antes tus condiciones: la mayoría de contratos excluyen los daños fuera de carretera asfaltada, y un cárter perforado en un camino pedregoso corre de tu cuenta. Si el plan es realmente remoto, coge el 4x4 y no el utilitario más barato.' },
]

export default function AlquilerCochesIbizaPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Alquiler de coches en Ibiza',
        description: 'Alquiler de coches todo incluido en Ibiza con Wiber Rent a Car, a cinco minutos del aeropuerto con shuttle gratuito y recogida sin contacto.',
        brand: 'Wiber Rent a Car', price: porDia, path: 'alquiler-coches-ibiza',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Alquiler de coches en Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Reservamos el alquiler de coches en Ibiza con Wiber Rent a Car: tarifa todo incluido con el
              seguro dentro, oficina a cinco minutos del aeropuerto en la Ctra. Aeropuerto km 5, Sant Josep,
              shuttle gratuito desde la terminal y recogida sin contacto.
              {porDia ? ` Las tarifas parten de €${porDia} al día.` : ''} Edad mínima 21 años, con un recargo
              de 9 € al día para conductores de 21 a 24.
            </p>
            <p className="mt-4">
              El motivo para tener coche aquí no es el trayecto del aeropuerto. Son Cala Salada, Cala
              d&apos;Hort y la costa norte: las partes de la isla a las que no llega ningún autobús.
            </p>
          </>
        }
      >
        <WiberDirect locale={LOCALE} />
      </HubHero>

      <PriceTable
        heading="Qué cuesta alquilar coche en Ibiza"
        locale={LOCALE}
        caption="Precios desde, por categoría"
        intro="Precios desde, por día y todo incluido. En julio y agosto las tarifas suben con fuerza y las categorías económicas se agotan primero — la diferencia entre reservar en abril y en julio supera la diferencia entre categorías."
        rows={[
          { label: 'Económico', note: 'Dos adultos, equipaje de mano, aparcar en ciudad', amount: RENTAL_PRICES.carPerDay.amount, unit: RENTAL_PRICES.carPerDay.unit.es },
          { label: 'Compacto', note: 'Cuatro adultos con maletas de verdad', amount: null, unit: RENTAL_PRICES.carPerDay.unit.es },
          { label: 'Descapotable', note: 'Dos personas, maletero pequeño, carreteras de costa', amount: null, unit: RENTAL_PRICES.carPerDay.unit.es },
          { label: 'SUV / 4x4', note: 'Caminos de tierra y calas remotas', amount: null, unit: RENTAL_PRICES.carPerDay.unit.es },
        ]}
      />

      <ItemGrid
        heading="Las condiciones, por delante"
        columns={2}
        intro="Nada de esto es raro en España, pero conviene saberlo antes de aterrizar y no en el mostrador a las once de la noche."
        items={[
          { name: 'Edad y carné', body: 'Mínimo 21 años y carné con al menos 12 meses de antigüedad. De 21 a 24 se aplica un recargo por conductor joven de 9 € al día sobre la tarifa. A partir de 25 no hay recargo.' },
          { name: 'Tarjeta de crédito y fianza', body: 'Tarjeta de crédito a nombre del conductor principal, obligatoria. La fianza se preautoriza, no se cobra, y se libera a la devolución. Una tarjeta de débito o la de otra persona del grupo se rechaza — aquí es donde más gente se queda en tierra.' },
          { name: 'Qué cubre el seguro', body: 'La cobertura va en la tarifa todo incluido en lugar de venderse en el mostrador. No lo cubre todo: daños fuera de carretera asfaltada, llave perdida o el interior tras un fin de semana húmedo quedan fuera. Pregunta por la franquicia y por qué anula la cobertura.' },
          { name: 'Combustible y devolución', body: 'Lleno al salir, lleno al volver. Que reposte la empresa se factura a un precio que no gusta a nadie, y la gasolinera más cercana al aeropuerto sabe perfectamente por qué estás ahí a las siete de la mañana.' },
        ]}
      />

      <ProseSection
        heading="Por qué quieres coche aquí"
        paragraphs={[
          'La isla es lo bastante pequeña para que en el mapa todo parezca cerca, y lo bastante lenta en la práctica para que no lo esté. Treinta kilómetros cruzando la isla en agosto es una hora, y los dos últimos suelen ser camino de tierra. Ese es el argumento en una frase: las calas que compensan el viaje son exactamente las que no tienen autobús.',
          'Cala Salada es el ejemplo más claro. Está al final de una carretera estrecha al norte de San Antonio, con un aparcamiento pequeño que se llena a las diez, y la caminata desde el desbordamiento desanima a la mayoría. Cala d’Hort, mirando a Es Vedrà, cuenta lo mismo en el otro extremo de la isla.',
          'Si el plan incluye los caminos más duros del norte, coge el 4x4 y no el utilitario más barato. No porque un coche pequeño no llegue, sino porque casi todos los contratos excluyen los daños fuera de carretera asfaltada, y un cárter roto en un camino pedregoso es una factura que nadie presupuesta.',
          'El aparcamiento se subestima. En Ibiza ciudad en agosto aparcas en subterráneo y pagas, o das vueltas. En las playas del oeste: antes de las diez o después de las cuatro. Organiza el día en torno a eso y el coche es la mejor decisión del viaje.',
        ]}
      />

      <TrustBlock
        heading="Reservar con Wiber"
        locale={LOCALE}
        intro="Wiber Rent a Car es nuestro socio de alquiler de coches en la isla. Reservamos con ellos porque la tarifa todo incluido se mantiene también en el mostrador, y eso no ocurre con todos los precios gancho del aeropuerto de Ibiza."
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Consultar disponibilidad en Wiber"
        points={[
          { title: 'A cinco minutos del aeropuerto', body: 'La oficina está en la Ctra. Aeropuerto km 5, Sant Josep, con shuttle gratuito desde la terminal. Fuera del aeropuerto, pero más rápido en temporada alta que la cola de dentro.' },
          { title: 'Recogida sin contacto', body: 'El papeleo se completa antes de que llegues, así que recoger es una entrega de llaves y no una cita en mostrador. Tras un aterrizaje tardío, es la diferencia entre veinte minutos y una hora.' },
          { title: 'Todo incluido significa que el precio aguanta', body: 'El seguro va en la tarifa. Nadie te vende cobertura en el mostrador porque la rechazaste online, que es el mecanismo detrás de la mayoría de historias de "el precio se dobló" en aeropuertos españoles.' },
          { title: 'Qué hacemos nosotros', body: 'Lo reservamos contigo por WhatsApp y seguimos disponibles mientras tengas el coche. Si algo se tuerce en el mostrador, tienes un número local y no un centro de llamadas.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Páginas relacionadas" locale={LOCALE} links={[
        { label: 'Alquiler de barco en Ibiza', href: 'alquiler-barco-ibiza', body: 'Las calas a las que no se llega por carretera, desde el agua.' },
        { label: 'Coche y moto', href: 'car-scooter-rental', body: 'La página existente, con motos y quads.' },
        { label: 'Consejos de Ibiza', href: 'tips', body: 'Calas, aparcamiento y cuándo conviene venir.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="el alquiler de coches en Ibiza" />
    </>
  )
}
