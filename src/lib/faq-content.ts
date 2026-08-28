import type { Locale } from './seo'

// ── Sitewide FAQ content (5 locales) ───────────────────────────────────
// Rendered on /faq (grouped accordions + FAQPage JSON-LD). Written for SEO:
// each answer naturally mentions the product and Ibiza search terms.

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export interface FaqItem { q: T; a: T }
export interface FaqGroup { id: string; title: T; items: FaqItem[] }

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'tickets',
    title: L('Club Tickets', 'Club Tickets', 'Club-Tickets', 'Entradas de Clubs', 'Billets de Clubs'),
    items: [
      {
        q: L('Hoe koop ik tickets voor clubs op Ibiza?', 'How do I buy Ibiza club tickets?', 'Wie kaufe ich Club-Tickets für Ibiza?', '¿Cómo compro entradas para los clubs de Ibiza?', 'Comment acheter des billets pour les clubs d’Ibiza ?'),
        a: L(
          'Kies je event in onze agenda, selecteer de datum en reken veilig af via onze officiële ticketpartner ClubTickets. Je betaalt de officiële prijs, zonder verborgen kosten.',
          'Pick your event in our calendar, select the date and check out securely via our official ticket partner ClubTickets. You pay the official price, with no hidden fees.',
          'Wähle dein Event in unserem Kalender, wähle das Datum und zahle sicher über unseren offiziellen Ticketpartner ClubTickets. Du zahlst den offiziellen Preis, ohne versteckte Kosten.',
          'Elige tu evento en nuestra agenda, selecciona la fecha y paga de forma segura a través de nuestro socio oficial ClubTickets. Pagas el precio oficial, sin costes ocultos.',
          'Choisissez votre événement dans notre agenda, sélectionnez la date et payez en toute sécurité via notre partenaire officiel ClubTickets. Vous payez le prix officiel, sans frais cachés.',
        ),
      },
      {
        q: L('Hoe ontvang ik mijn tickets?', 'How do I receive my tickets?', 'Wie erhalte ich meine Tickets?', '¿Cómo recibo mis entradas?', 'Comment vais-je recevoir mes billets ?'),
        a: L(
          'Direct na betaling ontvang je je tickets per e-mail als PDF of mobiele QR-code. Laat de QR-code bij de deur scannen — printen is niet nodig.',
          'Right after payment you receive your tickets by email as a PDF or mobile QR code. Show the QR code at the door — no printing needed.',
          'Direkt nach der Zahlung erhältst du deine Tickets per E-Mail als PDF oder mobilen QR-Code. Zeig den QR-Code am Eingang — Ausdrucken ist nicht nötig.',
          'Justo después del pago recibirás tus entradas por correo como PDF o código QR móvil. Muestra el QR en la puerta — no hace falta imprimir.',
          'Juste après le paiement, vous recevez vos billets par e-mail en PDF ou QR code mobile. Présentez le QR code à l’entrée — pas besoin d’imprimer.',
        ),
      },
      {
        q: L('Zijn de tickets 100% officieel?', 'Are the tickets 100% official?', 'Sind die Tickets 100% offiziell?', '¿Son las entradas 100% oficiales?', 'Les billets sont-ils 100 % officiels ?'),
        a: L(
          'Ja. We werken als officiële partner van ClubTickets samen met alle grote clubs op Ibiza — Hï, Ushuaïa, Pacha, Amnesia en meer. Je loopt aan de deur dus nooit risico.',
          'Yes. As an official ClubTickets partner we work with every major club in Ibiza — Hï, Ushuaïa, Pacha, Amnesia and more. You never run any risk at the door.',
          'Ja. Als offizieller ClubTickets-Partner arbeiten wir mit allen großen Clubs auf Ibiza — Hï, Ushuaïa, Pacha, Amnesia und mehr. Am Eingang gehst du kein Risiko ein.',
          'Sí. Como socio oficial de ClubTickets trabajamos con todos los grandes clubs de Ibiza — Hï, Ushuaïa, Pacha, Amnesia y más. Nunca corres riesgo en la puerta.',
          'Oui. En tant que partenaire officiel de ClubTickets, nous travaillons avec tous les grands clubs d’Ibiza — Hï, Ushuaïa, Pacha, Amnesia et plus. Aucun risque à l’entrée.',
        ),
      },
      {
        q: L('Wat kosten club tickets op Ibiza?', 'How much do Ibiza club tickets cost?', 'Was kosten Club-Tickets auf Ibiza?', '¿Cuánto cuestan las entradas de los clubs de Ibiza?', 'Combien coûtent les billets de club à Ibiza ?'),
        a: L(
          'Reken op zo’n €40–€100 per event, afhankelijk van de club, de artiest en hoe vroeg je boekt. Vroeg boeken is vrijwel altijd goedkoper — bekijk onze Deals van de Dag voor de scherpste prijzen.',
          'Expect around €40–€100 per event, depending on the club, the artist and how early you book. Booking early is almost always cheaper — check our Deals of the Day for the sharpest prices.',
          'Rechne mit etwa €40–€100 pro Event, je nach Club, Artist und Buchungszeitpunkt. Früh buchen ist fast immer günstiger — sieh dir unsere Tagesangebote an.',
          'Calcula entre €40 y €100 por evento, según el club, el artista y la antelación. Reservar pronto casi siempre es más barato — mira nuestras Ofertas del Día.',
          'Comptez environ 40–100 € par événement, selon le club, l’artiste et la date de réservation. Réserver tôt est presque toujours moins cher — consultez nos Offres du Jour.',
        ),
      },
      {
        q: L('Wat is de minimumleeftijd voor de clubs?', 'What is the minimum age for the clubs?', 'Wie alt muss ich für die Clubs sein?', '¿Cuál es la edad mínima para los clubs?', 'Quel est l’âge minimum pour les clubs ?'),
        a: L(
          'Voor vrijwel alle clubs op Ibiza geldt een minimumleeftijd van 18 jaar. Neem altijd een geldig legitimatiebewijs (paspoort of ID-kaart) mee — dit wordt aan de deur gecontroleerd.',
          'Nearly all Ibiza clubs require a minimum age of 18. Always bring valid photo ID (passport or ID card) — it is checked at the door.',
          'Fast alle Clubs auf Ibiza verlangen ein Mindestalter von 18 Jahren. Nimm immer einen gültigen Ausweis mit — er wird am Eingang kontrolliert.',
          'Casi todos los clubs de Ibiza exigen una edad mínima de 18 años. Lleva siempre un documento de identidad válido — lo comprueban en la puerta.',
          'Presque tous les clubs d’Ibiza exigent un âge minimum de 18 ans. Apportez toujours une pièce d’identité valide — elle est contrôlée à l’entrée.',
        ),
      },
      {
        q: L('Is er een dresscode?', 'Is there a dress code?', 'Gibt es einen Dresscode?', '¿Hay código de vestimenta?', 'Y a-t-il un dress code ?'),
        a: L(
          'De meeste clubs hanteren een relaxte maar verzorgde stijl: geen zwemkleding of voetbalshirts. Voor VIP-tafels en restaurants als Lío geldt “smart casual”. Twijfel je? Vraag het ons via WhatsApp.',
          'Most clubs keep it relaxed but smart: no swimwear or football shirts. VIP tables and venues like Lío expect smart casual. In doubt? Ask us on WhatsApp.',
          'Die meisten Clubs sind entspannt, aber gepflegt: keine Badekleidung oder Fußballtrikots. Für VIP-Tische und Venues wie Lío gilt Smart Casual. Im Zweifel: frag uns per WhatsApp.',
          'La mayoría de clubs piden un estilo relajado pero cuidado: nada de bañadores ni camisetas de fútbol. Para mesas VIP y sitios como Lío, smart casual. ¿Dudas? Escríbenos por WhatsApp.',
          'La plupart des clubs restent décontractés mais soignés : pas de maillot de bain ni de maillot de foot. Pour les tables VIP et des lieux comme Lío : smart casual. Un doute ? WhatsApp.',
        ),
      },
      {
        q: L('Kan ik mijn ticket annuleren of terugkrijgen?', 'Can I cancel or refund my ticket?', 'Kann ich mein Ticket stornieren?', '¿Puedo cancelar o pedir reembolso de mi entrada?', 'Puis-je annuler ou me faire rembourser mon billet ?'),
        a: L(
          'Tickets zijn in principe niet restitueerbaar, tenzij het event wordt geannuleerd — dan krijg je je geld terug. Neem bij problemen altijd contact met ons op; we denken graag mee over een oplossing.',
          'Tickets are generally non-refundable, unless the event is cancelled — then you get your money back. If anything goes wrong, contact us; we will always look for a solution.',
          'Tickets sind grundsätzlich nicht erstattbar, außer das Event wird abgesagt — dann bekommst du dein Geld zurück. Bei Problemen: melde dich, wir finden eine Lösung.',
          'Las entradas en principio no son reembolsables, salvo que el evento se cancele — entonces recuperas tu dinero. Ante cualquier problema, contáctanos; buscamos una solución.',
          'Les billets ne sont en principe pas remboursables, sauf si l’événement est annulé — vous êtes alors remboursé. En cas de souci, contactez-nous ; nous trouverons une solution.',
        ),
      },
      {
        q: L('Kan ik ook op de gastenlijst of een VIP-tafel boeken?', 'Can I get on the guestlist or book a VIP table?', 'Kann ich auf die Gästeliste oder einen VIP-Tisch buchen?', '¿Puedo entrar en lista o reservar mesa VIP?', 'Puis-je être sur la guestlist ou réserver une table VIP ?'),
        a: L(
          'Ja — via onze gastenlijst regelt Simon per WhatsApp toegang bij diverse clubs; de voorwaarden verschillen per club en per avond, dus hij laat je vooraf precies weten wat er geldt. Voor bijna elke club regelen we ook VIP-tafels met flessen en persoonlijke service. App ons voor prijzen en beschikbaarheid.',
          'Yes — through our guestlist Simon arranges access at several clubs via WhatsApp; terms vary by club and by night, so he tells you exactly what applies beforehand. We also arrange VIP tables with bottles and personal service for nearly every club. Message us for prices and availability.',
          'Ja — über unsere Gästeliste organisiert Simon per WhatsApp den Zugang zu mehreren Clubs; die Bedingungen unterscheiden sich je nach Club und Abend, daher sagt er dir vorher genau, was gilt. Für fast jeden Club organisieren wir auch VIP-Tische mit Flaschen und persönlichem Service. Schreib uns für Preise.',
          'Sí — con nuestra lista, Simon organiza el acceso a varios clubs por WhatsApp; las condiciones varían según el club y la noche, así que te dice antes exactamente qué aplica. También organizamos mesas VIP con botellas y servicio personal en casi todos los clubs. Escríbenos para precios.',
          'Oui — avec notre guestlist, Simon organise l’accès à plusieurs clubs via WhatsApp ; les conditions varient selon le club et la soirée, donc il vous précise à l’avance ce qui s’applique. Nous organisons aussi des tables VIP avec bouteilles et service personnalisé presque partout. Contactez-nous pour les prix.',
        ),
      },
    ],
  },
  {
    id: 'boats',
    title: L('Boten & Op het Water', 'Boats & On the Water', 'Boote & Auf dem Wasser', 'Barcos y En el Agua', 'Bateaux & Sur l’Eau'),
    items: [
      {
        q: L('Hoe werkt het huren van een privéboot op Ibiza?', 'How does renting a private boat in Ibiza work?', 'Wie funktioniert das Mieten eines Privatboots auf Ibiza?', '¿Cómo funciona alquilar un barco privado en Ibiza?', 'Comment fonctionne la location d’un bateau privé à Ibiza ?'),
        a: L(
          'Kies een boot uit onze vloot, geef je datum en groepsgrootte door en wij regelen de rest: schipper, brandstof en route langs de mooiste baaien. Boek vroeg in het hoogseizoen — de beste boten zijn snel vol.',
          'Pick a boat from our fleet, tell us your date and group size and we handle the rest: skipper, fuel and a route along the finest bays. Book early in high season — the best boats fill up fast.',
          'Wähle ein Boot aus unserer Flotte, nenne uns Datum und Gruppengröße und wir erledigen den Rest: Skipper, Treibstoff und Route entlang der schönsten Buchten. In der Hochsaison früh buchen!',
          'Elige un barco de nuestra flota, dinos tu fecha y el tamaño del grupo y nosotros hacemos el resto: patrón, combustible y ruta por las mejores calas. Reserva pronto en temporada alta.',
          'Choisissez un bateau de notre flotte, indiquez votre date et la taille du groupe, et nous gérons le reste : skipper, carburant et itinéraire le long des plus belles criques. Réservez tôt en haute saison.',
        ),
      },
      {
        q: L('Heb ik een vaarbewijs nodig of is er een schipper?', 'Do I need a licence or is a skipper included?', 'Brauche ich einen Bootsführerschein oder gibt es einen Skipper?', '¿Necesito licencia o hay patrón incluido?', 'Faut-il un permis ou un skipper est-il inclus ?'),
        a: L(
          'Geen vaarbewijs nodig: onze charters gaan standaard met een ervaren lokale schipper. Die kent elke baai en zorgt dat jij alleen maar hoeft te genieten.',
          'No licence needed: our charters come with an experienced local skipper as standard. They know every bay, so all you have to do is enjoy.',
          'Kein Führerschein nötig: Unsere Charter fahren standardmäßig mit einem erfahrenen lokalen Skipper. Er kennt jede Bucht — du musst nur genießen.',
          'No necesitas licencia: nuestros chárteres incluyen de serie un patrón local con experiencia. Conoce cada cala, así que tú solo disfruta.',
          'Pas besoin de permis : nos charters incluent d’office un skipper local expérimenté. Il connaît chaque crique — vous n’avez qu’à profiter.',
        ),
      },
      {
        q: L('Wat is inbegrepen bij een bootcharter?', 'What is included in a boat charter?', 'Was ist bei einem Bootscharter inbegriffen?', '¿Qué incluye un chárter de barco?', 'Que comprend une location de bateau ?'),
        a: L(
          'Standaard: de boot, schipper, verzekering en meestal brandstof voor de afgesproken route. Drankjes, snorkelsets, paddleboards of catering voegen we op verzoek toe — vraag naar de opties per boot.',
          'As standard: the boat, skipper, insurance and usually fuel for the agreed route. Drinks, snorkel sets, paddleboards or catering can be added on request — ask about the options per boat.',
          'Standard: Boot, Skipper, Versicherung und meist Treibstoff für die vereinbarte Route. Getränke, Schnorchelsets, Paddleboards oder Catering ergänzen wir auf Wunsch.',
          'De serie: el barco, el patrón, el seguro y normalmente el combustible de la ruta acordada. Bebidas, equipos de snorkel, paddle surf o catering se añaden bajo petición.',
          'En standard : le bateau, le skipper, l’assurance et généralement le carburant pour l’itinéraire convenu. Boissons, kits de snorkeling, paddles ou traiteur en option.',
        ),
      },
      {
        q: L('Hoe werkt een boat party op Ibiza?', 'How does an Ibiza boat party work?', 'Wie läuft eine Boat Party auf Ibiza ab?', '¿Cómo funciona una boat party en Ibiza?', 'Comment se déroule une boat party à Ibiza ?'),
        a: L(
          'Een boat party duurt meestal 3 à 4 uur: DJ aan boord, open bar, zwemstops in kristalhelder water en vaak gratis entree voor een club-afterparty. Tickets boek je gewoon online via onze agenda.',
          'A boat party usually lasts 3–4 hours: DJ on board, open bar, swim stops in crystal-clear water and often free entry to a club afterparty. Book tickets online via our calendar.',
          'Eine Boat Party dauert meist 3–4 Stunden: DJ an Bord, Open Bar, Badestopps im kristallklaren Wasser und oft freier Eintritt zur Club-Afterparty. Tickets buchst du online über unseren Kalender.',
          'Una boat party suele durar 3–4 horas: DJ a bordo, barra libre, paradas para nadar en aguas cristalinas y a menudo entrada gratis a una afterparty. Reserva online en nuestra agenda.',
          'Une boat party dure en général 3–4 heures : DJ à bord, open bar, pauses baignade en eau cristalline et souvent entrée gratuite à une afterparty en club. Réservez en ligne via notre agenda.',
        ),
      },
      {
        q: L('Hoe kom ik van Ibiza naar Formentera?', 'How do I get from Ibiza to Formentera?', 'Wie komme ich von Ibiza nach Formentera?', '¿Cómo llego de Ibiza a Formentera?', 'Comment aller d’Ibiza à Formentera ?'),
        a: L(
          'Met de ferry vanaf Ibiza-stad ben je er in ongeveer 30 minuten; boten varen de hele dag. Boek je tickets vooraf via onze site, of kies een dagtrip per catamaran met zwemstops onderweg.',
          'The ferry from Ibiza Town takes about 30 minutes, with departures all day. Book tickets in advance on our site, or choose a catamaran day trip with swim stops on the way.',
          'Die Fähre ab Ibiza-Stadt braucht etwa 30 Minuten, mit Abfahrten den ganzen Tag. Buche Tickets vorab auf unserer Seite — oder wähle einen Katamaran-Tagesausflug mit Badestopps.',
          'El ferry desde Ibiza ciudad tarda unos 30 minutos, con salidas todo el día. Reserva tus billetes por adelantado en nuestra web, o elige una excursión en catamarán con paradas para nadar.',
          'Le ferry depuis Ibiza-ville prend environ 30 minutes, avec des départs toute la journée. Réservez à l’avance sur notre site, ou optez pour une excursion en catamaran avec pauses baignade.',
        ),
      },
    ],
  },
  {
    id: 'island',
    title: L('Activiteiten & Eiland', 'Activities & Island', 'Aktivitäten & Insel', 'Actividades e Isla', 'Activités & Île'),
    items: [
      {
        q: L('Wat kan ik op Ibiza doen naast de clubs?', 'What can I do in Ibiza besides the clubs?', 'Was kann ich auf Ibiza außer den Clubs machen?', '¿Qué puedo hacer en Ibiza además de los clubs?', 'Que faire à Ibiza en dehors des clubs ?'),
        a: L(
          'Meer dan je denkt: jetski en watersport, quad- en buggytours, de grotten van Can Marçà, zonsondergang bij Es Vedrà, strandclubs en dagtrips naar Formentera. Alles is direct online te boeken via onze activiteiten-agenda.',
          'More than you think: jet ski and water sports, quad and buggy tours, the Can Marçà caves, sunset at Es Vedrà, beach clubs and day trips to Formentera. Everything books online via our activities calendar.',
          'Mehr als du denkst: Jetski und Wassersport, Quad- und Buggytouren, die Höhlen von Can Marçà, Sonnenuntergang am Es Vedrà, Beachclubs und Tagesausflüge nach Formentera. Alles online buchbar.',
          'Más de lo que crees: motos de agua y deportes acuáticos, rutas en quad y buggy, las cuevas de Can Marçà, el atardecer en Es Vedrà, beach clubs y excursiones a Formentera. Todo se reserva online.',
          'Plus que vous ne le pensez : jet ski et sports nautiques, tours en quad et buggy, les grottes de Can Marçà, le coucher de soleil à Es Vedrà, beach clubs et excursions à Formentera. Tout se réserve en ligne.',
        ),
      },
      {
        q: L('Wat is de beste tijd om naar Ibiza te gaan?', 'When is the best time to visit Ibiza?', 'Wann ist die beste Zeit für Ibiza?', '¿Cuál es la mejor época para ir a Ibiza?', 'Quelle est la meilleure période pour aller à Ibiza ?'),
        a: L(
          'Het clubseizoen loopt van mei (openings) tot oktober (closings). Juli en augustus zijn het drukst en duurst; juni en september combineren topweer met iets rustigere clubs en betere prijzen.',
          'The club season runs from May (openings) to October (closings). July and August are the busiest and priciest; June and September combine great weather with slightly calmer clubs and better prices.',
          'Die Clubsaison läuft von Mai (Openings) bis Oktober (Closings). Juli und August sind am vollsten und teuersten; Juni und September bieten Topwetter mit etwas ruhigeren Clubs und besseren Preisen.',
          'La temporada de clubs va de mayo (openings) a octubre (closings). Julio y agosto son los meses más llenos y caros; junio y septiembre combinan buen tiempo con clubs algo más tranquilos y mejores precios.',
          'La saison des clubs va de mai (openings) à octobre (closings). Juillet et août sont les plus chargés et les plus chers ; juin et septembre allient beau temps, clubs plus calmes et meilleurs prix.',
        ),
      },
      {
        q: L('Heb ik een auto of scooter nodig op Ibiza?', 'Do I need a car or scooter in Ibiza?', 'Brauche ich ein Auto oder einen Roller auf Ibiza?', '¿Necesito coche o moto en Ibiza?', 'Faut-il une voiture ou un scooter à Ibiza ?'),
        a: L(
          'Wil je verborgen baaien en het binnenland ontdekken, dan is een huurauto of scooter de moeite waard — taxi’s zijn schaars in het hoogseizoen. Via onze verhuurpagina regel je een auto of scooter tegen scherpe prijzen.',
          'If you want to explore hidden coves and the inland, a rental car or scooter is worth it — taxis are scarce in high season. Our rental page gets you a car or scooter at sharp prices.',
          'Wenn du versteckte Buchten und das Landesinnere entdecken willst, lohnt sich ein Mietwagen oder Roller — Taxis sind in der Hochsaison knapp. Über unsere Mietseite geht das zu fairen Preisen.',
          'Si quieres descubrir calas escondidas y el interior, merece la pena alquilar coche o moto — los taxis escasean en temporada alta. En nuestra página de alquiler tienes buenos precios.',
          'Pour explorer les criques cachées et l’intérieur de l’île, une voiture ou un scooter de location vaut le coup — les taxis sont rares en haute saison. Notre page location propose de bons prix.',
        ),
      },
    ],
  },
  {
    id: 'booking',
    title: L('Boeken & Betalen', 'Booking & Payment', 'Buchen & Bezahlen', 'Reservas y Pagos', 'Réservation & Paiement'),
    items: [
      {
        q: L('Hoe kan ik betalen en is dat veilig?', 'How can I pay and is it secure?', 'Wie kann ich bezahlen und ist das sicher?', '¿Cómo puedo pagar y es seguro?', 'Comment payer et est-ce sécurisé ?'),
        a: L(
          'Je betaalt via de beveiligde checkout van onze officiële partner ClubTickets, met de gangbare betaalmethoden zoals creditcard. Je gegevens worden versleuteld verwerkt — wij zien je betaalgegevens nooit.',
          'You pay through the secure checkout of our official partner ClubTickets, with common methods such as credit card. Your details are processed encrypted — we never see your payment data.',
          'Du zahlst über den sicheren Checkout unseres offiziellen Partners ClubTickets, mit gängigen Methoden wie Kreditkarte. Deine Daten werden verschlüsselt verarbeitet.',
          'Pagas a través del checkout seguro de nuestro socio oficial ClubTickets, con métodos habituales como tarjeta. Tus datos se procesan cifrados — nunca vemos tu información de pago.',
          'Vous payez via le checkout sécurisé de notre partenaire officiel ClubTickets, avec les moyens habituels comme la carte bancaire. Vos données sont chiffrées — nous ne les voyons jamais.',
        ),
      },
      {
        q: L('Hoe snel is mijn boeking bevestigd?', 'How fast is my booking confirmed?', 'Wie schnell ist meine Buchung bestätigt?', '¿Cuándo se confirma mi reserva?', 'Quand ma réservation est-elle confirmée ?'),
        a: L(
          'Tickets worden direct na betaling bevestigd en geleverd. Voor privéboten en maatwerk (VIP-tafels, groepen) bevestigen we meestal binnen een paar uur via WhatsApp of e-mail.',
          'Tickets are confirmed and delivered immediately after payment. Private boats and custom requests (VIP tables, groups) are usually confirmed within a few hours via WhatsApp or email.',
          'Tickets werden direkt nach der Zahlung bestätigt und geliefert. Privatboote und Sonderwünsche (VIP-Tische, Gruppen) bestätigen wir meist innerhalb weniger Stunden per WhatsApp oder E-Mail.',
          'Las entradas se confirman y entregan justo después del pago. Barcos privados y peticiones a medida (mesas VIP, grupos) se confirman normalmente en pocas horas por WhatsApp o correo.',
          'Les billets sont confirmés et livrés immédiatement après le paiement. Les bateaux privés et demandes sur mesure (tables VIP, groupes) sont confirmés en général sous quelques heures.',
        ),
      },
      {
        q: L('Hoe kan ik jullie bereiken?', 'How can I reach you?', 'Wie erreiche ich euch?', '¿Cómo puedo contactaros?', 'Comment vous contacter ?'),
        a: L(
          'Het snelst via WhatsApp — ons lokale team op Ibiza reageert vrijwel altijd binnen een uur, ook ’s avonds en in het weekend. Je vindt de WhatsApp-knop op elke pagina, of gebruik het contactformulier.',
          'Fastest via WhatsApp — our local team in Ibiza replies within the hour almost always, evenings and weekends included. The WhatsApp button is on every page, or use the contact form.',
          'Am schnellsten per WhatsApp — unser lokales Team auf Ibiza antwortet fast immer innerhalb einer Stunde, auch abends und am Wochenende. Der WhatsApp-Button ist auf jeder Seite.',
          'Lo más rápido es WhatsApp — nuestro equipo local en Ibiza responde casi siempre en menos de una hora, también por la noche y en fin de semana. El botón está en todas las páginas.',
          'Le plus rapide : WhatsApp — notre équipe locale à Ibiza répond presque toujours dans l’heure, soirs et week-ends compris. Le bouton WhatsApp est sur chaque page.',
        ),
      },
    ],
  },
]
