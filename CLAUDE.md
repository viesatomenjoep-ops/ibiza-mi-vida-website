# PROJECT: Ibiza Mi Vida (ibizamivida.com)

- Platform voor Ibiza: clubtickets (via ClubTickets-affiliate), guestlists/packages, privéboot- en jetskiverhuur, autoverhuur (partner: Wiber Rent a Car via Awin), boten (partner: Click&Boat).
- Doelgroep: WERELDWIJD. Engels (/en) is de primaire taal voor SEO en AI-zichtbaarheid. Ondersteunend: DE, FR, ES, NL. x-default = /en.
- Stack: Next.js op Vercel. HARDE REGEL: alle publieke pagina's server-side rendered of statisch (App Router server components / ISR). Nooit content die pas na client-side JS zichtbaar wordt — AI-crawlers (OAI-SearchBot, PerplexityBot, ClaudeBot) voeren geen JS uit.
- SEO-doelen: (1) geciteerd worden door ChatGPT/Perplexity/Gemini/AI Overviews voor queries als "private boat rental Ibiza", "jet ski rental Ibiza", "Ibiza club tickets"; (2) top-Google voor commerciële verhuur-keywords per taal.
- Contentregels: answer-first (antwoord in eerste 40-60 woorden onder elke kop, met concreet cijfer/prijs), stellige taal, FAQ-secties van 6-10 Q&A's per commerciële pagina, zichtbare "laatst bijgewerkt"-datum, eigen foto's, first-hand tips van het lokale team (Simon).
- Affiliate-regels: partneraanbod via widgets/deeplinks, NOOIT partnerteksten kopiëren (duplicate content + contractueel verboden). Alle affiliate-links krijgen `rel="sponsored"`.
- Schema-regels: JSON-LD via een centrale `<SchemaMarkup>`-component. Types: Organization (site-breed, met sameAs), Product+Offer (verhuurpagina's, echte prijzen), FAQPage (elke pagina met FAQ), BreadcrumbList, Review/AggregateRating (alleen echte reviews).
- Elke ontdekte fout die terug kan komen: als regel toevoegen aan dit bestand.

## Repo-feiten (waar de bovenstaande regels landen)

- Next.js 14 App Router + TypeScript + Tailwind. Data via Supabase; media via Cloudinary; monitoring via Sentry.
- Routes staan onder `src/app/[locale]/...`; locales zijn `en`, `nl`, `de`, `es`, `fr` (zie `src/middleware.ts`, met `en` als fallback). Vertalingen in `src/dictionaries/*.json`.
- ISR-pagina's zetten `export const revalidate = 3600`. Voeg geen `"use client"` toe aan een routepagina die indexeerbare content rendert.
- `src/app/robots.ts`, `src/app/sitemap.ts` en `src/app/llms.txt` bepalen crawler-toegang; controleer die bij nieuwe routes.
- Scripts: `npm run dev`, `npm run build`, `npm run lint`. Verder `sync-clubtickets`, `price-snapshot`, `indexnow` (build pingt IndexNow via `postbuild`).
- Secrets uitsluitend via environment variables (`.env.example` is de referentie). Nooit sleutels, tokens of database-URL's in de repo of in dit bestand.

## Geleerde regels (fouten die terug kunnen komen)

- Bare domein mocht niet naar `/nl` redirecten: de default locale is `en` voor iedereen die we niet kunnen plaatsen. Taalvoorkeur (Accept-Language) weegt zwaarder dan land.
- JSON-LD is nu verspreid over losse componenten in `src/components/seo/` (`FaqJsonLd`, `BreadcrumbJsonLd`, `ReviewSchema`, `ServiceSchema`, `EventSchema`, `VenueSchema`, `HomeJsonLd`, `ItemListJsonLd`, `DatasetJsonLd`). Doel is één centrale `<SchemaMarkup>`-component; nieuwe schema-code daarheen consolideren in plaats van weer een los bestand toevoegen.
- `rel="sponsored"` staat nog niet op de bestaande uitgaande partnerlinks. Zet het bij elke aanraking van een affiliate-link alsnog (samen met `target="_blank"` + `rel="sponsored noopener"` waar van toepassing).
- De IndexNow-sleutel staat op drie plekken die moeten matchen: de bestandsnaam én inhoud van `public/<key>.txt`, de constante `KEY` in `scripts/indexnow-ping.mjs`, en het Bing Webmaster Tools-dashboard. Nooit een nieuwe sleutel genereren in de Bing-interface — dat breekt de andere twee stil en submissions worden geweigerd.
- Een IndexNow-ping mag nooit een deploy laten falen: onder `--on-deploy` is elke fout een waarschuwing en blijft de exit code 0. Dit is een keer misgegaan (403 tijdens key-validatie liet de hele Vercel-build sneuvelen).
- Google Search Console-domain property wordt aangemeld als kale `ibizamivida.com`, zonder scheme en zonder `www`. Voer je de volledige URL in, dan krijg je een URL-prefix-property die non-www mist. Zie `docs/search-setup.md`.
- Slugs van keywordpagina's verschillen per taal (`/en/boat-rental-ibiza` vs `/nl/boot-huren-ibiza`). Ze staan uitsluitend in `src/lib/route-slugs.ts`; hreflang, sitemap, taalwissel én de 301-redirect lezen daaruit. Voeg een taal pas toe aan `ROUTE_LOCALES` als die pagina echt rendert — een hreflang naar een 404 laat Google het hele cluster weggooien, dus dat is erger dan geen alternate.
- Een cross-locale slug-redirect moet op de slug vergelijken, niet op de taal. Sommige routes gebruiken bewust in alle talen dezelfde slug (`boat-party`); een guard op "gevonden onder een andere taal" stuurde elke niet-NL taal naar zichzelf — een oneindige redirect-lus die vier taalversies offline haalde. `check:ssr` ving dit.
- Een `noindex`-pagina hoort nooit in de sitemap. Verandert de een, verander de ander in dezelfde commit. Gold voor `/legal`, `/privacy-policy` en `/terms-&-conditions`, die als "Submitted URL marked noindex" in Search Console landen.
- Een canonical mag nooit naar een URL wijzen die terugredirect naar de pagina zelf. `/tips` zette zijn canonical op `/ibiza-tips`, dat enkel bestaat om naar `/tips` te redirecten — een lus waardoor de pagina uit de index kan vallen.
- `robots.txt`-groepen zijn niet cumulatief: een crawler gehoorzaamt alléén de meest specifieke groep die op hem matcht. Noem je een bot expliciet, dan moet die groep de volledige Disallow-lijst herhalen, anders geef je die bot toegang tot `/api/` en `/admin`.
- Publiceer nooit een prijs die niet bevestigd is. `null` in `src/lib/rental-prices.ts` betekent: copy rendert zonder het getal, tabel toont "op aanvraag", en `<SchemaMarkup>` laat het `Offer`-blok wég. Een placeholder in Product-schema is een toezegging die we niet waar kunnen maken.
- Reviewcijfers komen uitsluitend live uit het Google Bedrijfsprofiel via `src/lib/google-reviews.ts`. Geen prop, geen default, geen fallback — een hardgecodeerde `AggregateRating` stond hier eerder live en is een overtreding van Google's spambeleid.
- Partnerlinks gaan altijd via `<AffiliateLink>`; die hardcodeert `rel="sponsored noopener noreferrer"` plus een zichtbare disclosure. Nooit een kale `<a>` naar een partner. Awin's `cshow.php`-impressiepixel renderen we bewust niet: die vuurt bij elke paginaweergave en is daarmee een toestemmingsvraag, geen klik.
- Bouw geen tweede pagina over een onderwerp dat al een route heeft (zoals `boat-party`) alleen voor een keyword-slug. Twee eigen URL's voor dezelfde query splitsen elkaars links en Google kiest er één, meestal niet degene die je wilde. Hernoem de bestaande route en zet er een 301 op.
- `npm run check:seo` draait ssr, schema, hreflang, onpage en een fetch op robots/llms/sitemap, en blokkeert PR's via `.github/workflows/seo-check.yml`. `scripts/seo-check/baseline.json` bevat bekende, bestaande fouten zodat nieuwe code meteen streng is. Die lijst mag alleen krimpen: regenereren doe je ná het oplossen van iets, nooit om een nieuwe fout stil te zetten.
- Een check moet deterministisch zijn. De uniciteitscontrole op titels rapporteerde eerst de pagina die toevallig als eerste binnenkwam, waardoor elke run een andere "schuldige" aanwees en niets te baselinen viel. Verzamel eerst alles, oordeel daarna in gesorteerde volgorde.
