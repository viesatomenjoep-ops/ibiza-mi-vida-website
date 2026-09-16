# De prijsindex uitventen

`/ibiza-prices` publiceert gemeten clubprijzen met methode, meetdatum en aantal
waarnemingen. Dat is het enige op deze site waar een journalist naar kan linken
zonder ons op ons woord te geloven — en daarmee de enige linkstrategie die op
eigen data drijft in plaats van op budget.

Dit bestand is het draaiboek. Het staat hier zodat het elk seizoen opnieuw kan,
niet omdat het één keer verstuurd moet worden.

---

## Waarom dit werkt en een gewone pitch niet

Een redactie linkt niet naar "wij verkopen tickets". Een redactie linkt naar een
**getal met een methode erachter**, want dat is wat haar eigen stuk
controleerbaar maakt. Wij hebben dat: de agenda van onze ticketpartner, honderden
gedateerde avonden, de laagste geadverteerde prijs per avond, mediaan in plaats
van gemiddelde, en een zichtbare meetdatum.

Niemand anders publiceert dit. Reisredacties schrijven elk seizoen over wat
Ibiza kost en baseren zich op een enquête, een persbericht of een gevoel.

**En het is nog tegendraads ook.** De verwachting is dat Ibiza duur is. De
meting zegt iets anders: het merendeel van de avonden zit onder de €40. Een
cijfer dat tegen de verwachting in gaat, is het cijfer dat overgenomen wordt.

---

## Vóór je verstuurt: haal de verse cijfers op

**Nooit de getallen uit dit document overnemen.** De pagina herrekent zichzelf
zodra de agenda verandert, dus een cijfer van vorige maand klopt niet meer en
een journalist die het narekent vindt iets anders. Dat is precies één keer nodig
om je bron kwijt te zijn.

Open `https://www.ibizamivida.com/en/ibiza-prices` en neem over:

- de eerste alinea (goedkoopste ticket, percentage onder €40, mediaan, de helft
  tussen X en Y, duurste entree)
- de regel eronder: meetdatum, aantal avonden, aantal clubs
- één of twee rijen uit de clubtabel die het contrast laten zien (de duurste
  naast de goedkoopste)

Ter illustratie, zoals het op **16 september 2026** stond — puur als voorbeeld
van welke vorm de cijfers hebben:

> Goedkoopste ticket €15 · 61% van de avonden onder €40 · mediaan €32 · helft
> tussen €25 en €48 · duurste entree €175 · gemeten over 228 gedateerde
> clubavonden bij 10 clubs

---

## De mail

Kort houden. Een redactie leest de eerste twee regels en beslist dan. Het getal
hoort in de onderwerpregel, niet in alinea drie.

### Engels (UK, VS, internationaal)

> **Onderwerp:** Most Ibiza club nights now cost under €40 — measured across
> [N] dated nights
>
> Hi [naam],
>
> We sell club tickets on Ibiza and we publish what they actually cost, measured
> from our ticketing partner's live agenda rather than estimated: [N] dated club
> nights across [X] venues, [periode]. The median cheapest entry is €[M], and
> [P]% of nights are under €40 — against a general impression that Ibiza starts
> at €80.
>
> Full table per club, with the method and the measurement date:
> https://www.ibizamivida.com/en/ibiza-prices
>
> Happy to break it down per club or per month if that's useful.
>
> [naam] — Ibiza mi Vida

### Nederlands

> **Onderwerp:** Ibiza-clubentree gemeten: mediaan €[M] over [N] avonden
>
> Hoi [naam],
>
> Wij verkopen clubtickets op Ibiza en publiceren wat ze werkelijk kosten,
> gemeten uit de live agenda van onze ticketpartner in plaats van geschat: [N]
> gedateerde clubavonden bij [X] clubs, [periode]. De mediane goedkoopste
> entree is €[M] en [P]% van de avonden zit onder de €40 — terwijl het beeld
> is dat Ibiza bij €80 begint.
>
> Volledige tabel per club, met methode en meetdatum:
> https://www.ibizamivida.com/en/ibiza-prices
>
> Uitsplitsing per club of per maand kan ik zo aanleveren.
>
> [naam] — Ibiza mi Vida

**Wat er níét in staat en waarom:** geen bijlage (die wordt niet geopend), geen
persbericht-opmaak, geen "exclusief voor u", geen aanbod van een gratis
verblijf. Dat laatste is bij de meeste redacties een reden om niet te
antwoorden, en bij sommige een reden om te publiceren dát je het aanbood.

---

## Wie je mailt

Geen adressenlijst hier: redactieadressen wisselen en een verouderd adres in een
document is erger dan geen adres. Zoek per titel de **travel desk** of de
journalist die dit seizoen over Ibiza schreef — die naam staat onder het stuk,
en het adres staat meestal op de contactpagina of in hun bio.

Waar dit soort cijfers landt:

| Markt | Type titel |
| --- | --- |
| VK | landelijke tabloids (travel), consumentenreis-secties, dance-media |
| NL | reisredacties van de landelijke dagbladen, uitgaans- en dancetitels |
| DE / ES | reisbijlagen, plus de Spaanse regionale pers op Ibiza zelf |
| Internationaal | dance- en clubmedia, reisplatforms met een nieuwsredactie |

Begin klein. Vijf goed gekozen mails naar mensen die aantoonbaar over Ibiza
schrijven, werken beter dan vijftig naar een algemeen redactieadres.

---

## Wat je daarna doet

- **Antwoordt iemand met een vraag om detail?** Lever het per ommegaande. Een
  uitsplitsing per club of per maand is een kwestie van de tabel kopiëren.
- **Wordt het overgenomen zonder link?** Vraag er één keer vriendelijk om, met
  het argument dat de methode online staat en de lezer het kan narekenen.
- **Verandert het cijfer sterk?** Dat is op zichzelf weer een verhaal
  ("clubentree op Ibiza dit seizoen X% hoger dan vorig jaar") — maar alleen als
  je de oude meting hebt bewaard. Zie hieronder.

---

## Wat hier nog ontbreekt

De pagina meet het **huidige** seizoen en herrekent zichzelf. Er is geen
seizoensarchief, dus "X% duurder dan vorig jaar" kunnen we niet onderbouwen —
en dat is juist de sterkste vorm van dit verhaal. Dat kan pas na een tweede
seizoen, en dan alleen als er nu iets bewaard wordt.

Wat er wél loopt is iets anders, en op termijn misschien nog beter.
`scripts/price-snapshot.mjs` draait elke ochtend en legt per event vast wat er
met de prijs gebeurt (één basisstand plus een append-only regel per wijziging,
zie `price-snapshot.yml`). Dat beantwoordt niet "wat kost een avond" maar
**"is het goedkoper om vroeg te boeken?"** — een vraag die iedereen stelt en
die niemand met data kan beantwoorden, omdat je er een jaar aan waarnemingen
voor nodig hebt.

Zodra daar een seizoen in zit is dat een tweede pitch, met een sterker verhaal
dan deze: niet wat iets kost, maar hoe het beweegt. Let wel op de
kanttekening die in het script zelf staat — clubprijzen springen in stappen
die de club zet (een early-bird die opraakt, een tier die omklapt), niet als
een koers die vanzelf oploopt. Loopt eruit dat er nauwelijks iets beweegt, dan
is dát het antwoord, en ook dat kan niemand anders aantonen.
