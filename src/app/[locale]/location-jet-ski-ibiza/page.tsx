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

const LOCALE: Locale = 'fr'
const PAGE_KEY = 'location-jet-ski-ibiza'
const prix30 = RENTAL_PRICES.jetSki30.amount

/**
 * Page française. Pas une traduction de l'anglaise.
 *
 * L'anglaise explique QU'IL faut un permis pour partir seul. Le visiteur
 * francophone arrive avec une autre question, et souvent une déception en
 * germe : il a réservé une demi-heure en imaginant une balade, et découvre que
 * trente minutes de jet-ski, c'est court et physique. L'angle ici est donc
 * l'attente — ce que représente réellement un créneau, et pourquoi la formule
 * guidée n'est pas un lot de consolation mais souvent le meilleur choix.
 *
 * Le noyau juridique est identique dans les cinq versions et figure au premier
 * paragraphe : partir seul exige un permis reconnu, sinon c'est la sortie
 * guidée, où la qualification du guide couvre le groupe. Il n'y a pas de
 * troisième voie.
 *
 * Ce que nous n'affirmons pas : quels permis étrangers une base accepte. Cela
 * varie et cela change ; nous vérifions avant la réservation plutôt que de
 * promettre.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Location de jet-ski à Ibiza',
    description:
      'Location de jet-ski à Ibiza au départ de San Antonio, en créneaux de 30 minutes. Partir seul exige un permis, la sortie guidée non. Nous vérifions le vôtre.',
    alternates: localizedAlternates('jet-ski-rental', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Location de jet-ski à Ibiza',
      description: 'Jet-ski au départ de San Antonio. Ce que représente vraiment un créneau de 30 minutes.',
      locale: 'fr_FR',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Location de jet-ski à Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza sur l’eau', path: 'boats' },
  { name: 'Location de jet-ski' },
]

const FAQS: Faq[] = [
  {
    q: 'Trente minutes, est-ce que c’est assez ?',
    a: 'Oui, et bien plus que cela n’en a l’air. Se tenir à vitesse sollicite des muscles que l’on n’utilise pas au quotidien, et la plupart des gens sont prêts à s’arrêter vers vingt-cinq minutes. C’est aussi pour cela que le créneau de trente minutes est l’unité standard ici plutôt qu’une offre d’appel. Prenez le format court, et enchaînez un second créneau si vous en redemandez.',
  },
  {
    q: 'Faut-il un permis pour faire du jet-ski à Ibiza ?',
    a: 'Pour partir seul, oui — la loi espagnole exige un permis reconnu de véhicule nautique à moteur ou de bateau, et la base vous le demandera. Sans permis vous pouvez naviguer quand même, mais uniquement en sortie guidée : un moniteur qualifié accompagne le groupe et sa qualification couvre tout le monde. C’est toute la différence, et un loueur qui affirme le contraire vous met sur l’eau illégalement.',
  },
  {
    q: 'Mon permis bateau français est-il valable ici ?',
    a: 'Parfois, et ce n’est pas une esquive. L’Espagne reconnaît un certain nombre de permis étrangers, mais celui qu’une base accepte concrètement varie d’une base à l’autre et évolue. Envoyez-nous une photo de votre permis avec votre date et nous vérifions avant la réservation. Nous préférons dire non à l’avance plutôt que vous voir faire le trajet jusqu’au ponton pour rien.',
  },
  {
    q: 'Combien coûte une demi-heure de jet-ski à Ibiza ?',
    a: 'Trente minutes est le créneau standard et le tarif d’entrée habituel sur l’île. Ce qui fait bouger le chiffre, c’est la machine et le format : une sortie guidée coûte davantage que la même demi-heure en solo, puisqu’un guide et une seconde machine partent avec vous. Les semaines de pointe de juillet et août sont en haut de la fourchette. Envoyez votre date, nous revenons avec le tarif du jour.',
  },
  {
    q: 'Peut-on être deux sur un jet-ski ?',
    a: 'Oui, sur les machines deux et trois places, qui composent l’essentiel de la flotte de location ici, et pour un couple c’est la formule la moins chère. Une seule personne pilote : le permis ou l’obligation de guide s’attache à celui qui est aux commandes. Les bases appliquent une limite de poids combiné, deux adultes sur une petite biplace sont donc parfois refusés.',
  },
  {
    q: 'Quel est l’âge minimum ?',
    a: 'Dix-huit ans pour piloter. Les passagers peuvent être plus jeunes, mais chaque base fixe son propre plancher pour l’arrière — souvent autour de 6 ou 8 ans, et toujours avec un gilet à leur taille. Prévoyez une pièce d’identité pour le pilote : une réservation à un nom et une autre personne aux commandes, c’est là que les ennuis commencent.',
  },
  {
    q: 'Quel est le meilleur moment de la journée ?',
    a: 'Le matin. La mer devant San Antonio est au plus plat jusque vers midi ; ensuite la brise de mer lève un clapot court qui rend la demi-heure nettement plus physique qu’elle n’en a l’air. La fin d’après-midi offre une meilleure lumière pour les photos, mais vous naviguez contre plus de houle. En juillet et août, réservez le créneau le plus matinal que vous pouvez tenir.',
  },
]

export default function LocationJetSkiIbizaPage() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
        product={{
          name: 'Location de jet-ski à Ibiza',
          description:
            'Location de jet-ski au départ de San Antonio, Ibiza, en créneaux de 30 minutes. La sortie guidée n’exige pas de permis, partir seul si.',
          price: prix30,
          path: 'location-jet-ski-ibiza',
        }}
      />

      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Location de jet-ski à Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Les jet-skis partent de San Antonio par créneaux de 30 minutes — l’unité standard ici, et de
              quoi faire la baie et revenir.
              {prix30 ? ` À partir de ${prix30} € les 30 minutes.` : ''} La règle qui décide de votre
              réservation est juridique et non commerciale : en Espagne il faut un permis pour partir seul,
              sinon vous rejoignez une sortie guidée, où la qualification du moniteur couvre le groupe.
            </p>
            <p className="mt-4">
              Une précision qui évite la déception : trente minutes, ce n’est pas une balade. On se tient
              à vitesse, cela fatigue, et la plupart des gens sont prêts à s’arrêter avant la fin. C’est
              exactement pourquoi ce format est la norme et pas une offre au rabais.
            </p>
          </>
        }
      />

      <ChoiceCards
        heading="Sortie guidée ou pilotage libre"
        locale={LOCALE}
        cards={[
          {
            title: 'Sortie guidée',
            meta: 'Sans permis · le moniteur accompagne le groupe',
            body:
              'Un moniteur qualifié navigue avec vous et sa qualification couvre le groupe. Vous suivez un parcours fixe, en général le long de la côte de San Antonio vers les falaises du coucher de soleil. La seule façon légale de naviguer ici sans permis personnel.',
            href: 'boats',
            cta: 'Demander les sorties',
          },
          {
            title: 'Pilotage libre',
            meta: 'Permis exigé · votre parcours dans une zone définie',
            body:
              'Présentez un permis valide de véhicule nautique ou de bateau et vous partez seul, à l’intérieur d’une zone balisée que la base définit. Plus de liberté, et c’est vous qui donnez le rythme.',
            href: 'boats',
            cta: 'Quels permis comptent',
          },
          {
            title: 'À deux',
            meta: 'Un pilote · passager à partir de 6–8 ans environ',
            body:
              'Les machines deux et trois places acceptent un passager, ce qui divise le coût par personne. Seul le pilote a besoin du permis ou du moniteur. Une limite de poids combiné s’applique, à vérifier à la réservation.',
            href: 'boat-party',
            cta: 'Options pour groupes',
          },
        ]}
      />

      <PriceTable
        heading="Ce que coûte un jet-ski à Ibiza"
        locale={LOCALE}
        caption="Tarifs d’entrée pour la location de jet-ski"
        intro="Trente minutes est le créneau standard. Une sortie guidée coûte plus que le même temps en solo, puisqu’un guide et une seconde machine partent avec vous. Juillet et août sont en haut de la fourchette."
        rows={[
          {
            label: 'Jet-ski, 30 minutes',
            note: 'Créneau standard, une machine',
            amount: RENTAL_PRICES.jetSki30.amount,
            unit: RENTAL_PRICES.jetSki30.unit.fr,
          },
        ]}
      />

      <ItemGrid
        heading="Où l’on navigue"
        intro="Tout part de la baie de San Antonio. Les parcours ci-dessous sont ceux que couvrent réellement les sorties guidées ; en pilotage libre vous restez dans une zone balisée que la base vous montre sur une carte avant le départ."
        columns={2}
        items={[
          {
            name: 'La baie de San Antonio',
            body:
              'L’eau abritée où l’on démarre et où se tient le briefing. Plate le matin, clapoteuse dès que la brise de l’après-midi s’installe. Près des plages la vitesse est limitée, et la base vous dit précisément où passe la ligne.',
          },
          {
            name: 'Cala Bassa et Cala Comte',
            body:
              'Vers le sud le long de la côte, en contournant les pointes jusqu’aux deux grandes plages de l’ouest. La sortie longue classique. On regarde les criques depuis l’eau plutôt que d’accoster : les jet-skis n’ont rien à faire près des lignes de baignade.',
          },
          {
            name: 'Les falaises du coucher de soleil',
            body:
              'Au nord-ouest de la baie, là où la côte devient rocheuse. Le plus beau tronçon pour les photos et la raison pour laquelle les créneaux tardifs partent en premier. Eau plus ouverte, donc le premier parcours annulé quand le vent monte.',
          },
          {
            name: 'Vers Es Vedrà',
            body:
              'Uniquement en sortie guidée longue et uniquement par mer calme. C’est une vraie navigation en eau libre le long de la côte ouest, pas une escapade d’une demi-heure, et aucune base n’y envoie un débutant sans accompagnement.',
          },
        ]}
      />

      <TrustBlock
        heading="Avant de réserver"
        locale={LOCALE}
        intro="Trois choses décident si une réservation se passe bien, et toutes se règlent avant d’arriver au ponton."
        points={[
          {
            title: 'La question du permis',
            body:
              'Réglez-la à la réservation, pas à la base. Si personne dans le groupe n’a de permis reconnu, il reste la formule guidée — il n’y a pas de troisième option, et se présenter en espérant négocier fait perdre le créneau. Un doute sur votre permis français : envoyez-le-nous.',
          },
          {
            title: 'Caution et pièce d’identité',
            body:
              'Une caution est bloquée sur une carte de crédit au nom du pilote et libérée au retour de la machine intacte. Prévoyez la carte physique et une pièce d’identité. Le pilote nommé sur la réservation doit être celui qui signe.',
          },
          {
            title: 'Météo',
            body:
              'Les créneaux de jet-ski sont annulés plus souvent que les sorties bateau, parce qu’une petite machine ressent un clapot qu’une coque ignore. Une annulation météo donne un nouveau créneau ou un remboursement, et la décision appartient à la base.',
          },
          {
            title: 'Ce que nous faisons',
            body:
              'Nous regardons quelles bases ont votre créneau libre à la date voulue, dans le format que votre groupe peut légalement utiliser, et nous répondons sur WhatsApp. Si votre groupe ne peut pas naviguer comme vous l’imaginez, nous le disons avant que vous payiez.',
          },
        ]}
      />

      <ProseSection
        heading="Ce qu’on dirait à un ami"
        paragraphs={[
          'Réservez le premier créneau de la journée. La différence entre neuf heures du matin et trois heures de l’après-midi n’est pas le prix, c’est de savoir si vous glissez une demi-heure sur une eau plate ou si vous tapez dans un mètre de clapot. Qui réserve l’après-midi en août l’apprend une fois.',
          'Ne prenez pas le téléphone. Si la photo compte, demandez si le moniteur emporte un appareil — la plupart en ont un — parce que l’alternative est un téléphone dans une poche qui se retrouve sous l’eau au bout de dix minutes.',
          'Et si le groupe hésite entre guidée et libre : prenez la guidée pour la première fois même avec un permis. On vous montre où la profondeur change et où il est interdit d’ouvrir les gaz, ce qui vaut mieux que de le découvrir seul.',
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="À lire ensuite"
        locale={LOCALE}
        links={[
          { label: 'Location de bateau à Ibiza', href: 'boats', body: 'La page pilier : avec skipper, avec votre permis, ou sans permis jusqu’à 15 ch.' },
          { label: 'Boat party à Ibiza', href: 'boat-party', body: 'L’autre façon de passer une journée sur l’eau.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="location de jet-ski à Ibiza" />
    </>
  )
}
