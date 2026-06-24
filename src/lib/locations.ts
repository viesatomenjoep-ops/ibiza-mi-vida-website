export interface LocationData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
}

export const locations: LocationData[] = [
  {
    id: "san-antonio",
    slug: "san-antonio",
    name: "San Antonio",
    tagline: "De wereldberoemde zonsondergang en bruisende nachten",
    description: "San Antonio (Sant Antoni de Portmany) staat wereldwijd bekend om de adembenemende zonsondergangen langs de 'Sunset Strip'. Met legendarische plekken zoals Café del Mar en Mambo trekt deze locatie dagelijks duizenden bezoekers die de zon in de zee zien zakken. Daarnaast vind je hier bruisende strandclubs en grote superclubs zoals Eden en Es Paradis.",
    imageUrl: "/locations/loc_san_antonio_1782313029811.png"
  },
  {
    id: "ibiza-stad",
    slug: "ibiza-stad",
    name: "Ibiza Stad",
    tagline: "Historie, luxe en exclusieve nachten",
    description: "Ibiza Stad (Eivissa) is het hart van het eiland. Het combineert de historische charme van de versterkte oude stad (Dalt Vila) met de exclusieve luxe van de jachthaven Marina Botafoch. Hier vind je boetieks van wereldklasse, fine-dining restaurants en de meest exclusieve nachtclubs zoals Pacha.",
    imageUrl: "/locations/loc_ibiza_stad_1782313041046.png"
  },
  {
    id: "playa-den-bossa",
    slug: "playa-den-bossa",
    name: "Playa d'en Bossa",
    tagline: "Het langste zandstrand en epicentrum van de partyscene",
    description: "Playa d'en Bossa biedt de ultieme Ibiza strandervaring. Met het langste stuk zandstrand van het eiland is het overdag de perfecte plek om te ontspannen bij trendy beachclubs zoals Ushuaïa en Hï Ibiza. Zodra de avond valt, transformeert deze locatie in het kloppende hart van de wereldwijde dancemuziek.",
    imageUrl: "/locations/loc_playa_den_bossa_1782313054063.png"
  },
  {
    id: "santa-eulalia",
    slug: "santa-eulalia",
    name: "Santa Eulalia",
    tagline: "Rustig, gastronomisch en perfect voor families",
    description: "Santa Eulalia del Río staat bekend om zijn rustigere, meer ontspannen sfeer. Het is de gastronomische hoofdstad van het eiland met een prachtige, palmbomen omzoomde promenade. Ideaal voor families, koppels en degenen die de wilde feesten willen vermijden maar toch de schoonheid van Ibiza willen ervaren.",
    imageUrl: "/locations/loc_santa_eulalia_1782313062420.png"
  },
  {
    id: "formentera",
    slug: "formentera",
    name: "Formentera",
    tagline: "Het Caribisch gebied van Europa",
    description: "Formentera is het kleinste bewoonde eiland van de Balearen en is alleen bereikbaar per boot vanaf Ibiza. Het staat wereldwijd bekend om de kristalheldere turquoise wateren en lange, ongerepte witte zandstranden zoals Playa de Ses Illetes. Een absolute must-visit voor een ontspannen dagtrip of exclusieve bootcharter.",
    imageUrl: "/locations/loc_formentera_1782313071571.png"
  },
  {
    id: "cala-jondal",
    slug: "cala-jondal",
    name: "Cala Jondal",
    tagline: "Chique strandclubs en kristalhelder water",
    description: "Cala Jondal is een prachtige, met dennenbomen omgeven baai in het zuiden van Ibiza. Het staat bekend als een van de meest chique locaties van het eiland, met beroemde luxe beachclubs zoals Blue Marlin en Jondal. De baai bestaat uit grote, gladde kiezelstenen, en jachten ankeren vaak net buiten de kustlijn.",
    imageUrl: "/locations/loc_cala_jondal_1782313083677.png"
  },
  {
    id: "es-vedra",
    slug: "es-vedra",
    name: "Es Vedrà",
    tagline: "Magisch en mystiek rotseiland",
    description: "Es Vedrà is een spectaculaire onbewoonde rotsachtige formatie die bijna 400 meter uit de zee oprijst voor de zuidwestkust van Ibiza. Er hangen vele mythen en legendes rondom dit rotseiland; sommigen beweren dat het de op twee na meest magnetische plek op aarde is. Het biedt een van de meest magische zonsondergangen die je ooit zult meemaken.",
    imageUrl: "/locations/loc_es_vedra_1782313094075.png"
  },
  {
    id: "san-juan",
    slug: "san-juan",
    name: "San Juan",
    tagline: "Het authentieke en ongerepte noorden",
    description: "San Juan (Sant Joan de Labritja) biedt een kijkje in het authentieke en landelijke Ibiza. Het dorp heeft zijn oude charme behouden, met witgekalkte huizen, geplaveide straten en een beroemde zondagmarkt. Het noorden van het eiland staat garant voor rust, natuur, verborgen baaien en een sterke bohème-sfeer.",
    imageUrl: "/locations/loc_san_juan_1782313104066.png"
  }
];

export function getLocationBySlug(slug: string): LocationData | undefined {
  return locations.find(loc => loc.slug === slug);
}
