# Vindbaarheidsplan — Boat charters, private boats, guestlist, Ferry Ibiza

Doel: gevonden worden op deze vier diensten in Google **en** in AI-assistenten
(ChatGPT, Gemini, Perplexity, Claude).

Laatst bijgewerkt: 29 augustus 2026.

---

## Waar we nu staan (gemeten, niet geschat)

| Pagina | Woorden | Schema | FAQ | Links vanaf homepage |
|---|---|---|---|---|
| `/private-boat-charters` | 2.092 | Service ✅ | ❌ | ✅ |
| `/ferry-formentera` | 4.179 | Service ✅ | ❌ | ✅ |
| `/boat-party` | 3.990 | Service ✅ | ❌ | **0** |
| `/boats` | 1.125 | Service ✅ | ❌ | **0** |
| `/guestlist` | 1.653 | Service + FAQ ✅ | ✅ | ✅ |

Technische basis is op orde: sitemap valide, `llms.txt` aanwezig, AI-crawlers
expliciet toegelaten in `robots.txt`, Lighthouse SEO 100, performance 94.

**De conclusie die hieruit volgt:** het probleem is niet de hoeveelheid content.
Het is dat de content geen *aantoonbare, unieke feiten* bevat die een AI kan
citeren, en dat er buiten de site vrijwel niets naar ons wijst.

---

## Waarom "meer tekst schrijven" niet meer werkt

Gemini's advies dat je stuurde is correct maar onvolledig op één punt, en dat
punt is precies waar het bij jou misgaat.

Een AI-assistent citeert een bron als die bron **iets weet wat elders niet
staat**. Onze huidige teksten zijn goed geschreven, maar bevatten uitsluitend
informatie die op honderd andere Ibiza-sites óók staat. Er is geen enkele reden
voor ChatGPT om juist ons te noemen.

Dat is wat E-E-A-T echt meet: **Experience** (heb je het zelf meegemaakt),
**Expertise**, **Authoritativeness**, **Trust**. Van die vier scoren we nu
alleen matig op de laatste twee, en op *Experience* helemaal niet — terwijl dat
juist de makkelijkste is om te winnen, omdat Simon fysiek op het eiland zit en
de concurrentie grotendeels doorverkopende affiliates zijn.

---

## Deel 1 — Echte waarde toevoegen (E-E-A-T)

Dit is de kern. Elk item hieronder is informatie die **alleen wij kunnen
leveren** omdat we ter plaatse zitten.

### 1.1 Feitentabellen bovenaan elke dienstpagina

AI-modellen halen antwoorden uit strakke feiten, niet uit lopende tekst. Boven
elke dienstpagina komt een compact blok:

**Ferry Ibiza → Formentera**
| | |
|---|---|
| Overtocht | 25–35 min (snelboot) |
| Vertrekhaven | Ibiza-stad, Marina Botafoch |
| Aanbieders | (concrete namen) |
| Eerste afvaart | (tijd) |
| Laatste terugvaart | (tijd) |
| Prijsindicatie retour | € … |
| Seizoen | (maanden) |

**Privéboot Ibiza**
| | |
|---|---|
| Vaartijd | halve dag (4u) / hele dag (8u) |
| Vertrek vanaf | (marina's) |
| Capaciteit | … personen |
| Met/zonder kapitein | … |
| Prijsindicatie vanaf | € … per dag |
| Inbegrepen | brandstof, ijs, snorkelspullen … |

Deze getallen moeten kloppen. Een verzonnen prijs in schema-markup is een
overtreding en kost meer dan het oplevert.

### 1.2 FAQ's met échte antwoorden — de grootste AI-hefboom

Dit is wat Gemini terecht noemt, en het is de goedkoopste winst die er ligt.
LLM's citeren letterlijk vraag-antwoordparen. `/guestlist` heeft ze al; de vier
bootpagina's niet.

Per pagina 6–10 vragen, met FAQ-schema. Geen algemeenheden — vragen die mensen
écht stellen en die wij écht kunnen beantwoorden:

- *"Heb ik een vaarbewijs nodig om zelf een boot te huren op Ibiza?"*
- *"Hoe laat vaart de laatste ferry terug van Formentera naar Ibiza?"*
- *"Kan ik een privéboot boeken voor minder dan 8 personen?"*
- *"Wat kost een boat party op Ibiza gemiddeld?"*
- *"Is de zee rond Es Vedrà in september nog warm genoeg om te zwemmen?"*
- *"Wat gebeurt er als het te hard waait op mijn geboekte dag?"*

Die laatste twee zijn het soort vraag waar geen enkele concurrent antwoord op
geeft — en precies daarom worden ze geciteerd.

### 1.3 Aantoonbare ervaring ("Experience")

- **Auteursvermelding.** Zet Simon met naam, foto en functie op de
  dienstpagina's, gekoppeld aan `Person`-schema en `author` op de pagina. Nu
  spreekt de site met een anonieme merkstem — dat is het zwakste signaal dat er
  is.
- **Wat je zelf hebt gedaan.** "Wij varen deze route zelf wekelijks" is alleen
  geloofwaardig met bewijs: eigen foto's (geen stockbeeld), namen van baaien,
  aanlegplekken die je zelf gebruikt.
- **Eerlijk zijn over nadelen.** Een zin als *"Bij noordenwind is Cala Salada
  onbereikbaar; we wijken dan uit naar …"* is het sterkste E-E-A-T-signaal dat
  bestaat, omdat het aantoont dat je er daadwerkelijk vaart. Marketingteksten
  zeggen dit nooit.
- **Geen verzonnen reviews.** Ik heb de hardcoded "4,9 sterren / 127 reviews"
  standaardwaarde uit `LocalBusinessSchema` verwijderd. Reviewschema mag alleen
  terug met echte, verifieerbare cijfers.

### 1.4 Ontbrekende dienstpagina's

Er is geen pagina voor **"boat charter Ibiza"** als losse term, terwijl dat een
van je vier doelwoorden is. `/boats` (1.125 woorden) is de dunste pagina van de
vijf en is feitelijk een lijst. Die verdient dezelfde opbouw als
`/private-boat-charters`.

---

## Deel 2 — Techniek op de site (ik kan dit uitvoeren)

| # | Actie | Waarom | Tijd |
|---|---|---|---|
| 1 | FAQ-content + FAQ-schema op de 4 bootpagina's | Grootste AI-citatiehefboom | 1–2 u |
| 2 | Feitentabellen bovenaan elke dienstpagina | Directe feiten = citeerbaar | 1 u |
| 3 | H1's met de doelwoorden erin | "Private Boat Charters" mist "Ibiza"; idem "Formentera Ferry", "Boat Party" | 15 min |
| 4 | Interne links vanaf de homepage naar `/boats` en `/boat-party` | Krijgen nu **nul** links; Google leidt belang af uit interne links | 15 min |
| 5 | `Person`-schema voor Simon + auteursvermelding | Enige echte E-E-A-T-signaal dat we missen | 30 min |
| 6 | `.es` laat nu `/nl` zien | Spaanse bezoekers en crawlers krijgen de verkeerde taal | 30 min |
| 7 | Geplande her-sync van ClubTickets | Data was 8 weken oud en veroorzaakte 404's; gebeurt weer | 30 min |

---

## Deel 3 — Buiten de site (alleen jij kunt dit)

Hier moet ik eerlijk zijn: **deel 2 maakt je vindbaar, deel 3 maakt je
geciteerd.** AI-assistenten noemen bij voorkeur bedrijven die ze elders
bevestigd zien. Zonder dit blijft het effect van al het bovenstaande beperkt.

### 3.1 Google Business Profile — begin hier
De grootste enkele hefboom, en hij raakt Google én AI tegelijk: assistenten
putten voor lokale bedrijven uit ditzelfde ecosysteem. Zonder profiel besta je
niet in "boat charter Ibiza"-achtige vragen.
Categorieën: *Boat rental service* + *Tour agency*. Servicegebied Ibiza +
Formentera. Zelfde omschrijving als in `llms.txt`. ~30 minuten.

### 3.2 Consistente bedrijfsgegevens overal
Exact dezelfde naam, adres en telefoon (**+33 6 66 52 84 12**) op elke plek waar
je vermeld staat. Afwijkingen splitsen je entiteit op in de ogen van Google.

### 3.3 Vermeldingen en citaties
- TripAdvisor / Viator / GetYourGuide-vermelding
- Genoemd worden in Ibiza-gidsen en reisblogs (deel 1.2 geeft je iets om te
  pitchen: "wij hebben de enige actuele ferry-tijdentabel")
- Reddit `r/ibiza` — meedoen en echt helpen, niet spammen. LLM's zijn zwaar
  getraind op Reddit.
- Vraag tevreden klanten om een Google-review

### 3.4 Wat je *niet* moet doen
Gemini's suggestie om dagelijkse AI-blogposts te automatiseren: **niet doen.**
Honderd dunne, automatisch gegenereerde dagpagina's is precies het patroon
waarvoor Google's spambeleid rond schaalmatig gegenereerde content bestaat, en
het risico (handmatige straf) is groter dan de winst. Eén uitstekende
ferry-tijdentabel die daadwerkelijk klopt en wordt bijgehouden, verslaat
driehonderd gegenereerde posts.

---

## Volgorde

1. **Jij:** Google Business Profile aanmaken (30 min, grootste effect)
2. **Ik:** stap 2.1 t/m 2.4 — FAQ's, feitentabellen, H1's, interne links
3. **Jij:** feitelijke gegevens aanleveren voor de tabellen (tijden, prijzen,
   marina's) — zonder échte getallen kan ik dit niet correct invullen
4. **Ik:** stap 2.5 t/m 2.7
5. **Jij:** doorlopend — vermeldingen en reviews

## Hoe we resultaat meten

- Search Console → Prestaties, gefilterd op de vier doelwoorden, maandelijks
- Handmatig testen in ChatGPT/Gemini/Perplexity: *"Waar kan ik een privéboot
  huren op Ibiza?"* — noemen ze ons?
- Search Console → Indexering, letten op "Gevonden – niet geïndexeerd"

Realistische verwachting: Google 2–3 maanden, AI-assistenten 3–6 maanden
(die hebben trage trainings- en indexcycli).

---

## Openstaand beveiligingspunt

`/admin` heeft **geen authenticatie**, en migratie `016_fix_rls_custom_listings.sql`
geeft publiek INSERT/UPDATE/DELETE-rechten op `custom_listings`. Daarom heb ik
geweigerd het `robots.txt`-blok op `/admin` te verwijderen, ook al is dat de
standaard SEO-oplossing — dat zou een onbeveiligde admin-URL beter vindbaar
maken. Dit moet worden opgelost vóór er iets anders met `/admin` gebeurt.
