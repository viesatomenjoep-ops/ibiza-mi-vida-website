import type { Metadata } from 'next'
import Link from 'next/link'
import { staticMetadata } from '@/lib/seo-pages'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { Reveal } from '@/components/ui/Reveal'

export const revalidate = 86400

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'ibiza-tips')
}

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const KICKER: T = L('Insider-gids', 'Insider guide', 'Insider-Guide', 'Guía local', 'Guide d’initiés')
const TITLE: T = L('Ibiza Tips', 'Ibiza Tips', 'Ibiza Tipps', 'Consejos de Ibiza', 'Conseils Ibiza')
const INTRO: T = L(
  'Ibiza is zóveel meer dan clubs alleen. Ons team woont op het eiland en deelt hier alles wat we zelf aan vrienden vertellen: de mooiste baaien, de beste avonden, waar je eet, hoe je reist en wanneer je moet komen.',
  'Ibiza is so much more than clubs alone. Our team lives on the island and shares everything we tell our own friends: the finest coves, the best nights, where to eat, how to get around and when to come.',
  'Ibiza ist so viel mehr als nur Clubs. Unser Team lebt auf der Insel und teilt hier alles, was wir selbst Freunden erzählen: die schönsten Buchten, die besten Nächte, wo man isst, wie man reist und wann man kommen sollte.',
  'Ibiza es mucho más que clubs. Nuestro equipo vive en la isla y comparte todo lo que contamos a nuestros propios amigos: las mejores calas, las mejores noches, dónde comer, cómo moverte y cuándo venir.',
  'Ibiza, c’est bien plus que des clubs. Notre équipe vit sur l’île et partage tout ce que nous racontons à nos propres amis : les plus belles criques, les meilleures soirées, où manger, comment se déplacer et quand venir.',
)

interface TipSection {
  title: T
  intro: T
  tips: T[]
  cta?: { label: T; href: string }
}

const SECTIONS: TipSection[] = [
  {
    title: L('Stranden & verborgen baaien', 'Beaches & hidden coves', 'Strände & versteckte Buchten', 'Playas y calas escondidas', 'Plages & criques cachées'),
    intro: L(
      'De westkust heeft het helderste water en de mooiste zonsondergangen. Ga vroeg — de bekendste baaien zijn in juli en augustus rond het middaguur vol.',
      'The west coast has the clearest water and the finest sunsets. Go early — the best-known coves fill up by noon in July and August.',
      'Die Westküste hat das klarste Wasser und die schönsten Sonnenuntergänge. Geh früh — die bekanntesten Buchten sind im Juli und August gegen Mittag voll.',
      'La costa oeste tiene el agua más clara y los mejores atardeceres. Ve temprano — las calas más conocidas se llenan a mediodía en julio y agosto.',
      'La côte ouest a l’eau la plus claire et les plus beaux couchers de soleil. Partez tôt — les criques connues sont pleines à midi en juillet-août.',
    ),
    tips: [
      L('Cala Comte — misschien wel het mooiste water van de Balearen, met uitzicht op de eilandjes voor de kust.', 'Cala Comte — arguably the finest water in the Balearics, looking out over the offshore islets.', 'Cala Comte — vielleicht das schönste Wasser der Balearen, mit Blick auf die vorgelagerten Inselchen.', 'Cala Comte — posiblemente el agua más bonita de Baleares, con vistas a los islotes.', 'Cala Comte — sans doute la plus belle eau des Baléares, face aux îlots au large.'),
      L('Cala d’Hort — zwemmen met vol zicht op het mystieke rotseiland Es Vedrà. Blijf voor de zonsondergang.', 'Cala d’Hort — swim with a full view of the mystical rock of Es Vedrà. Stay for sunset.', 'Cala d’Hort — schwimmen mit vollem Blick auf den mystischen Felsen Es Vedrà. Bleib bis zum Sonnenuntergang.', 'Cala d’Hort — nada con vistas al místico islote de Es Vedrà. Quédate al atardecer.', 'Cala d’Hort — nagez face au rocher mystique d’Es Vedrà. Restez pour le coucher du soleil.'),
      L('Cala Salada & Saladeta — twee baaien naast elkaar; klim het pad over de rotsen naar de rustigere Saladeta.', 'Cala Salada & Saladeta — two coves side by side; take the path over the rocks to the quieter Saladeta.', 'Cala Salada & Saladeta — zwei Buchten nebeneinander; nimm den Felsenpfad zur ruhigeren Saladeta.', 'Cala Salada y Saladeta — dos calas juntas; toma el sendero sobre las rocas hasta la más tranquila Saladeta.', 'Cala Salada & Saladeta — deux criques côte à côte ; prenez le sentier sur les rochers vers la plus calme Saladeta.'),
      L('Benirràs — kom op zondag voor de beroemde trommelsessies bij zonsondergang.', 'Benirràs — come on Sunday for the famous sunset drum circles.', 'Benirràs — komm am Sonntag zu den berühmten Trommelsessions bei Sonnenuntergang.', 'Benirràs — ven el domingo a los famosos tambores al atardecer.', 'Benirràs — venez le dimanche pour les célèbres tambours au coucher du soleil.'),
    ],
  },
  {
    title: L('Clubs & nachtleven', 'Clubs & nightlife', 'Clubs & Nachtleben', 'Clubs y vida nocturna', 'Clubs & vie nocturne'),
    intro: L(
      'Het clubseizoen loopt van de openings in mei tot de closings in oktober. Elke wereldclub heeft vaste avonden — plan je week rond de dj’s die je écht wilt zien.',
      'The club season runs from the openings in May to the closings in October. Every world-class club has fixed nights — plan your week around the DJs you really want to see.',
      'Die Clubsaison läuft von den Openings im Mai bis zu den Closings im Oktober. Jeder Weltclub hat feste Abende — plane deine Woche um die DJs, die du wirklich sehen willst.',
      'La temporada va de los openings de mayo a los closings de octubre. Cada gran club tiene noches fijas — planifica tu semana según los DJs que de verdad quieres ver.',
      'La saison des clubs va des openings de mai aux closings d’octobre. Chaque grand club a ses soirées fixes — planifiez votre semaine selon les DJs à ne pas rater.',
    ),
    tips: [
      L('Koop tickets vooraf online — aan de deur betaal je vaak meer én loop je het risico op uitverkocht.', 'Buy tickets online in advance — at the door you often pay more and risk a sold-out night.', 'Kauf Tickets vorab online — an der Tür zahlst du oft mehr und riskierst eine ausverkaufte Nacht.', 'Compra las entradas online por adelantado — en puerta pagas más y te arriesgas al sold out.', 'Achetez vos billets en ligne à l’avance — à la porte, c’est souvent plus cher et parfois complet.'),
      L('Combineer een dagclub (Ushuaïa, O Beach) met een nachtclub — powernap ertussen is de lokale standaard.', 'Combine a day club (Ushuaïa, O Beach) with a night club — a power nap in between is the local standard.', 'Kombiniere einen Dayclub (Ushuaïa, O Beach) mit einem Nachtclub — ein Powernap dazwischen ist Insel-Standard.', 'Combina un club de día (Ushuaïa, O Beach) con uno de noche — la siesta entre medias es lo habitual aquí.', 'Combinez un club de jour (Ushuaïa, O Beach) et un club de nuit — la sieste entre les deux est la norme locale.'),
      L('Clubs openen laat: vóór 01:00 is het rustig. Eet eerst lang en goed, ga daarna pas los.', 'Clubs start late: before 1 AM it’s quiet. Have a long, good dinner first, then go all in.', 'Die Clubs starten spät: vor 1 Uhr ist wenig los. Iss erst lang und gut, dann geht’s los.', 'Los clubs empiezan tarde: antes de la 01:00 está tranquilo. Cena largo y bien primero.', 'Les clubs démarrent tard : avant 1 h, c’est calme. Dînez longuement d’abord, puis lâchez-vous.'),
      L('Op de gastenlijst van een club? Dat regelen wij gratis via WhatsApp.', 'Want to be on a club’s guestlist? We arrange that for free via WhatsApp.', 'Auf die Gästeliste eines Clubs? Das regeln wir gratis per WhatsApp.', '¿Quieres entrar en la lista de un club? Lo gestionamos gratis por WhatsApp.', 'Envie d’être sur la guestlist d’un club ? On s’en occupe gratuitement via WhatsApp.'),
    ],
    cta: { label: L('Bekijk de clubagenda', 'See the club calendar', 'Zum Clubkalender', 'Ver la agenda de clubs', 'Voir l’agenda des clubs'), href: '/calendar' },
  },
  {
    title: L('Eten & drinken', 'Eat & drink', 'Essen & Trinken', 'Comer y beber', 'Manger & boire'),
    intro: L(
      'Van paella met je voeten in het zand tot fine dining in de oude stad — op Ibiza eet je overal goed, als je weet waar.',
      'From paella with your feet in the sand to fine dining in the old town — you eat well everywhere on Ibiza, if you know where.',
      'Von Paella mit den Füßen im Sand bis Fine Dining in der Altstadt — auf Ibiza isst man überall gut, wenn man weiß wo.',
      'De la paella con los pies en la arena a la alta cocina en el casco antiguo — en Ibiza se come bien en todas partes, si sabes dónde.',
      'De la paella les pieds dans le sable au fine dining dans la vieille ville — on mange bien partout à Ibiza, quand on sait où.',
    ),
    tips: [
      L('Eet paella op z’n Spaans: als lange lunch aan zee, niet als diner. Reserveer in het hoogseizoen altijd.', 'Eat paella the Spanish way: as a long seaside lunch, not dinner. Always book ahead in high season.', 'Iss Paella auf Spanisch: als langes Mittagessen am Meer, nicht als Abendessen. In der Hochsaison immer reservieren.', 'Come la paella a la española: como comida larga junto al mar, no como cena. Reserva siempre en temporada alta.', 'Mangez la paella à l’espagnole : long déjeuner en bord de mer, pas au dîner. Réservez toujours en haute saison.'),
      L('Dwaal door Dalt Vila (UNESCO-werelderfgoed) en eet in een van de restaurantjes binnen de stadsmuren.', 'Wander through Dalt Vila (UNESCO World Heritage) and eat at one of the little restaurants inside the walls.', 'Schlendere durch Dalt Vila (UNESCO-Welterbe) und iss in einem der kleinen Restaurants innerhalb der Mauern.', 'Pasea por Dalt Vila (Patrimonio de la Humanidad) y come en uno de los restaurantes dentro de las murallas.', 'Flânez dans Dalt Vila (patrimoine UNESCO) et mangez dans un petit restaurant à l’intérieur des remparts.'),
      L('Hippiemarkten Las Dalias (zaterdag) en Punta Arabí (woensdag): streetfood, live muziek en de leukste souvenirs.', 'Hippy markets Las Dalias (Saturday) and Punta Arabí (Wednesday): street food, live music and the best souvenirs.', 'Hippiemärkte Las Dalias (Samstag) und Punta Arabí (Mittwoch): Streetfood, Livemusik und die schönsten Souvenirs.', 'Mercadillos hippies Las Dalias (sábado) y Punta Arabí (miércoles): street food, música en vivo y los mejores recuerdos.', 'Marchés hippies Las Dalias (samedi) et Punta Arabí (mercredi) : street food, musique live et les plus beaux souvenirs.'),
      L('Proef lokale klassiekers: bullit de peix (visstoofpot), sobrasada en hierbas ibicencas als digestief.', 'Try the local classics: bullit de peix (fish stew), sobrasada, and hierbas ibicencas as a digestif.', 'Probiere die lokalen Klassiker: Bullit de Peix (Fischeintopf), Sobrasada und Hierbas Ibicencas als Digestif.', 'Prueba los clásicos locales: bullit de peix, sobrasada y hierbas ibicencas de digestivo.', 'Goûtez aux classiques locaux : bullit de peix (ragoût de poisson), sobrasada et hierbas ibicencas en digestif.'),
    ],
  },
  {
    title: L('De mooiste zonsondergangen', 'The finest sunsets', 'Die schönsten Sonnenuntergänge', 'Los mejores atardeceres', 'Les plus beaux couchers de soleil'),
    intro: L(
      'De zonsondergang is op Ibiza een dagelijks ritueel. Kies je plek: met muziek aan de boulevard, in stilte bij Es Vedrà, of vanaf het water.',
      'Sunset is a daily ritual on Ibiza. Pick your spot: with music on the strip, in silence at Es Vedrà, or from the water.',
      'Der Sonnenuntergang ist auf Ibiza ein tägliches Ritual. Wähle deinen Platz: mit Musik an der Promenade, in Stille am Es Vedrà oder vom Wasser aus.',
      'El atardecer es un ritual diario en Ibiza. Elige tu sitio: con música en el paseo, en silencio junto a Es Vedrà o desde el mar.',
      'Le coucher de soleil est un rituel quotidien à Ibiza. Choisissez votre spot : en musique sur le front de mer, en silence à Es Vedrà, ou depuis la mer.',
    ),
    tips: [
      L('De sunset strip van San Antonio (Café del Mar, Café Mambo): dj’s draaien de zon letterlijk onder.', 'San Antonio’s sunset strip (Café del Mar, Café Mambo): DJs literally play the sun down.', 'Die Sunset-Strip von San Antonio (Café del Mar, Café Mambo): DJs spielen die Sonne buchstäblich unter.', 'El sunset strip de San Antonio (Café del Mar, Café Mambo): los DJs despiden el sol con música.', 'Le sunset strip de San Antonio (Café del Mar, Café Mambo) : les DJs accompagnent le soleil en musique.'),
      L('Het uitkijkpunt boven Cala d’Hort: Es Vedrà kleurt goud — de meest gefotografeerde plek van het eiland.', 'The viewpoint above Cala d’Hort: Es Vedrà turns gold — the most photographed spot on the island.', 'Der Aussichtspunkt über Cala d’Hort: Es Vedrà färbt sich golden — der meistfotografierte Ort der Insel.', 'El mirador sobre Cala d’Hort: Es Vedrà se tiñe de oro — el lugar más fotografiado de la isla.', 'Le belvédère au-dessus de Cala d’Hort : Es Vedrà se pare d’or — le lieu le plus photographié de l’île.'),
      L('Mooiste van allemaal: een sunset cruise. Champagne, zwemstop en de zon die in zee zakt.', 'Best of all: a sunset cruise. Champagne, a swim stop and the sun sinking into the sea.', 'Am schönsten: eine Sunset-Cruise. Champagner, Badestopp und die Sonne, die im Meer versinkt.', 'Lo mejor de todo: un crucero al atardecer. Champán, parada para nadar y el sol hundiéndose en el mar.', 'Le must : une croisière au coucher du soleil. Champagne, pause baignade et le soleil qui plonge dans la mer.'),
    ],
    cta: { label: L('Boek een sunset cruise', 'Book a sunset cruise', 'Sunset-Cruise buchen', 'Reserva un crucero al atardecer', 'Réserver une croisière sunset'), href: '/boat-trip' },
  },
  {
    title: L('Vervoer: zo kom je rond', 'Getting around', 'Unterwegs auf der Insel', 'Cómo moverte', 'Se déplacer'),
    intro: L(
      'Ibiza is klein (40 km van top tot teen) maar taxi’s zijn schaars in het hoogseizoen. Wie mobiel is, ziet het échte eiland.',
      'Ibiza is small (40 km top to bottom) but taxis are scarce in high season. Being mobile is how you see the real island.',
      'Ibiza ist klein (40 km von oben bis unten), aber Taxis sind in der Hochsaison knapp. Wer mobil ist, sieht die echte Insel.',
      'Ibiza es pequeña (40 km de punta a punta) pero los taxis escasean en temporada alta. Con tu propio vehículo ves la isla de verdad.',
      'Ibiza est petite (40 km du nord au sud) mais les taxis sont rares en haute saison. Être mobile, c’est voir la vraie île.',
    ),
    tips: [
      L('Huur een auto of scooter voor minstens een paar dagen — de verborgen baaien bereik je niet met de bus.', 'Rent a car or scooter for at least a few days — the hidden coves can’t be reached by bus.', 'Miete für mindestens ein paar Tage ein Auto oder einen Roller — die versteckten Buchten erreichst du nicht mit dem Bus.', 'Alquila coche o moto al menos unos días — a las calas escondidas no llega el autobús.', 'Louez une voiture ou un scooter au moins quelques jours — les criques cachées sont inaccessibles en bus.'),
      L('Naar de clubs? De Discobus rijdt in het seizoen de hele nacht tussen de hotspots voor een paar euro.', 'Going clubbing? The Discobus runs all night between the hotspots in season for a few euros.', 'Zum Feiern? Der Discobus fährt in der Saison die ganze Nacht zwischen den Hotspots — für ein paar Euro.', '¿De fiesta? El Discobus circula toda la noche entre los puntos clave en temporada por pocos euros.', 'Pour sortir ? Le Discobus circule toute la nuit entre les hotspots en saison, pour quelques euros.'),
      L('Parkeer nooit in de berm bij de baaien — boetes zijn hoog. Ga vroeg voor een echte parkeerplaats.', 'Never park on the verge near the coves — fines are steep. Go early to get a real parking spot.', 'Parke nie am Straßenrand bei den Buchten — die Strafen sind hoch. Fahr früh los für einen echten Parkplatz.', 'Nunca aparques en el arcén junto a las calas — las multas son altas. Llega temprano para una plaza de verdad.', 'Ne vous garez jamais sur le bas-côté près des criques — les amendes sont salées. Partez tôt pour une vraie place.'),
    ],
    cta: { label: L('Auto & scooter huren', 'Rent a car or scooter', 'Auto & Roller mieten', 'Alquilar coche o moto', 'Louer voiture ou scooter'), href: '/car-scooter-rental' },
  },
  {
    title: L('Formentera & op het water', 'Formentera & on the water', 'Formentera & auf dem Wasser', 'Formentera y el mar', 'Formentera & sur l’eau'),
    intro: L(
      'Het buureiland Formentera voelt als de Caraïben van Europa — en het mooiste van Ibiza zie je sowieso vanaf het water.',
      'Neighbouring Formentera feels like the Caribbean of Europe — and the best of Ibiza is seen from the water anyway.',
      'Die Nachbarinsel Formentera fühlt sich an wie die Karibik Europas — und das Schönste von Ibiza sieht man ohnehin vom Wasser aus.',
      'La vecina Formentera parece el Caribe de Europa — y lo mejor de Ibiza se ve, de todos modos, desde el mar.',
      'L’île voisine de Formentera, c’est les Caraïbes de l’Europe — et le plus beau d’Ibiza se voit de toute façon depuis la mer.',
    ),
    tips: [
      L('Ses Illetes op Formentera staat steevast in de lijstjes van mooiste stranden van Europa — terecht.', 'Ses Illetes on Formentera is a fixture on Europe’s best-beach lists — deservedly so.', 'Ses Illetes auf Formentera steht fest auf den Listen der schönsten Strände Europas — zu Recht.', 'Ses Illetes en Formentera está siempre entre las mejores playas de Europa — con razón.', 'Ses Illetes à Formentera figure toujours parmi les plus belles plages d’Europe — à juste titre.'),
      L('De ferry doet er maar ± 30 minuten over; huur op Formentera een fiets of scooter bij de haven.', 'The ferry takes only ± 30 minutes; rent a bike or scooter at the port on Formentera.', 'Die Fähre braucht nur ± 30 Minuten; miete auf Formentera ein Fahrrad oder einen Roller am Hafen.', 'El ferry tarda solo ± 30 minutos; alquila bici o moto en el puerto de Formentera.', 'Le ferry ne prend que ± 30 minutes ; louez un vélo ou un scooter au port de Formentera.'),
      L('Met een groep? Een privéboot met schipper is per persoon vaak verrassend betaalbaar — en onvergetelijk.', 'With a group? A private boat with skipper is often surprisingly affordable per person — and unforgettable.', 'Mit einer Gruppe? Ein Privatboot mit Skipper ist pro Person oft überraschend günstig — und unvergesslich.', '¿En grupo? Un barco privado con patrón sale a menudo sorprendentemente barato por persona — e inolvidable.', 'En groupe ? Un bateau privé avec skipper revient souvent étonnamment abordable par personne — et inoubliable.'),
    ],
    cta: { label: L('Ferry naar Formentera', 'Ferry to Formentera', 'Fähre nach Formentera', 'Ferry a Formentera', 'Ferry vers Formentera'), href: '/ferry-formentera' },
  },
  {
    title: L('Insider-tips van ons team', 'Insider tips from our team', 'Insider-Tipps von unserem Team', 'Consejos de nuestro equipo', 'Les conseils de notre équipe'),
    intro: L(
      'De kleine dingen die je vakantie maken — geleerd in jaren wonen en werken op het eiland.',
      'The small things that make your trip — learned over years of living and working on the island.',
      'Die kleinen Dinge, die deinen Urlaub ausmachen — gelernt in Jahren des Lebens und Arbeitens auf der Insel.',
      'Los pequeños detalles que hacen tu viaje — aprendidos en años viviendo y trabajando en la isla.',
      'Les petits détails qui font le séjour — appris en des années à vivre et travailler sur l’île.',
    ),
    tips: [
      L('Juni en september zijn de gouden maanden: topweer, alle clubs open, maar rustiger en goedkoper dan augustus.', 'June and September are the golden months: great weather, every club open, yet calmer and cheaper than August.', 'Juni und September sind die goldenen Monate: Topwetter, alle Clubs offen, aber ruhiger und günstiger als der August.', 'Junio y septiembre son los meses de oro: buen tiempo, todos los clubs abiertos, pero más tranquilo y barato que agosto.', 'Juin et septembre sont les mois en or : super météo, tous les clubs ouverts, mais plus calme et moins cher qu’en août.'),
      L('Leef op eilandritme: laat ontbijt, siësta, diner om 22:00, club om 01:00. Vechten tegen dat ritme verlies je.', 'Live on island rhythm: late breakfast, siesta, dinner at 10 PM, club at 1 AM. Fight that rhythm and you lose.', 'Leb im Inselrhythmus: spätes Frühstück, Siesta, Abendessen um 22 Uhr, Club um 1 Uhr. Gegen diesen Rhythmus verlierst du.', 'Vive al ritmo de la isla: desayuno tarde, siesta, cena a las 22:00, club a la 01:00. Contra ese ritmo, pierdes.', 'Vivez au rythme de l’île : petit-déj tardif, sieste, dîner à 22 h, club à 1 h. Luttez contre ce rythme et vous perdez.'),
      L('Neem contant geld mee voor de hippiemarkten en strandbarretjes — niet overal kun je pinnen.', 'Bring cash for the hippy markets and little beach bars — not everywhere takes cards.', 'Nimm Bargeld mit für die Hippiemärkte und kleinen Strandbars — nicht überall kann man mit Karte zahlen.', 'Lleva efectivo para los mercadillos y chiringuitos — no en todos aceptan tarjeta.', 'Prenez du liquide pour les marchés hippies et les petits bars de plage — la carte n’est pas acceptée partout.'),
      L('Twijfel je over iets? App ons gewoon — wij wonen hier en antwoorden meestal binnen het uur.', 'Unsure about anything? Just message us — we live here and usually reply within the hour.', 'Bei Fragen: Schreib uns einfach — wir leben hier und antworten meist innerhalb einer Stunde.', '¿Dudas con algo? Escríbenos — vivimos aquí y solemos responder en menos de una hora.', 'Un doute ? Écrivez-nous — nous vivons ici et répondons en général dans l’heure.'),
    ],
    cta: { label: L('Kom op de gastenlijst', 'Get on the guestlist', 'Auf die Gästeliste', 'Entra en la lista', 'Rejoindre la guestlist'), href: '/guestlist' },
  },
]

const OUTRO_TITLE: T = L('Zelf meemaken?', 'Ready to experience it?', 'Selbst erleben?', '¿Listo para vivirlo?', 'Prêt à le vivre ?')
const OUTRO_TEXT: T = L(
  'Tickets, boten, activiteiten en de gastenlijst — alles regel je op één plek, met ons team op het eiland als achtervang.',
  'Tickets, boats, activities and the guestlist — arrange everything in one place, with our on-island team as your backup.',
  'Tickets, Boote, Aktivitäten und die Gästeliste — alles an einem Ort, mit unserem Team auf der Insel im Rücken.',
  'Entradas, barcos, actividades y la lista — todo en un solo lugar, con nuestro equipo en la isla como respaldo.',
  'Billets, bateaux, activités et guestlist — tout au même endroit, avec notre équipe sur l’île en soutien.',
)
const OUTRO_CTA: T = L('Bekijk de agenda', 'View the calendar', 'Zum Kalender', 'Ver la agenda', 'Voir l’agenda')

export default function TipsPage({ params }: { params: { locale: string } }) {
  const locale = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const base = `/${locale}`

  return (
    <div className="bg-white text-neutral-900 min-h-screen">
      {/* ── Hero ── */}
      <section className="pt-[calc(var(--nav-h)+40px)] pb-12 px-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{KICKER[locale]}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl font-black tracking-tight">{TITLE[locale]}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-neutral-500">{INTRO[locale]}</p>
      </section>

      {/* ── Sections ── */}
      <div className="mx-auto max-w-3xl px-4 pb-4">
        {SECTIONS.map((s, i) => (
          <Reveal key={i} className="mb-14">
            <div className="mb-4 flex items-baseline gap-4">
              <span className="font-serif text-4xl font-black text-black/10">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="font-serif text-2xl md:text-3xl font-black tracking-tight">{s.title[locale]}</h2>
            </div>
            <p className="mb-5 text-base leading-relaxed text-neutral-600">{s.intro[locale]}</p>
            <ul className="flex flex-col gap-3">
              {s.tips.map((tip, j) => (
                <li key={j} className="flex items-start gap-3.5 rounded-2xl border border-black/8 bg-neutral-50 p-4">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/12 text-[11px] font-black text-gold ring-1 ring-gold/25">★</span>
                  <span className="text-[15px] leading-relaxed text-neutral-700">{tip[locale]}</span>
                </li>
              ))}
            </ul>
            {s.cta && (
              <Link
                href={`${base}${s.cta.href}`}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-serif text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-gold"
              >
                {s.cta.label[locale]} →
              </Link>
            )}
          </Reveal>
        ))}
      </div>

      {/* ── Outro CTA ── */}
      <section className="relative overflow-hidden bg-obsidian py-16 md:py-20 text-center text-white">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]" />
        <div className="relative mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight">{OUTRO_TITLE[locale]}</h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/65">{OUTRO_TEXT[locale]}</p>
          <Link
            href={`${base}/calendar`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-serif text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white"
          >
            {OUTRO_CTA[locale]}
          </Link>
        </div>
      </section>
    </div>
  )
}
