# Master-prompts — het nachtplan van 2026-09-07

Dit is het plan zoals het is aangeleverd, samengevat per fase, plus wat er
werkelijk mee gedaan is. Het origineel ging uit van een kale Next.js-site; deze
repo is dat niet. Wat er per fase daadwerkelijk gebeurd is en waarom, staat in
`AUDIT.md` (onder "Conflicten") en `NIGHT-REPORT.md`.

## Vaste merkfeiten (blijven gelden)

- Merknaam **Ibiza Mi Vida**, canonieke host `https://www.ibizamivida.com`
- Concierge: Simon, lokaal op Ibiza, WhatsApp +33 6 66 52 84 12
- Officiële ClubTickets-partner voor clubtickets; boten via eigen brokerage
  (theyachtbroker-koppeling); affiliates Click&Boat en Wiber via Awin —
  bestaande links hergebruiken, nooit een nieuwe verzinnen
- Google-reviews: uitsluitend live uit het Bedrijfsprofiel, nooit hardgecodeerd
- DC-10: voorverkoop 2026 alleen via DICE → gids, geen ticketclaim
- Hï Ibiza: DJ Mag #1 Club in the World 2022–2025 (bevestigd)
- [UNVRS]: eerste "hyperclub", geopend 30 mei 2025 op de oude Privilege-locatie
  in San Rafael, tot 10.000 capaciteit, The Night League. Een claim
  "DJ Mag #1 2026" alleen na verificatie

## De fasen

| Fase | Plan | Uitgevoerd |
|---|---|---|
| **A** Audit | Routes, databronnen, i18n, robots/sitemap/middleware, venue-lijst, FOUND/PARTIAL/MISSING-tabel | Volledig → `AUDIT.md` |
| **B** Fundament | CLAUDE.md-conventies, redirects, robots, sitemap, metadata- en JSON-LD-helpers, Organization-schema, meta-keywords weg | Conventies + `REDIRECTS.md` + `.es`-redirect + meta-keywords weg. Robots, sitemap, helpers en Organization bestonden al, strenger dan gevraagd |
| **C** Infrastructuur | Content-model `content/seo/*.json`, catch-all `[slug]`-route, `MoneyPage`-component, linkhelpers | Afgeweken: bestaat als `components/hub/*` + `route-slugs.ts`. Geen catch-all (schaduwt 76 routes), geen derde contentlaag |
| **D** Schrijfregels | Toon, woordentelling, FAQ-regels, kwaliteitscheck | → `WRITING-RULES.md` |
| **E** 20 money-pages | Twintig nieuwe landingspagina's | 24 van de 28 doelpagina's bestonden al. Vier gebouwd; de vier bootpagina's bewust niet (cannibalisatie — zie AUDIT.md conflict 1) |
| **F** Long-tail | Venue-, VIP-, boot- en activiteitenpagina's | Beperkt tot wat echt ontbrak. VIP-subpagina's niet gebouwd: `/guestlist` en `/package-deals` dragen die intentie al |
| **G** Event/artist-engine | Datamodel, adapter, routes, cron | Bestaat al: `/artists`, `/artists/[slug]`, `/club-tickets/[slug]/[eventSlug]`, `EventSchema` met een datum per avond |
| **H** Authority & GEO | Gidsen, `llms.txt`, GEO-laag, KPI-set, eindrapport | `llms.txt` bijgewerkt, `GEO-KPI.md`, promptset 20 → 36, `NIGHT-REPORT.md` |

## Vervolgruns uit het plan

- **I — Vertaalronde nl/de/es/fr.** Lokalisatie op zoekintentie, geen letterlijke
  vertaling. Een taal komt pas in `ROUTE_LOCALES` als de pagina echt rendert.
- **J — CTR-ronde op Search Console-export.** Pagina's met veel vertoningen en
  weinig klikken hebben een titelprobleem, geen rankingprobleem.
- **K — GEO-nulmeting invullen.** Zie `GEO-KPI.md`; het meetsysteem staat er,
  `results.csv` is nog leeg.
