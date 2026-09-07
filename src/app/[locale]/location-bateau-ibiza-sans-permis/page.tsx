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
const LOCALE: Locale = 'fr'
const PAGE_KEY = 'location-bateau-ibiza-sans-permis'
const prix = RENTAL_PRICES.boatNoLicence.amount

/**
 * Version française. Pas une traduction de l'anglaise.
 *
 * L'angle est la zone de navigation, parce que c'est la condition qui n'a pas
 * d'équivalent en France. Là-bas, une sortie sans permis se pense en termes de
 * puissance et de distance d'un abri ; ici la base trace un périmètre sur une
 * carte pendant le briefing, et en sortir fait tomber la couverture. Un
 * plaisancier français peut lire les quatre conditions et ne retenir que les
 * trois qu'il reconnaît.
 *
 * Concrètement, c'est la condition qui décide de la journée : elle définit
 * jusqu'où on va, donc ce qu'on peut espérer voir.
 *
 * Les quatre conditions relèvent du droit espagnol et non d'une règle maison,
 * et c'est écrit tel quel.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Location bateau Ibiza sans permis',
    description:
      'Louer un bateau à Ibiza sans permis : 15 ch maximum, coque de moins de six mètres, pilote de 18 ans et une zone de navigation convenue. Jusqu’où on va vraiment.',
    alternates: localizedAlternates('boat-no-licence', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Location bateau Ibiza sans permis',
      description: 'Les quatre conditions espagnoles, dont une qui n’existe pas en France : la zone.',
      locale: 'fr_FR',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Location bateau Ibiza sans permis' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza sur l’eau', path: 'boats' },
  { name: 'Sans permis' },
]

const FAQS: Faq[] = [
  { q: 'Qu’est-ce que la zone de navigation, exactement ?', a: 'Un périmètre que la base trace sur une carte pendant le briefing, généralement la portion de côte autour de votre port de départ. C’est la condition qui n’a pas vraiment d’équivalent en France, et c’est celle qui décide de la journée : elle définit jusqu’où vous allez et donc ce que vous pouvez espérer voir. En sortir fait tomber la couverture d’assurance, et les garde-côtes contrôlent réellement ici.' },
  { q: 'Peut-on vraiment louer un bateau à Ibiza sans aucun permis ?', a: 'Oui, dans une limite précise. Les règles espagnoles autorisent toute personne de 18 ans ou plus à piloter un bateau de 15 ch maximum avec une coque de moins de six mètres, sans permis et sans expérience justifiée. Vous recevez un briefing avant de partir et une zone de navigation dans laquelle vous restez. Tout ce qui est plus puissant ou plus long exige un permis reconnu, et aucun loueur ne peut y déroger.' },
  { q: 'Que représentent 15 ch en pratique ?', a: 'De quoi déplacer un petit bateau avec quatre à six personnes à une allure comprise entre la marche et le jogging, et pas de quoi déjauger ni remonter au vent. Voyez cela comme un moyen d’atteindre la crique suivante en vingt minutes, pas de faire le tour de l’île. Qui imagine un hors-bord sera déçu ; qui imagine un pique-nique flottant, non.' },
  { q: 'Peut-on aller à Formentera ?', a: 'Non, et mieux vaut le savoir avant de réserver qu’au ponton. La traversée ne fait pas partie de la zone : c’est de l’eau libre, cela demande un autre bateau et, réalistement, un skipper. Si Formentera était le programme de la journée, la bonne option est le ferry ou un charter avec skipper, et nous le disons avant que vous payiez.' },
  { q: 'Combien cela coûte-t-il ?', a: 'Les bateaux sans permis sont la façon la moins chère de prendre la mer à Ibiza, et coûtent moins que n’importe quel charter avec skipper. Le carburant est facturé à part selon la consommation, et sur un moteur de 15 ch elle est vraiment faible. Le tarif suit la saison : envoyez votre date et la taille du groupe pour le chiffre du jour.' },
  { q: 'Combien de personnes à bord ?', a: 'Quatre à six, selon le certificat du bateau et non selon la place sur le pont. Donnez le nombre réel dès la demande, enfants compris — arriver à sept avec un certificat pour six signifie que quelqu’un reste sur le ponton.' },
  { q: 'Faut-il de l’expérience ?', a: 'Non, et la plupart de ceux qui partent avec n’en ont aucune. Le briefing couvre le démarrage, l’arrêt, la barre, le mouillage et la conduite à tenir si le moteur s’arrête, et les bateaux sont volontairement lents et tolérants. Si vous savez faire un créneau en marche arrière, vous saurez gérer celui-ci.' },
]

export default function LocationBateauSansPermisPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Location de bateau à Ibiza sans permis',
        description: 'Location de bateau à Ibiza sans permis : jusqu’à 15 ch, coque de moins de six mètres, pilote de 18 ans ou plus.',
        brand: 'Click&Boat', price: prix, path: 'location-bateau-ibiza-sans-permis',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Location de bateau à Ibiza sans permis"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Vous pouvez piloter un bateau à Ibiza sans aucun permis, à condition de rester dans quatre
            limites : 15 ch maximum, une coque de moins de six mètres, un pilote de 18 ans ou plus, et une
            zone de navigation convenue dans laquelle vous restez après le briefing de sécurité.
            {prix ? ` Bateaux à partir de ${prix} € par jour.` : ''} C’est la quatrième qui surprend le
            plus : elle n’a pas d’équivalent en France et c’est elle qui décide de la journée.
          </p>
        }
      />

      <ItemGrid
        heading="Les quatre règles, en entier"
        columns={2}
        intro="Ce sont des limites légales et non une politique maison. Un loueur qui propose d’en assouplir une propose de vous mettre hors assurance."
        items={[
          { name: '15 ch maximum', body: 'Le plafond de puissance pour naviguer sans permis. C’est le chiffre qui décide de tout le reste de la journée : lent, stable, et parfait pour passer d’une crique proche à l’autre.' },
          { name: 'Coque de moins de six mètres', body: 'La longueur compte autant que la puissance. Un bateau peut rester sous 15 ch et exiger malgré tout un permis si la coque est trop longue — d’où une flotte réduite et très spécifique.' },
          { name: 'Pilote de 18 ans ou plus', body: 'La personne à la barre doit avoir 18 ans, avec une pièce d’identité. Les passagers peuvent avoir tout âge, avec un gilet à leur taille. Seul le pilote signe.' },
          { name: 'Une zone de navigation définie', body: 'Tracée sur une carte au briefing, en général la côte autour de votre port de départ. En sortir fait tomber la couverture, et les garde-côtes contrôlent bel et bien.' },
        ]}
      />

      <PriceTable
        heading="Ce que cela coûte"
        locale={LOCALE}
        caption="Prix d’entrée pour un bateau sans permis"
        intro="Par bateau et par jour, partagé entre quatre et six personnes. Le carburant est en sus et la consommation d’un 15 ch reste modeste."
        rows={[{ label: 'Bateau sans permis', note: '4–6 personnes, 15 ch max', amount: prix, unit: RENTAL_PRICES.boatNoLicence.unit.fr }]}
      />

      <ItemGrid
        heading="Jusqu’où on va réellement"
        intro="Destinations réalistes à 15 ch au départ de San Antonio, où se trouve l’essentiel des bateaux sans permis."
        items={[
          { name: 'Cala Bassa', body: 'Vingt à trente minutes le long de la côte, abritée et sableuse. Le premier arrêt classique, et le seul qui fonctionne vraiment avec des enfants à bord.' },
          { name: 'Cala Comte', body: 'Un peu plus au sud, peu profonde et turquoise. Accessible par mer calme ; regardez la météo, car le retour face au vent à 15 ch est long.' },
          { name: 'La baie de San Antonio', body: 'La baie elle-même est le repli, et ce n’est pas un lot de consolation : eau plate, mouillage facile, et assez près pour rentrer déjeuner.' },
        ]}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <AffiliateLink href={CLICKANDBOAT_URL} partner="Click&Boat" locale={LOCALE}>
            Voir les bateaux sans permis sur Click&amp;Boat
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="À lire ensuite" locale={LOCALE} links={[
        { label: 'Location de bateau à Ibiza', href: 'boats', body: 'La page pilier : les trois façons de prendre la mer, avec tarifs et marinas.' },
        { label: 'Location de bateau avec skipper', href: 'location-bateau-ibiza-avec-skipper', body: 'Quand quelqu’un d’autre pilote, et pourquoi c’est souvent le meilleur calcul.' },
        { label: 'Location de jet-ski à Ibiza', href: 'location-jet-ski-ibiza', body: 'La version rapide et courte, avec ses propres règles de permis.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="location de bateau à Ibiza sans permis" />
    </>
  )
}
