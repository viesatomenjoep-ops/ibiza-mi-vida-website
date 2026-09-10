import Link from 'next/link'
import { Crown, Sparkles, GlassWater, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const HEADING: T = L(
  'Hoe werken VIP-tafels per club?',
  'How VIP tables work per club',
  'Wie VIP-Tische pro Club funktionieren',
  'Cómo funcionan las mesas VIP por club',
  'Comment fonctionnent les tables VIP par club',
)

const SUBTITLE: T = L(
  'Een VIP-tafel op Ibiza werkt anders dan een regulier entreeticket. In plaats van losse toegang betaal je een \'minimum spend\' die je volledig besteedt aan flessen en consumpties. Hieronder zie je hoe het per club is opgebouwd.',
  'A VIP table in Ibiza works differently from standard admission. Instead of paying an entry fee, your booking is based on a \'minimum spend\' that you use entirely for bottles and drinks. Here is how each club sets up its VIP experience.',
  'Ein VIP-Tisch auf Ibiza funktioniert anders als ein reguläres Ticket. Statt Eintrittspreisen gilt ein \'Minimum Spend\', den die Gruppe komplett für Flaschen und Getränke nutzt. So ist es bei den einzelnen Clubs aufgebaut.',
  'Una mesa VIP en Ibiza funciona diferente a una entrada general. En lugar de pagar por entrar, reservas con un \'minimum spend\' que se consume íntegramente en botellas y bebidas. Así está estructurado en cada club.',
  'Une table VIP à Ibiza fonctionne différemment d’une entrée classique. Au lieu d’un billet, la réservation repose sur un \'minimum spend\' que vous consommez intégralement en bouteilles et boissons. Voici le fonctionnement par club.',
)

const PILLARS_TITLE: T = L(
  'De 4 vaste principes van een VIP-reservering',
  'The 4 core principles of a VIP booking',
  'Die 4 Kernprinzipien einer VIP-Reservierung',
  'Los 4 principios básicos de una reserva VIP',
  'Les 4 principes d’une réservation VIP',
)

const PILLARS = [
  {
    icon: GlassWater,
    title: L('100% besteedbaar tegoed', '100% bottle credit', '100% Flaschenguthaben', '100% crédito en consumo', '100% de crédit conso'),
    desc: L(
      'Het afgesproken bedrag (de minimum spend) is geen huurprijs voor het meubilair: het is het bedrag dat jullie die avond aan flessen, mixers en consumpties besteden.',
      'The agreed minimum spend is not a table rental fee: it is your credit for bottles, premium mixers and drinks throughout the night.',
      'Der vereinbarte Betrag ist keine Mietgebühr für den Tisch, sondern euer Guthaben für Flaschen, Mixer und Drinks am Abend.',
      'El importe pactado no es un alquiler de mesa: es el crédito que consume el grupo en botellas, combinados y bebidas.',
      'Le montant convenu n’est pas une location de table : c’est votre crédit consacré aux bouteilles, softs et consommations.',
    ),
  },
  {
    icon: Crown,
    title: L('Snelle VIP-entree zonder rij', 'Dedicated VIP entry', 'Separater VIP-Einlass', 'Entrada VIP sin colas', 'Entrée VIP dédiée'),
    desc: L(
      'Iedereen in de groep krijgt toegang via de VIP-ingang met VIP-polsbandjes. Geen urenlange wachtrijen bij de hoofdingang.',
      'Everyone in your party enters through the dedicated VIP gate with VIP wristbands. Skip the general admission queues entirely.',
      'Alle Gäste eurer Gruppe betreten den Club über den separaten VIP-Eingang mit Bändchen — ganz ohne Warteschlangen.',
      'Todo el grupo entra por el acceso VIP exclusivo con pulseras VIP, evitando las colas de la entrada general.',
      'Chaque membre du groupe accède au club par l’entrée VIP dédiée avec bracelet VIP, sans attendre dans la file générale.',
    ),
  },
  {
    icon: Sparkles,
    title: L('Eigen tafel & persoonlijke hostess', 'Dedicated table & hostess', 'Eigener Tisch & Hostess', 'Mesa privada y azafata', 'Table privée & hôtesse'),
    desc: L(
      'Een vaste zitplek en uitvalsbasis voor jullie groep, bediend door een eigen hostess en runners die flessen direct serveren.',
      'A guaranteed reserved base for your party with dedicated table service, hostesses and runners serving bottles directly.',
      'Ein reservierter Rückzugsort für eure Gruppe mit persönlichem Tischservice, Hostess und schneller Flaschenbedienung.',
      'Un espacio reservado para vuestro grupo con servicio de mesa exclusivo, azafata y camareros dedicados.',
      'Un espace réservé pour votre groupe avec service à table exclusif, hôtesse et serveurs dédiés.',
    ),
  },
  {
    icon: ShieldCheck,
    title: L('Privébeveiliging & eigen sanitair', 'Private security & restrooms', 'Security & eigene WCs', 'Seguridad y baños VIP', 'Sécurité & toilettes VIP'),
    desc: L(
      'De VIP-zones zijn alleen toegankelijk met het juiste bandje. Je hebt toegang tot aparte VIP-toiletten en ontspannen ruimte.',
      'VIP zones are strictly restricted to wristband holders, giving you access to dedicated VIP restrooms and comfort.',
      'Die VIP-Bereiche sind streng reguliert, inklusive Zugang zu separaten VIP-Toiletten und ungestörtem Raum zum Feiern.',
      'Las zonas VIP son restringidas y cuentan con seguridad propia, baños VIP exclusivos y mayor comodidad.',
      'Les zones VIP sont strictement réservées, avec agents de sécurité dédiés, toilettes VIP privées et confort garanti.',
    ),
  },
]

const CLUBS_DATA = [
  {
    name: 'Ushuaïa Ibiza',
    type: L('Open-air daytime & sunset (17:00 – 23:00)', 'Open-air daytime & sunset (17:00 – 23:00)', 'Open-Air Tag & Sunset (17:00 – 23:00)', 'Open-air de día y atardecer (17:00 – 23:00)', 'Plein air jour & coucher de soleil (17:00 – 23:00)'),
    zones: L(
      'The Cloud (verhoogd panoramaterras), Main Stage Front (vlak voor de dj), Palm Area & Poolside.',
      'The Cloud (elevated panoramic terrace), Main Stage Front (close to the DJ), Palm Area & Poolside.',
      'The Cloud (erhöhte Panoramaterrasse), Main Stage Front (direkt vor der Bühne), Palm Area & Poolside.',
      'The Cloud (terraza panorámica elevada), Main Stage Front (frente al escenario), Palm Area y zona piscina.',
      'The Cloud (terrasse panoramique surélevée), Main Stage Front (face à la scène), Palm Area & bord de piscine.',
    ),
    tip: L(
      'Ideaal voor groepen die overdag in de zon willen feesten en voor zonsondergang de headliner van dichtbij willen zien.',
      'Best for groups looking to celebrate under the afternoon sun and experience world-class acts right up to sunset.',
      'Ideal für Gruppen, die tagsüber in der Sonne feiern und die Headliner bis Sonnenuntergang hautnah erleben wollen.',
      'Perfecto para grupos que quieren fiesta de día bajo el sol y ver a los mejores cabezas de cartel al atardecer.',
      'Idéal pour faire la fête en journée au soleil et voir les plus grands DJs jusqu’au coucher du soleil.',
    ),
  },
  {
    name: 'Hï Ibiza',
    type: L('Nachtclub (#1 van de wereld, 23:30 – 06:00)', 'Nightclub (#1 in the World, 23:30 – 06:00)', 'Nachtclub (Weltweite #1, 23:30 – 06:00)', 'Discoteca (#1 del mundo, 23:30 – 06:00)', 'Club (#1 mondial, 23:30 – 06:00)'),
    zones: L(
      'The Theatre (Tier 1–3 rondom de booth), Club Room VIP, Secret Garden & Magic Lounge.',
      'The Theatre (Tier 1–3 surrounding the booth), Club Room VIP, Secret Garden & Magic Lounge.',
      'The Theatre (Ränge 1–3 rund um die DJ-Kanzel), Club Room VIP, Secret Garden & Magic Lounge.',
      'The Theatre (filas 1–3 alrededor de la cabina), Club Room VIP, Secret Garden y Magic Lounge.',
      'The Theatre (niveaux 1–3 autour de la cabine DJ), Club Room VIP, Secret Garden & Magic Lounge.',
    ),
    tip: L(
      'The Theatre is immens populair bij residenties als Black Coffee en David Guetta. Boek minstens enkele weken vooruit.',
      'The Theatre VIP sells out weeks in advance for residencies like Black Coffee and David Guetta. Book well ahead.',
      'The Theatre ist bei Residenzen wie Black Coffee oder David Guetta Wochen im Voraus belegt. Früh anfragen.',
      'The Theatre se agota con semanas de antelación en residencias como Black Coffee o David Guetta. Reserva con tiempo.',
      'The Theatre affiche complet des semaines à l’avance sur Black Coffee ou David Guetta. Anticipez votre demande.',
    ),
  },
  {
    name: 'UNVRS Ibiza',
    type: L('Hyperclub San Rafael (Nieuwste megaclub)', 'Hyperclub San Rafael (Brand-new arena club)', 'Hyperclub San Rafael (Neuester Megaclub)', 'Hyperclub San Rafael (Nuevo megaclub)', 'Hyperclub San Rafael (Nouveau mégaclub)'),
    zones: L(
      'Arena Tiered Seating (trapsgewijze VIP-ringen), DJ Booth Area, Elevated Sky Terraces.',
      'Arena Tiered Seating (tiered VIP rings overlooking the bowl), DJ Booth Area, Elevated Sky Terraces.',
      'Arena Tiered Seating (abgestufte VIP-Ränge mit Blick auf den Dancefloor), DJ Booth, Elevated Sky Terraces.',
      'Gradas VIP escalonadas con vista directa a la pista, zona de cabina y terrazas panorámicas elevadas.',
      'Gradins VIP en gradins surplombant la piste, zone cabine DJ et terrasses suspendues panoramiques.',
    ),
    tip: L(
      'De nieuwste clubsensatie van het eiland. Zowel grote gezelschappen als intieme tafels met optimaal zicht op de show.',
      'The island’s newest spectacle. Designed for high-production visuals with panoramic sightlines from all table tiers.',
      'Das neue Highlight auf Ibiza. Gebaut für gigantische Show-Produktionen mit perfekter Sicht von allen VIP-Rängen.',
      'El gran estreno de la isla. Diseñado para shows de gran escala con excelente visibilidad desde todas las zonas VIP.',
      'Le nouveau temple clubbing d’Ibiza. Conçu pour des shows monumentaux avec une visibilité optimale depuis chaque table.',
    ),
  },
  {
    name: 'Pacha Ibiza',
    type: L('Glamour & iconische clubbing in Ibiza-stad', 'Glamour & iconic clubbing in Ibiza Town', 'Glamour & Clubbing-Ikone in Ibiza-Stadt', 'Glamour e historia en Ibiza ciudad', 'Glamour & clubbing mythique à Ibiza-ville'),
    zones: L(
      'Main Room VIP Balconies (trapsgewijs rond de dansvloer), DJ Booth, Funky Room & Restaurant Lounge.',
      'Main Room VIP Balconies (tiered boxes facing the floor), DJ Booth, Funky Room & Restaurant Lounge.',
      'Main Room VIP-Balkone (abgestufte Boxen am Dancefloor), DJ Booth, Funky Room & Restaurant Lounge.',
      'Balcones VIP de la Main Room (palcos escalonados sobre la pista), cabina DJ y zona restaurante lounge.',
      'Balcons VIP de la Main Room (loges en gradins face à la piste), cabine DJ et salon restaurant.',
    ),
    tip: L(
      'De meest intieme VIP-ervaring. Populair om te combineren met diner in Pacha Restaurant voor naadloze clubentree.',
      'The most intimate VIP atmosphere. Often booked in tandem with dinner at Pacha Restaurant for seamless club entry.',
      'Das intimste VIP-Feeling. Beliebt in Kombination mit einem Dinner im Pacha Restaurant für nahtlosen Übergang.',
      'El ambiente VIP más exclusivo e íntimo. Muy habitual combinarlo con cena en el restaurante antes de entrar.',
      'L’expérience VIP la plus intime. Très prisé en formule dîner au restaurant Pacha pour un accès direct au club.',
    ),
  },
  {
    name: 'Amnesia Ibiza',
    type: L('Clubbing-tempel in San Rafael (Terrace & Main Room)', 'Clubbing temple in San Rafael (Terrace & Main)', 'Clubbing-Tempel in San Rafael (Terrace & Main)', 'Templo del clubbing en San Rafael (Terrace y Main)', 'Temple du clubbing à San Rafael (Terrace & Main)'),
    zones: L(
      'The Terrace VIP Gallery (legendarisch uitzicht over de menigte), Main Room Balcony, DJ Area.',
      'The Terrace VIP Gallery (legendary birds-eye view of the crowd), Main Room Balcony, DJ Area.',
      'The Terrace VIP Gallery (legendärer Blick über das tanzende Meer), Main Room Balcony, DJ-Bereich.',
      'Galería VIP de The Terrace (vista emblemática sobre la pista), balcón de la Main Room y zona de cabina.',
      'Galerie VIP de la Terrace (vue plongeante mythique sur la foule), balcon de la Main Room et zone DJ.',
    ),
    tip: L(
      'Voor wie de legendarische sfeer van Elrow of Pyramid wil meemaken met royale ademruimte en topbediening.',
      'Perfect for experiencing monumental parties like Elrow or Pyramid with generous personal space and fast service.',
      'Ideal, um Mammutpartys wie Elrow oder Pyramid mit eigener Freifläche und schnellem Service zu genießen.',
      'La mejor manera de vivir fiestas gigantescas como Elrow o Pyramid con comodidad, espacio propio y buen servicio.',
      'Idéal pour vivre des soirées cultes comme Elrow ou Pyramid en profitant d’un vrai confort et d’un service rapide.',
    ),
  },
  {
    name: 'O Beach Ibiza',
    type: L('Poolside daytime party in San Antonio (13:00 – 22:00)', 'Poolside daytime party in San Antonio (13:00 – 22:00)', 'Poolparty am Tag in San Antonio (13:00 – 22:00)', 'Fiesta de día junto a la piscina (13:00 – 22:00)', 'Fête au bord de la piscine de jour (13:00 – 22:00)'),
    zones: L(
      'VIP Pool Beds, Garden Lounges, Owner’s Bed & Sunset Roof Terrace.',
      'VIP Pool Beds, Garden Lounges, Owner’s Bed & Sunset Roof Terrace.',
      'VIP Pool-Liegen, Garden Lounges, Owner’s Bed & Sunset-Dachterrasse.',
      'Camas VIP de piscina, Garden Lounges, Owner’s Bed y terraza al atardecer.',
      'Lits VIP en bord de piscine, Garden Lounges, Owner’s Bed et terrasse coucher de soleil.',
    ),
    tip: L(
      'De minimum spend kan overdag worden ingezet voor zowel sushi/lunch als champagne en cocktails aan je daybed.',
      'The minimum spend can be used for both food (sushi, lunch platters) and champagne/drinks delivered to your bed.',
      'Der Mindestverzehr gilt tagsüber sowohl für Essen (Sushi, Lunch) als auch für Champagner und Cocktails am Daybed.',
      'El consumo mínimo sirve tanto para comida (sushi, platos) como para botellas de champagne y copas en la cama.',
      'Le minimum spend s’applique aussi bien aux repas (sushi, déjeuners) qu’au champagne et cocktails servis à votre lit.',
    ),
  },
]

const ASK_QUOTE_BTN: T = L(
  'Vraag een offerte aan voor jullie groep',
  'Get a custom quote for your group',
  'Angebot für eure Gruppe anfordern',
  'Pide presupuesto para tu grupo',
  'Demander un devis pour votre groupe',
)

export function ClubVipTables({ locale }: { locale: string }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  return (
    <section className="border-t border-black/5 bg-neutral-50/70 py-16 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-3xl font-black tracking-tight md:text-4xl text-neutral-900">
            {HEADING[l]}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">
            {SUBTITLE[l]}
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="mt-12">
          <h3 className="text-center font-serif text-lg font-bold uppercase tracking-wider text-gold">
            {PILLARS_TITLE[l]}
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => {
              const Icon = p.icon
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm transition-all hover:border-gold/30 hover:shadow-md"
                >
                  <div className="mb-3.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <Icon size={20} />
                  </div>
                  <h4 className="font-serif text-[15px] font-bold text-neutral-900">{p.title[l]}</h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">{p.desc[l]}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Club by Club breakdown */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CLUBS_DATA.map((c, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-black/8 bg-white p-6 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-black/5 pb-3">
                    <h4 className="font-serif text-xl font-bold text-neutral-900">{c.name}</h4>
                    <span className="rounded-full bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-gold">
                      VIP
                    </span>
                  </div>
                  <p className="mt-2.5 font-mono text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    {c.type[l]}
                  </p>

                  <div className="mt-4">
                    <span className="font-serif text-[12px] font-bold uppercase tracking-wider text-neutral-400">
                      {l === 'nl' ? 'VIP-zones' : l === 'de' ? 'VIP-Bereiche' : l === 'es' ? 'Zonas VIP' : l === 'fr' ? 'Zones VIP' : 'VIP Zones'}
                    </span>
                    <p className="mt-1 text-[13px] leading-relaxed text-neutral-700">{c.zones[l]}</p>
                  </div>

                  <div className="mt-4 rounded-xl bg-neutral-50 p-3.5 border border-black/5">
                    <span className="font-serif text-[11px] font-bold uppercase tracking-wider text-gold">
                      {l === 'nl' ? 'Insidertip' : l === 'de' ? 'Insidertipp' : l === 'es' ? 'Consejo insider' : l === 'fr' ? 'Conseil d’initié' : 'Insider note'}
                    </span>
                    <p className="mt-1 text-[12px] leading-relaxed text-neutral-600">{c.tip[l]}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      l === 'nl'
                        ? `Hoi Simon, ik wil graag info en de minimum spend weten voor een VIP-tafel bij ${c.name}.`
                        : `Hi Simon, I would like to know availability and minimum spend for a VIP table at ${c.name}.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/5 py-2.5 font-serif text-[12px] font-bold uppercase tracking-wider text-gold transition-colors hover:bg-gold hover:text-white"
                  >
                    <span>{l === 'nl' ? 'Tafel aanvragen' : l === 'de' ? 'Tisch anfragen' : l === 'es' ? 'Consultar mesa' : l === 'fr' ? 'Demander une table' : 'Check availability'}</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global CTA */}
        <div className="mt-12 text-center">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              l === 'nl'
                ? 'Hoi Simon, we zijn op zoek naar een package deal of VIP-tafel op Ibiza. Kun je met ons meedenken?'
                : 'Hi Simon, we are looking for a package deal or VIP table in Ibiza. Can you help us arrange this?',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-serif text-[13px] font-black uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-gold-soft hover:text-neutral-900"
          >
            <span>{ASK_QUOTE_BTN[l]}</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
