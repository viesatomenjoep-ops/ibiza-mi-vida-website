import type { Locale } from './seo'

// ── Place guides for Ibiza and Formentera ──────────────────────────────
// These pages replace eight one-paragraph stubs. The goal is a page that a
// person can actually plan from and that an answer engine can safely quote:
// concrete, checkable statements instead of adjectives.
//
// HARD RULE — no invented facts. Do not add founding years, populations,
// beach lengths, distances in kilometres, water temperatures or visitor
// numbers. If something is old, it is "centuries old", not "from 1235".
// Sa Caleta is Phoenician; no century is stated for it anywhere, because the
// commonly repeated one is wrong. No named third-party businesses, hotels,
// restaurants or beach clubs — describe the character of a place, not a
// commercial venue. Nothing is described as free, and nothing is promised to
// be open or available.
//
// Every place carries an `honestNote`. That field is the point of the whole
// exercise: everyone writes the praise, almost nobody writes the drawback,
// and the drawback is what gets read, trusted and cited.

export type T = Record<Locale, string>
export type TList = Record<Locale, string[]>

const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })
const LL = (nl: string[], en: string[], de: string[], es: string[], fr: string[]): TList => ({ nl, en, de, es, fr })

export type Island = 'ibiza' | 'formentera'

export interface LocationData {
  id: string
  slug: string
  /** Place name as used on the page and in structured data. */
  name: string
  /** Which island the place belongs to — drives grouping and containedInPlace. */
  island: Island
  imageUrl: string
  tagline: T
  intro: T
  history: T
  whatToDo: TList
  facts: TList
  goodFor: T
  honestNote: T
}

export const locations: LocationData[] = [
  // ── IBIZA ────────────────────────────────────────────────────────────
  {
    id: 'ibiza-stad',
    slug: 'ibiza-stad',
    name: 'Ibiza Town (Eivissa)',
    island: 'ibiza',
    imageUrl: '/locations/loc_ibiza_stad_1782313041046.png',
    tagline: L(
      'De ommuurde oude stad, de haven en het bestuurlijke hart van het eiland',
      'The walled old town, the harbour and the island’s administrative heart',
      'Die ummauerte Altstadt, der Hafen und das Verwaltungszentrum der Insel',
      'La ciudad amurallada, el puerto y el centro administrativo de la isla',
      'La vieille ville fortifiée, le port et le cœur administratif de l’île',
    ),
    intro: L(
      'Ibiza Stad — Eivissa in het Catalaans — is de hoofdstad van het eiland en de plek waar de geschiedenis het dichtst op elkaar ligt. Boven de haven staat Dalt Vila, de ommuurde bovenstad, met daaronder de winkelstraten, de vissershaven en de wijk Sa Penya. Het is de enige plek op Ibiza waar je in één wandeling van een Renaissancebolwerk naar een jachthaven loopt.',
      'Ibiza Town — Eivissa in Catalan — is the island’s capital and the place where its history is stacked most densely. Above the harbour sits Dalt Vila, the walled upper town; below it lie the shopping streets, the fishing port and the Sa Penya quarter. It is the one place on Ibiza where a single walk takes you from a Renaissance bastion to a marina.',
      'Ibiza-Stadt — auf Katalanisch Eivissa — ist die Hauptstadt der Insel und der Ort, an dem sich ihre Geschichte am dichtesten schichtet. Über dem Hafen liegt Dalt Vila, die ummauerte Oberstadt, darunter die Einkaufsstraßen, der Fischereihafen und das Viertel Sa Penya. Nirgends sonst auf Ibiza führt ein einziger Spaziergang von einer Renaissance-Bastion zum Yachthafen.',
      'Ciudad de Ibiza —Eivissa en catalán— es la capital de la isla y el lugar donde su historia se acumula de forma más densa. Sobre el puerto se alza Dalt Vila, el recinto amurallado; debajo quedan las calles comerciales, el puerto pesquero y el barrio de Sa Penya. Es el único sitio de Ibiza donde un mismo paseo va de un baluarte renacentista a un puerto deportivo.',
      'Ibiza-Ville — Eivissa en catalan — est la capitale de l’île et l’endroit où son histoire est la plus concentrée. Au-dessus du port se dresse Dalt Vila, la ville haute fortifiée ; en dessous, les rues commerçantes, le port de pêche et le quartier de Sa Penya. C’est le seul endroit d’Ibiza où une même promenade mène d’un bastion Renaissance à une marina.',
    ),
    history: L(
      'De stad is de directe opvolger van Ebusus, de nederzetting die de Feniciërs in de oudheid op deze heuvel stichtten. Wie hier woonde werd begraven op Puig des Molins, de necropolis net buiten de muren, die tot in de Romeinse tijd in gebruik bleef. De muren die je nu ziet zijn Renaissancewerk: zware bastions die de haven moesten beschermen en die tot de best bewaarde kustvestingwerken van de Middellandse Zee horen. In 1999 zette UNESCO Dalt Vila, Puig des Molins, de Fenicische nederzetting Sa Caleta en de posidoniavelden in zee samen op de Werelderfgoedlijst onder de naam “Ibiza, biodiversiteit en cultuur”.',
      'The town is the direct successor of Ebusus, the settlement the Phoenicians founded on this hill in antiquity. Its inhabitants were buried at Puig des Molins, the necropolis just outside the walls, which stayed in use into Roman times. The walls you see today are Renaissance work: heavy bastions built to protect the harbour, and among the best-preserved coastal fortifications in the Mediterranean. In 1999 UNESCO inscribed Dalt Vila, Puig des Molins, the Phoenician settlement at Sa Caleta and the posidonia meadows offshore together on the World Heritage List, as “Ibiza, Biodiversity and Culture”.',
      'Die Stadt ist die direkte Nachfolgerin von Ebusus, der Siedlung, die die Phönizier in der Antike auf diesem Hügel gründeten. Ihre Bewohner wurden auf Puig des Molins bestattet, der Nekropole direkt vor den Mauern, die bis in römische Zeit genutzt wurde. Die heutigen Mauern stammen aus der Renaissance: schwere Bastionen zum Schutz des Hafens und eine der besterhaltenen Küstenbefestigungen des Mittelmeers. 1999 nahm die UNESCO Dalt Vila, Puig des Molins, die phönizische Siedlung Sa Caleta und die Posidonia-Wiesen vor der Küste gemeinsam als „Ibiza, Biodiversität und Kultur“ in die Welterbeliste auf.',
      'La ciudad es la sucesora directa de Ebusus, el asentamiento que los fenicios fundaron en esta colina en la antigüedad. Sus habitantes se enterraban en Puig des Molins, la necrópolis situada justo fuera de las murallas, en uso hasta época romana. Las murallas actuales son obra renacentista: baluartes pesados levantados para proteger el puerto y de las fortificaciones costeras mejor conservadas del Mediterráneo. En 1999 la UNESCO inscribió Dalt Vila, Puig des Molins, el asentamiento fenicio de Sa Caleta y las praderas de posidonia como «Ibiza, biodiversidad y cultura» en la Lista del Patrimonio Mundial.',
      'La ville est l’héritière directe d’Ebusus, l’établissement fondé par les Phéniciens sur cette colline dans l’Antiquité. Ses habitants étaient inhumés à Puig des Molins, la nécropole située juste hors les murs, utilisée jusqu’à l’époque romaine. Les remparts actuels datent de la Renaissance : de lourds bastions destinés à protéger le port, parmi les fortifications côtières les mieux conservées de Méditerranée. En 1999, l’UNESCO a inscrit ensemble Dalt Vila, Puig des Molins, le site phénicien de Sa Caleta et les herbiers de posidonie sous le nom « Ibiza, biodiversité et culture ».',
    ),
    whatToDo: LL(
      [
        'Loop Dalt Vila in via de Portal de ses Taules en klim door naar de kathedraal boven aan de heuvel — vanaf het plein kijk je over de hele haven.',
        'Volg de bastions rond over de muur; het is de meest complete rondgang over een vestingwerk die je op de Balearen kunt maken.',
        'Bezoek de necropolis van Puig des Molins, waar de doden van het Fenicische Ebusus lagen — de meest onderschatte plek van het eiland.',
        'Dwaal door Sa Penya en La Marina beneden, de oude vissers- en havenwijken met smalle steegjes.',
        'Kijk in de haven naar het contrast: vissersboten aan de ene kade, jachten aan de andere.',
        'Ga aan het eind van de middag omhoog, niet midden op de dag — de klim is steil en er is nauwelijks schaduw.',
      ],
      [
        'Enter Dalt Vila through the Portal de ses Taules and climb to the cathedral at the top — the square there looks out over the whole harbour.',
        'Walk the ring of bastions along the wall; it is the most complete circuit of a fortification you can do in the Balearics.',
        'Visit the Puig des Molins necropolis, where the dead of Phoenician Ebusus were buried — the most underrated site on the island.',
        'Wander Sa Penya and La Marina below, the old fishing and port quarters with their narrow lanes.',
        'Look at the harbour’s split personality: fishing boats along one quay, yachts along the other.',
        'Do the climb late in the afternoon rather than at midday — it is steep and there is very little shade.',
      ],
      [
        'Betritt Dalt Vila durch das Portal de ses Taules und steig hinauf zur Kathedrale — vom Platz dort blickst du über den gesamten Hafen.',
        'Geh den Bastionsring auf der Mauer ab; es ist der vollständigste Festungsrundgang, den man auf den Balearen machen kann.',
        'Besuche die Nekropole Puig des Molins, die Grabstätte des phönizischen Ebusus — der am meisten unterschätzte Ort der Insel.',
        'Streife unten durch Sa Penya und La Marina, die alten Fischer- und Hafenviertel mit ihren engen Gassen.',
        'Sieh dir den Hafen genau an: an der einen Kaimauer Fischerboote, an der anderen Yachten.',
        'Mach den Aufstieg spätnachmittags statt mittags — er ist steil und es gibt kaum Schatten.',
      ],
      [
        'Entra en Dalt Vila por el Portal de ses Taules y sube hasta la catedral: desde la plaza se ve todo el puerto.',
        'Recorre el anillo de baluartes sobre la muralla; es el circuito de fortificación más completo que se puede hacer en Baleares.',
        'Visita la necrópolis de Puig des Molins, donde se enterraba a los habitantes de la Ebusus fenicia: lo más infravalorado de la isla.',
        'Piérdete abajo por Sa Penya y La Marina, los antiguos barrios de pescadores y del puerto.',
        'Fíjate en el contraste del puerto: barcas de pesca en un muelle, yates en el otro.',
        'Haz la subida a última hora de la tarde y no a mediodía: es empinada y apenas hay sombra.',
      ],
      [
        'Entrez dans Dalt Vila par le Portal de ses Taules et montez jusqu’à la cathédrale : depuis la place, on voit tout le port.',
        'Parcourez la ceinture de bastions sur les remparts ; c’est le circuit de fortification le plus complet des Baléares.',
        'Visitez la nécropole de Puig des Molins, où reposaient les habitants de l’Ebusus phénicienne — le site le plus sous-estimé de l’île.',
        'Flânez en bas dans Sa Penya et La Marina, les vieux quartiers de pêcheurs et du port.',
        'Observez le contraste du port : barques de pêche d’un côté du quai, yachts de l’autre.',
        'Faites la montée en fin d’après-midi plutôt qu’à midi : c’est raide et il n’y a presque pas d’ombre.',
      ],
    ),
    facts: LL(
      [
        'Dalt Vila is één van de vier onderdelen van het UNESCO-werelderfgoed “Ibiza, biodiversiteit en cultuur”, ingeschreven in 1999.',
        'De oude naam van de stad was Ebusus, gesticht door de Feniciërs.',
        'Puig des Molins was de begraafplaats van die stad en bleef tot in de Romeinse tijd in gebruik.',
        'De Renaissancemuren horen tot de best bewaarde kustvestingwerken van de Middellandse Zee.',
      ],
      [
        'Dalt Vila is one of the four components of the UNESCO World Heritage site “Ibiza, Biodiversity and Culture”, inscribed in 1999.',
        'The town’s ancient name was Ebusus, and it was settled by the Phoenicians.',
        'Puig des Molins was that city’s burial ground and remained in use into Roman times.',
        'The Renaissance walls are among the best-preserved coastal fortifications in the Mediterranean.',
      ],
      [
        'Dalt Vila ist einer der vier Bestandteile des UNESCO-Welterbes „Ibiza, Biodiversität und Kultur“, eingeschrieben 1999.',
        'Der antike Name der Stadt war Ebusus; gegründet wurde sie von den Phöniziern.',
        'Puig des Molins war der Friedhof dieser Stadt und wurde bis in römische Zeit genutzt.',
        'Die Renaissancemauern gehören zu den besterhaltenen Küstenbefestigungen des Mittelmeers.',
      ],
      [
        'Dalt Vila es uno de los cuatro componentes del sitio UNESCO «Ibiza, biodiversidad y cultura», inscrito en 1999.',
        'El nombre antiguo de la ciudad era Ebusus y fue fundada por los fenicios.',
        'Puig des Molins era la necrópolis de esa ciudad y siguió en uso hasta época romana.',
        'Las murallas renacentistas están entre las fortificaciones costeras mejor conservadas del Mediterráneo.',
      ],
      [
        'Dalt Vila est l’une des quatre composantes du site UNESCO « Ibiza, biodiversité et culture », inscrit en 1999.',
        'Le nom antique de la ville était Ebusus ; elle fut fondée par les Phéniciens.',
        'Puig des Molins était la nécropole de cette cité et resta en usage jusqu’à l’époque romaine.',
        'Les remparts Renaissance comptent parmi les fortifications côtières les mieux conservées de Méditerranée.',
      ],
    ),
    goodFor: L(
      'Wie geschiedenis, uit eten gaan en avonduitgaan wil combineren zonder ver te hoeven reizen.',
      'Anyone who wants history, eating out and a night out in the same walkable place.',
      'Alle, die Geschichte, Essengehen und Nachtleben an einem fußläufigen Ort verbinden wollen.',
      'Quien quiera historia, buena mesa y salir de noche en un mismo sitio caminable.',
      'Ceux qui veulent histoire, restaurants et sorties nocturnes au même endroit, à pied.',
    ),
    honestNote: L(
      'Er is geen echt stadsstrand: voor zwemmen moet je de stad uit. Parkeren is lastig en Dalt Vila is een aaneenschakeling van trappen en kasseien, dus met een kinderwagen of slechte knieën is het zwaar.',
      'There is no real town beach — for a proper swim you have to leave the centre. Parking is difficult, and Dalt Vila is one long sequence of steps and cobbles, so it is hard going with a pushchair or bad knees.',
      'Einen richtigen Stadtstrand gibt es nicht — zum Schwimmen musst du raus. Parken ist schwierig, und Dalt Vila besteht aus Treppen und Kopfsteinpflaster, mit Kinderwagen oder schlechten Knien also anstrengend.',
      'No hay playa urbana de verdad: para bañarte tienes que salir del centro. Aparcar es complicado y Dalt Vila es una sucesión de escaleras y adoquines, dura con carrito o con las rodillas mal.',
      'Il n’y a pas de vraie plage en ville : pour nager, il faut sortir du centre. Le stationnement est difficile et Dalt Vila n’est qu’escaliers et pavés — pénible avec une poussette ou des genoux fragiles.',
    ),
  },
  {
    id: 'san-antonio',
    slug: 'san-antonio',
    name: 'San Antonio (Sant Antoni de Portmany)',
    island: 'ibiza',
    imageUrl: '/locations/loc_san_antonio_1782313029811.png',
    tagline: L(
      'De westkust: zonsondergang boven zee en het dichtste uitgaansgebied',
      'The west coast: sunset over water and the island’s densest nightlife',
      'Die Westküste: Sonnenuntergang über dem Meer und das dichteste Ausgehviertel',
      'La costa oeste: puesta de sol sobre el mar y el ocio más concentrado',
      'La côte ouest : coucher de soleil sur la mer et la vie nocturne la plus dense',
    ),
    intro: L(
      'Sant Antoni de Portmany ligt aan een brede natuurlijke baai aan de westkant van Ibiza. Het is het compactste vakantiegebied van het eiland: haven, promenade, de rotsen waar iedereen naar de zonsondergang kijkt en een aantal grote clubs liggen allemaal op loopafstand van elkaar. Omdat de baai naar het westen wijst, zakt de zon hier in zee en niet achter een heuvel.',
      'Sant Antoni de Portmany sits on a wide natural bay on the west side of Ibiza. It is the island’s most compact resort area: harbour, promenade, the rocks where everyone watches the sunset and several of the big clubs are all within walking distance of one another. Because the bay faces west, the sun here drops into the sea rather than behind a hill.',
      'Sant Antoni de Portmany liegt an einer weiten Naturbucht an der Westseite Ibizas. Es ist das kompakteste Urlaubsgebiet der Insel: Hafen, Promenade, die Felsen für den Sonnenuntergang und mehrere große Clubs liegen alle fußläufig beieinander. Da die Bucht nach Westen zeigt, sinkt die Sonne hier ins Meer statt hinter einen Hügel.',
      'Sant Antoni de Portmany se asienta en una amplia bahía natural del oeste de Ibiza. Es la zona turística más compacta de la isla: puerto, paseo, las rocas donde todo el mundo mira el atardecer y varios de los clubes grandes están a poca distancia a pie. Como la bahía mira al oeste, aquí el sol se pone en el mar y no detrás de una colina.',
      'Sant Antoni de Portmany se trouve au fond d’une large baie naturelle, sur la côte ouest d’Ibiza. C’est la station la plus compacte de l’île : port, promenade, rochers du coucher de soleil et plusieurs grands clubs se rejoignent à pied. Comme la baie regarde vers l’ouest, le soleil s’y couche dans la mer et non derrière une colline.',
    ),
    history: L(
      'De naam Portmany wordt teruggevoerd op het Latijnse Portus Magnus, “de grote haven” — de baai werd al in de oudheid als ankerplaats gebruikt. Eeuwenlang was dit een landelijke parochie rond een witgekalkte, versterkte kerk, met een economie van zout, amandelen, vijgen, vee en visserij. Pas in de tweede helft van de twintigste eeuw kwam het massatoerisme, en het dorp werd in enkele decennia omgebouwd tot de betonnen badplaats die je nu ziet. De kerk in het oude centrum staat er nog, ingeklemd tussen alles wat er later omheen is gezet.',
      'The name Portmany is traced to the Latin Portus Magnus, “the great port” — the bay was already used as an anchorage in antiquity. For centuries this was a rural parish around a whitewashed, fortified church, living off salt, almonds, figs, livestock and fishing. Mass tourism only arrived in the second half of the twentieth century, and the village was rebuilt into the concrete resort you see today within a few decades. The church in the old centre is still there, hemmed in by everything that was put up around it later.',
      'Der Name Portmany geht auf das lateinische Portus Magnus zurück, „der große Hafen“ — die Bucht diente schon in der Antike als Ankerplatz. Jahrhundertelang war dies eine ländliche Pfarrei um eine weiß gekalkte, befestigte Kirche, die von Salz, Mandeln, Feigen, Vieh und Fischfang lebte. Der Massentourismus kam erst in der zweiten Hälfte des 20. Jahrhunderts, und das Dorf wurde binnen weniger Jahrzehnte zum heutigen Betonbadeort umgebaut. Die Kirche im alten Kern steht noch, eingezwängt zwischen allem, was später darum herum entstand.',
      'El nombre Portmany se remonta al latín Portus Magnus, «el gran puerto»: la bahía ya se usaba como fondeadero en la antigüedad. Durante siglos fue una parroquia rural en torno a una iglesia encalada y fortificada, que vivía de la sal, las almendras, los higos, el ganado y la pesca. El turismo de masas no llegó hasta la segunda mitad del siglo XX, y en pocas décadas el pueblo se transformó en el núcleo de hormigón actual. La iglesia del casco antiguo sigue en pie, encajada entre todo lo que se levantó después.',
      'Le nom Portmany remonte au latin Portus Magnus, « le grand port » : la baie servait déjà de mouillage dans l’Antiquité. Pendant des siècles, ce fut une paroisse rurale autour d’une église blanchie et fortifiée, vivant du sel, des amandes, des figues, de l’élevage et de la pêche. Le tourisme de masse n’est arrivé qu’à la seconde moitié du XXᵉ siècle et le village est devenu en quelques décennies la station bétonnée d’aujourd’hui. L’église du vieux centre est toujours là, coincée entre tout ce qui a été bâti autour.',
    ),
    whatToDo: LL(
      [
        'Loop in het uur voor zonsondergang langs de rotsen ten westen van de jachthaven — dit is waarvoor de meeste mensen komen.',
        'Neem het bootje vanaf de haven naar Cala Bassa of Cala Comte in plaats van de auto; de parkeerplaatsen daar lopen vroeg vol.',
        'Klim naar de witgekalkte parochiekerk in het oude centrum, het oudste bouwwerk van de plaats.',
        'Volg het kustpad naar het noorden richting Cala Salada voor een stiller stuk van diezelfde kust.',
        'Gebruik San Antonio als uitvalsbasis voor de clubs — hier kun je na afloop terug lopen, wat elders op het eiland zelden kan.',
        'Zwem ’s ochtends vanaf het stadsstrand, voordat de boten uitvaren.',
      ],
      [
        'Walk the rocks west of the marina in the hour before sunset — this is what most people come for.',
        'Take the small passenger boat from the harbour to Cala Bassa or Cala Comte instead of driving; the car parks there fill up early.',
        'Climb to the whitewashed parish church in the old centre, the oldest structure in town.',
        'Follow the coast path north towards Cala Salada for a much quieter stretch of the same coastline.',
        'Use San Antonio as a base for the clubs — you can walk home afterwards, which is rare on this island.',
        'Swim off the town beach in the morning, before the boats head out.',
      ],
      [
        'Geh in der Stunde vor Sonnenuntergang die Felsen westlich des Yachthafens entlang — deshalb kommen die meisten hierher.',
        'Nimm das kleine Ausflugsboot vom Hafen nach Cala Bassa oder Cala Comte statt des Autos; die dortigen Parkplätze sind früh voll.',
        'Steig hinauf zur weiß gekalkten Pfarrkirche im alten Ortskern, dem ältesten Bauwerk des Ortes.',
        'Folge dem Küstenpfad nach Norden Richtung Cala Salada — dieselbe Küste, deutlich ruhiger.',
        'Nutze San Antonio als Basis für die Clubs: Hier kannst du danach zu Fuß zurück, was auf der Insel selten ist.',
        'Schwimm morgens vom Stadtstrand aus, bevor die Boote auslaufen.',
      ],
      [
        'Camina por las rocas al oeste del puerto deportivo en la hora previa a la puesta de sol: es a lo que viene casi todo el mundo.',
        'Coge la barca desde el puerto hasta Cala Bassa o Cala Comte en vez del coche; allí los aparcamientos se llenan pronto.',
        'Sube a la iglesia parroquial encalada del casco antiguo, el edificio más viejo del pueblo.',
        'Sigue el camino de costa hacia el norte, hacia Cala Salada, para un tramo mucho más tranquilo.',
        'Usa San Antonio como base para los clubes: aquí se puede volver andando, algo raro en la isla.',
        'Báñate por la mañana en la playa del pueblo, antes de que salgan los barcos.',
      ],
      [
        'Longez les rochers à l’ouest de la marina dans l’heure qui précède le coucher du soleil : c’est pour cela que la plupart viennent.',
        'Prenez la navette maritime depuis le port vers Cala Bassa ou Cala Comte plutôt que la voiture ; les parkings s’y remplissent tôt.',
        'Montez à l’église paroissiale blanchie du vieux centre, le plus ancien bâtiment de la ville.',
        'Suivez le sentier côtier vers le nord en direction de Cala Salada, portion bien plus calme du même littoral.',
        'Faites de San Antonio votre base pour les clubs : on peut rentrer à pied, ce qui est rare sur l’île.',
        'Nagez le matin depuis la plage de la ville, avant la sortie des bateaux.',
      ],
    ),
    facts: LL(
      [
        'Sant Antoni de Portmany is de Catalaanse naam, San Antonio Abad de Spaanse — dezelfde gemeente.',
        'De baai wijst naar het westen; dat is de reden dat de hele zonsondergangcultuur van Ibiza hier is ontstaan en niet aan de oostkust.',
        'De gemeente reikt veel verder dan het dorp: Cala Bassa, Cala Comte en Cala Salada vallen er allemaal onder.',
        'Zout, amandelen en visserij hielden dit gebied eeuwenlang draaiende, lang voordat er een club stond.',
      ],
      [
        'Sant Antoni de Portmany is the Catalan name, San Antonio Abad the Spanish one — the same municipality.',
        'The bay faces west, which is why Ibiza’s whole sunset culture grew up here rather than on the east coast.',
        'The municipality reaches far beyond the town: Cala Bassa, Cala Comte and Cala Salada all fall within it.',
        'Salt, almonds and fishing kept this area going for centuries, long before there was a club anywhere on it.',
      ],
      [
        'Sant Antoni de Portmany ist der katalanische, San Antonio Abad der spanische Name — dieselbe Gemeinde.',
        'Die Bucht zeigt nach Westen; deshalb entstand die gesamte Sunset-Kultur Ibizas hier und nicht an der Ostküste.',
        'Die Gemeinde reicht weit über den Ort hinaus: Cala Bassa, Cala Comte und Cala Salada gehören dazu.',
        'Salz, Mandeln und Fischfang trugen diese Gegend über Jahrhunderte, lange bevor es hier einen Club gab.',
      ],
      [
        'Sant Antoni de Portmany es el nombre catalán y San Antonio Abad el castellano: el mismo municipio.',
        'La bahía mira al oeste; por eso toda la cultura del atardecer de Ibiza nació aquí y no en la costa este.',
        'El municipio va mucho más allá del pueblo: Cala Bassa, Cala Comte y Cala Salada pertenecen a él.',
        'La sal, la almendra y la pesca sostuvieron esta zona durante siglos, mucho antes de que hubiera un solo club.',
      ],
      [
        'Sant Antoni de Portmany est le nom catalan, San Antonio Abad le nom espagnol : la même commune.',
        'La baie est orientée à l’ouest ; c’est pourquoi toute la culture du coucher de soleil est née ici et non sur la côte est.',
        'La commune dépasse largement la ville : Cala Bassa, Cala Comte et Cala Salada en font partie.',
        'Le sel, l’amande et la pêche ont fait vivre cette zone pendant des siècles, bien avant le moindre club.',
      ],
    ),
    goodFor: L(
      'Groepen, eerste keer op Ibiza, en iedereen die na de club terug wil kunnen lopen.',
      'Groups, first-time visitors, and anyone who wants to walk home from a club.',
      'Gruppen, Erstbesucher und alle, die nach dem Club zu Fuß zurückwollen.',
      'Grupos, primera vez en Ibiza y quien quiera volver andando del club.',
      'Les groupes, les primo-visiteurs et ceux qui veulent rentrer du club à pied.',
    ),
    honestNote: L(
      'In juli en augustus is het rond de haven tot diep in de nacht luid en druk, en de bebouwing is grotendeels functioneel beton. Reis je met kleine kinderen of wil je rust, kies dan een andere basis en kom hier alleen voor de avond.',
      'In July and August the port area is genuinely loud and crowded until the early hours, and much of the building stock is plain concrete. With small children, or if you want quiet, base yourself elsewhere and come here for the evening only.',
      'Im Juli und August ist es rund um den Hafen bis in die frühen Morgenstunden laut und voll, und die Bebauung ist überwiegend schlichter Beton. Mit kleinen Kindern oder wenn du Ruhe willst: woanders wohnen und nur abends herkommen.',
      'En julio y agosto la zona del puerto es ruidosa y está llena hasta la madrugada, y buena parte de la edificación es hormigón funcional. Con niños pequeños, o si buscas tranquilidad, alójate en otro sitio y ven solo por la tarde.',
      'En juillet et août, le secteur du port est bruyant et bondé jusqu’au petit matin, et le bâti est en grande partie du béton fonctionnel. Avec de jeunes enfants ou si vous cherchez le calme, logez ailleurs et venez seulement le soir.',
    ),
  },
  {
    id: 'playa-den-bossa',
    slug: 'playa-den-bossa',
    name: 'Playa d’en Bossa',
    island: 'ibiza',
    imageUrl: '/locations/loc_playa_den_bossa_1782313054063.png',
    tagline: L(
      'Lang, recht zandstrand met de dichtste concentratie dagfeesten',
      'A long, straight sand beach with the densest concentration of daytime parties',
      'Langer, gerader Sandstrand mit der dichtesten Konzentration an Tagespartys',
      'Playa larga y recta con la mayor concentración de fiesta diurna',
      'Une longue plage de sable rectiligne, épicentre des fêtes de jour',
    ),
    intro: L(
      'Playa d’en Bossa is de lange zandstrook direct ten zuiden van Ibiza Stad, tussen de stad en het vliegveld. Het strand is breed, vlak en zandig, en de hele lengte is bebouwd met hotels, strandtenten en clubs. Dit is het gebied waar het feest overdag begint in plaats van ’s nachts.',
      'Playa d’en Bossa is the long strip of sand immediately south of Ibiza Town, between the town and the airport. The beach is wide, flat and sandy, and its full length is built up with hotels, beach bars and clubs. This is the area where the party starts in the afternoon rather than at night.',
      'Playa d’en Bossa ist der lange Sandstreifen direkt südlich von Ibiza-Stadt, zwischen Stadt und Flughafen. Der Strand ist breit, flach und sandig und auf ganzer Länge mit Hotels, Strandbars und Clubs bebaut. Hier beginnt die Party nachmittags statt nachts.',
      'Playa d’en Bossa es la larga franja de arena justo al sur de la ciudad de Ibiza, entre el centro y el aeropuerto. La playa es ancha, plana y arenosa, y está edificada de punta a punta con hoteles, chiringuitos y clubes. Es la zona donde la fiesta empieza por la tarde y no de noche.',
      'Playa d’en Bossa est la longue bande de sable juste au sud d’Ibiza-Ville, entre la ville et l’aéroport. La plage est large, plate et sableuse, bâtie sur toute sa longueur d’hôtels, de paillotes et de clubs. C’est ici que la fête commence l’après-midi plutôt que la nuit.',
    ),
    history: L(
      'Dit was tot ver in de twintigste eeuw open kustland: duinen, zoutvelden en akkers achter het strand, in de gemeente Sant Josep de sa Talaia. De zoutpannen van Ses Salines liggen vlak ten zuiden ervan en waren eeuwenlang de belangrijkste bron van inkomsten van het eiland. De bebouwing van Bossa hoort bij de eerste golf van grootschalig toerisme op Ibiza en groeide vast aan de stad; het is daarmee een van de weinige plekken op het eiland zonder oude kern. Aan het zuidelijke uiteinde staat nog de Torre de ses Portes, een van de wachttorens die de kust tegen aanvallen vanaf zee moesten beschermen.',
      'Until well into the twentieth century this was open coastal land: dunes, salt flats and fields behind the beach, in the municipality of Sant Josep de sa Talaia. The Ses Salines salt pans lie just to the south and were for centuries the island’s main source of income. The build-up of Bossa belongs to the first wave of large-scale tourism on Ibiza and grew until it met the town, which makes it one of the few places on the island with no old core at all. At its southern end stands the Torre de ses Portes, one of the watchtowers built to guard the coast against attack from the sea.',
      'Bis weit ins 20. Jahrhundert war dies offenes Küstenland: Dünen, Salzflächen und Felder hinter dem Strand, in der Gemeinde Sant Josep de sa Talaia. Die Salinen von Ses Salines liegen unmittelbar südlich und waren jahrhundertelang die wichtigste Einnahmequelle der Insel. Die Bebauung von Bossa gehört zur ersten Welle des Massentourismus und wuchs mit der Stadt zusammen — einer der wenigen Orte der Insel ganz ohne alten Kern. Am Südende steht noch der Torre de ses Portes, einer der Wachttürme zum Schutz der Küste vor Angriffen von See.',
      'Hasta bien entrado el siglo XX esto era costa abierta: dunas, salinas y campos detrás de la playa, en el municipio de Sant Josep de sa Talaia. Las salinas de Ses Salines quedan justo al sur y fueron durante siglos la principal fuente de ingresos de la isla. La urbanización de Bossa pertenece a la primera oleada de turismo masivo y creció hasta unirse a la ciudad, lo que la convierte en uno de los pocos lugares de Ibiza sin casco antiguo. En su extremo sur sigue en pie la Torre de ses Portes, una de las torres de vigía levantadas para proteger la costa de ataques por mar.',
      'Jusqu’au milieu du XXᵉ siècle, c’était une côte ouverte : dunes, salines et champs derrière la plage, dans la commune de Sant Josep de sa Talaia. Les salines de Ses Salines sont juste au sud et furent pendant des siècles la principale ressource de l’île. L’urbanisation de Bossa relève de la première vague de tourisme de masse et a fini par rejoindre la ville : c’est l’un des rares endroits d’Ibiza sans noyau ancien. À son extrémité sud se dresse encore la Torre de ses Portes, l’une des tours de guet bâties pour protéger la côte des attaques venues de la mer.',
    ),
    whatToDo: LL(
      [
        'Loop het strand in zijn geheel uit, van de stadskant tot aan de zoutvelden in het zuiden — de sfeer verandert onderweg volledig.',
        'Kies je stuk strand bewust: het noordelijke deel is rustiger, het middendeel is waar de muziek staat.',
        'Doe watersport in de ochtend; het water is dan vlakker en er varen minder boten.',
        'Loop of fiets door naar het natuurpark van Ses Salines aan het zuidelijke einde.',
        'Bekijk de wachttoren Torre de ses Portes op het uiterste zuidpunt, met uitzicht richting Formentera.',
        'Wandel of neem de bus naar Ibiza Stad voor het eten — de oude stad ligt vlakbij.',
      ],
      [
        'Walk the beach end to end, from the town side down to the salt flats — the atmosphere changes completely along the way.',
        'Pick your stretch deliberately: the northern end is calmer, the middle is where the music is.',
        'Do water sports in the morning; the sea is flatter and there is less boat traffic.',
        'Carry on to the Ses Salines nature park at the southern end, on foot or by bike.',
        'Look at the Torre de ses Portes watchtower on the far southern point, facing Formentera.',
        'Walk or take the bus into Ibiza Town for dinner — the old town is close.',
      ],
      [
        'Lauf den Strand einmal ganz ab, von der Stadtseite bis zu den Salinen — die Atmosphäre ändert sich unterwegs vollständig.',
        'Wähl deinen Abschnitt bewusst: Der Nordteil ist ruhiger, in der Mitte steht die Musik.',
        'Mach Wassersport morgens; das Meer ist flacher und es fahren weniger Boote.',
        'Geh oder radle weiter zum Naturpark Ses Salines am Südende.',
        'Sieh dir den Wachtturm Torre de ses Portes an der Südspitze an, mit Blick Richtung Formentera.',
        'Lauf oder fahr mit dem Bus zum Essen nach Ibiza-Stadt — die Altstadt ist nah.',
      ],
      [
        'Recorre la playa entera, del lado de la ciudad hasta las salinas: el ambiente cambia por completo por el camino.',
        'Elige bien tu tramo: la parte norte es más tranquila, en el centro está la música.',
        'Haz deportes acuáticos por la mañana; el mar está más plano y hay menos barcos.',
        'Sigue hasta el parque natural de Ses Salines, en el extremo sur, a pie o en bici.',
        'Acércate a la torre de vigía Torre de ses Portes, en la punta sur, mirando hacia Formentera.',
        'Ve andando o en bus a la ciudad de Ibiza para cenar: el casco antiguo está cerca.',
      ],
      [
        'Parcourez la plage d’un bout à l’autre, du côté ville jusqu’aux salines : l’ambiance change totalement en chemin.',
        'Choisissez votre portion : l’extrémité nord est plus calme, le centre concentre la musique.',
        'Pratiquez les sports nautiques le matin : la mer est plus plate et il y a moins de bateaux.',
        'Poussez jusqu’au parc naturel de Ses Salines, à l’extrémité sud, à pied ou à vélo.',
        'Allez voir la tour de guet Torre de ses Portes, à la pointe sud, face à Formentera.',
        'Rejoignez Ibiza-Ville à pied ou en bus pour dîner : la vieille ville est proche.',
      ],
    ),
    facts: LL(
      [
        'Bossa ligt in de gemeente Sant Josep de sa Talaia, niet in de gemeente Ibiza Stad.',
        'Het strand grenst in het zuiden aan het natuurpark van Ses Salines, waar nog steeds zout wordt gewonnen.',
        'De Torre de ses Portes aan het zuidpunt is een van de historische kustwachttorens van het eiland.',
        'De aanvliegroute van het vliegveld loopt vlak langs dit gebied.',
      ],
      [
        'Bossa lies in the municipality of Sant Josep de sa Talaia, not in the municipality of Ibiza Town.',
        'The beach borders the Ses Salines nature park to the south, where salt is still harvested.',
        'The Torre de ses Portes at the southern point is one of the island’s historic coastal watchtowers.',
        'The airport approach path runs directly alongside this area.',
      ],
      [
        'Bossa liegt in der Gemeinde Sant Josep de sa Talaia, nicht in der Gemeinde Ibiza-Stadt.',
        'Im Süden grenzt der Strand an den Naturpark Ses Salines, wo bis heute Salz gewonnen wird.',
        'Der Torre de ses Portes an der Südspitze ist einer der historischen Küstenwachttürme der Insel.',
        'Die Anflugschneise des Flughafens verläuft unmittelbar neben diesem Gebiet.',
      ],
      [
        'Bossa está en el municipio de Sant Josep de sa Talaia, no en el de Ibiza ciudad.',
        'La playa limita al sur con el parque natural de Ses Salines, donde aún se extrae sal.',
        'La Torre de ses Portes, en la punta sur, es una de las torres de vigía costeras históricas de la isla.',
        'La senda de aproximación del aeropuerto pasa justo al lado de esta zona.',
      ],
      [
        'Bossa se situe dans la commune de Sant Josep de sa Talaia, et non dans celle d’Ibiza-Ville.',
        'La plage borde au sud le parc naturel de Ses Salines, où l’on récolte encore le sel.',
        'La Torre de ses Portes, à la pointe sud, est l’une des tours de guet côtières historiques de l’île.',
        'L’axe d’approche de l’aéroport longe directement cette zone.',
      ],
    ),
    goodFor: L(
      'Wie overdag muziek, watersport en een breed zandstrand wil, met de stad om de hoek.',
      'People who want daytime music, water sports and a wide sand beach, with the town around the corner.',
      'Wer tagsüber Musik, Wassersport und einen breiten Sandstrand will, mit der Stadt um die Ecke.',
      'Quien quiera música de día, deportes acuáticos y arena ancha, con la ciudad al lado.',
      'Ceux qui veulent musique en journée, sports nautiques et large plage de sable, la ville à deux pas.',
    ),
    honestNote: L(
      'Het is druk, luid en het vliegtuiglawaai is echt merkbaar. Er is geen dorpskern en geen historisch karakter: wie een authentiek Spaans dorp zoekt, moet hier niet zijn.',
      'It is busy, loud, and the aircraft noise is genuinely noticeable. There is no village centre and no historic character: if you are after an authentic Spanish village, this is the wrong place.',
      'Es ist voll, laut, und der Fluglärm ist deutlich zu hören. Es gibt keinen Ortskern und keinen historischen Charakter: Wer ein authentisches spanisches Dorf sucht, ist hier falsch.',
      'Hay ruido, mucha gente y el paso de aviones se nota de verdad. No hay casco urbano ni carácter histórico: si buscas un pueblo español auténtico, este no es el sitio.',
      'C’est bruyant, très fréquenté, et le passage des avions s’entend nettement. Il n’y a ni centre-village ni caractère historique : pour un village espagnol authentique, ce n’est pas ici.',
    ),
  },
  {
    id: 'santa-eulalia',
    slug: 'santa-eulalia',
    name: 'Santa Eulària des Riu',
    island: 'ibiza',
    imageUrl: '/locations/loc_santa_eulalia_1782313062420.png',
    tagline: L(
      'Oostkuststadje met een rivier, een kerkheuvel en een rustiger tempo',
      'An east-coast town with a river, a hilltop church and a calmer pace',
      'Ostküstenstädtchen mit Fluss, Kirchenhügel und ruhigerem Tempo',
      'Villa de la costa este con río, iglesia en el cerro y ritmo más calmado',
      'Une ville de la côte est avec sa rivière, son église perchée et un rythme plus calme',
    ),
    intro: L(
      'Santa Eulària des Riu is de derde stad van Ibiza en ligt aan de oostkust, met een lange palmenboulevard, een jachthaven en een echt dorpsplein. De naam betekent “Santa Eulària van de rivier”; de plaats is genoemd naar de waterloop die hier uitkomt. Het is rustiger dan de westkant van het eiland en het gaat er ’s avonds vroeger slapen.',
      'Santa Eulària des Riu is Ibiza’s third town, on the east coast, with a long palm-lined promenade, a marina and a genuine town square. The name means “Santa Eulària of the river”, after the watercourse that reaches the sea here. It is calmer than the west side of the island and it goes to bed earlier.',
      'Santa Eulària des Riu ist die drittgrößte Stadt Ibizas, an der Ostküste, mit langer Palmenpromenade, Yachthafen und einem echten Dorfplatz. Der Name bedeutet „Santa Eulària am Fluss“, nach dem Wasserlauf, der hier ins Meer mündet. Es ist ruhiger als der Westen der Insel und geht abends früher schlafen.',
      'Santa Eulària des Riu es la tercera población de Ibiza, en la costa este, con un largo paseo de palmeras, un puerto deportivo y una plaza de pueblo de verdad. El nombre significa «Santa Eulària del río», por el curso de agua que desemboca aquí. Es más tranquila que el oeste de la isla y se acuesta antes.',
      'Santa Eulària des Riu est la troisième ville d’Ibiza, sur la côte est, avec une longue promenade bordée de palmiers, une marina et une vraie place de village. Le nom signifie « Santa Eulària de la rivière », d’après le cours d’eau qui se jette ici. C’est plus calme que l’ouest de l’île, et on s’y couche plus tôt.',
    ),
    history: L(
      'Boven de stad ligt Puig de Missa, de versterkte kerk op de heuvel: witgekalkt, met dikke muren en een overdekt voorportaal. Zulke kerken werden op Ibiza gebouwd om dienst te doen als toevluchtsoord voor de omliggende boerderijen wanneer er vanaf zee gevaar dreigde. Rond die heuvel lag eeuwenlang de eigenlijke gemeenschap; het huidige stadje aan het water is later ontstaan. De rivier waaraan de plaats haar naam dankt dreef vroeger molens aan en maakte landbouw mogelijk in een gebied waar water schaars is. In de twintigste eeuw werd Santa Eulària een verzamelpunt voor kunstenaars en schrijvers, wat de plaats een andere toon gaf dan de badplaatsen aan de westkant.',
      'Above the town stands Puig de Missa, the fortified church on the hill: whitewashed, thick-walled, with a covered porch. Churches like this were built on Ibiza to serve as refuges for the surrounding farms whenever danger came from the sea. The real community lived around that hill for centuries; the seafront town below it is a later development. The river the town is named after once drove mills and made farming possible in a place where water is scarce. During the twentieth century Santa Eulària became a gathering point for painters and writers, which gave it a different tone from the resorts on the west side.',
      'Über der Stadt liegt Puig de Missa, die befestigte Kirche auf dem Hügel: weiß gekalkt, dickwandig, mit überdachter Vorhalle. Solche Kirchen wurden auf Ibiza als Zufluchtsorte für die umliegenden Bauernhöfe gebaut, wenn von See Gefahr drohte. Um diesen Hügel lebte jahrhundertelang die eigentliche Gemeinde; die Stadt am Wasser entstand später. Der Fluss, dem der Ort seinen Namen verdankt, trieb einst Mühlen an und ermöglichte Landwirtschaft dort, wo Wasser knapp ist. Im 20. Jahrhundert wurde Santa Eulària ein Treffpunkt für Maler und Schriftsteller, was ihm einen anderen Ton gab als den Badeorten im Westen.',
      'Sobre la villa se alza el Puig de Missa, la iglesia fortificada del cerro: encalada, de muros gruesos y porche cubierto. Iglesias así se construyeron en Ibiza para servir de refugio a las casas payesas cuando el peligro llegaba por mar. Alrededor de ese cerro vivió durante siglos la comunidad real; el pueblo junto al agua es posterior. El río que da nombre al lugar movió molinos y permitió cultivar donde el agua escasea. En el siglo XX Santa Eulària se convirtió en punto de encuentro de pintores y escritores, lo que le dio un tono distinto al de los núcleos turísticos del oeste.',
      'Au-dessus de la ville se dresse le Puig de Missa, l’église fortifiée sur la colline : blanchie, aux murs épais, avec un porche couvert. Ces églises furent bâties à Ibiza pour servir de refuge aux fermes alentour quand le danger venait de la mer. La vraie communauté a vécu autour de cette colline pendant des siècles ; la ville en bord de mer est postérieure. La rivière qui donne son nom au lieu a fait tourner des moulins et permis de cultiver là où l’eau manque. Au XXᵉ siècle, Santa Eulària est devenue un point de ralliement pour peintres et écrivains, ce qui lui a donné un ton différent des stations de l’ouest.',
    ),
    whatToDo: LL(
      [
        'Klim naar Puig de Missa: de witte vestingkerk boven de stad, met uitzicht over de kust en het achterland.',
        'Loop de hele boulevard af tot aan de jachthaven en verder langs de kust.',
        'Ga naar de wekelijkse markt en de winkelstraat achter het plein — dit is een van de weinige plaatsen op Ibiza met echte dagelijkse voorzieningen.',
        'Verken de baaitjes ten noorden van de stad, zoals Cala Llenya en Cala Nova, met de auto of de bus.',
        'Eet uit in het centrum: Santa Eulària heeft de dichtste concentratie restaurants van het eiland buiten de hoofdstad.',
        'Volg de oude rivierbedding landinwaarts voor een wandeling weg van de kust.',
      ],
      [
        'Climb up to Puig de Missa: the white fortified church above the town, looking out over the coast and the interior.',
        'Walk the full promenade to the marina and on along the coast.',
        'Visit the weekly market and the shopping street behind the square — this is one of the few places on Ibiza with real everyday amenities.',
        'Explore the coves north of town, such as Cala Llenya and Cala Nova, by car or bus.',
        'Eat out in the centre: Santa Eulària has the island’s densest concentration of restaurants outside the capital.',
        'Follow the old river bed inland for a walk away from the coast.',
      ],
      [
        'Steig hinauf zum Puig de Missa: die weiße Wehrkirche über der Stadt, mit Blick auf Küste und Hinterland.',
        'Geh die gesamte Promenade bis zum Yachthafen und weiter an der Küste entlang.',
        'Besuch den Wochenmarkt und die Einkaufsstraße hinter dem Platz — einer der wenigen Orte Ibizas mit echter Alltagsinfrastruktur.',
        'Erkunde die Buchten nördlich der Stadt, etwa Cala Llenya und Cala Nova, mit Auto oder Bus.',
        'Geh im Zentrum essen: Santa Eulària hat außerhalb der Hauptstadt die höchste Restaurantdichte der Insel.',
        'Folge dem alten Flussbett landeinwärts für einen Spaziergang abseits der Küste.',
      ],
      [
        'Sube al Puig de Missa: la iglesia fortificada blanca sobre la villa, con vistas a la costa y al interior.',
        'Recorre todo el paseo marítimo hasta el puerto deportivo y sigue por la costa.',
        'Ve al mercado semanal y a la calle comercial detrás de la plaza: es de los pocos sitios de Ibiza con servicios cotidianos de verdad.',
        'Explora las calas al norte, como Cala Llenya y Cala Nova, en coche o en bus.',
        'Come en el centro: Santa Eulària tiene la mayor concentración de restaurantes de la isla fuera de la capital.',
        'Sigue el viejo cauce del río hacia el interior para pasear lejos de la costa.',
      ],
      [
        'Montez au Puig de Missa : l’église fortifiée blanche au-dessus de la ville, avec vue sur la côte et l’intérieur.',
        'Faites toute la promenade jusqu’à la marina, puis continuez le long de la côte.',
        'Allez au marché hebdomadaire et à la rue commerçante derrière la place : c’est l’un des rares endroits d’Ibiza avec de vrais commerces du quotidien.',
        'Explorez les criques au nord, comme Cala Llenya et Cala Nova, en voiture ou en bus.',
        'Dînez dans le centre : Santa Eulària a la plus forte densité de restaurants de l’île hors de la capitale.',
        'Remontez l’ancien lit de la rivière vers l’intérieur pour une marche loin du littoral.',
      ],
    ),
    facts: LL(
      [
        'De volledige naam Santa Eulària des Riu verwijst naar de rivier bij de plaats.',
        'Puig de Missa is een versterkte kerk op een heuvel boven de stad — het oudste deel van de gemeente.',
        'De gemeente is de op één na grootste van het eiland naar bevolking en beslaat een groot deel van de oostkust.',
        'Dit is de Ibicenco-kant van het eiland: Catalaans in de Ibizaanse variant is hier nog gewoon straattaal.',
      ],
      [
        'The full name Santa Eulària des Riu refers to the river at the town.',
        'Puig de Missa is a fortified church on the hill above the town — the oldest part of the municipality.',
        'The municipality covers a large part of the east coast and is one of the island’s most populous.',
        'This is the Ibicenco side of the island: Catalan in its Ibizan form is still ordinary street language here.',
      ],
      [
        'Der vollständige Name Santa Eulària des Riu verweist auf den Fluss beim Ort.',
        'Puig de Missa ist eine Wehrkirche auf dem Hügel über der Stadt — der älteste Teil der Gemeinde.',
        'Die Gemeinde umfasst einen großen Teil der Ostküste und ist eine der bevölkerungsreichsten der Insel.',
        'Das ist die ibizenkische Seite der Insel: Katalanisch in seiner ibizenkischen Form ist hier normale Alltagssprache.',
      ],
      [
        'El nombre completo, Santa Eulària des Riu, alude al río junto a la villa.',
        'El Puig de Missa es una iglesia fortificada en el cerro sobre la villa: la parte más antigua del municipio.',
        'El municipio abarca buena parte de la costa este y es de los más poblados de la isla.',
        'Esta es la cara ibicenca de la isla: el catalán en su forma eivissenca sigue siendo lengua de calle.',
      ],
      [
        'Le nom complet, Santa Eulària des Riu, renvoie à la rivière voisine.',
        'Le Puig de Missa est une église fortifiée sur la colline dominant la ville — la partie la plus ancienne de la commune.',
        'La commune couvre une large part de la côte est et compte parmi les plus peuplées de l’île.',
        'C’est le versant ibizenco de l’île : le catalan dans sa forme eivissenca reste une langue de la rue.',
      ],
    ),
    goodFor: L(
      'Gezinnen, koppels en langere verblijven waarbij je niet elke avond uit wilt.',
      'Families, couples and longer stays where you do not want to go out every night.',
      'Familien, Paare und längere Aufenthalte, bei denen man nicht jeden Abend ausgehen will.',
      'Familias, parejas y estancias largas en las que no quieres salir cada noche.',
      'Les familles, les couples et les séjours longs où l’on ne sort pas tous les soirs.',
    ),
    honestNote: L(
      'Het strand van de stad zelf is smal en niet het mooiste van Ibiza, en na middernacht is er weinig te doen. Wil je clubben, dan zit je elke nacht in een taxi.',
      'The town’s own beach is narrow and not among Ibiza’s best, and after midnight there is little going on. If you want to club, you will be in a taxi every night.',
      'Der Stadtstrand ist schmal und nicht der schönste Ibizas, und nach Mitternacht ist wenig los. Wer clubben will, sitzt jede Nacht im Taxi.',
      'La playa del propio pueblo es estrecha y no de las mejores de Ibiza, y después de medianoche hay poco movimiento. Si quieres clubes, acabarás en taxi cada noche.',
      'La plage de la ville est étroite et n’est pas parmi les plus belles d’Ibiza, et après minuit il ne se passe pas grand-chose. Pour les clubs, ce sera le taxi tous les soirs.',
    ),
  },
  {
    id: 'ses-salines',
    slug: 'ses-salines',
    name: 'Ses Salines',
    island: 'ibiza',
    imageUrl: '',
    tagline: L(
      'Werkende zoutpannen, een natuurpark en het strand in het uiterste zuiden',
      'Working salt pans, a nature park and the beach at the island’s southern tip',
      'Arbeitende Salinen, ein Naturpark und der Strand an der Südspitze',
      'Salinas en activo, parque natural y la playa del extremo sur',
      'Des salines en activité, un parc naturel et la plage à la pointe sud',
    ),
    intro: L(
      'Ses Salines is het zuidelijke puntje van Ibiza: een natuurpark van ondiepe zoutbekkens, dennenbos, duinen en een lang zandstrand dat uitkijkt op Formentera. Het is tegelijk industrieterrein en beschermd gebied — er wordt hier nog steeds zout gewonnen. Het strand is een van de bekendste van het eiland en het achterland is een van de rustigste plekken die je er kunt vinden.',
      'Ses Salines is Ibiza’s southern tip: a nature park of shallow salt basins, pine woods, dunes and a long sand beach looking across to Formentera. It is an industrial site and a protected area at the same time — salt is still harvested here. The beach is one of the island’s best known, and the land behind it is among the quietest places on Ibiza.',
      'Ses Salines ist die Südspitze Ibizas: ein Naturpark aus flachen Salzbecken, Kiefernwald, Dünen und einem langen Sandstrand mit Blick nach Formentera. Es ist Industriegebiet und Schutzgebiet zugleich — hier wird bis heute Salz gewonnen. Der Strand gehört zu den bekanntesten der Insel, das Hinterland zu den ruhigsten Ecken.',
      'Ses Salines es el extremo sur de Ibiza: un parque natural de balsas salineras poco profundas, pinar, dunas y una playa larga frente a Formentera. Es a la vez zona industrial y espacio protegido: aquí todavía se produce sal. La playa es de las más conocidas de la isla y el interior, de lo más tranquilo que hay.',
      'Ses Salines est la pointe sud d’Ibiza : un parc naturel de bassins salants peu profonds, de pinèdes, de dunes et d’une longue plage de sable face à Formentera. C’est à la fois un site industriel et un espace protégé — on y récolte encore le sel. La plage est l’une des plus connues de l’île et l’arrière-pays, l’un de ses coins les plus calmes.',
    ),
    history: L(
      'Zout was eeuwenlang het belangrijkste exportproduct van Ibiza, lang voordat er ook maar één toerist kwam. De ondiepe bekkens die je vanaf de weg ziet zijn dezelfde werkende zoutpannen: zeewater wordt ingelaten, verdampt in de zon en laat een zoutkorst achter die geoogst wordt. Dat zout ging de Middellandse Zee over als conserveermiddel — het was de reden dat dit kleine eiland economisch meetelde. Het gebied is nu een natuurpark en een pleisterplaats voor trekvogels, waaronder flamingo’s, die in de bekkens foerageren. De zoutvelden vormen samen met de zee eromheen de omgeving waarin ook de beschermde posidoniavelden liggen.',
      'Salt was Ibiza’s main export for centuries, long before a single tourist arrived. The shallow basins you see from the road are the same working salt pans: seawater is let in, evaporates in the sun and leaves a crust of salt to be harvested. That salt travelled across the Mediterranean as a preservative — it is the reason this small island counted economically at all. The area is now a nature park and a stopover for migratory birds, flamingos among them, which feed in the basins. Together with the sea around it, this stretch forms the setting of the protected posidonia meadows.',
      'Salz war jahrhundertelang das wichtigste Exportgut Ibizas, lange bevor der erste Tourist kam. Die flachen Becken, die man von der Straße sieht, sind dieselben arbeitenden Salinen: Meerwasser wird eingelassen, verdunstet in der Sonne und hinterlässt eine Salzkruste, die geerntet wird. Dieses Salz ging als Konservierungsmittel über das Mittelmeer — deshalb zählte diese kleine Insel wirtschaftlich überhaupt. Heute ist das Gebiet Naturpark und Rastplatz für Zugvögel, darunter Flamingos, die in den Becken Nahrung suchen. Zusammen mit dem umgebenden Meer bildet dieser Abschnitt den Rahmen der geschützten Posidonia-Wiesen.',
      'La sal fue durante siglos la principal exportación de Ibiza, mucho antes de que llegara un solo turista. Las balsas poco profundas que se ven desde la carretera son esas mismas salinas en activo: se deja entrar agua de mar, se evapora al sol y queda una costra de sal que se recoge. Esa sal cruzaba el Mediterráneo como conservante: por ella esta isla pequeña contaba económicamente. Hoy la zona es parque natural y escala de aves migratorias, flamencos incluidos, que se alimentan en las balsas. Junto con el mar que la rodea, este tramo enmarca las praderas protegidas de posidonia.',
      'Le sel fut pendant des siècles la principale exportation d’Ibiza, bien avant l’arrivée du moindre touriste. Les bassins peu profonds visibles depuis la route sont ces mêmes salines en activité : on y fait entrer l’eau de mer, elle s’évapore au soleil et laisse une croûte de sel que l’on récolte. Ce sel traversait la Méditerranée comme agent de conservation — c’est pour lui que cette petite île comptait économiquement. La zone est aujourd’hui un parc naturel et une halte pour les oiseaux migrateurs, dont les flamants, qui se nourrissent dans les bassins. Avec la mer alentour, ce secteur constitue le cadre des herbiers protégés de posidonie.',
    ),
    whatToDo: LL(
      [
        'Rijd of fiets langs de zoutbekkens en stop bij de vogelkijkpunten; in het trekseizoen staan er flamingo’s in het water.',
        'Loop het strand af tot aan het dennenbos aan de zuidkant, waar het meteen veel rustiger wordt.',
        'Ga door tot de Torre de ses Portes op het uiterste punt, met zicht over de zee-engte naar Formentera.',
        'Snorkel boven de zeegrasvelden en let op wat er onder je ligt — de posidonia is beschermd.',
        'Bezoek het gebied in de vroege ochtend of laat in de middag; midden op de dag is er nauwelijks schaduw.',
        'Kijk naar de zoutbergen bij de laadkade: hier verlaat het product nog steeds het eiland.',
      ],
      [
        'Drive or cycle along the salt basins and stop at the birdwatching points; in migration season there are flamingos in the water.',
        'Walk the beach down to the pine woods at the southern end, where it gets much quieter immediately.',
        'Carry on to the Torre de ses Portes on the far point, looking across the strait to Formentera.',
        'Snorkel over the seagrass beds and pay attention to what is under you — the posidonia is protected.',
        'Come early in the morning or late in the afternoon; in the middle of the day there is barely any shade.',
        'Look at the salt mountains by the loading quay: the product still leaves the island from here.',
      ],
      [
        'Fahr oder radle an den Salzbecken entlang und halte an den Beobachtungspunkten; zur Zugzeit stehen Flamingos im Wasser.',
        'Lauf den Strand bis zum Kiefernwald im Süden — dort wird es sofort deutlich ruhiger.',
        'Geh weiter bis zum Torre de ses Portes an der äußersten Spitze, mit Blick über die Meerenge nach Formentera.',
        'Schnorchle über den Seegraswiesen und achte darauf, was unter dir liegt — die Posidonia steht unter Schutz.',
        'Komm früh morgens oder spät nachmittags; mittags gibt es kaum Schatten.',
        'Sieh dir die Salzberge an der Verladekaje an: Von hier verlässt das Produkt bis heute die Insel.',
      ],
      [
        'Recorre en coche o en bici las balsas y párate en los puntos de observación; en época de paso hay flamencos en el agua.',
        'Camina la playa hasta el pinar del extremo sur, donde enseguida hay mucha menos gente.',
        'Sigue hasta la Torre de ses Portes, en la punta, con vistas al canal que separa de Formentera.',
        'Bucea con tubo sobre las praderas de posidonia y fíjate en lo que tienes debajo: está protegida.',
        'Ven a primera hora o a última de la tarde; a mediodía apenas hay sombra.',
        'Mira las montañas de sal junto al muelle de carga: el producto sigue saliendo de la isla desde aquí.',
      ],
      [
        'Longez les bassins en voiture ou à vélo et arrêtez-vous aux points d’observation ; en période de passage, des flamants s’y tiennent.',
        'Marchez jusqu’à la pinède à l’extrémité sud de la plage : le calme y revient immédiatement.',
        'Poussez jusqu’à la Torre de ses Portes, à la pointe, face au détroit qui mène à Formentera.',
        'Faites du snorkeling au-dessus des herbiers et regardez ce qu’il y a sous vous : la posidonie est protégée.',
        'Venez tôt le matin ou en fin d’après-midi ; à midi, il n’y a presque pas d’ombre.',
        'Observez les montagnes de sel près du quai de chargement : le produit quitte encore l’île d’ici.',
      ],
    ),
    facts: LL(
      [
        'De zoutpannen zijn nog in bedrijf; zout was eeuwenlang het belangrijkste exportproduct van Ibiza.',
        'Ses Salines is een natuurpark en een tussenstop voor trekvogels, waaronder flamingo’s.',
        'De posidoniavelden in de zee tussen Ibiza en Formentera zijn onderdeel van het UNESCO-werelderfgoed uit 1999.',
        'Posidonia is beschermd; boten mogen er niet boven ankeren en moeten uitwijken naar zandbodem.',
      ],
      [
        'The salt pans are still in production; salt was Ibiza’s main export for centuries.',
        'Ses Salines is a nature park and a stopover for migratory birds, including flamingos.',
        'The posidonia meadows in the sea between Ibiza and Formentera are part of the 1999 UNESCO World Heritage site.',
        'Posidonia is protected; boats may not anchor over it and have to move to sandy bottom.',
      ],
      [
        'Die Salinen sind weiter in Betrieb; Salz war jahrhundertelang das wichtigste Exportgut Ibizas.',
        'Ses Salines ist Naturpark und Rastplatz für Zugvögel, darunter Flamingos.',
        'Die Posidonia-Wiesen im Meer zwischen Ibiza und Formentera gehören zum UNESCO-Welterbe von 1999.',
        'Posidonia steht unter Schutz; Boote dürfen darüber nicht ankern und müssen auf Sandgrund ausweichen.',
      ],
      [
        'Las salinas siguen en producción; la sal fue durante siglos la principal exportación de Ibiza.',
        'Ses Salines es parque natural y escala de aves migratorias, entre ellas los flamencos.',
        'Las praderas de posidonia entre Ibiza y Formentera forman parte del sitio UNESCO inscrito en 1999.',
        'La posidonia está protegida: los barcos no pueden fondear sobre ella y deben buscar fondo de arena.',
      ],
      [
        'Les salines sont toujours en production ; le sel fut pendant des siècles la principale exportation d’Ibiza.',
        'Ses Salines est un parc naturel et une halte pour les oiseaux migrateurs, dont les flamants.',
        'Les herbiers de posidonie entre Ibiza et Formentera font partie du site UNESCO inscrit en 1999.',
        'La posidonie est protégée : les bateaux ne peuvent pas y mouiller et doivent gagner un fond de sable.',
      ],
    ),
    goodFor: L(
      'Natuurliefhebbers, vogelaars, wandelaars en iedereen die een strand met achterland wil.',
      'Nature lovers, birdwatchers, walkers and anyone who wants a beach with a hinterland.',
      'Naturliebhaber, Vogelbeobachter, Wanderer und alle, die einen Strand mit Hinterland wollen.',
      'Amantes de la naturaleza, aficionados a las aves, caminantes y quien quiera playa con interior.',
      'Les amoureux de nature, les ornithologues, les marcheurs et ceux qui veulent une plage avec un arrière-pays.',
    ),
    honestNote: L(
      'Er is nauwelijks openbaar vervoer buiten het hoogseizoen en de parkeerplaatsen bij het strand zitten in augustus tegen het middaguur vol. In de zomeravonden kunnen de muggen bij de zoutbekkens vervelend zijn.',
      'Public transport is thin outside high season, and the beach car parks are full by midday in August. On summer evenings the mosquitoes near the salt basins can be a real nuisance.',
      'Außerhalb der Hochsaison gibt es kaum öffentlichen Verkehr, und im August sind die Parkplätze am Strand bis mittags voll. An Sommerabenden können die Mücken an den Salzbecken lästig werden.',
      'Fuera de temporada alta apenas hay transporte público y en agosto los aparcamientos de la playa se llenan a mediodía. En las tardes de verano los mosquitos junto a las balsas pueden ser molestos.',
      'Hors haute saison, les transports publics sont rares, et en août les parkings de la plage sont pleins dès midi. Le soir en été, les moustiques près des bassins peuvent être pénibles.',
    ),
  },
  {
    id: 'cala-comte',
    slug: 'cala-comte',
    name: 'Cala Comte (Cala Conta)',
    island: 'ibiza',
    imageUrl: '',
    tagline: L(
      'Lage rotskust met eilandjes voor de kust en het helderste water van de westkant',
      'Low rocky shoreline, islets offshore and the clearest water on the west coast',
      'Flache Felsküste, vorgelagerte Inselchen und das klarste Wasser der Westküste',
      'Costa baja de roca, islotes enfrente y el agua más clara del oeste',
      'Un littoral rocheux bas, des îlots au large et l’eau la plus claire de la côte ouest',
    ),
    intro: L(
      'Cala Comte is geen enkele baai maar een reeks kleine zand- en rotsstranden op een lage landtong aan de westkust, in de gemeente Sant Josep. Voor de kust liggen onbewoonde eilandjes die de zichtlijn bepalen. Het water is er ondiep en uitzonderlijk helder, wat de plek zijn reputatie heeft gegeven.',
      'Cala Comte is not one cove but a series of small sand and rock beaches on a low headland on the west coast, in the municipality of Sant Josep. Uninhabited islets lie just offshore and define the view. The water is shallow and exceptionally clear, which is what gave the place its reputation.',
      'Cala Comte ist keine einzelne Bucht, sondern eine Reihe kleiner Sand- und Felsstrände auf einer flachen Landzunge an der Westküste, in der Gemeinde Sant Josep. Vorgelagert liegen unbewohnte Inselchen, die den Blick prägen. Das Wasser ist flach und außergewöhnlich klar — daher der Ruf des Ortes.',
      'Cala Comte no es una sola cala, sino una sucesión de pequeñas playas de arena y roca sobre una punta baja de la costa oeste, en el municipio de Sant Josep. Frente a ella hay islotes deshabitados que marcan la vista. El agua es poco profunda y excepcionalmente clara, y de ahí le viene la fama.',
      'Cala Comte n’est pas une crique unique mais une série de petites plages de sable et de roche sur une pointe basse de la côte ouest, dans la commune de Sant Josep. Des îlots inhabités, juste au large, structurent la vue. L’eau y est peu profonde et exceptionnellement claire : c’est ce qui a fait sa réputation.',
    ),
    history: L(
      'Deze kust was tot in de twintigste eeuw vrijwel leeg: schrale grond, dennen, wat geiten en een paar boerderijen landinwaarts. Wat er wél altijd was, is uitzicht op de vaarroute langs de westkust, en dat verklaart de wachttorens verderop langs deze kustlijn. De eilandjes voor Cala Comte — waaronder s’Illa des Bosc — zijn onbewoond en horen bij hetzelfde beschermde kustlandschap dat zich naar het zuiden uitstrekt richting Es Vedrà. Toerisme kwam hier laat en relatief licht: er staat geen hotelmuur langs het strand, wat ongebruikelijk is voor een strand met deze bekendheid.',
      'Until the twentieth century this coast was more or less empty: thin soil, pines, a few goats and some farms inland. What it always had was a view over the shipping route along the west coast, which explains the watchtowers further along this shoreline. The islets off Cala Comte — s’Illa des Bosc among them — are uninhabited and belong to the same protected coastal landscape that runs south towards Es Vedrà. Tourism came here late and relatively lightly: there is no wall of hotels along the beach, which is unusual for a beach this well known.',
      'Bis ins 20. Jahrhundert war diese Küste weitgehend leer: magere Böden, Kiefern, ein paar Ziegen und einige Höfe im Hinterland. Was es immer gab, war der Blick auf die Schifffahrtsroute entlang der Westküste — daher die Wachttürme weiter an dieser Küste. Die Inselchen vor Cala Comte, darunter s’Illa des Bosc, sind unbewohnt und gehören zur selben geschützten Küstenlandschaft, die sich nach Süden Richtung Es Vedrà zieht. Der Tourismus kam spät und vergleichsweise sanft: Es gibt keine Hotelmauer am Strand, was für einen so bekannten Strand ungewöhnlich ist.',
      'Hasta el siglo XX esta costa estuvo prácticamente vacía: suelo pobre, pinos, algunas cabras y unas pocas casas payesas tierra adentro. Lo que siempre tuvo fue vista sobre la ruta marítima del oeste, y eso explica las torres de vigía repartidas por este litoral. Los islotes frente a Cala Comte —entre ellos s’Illa des Bosc— están deshabitados y forman parte del mismo paisaje costero protegido que baja hacia Es Vedrà. El turismo llegó tarde y con relativa suavidad: no hay un muro de hoteles en la playa, algo raro en una playa tan conocida.',
      'Jusqu’au XXᵉ siècle, cette côte était à peu près vide : sol pauvre, pins, quelques chèvres et de rares fermes à l’intérieur. Ce qu’elle a toujours eu, c’est une vue sur la route maritime longeant la côte ouest, d’où les tours de guet plus loin sur ce littoral. Les îlots au large de Cala Comte — dont s’Illa des Bosc — sont inhabités et appartiennent au même paysage côtier protégé qui descend vers Es Vedrà. Le tourisme est arrivé tard et assez légèrement : il n’y a pas de mur d’hôtels sur la plage, ce qui est rare pour une plage aussi connue.',
    ),
    whatToDo: LL(
      [
        'Loop de landtong helemaal rond; er liggen meerdere kleine stranden achter elkaar en de laatste zijn altijd rustiger.',
        'Snorkel langs de rotsranden — het water is er ondiep en helder genoeg om de bodem te zien.',
        'Blijf tot zonsondergang: dit is een van de weinige plekken waar de zon achter eilandjes in zee zakt.',
        'Kom vroeg met de auto of neem het bootje vanuit San Antonio; de parkeerplaats is beperkt.',
        'Neem schoenen mee die tegen rotsen kunnen, want niet elk stukje strand is zand.',
        'Combineer met Cala Bassa verderop langs dezelfde kust voor een tweede, bosrijkere baai.',
      ],
      [
        'Walk right around the headland; several small beaches lie one behind the other and the last ones are always quieter.',
        'Snorkel along the rocky edges — the water is shallow and clear enough to see the bottom.',
        'Stay for sunset: this is one of the few places where the sun drops into the sea behind islets.',
        'Arrive early by car, or take the boat from San Antonio; parking is limited.',
        'Bring shoes that cope with rock, because not every part of the shore is sand.',
        'Combine it with Cala Bassa further along the same coast for a second, more wooded bay.',
      ],
      [
        'Umrunde die Landzunge ganz; mehrere kleine Strände liegen hintereinander, die hinteren sind stets ruhiger.',
        'Schnorchle entlang der Felskanten — das Wasser ist flach und klar genug, um den Grund zu sehen.',
        'Bleib bis Sonnenuntergang: einer der wenigen Orte, an denen die Sonne hinter Inselchen ins Meer sinkt.',
        'Komm früh mit dem Auto oder nimm das Boot ab San Antonio; die Parkfläche ist begrenzt.',
        'Nimm felstaugliche Schuhe mit, denn nicht jeder Abschnitt ist Sand.',
        'Kombiniere es mit Cala Bassa an derselben Küste, einer zweiten, waldigeren Bucht.',
      ],
      [
        'Rodea la punta entera: hay varias playitas seguidas y las últimas siempre están más tranquilas.',
        'Haz snorkel junto a las rocas: el agua es somera y lo bastante clara para ver el fondo.',
        'Quédate al atardecer: es de los pocos sitios donde el sol cae al mar por detrás de unos islotes.',
        'Llega pronto en coche o coge la barca desde San Antonio; el aparcamiento es limitado.',
        'Lleva calzado apto para roca, porque no todo el borde es arena.',
        'Combínala con Cala Bassa, en la misma costa, una segunda cala más arbolada.',
      ],
      [
        'Faites le tour complet de la pointe : plusieurs petites plages se succèdent et les dernières sont toujours plus calmes.',
        'Faites du snorkeling le long des rochers : l’eau est peu profonde et assez claire pour voir le fond.',
        'Restez pour le coucher de soleil : c’est l’un des rares endroits où le soleil tombe derrière des îlots.',
        'Arrivez tôt en voiture, ou prenez le bateau depuis San Antonio ; le stationnement est limité.',
        'Prenez des chaussures adaptées aux rochers : tout le rivage n’est pas sableux.',
        'Associez-la à Cala Bassa, sur la même côte, une deuxième anse plus boisée.',
      ],
    ),
    facts: LL(
      [
        'Cala Comte is de Catalaanse spelling, Cala Conta de Spaanse — dezelfde plek.',
        'De eilandjes voor de kust zijn onbewoond en beschermd.',
        'De baai ligt in de gemeente Sant Josep de sa Talaia, de grootste gemeente van het eiland in oppervlakte.',
        'De kust is er laag en rotsachtig; het zand ligt in losse stukjes tussen de rotsen.',
      ],
      [
        'Cala Comte is the Catalan spelling, Cala Conta the Spanish one — the same place.',
        'The islets offshore are uninhabited and protected.',
        'The bay lies in Sant Josep de sa Talaia, the largest municipality on the island by area.',
        'The shore here is low and rocky; the sand comes in separate pockets between the rocks.',
      ],
      [
        'Cala Comte ist die katalanische, Cala Conta die spanische Schreibweise — derselbe Ort.',
        'Die vorgelagerten Inselchen sind unbewohnt und geschützt.',
        'Die Bucht liegt in Sant Josep de sa Talaia, der flächenmäßig größten Gemeinde der Insel.',
        'Die Küste ist hier flach und felsig; der Sand liegt in einzelnen Taschen zwischen den Felsen.',
      ],
      [
        'Cala Comte es la grafía catalana y Cala Conta la castellana: el mismo lugar.',
        'Los islotes de enfrente están deshabitados y protegidos.',
        'La cala pertenece a Sant Josep de sa Talaia, el municipio más extenso de la isla.',
        'Aquí la costa es baja y rocosa; la arena aparece en bolsas sueltas entre las rocas.',
      ],
      [
        'Cala Comte est la graphie catalane, Cala Conta l’espagnole : le même endroit.',
        'Les îlots au large sont inhabités et protégés.',
        'La crique se trouve à Sant Josep de sa Talaia, la plus vaste commune de l’île.',
        'Le rivage est bas et rocheux ; le sable se répartit en poches entre les rochers.',
      ],
    ),
    goodFor: L(
      'Zwemmers, snorkelaars en fotografen; een middag- en avondplek, geen uitvalsbasis.',
      'Swimmers, snorkellers and photographers; an afternoon-and-evening spot rather than a base.',
      'Schwimmer, Schnorchler und Fotografen; ein Ort für Nachmittag und Abend, keine Unterkunftsbasis.',
      'Nadadores, aficionados al snorkel y fotógrafos; un plan de tarde y atardecer, no una base.',
      'Les nageurs, les amateurs de snorkeling et les photographes ; un lieu d’après-midi et de soirée, pas une base.',
    ),
    honestNote: L(
      'Het strand is klein in verhouding tot het aantal mensen dat er komt, en in augustus is het vanaf de middag schouder aan schouder. Zonder auto of boot is het lastig te bereiken en er is weinig schaduw.',
      'The beach is small relative to the number of people who come, and in August it is shoulder to shoulder from midday on. It is awkward to reach without a car or boat, and there is little shade.',
      'Der Strand ist klein im Verhältnis zur Besucherzahl, im August ab Mittag Schulter an Schulter. Ohne Auto oder Boot ist er umständlich zu erreichen, und Schatten gibt es kaum.',
      'La playa es pequeña para la gente que recibe y en agosto va llena desde el mediodía. Sin coche ni barco cuesta llegar, y hay poca sombra.',
      'La plage est petite au regard de la fréquentation, et en août c’est coude à coude dès midi. Sans voiture ni bateau, l’accès est malaisé, et l’ombre est rare.',
    ),
  },
  {
    id: 'cala-jondal',
    slug: 'cala-jondal',
    name: 'Cala Jondal',
    island: 'ibiza',
    imageUrl: '/locations/loc_cala_jondal_1782313083677.png',
    tagline: L(
      'Kiezelbaai in het zuiden waar de jachten voor anker gaan',
      'A pebble bay on the south coast where the yachts drop anchor',
      'Kieselbucht im Süden, vor der die Yachten ankern',
      'Cala de cantos en el sur donde fondean los yates',
      'Une anse de galets au sud, où les yachts jettent l’ancre',
    ),
    intro: L(
      'Cala Jondal is een brede baai aan de zuidkust van Ibiza, ingeklemd tussen kliffen en dennen. De oever bestaat niet uit zand maar uit grote, gladde kiezels; het water wordt snel diep en is daardoor uitzonderlijk helder. Het is een van de duurste stukken kust van het eiland, en dat merk je aan alles.',
      'Cala Jondal is a broad bay on Ibiza’s south coast, held between cliffs and pines. The shore is not sand but large, smooth pebbles; the water deepens quickly and is therefore unusually clear. It is one of the most expensive stretches of coast on the island, and you notice that in everything.',
      'Cala Jondal ist eine breite Bucht an der Südküste Ibizas, zwischen Klippen und Kiefern eingebettet. Das Ufer besteht nicht aus Sand, sondern aus großen, glatten Kieseln; das Wasser wird schnell tief und ist deshalb außergewöhnlich klar. Es ist einer der teuersten Küstenabschnitte der Insel, und das merkt man überall.',
      'Cala Jondal es una bahía amplia de la costa sur de Ibiza, encajada entre acantilados y pinos. La orilla no es de arena sino de cantos grandes y lisos; el agua coge fondo enseguida y por eso es muy transparente. Es uno de los tramos de costa más caros de la isla, y se nota en todo.',
      'Cala Jondal est une large anse de la côte sud d’Ibiza, entre falaises et pins. Le rivage n’est pas de sable mais de gros galets lisses ; l’eau devient vite profonde et donc particulièrement claire. C’est l’un des littoraux les plus chers de l’île, et cela se sent partout.',
    ),
    history: L(
      'Vlak langs deze kust, iets naar het westen, ligt Sa Caleta: de Fenicische nederzetting die samen met Dalt Vila, Puig des Molins en de posidoniavelden het UNESCO-werelderfgoed van Ibiza vormt. Dat is geen toeval — deze zuidkust bood beschutte aanlandingsplekken en uitzicht op de zeeroute. Cala Jondal zelf was lang een afgelegen baai met visserssteigers en terrasakkers op de hellingen erboven; de kliffen maakten het moeilijk bereikbaar over land. Pas met de aanleg van de weg naar beneden werd het een bestemming, en daarna ontwikkelde het zich snel tot de baai waar de boten uit de haven van Ibiza naartoe varen.',
      'Just along this coast, a little to the west, lies Sa Caleta: the Phoenician settlement that forms part of Ibiza’s UNESCO World Heritage site alongside Dalt Vila, Puig des Molins and the posidonia meadows. That is no accident — this south coast offered sheltered landing places and a view over the sea route. Cala Jondal itself was long a remote bay with fishermen’s jetties and terraced fields on the slopes above; the cliffs made it hard to reach by land. Only once the road down was built did it become a destination, after which it turned quickly into the bay the boats from Ibiza harbour head for.',
      'Etwas westlich an dieser Küste liegt Sa Caleta: die phönizische Siedlung, die zusammen mit Dalt Vila, Puig des Molins und den Posidonia-Wiesen das UNESCO-Welterbe Ibizas bildet. Das ist kein Zufall — diese Südküste bot geschützte Anlandeplätze und Sicht auf die Seeroute. Cala Jondal selbst war lange eine abgelegene Bucht mit Fischerstegen und Terrassenfeldern an den Hängen darüber; die Klippen erschwerten den Landzugang. Erst mit dem Bau der Straße hinunter wurde sie zum Ziel und entwickelte sich rasch zu der Bucht, die die Boote aus dem Hafen von Ibiza ansteuern.',
      'Justo en esta costa, algo más al oeste, está Sa Caleta: el asentamiento fenicio que forma parte del sitio UNESCO de Ibiza junto con Dalt Vila, Puig des Molins y las praderas de posidonia. No es casualidad: esta costa sur ofrecía desembarcos resguardados y vista sobre la ruta marítima. Cala Jondal fue durante mucho tiempo una cala apartada, con varaderos de pescadores y bancales en las laderas de arriba; los acantilados dificultaban el acceso por tierra. Solo al abrirse la carretera de bajada se convirtió en destino, y pronto pasó a ser la bahía a la que van los barcos desde el puerto de Ibiza.',
      'Un peu à l’ouest, sur cette même côte, se trouve Sa Caleta : l’établissement phénicien qui compose, avec Dalt Vila, Puig des Molins et les herbiers de posidonie, le site UNESCO d’Ibiza. Ce n’est pas un hasard : cette côte sud offrait des débarquements abrités et une vue sur la route maritime. Cala Jondal fut longtemps une anse isolée, avec ses cales de pêcheurs et des terrasses cultivées sur les pentes ; les falaises rendaient l’accès terrestre difficile. Ce n’est qu’avec la route descendante qu’elle est devenue une destination, puis rapidement l’anse vers laquelle filent les bateaux du port d’Ibiza.',
    ),
    whatToDo: LL(
      [
        'Zwem vanaf de kiezels het diepe water in; het is een van de helderste baaien van de zuidkust.',
        'Kom per boot in plaats van met de auto — de baai is vanaf zee gemaakt en de weg naar beneden is smal.',
        'Loop het kustpad naar het westen richting Sa Caleta, de Fenicische vindplaats op de UNESCO-lijst.',
        'Neem badslippers of waterschoenen mee; de kiezels zijn groot en heet in de zon.',
        'Kijk vanaf het water omhoog naar de kliffen en de terrassen op de hellingen — die vertellen het oude verhaal van deze kust.',
        'Ga vroeg in de middag, voordat de dagboten arriveren.',
      ],
      [
        'Swim straight into deep water off the pebbles; it is one of the clearest bays on the south coast.',
        'Arrive by boat rather than by car — the bay was made from the sea and the road down is narrow.',
        'Walk the coast path west towards Sa Caleta, the Phoenician site on the UNESCO list.',
        'Bring sandals or water shoes; the pebbles are large and get hot in the sun.',
        'Look up from the water at the cliffs and the terraces on the slopes — they tell the older story of this coast.',
        'Come early in the afternoon, before the day boats arrive.',
      ],
      [
        'Schwimm von den Kieseln direkt ins tiefe Wasser; es ist eine der klarsten Buchten der Südküste.',
        'Komm mit dem Boot statt mit dem Auto — die Bucht ist vom Meer her gedacht, die Straße hinunter ist schmal.',
        'Geh den Küstenpfad nach Westen Richtung Sa Caleta, der phönizischen Fundstätte auf der UNESCO-Liste.',
        'Nimm Badeschuhe mit; die Kiesel sind groß und werden in der Sonne heiß.',
        'Schau vom Wasser aus hinauf zu Klippen und Terrassen — sie erzählen die ältere Geschichte dieser Küste.',
        'Komm am frühen Nachmittag, bevor die Ausflugsboote eintreffen.',
      ],
      [
        'Nada desde los cantos hacia el fondo: es de las calas más transparentes del sur.',
        'Llega en barco antes que en coche: la cala está pensada desde el mar y la carretera de bajada es estrecha.',
        'Recorre el camino de costa hacia el oeste, hacia Sa Caleta, el yacimiento fenicio inscrito por la UNESCO.',
        'Lleva escarpines o chanclas: los cantos son grandes y se calientan al sol.',
        'Mira desde el agua hacia los acantilados y los bancales: cuentan la historia antigua de esta costa.',
        'Ve a primera hora de la tarde, antes de que lleguen los barcos de excursión.',
      ],
      [
        'Nagez depuis les galets vers le large : c’est l’une des anses les plus claires de la côte sud.',
        'Venez en bateau plutôt qu’en voiture : l’anse se pense depuis la mer et la route de descente est étroite.',
        'Suivez le sentier côtier vers l’ouest jusqu’à Sa Caleta, le site phénicien inscrit à l’UNESCO.',
        'Prenez des chaussures d’eau : les galets sont gros et brûlants au soleil.',
        'Depuis l’eau, regardez les falaises et les terrasses des pentes : elles racontent l’histoire ancienne de cette côte.',
        'Venez en début d’après-midi, avant l’arrivée des bateaux de la journée.',
      ],
    ),
    facts: LL(
      [
        'De oever bestaat uit kiezels, niet uit zand.',
        'De Fenicische nederzetting Sa Caleta ligt aan dezelfde zuidkust en is onderdeel van het UNESCO-werelderfgoed van Ibiza.',
        'Het water wordt vlak bij de kant al diep, wat de baai geschikt maakt als ankerplaats voor grotere boten.',
        'De baai ligt in de gemeente Sant Josep de sa Talaia.',
      ],
      [
        'The shore is pebble, not sand.',
        'The Phoenician settlement of Sa Caleta lies on this same south coast and forms part of Ibiza’s UNESCO World Heritage site.',
        'The water gets deep close to shore, which is what makes the bay usable as an anchorage for larger boats.',
        'The bay is in the municipality of Sant Josep de sa Talaia.',
      ],
      [
        'Das Ufer besteht aus Kieseln, nicht aus Sand.',
        'Die phönizische Siedlung Sa Caleta liegt an derselben Südküste und gehört zum UNESCO-Welterbe Ibizas.',
        'Das Wasser wird schon nahe am Ufer tief — deshalb eignet sich die Bucht als Ankerplatz für größere Boote.',
        'Die Bucht liegt in der Gemeinde Sant Josep de sa Talaia.',
      ],
      [
        'La orilla es de cantos rodados, no de arena.',
        'El asentamiento fenicio de Sa Caleta está en esta misma costa sur y forma parte del sitio UNESCO de Ibiza.',
        'El agua coge fondo cerca de la orilla, lo que permite fondear barcos grandes.',
        'La cala pertenece al municipio de Sant Josep de sa Talaia.',
      ],
      [
        'Le rivage est fait de galets, pas de sable.',
        'L’établissement phénicien de Sa Caleta se trouve sur cette même côte sud et fait partie du site UNESCO d’Ibiza.',
        'L’eau devient profonde tout près du bord, ce qui permet le mouillage de gros bateaux.',
        'L’anse relève de la commune de Sant Josep de sa Talaia.',
      ],
    ),
    goodFor: L(
      'Een dag vanaf een boot, of wie diep, helder water boven zandstranden verkiest.',
      'A day off a boat, or anyone who prefers deep clear water to a sand beach.',
      'Einen Tag vom Boot aus, oder alle, die tiefes klares Wasser einem Sandstrand vorziehen.',
      'Un día desde un barco, o para quien prefiera agua profunda y clara a la arena.',
      'Une journée depuis un bateau, ou pour qui préfère l’eau profonde et claire au sable.',
    ),
    honestNote: L(
      'De kiezels liggen ongemakkelijk zonder matje en het is hier duidelijk duurder dan elders op het eiland. Met kleine kinderen die pootjebaden is dit niet de beste baai; het loopt snel diep.',
      'The pebbles are uncomfortable without a mat, and prices here are clearly above the island average. It is not the best bay for small children paddling: the bottom drops away fast.',
      'Die Kiesel liegen sich ohne Matte unbequem, und die Preise liegen hier deutlich über dem Inseldurchschnitt. Für kleine Kinder zum Planschen ist die Bucht nicht ideal — es wird schnell tief.',
      'Los cantos son incómodos sin esterilla y aquí los precios están claramente por encima de la media de la isla. Para niños pequeños chapoteando no es la mejor cala: coge fondo rápido.',
      'Les galets sont inconfortables sans natte, et les prix sont nettement au-dessus de la moyenne de l’île. Pour de jeunes enfants qui barbotent, ce n’est pas l’anse idéale : le fond descend vite.',
    ),
  },
  {
    id: 'es-vedra',
    slug: 'es-vedra',
    name: 'Es Vedrà',
    island: 'ibiza',
    imageUrl: '/locations/loc_es_vedra_1782313094075.png',
    tagline: L(
      'De onbewoonde rots voor de zuidwestkust en de uitkijkpunten erboven',
      'The uninhabited rock off the south-west coast, and the viewpoints above it',
      'Der unbewohnte Felsen vor der Südwestküste und die Aussichtspunkte darüber',
      'El peñón deshabitado frente a la costa suroeste y sus miradores',
      'Le rocher inhabité au large de la côte sud-ouest et les points de vue au-dessus',
    ),
    intro: L(
      'Es Vedrà is een onbewoond rotseiland voor de zuidwestkust van Ibiza. Je kunt er niet aan land — het is beschermd natuurgebied — dus “Es Vedrà bezoeken” betekent in de praktijk: de kliffen erboven bezoeken, of erlangs varen. De rots is het meest herkenbare silhouet van het eiland en de reden dat deze hele kuststrook zo leeg is gebleven.',
      'Es Vedrà is an uninhabited rocky islet off the south-west coast of Ibiza. You cannot land on it — it is protected — so “visiting Es Vedrà” means in practice visiting the cliffs above it, or sailing past. The rock is the island’s most recognisable silhouette and the reason this whole stretch of coast has stayed so empty.',
      'Es Vedrà ist eine unbewohnte Felseninsel vor der Südwestküste Ibizas. Anlanden ist nicht möglich — sie steht unter Schutz —, „Es Vedrà besuchen“ heißt also praktisch: die Klippen darüber besuchen oder daran vorbeifahren. Der Felsen ist die markanteste Silhouette der Insel und der Grund, warum dieser Küstenstreifen so leer geblieben ist.',
      'Es Vedrà es un islote rocoso deshabitado frente a la costa suroeste de Ibiza. No se puede desembarcar —es espacio protegido—, así que «visitar Es Vedrà» significa en la práctica ir a los acantilados de enfrente o pasar navegando. El peñón es la silueta más reconocible de la isla y la razón de que todo este tramo de costa siga tan vacío.',
      'Es Vedrà est un îlot rocheux inhabité au large de la côte sud-ouest d’Ibiza. On ne peut pas y débarquer — il est protégé — : « visiter Es Vedrà » signifie donc gagner les falaises qui lui font face, ou passer en bateau. Ce rocher est la silhouette la plus reconnaissable de l’île et la raison pour laquelle tout ce littoral est resté aussi vide.',
    ),
    history: L(
      'Om Es Vedrà hangen meer verhalen dan om welke andere plek op Ibiza ook: van sirenen uit de Odyssee tot magnetische velden en lichtverschijnselen. Die verhalen zijn precies dat — verhalen. Wat wél vaststaat is dat de rots eeuwenlang een oriëntatiepunt was voor iedereen die langs deze kust voer, en dat er in de negentiende eeuw korte tijd mensen hebben geleefd en gewerkt, onder wie een priester die er in afzondering verbleef. Op de kliffen tegenover de rots staat de Torre des Savinar, een van de wachttorens die de kust bewaakten; het pad ernaartoe is nog steeds de klassieke route naar het uitzicht. Vandaag is Es Vedrà samen met het naburige Es Vedranell beschermd gebied.',
      'More stories attach to Es Vedrà than to any other place on Ibiza: sirens from the Odyssey, magnetic fields, strange lights. Those stories are exactly that — stories. What is certain is that the rock was for centuries a landmark for anyone sailing this coast, and that in the nineteenth century people briefly lived and worked on it, among them a priest who stayed there in seclusion. On the cliffs facing the rock stands the Torre des Savinar, one of the watchtowers that guarded the coast; the path to it is still the classic route to the view. Today Es Vedrà, together with neighbouring Es Vedranell, is protected land.',
      'Um Es Vedrà ranken sich mehr Geschichten als um jeden anderen Ort Ibizas: Sirenen aus der Odyssee, Magnetfelder, Lichterscheinungen. Diese Geschichten sind genau das — Geschichten. Sicher ist, dass der Felsen jahrhundertelang eine Landmarke für alle war, die diese Küste befuhren, und dass im 19. Jahrhundert kurzzeitig Menschen dort lebten und arbeiteten, darunter ein Priester, der sich dorthin zurückzog. Auf den Klippen gegenüber steht der Torre des Savinar, einer der Küstenwachttürme; der Weg dorthin ist bis heute die klassische Route zum Ausblick. Heute stehen Es Vedrà und das benachbarte Es Vedranell unter Schutz.',
      'Sobre Es Vedrà circulan más historias que sobre cualquier otro lugar de Ibiza: sirenas de la Odisea, campos magnéticos, luces extrañas. Esas historias son justamente eso: historias. Lo seguro es que el peñón fue durante siglos una referencia para quien navegaba esta costa, y que en el siglo XIX hubo gente viviendo y trabajando allí brevemente, entre ella un sacerdote que se retiró al islote. En los acantilados de enfrente está la Torre des Savinar, una de las torres de vigía del litoral; el camino hacia ella sigue siendo la ruta clásica al mirador. Hoy Es Vedrà y el vecino Es Vedranell son espacio protegido.',
      'Es Vedrà charrie plus de récits que n’importe quel autre lieu d’Ibiza : sirènes de l’Odyssée, champs magnétiques, lumières étranges. Ces récits sont exactement cela — des récits. Ce qui est sûr, c’est que le rocher fut pendant des siècles un amer pour qui longeait cette côte, et qu’au XIXᵉ siècle des hommes y ont brièvement vécu et travaillé, dont un prêtre venu s’y retirer. Sur les falaises d’en face se dresse la Torre des Savinar, l’une des tours de guet du littoral ; le chemin qui y mène reste l’itinéraire classique vers le point de vue. Aujourd’hui, Es Vedrà et le voisin Es Vedranell sont protégés.',
    ),
    whatToDo: LL(
      [
        'Rijd naar het uitzichtpunt bij de Torre des Savinar en loop het laatste stuk te voet; hiervandaan zie je de rots frontaal.',
        'Daal af naar Cala d’Hort, het strandje recht tegenover Es Vedrà, en zwem met de rots in beeld.',
        'Vaar er in een boot omheen om de schaal te begrijpen — vanaf het water is het een ander ding dan vanaf de klif.',
        'Ga voor zonsondergang, maar reken op gezelschap: dit is een van de drukste uitzichtpunten van het eiland.',
        'Neem stevige schoenen mee; de paden op de kliffen zijn los, stoffig en steil.',
        'Ga niet proberen aan land te gaan op de rots — het is beschermd gebied.',
      ],
      [
        'Drive to the viewpoint by the Torre des Savinar and walk the last stretch; from here you see the rock head-on.',
        'Drop down to Cala d’Hort, the small beach directly opposite Es Vedrà, and swim with the rock in view.',
        'Go round it in a boat to grasp the scale — from the water it is a different object than from the cliff.',
        'Go for sunset, but expect company: this is one of the busiest viewpoints on the island.',
        'Bring proper shoes; the cliff paths are loose, dusty and steep.',
        'Do not try to land on the rock itself — it is protected.',
      ],
      [
        'Fahr zum Aussichtspunkt beim Torre des Savinar und geh das letzte Stück zu Fuß; von hier siehst du den Felsen frontal.',
        'Steig hinab nach Cala d’Hort, dem kleinen Strand direkt gegenüber, und schwimm mit dem Felsen im Blick.',
        'Umfahr ihn mit dem Boot, um den Maßstab zu begreifen — vom Wasser aus ist er ein anderes Ding als von der Klippe.',
        'Komm zum Sonnenuntergang, aber rechne mit Gesellschaft: einer der meistbesuchten Aussichtspunkte der Insel.',
        'Nimm festes Schuhwerk mit; die Klippenpfade sind lose, staubig und steil.',
        'Versuche nicht, auf dem Felsen anzulanden — er steht unter Schutz.',
      ],
      [
        'Sube al mirador junto a la Torre des Savinar y haz el último tramo a pie: desde ahí se ve el peñón de frente.',
        'Baja a Cala d’Hort, la playita justo enfrente de Es Vedrà, y báñate con el peñón delante.',
        'Rodéalo en barco para entender su escala: desde el agua es otra cosa que desde el acantilado.',
        'Ve al atardecer, pero cuenta con compañía: es uno de los miradores más concurridos de la isla.',
        'Lleva calzado firme; los senderos del acantilado son sueltos, polvorientos y empinados.',
        'No intentes desembarcar en el peñón: es espacio protegido.',
      ],
      [
        'Montez au belvédère près de la Torre des Savinar et faites la fin à pied : de là, le rocher se voit de face.',
        'Descendez à Cala d’Hort, la petite plage juste en face d’Es Vedrà, et nagez avec le rocher devant vous.',
        'Contournez-le en bateau pour en saisir l’échelle : depuis l’eau, ce n’est pas le même objet que depuis la falaise.',
        'Venez au coucher du soleil, mais attendez-vous à du monde : c’est l’un des points de vue les plus fréquentés de l’île.',
        'Prenez de bonnes chaussures : les sentiers de falaise sont meubles, poussiéreux et raides.',
        'N’essayez pas de débarquer sur le rocher : il est protégé.',
      ],
    ),
    facts: LL(
      [
        'Es Vedrà is onbewoond en ligt voor de zuidwestkust van Ibiza.',
        'Het eiland en het naburige Es Vedranell zijn beschermd natuurgebied; aan land gaan mag niet.',
        'De verhalen over magnetisme en sirenen zijn folklore, geen vastgestelde feiten.',
        'De Torre des Savinar op de kliffen ertegenover is een van de historische wachttorens van de kust.',
      ],
      [
        'Es Vedrà is uninhabited and lies off the south-west coast of Ibiza.',
        'The islet and neighbouring Es Vedranell are protected; landing is not permitted.',
        'The stories about magnetism and sirens are folklore, not established fact.',
        'The Torre des Savinar on the cliffs opposite is one of the coast’s historic watchtowers.',
      ],
      [
        'Es Vedrà ist unbewohnt und liegt vor der Südwestküste Ibizas.',
        'Die Insel und das benachbarte Es Vedranell stehen unter Schutz; Anlanden ist nicht erlaubt.',
        'Die Geschichten über Magnetismus und Sirenen sind Folklore, keine gesicherten Fakten.',
        'Der Torre des Savinar auf den Klippen gegenüber ist einer der historischen Küstenwachttürme.',
      ],
      [
        'Es Vedrà está deshabitado y se encuentra frente a la costa suroeste de Ibiza.',
        'El islote y el vecino Es Vedranell están protegidos; no se permite desembarcar.',
        'Las historias sobre magnetismo y sirenas son folclore, no hechos comprobados.',
        'La Torre des Savinar, en los acantilados de enfrente, es una de las torres de vigía históricas del litoral.',
      ],
      [
        'Es Vedrà est inhabité et se situe au large de la côte sud-ouest d’Ibiza.',
        'L’îlot et le voisin Es Vedranell sont protégés ; le débarquement n’est pas autorisé.',
        'Les récits de magnétisme et de sirènes relèvent du folklore, pas de faits établis.',
        'La Torre des Savinar, sur les falaises d’en face, est l’une des tours de guet historiques de la côte.',
      ],
    ),
    goodFor: L(
      'Wandelaars, fotografen en iedereen die één keer een uitzicht wil dat het eiland samenvat.',
      'Walkers, photographers, and anyone who wants one view that sums the island up.',
      'Wanderer, Fotografen und alle, die einmal den Ausblick sehen wollen, der die Insel zusammenfasst.',
      'Caminantes, fotógrafos y quien quiera ver una vista que resuma la isla.',
      'Les marcheurs, les photographes et ceux qui veulent une vue qui résume l’île.',
    ),
    honestNote: L(
      'Je kunt niet op de rots komen en er is bij de uitzichtpunten geen enkele voorziening. De laatste kilometers zijn onverharde weg, bij zonsondergang staat het er vol auto’s en het pad is met slecht schoeisel of in het donker echt gevaarlijk.',
      'You cannot get onto the rock, and there are no facilities at all at the viewpoints. The last stretch is unpaved track, at sunset it fills with parked cars, and the path is genuinely dangerous in poor footwear or after dark.',
      'Auf den Felsen kommt man nicht, und an den Aussichtspunkten gibt es keinerlei Infrastruktur. Das letzte Stück ist Schotterpiste, zum Sonnenuntergang stehen dort dicht an dicht Autos, und der Pfad ist mit schlechtem Schuhwerk oder im Dunkeln wirklich gefährlich.',
      'No se puede acceder al peñón y en los miradores no hay ningún servicio. El último tramo es pista sin asfaltar, al atardecer se llena de coches y el sendero es realmente peligroso con mal calzado o de noche.',
      'On ne peut pas accéder au rocher et il n’y a aucun équipement aux belvédères. Les derniers kilomètres sont une piste non revêtue, au coucher du soleil les voitures s’entassent, et le sentier est vraiment dangereux mal chaussé ou de nuit.',
    ),
  },
]

export function getLocationBySlug(slug: string): LocationData | undefined {
  return locations.find((loc) => loc.slug === slug)
}

export function locationsByIsland(island: Island): LocationData[] {
  return locations.filter((loc) => loc.island === island)
}
