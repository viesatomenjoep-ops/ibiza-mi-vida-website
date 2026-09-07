import { RENTAL_PRICES } from '@/lib/rental-prices'
import { WIBER_URL } from '@/lib/partners'
import type { DossierCopy, T } from '@/components/guides/PartnerDossierPage'
import type { Locale } from '@/lib/seo'

/**
 * Partnerdossier Wiber Rent a Car, vijf talen.
 *
 * "Wiber ervaringen" en "is Wiber betrouwbaar" zijn vertrouwensvragen, dus deze
 * pagina concurreert niet met de autoverhuurpillar. Wat hem zijn plek geeft is
 * dat hij de voorwaarden vooraf noemt in plaats van erna: de leeftijdsgrens,
 * de toeslag tot 24, en de creditcard op naam van de hoofdbestuurder. Dat zijn
 * precies de drie dingen die aan de balie een probleem worden, en aan de balie
 * valt er niets meer aan te doen.
 *
 * De toon blijft in alle vijf de talen dezelfde: dit is niet de goedkoopste
 * koptekst op een vergelijkingssite, en dat staat er ook. Een dossier dat
 * alleen maar verkoopt is geen dossier.
 */

const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const perDay = RENTAL_PRICES.carPerDay.amount

/** Vanafprijs valt weg zodra hij niet bevestigd is; de zin blijft dan kloppen. */
function leadPrijs(l: Locale): string {
  if (!perDay) return ''
  const m: T = L(
    ` Tarieven beginnen bij €${perDay} per dag.`,
    ` Rates start at €${perDay} per day.`,
    ` Die Tarife beginnen bei €${perDay} pro Tag.`,
    ` Las tarifas parten de €${perDay} al día.`,
    ` Les tarifs démarrent à €${perDay} par jour.`,
  )
  return m[l]
}

const LEAD_1_BASIS: T = L(
  'Wiber is het bedrijf waar wij onze Ibiza-huurauto’s bij boeken. Het kantoor zit aan Ctra. Aeropuerto km 5 in Sant Josep — vijf minuten van de terminal, gratis shuttle, contactloos ophalen — en de verzekering zit ín het tarief in plaats van dat hij aan de balie aan je verkocht wordt.',
  'Wiber is the company we book Ibiza car hire through. The office sits at Ctra. Aeropuerto km 5 in Sant Josep — five minutes from the terminal, free shuttle, contactless pick-up — and the insurance is inside the rate rather than sold to you at the counter.',
  'Wiber ist das Unternehmen, über das wir Mietwagen auf Ibiza buchen. Das Büro liegt an der Ctra. Aeropuerto km 5 in Sant Josep — fünf Minuten vom Terminal, kostenloser Shuttle, kontaktlose Abholung — und die Versicherung steckt im Tarif, statt dir am Schalter verkauft zu werden.',
  'Wiber es la empresa con la que reservamos los coches de alquiler en Ibiza. La oficina está en la Ctra. Aeropuerto km 5, en Sant Josep — cinco minutos de la terminal, lanzadera gratuita, recogida sin contacto — y el seguro va dentro de la tarifa en vez de venderse en el mostrador.',
  "Wiber est la société auprès de laquelle nous réservons les voitures à Ibiza. Le bureau se trouve Ctra. Aeropuerto km 5, à Sant Josep — cinq minutes du terminal, navette gratuite, prise en charge sans contact — et l'assurance est comprise dans le tarif plutôt que vendue au comptoir.",
)

export const WIBER_DOSSIER: DossierCopy = {
  routeKey: 'wiber-partner',
  pageKey: 'wiber-car-rental-ibiza',
  partner: 'Wiber Rent a Car',
  logoKey: 'wiber',
  href: WIBER_URL,
  pillar: {
    key: 'car-rental', localized: true,
    label: L('Alle autohuuropties op Ibiza', 'All car hire options in Ibiza', 'Alle Mietwagen-Optionen auf Ibiza', 'Todas las opciones de alquiler de coche en Ibiza', "Toutes les options de location de voiture à Ibiza"),
  },
  crumbParent: {
    key: 'car-rental', localized: true,
    label: L('Auto huren op Ibiza', 'Car rental Ibiza', 'Mietwagen Ibiza', 'Alquiler de coches Ibiza', 'Location de voiture Ibiza'),
  },
  crumbSelf: L('Wiber Rent a Car', 'Wiber Rent a Car', 'Wiber Rent a Car', 'Wiber Rent a Car', 'Wiber Rent a Car'),

  metaTitle: L(
    'Wiber Rent a Car Ibiza — eerlijk bekeken',
    'Wiber Rent a Car Ibiza: Reviewed',
    'Wiber Rent a Car Ibiza — geprüft',
    'Wiber Rent a Car Ibiza: analizado',
    'Wiber Rent a Car Ibiza : décrypté',
  ),
  metaDesc: L(
    'Wat een auto boeken via Wiber op Ibiza inhoudt: het kantoor op km 5, de gratis shuttle, de borg, de jongerentoeslag van €9 en voor wie het niet past.',
    'What booking a car through Wiber in Ibiza involves: the office at km 5, the free shuttle, the deposit, the €9 young-driver surcharge and who it does not suit.',
    'Was das Buchen eines Autos über Wiber auf Ibiza bedeutet: Büro bei km 5, Gratis-Shuttle, Kaution, €9 Jungfahrerzuschlag und für wen es nicht passt.',
    'Qué implica reservar un coche con Wiber en Ibiza: la oficina del km 5, la lanzadera gratis, la fianza, el recargo de €9 por conductor joven y sus límites.',
    "Réserver une voiture via Wiber à Ibiza : le bureau au km 5, la navette gratuite, la caution, le supplément jeune conducteur et les limites honnêtes.",
  ),
  ogDesc: L(
    'De voorwaarden, het ophalen en de eerlijke grenzen van een auto boeken via Wiber op Ibiza.',
    'The conditions, the pick-up flow and the honest limits of booking a car through Wiber in Ibiza.',
    'Die Bedingungen, die Abholung und die ehrlichen Grenzen einer Autobuchung über Wiber auf Ibiza.',
    'Las condiciones, la recogida y los límites honestos de reservar un coche con Wiber en Ibiza.',
    "Les conditions, la prise en charge et les limites honnêtes d'une location via Wiber à Ibiza.",
  ),
  ogAlt: L('Wiber Rent a Car op Ibiza', 'Wiber Rent a Car in Ibiza', 'Wiber Rent a Car auf Ibiza', 'Wiber Rent a Car en Ibiza', 'Wiber Rent a Car à Ibiza'),

  kicker: L('Onze autoverhuurpartner', 'Our car rental partner', 'Unser Partner für Mietwagen', 'Nuestro socio de alquiler de coches', 'Notre partenaire location de voitures'),
  h1: L('Wiber Rent a Car op Ibiza', 'Wiber Rent a Car in Ibiza', 'Wiber Rent a Car auf Ibiza', 'Wiber Rent a Car en Ibiza', 'Wiber Rent a Car à Ibiza'),
  cta: L('Beschikbaarheid bij Wiber', 'Check availability with Wiber', 'Verfügbarkeit bei Wiber prüfen', 'Ver disponibilidad en Wiber', 'Voir les disponibilités chez Wiber'),
  disclaimer: L(
    'Dit is de pagina van Ibiza Mi Vida over het verhuurbedrijf waar wij mee werken. Het is niet de website van Wiber, en wij zíjn Wiber niet. Wij verdienen een commissie als je via de links hier boekt; jou kost dat niets extra, en het is de reden dat we hieronder ronduit zeggen wie beter ergens anders kan boeken.',
    'This is Ibiza Mi Vida’s page about the rental company we work with. It is not Wiber’s own website, and we are not Wiber. We earn a commission when you book through the links here; it costs you nothing extra, and it is why we say plainly below who should book somewhere else.',
    'Das ist die Seite von Ibiza Mi Vida über die Mietwagenfirma, mit der wir arbeiten. Es ist nicht die Website von Wiber, und wir sind nicht Wiber. Wir erhalten eine Provision, wenn du über die Links hier buchst; dich kostet das nichts extra, und deshalb sagen wir unten offen, wer besser woanders bucht.',
    'Esta es la página de Ibiza Mi Vida sobre la empresa de alquiler con la que trabajamos. No es la web de Wiber, y nosotros no somos Wiber. Ganamos una comisión si reservas por los enlaces de aquí; a ti no te cuesta nada más, y por eso decimos abajo claramente quién debería reservar en otro sitio.',
    "Ceci est la page d'Ibiza Mi Vida sur le loueur avec lequel nous travaillons. Ce n'est pas le site de Wiber, et nous ne sommes pas Wiber. Nous touchons une commission si vous réservez via les liens ici ; cela ne vous coûte rien de plus, et c'est pourquoi nous disons franchement plus bas qui devrait réserver ailleurs.",
  ),
  lead1: {
    nl: LEAD_1_BASIS.nl + leadPrijs('nl'),
    en: LEAD_1_BASIS.en + leadPrijs('en'),
    de: LEAD_1_BASIS.de + leadPrijs('de'),
    es: LEAD_1_BASIS.es + leadPrijs('es'),
    fr: LEAD_1_BASIS.fr + leadPrijs('fr'),
  },
  lead2: L(
    'De minimumleeftijd is 21, met een toeslag van €9 per dag tussen 21 en 24, en een creditcard op naam van de hoofdbestuurder is niet onderhandelbaar.',
    'Minimum age is 21, with a €9 per day surcharge between 21 and 24, and a credit card in the main driver’s name is not negotiable.',
    'Das Mindestalter ist 21, mit einem Zuschlag von €9 pro Tag zwischen 21 und 24, und eine Kreditkarte auf den Namen des Hauptfahrers ist nicht verhandelbar.',
    'La edad mínima son 21 años, con un recargo de €9 al día entre los 21 y los 24, y una tarjeta de crédito a nombre del conductor principal no es negociable.',
    "L'âge minimum est de 21 ans, avec un supplément de €9 par jour entre 21 et 24 ans, et une carte de crédit au nom du conducteur principal n'est pas négociable.",
  ),

  headline: [
    { label: L('Kantoor', 'Office', 'Büro', 'Oficina', 'Bureau'), value: L('Km 5, Sant Josep', 'Km 5, Sant Josep', 'Km 5, Sant Josep', 'Km 5, Sant Josep', 'Km 5, Sant Josep') },
    { label: L('Vanaf de terminal', 'From the terminal', 'Vom Terminal', 'Desde la terminal', 'Depuis le terminal'), value: L('5 min, gratis shuttle', '5 min, free shuttle', '5 Min, Gratis-Shuttle', '5 min, lanzadera gratis', '5 min, navette gratuite') },
    { label: L('Minimumleeftijd', 'Minimum age', 'Mindestalter', 'Edad mínima', 'Âge minimum'), value: L('21 (toeslag t/m 24)', '21 (surcharge to 24)', '21 (Zuschlag bis 24)', '21 (recargo hasta 24)', "21 (supplément jusqu'à 24)") },
    { label: L('Betaling', 'Payment', 'Zahlung', 'Pago', 'Paiement'), value: L('Alleen creditcard', 'Credit card only', 'Nur Kreditkarte', 'Solo tarjeta de crédito', 'Carte de crédit uniquement') },
  ],

  factsHeading: L('De voorwaarden, volledig', 'The conditions, in full', 'Die Bedingungen, vollständig', 'Las condiciones, completas', 'Les conditions, en entier'),
  facts: [
    {
      label: L('Ophaallocatie', 'Pick-up location', 'Abholort', 'Lugar de recogida', 'Lieu de prise en charge'),
      value: L(
        'Ctra. Aeropuerto km 5, Sant Josep — ongeveer vijf minuten van de luchthaven van Ibiza, bereikbaar met een gratis shuttle vanaf aankomst.',
        'Ctra. Aeropuerto km 5, Sant Josep — about five minutes from Ibiza Airport, reached by a free shuttle from arrivals.',
        'Ctra. Aeropuerto km 5, Sant Josep — etwa fünf Minuten vom Flughafen Ibiza, erreichbar mit einem kostenlosen Shuttle ab Ankunft.',
        'Ctra. Aeropuerto km 5, Sant Josep — a unos cinco minutos del aeropuerto de Ibiza, con lanzadera gratuita desde llegadas.',
        "Ctra. Aeropuerto km 5, Sant Josep — à environ cinq minutes de l'aéroport d'Ibiza, desservi par une navette gratuite depuis les arrivées.",
      ),
    },
    {
      label: L('Minimumleeftijd', 'Minimum age', 'Mindestalter', 'Edad mínima', 'Âge minimum'),
      value: L(
        '21 jaar, met een rijbewijs dat minstens 12 maanden op zak is.',
        '21 years, with the driving licence held for at least 12 months.',
        '21 Jahre, mit einem seit mindestens 12 Monaten gehaltenen Führerschein.',
        '21 años, con el carné en posesión desde hace al menos 12 meses.',
        "21 ans, avec un permis détenu depuis au moins 12 mois.",
      ),
    },
    {
      label: L('Jongerentoeslag', 'Young-driver surcharge', 'Jungfahrerzuschlag', 'Recargo por conductor joven', 'Supplément jeune conducteur'),
      value: L(
        '€9 per dag voor bestuurders van 21 tot en met 24, bovenop het tarief. Vanaf 25 geen toeslag.',
        '€9 per day for drivers aged 21 to 24, charged on top of the rate. None from 25.',
        '€9 pro Tag für Fahrer von 21 bis 24, zusätzlich zum Tarif. Ab 25 keiner.',
        '€9 al día para conductores de 21 a 24 años, sobre la tarifa. Desde los 25, ninguno.',
        "€9 par jour pour les conducteurs de 21 à 24 ans, en plus du tarif. Aucun à partir de 25 ans.",
      ),
    },
    {
      label: L('Betaling', 'Payment', 'Zahlung', 'Pago', 'Paiement'),
      value: L(
        'Een creditcard op naam van de hoofdbestuurder. Debitcards en kaarten op andermans naam worden geweigerd.',
        'A credit card in the main driver’s name. Debit cards and cards in another person’s name are refused.',
        'Eine Kreditkarte auf den Namen des Hauptfahrers. Debitkarten und Karten auf fremde Namen werden abgelehnt.',
        'Una tarjeta de crédito a nombre del conductor principal. Las de débito y las a nombre de otra persona se rechazan.',
        "Une carte de crédit au nom du conducteur principal. Les cartes de débit et celles au nom d'un tiers sont refusées.",
      ),
    },
    {
      label: L('Borg', 'Deposit', 'Kaution', 'Fianza', 'Caution'),
      value: L(
        'Geblokkeerd op de creditcard, niet afgeschreven, en vrijgegeven nadat de auto onbeschadigd terug is.',
        'Pre-authorised against the credit card, not charged, and released after the car is returned undamaged.',
        'Auf der Kreditkarte vorautorisiert, nicht abgebucht, und freigegeben, nachdem das Auto unbeschädigt zurück ist.',
        'Preautorizada en la tarjeta de crédito, no cobrada, y liberada cuando el coche vuelve sin daños.',
        "Préautorisée sur la carte de crédit, non débitée, et libérée après un retour du véhicule sans dommage.",
      ),
    },
    {
      label: L('Verzekering', 'Insurance', 'Versicherung', 'Seguro', 'Assurance'),
      value: L(
        'Inbegrepen in het all-in tarief in plaats van aan de balie verkocht. Vraag naar het eigen risico en naar wat de dekking ongeldig maakt.',
        'Included in the all-inclusive rate rather than sold at the counter. Ask for the excess figure and what voids the cover.',
        'Im All-inclusive-Tarif enthalten statt am Schalter verkauft. Frag nach der Selbstbeteiligung und danach, was die Deckung aushebelt.',
        'Incluido en la tarifa todo incluido en vez de venderse en el mostrador. Pregunta por la franquicia y por qué anula la cobertura.',
        "Comprise dans le tarif tout compris plutôt que vendue au comptoir. Demandez le montant de la franchise et ce qui annule la couverture.",
      ),
    },
    {
      label: L('Brandstofbeleid', 'Fuel policy', 'Kraftstoffregelung', 'Política de combustible', 'Politique carburant'),
      value: L(
        'Vol ophalen, vol terugbrengen. Laat het bedrijf tanken en je betaalt fors boven de pompprijs.',
        'Collect full, return full. Refuelling by the company is charged at a rate well above the pump.',
        'Voll abholen, voll zurückgeben. Betankt die Firma, wird deutlich über dem Tankstellenpreis abgerechnet.',
        'Recoger lleno, devolver lleno. Si reposta la empresa, se cobra muy por encima del precio de surtidor.',
        "Départ plein, retour plein. Si la société fait le plein, c'est facturé bien au-dessus du prix à la pompe.",
      ),
    },
    {
      label: L('Onverharde wegen', 'Off-road use', 'Fahrten abseits befestigter Straßen', 'Uso fuera de asfalto', 'Hors routes goudronnées'),
      value: L(
        'Schade buiten verharde wegen is uitgesloten, zoals in de meeste Spaanse huurcontracten. Hier relevant — een aantal van de mooiste baaien ligt aan een zandweg.',
        'Damage sustained off sealed roads is excluded, as in most Spanish rental contracts. Relevant here — several of the best coves are down dirt tracks.',
        'Schäden abseits befestigter Straßen sind ausgeschlossen, wie in den meisten spanischen Mietverträgen. Hier relevant — mehrere der schönsten Buchten liegen an Schotterpisten.',
        'Los daños fuera de vías asfaltadas están excluidos, como en casi todos los contratos de alquiler españoles. Aquí importa: varias de las mejores calas están al final de un camino de tierra.',
        "Les dommages hors routes goudronnées sont exclus, comme dans la plupart des contrats de location espagnols. C'est pertinent ici — plusieurs des plus belles criques sont au bout d'une piste.",
      ),
    },
  ],

  stepsHeading: L('Hoe het ophalen echt gaat', 'How pick-up actually goes', 'Wie die Abholung wirklich läuft', 'Cómo va de verdad la recogida', 'Comment se passe vraiment la prise en charge'),
  steps: [
    {
      title: L('Stuur je vluchtnummer bij het boeken', 'Send your flight number when you book', 'Schick die Flugnummer beim Buchen', 'Manda el número de vuelo al reservar', 'Envoyez votre numéro de vol à la réservation'),
      body: L(
        'Niet op de dag zelf. Het kantoor volgt de aankomst, dus een vertraging lost zichzelf op en niemand wacht op een boeking die op een no-show lijkt. Boek je om naar een andere vlucht, app ons dan — dat is de ene wijziging die zichzelf niet volgt.',
        'Not on the day. The office tracks the arrival, so a delay handles itself and nobody is waiting on a booking that looks like a no-show. If you rebook onto a different flight, message us — that is the one change that does not track itself.',
        'Nicht am Tag selbst. Das Büro verfolgt die Ankunft, eine Verspätung erledigt sich also von selbst und niemand wartet auf eine Buchung, die wie ein No-Show aussieht. Buchst du auf einen anderen Flug um, schreib uns — das ist die eine Änderung, die sich nicht selbst verfolgt.',
        'No el mismo día. La oficina sigue la llegada, así que un retraso se resuelve solo y nadie espera por una reserva que parece un no-show. Si cambias a otro vuelo, escríbenos — es el único cambio que no se sigue solo.',
        "Pas le jour même. Le bureau suit l'arrivée, un retard se gère donc tout seul et personne n'attend une réservation qui ressemble à un no-show. Si vous changez de vol, écrivez-nous — c'est le seul changement qui ne se suit pas tout seul.",
      ),
    },
    {
      title: L('Neem de shuttle vanaf aankomst', 'Take the shuttle from arrivals', 'Nimm den Shuttle ab Ankunft', 'Coge la lanzadera en llegadas', 'Prenez la navette aux arrivées'),
      body: L(
        'De shuttle-ophaalplek, niet de taxistandplaats. Vijf minuten naar het kantoor op km 5. In augustus is dit precies het deel dat de terminalrij verslaat in plaats van eraan te verliezen.',
        'The shuttle pick-up area, not the taxi rank. Five minutes to the office at km 5. In August this is the part that beats the terminal queue rather than losing to it.',
        'Der Shuttle-Bereich, nicht der Taxistand. Fünf Minuten zum Büro bei km 5. Im August ist genau das der Teil, der die Terminalschlange schlägt statt an ihr zu verlieren.',
        'La zona de recogida de lanzaderas, no la parada de taxis. Cinco minutos hasta la oficina del km 5. En agosto es justo la parte que gana a la cola de la terminal en vez de perder contra ella.',
        "La zone de la navette, pas la station de taxis. Cinq minutes jusqu'au bureau au km 5. En août, c'est précisément ce qui bat la file du terminal plutôt que d'y perdre.",
      ),
    },
    {
      title: L('Haal de sleutel op', 'Collect the key', 'Hol den Schlüssel ab', 'Recoge la llave', 'Récupérez la clé'),
      body: L(
        'Het papierwerk is vooraf gedaan, dus dit is een overdracht en geen balieafspraak — meestal onder het kwartier inclusief de shuttle. Neem de creditcard, het rijbewijs en een identiteitsbewijs mee.',
        'The paperwork is done in advance, so this is a handover rather than a counter appointment — usually under fifteen minutes including the shuttle. Bring the credit card, the licence and photo ID.',
        'Der Papierkram ist vorab erledigt, das ist also eine Übergabe und kein Schaltertermin — meist unter einer Viertelstunde inklusive Shuttle. Bring Kreditkarte, Führerschein und Lichtbildausweis mit.',
        'El papeleo está hecho antes, así que esto es una entrega y no una cita en mostrador — normalmente menos de quince minutos con lanzadera incluida. Lleva la tarjeta de crédito, el carné y un documento con foto.',
        "Les papiers sont faits à l'avance : c'est donc une remise de clé et pas un rendez-vous au comptoir — généralement moins d'un quart d'heure, navette comprise. Apportez la carte de crédit, le permis et une pièce d'identité.",
      ),
    },
    {
      title: L('Fotografeer de auto vóór je wegrijdt', 'Photograph the car before you drive off', 'Fotografiere das Auto, bevor du losfährst', 'Fotografía el coche antes de arrancar', 'Photographiez la voiture avant de partir'),
      body: L(
        'Loop eromheen en fotografeer alles wat al beschadigd is, wielen en dak inbegrepen. Twee minuten hier is de goedkoopste verzekering in de hele autoverhuur, en het is precies de stap die iedereen overslaat als hij moe is.',
        'Walk round it and photograph anything already marked, including the wheels and the roof. Two minutes here is the cheapest insurance in car rental anywhere, and it is the step everybody skips when they are tired.',
        'Geh einmal herum und fotografiere alles, was schon beschädigt ist, Räder und Dach eingeschlossen. Zwei Minuten hier sind die günstigste Versicherung der ganzen Autovermietung, und es ist der Schritt, den müde Leute überspringen.',
        'Da una vuelta y fotografía todo lo que ya esté marcado, ruedas y techo incluidos. Dos minutos aquí son el seguro más barato de todo el alquiler de coches, y es justo el paso que se salta la gente cansada.',
        "Faites le tour et photographiez tout ce qui est déjà marqué, roues et toit compris. Deux minutes ici, c'est l'assurance la moins chère de toute la location de voitures, et c'est l'étape que tout le monde saute quand il est fatigué.",
      ),
    },
  ],

  suitsHeading: L('Boek via Wiber als', 'Book through Wiber if', 'Buche über Wiber, wenn', 'Reserva con Wiber si', 'Réservez via Wiber si'),
  suits: [
    L('Je wilt dat de geoffreerde prijs de prijs is, en je in Spanje al eens door een balieverkoop bent overvallen.', 'You want the quoted price to be the price, and you have been caught by a counter upsell in Spain before.', 'Du willst, dass der genannte Preis der Preis ist, und schon einmal in Spanien am Schalter überrumpelt wurdest.', 'Quieres que el precio ofertado sea el precio, y ya te han pillado con un extra en el mostrador en España.', "Vous voulez que le prix annoncé soit le prix, et vous vous êtes déjà fait avoir par une vente au comptoir en Espagne."),
    L('Je in juli of augustus ’s avonds landt, wanneer de rijen in de terminal op hun ergst zijn.', 'You are landing in the evening in July or August, when the in-terminal queues are at their worst.', 'Du im Juli oder August abends landest, wenn die Schlangen im Terminal am schlimmsten sind.', 'Aterrizas por la tarde en julio o agosto, cuando las colas en la terminal están peor.', "Vous atterrissez le soir en juillet ou août, quand les files du terminal sont au pire."),
    L('Je 25 of ouder bent met een creditcard op eigen naam — dan kosten de voorwaarden je niets.', 'You are 25 or over with a credit card in your own name — the conditions cost you nothing.', 'Du 25 oder älter bist und eine Kreditkarte auf den eigenen Namen hast — dann kosten dich die Bedingungen nichts.', 'Tienes 25 o más y una tarjeta de crédito a tu nombre — las condiciones no te cuestan nada.', "Vous avez 25 ans ou plus avec une carte de crédit à votre nom — les conditions ne vous coûtent rien."),
    L('Je liever een lokaal nummer appt als er iets misgaat aan de balie dan een internationaal callcenter belt.', 'You want a local number to message if something goes wrong at the desk, rather than an international call centre.', 'Du lieber eine lokale Nummer anschreibst, wenn am Schalter etwas schiefgeht, statt ein internationales Callcenter anzurufen.', 'Prefieres escribir a un número local si algo sale mal en el mostrador antes que llamar a un call center internacional.', "Vous préférez écrire à un numéro local si quelque chose coince au comptoir plutôt qu'appeler un centre d'appels international."),
  ],
  notSuitsHeading: L('Boek ergens anders als', 'Book elsewhere if', 'Buche woanders, wenn', 'Reserva en otro sitio si', 'Réservez ailleurs si'),
  notSuits: [
    L('De laagste koptekstprijs is waar je op stuurt. All-in wint die vergelijking zelden, want de concurrentie offreert zonder dekking.', 'The lowest headline number is what you are optimising for. All-inclusive rarely wins that comparison, because the competition is quoting without cover.', 'Der niedrigste Schlagzeilenpreis dein Ziel ist. All-inclusive gewinnt diesen Vergleich selten, weil die Konkurrenz ohne Deckung anbietet.', 'Lo que optimizas es el precio más bajo del titular. El todo incluido rara vez gana esa comparación, porque la competencia cotiza sin cobertura.', "Vous optimisez le prix affiché le plus bas. Le tout compris gagne rarement cette comparaison, car la concurrence chiffre sans couverture."),
    L('Niemand in je gezelschap een creditcard heeft. Dat is een harde grens en geen drempel — neem er een mee of boek bij een bedrijf dat debit accepteert.', 'Nobody in your party has a credit card. This is a hard stop, not a hurdle — bring one or book with a company that takes debit.', 'Niemand in eurer Gruppe eine Kreditkarte hat. Das ist eine harte Grenze, keine Hürde — bring eine mit oder buche bei einer Firma, die Debit akzeptiert.', 'Nadie de tu grupo tiene tarjeta de crédito. Es un límite duro, no un obstáculo — lleva una o reserva con una empresa que acepte débito.', "Personne dans votre groupe n'a de carte de crédit. C'est un blocage net, pas un obstacle — apportez-en une ou réservez chez un loueur qui accepte la carte de débit."),
    L('Je onder de 21 bent, of je rijbewijs korter dan 12 maanden hebt. Daar is geen omweg voor.', 'You are under 21, or have held the licence under 12 months. There is no workaround.', 'Du unter 21 bist oder den Führerschein weniger als 12 Monate hast. Dafür gibt es keinen Umweg.', 'Tienes menos de 21, o el carné desde hace menos de 12 meses. No hay atajo.', "Vous avez moins de 21 ans, ou le permis depuis moins de 12 mois. Il n'y a pas de contournement."),
    L('Je plan echt ruig terreinrijden is. De uitsluiting is standaard, maar standaard betekent niet dat er niet op gehandhaafd wordt.', 'Your plan is genuinely rough off-road driving. The exclusion is standard, but standard does not mean it will not be enforced.', 'Dein Plan wirklich raues Geländefahren ist. Der Ausschluss ist Standard, aber Standard heißt nicht, dass er nicht durchgesetzt wird.', 'Tu plan es de verdad conducir campo a través. La exclusión es estándar, pero estándar no significa que no se aplique.', "Votre projet est vraiment du tout-terrain. L'exclusion est standard, mais standard ne veut pas dire qu'elle ne sera pas appliquée."),
  ],

  verdictHeading: L('Onze eerlijke lezing', 'Our honest read', 'Unsere ehrliche Einschätzung', 'Nuestra lectura honesta', 'Notre lecture honnête'),
  verdict: [
    L(
      'Wiber is niet de goedkoopste naam die je op een vergelijkingssite ziet, en dat zeggen we hier liever dan dat je het na het boeken ontdekt. Waar je het verschil voor betaalt is dat het bedrag ophoudt te bewegen: de verzekering zit in het tarief, dus de balie heeft je aan het eind van een lange vlucht niets meer te verkopen.',
      'Wiber is not the cheapest name you will see on a comparison site, and we would rather say that here than have you discover it after booking. What you are paying the difference for is that the number stops moving: the insurance is in the rate, so the counter has nothing left to sell you at the end of a long flight.',
      'Wiber ist nicht der günstigste Name auf einer Vergleichsseite, und das sagen wir hier lieber, als dass du es nach der Buchung merkst. Wofür du den Unterschied zahlst: Die Zahl hört auf sich zu bewegen. Die Versicherung steckt im Tarif, der Schalter hat dir am Ende eines langen Flugs also nichts mehr zu verkaufen.',
      'Wiber no es el nombre más barato que verás en un comparador, y preferimos decirlo aquí a que lo descubras después de reservar. Lo que pagas de más es que la cifra deje de moverse: el seguro va en la tarifa, así que al mostrador no le queda nada que venderte al final de un vuelo largo.',
      "Wiber n'est pas le nom le moins cher que vous verrez sur un comparateur, et nous préférons le dire ici plutôt que vous le laissiez découvrir après réservation. Ce que vous payez en plus, c'est que le chiffre cesse de bouger : l'assurance est dans le tarif, le comptoir n'a donc plus rien à vous vendre au bout d'un long vol.",
    ),
    L(
      'De voorwaarden — minimaal 21, €9 per dag tot 24, creditcard op naam van de bestuurder — zijn gewoon voor Spanje en niet royaal. Wij zetten ze vooraan omdat het moment waarop ze een probleem worden de balie is, waar er niets meer aan te doen valt, en een boeking die op een debitcard sneuvelt is voor iedereen slechter dan een boeking die nooit gemaakt is.',
      'The conditions — 21 minimum, €9 a day to 24, credit card in the driver’s name — are ordinary for Spain rather than generous. We list them up front because the moment they cause a problem is at the desk, when there is no way to fix it, and a booking lost to a debit card is worse for everyone than a booking never made.',
      'Die Bedingungen — mindestens 21, €9 pro Tag bis 24, Kreditkarte auf den Fahrernamen — sind für Spanien normal und nicht großzügig. Wir stellen sie nach vorne, weil der Moment, in dem sie zum Problem werden, der Schalter ist, wo sich nichts mehr machen lässt, und eine an einer Debitkarte gescheiterte Buchung für alle schlechter ist als eine nie gemachte.',
      'Las condiciones — 21 mínimo, €9 al día hasta los 24, tarjeta de crédito a nombre del conductor — son lo normal en España, no algo generoso. Las ponemos por delante porque el momento en que dan problema es el mostrador, donde ya no hay arreglo, y una reserva perdida por una tarjeta de débito es peor para todos que una reserva que nunca se hizo.',
      "Les conditions — 21 ans minimum, €9 par jour jusqu'à 24 ans, carte de crédit au nom du conducteur — sont ordinaires pour l'Espagne, pas généreuses. Nous les mettons en avant parce que le moment où elles posent problème, c'est au comptoir, où il n'y a plus rien à faire, et une réservation perdue à cause d'une carte de débit est pire pour tout le monde qu'une réservation jamais faite.",
    ),
    L(
      'Passen die voorwaarden bij jou, dan is dit de minst eventvolle manier om op dit eiland aan een auto te komen — en een autohuur zonder gebeurtenissen is precies het doel.',
      'If those conditions fit you, this is the least eventful way to get a car on this island, and an uneventful car hire is the whole point.',
      'Passen die Bedingungen zu dir, ist das der ereignisloseste Weg, auf dieser Insel an ein Auto zu kommen — und eine ereignislose Autovermietung ist genau der Sinn der Sache.',
      'Si esas condiciones te encajan, esta es la forma menos accidentada de conseguir un coche en esta isla — y un alquiler sin incidentes es justo de lo que se trata.',
      "Si ces conditions vous conviennent, c'est la façon la moins mouvementée d'avoir une voiture sur cette île — et une location sans histoires, c'est tout l'objectif.",
    ),
  ],

  faqs: [
    {
      q: L('Is Wiber een goede autoverhuurder op Ibiza?', 'Is Wiber a good car rental company in Ibiza?', 'Ist Wiber eine gute Autovermietung auf Ibiza?', '¿Wiber es buena empresa de alquiler en Ibiza?', 'Wiber est-il un bon loueur à Ibiza ?'),
      a: L(
        'Het is degene waar wij bij boeken, en de reden is smal en specifiek: het all-in tarief houdt stand aan de balie. De gebruikelijke klacht op Spaanse luchthavens is niet dat de auto slecht was, maar dat een boeking van €90 er €240 werd zodra de verzekering aan de balie werd verkocht. Wiber zet die dekking in plaats daarvan in het tarief. Dat maakt het niet de laagste koptekstprijs op een vergelijkingssite — meestal is het dat niet — en stuur je op dat getal, dan vind je lagere.',
        'It is the one we book through, and the reason is narrow and specific: the all-inclusive rate holds at the counter. The common Spanish-airport complaint is not that the car was bad, it is that a €90 booking became €240 once insurance was sold at the desk. Wiber puts the cover in the rate instead. That does not make it the cheapest headline price on a comparison site — it usually is not — and if the headline number is what you are optimising for, you will find lower ones.',
        'Es ist die, über die wir buchen, und der Grund ist eng und konkret: Der All-inclusive-Tarif hält am Schalter. Die übliche Beschwerde an spanischen Flughäfen ist nicht, dass das Auto schlecht war, sondern dass aus einer Buchung über €90 nach dem Verkauf der Versicherung am Schalter €240 wurden. Wiber steckt die Deckung stattdessen in den Tarif. Das macht es nicht zum günstigsten Schlagzeilenpreis auf einer Vergleichsseite — meist ist es das nicht — und wer auf diese Zahl optimiert, findet niedrigere.',
        'Es con la que reservamos, y la razón es estrecha y concreta: la tarifa todo incluido aguanta en el mostrador. La queja habitual en aeropuertos españoles no es que el coche fuera malo, sino que una reserva de €90 se convirtió en €240 al venderte el seguro en el mostrador. Wiber mete esa cobertura en la tarifa. Eso no la convierte en el precio de titular más barato de un comparador — normalmente no lo es — y si optimizas por esa cifra, encontrarás más bajas.',
        "C'est celui via lequel nous réservons, et la raison est étroite et précise : le tarif tout compris tient au comptoir. La plainte habituelle dans les aéroports espagnols n'est pas que la voiture était mauvaise, c'est qu'une réservation à €90 est devenue €240 une fois l'assurance vendue au guichet. Wiber met la couverture dans le tarif. Cela n'en fait pas le prix affiché le moins cher d'un comparateur — ce n'est généralement pas le cas — et si c'est ce chiffre que vous optimisez, vous en trouverez de plus bas.",
      ),
    },
    {
      q: L('Waar zit het Wiber-kantoor bij de luchthaven precies?', 'Where exactly is the Wiber office at Ibiza Airport?', 'Wo genau liegt das Wiber-Büro am Flughafen Ibiza?', '¿Dónde está exactamente la oficina de Wiber en el aeropuerto?', "Où se trouve exactement le bureau Wiber à l'aéroport ?"),
      a: L(
        'Ctra. Aeropuerto km 5, in Sant Josep, ongeveer vijf minuten van de terminal, met een gratis shuttle vanaf aankomst. Het ligt buiten de luchthaven, wat erger klinkt dan het is: in augustus lopen de balies in de terminal na een reeks avondaankomsten routinematig meer dan een uur uit, en de shuttle plus een balie buiten de luchthaven is betrouwbaar sneller.',
        'Ctra. Aeropuerto km 5, in Sant Josep, about five minutes from the terminal, with a free shuttle from arrivals. It is off-airport, which sounds worse than it is: in August the in-terminal desks routinely run past an hour after a bank of evening arrivals, and the shuttle plus an off-airport desk is reliably faster.',
        'Ctra. Aeropuerto km 5 in Sant Josep, etwa fünf Minuten vom Terminal, mit kostenlosem Shuttle ab Ankunft. Es liegt außerhalb des Flughafens, was schlimmer klingt als es ist: Im August laufen die Schalter im Terminal nach einer Welle von Abendankünften routinemäßig über eine Stunde, und Shuttle plus Schalter außerhalb ist verlässlich schneller.',
        'Ctra. Aeropuerto km 5, en Sant Josep, a unos cinco minutos de la terminal, con lanzadera gratuita desde llegadas. Está fuera del aeropuerto, lo que suena peor de lo que es: en agosto los mostradores de la terminal se van rutinariamente por encima de la hora tras una tanda de llegadas por la tarde, y la lanzadera más una oficina fuera es fiablemente más rápida.',
        "Ctra. Aeropuerto km 5, à Sant Josep, à environ cinq minutes du terminal, avec une navette gratuite depuis les arrivées. C'est hors aéroport, ce qui sonne pire que ce ne l'est : en août, les comptoirs du terminal dépassent régulièrement l'heure d'attente après une série d'arrivées en soirée, et la navette plus un bureau hors aéroport est plus rapide de façon fiable.",
      ),
    },
    {
      q: L('Wat moet ik meenemen?', 'What do I need to bring?', 'Was muss ich mitbringen?', '¿Qué tengo que llevar?', 'Que dois-je apporter ?'),
      a: L(
        'Een creditcard op naam van de hoofdbestuurder, het fysieke rijbewijs, en een identiteitsbewijs met foto. Alle drie, elke keer. De creditcard is degene waar mensen op stuklopen: een debitcard, of een kaart van een partner die niet de genoemde bestuurder is, wordt geweigerd, en daar valt om elf uur ’s avonds niet omheen te praten.',
        'A credit card in the main driver’s name, the physical driving licence, and photo ID. All three, every time. The credit card is the one that catches people: a debit card, or a card belonging to a partner who is not the named driver, is refused, and there is no talking round it at eleven at night.',
        'Eine Kreditkarte auf den Namen des Hauptfahrers, den physischen Führerschein und einen Lichtbildausweis. Alle drei, jedes Mal. Die Kreditkarte ist der Stolperstein: Eine Debitkarte oder eine Karte des Partners, der nicht der eingetragene Fahrer ist, wird abgelehnt, und um elf Uhr abends lässt sich das nicht wegdiskutieren.',
        'Una tarjeta de crédito a nombre del conductor principal, el carné de conducir físico y un documento con foto. Los tres, siempre. La tarjeta de crédito es la que pilla a la gente: una de débito, o una de la pareja que no es el conductor designado, se rechaza, y a las once de la noche no hay conversación que lo arregle.',
        "Une carte de crédit au nom du conducteur principal, le permis physique et une pièce d'identité avec photo. Les trois, à chaque fois. La carte de crédit est le point qui coince : une carte de débit, ou une carte appartenant à un conjoint qui n'est pas le conducteur désigné, est refusée, et à onze heures du soir il n'y a rien à négocier.",
      ),
    },
    {
      q: L('Wat is de jongerentoeslag?', 'What is the young-driver surcharge?', 'Was ist der Jungfahrerzuschlag?', '¿Cuál es el recargo por conductor joven?', 'Quel est le supplément jeune conducteur ?'),
      a: L(
        '€9 per dag voor bestuurders van 21 tot en met 24, boven op het tarief. Hij zit niet in de all-in prijs, dus begroot hem apart — op een reis van tien dagen is dat €90. Vanaf 25 is er geen toeslag. De minimumleeftijd is 21 en het rijbewijs moet minstens 12 maanden op zak zijn.',
        '€9 per day for drivers aged 21 to 24, charged on top of the rate. It is not absorbed by the all-inclusive price, so budget for it separately — on a ten-day trip it is €90. From 25 there is no surcharge. Minimum age is 21 and the licence must have been held for at least 12 months.',
        '€9 pro Tag für Fahrer von 21 bis 24, zusätzlich zum Tarif. Er ist nicht im All-inclusive-Preis enthalten, plane ihn also separate ein — auf einer Zehntagesreise sind das €90. Ab 25 entfällt er. Das Mindestalter ist 21, und der Führerschein muss seit mindestens 12 Monaten bestehen.',
        '€9 al día para conductores de 21 a 24 años, sobre la tarifa. No lo absorbe el precio todo incluido, así que presupuéstalo aparte — en un viaje de diez días son €90. Desde los 25 no hay recargo. La edad mínima son 21 años y el carné debe tener al menos 12 meses.',
        "€9 par jour pour les conducteurs de 21 à 24 ans, en plus du tarif. Il n'est pas absorbé par le prix tout compris : budgétez-le à part — sur dix jours, cela fait €90. À partir de 25 ans, aucun supplément. L'âge minimum est 21 ans et le permis doit être détenu depuis au moins 12 mois.",
      ),
    },
    {
      q: L('Wordt de borg afgeschreven of geblokkeerd?', 'Is the deposit charged or blocked?', 'Wird die Kaution abgebucht oder geblockt?', '¿La fianza se cobra o se bloquea?', 'La caution est-elle débitée ou bloquée ?'),
      a: L(
        'Geblokkeerd, niet afgeschreven: het bedrag wordt vastgehouden tegen de limiet van de creditcard en vrijgegeven zodra de auto terug is. Het verlaagt wel wat je tijdens de reis met die kaart kunt uitgeven, en dat telt als het dezelfde kaart is waarmee je uit eten wilde.',
        'Pre-authorised, not charged: the amount is held against the credit card limit and released after the car comes back. It still reduces what you can spend on that card during the trip, which matters if it is the same card you were planning to eat out on.',
        'Geblockt, nicht abgebucht: Der Betrag wird gegen das Kreditkartenlimit gehalten und freigegeben, sobald das Auto zurück ist. Er senkt trotzdem, was du während der Reise auf dieser Karte ausgeben kannst — relevant, wenn es dieselbe Karte ist, mit der du essen gehen wolltest.',
        'Se bloquea, no se cobra: el importe se retiene contra el límite de la tarjeta y se libera cuando vuelve el coche. Aun así reduce lo que puedes gastar con esa tarjeta durante el viaje, y eso importa si es la misma con la que pensabas salir a cenar.',
        "Préautorisée, pas débitée : le montant est retenu sur le plafond de la carte et libéré au retour du véhicule. Cela réduit tout de même ce que vous pouvez dépenser avec cette carte pendant le séjour, ce qui compte si c'est celle avec laquelle vous comptiez dîner.",
      ),
    },
    {
      q: L('Wat is niet gedekt?', 'What is not covered?', 'Was ist nicht gedeckt?', '¿Qué no está cubierto?', "Qu'est-ce qui n'est pas couvert ?"),
      a: L(
        'Schade opgelopen buiten verharde wegen is de grote, en die telt hier omdat de helft van de mooie baaien aan een zandweg ligt. Een verloren sleutel, en het interieur na een nat weekend, zijn ook voor jou. Vraag naar het bedrag van het eigen risico en naar de lijst van wat de dekking ongeldig maakt voordat je tekent — die twee antwoorden zeggen meer dan het dagtarief.',
        'Damage sustained off sealed roads is the big one, and it matters here because half the good coves are down dirt tracks. A lost key, and the interior after a wet weekend, are also yours. Ask for the excess figure and for the list of what voids the cover before you sign — those two answers tell you more than the daily rate does.',
        'Schäden abseits befestigter Straßen sind der große Punkt, und der zählt hier, weil die Hälfte der schönen Buchten an Schotterpisten liegt. Ein verlorener Schlüssel und der Innenraum nach einem nassen Wochenende gehen ebenfalls auf dich. Frag vor der Unterschrift nach der Selbstbeteiligung und nach der Liste dessen, was die Deckung aushebelt — diese zwei Antworten sagen mehr als der Tagespreis.',
        'Los daños fuera de vías asfaltadas son el grande, y aquí importa porque la mitad de las calas buenas están al final de un camino de tierra. Una llave perdida, y el interior tras un fin de semana mojado, también son tuyos. Pregunta la franquicia y la lista de lo que anula la cobertura antes de firmar — esas dos respuestas dicen más que la tarifa diaria.',
        "Les dommages hors routes goudronnées sont le point majeur, et il compte ici parce que la moitié des belles criques sont au bout d'une piste. Une clé perdue, et l'intérieur après un week-end humide, sont également à votre charge. Demandez le montant de la franchise et la liste de ce qui annule la couverture avant de signer — ces deux réponses en disent plus que le tarif journalier.",
      ),
    },
  ],

  linksHeading: L('Gerelateerde pagina’s', 'Related pages', 'Verwandte Seiten', 'Páginas relacionadas', 'Pages liées'),
  links: [
    {
      key: 'car-rental', localized: true,
      label: L('Auto huren op Ibiza', 'Car rental in Ibiza', 'Mietwagen auf Ibiza', 'Alquiler de coches en Ibiza', 'Location de voiture à Ibiza'),
      body: L('Het hele plaatje: categorieën, prijzen, parkeren en waarom een auto hier loont.', 'The full picture: categories, prices, parking and why a car is worth it here.', 'Das ganze Bild: Kategorien, Preise, Parken und warum sich ein Auto hier lohnt.', 'El cuadro completo: categorías, precios, aparcamiento y por qué compensa el coche.', "Le tableau complet : catégories, prix, stationnement et pourquoi la voiture vaut le coup ici."),
    },
    {
      key: 'car-rental-airport', localized: true,
      label: L('Auto huren op de luchthaven', 'Car rental at Ibiza Airport', 'Mietwagen am Flughafen Ibiza', 'Alquiler de coches en el aeropuerto', "Location de voiture à l'aéroport"),
      body: L('Het ophalen op IBZ in meer detail, inclusief late landingen.', 'The pick-up flow at IBZ in more detail, including late landings.', 'Die Abholung am IBZ im Detail, auch bei späten Landungen.', 'La recogida en IBZ con más detalle, incluidos aterrizajes tarde.', "La prise en charge à IBZ en détail, y compris les vols tardifs."),
    },
    {
      key: 'clickandboat-partner', localized: true,
      label: L('Click&Boat, onze bootpartner', 'Click&Boat, our boat partner', 'Click&Boat, unser Bootspartner', 'Click&Boat, nuestro socio de barcos', 'Click&Boat, notre partenaire bateau'),
      body: L('Dezelfde behandeling voor het platform achter onze boten.', 'The same treatment for the platform behind our boats.', 'Dieselbe Behandlung für die Plattform hinter unseren Booten.', 'El mismo tratamiento para la plataforma detrás de nuestros barcos.', "Le même traitement pour la plateforme derrière nos bateaux."),
    },
  ],
  bylineTopic: L(
    'een auto huren op Ibiza via Wiber',
    'renting a car in Ibiza through Wiber',
    'auf Ibiza ein Auto über Wiber mieten',
    'alquilar un coche en Ibiza con Wiber',
    'la location de voiture à Ibiza via Wiber',
  ),

  productName: L(
    'Auto huren op Ibiza met Wiber Rent a Car',
    'Car rental in Ibiza with Wiber Rent a Car',
    'Mietwagen auf Ibiza mit Wiber Rent a Car',
    'Alquiler de coches en Ibiza con Wiber Rent a Car',
    'Location de voiture à Ibiza avec Wiber Rent a Car',
  ),
  productDescription: L(
    'All-in autohuur op Ibiza via Wiber Rent a Car, vijf minuten van de luchthaven met gratis shuttle en contactloos ophalen.',
    'All-inclusive car rental in Ibiza through Wiber Rent a Car, five minutes from Ibiza Airport with a free shuttle and contactless pick-up.',
    'All-inclusive-Mietwagen auf Ibiza über Wiber Rent a Car, fünf Minuten vom Flughafen mit Gratis-Shuttle und kontaktloser Abholung.',
    'Alquiler de coches todo incluido en Ibiza con Wiber Rent a Car, a cinco minutos del aeropuerto con lanzadera gratuita y recogida sin contacto.',
    "Location de voiture tout compris à Ibiza via Wiber Rent a Car, à cinq minutes de l'aéroport avec navette gratuite et prise en charge sans contact.",
  ),
  productBrand: 'Wiber Rent a Car',
  price: perDay,
}
