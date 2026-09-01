# Intentiekaart — welke URL beantwoordt welke vraag

Bijgewerkt: 2026-09-01

Eén URL draagt één zoekintentie. Deze kaart legt vast wélke, zodat de volgende
pagina die erbij komt niet per ongeluk op een bestaande gaat staan. Zet je een
pillar naast een bestaande categoriepagina, dan hertitel je die categoriepagina
in dezelfde commit.

## Waarom dit bestand er is

Bij de audit van 1 september stonden vier paren van onze eigen URL's op dezelfde
zoekopdracht. Drie daarvan waren die ochtend zelf ontstaan: de pillar werd
gebouwd, de bestaande categoriepagina bleef staan met haar oude titel, en Google
kreeg twee kandidaten voor één query. Dat splitst de interne links en de keuze
valt zelden op de pagina die je wilde.

| Pagina | Titel vóór de audit | Botste met |
| --- | --- | --- |
| `/boats` | "Ibiza Boat Rental — Charters & Yachts" | `/boat-rental-ibiza` |
| `/water-sports` | "Ibiza Water Sports — Jet Ski, Flyboard & More" | `/jet-ski-rental-ibiza` |
| `/car-scooter-rental` | "Car & Scooter Rental in Ibiza" | `/car-rental-ibiza` |
| `/calendar` (H1) | "Club Tickets Ibiza" | `/ibiza-club-tickets` |

## De verdeling

### Boten

| URL | Beantwoordt |
| --- | --- |
| `/boats` | Hub. "Wat kan ik op Ibiza op het water doen?" Routeert naar de vijf categorieën, verkoopt zelf niets. |
| `/boat-rental-ibiza` (+ 4 taalslugs) | "boat rental ibiza" — de commerciële verhuurterm. Prijzen, voorwaarden, Click&Boat. |
| `/boat-hire-ibiza-no-licence` | "zonder vaarbewijs" |
| `/boat-rental-with-skipper-ibiza` | "met schipper" |
| `/private-boat-charters` | Onze eigen vloot en charters, niet de marktplaats |
| `/boat-trip` | Boottochten en dagtrips uit de agenda (aanbieders, data) |
| `/boat-party` | Bootfeesten. Bewust géén tweede pagina op `boat-party-ibiza` |
| `/ferry-formentera`, `/shuttle-ferry` | Vervoer over water, geen recreatie |
| `/click-and-boat-ibiza` | Merkzoekopdracht "Click and Boat review" — andere intentie dan verhuur |

### Auto's en scooters

| URL | Beantwoordt |
| --- | --- |
| `/car-rental-ibiza` (+ 4 taalslugs) | "car rental ibiza" — de commerciële term. Wiber. |
| `/car-rental-ibiza-airport` | Ophalen op de luchthaven |
| `/convertible-car-rental-ibiza` | Cabrio |
| `/car-scooter-rental` | Scooters en quads. De naam van de route is historisch; auto's staan er nog als duidelijk ondergeschikte H2 die doorlinkt naar de pillar. |
| `/wiber-car-rental-ibiza` | Merkzoekopdracht "Wiber Ibiza" |

### Watersport

| URL | Beantwoordt |
| --- | --- |
| `/jet-ski-rental-ibiza` | "jet ski rental ibiza" — de commerciële term |
| `/water-sports` | De categorie: flyboard, parasailing, banaan, en jetski als één van de opties |

### Clubs en tickets

| URL | Beantwoordt |
| --- | --- |
| `/calendar` | De agenda: wie speelt wanneer waar |
| `/ibiza-club-tickets` | "ibiza club tickets" — de commerciële term |
| `/clubs`, `/artists` | Entiteiten, met eigen detailpagina's |
| `/this-week` | Deze week, tijdgebonden |
| `/guestlist` | Gratis op de lijst via WhatsApp |
| `/package-deals` | Betaalde bundels: ticket, tafel, transfer |
| `/drink-packages` | Drankpakketten in de club |
| `/beach-clubs` | Strandclubs, geen nachtclubs |

`/club-tickets` en `/ibiza-guestlist` zijn redirects en horen niet in de sitemap.

### Doen op het eiland

| URL | Beantwoordt |
| --- | --- |
| `/activities` | Het overzicht. Bevat alles wat `/tours` en `/water-sports` filteren. |
| `/tours` | De begeleide helft: rondleidingen en excursies met gids |
| `/locations`, `/ibiza-in/[maand]` | Plaats en tijd |
| `/tips`, `/ibiza-prices`, `/ibiza-season` | Informatief, geen boekingsintentie |

## Regels bij het toevoegen van een pagina

1. Zoek eerst in deze tabel of de vraag al een URL heeft. Zo ja: verbeter die,
   bouw er geen tweede naast.
2. Komt er een pillar naast een categoriepagina, hertitel de categoriepagina in
   dezelfde commit — hub of smallere helft.
3. Splits je een pagina, splits dan élke interne link mee. Grep op het oude
   pad, niet op het oude label: na de splitsing van guestlist/package-deals
   wezen drie widgets nog met het label "Package Deals" naar `/guestlist`.
4. Een H1 zonder plaatsnaam is voor een antwoordmachine geen antwoord.
5. `npm run check:seo` moet blijven slagen en de baseline mag niet groeien.
