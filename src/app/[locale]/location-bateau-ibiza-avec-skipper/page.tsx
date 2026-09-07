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
const LOCALE: Locale = 'fr'
const PAGE_KEY = 'location-bateau-ibiza-avec-skipper'
const prix = RENTAL_PRICES.boatWithSkipper.amount

/**
 * Version française. Pas une traduction de l'anglaise.
 *
 * L'angle est le calcul économique, parce que c'est la question que pose le
 * visiteur francophone : un skipper, c'est une ligne en plus sur un devis déjà
 * élevé. La réponse honnête est que sur la plupart des charters à la journée il
 * n'y en a pas — il est déjà dans le tarif — et que là où il est facturé à
 * part, c'est un forfait journalier qui ne bouge pas avec la taille du groupe.
 * Donc plus vous êtes nombreux, moins il pèse.
 *
 * Ce que nous n'affirmons pas : quel permis couvre quel bateau. Cela dépend du
 * type et de la longueur, donc nous vérifions avant de bloquer une date.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Location bateau Ibiza avec skipper',
    description:
      'Bateau avec skipper à Ibiza : quand il est obligatoire, ce qu’il coûte réellement, et pourquoi il pèse moins sur le devis qu’on ne le croit.',
    alternates: localizedAlternates('boat-with-skipper', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Location bateau Ibiza avec skipper',
      description: 'Quand le skipper est obligatoire, et ce qu’il coûte vraiment sur un devis.',
      locale: 'fr_FR',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Location bateau Ibiza avec skipper' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza sur l’eau', path: 'boats' },
  { name: 'Avec skipper' },
]

const FAQS: Faq[] = [
  { q: 'Combien coûte réellement un skipper ?', a: 'Sur la plupart des charters à la journée, rien de plus : il est déjà compris dans le tarif annoncé plutôt qu’ajouté en ligne séparée. Quand il est facturé à part, c’est un forfait journalier qui ne varie pas avec la taille du groupe — il se répartit donc sur le nombre de personnes à bord, et pèse d’autant moins que vous êtes nombreux. Le carburant reste séparé dans les deux cas. Demandez-nous pour un bateau précis et nous vous disons lequel des deux s’applique.' },
  { q: 'Quand le skipper est-il obligatoire ?', a: 'Dès que le bateau dépasse ce que couvre votre permis — et pour la plupart des visiteurs c’est plus tôt qu’attendu. S’y ajoutent la majorité des yachts à moteur et presque tous les catamarans, loués avec skipper quel que soit votre permis. C’est fixé par le propriétaire et l’assureur, et cela ne se négocie pas au ponton.' },
  { q: 'Mon permis bateau français est-il reconnu ?', a: 'Pas automatiquement pour toutes les catégories. L’Espagne reconnaît les permis étrangers catégorie par catégorie, et la réponse dépend du type de bateau et de sa longueur. Envoyez-nous le permis ET le bateau envisagé : nous vérifions la combinaison avant que vous bloquiez une date. Cela évite une journée de charter qui n’a pas lieu.' },
  { q: 'Les skippers parlent-ils français ?', a: 'L’anglais est très répandu et l’espagnol va de soi. Le français existe, mais sur moins de bateaux : le demander réduit donc la flotte plutôt que d’ajouter un coût. Dites-le dès la demande, car filtrer ensuite revient généralement à changer de bateau.' },
  { q: 'Est-ce que cela reste ma journée ?', a: 'Oui, à une exception près. Vous choisissez où aller et combien de temps rester dans chaque crique ; le skipper décide de ce qui est sûr, et cette décision est sans appel. En pratique son avis améliore la journée plus qu’il ne la contraint, parce qu’il sait quelles criques fonctionnent avec le vent qui souffle réellement.' },
  { q: 'Faut-il donner un pourboire ?', a: 'Ce n’est pas obligatoire, et c’est sincèrement apprécié après une journée réussie. Il n’y a pas de pourcentage standard ici. Traitez cela comme avec un bon guide, pas comme une addition au restaurant.' },
  { q: 'Le skipper compte-t-il dans le nombre de passagers ?', a: 'Sur certains certificats oui, sur d’autres non, et cette différence a déjà laissé des groupes à une personne près sur le ponton. Donnez-nous le nombre réel et nous le vérifions sur le bateau concerné avant que vous payiez.' },
]

export default function LocationBateauAvecSkipperPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Location de bateau à Ibiza avec skipper',
        description: 'Charters à la journée avec skipper à Ibiza, au départ des marinas de l’île, avec des skippers locaux travaillant en plusieurs langues.',
        brand: 'Click&Boat', price: prix, path: 'location-bateau-ibiza-avec-skipper',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Location de bateau à Ibiza avec skipper"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Le skipper est obligatoire sur la plupart des bateaux qui dépassent ce que couvre un permis
            courant, et sur presque tous les grands yachts à moteur et catamarans d’ici.
            {prix ? ` Charters à la journée avec skipper à partir de ${prix} € par jour.` : ''} Bonne
            nouvelle pour le devis : sur la majorité des charters il est déjà compris dans le tarif, pas
            ajouté par-dessus.
          </p>
        }
      />

      <ItemGrid
        heading="Quand il en faut un, et quand on en veut un"
        columns={2}
        items={[
          { name: 'Imposé par le bateau', body: 'La plupart des yachts à moteur au-delà des petites catégories et presque tous les catamarans sont loués avec skipper, quel que soit votre permis. C’est le propriétaire et l’assureur qui le fixent, et cela ne se discute pas au ponton.' },
          { name: 'Imposé par votre permis', body: 'Un permis étranger n’est pas reconnu en Espagne pour toutes les catégories. Envoyez-nous le permis et le bateau, nous vérifions la combinaison avant que vous vous engagiez sur une date.' },
          { name: 'Utile pour la météo', body: 'La tramontane ferme le nord de l’île pendant des jours alors que le sud et l’ouest restent praticables. Un skipper inverse l’itinéraire le matin même ; un débutant qui pilote lui-même ne sait généralement pas qu’il le faudrait.' },
          { name: 'Utile pour le mouillage', body: 'Savoir où le fond tient dans chaque crique ne s’apprend pas sur une carte. C’est la plus grande différence pratique entre une journée avec skipper et une journée sans.' },
        ]}
      />

      <PriceTable
        heading="Ce que coûte une journée avec skipper"
        locale={LOCALE}
        caption="Prix d’entrée pour un charter avec skipper"
        intro="Par bateau et par jour. Sur la plupart des charters le skipper est compris dans ce tarif ; là où il est séparé, c’est un forfait journalier indépendant de la taille du groupe. Le carburant est facturé à la consommation dans les deux cas."
        rows={[{ label: 'Charter à la journée avec skipper', note: 'Skipper compris dans le tarif', amount: prix, unit: RENTAL_PRICES.boatWithSkipper.unit.fr }]}
      />

      <ProseSection
        heading="Ce qu’un bon skipper change vraiment"
        paragraphs={[
          'La réponse évidente est que vous n’avez pas à piloter. La vraie réponse est l’itinéraire. Ibiza a un côté au vent et un côté sous le vent qui s’échangent selon les jours, et un skipper qui connaît ces eaux sait dès le petit-déjeuner dans quelles criques on pourra nager à quatorze heures. Cela ne se cherche nulle part.',
          'La seconde chose est l’horaire. Arriver à Cala Comte à onze heures en août, c’est tourner en rond pour trouver une place ; y arriver à neuf heures ou à dix-sept heures, c’est mouiller où l’on veut. Les skippers organisent la journée autour de cela par habitude, et c’est exactement le genre de chose qu’on n’apprend qu’en se trompant une fois.',
        ]}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <AffiliateLink href={CLICKANDBOAT_URL} partner="Click&Boat" locale={LOCALE}>
            Voir les bateaux avec skipper sur Click&amp;Boat
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="À lire ensuite" locale={LOCALE} links={[
        { label: 'Location de bateau à Ibiza', href: 'boats', body: 'La page pilier : les trois façons de prendre la mer, avec marinas et itinéraires.' },
        { label: 'Location de bateau sans permis', href: 'location-bateau-ibiza-sans-permis', body: 'L’autre extrémité : 15 ch, aucun papier, criques proches.' },
        { label: 'Boat party à Ibiza', href: 'boat-party', body: 'Quand vous voulez l’ambiance plutôt que le bateau pour vous seuls.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="location de bateau à Ibiza avec skipper" />
    </>
  )
}
