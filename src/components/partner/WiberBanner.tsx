'use client'

import { useEffect, useState } from 'react'
import { getConsent, CONSENT_EVENT } from '@/lib/consent'
import { WIBER_URL } from '@/lib/partners'

/**
 * De officiële Awin-banner van Wiber (creative 4715895, 468x60).
 *
 * ── Waarom dit een client-component is, terwijl bijna niets dat hier is ───
 * De banner-afbeelding komt van awin1.com/cshow.php. Dat is bij Awin één en
 * hetzelfde verzoek voor twee dingen: het levert de creative én registreert de
 * vertoning. Een verzoek naar een derde partij dat bij elke paginaweergave
 * afgaat en daar een identifier bij zet, heeft toestemming nodig — dus rendert
 * hij pas als die er is, en nooit ervoor.
 *
 * De ruil is dat een crawler zonder JavaScript hem niet ziet. Dat is hier de
 * juiste kant om op te vallen: de banner is reclame, geen inhoud. Alles wat
 * geïndexeerd moet worden — de kop, de tekst, de prijzen en de directe knop
 * naar Wiber — staat server-gerenderd op dezelfde pagina en blijft staan
 * ongeacht wat de bezoeker kiest.
 *
 * ── Waarom hij geen ruimte reserveert die hij misschien niet vult ─────────
 * Zolang er geen toestemming is rendert hij `null` in plaats van een lege doos
 * van 468x60. Hij staat onder de vouw in een blok dat al inhoud heeft, dus er
 * verschuift niets boven hem als hij alsnog verschijnt.
 */
export function WiberBanner({ className = '' }: { className?: string }) {
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    const read = () => setGranted(getConsent() === 'granted')
    read()
    window.addEventListener(CONSENT_EVENT, read)
    return () => window.removeEventListener(CONSENT_EVENT, read)
  }, [])

  if (!granted) return null

  return (
    <a
      href={WIBER_URL}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={`inline-block max-w-full ${className}`}
    >
      {/* De afmetingen staan erop omdat Awin ze vastlegt: 468x60. Ze meegeven
          voorkomt dat de regel eronder verspringt zodra het plaatje binnen is. */}
      <img
        src="https://www.awin1.com/cshow.php?s=4715895&v=124596&q=598784&r=3064911"
        alt="Wiber Rent a Car — all-inclusive car rental in Spain"
        width={468}
        height={60}
        className="h-auto w-full max-w-[468px] rounded-lg border border-black/10"
        loading="lazy"
        decoding="async"
      />
    </a>
  )
}
