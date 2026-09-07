# Zoekplan: modifier-zoekopdrachten

Datum: 2026-09-07 · Aanleiding: "goedkoopste boottickets", "gratis gastenlijst"

## De kans, in één alinea

"Goedkoopste", "gratis", "zonder", "hoe" en "of" zijn **modifiers**. Ze plakken
aan een zoekterm en veranderen wie er kan winnen. Op de kale term
("clubtickets Ibiza") concurreer je met ClubTickets, Ticketmaster en de clubs
zelf, en die hebben meer autoriteit dan wij ooit krijgen. Op de modifier
("goedkoopste clubtickets Ibiza") concurreer je met blogs die het antwoord niet
hebben — want zij kunnen het niet meten en wij wel.

Dat is de hele strategie. Niet meer pagina's, maar **het getal in de eerste zin
op de pagina's die we al hebben.**

---

## Wat we als enige hebben

Alles hieronder komt live uit de eigen data en loopt dus nooit achter:

| Feit | Bron | Nu |
|---|---|---|
| Goedkoopste clubticket in de agenda | `price-stats.ts` | **€15** |
| Mediaan clubticket | idem | €32 |
| Middelste helft van alle avonden | idem | €25–48 |
| Aantal gedateerde events achter dat cijfer | idem | 302, over 12 clubs |
| Goedkoopste overtocht naar Formentera | idem | **€22** (mediaan €24, uit 199) |
| Goedkoopste boot per dag | `fleet.ts` → `lowestDayRate()` | **€680** |
| Boten onder €1000 / €1500 per dag | `fleet-stats.ts` | 6 / 22 |
| Aangekondigde closing parties | `season-stats.ts` | 25, met datum |

Een reisblog schrijft "vanaf ongeveer €25". Wij schrijven "de goedkoopste van
302 gedateerde avonden is €15, de mediaan €32, en de helft zit tussen €25 en
€48". Dat tweede is wat een antwoordmachine citeert, omdat het telbaar is en
een bron heeft.

**De regel eronder:** elk getal wordt afgeleid, nooit overgetypt. Een
overgetypt cijfer is binnen een seizoen onwaar en blijft dan jaren staan.

---

## Vijf families, met wat er al staat

### 1. "Goedkoopste" / cheapest / prijs

| Zoekterm | Draagt nu | Actie |
|---|---|---|
| goedkoopste clubtickets Ibiza | `/ibiza-prices` | **Lead herschrijven** met het €15-cijfer in zin 1 |
| wat kost een avond uit Ibiza | `/ibiza-prices` | Staat er ✅ |
| goedkoopste boot huren Ibiza | `/boats` | **Sectie**: de zes boten onder €1000, uit `fleet.ts` |
| goedkoopste ferry Ibiza Formentera | `/ferry-formentera` | Staat er sinds #33 ✅ |
| goedkoopste maand Ibiza | `/ibiza-season` | **Sectie**: prijs per maand uit de agenda |
| Ibiza op budget / cheap Ibiza | — | **Nieuwe pagina**, zie build-volgorde |

De belangrijkste ingreep is de kleinste: `/ibiza-prices` heeft het antwoord al,
maar de titel en de lead zeggen "wat kost een avond uit" in plaats van
"goedkoopste". Eén zin toevoegen wint een hele familie.

### 2. "Gratis" / free

Hier ligt de grootste kans **en** het grootste risico.

`/guestlist` zegt al eerlijk dat de gastenlijst niet standaard gratis toegang
betekent: het is vrije entree vóór een tijdstip, een lagere deurprijs, of een
snellere rij, en welke van de drie hangt af van de club en de avond.

Dat is precies waarom we op "is de Ibiza gastenlijst gratis" kunnen winnen. Het
internet staat vol pagina's die "ja, gratis!" roepen om de klik te vangen, en de
bezoeker die dat gelooft staat aan de deur te betalen. Google en de
antwoordmachines belonen op dit soort vragen de bron die de misvatting oplóst,
niet degene die hem herhaalt.

| Zoekterm | Actie |
|---|---|
| is de gastenlijst gratis Ibiza | `/guestlist`: het antwoord staat er, maar niet als H2. **Eigen sectie met die vraag als kop** |
| gratis entree Ibiza clubs | Zelfde sectie, met de eerlijke uitsplitsing van de drie vormen |
| gratis dingen doen op Ibiza | **Nieuwe sectie op `/tips`**: stranden, zonsondergang, oude stad, markten |
| gratis inschrijven gastenlijst | Klopt wél en staat er ✅ |

**Wat we hier nooit doen:** "gratis" in een titel zetten waar het niet klopt.
Dat levert één seizoen klikken op en daarna een reputatie.

### 3. "Zonder" / without

| Zoekterm | Draagt nu |
|---|---|
| boot huren zonder vaarbewijs | Vijf talen ✅ (#40) |
| jetski zonder vaarbewijs | Vijf talen ✅ (#39) |
| Ibiza zonder auto | `/getting-around-ibiza` — **sectie toevoegen** |
| clubs zonder lange rij | `/ibiza-club-tickets` — al beantwoord in de FAQ, **naar een H2 tillen** |

Deze familie is bijna af, en dat is geen toeval: het zijn de vragen waar een
wettelijke of praktische grens achter zit, en die hebben we al moeten uitleggen.

### 4. "Hoe" / how

| Zoekterm | Draagt nu |
|---|---|
| hoe kom je op de gastenlijst Ibiza | `/guestlist` ✅ |
| hoe koop je clubtickets zonder opgelicht te worden | `/nl/ibiza-clubtickets` ✅ (#38) |
| hoe laat gaan clubs open Ibiza | `/ibiza-nightlife` ✅ (#32) |
| hoe kom ik van de luchthaven naar mijn hotel | `/ibiza-airport-transfer` ✅ (#31) |
| hoe kom ik bij Es Vedrà | `/locations/es-vedra` ✅ (#36) |

Klaar. Deze familie is in de laatste ronden vanzelf ingevuld.

### 5. "Of" / vergelijkingen

De minst bewerkte familie, en commercieel interessant: iemand die twee dingen
vergelijkt staat vlak voor de boeking.

| Zoekterm | Actie |
|---|---|
| Pacha of Amnesia | Wacht op het clubakkoord — de pagina's liggen klaar |
| ferry of privéboot naar Formentera | **Sectie op `/ferry-formentera`**, met de €22 naast een charterdagprijs |
| Hï of UNVRS | **Sectie op `/ibiza-nightlife`** |
| boot met of zonder schipper | Beide pagina's bestaan in vijf talen; **een vergelijkblok op `/boats`** |
| Ibiza of Mallorca | Niet doen. Geen eigen aanbod op Mallorca, dus geen eerlijk antwoord |

---

## Build-volgorde

Op opbrengst gedeeld door moeite. De eerste vier zijn secties op bestaande
pagina's — geen nieuwe URL's, dus geen cannibalisatierisico.

1. ~~**`/ibiza-prices`: "goedkoopste" in titel en lead.**~~ **Gedaan (07-09).**
   De lead opent nu met "Het goedkoopste clubticket op Ibiza kost €15, en 58%
   van alle clubavonden kost minder dan €40" in vijf talen; het meetvenster is
   naar achteren verhuisd. Titel werd `Ibiza Club Prices 2026 — Cheapest
   Tickets`, meta description opent met hetzelfde cijfer (en is daarmee ook uit
   de baseline: hij stond op 139 tekens, één onder de ondergrens). Nieuw: een
   eigen H2 "Wat is het goedkoopste clubticket op Ibiza?" direct onder het
   antwoord, met de club achter het laagste bedrag (O Beach Ibiza, €15), de
   drie goedkoopste clubs op mediaan (Playa Soleil €20, Es Paradis €25, O Beach
   €25) en een link naar `/guestlist`. Alles afgeleid uit `price-stats.ts` —
   `cheapestTicketVenue()` en `cheapestByMedian()` — dus geen overgetypt getal.
   Plus een FAQ "Kun je gratis een club in op Ibiza?".
2. ~~**`/guestlist`: "Is de gastenlijst gratis?" als eigen H2.**~~ **Gedaan
   (07-09).** De vraag staat nu letterlijk als H2 direct onder de hero, met het
   antwoord in de eerste zin ("Aanmelden is gratis, altijd. Vrije entree is dat
   niet") en de drie uitkomsten als genummerde items ernaast. Eronder wat je
   zónder plek op de lijst betaalt — €32 doorgaans, €15 het goedkoopste ticket,
   uit dezelfde telling als `/ibiza-prices` — met een link daarheen. Titel werd
   `Ibiza Club Guestlist — Free Sign-Up`. De FAQ-variant blijft staan: die voedt
   de JSON-LD en is korter.
3. ~~**`/boats`: de zes boten onder €1000.**~~ **Gedaan (07-09).** Eigen H2
   "Welke boot kun je op Ibiza huren voor minder dan €1000 per dag?" met de
   zes boten in een tabel: model, gasten, haven, laagseizoensband en de
   juli/augustus-band ernaast, elk gelinkt aan zijn dossier. De lead noemt de
   goedkoopste met naam en bedrag (Monterey 224 FS Ironman, €680 laag / €780
   hoog, 7 gasten, Marina Botafoc). Eén component `CheapBoats` voor vijf talen —
   het aantal, de lijst, het gastenbereik en de havens komen uit `FLEET`, dus
   er staat geen overgetypt getal in. Onder de drie boten rendert het blok
   niets. Bewust géén eigen FAQ-schema: `/boats` zendt er al één uit via de
   verhuurgids, en twee `FAQPage` op één URL is een conflict.
4. **`/ibiza-season`: prijs per maand.** De agenda kent de prijzen én de datums,
   dus "wanneer is Ibiza het goedkoopst" is een optelsom die niemand anders kan
   maken.
5. **`/tips`: gratis dingen doen.** Informatief, geen commerciële concurrentie,
   en het trekt de zomerbezoeker die nog niets geboekt heeft.
6. **Vergelijkblokken** op `/ferry-formentera`, `/ibiza-nightlife` en `/boats`.
7. **Eén nieuwe pagina: `/ibiza-on-a-budget`.** Pas hierna, en alleen als de
   secties hierboven laten zien dat de vraag er is. Die pagina bundelt wat er
   dan al staat en linkt door — een hub, geen concurrent van de onderdelen.

Een nieuwe URL komt er dus pas op plek zeven. Dat is met opzet: elke keer dat
hier een pagina náást een bestaande route is gezet, splitsten ze elkaars links.

---

## Per taal

De modifier vertaalt niet één op één, en dat is precies waar de winst zit —
niemand optimaliseert hierop.

| NL | DE | ES | FR |
|---|---|---|---|
| goedkoopste clubtickets Ibiza | Ibiza Tickets günstig | entradas discotecas Ibiza baratas | billets clubs Ibiza pas cher |
| is de gastenlijst gratis | Ibiza Gästeliste kostenlos | lista gratis discotecas Ibiza | guestlist Ibiza gratuite |
| boot huren Ibiza zonder vaarbewijs | Boot mieten ohne Führerschein | barco sin titulación Ibiza | bateau sans permis Ibiza |
| goedkoopste maand Ibiza | günstigste Zeit Ibiza | mes más barato Ibiza | Ibiza moins cher quelle période |

De pagina's die deze modifiers moeten dragen staan al in vijf talen. De secties
uit de build-volgorde krijgen ze dus per taal mee — niet als vertaling maar met
dezelfde afgeleide cijfers, want die zijn taalonafhankelijk.

---

## Meten

Niet op ranking maar op twee dingen die iets zeggen:

1. **Search Console**, gefilterd op query's die een modifier bevatten
   (`goedkoop`, `gratis`, `zonder`, `hoe`, `of`). Vertoningen zonder klikken op
   zo'n query betekent: we ranken maar de titel geeft het antwoord niet.
2. **`scripts/ai-visibility/prompts.json`.** Daar staan 36 vaste vragen in; drie
   ervan zijn al modifier-vragen (`guestlist-free-en`, `scam-tickets-en`,
   `clubtickets-price-en`). Voeg er bij de volgende ronde vier toe:
   goedkoopste ticket, goedkoopste boot, gratis dingen doen, goedkoopste maand.

De nulmeting daarvan is nog steeds niet gedaan (`results.csv` is leeg). Dat is
de eerste stap, want zonder beginwaarde zegt de tweede meting niets.

---

## De regel die dit plan draagt

Elke claim in deze families is een prijsclaim, en prijsclaims zijn hier al een
keer misgegaan: `/ibiza-prices` publiceerde maandenlang "ferry naar Formentera
vanaf €5", wat in werkelijkheid een strandpendel binnen Ibiza was.

Dus: **een modifier-claim mag alleen op een afgeleid cijfer staan.** Geen
"vanaf ongeveer", geen overgetypt bedrag, en geen "gratis" waar het niet klopt.
Valt het cijfer weg, dan valt de zin weg — niet het gat tonen, maar de bewering
intrekken. Dat is exact hoe `<MeasuredCrossingPrices>` en `getFleetStats()` het
al doen, en het is de reden dat we deze zoektermen überhaupt kunnen claimen.
