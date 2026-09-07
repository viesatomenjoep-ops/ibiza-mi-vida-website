import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ChoiceCards, PriceTable, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'es'
const PAGE_KEY = 'alquiler-motos-agua-ibiza'
const precio30 = RENTAL_PRICES.jetSki30.amount

/**
 * Página en español. No es una traducción de la inglesa.
 *
 * La versión inglesa explica QUE hace falta titulación para salir solo. Para
 * quien llega desde la península eso no es la duda: el sistema de titulaciones
 * español ya lo conoce. Su pregunta es cuál sirve exactamente aquí, y qué pasa
 * si no la lleva encima ese día — porque la licencia se saca, pero el plástico
 * se queda en casa.
 *
 * De ahí el enfoque: qué acredita qué, y por qué la ruta guiada no es el premio
 * de consolación sino la opción que la mayoría acaba eligiendo.
 *
 * El núcleo legal es el mismo en las cinco versiones y va en el primer párrafo:
 * salir solo exige titulación reconocida, o vas en ruta guiada donde la del
 * guía cubre al grupo. No hay una tercera vía.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Alquiler de motos de agua en Ibiza',
    description:
      'Alquiler de motos de agua en Ibiza desde San Antonio, en turnos de 30 minutos. Salir solo exige titulación; en ruta guiada no hace falta. Comprobamos la tuya.',
    alternates: localizedAlternates('jet-ski-rental', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Alquiler de motos de agua en Ibiza',
      description: 'Motos de agua desde San Antonio. Qué titulación vale y qué hacer si no la llevas.',
      locale: 'es_ES',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Alquiler de motos de agua en Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza en el agua', path: 'boats' },
  { name: 'Alquiler de motos de agua' },
]

const FAQS: Faq[] = [
  {
    q: '¿Qué titulación hace falta para llevar una moto de agua en Ibiza?',
    a: 'Para salir solo, una titulación reconocida de moto náutica o de embarcaciones de recreo, y la base te la va a pedir. Cuál acepta exactamente cada base varía y cambia de temporada, así que mándanos una foto de la tuya con la fecha y lo confirmamos antes de reservar. Sin titulación puedes navegar igual, pero solo en ruta guiada: la del guía cubre al grupo entero.',
  },
  {
    q: 'Tengo la titulación pero no la llevo encima. ¿Vale una foto?',
    a: 'Depende de la base y no cuentes con ello. La mayoría pide el documento físico junto con el DNI o pasaporte del conductor, igual que en la puerta de una discoteca. Si tu plan depende de eso, dínoslo antes: preguntamos a la base concreta, y si la respuesta es no, reservamos la ruta guiada y no pierdes el turno.',
  },
  {
    q: '¿Cuánto cuesta media hora de moto de agua en Ibiza?',
    a: 'Treinta minutos es el turno estándar y el precio de entrada habitual en la isla. Lo que mueve la cifra es la máquina y el formato: una ruta guiada cuesta más que la misma media hora saliendo solo, porque salen un guía y una segunda moto contigo. Las semanas punta de julio y agosto están en la parte alta. Mándanos tu fecha y te damos la tarifa de ese día.',
  },
  {
    q: '¿Pueden ir dos personas en una moto?',
    a: 'Sí, en las de dos y tres plazas, que son la mayor parte de la flota de alquiler aquí, y para una pareja sale más barato. Solo conduce uno: la titulación o el requisito del guía van con quien está a los mandos. Las bases aplican un límite de peso combinado, así que dos adultos en una biplaza pequeña a veces no se acepta.',
  },
  {
    q: '¿Cuál es la edad mínima?',
    a: 'Dieciocho para conducir. Los acompañantes pueden ser más jóvenes, pero cada base fija su propio mínimo para ir detrás — a menudo sobre los 6 u 8 años, y siempre con chaleco de su talla. Lleva documento del conductor: una reserva a un nombre y otra persona a los mandos es donde empiezan los problemas.',
  },
  {
    q: '¿Qué llevo?',
    a: 'Bañador que se pueda mojar, toalla, y gafas de sol con cordón o ninguna. La crema se pone antes y aun así se va en parte. Deja el móvil en tierra salvo que tengas funda estanca y flotante: todas las bases tienen una caja de teléfonos ahogados. El chaleco lo ponen ellos y llevarlo no es opcional.',
  },
  {
    q: '¿A qué hora es mejor?',
    a: 'Por la mañana. El mar frente a San Antonio está más plano hasta cerca del mediodía; luego el embate levanta una ola corta que hace la media hora bastante más dura de lo que suena. La última hora de la tarde tiene mejor luz para fotos, pero navegas contra más marejada. En julio y agosto reserva el turno más temprano que puedas.',
  },
]

export default function AlquilerMotosAguaIbizaPage() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
        product={{
          name: 'Alquiler de motos de agua en Ibiza',
          description:
            'Alquiler de motos de agua desde San Antonio, Ibiza, en turnos de 30 minutos. La ruta guiada no exige titulación; salir solo sí.',
          price: precio30,
          path: 'alquiler-motos-agua-ibiza',
        }}
      />

      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Alquiler de motos de agua en Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Las motos salen de San Antonio en turnos de 30 minutos, que es la unidad estándar aquí y da
              para la bahía y vuelta.
              {precio30 ? ` Desde ${precio30} € por 30 minutos.` : ''} La regla que decide tu reserva es
              legal, no comercial: para salir solo hace falta titulación reconocida, o vas en ruta guiada,
              donde la del guía cubre a todo el grupo.
            </p>
            <p className="mt-4">
              Si ya tienes titulación, la pregunta real es cuál acepta la base y si te van a pedir el
              documento físico. Mándanos una foto con tu fecha y lo confirmamos antes de reservar, en
              lugar de descubrirlo en el pantalán.
            </p>
          </>
        }
      />

      <ChoiceCards
        heading="Ruta guiada o salir solo"
        locale={LOCALE}
        cards={[
          {
            title: 'Ruta guiada',
            meta: 'Sin titulación · el guía va con el grupo',
            body:
              'Un guía titulado navega contigo y su titulación cubre al grupo. Seguís una ruta fija, normalmente por la costa de San Antonio hacia los acantilados del atardecer. La única forma legal de navegar aquí sin titulación propia.',
            href: 'boats',
            cta: 'Preguntar por las rutas',
          },
          {
            title: 'Salir solo',
            meta: 'Titulación obligatoria · tu ruta dentro de una zona',
            body:
              'Enseñas una titulación válida de moto náutica o embarcaciones y sales por tu cuenta, dentro de un área marcada que define la base. Más libertad, y el ritmo lo pones tú.',
            href: 'boats',
            cta: 'Qué titulaciones valen',
          },
          {
            title: 'Dos personas',
            meta: 'Un conductor · acompañante desde los 6–8',
            body:
              'Las de dos y tres plazas llevan acompañante, lo que reduce el coste por persona a la mitad. Solo el conductor necesita titulación o guía. Hay límite de peso combinado, así que confírmalo al reservar.',
            href: 'boat-party',
            cta: 'Opciones para grupos',
          },
        ]}
      />

      <PriceTable
        heading="Lo que cuesta una moto de agua en Ibiza"
        locale={LOCALE}
        caption="Precios de entrada del alquiler de motos de agua"
        intro="Treinta minutos es el turno estándar. Una ruta guiada cuesta más que el mismo tiempo saliendo solo, porque salen un guía y una segunda moto. Julio y agosto están en la parte alta."
        rows={[
          {
            label: 'Moto de agua, 30 minutos',
            note: 'Turno estándar, una moto',
            amount: RENTAL_PRICES.jetSki30.amount,
            unit: RENTAL_PRICES.jetSki30.unit.es,
          },
        ]}
      />

      <ItemGrid
        heading="Por dónde se navega"
        intro="Todo sale de la bahía de San Antonio. Las rutas de abajo son las que cubren realmente las salidas guiadas; quien sale solo se queda dentro de una zona marcada que la base enseña en una carta antes de salir."
        columns={2}
        items={[
          {
            name: 'La bahía de San Antonio',
            body:
              'El agua resguardada donde se empieza y donde se da el briefing. Plana por la mañana, picada en cuanto entra el embate de tarde. Cerca de las playas hay límite de velocidad y la base te dice exactamente dónde está la línea.',
          },
          {
            name: 'Cala Bassa y Cala Comte',
            body:
              'Hacia el sur por la costa, rodeando las puntas hasta las dos grandes playas del oeste. La salida larga habitual. Las calas se ven desde el agua sin atracar: las motos no pintan nada en las líneas de baño.',
          },
          {
            name: 'Los acantilados del atardecer',
            body:
              'Al noroeste de la bahía, donde la costa se vuelve roca. El mejor tramo para fotos y la razón de que los turnos tardíos se agoten. Agua más abierta, así que es la primera ruta que se cae en cuanto sopla.',
          },
          {
            name: 'Hacia Es Vedrà',
            body:
              'Solo en salidas guiadas largas y solo con mar en calma. Es una navegación seria en aguas abiertas por la costa oeste, no una escapada de media hora, y ninguna base manda allí a un principiante sin guía.',
          },
        ]}
      />

      <TrustBlock
        heading="Antes de reservar"
        locale={LOCALE}
        intro="Tres cosas deciden si la reserva sale bien, y las tres se resuelven antes de llegar al pantalán."
        points={[
          {
            title: 'El tema de la titulación',
            body:
              'Resuélvelo al reservar, no en la base. Si nadie del grupo tiene titulación reconocida, la opción es la guiada — no hay una tercera, y presentarse esperando convencer a alguien cuesta el turno. Si dudas de la tuya o de si te pedirán el físico, mándanosla.',
          },
          {
            title: 'Fianza y documento',
            body:
              'Se bloquea una fianza en una tarjeta de crédito a nombre del conductor y se libera cuando la moto vuelve sin daños. Lleva la tarjeta física y documento con foto. El conductor que figura en la reserva tiene que ser quien firma.',
          },
          {
            title: 'Meteorología',
            body:
              'Los turnos de moto se cancelan más a menudo que los de barco, porque una máquina pequeña nota una ola que un casco no. Una cancelación por tiempo da turno nuevo o devolución, y la decisión es de la base.',
          },
          {
            title: 'Qué hacemos nosotros',
            body:
              'Miramos qué bases tienen tu turno libre en la fecha que quieres, en el formato que tu grupo puede usar legalmente, y respondemos por WhatsApp. Si tu grupo no puede navegar como lo imaginas, te lo decimos antes de que pagues.',
          },
        ]}
      />

      <ProseSection
        heading="Lo que le diríamos a un amigo"
        paragraphs={[
          'Reserva el primer turno del día. La diferencia entre las nueve y las tres de la tarde no es el precio, es si pasas media hora deslizándote sobre agua plana o golpeando contra un metro de ola de viento. Quien reserva el turno de tarde en agosto lo aprende una vez.',
          'Media hora es de verdad suficiente la primera vez. Suena corto y no lo es: agarrarse a velocidad usa músculos que normalmente no usas, y la mayoría está lista para parar sobre el minuto veinticinco. Reserva el turno corto y añade otro si te ha encantado.',
          'No lleves el móvil. Si la foto importa, pregunta si el guía lleva cámara — casi todos la llevan — porque la alternativa es un teléfono en un bolsillo que está bajo el agua a los diez minutos.',
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Seguir leyendo"
        locale={LOCALE}
        links={[
          { label: 'Alquiler de barcos en Ibiza', href: 'boats', body: 'La página pilar: con patrón, con titulación propia, o sin ella hasta 15 CV.' },
          { label: 'Boat party en Ibiza', href: 'boat-party', body: 'La otra forma de pasar un día en el agua.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="alquiler de motos de agua en Ibiza" />
    </>
  )
}
