# Trustpilot koppelen

Waarom: Trustpilot is een onafhankelijke derde die bevestigt dat Ibiza Mi Vida
bestaat en levert. Antwoordmachines (Perplexity, ChatGPT) wegen zo'n
bevestiging zwaarder dan wat we over onszelf schrijven, en een profiel met
echte, recente reviews is een van de bronnen die ze noemen als iemand vraagt
"is X betrouwbaar". Voor Google en Gemini blijft het Google Bedrijfsprofiel de
hoofdbron; Trustpilot is de tweede stem, niet de vervanging.

## 1. Profiel claimen (20 minuten)

1. https://business.trustpilot.com → "Claim your free account", domein
   `ibizamivida.com`.
2. Bedrijfsnaam exact `Ibiza Mi Vida` — dezelfde schrijfwijze als op de site,
   in het Google-profiel en in `sameAs`. Geen zoekwoorden in de naam.
3. Website `https://www.ibizamivida.com` (mét www).
4. Categorie: *Travel Agency*; secundair *Boat Rental Service* als beschikbaar.
5. Omschrijving: gebruik de "Medium"-boilerplate uit `docs/authority-plan.md`
   §1 letterlijk. Consistentie over profielen heen is hoe een entiteit als één
   ding herkend wordt.
6. Verifieer via de e-mail op het domein of de DNS-record die Trustpilot
   voorstelt.

Het gratis plan volstaat om te beginnen: reviews verzamelen, beantwoorden en
het profiel publiek maken kan zonder betaald abonnement.

## 2. In de code: één regel in Vercel

Zet in Vercel → Environment Variables (Production):

```
NEXT_PUBLIC_TRUSTPILOT_URL=https://www.trustpilot.com/review/ibizamivida.com
```

en redeploy. `src/lib/profiles.ts` zet de URL dan in `sameAs` van het
Organization-schema op elke pagina. Meer is er niet nodig om de koppeling voor
zoekmachines en taalmodellen te leggen. Laat de variabele leeg tot het profiel
echt bestaat: een `sameAs` naar een lege of niet-geclaimde pagina is een
verwijzing naar niets.

## 3. Reviews vragen — dezelfde regels als bij Google

`docs/review-flow.md` geldt onverkort: geen incentives, nooit filteren op
tevreden klanten (review gating — verboden bij Trustpilot én Google), nooit
zelf schrijven, één keer vragen, de dag erna. Trustpilot controleert actief op
uitnodigingspatronen; een profiel dat alleen vijfsterrenreviews via
handgekozen uitnodigingen verzamelt krijgt een waarschuwingsbanner.

Praktisch: kies één kanaal per klant. Wie je een Google-link stuurt, stuur je
geen Trustpilot-link — twee verzoeken na één boeking leest als spam en
converteert slechter dan één.

## 4. Reviews op de site tonen — wat wél en niet

**Niet:** de TrustBox-widget als enige weergave. Die is een extern script dat
pas na JavaScript rendert. Een crawler zonder JS (dat zijn de AI-crawlers) ziet
niets, en het script laadt bij elke bezoeker een third-party resource vóór
toestemming — dat is een consentvraag.

**Wél, als we het doen:** server-side ophalen via de officiële Trustpilot
Business API (vereist een betaald plan met API-toegang), gecachet, en gerenderd
zoals `src/lib/google-reviews.ts` dat voor Google doet: niets tonen zonder
echte data, geen standaardwaarde, geen placeholder. De publieke profielpagina
scrapen is tegen de voorwaarden van Trustpilot en doen we niet.

**Schema.** Geen `AggregateRating` op basis van Trustpilot tenzij hij live uit
de API komt, en nooit Google- en Trustpilot-cijfers samenvoegen tot één getal.
Weet ook: Google rekent een rating op `Organization`/`LocalBusiness` die van
een reviewsite komt niet mee voor rich results (het "self-serving"-beleid). De
waarde van Trustpilot zit dus in de entiteitsbevestiging en in wat de
antwoordmachines lezen, niet in sterren in Google.

## 5. Volgorde

1. Profiel claimen en verifiëren (nu).
2. Env-variabele zetten, redeploy, controleren dat de URL in `sameAs` staat:
   ```bash
   curl -s https://www.ibizamivida.com/en | grep -o 'trustpilot[^"]*'
   ```
3. Eerste tien echte reviews via het reguliere reviewproces.
4. Pas daarna beslissen of een betaald plan met API-toegang het waard is om de
   reviews ook op de site te tonen.
