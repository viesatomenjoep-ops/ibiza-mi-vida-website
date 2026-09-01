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
const LOCALE: Locale = 'fr'
const PAGE_KEY = 'location-voiture-ibiza'
const parJour = RENTAL_PRICES.carPerDay.amount

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Location de voiture à Ibiza, tout compris',
    description:
      'Location de voiture à Ibiza avec Wiber : tarif tout compris, agence à cinq minutes de l’aéroport, navette gratuite. Conditions, caution et suppléments.',
    alternates: localizedAlternates('car-rental', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Location de voiture à Ibiza, tout compris',
      description: 'Location de voiture à Ibiza avec Wiber : tout compris, à cinq minutes de l’aéroport, navette gratuite.',
      locale: 'fr_FR',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Location de voiture à Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Accueil', path: '' },
  { name: 'Location de voiture Ibiza' },
]

const FAQS: Faq[] = [
  { q: 'Peut-on louer une voiture à l’aéroport d’Ibiza ?', a: 'Vous la récupérez à cinq minutes, pas dans le terminal. L’agence Wiber se trouve Ctra. Aeropuerto km 5 à Sant Josep, avec une navette gratuite depuis les arrivées. Cela ressemble à un inconvénient et c’est l’inverse en août : les comptoirs du terminal dépassent régulièrement l’heure d’attente après une série de vols du soir.' },
  { q: 'Que signifie vraiment « tout compris » ?', a: 'Que le prix annoncé est le prix payé : l’assurance est dans le tarif au lieu d’être vendue au comptoir, et il n’y a pas de jeu sur la caution carburant. Cela ne veut pas dire que rien ne peut jamais s’ajouter — les dommages hors couverture, une clé perdue ou le plein non refait restent à votre charge. La différence avec un prix d’appel, c’est que rien ne s’ajoute simplement parce que vous avez refusé au comptoir.' },
  { q: 'Peut-on louer à 21 ans ?', a: 'Oui. L’âge minimum est de 21 ans et le permis doit être détenu depuis au moins 12 mois. Les conducteurs de 21 à 24 ans paient un supplément jeune conducteur de 9 € par jour, qui s’ajoute au tarif et n’est pas absorbé par le prix tout compris. À partir de 25 ans, il disparaît.' },
  { q: 'Faut-il une carte de crédit ?', a: 'Oui, au nom du conducteur principal. C’est de loin la première raison pour laquelle des clients repartent bredouilles d’un comptoir espagnol : une carte de débit ou une carte au nom du conjoint est refusée. La caution est pré-autorisée, non débitée, et libérée au retour du véhicule.' },
  { q: 'Un cabriolet en vaut-il la peine à Ibiza ?', a: 'Pour les routes côtières, franchement oui — la descente de Sant Josep vers Cala d’Hort capote baissée est la raison d’en louer un. Pour une semaine de courses et de trajets vers l’aéroport, non : vous payez plus, le coffre est plus petit, et une voiture ouverte sur un parking de plage doit être vidée à chaque arrêt. Louez-le pour la route, pas pour la semaine.' },
  { q: 'Ai-je vraiment besoin d’une voiture ?', a: 'Si vous restez à Ibiza-Ville ou San Antonio sans en bouger, non : bus et taxis suffisent. Si vous voulez Cala Salada, Cala d’Hort, le nord autour de Sant Joan ou n’importe quelle crique au bout d’une piste, oui. C’est précisément ce dont les gens parlent au retour, et aucun bus n’y va.' },
  { q: 'Et le stationnement ?', a: 'Prévoyez-le, car en août il décide de votre journée. À Ibiza-Ville, vous vous garez en souterrain et vous payez ; les places gratuites en rue sont quasi inexistantes en saison. San Antonio est plus facile côté baie. Les parkings de Comte et Bassa sont pleins en milieu de matinée : avant dix heures ou après seize heures, c’est toute l’astuce.' },
  { q: 'Puis-je emprunter les pistes en terre ?', a: 'Sur les pistes damées comme celle de Cala Salada, oui, et tout le monde le fait. Sur les portions plus rudes du nord, lisez d’abord vos conditions : la plupart des contrats excluent les dommages hors routes goudronnées, et un carter percé sur un chemin rocailleux sera pour vous. Si le programme est vraiment isolé, prenez le 4x4 plutôt que la citadine la moins chère.' },
]

export default function LocationVoitureIbizaPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Location de voiture à Ibiza',
        description: 'Location de voiture tout compris à Ibiza avec Wiber Rent a Car, à cinq minutes de l’aéroport avec navette gratuite et prise en charge sans contact.',
        brand: 'Wiber Rent a Car', price: parJour, path: 'location-voiture-ibiza',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Location de voiture à Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Nous réservons la location de voiture à Ibiza chez Wiber Rent a Car : tarif tout compris avec
              l&apos;assurance incluse, une agence à cinq minutes de l&apos;aéroport, Ctra. Aeropuerto km 5
              à Sant Josep, une navette gratuite depuis le terminal et une prise en charge sans contact.
              {parJour ? ` Les tarifs démarrent à €${parJour} par jour.` : ''} Âge minimum 21 ans, avec un
              supplément de 9 € par jour pour les conducteurs de 21 à 24 ans.
            </p>
            <p className="mt-4">
              La raison d&apos;avoir une voiture ici n&apos;est pas le trajet depuis l&apos;aéroport. Ce sont
              Cala Salada, Cala d&apos;Hort et la côte nord — les endroits où aucun bus ne va.
            </p>
          </>
        }
      >
        <WiberDirect locale={LOCALE} />
      </HubHero>

      <PriceTable
        heading="Combien coûte une location de voiture à Ibiza ?"
        locale={LOCALE}
        caption="Prix à partir de, par catégorie"
        intro="Prix à partir de, par jour, tout compris. Les tarifs grimpent fortement en juillet et août et les catégories économiques partent en premier — l’écart entre réserver en avril et en juillet dépasse l’écart entre les catégories."
        rows={[
          { label: 'Économique', note: 'Deux adultes, bagage cabine, stationnement en ville', amount: RENTAL_PRICES.carPerDay.amount, unit: RENTAL_PRICES.carPerDay.unit.fr },
          { label: 'Compacte', note: 'Quatre adultes avec de vraies valises', amount: null, unit: RENTAL_PRICES.carPerDay.unit.fr },
          { label: 'Cabriolet', note: 'Deux personnes, petit coffre, routes côtières', amount: null, unit: RENTAL_PRICES.carPerDay.unit.fr },
          { label: 'SUV / 4x4', note: 'Pistes en terre et criques isolées', amount: null, unit: RENTAL_PRICES.carPerDay.unit.fr },
        ]}
      />

      <ItemGrid
        heading="Les conditions, annoncées d’emblée"
        columns={2}
        intro="Rien d’inhabituel pour l’Espagne, mais mieux vaut le savoir avant d’atterrir qu’au comptoir à onze heures du soir."
        items={[
          { name: 'Âge et permis', body: '21 ans minimum, permis détenu depuis au moins 12 mois. Les conducteurs de 21 à 24 ans paient 9 € par jour de supplément jeune conducteur, en plus du tarif. À partir de 25 ans, il n’y a pas de supplément.' },
          { name: 'Carte de crédit et caution', body: 'Une carte de crédit au nom du conducteur principal est exigée. La caution est pré-autorisée, non débitée, et libérée au retour. Une carte de débit ou celle d’un autre membre du groupe est refusée — c’est là que ça bloque le plus souvent.' },
          { name: 'Ce que couvre l’assurance', body: 'La couverture est dans le tarif tout compris au lieu d’être vendue au comptoir. Elle ne couvre pas tout : dommages hors routes goudronnées, clé perdue ou intérieur après un week-end humide en sont exclus. Demandez le montant de la franchise et ce qui annule la couverture.' },
          { name: 'Carburant et restitution', body: 'Plein au départ, plein au retour. Le plein fait par le loueur est facturé à un tarif qui ne fait plaisir à personne, et la station la plus proche de l’aéroport sait très bien pourquoi vous y êtes à sept heures du matin.' },
        ]}
      />

      <ProseSection
        heading="Pourquoi une voiture ici"
        paragraphs={[
          'L’île est assez petite pour que tout paraisse proche sur la carte, et assez lente en pratique pour que ce ne soit pas le cas. Trente kilomètres en travers de l’île, c’est une heure en août, et les deux derniers sont souvent une piste. Voilà l’argument en une phrase : les criques qui valent le déplacement sont précisément celles que les bus ne desservent pas.',
          'Cala Salada en est l’exemple le plus net. Elle est au bout d’une route étroite au nord de San Antonio, avec un petit parking plein dès dix heures, et la marche depuis le débordement décourage la plupart des gens. Cala d’Hort, face à Es Vedrà, raconte la même histoire de l’autre côté de l’île.',
          'Si le programme comprend les pistes plus rudes du nord, prenez le 4x4 plutôt que la citadine la moins chère. Non pas parce qu’une petite voiture n’y arriverait pas, mais parce que la plupart des contrats excluent les dommages hors routes goudronnées, et un carter fendu sur un chemin rocailleux est une facture que personne n’a prévue.',
          'Le stationnement est sous-estimé. À Ibiza-Ville en août, vous vous garez en souterrain et vous payez, ou vous tournez. Aux plages de la côte ouest : avant dix heures ou après seize. Organisez la journée là-dessus et la voiture est la meilleure décision du séjour.',
        ]}
      />

      <TrustBlock
        heading="Réserver chez Wiber"
        locale={LOCALE}
        intro="Wiber Rent a Car est notre partenaire location de voiture sur l’île. Nous passons par eux parce que le tarif tout compris tient aussi au comptoir, ce qui n’est pas vrai de tous les prix d’appel à l’aéroport d’Ibiza."
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Vérifier les disponibilités chez Wiber"
        points={[
          { title: 'À cinq minutes de l’aéroport', body: 'L’agence est Ctra. Aeropuerto km 5, Sant Josep, avec navette gratuite depuis le terminal. Hors aéroport, mais plus rapide en haute saison que la file à l’intérieur.' },
          { title: 'Prise en charge sans contact', body: 'Les documents sont réglés avant votre arrivée : la prise en charge est une remise de clés, pas un rendez-vous au comptoir. Après un atterrissage tardif, c’est la différence entre vingt minutes et une heure.' },
          { title: 'Tout compris veut dire que le prix tient', body: 'L’assurance est dans le tarif. Personne ne vous vend une couverture au comptoir parce que vous avez refusé en ligne — c’est le mécanisme derrière la plupart des récits de « prix doublé » dans les aéroports espagnols.' },
          { title: 'Ce que nous faisons', body: 'Nous réservons avec vous sur WhatsApp et restons joignables tant que vous avez la voiture. Si quelque chose coince au comptoir, vous avez un numéro local plutôt qu’un centre d’appels.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Pages liées" locale={LOCALE} links={[
        { label: 'Location de bateau à Ibiza', href: 'location-bateau-ibiza', body: 'Les criques inaccessibles en voiture, vues depuis l’eau.' },
        { label: 'Conseils Ibiza', href: 'tips', body: 'Criques, stationnement et meilleure période pour venir.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="la location de voiture à Ibiza" />
    </>
  )
}
