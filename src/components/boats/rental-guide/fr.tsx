/**
 * Bootverhuurgids (fr) — de inhoud van de vroegere pillar /location-bateau-ibiza.
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

const LOCALE: Locale = 'fr'
const PAGE_KEY = 'location-bateau-ibiza'
const skipper = RENTAL_PRICES.boatWithSkipper.amount
const sansPermis = RENTAL_PRICES.boatNoLicence.amount

/**
 * Page pilier française, écrite et non traduite.
 *
 * Le malentendu le plus courant côté francophone porte sur le permis : beaucoup
 * arrivent avec un permis côtier et supposent qu'il couvre tout en Espagne.
 * L'Espagne reconnaît les titres étrangers catégorie par catégorie, ce qui est
 * plus restrictif qu'attendu. D'où la place de cette précision, tout en haut.
 */



const FAQS: Faq[] = [
  { q: 'Peut-on louer un bateau à Ibiza sans permis ?', a: 'Oui, dans un cadre précis. La réglementation espagnole autorise toute personne de 18 ans ou plus à piloter un bateau de 15 ch maximum, avec une coque de moins de six mètres, sans permis et sans expérience. Vous recevez un briefing avant le départ et une zone de navigation à respecter, généralement la portion de côte autour de votre port de départ. Tout ce qui est plus grand ou plus puissant exige un permis reconnu, sans exception possible.' },
  { q: 'Mon permis côtier est-il valable à Ibiza ?', a: 'Pas automatiquement pour toutes les catégories. L’Espagne reconnaît les permis étrangers catégorie par catégorie, et c’est souvent plus restrictif qu’on ne l’imagine : un titre suffisant en Méditerranée française ne couvre pas d’office chaque bateau à moteur ici. Envoyez-nous une photo de votre permis et le bateau qui vous intéresse, nous vérifions la combinaison avant que vous ne bloquiez une date.' },
  { q: 'Combien coûte la location d’un bateau à Ibiza ?', a: 'Cela dépend de trois choses : la taille du bateau, la présence ou non d’un skipper, et la date. Un bateau sans permis pour quatre à six personnes est la façon la moins chère d’aller sur l’eau ; une journée avec skipper la plus onéreuse. Le carburant est presque toujours facturé à part, à la consommation — c’est ce qui surprend le plus, davantage que le tarif lui-même. Écrivez-nous votre date et le nombre de personnes.' },
  { q: 'Faut-il verser une caution ?', a: 'Oui, sur pratiquement tous les bateaux. La caution est bloquée sur la carte de crédit du locataire principal et libérée dès le retour du bateau sans dommage. Le montant suit la valeur du bateau. Prévoyez une vraie carte de crédit : une carte de débit ou une carte au nom de votre conjoint est refusée dans la plupart des bases.' },
  { q: 'Combien de personnes à bord ?', a: 'C’est le certificat du bateau qui décide, pas la place sur le pont. Les bateaux sans permis sont généralement homologués pour quatre à six personnes, les bateaux à moteur intermédiaires pour huit à douze. Sur certains certificats le skipper compte dans le total, sur d’autres non. Donnez-nous le nombre réel, enfants compris — à neuf sur un bateau de six, quelqu’un reste au ponton.' },
  { q: 'Le carburant est-il inclus ?', a: 'Presque jamais. L’usage sur l’île est de prendre le bateau plein et de le rendre plein, ou de régler la consommation à la fin. Ce que vous brûlez dépend bien plus de votre façon de naviguer que de la distance : au mouillage dans une crique, cela ne coûte rien ; plein gaz vers Formentera et retour, beaucoup. Demandez la contenance du réservoir si vous voulez budgéter.' },
  { q: 'Et si la météo tourne ?', a: 'Ici, c’est la tramontane venue du nord qui décide de la journée, plus souvent que la pluie. Si les conditions rendent la sortie dangereuse, la base ou le skipper annule et vous obtenez une nouvelle date ou un remboursement — la décision leur appartient, pas à vous. Les jours limites, on change généralement l’itinéraire plutôt que la date : quand le nord est fermé, le sud et l’ouest restent praticables.' },
  { q: 'Quelle est la meilleure période ?', a: 'De juin à août, c’est la haute saison : eau la plus chaude, météo la plus fiable, prix les plus hauts, et les criques connues sont pleines dès midi. Mai, septembre et début octobre offrent le meilleur rapport : en septembre l’eau est encore chaude, les bateaux coûtent moins cher et Cala Comte n’est pas saturée à onze heures. En semaine, c’est moins cher et plus calme qu’en week-end, tous les mois.' },
]

export function BoatRentalGuide() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} faqs={FAQS} product={{
        name: 'Location de bateau à Ibiza',
        description: 'Location de bateau à Ibiza avec skipper, avec votre propre permis ou sans permis jusqu’à 15 ch, au départ de quatre ports.',
        brand: 'Click&Boat', price: skipper, path: 'boats',
      }} />

      <HubHero as="h2"
        h1="Location de bateau à Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Trois façons d&apos;aller sur l&apos;eau : avec un skipper qui pilote, avec votre propre
              permis, ou sans permis sur un bateau limité à 15 ch si vous avez 18 ans ou plus.
              {skipper ? ` Une journée avec skipper démarre à €${skipper}.` : ''}
              {sansPermis ? ` Les bateaux sans permis démarrent à €${sansPermis}.` : ''} La haute saison va
              de juin à août ; en semaine c&apos;est moins cher et les criques sont plus vides.
            </p>
            <p className="mt-4">
              Les bateaux partent de quatre ports, et celui que vous choisissez façonne la journée plus que
              le bateau lui-même.
            </p>
          </>
        }
      />

      <ItemGrid
        heading="Avec ou sans permis — ce qui est autorisé"
        columns={3}
        intro="Il s’agit de la loi espagnole, pas d’une règle interne de loueur. Qui vous propose autre chose vous fait sortir de votre assurance."
        items={[
          { name: 'Sans permis', body: '15 ch maximum, coque de moins de six mètres, pilote de 18 ans ou plus, et une zone de navigation indiquée sur la carte avant le départ. Aucune expérience requise : le briefing couvre démarrage, arrêt, barre et mouillage. Prévu pour les criques voisines, pas pour la traversée vers Formentera.' },
          { name: 'Avec votre permis', body: 'Toute la flotte s’ouvre : coques plus grandes, vraie autonomie, Formentera devient réaliste. Attention, l’Espagne reconnaît les permis étrangers catégorie par catégorie. Apportez l’original, une photo ne suffit pas au ponton.' },
          { name: 'Avec skipper', body: 'Obligatoire de toute façon sur la plupart des grands bateaux à moteur et sur la quasi-totalité des catamarans, quel que soit votre titre. Sur le reste, c’est le plus souvent simplement le meilleur choix.' },
        ]}
      />

      <PriceTable
        heading="Combien coûte un bateau à Ibiza ?"
        locale={LOCALE}
        caption="Prix à partir de, par type de bateau"
        intro="Prix à partir de, par bateau et par jour. Le carburant s’ajoute presque partout, à la consommation — demandez la contenance et la consommation si vous voulez budgéter correctement."
        rows={[
          { label: 'Bateau sans permis', note: '4–6 personnes, 15 ch max', amount: RENTAL_PRICES.boatNoLicence.amount, unit: RENTAL_PRICES.boatNoLicence.unit.fr },
          { label: 'Bateau à moteur, vous pilotez', note: 'Permis requis', amount: RENTAL_PRICES.boatWithLicence.amount, unit: RENTAL_PRICES.boatWithLicence.unit.fr },
          { label: 'Journée avec skipper', note: 'Skipper compris dans le tarif', amount: RENTAL_PRICES.boatWithSkipper.amount, unit: RENTAL_PRICES.boatWithSkipper.unit.fr },
        ]}
      />

      <ItemGrid
        heading="D’où partent les bateaux"
        columns={2}
        intro="Quatre points de départ, chacun tourné vers une portion de côte différente. Prenez le port le plus proche de ce que vous voulez voir — une heure à contourner l’île est une heure sans nager."
        items={[
          { name: 'San Antonio', body: 'La base de la côte ouest, et le trajet le plus court vers Cala Bassa, Cala Comte et Cala Salada. C’est aussi le plus fréquenté : partez avant dix heures en juillet et août, sinon vous faites la queue à la station de carburant et arrivez dans une crique pleine.' },
          { name: 'Santa Eulària', body: 'Port plus calme sur la côte est, au plus près des criques du nord-est et d’Es Canar. Le bon choix quand San Antonio vous semble trop agité.' },
          { name: 'Ibiza-Ville', body: 'Directement vers Formentera et la côte sud, avec Talamanca et Ses Salines à portée. Pratique si vous logez en ville et voulez éviter un taxi à travers l’île.' },
          { name: 'Marina Botafoch', body: 'Les plus grands bateaux mouillent ici, face à la vieille ville. Même accès à Formentera qu’Ibiza-Ville, avec plus de place au ponton pour embarquer en groupe.' },
        ]}
      />

      <TrustBlock
        heading="Chez qui vous réservez"
        locale={LOCALE}
        intro="Nous sommes une équipe locale à Ibiza. Les bateaux viennent de Click&Boat, la plus grande plateforme de location de bateaux d’Europe avec plus de 55 000 bateaux — c’est pourquoi nous trouvons souvent quelque chose de libre sur une date qui paraît complète."
        partner="Click&Boat"
        partnerHref={CLICKANDBOAT_URL}
        partnerCta="Voir les disponibilités sur Click&Boat"
        points={[
          { title: 'Assurance', body: 'Chaque bateau est assuré par son propriétaire ou son exploitant, condition pour figurer sur la plateforme. La responsabilité civile est standard. Ce qui varie, c’est la franchise — c’est le chiffre à demander avant de signer.' },
          { title: 'La caution', body: 'Bloquée sur la carte de crédit du locataire principal, libérée au retour du bateau sans dommage. Le montant suit la valeur du bateau et vous est annoncé avant. Prévoyez une vraie carte de crédit.' },
          { title: 'Ce que nous faisons', body: 'Nous croisons votre date, la taille du groupe et la langue avec les bateaux réellement disponibles, et nous répondons sur WhatsApp plutôt que par formulaire. Si un bateau ne correspond pas à ce que vous décrivez, nous le disons.' },
          { title: 'Annulation', body: 'Les annulations météo sont décidées par la base ou le skipper, pas par vous, et donnent lieu à une nouvelle date ou un remboursement. Les conditions de rétractation varient selon le bateau — demandez-nous celles du vôtre.' },
        ]}
      />

      <ProseSection
        heading="Ce qu’on dirait à un ami"
        paragraphs={[
          'Organisez le bateau autour de la météo, pas l’inverse. La tramontane souffle du nord et ferme ce côté de l’île pendant des jours, alors que le sud et l’ouest restent parfaitement praticables. Un skipper inverse simplement l’itinéraire ; si vous pilotez, demandez à la base le matin même et acceptez de changer de plan.',
          'Partez tôt. Pas pour le lever du soleil, mais pour le mouillage. Cala Comte et Cala Bassa sont pleines à midi en juillet et août, et la différence entre arriver à dix heures et à treize heures, c’est nager depuis le bateau ou tourner en rond.',
          'Emportez plus d’eau et plus d’ombre que vous ne le pensez. Presque aucun bateau de moins de dix mètres n’a l’un ou l’autre, et six heures de soleil méditerranéen sans bimini est la façon la plus fiable de gâcher une journée.',
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Pages liées" locale={LOCALE} links={[
        { label: 'Location de voiture à Ibiza', href: 'location-voiture-ibiza', body: 'Comment rejoindre le port — et les criques qu’aucun bateau ne dessert.' },
        { label: 'Boat party à Ibiza', href: 'boat-party', body: 'La version organisée : un billet, un DJ et un groupe.' },
        { label: 'Charters privés', href: 'private-boat-charters', body: 'Yachts et catamarans plus grands, avec ou sans skipper.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="la location de bateau à Ibiza" />
    </>
  )
}
