'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

const FALLBACK: Record<string, string> = {
  nl: 'Het dossier kon niet worden geladen.', en: 'The dossier could not be loaded.',
  de: 'Das Dossier konnte nicht geladen werden.', es: 'No se pudo cargar el dossier.',
  fr: 'Le dossier n’a pas pu être chargé.',
}
const OPEN_RAW: Record<string, string> = {
  nl: 'Open de PDF rechtstreeks', en: 'Open the PDF directly', de: 'PDF direkt öffnen',
  es: 'Abrir el PDF directamente', fr: 'Ouvrir le PDF directement',
}
const LOADING: Record<string, string> = {
  nl: 'Dossier laden…', en: 'Loading dossier…', de: 'Dossier wird geladen…',
  es: 'Cargando dossier…', fr: 'Chargement du dossier…',
}

/**
 * Het bootdossier als eigen content: elke PDF-pagina uitgetekend naar een
 * afbeelding, onder elkaar, volle breedte en gewoon scrollbaar.
 *
 * ── Waarom niet een ingebedde PDF ─────────────────────────────────────────
 * Dat was de vorige versie en die werkte niet. Een <object> met een PDF geeft
 * op iOS meestal alleen de eerste pagina, en op desktop krijg je de
 * PDF-werkbalk van de browser: een grijze balk met zoomknoppen, een
 * printicoon en de bestandsnaam. Dat oogt als een gedownload document van
 * iemand anders, niet als onze pagina — precies de indruk die we hier niet
 * willen wekken.
 *
 * Nu tekent pdf.js elke pagina naar een canvas. Wat de bezoeker ziet zijn
 * afbeeldingen in onze eigen opmaak: geen werkbalk, geen paginateller, geen
 * zoomknoppen. Scrollen doet hij zoals op elke andere pagina.
 *
 * ── Scherpte ──────────────────────────────────────────────────────────────
 * De schaal wordt berekend uit de werkelijke breedte van de container maal
 * devicePixelRatio, met een plafond van 2. Zonder dat plafond zou een telefoon
 * met DPR 3 een canvas van drie keer de breedte tekenen — op een A4-dossier is
 * dat tientallen megabytes geheugen per pagina en op oudere toestellen een
 * gegarandeerde crash. Met 2 is het verschil met 3 niet te zien.
 *
 * ── Waarom pagina voor pagina ─────────────────────────────────────────────
 * Elke pagina wordt getekend zodra hij klaar is en meteen getoond, in plaats
 * van wachten tot alle vier of negen klaar zijn. Bij een dossier van 9
 * pagina's scheelt dat seconden voordat er iets in beeld staat.
 *
 * Valt er iets om — pdf.js laadt niet, het bestand is corrupt (Bamba is een
 * leeg bestand) — dan verschijnt een nette melding met een link naar de kale
 * PDF. Nooit een blanco vlak.
 */
export function DossierPages({ src, locale, title }: { src: string; locale: string; title: string }) {
  const houder = useRef<HTMLDivElement>(null)
  const [pagina, setPagina] = useState<string[]>([])
  const [bezig, setBezig] = useState(true)
  const [mislukt, setMislukt] = useState(false)

  useEffect(() => {
    let dood = false
    const urls: string[] = []

    async function teken() {
      try {
        // Dynamische import: pdf.js is fors en hoort niet in de bundel van elke
        // pagina te zitten — alleen wie een dossier opent betaalt ervoor.
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

        const doc = await pdfjs.getDocument({ url: src }).promise
        if (dood) return

        const breedte = houder.current?.clientWidth || 900
        const dpr = Math.min(window.devicePixelRatio || 1, 2)

        for (let n = 1; n <= doc.numPages; n++) {
          if (dood) return
          const page = await doc.getPage(n)
          const basis = page.getViewport({ scale: 1 })
          const viewport = page.getViewport({ scale: (breedte / basis.width) * dpr })

          const canvas = document.createElement('canvas')
          canvas.width = Math.floor(viewport.width)
          canvas.height = Math.floor(viewport.height)
          const ctx = canvas.getContext('2d')
          if (!ctx) continue
          await page.render({ canvasContext: ctx, viewport }).promise
          if (dood) return

          const url: string = await new Promise((res) =>
            canvas.toBlob((b) => res(b ? URL.createObjectURL(b) : ''), 'image/jpeg', 0.86),
          )
          // Canvas meteen vrijgeven; anders houdt de browser bij een dossier
          // van negen pagina's negen volledige bitmaps in het geheugen.
          canvas.width = 0
          canvas.height = 0
          if (!url || dood) continue
          urls.push(url)
          setPagina((p) => [...p, url])
          setBezig(false)
        }
        if (!dood) setBezig(false)
      } catch {
        if (!dood) { setMislukt(true); setBezig(false) }
      }
    }

    teken()
    return () => {
      dood = true
      urls.forEach(URL.revokeObjectURL)
    }
  }, [src])

  return (
    <div ref={houder} className="w-full">
      {pagina.map((url, i) => (
        // Geen next/image: dit zijn blob-URLs die pas in de browser ontstaan,
        // en de optimalisatieserver kan daar niets mee. Wél expliciete
        // afmetingen via w-full + h-auto, zodat er geen sprong ontstaat.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={url}
          src={url}
          alt={`${title} — ${i + 1}`}
          className="mb-3 w-full rounded-2xl border border-black/10 shadow-sm"
        />
      ))}

      {bezig && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-neutral-50 py-16 text-sm font-semibold text-neutral-500">
          <Loader2 size={16} className="animate-spin" /> {LOADING[locale] || LOADING.en}
        </div>
      )}

      {mislukt && (
        <div className="rounded-2xl border border-black/10 bg-neutral-50 px-5 py-8 text-center">
          <p className="text-sm text-neutral-600">{FALLBACK[locale] || FALLBACK.en}</p>
          <a href={src} className="mt-2 inline-block text-sm font-bold text-ibiza-green underline underline-offset-2">
            {OPEN_RAW[locale] || OPEN_RAW.en}
          </a>
        </div>
      )}
    </div>
  )
}
