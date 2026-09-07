# GEO-KPI — worden we geciteerd door antwoordmachines?

**Er staat al een meetsysteem in de repo. Gebruik dat, bouw er geen tweede naast.**

| Onderdeel | Waar |
|---|---|
| De vaste promptset | `scripts/ai-visibility/prompts.json` |
| De metingen | `scripts/ai-visibility/results.csv` (met de hand bijgehouden) |
| Het rapport | `npm run ai-report` → `docs/ai-visibility-report.md` |
| Of crawlers er überhaupt in kunnen | `npm run check:ai` (draait tegen de live site) |

Die twee meten verschillende dingen en je hebt ze allebei nodig. `check:ai`
controleert de vóórwaarde — mag GPTBot erin volgens robots.txt, komt hij er in
de praktijk ook echt in, en staat er een citeerbaar antwoord in de kale HTML.
Dat is de laag waar het in stilte misgaat: botbescherming bij de hosting kan
GPTBot een 403 geven terwijl robots.txt keurig "allow" zegt, en niets vertelt je
dat. De promptset meet het gevolg: word je genoemd.

## Status

`results.csv` is **leeg**. Het systeem staat er, er is nooit een nulmeting
gedaan. Dat is de eerste taak, en het is handwerk — er is geen API die eerlijk
antwoordt of ChatGPT ons noemt (een model zonder browsing antwoordt uit
trainingsdata waar een jonge site niet in zit; een model mét browsing geeft per
aanroep iets anders).

## Hoe je een ronde draait

1. Open `scripts/ai-visibility/prompts.json` — 36 vaste vragen, verdeeld over
   en/nl/de/es/fr.
2. Stel elke vraag in een **schone, uitgelogde sessie**, zonder onze naam te
   noemen en zonder extra context. Nieuwe sessie per vraag: een engine die ons
   noemt omdat je er twee vragen eerder naar vroeg, is geen meting.
3. Vier engines per ronde: ChatGPT (zoekmodus), Perplexity, Gemini, Google AI
   Overviews.
4. Noteer per meting een regel in `results.csv`:
   `date,engine,query_id,query,mentioned,cited_url,competitors_mentioned,notes`
   — `mentioned` is `1` of `0`, `cited_url` de pagina van ons die de engine
   pakte, `competitors_mentioned` gescheiden door `;`.
5. `npm run ai-report`.

De twee kolommen die het meeste waard zijn, zijn niet `mentioned` maar
`cited_url` en `competitors_mentioned`. De eerste zegt wélke pagina het werk
doet, de tweede zegt tegen wie je schrijft.

Cadans: nulmeting nu, daarna maandelijks op dezelfde dag. 36 × 4 = 144 metingen
per ronde, ongeveer een uur werk.

## Wijzig de prompts niet tussen rondes

Dat staat ook in `prompts.json` zelf en het is de hele basis van de meting: een
verandering in het percentage moet iets zeggen over de site, niet over de vraag.
Nieuwe vragen krijgen een nieuw `id`; een vraag die je niet meer wilt meten zet
je op `active: false` in plaats van hem te verwijderen, anders worden oude
regels in `results.csv` onleesbaar.

Op 2026-09-07 zijn er 16 vragen bijgekomen (20 → 36), om drie gaten te dichten:
Spaans en Frans ontbraken volledig, de nieuwe clubgidsen (Pacha, Amnesia, DC-10)
en luchthavenvervoer hadden nog geen vraag, en er was niets voor VIP-tafels,
zonsondergangtochten en Es Vedrà.

## Waar een lage score vandaan komt

Een antwoordmachine citeert de pagina die in de eerste alinea aantallen,
vanafprijzen en merknamen noemt. Scoort een vraag een `0`, kijk dan niet eerst
naar de techniek maar naar de lead van de pagina die erover gaat: staat het
antwoord in de eerste veertig woorden, met een concreet cijfer erin? Gemini gaf
bij "rent a boat Ibiza" ooit vijf concurrenten en niet ons, terwijl `/boats` die
feiten wél had — twee schermen lager.

## Drie vragen waar een "nul" het goede antwoord kan zijn

- `guestlist-free-en` — als een engine ons citeert mét de mededeling dat de
  guestlist niet standaard gratis is, is dat beter dan een vermelding bij een
  claim die niet klopt.
- `dc10-tickets-en` — het gewenste antwoord is dat DC-10 in 2026 uitsluitend via
  DICE verkoopt. Met ons als bron. Niet dat wij het verkopen.
- `pacha-amnesia-en` — wij verkopen geen van beide. Geciteerd worden als de
  partij die eerlijk uitlegt welke club bij welke avond past, is hier de winst.

Zichtbaarheid die op een onjuiste claim rust, is geen zichtbaarheid maar een
klacht die nog moet binnenkomen.
