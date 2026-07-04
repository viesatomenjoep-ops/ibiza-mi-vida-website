// ─────────────────────────────────────────────────────────────────────────────
// HARBOUR HOST — PRIVATE BOAT FLEET
// Scraped from the "HH Fleet Summary 2026" PDFs (50–70 ft yachts + 20–30 ft
// motorboats). Specs & prices are universal (numbers/€) so they need no
// translation — only the UI labels do (see FLEET_I18N in FleetShowcase).
//
// To add a boat later: extract its photo to /public/fleet/<slug>.jpeg and append
// an entry below. Set category, captainIncluded and (if not) captainExtra.
// ─────────────────────────────────────────────────────────────────────────────

export type FleetCategory = 'yacht' | 'motorboat';

export interface FleetPrice {
  low: number;                 // rest of the year
  mid?: number;                // June/Sept (yachts) or May/June/Sept (motorboats)
  high: number;                // July/August, or a custom window
  highWindow?: string;         // override, e.g. "June 20th – August 31st"
}

export interface Boat {
  slug: string;
  model: string;               // e.g. "Jaguar 72"
  name?: string;               // individual boat name, e.g. "Lefty"
  pax: number;
  length: number;              // metres
  marina: string;
  image: string;
  category: FleetCategory;
  captainIncluded: boolean;
  captainExtra?: number;       // €, when captain is not included but available
  price: FleetPrice;
}

export const FLEET_INCLUDES = [
  'captain', 'mooring', 'paddleSurf', 'towels', 'drinks', 'snorkels', 'vat',
] as const;
export type FleetInclude = typeof FLEET_INCLUDES[number];

/** Includes shown for a boat (captain only when it's actually included). */
export function boatIncludes(b: Boat): FleetInclude[] {
  return FLEET_INCLUDES.filter(i => i !== 'captain' || b.captainIncluded);
}

export const FLEET: Boat[] = [
  // ── 50 TO 70 FEET — luxury yachts (captain included) ──────────────────────────
  { slug: 'jaguar-72-lefty', model: 'Jaguar 72', name: 'Lefty', pax: 12, length: 23, marina: 'Marina Botafoc', image: '/fleet/jaguar-72-lefty.jpeg', category: 'yacht', captainIncluded: true, price: { low: 4598, mid: 5445, high: 6050 } },
  { slug: 'sunseeker-predator-72-no9', model: 'Sunseeker Predator 72', name: 'Nº 9', pax: 12, length: 22.2, marina: 'Marina Botafoc', image: '/fleet/sunseeker-predator-72-no9.jpeg', category: 'yacht', captainIncluded: true, price: { low: 5687, high: 7260, highWindow: 'June 20th – August 31st' } },
  { slug: 'firebird-68-fly-daiana', model: 'Firebird 68 Fly', name: 'Daiana', pax: 12, length: 20.7, marina: 'Talamanca', image: '/fleet/firebird-68-fly-daiana.jpeg', category: 'yacht', captainIncluded: true, price: { low: 2952, mid: 3533, high: 3969 } },
  { slug: 'sunseeker-predator-68-tranquility', model: 'Sunseeker Predator 68', name: 'Tranquility', pax: 12, length: 21.6, marina: 'Marina Botafoc', image: '/fleet/sunseeker-predator-68-tranquility.jpeg', category: 'yacht', captainIncluded: true, price: { low: 5022, high: 6655, highWindow: 'June 20th – August 31st' } },
  { slug: 'pershing-6x-dr-no', model: 'Pershing 6X', name: 'Dr. No', pax: 12, length: 18.9, marina: 'Marina Botafoc', image: '/fleet/pershing-6x-dr-no.jpeg', category: 'yacht', captainIncluded: true, price: { low: 6534, high: 7744, highWindow: 'June 20th – August 31st' } },
  { slug: 'princess-v65-manzana', model: 'Princess V65', name: 'Manzana', pax: 12, length: 21, marina: 'Marina Botafoc', image: '/fleet/princess-v65-manzana.jpeg', category: 'yacht', captainIncluded: true, price: { low: 3388, mid: 3872, high: 4840 } },
  { slug: 'princess-v58-chloe', model: 'Princess V58', name: 'Chloe', pax: 12, length: 18.4, marina: 'Santa Eulalia Port', image: '/fleet/princess-v58-chloe.jpeg', category: 'yacht', captainIncluded: true, price: { low: 4356, high: 5082, highWindow: 'June 20th – August 31st' } },
  { slug: 'princess-v58-shaka-laka', model: 'Princess V58', name: 'Shaka Laka', pax: 12, length: 18.4, marina: 'Marina Botafoc', image: '/fleet/princess-v58-shaka-laka.jpeg', category: 'yacht', captainIncluded: true, price: { low: 3751, high: 4417, highWindow: 'June 20th – August 31st' } },
  { slug: 'pershing-54-torre-del-canonigo', model: 'Pershing 54', name: 'Torre Del Canonigo', pax: 11, length: 18, marina: 'Marina Ibiza', image: '/fleet/pershing-54-torre-del-canonigo.jpeg', category: 'yacht', captainIncluded: true, price: { low: 2299, mid: 2723, high: 3328 } },
  { slug: 'princess-v53-excalibur', model: 'Princess V53', name: 'Excalibur', pax: 11, length: 17.5, marina: 'Marina Botafoc', image: '/fleet/princess-v53-excalibur.jpeg', category: 'yacht', captainIncluded: true, price: { low: 2662, mid: 3025, high: 3630 } },
  { slug: 'princess-v53-manbero', model: 'Princess V53', name: 'Manbero', pax: 12, length: 17.5, marina: 'Marina Ibiza', image: '/fleet/princess-v53-manbero.jpeg', category: 'yacht', captainIncluded: true, price: { low: 3025, high: 3630, highWindow: 'June 20th – August 31st' } },
  { slug: 'riva-52-invictus', model: 'Riva 52', name: 'Invictus', pax: 9, length: 16, marina: 'Marina Botafoc', image: '/fleet/riva-52-invictus.jpeg', category: 'yacht', captainIncluded: true, price: { low: 3328, high: 3872, highWindow: 'June 20th – August 31st' } },
  { slug: 'sunseeker-portofino-53-stress', model: 'Sunseeker Portofino 53', name: 'Stress', pax: 9, length: 17.4, marina: 'Marina Botafoc', image: '/fleet/sunseeker-portofino-53-stress.jpeg', category: 'yacht', captainIncluded: true, price: { low: 2178, mid: 2420, high: 2904 } },
  { slug: 'sunseeker-portofino-53-nielen', model: 'Sunseeker Portofino 53', name: 'Nielen', pax: 12, length: 17.4, marina: 'Marina Botafoc', image: '/fleet/sunseeker-portofino-53-nielen.jpeg', category: 'yacht', captainIncluded: true, price: { low: 2420, mid: 2662, high: 3146 } },
  { slug: 'pershing-50-byblos-iii', model: 'Pershing 50', name: 'Byblos III', pax: 11, length: 16, marina: 'Marina Botafoc', image: '/fleet/pershing-50-byblos-iii.jpeg', category: 'yacht', captainIncluded: true, price: { low: 2178, mid: 2420, high: 2904 } },
  { slug: 'princess-v50-sunshine', model: 'Princess V50', name: 'Sunshine', pax: 9, length: 15.4, marina: 'Marina Botafoc', image: '/fleet/princess-v50-sunshine.jpeg', category: 'yacht', captainIncluded: true, price: { low: 2057, mid: 2299, high: 2783 } },

  // ── 20 TO 30 FEET — motorboats (captain optional, +€180) ──────────────────────
  { slug: 'cranchi-39', model: 'Cranchi 39', pax: 9, length: 12, marina: 'Santa Eulalia', image: '/fleet/cranchi-39.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 1150, mid: 1452, high: 1694 } },
  { slug: 'gozzo-positano-32', model: 'Gozzo Positano 32', pax: 12, length: 10.3, marina: 'Port Nautic Ibiza', image: '/fleet/gozzo-positano-32.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 726, mid: 968, high: 1210 } },
  { slug: 'gobbi-atlantis-315', model: 'Gobbi Atlantis 315', pax: 10, length: 9.8, marina: 'Santa Eulalia', image: '/fleet/gobbi-atlantis-315.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 1089, mid: 1331, high: 1513 } },
  { slug: 'beneteau-flyer-8', model: 'Beneteau Flyer 8', pax: 10, length: 8.3, marina: 'Santa Eulalia', image: '/fleet/beneteau-flyer-8.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 544, mid: 605, high: 726 } },
  { slug: 'karnic-sl702', model: 'Karnic SL702', pax: 8, length: 7.8, marina: 'Santa Eulalia', image: '/fleet/karnic-sl702.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 484, mid: 575, high: 726 } },
  { slug: 'cap-camarat-9', model: 'Cap Camarat 9.0', pax: 9, length: 9, marina: 'Marina Botafoc', image: '/fleet/cap-camarat-9.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 787, mid: 908, high: 1089 } },
  { slug: 'monterrey-278', model: 'Monterrey 278', pax: 8, length: 9, marina: 'Marina Botafoc', image: '/fleet/monterrey-278.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 787, mid: 847, high: 968 } },
  { slug: 'sea-ray-295', model: 'Sea Ray 295', pax: 9, length: 9, marina: 'Port Nautic Ibiza', image: '/fleet/sea-ray-295.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 600, mid: 700, high: 800 } },
  { slug: 'quicksilver-605', model: 'Quicksilver 605', pax: 7, length: 6.2, marina: 'Santa Eulalia', image: '/fleet/quicksilver-605.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 363, mid: 424, high: 514 } },
  { slug: 'sea-hawk-700', model: 'Sea Hawk 700', pax: 12, length: 7, marina: 'Santa Eulalia', image: '/fleet/sea-hawk-700.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 484, mid: 545, high: 635 } },
  { slug: 'chaparral-256', model: 'Chaparral 256', pax: 9, length: 8, marina: 'Marina Botafoc', image: '/fleet/chaparral-256.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 666, mid: 762, high: 908 } },
  { slug: 'monterrey-224', model: 'Monterrey 224', pax: 7, length: 7, marina: 'Marina Botafoc', image: '/fleet/monterrey-224.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 605, mid: 726, high: 847 } },
  { slug: 'capelli-700', model: 'Capelli 700', pax: 12, length: 7.5, marina: 'Santa Eulalia', image: '/fleet/capelli-700.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 484, mid: 575, high: 726 } },
  { slug: 'capelli-tempest-750', model: 'Capelli Tempest 750', pax: 12, length: 8, marina: 'Marina Botafoc', image: '/fleet/capelli-tempest-750.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 666, mid: 762, high: 908 } },
  { slug: 'selva-900', model: 'Selva 900', pax: 12, length: 9, marina: 'Santa Eulalia', image: '/fleet/selva-900.jpeg', category: 'motorboat', captainIncluded: false, captainExtra: 180, price: { low: 650, mid: 750, high: 800 } },
];

/** Cheapest starting price across the whole fleet — handy for hero copy. */
export const FLEET_FROM_PRICE = Math.min(...FLEET.map(b => b.price.low));
