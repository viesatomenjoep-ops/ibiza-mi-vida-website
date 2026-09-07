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
const LOCALE: Locale = 'fr'
const PAGE_KEY = 'location-voiture-ibiza-aeroport'
const parJour = RENTAL_PRICES.carPerDay.amount

/**
 * Version française. Pas une traduction de l'anglaise.
 *
 * L'angle est le numéro de vol, parce que c'est le détail qui a l'air
 * administratif et qui décide de la soirée. Les vols depuis la France arrivent
 * souvent en fin de journée, avec des retards fréquents en haute saison — et
 * une agence qui ne suit pas le vol ferme à l'heure prévue.
 *
 * Donné à la réservation, le problème disparaît : l'agence suit l'arrivée
 * réelle. Non donné, on atterrit à minuit et demi sans que personne n'attende.
 * C'est la seule variable ici que le voyageur contrôle entièrement, et c'est
 * celle qu'il oublie.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Location voiture aéroport Ibiza (IBZ)',
    description:
      'Voiture à l’aéroport d’Ibiza : agence Wiber à cinq minutes, navette gratuite, remise sans paperasse. Et pourquoi le numéro de vol change tout.',
    alternates: localizedAlternates('car-rental-airport', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Location voiture aéroport Ibiza (IBZ)',
      description: 'Récupération à cinq minutes du terminal, et le détail qui évite d’arriver quand tout est fermé.',
      locale: 'fr_FR',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Location voiture aéroport Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Location voiture Ibiza', path: 'location-voiture-ibiza' },
  { name: 'Aéroport' },
]

const FAQS: Faq[] = [
  { q: 'Pourquoi faut-il donner son numéro de vol ?', a: 'Parce que c’est ce qui permet à l’agence de suivre l’arrivée réelle plutôt que l’heure réservée. Les vols depuis la France arrivent souvent en fin de journée et les retards sont fréquents en haute saison : sans le numéro, une agence ferme à l’heure prévue et vous atterrissez sans que personne ne vous attende. Avec, le retard se gère tout seul. C’est la seule variable que vous contrôlez entièrement, et c’est celle qu’on oublie.' },
  { q: 'Le comptoir est-il dans l’aéroport ?', a: 'Pas chez Wiber. L’agence est à cinq minutes, sur la Ctra. Aeropuerto au km 5 à Sant Josep, avec une navette gratuite depuis le terminal. Cela ressemble à un inconvénient et c’est l’inverse en août : les agences hors aéroport traitent plus vite que la file du hall quand trois vols atterrissent en même temps.' },
  { q: 'Où prendre la navette ?', a: 'À la sortie des arrivées, à l’arrêt des navettes et non à la station de taxis. Le trajet jusqu’à l’agence prend environ cinq minutes. Envoyez-nous votre numéro de vol et l’agence saura quand vous atterrissez.' },
  { q: 'Que dois-je apporter pour récupérer la voiture ?', a: 'Une carte de crédit au nom du conducteur principal, le permis de conduire lui-même et une pièce d’identité avec photo. Les trois, à chaque fois. La carte de crédit est le point qui bloque : une carte de débit, ou celle de votre conjoint, est refusée, et à minuit au comptoir il n’y a aucune solution.' },
  { q: 'Combien de temps prend la récupération ?', a: 'Avec la remise sans paperasse, tout est fait avant votre arrivée : c’est une remise de clés et non un rendez-vous au comptoir, généralement moins de quinze minutes, navette comprise. La comparaison utile est une file dans le terminal en août, qui dépasse régulièrement l’heure.' },
  { q: 'Puis-je rendre la voiture en dehors des horaires ?', a: 'Demandez-le à la réservation, car cela dépend de la date et de l’heure et ce n’est pas un oui systématique. Les départs matinaux sont le cas courant et s’organisent normalement. Ce qu’il ne faut pas faire, c’est le supposer et laisser les clés quelque part : une voiture non restituée formellement reste sous votre responsabilité.' },
  { q: 'Quelles sont les conditions ?', a: 'Âge minimum 21 ans, permis détenu depuis au moins 12 mois, supplément jeune conducteur de 9 € par jour pour les 21–24 ans, et une carte de crédit au nom du conducteur principal. L’assurance est comprise dans le tarif, rien n’est donc revendu au comptoir.' },
]

export default function LocationVoitureAeroportPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Location de voiture à l’aéroport d’Ibiza',
        description: 'Location de voiture tout compris, récupérée à cinq minutes de l’aéroport d’Ibiza avec navette gratuite et remise sans paperasse.',
        brand: 'Wiber Rent a Car', price: parJour, path: 'location-voiture-ibiza-aeroport',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Location de voiture à l’aéroport d’Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            On récupère à cinq minutes du terminal, pas à l’intérieur : l’agence Wiber se trouve Ctra.
            Aeropuerto km 5, à Sant Josep, avec navette gratuite depuis les arrivées et remise sans
            paperasse.
            {parJour ? ` Tarifs à partir de ${parJour} € par jour, tout compris.` : ''} Un détail décide du
            reste : donnez votre numéro de vol à la réservation. L’agence suit alors l’arrivée réelle, et
            un retard ne vous laisse pas devant une porte fermée.
          </p>
        }
      />

      <ItemGrid
        heading="La récupération, étape par étape"
        columns={2}
        items={[
          { name: '1. Envoyer le numéro de vol', body: 'À la réservation, pas le jour même. L’agence suit l’arrivée réelle : un retard est absorbé sans que vous ayez à appeler depuis le tapis à bagages.' },
          { name: '2. Trouver la navette', body: 'À la sortie des arrivées, à l’arrêt des navettes et non à la station de taxis. Environ cinq minutes jusqu’à l’agence du km 5.' },
          { name: '3. Récupérer la clé', body: 'La paperasse est faite en amont. Carte de crédit au nom du conducteur principal, permis et pièce d’identité — les trois, à chaque fois.' },
          { name: '4. Faire le tour de la voiture', body: 'Photographiez ce qui est déjà marqué avant de partir. Deux minutes ici sont l’assurance la moins chère qui existe, sur n’importe quelle location.' },
        ]}
      />

      <ProseSection
        heading="Le numéro de vol, et pourquoi il compte plus qu’il n’en a l’air"
        paragraphs={[
          'La plupart des vols depuis la France arrivent à Ibiza en fin de journée, et en haute saison les retards d’une heure ou deux sont courants. Une agence qui n’a que votre heure de réservation ferme à l’heure prévue ; une agence qui a votre numéro de vol suit l’arrivée réelle. C’est toute la différence entre récupérer les clés à minuit et demi et chercher un taxi vers un hôtel dont vous n’avez pas encore la voiture.',
          'Le cas qui pose vraiment problème n’est pas le retard mais le changement de vol. Si vous êtes reprogrammé, dites-le nous : personne ne peut suivre un vol dont il ignore l’existence.',
          'Et si vous atterrissez après minuit, précisez-le à la réservation. Une récupération tardive s’organise normalement — mais elle s’organise à l’avance, elle ne se découvre pas sur place.',
        ]}
      />

      <TrustBlock
        heading="Réserver via Wiber"
        locale={LOCALE}
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Voir les disponibilités à l’aéroport"
        points={[
          { title: 'Navette gratuite', body: 'Du terminal à l’agence du km 5, incluse. Pas de taxi, pas de frais séparés.' },
          { title: 'Tarif tout compris', body: 'L’assurance est dans le prix : rien ne vous est vendu au comptoir après un long vol.' },
          { title: 'Remise sans paperasse', body: 'Tout est fait avant votre arrivée. L’étape qui transforme une heure en quinze minutes.' },
          { title: 'Un interlocuteur sur place', body: 'Si quelque chose coince à l’agence, vous nous écrivez — pas un centre d’appels dans un autre pays.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="À lire ensuite" locale={LOCALE} links={[
        { label: 'Location de voiture à Ibiza', href: 'location-voiture-ibiza', body: 'La page pilier : conditions, catégories et pourquoi une voiture se justifie ici.' },
        { label: 'Location de cabriolet', href: 'location-cabriolet-ibiza', body: 'Les routes côtières pour lesquelles on en réserve vraiment un.' },
        { label: 'Location de bateau à Ibiza', href: 'boats', body: 'Où vous conduisez, et ce que vous y faites.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="location de voiture à l’aéroport d’Ibiza" />
    </>
  )
}
