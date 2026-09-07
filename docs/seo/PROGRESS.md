# Night run — voortgang

Branch: `claude/ibiza-mi-vida-adjustments-tap8rv`
Plan: `docs/seo/MASTER-PROMPTS.md` · Audit: `docs/seo/AUDIT.md`

Fasen zijn uitgevoerd zoals ze op deze codebase van toepassing zijn. Waar het
plan botst met een regel uit `CLAUDE.md` staat de afwijking in AUDIT.md onder
"Conflicten" en hieronder als *afgeweken*.

- [x] **A — Audit** → `docs/seo/AUDIT.md`. 76 routes geïnventariseerd, databronnen,
      i18n, robots/sitemap/middleware/hreflang, venue-lijst. Uitkomst: 4 van de
      28 doelpagina's ontbreken echt.
- [x] **B — Fundament**
  - [x] B1 SEO-conventies toegevoegd aan `CLAUDE.md`
  - [x] B2 redirects gedocumenteerd in `docs/seo/REDIRECTS.md` *(bestaande
        middleware voldoet; `.es`-fallback toegevoegd)*
  - [x] B3 robots — *bestond al, strenger dan gevraagd. Geen wijziging.*
  - [x] B4 sitemap — *bestond al. Nieuwe routes toegevoegd.*
  - [x] B5 metadata-helper — *bestaat als `src/lib/seo.ts`. Afgeweken: geen tweede laag.*
  - [x] B6 jsonld-builders — *bestaat als `SchemaMarkup`. Afgeweken: geen tweede laag.*
  - [x] B7 Organization/WebSite — *bestond al.*
  - [x] B8 meta-keywords — *niet aanwezig, niets te verwijderen.*
- [x] **C — Infrastructuur** — *bestaat als `components/hub/*` + `route-slugs.ts`.
      Afgeweken: geen catch-all `[slug]`-route, geen `content/seo/`-laag.*
- [x] **D — Schrijfregels** → `docs/seo/WRITING-RULES.md`
- [x] **E/F — Ontbrekende money-pages** (alleen de 4 die echt ontbreken)
  - [x] `/en/pacha-ibiza` — geschreven, **404't nog** (akkoord club loopt)
  - [x] `/en/amnesia-ibiza` — geschreven, **404't nog** (akkoord club loopt)
  - [x] `/en/dc10-ibiza` — geschreven, **404't nog** (akkoord club loopt)
  - [x] `/en/ibiza-airport-transfer` — live
  - [x] Luchthavenvervoer opgenomen in `route-slugs.ts`, `sitemap.ts`,
        `content-dates.ts`, `llms.txt` en de interne links
  - [ ] **Open:** de drie clubpagina's publiceren zodra het akkoord rond is —
        vlag in `src/lib/pending-venues.ts`, met het stappenplan in dat bestand
  - *Afgeweken: E6–E9 (vier bootpagina's) niet gebouwd — zie AUDIT.md conflict 1.*
- [x] **F/H1 — sluglijst en gidsen** → `docs/seo/SLUG-DECISIONS.md`
  - Ruim veertig slugs uit fase F en H1 stuk voor stuk getoetst: 3 bouwen,
    9 uitbreiden, 30 vervallen (bestaat al, of tweede URL op dezelfde query)
  - [x] `/en/ibiza-nightlife` — de gids boven `/clubs`, `/calendar` en
        `/ibiza-club-tickets`, met gemeten prijzen uit de live agenda
  - [x] `/en/ibiza-club-dress-code`
  - [x] `/en/getting-around-ibiza`
  - [ ] **Open:** de negen UITBREIDEN-punten, in volgorde van opbrengst
        onderaan `SLUG-DECISIONS.md`
- [x] **G — Event/artist-engine** — *bestaat al: `/artists`, `/artists/[slug]`,
      `/club-tickets/[slug]/[eventSlug]`, `EventSchema` met datum-per-avond.
      Geen nieuwe engine gebouwd.*
- [x] **H — GEO-laag & rapport**
  - [x] H4 `llms.txt` uitgebreid met luchthavenvervoer
  - [x] H6 `docs/seo/GEO-KPI.md`; promptset in `scripts/ai-visibility/prompts.json`
        van 20 naar 36 vragen *(afgeweken: geen tweede CSV — het meetsysteem bestond al)*
  - [x] H9 `docs/seo/NIGHT-REPORT.md`
