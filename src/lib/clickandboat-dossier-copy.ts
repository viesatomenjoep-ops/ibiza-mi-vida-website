import { RENTAL_PRICES } from '@/lib/rental-prices'
import { CLICKANDBOAT_URL } from '@/lib/partners'
import type { DossierCopy, T } from '@/components/guides/PartnerDossierPage'
import type { Locale } from '@/lib/seo'

/**
 * Partnerdossier Click&Boat, vijf talen.
 *
 * "Is Click&Boat betrouwbaar" en "Click&Boat ervaringen" zijn vertrouwensvragen
 * en geen categorievragen, dus deze pagina concurreert niet met de bootgids op
 * /boats. Wat hem zijn plek geeft is één feit: Click&Boat is een marktplaats en
 * geen exploitant. De boot, de schipper en de borgvoorwaarden zijn van een
 * eigenaar, en dat verklaart vrijwel elke verrassing die mensen melden. Dat
 * ronduit zeggen is nuttiger dan nog een lijst met baaien.
 *
 * ── Eén gecorrigeerde link ────────────────────────────────────────────────
 * De pillar stond op `boat-rental-ibiza`. Die route bestaat nog wel maar doet
 * sinds de samenvoeging een 308 naar /boats (zie CLAUDE.md), dus de knop
 * "alle bootverhuuropties" wees naar een omleiding. Nu naar `boats` zelf.
 */

const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const skipper = RENTAL_PRICES.boatWithSkipper.amount

/** De vanafprijs valt weg zodra hij niet bevestigd is; de zin blijft dan kloppen. */
function leadPrijs(l: Locale): string {
  if (!skipper) return ''
  const m: T = L(
    ` Dagcharters met schipper beginnen bij €${skipper}.`,
    ` Skippered day charters start at €${skipper}.`,
    ` Tagescharter mit Skipper beginnen bei €${skipper}.`,
    ` Los chárteres de día con patrón parten de €${skipper}.`,
    ` Les charters à la journée avec skipper démarrent à €${skipper}.`,
  )
  return m[l]
}

const LEAD_1_BASIS: T = L(
  'Click&Boat is de grootste bootverhuurmarktplaats van Europa, met meer dan 55.000 boten in de etalage. Het woord dat telt is márktplaats: ze bezitten de boten niet. Eigenaren en chartermaatschappijen zetten ze erop, en dáárom verschillen prijzen, borgsommen en annuleringsvoorwaarden van de ene advertentie tot de andere.',
  'Click&Boat is Europe’s largest boat rental marketplace, with more than 55,000 boats listed. The word that matters is marketplace: it does not own the boats. Owners and charter companies list them, which is why prices, deposits and cancellation terms vary from one listing to the next.',
  'Click&Boat ist Europas größter Bootsvermietungs-Marktplatz mit über 55.000 gelisteten Booten. Das entscheidende Wort ist Marktplatz: Die Boote gehören ihnen nicht. Eigentümer und Charterfirmen stellen sie ein, und deshalb unterscheiden sich Preise, Kautionen und Stornobedingungen von Inserat zu Inserat.',
  'Click&Boat es el mayor marketplace de alquiler de barcos de Europa, con más de 55.000 barcos publicados. La palabra que importa es marketplace: no son dueños de los barcos. Los publican propietarios y empresas de chárter, y por eso los precios, las fianzas y las condiciones de cancelación cambian de un anuncio a otro.',
  "Click&Boat est la plus grande place de marché de location de bateaux d'Europe, avec plus de 55 000 bateaux référencés. Le mot qui compte est place de marché : elle ne possède pas les bateaux. Ce sont des propriétaires et des sociétés de charter qui les listent, et c'est pourquoi prix, cautions et conditions d'annulation varient d'une annonce à l'autre.",
)

export const CLICKANDBOAT_DOSSIER: DossierCopy = {
  routeKey: 'clickandboat-partner',
  pageKey: 'click-and-boat-ibiza',
  partner: 'Click&Boat',
  logoKey: 'clickandboat',
  href: CLICKANDBOAT_URL,
  pillar: {
    key: 'boats', localized: false,
    label: L('Alle bootverhuuropties op Ibiza', 'All boat rental options in Ibiza', 'Alle Bootsvermietungs-Optionen auf Ibiza', 'Todas las opciones de alquiler de barco en Ibiza', "Toutes les options de location de bateau à Ibiza"),
  },
  crumbParent: {
    key: 'boats', localized: false,
    label: L('Ibiza per boot', 'Ibiza by boat', 'Ibiza per Boot', 'Ibiza en barco', 'Ibiza en bateau'),
  },
  crumbSelf: L('Click&Boat', 'Click&Boat', 'Click&Boat', 'Click&Boat', 'Click&Boat'),

  metaTitle: L(
    'Click&Boat op Ibiza — onze partner, eerlijk',
    'Click&Boat in Ibiza: Our Partner, Reviewed',
    'Click&Boat auf Ibiza — unser Partner',
    'Click&Boat en Ibiza: nuestro socio, revisado',
    'Click&Boat à Ibiza : notre partenaire',
  ),
  metaDesc: L(
    'Click&Boat is een marktplaats en geen exploitant — dat verklaart de borgsommen, de brandstofrekeningen en de verrassingen. Wat je controleert vóór je boekt.',
    'Click&Boat is a marketplace, not an operator — which explains the deposits, the fuel bills and the surprises. What to check before booking a boat in Ibiza.',
    'Click&Boat ist ein Marktplatz und kein Betreiber — das erklärt Kautionen, Kraftstoffrechnungen und Überraschungen. Was du prüfst, bevor du ein Boot buchst.',
    'Click&Boat es un marketplace y no un operador — eso explica las fianzas, las facturas de combustible y las sorpresas. Qué comprobar antes de reservar un barco.',
    "Click&Boat est une place de marché, pas un opérateur — d'où les cautions, les factures de carburant et les surprises. Ce qu'il faut vérifier avant de réserver.",
  ),
  ogDesc: L(
    'Wat een Ibiza-boot boeken via Click&Boat werkelijk inhoudt, en de vier dingen die je eerst controleert.',
    'What booking an Ibiza boat through Click&Boat actually involves, and the four things to check first.',
    'Was das Buchen eines Ibiza-Boots über Click&Boat wirklich bedeutet, und die vier Dinge, die du zuerst prüfst.',
    'Lo que implica de verdad reservar un barco en Ibiza por Click&Boat, y las cuatro cosas que comprobar primero.',
    "Ce qu'implique vraiment la réservation d'un bateau à Ibiza via Click&Boat, et les quatre points à vérifier.",
  ),
  ogAlt: L('Bootverhuur op Ibiza via Click&Boat', 'Click&Boat boat rental in Ibiza', 'Bootsvermietung auf Ibiza über Click&Boat', 'Alquiler de barcos en Ibiza con Click&Boat', 'Location de bateau à Ibiza via Click&Boat'),

  kicker: L('Onze bootverhuurpartner', 'Our boat rental partner', 'Unser Partner für Bootsvermietung', 'Nuestro socio de alquiler de barcos', 'Notre partenaire location de bateaux'),
  h1: L('Click&Boat op Ibiza', 'Click&Boat in Ibiza', 'Click&Boat auf Ibiza', 'Click&Boat en Ibiza', 'Click&Boat à Ibiza'),
  cta: L('Bekijk beschikbare boten', 'See available boats', 'Verfügbare Boote ansehen', 'Ver barcos disponibles', 'Voir les bateaux disponibles'),
  disclaimer: L(
    'Dit is de pagina van Ibiza Mi Vida over het platform waar onze boten vandaan komen. Het is niet de website van Click&Boat, en wij zíjn Click&Boat niet. Wij verdienen een commissie als je via de links hier boekt; jou kost dat niets extra, en het is de reden dat deze pagina meer tijd besteedt aan wat je moet controleren dan aan waarom je zou boeken.',
    'This is Ibiza Mi Vida’s page about the platform our boats come from. It is not Click&Boat’s own website, and we are not Click&Boat. We earn a commission when you book through the links here; it costs you nothing extra, and it is why the page spends more time on what to check than on why to book.',
    'Das ist die Seite von Ibiza Mi Vida über die Plattform, von der unsere Boote kommen. Es ist nicht die Website von Click&Boat, und wir sind nicht Click&Boat. Wir erhalten eine Provision, wenn du über die Links hier buchst; dich kostet das nichts extra, und deshalb verbringt diese Seite mehr Zeit damit, was du prüfen solltest, als damit, warum du buchen solltest.',
    'Esta es la página de Ibiza Mi Vida sobre la plataforma de la que vienen nuestros barcos. No es la web de Click&Boat, y nosotros no somos Click&Boat. Ganamos una comisión si reservas por los enlaces de aquí; a ti no te cuesta nada más, y es la razón por la que esta página dedica más espacio a lo que hay que comprobar que a por qué reservar.',
    "Ceci est la page d'Ibiza Mi Vida sur la plateforme d'où viennent nos bateaux. Ce n'est pas le site de Click&Boat, et nous ne sommes pas Click&Boat. Nous touchons une commission si vous réservez via les liens ici ; cela ne vous coûte rien de plus, et c'est pourquoi cette page consacre plus de place à ce qu'il faut vérifier qu'aux raisons de réserver.",
  ),
  lead1: {
    nl: LEAD_1_BASIS.nl + leadPrijs('nl'),
    en: LEAD_1_BASIS.en + leadPrijs('en'),
    de: LEAD_1_BASIS.de + leadPrijs('de'),
    es: LEAD_1_BASIS.es + leadPrijs('es'),
    fr: LEAD_1_BASIS.fr + leadPrijs('fr'),
  },
  lead2: L(
    'Begrijp dat ene feit en vrijwel elke verrassing die mensen melden bij het online boeken van een boot houdt op een verrassing te zijn.',
    'Understand that one fact and almost every surprise people report about booking a boat online stops being surprising.',
    'Verstehe dieses eine Faktum, und fast jede Überraschung, von der Leute beim Online-Buchen eines Boots berichten, hört auf, eine zu sein.',
    'Entiende ese único hecho y casi toda sorpresa que la gente cuenta al reservar un barco online deja de serlo.',
    "Comprenez ce seul fait et presque toutes les surprises rapportées lors d'une réservation de bateau en ligne cessent d'en être.",
  ),

  headline: [
    { label: L('Type', 'Type', 'Typ', 'Tipo', 'Type'), value: L('Marktplaats, geen exploitant', 'Marketplace, not operator', 'Marktplatz, kein Betreiber', 'Marketplace, no operador', 'Place de marché, pas opérateur') },
    { label: L('Boten in de etalage', 'Boats listed', 'Gelistete Boote', 'Barcos publicados', 'Bateaux référencés'), value: L('55.000+ over alle markten', '55,000+ across markets', '55.000+ über alle Märkte', '55.000+ en todos sus mercados', '55 000+ tous marchés') },
    { label: L('Brandstof', 'Fuel', 'Kraftstoff', 'Combustible', 'Carburant'), value: L('Vrijwel nooit inbegrepen', 'Almost never included', 'Fast nie enthalten', 'Casi nunca incluido', 'Presque jamais inclus') },
    { label: L('Borg', 'Deposit', 'Kaution', 'Fianza', 'Caution'), value: L('Per boot, door de eigenaar', 'Set per boat, by its owner', 'Je Boot, vom Eigentümer', 'Por barco, la fija el propietario', 'Par bateau, fixée par le propriétaire') },
  ],

  factsHeading: L(
    'Wat per advertentie verschilt, en wat niet',
    'What varies per listing, and what does not',
    'Was je Inserat variiert und was nicht',
    'Lo que varía en cada anuncio y lo que no',
    "Ce qui varie d'une annonce à l'autre, et ce qui ne varie pas",
  ),
  facts: [
    {
      label: L('Wie de boot bezit', 'Who owns the boat', 'Wem das Boot gehört', 'De quién es el barco', 'À qui appartient le bateau'),
      value: L(
        'Een particuliere eigenaar of een chartermaatschappij. Click&Boat verzorgt de boeking en de betaling; de boot, de schipper en de voorwaarden zijn van hen.',
        'An individual owner or a charter company. Click&Boat handles booking and payment; the boat, the skipper and the terms are theirs.',
        'Ein privater Eigentümer oder eine Charterfirma. Click&Boat wickelt Buchung und Zahlung ab; Boot, Skipper und Bedingungen gehören ihnen.',
        'Un propietario particular o una empresa de chárter. Click&Boat gestiona la reserva y el pago; el barco, el patrón y las condiciones son suyos.',
        "Un propriétaire particulier ou une société de charter. Click&Boat gère la réservation et le paiement ; le bateau, le skipper et les conditions sont les leurs.",
      ),
    },
    {
      label: L('Verzekering', 'Insurance', 'Versicherung', 'Seguro', 'Assurance'),
      value: L(
        'Elke boot in de etalage is verzekerd door zijn eigenaar of exploitant — voorwaarde om erop te mogen staan. WA-dekking is standaard; wat verschilt is het eigen risico, en dat is het getal waar je naar vraagt.',
        'Every listed boat is insured by its owner or operator — a condition of being listed. Third-party cover is standard; the excess is what varies, and it is the number to ask for.',
        'Jedes gelistete Boot ist von seinem Eigentümer oder Betreiber versichert — Bedingung für die Listung. Haftpflicht ist Standard; was variiert, ist die Selbstbeteiligung, und das ist die Zahl, nach der du fragst.',
        'Todo barco publicado está asegurado por su propietario u operador — es condición para aparecer. La cobertura a terceros es estándar; lo que varía es la franquicia, y ese es el número que hay que pedir.',
        "Tout bateau référencé est assuré par son propriétaire ou son exploitant — c'est une condition. La responsabilité civile est standard ; ce qui varie, c'est la franchise, et c'est le chiffre à demander.",
      ),
    },
    {
      label: L('Borg', 'Deposit', 'Kaution', 'Fianza', 'Caution'),
      value: L(
        'Geblokkeerd op de creditcard van de hoofdhuurder, vrijgegeven nadat de boot onbeschadigd terug is. Vastgesteld door de eigenaar en geschaald naar de waarde van de boot.',
        'Held on the main renter’s credit card, released after undamaged return. Set by the owner and scaled to the value of the boat.',
        'Auf der Kreditkarte des Hauptmieters geblockt, freigegeben nach unbeschädigter Rückgabe. Vom Eigentümer festgelegt und am Wert des Boots bemessen.',
        'Bloqueada en la tarjeta de crédito del titular, liberada tras devolver el barco sin daños. La fija el propietario y va con el valor del barco.',
        "Bloquée sur la carte de crédit du locataire principal, libérée après un retour sans dommage. Fixée par le propriétaire et proportionnée à la valeur du bateau.",
      ),
    },
    {
      label: L('Brandstof', 'Fuel', 'Kraftstoff', 'Combustible', 'Carburant'),
      value: L(
        'Apart afgerekend op verbruik, in vrijwel alle gevallen. Vol-vol is de norm op het eiland.',
        'Billed separately on consumption, in nearly all cases. Full-to-full is the island norm.',
        'Fast immer separat nach Verbrauch abgerechnet. Voll-zu-voll ist auf der Insel die Norm.',
        'Se paga aparte según consumo, en casi todos los casos. Lleno-lleno es la norma en la isla.',
        "Facturé à part selon la consommation, dans presque tous les cas. Plein-plein est la norme sur l'île.",
      ),
    },
    {
      label: L('Schipper', 'Skipper', 'Skipper', 'Patrón', 'Skipper'),
      value: L(
        'Bij de meeste dagcharters in het tarief inbegrepen; bij sommige een apart dagbedrag. Verplicht op de meeste grotere motorjachten en vrijwel alle catamarans.',
        'Inside the rate on most day charters; a separate flat day fee on some. Required outright on most larger motor yachts and nearly all catamarans.',
        'Bei den meisten Tagescharters im Preis; bei manchen eine separate Tagespauschale. Auf den meisten größeren Motoryachten und fast allen Katamaranen vorgeschrieben.',
        'Incluido en la tarifa en casi todos los chárteres de día; en algunos, una tarifa diaria aparte. Obligatorio en casi todos los yates a motor grandes y en casi todos los catamaranes.',
        "Compris dans le tarif sur la plupart des charters à la journée ; un forfait journalier à part sur certains. Obligatoire sur la plupart des grands yachts à moteur et presque tous les catamarans.",
      ),
    },
    {
      label: L('Maximaal aantal personen', 'Passenger limit', 'Personenzahl', 'Límite de pasajeros', 'Nombre de passagers'),
      value: L(
        'Bepaald door het certificaat van de boot, niet door de ruimte aan dek. Op sommige certificaten telt de schipper mee en op andere niet.',
        'Set by the boat’s certificate, not by deck space. On some certificates the skipper counts towards the total and on others not.',
        'Vom Zertifikat des Boots festgelegt, nicht vom Platz an Deck. Auf manchen Zertifikaten zählt der Skipper mit, auf anderen nicht.',
        'Lo fija el certificado del barco, no el espacio en cubierta. En algunos certificados el patrón cuenta y en otros no.',
        "Défini par le certificat du bateau, pas par la place sur le pont. Sur certains certificats le skipper compte dans le total, sur d'autres non.",
      ),
    },
    {
      label: L('Annulering', 'Cancellation', 'Stornierung', 'Cancelación', 'Annulation'),
      value: L(
        'Weersannuleringen worden beslist door de basis of de schipper en komen met een nieuwe datum of geld terug. De voorwaarden voor je bedenken zijn die van de eigenaar en verschillen per advertentie.',
        'Weather cancellations are decided by the base or skipper and come with a new date or a refund. Terms for changing your mind are the owner’s and differ per listing.',
        'Wetterbedingte Absagen entscheidet die Basis oder der Skipper und kommen mit neuem Termin oder Erstattung. Die Bedingungen fürs Umentscheiden sind die des Eigentümers und je Inserat verschieden.',
        'Las cancelaciones por meteorología las decide la base o el patrón y vienen con nueva fecha o devolución. Las condiciones por cambiar de idea son del propietario y cambian por anuncio.',
        "Les annulations météo sont décidées par la base ou le skipper et donnent une nouvelle date ou un remboursement. Les conditions en cas de changement d'avis sont celles du propriétaire et varient par annonce.",
      ),
    },
    {
      label: L('Boten zonder vaarbewijs', 'Licence-free boats', 'Boote ohne Führerschein', 'Barcos sin titulación', 'Bateaux sans permis'),
      value: L(
        'Beschikbaar, binnen de Spaanse grenzen: maximaal 15 pk, romp onder zes meter, bestuurder 18 of ouder, en een afgesproken vaargebied.',
        'Available, within Spanish limits: maximum 15 hp, hull under six metres, driver 18 or over, and an agreed navigation area.',
        'Verfügbar, innerhalb der spanischen Grenzen: maximal 15 PS, Rumpf unter sechs Metern, Fahrer ab 18, und ein vereinbartes Fahrgebiet.',
        'Disponibles, dentro de los límites españoles: máximo 15 CV, casco de menos de seis metros, conductor de 18 años o más, y una zona de navegación acordada.',
        "Disponibles, dans les limites espagnoles : 15 ch maximum, coque de moins de six mètres, conducteur de 18 ans ou plus, et une zone de navigation convenue.",
      ),
    },
  ],

  stepsHeading: L(
    'Wat wij controleren voordat je betaalt',
    'What we check before you pay',
    'Was wir prüfen, bevor du zahlst',
    'Lo que comprobamos antes de que pagues',
    'Ce que nous vérifions avant que vous payiez',
  ),
  steps: [
    {
      title: L('Dat de boot op jouw datum echt vrij is', 'That the boat is genuinely free on your date', 'Dass das Boot an deinem Datum wirklich frei ist', 'Que el barco está de verdad libre tu día', 'Que le bateau est réellement libre à votre date'),
      body: L(
        'Een agenda op een marktplaats kan achterlopen op de eigen boekingen van de eigenaar, zeker in juli en augustus. Wij bevestigen bij de exploitant en niet bij de advertentie.',
        'A calendar on a marketplace can lag the owner’s own bookings, particularly in July and August. We confirm against the operator rather than against the listing.',
        'Ein Kalender auf einem Marktplatz kann den eigenen Buchungen des Eigentümers hinterherhinken, besonders im Juli und August. Wir bestätigen beim Betreiber, nicht am Inserat.',
        'El calendario de un marketplace puede ir por detrás de las reservas del propio propietario, sobre todo en julio y agosto. Lo confirmamos con el operador, no con el anuncio.',
        "Le calendrier d'une place de marché peut être en retard sur les réservations du propriétaire, surtout en juillet et août. Nous confirmons auprès de l'exploitant, pas de l'annonce.",
      ),
    },
    {
      title: L('Dat het certificaat jullie werkelijke aantal dekt', 'That the certificate covers your real headcount', 'Dass das Zertifikat eure echte Personenzahl abdeckt', 'Que el certificado cubre a todos los que sois', 'Que le certificat couvre votre effectif réel'),
      body: L(
        'Inclusief kinderen, en inclusief de schipper waar dat certificaat hem meetelt. Dit is de meest voorkomende manier waarop een groep bij de steiger een persoon kwijtraakt, en het is een avond eerder volledig te voorkomen.',
        'Including children, and including the skipper where that certificate counts them. This is the single most common way a group loses a person at the pontoon, and it is entirely avoidable an evening earlier.',
        'Kinder eingeschlossen, und den Skipper, wo das Zertifikat ihn mitzählt. Das ist die häufigste Art, wie eine Gruppe am Steg eine Person verliert, und es ist einen Abend früher vollständig vermeidbar.',
        'Incluidos los niños, e incluido el patrón donde ese certificado lo cuenta. Es la forma más habitual de que a un grupo le sobre una persona en el pantalán, y se evita del todo una tarde antes.',
        "Enfants compris, et skipper compris là où le certificat le compte. C'est la façon la plus courante pour un groupe de perdre une personne au ponton, et cela s'évite entièrement la veille.",
      ),
    },
    {
      title: L('De borg, het eigen risico en wat de dekking ongeldig maakt', 'The deposit, the excess and what voids the cover', 'Kaution, Selbstbeteiligung und was die Deckung aushebelt', 'La fianza, la franquicia y qué anula la cobertura', "La caution, la franchise et ce qui annule la couverture"),
      body: L(
        'Drie getallen die niet in de kop van de advertentie staan en die bepalen wat een slechte dag jou kost. Wil een eigenaar ze niet noemen, dan zegt dat op zichzelf al iets.',
        'Three numbers that are not on the listing headline and that decide what a bad day costs you. If an owner will not state them, that tells you something in itself.',
        'Drei Zahlen, die nicht in der Inseratsüberschrift stehen und die bestimmen, was ein schlechter Tag dich kostet. Nennt ein Eigentümer sie nicht, sagt das für sich schon etwas.',
        'Tres números que no salen en el titular del anuncio y que deciden lo que te cuesta un mal día. Si un propietario no los dice, eso ya dice algo.',
        "Trois chiffres absents du titre de l'annonce et qui décident de ce que vous coûte une mauvaise journée. Si un propriétaire refuse de les donner, cela vous renseigne déjà.",
      ),
    },
    {
      title: L('Dat de boot past bij wat je beschreef', 'That the boat matches what you described', 'Dass das Boot zu dem passt, was du beschrieben hast', 'Que el barco encaja con lo que describiste', 'Que le bateau correspond à ce que vous avez décrit'),
      body: L(
        'Een boot van 15 pk zonder vaarbewijs kan niet naar Formentera oversteken, wat de kaart ook suggereert, en een groep van tien past niet op een boot die voor acht gecertificeerd is. Klopt de advertentie die je mooi vond niet bij jouw dag, dan zeggen we dat vóór je betaalt in plaats van erna.',
        'A licence-free 15 hp boat cannot cross to Formentera, whatever the map suggests, and a group of ten does not fit a boat certified for eight. If the listing you liked is wrong for your day, we say so before you pay rather than after.',
        'Ein führerscheinfreies 15-PS-Boot kann nicht nach Formentera übersetzen, was die Karte auch nahelegt, und eine Zehnergruppe passt nicht auf ein für acht zertifiziertes Boot. Passt das Inserat, das dir gefiel, nicht zu deinem Tag, sagen wir das vor der Zahlung statt danach.',
        'Un barco sin titulación de 15 CV no puede cruzar a Formentera, por mucho que lo sugiera el mapa, y un grupo de diez no cabe en un barco certificado para ocho. Si el anuncio que te gustó no encaja con tu día, te lo decimos antes de pagar, no después.',
        "Un bateau sans permis de 15 ch ne peut pas traverser vers Formentera, quoi qu'en dise la carte, et un groupe de dix ne tient pas sur un bateau certifié pour huit. Si l'annonce qui vous plaisait ne convient pas à votre journée, nous le disons avant le paiement, pas après.",
      ),
    },
  ],

  suitsHeading: L('Boek via het platform als', 'Book through the platform if', 'Buche über die Plattform, wenn', 'Reserva por la plataforma si', 'Réservez via la plateforme si'),
  suits: [
    L('Je bereik wilt: tienduizenden advertenties betekent dat er meestal iets vrij is op een datum die volgeboekt lijkt.', 'You want range: tens of thousands of listings means something is usually free on a date that looks fully booked.', 'Du Auswahl willst: Zehntausende Inserate bedeuten, dass an einem scheinbar ausgebuchten Datum meist etwas frei ist.', 'Quieres alcance: decenas de miles de anuncios significa que suele haber algo libre en una fecha que parece llena.', "Vous voulez du choix : des dizaines de milliers d'annonces, donc en général quelque chose de libre à une date qui paraît complète."),
    L('Je boot met boot wilt vergelijken in plaats van te nemen wat één exploitant nog over heeft.', 'You want to compare boat against boat rather than take whatever one operator has left.', 'Du Boot gegen Boot vergleichen willst, statt zu nehmen, was ein Betreiber übrig hat.', 'Quieres comparar barco con barco en vez de quedarte con lo que le sobra a un operador.', "Vous voulez comparer bateau par bateau plutôt que prendre ce qu'il reste chez un seul exploitant."),
    L('Je bereid bent de borg- en annuleringsvoorwaarden van een advertentie echt te lezen, want die zijn van de eigenaar en verschillen.', 'You are happy to read a listing’s deposit and cancellation terms properly, because they are the owner’s and they differ.', 'Du bereit bist, Kautions- und Stornobedingungen eines Inserats wirklich zu lesen, denn sie sind die des Eigentümers und unterscheiden sich.', 'Estás dispuesto a leerte bien las condiciones de fianza y cancelación del anuncio, porque son del propietario y cambian.', "Vous acceptez de lire vraiment les conditions de caution et d'annulation d'une annonce, car elles sont celles du propriétaire et varient."),
    L('Je de betaling liever via een platform laat lopen dan via een overboeking naar iemand die je op Instagram vond.', 'You want the payment handled by a platform rather than by a bank transfer to somebody you found on Instagram.', 'Du die Zahlung lieber über eine Plattform abwickelst als per Überweisung an jemanden, den du auf Instagram gefunden hast.', 'Prefieres que el pago pase por una plataforma y no por una transferencia a alguien que encontraste en Instagram.', "Vous préférez que le paiement passe par une plateforme plutôt que par un virement à quelqu'un trouvé sur Instagram."),
  ],
  notSuitsHeading: L('Wees voorzichtig als', 'Be careful if', 'Sei vorsichtig, wenn', 'Ten cuidado si', 'Soyez prudent si'),
  notSuits: [
    L('Je aanneemt dat de prijs het totaal is. Brandstof komt er vrijwel overal bij, en op een snelle boot is dat geen afrondingsverschil.', 'You are assuming the price is the total. Fuel is extra almost everywhere, and on a fast boat it is not a rounding error.', 'Du annimmst, der Preis sei die Summe. Kraftstoff kommt fast überall dazu, und auf einem schnellen Boot ist das kein Rundungsfehler.', 'Das por hecho que el precio es el total. El combustible es aparte casi siempre, y en un barco rápido no es un redondeo.', "Vous supposez que le prix est le total. Le carburant est en supplément presque partout, et sur un bateau rapide ce n'est pas une erreur d'arrondi."),
    L('Je boekt op de hoofdfoto. Het certificaat, het eigen risico en de borg bepalen de dag.', 'You are booking on the headline photo. The certificate, the excess and the deposit are what shape the day.', 'Du nach dem Titelfoto buchst. Zertifikat, Selbstbeteiligung und Kaution prägen den Tag.', 'Reservas por la foto principal. El certificado, la franquicia y la fianza son lo que da forma al día.', "Vous réservez sur la photo principale. Le certificat, la franchise et la caution façonnent la journée."),
    L('Niemand in het gezelschap een creditcard heeft voor de borg. Debit wordt bij de meeste bases geweigerd.', 'Nobody in the party has a credit card for the deposit. Debit is refused at most bases.', 'Niemand in der Gruppe eine Kreditkarte für die Kaution hat. Debitkarten werden an den meisten Basen abgelehnt.', 'Nadie del grupo tiene tarjeta de crédito para la fianza. La de débito se rechaza en casi todas las bases.', "Personne dans le groupe n'a de carte de crédit pour la caution. La carte de débit est refusée dans la plupart des bases."),
    L('Je één getal voor alles wilt. Op een marktplaats zijn de voorwaarden per advertentie — dat is de prijs van de keuze.', 'You want one number for everything. On a marketplace, terms are per listing — that is the trade-off for the choice.', 'Du eine Zahl für alles willst. Auf einem Marktplatz gelten die Bedingungen je Inserat — das ist der Preis der Auswahl.', 'Quieres un único número para todo. En un marketplace las condiciones son por anuncio — ese es el precio de poder elegir.', "Vous voulez un seul chiffre pour tout. Sur une place de marché, les conditions sont par annonce — c'est le prix du choix."),
  ],

  verdictHeading: L('Onze eerlijke lezing', 'Our honest read', 'Unsere ehrliche Einschätzung', 'Nuestra lectura honesta', 'Notre lecture honnête'),
  verdict: [
    L(
      'Click&Boat is de reden dat wij op een zaterdag in augustus meestal nog iets vinden wanneer één exploitant vol zit. Dat bereik is het hele argument voor een marktplaats, en het is een echt argument.',
      'Click&Boat is the reason we can usually find something on a Saturday in August when a single operator is full. That range is the whole argument for a marketplace, and it is a real one.',
      'Click&Boat ist der Grund, warum wir an einem Samstag im August meist noch etwas finden, wenn ein einzelner Betreiber voll ist. Diese Auswahl ist das ganze Argument für einen Marktplatz, und es ist ein echtes.',
      'Click&Boat es la razón por la que solemos encontrar algo un sábado de agosto cuando un solo operador está lleno. Ese alcance es todo el argumento a favor de un marketplace, y es un argumento real.',
      "Click&Boat est la raison pour laquelle nous trouvons généralement quelque chose un samedi d'août quand un seul exploitant est complet. Ce choix est tout l'argument en faveur d'une place de marché, et c'en est un vrai.",
    ),
    L(
      'De prijs van dat bereik is dat niets standaard is. Twee vergelijkbare boten kunnen verschillen in borg, in eigen risico, in of de schipper in de prijs zit en in wat er gebeurt als je annuleert — en niets daarvan is te zien op de foto in de advertentie. Wie een slechte ervaring meldt met een online bootboeking, op welk platform dan ook, is vrijwel altijd tegen een van die vier aangelopen.',
      'The cost of that range is that nothing is standard. Two similar boats can differ in deposit, in excess, in whether the skipper is in the price and in what happens if you cancel — and none of that is visible from the listing photo. People who report a bad experience with an online boat booking, on any platform, have almost always hit one of those four.',
      'Der Preis dieser Auswahl ist, dass nichts standardisiert ist. Zwei ähnliche Boote können sich in Kaution, Selbstbeteiligung, ob der Skipper im Preis ist und was bei einer Stornierung passiert unterscheiden — und nichts davon sieht man auf dem Inseratsfoto. Wer von einer schlechten Erfahrung mit einer Online-Bootsbuchung berichtet, auf welcher Plattform auch immer, ist fast immer über eines dieser vier gestolpert.',
      'El precio de ese alcance es que nada es estándar. Dos barcos parecidos pueden diferir en fianza, en franquicia, en si el patrón va incluido y en qué pasa si cancelas — y nada de eso se ve en la foto del anuncio. Quien cuenta una mala experiencia reservando un barco online, en cualquier plataforma, casi siempre ha chocado con una de esas cuatro cosas.',
      "Le prix de ce choix, c'est que rien n'est standard. Deux bateaux similaires peuvent différer par la caution, la franchise, la présence du skipper dans le prix et ce qui se passe en cas d'annulation — et rien de tout cela n'apparaît sur la photo. Ceux qui racontent une mauvaise expérience de réservation en ligne, sur n'importe quelle plateforme, ont presque toujours buté sur l'un de ces quatre points.",
    ),
    L(
      'Boek het dus, en lees de specifieke advertentie in plaats van het platform. Heb je geen zin om daar een avond aan te besteden: dat is precies het deel dat wij doen. Stuur de datum, de groep en ruwweg hoe je dag eruit moet zien, en wij komen terug met de boten die écht werken.',
      'So book it, and read the specific listing rather than the platform. If you would rather not spend the evening doing that, it is the part we do: send the date, the group and roughly what you want the day to look like, and we come back with the boats that actually work.',
      'Also buche es, und lies das konkrete Inserat statt der Plattform. Wenn du dafür keinen Abend opfern willst: genau das übernehmen wir. Schick Datum, Gruppe und ungefähr, wie dein Tag aussehen soll, und wir melden uns mit den Booten, die wirklich passen.',
      'Así que resérvalo, y lee el anuncio concreto en vez de la plataforma. Si prefieres no dedicarle una tarde, esa es justo la parte que hacemos nosotros: manda la fecha, el grupo y más o menos cómo quieres que sea el día, y volvemos con los barcos que de verdad encajan.',
      "Réservez donc, et lisez l'annonce précise plutôt que la plateforme. Si vous préférez ne pas y passer une soirée, c'est justement notre part du travail : envoyez la date, le groupe et à peu près la journée souhaitée, et nous revenons avec les bateaux qui conviennent vraiment.",
    ),
  ],

  faqs: [
    {
      q: L('Is Click&Boat betrouwbaar?', 'Is Click&Boat legitimate?', 'Ist Click&Boat seriös?', '¿Click&Boat es de fiar?', 'Click&Boat est-il fiable ?'),
      a: L(
        'Ja, en het nuttige detail is wát voor bedrijf het is: een marktplaats, de grootste van Europa voor bootverhuur, met meer dan 55.000 boten over alle markten. Ze bezitten de boten niet. Eigenaren en chartermaatschappijen zetten ze erop, en het platform verzorgt de boeking en de betaling. Door die structuur verschillen de boten zo sterk per advertentie — en zijn de vragen die ertoe doen vragen over de specifieke boot, niet over het platform.',
        'Yes, and the useful detail is what kind of company it is: a marketplace, Europe’s largest for boat rental, with more than 55,000 boats listed across its markets. It does not own the boats. Owners and charter companies list them, and the platform handles the booking and the payment. That structure is why the boats vary so much between listings — and why the questions worth asking are about the specific boat, not about the platform.',
        'Ja, und das nützliche Detail ist, was für ein Unternehmen es ist: ein Marktplatz, Europas größter für Bootsvermietung, mit über 55.000 Booten über alle Märkte. Die Boote gehören ihnen nicht. Eigentümer und Charterfirmen stellen sie ein, und die Plattform wickelt Buchung und Zahlung ab. Wegen dieser Struktur unterscheiden sich die Boote je Inserat so stark — und deshalb sind die relevanten Fragen Fragen zum konkreten Boot, nicht zur Plattform.',
        'Sí, y el detalle útil es qué tipo de empresa es: un marketplace, el mayor de Europa en alquiler de barcos, con más de 55.000 barcos en todos sus mercados. No son dueños de los barcos. Los publican propietarios y empresas de chárter, y la plataforma gestiona la reserva y el pago. Por esa estructura los barcos varían tanto entre anuncios — y por eso las preguntas que importan son sobre el barco concreto, no sobre la plataforma.',
        "Oui, et le détail utile est de savoir quel type d'entreprise c'est : une place de marché, la plus grande d'Europe pour la location de bateaux, avec plus de 55 000 bateaux tous marchés confondus. Elle ne possède pas les bateaux. Des propriétaires et des sociétés de charter les listent, et la plateforme gère la réservation et le paiement. C'est cette structure qui explique que les bateaux varient tant d'une annonce à l'autre — et pourquoi les bonnes questions portent sur le bateau précis, pas sur la plateforme.",
      ),
    },
    {
      q: L('Waarom verschilt de prijs zo sterk tussen vergelijkbare boten?', 'Why does the price change so much between similar boats?', 'Warum unterscheidet sich der Preis bei ähnlichen Booten so stark?', '¿Por qué cambia tanto el precio entre barcos parecidos?', 'Pourquoi le prix varie-t-il autant entre bateaux similaires ?'),
      a: L(
        'Omdat elke advertentie door zijn eigenaar wordt geprijsd en niet door een centrale tarievenlijst. Twee motorboten van twaalf meter uit dezelfde haven in hetzelfde weekend kunnen flink verschillen, en het gat wordt meestal verklaard door het bouwjaar, de draaiuren, of er een schipper in het tarief zit, en hoe vol de eigenaar al zit. Het is een marktplaats, dus de spreiding is echt en geen fout.',
        'Because each listing is priced by its owner, not by a central rate card. Two twelve-metre motorboats from the same marina on the same weekend can differ substantially, and the gap is usually explained by the year, the engine hours, whether a skipper is in the rate, and how booked the owner already is. It is a marketplace, so the spread is real rather than a mistake.',
        'Weil jedes Inserat von seinem Eigentümer bepreist wird, nicht von einer zentralen Preisliste. Zwei Zwölf-Meter-Motorboote aus derselben Marina am selben Wochenende können sich deutlich unterscheiden, und der Abstand erklärt sich meist über Baujahr, Motorstunden, ob ein Skipper im Preis ist und wie ausgebucht der Eigentümer schon ist. Es ist ein Marktplatz, die Spanne ist also echt und kein Fehler.',
        'Porque cada anuncio lo fija su propietario, no una tarifa central. Dos barcos a motor de doce metros del mismo puerto el mismo fin de semana pueden diferir bastante, y la diferencia suele explicarse por el año, las horas de motor, si el patrón va en la tarifa y lo lleno que ya esté el propietario. Es un marketplace, así que la horquilla es real y no un error.',
        "Parce que chaque annonce est tarifée par son propriétaire, pas par une grille centrale. Deux bateaux à moteur de douze mètres du même port le même week-end peuvent différer nettement, et l'écart s'explique généralement par l'année, les heures moteur, la présence du skipper dans le tarif et le taux de remplissage du propriétaire. C'est une place de marché : l'écart est réel, pas une erreur.",
      ),
    },
    {
      q: L('Is brandstof inbegrepen?', 'Is fuel included?', 'Ist Kraftstoff enthalten?', '¿El combustible está incluido?', 'Le carburant est-il inclus ?'),
      a: L(
        'Vrijwel nooit, op geen enkel platform, en dit is veruit de grootste bron van verrassing op de eindafrekening. De norm op het eiland is vol-vol, of verbruik afrekenen aan het eind. Wat je verstookt hangt veel meer af van hoe je vaart dan van hoe ver je gaat: een dag voor anker kost bijna niets, en een snelle run naar Formentera en terug kost veel. Vraag naar de tankinhoud en het verbruik als je het goed wilt begroten.',
        'Almost never, on any platform, and this is the single biggest source of surprise on the final bill. The island standard is full-to-full, or consumption settled at the end. What you burn depends far more on how you drive than how far you go: a day at anchor costs almost nothing, and a fast run to Formentera and back costs a lot. Ask for the tank size and the consumption if you want to budget it properly.',
        'Fast nie, auf keiner Plattform, und das ist die mit Abstand größte Überraschungsquelle auf der Endabrechnung. Inselstandard ist voll-zu-voll oder Verbrauchsabrechnung am Ende. Was du verbrauchst, hängt weit mehr davon ab, wie du fährst, als wie weit: ein Tag vor Anker kostet fast nichts, eine schnelle Fahrt nach Formentera und zurück viel. Frag nach Tankgröße und Verbrauch, wenn du es sauber kalkulieren willst.',
        'Casi nunca, en ninguna plataforma, y es con diferencia la mayor fuente de sorpresas en la factura final. El estándar en la isla es lleno-lleno, o liquidar el consumo al final. Lo que gastas depende mucho más de cómo navegas que de cuánto recorres: un día fondeado no cuesta casi nada, y una carrera rápida a Formentera y vuelta cuesta mucho. Pregunta el tamaño del depósito y el consumo si quieres presupuestarlo bien.',
        "Presque jamais, sur aucune plateforme, et c'est de loin la première source de surprise sur la facture finale. La norme sur l'île est plein-plein, ou la consommation réglée à la fin. Ce que vous brûlez dépend bien plus de votre façon de naviguer que de la distance : une journée au mouillage ne coûte presque rien, un aller-retour rapide vers Formentera coûte cher. Demandez la taille du réservoir et la consommation si vous voulez budgéter correctement.",
      ),
    },
    {
      q: L('Hoe werkt de borg?', 'How does the deposit work?', 'Wie funktioniert die Kaution?', '¿Cómo funciona la fianza?', 'Comment fonctionne la caution ?'),
      a: L(
        'Hij wordt geblokkeerd op de creditcard van de hoofdhuurder en vrijgegeven nadat de boot onbeschadigd terug is, meestal binnen een paar dagen. Het bedrag wordt door de eigenaar bepaald en schaalt mee met de waarde van de boot, dus een zesmeter zonder vaarbewijs en een motorjacht van twaalf meter zitten bij lange na niet in dezelfde orde. Je hoort het bedrag voordat je iets betaalt — en zo niet, dan is dat precies de vraag die je stelt.',
        'It is held on the main renter’s credit card and released after the boat comes back undamaged, usually within a few days. The amount is set by the owner and scales with the value of the boat, so a licence-free six-metre and a twelve-metre motor yacht are not remotely in the same range. You are told the figure before you pay anything — if you are not, that is the question to ask.',
        'Sie wird auf der Kreditkarte des Hauptmieters geblockt und freigegeben, nachdem das Boot unbeschädigt zurück ist, meist binnen weniger Tage. Die Höhe legt der Eigentümer fest und sie bemisst sich am Wert des Boots, ein führerscheinfreier Sechsmeter und eine Zwölf-Meter-Motoryacht liegen also weit auseinander. Du erfährst die Zahl, bevor du etwas zahlst — und wenn nicht, ist genau das die Frage.',
        'Se bloquea en la tarjeta de crédito del titular y se libera cuando el barco vuelve sin daños, normalmente en unos días. El importe lo fija el propietario y va con el valor del barco, así que un seis metros sin titulación y un yate a motor de doce no están ni de lejos en el mismo rango. Te dicen la cifra antes de pagar nada — y si no, esa es justo la pregunta.',
        "Elle est bloquée sur la carte de crédit du locataire principal et libérée après un retour sans dommage, généralement en quelques jours. Le montant est fixé par le propriétaire et proportionné à la valeur du bateau : un six mètres sans permis et un yacht à moteur de douze mètres ne sont pas du tout dans le même ordre. On vous donne le chiffre avant tout paiement — sinon, c'est précisément la question à poser.",
      ),
    },
    {
      q: L('Wat als het weer mijn dag afzegt?', 'What if the weather cancels my day?', 'Was, wenn das Wetter meinen Tag absagt?', '¿Y si el tiempo cancela mi día?', 'Et si la météo annule ma journée ?'),
      a: L(
        'De beslissing ligt bij de basis of de schipper, niet bij jou, en een weersannulering komt met een nieuwe datum of geld terug. De voorwaarden voor gewoon van gedachten veranderen verschillen per advertentie, want het zijn de voorwaarden van de eigenaar — en precies daarom lezen wij ze voor de specifieke boot voordat je je vastlegt, in plaats van een algemeen beleid te citeren.',
        'The call belongs to the base or the skipper, not to you, and a weather cancellation comes with a new date or a refund. Terms for simply changing your mind vary per listing, because they are the owner’s terms — which is exactly why we read them for the specific boat before you commit rather than quoting a general policy.',
        'Die Entscheidung liegt bei der Basis oder dem Skipper, nicht bei dir, und eine wetterbedingte Absage kommt mit neuem Termin oder Erstattung. Die Bedingungen fürs bloße Umentscheiden sind je Inserat verschieden, denn es sind die des Eigentümers — genau deshalb lesen wir sie für das konkrete Boot, bevor du dich festlegst, statt eine allgemeine Regel zu zitieren.',
        'La decisión es de la base o del patrón, no tuya, y una cancelación por meteorología viene con nueva fecha o devolución. Las condiciones por simplemente cambiar de idea varían según el anuncio, porque son del propietario — y por eso las leemos para el barco concreto antes de que te comprometas, en vez de citar una política general.',
        "La décision revient à la base ou au skipper, pas à vous, et une annulation météo donne une nouvelle date ou un remboursement. Les conditions en cas de simple changement d'avis varient par annonce, car ce sont celles du propriétaire — c'est exactement pourquoi nous les lisons pour le bateau précis avant que vous ne vous engagiez, plutôt que de citer une règle générale.",
      ),
    },
    {
      q: L('Waarom via jullie boeken in plaats van rechtstreeks?', 'Why book through you instead of the platform directly?', 'Warum über euch buchen statt direkt?', '¿Por qué reservar con vosotros y no directamente?', 'Pourquoi réserver via vous plutôt qu’en direct ?'),
      a: L(
        'Je kunt rechtstreeks boeken, en voor een rechttoe rechtaan dagje uit komt dat goed. Wat wij toevoegen is de filtering: je datum, groepsgrootte en taal leggen naast de boten die echt vrij zijn, controleren of het certificaat jullie werkelijke aantal dekt, en de borg- en annuleringsvoorwaarden van díé advertentie lezen voordat je betaalt. Op een platform met tienduizenden advertenties is dat het deel dat je een avond kost als je het zelf doet.',
        'You can book directly, and for a straightforward day out you will be fine. What we add is the filtering: matching your date, group size and language against the boats genuinely free, checking that the certificate covers your actual headcount, and reading that listing’s deposit and cancellation terms before you pay. On a platform with tens of thousands of listings, that is the part that takes an evening if you do it yourself.',
        'Du kannst direkt buchen, und für einen unkomplizierten Tag geht das gut. Was wir hinzufügen, ist die Filterung: dein Datum, die Gruppengröße und die Sprache gegen die wirklich freien Boote abgleichen, prüfen, ob das Zertifikat eure echte Personenzahl abdeckt, und die Kautions- und Stornobedingungen dieses Inserats lesen, bevor du zahlst. Auf einer Plattform mit Zehntausenden Inseraten ist das der Teil, der dich einen Abend kostet, wenn du ihn selbst machst.',
        'Puedes reservar directamente, y para un día sencillo irá bien. Lo que añadimos es el filtrado: cruzar tu fecha, el tamaño del grupo y el idioma con los barcos realmente libres, comprobar que el certificado cubre a todos los que sois, y leer las condiciones de fianza y cancelación de ese anuncio antes de que pagues. En una plataforma con decenas de miles de anuncios, esa es la parte que te lleva una tarde si la haces tú.',
        "Vous pouvez réserver en direct, et pour une journée simple cela ira très bien. Ce que nous ajoutons, c'est le filtrage : croiser votre date, la taille du groupe et la langue avec les bateaux réellement libres, vérifier que le certificat couvre votre effectif réel, et lire les conditions de caution et d'annulation de cette annonce avant que vous payiez. Sur une plateforme comptant des dizaines de milliers d'annonces, c'est la partie qui vous prend une soirée si vous la faites vous-même.",
      ),
    },
  ],

  linksHeading: L('Gerelateerde pagina’s', 'Related pages', 'Verwandte Seiten', 'Páginas relacionadas', 'Pages liées'),
  links: [
    {
      key: 'boats', localized: false,
      label: L('Bootverhuur op Ibiza', 'Boat rental in Ibiza', 'Bootsvermietung auf Ibiza', 'Alquiler de barcos en Ibiza', 'Location de bateau à Ibiza'),
      body: L('Het hele plaatje: drie manieren het water op, vier havens en de routes.', 'The full picture: three ways onto the water, four marinas and the routes.', 'Das ganze Bild: drei Wege aufs Wasser, vier Marinas und die Routen.', 'El cuadro completo: tres formas de salir al agua, cuatro puertos y las rutas.', "Le tableau complet : trois façons de prendre la mer, quatre ports et les itinéraires."),
    },
    {
      key: 'boat-no-licence', localized: true,
      label: L('Boot huren zonder vaarbewijs', 'Boat hire without a licence', 'Boot mieten ohne Führerschein', 'Alquilar barco sin titulación', 'Louer un bateau sans permis'),
      body: L('De 15 pk-categorie en de vier wettelijke voorwaarden erop.', 'The 15 hp category and the four legal conditions on it.', 'Die 15-PS-Kategorie und die vier gesetzlichen Bedingungen.', 'La categoría de 15 CV y las cuatro condiciones legales.', "La catégorie 15 ch et les quatre conditions légales."),
    },
    {
      key: 'wiber-partner', localized: true,
      label: L('Wiber, onze autopartner', 'Wiber, our car partner', 'Wiber, unser Autopartner', 'Wiber, nuestro socio de coches', 'Wiber, notre partenaire voiture'),
      body: L('Dezelfde behandeling voor het bedrijf achter onze autohuur.', 'The same treatment for the company behind our car hire.', 'Dieselbe Behandlung für das Unternehmen hinter unserer Autovermietung.', 'El mismo tratamiento para la empresa detrás de nuestro alquiler de coches.', "Le même traitement pour la société derrière notre location de voitures."),
    },
  ],
  bylineTopic: L(
    'boten boeken op Ibiza via Click&Boat',
    'booking boats in Ibiza through Click&Boat',
    'Boote auf Ibiza über Click&Boat buchen',
    'reservar barcos en Ibiza con Click&Boat',
    'la réservation de bateaux à Ibiza via Click&Boat',
  ),

  productName: L(
    'Bootverhuur op Ibiza via Click&Boat',
    'Boat rental in Ibiza through Click&Boat',
    'Bootsvermietung auf Ibiza über Click&Boat',
    'Alquiler de barcos en Ibiza con Click&Boat',
    'Location de bateau à Ibiza via Click&Boat',
  ),
  productDescription: L(
    'Bootverhuur op Ibiza via Click&Boat, de grootste bootverhuurmarktplaats van Europa, met schipper, met je eigen vaarbewijs, of zonder vaarbewijs tot 15 pk.',
    'Boat rental in Ibiza through Click&Boat, Europe’s largest boat rental marketplace, with a skipper, your own licence, or licence-free up to 15 hp.',
    'Bootsvermietung auf Ibiza über Click&Boat, Europas größten Bootsvermietungs-Marktplatz, mit Skipper, mit eigenem Führerschein oder führerscheinfrei bis 15 PS.',
    'Alquiler de barcos en Ibiza con Click&Boat, el mayor marketplace de alquiler de barcos de Europa, con patrón, con tu propia titulación o sin titulación hasta 15 CV.',
    "Location de bateau à Ibiza via Click&Boat, la plus grande place de marché européenne, avec skipper, avec votre permis, ou sans permis jusqu'à 15 ch.",
  ),
  productBrand: 'Click&Boat',
  price: skipper,
}
