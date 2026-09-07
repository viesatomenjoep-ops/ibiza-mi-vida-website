import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
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
const PAGE_KEY = 'alquiler-coches-aeropuerto-ibiza'
const porDia = RENTAL_PRICES.carPerDay.amount

/**
 * Versión en español. No es una traducción de la inglesa.
 *
 * El enfoque es la DEVOLUCIÓN, no la recogida. Quien llega desde la península
 * suele venir para un puente o un fin de semana largo, y el vuelo de vuelta es
 * de primera hora. Ahí está el punto que se pasa por alto: devolver fuera del
 * horario de oficina no es automático, se acuerda al reservar, y quien lo da
 * por hecho acaba dejando las llaves en un buzón que no existe — con el coche
 * todavía a su nombre.
 *
 * La versión inglesa trata la recogida y lo menciona al final. Aquí va primero,
 * porque es lo que rompe un viaje corto.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Alquiler de coches aeropuerto Ibiza',
    description:
      'Recoger el coche en el aeropuerto de Ibiza: oficina Wiber a cinco minutos, lanzadera gratuita y entrega sin papeleo. Y cómo devolverlo en un vuelo de madrugada.',
    alternates: localizedAlternates('car-rental-airport', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Alquiler de coches aeropuerto Ibiza',
      description: 'Recogida a cinco minutos de la terminal, y la devolución fuera de horario que hay que pactar antes.',
      locale: 'es_ES',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Alquiler de coches aeropuerto Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Alquiler de coches Ibiza', path: 'alquiler-coches-ibiza' },
  { name: 'Aeropuerto' },
]

const FAQS: Faq[] = [
  { q: '¿Puedo devolver el coche fuera del horario de oficina?', a: 'Pregúntalo al reservar, porque depende de la fecha y de la hora y no es un sí automático. Los vuelos de primera hora son el caso normal y suele organizarse sin problema. Lo que no debes hacer es darlo por hecho y dejar las llaves en cualquier sitio: un coche no entregado formalmente sigue siendo responsabilidad tuya, y que el seguro esté incluido no cambia eso.' },
  { q: '¿El mostrador está dentro del aeropuerto?', a: 'En Wiber no. La oficina está a cinco minutos, en la Ctra. Aeropuerto km 5 en Sant Josep, con lanzadera gratuita desde la terminal. Suena a inconveniente y en agosto es lo contrario: las oficinas de fuera despachan más rápido que la cola de dentro cuando aterrizan tres vuelos a la vez.' },
  { q: '¿Dónde cojo la lanzadera?', a: 'Fuera de llegadas, en la parada de lanzaderas y no en la de taxis. El trayecto a la oficina son unos cinco minutos. Mándanos tu número de vuelo y la oficina sabrá a qué hora aterrizas, algo que importa sobre todo en los vuelos de última hora de la tarde.' },
  { q: '¿Y si mi vuelo se retrasa?', a: 'Danos el número de vuelo al reservar y el retraso se resuelve solo: la oficina sigue la llegada real y no la hora contratada. Lo que sí da problemas es un cambio de vuelo que nadie conoce, así que avísanos si te reprograman.' },
  { q: '¿Qué necesito para recoger el coche?', a: 'Una tarjeta de crédito a nombre del conductor principal, el carné de conducir y un documento con foto. Los tres, siempre. La tarjeta de crédito es donde falla la gente: una de débito, o la de tu pareja, se rechaza, y a medianoche en el mostrador no hay solución.' },
  { q: '¿Cuánto se tarda en recoger?', a: 'Con la entrega sin papeleo todo está hecho antes de que llegues, así que es una entrega de llaves y no una cita en el mostrador: normalmente menos de quince minutos, lanzadera incluida. La comparación que vale es con una cola en la terminal en agosto, que pasa de la hora con regularidad.' },
  { q: '¿Qué condiciones se aplican?', a: 'Edad mínima 21, carné con al menos 12 meses de antigüedad, recargo de 9 € por día para conductores de 21 a 24 años, y tarjeta de crédito a nombre del conductor principal. El seguro va incluido en el precio, así que en el mostrador no se vende nada más.' },
]

export default function AlquilerCochesAeropuertoPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Alquiler de coches en el aeropuerto de Ibiza',
        description: 'Alquiler de coches todo incluido, recogido a cinco minutos del aeropuerto de Ibiza con lanzadera gratuita y entrega sin papeleo.',
        brand: 'Wiber Rent a Car', price: porDia, path: 'alquiler-coches-aeropuerto-ibiza',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Alquiler de coches en el aeropuerto de Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Se recoge a cinco minutos de la terminal, no dentro: la oficina de Wiber está en la Ctra.
            Aeropuerto km 5, en Sant Josep, con lanzadera gratuita desde llegadas y entrega sin papeleo.
            {porDia ? ` Tarifas desde ${porDia} € al día, todo incluido.` : ''} Y una cosa que en un viaje
            corto lo decide todo: si vuelves en un vuelo de primera hora, la devolución fuera de horario se
            pacta al reservar. No es automática.
          </p>
        }
      />

      <ItemGrid
        heading="La recogida, paso a paso"
        columns={2}
        items={[
          { name: '1. Manda el número de vuelo', body: 'Al reservar, no el mismo día. La oficina sigue la llegada real, así que un retraso se absorbe sin que tengas que llamar desde la cinta de equipajes.' },
          { name: '2. Busca la lanzadera', body: 'Fuera de llegadas, en la parada de lanzaderas y no en la de taxis. Unos cinco minutos hasta la oficina del km 5.' },
          { name: '3. Recoge la llave', body: 'El papeleo está hecho de antemano. Lleva la tarjeta de crédito a nombre del conductor principal, el carné y un documento con foto: los tres, siempre.' },
          { name: '4. Da una vuelta al coche', body: 'Fotografía lo que ya esté marcado antes de salir. Dos minutos aquí son el seguro más barato que existe, en cualquier alquiler del mundo.' },
        ]}
      />

      <ProseSection
        heading="La devolución en un vuelo de madrugada"
        paragraphs={[
          'Muchos viajes desde la península son de tres o cuatro días, y el vuelo de vuelta sale a primera hora. Eso significa devolver el coche antes de que abra la oficina, y ahí es donde se tuerce: la gente asume que hay un buzón de llaves, y lo hay unas veces sí y otras no, según la fecha y la hora.',
          'Se resuelve en un minuto al reservar. Dinos la hora del vuelo de vuelta y lo dejamos acordado: dónde se deja el coche, dónde van las llaves y quién lo revisa. Con eso, salir a las cinco de la mañana no tiene ningún misterio.',
          'Lo que no funciona es improvisarlo. Un coche que no se ha entregado formalmente sigue siendo responsabilidad tuya hasta que alguien lo recibe, y eso incluye lo que le pase mientras tanto.',
        ]}
      />

      <TrustBlock
        heading="Reservar con Wiber"
        locale={LOCALE}
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Ver disponibilidad en el aeropuerto"
        points={[
          { title: 'Lanzadera gratuita', body: 'De la terminal a la oficina del km 5, incluida. Sin taxi y sin cargo aparte.' },
          { title: 'Tarifa todo incluido', body: 'El seguro va en el precio, así que después de un vuelo largo no te venden nada en el mostrador.' },
          { title: 'Entrega sin papeleo', body: 'Todo hecho antes de tu llegada. El paso que convierte una hora en quince minutos.' },
          { title: 'Alguien en la isla', body: 'Si algo se complica en la oficina nos escribes a nosotros, no a un centro de llamadas de otro país.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Seguir leyendo" locale={LOCALE} links={[
        { label: 'Alquiler de coches en Ibiza', href: 'alquiler-coches-ibiza', body: 'La página pilar: condiciones, categorías y por qué compensa un coche aquí.' },
        { label: 'Alquiler de descapotable', href: 'alquiler-descapotable-ibiza', body: 'Las carreteras de costa por las que de verdad se reserva uno.' },
        { label: 'Alquiler de barcos en Ibiza', href: 'boats', body: 'Adónde conduces, y qué haces al llegar.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="alquiler de coches en el aeropuerto de Ibiza" />
    </>
  )
}
