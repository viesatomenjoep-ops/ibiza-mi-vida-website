# Night report — 2026-09-07

Branch: `claude/ibiza-mi-vida-adjustments-tap8rv`
Audit: `docs/seo/AUDIT.md` · Voortgang: `docs/seo/PROGRESS.md` · Blokkades: `docs/seo/BLOCKERS.md`

---

## De korte versie

Het nachtplan ging uit van een kale Next.js-site. Deze repo is dat niet. Van de
28 doelpagina's bestonden er 24 al, meestal op een andere URL dan het plan
aannam, en de infrastructuur die het plan wilde bouwen (metadata-helpers,
JSON-LD-builders, sitemap met hreflang, event- en artiestenpagina's) staat er al
in een strengere vorm.

Dus is de run niet uitgevoerd zoals hij op papier stond. Wat er wél is gebeurd:
de vier pagina's die echt ontbraken zijn geschreven, één site-brede fout is
opgeruimd, en er is vastgelegd wat er niet gebouwd is en waarom — zodat de
volgende run niet opnieuw op dezelfde muur loopt.

**Zes van de acht fasen zouden, letterlijk uitgevoerd, de site schade hebben
gedaan.** Dat is geen kritiek op het plan maar op de aanname eronder. De
volledige redenering staat in `AUDIT.md` onder "Conflicten".

---

## Wat er nieuw is

### Vier pagina's

| Route | Waarom die er nog niet was | Status |
|---|---|---|
| `/en/pacha-ibiza` | Pacha staat niet in de ClubTickets-feed | geschreven, **404't** |
| `/en/amnesia-ibiza` | Amnesia staat niet in de ClubTickets-feed | geschreven, **404't** |
| `/en/dc10-ibiza` | DC-10 staat niet in de feed, en verkoopt in 2026 alleen via DICE | geschreven, **404't** |
| `/en/ibiza-airport-transfer` | Geen route, geen data, geen partner | **live** |

### De drie clubpagina's staan nog uit

Pacha, Amnesia en DC-10 komen later dit jaar, maar het akkoord daarvoor loopt
nog. De pagina's zijn volledig geschreven en staan in de repo, maar 404'en tot
dat rond is: de vlag staat in `src/lib/pending-venues.ts`, ze staan in geen
sitemap, niet in `llms.txt`, en er linkt niets naartoe.

Wachten in plaats van publiceren, om één reden. De huidige tekst zégt stellig
dat we voor deze drie geen tickets verkopen — dat is vandaag waar, en het is
precies wat er bij het akkoord verandert. Een claim die eenmaal geïndexeerd en
door een antwoordmachine geciteerd is, haal je niet terug door de pagina te
wijzigen; die blijft nog maanden rondgaan. Een pagina die nog niet bestaat heeft
dat probleem niet.

**Publiceren doe je zo:** zet de slug in `pending-venues.ts` op `true`, en in
dezelfde commit: herlees de copy (staat de club inmiddels in de feed, dan moeten
de "wij verkopen hier geen tickets"-passages eruit en komt er een
`<AffiliateLink>` voor in de plaats), zet de `RouteKey` terug in
`LOCALIZED_ROUTES` in `src/app/sitemap.ts`, voeg de pagina toe aan
`src/app/llms.txt/route.ts`, zet de interne links terug, en werk de datum bij in
`content-dates.ts`. Het volledige lijstje staat in `pending-venues.ts` zelf.
Alleen de vlag omzetten is niet genoeg: een pagina zonder sitemap-vermelding en
zonder interne links wordt niet gevonden.

De feed bevat 42 venues waarvan 15 clubbing. Pacha, Amnesia en DC-10 komen er
alle drie in het geheel niet in voor — niet als venue, niet als event. Terwijl
het tot de meest gezochte clubnamen van het eiland hoort. Dat is precies een
gat: veel vraag, en wij hadden er niets tegenover staan.

Zolang ze niet in de feed staan dragen ze **geen boekknop en geen ticketclaim**,
en dat staat in de eerste alinea in plaats van in een voetnoot. Bij DC-10 stapelt het: voorverkoop
loopt in 2026 uitsluitend via DICE, dus daar kan geen enkele wederverkoper iets
leveren en de pagina zegt dat ook over derden. Wat er wél is, is Simon — via een
server-gerenderde `<a href>` naar WhatsApp, zodat een crawler zonder JavaScript
en een agent die de pagina leest allebei de route zien.

`/en/ibiza-airport-transfer` is bewust een beslispagina zonder tarieven (zie
`[[VERIFY]]` hieronder).

### Eén site-brede fout weg

`<meta name="keywords">` stond in `src/app/[locale]/layout.tsx` met veertien
termen, en dus op alle 76 pagina's. Google negeert de tag sinds 2009 — dat is de
onschuldige helft. De schadelijke helft: dezelfde veertien termen, 'Pacha' en
'Amnesia' incluis, op pagina's die daar niet over gaan, vertellen elke parser
die per pagina een onderwerp probeert vast te stellen dat de hele site over
hetzelfde gaat.

### Eén redirect erbij

`ibizamivida.es` en `www.ibizamivida.es` doen nu een 308 naar
`www.ibizamivida.com` met behoud van het pad. Ze kregen tot nu toe alleen de
noindex-header: dat houdt het domein uit de index, maar laat een bezoeker op een
dood spoor staan en geeft de linkwaarde aan niemand door. Dit is een **vangnet**
— het nette adres is een redirect-domein in Vercel, zie human-taak 1.

### Documentatie

`docs/seo/AUDIT.md`, `PROGRESS.md`, `WRITING-RULES.md`, `REDIRECTS.md`,
`GEO-KPI.md`, `BLOCKERS.md`, dit bestand, plus een sectie "SEO & GEO-conventies"
in `CLAUDE.md`.

### Meetsysteem uitgebreid

Er stond al een AI-zichtbaarheidssysteem in de repo
(`scripts/ai-visibility/prompts.json` + `results.csv` + `npm run ai-report`),
dat nog nooit gedraaid heeft. De promptset is van 20 naar 36 vragen gegaan: er
was geen enkele Spaanse of Franse vraag, en niets voor de nieuwe clubgidsen,
VIP-tafels, zonsondergangtochten, Es Vedrà of luchthavenvervoer.

---

## Wat er bewust NIET gebouwd is

**1. De vier losse bootpagina's** (`private-yacht-ibiza`, `ibiza-yacht-charter`,
`ibiza-boat-rental`, `private-boat-ibiza`). Dat zijn vier formuleringen van één
zoekintentie die `/boats` al draagt. `/boat-rental-ibiza` en zijn vier
vertalingen zijn in augustus juist ín `/boats` opgegaan, met 308's, precies
omdat twee eigen URL's op dezelfde query elkaars links splitsen. Deze vier
zouden die consolidatie in één commit terugdraaien.

**2. Een catch-all `[slug]`-route.** Naast 76 bestaande routes is dat een
permanente kans op schaduwing, voor niets: het bestaande patroon
(`HubSections` + `SchemaMarkup` + `route-slugs.ts`) is expliciet en werkt.

**3. Een tweede `lib/seo/`-laag.** `src/lib/seo.ts` en `SchemaMarkup` doen dit
al, en `SchemaMarkup` bestaat juist om negen losse JSON-LD-componenten op te
ruimen.

**4. `content/seo/<locale>/*.json` en de `[[TRANSLATE]]`-kopieën.** Een derde
contentlaag voor vier pagina's kost meer dan het oplevert, en 4×4 vertaalde
URL's die als Engelse duplicaten renderen is een hreflang-cluster naar niets.

**5. Een hardgecodeerde `AggregateRating` van 5.0 uit 10 reviews.** Dat mág hier
niet: reviewcijfers komen uitsluitend live uit het Google Bedrijfsprofiel. Een
hardgecodeerde rating heeft hier al eens live gestaan en is een overtreding van
Google's spambeleid. Zie human-taak 3.

**6. Een tweede GEO-CSV.** Zie hierboven — het systeem bestond al.

---

## `[[VERIFY]]` — voor Tom en Simon

Geen van deze onzekerheden staat als bewering op de site. Ze zijn weggeschreven
in neutrale formuleringen, en de pagina wordt sterker zodra het cijfer er is.

### `/en/ibiza-airport-transfer`
- **Taxitarief luchthaven → Ibiza-stad, Playa d'en Bossa, San Antonio, Santa
  Eulalia.** Inclusief nacht- en bagagetoeslag. Zonder deze vier wordt er geen
  `PriceTable` gerenderd.
- **Buslijnnummers en seizoensdienstregeling** (luchthaven ↔ Ibiza-stad
  jaarrond; luchthaven ↔ San Antonio in het seizoen). Vooral: het láátste
  vertrek van de dag, want dat is wat er bij een late landing toe doet.
- **Rideshare-dekking.** De pagina zegt nu "beperkt en seizoensgebonden, reken
  er niet op". Klopt dat voor 2026?
- **Prijs van een privé-transfer via ons**, per groepsgrootte.

### `/en/dc10-ibiza`
- **Bevestig dat voorverkoop in 2026 uitsluitend via DICE loopt.** De pagina
  zegt dit stellig en zegt er bovendien bij dat elke andere aanbieder geen
  geldig ticket verkoopt. Klopt het niet, dan moet dat er meteen af.
- Openingstijd van de maandagmiddag.
- Geldt er een minimumleeftijd of deurbeleid dat afwijkt van 18+?

### `/en/pacha-ibiza`
- **Winterprogrammering 2026/2027** — de pagina zegt dat Pacha buiten het
  seizoen doorprogrammeert, dunner dan in de zomer. Nog steeds zo?
- Loopt Flower Power in 2026?

### `/en/amnesia-ibiza`
- Draaien de Terrace en de Club Room in 2026 nog beide, elke nacht?
- **Discobus:** rijdt die, op welke nachten, en vanaf waar? De pagina noemt hem
  als een van drie werkbare manieren om terug te komen.
- Foam-avonden in 2026?

De `[[VERIFY]]`-punten voor Pacha, Amnesia en DC-10 hieronder zijn niet urgent
zolang die pagina's 404'en, maar ze moeten wél af vóór publicatie.

### Merkbreed
- **UNVRS "DJ Mag #1 2026"** — niet gebruikt, nergens. Alleen opnemen als het
  officieel bevestigd is. (Hï Ibiza #1 2022–2025 is wél bevestigd en staat er.)
- ~~**Ferry Ibiza–Formentera "vanaf ~€29"**~~ — **opgelost, en anders dan
  verwacht.** Het getal hoefde niet bevestigd te worden: de agenda bevat 199
  gedateerde overtochten mét prijs, en die meten €22 als goedkoopste en €24 als
  mediaan. Dat staat nu op `/ferry-formentera` en op `/ibiza-prices`.

  Onderweg kwam er een live fout boven water. `/ibiza-prices` publiceerde
  "Ferry naar Formentera — mediaan €22 · vanaf €5", in vijf talen. Die €5 was de
  Aquabus "Beach City Boat" van Ibiza-stad naar Playa d'en Bossa: een
  strandpendel binnen Ibiza, geen overtocht. Het venue-type
  `formentera-day-trip` is de categorie van de rederijen, niet van hun routes,
  en drie van de vijf operators varen ook lijnen die niets met Formentera te
  maken hebben (Cala Salada vanaf €7, Es Canar vanaf €9). Van de 434 gedateerde
  afvaarten in die categorie zijn er 199 een echte overtocht. `price-stats.ts`
  filtert er nu op.

---

## Human-taken

| # | Taak | Waar |
|---|---|---|
| 1 | **Vercel:** zet `ibizamivida.es`, `www.ibizamivida.es` en het kale `ibizamivida.com` als redirect-domeinen naar `www.ibizamivida.com`, mét padbehoud. De middleware vangt het nu al af, maar een redirect op domeinniveau scheelt een hop. | Vercel → Settings → Domains |
| 2 | **Controleer `NEXT_PUBLIC_SITE_URL`** — moet exact `https://www.ibizamivida.com` zijn, mét `www`. Staat hij op het kale domein, dan krijgt élke pagina `noindex` mee zonder dat er iets kapot lijkt. Test: `curl -sI https://www.ibizamivida.com/en \| grep -i x-robots-tag` | Vercel → Environment Variables |
| 3 | **`GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID`** in Vercel. Zonder die twee rendert er nérgens een reviewcijfer of reviewtekst — niet in de header, niet in de hero, niet in de footer, niet op `/about-us`, en geen `Review`/`AggregateRating`-schema. "De reviews staan er niet" is bijna altijd dit. De `GOOGLE_PLACE_ID` is de `ChIJ…`-vorm, níét het `0x…:0x…`-nummer en níét de CID uit een Maps-URL. Vindt de Place ID Finder het profiel niet — dat gebeurt bij een service-area bedrijf zonder straatadres — draai dan `GOOGLE_PLACES_API_KEY=AIza… npm run find-place-id "Ibiza Mi Vida"`: die vraagt het aan dezelfde API die de site gebruikt, en die kent het profiel wél. Staat alles, dan zegt `https://www.ibizamivida.com/api/diagnose-reviews` of het werkt. | Vercel |
| 4 | **Google Search Console** domain-property aanmelden als kale `ibizamivida.com` (zonder scheme, zonder www) via DNS-TXT, daarna de sitemap indienen. Voer je de volledige URL in, dan krijg je een URL-prefix-property die non-www mist. | `docs/search-setup.md` |
| 5 | **GA4** measurement-ID in `NEXT_PUBLIC_GA_ID`. | Vercel |
| 6 | **Bing Webmaster Tools** — `BING_SITE_VERIFICATION` in Vercel. En: **genereer daar nooit een nieuwe IndexNow-sleutel.** Die staat op drie plekken die moeten matchen (`public/<key>.txt`, `KEY` in `scripts/indexnow-ping.mjs`, het Bing-dashboard) en een nieuwe breekt de andere twee stil. | Vercel + Bing |
| 7 | **Google Bedrijfsprofiel** claimen als "Ibiza Mi Vida", met dezelfde NAP als op de site (naam + WhatsApp +33 6 66 52 84 12). Dit is ook wat taak 3 voedt. | Google |
| 8 | **`.eslintrc.json` toevoegen** — `npm run lint` valt nu terug op een interactieve wizard omdat er geen ESLint-config in de repo staat. Aparte commit waard. | `BLOCKERS.md` |
| 9 | **Nulmeting AI-zichtbaarheid.** `scripts/ai-visibility/results.csv` is leeg; het systeem heeft nog nooit gedraaid. 36 vragen × 4 engines, ongeveer een uur. | `docs/seo/GEO-KPI.md` |
| 10 | **De `[[VERIFY]]`-lijst hierboven invullen** — vooral de DC-10/DICE-bevestiging, want die claim is stellig geformuleerd. | Dit bestand |
| 11 | **Reviewwerving.** Zolang taak 3 en 7 niet rond zijn levert dit niets zichtbaars op, dus in die volgorde. WhatsApp-sjabloon hieronder. | Simon |
| 12 | **Akkoord Pacha / Amnesia / DC-10 rond melden**, dan de drie pagina's publiceren volgens het stappenplan in `src/lib/pending-venues.ts`. Geef er per club bij door of ze in de ClubTickets-feed komen — dat bepaalt of de copy herschreven moet worden. | `pending-venues.ts` |
| 13 | **Slugs aanleveren** voor de extra clubs en partners die nog toegevoegd moeten worden — met per stuk: staat de venue in de ClubTickets-feed? Dat bepaalt of het een verkooppagina wordt of een gids. | Tom |

### WhatsApp-sjabloon voor reviewwerving (taak 11)

> Hoi [naam], leuk dat je bij ons geboekt hebt — hoe was het?
> Als het goed bevallen is: een korte Google-review helpt ons enorm, en het is
> letterlijk één minuut werk. [link naar het Bedrijfsprofiel]
> En als er iets níét goed ging, hoor ik dat liever eerst van jou.
> — Simon

Stuur hem één keer, één tot twee dagen na afloop. Niet herinneren.

---

## Volgende run

1. **De drie clubpagina's publiceren** zodra het akkoord rond is — dat is de
   grootste enkele winst die klaarligt, want de zoekvraag op die namen is er al.
2. **`[[VERIFY]]`-lijst verwerken.** De vier nieuwe pagina's worden er meetbaar
   sterker van: een luchthavenpagina met echte tarieven is een andere pagina dan
   een zonder.
3. **Vertaalronde nl/de/es/fr** voor de vier nieuwe pagina's. Lokalisatie op
   zoekintentie, geen letterlijke vertaling. Een taal komt pas in
   `ROUTE_LOCALES` als de pagina echt rendert — nooit ervoor.
4. **Nulmeting AI-zichtbaarheid** (taak 9), daarna maandelijks.
5. **CTR-ronde op Search Console-data**: pagina's met veel vertoningen en weinig
   klikken hebben een titelprobleem, geen rankingprobleem. Ushuaïa had 102
   queries en nul klikken voordat `venue-meta.ts` de snippet ging opbouwen uit
   de live agenda — dat patroon zit er waarschijnlijk vaker in.
6. **Pas als 1 t/m 5 rond zijn:** overwegen of `/en/ibiza-nightlife` en
   `/en/things-to-do-ibiza` iets toevoegen. Nu niet: `/clubs`, `/calendar`,
   `/tips`, `/activities` en `/tours` dekken die intenties al, en er een pillar
   bovenop zetten zonder de bestaande pagina's in dezelfde commit te hertitelen
   is exact de fout die hier al vier keer eerder is gemaakt.

## Controle

```
npx tsc --noEmit      schoon
npm run build         schoon, alle vier de nieuwe routes renderen
npm run check:seo     PASS — ssr, schema, hreflang, onpage, files
                      214 pagina's, 0 fouten, baseline niet gegroeid
npm run lint          niet draaibaar (zie BLOCKERS.md)
```

Handmatig geverifieerd tegen `next start`: `/en/ibiza-airport-transfer` geeft
200 en staat in de sitemap; `/en/{pacha,amnesia,dc10}-ibiza` geven 404 en komen
in sitemap noch `llms.txt` voor; `/nl/ibiza-luchthaven-transfer` geeft 301 naar
de Engelse versie; `Host: ibizamivida.es` geeft 308 naar `www.ibizamivida.com` met
behoud van het pad; de canonieke host blijft 200; `name="keywords"` staat nergens
meer in de HTML.
