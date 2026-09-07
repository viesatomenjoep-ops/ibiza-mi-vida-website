# Sluglijst fase F en H1 — per slug een besluit

Datum: 2026-09-07

Elke slug uit fase F en H1 van het nachtplan, met één van drie uitkomsten:

- **BOUWEN** — geen bestaande route draagt deze intentie
- **UITBREIDEN** — de intentie zit al op een bestaande URL; daar schrijven, niet ernaast
- **VERVALT** — de pagina bestaat al, of zou een tweede eigen URL op dezelfde query zijn

De maatstaf is de regel uit `CLAUDE.md`: *één URL draagt één zoekintentie*.
Twee eigen URL's op dezelfde query splitsen elkaars links en Google kiest er één,
meestal niet degene die je wilde. Dat is hier al vier keer eerder misgegaan.

**Uitkomst: 3 bouwen, 9 uitbreiden, 30 vervallen.**

---

## F1 — Venue-landingspagina's (12 slugs)

`unvrs-ibiza · eden-ibiza · es-paradis-ibiza · o-beach-ibiza · ibiza-rocks ·
chinois-ibiza · lio-ibiza · 528-ibiza · bambuku-ibiza · teatro-pereyra-ibiza ·
baloo-ibiza · playa-soleil-ibiza`

**Alle twaalf: VERVALT.**

Alle twaalf staan in de ClubTickets-feed en hebben dus al een pagina op
`/club-tickets/<slug>`, met live line-up, prijzen per avond, `EventSchema` per
datum en een snippet die uit de agenda wordt opgebouwd. Een tweede URL per club
op een keyword-slug zou daar tegenaan concurreren met minder inhoud en zonder
live data — de slechtste helft wint dan soms, en dat is de helft die niet weet
wie er vanavond draait.

**In plaats daarvan (UITBREIDEN):** het venue-template zelf verrijken met
redactionele inhoud per club — gebied, karakter, deurbeleid, hoe je er komt.
Dat is precies wat de twaalf losse pagina's zouden hebben toegevoegd, maar dan
op de URL die de rankings al heeft. `src/lib/club-history.ts` is daarvoor de
plek.

## F2 — VIP-subpagina's (5 slugs)

`hi-ibiza-vip-table · ushuaia-vip-table · pacha-vip-table · unvrs-vip-table ·
amnesia-vip-table`

**Alle vijf: VERVALT.**

Twee redenen die stapelen. `/package-deals` en `/guestlist` dragen deze intentie
al, samen ruim 750 regels. En belangrijker: we publiceren geen minimum spends,
omdat een tafel een minimum spend is en geen ticketprijs — die beweegt met de
zaal, de avond en de act, en elk getal dat we hier drukken is binnen een week
onwaar. Vijf pagina's die alle vijf "vanaf-bedragen op aanvraag" zeggen zijn
vijf keer dezelfde dunne pagina.

Pacha en Amnesia zouden bovendien afhangen van clubs die nu nog niet rond zijn.

**In plaats daarvan (UITBREIDEN):** één sectie per club op `/package-deals` —
waar de tafels liggen, wat inbegrepen is, hoe reserveren werkt. Eén URL, vijf
antwoorden, geen enkele dubbele.

## F3 — Boot en Formentera (12 slugs)

| Slug | Besluit | Waarom |
|---|---|---|
| `ibiza-boat-party` | **VERVALT** | `/boat-party` bestaat met eigen copy, FAQ en Service-schema. Staat zo ook al in `route-slugs.ts` genoteerd |
| `luxury-yacht-ibiza` | **VERVALT** | Formulering van `/private-boat-charters` |
| `ibiza-day-charter` | **VERVALT** | Formulering van `/boats` |
| `catamaran-ibiza` | **VERVALT** | Geen aparte catamaran-categorie in `fleet.ts`; zou een pagina zijn over een filter dat niet bestaat |
| `es-vedra-boat-trip` | **UITBREIDEN** | `/locations/es-vedra` bestaat én `sailing-routes.ts` kent Es Vedrà als stop. De boot-invalshoek hoort daar en op `/boat-trip` |
| `cala-bassa-boat-trip` | **UITBREIDEN** | `/locations/cala-comte` en de baaien staan in `sailing-routes.ts`; koppelen, niet dupliceren |
| `cala-comte-boat` | **UITBREIDEN** | Idem — `/locations/cala-comte` |
| `west-coast-ibiza-boat` | **VERVALT** | Vier windstreek-pagina's over "huur een boot en vaar naar een baai" zijn vier keer dezelfde pagina |
| `north-coast-ibiza-boat` | **VERVALT** | Idem. `/locations/benirras` en `/locations/portinatx` dragen de baaien zelf |
| `san-antonio-boat-trip` | **VERVALT** | `/locations/san-antonio` bestaat |
| `formentera-beaches` | **VERVALT** | `/locations/formentera`, `/locations/ses-illetes`, `/locations/es-pujols`, `/locations/la-mola`, `/locations/es-calo` bestaan alle vijf |
| `formentera-ferry-price` | **UITBREIDEN** | Prijsvraag hoort op `/ferry-formentera`, met de gemeten cijfers uit `price-stats.ts` — niet op een eigen URL die alleen een getal draagt |

De 21 `/locations/<slug>`-pagina's dekken de bestemmingen al. `sailing-routes.ts`
kent zestien baaien met echte stopdata. Wat ontbrak was niet een pagina per
baai, maar de kóppeling — en die is er al (`route-beach-clubs.ts`).

## F4 — Activiteiten en vervoer (8 slugs)

| Slug | Besluit | Waarom |
|---|---|---|
| `ibiza-jet-ski` | **VERVALT** | `/jet-ski-rental-ibiza` bestaat, in vijf talen geregistreerd |
| `ibiza-car-rental` | **VERVALT** | `/car-rental-ibiza` bestaat, in vijf talen live |
| `ibiza-airport-transfer` | **GEBOUWD** | Stond in PR #31, is live |
| `ibiza-water-sports` | **VERVALT** | `/water-sports` bestaat |
| `ibiza-buggy-tour` | **VERVALT** | `ibiza-buggy-adventure` staat in de feed → `/activities/ibiza-buggy-adventure` |
| `can-marca-caves` | **VERVALT** | `cova-de-can-marca` staat in de feed → `/activities/cova-de-can-marca` |
| `ibiza-quad-tour` | **VERVALT** | Geen quad-aanbieder in de feed. Een pagina zonder aanbod is een doodlopende weg |
| `las-dalias-market` | **VERVALT (voorlopig)** | Niet in de feed, geen boekroute, en niet commercieel. Kan later als sectie op `/tips` of `/locations/san-juan` |

## F5 — Beachclubs individueel (7 slugs)

`o-beach-ibiza-beach-club · blue-marlin-ibiza · amante-ibiza ·
nassau-beach-club · cala-bassa-beach-club · nikki-beach-ibiza · beachouse-ibiza`

**Alle zeven: VERVALT.**

`src/lib/beach-clubs.ts` beschrijft twintig echte zaken en `/beach-clubs`
presenteert ze. `o-beach-ibiza` heeft daarnaast al een venuepagina onder
`/club-tickets/o-beach-ibiza` — daar zou een derde URL bijkomen voor dezelfde
naam.

**In plaats daarvan (UITBREIDEN):** de twintig beschrijvingen op `/beach-clubs`
zijn nu kort. Daar valt te winnen, op de URL die er al staat.

---

## H1 — Gidsen (13 slugs)

| Slug | Besluit | Waarom |
|---|---|---|
| `ibiza-club-prices` | **UITBREIDEN** | `/ibiza-prices` bestaat, 230 regels, met gemeten cijfers uit de live agenda. Een tweede prijzenpagina zou concurreren met de enige pagina op de site die echte data heeft |
| `best-time-to-visit-ibiza` | **UITBREIDEN** | `/ibiza-season` bestaat, 309 regels, met de laatste geplande avond per club uit de agenda. De "wanneer kom je"-vraag hoort daar, en de titel moet die term dragen |
| `ibiza-areas` | **UITBREIDEN** | `/locations` is de hub over 21 gebieden. Zelfde verhaal: term in de bestaande titel, geen tweede hub |
| `es-vedra-guide` | **VERVALT** | `/locations/es-vedra` bestaat |
| `how-to-buy-ibiza-tickets` | **VERVALT** | `/ibiza-club-tickets` beantwoordt dit in de lead en in drie van de acht FAQ's |
| `ibiza-for-couples` | **VERVALT** | Geen data, geen eigen aanbod. Zou een pagina met meningen zijn |
| `ibiza-vs-formentera` | **VERVALT** | Vergelijkingspagina zonder eigen invalshoek; `/ferry-formentera` en `/locations/formentera` dragen het |
| `ibiza-first-timers` | **UITBREIDEN** | `/tips` (255 regels) is dit al. Term in de titel, sectie erbij |
| `ibiza-opening-parties` | **UITBREIDEN** | Echte zoekterm, maar de data zit in `/ibiza-season` en de agenda. Een sectie daar, gevoed uit de feed |
| `ibiza-closing-parties` | **UITBREIDEN** | Idem. `/ibiza-season` heeft de laatste geplande avond per club al |
| **`ibiza-club-dress-code`** | **BOUWEN** | Geen route, geen sectie, en elke clubpagina verwijst ernaar zonder dat er iets is om naartoe te linken. Sterke zoekterm en een vraag die mensen letterlijk zo typen |
| **`getting-around-ibiza`** | **BOUWEN** | Geen route. Vult `/en/ibiza-airport-transfer` aan: die gaat over de aankomst, deze over de week erna (bus, taxi, huurauto, boot, lopen) |
| **`ibiza-nightlife`** *(uit fase E)* | **BOUWEN** | Nog steeds geen enkele URL die de bredere "hoe werkt uitgaan op Ibiza"-vraag draagt. `/clubs` is een index, `/calendar` een agenda, `/ibiza-club-tickets` gaat over prijzen. Dit is de gids die daarboven hangt en naar alle drie linkt |

---

## Wat er gebouwd wordt

1. `/en/ibiza-club-dress-code`
2. `/en/getting-around-ibiza`
3. `/en/ibiza-nightlife`

## Wat er uitgebreid wordt

Per bestaande pagina, in volgorde van opbrengst:

1. `/ibiza-season` — titel draagt "best time to visit", secties voor opening- en
   closing parties uit de feed
2. `/locations` — titel draagt "Ibiza areas"
3. `/ibiza-prices` — titel draagt "club prices"
4. `/tips` — titel draagt "first-timers"
5. `/package-deals` — sectie per club over tafels
6. `/beach-clubs` — de twintig beschrijvingen uitbouwen
7. `/ferry-formentera` — prijssectie
8. `/club-tickets/[slug]` — redactionele blok per club via `club-history.ts`
9. `/boat-trip` + `/locations/es-vedra` — de boot-invalshoek op de baaien

**Belangrijk bij elke hertiteling:** de commerciële term verhuist naar de
bestaande pagina, en er komt géén tweede pagina bij. Dat is precies andersom
dan het nachtplan voorstelde, en het is de enige volgorde die de rankings die
er al staan niet weggooit.
