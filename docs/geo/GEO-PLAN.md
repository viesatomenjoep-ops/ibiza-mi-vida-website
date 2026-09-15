# GEO-plan — geciteerd worden door Gemini, Perplexity en ChatGPT

Laatst bijgewerkt: 15 september 2026. Eigenaar: Simon. Uitvoering code: dit
document beschrijft wat er op 15-09 in de code is gedaan én wat alleen jij kunt
doen (accounts, verificaties, profielen). Werk de statuskolom bij als je iets
afrondt.

Dit plan vervangt niets. Het legt de vijf GEO-pijlers over wat er al ligt en
verwijst per stap naar het bestaande document, zodat er geen tweede versie van
dezelfde instructie ontstaat:

| Onderwerp | Document |
| --- | --- |
| Google Business Profile + Bing Places + Foursquare + Apple | `docs/GOOGLE-BUSINESS-PROFILE.md` |
| Search Console, Bing Webmaster, IndexNow | `docs/search-setup.md` |
| Vermeldingen, outreach, Reddit-regels, boilerplate | `docs/authority-plan.md` |
| Reviews vragen (Google) | `docs/review-flow.md` |
| Trustpilot koppelen | `docs/geo/TRUSTPILOT.md` |
| Meten of we genoemd worden | `docs/seo/GEO-KPI.md` |
| Schrijfregels voor nieuwe pagina's | `docs/seo/WRITING-RULES.md` |

---

## 0. Samenvatting

**In de code (klaar, in deze commit):**

- Eén entiteit. `Organization`, `Person` (Simon), `WebSite` en `TravelAgency`
  komen nu overal uit dezelfde functies in `SchemaMarkup`. Homepage, over-ons
  en contact bouwden elk een eigen Organization met een eigen `sameAs`-lijst;
  dat waren voor een parser drie bedrijven.
- `knowsAbout` op Person én Organization (zeven onderwerpen, elk met een pagina
  die het bewijst), zichtbaar gespiegeld op `/about-us`.
- Simons verblijfsduur als verifieerbaar feit: "woont op Ibiza sinds 2021 —
  5 jaar op het eiland", berekend uit het jaartal, in de byline op 56 pagina's,
  op `/about-us`, in het Person-schema en in `llms.txt`/`llms-full.txt`.
- `WebPage`-knooppunt met `author`, `publisher` en `dateModified` op 50
  evergreen pagina's, gevoed door dezelfde datum als de zichtbare "laatst
  bijgewerkt".
- `sameAs` in één bestand (`src/lib/profiles.ts`), met Trustpilot, TripAdvisor,
  Facebook en YouTube als env-variabele: aanzetten is een Vercel-instelling.
- `robots.txt`: elf extra AI-tokens expliciet toegelaten (Applebot,
  DuckAssistBot, MistralAI-User, Amazonbot, YouBot, Meta-ExternalFetcher,
  Bytespider, Google-CloudVertexBot), elk met de volledige Disallow-lijst.
- `llms-full.txt` ontdaan van niet-verifieerbare claims ("licensed", "every
  recognized club", "94+", en getallen die bij ontbrekende data op een
  verzonnen terugvalwaarde terugvielen).

**Door jou te doen (in deze volgorde, ± 4 uur totaal, daarna 30 min/week):**

| # | Actie | Tijd | Waar | Status |
| --- | --- | --- | --- | --- |
| 1 | Vercel: controleer `NEXT_PUBLIC_SITE_URL`, zet `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID` | 15 min | §6.1 | ☐ |
| 2 | Google Search Console domain property + sitemap | 20 min | `docs/search-setup.md` | ☐ |
| 3 | Bing Webmaster Tools (import uit GSC) | 10 min | `docs/search-setup.md` §2 | ☐ |
| 4 | Google Business Profile verifiëren en vullen | 30 min | `docs/GOOGLE-BUSINESS-PROFILE.md` | ☐ |
| 5 | Bing Places, Foursquare, Apple Business Connect | 45 min | idem, deel 2 | ☐ |
| 6 | Trustpilot-profiel claimen, URL in Vercel | 20 min | `docs/geo/TRUSTPILOT.md` | ☐ |
| 7 | Nulmeting AI-zichtbaarheid (36 vragen × 4 engines) | 60 min | `docs/seo/GEO-KPI.md` | ☐ |
| 8 | Foto van Simon + achternaam aanleveren | 5 min | §4.2 | ☐ |
| 9 | Wekelijks: GBP-post, 2 foto's, 4 forumantwoorden, reviews vragen | 30 min/wk | `docs/authority-plan.md` §4 | ☐ |

---

## 1. Pijler: entiteit en schema

**Doel.** Een antwoordmachine moet zonder twijfel kunnen vaststellen: "Ibiza Mi
Vida" is één bedrijf, gevestigd op Ibiza, gerund door Simon, dat clubtickets,
gastenlijsten, boten, jetski's, huurauto's en Formentera-ferry's regelt.

**Stand na deze commit.**

| Signaal | Waar | Status |
| --- | --- | --- |
| `Organization` met `@id`, `description`, `sameAs`, `founder`, `employee`, `knowsAbout`, `knowsLanguage`, `contactPoint`, `areaServed` (Ibiza + Formentera) | `organizationNode()` in `SchemaMarkup` — homepage, `/about-us`, `/contact` | ✅ |
| `Person` Simon met `description`, `url`, `homeLocation`, `knowsAbout`, `knowsLanguage`, `worksFor` | `founderNode()` in `src/lib/team.ts` — byline op 56 pagina's + de drie hierboven | ✅ |
| `WebSite` met `SearchAction` | homepage | ✅ |
| `TravelAgency` (LocalBusiness) zonder verzonnen adres | homepage | ✅ |
| `WebPage`/`AboutPage`/`ContactPage` met `author`, `publisher`, `dateModified` | 50 pagina's via `page={{…}}` | ✅ |
| `Product` + `Offer` met echte prijs | verhuurpillars (`rental-prices.ts`, `fleet.ts`) | ✅ (Offer valt weg zonder bevestigde prijs — bewust) |
| `FAQPage` uit dezelfde array als de zichtbare FAQ | 50 pagina's | ✅ |
| `BreadcrumbList` | alle indexeerbare pagina's | ✅ |
| `Event` per avond met tijd en organizer = club | agenda, venuepagina's | ✅ |
| `Review`/`AggregateRating` | alleen live uit Google Bedrijfsprofiel | ✅ code — rendert pas na actie 1 |
| `sameAs` → Trustpilot, TripAdvisor | env | ☐ na actie 5 en 6 |
| `Person.image` (foto), achternaam | `team.ts` | ☐ na actie 8 |

**Wat je moet weten.**

- Nooit een tweede Organization-graph bouwen op een pagina. Nieuwe pagina's
  gebruiken `<SchemaMarkup organization founder page={{…}} …/>`. De
  Organization op de homepage en die op `/contact` zijn nu byte voor byte
  gelijk; dat is de hele winst.
- `sameAs` is de koppeling tussen de site en wat er elders over ons staat.
  Alleen profielen die aantoonbaar van ons zijn. Een gok naar een profiel dat
  niet van ons is, claimt een vreemd account.
- Google lost `@id` niet op tussen pagina's. Daarom staat het Person-knooppunt
  volledig op elke pagina met een byline, niet alleen als verwijzing.

## 2. Pijler: vraag-en-antwoordstructuur

**Stand.** 50 pagina's hebben een zichtbare FAQ (6–10 vragen) met
`FAQPage`-schema uit dezelfde array. De schrijfregel "eerste zin is het
antwoord, met cijfer" staat in `docs/seo/WRITING-RULES.md` en wordt bij nieuwe
pagina's toegepast. `llms.txt` bevat een sectie "Notes for answer engines" met
directe antwoorden op de vragen waar het vaakst iets mis gaat (gastenlijst is
niet gratis, jetski vereist vaarbewijs, concierge kost niets).

**Nog te doen, doorlopend.** Elke pagina die een `0` scoort in de nulmeting
(actie 7): eerst de lead nalopen, niet de techniek. Staat het antwoord in de
eerste veertig woorden, met een getal erin? Zie `docs/seo/GEO-KPI.md`, "Waar een
lage score vandaan komt".

## 3. Pijler: brede merkdekking (third-party citations)

Dit is het deel dat de site zelf niet kan doen en dat het meeste oplevert.
Perplexity en ChatGPT wegen vermeldingen op Reddit, TripAdvisor, Quora en
reisblogs zwaar; Gemini leunt op het Google Bedrijfsprofiel.

**Volgorde en regels** staan in `docs/authority-plan.md`: boilerplate-teksten
(gebruik ze letterlijk, overal dezelfde bewoording), vijftien outreach-doelen,
de Reddit-regels (antwoord eerst volledig zónder ons; noem ons alleen als
iemand expliciet om een aanbieder vraagt; disclose altijd; nooit een tweede
account) en vijf uitgewerkte voorbeeldantwoorden.

**Aanvullingen op dat plan:**

- **Quora.** Zelfde regels als Reddit. Zoek op "Ibiza boat rental", "Ibiza
  guestlist free", "jet ski Ibiza licence". Antwoord met het feit dat de vraag
  mist, geen link tenzij erom gevraagd.
- **TripAdvisor-forum (Ibiza).** Het drukst bezochte Ibiza-forum in het Engels
  en een bron die Perplexity vaak citeert. Profiel op je eigen naam, met
  disclosure in de handtekening ("I run a booking service on the island").
- **Trustpilot.** Zie `docs/geo/TRUSTPILOT.md`. Een geverifieerd profiel met
  echte reviews is een derde partij die bevestigt dat we bestaan en leveren;
  precies wat een antwoordmachine zoekt voordat hij een bedrijf aanbeveelt.
- **Boilerplate is bijgewerkt** met het verblijfsfeit: "run by Simon, who has
  lived on the island since 2021". Gebruik die zin, niet "5 jaar" — het jaartal
  blijft waar.

**Wat we niet doen.** Geen betaalde links, geen gastblognetwerken, geen
Wikidata-item (een klein bedrijf zonder onafhankelijke bronnen voldoet niet aan
de notability-eisen en wordt verwijderd — dat is een negatief signaal), geen
dagelijkse AI-blogposts, geen reviews kopen of zelf schrijven.

## 4. Pijler: E-E-A-T — ervaring en expertise

### 4.1 Wat er nu staat

- Byline "Samengesteld en gecontroleerd door Simon" op 56 pagina's, met bio,
  talen, en nu de verblijfsduur.
- `/about-us`: wie Simon is, sinds wanneer op het eiland, waar hij over
  adviseert (zeven onderwerpen, gelinkt), hoe we werken, en de sectie "Wat we
  niet beloven" — het sterkste vertrouwenssignaal dat een concurrent niet
  schrijft.
- First-hand secties ("What we would tell a friend") en eerlijke nadelen
  ("bij noordenwind…", "de deur beslist") op de pillars.
- Sociale bewijzen alleen uit data: `src/lib/proof.ts` (maandelijks bijwerken,
  `verified` ophogen) en de live Google-reviews.

### 4.2 Wat jij moet aanleveren

1. **Een echte foto van Simon** (gezicht, op locatie: marina of club). Zet hem in
   `public/team/simon.jpg`; dan komt `image` op het Person-knooppunt en in de
   byline. Geen stockbeeld — Google's beeldherkenning en bezoekers zien het.
2. **Achternaam** — pas dan in `team.ts` als volledige naam. Een Person met
   alleen een voornaam is zwakker dan met een volledige naam, maar een
   verzonnen of ongewenste achternaam is erger dan geen.
3. **Eigen foto's per pagina** (boten, marina's, baaien, clubs). Elke pagina
   met stockbeeld verliest het van de concurrent met een eigen foto.
4. **Getallen uit de boekingsadministratie** voor `proof.ts` (`ticketsSold`)
   en de `[[VERIFY]]`-lijst in `docs/seo/NIGHT-REPORT.md` (taxitarieven,
   ferrytijden).

### 4.3 Regel voor claims

Een ervaringsclaim is een getal dat veroudert. Daarom staat er in de code een
jaartal (`ON_ISLAND_SINCE = 2021`) en rekent `yearsOnIbiza()` de jaren uit.
Schrijf nooit "5 jaar" in een tekst of een profiel; schrijf "sinds 2021".

## 5. Pijler: technische toegankelijkheid voor AI-bots

**Stand.** `robots.txt` (gegenereerd door `src/app/robots.ts`) laat alles toe
behalve `/api/`, `/admin`, planner-, preview- en draft-routes, voor `*` en voor
23 expliciet genoemde crawlers: Googlebot, Googlebot-Image, Bingbot, GPTBot,
OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot,
Google-Extended, PerplexityBot, Perplexity-User, Applebot, Applebot-Extended,
DuckAssistBot, MistralAI-User, Amazonbot, YouBot, CCBot, meta-externalagent,
Meta-ExternalFetcher, Bytespider, Google-CloudVertexBot. Elke groep herhaalt de
volledige Disallow-lijst — robots-groepen zijn niet cumulatief.

Alle publieke pagina's zijn server-side gerenderd; `check:ssr` bewaakt dat.
`llms.txt` en `llms-full.txt` worden dagelijks opnieuw opgebouwd uit live data.

**Wat je zelf controleert na elke deploy** (vanaf een machine die de live site
kan bereiken — vanuit de Claude-sandbox lukt dit niet, zie `CLAUDE.md`):

```bash
# 1. Staat de site niet per ongeluk op noindex? (moet LEEG terugkomen)
curl -sI https://www.ibizamivida.com/en | grep -i x-robots-tag

# 2. Komt een AI-crawler er echt in? (moet 200 geven, geen 403)
curl -s -o /dev/null -w "%{http_code}\n" -A "GPTBot/1.0" https://www.ibizamivida.com/en/boats
curl -s -o /dev/null -w "%{http_code}\n" -A "PerplexityBot/1.0" https://www.ibizamivida.com/en/boats
curl -s -o /dev/null -w "%{http_code}\n" -A "ClaudeBot/1.0" https://www.ibizamivida.com/en/boats

# 3. robots, llms en sitemap worden geserveerd
curl -s https://www.ibizamivida.com/robots.txt | head -20
curl -s https://www.ibizamivida.com/llms.txt | head -20
curl -s https://www.ibizamivida.com/sitemap.xml | head -5

# 4. Alles in één keer
npm run check:ai
npm run check:live
```

**Vercel-instellingen die dit kunnen breken.** Vercel's "Attack Challenge Mode"
en de Firewall-optie "Block AI Bots" geven GPTBot en PerplexityBot een 403
terwijl robots.txt "allow" zegt. Controleer in het Vercel-dashboard onder
Firewall dat die regels uit staan. Het `curl -A`-commando hierboven is de test.

---

## 6. Bestanden en instellingen die jij plaatst

Er is **geen bestand om te uploaden**. `robots.txt`, `sitemap.xml`, `llms.txt`
en `llms-full.txt` worden door Next.js gegenereerd en bij elke deploy vanzelf
geserveerd. Wat je in Vercel en bij Google doet, zijn instellingen.

### 6.1 Vercel → Settings → Environment Variables (Production)

| Variabele | Waarde | Waarom |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.ibizamivida.com` — mét www | Voedt elke canonical én de noindex-beslissing in de middleware. Verkeerd = hele site stil uit Google. |
| `GOOGLE_PLACES_API_KEY` | sleutel uit Google Cloud (Places API New) | Zonder deze rendert geen review, geen cijfer, geen `AggregateRating`. |
| `GOOGLE_PLACE_ID` | `ChIJ…` uit de Place ID Finder | Idem. Niet de `0x…` of cid-vorm. |
| `NEXT_PUBLIC_TRUSTPILOT_URL` | `https://www.trustpilot.com/review/ibizamivida.com` | Pas invullen als het profiel geclaimd is. Komt dan in `sameAs`. |
| `NEXT_PUBLIC_TRIPADVISOR_URL` | de bedrijfspagina | Idem, na aanmaak. |

Na een wijziging: **Redeploy** (env-variabelen worden bij build ingelezen).
Volledige lijst met uitleg: `.env.example`.

### 6.2 Google Search Console

Volg `docs/search-setup.md` §1 letterlijk. Kernpunten:

- Property-type **Domain**, invoer exact `ibizamivida.com` (geen https, geen www).
- Verificatie via TXT-record in DNS.
- Sitemap indienen: `https://www.ibizamivida.com/sitemap.xml`.
- Controleer na een week onder *Indexering → Pagina's* op "Gevonden – niet
  geïndexeerd" en onder *Verbeteringen* of FAQ, Breadcrumb en Event verschijnen.
- *Instellingen → robots.txt* toont wat Google heeft gelezen. Vergelijk met
  `docs/geo/deliverables/robots.expected.txt`.

### 6.3 Bing Webmaster Tools (de route naar ChatGPT)

`docs/search-setup.md` §2: importeer de site uit Search Console, sitemap komt
mee. IndexNow staat al aan (sleutel in `public/006dbc…txt`, ping via
`postbuild`). **Nooit** een nieuwe IndexNow-sleutel genereren in het
Bing-dashboard — dan matcht hij niet meer met de code.

### 6.4 Referentiebestand

`docs/geo/deliverables/robots.expected.txt` is de verwachte uitvoer van
`/robots.txt`, gegenereerd uit `src/app/robots.ts`. Alleen om te vergelijken;
plaats hem nergens. Wijkt de live versie af, dan is er een deploy misgegaan of
een firewall-regel actief.

---

## 7. Meten

Zie `docs/seo/GEO-KPI.md`. Nulmeting nu, daarna maandelijks op dezelfde dag;
`npm run ai-report` bouwt `docs/ai-visibility-report.md`. Lees de trend, nooit
één run: het noemingspercentage voor dezelfde vraag schommelt tussen 20 en 80%
zonder dat er iets veranderd is.

Realistisch: Google 2–3 maanden, antwoordmachines 3–6 maanden. Het eerste
zichtbare effect is meestal Perplexity, omdat die het vaakst live crawlt.

## 8. Onderhoud in de code

- Nieuwe pagina: `<SchemaMarkup locale page={{ path, dateModified: contentUpdated(PAGE_KEY) }} breadcrumbs faqs …/>`, `<AuthorByline/>` onderaan, FAQ uit één array, regel in `content-dates.ts`, `llms.txt` en sitemap.
- Nieuw onderwerp waar Simon over adviseert: toevoegen aan `KNOWS_ABOUT` in
  `team.ts` — één plek, verschijnt op `/about-us`, in Person, in Organization en
  in `llms.txt`.
- Nieuw extern profiel: env-variabele in `profiles.ts`, nooit een losse URL in
  een pagina.
- `npm run check:seo` groen vóór de commit; baseline mag niet groeien.
