# Amerikaanse reizigers — het Engelse cluster op ibizamivida.com

Laatst bijgewerkt: 15 september 2026.

Beslissing: **geen aparte site.** Het Amerikaanse aanbod staat op het bestaande
`.com`-domein onder `/en/…`, in Amerikaans Engels. Een tweede domein begint op
nul autoriteit en verdubbelt het onderhoud; hier erft elke nieuwe pagina de
links, het schema en de entiteit die er al staan. De site is al Engels-eerst
(`x-default = /en`), dus er hoefde niets aan de i18n te veranderen.

## Waarom dit publiek

Amerikaanse bezoekers boeken maanden vooruit, boeken alles online, en geven
het meest uit aan precies onze vier producten: VIP-tafels, jachten, excursies
en huurauto's. Daar komt een concreet moment bij: **United vliegt vanaf 31 mei
2027 vier keer per week nonstop Newark–Ibiza** (A321XLR, aangekondigd 26
augustus 2026, onder voorbehoud van goedkeuring door de Amerikaanse en Spaanse
overheid). Dat is de eerste nonstop VS–Ibiza ooit. Wie de vragen van dat
publiek nú beantwoordt, staat in de index als de zoekvraag explodeert.

## Wat er staat (live na deze commit)

| URL | Vraag die hij beantwoordt | Data die hij gebruikt |
| --- | --- | --- |
| `/en/ibiza-for-americans` | "Ibiza for Americans" — de hub: hoe kom je er, papieren, kosten in dollars, wie boekt | `us-travel.ts`, `fleet.ts`, live agenda, wisselkoers |
| `/en/flights-to-ibiza-from-usa` | "direct flights US to Ibiza", "how long is the flight from New York to Ibiza" | `US_NONSTOP`, `GATEWAYS` |
| `/en/ibiza-travel-requirements-us-citizens` | "do US citizens need a visa for Ibiza", "ETIAS Spain", "international driving permit Spain", "tipping in Ibiza" | `ETIAS`, `EES` |
| `/en/luxury-ibiza-itinerary-5-days` | "ultimate 5-day luxury Ibiza itinerary" | `fleet.ts`, `price-stats`, `rental-prices`, wisselkoers |

Elke pagina: één H1, antwoord in de eerste alinea met cijfers, 6–9 FAQ's met
schema, `WebPage` met `dateModified`, byline van Simon, WhatsApp-CTA, en de
onderlinge links van het cluster. Prijzen staan in euro's mét een
dollarschatting en de koers plus datum eronder.

### Hoe de feiten leven

Alles wat veroudert staat in **`src/lib/us-travel.ts`**, nergens anders:

- `US_NONSTOP` — de nonstop-routes met `status` (`announced` → `on-sale` →
  `flying`) en `asOf`. Zodra United de vlucht in de verkoop zet: status op
  `on-sale`, `asOf` op vandaag, `content-dates.ts` bumpen voor
  `flights-to-ibiza-from-usa`. De lead, de FAQ, de hub en `llms.txt`
  herschrijven zichzelf. Tot die tijd zegt élke pagina expliciet "aangekondigd,
  nog niet te koop" — een antwoordmachine die "United vliegt nonstop" citeert
  terwijl het nog niet zo is, stuurt mensen naar een vlucht die niet bestaat.
- `ETIAS` — `live: false` tot het echt van kracht is. De EU heeft het doel
  "vierde kwartaal 2026" in juli 2026 geschrapt en wijst naar 2027. Zet
  `live: true` en `since` op de startdatum; `etiasSentence()` en `llms.txt`
  volgen. Controleer op https://travel-europe.europa.eu/etias_en, nooit op de
  betaalde "ETIAS application"-sites.
- `EUR_USD_FALLBACK` — de terugvalkoers. De pagina's halen dagelijks de
  ECB-koers via frankfurter.app (3 seconden timeout, gelogd als hij wegvalt);
  faalt dat, dan staat de fallback er mét zijn datum. Werk de fallback bij als
  je het bestand aanraakt.
- `GATEWAYS` — de tien Amerikaanse vertrekluchthavens met totale reistijd en
  wie de oceaanpoot vliegt. Dit is "waar je moet kijken", geen dienstregeling;
  de tekst zegt dat ook.

## Wat jij moet doen

### 1. Affiliate-netwerken die Amerikanen gebruiken (aanvragen)

We hebben nu ClubTickets, Click&Boat en Wiber. Voor het Amerikaanse publiek
ontbreken de platforms waar zij al een account hebben:

| Netwerk | Waarvoor | Aanmelden | Let op |
| --- | --- | --- | --- |
| **Viator** (Tripadvisor) | tours, boottochten, VIP-ervaringen; marktleider in de VS | viator.com/partner (Viator Partner Program, via Partnerize) | Eigen aanbod dáár listen als operator kán botsen met onze affiliate-afspraken met Click&Boat/ClubTickets — eerst navragen bij beide partners. |
| **GetYourGuide** | excursies, ferrytickets | partner.getyourguide.com | Idem. |
| **Booking.com** | hotels — we hebben nu geen hotelpartner en de itinerary noemt bewust geen hotels | booking.com/affiliate-program | Pas dan mogen er hotelnamen met links op de itinerary. |
| **DiscoverCars** | huurauto-vergelijker, populair bij Amerikanen | discovercars.com/affiliate | Concurreert met Wiber. Alleen inzetten waar Wiber niet levert (bv. one-way, andere eilanden), anders verwater je je eigen partner. |

Zodra een account bestaat: de deeplinks komen in de pagina via
`<AffiliateLink>` (hardcodeert `rel="sponsored"` en de zichtbare disclosure).
Nooit een kale `<a>`, nooit partnerteksten kopiëren, nooit een impressiepixel
server-side renderen. Tot een account bestaat, staat er géén link naar dat
platform: een link naar Viator zonder affiliate-ID is gratis verkeer weggeven.

### 2. Google Business Profile en Bing Places

Zet in de omschrijving één zin voor dit publiek: *"Popular with US travelers;
we book in English over WhatsApp and quote in euros with a dollar estimate."*
Bing Places is hier extra belangrijk: ChatGPT zoekt via Bing, en Amerikanen
gebruiken ChatGPT voor reisplanning meer dan Europeanen.

### 3. Reddit en TripAdvisor-forum

De Amerikaanse Ibiza-vragen staan op r/ibiza, r/travel, r/solotravel en het
TripAdvisor Ibiza-forum: "do I need an IDP", "is the flight worth it", "Hï or
Ushuaïa". Regels uit `docs/authority-plan.md` §3 gelden onverkort. De
nonstop-aankondiging is een natuurlijk moment om te helpen ("United announced
EWR–IBZ for May 2027, not on sale yet; until then connect in Madrid").

### 4. Meten

Voeg deze vragen toe aan `scripts/ai-visibility/prompts.json` (nieuwe id's,
bestaande niet wijzigen):

```
{ "id": "us-direct-flights-en", "lang": "en", "intent": "research", "active": true, "text": "are there direct flights from the US to Ibiza" }
{ "id": "us-etias-en", "lang": "en", "intent": "research", "active": true, "text": "do US citizens need ETIAS for Ibiza" }
{ "id": "us-idp-en", "lang": "en", "intent": "research", "active": true, "text": "do I need an international driving permit to rent a car in Ibiza" }
{ "id": "us-itinerary-en", "lang": "en", "intent": "commercial", "active": true, "text": "ultimate 5 day luxury Ibiza itinerary" }
```

Draai ze mee in de maandelijkse ronde (`docs/seo/GEO-KPI.md`).

### 5. Volgend jaar, vóór 31 mei 2027

- Controleer op united.com of de vlucht in de verkoop is → `status: 'on-sale'`.
- Eerste vlucht gevlogen → `status: 'flying'`.
- ETIAS live? → `ETIAS.live = true`, `since` invullen.
- De hub en de vluchtenpagina krijgen dan elk een nieuwe `content-dates`-datum.

## Wat we bewust niet doen

- **Geen prijzen in dollars als bedrag dat wij rekenen.** Alles is een
  schatting bij een gedateerde koers; de kaart van de klant bepaalt de echte.
- **Geen hotelnamen, geen restaurantnamen met "vanaf"-prijzen.** Niet onze
  inventaris, niet te controleren. De itinerary noemt gebieden.
- **Geen "beste" VIP-tafelprijs.** Een tafel is een minimum spend per avond;
  we quoten hem per datum via WhatsApp, precies zoals op `/package-deals`.
- **Geen Brits/Amerikaans mengsel.** Deze vier pagina's schrijven "traveler",
  "license", "airplane". De rest van de site blijft Brits. Nieuwe pagina's voor
  dit publiek volgen de Amerikaanse spelling.
- **Geen vertalingen.** `ROUTE_LOCALES` staat op `['en']`; een Duitser zoekt
  geen "Ibiza für Amerikaner". De vertaalde slugs bestaan alleen zodat de
  middleware een verkeerde taalvariant naar `/en` stuurt.
