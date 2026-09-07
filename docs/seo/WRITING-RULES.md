# Fase D — Schrijfregels voor alle SEO-content

Bindend voor elke nieuwe money-, venue- en gidspagina.

## Toon

Lokale insider die eerlijk adviseert. Geen hype. Verboden formuleringen:
"unforgettable experience", "the party of a lifetime", "hidden gem", "world-class",
"nestled". Als een zin ook op de site van een concurrent zou kunnen staan, is hij
niet specifiek genoeg.

Concreet betekent: gebied, hoe je er komt, wanneer je gaat, wat het kost, dresscode,
en wat er misgaat als je het verkeerd doet.

## Structuur per pagina

- **Eén `<h1>`**, met plaatsnaam. "Tours" is voor een antwoordmachine geen
  antwoord; "Ibiza" ís de zoekopdracht.
- **Eerste zin = het antwoord.** Niet een aanloop naar het antwoord. Met een
  concreet cijfer of feit erin. Voorbeeld: *"Pacha Ibiza is the island's oldest
  club, open since 1973 in Ibiza Town, and the only major venue that runs
  year-round rather than only in season."*
- **Lead 80–120 woorden**, en die draagt zelf de aantallen, vanafprijzen en
  merknamen — niet twee schermen lager. Een antwoordmachine citeert de pagina
  die de feiten in de eerste alinea heeft staan.
- Woordentelling: venue 700–1.000 · boot/trip 600–900 · vip 600–800 ·
  hub 500–800 · gids 1.200–2.000.
- **FAQ: 5–8 vragen** die mensen echt typen (prijs, hoe boeken, hoe laat,
  dresscode, leeftijd, hoe kom je er, wat als het regent, annulering).
  Antwoorden 40–90 woorden, eerste zin is het antwoord.
- **4–6 interne links** naar zusterpagina's plus de functionele boekroute.
- **Zichtbare "laatst bijgewerkt"-datum** via `contentUpdated(PAGE_KEY)`.

## Techniek (niet onderhandelbaar)

- SSR/SSG. Geen `"use client"` op een routepagina die indexeerbare content rendert.
- `export const revalidate = 3600`.
- Title ≤ 60 tekens **inclusief** de suffix " | Ibiza mi vida" die
  `staticMetadata()` erachter plakt (16 tekens). Meta ≤ 155.
- FAQ-schema en zichtbare FAQ komen uit **dezelfde array**. Schema dat een
  antwoord claimt dat niet op de pagina staat, is een beleidsovertreding.
- `BreadcrumbList` op elke indexeerbare pagina. Home-kruimel krijgt `path: ''`,
  nooit `path: locale` — dat maakt `/en/en`.
- Eerste element reserveert zelf `pt-[calc(var(--nav-h)+…)]`; de header is
  `position: fixed` en er is geen globale compensatie.
- Een blok zonder eigen achtergrond erft de donkere `body`. Donkere tekst hoort
  in een blok dat zelf een lichte ondergrond meebrengt. `gold` vult vlakken,
  `gold-soft` schrijft op donker.

## Eerlijkheid

- **Verzin nooit** events, line-ups, prijzen of reviews.
- Een prijs die de site al kent (uit `fleet.ts`, `price-stats.ts`) leid je af uit
  de brondata — nooit overtypen, want dan loopt hij stil achter.
- Een prijs die we niet bevestigd hebben: geen getal in de copy, geen `Offer` in
  het schema, en een regel in `NIGHT-REPORT.md` onder `[[VERIFY]]`.
- Een club die niet in de ClubTickets-feed staat, krijgt **geen boekknop en geen
  ticketclaim**. Wel: guide, guestlist en de WhatsApp-concierge.
- Marktbrede prijsranges ("wat een ticket hier kost") mogen, mits als observatie
  geformuleerd en niet als onze prijs. Wij zijn wederverkoper.
- `[[TBD]]`, `[[VERIFY]]` en `[[TRANSLATE]]` verschijnen **nooit** in de UI.

## Cannibalisatie

Eén URL draagt één zoekintentie. Voordat je een pagina maakt: bestaat er al een
route voor dit onderwerp? Zo ja, dan hernoem je die of je schrijft de term in de
bestaande titel — je zet er geen tweede URL naast. Twee eigen URL's op dezelfde
query splitsen elkaars links en Google kiest er één, meestal niet degene die je
wilde.

## Vertalen

Een nieuwe pagina begint als `['en']` in `ROUTE_LOCALES`. Een taal komt erbij als
**laatste** stap, nadat die pagina echt rendert — nooit ervoor. Een hreflang naar
een 404 laat Google het hele cluster weggooien.
