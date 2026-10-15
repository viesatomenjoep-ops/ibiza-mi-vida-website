# Cover-It BV — webshop (prototype)

Statische webshop voor **Cover-Plast krimpfolie** en montagemateriaal, gebouwd
op de huisstijl van ibizamivida.com (Outfit + Inter, wit/albast met zwart en
het Cover-It-blauw als accent, gestapelde "werelden", foto-sliders).

Eén bestand, geen build: `index.html` bevat alle CSS en JavaScript.

## Deployen op Vercel (één keer, ~2 minuten)

1. Ga naar <https://vercel.com/new> en log in.
2. Kies **Import Git Repository** → selecteer deze repo (`cover-it-webshop`).
3. Framework Preset: **Other**. Build Command en Output Directory **leeg laten**
   (het is een statische site; `vercel.json` staat al klaar).
4. Klik **Deploy**. Elke push naar `main` deployt daarna automatisch.
5. Eigen domein: Project → Settings → Domains → `cover-it.be` toevoegen en de
   DNS-records overnemen die Vercel toont.

## Foto's toevoegen (de galerij, de hero-slider en de productkaarten)

Zet de projectfoto's van de huidige galerij in `gallery/` als `01.jpg` … `36.jpg`,
in de volgorde van de galerijpagina (rij per rij, links naar rechts). De
bijschriften en de indeling per toepassing staan in `GALLERY` in `index.html`;
pas ze aan waar een foto iets anders toont dan het bijschrift zegt.

- Ontbreekt een bestand, dan toont de kaart een grijs weefselvlak (geen kapot
  beeld).
- Aanbevolen: JPEG, langste zijde 1600 px, max. ~300 kB per foto.
- Het logo staat als SVG in de pagina (`<symbol id="logo">`); vervang het door
  het originele bestand als vectorbestand beschikbaar is.

## Wat nog echt moet worden vóór livegang

- **Prijzen**: staan bewust niet op de site; alle producten gaan via de offertemand.
- **Offertemand**: werkt volledig client-side (localStorage) en verstuurt nog
  niets. Koppel `#placeOrder` aan een formulierdienst of mailserver zodat de
  aanvraag met de gekozen producten bij Cover-It binnenkomt.
- **Formulieren**: het aanvraagformulier (`#customForm`) verstuurt nog niets;
  koppel het aan Formspree, Vercel Functions of uw mailserver.
- **Reviews**: de drie klantquotes en het Google-cijfer zijn voorbeeldtekst.
  Vervang door echte beoordelingen of haal de sectie weg.
- **Contactgegevens** in de footer (adres, telefoon, btw-nummer).

## Structuur van de pagina

Header (doorzichtig op de hero, wit bij scrollen) · hero met fotoslider ·
categorieën · bestsellers · vier werelden (standaard folie, brandvrije folie,
montagemateriaal, toepassingen) met productrail en kiezer · certificatenstrook ·
foto galerij (grote slider, filters, duimnagels, carrousels per toepassing,
lightbox) · waarom Cover-It · reviews · op aanvraag · populair · FAQ · footer ·
winkelmand (drawer met checkout-flow) · schermvullend menu.
