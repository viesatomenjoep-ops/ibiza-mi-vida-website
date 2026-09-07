import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { ctBrowseLink } from '@/lib/ct-link'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'fr'
const PAGE_KEY = 'billets-clubs-ibiza'

/**
 * Page pilier en français. Pas une traduction de la version anglaise.
 *
 * L'angle est différent parce que la question l'est. Le visiteur francophone
 * arrive souvent avec une idée du clubbing calquée sur une nuit en ville :
 * sortir vers minuit, rentrer vers quatre heures. Ici la nuit commence quand
 * l'autre se termine, et c'est ce décalage — pas le prix — qui gâche le plus de
 * soirées. D'où le sujet de cette page : les horaires, et ce qu'ils impliquent
 * pour la journée entière.
 *
 * L'anglaise répond surtout à « combien ça coûte », la néerlandaise à « est-ce
 * fiable », l'allemande à « quand acheter », l'espagnole à « pourquoi ce
 * prix ». Toutes sont vraies ; les réunir sur une page n'en traite aucune
 * correctement.
 *
 * Les fourchettes sont le marché observable, pas notre tarif : nous revendons
 * via ClubTickets, et une saison de prix dynamiques ferait de « notre prix »
 * une promesse intenable.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Billets clubs Ibiza 2026',
    description:
      'Billets pour les clubs d’Ibiza 2026 : 20–30 € en semaine, 50–125 €+ pour une tête d’affiche à UNVRS, Hï ou Ushuaïa. Horaires réels et conseils.',
    alternates: localizedAlternates('club-tickets-hub', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Billets clubs Ibiza 2026',
      description: 'Ce que coûte une entrée à Ibiza, et à quelle heure la nuit commence vraiment.',
      locale: 'fr_FR',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Billets clubs Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Billets clubs Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: 'À quelle heure commence vraiment une nuit à Ibiza ?',
    a: 'Bien plus tard qu’ailleurs, et c’est l’erreur la plus coûteuse. Les clubs de nuit ouvrent vers minuit et tournent jusqu’à six heures du matin, la tête d’affiche passant souvent entre deux et trois heures. Arriver à l’ouverture, c’est regarder une mise en route dans une salle vide. Ushuaïa fait exception et fonctionne de jour, de la fin d’après-midi jusque vers minuit.',
  },
  {
    q: 'Combien coûte une entrée en club à Ibiza ?',
    a: 'Deux mondes différents. Une soirée en semaine dans une salle plus petite se situe entre 20 et 30 €. Une tête d’affiche à UNVRS, Hï Ibiza ou Ushuaïa va de 50 à 125 € et au-delà, selon l’artiste et le délai avant la date. Le prix est dynamique : le même billet coûte davantage la dernière semaine qu’en avril, et la catégorie la moins chère part en premier.',
  },
  {
    q: 'Combien de nuits prévoir ?',
    a: 'Quatre est le minimum honnête si le clubbing est le but, et ce n’est pas une question de nombre de clubs. Une nuit se termine à six heures et vous coûte la journée suivante : trois sorties d’affilée, ce sont deux sorties et une journée perdue. Quatre nuits laissent deux grandes soirées, une journée beach club et une journée de récupération sans transformer le voyage en épreuve.',
  },
  {
    q: 'Acheter en ligne ou sur place ?',
    a: 'En ligne, pour deux raisons qui n’ont rien à voir avec le prix. Vous avez l’entrée garantie un soir qui peut afficher complet, et vous payez le tarif officiel au lieu de ce qu’un rabatteur annonce devant la porte. La caisse du soir n’est pas fiablement moins chère, et un soir chargé la porte est tout simplement fermée.',
  },
  {
    q: 'Est-ce officiel ou de la revente ?',
    a: 'Officiel. Nous sommes partenaire de ClubTickets, qui vend directement pour les salles : vous n’achetez donc pas un billet d’occasion. Un QR revendu peut déjà avoir été scanné, et vous restez dehors. Le revers de la même pièce : nous ne sommes jamais moins chers que le club lui-même.',
  },
  {
    q: 'Quel est le code vestimentaire ?',
    a: 'Moins strict qu’on ne le craint, et plus strict qu’on ne le suppose en haut de gamme. Tenue de plage, maillots de football et tongs sont refusés dans les grandes salles. Les baskets passent partout et personne n’a besoin de veste. Ushuaïa est un club de jour au bord de la piscine et s’habille en conséquence ; Hï et UNVRS après minuit penchent vers la tenue de sortie.',
  },
  {
    q: 'Quelles soirées affichent réellement complet ?',
    a: 'Les soirées d’ouverture en mai, les closings de fin septembre et octobre, et tout samedi d’août avec un grand nom. Un mardi de juin, généralement pas. Si le voyage est construit autour d’une soirée précise, achetez ce billet en réservant le vol, pas à l’atterrissage.',
  },
  {
    q: 'Qu’est-ce qui est compris dans le billet ?',
    a: 'L’entrée, et rien d’autre. Les boissons s’achètent à l’intérieur et sont chères — c’est la part du budget que l’on sous-estime, pas le billet. Table, bouteilles et guestlist sont des choses distinctes ; la page guestlist explique comment elles fonctionnent réellement.',
  },
  {
    q: 'Y a-t-il un âge minimum ?',
    a: 'Dix-huit ans, vérifié à l’entrée de chaque grande salle avec une pièce d’identité physique. Une photo du passeport sur le téléphone n’est pas acceptée dans la plupart des clubs. Prenez le document : c’est la loi espagnole et non une règle du club, il n’y a donc aucune marge à la porte.',
  },
]

const CLUBS = [
  {
    name: 'UNVRS',
    body:
      'La salle la plus récente et la plus grande de l’île, conçue pour un format de show qui demandait autrefois un stade. Grands noms et grands prix : c’est ici que vivent les billets à plus de 125 €.',
  },
  {
    name: 'Hï Ibiza',
    body:
      'Playa d’en Bossa, en tête des classements mondiaux depuis des années, avec deux salles principales qui jouent différemment le même soir. Le choix sûr si vous ne sortez qu’une nuit.',
  },
  {
    name: 'Ushuaïa',
    body:
      'Celle en plein air, et la seule grande salle qui tourne de jour. De la fin d’après-midi jusque vers minuit, au bord de la piscine, le public en maillot tôt et en tenue de sortie plus tard.',
  },
  {
    name: 'Pacha',
    body:
      'La plus ancienne, à Ibiza ville, et plus petite que les arènes ci-dessus. Elle vaut le détour pour la salle elle-même autant que pour l’affiche : c’est ce qui ressemble le plus aux débuts du clubbing ici.',
  },
  {
    name: 'Amnesia',
    body:
      'Sur la route de San Antonio, avec la Terrace et le Club Room en parallèle. Historiquement le versant le plus dur de l’île, et la salle aux meilleures soirées d’ouverture et de clôture.',
  },
]

export default function BilletsClubsIbizaPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Billets clubs Ibiza 2026"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Comptez 20 à 30 € pour une soirée en semaine dans une salle plus petite et 50 à 125 € ou
              plus pour une tête d’affiche à UNVRS, Hï Ibiza ou Ushuaïa. Mais ce qui gâche le plus de
              soirées ici n’est pas le prix : c’est l’horaire. Les clubs ouvrent vers minuit et ferment à
              six heures, la tête d’affiche passant entre deux et trois heures du matin.
            </p>
            <p className="mt-4">
              Autrement dit, une nuit vous coûte la journée suivante — à prévoir avant de réserver quatre
              soirées d’affilée. Nous vendons en tant que partenaire de ClubTickets, qui travaille
              directement pour les salles : jamais moins cher que le club, mais sans revente.
            </p>
          </>
        }
      >
        <div className="mt-7">
          <AffiliateLink href={ctBrowseLink(LOCALE)} partner="ClubTickets" locale={LOCALE}>
            Voir le programme de la semaine
          </AffiliateLink>
        </div>
      </HubHero>

      <PriceTable
        heading="Ce que coûte une soirée"
        locale={LOCALE}
        caption="Fourchettes de prix habituelles selon le type de soirée"
        intro="Fourchettes de marché observées, entrée seule, pas notre tarif. Les boissons s’ajoutent et c’est là que part réellement le budget."
        rows={[
          { label: 'En semaine, salle plus petite', note: 'Résidents, hors haute saison', amount: 20, unit: 'à partir de, par personne' },
          { label: 'Week-end, soirée établie', note: 'Amnesia, Pacha, Ushuaïa', amount: 40, unit: 'à partir de, par personne' },
          { label: 'Tête d’affiche', note: 'UNVRS, Hï, grandes dates d’Ushuaïa', amount: 50, unit: 'à partir de, jusqu’à plus de 125 €' },
        ]}
      />

      <ItemGrid
        heading="Les clubs"
        intro="Cinq salles couvrent l’essentiel de ce pour quoi on vient. Ce sont vraiment des soirées différentes, pas cinq versions de la même."
        items={CLUBS}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-5xl px-4">
          <AffiliateLink href={ctBrowseLink(LOCALE)} partner="ClubTickets" locale={LOCALE}>
            Voir les dates et acheter
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="À lire ensuite"
        locale={LOCALE}
        links={[
          { label: 'Guestlist et tables VIP', href: 'guestlist', body: 'Ce que la guestlist veut dire ici — et ce qu’elle ne veut pas dire.' },
          { label: 'Agenda des clubs d’Ibiza', href: 'calendar', body: 'Chaque soirée datée de l’île, jour par jour.' },
          { label: 'Ce que coûte une soirée', href: 'ibiza-prices', body: 'Prix mesurés par club, depuis notre propre agenda.' },
          { label: 'Quand Ibiza ferme', href: 'ibiza-season', body: 'La dernière soirée programmée par club, lue dans l’agenda.' },
          { label: 'Boat party à Ibiza', href: 'boat-party', body: 'La version de jour, avant que la nuit commence.' },
          { label: 'Location de voiture à Ibiza', href: 'location-voiture-ibiza', body: 'Aller à Amnesia et rentrer sans la surcharge des taxis.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="billets pour les clubs d’Ibiza" />
    </>
  )
}
