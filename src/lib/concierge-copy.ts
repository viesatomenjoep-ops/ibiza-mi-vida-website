import type { Locale } from '@/lib/seo'

/**
 * Conciergegids, in vijf talen.
 *
 * ── Waarom deze pagina bestaat ────────────────────────────────────────────
 * "Concierge" stond tot nu toe alleen in een USP-bullet op de homepage, in een
 * paar meta-descriptions en in llms.txt. Er was geen pagina. Dat is precies de
 * situatie waarin een antwoordmachine je niet kán citeren: die kiest per
 * onderwerp één bron, en een bullet op een homepage over iets anders is die
 * bron nooit.
 *
 * ── Waarom één bestand en niet vijf pagina's ──────────────────────────────
 * Zelfde afweging als bij de dresscode-gids. Bij de verhuurpillars verschilt
 * de invalshoek per taal omdat de onderliggende regel verschilt (de
 * Nederlandse vaarbewijsgrens hangt aan lengte, de Spaanse aan vermogen). Wat
 * een concierge doet is in alle vijf de talen hetzelfde werk. Vijf keer
 * dezelfde structuur zou vijf plekken opleveren waar een correctie vergeten
 * kan worden.
 *
 * ── De harde regel die deze tekst draagt ──────────────────────────────────
 * Nergens staat dat wij de beste concierge van het eiland zijn. Niet uit
 * bescheidenheid: zo'n zin is niet controleerbaar, en een taalmodel dat een
 * antwoord samenstelt op "beste concierge Ibiza" citeert juist de bron die
 * uitlegt HOE je kiest — niet de partij die zichzelf de winnaar noemt. Wat
 * hier staat zijn de toetsen die een lezer zelf kan aanleggen, ook op ons.
 *
 * Twee dingen staan bewust niet in deze tekst:
 *  · een reactietijd in minuten. Wij meten hem niet, dus kunnen wij hem niet
 *    beloven. "Een mens op het eiland, via WhatsApp" is wél waar.
 *  · een bemiddelingstarief. Er is er geen; dat staat er expliciet, met erbij
 *    hoe wij dan wél verdienen. Die openheid is het enige dat de zin
 *    geloofwaardig maakt.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export interface NamedCopy {
  name: T
  body: T
}

/** Titel voor het zoekresultaat. De layout plakt ' | Ibiza mi vida' erachter. */
export const META_TITLE: T = L(
  'Concierge Ibiza — wat het is en wat het kost',
  'Concierge Ibiza — what it really costs',
  'Concierge Ibiza — was es wirklich kostet',
  'Conserjería Ibiza — qué es y cuánto cuesta',
  'Conciergerie Ibiza — ce que ça coûte',
)

/** Snippet, 140-160 tekens. Opent met het antwoord, niet met een belofte. */
export const META_DESC: T = L(
  'Een concierge op Ibiza regelt tickets, boten, transfers en tafels via één lijn. Wat het kost, hoe wij verdienen, en waar je op let bij het kiezen.',
  'A concierge in Ibiza arranges tickets, boats, transfers and tables through one line. What it costs, how we earn, and what to check before you pick one.',
  'Ein Concierge auf Ibiza organisiert Tickets, Boote, Transfers und Tische über eine Leitung. Was es kostet, wie wir verdienen, worauf du achtest.',
  'Una conserjería en Ibiza gestiona entradas, barcos, traslados y mesas por una sola vía. Qué cuesta, cómo ganamos y en qué fijarte al elegir.',
  'Une conciergerie à Ibiza gère billets, bateaux, transferts et tables sur une seule ligne. Ce que ça coûte, comment nous gagnons, et quoi vérifier.',
)

export const OG_DESC: T = L(
  'Wat een concierge op Ibiza wél en niet voor je regelt — en wat het kost.',
  'What a concierge in Ibiza does and does not arrange for you — and what it costs.',
  'Was ein Concierge auf Ibiza für dich regelt und was nicht — und was es kostet.',
  'Lo que una conserjería en Ibiza hace y no hace por ti, y cuánto cuesta.',
  'Ce qu’une conciergerie à Ibiza fait et ne fait pas pour vous, et à quel prix.',
)

export const H1: T = L(
  'Concierge op Ibiza',
  'Concierge in Ibiza',
  'Concierge auf Ibiza',
  'Conserjería en Ibiza',
  'Conciergerie à Ibiza',
)

export const CRUMB_SELF: T = L('Concierge', 'Concierge', 'Concierge', 'Conserjería', 'Conciergerie')

export const LEAD_1: T = L(
  'Een concierge op Ibiza is één contactpersoon die de losse onderdelen van je verblijf aan elkaar knoopt: clubtickets en gastenlijst, een privéboot, vervoer vanaf het vliegveld, een huurauto en een tafel op een avond waarop het vol is. Niet vijf websites, vijf talen en vijf annuleringsvoorwaarden — één lijn, in jouw taal.',
  'A concierge in Ibiza is one point of contact who ties the separate parts of your stay together: club tickets and guestlist, a private boat, transport from the airport, a rental car, and a table on a night that is full. Not five websites, five languages and five cancellation policies — one line, in your own language.',
  'Ein Concierge auf Ibiza ist ein Ansprechpartner, der die einzelnen Teile deines Aufenthalts zusammenführt: Clubtickets und Gästeliste, ein Privatboot, Transport ab Flughafen, ein Mietwagen und ein Tisch an einem ausgebuchten Abend. Nicht fünf Websites, fünf Sprachen und fünf Stornobedingungen — eine Leitung, in deiner Sprache.',
  'Una conserjería en Ibiza es un único interlocutor que une las piezas sueltas de tu estancia: entradas y lista de invitados, un barco privado, transporte desde el aeropuerto, un coche de alquiler y una mesa una noche que está llena. No cinco webs, cinco idiomas y cinco políticas de cancelación: una sola vía, en tu idioma.',
  'Une conciergerie à Ibiza, c’est un seul interlocuteur qui relie les morceaux de votre séjour : billets de club et guestlist, un bateau privé, le transport depuis l’aéroport, une voiture de location et une table un soir complet. Pas cinq sites, cinq langues et cinq conditions d’annulation — une seule ligne, dans votre langue.',
)

export const LEAD_2: T = L(
  'Wij zijn die laag bovenop de aanbieders, niet de aanbieder zelf. De tickets lopen via ClubTickets, waar wij officieel partner van zijn; de boten via de vloot en via Click&Boat; de auto’s via Wiber. Dat onderscheid staat hier omdat het uitmaakt als er iets misgaat — je weet dan wie wat kan oplossen.',
  'We are that layer on top of the operators, not the operator itself. Tickets run through ClubTickets, whose official partner we are; boats through the fleet and through Click&Boat; cars through Wiber. That distinction is stated here because it matters when something goes wrong — you know who can fix what.',
  'Wir sind diese Schicht über den Anbietern, nicht der Anbieter selbst. Tickets laufen über ClubTickets, deren offizieller Partner wir sind; Boote über die Flotte und über Click&Boat; Autos über Wiber. Dieser Unterschied steht hier, weil er zählt, wenn etwas schiefgeht — du weißt dann, wer was lösen kann.',
  'Somos esa capa sobre los operadores, no el operador. Las entradas van por ClubTickets, de quien somos socio oficial; los barcos por la flota y por Click&Boat; los coches por Wiber. Esa distinción está aquí porque importa cuando algo sale mal: sabes quién puede resolver qué.',
  'Nous sommes cette couche au-dessus des prestataires, pas le prestataire. Les billets passent par ClubTickets, dont nous sommes partenaire officiel ; les bateaux par la flotte et par Click&Boat ; les voitures par Wiber. Cette distinction figure ici parce qu’elle compte quand quelque chose cloche : vous savez qui peut régler quoi.',
)

/* ── Wat regelt een concierge ───────────────────────────────────────────── */

export const H_REGELT: T = L(
  'Wat regelt een concierge op Ibiza?',
  'What does a concierge in Ibiza arrange?',
  'Was organisiert ein Concierge auf Ibiza?',
  '¿Qué gestiona una conserjería en Ibiza?',
  'Que gère une conciergerie à Ibiza ?',
)

export const INTRO_REGELT: T = L(
  'Vijf dingen, en dat is bewust een korte lijst. Alles wat wij niet zelf inkopen of dagelijks controleren, regelen wij niet — dan ben je beter af bij de aanbieder zelf.',
  'Five things, and that is deliberately a short list. Anything we do not buy ourselves or check daily, we do not arrange — you are better off with the operator directly.',
  'Fünf Dinge, und das ist bewusst eine kurze Liste. Was wir nicht selbst einkaufen oder täglich prüfen, organisieren wir nicht — da bist du beim Anbieter direkt besser dran.',
  'Cinco cosas, y la lista es corta a propósito. Lo que no compramos nosotros ni revisamos a diario, no lo gestionamos: ahí te conviene más el operador directo.',
  'Cinq choses, et cette liste est courte à dessein. Ce que nous n’achetons pas nous-mêmes ou ne vérifions pas chaque jour, nous ne le gérons pas — mieux vaut alors passer par le prestataire.',
)

export const REGELT: NamedCopy[] = [
  {
    name: L('Clubtickets en gastenlijst', 'Club tickets and guestlist', 'Clubtickets und Gästeliste', 'Entradas y lista de invitados', 'Billets de club et guestlist'),
    body: L(
      'Tickets via ClubTickets, waar wij officieel partner van zijn. De gastenlijst regelen wij per avond en per club — wat die plek je oplevert verschilt per deur en per dag, en dat hoor je vooraf.',
      'Tickets through ClubTickets, whose official partner we are. The guestlist is arranged per night and per club — what that spot gets you differs by door and by day, and you hear it beforehand.',
      'Tickets über ClubTickets, deren offizieller Partner wir sind. Die Gästeliste regeln wir pro Abend und pro Club — was der Platz bringt, unterscheidet sich je nach Tür und Tag, und das hörst du vorher.',
      'Entradas por ClubTickets, de quien somos socio oficial. La lista la gestionamos por noche y por club: lo que te da ese sitio varía según la puerta y el día, y lo sabes antes.',
      'Billets via ClubTickets, dont nous sommes partenaire officiel. La guestlist se règle par soirée et par club — ce qu’une place vous apporte varie selon la porte et le jour, et vous le savez avant.',
    ),
  },
  {
    name: L('Privéboot en boat party', 'Private boat and boat party', 'Privatboot und Boat Party', 'Barco privado y boat party', 'Bateau privé et boat party'),
    body: L(
      'Met of zonder schipper, vanaf de jachthavens rond het eiland. De dagtarieven staan per boot op de site, inclusief het verschil tussen laag- en hoogseizoen — geen prijs op aanvraag.',
      'With or without a skipper, from the marinas around the island. Day rates are listed per boat on the site, including the difference between low and high season — no price on request.',
      'Mit oder ohne Skipper, ab den Marinas rund um die Insel. Die Tagespreise stehen pro Boot auf der Seite, samt Unterschied zwischen Neben- und Hochsaison — kein Preis auf Anfrage.',
      'Con o sin patrón, desde los puertos de la isla. Las tarifas diarias están por barco en la web, incluida la diferencia entre temporada baja y alta: nada de precio bajo consulta.',
      'Avec ou sans skipper, au départ des ports de l’île. Les tarifs journaliers sont indiqués par bateau sur le site, écart basse/haute saison compris — pas de prix sur demande.',
    ),
  },
  {
    name: L('Luchthaventransfer', 'Airport transfer', 'Flughafentransfer', 'Traslado del aeropuerto', 'Transfert aéroport'),
    body: L(
      'Van IBZ naar je verblijf, met een chauffeur die op je vluchtnummer wacht in plaats van op de klok. Vooral het uur na een vertraagde avondvlucht is hier het verschil.',
      'From IBZ to where you are staying, with a driver who waits on your flight number rather than the clock. The hour after a delayed evening flight is where this actually differs.',
      'Von IBZ zu deiner Unterkunft, mit einem Fahrer, der auf deine Flugnummer wartet statt auf die Uhr. Vor allem die Stunde nach einem verspäteten Abendflug macht den Unterschied.',
      'De IBZ a tu alojamiento, con un conductor que espera por tu número de vuelo y no por el reloj. La hora posterior a un vuelo nocturno retrasado es donde se nota.',
      'D’IBZ à votre logement, avec un chauffeur qui attend sur votre numéro de vol et non sur l’horloge. C’est l’heure qui suit un vol du soir retardé qui fait la différence.',
    ),
  },
  {
    name: L('Huurauto en scooter', 'Rental car and scooter', 'Mietwagen und Roller', 'Coche y moto de alquiler', 'Voiture et scooter de location'),
    body: L(
      'Via Wiber, met of zonder afhalen op het vliegveld. De creditcardborg is het punt waar dit het vaakst misgaat; dat regelen wij vooraf in plaats van aan de balie.',
      'Through Wiber, with or without airport pickup. The credit-card deposit is where this most often goes wrong; we settle that beforehand rather than at the counter.',
      'Über Wiber, mit oder ohne Abholung am Flughafen. Die Kreditkartenkaution ist der häufigste Stolperstein; das klären wir vorher statt am Schalter.',
      'Con Wiber, con o sin recogida en el aeropuerto. La fianza con tarjeta de crédito es donde más falla esto; lo dejamos cerrado antes y no en el mostrador.',
      'Via Wiber, avec ou sans prise en charge à l’aéroport. La caution par carte de crédit est le point qui coince le plus souvent ; nous la réglons en amont, pas au comptoir.',
    ),
  },
  {
    name: L('Tafel en restaurant', 'Table and restaurant', 'Tisch und Restaurant', 'Mesa y restaurante', 'Table et restaurant'),
    body: L(
      'Een tafel op een avond waarop online alles dicht staat. Lukt het niet, dan hoor je dat — en niet een alternatief waar je niet om vroeg.',
      'A table on a night when everything online says full. If it cannot be done, you hear that — not an alternative you never asked for.',
      'Ein Tisch an einem Abend, an dem online alles ausgebucht ist. Geht es nicht, hörst du das — und nicht eine Alternative, nach der du nie gefragt hast.',
      'Una mesa una noche en la que online todo aparece completo. Si no se puede, te lo decimos, y no una alternativa que no pediste.',
      'Une table un soir où tout affiche complet en ligne. Si ce n’est pas possible, vous l’entendez — et pas une alternative que vous n’avez pas demandée.',
    ),
  },
]

/* ── Kosten ─────────────────────────────────────────────────────────────── */

export const H_KOSTEN: T = L(
  'Wat kost een concierge op Ibiza?',
  'What does a concierge in Ibiza cost?',
  'Was kostet ein Concierge auf Ibiza?',
  '¿Cuánto cuesta una conserjería en Ibiza?',
  'Combien coûte une conciergerie à Ibiza ?',
)

export const KOSTEN_PARAGRAPHS: T[] = [
  L(
    'Bij ons niets. Er is geen bemiddelingstarief, geen lidmaatschap en geen toeslag bovenop de prijs van de aanbieder: je betaalt wat het ticket, de boot of de auto bij de aanbieder zelf kost.',
    'With us, nothing. There is no booking fee, no membership and no surcharge on top of the operator’s price: you pay what the ticket, the boat or the car costs at the operator itself.',
    'Bei uns nichts. Es gibt keine Vermittlungsgebühr, keine Mitgliedschaft und keinen Aufschlag auf den Preis des Anbieters: Du zahlst, was das Ticket, das Boot oder der Wagen beim Anbieter kostet.',
    'Con nosotros, nada. No hay tarifa de gestión, ni cuota, ni recargo sobre el precio del operador: pagas lo que cuesta la entrada, el barco o el coche en el propio operador.',
    'Chez nous, rien. Pas de frais de dossier, pas d’abonnement, pas de supplément sur le prix du prestataire : vous payez ce que coûtent le billet, le bateau ou la voiture chez le prestataire.',
  ),
  L(
    'Wij verdienen aan commissie van die aanbieders. Dat hoort u te weten, want het verklaart waarom dit gratis kan zijn en waar onze prikkel ligt: wij verdienen als u boekt. Wat het níét verandert is de prijs die u betaalt — die stelt de aanbieder vast, niet wij.',
    'We earn commission from those operators. You should know that, because it explains why this can be free and where our incentive sits: we earn when you book. What it does not change is the price you pay — the operator sets that, not us.',
    'Wir verdienen an Provision dieser Anbieter. Das solltest du wissen, denn es erklärt, warum das kostenlos sein kann und wo unser Anreiz liegt: Wir verdienen, wenn du buchst. Was es nicht ändert, ist dein Preis — den setzt der Anbieter fest, nicht wir.',
    'Ganamos con la comisión de esos operadores. Conviene que lo sepas, porque explica por qué esto puede ser gratis y dónde está nuestro incentivo: ganamos cuando reservas. Lo que no cambia es el precio que pagas: lo fija el operador, no nosotros.',
    'Nous percevons une commission de ces prestataires. Il faut le savoir, car cela explique pourquoi c’est gratuit et où se situe notre intérêt : nous gagnons quand vous réservez. Ce que cela ne change pas, c’est votre prix — fixé par le prestataire, pas par nous.',
  ),
  L(
    'Een conciergedienst die wél een vast tarief rekent — je ziet op Ibiza bedragen van een paar honderd euro per verblijf tot een percentage van wat je uitgeeft — is daarmee niet duurder of slechter. Het is een ander model, met een andere prikkel: die partij verdient ook als je niets boekt, en heeft dus geen reden om je ergens naartoe te sturen. Vraag altijd welk van de twee je voor je hebt.',
    'A concierge that does charge a flat fee — on Ibiza you will see anything from a few hundred euros per stay to a percentage of what you spend — is not thereby more expensive or worse. It is a different model with a different incentive: they earn even if you book nothing, so they have no reason to steer you anywhere. Always ask which of the two you are dealing with.',
    'Ein Concierge, der eine feste Gebühr nimmt — auf Ibiza siehst du von einigen Hundert Euro pro Aufenthalt bis zu einem Prozentsatz deiner Ausgaben — ist deshalb nicht teurer oder schlechter. Es ist ein anderes Modell mit einem anderen Anreiz: Der verdient auch, wenn du nichts buchst, und hat keinen Grund, dich irgendwohin zu lenken. Frag immer, welches von beiden du vor dir hast.',
    'Una conserjería que sí cobra una tarifa fija —en Ibiza verás desde unos cientos de euros por estancia hasta un porcentaje de lo que gastas— no es por ello más cara ni peor. Es otro modelo con otro incentivo: cobra aunque no reserves nada, así que no tiene motivo para dirigirte a ningún sitio. Pregunta siempre cuál de los dos tienes delante.',
    'Une conciergerie qui facture un forfait — à Ibiza, de quelques centaines d’euros par séjour à un pourcentage de vos dépenses — n’est pas pour autant plus chère ni moins bonne. C’est un autre modèle, avec un autre intérêt : elle gagne même si vous ne réservez rien, donc elle n’a aucune raison de vous orienter. Demandez toujours auquel des deux vous avez affaire.',
  ),
]

/* ── Hoe kies je er een ─────────────────────────────────────────────────── */

export const H_KIEZEN: T = L(
  'Hoe kies je de beste concierge op Ibiza?',
  'How do you pick the best concierge in Ibiza?',
  'Wie wählst du den besten Concierge auf Ibiza?',
  '¿Cómo elegir la mejor conserjería en Ibiza?',
  'Comment choisir la meilleure conciergerie à Ibiza ?',
)

export const INTRO_KIEZEN: T = L(
  'Iedereen noemt zichzelf de beste, wij ook als wij dat zouden willen. Nuttiger zijn vier toetsen die je zelf kunt aanleggen — ook op ons.',
  'Everyone calls themselves the best, and so could we. More useful are four checks you can run yourself — on us as well.',
  'Jeder nennt sich der Beste, wir könnten das auch. Nützlicher sind vier Prüfungen, die du selbst machen kannst — auch bei uns.',
  'Todos se llaman los mejores, y nosotros podríamos hacerlo igual. Es más útil aplicar cuatro comprobaciones tú mismo, también con nosotros.',
  'Tout le monde se dit le meilleur, nous pourrions le faire aussi. Plus utiles : quatre vérifications que vous pouvez mener vous-même — sur nous aussi.',
)

export const KIEZEN: NamedCopy[] = [
  {
    name: L('Staan de prijzen er?', 'Are the prices published?', 'Stehen die Preise da?', '¿Están los precios publicados?', 'Les prix sont-ils affichés ?'),
    body: L(
      'Een partij die alles op aanvraag houdt, kan de prijs per klant bepalen. Vraag om het tarief vóór je je reisdata deelt.',
      'A firm that keeps everything on request can set the price per customer. Ask for the rate before you share your travel dates.',
      'Wer alles auf Anfrage hält, kann den Preis pro Kunde festlegen. Frag nach dem Tarif, bevor du deine Reisedaten teilst.',
      'Quien lo deja todo bajo consulta puede fijar el precio por cliente. Pide la tarifa antes de dar tus fechas de viaje.',
      'Qui garde tout sur demande peut fixer le prix client par client. Demandez le tarif avant de donner vos dates.',
    ),
  },
  {
    name: L('Zeggen ze wie de aanbieder is?', 'Do they name the operator?', 'Nennen sie den Anbieter?', '¿Dicen quién es el operador?', 'Nomment-ils le prestataire ?'),
    body: L(
      'Wie het ticket verkoopt en wie de boot vaart bepaalt bij wie je terechtkunt als er iets misgaat. Blijft dat vaag, dan is dat het antwoord.',
      'Who sells the ticket and who sails the boat decides where you stand if something goes wrong. If that stays vague, that is your answer.',
      'Wer das Ticket verkauft und wer das Boot fährt, entscheidet, an wen du dich wendest, wenn etwas schiefgeht. Bleibt das vage, ist das die Antwort.',
      'Quién vende la entrada y quién patronea el barco decide a quién acudes si algo falla. Si eso queda vago, esa es la respuesta.',
      'Qui vend le billet et qui pilote le bateau détermine vers qui vous vous tournez en cas de problème. Si cela reste flou, vous avez votre réponse.',
    ),
  },
  {
    name: L('Beloven ze de deur?', 'Do they promise the door?', 'Versprechen sie die Tür?', '¿Prometen la puerta?', 'Promettent-ils la porte ?'),
    body: L(
      'Niemand kan gratis entree garanderen; een deur is een mens en een avond is een avond. Wie het wél garandeert, belooft iets van een ander.',
      'Nobody can guarantee free entry; a door is a person and a night is a night. Anyone who guarantees it is promising something that is not theirs.',
      'Freien Eintritt kann niemand garantieren; eine Tür ist ein Mensch und ein Abend ist ein Abend. Wer es garantiert, verspricht etwas, das ihm nicht gehört.',
      'Nadie puede garantizar la entrada gratis; una puerta es una persona y una noche es una noche. Quien lo garantiza promete algo que no es suyo.',
      'Personne ne peut garantir l’entrée gratuite ; une porte, c’est une personne, et une soirée, c’est une soirée. Qui le garantit promet ce qui ne lui appartient pas.',
    ),
  },
  {
    name: L('Zit er iemand op het eiland?', 'Is anyone actually on the island?', 'Sitzt jemand auf der Insel?', '¿Hay alguien en la isla?', 'Y a-t-il quelqu’un sur l’île ?'),
    body: L(
      'Een tafel om half twee ’s nachts regelen kan alleen iemand die er is. Vraag waar ze zitten en in welke taal je antwoord krijgt.',
      'Arranging a table at half one in the morning takes someone who is there. Ask where they are and in what language you will be answered.',
      'Einen Tisch um halb zwei nachts regelt nur, wer da ist. Frag, wo sie sitzen und in welcher Sprache du Antwort bekommst.',
      'Conseguir una mesa a la una y media de la madrugada solo lo hace quien está allí. Pregunta dónde están y en qué idioma te responden.',
      'Obtenir une table à une heure et demie du matin, seul quelqu’un sur place le peut. Demandez où ils sont et dans quelle langue on vous répondra.',
    ),
  },
]

/* ── FAQ ────────────────────────────────────────────────────────────────── */

export const FAQS: { q: T; a: T }[] = [
  {
    q: L(
      'Wat doet een concierge op Ibiza precies?',
      'What exactly does a concierge in Ibiza do?',
      'Was macht ein Concierge auf Ibiza genau?',
      '¿Qué hace exactamente una conserjería en Ibiza?',
      'Que fait exactement une conciergerie à Ibiza ?',
    ),
    a: L(
      'Vijf dingen regelen via één lijn: clubtickets en gastenlijst, een privéboot of boat party, vervoer vanaf het vliegveld, een huurauto of scooter, en een tafel in een restaurant. Alles wat wij niet zelf inkopen of dagelijks controleren, regelen wij niet.',
      'Arrange five things through one line: club tickets and guestlist, a private boat or boat party, transport from the airport, a rental car or scooter, and a restaurant table. Anything we do not buy ourselves or check daily, we do not arrange.',
      'Fünf Dinge über eine Leitung regeln: Clubtickets und Gästeliste, ein Privatboot oder eine Boat Party, Transport ab Flughafen, Mietwagen oder Roller und einen Tisch im Restaurant. Was wir nicht selbst einkaufen oder täglich prüfen, regeln wir nicht.',
      'Gestionar cinco cosas por una sola vía: entradas y lista, un barco privado o boat party, transporte desde el aeropuerto, coche o moto de alquiler y una mesa de restaurante. Lo que no compramos ni revisamos a diario, no lo gestionamos.',
      'Gérer cinq choses sur une seule ligne : billets de club et guestlist, un bateau privé ou une boat party, le transport depuis l’aéroport, une voiture ou un scooter, et une table au restaurant. Ce que nous n’achetons pas nous-mêmes, nous ne le gérons pas.',
    ),
  },
  {
    q: L(
      'Wat kost een concierge op Ibiza?',
      'What does a concierge in Ibiza cost?',
      'Was kostet ein Concierge auf Ibiza?',
      '¿Cuánto cuesta una conserjería en Ibiza?',
      'Combien coûte une conciergerie à Ibiza ?',
    ),
    a: L(
      'Bij ons niets: geen bemiddelingstarief, geen lidmaatschap, geen toeslag op de prijs van de aanbieder. Wij verdienen commissie van de aanbieders bij wie je boekt. Andere conciergediensten op het eiland rekenen wél een vast bedrag per verblijf of een percentage van je uitgaven; vraag altijd welk model je voor je hebt.',
      'With us, nothing: no booking fee, no membership, no surcharge on the operator’s price. We earn commission from the operators you book with. Other concierge services on the island do charge a flat fee per stay or a percentage of what you spend; always ask which model you are dealing with.',
      'Bei uns nichts: keine Vermittlungsgebühr, keine Mitgliedschaft, kein Aufschlag auf den Anbieterpreis. Wir verdienen Provision von den Anbietern, bei denen du buchst. Andere Concierge-Dienste auf der Insel nehmen sehr wohl eine Pauschale pro Aufenthalt oder einen Prozentsatz; frag immer nach dem Modell.',
      'Con nosotros, nada: sin tarifa de gestión, sin cuota, sin recargo sobre el precio del operador. Ganamos comisión de los operadores con los que reservas. Otras conserjerías de la isla sí cobran una cantidad fija por estancia o un porcentaje de tu gasto; pregunta siempre qué modelo tienes delante.',
      'Chez nous, rien : pas de frais, pas d’abonnement, pas de supplément sur le prix du prestataire. Nous percevons une commission des prestataires chez qui vous réservez. D’autres conciergeries de l’île facturent un forfait par séjour ou un pourcentage de vos dépenses ; demandez toujours le modèle.',
    ),
  },
  {
    q: L(
      'Is de gastenlijst op Ibiza echt gratis?',
      'Is the Ibiza guestlist really free?',
      'Ist die Ibiza-Gästeliste wirklich gratis?',
      '¿La lista de invitados en Ibiza es realmente gratis?',
      'La guestlist à Ibiza est-elle vraiment gratuite ?',
    ),
    a: L(
      'Op de lijst staan kost niets, maar wat die plek oplevert verschilt per club en per avond: soms vrije entree vóór een sluitingstijd, soms een lagere prijs, soms alleen dat je binnen bent zonder te wachten. Wie gratis entree gárandeert belooft iets waar de deur over gaat, niet hij. Je hoort vooraf welke van de drie het die avond is.',
      'Being on the list costs nothing, but what the spot gets you differs by club and by night: sometimes free entry before a cut-off time, sometimes a reduced price, sometimes only that you are in without queuing. Anyone guaranteeing free entry is promising what the door decides, not them. You hear beforehand which of the three applies that night.',
      'Auf der Liste stehen kostet nichts, aber was der Platz bringt, unterscheidet sich je Club und Abend: mal freier Eintritt vor einer Schlusszeit, mal ein reduzierter Preis, mal nur, dass du ohne Warten reinkommst. Wer freien Eintritt garantiert, verspricht, was die Tür entscheidet. Du hörst vorher, was an dem Abend gilt.',
      'Estar en la lista no cuesta nada, pero lo que te da varía según el club y la noche: a veces entrada libre antes de una hora límite, a veces precio reducido, a veces solo entrar sin cola. Quien garantiza entrada gratis promete lo que decide la puerta. Sabes de antemano cuál de las tres aplica esa noche.',
      'Être sur la liste ne coûte rien, mais ce que la place apporte varie selon le club et le soir : parfois l’entrée libre avant une heure limite, parfois un tarif réduit, parfois seulement entrer sans faire la queue. Qui garantit l’entrée gratuite promet ce que la porte décide. Vous savez à l’avance laquelle des trois s’applique.',
    ),
  },
  {
    q: L(
      'Regelen jullie ook de goedkoopste boot op Ibiza?',
      'Can you arrange the cheapest boat in Ibiza?',
      'Regelt ihr auch das günstigste Boot auf Ibiza?',
      '¿Gestionáis también el barco más barato de Ibiza?',
      'Pouvez-vous trouver le bateau le moins cher à Ibiza ?',
    ),
    a: L(
      'De dagtarieven van de hele vloot staan per boot op de site, met het verschil tussen laag- en hoogseizoen erbij, dus je kunt de goedkoopste zelf aanwijzen in plaats van erom te moeten vragen. Wat de goedkoopste is verschuift per maand en per aantal personen — vier personen in mei komen bij een andere boot uit dan tien in augustus.',
      'Day rates for the whole fleet are listed per boat on the site, with the low- and high-season difference included, so you can point out the cheapest yourself instead of having to ask. Which one is cheapest shifts by month and by group size — four people in May land on a different boat than ten in August.',
      'Die Tagespreise der gesamten Flotte stehen pro Boot auf der Seite, samt Unterschied zwischen Neben- und Hochsaison, sodass du das günstigste selbst bestimmen kannst. Welches das ist, verschiebt sich je Monat und Gruppengröße — vier Personen im Mai landen bei einem anderen Boot als zehn im August.',
      'Las tarifas diarias de toda la flota están por barco en la web, con la diferencia entre temporada baja y alta, así que puedes señalar tú mismo el más barato. Cuál lo es cambia según el mes y el número de personas: cuatro en mayo acaban en otro barco que diez en agosto.',
      'Les tarifs journaliers de toute la flotte sont indiqués par bateau, écart basse/haute saison compris : vous pouvez désigner vous-même le moins cher. Lequel l’est dépend du mois et du nombre de personnes — quatre en mai, ce n’est pas le même bateau que dix en août.',
    ),
  },
  {
    q: L(
      'Zijn jullie de aanbieder of een tussenpersoon?',
      'Are you the operator or an intermediary?',
      'Seid ihr der Anbieter oder ein Vermittler?',
      '¿Sois el operador o un intermediario?',
      'Êtes-vous le prestataire ou un intermédiaire ?',
    ),
    a: L(
      'Een tussenpersoon, en dat staat er expres. Tickets lopen via ClubTickets, waarvan wij officieel partner zijn; boten via de vloot en Click&Boat; auto’s via Wiber. Wij zijn de boekings- en conciergelaag daarbovenop, niet de exploitant. Dat bepaalt wie wat kan oplossen als er iets misgaat.',
      'An intermediary, and that is stated deliberately. Tickets run through ClubTickets, whose official partner we are; boats through the fleet and Click&Boat; cars through Wiber. We are the booking and concierge layer on top, not the operator. That decides who can fix what if something goes wrong.',
      'Ein Vermittler, und das steht hier bewusst. Tickets laufen über ClubTickets, deren offizieller Partner wir sind; Boote über die Flotte und Click&Boat; Autos über Wiber. Wir sind die Buchungs- und Concierge-Schicht darüber, nicht der Betreiber. Das entscheidet, wer was lösen kann.',
      'Un intermediario, y se dice a propósito. Las entradas van por ClubTickets, de quien somos socio oficial; los barcos por la flota y Click&Boat; los coches por Wiber. Somos la capa de reserva y conserjería encima, no el operador. Eso determina quién resuelve qué si algo falla.',
      'Un intermédiaire, et c’est dit exprès. Les billets passent par ClubTickets, dont nous sommes partenaire officiel ; les bateaux par la flotte et Click&Boat ; les voitures par Wiber. Nous sommes la couche de réservation et de conciergerie au-dessus, pas l’exploitant. Cela détermine qui règle quoi.',
    ),
  },
  {
    q: L(
      'Hoe neem ik contact op, en in welke taal?',
      'How do I get in touch, and in what language?',
      'Wie nehme ich Kontakt auf, und in welcher Sprache?',
      '¿Cómo contacto, y en qué idioma?',
      'Comment vous contacter, et dans quelle langue ?',
    ),
    a: L(
      'Via WhatsApp, met een mens op het eiland aan de andere kant — geen formulier en geen ticketsysteem. Nederlands, Engels, Duits, Spaans en Frans.',
      'Over WhatsApp, with a person on the island at the other end — no form and no ticketing system. Dutch, English, German, Spanish and French.',
      'Über WhatsApp, mit einem Menschen auf der Insel am anderen Ende — kein Formular, kein Ticketsystem. Niederländisch, Englisch, Deutsch, Spanisch und Französisch.',
      'Por WhatsApp, con una persona en la isla al otro lado: sin formularios ni sistema de tickets. Neerlandés, inglés, alemán, español y francés.',
      'Par WhatsApp, avec une personne sur l’île en face — pas de formulaire ni de système de tickets. Néerlandais, anglais, allemand, espagnol et français.',
    ),
  },
]

/* ── CTA en links ───────────────────────────────────────────────────────── */

export const CTA_HEADING: T = L(
  'Vertel wat je wilt regelen',
  'Tell us what you need arranged',
  'Sag, was du geregelt haben willst',
  'Cuéntanos qué necesitas',
  'Dites-nous ce que vous voulez organiser',
)

export const CTA_BODY: T = L(
  'Eén bericht met je data en met hoeveel jullie zijn is genoeg om te beginnen. Kan iets niet, dan hoor je dat — dat is sneller dan een alternatief waar je niet om vroeg.',
  'One message with your dates and how many of you there are is enough to start. If something cannot be done, you hear that — faster than an alternative you never asked for.',
  'Eine Nachricht mit deinen Daten und der Personenzahl reicht zum Start. Geht etwas nicht, hörst du das — schneller als eine Alternative, nach der du nie gefragt hast.',
  'Un mensaje con tus fechas y cuántos sois basta para empezar. Si algo no se puede, te lo decimos: es más rápido que una alternativa que no pediste.',
  'Un message avec vos dates et le nombre de personnes suffit pour commencer. Si quelque chose est impossible, vous l’entendez — plus vite qu’une alternative non demandée.',
)

export const CTA_PREFILL: T = L(
  'Hoi! Ik zoek een concierge op Ibiza voor',
  'Hi! I am looking for a concierge in Ibiza for',
  'Hallo! Ich suche einen Concierge auf Ibiza für',
  '¡Hola! Busco una conserjería en Ibiza para',
  'Bonjour ! Je cherche une conciergerie à Ibiza pour',
)

export const BYLINE_TOPIC: T = L(
  'concierge op Ibiza',
  'concierge in Ibiza',
  'Concierge auf Ibiza',
  'conserjería en Ibiza',
  'conciergerie à Ibiza',
)

export const H_LINKS: T = L('Verder lezen', 'Read on', 'Weiterlesen', 'Seguir leyendo', 'À lire ensuite')

export const LINKS: { key: string; localized: boolean; label: T; body: T }[] = [
  {
    key: 'guestlist', localized: false,
    label: L('Ibiza gastenlijst', 'Ibiza guestlist', 'Ibiza Gästeliste', 'Lista de invitados Ibiza', 'Guestlist Ibiza'),
    body: L('Sluitingstijden, en wat een lijstplek je die avond echt oplevert.', 'Cut-off times, and what a list spot actually gets you that night.', 'Schlusszeiten, und was ein Listenplatz an dem Abend wirklich bringt.', 'Horas límite y lo que de verdad te da la lista esa noche.', 'Heures limites, et ce qu’une place apporte vraiment ce soir-là.'),
  },
  {
    key: 'boats', localized: false,
    label: L('Boten en vloot', 'Boats and fleet', 'Boote und Flotte', 'Barcos y flota', 'Bateaux et flotte'),
    body: L('De hele vloot met dagtarieven per boot, laag- en hoogseizoen apart.', 'The whole fleet with day rates per boat, low and high season separately.', 'Die ganze Flotte mit Tagespreisen pro Boot, Neben- und Hochsaison getrennt.', 'Toda la flota con tarifas diarias por barco, temporada baja y alta aparte.', 'Toute la flotte avec les tarifs journaliers par bateau, basse et haute saison.'),
  },
  {
    key: 'ibiza-prices', localized: false,
    label: L('Wat kost Ibiza?', 'What does Ibiza cost?', 'Was kostet Ibiza?', '¿Cuánto cuesta Ibiza?', 'Combien coûte Ibiza ?'),
    body: L('Entree, drankjes, taxi’s en boten, met de cijfers erbij.', 'Entry, drinks, taxis and boats, with the actual figures.', 'Eintritt, Getränke, Taxis und Boote, mit den Zahlen dabei.', 'Entradas, copas, taxis y barcos, con las cifras.', 'Entrées, boissons, taxis et bateaux, chiffres à l’appui.'),
  },
  {
    key: 'airport-transfer', localized: true,
    label: L('Luchthaventransfer Ibiza', 'Ibiza airport transfer', 'Ibiza Flughafentransfer', 'Traslado aeropuerto Ibiza', 'Transfert aéroport Ibiza'),
    body: L('Hoe je van IBZ naar je verblijf komt, en wat elke optie kost.', 'How to get from IBZ to where you are staying, and what each option costs.', 'Wie du von IBZ zur Unterkunft kommst und was jede Option kostet.', 'Cómo llegar de IBZ a tu alojamiento y qué cuesta cada opción.', 'Comment aller d’IBZ à votre logement, et le prix de chaque option.'),
  },
  {
    key: 'about-us', localized: false,
    label: L('Over ons', 'About us', 'Über uns', 'Sobre nosotros', 'À propos'),
    body: L('Wie er achter Ibiza mi vida zit, en waar we zitten.', 'Who is behind Ibiza mi vida, and where we are.', 'Wer hinter Ibiza mi vida steckt und wo wir sind.', 'Quién está detrás de Ibiza mi vida y dónde estamos.', 'Qui est derrière Ibiza mi vida, et où nous sommes.'),
  },
]
