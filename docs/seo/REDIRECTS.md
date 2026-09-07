# Redirects — wat de code doet en wat Vercel moet doen

## In de code (`src/middleware.ts`)

| Van | Naar | Code | Waarom |
|---|---|---|---|
| `ibizamivida.com/*` | `www.ibizamivida.com/*` | 308 | Kaal domein en www zijn dezelfde site; allebei 200 serveren maakt er twee van voor Google. Alleen wanneer het verschil precies `www.` is, dus previews en localhost blijven met rust. |
| `ibizamivida.es/*`, `www.ibizamivida.es/*` | `www.ibizamivida.com/*` | 308 | **Nieuw.** Zonder deze regel kreeg het .es-domein alleen de noindex-header: dat houdt het uit de index, maar laat een bezoeker op een dood spoor staan en geeft de linkwaarde aan niemand door. |
| Elke andere host (`*.vercel.app`) | — | — | `X-Robots-Tag: noindex, nofollow`. Een preview-deployment is een volledige kopie van de site op een host die we niet beheren. |
| `/<pad>` zonder taal | `/<taal>/<pad>` | 307 + `Vary` | De bestemming hangt af van wie het vraagt (cookie → Accept-Language → land → `en`), dus nooit permanent en nooit cachebaar zonder `Vary`. |
| `/<taal>/<slug-van-andere-taal>` | `/<taal>/<eigen-slug>` | 301 | Vergelijkt **slugs**, niet talen: sommige routes gebruiken bewust in alle talen dezelfde slug, en een guard op "gevonden onder een andere taal" gaf een oneindige lus. |
| Slug van een route die in deze taal niet bestaat | de taal waarin hij wél bestaat | 301 | Leest `ROUTE_LOCALES`, niet alleen `ROUTE_SLUGS`. Alleen de eerste lezen stuurde 28 URL's permanent naar een 404. |
| Samengevoegde routes (`MERGED_INTO`) | de opvolger | 301 | `guestlist-hub` → `/guestlist`, `boat-rental` → `/boats`. |

## In de routes zelf

`/boat-rental-ibiza` en de vier vertaalde slugs, plus `/ibiza-guestlist`,
`/ibiza-tips` en de andere teruggetrokken pagina's, doen een
`permanentRedirect()` (308) uit `next/navigation`. **Niet** `redirect()`, dat
geeft 307 en dan consolideert Google de linkwaarde niet.

## Wat de code níét kan (human-taken)

Een host-redirect die de applicatie niet eens bereikt is sneller en goedkoper
dan een middleware-hop. Het nette adres voor `ibizamivida.es` en het kale
`ibizamivida.com` is daarom het Vercel-dashboard:

1. Vercel → Project → Settings → Domains
2. Voeg `ibizamivida.es` en `www.ibizamivida.es` toe als **Redirect** naar
   `www.ibizamivida.com`, met "Redirect path" aan zodat het pad behouden blijft.
3. Idem voor het kale `ibizamivida.com`.

De middleware-regels hierboven blijven staan als vangnet — ze doen niets zodra
Vercel het verzoek al afvangt, en ze vangen het wél als iemand een domein
verplaatst.

## Testen

```bash
npm run build && npx next start &
curl -sI -H 'Host: ibizamivida.es' http://localhost:3000/en/boats | head -3
curl -sI http://localhost:3000/nl/pacha-ibiza | head -3   # 301 → /en/pacha-ibiza
curl -sI http://localhost:3000/boats | head -3            # 307 → /<taal>/boats
```

Let op: `next start` blijft na een rebuild de óude build serveren en het proces
heet `next-server`. Zoek het via `/proc/*/cwd` en kill het vóór je gaat
debuggen — dit heeft hier al een keer een uur gekost.
