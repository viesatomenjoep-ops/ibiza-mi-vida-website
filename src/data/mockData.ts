import { 
  Venue, 
  BoatCharter, 
  BoatParty, 
  FormenteraTrip, 
  DrinkPackage, 
  CarRental, 
  Review 
} from './types';

// Famous Ibiza DJs / Artists
export interface Artist {
  id: string;
  name: string;
  genres: string[];
  residency: string;
  image: string;
  upcomingDates: string[];
}

export const artistsData: Artist[] = [
  {
    id: '1',
    name: 'Fisher',
    genres: ['Tech House', 'House'],
    residency: 'Hï Ibiza (Wednesdays)',
    image: 'https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&q=80&w=400',
    upcomingDates: ['June 17', 'June 24', 'July 01']
  },
  {
    id: '2',
    name: 'David Guetta',
    genres: ['Electronic', 'Dance', 'Future Rave'],
    residency: 'Ushuaïa & Hï Ibiza (Mondays / Fridays)',
    image: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=400',
    upcomingDates: ['June 15', 'June 22', 'June 29']
  },
  {
    id: '3',
    name: 'Solomun',
    genres: ['Deep House', 'Melodic Techno'],
    residency: 'Pacha (Sundays)',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=400',
    upcomingDates: ['June 14', 'June 21', 'June 28']
  },
  {
    id: '4',
    name: 'Tale of Us',
    genres: ['Melodic Techno', 'Afterlife'],
    residency: 'Hï Ibiza (Thursdays)',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400',
    upcomingDates: ['June 18', 'June 25', 'July 02']
  },
  {
    id: '5',
    name: 'Marco Carola',
    genres: ['Minimal Techno', 'Tech House'],
    residency: 'Pacha / Destino (Music On)',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400',
    upcomingDates: ['June 19', 'June 26', 'July 03']
  },
  {
    id: '6',
    name: 'Keinemusik',
    genres: ['Afro House', 'Deep House'],
    residency: 'Hï Ibiza & Pacha (Special Events)',
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=400',
    upcomingDates: ['July 05', 'August 12', 'September 20']
  }
];

// Fallback Venues (if live API fails or during loading, so users see data in a split second)
export const fallbackVenues: Venue[] = [
  {
    id: 1,
    name: "Ushuaïa Ibiza",
    slug: "ushuaia-ibiza",
    description: "The world's iconic open-air day club, hosting legendary sunset visual productions with unparalleled pool-side dancefloors.",
    picture: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200",
    whitelogo: "https://affiliates.clubtickets.com/assets/images/venues/ushuaia-white.png",
    isDayClub: true,
    type: { id: 1, slug: "clubbing", name: "Clubbing" },
    activeEvents: 5,
    affLink: "https://www.clubtickets.com/clubbing/ushuaia?aff=CT219",
    apiEndpoint: "",
    events: [
      {
        id: 101,
        name: "F*** Me I'm Famous! by David Guetta",
        slug: "fmif-david-guetta",
        description: "The ultimate peak of energy and fun in Ibiza! Under the direction of David Guetta, Fmif delivers infectious pop-dance house remixes.",
        requirements: "Elegant casual dress code. Over 18 photo ID required.",
        startAt: "17:00",
        startAtNextDay: false,
        endIsDefined: true,
        endAt: "23:00",
        endAtNextDay: false,
        cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600",
        affLink: "https://www.clubtickets.com/clubbing/ushuaia/f-me-im-famous?aff=CT219",
        dates: [
          { id: 1001, name: "FMIF Opening", date: "2026-06-15", lineUp: "David Guetta, Armin van Buuren, Becky Hill", prices: "70 € - 150 €", affLink: "https://www.clubtickets.com/clubbing/ushuaia/f-me-im-famous/2026-06-15?aff=CT219" },
          { id: 1002, name: "FMIF Week 2", date: "2026-06-22", lineUp: "David Guetta, Jax Jones, KC Lights", prices: "75 € - 160 €", affLink: "https://www.clubtickets.com/clubbing/ushuaia/f-me-im-famous/2026-06-22?aff=CT219" },
          { id: 1003, name: "FMIF Week 3", date: "2026-06-29", lineUp: "David Guetta, Martin Solveig, Oliver Heldens", prices: "80 € - 170 €", affLink: "https://www.clubtickets.com/clubbing/ushuaia/f-me-im-famous/2026-06-29?aff=CT219" }
        ]
      },
      {
        id: 102,
        name: "ANTS - Keep It Weird",
        slug: "ants-ushuaia",
        description: "Ibiza's beloved underground techno colony. Watch the colony take over Ushuaïa with spectacular visual effects and deep tech house tech beats.",
        requirements: "Casual. Dark colors preferred. Photo ID required.",
        startAt: "15:00",
        startAtNextDay: false,
        endAt: "23:00",
        cover: "https://images.unsplash.com/photo-1574391884720-bbc37add1519?auto=format&fit=crop&q=80&w=600",
        affLink: "https://www.clubtickets.com/clubbing/ushuaia/ants?aff=CT219",
        dates: [
          { id: 1004, name: "ANTS Invasion", date: "2026-06-20", lineUp: "Andrea Oliva, Vintage Culture, Nic Fanciulli, Syreeta", prices: "50 € - 90 €", affLink: "https://www.clubtickets.com/clubbing/ushuaia/ants/2026-06-20?aff=CT219" },
          { id: 1005, name: "ANTS Colony", date: "2026-06-27", lineUp: "John Summit, Andrea Oliva, Chelina Manuhutu", prices: "60 € - 110 €", affLink: "https://www.clubtickets.com/clubbing/ushuaia/ants/2026-06-27?aff=CT219" }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Hï Ibiza",
    slug: "hi-ibiza",
    description: "Voted #1 Club in the World! A technological, electronic-music temple boasting moving lighting arrays, kinetic visuals, and standard sound engineering across three breathtaking rooms.",
    picture: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1200",
    whitelogo: "https://affiliates.clubtickets.com/assets/images/venues/hi-white.png",
    isDayClub: false,
    type: { id: 1, slug: "clubbing", name: "Clubbing" },
    activeEvents: 3,
    affLink: "https://www.clubtickets.com/clubbing/hi-ibiza?aff=CT219",
    apiEndpoint: "",
    events: [
      {
        id: 103,
        name: "Afterlife by Tale Of Us",
        slug: "afterlife-hi",
        description: "Step into an immersive, deep-space digital visual odyssey. Tale of Us transforms the Theatre room with their trademark hanging figure and stellar sound design.",
        requirements: "Photo ID required. Entry strictly guaranteed before 01:00 with early-bird passes.",
        startAt: "23:30",
        startAtNextDay: false,
        endAt: "06:30",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600",
        affLink: "https://www.clubtickets.com/clubbing/hi-ibiza/afterlife?aff=CT219",
        dates: [
          { id: 1006, name: "Afterlife Opening", date: "2026-06-18", lineUp: "Tale Of Us, Mind Against, Chris Avantgarde, Kevin de Vries", prices: "80 € - 160 €", affLink: "https://www.clubtickets.com/clubbing/hi-ibiza/afterlife/2026-06-18?aff=CT219" },
          { id: 1007, name: "Afterlife Week 2", date: "2026-06-25", lineUp: "Tale Of Us, Maceo Plex, Argy, Kassian", prices: "85 € - 180 €", affLink: "https://www.clubtickets.com/clubbing/hi-ibiza/afterlife/2026-06-25?aff=CT219" }
        ]
      },
      {
        id: 104,
        name: "Fisher - Wednesdays Residence",
        slug: "fisher-hi",
        description: "The Aussie house heavyweight brings the highest octane crowd in Ibiza! Guaranteed tunes, high energy, and the famous wild Wild Corner takeover.",
        requirements: "No flip-flops. Over 18 ID.",
        startAt: "23:00",
        startAtNextDay: false,
        endAt: "06:30",
        cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600",
        affLink: "https://www.clubtickets.com/clubbing/hi-ibiza/fisher?aff=CT219",
        dates: [
          { id: 1008, name: "Fisher Opening", date: "2026-06-17", lineUp: "Fisher, Vintage Culture, Solardo, Kitty Amor", prices: "75 € - 140 €", affLink: "https://www.clubtickets.com/clubbing/hi-ibiza/fisher/2026-06-17?aff=CT219" },
          { id: 1009, name: "Fisher Week 2", date: "2026-06-24", lineUp: "Fisher, Fatboy Slim, Cloonee, Arielle Free", prices: "85 € - 170 €", affLink: "https://www.clubtickets.com/clubbing/hi-ibiza/fisher/2026-06-24?aff=CT219" }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Pacha Ibiza",
    slug: "pacha-ibiza",
    description: "Rich heritage, twin cherries, and absolute glamour since 1973. Pacha is the original clubbing paradise blending luxury VIP sections with the pulsing energy of electronic dance and house heads.",
    picture: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=800",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200",
    whitelogo: "https://affiliates.clubtickets.com/assets/images/venues/pacha-white.png",
    isDayClub: false,
    type: { id: 1, slug: "clubbing", name: "Clubbing" },
    activeEvents: 2,
    affLink: "https://www.clubtickets.com/clubbing/pacha?aff=CT219",
    apiEndpoint: "",
    events: [
      {
        id: 105,
        name: "Solomun +1",
        slug: "solomun-pacha",
        description: "The gold standard of Sunday nights. Resident heavy-hitter Solomun handles the booth with one selectively invited guest in a back-to-back DJ masterclass.",
        requirements: "Photo ID. Classy attire recommended.",
        startAt: "23:59",
        startAtNextDay: false,
        endAt: "06:30",
        cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600",
        affLink: "https://www.clubtickets.com/clubbing/pacha/solomun?aff=CT219",
        dates: [
          { id: 1010, name: "Solomun +1 Opening", date: "2026-06-14", lineUp: "Solomun, Gerd Janson", prices: "65 € - 130 €", affLink: "https://www.clubtickets.com/clubbing/pacha/solomun/2026-06-14?aff=CT219" },
          { id: 1011, name: "Solomun + Dixon", date: "2026-06-21", lineUp: "Solomun, Dixon", prices: "70 € - 145 €", affLink: "https://www.clubtickets.com/clubbing/pacha/solomun/2026-06-21?aff=CT219" }
        ]
      },
      {
        id: 106,
        name: "Music On by Marco Carola",
        slug: "music-on-pacha",
        description: "Pure, relentless dark techno and bassline house. Marco Carola hosts his world-famous crowd full of models, music purists, and international VIPs.",
        requirements: "Classy and energetic. Strict door entry rules.",
        startAt: "23:59",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600",
        affLink: "https://www.clubtickets.com/clubbing/pacha/music-on?aff=CT219",
        dates: [
          { id: 1012, name: "Music On", date: "2026-06-19", lineUp: "Marco Carola, Loco Dice, Joey Daniel", prices: "80 € - 180 €", affLink: "https://www.clubtickets.com/clubbing/pacha/music-on/2026-06-19?aff=CT219" }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Amnesia Ibiza",
    slug: "amnesia-ibiza",
    description: "The historical heart of Ibiza club culture. Amnesia's open main room and translucent-roof Terrace host the island's legendary sunrise moments, where sunlight bursts through the ceiling.",
    picture: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200",
    whitelogo: "https://affiliates.clubtickets.com/assets/images/venues/amnesia-white.png",
    isDayClub: false,
    type: { id: 1, slug: "clubbing", name: "Clubbing" },
    activeEvents: 2,
    affLink: "https://www.clubtickets.com/clubbing/amnesia?aff=CT219",
    apiEndpoint: "",
    events: [
      {
        id: 107,
        name: "Paradise by Jamie Jones",
        slug: "paradise-amnesia",
        description: "Jamie Jones invites you to his lush, utopian electronic sanctuary. Funky acid loops, colorful decor, and deep house grooves all night long.",
        requirements: "Groovy. Casual chic.",
        startAt: "23:00",
        endAt: "06:30",
        cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600",
        affLink: "https://www.clubtickets.com/clubbing/amnesia/paradise?aff=CT219",
        dates: [
          { id: 1013, name: "Paradise Opening", date: "2026-06-17", lineUp: "Jamie Jones, Joseph Capriati, Hot Since 82", prices: "60 € - 110 €", affLink: "https://www.clubtickets.com/clubbing/amnesia/paradise/2026-06-17?aff=CT219" }
        ]
      },
      {
        id: 108,
        name: "elrow Ibiza",
        slug: "elrow-amnesia",
        description: "The craziest, most colorful theatrical tech-house spectacle on Earth! Giant inflatable toys, aerial actors, stilt walkers, and tons of confetti.",
        requirements: "Fun and expressive dress code highly welcomed!",
        startAt: "23:00",
        cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600",
        affLink: "https://www.clubtickets.com/clubbing/amnesia/elrow?aff=CT219",
        dates: [
          { id: 1014, name: "elrow Delusionville", date: "2026-06-20", lineUp: "Eats Everything, Claptone, Wade, Bastian Bux", prices: "70 € - 130 €", affLink: "https://www.clubtickets.com/clubbing/amnesia/elrow/2026-06-20?aff=CT219" }
        ]
      }
    ]
  }
];

// Special Daily Offers & Packages (Deals of the Day)
export interface Deal {
  id: string;
  title: string;
  badge: string;
  description: string;
  originalPrice: string;
  discountPrice: string;
  image: string;
  link: string;
  type: 'ticket' | 'boat' | 'combo';
}

export const dealsOfTheDay: Deal[] = [
  {
    id: 'd1',
    title: 'David Guetta Opening + Express Entry Combo',
    badge: 'Limited Slots',
    description: 'Guaranteed tickets to Fmif! at Ushuaïa plus pre-party drinks discount and express VIP queue skips.',
    originalPrice: '120 €',
    discountPrice: '95 €',
    image: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=600',
    link: 'https://www.clubtickets.com/clubbing/ushuaia/f-me-im-famous?aff=CT219',
    type: 'combo'
  },
  {
    id: 'd2',
    title: 'Ibiza Sunset Sea Cruise & Open Bar',
    badge: '-15% Today',
    description: 'Experience Ibiza’s spectacular sunset on board our VIP double-decker boat. 3 hours, free open bar (beer, sangria, sodas).',
    originalPrice: '89 €',
    discountPrice: '75 €',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=600',
    link: '#',
    type: 'boat'
  },
  {
    id: 'd3',
    title: 'Vespa Scooter Rental 24H Explorer',
    badge: 'Popular',
    description: 'Ditch the traffic and narrow roads. Grab a premium Vespa 125cc with 2 free helmets and explore secret calas.',
    originalPrice: '45 €',
    discountPrice: '35 €',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
    link: '#',
    type: 'ticket'
  }
];

// VIP Yacht and Private Boat Charters
export const boatCharters: BoatCharter[] = [
  {
    id: 'bc1',
    name: 'Sunseeker Predator 68 "Obsidian"',
    type: 'yacht',
    capacity: 12,
    length: '21 meters',
    pricePerDay: '2,900 €',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800',
    features: ['Professional Captain', 'Hostess', 'Champagne Welcome', 'Snorkeling Gear', 'Seabob (Optional)', 'Fuel included (limited range)'],
    description: 'The epitome of high-performance luxury. Glide seamlessly to Formentera with state-of-the-art layout, wrap-around sundecks, and air-conditioned lounge.'
  },
  {
    id: 'bc2',
    name: 'Fjord 40 Open "Horizon"',
    type: 'speedboat',
    capacity: 11,
    length: '12 meters',
    pricePerDay: '1,450 €',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
    features: ['Captain included', 'Towels & Drinks', 'Snorkel Equipment', 'Premium Bluetooth Audio', 'Shade Canopy'],
    description: 'The coolest dayboat on the island. Iconic walkaround deck design with massive social tables and huge rear sundeck.'
  },
  {
    id: 'bc3',
    name: 'Lagoon 450S Premium Luxury Catamaran',
    type: 'catamaran',
    capacity: 12,
    length: '14 meters',
    pricePerDay: '2,100 €',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800',
    features: ['Sailing Skipper', 'Hostess / Chef', '2x SUP Paddles', 'Bluetooth Subwoofer', 'Kitchen & BBQ', 'Soft Drinks & Wine'],
    description: 'Ultimate stability and space. Sunbathe on the front netting over crystal clear turquoise bays, or dine comfortably on the shaded rear couch.'
  }
];

// Boat Parties
export const boatParties: BoatParty[] = [
  {
    id: 'bp1',
    name: 'Oceanbeat Ibiza Sunset Party Boat',
    host: 'Oceanbeat Ibiza',
    datePattern: 'Every Monday, Wednesday, Saturday & Sunday',
    duration: '4 Hours (16:30 - 20:30)',
    price: '79 €',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=700',
    whatsIncluded: ['Host / MC & Live DJ', 'Open Bar (Beer, Sangria, Cocktails)', 'Champagne Showers', 'Free Club Ticket Entry', 'Swim Stop & Giant Waterslide'],
    description: 'Ibiza’s wild boat party with up to 300 guests on board! Featuring international house producers, champagne rain, and high diving.'
  },
  {
    id: 'bp2',
    name: 'Lost In Ibiza Techno Sunset Cruise',
    host: 'Lost In Ibiza',
    datePattern: 'Wednesdays (Anjunadeep Pre-party)',
    duration: '3.5 Hours (17:30 - 21:00)',
    price: '69 €',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=700',
    whatsIncluded: ['Void Acoustic Sound System', 'Top International Deep Tech DJs', '2 Free Drinks', 'Staring Sunset over San Antonio', 'Optional Paradise Club Ticket Combo'],
    description: 'For proper electronic purists. Sail along the beautiful cliffs of San Antonio with pulsating deep grooves and organic house bassbeats.'
  }
];

// VIP Catamaran Trips (Exclusive Semi-Private Sailing)
export interface VipCatamaran {
  id: string;
  name: string;
  price: string;
  image: string;
  duration: string;
  capacity: string;
  description: string;
  features: string[];
}
export const vipCatamarans: VipCatamaran[] = [
  {
    id: 'cat1',
    name: 'Formentera Luxury Day Sailing (Max 15 guests)',
    price: '169 € / Person',
    image: 'https://images.unsplash.com/photo-1505080856163-41881126cbc4?auto=format&fit=crop&q=80&w=700',
    duration: '7 Hours (11:00 - 18:00)',
    capacity: 'Semi-private, max 15 people',
    description: 'Avoid crowded ferries. Glide in luxury on a sailing catamaran, drop anchor at the world-famous Ses Illetes beach, enjoy fresh fruit and Spanish tapas.',
    features: ['Welcome drink & wine/beer', 'Gourmet Cold Tapas & Desserts', 'Snorkeling + SUP Paddles', 'Anchor stop at Espalmador Island']
  }
];

// Formentera Trips
export const formenteraTrips: FormenteraTrip[] = [
  {
    id: 'ft1',
    name: 'Ibiza - Formentera Fast Ferry (2-Way Express)',
    duration: '30 Minutes each way',
    frequency: 'Departures every 30 mins (07:00 to 22:30)',
    price: '46 € (Roundtrip)',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=700',
    highlights: ['Fast-lane e-tickets sent to phone', 'Open-date return, valid for 10 days', 'Spacious top deck for oceanic panoramic photos', 'Bicycle/Scooter transport allowed'],
    description: 'The easiest, most comfortable fast ferry linking Ibiza Port directly to Formentera (La Savina). Load instantly on any ferry.'
  },
  {
    id: 'ft2',
    name: 'Full-Day Catamaran Beach Cruise to Formentera',
    duration: '6 Hours (11:30 - 17:30)',
    frequency: 'Every Tuesday, Thursday & Friday',
    price: '119 €',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=700',
    highlights: ['Onboard paella and drinks buffet', 'Scenic swim stops at Espalmador sandbars', '2 hours free time on Formentera land', 'Qualified crew & giant sunning safety nets'],
    description: 'A complete all-inclusive day trip. Discover white sugar sands and the bluest water outside the Caribbean.'
  }
];

// VIP Drink/Table Packages
export const drinkPackages: DrinkPackage[] = [
  {
    id: 'dp1',
    name: 'Silver Backstage Table',
    venueName: 'Hï Ibiza',
    price: '2,500 €',
    whatsIncluded: ['Up to 6 guests entry included', '2,500 € beverage credit included', 'Fast VIP access bypass', 'Your own private host and dedicated server', 'Private premium viewing lounge behind DJ'],
    isVip: true
  },
  {
    id: 'dp2',
    name: 'Main Room VIP Box Front Row',
    venueName: 'Pacha Ibiza',
    price: '3,000 €',
    whatsIncluded: ['Up to 8 guests entry included', '3,000 € bottle credit', 'Panoramic dancefloor viewpoints', 'Fast VIP lane skip', 'Dedicated security guard'],
    isVip: true
  },
  {
    id: 'dp3',
    name: 'Premium Bed Poolside Day Pass',
    venueName: 'Ushuaïa Ibiza',
    price: '1,200 €',
    whatsIncluded: ['Up to 4 guests bed access', '1,200 € food & bottle credit included', 'Premium poolside front stage view', 'Express backstage entry', 'Towel service & premium robes'],
    isVip: false
  }
];

// Scooter & Car Options
export const carRentals: CarRental[] = [
  {
    id: 'cr1',
    name: 'Jeep Wrangler Sahara Cabrio 4x4',
    type: 'car',
    pricePerDay: '135 €',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
    features: ['Convertible Open-top', 'GPS Navigation', 'Unlimited KMs', 'Full Comprehensive Insurance (Extra)']
  },
  {
    id: 'cr2',
    name: 'Vespa Primavera 125 cc Classic',
    type: 'scooter',
    pricePerDay: '39 €',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
    features: ['2 helmets included', 'Anti-theft lock', 'Free cancellation', 'Top speed 95km/h']
  },
  {
    id: 'cr3',
    name: 'Fiat 500 Hybrid Lounge Cabrio',
    type: 'car',
    pricePerDay: '59 €',
    transmission: 'Manual',
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=600',
    features: ['Sunroof', 'Beats Audio System', 'Extremely easy parking', 'Smart Bluetooth Play']
  }
];

// Guest reviews
export const reviewsData: Review[] = [
  {
    id: 'r1',
    author: 'Mark van der Meer',
    country: 'Netherlands',
    rating: 5,
    date: 'June 05, 2026',
    text: 'Sensationele service! Booked 6 tickets for Afterlife and a private catamaran trip to Formentera. They delivered the ferry e-tickets instantly to my WhatsApp. This is my #1 choice for Ibiza planning!',
    category: 'Vip Catamaran'
  },
  {
    id: 'r2',
    author: 'Sarah Jenkins',
    country: 'United Kingdom',
    rating: 5,
    date: 'May 28, 2026',
    text: 'Highly professional. Live chat answered my questions in seconds regarding Ushuaia VIP table limits. Easy checkout, secure booking codes, outstanding experience.',
    category: 'Drink Packages'
  },
  {
    id: 'r3',
    author: 'Diego Rossi',
    country: 'Italy',
    rating: 5,
    date: 'June 10, 2026',
    text: 'I rented a Jeep Wrangler open top for 3 days. Super simple pickup, and great pricing. Best agency in Ibiza.',
    category: 'Car & Scooter Rental'
  }
];
