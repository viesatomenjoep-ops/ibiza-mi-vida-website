'use client'

import { useEffect, useState } from 'react'
import { getConsent, CONSENT_EVENT } from '@/lib/consent'

const GA_ID = 'G-QQ9CRE658P'
const IMPACT_SRC = 'https://utt.impactcdn.com/P-A7702481-c71c-450b-a591-dc158e54c54e1.js'

/**
 * Laadt Google Analytics en Impact, maar pas na toestemming.
 *
 * ── Wat hier veranderde ───────────────────────────────────────────────────
 * Beide snippets stonden onvoorwaardelijk in de <head>, dus ze draaiden bij
 * iedereen vanaf de eerste pixel — inclusief bezoekers uit Nederland, Duitsland,
 * Spanje en Frankrijk. Impact meldt in zijn eigen dialoog dat de vastgelegde
 * data met adverteerders gedeeld kan worden. Zonder toestemmingsmechanisme was
 * dat een probleem dat alleen maar groeide met elke tracker die erbij kwam.
 *
 * ── Eén ding om in de gaten te houden ─────────────────────────────────────
 * Impact verifieert site-eigendom door de homepage op te halen en het snippet
 * in de HTML te zoeken. Dat snippet staat nu niet meer in de server-HTML: het
 * wordt pas na toestemming geïnjecteerd. De verificatie is al doorlopen, dus
 * dat is nu geen probleem — maar vraagt Impact ooit om herverificatie, dan
 * faalt die en moet het snippet tijdelijk terug in de layout.
 *
 * ── Waarom injectie en geen next/script ───────────────────────────────────
 * next/script met een voorwaarde eromheen werkt, maar de strategieën gaan over
 * wanneer in de laadcyclus iets komt, niet over of het mag. Hier is de vraag
 * uitsluitend "of", en dat is met een gewone injectie het duidelijkst te lezen.
 *
 * Injecteert precies één keer, ook als de toestemmingsgebeurtenis meerdere
 * keren langskomt of de gebruiker van gedachten verandert en terugkeert.
 */
export function ConsentScripts() {
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    const sync = () => setGranted(getConsent() === 'granted')
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [])

  useEffect(() => {
    if (!granted) return

    // Google Analytics 4
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      const loader = document.createElement('script')
      loader.async = true
      loader.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      document.head.appendChild(loader)

      const init = document.createElement('script')
      init.textContent =
        `window.dataLayer = window.dataLayer || [];` +
        `function gtag(){dataLayer.push(arguments);}` +
        `gtag('js', new Date());` +
        `gtag('config', '${GA_ID}');`
      document.head.appendChild(init)
    }

    // Impact affiliate-tracking. transformLinks herschrijft uitgaande links,
    // trackImpression telt de pageview.
    if (!document.querySelector(`script[src="${IMPACT_SRC}"]`)) {
      const boot = document.createElement('script')
      boot.textContent =
        `(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};` +
        `t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;` +
        `z.parentNode.insertBefore(t,z)})('${IMPACT_SRC}','script','impactStat',document,window);` +
        `impactStat('transformLinks');impactStat('trackImpression');`
      document.body.appendChild(boot)
    }
  }, [granted])

  return null
}
