import type { Locale } from './seo'

// ── Venue background, keyed by venue slug (5 locales) ─────────────────────
// Rendered on the venue detail template below the existing content. A sibling
// of ./sailing-routes.ts and ./page-faq.ts and bound by the same guardrails,
// plus one that matters especially here.
//
// HARD RULE — NO DATES. No founding years, no opening years, no "since 19xx",
// no former names unless the change is universally known, no capacities, no
// prices, no ownership claims we are not sure of. A wrong founding year is
// exactly the sort of statement an answer engine repeats forever, and the
// island's clubbing history is full of near-misses: venues that changed name,
// changed site, closed and reopened. Where a fact is genuinely well
// established it is stated plainly; where it is not, it is simply left out and
// the paragraph says something true instead.
//
// What IS safe and is what these paragraphs lean on: where a venue physically
// is, what kind of space it occupies (open-air, indoor, poolside, theatre),
// what it is known for musically or as an experience, and how it relates to
// the rest of the island. Those are stable and observable.
//
// Venues deliberately NOT covered: several clubbing venues in the data set are
// omitted because we could not write about them without guessing. Rendering
// nothing is correct — the component returns null for an unknown slug.
//
// Every entry carries one honest note, in the spirit of the sailing routes.
// Do not edit those out.

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export type ClubHistory = {
  /** What the venue is and where it sits. */
  what: T
  /** What it is known for. */
  known: T
  /** How it fits into the island as a whole. */
  fits: T
  /** One honest limitation or caveat. */
  note: T
}

export const HISTORY_HEADING: T = L(
  'De achtergrond van deze locatie',
  'The story behind this venue',
  'Die Geschichte dieser Location',
  'La historia de este local',
  'L’histoire de ce lieu',
)

export const HISTORY_LABELS = {
  known: L('Waar het om bekendstaat', 'What it is known for', 'Wofür es bekannt ist', 'Por lo que se conoce', 'Ce pour quoi il est connu'),
  fits: L('Plek op het eiland', 'Where it fits on the island', 'Rolle auf der Insel', 'Su lugar en la isla', 'Sa place sur l’île'),
  note: L('Eerlijk erbij', 'Honest note', 'Ehrlich dazu', 'Con honestidad', 'En toute franchise'),
}

export const HISTORY_DISCLAIMER: T = L(
  'Deze achtergrond is beschrijvend en bewust zonder jaartallen: programmering, openingsdagen en concepten veranderen per seizoen, en de actuele agenda hierboven is leidend. Wij zijn geen eigenaar van deze locatie.',
  'This background is descriptive and deliberately carries no years: programming, opening days and concepts change every season, and the live schedule above is what counts. We do not own or operate this venue.',
  'Dieser Hintergrund ist beschreibend und bewusst ohne Jahreszahlen: Programm, Öffnungstage und Konzepte ändern sich jede Saison, maßgeblich ist der Live-Kalender oben. Wir sind nicht Betreiber dieser Location.',
  'Este contexto es descriptivo y va deliberadamente sin años: la programación, los días de apertura y los conceptos cambian cada temporada, y manda la agenda en directo de arriba. No somos propietarios de este local.',
  'Ce contexte est descriptif et volontairement sans dates : la programmation, les jours d’ouverture et les concepts changent chaque saison, et c’est l’agenda en direct ci-dessus qui fait foi. Nous ne sommes pas l’exploitant de ce lieu.',
)

export const CLUB_HISTORY: Record<string, ClubHistory> = {
  'hi-ibiza': {
    what: L(
      'Een grote indoor club aan Playa d’en Bossa, tegenover het strand en op loopafstand van de hotels aan die kant. De club is opgedeeld in twee hoofdruimtes met een eigen karakter — een grote hoofdzaal en een tweede, ruwere ruimte — plus kleinere hoeken waar de programmering losser is.',
      'A large indoor club on Playa d’en Bossa, across from the beach and within walking distance of the hotels on that side. It is split into two main rooms with distinct characters — a big principal space and a second, rawer one — plus smaller corners where the programming runs looser.',
      'Ein großer Indoor-Club an der Playa d’en Bossa, gegenüber dem Strand und zu Fuß von den Hotels auf dieser Seite erreichbar. Er ist in zwei Haupträume mit eigenem Charakter geteilt — einen großen Hauptsaal und einen zweiten, raueren — dazu kleinere Ecken mit lockererer Programmierung.',
      'Un club grande y cubierto en Playa d’en Bossa, frente a la playa y a pie de los hoteles de esa zona. Está dividido en dos salas principales con carácter propio — una sala grande y otra más cruda — más rincones menores donde la programación va más suelta.',
      'Un grand club couvert à Playa d’en Bossa, face à la plage et à pied des hôtels de ce secteur. Il est divisé en deux salles principales au caractère distinct — une grande salle et une seconde plus brute — plus de petits recoins à la programmation plus libre.',
    ),
    known: L(
      'Voor grote residencies met internationale namen en voor productie: licht, geluid en visuals horen tot het meest uitgesproken van het eiland. De club staat al meerdere jaren bovenaan de internationale clubpeilingen, wat op Ibiza zelf net zo goed als discussiepunt geldt als als compliment.',
      'For big-name residencies and for production: the lighting, sound and visuals are among the most pronounced on the island. It has stood at the top of the international club polls for several years running — something that on Ibiza itself functions as much as a talking point as a compliment.',
      'Für Residencies mit großen Namen und für Produktion: Licht, Sound und Visuals gehören zum Ausgeprägtesten der Insel. Der Club steht seit mehreren Jahren an der Spitze der internationalen Club-Umfragen — auf Ibiza selbst ebenso Diskussionsstoff wie Kompliment.',
      'Por sus residencias con nombres internacionales y por la producción: luz, sonido y visuales están entre lo más marcado de la isla. Lleva varios años encabezando las encuestas internacionales de clubs, algo que en la propia Ibiza funciona tanto como debate como cumplido.',
      'Pour ses résidences à grands noms et pour sa production : lumière, son et visuels comptent parmi les plus marqués de l’île. Il figure depuis plusieurs années en tête des sondages internationaux de clubs — ce qui, à Ibiza même, sert autant de sujet de débat que de compliment.',
    ),
    fits: L(
      'Playa d’en Bossa is de strook waar de dag en de nacht in elkaar overlopen: overdag ligbedden en poolclubs, ’s nachts de grote zalen. Hï staat aan het einde van die keten en is voor veel bezoekers de laatste stop van een dag die op het strand begon.',
      'Playa d’en Bossa is the strip where the day and the night run into each other: sunbeds and pool clubs by day, the big rooms after dark. Hï sits at the end of that chain and is, for a lot of visitors, the last stop of a day that started on the beach.',
      'Die Playa d’en Bossa ist der Abschnitt, an dem Tag und Nacht ineinander übergehen: tagsüber Liegen und Poolclubs, nachts die großen Säle. Hï steht am Ende dieser Kette und ist für viele die letzte Station eines Tages, der am Strand begann.',
      'Playa d’en Bossa es el tramo donde el día y la noche se solapan: hamacas y pool clubs de día, las salas grandes de noche. Hï está al final de esa cadena y es, para mucha gente, la última parada de un día que empezó en la playa.',
      'Playa d’en Bossa est la bande où le jour et la nuit se confondent : transats et pool clubs en journée, grandes salles la nuit. Hï se situe au bout de cette chaîne et constitue, pour beaucoup, la dernière étape d’une journée commencée sur la plage.',
    ),
    note: L(
      'Op de drukste avonden van juli en augustus is de rij lang en zit de hoofdzaal vol; wie ruimte wil om te dansen, komt vroeger of wijkt uit naar de tweede ruimte. De programmering wisselt per seizoen — de agenda hierboven is leidend, niet wat je vorig jaar zag.',
      'On the busiest nights in July and August the queue is long and the main room is packed; anyone who wants room to dance comes earlier or moves to the second space. Programming changes every season — the schedule above is what counts, not what you saw last year.',
      'An den vollsten Abenden im Juli und August ist die Schlange lang und der Hauptsaal voll; wer Platz zum Tanzen will, kommt früher oder weicht in den zweiten Raum aus. Das Programm wechselt jede Saison — maßgeblich ist der Kalender oben, nicht das, was du letztes Jahr gesehen hast.',
      'En las noches más llenas de julio y agosto la cola es larga y la sala principal va apretada; quien quiera espacio para bailar llega antes o se pasa a la segunda sala. La programación cambia cada temporada: manda la agenda de arriba, no lo que viste el año pasado.',
      'Les soirs les plus chargés de juillet et août, la file est longue et la salle principale bondée ; qui veut de la place pour danser arrive plus tôt ou passe dans la seconde salle. La programmation change chaque saison — c’est l’agenda ci-dessus qui fait foi, pas ce que vous avez vu l’an dernier.',
    ),
  },

  'ushuaia-ibiza': {
    what: L(
      'Een openluchtlocatie aan Playa d’en Bossa, waar het podium naast het zwembad van het gelijknamige hotel staat. Je kijkt vanaf het water, vanaf het gras of vanaf de hotelbalkons naar de show — een opzet die je verder op het eiland nergens zo tegenkomt.',
      'An open-air venue on Playa d’en Bossa where the stage stands beside the pool of the hotel of the same name. You watch from the water, from the grass or from the hotel balconies — a set-up you will not find anywhere else on the island.',
      'Eine Open-Air-Location an der Playa d’en Bossa, deren Bühne neben dem Pool des gleichnamigen Hotels steht. Man schaut vom Wasser, von der Wiese oder von den Hotelbalkonen zu — eine Anordnung, die es sonst nirgends auf der Insel gibt.',
      'Un recinto al aire libre en Playa d’en Bossa donde el escenario está junto a la piscina del hotel del mismo nombre. Se mira desde el agua, desde el césped o desde los balcones del hotel — un montaje que no existe igual en ningún otro sitio de la isla.',
      'Un lieu en plein air à Playa d’en Bossa dont la scène jouxte la piscine de l’hôtel du même nom. On regarde depuis l’eau, depuis la pelouse ou depuis les balcons de l’hôtel — un dispositif qu’on ne retrouve nulle part ailleurs sur l’île.',
    ),
    known: L(
      'Voor feesten die bij daglicht beginnen en rond zonsondergang hun hoogtepunt hebben, met grote namen op een podium in plaats van in een dj-booth. Het is de plek die het beeld van “Ibiza overdag” voor een groot publiek heeft bepaald.',
      'For parties that start in daylight and peak around sunset, with big names on a stage rather than in a DJ booth. It is the place that shaped the image of "daytime Ibiza" for a mass audience.',
      'Für Partys, die bei Tageslicht beginnen und um den Sonnenuntergang ihren Höhepunkt haben, mit großen Namen auf einer Bühne statt in einer DJ-Booth. Es ist der Ort, der das Bild von „Ibiza bei Tag“ für ein großes Publikum geprägt hat.',
      'Por fiestas que empiezan a la luz del día y culminan hacia el atardecer, con grandes nombres en un escenario y no en una cabina. Es el sitio que fijó la imagen del “Ibiza de día” para el gran público.',
      'Pour des soirées qui commencent en plein jour et culminent au coucher du soleil, avec de grands noms sur une scène plutôt qu’en cabine. C’est le lieu qui a façonné l’image de « l’Ibiza de jour » pour le grand public.',
    ),
    fits: L(
      'Ushuaïa en de grote indoor clubs aan dezelfde strook vullen elkaar aan in plaats van te concurreren: de middag en de avond hier, de nacht aan de overkant. Voor veel bezoekers is dat één doorlopende dag.',
      'Ushuaïa and the big indoor clubs on the same strip complement rather than compete: the afternoon and evening here, the night across the road. For many visitors that is one continuous day.',
      'Ushuaïa und die großen Indoor-Clubs am selben Abschnitt ergänzen sich, statt zu konkurrieren: Nachmittag und Abend hier, die Nacht gegenüber. Für viele ist das ein einziger durchgehender Tag.',
      'Ushuaïa y los grandes clubs cubiertos del mismo tramo se complementan en vez de competir: aquí la tarde y el atardecer, la noche enfrente. Para mucha gente eso es un solo día continuo.',
      'Ushuaïa et les grands clubs couverts de la même bande se complètent plutôt qu’ils ne se concurrencent : l’après-midi et la soirée ici, la nuit en face. Pour beaucoup, c’est une seule journée continue.',
    ),
    note: L(
      'Het is buiten, en dat merk je: overdag is er weinig schaduw en bij regen of harde wind kan een show worden aangepast of verplaatst. Neem zonbescherming mee en reken erop dat de beste plekken vroeg bezet zijn.',
      'It is outdoors, and you feel it: there is little shade during the day, and in rain or strong wind a show can be adjusted or moved. Bring sun protection and expect the best spots to be taken early.',
      'Es ist draußen, und das merkt man: tagsüber gibt es wenig Schatten, und bei Regen oder starkem Wind kann eine Show angepasst oder verlegt werden. Nimm Sonnenschutz mit und rechne damit, dass die besten Plätze früh belegt sind.',
      'Es al aire libre, y se nota: de día hay poca sombra y con lluvia o viento fuerte un show puede ajustarse o trasladarse. Lleva protección solar y cuenta con que los mejores sitios se ocupan pronto.',
      'C’est en plein air, et cela se sent : peu d’ombre en journée, et par pluie ou vent fort un show peut être adapté ou déplacé. Prévoyez une protection solaire et attendez-vous à ce que les meilleures places partent tôt.',
    ),
  },

  'unvrs-ibiza': {
    what: L(
      'De nieuwste grootschalige club van het eiland, aan de zuidkant bij Playa d’en Bossa. Het is een overdekte zaal die vanaf de tekentafel is opgezet rond productie: een centrale dansvloer met de installatie erboven in plaats van een podium aan één kant.',
      'The island’s newest large-scale club, on the south side near Playa d’en Bossa. It is an indoor room designed from the drawing board around production: a central dancefloor with the rig overhead rather than a stage at one end.',
      'Der neueste großformatige Club der Insel, im Süden nahe der Playa d’en Bossa. Ein überdachter Saal, vom Reißbrett an um Produktion herum konzipiert: eine zentrale Tanzfläche mit der Anlage darüber statt einer Bühne an einer Seite.',
      'El club de gran formato más nuevo de la isla, en el sur cerca de Playa d’en Bossa. Es una sala cubierta pensada desde el papel en torno a la producción: una pista central con la instalación encima en vez de un escenario a un lado.',
      'Le club grand format le plus récent de l’île, au sud près de Playa d’en Bossa. C’est une salle couverte conçue dès le départ autour de la production : une piste centrale avec le dispositif au-dessus plutôt qu’une scène à une extrémité.',
    ),
    known: L(
      'Voor schaal en techniek. Waar oudere clubs op het eiland zijn gegroeid uit een bestaand gebouw, is dit vanaf nul ontworpen voor licht, geluid en beeld — het is de meest technologische zaal van Ibiza en wordt ook zo gepresenteerd.',
      'For scale and technology. Where older clubs on the island grew out of an existing building, this one was designed from nothing for light, sound and image — it is Ibiza’s most technology-forward room and is presented as such.',
      'Für Größe und Technik. Wo ältere Clubs der Insel aus einem bestehenden Gebäude gewachsen sind, wurde dieser von Grund auf für Licht, Sound und Bild entworfen — der technologischste Saal Ibizas, und so wird er auch präsentiert.',
      'Por escala y tecnología. Donde los clubs más antiguos de la isla crecieron dentro de un edificio existente, este se diseñó desde cero para luz, sonido e imagen — la sala más tecnológica de Ibiza, y así se presenta.',
      'Pour l’échelle et la technique. Là où les clubs plus anciens de l’île sont nés d’un bâtiment existant, celui-ci a été conçu de zéro pour la lumière, le son et l’image — la salle la plus technologique d’Ibiza, et elle est présentée comme telle.',
    ),
    fits: L(
      'Het versterkt de zuidkant van het eiland als het zwaartepunt van het grote clubben, tegenover de kleinere, oudere zalen in Sant Antoni en Ibiza-stad die het van sfeer en geschiedenis moeten hebben.',
      'It reinforces the south of the island as the centre of gravity for large-scale clubbing, as against the smaller, older rooms in Sant Antoni and Ibiza Town that trade on atmosphere and history instead.',
      'Er verstärkt den Süden der Insel als Schwerpunkt des großen Clubbings — im Gegensatz zu den kleineren, älteren Sälen in Sant Antoni und Ibiza-Stadt, die von Atmosphäre und Geschichte leben.',
      'Refuerza el sur de la isla como centro de gravedad del clubbing de gran formato, frente a las salas más pequeñas y antiguas de Sant Antoni e Ibiza ciudad, que viven del ambiente y de la historia.',
      'Il renforce le sud de l’île comme centre de gravité du clubbing grand format, face aux salles plus petites et plus anciennes de Sant Antoni et d’Ibiza-ville qui misent sur l’ambiance et l’histoire.',
    ),
    note: L(
      'Als nieuwste zaal is de programmering hier nog het minst uitgekristalliseerd; ga af op de agenda hierboven en niet op wat je erover hebt gehoord. En het is een grote ruimte — wie kleine, intieme clubs zoekt, zit hier verkeerd.',
      'As the newest room its programming is still the least settled; go by the schedule above rather than by what you have heard about it. And it is a big space — anyone looking for a small, intimate club is in the wrong place.',
      'Als neuester Saal ist die Programmierung hier am wenigsten gefestigt; richte dich nach dem Kalender oben und nicht nach dem, was du gehört hast. Und es ist ein großer Raum — wer kleine, intime Clubs sucht, ist hier falsch.',
      'Al ser la sala más nueva, su programación es la menos asentada; guíate por la agenda de arriba y no por lo que hayas oído. Y es un espacio grande: quien busque un club pequeño e íntimo se equivoca de sitio.',
      'Étant la salle la plus récente, sa programmation est la moins stabilisée ; fiez-vous à l’agenda ci-dessus plutôt qu’à ce qu’on vous a raconté. Et c’est un grand espace — qui cherche un club petit et intime se trompe d’endroit.',
    ),
  },

  'eden-ibiza': {
    what: L(
      'Een overdekte club in Sant Antoni, aan de kant van de baai en op korte loopafstand van het uitgaansgebied van het dorp. Eén grote zaal met een hoog plafond, waar de dansvloer het middelpunt is en niet de tafels eromheen.',
      'An indoor club in Sant Antoni, on the bay side and a short walk from the town’s nightlife area. One large room with a high ceiling, where the dancefloor is the centre of things rather than the tables around it.',
      'Ein überdachter Club in Sant Antoni, auf der Buchtseite und wenige Gehminuten vom Ausgehviertel des Ortes entfernt. Ein großer Saal mit hoher Decke, in dem die Tanzfläche im Mittelpunkt steht und nicht die Tische ringsum.',
      'Un club cubierto en Sant Antoni, del lado de la bahía y a poca distancia de la zona de marcha del pueblo. Una sala grande de techo alto donde el centro es la pista y no las mesas de alrededor.',
      'Un club couvert à Sant Antoni, côté baie et à quelques minutes à pied du quartier festif du village. Une grande salle au plafond haut, où la piste est le centre et non les tables autour.',
    ),
    known: L(
      'Voor stevige, rechttoe rechtaan dancemuziek en voor een publiek dat er is om te dansen. Samen met de club aan de overkant van de straat vormt het al lang de kern van het uitgaan in Sant Antoni.',
      'For solid, no-nonsense dance music and for a crowd that is there to dance. Together with the club across the street it has long formed the core of going out in Sant Antoni.',
      'Für kräftige, geradlinige Dance-Musik und für ein Publikum, das zum Tanzen da ist. Zusammen mit dem Club auf der anderen Straßenseite bildet er seit Langem den Kern des Ausgehens in Sant Antoni.',
      'Por música dance contundente y directa y por un público que va a bailar. Junto con el club de enfrente lleva mucho formando el núcleo de la noche en Sant Antoni.',
      'Pour une musique dance franche et directe, et pour un public venu danser. Avec le club d’en face, il forme depuis longtemps le cœur des sorties à Sant Antoni.',
    ),
    fits: L(
      'Sant Antoni is de betaalbaardere, jongere kant van het clubben op Ibiza, met de zonsondergangbars aan de ene kant van de baai en de clubs aan de andere. Eden hoort bij die tweede helft van de avond.',
      'Sant Antoni is the more affordable, younger side of Ibiza clubbing, with the sunset bars on one side of the bay and the clubs on the other. Eden belongs to that second half of the evening.',
      'Sant Antoni ist die günstigere, jüngere Seite des Clubbings auf Ibiza, mit den Sunset-Bars auf der einen Seite der Bucht und den Clubs auf der anderen. Eden gehört zur zweiten Hälfte des Abends.',
      'Sant Antoni es el lado más asequible y joven del clubbing ibicenco, con los bares de atardecer a un lado de la bahía y los clubs al otro. Eden pertenece a esa segunda mitad de la noche.',
      'Sant Antoni est le versant plus abordable et plus jeune du clubbing ibizenque, avec les bars de coucher de soleil d’un côté de la baie et les clubs de l’autre. Eden appartient à cette seconde moitié de soirée.',
    ),
    note: L(
      'Het gaat hier laat los — voor middernacht is de zaal vaak nog leeg, wat mensen die vroeg komen soms verrast. En Sant Antoni is niet ieders sfeer: het is drukker, luider en jonger op straat dan in Ibiza-stad.',
      'Things get going late here — before midnight the room is often still empty, which catches early arrivals out. And Sant Antoni is not everyone’s scene: the streets are busier, louder and younger than in Ibiza Town.',
      'Hier geht es spät los — vor Mitternacht ist der Saal oft noch leer, was Frühankommende überrascht. Und Sant Antoni ist nicht jedermanns Sache: auf der Straße ist es voller, lauter und jünger als in Ibiza-Stadt.',
      'Aquí arranca tarde — antes de medianoche la sala suele estar vacía, algo que pilla a quien llega pronto. Y Sant Antoni no es para todo el mundo: la calle está más llena, más ruidosa y es más joven que en Ibiza ciudad.',
      'Ça démarre tard ici — avant minuit la salle est souvent encore vide, ce qui surprend ceux qui arrivent tôt. Et Sant Antoni ne plaît pas à tous : la rue y est plus dense, plus bruyante et plus jeune qu’à Ibiza-ville.',
    ),
  },

  'es-paradis': {
    what: L(
      'Een club in Sant Antoni, direct herkenbaar aan het glazen piramidedak dat boven de dansvloer uitkomt. Binnen is de ruimte trapsgewijs opgebouwd rond een verzonken vloer, met marmer en veel wit — het ziet er eerder uit als een tempel dan als een clubzaal.',
      'A club in Sant Antoni, instantly recognisable by the glass pyramid roof rising above the dancefloor. Inside, the space steps down around a sunken floor, in marble and a great deal of white — it reads more like a temple than a club room.',
      'Ein Club in Sant Antoni, sofort erkennbar am gläsernen Pyramidendach über der Tanzfläche. Innen ist der Raum stufenförmig um eine abgesenkte Fläche gebaut, mit Marmor und viel Weiß — es wirkt eher wie ein Tempel als wie ein Clubsaal.',
      'Un club en Sant Antoni, reconocible al instante por el techo piramidal de cristal que se alza sobre la pista. Dentro, el espacio baja en escalones alrededor de una pista hundida, con mármol y mucho blanco — parece más un templo que una sala.',
      'Un club à Sant Antoni, immédiatement reconnaissable à sa toiture pyramidale en verre au-dessus de la piste. À l’intérieur, l’espace descend en gradins autour d’une piste en creux, dans le marbre et beaucoup de blanc — cela évoque plus un temple qu’une salle de club.',
    ),
    known: L(
      'Voor de waterfeesten waarbij de verzonken dansvloer daadwerkelijk onder water wordt gezet en het publiek in het water danst. Dat concept is onlosmakelijk met deze club verbonden en bestaat elders op het eiland niet in deze vorm.',
      'For the water parties in which the sunken dancefloor is genuinely flooded and the crowd dances in the water. That concept is bound up with this club and does not exist in this form anywhere else on the island.',
      'Für die Wasserpartys, bei denen die abgesenkte Tanzfläche tatsächlich geflutet wird und das Publikum im Wasser tanzt. Dieses Konzept ist untrennbar mit dem Club verbunden und existiert anderswo auf der Insel nicht in dieser Form.',
      'Por las fiestas de agua en las que la pista hundida se inunda de verdad y la gente baila dentro del agua. Ese concepto es inseparable de este club y no existe así en ningún otro sitio de la isla.',
      'Pour ses fêtes de l’eau où la piste en creux est réellement inondée et où le public danse dans l’eau. Ce concept est indissociable du club et n’existe sous cette forme nulle part ailleurs sur l’île.',
    ),
    fits: L(
      'Het is het meest karakteristieke gebouw van het uitgaan in Sant Antoni en een van de weinige clubs op Ibiza die je aan de buitenkant meteen herkent. De piramide staat op vrijwel elke foto van het dorp bij nacht.',
      'It is the most distinctive building in Sant Antoni nightlife and one of the few clubs on Ibiza you recognise instantly from the outside. The pyramid appears in almost every photograph of the town at night.',
      'Es ist das markanteste Gebäude des Nachtlebens von Sant Antoni und einer der wenigen Clubs auf Ibiza, die man von außen sofort erkennt. Die Pyramide steht auf fast jedem Nachtfoto des Ortes.',
      'Es el edificio más característico de la noche de Sant Antoni y uno de los pocos clubs de Ibiza que se reconocen al instante desde fuera. La pirámide sale en casi toda foto nocturna del pueblo.',
      'C’est le bâtiment le plus caractéristique de la nuit à Sant Antoni et l’un des rares clubs d’Ibiza qu’on reconnaît instantanément de l’extérieur. La pyramide figure sur presque toutes les photos nocturnes du village.',
    ),
    note: L(
      'De waterfeesten zijn niet elke avond en niet elke week — kom er niet blind voor, maar kijk in de agenda hierboven. En als het water wél aan gaat: neem kleding en schoenen waarvan het je niet uitmaakt dat ze doorweekt raken.',
      'The water parties are not every night and not every week — do not turn up blind for one, check the schedule above. And if the water does go on: wear clothes and shoes you do not mind getting soaked.',
      'Die Wasserpartys sind nicht jeden Abend und nicht jede Woche — komm nicht blind dafür, sondern schau in den Kalender oben. Und wenn das Wasser läuft: Zieh Kleidung und Schuhe an, bei denen es dir egal ist, wenn sie durchnässt werden.',
      'Las fiestas de agua no son todas las noches ni todas las semanas — no vengas a ciegas por ellas, mira la agenda de arriba. Y si toca agua: ponte ropa y zapatos que no te importe empapar.',
      'Les fêtes de l’eau n’ont pas lieu tous les soirs ni toutes les semaines — n’y venez pas à l’aveugle, consultez l’agenda ci-dessus. Et si l’eau coule : portez des vêtements et des chaussures que vous acceptez de tremper.',
    ),
  },

  'ibiza-rocks': {
    what: L(
      'Een hotel in Sant Antoni met een binnenplaats die als concertlocatie en poolparty dienstdoet: een podium aan één kant, het zwembad ervoor en de hotelkamers eromheen als balkons. Het publiek staat in en om het water.',
      'A hotel in Sant Antoni whose courtyard doubles as a concert venue and pool party: a stage at one end, the pool in front of it and the hotel rooms around it acting as balconies. The crowd stands in and around the water.',
      'Ein Hotel in Sant Antoni, dessen Innenhof als Konzertort und Poolparty dient: eine Bühne an einer Seite, davor der Pool und ringsum die Hotelzimmer als Balkone. Das Publikum steht im und um das Wasser.',
      'Un hotel en Sant Antoni cuyo patio hace de sala de conciertos y de fiesta de piscina: un escenario a un lado, la piscina delante y las habitaciones alrededor haciendo de balcones. El público está dentro y alrededor del agua.',
      'Un hôtel à Sant Antoni dont la cour sert de salle de concert et de pool party : une scène d’un côté, la piscine devant et les chambres autour en guise de balcons. Le public est dans l’eau et autour.',
    ),
    known: L(
      'Voor live optredens naast dj-sets — bands, rappers en zangers op een eiland dat verder vrijwel volledig om dj’s draait. Het is de plek die livemuziek weer een vaste plaats op Ibiza heeft gegeven.',
      'For live acts alongside DJ sets — bands, rappers and singers on an island that otherwise revolves almost entirely around DJs. It is the venue that gave live music a fixed place on Ibiza again.',
      'Für Live-Auftritte neben DJ-Sets — Bands, Rapper und Sänger auf einer Insel, die sich sonst fast ausschließlich um DJs dreht. Der Ort, der Live-Musik auf Ibiza wieder einen festen Platz gegeben hat.',
      'Por actuaciones en directo junto a sesiones de dj — bandas, raperos y cantantes en una isla que por lo demás gira casi por completo en torno a los djs. Es el sitio que devolvió a la música en directo un lugar fijo en Ibiza.',
      'Pour ses concerts en plus des sets DJ — groupes, rappeurs et chanteurs sur une île qui tourne par ailleurs presque entièrement autour des DJ. C’est le lieu qui a redonné une place fixe à la musique live à Ibiza.',
    ),
    fits: L(
      'Het is het middelpunt van het jongere, Britse deel van Sant Antoni en trekt een publiek dat voor een festivalgevoel komt in plaats van voor een nachtclub. Overdag en vroeg op de avond, niet tot diep in de nacht.',
      'It is the centre of the younger, British-leaning side of Sant Antoni and draws a crowd after a festival feeling rather than a nightclub. Daytime and early evening, not deep into the night.',
      'Es ist der Mittelpunkt der jüngeren, britisch geprägten Seite von Sant Antoni und zieht ein Publikum an, das ein Festivalgefühl sucht statt eines Nachtclubs. Tagsüber und am frühen Abend, nicht bis tief in die Nacht.',
      'Es el centro del lado más joven y de aire británico de Sant Antoni y atrae a un público que busca sensación de festival más que de discoteca. De día y a primera hora de la noche, no hasta la madrugada.',
      'C’est le centre du versant plus jeune et d’influence britannique de Sant Antoni, et il attire un public en quête d’une ambiance festival plutôt que de boîte de nuit. En journée et en début de soirée, pas jusqu’au bout de la nuit.',
    ),
    note: L(
      'Het is een zwembadlocatie: je staat in badkleding tussen mensen die dat ook doen, en het is druk en nat. Voor wie rustig naar een optreden wil kijken is dit niet de opzet — en het is geen plek voor kinderen.',
      'It is a pool venue: you stand in swimwear among people doing the same, and it is crowded and wet. For anyone wanting to watch a performance calmly this is not the format — and it is not a place for children.',
      'Es ist eine Pool-Location: Man steht in Badekleidung zwischen Leuten, die dasselbe tun, und es ist voll und nass. Wer einen Auftritt in Ruhe sehen will, ist hier falsch — und für Kinder ist es kein Ort.',
      'Es un recinto de piscina: estás en bañador entre gente que hace lo mismo, y va lleno y mojado. Para quien quiera ver una actuación con calma este no es el formato — y no es un sitio para niños.',
      'C’est un lieu de piscine : on est en maillot au milieu de gens en maillot, c’est dense et mouillé. Pour regarder un concert tranquillement, ce n’est pas le format — et ce n’est pas un endroit pour les enfants.',
    ),
  },

  'o-beach-ibiza': {
    what: L(
      'Een daytime poolclub aan de baai van Sant Antoni, die veel bezoekers nog bij de oude naam Ocean Beach kennen. Bedden en cabana’s rond een groot zwembad, met een podium en dansers als vast onderdeel van de middag.',
      'A daytime pool club on the bay at Sant Antoni, still known to many visitors by its former name, Ocean Beach. Beds and cabanas around a large pool, with a stage and dancers as a fixed part of the afternoon.',
      'Ein Daytime-Poolclub an der Bucht von Sant Antoni, den viele Gäste noch unter dem früheren Namen Ocean Beach kennen. Liegen und Cabanas rund um einen großen Pool, mit Bühne und Tänzern als festem Teil des Nachmittags.',
      'Un pool club diurno en la bahía de Sant Antoni, que muchos visitantes siguen conociendo por su nombre anterior, Ocean Beach. Hamacas y cabañas alrededor de una piscina grande, con escenario y bailarines como parte fija de la tarde.',
      'Un pool club de jour sur la baie de Sant Antoni, que beaucoup connaissent encore sous son ancien nom, Ocean Beach. Transats et cabanas autour d’une grande piscine, avec scène et danseurs comme élément fixe de l’après-midi.',
    ),
    known: L(
      'Voor een uitgesproken show bij daglicht: choreografie, artiesten en een middag die als een productie is opgebouwd in plaats van als een dj-set met bedden eromheen.',
      'For an outright show in daylight: choreography, performers and an afternoon built like a production rather than a DJ set with beds around it.',
      'Für eine ausgesprochene Show bei Tageslicht: Choreografie, Artisten und ein Nachmittag, der wie eine Produktion aufgebaut ist statt wie ein DJ-Set mit Liegen drumherum.',
      'Por un espectáculo declarado a la luz del día: coreografía, artistas y una tarde montada como una producción y no como una sesión de dj con hamacas alrededor.',
      'Pour un vrai spectacle en plein jour : chorégraphie, artistes et un après-midi construit comme une production plutôt que comme un set DJ entouré de transats.',
    ),
    fits: L(
      'Sant Antoni heeft de zonsondergang en de clubs, en dit vult het gat ertussen: de middag. Voor veel groepen is dit de eerste halte van een dag die bij de zonsondergangbars en daarna in een club eindigt.',
      'Sant Antoni has the sunset and the clubs, and this fills the gap in between: the afternoon. For many groups it is the first stop of a day that ends at the sunset bars and then in a club.',
      'Sant Antoni hat den Sonnenuntergang und die Clubs, und dies füllt die Lücke dazwischen: den Nachmittag. Für viele Gruppen die erste Station eines Tages, der an den Sunset-Bars und danach in einem Club endet.',
      'Sant Antoni tiene el atardecer y los clubs, y esto llena el hueco intermedio: la tarde. Para muchos grupos es la primera parada de un día que acaba en los bares de atardecer y luego en un club.',
      'Sant Antoni a le coucher de soleil et les clubs ; cela comble l’entre-deux : l’après-midi. Pour beaucoup de groupes, c’est la première étape d’une journée qui finit aux bars de coucher de soleil puis en club.',
    ),
    note: L(
      'Het heet beach club maar het draait om het zwembad, niet om de zee — wie voeten in het zand wil, moet naar een van de baaien buiten het dorp. Bovendien is het uitdrukkelijk niets voor wie rust zoekt of met jonge kinderen komt.',
      'It is called a beach club but it revolves around the pool, not the sea — anyone wanting feet in the sand should head to one of the coves outside town. It is also emphatically not for anyone seeking quiet or travelling with young children.',
      'Es heißt Beachclub, dreht sich aber um den Pool, nicht ums Meer — wer Füße im Sand will, fährt in eine der Buchten außerhalb des Ortes. Und es ist ausdrücklich nichts für alle, die Ruhe suchen oder mit kleinen Kindern kommen.',
      'Se llama beach club pero gira en torno a la piscina, no al mar — quien quiera pies en la arena debe ir a una de las calas fuera del pueblo. Y no es en absoluto para quien busca calma o viene con niños pequeños.',
      'On l’appelle beach club mais tout tourne autour de la piscine, pas de la mer — qui veut les pieds dans le sable ira dans une crique hors du village. Et ce n’est clairement pas pour qui cherche le calme ou voyage avec de jeunes enfants.',
    ),
  },

  lio: {
    what: L(
      'Een cabaretrestaurant en club aan de haven van Ibiza-stad, met de oude ommuurde stad Dalt Vila aan de overkant van het water in het zicht. De avond is in delen opgebouwd: eerst diner met een doorlopende show, daarna wordt de ruimte een club.',
      'A cabaret restaurant and club on the harbour in Ibiza Town, looking across the water at the old walled city of Dalt Vila. The evening is built in stages: dinner with a running show first, after which the room turns into a club.',
      'Ein Kabarett-Restaurant und Club am Hafen von Ibiza-Stadt, mit Blick über das Wasser auf die alte Stadtmauer von Dalt Vila. Der Abend ist in Etappen aufgebaut: zuerst Dinner mit durchlaufender Show, danach wird der Raum zum Club.',
      'Un restaurante cabaret y club en el puerto de Ibiza ciudad, con la ciudad amurallada de Dalt Vila al otro lado del agua. La noche va por partes: primero cena con espectáculo continuo y después la sala se convierte en club.',
      'Un restaurant-cabaret et club sur le port d’Ibiza-ville, face à la vieille ville fortifiée de Dalt Vila de l’autre côté de l’eau. La soirée est construite par étapes : d’abord un dîner avec spectacle continu, puis la salle devient un club.',
    ),
    known: L(
      'Voor de combinatie van eten en theater: artiesten, zang en acrobatiek tussen de tafels door, met het uitzicht op de haven als decor. Het is de meest theatrale avond die het eiland te bieden heeft.',
      'For the combination of dining and theatre: performers, singing and acrobatics moving between the tables, with the harbour view as the backdrop. It is the most theatrical evening the island offers.',
      'Für die Verbindung von Essen und Theater: Artisten, Gesang und Akrobatik zwischen den Tischen, mit dem Hafenblick als Kulisse. Der theatralischste Abend, den die Insel zu bieten hat.',
      'Por la combinación de cena y teatro: artistas, canto y acrobacia entre las mesas, con la vista del puerto como decorado. Es la noche más teatral que ofrece la isla.',
      'Pour l’alliance du dîner et du théâtre : artistes, chant et acrobaties entre les tables, avec la vue sur le port en toile de fond. C’est la soirée la plus théâtrale de l’île.',
    ),
    fits: L(
      'Het is het tegenwicht van de grote zalen aan de zuidkust: hier begint de avond zittend en vroeg in plaats van staand en laat. Voor veel bezoekers is dit het startpunt van een avond die daarna in een club verdergaat.',
      'It is the counterweight to the big rooms on the south coast: here the evening starts seated and early rather than standing and late. For many visitors it is the starting point of a night that carries on in a club afterwards.',
      'Es ist das Gegengewicht zu den großen Sälen an der Südküste: Hier beginnt der Abend sitzend und früh statt stehend und spät. Für viele der Startpunkt eines Abends, der danach in einem Club weitergeht.',
      'Es el contrapeso de las salas grandes de la costa sur: aquí la noche empieza sentada y temprano, no de pie y tarde. Para mucha gente es el punto de partida de una noche que sigue después en un club.',
      'C’est le contrepoids des grandes salles de la côte sud : ici la soirée commence assis et tôt, pas debout et tard. Pour beaucoup, c’est le point de départ d’une nuit qui se poursuit ensuite en club.',
    ),
    note: L(
      'Dit is een avond met een tafel en een dresscode, geen plek waar je in strandkleding binnenloopt. Het aantal tafels is beperkt en ze zijn niet allemaal gelijk: waar je zit bepaalt sterk wat je van de show meekrijgt. Reserveren gaat via de locatie zelf.',
      'This is an evening with a table and a dress code, not a place you walk into in beachwear. The number of tables is limited and they are not equal: where you sit strongly determines how much of the show you get. Reserving goes through the venue itself.',
      'Das ist ein Abend mit Tisch und Dresscode, kein Ort, an dem man in Strandkleidung hineinspaziert. Die Zahl der Tische ist begrenzt und sie sind nicht gleichwertig: Wo du sitzt, bestimmt stark, wie viel du von der Show mitbekommst. Reserviert wird über die Location selbst.',
      'Es una noche con mesa y código de vestimenta, no un sitio al que se entre en ropa de playa. Las mesas son limitadas y no son todas iguales: dónde te sientas determina mucho lo que ves del espectáculo. La reserva va por el propio local.',
      'C’est une soirée avec table et code vestimentaire, pas un lieu où l’on entre en tenue de plage. Les tables sont limitées et inégales : l’endroit où l’on est assis détermine beaucoup ce que l’on voit du spectacle. La réservation passe par le lieu lui-même.',
    ),
  },

  'teatro-pereyra': {
    what: L(
      'Een zaal in het hart van Ibiza-stad, ondergebracht in een oud theatergebouw net achter de hoofdstraat. Het interieur is er nog naar: houtwerk, balkons en een hoogte die je in een club zelden tegenkomt.',
      'A venue in the heart of Ibiza Town, housed in an old theatre building just behind the main street. The interior still shows it: woodwork, balconies and a ceiling height you rarely meet in a club.',
      'Ein Saal im Herzen von Ibiza-Stadt, untergebracht in einem alten Theatergebäude direkt hinter der Hauptstraße. Das Interieur zeigt es noch: Holzarbeiten, Balkone und eine Raumhöhe, die man in einem Club selten findet.',
      'Una sala en el corazón de Ibiza ciudad, alojada en un antiguo edificio de teatro justo detrás de la calle principal. El interior todavía lo cuenta: maderas, balcones y una altura que rara vez se encuentra en un club.',
      'Une salle au cœur d’Ibiza-ville, installée dans un ancien théâtre juste derrière la rue principale. L’intérieur en témoigne encore : boiseries, balcons et une hauteur sous plafond rare dans un club.',
    ),
    known: L(
      'Voor livemuziek elke avond in het seizoen: bands die spelen terwijl het publiek eromheen staat, drinkt en meezingt. Geen dj-booth maar een podium, en een sfeer die eerder aan een café-concert doet denken dan aan een club.',
      'For live music every night in season: bands playing while the crowd stands around them, drinks and sings along. No DJ booth but a stage, and an atmosphere closer to a café concert than to a club.',
      'Für Live-Musik jeden Abend in der Saison: Bands spielen, während das Publikum ringsum steht, trinkt und mitsingt. Keine DJ-Booth, sondern eine Bühne, und eine Stimmung, die eher an ein Café-Konzert erinnert als an einen Club.',
      'Por música en directo cada noche de temporada: bandas tocando mientras el público está alrededor, bebe y canta. No hay cabina sino escenario, y un ambiente más de café concierto que de club.',
      'Pour la musique live tous les soirs en saison : des groupes jouent pendant que le public les entoure, boit et chante. Pas de cabine mais une scène, et une ambiance plus proche du café-concert que du club.',
    ),
    fits: L(
      'Het is de plek waar de avond in Ibiza-stad vaak begint, voordat mensen richting de haven of de grote zalen aan de zuidkust trekken. Ook bruikbaar voor wie niet in een club wil staan maar wel iets wil meemaken.',
      'It is where an evening in Ibiza Town often begins, before people move on to the harbour or the big rooms on the south coast. Also useful for anyone who does not want to stand in a club but does want to be somewhere alive.',
      'Hier beginnt der Abend in Ibiza-Stadt oft, bevor man zum Hafen oder zu den großen Sälen an der Südküste weiterzieht. Auch geeignet für alle, die nicht in einem Club stehen, aber trotzdem etwas erleben wollen.',
      'Es donde suele empezar la noche en Ibiza ciudad, antes de que la gente siga hacia el puerto o hacia las salas grandes del sur. Útil también para quien no quiere estar de pie en un club pero sí quiere vivir algo.',
      'C’est souvent là que commence la soirée à Ibiza-ville, avant de rejoindre le port ou les grandes salles de la côte sud. Utile aussi pour qui ne veut pas rester debout en club tout en sortant vraiment.',
    ),
    note: L(
      'De zaal is klein en heeft geen airconditioningcomfort van een moderne club; op een warme avond met een volle zaal is het er benauwd. Zitplaatsen zijn beperkt en op piekavonden sta je gewoon.',
      'The room is small and does not have the air-conditioned comfort of a modern club; on a warm night with a full house it gets stuffy. Seating is limited and on peak nights you simply stand.',
      'Der Saal ist klein und hat nicht den klimatisierten Komfort eines modernen Clubs; an einem warmen Abend mit vollem Haus wird es stickig. Sitzplätze sind begrenzt, an Spitzenabenden steht man einfach.',
      'La sala es pequeña y no tiene el confort climatizado de un club moderno; en una noche cálida y llena se agobia. Los asientos son limitados y en noches punta simplemente se está de pie.',
      'La salle est petite et n’a pas le confort climatisé d’un club moderne ; par une soirée chaude et pleine, l’air devient lourd. Les places assises sont limitées et les soirs de pointe on reste debout.',
    ),
  },

  'club-chinois-ibiza': {
    what: L(
      'Een dinnershow-club in Ibiza-stad met een pan-Aziatisch thema, waar het eten, het decor en het optreden als één avond zijn opgezet. Het interieur is uitbundig en zwaar aangekleed; het is nadrukkelijk een decorstuk.',
      'A dinner-show club in Ibiza Town with a pan-Asian theme, where the food, the setting and the performance are staged as a single evening. The interior is exuberant and heavily dressed; it is unmistakably a set.',
      'Ein Dinner-Show-Club in Ibiza-Stadt mit panasiatischem Thema, in dem Essen, Kulisse und Auftritt als ein Abend inszeniert sind. Das Interieur ist üppig und schwer ausgestattet — unverkennbar ein Bühnenbild.',
      'Un club de cena y espectáculo en Ibiza ciudad con temática panasiática, donde la comida, el decorado y la actuación se montan como una sola velada. El interior es exuberante y muy vestido: es claramente una escenografía.',
      'Un club dîner-spectacle à Ibiza-ville au thème panasiatique, où le repas, le décor et la performance forment une seule soirée. L’intérieur est exubérant et très habillé ; c’est clairement un décor.',
    ),
    known: L(
      'Voor de theatrale aankleding en voor een avond die in scènes verloopt: eten, show, en daarna een clubgedeelte. Het hoort tot de categorie avonden waar het gaan uit eten en het uitgaan niet van elkaar te scheiden zijn.',
      'For its theatrical dressing and for an evening that unfolds in scenes: dinner, show, then a club section. It belongs to the category of nights where going out to eat and going out are not separable.',
      'Für die theatralische Ausstattung und für einen Abend, der in Szenen verläuft: Essen, Show, danach ein Clubteil. Es gehört zu den Abenden, bei denen Essengehen und Ausgehen nicht zu trennen sind.',
      'Por su puesta en escena teatral y por una noche que avanza por escenas: cena, espectáculo y después parte de club. Pertenece a esa categoría de noches en que salir a cenar y salir de fiesta no se separan.',
      'Pour sa mise en scène théâtrale et pour une soirée qui se déroule par tableaux : dîner, spectacle, puis partie club. Il appartient à cette catégorie de soirées où sortir dîner et sortir en boîte ne se distinguent plus.',
    ),
    fits: L(
      'Ibiza-stad heeft naast de grote dansvloeren een eigen laag van avonden waarbij je aan tafel zit; dit hoort daarbij, samen met de andere dinnershows rond de haven. Een andere manier om de nacht te beginnen dan met een ticket voor een zaal.',
      'Alongside the big dancefloors, Ibiza Town has its own layer of evenings where you sit at a table; this belongs to it, along with the other dinner shows around the harbour. A different way to start the night than with a ticket for a room.',
      'Neben den großen Tanzflächen hat Ibiza-Stadt eine eigene Ebene von Abenden, an denen man am Tisch sitzt; dazu gehört dies, gemeinsam mit den anderen Dinner-Shows rund um den Hafen. Ein anderer Einstieg in die Nacht als ein Ticket für einen Saal.',
      'Además de las grandes pistas, Ibiza ciudad tiene su propia capa de noches en las que se está sentado a la mesa; esto forma parte de ella, junto con los otros dinner shows del puerto. Otra forma de empezar la noche distinta de comprar entrada para una sala.',
      'À côté des grandes pistes, Ibiza-ville a sa propre couche de soirées où l’on est assis à table ; celle-ci en fait partie, avec les autres dîners-spectacles du port. Une autre façon de commencer la nuit qu’avec un billet pour une salle.',
    ),
    note: L(
      'Het is een tafelavond met een dresscode en een beperkt aantal plaatsen; binnenlopen zonder reservering werkt in het hoogseizoen zelden. En het is aanzienlijk duurder dan een clubticket, omdat je een diner meekoopt — vraag de voorwaarden bij de locatie zelf op.',
      'It is a table evening with a dress code and a limited number of places; walking in without a reservation rarely works in high season. And it costs considerably more than a club ticket because you are buying dinner with it — check the terms with the venue itself.',
      'Es ist ein Tischabend mit Dresscode und begrenzter Platzzahl; ohne Reservierung hineinzugehen funktioniert in der Hochsaison selten. Und es ist deutlich teurer als ein Clubticket, weil ein Dinner mitgekauft wird — die Bedingungen erfragst du bei der Location selbst.',
      'Es una noche de mesa con código de vestimenta y plazas limitadas; entrar sin reserva rara vez funciona en temporada alta. Y cuesta bastante más que una entrada de club porque incluye cena — consulta las condiciones en el propio local.',
      'C’est une soirée à table avec code vestimentaire et places limitées ; entrer sans réservation fonctionne rarement en haute saison. Et cela coûte nettement plus qu’un billet de club puisque le dîner est compris — vérifiez les conditions auprès du lieu.',
    ),
  },

  'playa-soleil': {
    what: L(
      'Een openluchtlocatie aan Playa d’en Bossa waar het feest bij daglicht plaatsvindt: dansvloer, bar en bedden onder de open hemel, met de zee ernaast in plaats van een plafond erboven.',
      'An open-air venue on Playa d’en Bossa where the party happens in daylight: dancefloor, bar and beds under open sky, with the sea alongside instead of a ceiling overhead.',
      'Eine Open-Air-Location an der Playa d’en Bossa, an der die Party bei Tageslicht stattfindet: Tanzfläche, Bar und Liegen unter freiem Himmel, mit dem Meer daneben statt einer Decke darüber.',
      'Un recinto al aire libre en Playa d’en Bossa donde la fiesta es a la luz del día: pista, barra y hamacas bajo cielo abierto, con el mar al lado en vez de un techo encima.',
      'Un lieu en plein air à Playa d’en Bossa où la fête se déroule en plein jour : piste, bar et transats à ciel ouvert, avec la mer à côté plutôt qu’un plafond au-dessus.',
    ),
    known: L(
      'Voor de daglichtformule: een middag die als een clubavond is opgebouwd maar zich buiten en in de zon afspeelt, met het strand als achtergrond.',
      'For the daylight formula: an afternoon structured like a club night but played out in the open and in the sun, with the beach as the backdrop.',
      'Für die Tageslichtformel: ein Nachmittag, der wie ein Clubabend aufgebaut ist, sich aber draußen und in der Sonne abspielt, mit dem Strand als Hintergrund.',
      'Por la fórmula diurna: una tarde estructurada como una noche de club pero al aire libre y al sol, con la playa de fondo.',
      'Pour la formule diurne : un après-midi construit comme une soirée de club mais joué dehors et au soleil, avec la plage en toile de fond.',
    ),
    fits: L(
      'Het hoort bij de keten van dagfeesten op Playa d’en Bossa die de middag vullen tussen het strand en de grote zalen ’s nachts. Wie op deze strook logeert, hoeft er niet voor te rijden.',
      'It belongs to the chain of daytime parties on Playa d’en Bossa that fill the afternoon between the beach and the big rooms at night. Anyone staying on this strip does not have to drive for it.',
      'Es gehört zur Kette der Tagespartys an der Playa d’en Bossa, die den Nachmittag zwischen Strand und den großen Sälen der Nacht füllen. Wer an diesem Abschnitt wohnt, muss dafür nicht fahren.',
      'Forma parte de la cadena de fiestas diurnas de Playa d’en Bossa que llenan la tarde entre la playa y las salas grandes de la noche. Quien se aloja en este tramo no necesita coche.',
      'Il fait partie de la chaîne des fêtes de jour de Playa d’en Bossa qui remplissent l’après-midi entre la plage et les grandes salles de la nuit. Qui loge sur cette bande n’a pas besoin de voiture.',
    ),
    note: L(
      'Buiten betekent afhankelijk van het weer en van de zon: er is beperkt schaduw en op een hete middag is dat geen detail. De programmering van dagfeesten op deze strook wisselt bovendien sterk per seizoen — ga af op de agenda hierboven.',
      'Outdoors means dependent on the weather and on the sun: shade is limited, and on a hot afternoon that is not a detail. Programming for daytime parties on this strip also shifts considerably from season to season — go by the schedule above.',
      'Draußen heißt abhängig vom Wetter und von der Sonne: Schatten ist begrenzt, und an einem heißen Nachmittag ist das kein Detail. Die Programmierung der Tagespartys an diesem Abschnitt wechselt zudem stark je Saison — richte dich nach dem Kalender oben.',
      'Al aire libre significa depender del tiempo y del sol: la sombra es limitada y en una tarde calurosa eso no es un detalle. Además, la programación de las fiestas diurnas de este tramo cambia mucho de temporada a temporada — guíate por la agenda de arriba.',
      'En plein air signifie dépendre de la météo et du soleil : l’ombre est limitée, et par un après-midi chaud ce n’est pas un détail. La programmation des fêtes de jour sur cette bande varie aussi beaucoup d’une saison à l’autre — fiez-vous à l’agenda ci-dessus.',
    ),
  },
}

/** Safe lookup used by the component — unknown slugs render nothing. */
export function clubHistory(slug?: string): ClubHistory | null {
  if (!slug) return null
  return CLUB_HISTORY[slug] ?? null
}
