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
const LOCALE: Locale = 'fr'
const PAGE_KEY = 'location-cabriolet-ibiza'

/**
 * Version française. Pas une traduction de l'anglaise.
 *
 * L'angle est le coffre, parce que c'est le détail qui transforme une bonne
 * idée en mauvaise semaine : la capote vit DANS le coffre. Le volume annoncé
 * pour la catégorie est donc le volume capote fermée, et une famille de quatre
 * avec valises ne rentre pas — quoi qu'en dise la fiche.
 *
 * Le découvrir au comptoir à onze heures du soir, avec tout le monde qui
 * attend, est une soirée gâchée. Le savoir avant change simplement la
 * réservation : le cabriolet pour deux jours, autre chose pour le reste.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Location de cabriolet à Ibiza',
    description:
      'Louer un cabriolet à Ibiza : les routes côtières qui le justifient, ce qui rentre vraiment dans le coffre, et les contraintes dont personne ne parle avant.',
    alternates: localizedAlternates('convertible-rental', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Location de cabriolet à Ibiza',
      description: 'Les routes qui le justifient, et le coffre qui décide de votre réservation.',
      locale: 'fr_FR',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Location de cabriolet à Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Location voiture Ibiza', path: 'location-voiture-ibiza' },
  { name: 'Cabriolet' },
]

const FAQS: Faq[] = [
  { q: 'Combien de bagages rentrent dans un cabriolet ?', a: 'Moins qu’on ne le croit, et encore moins capote ouverte, parce que la capote se range dans le coffre. Le volume annoncé pour la catégorie est donc celui capote fermée. Deux personnes avec des bagages cabine sont à l’aise ; quatre personnes avec des valises ne rentrent pas, quoi qu’en dise la fiche. Si vous atterrissez à quatre, prenez la compacte et louez le cabriolet pour une journée.' },
  { q: 'Un cabriolet vaut-il le coup à Ibiza ?', a: 'Pour les routes côtières, oui. Le trajet de Sant Josep vers la Cala d’Hort et la route du nord vers Portinatx sont réellement meilleurs capote ouverte, et ce sont les routes dont on se souvient. Pour une semaine d’allers-retours à l’aéroport et au supermarché, non : vous payez plus pour un coffre plus petit et une voiture qu’il faut vider à chaque arrêt.' },
  { q: 'Puis-je laisser des affaires dedans pendant que je me baigne ?', a: 'Non, et c’est la contrainte pratique qui gâche les semaines en cabriolet. Une voiture ouverte sur un parking de plage est une invitation, et même capote fermée, une toile n’est pas un coffre verrouillable. Cela veut dire vider la voiture à chaque arrêt : une gêne mineure sur une route, une vraie corvée un jour de plage.' },
  { q: 'Combien coûte un cabriolet par rapport à une voiture normale ?', a: 'Plus cher par jour qu’une économique ou une compacte, et l’écart se creuse en juillet et août parce que la catégorie part en premier. La façon honnête de le réserver est de le prendre pour les jours où vous ferez vraiment la côte — même si, sur un court séjour, la simplicité d’une seule réservation l’emporte souvent.' },
  { q: 'Ne fait-il pas trop chaud capote ouverte ?', a: 'En plein après-midi de juillet, honnêtement oui : vous êtes à l’arrêt dans le trafic, en plein soleil, sans ombre. Les heures capote ouverte ici sont tôt le matin et à partir de dix-huit heures, ce qui correspond justement au moment où les routes côtières sont les plus belles. Planifiez la sortie à ces heures-là et c’est parfait.' },
  { q: 'Faut-il réserver plus à l’avance ?', a: 'Oui. Les cabriolets représentent une petite part de toute flotte à Ibiza et sont la première catégorie épuisée en semaines de pointe. Réserver au printemps pour août est normal ; réserver en juillet pour août signifie en général qu’il ne reste rien, à aucun prix.' },
]

export default function LocationCabrioletPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Location de cabriolet à Ibiza',
        description: 'Location de cabriolet à Ibiza pour les routes de la côte ouest et nord, tout compris via Wiber Rent a Car.',
        brand: 'Wiber Rent a Car', price: null, path: 'location-cabriolet-ibiza',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Location de cabriolet à Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Un cabriolet justifie son supplément sur environ trois routes ici, et la plus belle est le
            quart d’heure de Sant Josep vers la Cala d’Hort, Es Vedrà droit devant. Mais un détail décide
            de la réservation avant tout le reste : la capote se range dans le coffre. Le volume annoncé
            est donc celui capote fermée, et quatre personnes avec des valises n’y rentrent pas.
          </p>
        }
      />

      <ItemGrid
        heading="Les routes qui valent la capote ouverte"
        intro="Trois trajets qui justifient la catégorie, et un qui ne la justifie pas."
        items={[
          { name: 'Sant Josep vers la Cala d’Hort', body: 'La descente du sud-ouest, à travers pins et terrasses, avec Es Vedrà qui remplit le pare-brise à l’arrivée. Les vingt plus belles minutes de conduite de l’île, et meilleures encore dans la dernière heure de lumière.' },
          { name: 'La route du nord vers Portinatx', body: 'Plus longue, plus verte et plus vide, sinueuse à travers Sant Joan. Plus lente que la carte ne le laisse croire, et meilleure pour cette raison. Celle-ci se fait le matin, avant la chaleur.' },
          { name: 'Ibiza ville vers Santa Eulària', body: 'L’option côtière facile, courte et civilisée, parfaite pour une soirée. Pas spectaculaire, mais agréable capote ouverte et sans le moindre effort.' },
          { name: 'Pas : la route de l’aéroport', body: 'Droite, chargée et chaude, avec des travaux quelque part presque chaque saison. Personne n’a jamais apprécié celle-ci capote ouverte dans le trafic d’août.' },
        ]}
      />

      <PriceTable
        heading="Ce que cela coûte"
        locale={LOCALE}
        caption="Prix d’entrée pour la location de cabriolet"
        intro="Plus élevé par jour qu’une économique ou une compacte, et la catégorie part en premier en semaines de pointe. Demandez-nous le chiffre pour vos dates : il bouge davantage avec la saison qu’avec le modèle."
        rows={[{ label: 'Cabriolet', note: '2 adultes, petit coffre, routes côtières', amount: null, unit: RENTAL_PRICES.carPerDay.unit.fr }]}
      />

      <ProseSection
        heading="Le coffre, et ce qu’il implique"
        paragraphs={[
          'La capote vit dans le coffre : le volume indiqué pour la catégorie est celui capote fermée. Deux personnes avec des bagages cabine sont à l’aise ; quatre avec des valises ne rentrent pas, et le découvrir au comptoir à onze heures du soir avec une famille qui attend fait une mauvaise soirée.',
          'L’autre contrainte est le stationnement. Une toile n’est pas un coffre verrouillable, et une voiture ouverte sur un parking de plage est une invitation. En pratique, la voiture se vide à chaque arrêt : gêne mineure sur une route, vraie corvée un jour de plage. Si votre semaine est surtout faite de plages, louez le cabriolet deux jours et prenez autre chose pour le reste.',
        ]}
      />

      <TrustBlock
        heading="Réserver via Wiber"
        locale={LOCALE}
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Voir les disponibilités cabriolet"
        points={[
          { title: 'Réservez tôt', body: 'Les cabriolets sont une petite part de toute flotte à Ibiza et la première catégorie épuisée pour juillet et août.' },
          { title: 'Tarif tout compris', body: 'Assurance incluse : le supplément que vous payez porte sur la voiture, pas sur une couverture vendue au comptoir.' },
          { title: 'Mêmes conditions', body: 'Âge minimum 21 ans, permis depuis 12 mois, supplément de 9 € par jour pour les 21–24 ans, carte de crédit au nom du conducteur principal.' },
          { title: 'À cinq minutes de l’aéroport', body: 'Même agence et même navette gratuite que toutes les autres catégories — Ctra. Aeropuerto km 5, Sant Josep.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="À lire ensuite" locale={LOCALE} links={[
        { label: 'Location de voiture à Ibiza', href: 'location-voiture-ibiza', body: 'La page pilier : toutes les catégories, conditions et conseils de stationnement.' },
        { label: 'Location à l’aéroport', href: 'location-voiture-ibiza-aeroport', body: 'La récupération, la navette et le numéro de vol qui change tout.' },
        { label: 'Location de bateau à Ibiza', href: 'boats', body: 'La Cala d’Hort depuis l’eau plutôt que depuis la route des falaises.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="location de cabriolet à Ibiza" />
    </>
  )
}
