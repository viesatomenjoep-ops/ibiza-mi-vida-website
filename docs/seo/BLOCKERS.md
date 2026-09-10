# Blokkades tijdens de run

## 1. `npm run lint` is niet draaibaar — OPGELOST

`.eslintrc.json` is toegevoegd met `{ "extends": "next/core-web-vitals" }`.
De 4 unescaped entities (`Newsletter.tsx`, `SearchBar.tsx`, `AdminDashboard.tsx`,
`jet-ski-rental-ibiza/page.tsx`) zijn gecorrigeerd. `npm run lint` draait nu
foutloos (code 0).

## 2. Taxitarieven en buslijnnummers niet verifieerbaar

Voor `/en/ibiza-airport-transfer` zijn de tarieven van de taxirit vanaf de
luchthaven en de lijnnummers van de bus niet te bevestigen vanuit deze omgeving.
`CLAUDE.md` verbiedt het publiceren van een onbevestigde prijs, dus de pagina is
geschreven als beslispagina zonder getallen. Zie de `[[VERIFY]]`-lijst in
`NIGHT-REPORT.md`; zodra Simon de cijfers geeft, komt er een `PriceTable` in.

## 3. `npm run check:fleet` en `npm run check:live` niet draaibaar

Beide draaien tegen externe hosts (de partner-API respectievelijk de live site).
Vanuit deze sandbox geeft de proxy een 403 — dat is de netwerkpolicy, niet de
partner, en het staat als bekend gedrag in `CLAUDE.md`. Draai ze lokaal of laat
`live-health.yml` het na de deploy doen.
