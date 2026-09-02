// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE BOAT FLEET — The Yacht Broker (affiliatepartner)
//
// GEGENEREERD uit de partner-API (theyachtbroker.club/api/availability) en de
// vlootdossiers van 1 september 2026 — niet met de hand bewerken; draai
// scripts/generate-fleet.md-beschreven stappen opnieuw bij een vlootwissel.
//
// Wat hier staat en waarom:
//  - Specificaties, havens en prijsbanden komen uit de API die de broker zelf
//    voor zijn partnerkalender onderhoudt — verser dan welk dossier ook. De
//    statische banden hieronder zijn de TERUGVAL; de live prijs en
//    beschikbaarheid per datum komen runtime uit dezelfde API via
//    src/lib/yacht-broker.ts.
//  - `length` staat er alleen bij boten waarvan het dossier hem letterlijk
//    noemt (22 van 94). De categorie-indeling (jacht ≥ 50 voet) gebruikt intern
//    ook de modelnaam, maar een afgeleide lengte publiceren we niet als feit.
//  - `image` en `pdf` wijzen naar bestanden die de broker host; elke URL is bij
//    generatie met een HEAD-request gecontroleerd (94/94 online). De hosting is
//    hoofdlettergevoelig en de extensies wisselen — daarom staat hier de
//    geverifieerde URL en niet een patroon.
//  - GEEN inbegrepen-claims meer op vlootniveau. De oude vloot had één
//    leverancier met één pakket; deze komt van negen verhuurders met elk eigen
//    voorwaarden (bij de een is btw inbegrepen, bij de ander niet eens de
//    schipper). Wat geldt staat in het dossier per boot en wordt door Simon
//    vooraf bevestigd. Eén generieke badge-rij zou voor een deel van de vloot
//    aantoonbaar onwaar zijn.
// ─────────────────────────────────────────────────────────────────────────────

import { cloudinaryFetchRemote } from '@/lib/cloudinary';

export type FleetCategory = 'yacht' | 'motorboat';

export interface FleetPrice {
  low: number;                 // laagseizoensband (rest van het jaar)
  mid?: number;                // tussenseizoen, indien de broker die voert
  high: number;                // hoogseizoensband (juli/augustus of piek)
  highWindow?: string;         // afwijkend venster, als tekst
}

export interface Boat {
  slug: string;
  model: string;               // bijv. "Vanquish VQ58"
  name?: string;               // eigennaam van de boot, bijv. "The Wolf"
  pax: number;
  /** Alleen aanwezig als het dossier de lengte letterlijk noemt. */
  length?: number;             // meters
  marina: string;
  image: string;
  /**
   * srcset voor de kaartfoto: drie Cloudinary-breedtes, rechtstreeks van de
   * CDN. Zie FLEET hieronder voor waarom niet via next/image.
   */
  imageSet?: string;
  /** Dossier (specificaties, foto's, voorwaarden) zoals de broker het host. */
  pdf: string;
  /** Genormaliseerde naam waarmee live data uit de partner-API gekoppeld wordt. */
  brokerKey: string;
  /**
   * Aantal pagina's in het dossier, geteld bij generatie.
   *
   * Nodig omdat de dossierweergave elke pagina als losse afbeelding opvraagt
   * bij Cloudinary en dus vooraf moet weten hoeveel er zijn. Zonder dit getal
   * zou de browser moeten blijven proberen tot er een 400 terugkomt — een
   * mislukte request per dossier, en een zichtbare hapering aan het eind.
   *
   * 0 betekent: geen pagina-weergave, toon meteen de PDF-link. Dat geldt voor
   * Bamba (leeg bestand) en voor Norfeu en Lap One: hun dossiers zijn 15,6 en
   * 15,5 MB en Cloudinary weigert bronbestanden boven 10 MB
   * ("File size too large. Got 15649322. Maximum is 10485760."). Zonder deze
   * nul zou de browser voor die twee elf mislukte verzoeken doen voordat de
   * uitwijk verschijnt.
   */
  pdfPages?: number;
  category: FleetCategory;
  /** @deprecated de nieuwe vloot heeft geen uniforme schipperregeling; zie het dossier. */
  captainIncluded?: boolean;
  captainExtra?: number;
  price: FleetPrice;
}

const RAW_FLEET: Boat[] = [
  { slug: 'ogum', model: "Ferretti 920", name: "Ogum", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/ogum.png", pdf: "https://theyachtbroker.club/pdf/ogum.pdf", brokerKey: 'ogum', pdfPages: 11, category: 'yacht', price: { low: 15125, high: 17545 } },
  { slug: 'fuquet-duet', model: "Sanlorenzo SX76", name: "FUQUET DUET", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/fuquetduet.png", pdf: "https://theyachtbroker.club/pdf/fuquetduet.pdf", brokerKey: 'fuquetduet', pdfPages: 10, category: 'yacht', price: { low: 9750, mid: 10500, high: 12000 } },
  { slug: 'polly', model: "Riva 75 Venere", name: "POLLY", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/polly.png", pdf: "https://theyachtbroker.club/pdf/polly.pdf", brokerKey: 'polly', pdfPages: 9, category: 'yacht', price: { low: 6292, mid: 7381, high: 8833 } },
  { slug: 'legendary', model: "Pershing 72", name: "LEGENDARY", pax: 12, length: 22.26, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/legendary.JPG", pdf: "https://theyachtbroker.club/pdf/legendary.pdf", brokerKey: 'legendary', pdfPages: 19, category: 'yacht', price: { low: 6200, mid: 6600, high: 8200 } },
  { slug: 'bamba', model: "Sunseeker Predator 74", name: "Bamba", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/bamba.jpg", pdf: "https://theyachtbroker.club/pdf/bamba.pdf", brokerKey: 'bamba', category: 'yacht', price: { low: 6095, mid: 7095, high: 8095 } },
  { slug: 'boss-sea', model: "Baia Panther 80", name: "Boss Sea", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/bosssea.png", pdf: "https://theyachtbroker.club/pdf/bosssea.pdf", brokerKey: 'bosssea', pdfPages: 12, category: 'yacht', price: { low: 4900, mid: 5900, high: 6900 } },
  { slug: 'optimum', model: "Pershing 62", name: "OPTIMUM", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/optimum.png", pdf: "https://theyachtbroker.club/pdf/optimum.pdf", brokerKey: 'optimum', pdfPages: 8, category: 'yacht', price: { low: 5384.5, mid: 5989.5, high: 6715.5 } },
  { slug: 'skateaway', model: "Baia Italia 70", name: "Skateaway", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/skateaway.png", pdf: "https://theyachtbroker.club/pdf/skateaway.pdf", brokerKey: 'skateaway', pdfPages: 9, category: 'yacht', price: { low: 5445, mid: 6050, high: 6655 } },
  { slug: 'sonora', model: "Itama 62", name: "SONORA", pax: 10, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/sonora.png", pdf: "https://theyachtbroker.club/pdf/sonora.pdf", brokerKey: 'sonora', pdfPages: 8, category: 'yacht', price: { low: 4235, mid: 5445, high: 6534 } },
  { slug: 'adelita', model: "Azimut 60 Seadeck", name: "Adelita", pax: 10, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/adelita.png", pdf: "https://theyachtbroker.club/pdf/adelita.pdf", brokerKey: 'adelita', pdfPages: 9, category: 'yacht', price: { low: 4000, mid: 5200, high: 6500 } },
  { slug: 'q', model: "Okean 55", name: "Q", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/q.png", pdf: "https://theyachtbroker.club/pdf/q.pdf", brokerKey: 'q', pdfPages: 10, category: 'yacht', price: { low: 3900, mid: 4900, high: 6000 } },
  { slug: 'mi-paraiso', model: "Vanquish VQ58", name: "MI PARAISO", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/miparaiso.png", pdf: "https://theyachtbroker.club/pdf/miparaiso.pdf", brokerKey: 'miparaiso', pdfPages: 5, category: 'yacht', price: { low: 4100, mid: 4700, high: 5700 } },
  { slug: 'real-diva', model: "Vanquish VQ58", name: "REAL DIVA", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/realdiva.png", pdf: "https://theyachtbroker.club/pdf/realdiva.pdf", brokerKey: 'realdiva', pdfPages: 7, category: 'yacht', price: { low: 4100, mid: 4700, high: 5700 } },
  { slug: 'shadow', model: "Sunseeker Predator 62", name: "Shadow", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/shadow.png", pdf: "https://theyachtbroker.club/pdf/shadow.pdf", brokerKey: 'shadow', pdfPages: 14, category: 'yacht', price: { low: 3790, mid: 4690, high: 5590 } },
  { slug: 'bes', model: "Sunseeker 62", name: "BES", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/bes.png", pdf: "https://theyachtbroker.club/pdf/bes.pdf", brokerKey: 'bes', pdfPages: 10, category: 'yacht', price: { low: 3300, mid: 4400, high: 5300 } },
  { slug: 'casa-atlantis', model: "Vanquish VQ52", name: "CASA ATLANTIS", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/casaatlantis.png", pdf: "https://theyachtbroker.club/pdf/casaatlantis.pdf", brokerKey: 'casaatlantis', pdfPages: 3, category: 'yacht', price: { low: 3600, mid: 3950, high: 4950 } },
  { slug: 'big-escape', model: "Stratos 50", name: "BIG ESCAPE", pax: 12, marina: "Santa Eulalia", image: "https://theyachtbroker.club/img/bigescape.png", pdf: "https://theyachtbroker.club/pdf/bigescape.pdf", brokerKey: 'bigescape', pdfPages: 6, category: 'yacht', price: { low: 3500, mid: 3850, high: 4850 } },
  { slug: 'sport', model: "Wally 50", name: "SPORT", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/sport.png", pdf: "https://theyachtbroker.club/pdf/sport.pdf", brokerKey: 'sport', pdfPages: 3, category: 'yacht', price: { low: 3500, mid: 3850, high: 4850 } },
  { slug: 'scalpers', model: "Waterdream California 65", name: "SCALPERS", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/scalpers.png", pdf: "https://theyachtbroker.club/pdf/scalpers.pdf", brokerKey: 'scalpers', pdfPages: 14, category: 'yacht', price: { low: 3500, mid: 3850, high: 4750 } },
  { slug: 'jemima', model: "Wally 48", name: "JEMIMA", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/jemima.png", pdf: "https://theyachtbroker.club/pdf/jemima.pdf", brokerKey: 'jemima', pdfPages: 5, category: 'motorboat', price: { low: 3400, mid: 3700, high: 4700 } },
  { slug: 'salty-spirit', model: "Pardo 50", name: "Salty Spirit", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/saltyspirit.png", pdf: "https://theyachtbroker.club/pdf/saltyspirit.pdf", brokerKey: 'saltyspirit', pdfPages: 10, category: 'yacht', price: { low: 3190, mid: 3690, high: 4290 } },
  { slug: 'daytona', model: "Daytona 50", name: "Daytona", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/daytona.png", pdf: "https://theyachtbroker.club/pdf/daytona.pdf", brokerKey: 'daytona', pdfPages: 6, category: 'yacht', price: { low: 3025, mid: 3509, high: 4235 } },
  { slug: 'good-waves-only', model: "Absolute 52 Fly", name: "GOOD WAVES ONLY", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/goodwavesonly.png", pdf: "https://theyachtbroker.club/pdf/goodwavesonly.pdf", brokerKey: 'goodwavesonly', pdfPages: 9, category: 'yacht', price: { low: 3267, mid: 3751, high: 4235 } },
  { slug: 'next-level', model: "Riva Rivale 56", name: "NEXT LEVEL", pax: 12, marina: "Santa Eulalia", image: "https://theyachtbroker.club/img/nextlevel.png", pdf: "https://theyachtbroker.club/pdf/nextlevel.pdf", brokerKey: 'nextlevel', pdfPages: 4, category: 'yacht', price: { low: 3100, mid: 3450, high: 4200 } },
  { slug: 'manzana', model: "Princess V65", name: "Manzana", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/manzana.png", pdf: "https://theyachtbroker.club/pdf/manzana.pdf", brokerKey: 'manzana', pdfPages: 8, category: 'yacht', price: { low: 2905, high: 4105 } },
  { slug: 'celebrate-life', model: "Steeler Bronson 50", name: "CELEBRATE LIFE", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/celebratelife.png", pdf: "https://theyachtbroker.club/pdf/celebratelife.pdf", brokerKey: 'celebratelife', pdfPages: 5, category: 'yacht', price: { low: 3000, mid: 3350, high: 4100 } },
  { slug: 'estela', model: "Abacus 61", name: "Estela", pax: 10, marina: "Santa Eulalia", image: "https://theyachtbroker.club/img/estela.png", pdf: "https://theyachtbroker.club/pdf/estela.pdf", brokerKey: 'estela', pdfPages: 5, category: 'yacht', price: { low: 3090, mid: 3650, high: 4090 } },
  { slug: 'lap-one', model: "Tesoro T50", name: "Lap One", pax: 12, length: 16.2, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/lapone.JPG", pdf: "https://theyachtbroker.club/pdf/lapone.pdf", brokerKey: 'lapone', pdfPages: 0, category: 'yacht', price: { low: 2855, mid: 2955, high: 3905 } },
  { slug: 'time', model: "Vanquish VQ45 T-Top", name: "TIME", pax: 11, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/time.png", pdf: "https://theyachtbroker.club/pdf/time.pdf", brokerKey: 'time', pdfPages: 3, category: 'motorboat', price: { low: 2650, mid: 3050, high: 3850 } },
  { slug: 'balr', model: "Vanquish VQ45", name: "BALR", pax: 11, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/balr.png", pdf: "https://theyachtbroker.club/pdf/balr.pdf", brokerKey: 'balr', pdfPages: 3, category: 'motorboat', price: { low: 2350, mid: 2650, high: 3350 } },
  { slug: 'torre-del-canonigo', model: "Pershing 54", name: "Torre del Can\u00f3nigo", pax: 11, length: 18.0, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/torredelcanonigo.png", pdf: "https://theyachtbroker.club/pdf/torredelcanonigo.pdf", brokerKey: 'torredelcanonigo', pdfPages: 13, category: 'yacht', price: { low: 2299, mid: 2722.5, high: 3327.5 } },
  { slug: 'planazo', model: "Pardo 43", name: "Planazo", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/planazo.png", pdf: "https://theyachtbroker.club/pdf/planazo.pdf", brokerKey: 'planazo', pdfPages: 10, category: 'motorboat', price: { low: 2300, mid: 2500, high: 3200 } },
  { slug: 'yaaas', model: "Pardo 43", name: "YAAAS", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/yaaas.png", pdf: "https://theyachtbroker.club/pdf/yaaas.pdf", brokerKey: 'yaaas', pdfPages: 10, category: 'motorboat', price: { low: 2300, mid: 2500, high: 3200 } },
  { slug: 'excalibur', model: "Princess V53", name: "Excalibur", pax: 11, length: 17.5, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/excalibur.png", pdf: "https://theyachtbroker.club/pdf/excalibur.pdf", brokerKey: 'excalibur', pdfPages: 10, category: 'yacht', price: { low: 2305, mid: 2605, high: 3105 } },
  { slug: 'mistral', model: "Evo Yachts 43", name: "Mistral", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/mistral.png", pdf: "https://theyachtbroker.club/pdf/mistral.pdf", brokerKey: 'mistral', pdfPages: 10, category: 'motorboat', price: { low: 2300, mid: 2700, high: 3100 } },
  { slug: 'aurora', model: "Evo Yachts 43", name: "Aurora", pax: 11, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/aurora.png", pdf: "https://theyachtbroker.club/pdf/aurora.pdf", brokerKey: 'aurora', pdfPages: 12, category: 'motorboat', price: { low: 2290, mid: 2690, high: 3090 } },
  { slug: 'ii-of-a-kind', model: "Pardo Yachts 43", name: "II of a Kind", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/iiofakind.png", pdf: "https://theyachtbroker.club/pdf/iiofakind.pdf", brokerKey: 'iiofakind', pdfPages: 14, category: 'motorboat', price: { low: 2300, mid: 2690, high: 3090 } },
  { slug: 'sir-l', model: "Pardo Yachts 43", name: "Sir L", pax: 12, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/sirl.png", pdf: "https://theyachtbroker.club/pdf/sirl.pdf", brokerKey: 'sirl', pdfPages: 13, category: 'motorboat', price: { low: 2400, mid: 2790, high: 3090 } },
  { slug: 'first', model: "LEKKER 44", name: "FIRST", pax: 11, marina: "Santa Eulalia", image: "https://theyachtbroker.club/img/first.png", pdf: "https://theyachtbroker.club/pdf/first.pdf", brokerKey: 'first', pdfPages: 7, category: 'motorboat', price: { low: 2050, mid: 2300, high: 3000 } },
  { slug: 'minipico-iv', model: "Fjord F44", name: "MINIPICO IV", pax: 11, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/minipicoiv.png", pdf: "https://theyachtbroker.club/pdf/minipicoiv.pdf", brokerKey: 'minipicoiv', pdfPages: 3, category: 'motorboat', price: { low: 1950, mid: 2250, high: 3000 } },
  { slug: 'bambino', model: "De Antonio D42", name: "Bambino", pax: 11, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/bambino.JPEG", pdf: "https://theyachtbroker.club/pdf/bambino.pdf", brokerKey: 'bambino', pdfPages: 15, category: 'motorboat', price: { low: 2090, mid: 2490, high: 2850 } },
  { slug: 'luma', model: "De Antonio 42", name: "Luma", pax: 11, length: 13.0, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/luma.png", pdf: "https://theyachtbroker.club/pdf/luma.pdf", brokerKey: 'luma', pdfPages: 5, category: 'motorboat', price: { low: 2090, mid: 2490, high: 2850 } },
  { slug: 'seastar', model: "De Antonio 42", name: "Seastar", pax: 11, length: 13.0, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/seastar.png", pdf: "https://theyachtbroker.club/pdf/seastar.pdf", brokerKey: 'seastar', pdfPages: 4, category: 'motorboat', price: { low: 2090, mid: 2490, high: 2850 } },
  { slug: 'playyacht-iii', model: "De Antonio D42", name: "Playyacht III", pax: 11, marina: "Club Nautic", image: "https://theyachtbroker.club/img/playyachtiii.png", pdf: "https://theyachtbroker.club/pdf/playyachtiii.pdf", brokerKey: 'playyachtiii', pdfPages: 11, category: 'motorboat', price: { low: 1815, mid: 2238.5, high: 2783 } },
  { slug: 'egomarine', model: "Fjord 41XL", name: "Egomarine", pax: 11, length: 13.51, marina: "Club Nautic", image: "https://theyachtbroker.club/img/egomarine.JPG", pdf: "https://theyachtbroker.club/pdf/egomarine.pdf", brokerKey: 'egomarine', pdfPages: 8, category: 'motorboat', price: { low: 1715, mid: 2205, high: 2755 } },
  { slug: 'nielen', model: "Sunseeker Portofino 53", name: "Nielen", pax: 12, length: 17.4, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/nielen.JPG", pdf: "https://theyachtbroker.club/pdf/nielen.pdf", brokerKey: 'nielen', pdfPages: 10, category: 'yacht', price: { low: 1905, mid: 2105, high: 2705 } },
  { slug: 'esplendida', model: "De Antonio 42", name: "Esplendida", pax: 11, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/esplendida.png", pdf: "https://theyachtbroker.club/pdf/esplendida.pdf", brokerKey: 'esplendida', pdfPages: 14, category: 'motorboat', price: { low: 1990, mid: 2390, high: 2690 } },
  { slug: 'db43', model: "Jeanneau DB43", name: "DB43", pax: 11, length: 13.03, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/db43.JPG", pdf: "https://theyachtbroker.club/pdf/db43.pdf", brokerKey: 'db43', pdfPages: 8, category: 'motorboat', price: { low: 1715, mid: 2205, high: 2655 } },
  { slug: 'caja-tres', model: "Vanquish VQ40", name: "CAJA TRES", pax: 11, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/cajatres.png", pdf: "https://theyachtbroker.club/pdf/cajatres.pdf", brokerKey: 'cajatres', pdfPages: 3, category: 'motorboat', price: { low: 2100, mid: 2350, high: 2650 } },
  { slug: 'in-sync', model: "Vanquish VQ40", name: "IN SYNC", pax: 11, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/insync.png", pdf: "https://theyachtbroker.club/pdf/insync.pdf", brokerKey: 'insync', pdfPages: 3, category: 'motorboat', price: { low: 2100, mid: 2350, high: 2650 } },
  { slug: 'jokat', model: "Saxdor 400 GTS", name: "JOKAT", pax: 11, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/jokat.png", pdf: "https://theyachtbroker.club/pdf/jokat.pdf", brokerKey: 'jokat', pdfPages: 6, category: 'motorboat', price: { low: 1950, mid: 2250, high: 2650 } },
  { slug: 'no-tomorrow', model: "Vanquish VQ40", name: "NO TOMORROW", pax: 11, marina: "Santa Eulalia", image: "https://theyachtbroker.club/img/notomorrow.png", pdf: "https://theyachtbroker.club/pdf/notomorrow.pdf", brokerKey: 'notomorrow', pdfPages: 3, category: 'motorboat', price: { low: 2100, mid: 2350, high: 2650 } },
  { slug: 'tot-suma', model: "De Antonio D42", name: "Tot Suma", pax: 11, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/totsuma.png", pdf: "https://theyachtbroker.club/pdf/totsuma.pdf", brokerKey: 'totsuma', pdfPages: 12, category: 'motorboat', price: { low: 1848, mid: 2248, high: 2608 } },
  { slug: 'nastia', model: "CNM 43", name: "Nastia", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/nastia.png", pdf: "https://theyachtbroker.club/pdf/nastia.pdf", brokerKey: 'nastia', pdfPages: 10, category: 'motorboat', price: { low: 2000, mid: 2300, high: 2600 } },
  { slug: 'the-wolf', model: "Vanquish VQ43", name: "THE WOLF", pax: 11, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/thewolf.png", pdf: "https://theyachtbroker.club/pdf/thewolf.pdf", brokerKey: 'thewolf', pdfPages: 7, category: 'motorboat', price: { low: 1815, mid: 2057, high: 2541 } },
  { slug: 'byblos', model: "Pershing 50", name: "Byblos", pax: 11, length: 16.0, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/byblos.JPG", pdf: "https://theyachtbroker.club/pdf/byblos.pdf", brokerKey: 'byblos', pdfPages: 6, category: 'yacht', price: { low: 1905, high: 2505 } },
  { slug: 'stress', model: "Sunseeker Portofino 53", name: "Stress", pax: 9, length: 17.4, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/stress.JPG", pdf: "https://theyachtbroker.club/pdf/stress.pdf", brokerKey: 'stress', pdfPages: 11, category: 'yacht', price: { low: 1905, mid: 2105, high: 2505 } },
  { slug: 'com-tu', model: "Cranchi Mediterrane 47", name: "Com Tu", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/comtu.JPEG", pdf: "https://theyachtbroker.club/pdf/comtu.pdf", brokerKey: 'comtu', pdfPages: 12, category: 'motorboat', price: { low: 1790, mid: 2090, high: 2490 } },
  { slug: 'noah', model: "Saxdor 400 GTS", name: "NOAH", pax: 11, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/noah.png", pdf: "https://theyachtbroker.club/pdf/noah.pdf", brokerKey: 'noah', pdfPages: 3, category: 'motorboat', price: { low: 1790, mid: 2250, high: 2490 } },
  { slug: 'anka', model: "Alen 42", name: "Anka", pax: 11, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/anka.png", pdf: "https://theyachtbroker.club/pdf/anka.pdf", brokerKey: 'anka', pdfPages: 6, category: 'motorboat', price: { low: 1815, mid: 1997, high: 2420 } },
  { slug: 'happiness', model: "Sessa C44", name: "Happiness", pax: 11, length: 14.0, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/happiness.JPG", pdf: "https://theyachtbroker.club/pdf/happiness.pdf", brokerKey: 'happiness', pdfPages: 8, category: 'motorboat', price: { low: 1905, mid: 2005, high: 2405 } },
  { slug: 'olivia', model: "Say Carbon 42", name: "Olivia", pax: 11, length: 12.96, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/olivia.JPG", pdf: "https://theyachtbroker.club/pdf/olivia.pdf", brokerKey: 'olivia', pdfPages: 8, category: 'motorboat', price: { low: 1705, mid: 2005, high: 2405 } },
  { slug: 'la-vita', model: "Pardo 43", name: "La Vita", pax: 12, length: 14.0, marina: "Club Nautic", image: "https://theyachtbroker.club/img/lavita.png", pdf: "https://theyachtbroker.club/pdf/lavita.pdf", brokerKey: 'lavita', pdfPages: 10, category: 'motorboat', price: { low: 1650, mid: 1900, high: 2400 } },
  { slug: 'masalma', model: "Kumbra 43", name: "Masalma", pax: 12, length: 14.0, marina: "Club Nautic", image: "https://theyachtbroker.club/img/masalma.png", pdf: "https://theyachtbroker.club/pdf/masalma.pdf", brokerKey: 'masalma', pdfPages: 12, category: 'motorboat', price: { low: 1650, mid: 1900, high: 2400 } },
  { slug: 'playyacht-ii', model: "Pardo 43", name: "Playyacht II", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/playyachtii.png", pdf: "https://theyachtbroker.club/pdf/playyachtii.pdf", brokerKey: 'playyachtii', pdfPages: 11, category: 'motorboat', price: { low: 1650, mid: 1900, high: 2400 } },
  { slug: 'popeye', model: "Wajer 38S", name: "POPEYE", pax: 10, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/popeye.png", pdf: "https://theyachtbroker.club/pdf/popeye.pdf", brokerKey: 'popeye', pdfPages: 3, category: 'motorboat', price: { low: 1750, mid: 2000, high: 2350 } },
  { slug: 'meteorito', model: "Tesoro T40", name: "Meteorito", pax: 11, length: 12.5, marina: "Club Nautic", image: "https://theyachtbroker.club/img/meteorito.JPG", pdf: "https://theyachtbroker.club/pdf/meteorito.pdf", brokerKey: 'meteorito', pdfPages: 7, category: 'motorboat', price: { low: 1705, mid: 1905, high: 2205 } },
  { slug: 'freedom-6', model: "Scorpion 50", name: "Freedom 6", pax: 11, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/freedom6.png", pdf: "https://theyachtbroker.club/pdf/freedom6.pdf", brokerKey: 'freedom6', pdfPages: 8, category: 'yacht', price: { low: 1800, mid: 2000, high: 2200 } },
  { slug: 'squirtle', model: "Fjord 36", name: "Squirtle", pax: 11, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/squirtle.JPEG", pdf: "https://theyachtbroker.club/pdf/squirtle.pdf", brokerKey: 'squirtle', pdfPages: 4, category: 'motorboat', price: { low: 1490, mid: 1790, high: 2190 } },
  { slug: 'sweet-caroline', model: "Itama 40", name: "SWEET CAROLINE", pax: 11, marina: "Santa Eulalia", image: "https://theyachtbroker.club/img/sweetcaroline.png", pdf: "https://theyachtbroker.club/pdf/sweetcaroline.pdf", brokerKey: 'sweetcaroline', pdfPages: 3, category: 'motorboat', price: { low: 1500, mid: 1750, high: 2100 } },
  { slug: 'daniela', model: "Fiart Mare 35", name: "Daniela", pax: 11, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/daniela.JPEG", pdf: "https://theyachtbroker.club/pdf/daniela.pdf", brokerKey: 'daniela', pdfPages: 4, category: 'motorboat', price: { low: 1500, mid: 1790, high: 2090 } },
  { slug: 'enzo', model: "Fiart 35", name: "Enzo", pax: 11, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/enzo.JPEG", pdf: "https://theyachtbroker.club/pdf/enzo.pdf", brokerKey: 'enzo', pdfPages: 7, category: 'motorboat', price: { low: 1500, mid: 1790, high: 2090 } },
  { slug: 'luna', model: "Daytona 35", name: "Luna", pax: 11, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/luna.png", pdf: "https://theyachtbroker.club/pdf/luna.pdf", brokerKey: 'luna', pdfPages: 6, category: 'motorboat', price: { low: 1331, mid: 1694, high: 2057 } },
  { slug: 'playyacht', model: "Pardo 38", name: "Playyacht", pax: 12, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/playyacht.png", pdf: "https://theyachtbroker.club/pdf/playyacht.pdf", brokerKey: 'playyacht', pdfPages: 11, category: 'motorboat', price: { low: 1500, mid: 1750, high: 2000 } },
  { slug: 'gogga', model: "De Antonio D34 Open", name: "Gogga", pax: 11, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/gogga.JPEG", pdf: "https://theyachtbroker.club/pdf/gogga.pdf", brokerKey: 'gogga', pdfPages: 8, category: 'motorboat', price: { low: 1450, mid: 1690, high: 1990 } },
  { slug: 'livia', model: "Kumbra 34", name: "Livia", pax: 12, length: 10.4, marina: "Club Nautic", image: "https://theyachtbroker.club/img/livia.png", pdf: "https://theyachtbroker.club/pdf/livia.pdf", brokerKey: 'livia', pdfPages: 10, category: 'motorboat', price: { low: 1350, mid: 1600, high: 1900 } },
  { slug: 'jarvis', model: "De Antonio D36", name: "Jarvis", pax: 11, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/jarvis.png", pdf: "https://theyachtbroker.club/pdf/jarvis.pdf", brokerKey: 'jarvis', pdfPages: 6, category: 'motorboat', price: { low: 1300, mid: 1550, high: 1800 } },
  { slug: 'playyacht-iv', model: "De Antonio 36", name: "Playyacht IV", pax: 11, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/playyachtiv.png", pdf: "https://theyachtbroker.club/pdf/playyachtiv.pdf", brokerKey: 'playyachtiv', pdfPages: 12, category: 'motorboat', price: { low: 1300, mid: 1550, high: 1800 } },
  { slug: 'tito', model: "De Antonio D36", name: "Tito", pax: 11, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/tito.png", pdf: "https://theyachtbroker.club/pdf/tito.pdf", brokerKey: 'tito', pdfPages: 11, category: 'motorboat', price: { low: 1300, mid: 1550, high: 1800 } },
  { slug: 'tramuntana', model: "Kumbra 34", name: "Tramuntana", pax: 12, length: 11.0, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/tramuntana.png", pdf: "https://theyachtbroker.club/pdf/tramuntana.pdf", brokerKey: 'tramuntana', pdfPages: 7, category: 'motorboat', price: { low: 1400, mid: 1600, high: 1800 } },
  { slug: 'tanit', model: "Pershing 37", name: "Tanit", pax: 9, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/tanit.png", pdf: "https://theyachtbroker.club/pdf/tanit.pdf", brokerKey: 'tanit', pdfPages: 7, category: 'motorboat', price: { low: 1190, mid: 1490, high: 1790 } },
  { slug: 'dandy-iii', model: "De Antonio D36", name: "Dandy III", pax: 11, length: 11.5, marina: "Marina Magna", image: "https://theyachtbroker.club/img/dandyiii.JPG", pdf: "https://theyachtbroker.club/pdf/dandyiii.pdf", brokerKey: 'dandyiii', pdfPages: 11, category: 'motorboat', price: { low: 1435, high: 1785 } },
  { slug: 'lupo', model: "De Antonio D36", name: "Lupo", pax: 11, length: 11.5, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/lupo.png", pdf: "https://theyachtbroker.club/pdf/lupo.pdf", brokerKey: 'lupo', pdfPages: 9, category: 'motorboat', price: { low: 1435, high: 1785 } },
  { slug: 'krabi', model: "Kumbra 34", name: "Krabi", pax: 12, marina: "Club Nautic", image: "https://theyachtbroker.club/img/krabi.png", pdf: "https://theyachtbroker.club/pdf/krabi.pdf", brokerKey: 'krabi', pdfPages: 8, category: 'motorboat', price: { low: 1250, mid: 1550, high: 1750 } },
  { slug: 'enjoy', model: "Kumbra 34", name: "Enjoy", pax: 12, marina: "Club Nautic", image: "https://theyachtbroker.club/img/enjoy.png", pdf: "https://theyachtbroker.club/pdf/enjoy.pdf", brokerKey: 'enjoy', pdfPages: 14, category: 'motorboat', price: { low: 1200, mid: 1500, high: 1700 } },
  { slug: 'norfeu', model: "Saxdor 320 GTO", name: "Norfeu", pax: 8, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/norfeu.png", pdf: "https://theyachtbroker.club/pdf/norfeu.pdf", brokerKey: 'norfeu', pdfPages: 0, category: 'motorboat', price: { low: 1240, mid: 1450, high: 1700 } },
  { slug: 'dandy-ii', model: "De Antonio D32", name: "Dandy II", pax: 9, length: 9.9, marina: "Marina Magna", image: "https://theyachtbroker.club/img/dandyii.JPG", pdf: "https://theyachtbroker.club/pdf/dandyii.pdf", brokerKey: 'dandyii', pdfPages: 9, category: 'motorboat', price: { low: 1235, high: 1585 } },
  { slug: 'oceans-911', model: "De Antonio 33", name: "Oceans 911", pax: 9, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/oceans911.png", pdf: "https://theyachtbroker.club/pdf/oceans911.pdf", brokerKey: 'oceans911', pdfPages: 10, category: 'motorboat', price: { low: 1100, mid: 1300, high: 1550 } },
  { slug: 'mahi-mahi', model: "Sessa Marine Key Largo 30", name: "Mahi Mahi", pax: 9, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/mahimahi.png", pdf: "https://theyachtbroker.club/pdf/mahimahi.pdf", brokerKey: 'mahimahi', pdfPages: 11, category: 'motorboat', price: { low: 848, mid: 1048, high: 1248 } },
  { slug: 'infinity', model: "Sea Ray 295", name: "Infinity", pax: 9, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/infinity.JPG", pdf: "https://theyachtbroker.club/pdf/infinity.pdf", brokerKey: 'infinity', pdfPages: 7, category: 'motorboat', price: { low: 884, mid: 994.5, high: 1105 } },
  { slug: 'tabung', model: "Sunseeker Mohawk 29", name: "Tabung", pax: 7, marina: "Marina Ibiza", image: "https://theyachtbroker.club/img/tabung.png", pdf: "https://theyachtbroker.club/pdf/tabung.pdf", brokerKey: 'tabung', pdfPages: 8, category: 'motorboat', price: { low: 895, mid: 995, high: 1095 } },
  { slug: 'aries', model: "Monterey 278SS", name: "Aries", pax: 8, length: 9.0, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/aries.png", pdf: "https://theyachtbroker.club/pdf/aries.pdf", brokerKey: 'aries', pdfPages: 5, category: 'motorboat', price: { low: 935, mid: 985, high: 1085 } },
  { slug: 'thymar', model: "Cap Camarat 9.0", name: "Thymar", pax: 9, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/thymar.png", pdf: "https://theyachtbroker.club/pdf/thymar.pdf", brokerKey: 'thymar', pdfPages: 8, category: 'motorboat', price: { low: 830, mid: 930, high: 1080 } },
  { slug: 'ironman', model: "Monterey 224 FS", name: "Ironman", pax: 7, marina: "Marina Botafoc", image: "https://theyachtbroker.club/img/ironman.png", pdf: "https://theyachtbroker.club/pdf/ironman.pdf", brokerKey: 'ironman', pdfPages: 4, category: 'motorboat', price: { low: 680, high: 780 } },
];

/**
 * Foto's via Cloudinary (f_auto/q_auto), rechtstreeks van de broker gehaald.
 *
 * `imageSet` is er voor de 94 kaarten op de vlootpagina. Die gingen door
 * next/image, en dat leverde per kaart een srcset van acht kandidaten tot
 * 3840px — elk een /_next/image-URL met daarin de Cloudinary-URL met dáárin
 * de partner-URL, driedubbel ge-encodeerd: ~2 kB srcset per kaart, 185 kB
 * op de pagina, voor een foto van hooguit 400px breed. En elke foto liep
 * twee CDN's door (Vercel optimaliseert wat Cloudinary al geoptimaliseerd
 * had). Drie breedtes rechtstreeks van Cloudinary volstaan: de kaart is
 * 100vw op mobiel, 50vw op tablet, 25vw op desktop.
 */
const CARD_WIDTHS = [480, 768, 1024];
export const FLEET: Boat[] = RAW_FLEET.map(b => ({
  ...b,
  image: cloudinaryFetchRemote(b.image),
  imageSet: CARD_WIDTHS.map(w => `${cloudinaryFetchRemote(b.image, w)} ${w}w`).join(', '),
}));

export const FLEET_FROM_PRICE = Math.min(...FLEET.map(b => b.price.low));

/**
 * Waar een klik op een boot heen gaat: het dossier zelf.
 *
 * Hier zat een tussenpagina in eigen huisstijl die de PDF inbedde. Op een
 * telefoon viel dat mee, op desktop niet: je kreeg de PDF-werkbalk van de
 * browser ingeklemd in onze eigen kop en balk, twee schermranden om elkaar
 * heen. Een dossier is een document, en een document hoort in de weergave van
 * de browser — die kan zoeken, printen, opslaan en pagina's overslaan, en die
 * kan onze pagina niet nadoen.
 *
 * /api/dossier en niet de partner-URL: die route valideert de slug tegen de
 * vloot, serveert vanaf ons eigen domein en houdt het bestand een week in de
 * edge-cache (gemeten 1,96s rechtstreeks tegen 0,21s daarna).
 *
 * Geen locale in het pad — het is één bestand, geen vertaalde pagina.
 */
export function dossierHref(slug: string): string {
  return `/api/dossier/${slug}`;
}
