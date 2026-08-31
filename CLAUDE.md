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
