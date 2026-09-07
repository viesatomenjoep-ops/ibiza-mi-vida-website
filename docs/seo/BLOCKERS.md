# Blokkades tijdens de run

## 1. `npm run lint` is niet draaibaar

`next lint` vindt geen ESLint-configuratie in de repo en valt terug op zijn
interactieve setup-wizard ("How would you like to configure ESLint?"). In een
niet-interactieve sessie hangt dat commando dus.

Dit is een bestaande situatie, niet iets van deze run: er staat geen
`.eslintrc*` of `eslint.config.*` in de repo, terwijl `eslint` en
`eslint-config-next` wél in `devDependencies` staan.

**Omzeild met** `npx tsc --noEmit` (schoon), `npm run build` (schoon) en
`npm run check:seo` (alles groen, 217 pagina's).

**Op te lossen door** een `.eslintrc.json` met `{ "extends": "next/core-web-vitals" }`
toe te voegen. Dat is een aparte commit waard, want de eerste run zal
waarschijnlijk bestaande meldingen opleveren over de hele codebase en die horen
niet in deze wijziging.

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
