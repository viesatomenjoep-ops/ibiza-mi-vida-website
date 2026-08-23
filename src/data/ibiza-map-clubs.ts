// Coordinates, imagery and copy for the 3D map (Map3D.tsx). Ported verbatim
// from the original standalone widget (public/ibiza-kaart.html, kept on disk
// as a static reference/fallback) so the hand-placed coordinates and curated
// descriptions aren't re-derived. Club `slug` matches the clubtickets venue
// slug so callers can cross-reference into the live venues dataset.

export interface MapPlace {
  name: string
  slug?: string
  /** 2-4 letter initials shown when there's no logo (e.g. Pacha, Amnesia). */
  ini?: string
  area: string
  /** [lng, lat] */
  coords: [number, number]
  logo?: string
  /** Activities use a photo instead of a white logo mark. */
  img?: string
  photo?: boolean
  /** Background image for the info readout (clubs only). */
  bg?: string
  text?: string
}

const V = 'https://media.clubtickets.com/migrated/venue/'

export const HOME_BOUNDS: [[number, number], [number, number]] = [
  [1.19, 38.635],
  [1.605, 39.115],
]
export const MAX_BOUNDS: [[number, number], [number, number]] = [
  [1.02, 38.52],
  [1.78, 39.28],
]

export const MAP_CLUBS: MapPlace[] = [
  { name: 'Hï Ibiza', slug: 'hi-ibiza', area: "Playa d'en Bossa", coords: [1.4046, 38.8862],
    logo: V + 'f158734e-05d3-42b6-9499-25c2acc00633.png', bg: V + '804a4a61-2357-4a8b-a6ef-08d26c09dcc2.png',
    text: "'s Werelds nummer 1-club op Playa d'en Bossa. Twee spectaculaire rooms, het legendarische Theatre en topresidencies van de grootste dj's ter wereld." },
  { name: 'Ushuaïa', slug: 'ushuaia-ibiza', area: "Playa d'en Bossa", coords: [1.4079, 38.8846],
    logo: V + 'dcadf125-c566-4cd4-9c6f-8726a139ac01.png', bg: V + 'd4664c57-5ad6-46cd-b897-d9744f95b3fb.jpg',
    text: "Het iconische openluchtstadion aan Playa d'en Bossa. Overdag feesten onder de zon met wereldsterren op het hoofdpodium." },
  { name: 'UNVRS', slug: 'unvrs-ibiza', area: 'San Rafael', coords: [1.4095, 38.9520],
    logo: V + '940302ac-ef06-46bf-b76a-91d3b092b184.png', bg: V + '7e7d9db3-8285-4960-803d-0af0d4b49b58.jpg',
    text: 'De nieuwste hyperclub van Ibiza — een adembenemende arena, gebouwd voor de allergrootste nachten van het eiland.' },
  { name: 'Pacha', slug: 'pacha-ibiza', ini: 'PA', area: 'Ibiza-Stad', coords: [1.4418, 38.9188],
    text: 'Sinds 1973 hét symbool van Ibiza met zijn twee kersen. Glamour, house en de legendarische zondagen in het hart van de stad.' },
  { name: 'Amnesia', slug: 'amnesia-ibiza', ini: 'AM', area: 'San Rafael', coords: [1.4083, 38.9483],
    text: 'Kathedraal van de dansmuziek met de beroemde Terrace. Thuisbasis van elrow, Pyramid en Cocoon — schuim, lasers en pure energie.' },
  { name: 'DC-10', slug: 'dc10-ibiza', ini: 'DC10', area: 'Ses Salines', coords: [1.3963, 38.8746],
    text: 'De rauwe, underground tempel bij de Salinas. Circoloco op maandag is wereldberoemd — puur, ongepolijst en legendarisch.' },
  { name: 'Eden', slug: 'eden-ibiza', area: 'San Antonio', coords: [1.3021, 38.9840],
    logo: V + '64a47a76-b2e0-4d80-86de-f2a6d201b322.png', bg: V + '45e24f34-25d8-40c4-9354-4326d43dce0b.png',
    text: 'Kloppend hart van San Antonio. State-of-the-art geluid en energieke nachten pal aan de beroemde Sunset Strip.' },
  { name: 'Es Paradis', slug: 'es-paradis', area: 'San Antonio', coords: [1.3013, 38.9852],
    logo: V + 'fbd02806-7ceb-42cd-87c4-552cce61b934.png', bg: V + '38d6f43f-39b7-4501-92cc-e004210295a0.jpg',
    text: 'Ibiza-klassieker in San Antonio met zijn iconische piramide en legendarische waterfeesten onder de sterrenhemel.' },
  { name: 'O Beach', slug: 'o-beach-ibiza', area: 'San Antonio Bay', coords: [1.2966, 38.9872],
    logo: V + 'e65f2e55-376a-4301-a4c7-64b94f17eca5.png', bg: V + '94badb86-d2e5-4679-bf18-02d3b7c15f9f.png',
    text: 'De ultieme dagclub aan de baai van San Antonio. Poolside luxe, dansers en topartiesten onder de Ibiza-zon.' },
  { name: 'Cova Santa', slug: 'cova-santa', ini: 'CS', area: 'San José', coords: [1.3487, 38.9319],
    text: 'Magische openluchtlocatie rond een echte grot. Intieme nachten met house en techno onder de palmen en de sterren.' },
  { name: 'Lío', slug: 'lio', area: 'Marina Botafoch', coords: [1.4433, 38.9174],
    logo: V + '3338d173-1353-4dbe-84f8-cf6eacbf46c2.png', bg: V + '1ce0aa69-1bff-4a33-9a19-3446d03e0969.jpg',
    text: 'Cabaret, diner en club in één aan Marina Botafoch. Glamour, live shows en uitzicht op de oude stad.' },
  { name: 'Ibiza Rocks', slug: 'ibiza-rocks', area: 'San Antonio', coords: [1.3062, 38.9808],
    logo: V + 'e73571a9-2343-4005-b32e-5088721c2112.png', bg: V + 'a1ff4628-a402-4af9-b840-5a437d01acdc.jpg',
    text: 'Het originele poolparty-hotel in San Antonio. Live optredens en dj-sets met je voeten aan het water.' },
]

// Boats/watersports/excursions — coords are approximate departure areas.
export const MAP_ACTIVITIES: MapPlace[] = [
  { name: 'Ibiza Cruise Crush', img: V + '15e2296d-18e2-485f-b7a0-53fea180a401.png', photo: true, coords: [1.4345, 38.9120], area: 'Ibiza' },
  { name: 'The Formentera Cruise', img: V + 'b2315d5e-1d9c-4903-95cd-8cdb743e36b2.jpg', photo: true, coords: [1.4375, 38.9095], area: 'Ibiza' },
  { name: 'The Beach Hopper', img: V + '55237eca-f656-48e3-b633-f4d44c6872d4.png', photo: true, coords: [1.2985, 38.9815], area: 'San Antonio' },
  { name: 'Ulises Cat', img: V + '1374afe0-2ac9-4eac-9daf-3ccafaa66a0d.png', photo: true, coords: [1.5340, 38.9850], area: 'Santa Eulària' },
  { name: 'Float Your Boat', img: V + '04713cdf-7f06-465d-8d74-4ee0b780d855.png', photo: true, coords: [1.3025, 38.9795], area: 'San Antonio' },
  { name: 'Pukka Up', img: V + '0dc41496-83f4-409a-95b0-8d2fd011ff9c.jpg', photo: true, coords: [1.2965, 38.9790], area: 'San Antonio' },
  { name: 'Aquabus', img: V + 'a081435f-8866-44e8-9c6b-2a0474f39b67.jpg', photo: true, coords: [1.4320, 38.9075], area: 'Ibiza' },
  { name: 'Balearia', img: V + '244db92f-fcc7-4ab6-a547-b1e9cab4800f.png', photo: true, coords: [1.4310, 38.9055], area: 'Ibiza' },
  { name: 'Capitan Nemo', img: V + 'e170898b-4b4c-4204-86ac-20a7b978b39f.png', photo: true, coords: [1.3000, 38.9820], area: 'San Antonio' },
  { name: 'Cova de Can Marça', img: V + '6241cc2a-4a85-465c-be6e-a9fabae20bb2.png', photo: true, coords: [1.4436, 39.0836], area: 'Port de Sant Miquel' },
  { name: 'Emove Ibiza', img: V + '759d6d70-d783-40c7-be91-a8ba1c4b365d.png', photo: true, coords: [1.4330, 38.9070], area: 'Ibiza' },
  { name: 'Excursiones Al Sabini', img: V + 'b98392d7-323d-483e-aed6-a3f3f20832e5.jpg', photo: true, coords: [1.3600, 39.0000], area: 'Ibiza' },
  { name: 'Cruceros Portmany', img: V + 'fe6091c3-09f9-4914-acb7-397989dff219.jpg', photo: true, coords: [1.2950, 38.9770], area: 'San Antonio' },
  { name: 'Salvador', img: V + 'e505c626-466e-42a4-86e7-c54992459f67.png', photo: true, coords: [1.4385, 38.9110], area: 'Ibiza' },
  { name: 'TAKE OFF', img: V + '296ef24a-43de-4df8-846f-4f3295440e54.jpg', photo: true, coords: [1.4060, 38.8855], area: "Playa d'en Bossa" },
  { name: 'Lady Virginia Boat', img: V + 'b9e3521a-bdb4-43a4-b2aa-192aa6905a5e.png', photo: true, coords: [1.4350, 38.9085], area: 'Ibiza' },
  { name: 'Ibiza Jet Ski Beach', img: V + '19228359-8778-4cd7-8574-21196a76d7c2.png', photo: true, coords: [1.4025, 38.8825], area: "Playa d'en Bossa" },
  { name: 'Blue Coral Ibiza', img: V + '4d0bcd10-7f62-4198-9a15-b9af51df50af.png', photo: true, coords: [1.2940, 38.9825], area: 'San Antonio' },
  { name: 'Santa Eularia Ferry', img: V + '99fec39b-72f5-4951-94b4-88fcd20ac981.jpg', photo: true, coords: [1.5365, 38.9835], area: 'Santa Eulària' },
  { name: 'Excursiones Ibiza', img: V + '2318dd92-55d7-4456-b63f-b9042e6605ba.jpg', photo: true, coords: [1.4335, 38.9130], area: 'Ibiza' },
  { name: 'BIBO Park Ibiza', img: V + 'af8819b4-525d-4e0e-b382-4c1493e99d96.png', photo: true, coords: [1.3100, 38.9750], area: 'San Antonio' },
  { name: 'Into the Island', img: V + 'f0abab03-7133-4b08-abdd-a357dcea66a0.png', photo: true, coords: [1.3400, 38.9750], area: 'San José' },
  { name: 'Es Vedrà Charter', img: V + 'cacbdd2b-d95e-4837-adc3-ef0151c0a5c7.png', photo: true, coords: [1.2250, 38.8720], area: 'Es Vedrà' },
  { name: 'Ibiza Buggy Adventure', img: V + 'ce22b491-6de3-4a75-a4a2-a2b0812f468b.png', photo: true, coords: [1.3300, 38.9850], area: 'San Antonio' },
  { name: 'Enjoy Water Sports', img: V + '2b5679e1-b979-4ac8-b21d-0c1f235c1b0a.jpg', photo: true, coords: [1.5300, 38.9850], area: 'Santa Eulària' },
  { name: 'SUP Paradise Ibiza', img: V + 'c4f0ae94-1459-4d39-9f9a-54a39bec4b04.png', photo: true, coords: [1.5380, 38.9820], area: 'Santa Eulària' },
  { name: 'Chilli Pepper Boats', img: V + '8413e79a-af67-440d-85c2-c87186348abc.png', photo: true, coords: [1.3015, 38.9805], area: 'San Antonio' },
]
