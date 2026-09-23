# DNS en e-mail — ibizamivida.com

De DNS van `ibizamivida.com` wordt beheerd **bij Vercel**, niet bij de
registrar en niet bij Hostinger. De mailbox draait bij **Hostinger Mail**. Dat
betekent dat Hostinger je vertelt wélke records je nodig hebt, en dat je ze
vervolgens in Vercel invoert — de "Check status"-knop in het Hostinger-paneel
leest daarna gewoon de publieke DNS uit.

Dit bestand legt vast wat er staat en waarom, zodat het bij een verhuizing of
een storing terug te vinden is in plaats van alleen in twee dashboards.

> **Stand van zaken (2026-09-16).** Alle records staan en zijn uitgelezen uit
> de publieke DNS, niet overgetypt uit een dashboard. Eén SPF-record, geen
> conflict. Zie [De records](#de-records-zoals-ze-in-dns-staan).

---

## Waar je moet zijn in Vercel

Vercel → bovenin **Domains** (op team-/accountniveau) → `ibizamivida.com` →
tabblad **DNS Records** → **Add Record**.

Dit is een ándere plek dan Project → Settings → Domains. Daar koppel je een
domein aan een project; de DNS-records zelf beheer je op accountniveau.

**Laat het Name-veld leeg voor het hoofddomein.** Hostinger schrijft `@`, en dat
is de juiste notatie bij de meeste providers, maar in Vercel is leeg de invoer
voor de apex — `@` wordt daar als letterlijke subdomeinnaam gelezen en levert
dan een record op `@.ibizamivida.com` op, dat niets doet.

Het Priority-veld verschijnt pas nadat je Type op `MX` hebt gezet.

Via de CLI kan het ook:

```bash
vercel dns add ibizamivida.com "" MX mx1.hostinger.com 5
vercel dns add ibizamivida.com "" MX mx2.hostinger.com 10
vercel dns ls ibizamivida.com     # controleer de hele zone in één overzicht
```

---

## Mail ontvangen — MX

Bron: Hostinger → Emails → ibizamivida.com → Domain settings, afgelezen op
2026-09-16.

| Name | Type | Value | Priority | TTL |
| --- | --- | --- | --- | --- |
| *(leeg)* | MX | `mx1.hostinger.com` | 5 | standaard |
| *(leeg)* | MX | `mx2.hostinger.com` | 10 | standaard |

Hostinger noemt TTL 14400. Dat is een suggestie, geen eis; de standaard-TTL van
Vercel voldoet en een lagere TTL is tijdens het instellen juist praktischer,
omdat een fout dan sneller te herstellen is.

De twee prioriteiten zijn geen smaak: 5 gaat vóór 10, dus `mx2` is de uitwijk
als `mx1` niet antwoordt. Zet je ze gelijk, dan verdeelt verzendende mail zich
willekeurig over allebei.

---

## Mail verzenden — SPF, DKIM, DMARC

Zonder deze drie komt uitgaande mail van `@ibizamivida.com` bij Gmail en Outlook
in de spammap. Ontvangen werkt dan wél, dus het is een storing die je pas
maanden later opmerkt — meestal doordat een klant zegt dat hij niets gehoord
heeft.

Deze drie staan sinds 16-09-2026; de gecontroleerde waarden staan onderaan bij
[De records](#de-records-zoals-ze-in-dns-staan). Moet je ze ooit opnieuw
zetten: neem ze **letterlijk over van het Hostinger-paneel** en niet uit dit
document — DKIM is per account uniek en de SPF-include verschilt per
Hostinger-platform, dus een waarde uit een handleiding is een gok.

### De regel die alles stilletjes breekt

**Een domein mag precies één SPF-record hebben.** Bestaat er al een TXT-record
op het hoofddomein dat met `v=spf1` begint, dan zet je er géén tweede naast —
twee SPF-records maken ze allebei ongeldig en dan gaat *alle* uitgaande mail
naar spam. Je moet de includes dan samenvoegen tot één regel, bijvoorbeeld:

```
v=spf1 include:<bestaande> include:<hostinger> ~all
```

Controleer dit vóór je iets toevoegt:

```bash
dig +short TXT ibizamivida.com | grep spf1
```

Komt er meer dan één regel terug, dan is dát het probleem en niet wat je nog
wilde toevoegen. Op 16-09-2026 gecontroleerd: precies één.

---

## Wat je niet aanraakt

- **De A- en CNAME-records die de site naar Vercel wijzen.** MX gaat alleen over
  mail; de website staat er los van. Aan een van deze twee sleutelen om een
  mailprobleem op te lossen haalt de site offline.
- **Het TXT-record `google-site-verification=…` op het hoofddomein.** Dat is de
  eigendomsverificatie van de Search Console domain-property. Weg = property
  weg. Zie `docs/search-setup.md`.

Een domein mag meerdere TXT-records op `@` hebben; ze bestaan naast elkaar. De
enige uitzondering is SPF, zie hierboven.

---

## Controleren

```bash
dig +short MX ibizamivida.com          # verwacht: mx1 (5) en mx2 (10)
dig +short TXT ibizamivida.com         # SPF, Google-verificatie, DMARC
dig +short TXT _dmarc.ibizamivida.com  # het DMARC-beleid
```

Daarna in het Hostinger-paneel op **Check status** klikken. Propagatie duurt
meestal minuten, soms een uur; de TTL van het vórige record bepaalt hoe lang een
resolver de oude waarde vasthoudt.

Een echte eindtest is een mail sturen naar een Gmail-adres en daar
**Origineel weergeven** openen: bovenin staan `SPF`, `DKIM` en `DMARC` met
`PASS` of `FAIL`. Dat is het enige antwoord dat telt — een record dat er goed
uitziet in DNS kan alsnog falen op een detail in de waarde.

---

## De records zoals ze in DNS staan

Uitgelezen op 2026-09-16 rechtstreeks uit de publieke DNS (8.8.8.8), niet
overgenomen uit een dashboard — een dashboard toont wat je hebt ingevoerd, DNS
toont wat de wereld ziet.

| Doel | Name | Type | Waarde |
| --- | --- | --- | --- |
| Mail ontvangen | *(leeg)* | MX | `mx1.hostinger.com` (prio 5) |
| Mail ontvangen | *(leeg)* | MX | `mx2.hostinger.com` (prio 10) |
| SPF | *(leeg)* | TXT | `v=spf1 include:_spf.mail.hostinger.com ~all` |
| DKIM | `hostingermail-a._domainkey` | CNAME | `hostingermail-a.dkim.mail.hostinger.com` |
| DKIM | `hostingermail-b._domainkey` | CNAME | `hostingermail-b.dkim.mail.hostinger.com` |
| DKIM | `hostingermail-c._domainkey` | CNAME | `hostingermail-c.dkim.mail.hostinger.com` |
| DMARC | `_dmarc` | TXT | `v=DMARC1; p=none` |
| Search Console | *(leeg)* | TXT | `google-site-verification=AoBrbYVxJ6T4lg…` |

**Eén SPF-record, geen conflict.** Dat is gecontroleerd: het hoofddomein heeft
twee TXT-records, waarvan er precies één met `v=spf1` begint. De tweede is de
Search Console-verificatie en die mag daar naast staan.

**Over de drie DKIM-selectors.** `b` en `c` geven een DKIM-record terug met een
lege `p=`, oftewel geen publieke sleutel. Dat is bij Hostinger normaal: het zijn
reserveselectors voor sleutelrotatie en er is er één tegelijk actief. Selector
`a` kon hier niet uitgelezen worden — een 2048-bits sleutel past niet in één
UDP-pakket en TCP-DNS is vanuit deze omgeving geblokkeerd. Dat is dus géén
bevinding dat de sleutel ontbreekt; de eindtest hieronder geeft het antwoord.

**`p=none` in DMARC is de juiste startstand.** Het betekent: rapporteer, maar
doe niets met mail die faalt. Pas verscherpen naar `quarantine` of `reject`
nadat je een paar weken hebt gezien dat legitieme mail consequent slaagt —
strenger beginnen betekent dat je eigen facturen en bevestigingen verdwijnen
zonder dat iemand het merkt.

## Nog te doen

- De eindtest draaien: stuur een mail vanaf `@ibizamivida.com` naar een
  Gmail-adres, open daar **Origineel weergeven** en kijk of `SPF`, `DKIM` en
  `DMARC` alle drie op `PASS` staan. Dat is het enige antwoord dat telt, en
  meteen de controle op DKIM-selector `a`.
- Overweeg `rua=` toe te voegen aan het DMARC-record (een mailadres dat de
  rapporten ontvangt). Zonder dat veld meet `p=none` wel, maar krijg je de
  uitkomst nergens te zien.
- Noteer hier welke andere verzenders ooit in de SPF-include moeten
  (nieuwsbrief, formulieren, boekingsbevestigingen). Dat is het lijstje dat
  niemand nog weet op het moment dat er een verzender bij moet.
