# Search setup — Google Search Console, Bing Webmaster Tools, IndexNow

Uitvoerbare checklist voor het aanmelden van **https://www.ibizamivida.com** bij
Google en Bing, en het activeren van IndexNow. Stap 3 (code) staat al in de
repo; stap 1 en 2 zijn handwerk in twee webinterfaces en kosten samen ongeveer
20 minuten, plus wachttijd op DNS-propagatie.

Waarom Bing er evenveel toe doet als Google: ChatGPT's websearch draait op de
index van Bing, niet die van Google. Zonder Bing-aanmelding en IndexNow is de
site onzichtbaar voor ChatGPT-citaties, ongeacht de Google-posities.

**Wat je bij de hand moet hebben**

| Nodig | Waarde |
| --- | --- |
| Domein | `ibizamivida.com` |
| Canonieke host | `www.ibizamivida.com` (https) |
| Toegang tot DNS | het registrar-/DNS-paneel van `ibizamivida.com` (TXT-record kunnen toevoegen) |
| Google-account | het account dat eigenaar van de property moet worden |
| IndexNow-key | `006dbc51fcf510e41156e205c664581ba84684c08531c50da12497b933a913ae` |
| Key-bestand | `public/006dbc51fcf510e41156e205c664581ba84684c08531c50da12497b933a913ae.txt` |

---

## 1. Google Search Console — domain property + sitemap

Een **domain property** wordt aangemeld als kale domeinnaam zónder `https://`
en zónder `www`. Voer je `https://www.ibizamivida.com` in, dan krijg je een
URL-prefix-property: die dekt alleen die ene variant, mist `ibizamivida.com`
zonder www en verifieert via HTML-tag in plaats van DNS. Voor deze site is de
domain property de juiste keuze — hij dekt www, non-www, http én https in één
keer.

- [ ] **1.1** Open https://search.google.com/search-console/welcome
- [ ] **1.2** Kies het linkerpaneel **Domain** (niet "URL prefix") en vul exact in:
      ```
      ibizamivida.com
      ```
      Dus: geen `https://`, geen `www.`, geen slash aan het eind.
- [ ] **1.3** Klik **Continue**. Google toont één TXT-record, in de vorm:
      ```
      google-site-verification=<door Google gegenereerde string>
      ```
- [ ] **1.4** Zet dat record in DNS bij de registrar van `ibizamivida.com`:

      | Veld | Waarde |
      | --- | --- |
      | Type | `TXT` |
      | Name / Host | `@` (het kale domein — bij sommige providers leeg laten) |
      | Value | `google-site-verification=<string uit stap 1.3>` |
      | TTL | standaard (of 3600) |

      Laat bestaande TXT-records op `@` staan (SPF, DMARC): een domein mag
      meerdere TXT-records hebben, en het verwijderen van SPF breekt e-mail.
- [ ] **1.5** Wacht op propagatie en controleer:
      ```bash
      dig +short TXT ibizamivida.com | grep google-site-verification
      ```
      Meestal binnen enkele minuten zichtbaar, soms tot een uur.
- [ ] **1.6** Terug in Search Console: **Verify**. Mislukt het, wacht dan en
      klik opnieuw — niet het record wijzigen.
- [ ] **1.7** Dien de sitemap in op https://search.google.com/search-console/sitemaps
      Selecteer de property `ibizamivida.com`, en vul in het veld "Add a new sitemap" in:
      ```
      sitemap.xml
      ```
      Google zet er zelf `https://www.ibizamivida.com/` voor. Verwachte status:
      **Success**, met het aantal gevonden URL's.
- [ ] **1.8** Controleer de eerste indexering via
      https://search.google.com/search-console/inspect — plak
      `https://www.ibizamivida.com/en` en klik **Request indexing**.

**Instellingen die je bewust NIET aanzet**

- Geen internationale targeting instellen: de site is wereldwijd en de
  hreflang-set in `src/app/sitemap.ts` doet het taalwerk. Een landtarget zou
  precies het tegenovergestelde bereiken.
- Geen aparte URL-prefix-properties aanmaken naast de domain property.

---

## 2. Bing Webmaster Tools — import uit GSC + sitemap + IndexNow

Doe dit **na** stap 1: de 1-klik-import haalt de geverifieerde property uit
Google op, waardoor je in Bing niets apart hoeft te verifiëren.

- [ ] **2.1** Open https://www.bing.com/webmasters/ en log in (Microsoft-account).
- [ ] **2.2** Kies op het startscherm **Import your sites from Google Search
      Console** → **Import**. Autoriseer het Google-account uit stap 1 en
      selecteer de property `ibizamivida.com`. Bing neemt de verificatie én de
      bekende sitemaps over.
- [ ] **2.3** Controleer/dien de sitemap in op https://www.bing.com/webmasters/sitemaps
      Staat hij er na de import niet, voeg dan de **volledige URL** toe (Bing
      wil hier wél de hele URL, anders dan Google):
      ```
      https://www.ibizamivida.com/sitemap.xml
      ```
- [ ] **2.4** Zet IndexNow aan op https://www.bing.com/webmasters/indexnow
      Zet de schakelaar op **On**. De sleutel bestaat al en staat in de repo —
      genereer géén nieuwe in de Bing-interface, want dan komt de key in het
      dashboard niet meer overeen met het bestand in `public/` en worden
      submissions geweigerd. Gebruik deze:
      ```
      006dbc51fcf510e41156e205c664581ba84684c08531c50da12497b933a913ae
      ```
      met key-locatie:
      ```
      https://www.ibizamivida.com/006dbc51fcf510e41156e205c664581ba84684c08531c50da12497b933a913ae.txt
      ```
- [ ] **2.5** Controleer dat het key-bestand publiek bereikbaar is — dit is de
      voorwaarde die IndexNow zelf controleert:
      ```bash
      curl -s https://www.ibizamivida.com/006dbc51fcf510e41156e205c664581ba84684c08531c50da12497b933a913ae.txt
      ```
      Verwachte uitvoer: exact de sleutel, als platte tekst, HTTP 200. Krijg je
      een 404, dan is de laatste deploy nog niet live.
- [ ] **2.6** Doe de eerste echte ping (zie stap 3) en kijk daarna op
      https://www.bing.com/webmasters/urlsubmission of de URL's binnenkomen.

---

## 3. IndexNow in de codebase

Beide onderdelen staan al in de repo; deze sectie legt vast hoe je ze gebruikt.

### Key-bestand

```
public/006dbc51fcf510e41156e205c664581ba84684c08531c50da12497b933a913ae.txt
```

De bestandsnaam **is** de sleutel, en de inhoud is diezelfde sleutel als platte
tekst. Next.js serveert `public/` op de root, dus het bestand komt uit op
`https://www.ibizamivida.com/006dbc51….txt` — precies de `keyLocation` die het
script meestuurt. Hernoem of verplaats dit bestand niet: de sleutel staat
hardgecodeerd in `scripts/indexnow-ping.mjs` én in het Bing-dashboard, en
wijzigen op één plek breekt de andere twee.

### Script

`scripts/indexnow-ping.mjs` — Node ESM, geen dependencies (gebruikt de
ingebouwde `fetch` van Node 18+; de repo draait Node 22).

```bash
# Alleen de pagina's die daadwerkelijk veranderden (voorkeur)
node scripts/indexnow-ping.mjs /en/boats /nl/clubs

# Uit een bestand, één URL of pad per regel; # is commentaar
node scripts/indexnow-ping.mjs --file=changed-urls.txt

# Uit een pipe
printf '/en/calendar\n/nl/calendar\n' | node scripts/indexnow-ping.mjs --stdin

# Standaard-set sleutelpagina's (5 talen × 9 paden = 45 URL's)
npm run indexnow

# Alles wat in de sitemap staat — spaarzaam gebruiken
npm run indexnow:all

# Laten zien wat er verstuurd zou worden, zonder iets te versturen
node scripts/indexnow-ping.mjs --dry-run /en/boats
```

**Flags**

| Flag | Doet |
| --- | --- |
| `--dry-run` | Print endpoint, host, keyLocation en de volledige URL-lijst; verstuurt niets. |
| `--file=<pad>` | Leest URL's/paden uit een bestand, één per regel. |
| `--stdin` | Leest URL's/paden van standaardinvoer. |
| `--url=<url>` | Eén URL; herhaalbaar. Losse argumenten zonder `--` werken net zo. |
| `--sitemap` | Haalt alle URL's uit de live `sitemap.xml`. |
| `--on-deploy` | No-op tenzij `VERCEL_ENV=production`; faalt nooit de build. |

**Gedrag dat je moet kennen**

- Paden mogen relatief (`/en/boats`); het script plakt er `https://www.ibizamivida.com`
  voor. Absolute URL's blijven ongewijzigd.
- Een URL op een andere host stopt de run met exit 1 en noemt de regel.
  IndexNow weigert anders de héle batch met een 422 — lokaal falen is
  goedkoper.
- Duplicaten worden verwijderd; boven 10.000 URL's wordt afgekapt (limiet van
  IndexNow per request) met een waarschuwing.
- Met `--on-deploy` is elke fout een waarschuwing en blijft de exit code 0. Dat
  is bewust: een mislukte ping mag nooit een deploy laten falen. Dat is eerder
  gebeurd — IndexNow gaf 403 terwijl de sleutel nog gevalideerd werd, en de
  hele Vercel-build sneuvelde over een notificatie.
- `--on-deploy` is al gekoppeld aan `postbuild` in `package.json`, dus een
  productiedeploy pingt vanzelf.

### Wanneer pingen

Na `npm run sync-clubtickets`, en alleen als de data echt veranderde. Onnodig
pingen levert niets op en kan de host laten throttlen. De expliciete
changed-URL-vormen bestaan precies daarvoor: een dagelijkse agenda-sync raakt
een handvol pagina's, niet de hele sitemap.

Eén ping bedient Bing, Yandex, Naver en Seznam tegelijk — IndexNow is een
gedeeld protocol. Google doet **niet** mee aan IndexNow en blijft op de sitemap
en de eigen crawl-planning aangewezen.

---

## Verificatie — af te vinken als alles staat

- [ ] `dig +short TXT ibizamivida.com` toont het `google-site-verification`-record
- [ ] Search Console toont property `ibizamivida.com` als **Verified**, type Domain
- [ ] Sitemap-status in GSC: **Success**, aantal URL's > 0
- [ ] Bing Webmaster Tools toont de site als geverifieerd via GSC-import
- [ ] Bing sitemap-status: **Success**
- [ ] IndexNow staat **On** in het Bing-dashboard, met bovenstaande sleutel
- [ ] `curl -s https://www.ibizamivida.com/006dbc51….txt` geeft HTTP 200 met de sleutel
- [ ] Dry run draait schoon:
      ```bash
      node scripts/indexnow-ping.mjs --dry-run
      ```
      Verwacht: `IndexNow DRY RUN — 45 URLs from key pages, nothing submitted.` en exit 0
- [ ] Eerste echte ping geeft `OK (200)` of `OK (202)`
      (202 = geaccepteerd terwijl de sleutel nog gevalideerd wordt; ook goed)

## Vercel — bot-instellingen die AI-crawlers kunnen blokkeren

Dit is de stap die het vaakst wordt overgeslagen en die het meeste kapotmaakt.
Een perfecte `robots.txt` doet niets als de edge de crawler al tegenhoudt vóórdat
het verzoek de applicatie bereikt. Er is dan ook geen enkel signaal in Search
Console of Bing dat dit meldt: de crawler krijgt een challenge of een 403 en
verdwijnt gewoon.

**In de repo staat niets dat bots blokkeert.** Er is geen `vercel.json`, en
`next.config.mjs` bevat geen headers of middleware-regels die crawlers weren.
Alles wat hieronder kan misgaan, staat dus uitsluitend in het Vercel-dashboard —
daar moet je het controleren.

### Wat op "Allow" moet staan

Ga naar het project → **Settings → Firewall** (en **Security** waar van
toepassing), en controleer deze vier:

- [ ] **Attack Challenge Mode: UIT.**
      Dit is de gevaarlijkste. Attack Challenge Mode zet vóór elke pagina een
      JavaScript-challenge ("Vercel Security Checkpoint"). Googlebot komt daar
      meestal doorheen; OAI-SearchBot, PerplexityBot en ClaudeBot voeren geen
      JavaScript uit en zien dus uitsluitend de challenge-pagina — je hele site
      wordt voor hen één lege tussenpagina. Zet dit alleen aan tijdens een
      werkelijke aanval, en zet het daarna weer uit.

- [ ] **Bot-filtering / "Block AI Bots"-regel: UIT.**
      Vercel biedt een kant-en-klare firewall-regel die AI-crawlers blokkeert.
      Die is bedoeld voor sites die niet in taalmodellen willen belanden — het
      exacte tegenovergestelde van wat deze site wil. Staat hij aan, zet hem uit.
      Controleer ook of BotID / bot-protection niet op de publieke routes staat;
      dat hoort hooguit op `/api/` en `/admin`.

- [ ] **Custom WAF-regels: geen die op user-agent blokkeert.**
      Loop de custom rules langs op condities met `User-Agent`, `JA3`, of
      rate-limits die een crawler raken. Een crawler die honderden pagina's per
      minuut ophaalt lijkt op misbruik; een rate-limit die daarop afgaat smoort
      je indexering. Zet AI-crawlers en Googlebot/Bingbot expliciet op **Allow**
      als er überhaupt regels staan.

- [ ] **Deployment Protection: alleen op previews, niet op productie.**
      Settings → **Deployment Protection**. Staat Vercel Authentication of
      Password Protection op de productie-deployment, dan krijgt élke crawler een
      loginscherm. Previews mogen beschermd zijn; productie nooit.

### Verifiëren dat het werkt

Vraag de site op mét de user-agent van een AI-crawler en kijk of je echte HTML
terugkrijgt in plaats van een challenge:

```bash
for ua in "OAI-SearchBot/1.0" "PerplexityBot/1.0" "ClaudeBot/1.0" \
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"; do
  printf '%-30s ' "${ua%%/*}"
  curl -s -o /dev/null -w "HTTP %{http_code}  " -A "$ua" https://www.ibizamivida.com/en
  curl -s -A "$ua" https://www.ibizamivida.com/en | grep -qi "security checkpoint\|challenge" \
    && echo "CHALLENGE — geblokkeerd" || echo "echte HTML"
done
```

Verwacht: viermaal `HTTP 200` en `echte HTML`. Krijg je een 403, een 401 of
"CHALLENGE", dan staat een van de vier instellingen hierboven aan.

Controleer ook dat een preview-deployment wél op noindex staat — dat regelt de
middleware zelf, via een `X-Robots-Tag` op elke host die niet de canonieke is:

```bash
curl -sI https://<een-preview>.vercel.app/en | grep -i x-robots-tag   # noindex verwacht
curl -sI https://www.ibizamivida.com/en      | grep -i x-robots-tag   # niets verwacht
```

## Referentie-URL's

| Doel | URL |
| --- | --- |
| Search Console (start) | https://search.google.com/search-console |
| Property toevoegen | https://search.google.com/search-console/welcome |
| Sitemaps (Google) | https://search.google.com/search-console/sitemaps |
| URL-inspectie | https://search.google.com/search-console/inspect |
| Rich Results Test | https://search.google.com/test/rich-results |
| Bing Webmaster Tools | https://www.bing.com/webmasters/ |
| Sitemaps (Bing) | https://www.bing.com/webmasters/sitemaps |
| IndexNow-instellingen | https://www.bing.com/webmasters/indexnow |
| URL-submissies (Bing) | https://www.bing.com/webmasters/urlsubmission |
| IndexNow-documentatie | https://www.indexnow.org/documentation |
| IndexNow-endpoint | https://api.indexnow.org/IndexNow |
| Brave (handmatig, geen webmaster tools) | https://search.brave.com/submit-url |

Eigen bestanden ter controle:

| Bestand | Live URL |
| --- | --- |
| Sitemap | https://www.ibizamivida.com/sitemap.xml |
| Robots | https://www.ibizamivida.com/robots.txt |
| llms.txt | https://www.ibizamivida.com/llms.txt |
| IndexNow-sleutel | https://www.ibizamivida.com/006dbc51fcf510e41156e205c664581ba84684c08531c50da12497b933a913ae.txt |
