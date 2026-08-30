import type { Locale } from './seo'

// ── Sitewide FAQ content (5 locales) ───────────────────────────────────
// Rendered on /faq (grouped accordions + FAQPage JSON-LD) and, in condensed
// form, at the bottom of the homepage. Written for SEO: each answer naturally
// mentions the product and Ibiza search terms.
//
// HARD RULE — same guardrails as ./page-faq.ts. Every claim must be verifiable
// and true about our own operation. No invented opening hours, ticket prices,
// minimum ages, crossing times, durations, percentages or operator names.
// Where a real figure would belong, answer usefully without it and route the
// reader to WhatsApp, where we confirm the current rate or condition before
// booking. Nothing is ever described as free: guestlist and package terms
// differ per club, per night and per week, and are confirmed in advance.
// Being honest about what can go wrong is deliberate house style.

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export interface FaqItem { q: T; a: T }
export interface FaqGroup { id: string; title: T; items: FaqItem[] }

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'tickets',
    title: L('Clubtickets & Boeken', 'Club Tickets & Booking', 'Club-Tickets & Buchen', 'Entradas y Reservas', 'Billets de Clubs & Réservation'),
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
        q: L('Moet ik mijn ticket printen?', 'Do I need to print my ticket?', 'Muss ich mein Ticket ausdrucken?', '¿Tengo que imprimir mi entrada?', 'Dois-je imprimer mon billet ?'),
        a: L(
          'Nee, de QR-code op je telefoon is genoeg. Eén praktische tip: sla de code op als screenshot voordat je de deur uit gaat. Bij een volle club is het mobiele netwerk vaak traag, en dan wil je niet in de rij staan wachten tot je mailbox laadt.',
          'No, the QR code on your phone is enough. One practical tip: save it as a screenshot before you head out. Mobile coverage around a busy club is often slow, and you do not want to be standing in the queue waiting for your inbox to load.',
          'Nein, der QR-Code auf dem Handy reicht. Ein praktischer Tipp: Speichere ihn vorher als Screenshot. Rund um einen vollen Club ist das Netz oft langsam, und du willst nicht in der Schlange darauf warten, dass dein Postfach lädt.',
          'No, con el código QR en el móvil basta. Un consejo práctico: guárdalo como captura antes de salir. Alrededor de un club lleno la cobertura suele ir lenta y no querrás esperar en la cola a que cargue tu correo.',
          'Non, le QR code sur votre téléphone suffit. Un conseil pratique : enregistrez-le en capture d’écran avant de partir. Autour d’un club plein, le réseau est souvent lent, et vous ne voulez pas attendre le chargement de votre boîte mail dans la file.',
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
        q: L('Wat kost een clubticket op Ibiza?', 'What does an Ibiza club ticket cost?', 'Was kostet ein Club-Ticket auf Ibiza?', '¿Cuánto cuesta una entrada de club en Ibiza?', 'Combien coûte un billet de club à Ibiza ?'),
        a: L(
          'Daar bestaat geen vast tarief voor. De prijs hangt af van de club, welke artiest er draait, welke dag van de week het is en hoe ver in het seizoen je zit — een doordeweekse avond vroeg in mei is een heel ander verhaal dan een closing party met een grote naam. De actuele prijs staat altijd bij het event zelf in onze agenda, en dat is de prijs die je betaalt.',
          'There is no single going rate. What you pay depends on the club, who is playing, which night of the week it is and how deep into the season you are — a midweek night early in May is a completely different proposition to a closing party with a big name. The current price is always shown on the event itself in our calendar, and that is the price you pay.',
          'Einen festen Tarif gibt es nicht. Der Preis hängt vom Club ab, davon wer auflegt, welcher Wochentag es ist und wie weit die Saison fortgeschritten ist — ein Wochentag Anfang Mai ist etwas völlig anderes als eine Closing Party mit großem Namen. Der aktuelle Preis steht immer beim Event in unserem Kalender, und den zahlst du.',
          'No existe una tarifa única. El precio depende del club, de quién pincha, del día de la semana y del punto de la temporada — una noche entre semana a principios de mayo no tiene nada que ver con una closing con un nombre grande. El precio actual aparece siempre en el propio evento de nuestra agenda, y es el que pagas.',
          'Il n’existe pas de tarif unique. Le prix dépend du club, de l’artiste, du jour de la semaine et de l’avancement de la saison — une soirée en semaine début mai n’a rien à voir avec une closing party avec une grosse tête d’affiche. Le prix actuel figure toujours sur l’événement dans notre agenda, et c’est celui que vous payez.',
        ),
      },
      {
        q: L('Kunnen clubtickets uitverkopen?', 'Can Ibiza club tickets sell out?', 'Können Club-Tickets ausverkaufen?', '¿Se pueden agotar las entradas?', 'Les billets de club peuvent-ils être épuisés ?'),
        a: L(
          'Zeker. De meeste avonden houden tot laat kaarten over, maar zodra een gevierde naam op de line-up staat — of het gaat om een opening, een closing of een avond in augustus — kan een event dagen tot weken van tevoren dicht zijn. Wij kunnen dan niets meer toveren: is de club vol, dan is hij vol. Heb je één avond die echt niet mag mislukken, boek die dan als eerste en vul de rest van je week later in.',
          'They can. Most nights keep tickets available until late, but as soon as a celebrated name is on the line-up — or it is an opening, a closing or a night in August — an event can be shut days or even weeks in advance. At that point there is nothing we can conjure up: full is full. If there is one night that genuinely cannot fail, book that one first and fill in the rest of your week afterwards.',
          'Ja. An den meisten Abenden gibt es bis kurz vorher Tickets, aber sobald ein gefeierter Name im Line-up steht — oder es um ein Opening, ein Closing oder einen Abend im August geht — kann ein Event Tage oder Wochen vorher dicht sein. Dann können wir nichts mehr zaubern: voll ist voll. Gibt es einen Abend, der unbedingt klappen muss, buche den zuerst und plane den Rest der Woche danach.',
          'Sí. La mayoría de noches quedan entradas hasta última hora, pero en cuanto hay un nombre celebrado en el cartel — o se trata de una opening, una closing o una noche de agosto — un evento puede cerrarse días o semanas antes. Ahí ya no podemos hacer magia: lleno es lleno. Si hay una noche que no puede fallar, resérvala primero y completa el resto de la semana después.',
          'Oui. La plupart des soirées gardent des billets jusqu’au dernier moment, mais dès qu’un nom très attendu est à l’affiche — ou qu’il s’agit d’une opening, d’une closing ou d’une soirée d’août — un événement peut être complet des jours voire des semaines à l’avance. Là, nous ne pouvons rien inventer : complet, c’est complet. Si une soirée compte vraiment, réservez-la en premier et complétez la semaine ensuite.',
        ),
      },
      {
        q: L('Kan ik beter online kopen of aan de deur?', 'Is it better to buy online or at the door?', 'Kaufe ich besser online oder an der Tür?', '¿Es mejor comprar online o en la puerta?', 'Vaut-il mieux acheter en ligne ou à l’entrée ?'),
        a: L(
          'Online, in vrijwel alle gevallen. Je weet vooraf zeker dat je binnenkomt, je hebt een bewijs van aankoop en je staat niet in de rij bij een kassa die al gesloten kan zijn. Aan de deur kopen kan bij rustige avonden prima gaan, maar dan neem je twee risico’s tegelijk: uitverkoop en een hogere deurprijs.',
          'Online, in almost every case. You know in advance that you are getting in, you have proof of purchase, and you are not queueing at a box office that may already have closed. Buying at the door can work fine on a quiet night, but you are then taking two risks at once: a sell-out and a higher price on the door.',
          'Online, in fast allen Fällen. Du weißt vorher sicher, dass du reinkommst, hast einen Kaufbeleg und stehst nicht an einer Kasse, die schon zu sein kann. An der Tür zu kaufen funktioniert an ruhigen Abenden durchaus, aber du gehst zwei Risiken gleichzeitig ein: ausverkauft und ein höherer Türpreis.',
          'Online, en casi todos los casos. Sabes de antemano que entras, tienes un justificante de compra y no haces cola en una taquilla que quizá ya esté cerrada. Comprar en la puerta puede funcionar una noche tranquila, pero asumes dos riesgos a la vez: que se agote y que el precio en puerta sea más alto.',
          'En ligne, dans la quasi-totalité des cas. Vous savez à l’avance que vous entrez, vous avez une preuve d’achat et vous ne faites pas la queue devant une caisse peut-être déjà fermée. Acheter à l’entrée peut passer un soir calme, mais vous cumulez deux risques : la rupture et un tarif porte plus élevé.',
        ),
      },
      {
        q: L('Wanneer kan ik het beste boeken voor de scherpste prijs?', 'When should I book for the best price?', 'Wann buche ich am besten für den besten Preis?', '¿Cuándo conviene reservar para el mejor precio?', 'Quand réserver pour obtenir le meilleur prix ?'),
        a: L(
          'Als vuistregel: hoe eerder, hoe beter. Clubs verkopen hun goedkoopste categorie eerst en schuiven daarna op naar duurdere tarieven, dus wie wacht betaalt bijna altijd meer voor precies dezelfde avond. Wachten op een last-minute koopje werkt op Ibiza zelden in je voordeel. Houd daarnaast onze Deals van de Dag in de gaten — daar zetten we aanbiedingen neer zodra we ze binnenkrijgen.',
          'As a rule of thumb: the earlier the better. Clubs release their cheapest category first and move up through pricier tiers, so waiting almost always means paying more for exactly the same night. Holding out for a last-minute bargain rarely works in your favour in Ibiza. Keep an eye on our Deals of the Day as well — we post offers there the moment they reach us.',
          'Als Faustregel: je früher, desto besser. Clubs geben zuerst die günstigste Kategorie frei und rücken dann in teurere Stufen, wer wartet zahlt also fast immer mehr für exakt denselben Abend. Auf ein Last-Minute-Schnäppchen zu hoffen, geht auf Ibiza selten auf. Behalte außerdem unsere Tagesangebote im Blick — dort landen Angebote, sobald sie bei uns eintreffen.',
          'Como regla general: cuanto antes, mejor. Los clubs liberan primero su categoría más barata y van subiendo de tramo, así que esperar casi siempre significa pagar más por exactamente la misma noche. Confiar en el chollo de última hora rara vez sale bien en Ibiza. Vigila también nuestras Ofertas del Día — publicamos las promociones en cuanto nos llegan.',
          'Règle générale : le plus tôt est le mieux. Les clubs ouvrent d’abord leur catégorie la moins chère puis passent à des paliers supérieurs ; attendre revient donc presque toujours à payer plus pour exactement la même soirée. Miser sur la bonne affaire de dernière minute fonctionne rarement à Ibiza. Surveillez aussi nos Offres du Jour — nous y publions les promos dès qu’elles arrivent.',
        ),
      },
      {
        q: L('Ik ben mijn ticket kwijt — wat nu?', 'I lost my ticket — what now?', 'Ich habe mein Ticket verloren — was jetzt?', 'He perdido mi entrada, ¿qué hago?', 'J’ai perdu mon billet, que faire ?'),
        a: L(
          'Geen paniek: je ticket bestaat als een record in het systeem, niet alleen als die ene e-mail. Zoek eerst in je spam- en reclamemap, want daar belandt de bevestiging het vaakst. Vind je hem niet, app ons dan met het e-mailadres en de naam waarop je hebt geboekt, dan laten we hem opnieuw versturen. Doe dat op tijd — een uur voor de deur opengaat is het lastiger dan ’s middags.',
          'Do not panic: your ticket exists as a record in the system, not only as that one email. Check your spam and promotions folders first, because that is where the confirmation most often ends up. If it is not there, message us with the email address and the name you booked under and we will have it resent. Do that in good time — an hour before doors open is harder to sort than in the afternoon.',
          'Keine Panik: Dein Ticket existiert als Datensatz im System, nicht nur als diese eine E-Mail. Sieh zuerst im Spam- und Werbeordner nach, dort landet die Bestätigung am häufigsten. Findest du sie nicht, schreib uns mit der E-Mail-Adresse und dem Namen der Buchung, dann lassen wir sie erneut senden. Mach das rechtzeitig — eine Stunde vor Einlass ist es schwieriger als nachmittags.',
          'Sin pánico: tu entrada existe como registro en el sistema, no solo como ese correo. Mira primero en spam y en la carpeta de promociones, que es donde suele acabar la confirmación. Si no está, escríbenos con el correo y el nombre con los que reservaste y pedimos que te la reenvíen. Hazlo con tiempo — una hora antes de la apertura es más complicado que por la tarde.',
          'Pas de panique : votre billet existe comme enregistrement dans le système, pas seulement dans cet e-mail. Regardez d’abord dans les spams et les promotions, c’est là que la confirmation atterrit le plus souvent. Si elle n’y est pas, écrivez-nous avec l’adresse e-mail et le nom de la réservation et nous la faisons renvoyer. Faites-le à temps — une heure avant l’ouverture, c’est plus compliqué que dans l’après-midi.',
        ),
      },
      {
        q: L('Kan ik in één keer tickets voor meerdere avonden boeken?', 'Can I book tickets for several nights at once?', 'Kann ich Tickets für mehrere Abende auf einmal buchen?', '¿Puedo reservar entradas para varias noches a la vez?', 'Puis-je réserver plusieurs soirées en une fois ?'),
        a: L(
          'Ja. Elk event boek je apart, zodat je per avond de juiste datum en categorie kiest, maar je kunt ze gerust achter elkaar afrekenen. Plan je een hele week, geef ons dan je aankomst- en vertrekdatum door via WhatsApp — dan kijken we mee welke avonden op elkaar aansluiten en waar het slim is om een dag rust in te bouwen.',
          'Yes. Each event is booked separately so you pick the right date and category per night, but you can happily check out one after another. If you are planning a whole week, send us your arrival and departure dates on WhatsApp — we will look at which nights work well back to back and where it is smart to build in a day off.',
          'Ja. Jedes Event wird einzeln gebucht, damit du pro Abend Datum und Kategorie richtig wählst, aber du kannst sie problemlos nacheinander bezahlen. Planst du eine ganze Woche, schick uns Anreise- und Abreisedatum per WhatsApp — wir schauen mit, welche Abende gut aufeinander folgen und wo ein Ruhetag sinnvoll ist.',
          'Sí. Cada evento se reserva por separado para que elijas bien la fecha y la categoría de cada noche, pero puedes pagarlos uno tras otro sin problema. Si planeas una semana entera, mándanos por WhatsApp tus fechas de llegada y salida — miramos qué noches encajan seguidas y dónde conviene dejar un día de descanso.',
          'Oui. Chaque événement se réserve séparément pour choisir la bonne date et la bonne catégorie, mais vous pouvez enchaîner les paiements. Si vous préparez une semaine entière, envoyez-nous vos dates d’arrivée et de départ sur WhatsApp — nous regardons quelles soirées s’enchaînent bien et où il est malin de prévoir une journée de repos.',
        ),
      },
    ],
  },
  {
    id: 'entry',
    title: L('Entree, Dresscode & Deurbeleid', 'Entry, Dress Code & Door Policy', 'Einlass, Dresscode & Türpolitik', 'Entrada, Vestimenta y Puerta', 'Entrée, Dress Code & Politique de Porte'),
    items: [
      {
        q: L('Hoe laat gaan de clubs op Ibiza open en dicht?', 'What time do Ibiza clubs open and close?', 'Wann öffnen und schließen die Clubs auf Ibiza?', '¿A qué hora abren y cierran los clubs de Ibiza?', 'À quelle heure ouvrent et ferment les clubs d’Ibiza ?'),
        a: L(
          'Ibiza draait laat: een clubavond komt pas echt op gang als de rest van Europa naar bed gaat, en loopt door tot in de ochtend. Exacte tijden verschillen per club, per avond en per moment in het seizoen, en dagclubs en beachclubs hanteren een compleet ander ritme. De tijden die de club zelf publiceert staan bij het event in onze agenda — wil je het zeker weten voordat je een taxi plant, vraag het ons dan even via WhatsApp.',
          'Ibiza runs late: a club night only really gets going when the rest of Europe is going to bed, and carries on into the morning. Exact times differ per club, per night and per point in the season, and day clubs and beach clubs work to a completely different rhythm. The times the club itself publishes are shown on the event in our calendar — if you want certainty before you plan a taxi, just ask us on WhatsApp.',
          'Ibiza läuft spät: Ein Clubabend kommt erst in Fahrt, wenn der Rest Europas ins Bett geht, und zieht sich bis in den Morgen. Genaue Zeiten unterscheiden sich je nach Club, Abend und Saisonphase, und Dayclubs und Beachclubs folgen einem völlig anderen Rhythmus. Die vom Club selbst veröffentlichten Zeiten stehen beim Event in unserem Kalender — willst du sicher sein, bevor du ein Taxi planst, frag uns kurz per WhatsApp.',
          'Ibiza va tarde: una noche de club arranca de verdad cuando el resto de Europa se va a dormir, y sigue hasta la mañana. Los horarios exactos varían según el club, la noche y el momento de la temporada, y los day clubs y beach clubs siguen otro ritmo completamente distinto. Los horarios que publica el propio club aparecen en el evento de nuestra agenda — si quieres certeza antes de organizar un taxi, pregúntanos por WhatsApp.',
          'Ibiza vit tard : une soirée en club ne démarre vraiment que quand le reste de l’Europe se couche, et se prolonge jusqu’au matin. Les horaires exacts varient selon le club, la soirée et le moment de la saison, et les day clubs et beach clubs suivent un rythme tout autre. Les horaires publiés par le club figurent sur l’événement dans notre agenda — pour en avoir le cœur net avant de prévoir un taxi, demandez-nous sur WhatsApp.',
        ),
      },
      {
        q: L('Geldt er een minimumleeftijd voor de clubs?', 'Is there a minimum age for the clubs?', 'Gibt es ein Mindestalter für die Clubs?', '¿Hay edad mínima para los clubs?', 'Y a-t-il un âge minimum pour les clubs ?'),
        a: L(
          'Ja. Clubs op Ibiza hanteren een wettelijke leeftijdsgrens en controleren daar aan de deur streng op; sommige venues en bepaalde avonden liggen daar nog strikter in dan andere. Omdat dit per club kan verschillen, noemen we hier geen getal dat morgen achterhaald is — laat ons weten naar welke club je wilt, dan checken we de actuele regel voor die avond. Reist er iemand jong mee, regel dat vóór je boekt in plaats van erop te gokken.',
          'Yes. Ibiza clubs apply a legal age limit and check it strictly on the door; some venues and certain nights are stricter still. Because it can differ per club, we would rather not print a number here that is out of date tomorrow — tell us which club you have in mind and we will check the current rule for that night. If someone young is travelling with you, sort this out before you book rather than gambling on it.',
          'Ja. Clubs auf Ibiza haben eine gesetzliche Altersgrenze und kontrollieren sie am Eingang streng; manche Venues und bestimmte Abende sind noch strenger. Da es sich je nach Club unterscheiden kann, nennen wir hier keine Zahl, die morgen überholt ist — sag uns, welcher Club es sein soll, und wir prüfen die aktuelle Regel für den Abend. Reist jemand Junges mit, klärt das vor der Buchung, statt darauf zu setzen.',
          'Sí. Los clubs de Ibiza aplican un límite legal de edad y lo comprueban con rigor en la puerta; algunos locales y ciertas noches son aún más estrictos. Como puede variar según el club, preferimos no poner aquí una cifra que mañana esté desfasada — dinos qué club te interesa y comprobamos la norma vigente para esa noche. Si viaja alguien joven, resuélvelo antes de reservar en vez de jugártela.',
          'Oui. Les clubs d’Ibiza appliquent une limite d’âge légale et la contrôlent strictement à l’entrée ; certains lieux et certaines soirées le sont encore davantage. Comme cela peut varier d’un club à l’autre, nous préférons ne pas afficher ici un chiffre périmé demain — dites-nous quel club vous visez et nous vérifions la règle en vigueur pour cette soirée. Si un jeune voyage avec vous, réglez-le avant de réserver plutôt que de tenter votre chance.',
        ),
      },
      {
        q: L('Welk identiteitsbewijs moet ik meenemen?', 'What ID do I need at the door?', 'Welchen Ausweis brauche ich am Eingang?', '¿Qué documento necesito en la puerta?', 'Quelle pièce d’identité faut-il à l’entrée ?'),
        a: L(
          'Een geldig, fysiek identiteitsbewijs met foto: paspoort of ID-kaart. Een foto op je telefoon, een kopie of een rijbewijs uit een land buiten de EU wordt lang niet overal geaccepteerd, en aan de deur discussiëren heeft weinig zin. Neem het mee ook als je er ouder uitziet — de portier vraagt erom wanneer hij dat wil, niet wanneer het logisch lijkt.',
          'A valid physical photo ID: passport or national ID card. A photo on your phone, a photocopy or a driving licence from outside the EU is not accepted everywhere, and arguing on the door gets you nowhere. Bring it even if you look older — security asks when they choose to, not when it seems logical.',
          'Ein gültiger, physischer Lichtbildausweis: Reisepass oder Personalausweis. Ein Foto auf dem Handy, eine Kopie oder ein Führerschein von außerhalb der EU wird längst nicht überall akzeptiert, und Diskutieren am Eingang bringt nichts. Nimm ihn mit, auch wenn du älter aussiehst — der Türsteher fragt, wann er will, nicht wann es logisch wirkt.',
          'Un documento físico con foto en vigor: pasaporte o DNI. Una foto en el móvil, una fotocopia o un carné de conducir de fuera de la UE no se aceptan en todas partes, y discutir en la puerta no sirve de nada. Llévalo aunque aparentes más edad — el portero pregunta cuando quiere, no cuando parece lógico.',
          'Une pièce d’identité physique et valide avec photo : passeport ou carte d’identité. Une photo sur le téléphone, une photocopie ou un permis de conduire hors UE ne passent pas partout, et discuter à l’entrée ne sert à rien. Prenez-la même si vous faites plus vieux — la sécurité demande quand elle le décide, pas quand cela paraît logique.',
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
        q: L('Wat betekent “entree vóór een bepaald tijdstip” op mijn ticket?', 'What does “entry before a certain time” on my ticket mean?', 'Was bedeutet „Einlass vor einer bestimmten Uhrzeit“ auf meinem Ticket?', '¿Qué significa “entrada antes de cierta hora” en mi entrada?', 'Que signifie « entrée avant une certaine heure » sur mon billet ?'),
        a: L(
          'Dat je ticket alleen geldig is als je vóór dat moment daadwerkelijk binnen bent — niet als je op dat moment pas in de rij aansluit. Het is een korting op de vroege uren, en die vervalt zodra de klok voorbij is; je hoeft dan meestal het normale tarief bij te betalen of je komt er niet mee in. Reken dus met de rij, met de taxirit en met vrienden die nog “vijf minuten” nodig hebben. Wie op de valreep aankomt, verliest het voordeel waarvoor hij juist betaalde.',
          'It means your ticket is only valid if you are actually inside before that moment — not if you join the queue at it. It is a discount on the early hours, and it lapses the second the clock passes; you will usually have to pay the difference to the standard rate, or the ticket simply will not get you in. So allow for the queue, the taxi ride and the friends who need "five more minutes". Turning up on the dot loses you exactly the advantage you paid for.',
          'Dass dein Ticket nur gilt, wenn du vor diesem Zeitpunkt wirklich drin bist — nicht, wenn du dich dann erst anstellst. Es ist ein Rabatt auf die frühen Stunden, und der verfällt, sobald die Uhr weiter ist; meist musst du auf den Normalpreis nachzahlen, oder du kommst damit gar nicht rein. Kalkuliere also Schlange, Taxifahrt und Freunde ein, die noch „fünf Minuten“ brauchen. Wer auf den Punkt ankommt, verliert genau den Vorteil, für den er bezahlt hat.',
          'Significa que tu entrada solo vale si estás dentro antes de esa hora — no si te pones en la cola justo entonces. Es un descuento por las horas tempranas y caduca en cuanto pasa el reloj; normalmente tendrás que pagar la diferencia hasta la tarifa normal, o directamente no entras con ella. Cuenta con la cola, con el taxi y con los amigos que necesitan "cinco minutos más". Llegar justo pierde exactamente la ventaja que pagaste.',
          'Cela signifie que votre billet n’est valable que si vous êtes réellement à l’intérieur avant cette heure — pas si vous rejoignez la file à ce moment-là. C’est une remise sur les heures précoces, et elle tombe dès que l’heure est passée : il faudra en général régler la différence jusqu’au tarif normal, ou le billet ne vous fera tout simplement pas entrer. Prévoyez donc la file, le taxi et les amis qui ont besoin de « cinq minutes ». Arriver pile vous fait perdre l’avantage même que vous avez payé.',
        ),
      },
      {
        q: L('Kan de deur mij weigeren, ook met een geldig ticket?', 'Can the door refuse me even with a valid ticket?', 'Kann mir der Einlass trotz gültigem Ticket verweigert werden?', '¿Pueden negarme la entrada aun con entrada válida?', 'Peut-on me refuser l’entrée avec un billet valable ?'),
        a: L(
          'Ja, en dat is eerlijk gezegd het enige deel van je avond waar wij geen invloed op hebben. Een club mag zelf beslissen wie er binnenkomt: bij duidelijke dronkenschap, agressie, kleding die niet door de beugel kan of geen geldig ID sta je buiten, ticket of niet, en daar volgt geen restitutie op. In de praktijk gebeurt dit zelden bij mensen die normaal doen. Zorg dat je nuchter genoeg de deur passeert; ná de deur is er alle tijd.',
          'Yes, and honestly that is the one part of your night we have no control over. A club decides who comes in: visible drunkenness, aggression, clothing that does not pass or no valid ID leaves you outside, ticket or no ticket, and no refund follows. In practice this rarely happens to people who behave normally. Make sure you get through the door sober enough; after the door there is plenty of time.',
          'Ja, und ehrlich gesagt ist das der einzige Teil deines Abends, auf den wir keinen Einfluss haben. Ein Club entscheidet selbst, wer reinkommt: sichtbare Betrunkenheit, Aggression, unpassende Kleidung oder kein gültiger Ausweis, und du bleibst draußen — Ticket hin oder her, ohne Erstattung. In der Praxis passiert das Leuten, die sich normal verhalten, selten. Komm nüchtern genug durch die Tür; danach ist Zeit genug.',
          'Sí, y sinceramente es la única parte de tu noche sobre la que no tenemos control. El club decide quién entra: embriaguez evidente, actitud agresiva, ropa que no pasa el filtro o falta de documento válido y te quedas fuera, con entrada o sin ella, y sin reembolso. En la práctica rara vez le ocurre a quien se comporta con normalidad. Pasa la puerta lo bastante sobrio; después hay tiempo de sobra.',
          'Oui, et c’est honnêtement la seule partie de votre soirée sur laquelle nous n’avons aucune prise. Un club décide qui entre : ivresse manifeste, agressivité, tenue qui ne passe pas ou absence de pièce d’identité valable, et vous restez dehors, billet ou pas, sans remboursement. Dans les faits, cela arrive rarement à des gens qui se tiennent bien. Franchissez la porte suffisamment sobre ; après, vous aurez tout le temps.',
        ),
      },
      {
        q: L('Wat is het verschil tussen standaard entree en VIP?', 'What is the difference between standard entry and VIP?', 'Was ist der Unterschied zwischen Standard-Eintritt und VIP?', '¿Qué diferencia hay entre entrada estándar y VIP?', 'Quelle est la différence entre entrée standard et VIP ?'),
        a: L(
          'Standaard entree geeft je toegang tot de club en de dansvloer, verder niets — je zoekt zelf een plek en haalt je drankjes aan de bar. VIP draait om ruimte: een gereserveerde tafel of zone met eigen zitplek, bediening en zicht op de booth, meestal met een minimale besteding aan flessen in plaats van een losse toegangsprijs. Voor twee mensen is dat zelden de moeite; voor een groep die toch de hele avond drinkt, valt het verrassend vaak mee.',
          'Standard entry gets you into the club and onto the dancefloor, and that is it — you find your own spot and get your drinks at the bar. VIP is about space: a reserved table or area with your own seating, table service and a view of the booth, usually built around a minimum spend on bottles rather than a straight entry price. For two people it is rarely worth it; for a group that is going to drink all night anyway, the maths works out more often than you would think.',
          'Standard-Eintritt bringt dich in den Club und auf die Tanzfläche, mehr nicht — du suchst dir selbst einen Platz und holst Getränke an der Bar. Bei VIP geht es um Raum: ein reservierter Tisch oder Bereich mit eigenem Sitzplatz, Service und Blick auf die Booth, meist mit einem Mindestumsatz an Flaschen statt eines reinen Eintrittspreises. Für zwei Personen lohnt sich das selten; für eine Gruppe, die ohnehin den ganzen Abend trinkt, überraschend oft.',
          'La entrada estándar te mete en el club y en la pista, y poco más — buscas sitio y pides en la barra. El VIP va de espacio: mesa o zona reservada con asiento propio, servicio y visión de la cabina, normalmente con un consumo mínimo en botellas en lugar de un precio de entrada suelto. Para dos personas rara vez compensa; para un grupo que va a beber toda la noche, sale mejor de lo que parece.',
          'L’entrée standard vous fait entrer dans le club et sur le dancefloor, point — vous trouvez votre place et commandez au bar. Le VIP, c’est de l’espace : table ou zone réservée avec assises, service et vue sur la cabine, généralement construit autour d’un minimum de consommation en bouteilles plutôt que d’un prix d’entrée. À deux, cela vaut rarement le coup ; pour un groupe qui va boire toute la nuit, le calcul tombe plus souvent juste qu’on ne croit.',
        ),
      },
      {
        q: L('Mag ik de club tussendoor verlaten en weer naar binnen?', 'Can I leave the club and come back in?', 'Darf ich den Club zwischendurch verlassen und wieder rein?', '¿Puedo salir del club y volver a entrar?', 'Puis-je sortir du club et revenir ?'),
        a: L(
          'Meestal niet: veel clubs op Ibiza werken met eenmalige toegang, dus wie naar buiten loopt om een frisse neus te halen, staat opnieuw in de rij of komt er helemaal niet meer in. Sommige venues met buitenterrassen zijn soepeler. Ga er niet vanuit dat het mag — regel je jas, je sigaretten en je afspraken met de groep vóór je naar binnen gaat.',
          'Usually not: many Ibiza clubs run single entry, so stepping outside for fresh air means queueing again, or not getting back in at all. Some venues with outdoor terraces are more relaxed about it. Do not assume it is allowed — sort out your jacket, your cigarettes and your meeting points with the group before you go in.',
          'Meist nicht: Viele Clubs auf Ibiza arbeiten mit einmaligem Einlass, wer also kurz an die Luft geht, steht wieder in der Schlange oder kommt gar nicht mehr rein. Manche Venues mit Außenterrassen handhaben das lockerer. Geh nicht davon aus, dass es erlaubt ist — kläre Jacke, Zigaretten und Treffpunkte mit der Gruppe vorher.',
          'Normalmente no: muchos clubs de Ibiza funcionan con entrada única, así que salir a tomar el aire implica volver a la cola o no entrar más. Algunos locales con terraza son más flexibles. No des por hecho que se puede — resuelve chaqueta, tabaco y puntos de encuentro con el grupo antes de entrar.',
          'En général non : beaucoup de clubs d’Ibiza fonctionnent en entrée unique ; sortir prendre l’air signifie refaire la queue, voire ne pas rentrer du tout. Certains lieux avec terrasse sont plus souples. Ne partez pas du principe que c’est possible — réglez veste, cigarettes et points de rendez-vous avant d’entrer.',
        ),
      },
    ],
  },
]
