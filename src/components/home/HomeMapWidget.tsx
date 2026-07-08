'use client'

import { useEffect, useState } from 'react'

const HEAD: Record<string, string> = { nl: 'Ontdek Ibiza', en: 'Discover Ibiza', es: 'Descubre Ibiza', de: 'Entdecke Ibiza', fr: 'Découvrez Ibiza' }

/**
 * The Ibiza clubs map lives in a standalone HTML widget (public/ibiza-kaart.html).
 * It sits as a click-to-navigate overview: tap a club to zoom to it; the page
 * keeps scrolling normally since the map itself isn't drag/zoom interactive.
 */
export function HomeMapWidget({ locale = 'nl' }: { locale?: string }) {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const m = () => setMobile(window.innerWidth < 720)
    m()
    window.addEventListener('resize', m)
    return () => window.removeEventListener('resize', m)
  }, [])

  const height = mobile ? 520 : 460

  return (
    <section id="ibiza-map-section" className="w-full bg-[#EFEDEA] pt-10 md:pt-14">
      <h2 className="mb-6 px-4 text-center font-serif text-[1.75rem] font-black uppercase tracking-tight text-[#1B1917] md:mb-8 md:text-4xl">
        {HEAD[locale] || HEAD.en}
      </h2>
      <div className="mx-auto w-full max-w-6xl">
        <iframe
          src="/ibiza-kaart.html"
          title="Ibiza clubs map"
          loading="lazy"
          className="block w-full border-0"
          style={{ height }}
        />
      </div>
    </section>
  )
}
