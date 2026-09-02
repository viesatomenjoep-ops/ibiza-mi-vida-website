'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import { CLOUDINARY_CLOUD_NAME } from '@/lib/cloudinary'

const OPEN_RAW: Record<string, string> = {
  nl: 'Open het dossier als PDF', en: 'Open the dossier as PDF', de: 'Dossier als PDF öffnen',
  es: 'Abrir el dossier en PDF', fr: 'Ouvrir le dossier en PDF',
}

/**
 * Het bootdossier als eigen content: elke PDF-pagina als losse afbeelding,
 * onder elkaar, volle breedte, gewoon scrollbaar.
 *
 * ── Waarom Cloudinary de pagina's omzet en niet de browser ────────────────
 * De vorige versie laadde pdf.js in de browser, haalde het hele dossier op en
 * tekende elke pagina naar een canvas. Dat werkte, maar het was traag om drie
 * redenen tegelijk: de bezoeker downloadde de complete PDF (gemiddeld 2,7 MB,
 * voor Norfeu 15,6 MB), daar bovenop de pdf.js-bundel én een worker van
 * cdnjs.cloudflare.com — een extra domein met eigen DNS- en TLS-handshake —
 * en daarna moest zijn telefoon 3 tot 19 pagina's uitrekenen.
 *
 * Cloudinary kan die omzetting zelf: `f_auto,q_auto,w_1200,pg_N` levert
 * pagina N als beeld. Gemeten op Ogum: de ruwe PDF is 3,7 MB, pagina 1 als
 * geoptimaliseerde afbeelding 143 KB. De bezoeker krijgt nu gewone
 * afbeeldingen van een CDN, in WebP of AVIF als zijn browser dat aankan, en
 * zijn toestel hoeft niets te berekenen.
 *
 * De 401 die we eerder op Cloudinary zagen gold alleen voor het uitleveren van
 * de PDF zélf. Omzetten naar een beeldformaat mag wel — vandaar dat `f_jpg`
 * werkt waar een kale fetch faalt.
 *
 * ── Waarom lazy en niet allemaal tegelijk ─────────────────────────────────
 * Alleen de eerste twee pagina's laden meteen; de rest krijgt loading="lazy"
 * en komt binnen wanneer je er bijna bent. Bij een dossier van 19 pagina's
 * scheelt dat megabytes die niemand ooit bekijkt.
 *
 * ── Waarom de hoogte vooraf vaststaat ─────────────────────────────────────
 * aspect-[1/1.414] is A4-staand, het formaat van vrijwel elk dossier. Zonder
 * die reservering springt de pagina bij elke binnenkomende afbeelding, en
 * verspringende inhoud tijdens het scrollen is precies wat Core Web Vitals
 * afstraft.
 */
export function DossierPages({ pdfUrl, pages, locale, title, fallbackHref }: {
  /** Publieke URL van het dossier bij de partner — Cloudinary haalt het daar op. */
  pdfUrl: string
  /** Aantal pagina's, geteld bij generatie van fleet.ts. */
  pages: number
  locale: string
  title: string
  /** Onze eigen proxy, als uitwijk wanneer de omzetting niet lukt. */
  fallbackHref: string
}) {
  const [stuk, setStuk] = useState<Set<number>>(new Set())

  const url = (n: number, w: number) =>
    `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_${w},pg_${n}/${encodeURIComponent(pdfUrl)}`

  const zichtbaar = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => !stuk.has(n))

  return (
    <div className="w-full">
      {zichtbaar.map((n, i) => (
        // Geen next/image: Cloudinary optimaliseert al (f_auto/q_auto) en een
        // tweede optimalisatieslag door Vercel voegt niets toe behalve latency
        // en kosten.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={n}
          src={url(n, 1200)}
          srcSet={`${url(n, 700)} 700w, ${url(n, 1000)} 1000w, ${url(n, 1400)} 1400w`}
          sizes="(max-width: 768px) 100vw, 900px"
          alt={`${title} — ${n}`}
          loading={i < 2 ? 'eager' : 'lazy'}
          fetchPriority={i === 0 ? 'high' : 'auto'}
          decoding="async"
          onError={() => setStuk((s) => new Set(s).add(n))}
          className="mb-3 block w-full rounded-2xl border border-black/10 bg-neutral-50 shadow-sm"
          style={{ aspectRatio: '1 / 1.414' }}
        />
      ))}

      {zichtbaar.length === 0 && (
        <div className="rounded-2xl border border-black/10 bg-neutral-50 px-5 py-10 text-center">
          <a href={fallbackHref} className="inline-flex items-center gap-2 text-sm font-bold text-ibiza-green underline underline-offset-2">
            <FileText size={15} /> {OPEN_RAW[locale] || OPEN_RAW.en}
          </a>
        </div>
      )}
    </div>
  )
}
