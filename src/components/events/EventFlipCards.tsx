'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import { lineupArtists, priceFrom } from '@/lib/event-picks'

export interface FlipEventCard {
  id: string
  image: string
  eventName: string
  clubName: string
  clubLogo: string
  clubSlug: string
  lineUp: string
  prices: string
  href: string
  affLink?: string
}

const KEEP_LOGO = ['o-beach-ibiza', 'playa-soleil', 'bambuku-ibiza']

const TEXT: Record<string, { lineup: string; from: string; book: string; tap: string }> = {
  nl: { lineup: 'Line-up', from: 'Vanaf', book: 'Boek tickets direct', tap: 'Tik om te draaien' },
  en: { lineup: 'Line-up', from: 'From', book: 'Book tickets directly', tap: 'Tap to flip' },
  es: { lineup: 'Line-up', from: 'Desde', book: 'Reserva entradas directo', tap: 'Toca para girar' },
  de: { lineup: 'Line-up', from: 'Ab', book: 'Tickets direkt buchen', tap: 'Tippen zum Drehen' },
  fr: { lineup: 'Line-up', from: 'À partir de', book: 'Réserver directement', tap: 'Appuyer pour retourner' },
}

/**
 * Three flip cards side by side — perspective 1100px, inner card preserve-3d,
 * 700ms rotateY(180deg) on hover (desktop) or tap (mobile). Front: photo +
 * club logo. Back: lineup, price, book CTA + logo; alternating dark / accent.
 */
export function EventFlipCards({
  events,
  locale = 'nl',
}: {
  events: FlipEventCard[]
  locale?: string
}) {
  const t = TEXT[locale] || TEXT.en
  const cards = events.slice(0, 3)
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  const toggle = useCallback((id: string) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  if (cards.length === 0) return null

  return (
    <div className="efc-root">
      <div className="efc-grid">
        {cards.map((ev, i) => {
          const artists = lineupArtists(ev.lineUp)
          const price = priceFrom(ev.prices)
          const isAccent = i % 2 === 1
          const ticketHref = ev.affLink || ev.href
          const isExternal = !!ev.affLink
          const isFlipped = !!flipped[ev.id]

          return (
            <div key={ev.id} className="efc-perspective">
              <div
                className={`efc-inner${isFlipped ? ' efc-inner--flipped' : ''}`}
                onClick={() => toggle(ev.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(ev.id) } }}
                role="button"
                tabIndex={0}
                aria-label={`${ev.eventName} — ${t.tap}`}
              >
                {/* ── Front: cover + club logo ── */}
                <div className="efc-face efc-front">
                  {ev.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ev.image} alt="" className="efc-cover" loading="lazy" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="efc-cover efc-cover--empty" />
                  )}
                  <div className="efc-front-shade" aria-hidden />
                  {ev.clubLogo && (
                    <div className="efc-logo-badge">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ev.clubLogo}
                        alt=""
                        style={{ filter: KEEP_LOGO.includes(ev.clubSlug) ? 'none' : 'brightness(0)' }}
                      />
                    </div>
                  )}
                  <div className="efc-front-label">
                    <span className="efc-club-name">{ev.clubName}</span>
                  </div>
                </div>

                {/* ── Back: lineup · price · CTA ── */}
                <div className={`efc-face efc-back${isAccent ? ' efc-back--accent' : ''}`}>
                  {ev.clubLogo && (
                    <div className={`efc-back-logo${isAccent ? ' efc-back-logo--on-accent' : ''}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ev.clubLogo}
                        alt=""
                        style={{ filter: KEEP_LOGO.includes(ev.clubSlug) ? 'none' : isAccent ? 'brightness(0)' : 'brightness(0) invert(1)' }}
                      />
                    </div>
                  )}

                  <h3 className={`efc-event-name${isAccent ? ' efc-event-name--dark' : ''}`}>{ev.eventName}</h3>

                  {artists.length > 0 && (
                    <div className="efc-lineup">
                      <span className={`efc-lineup-label${isAccent ? ' efc-lineup-label--dark' : ''}`}>{t.lineup}</span>
                      <ul className={`efc-artists${isAccent ? ' efc-artists--dark' : ''}`}>
                        {artists.slice(0, 5).map((a, j) => (
                          <li key={j}>{a}</li>
                        ))}
                        {artists.length > 5 && <li className="efc-more">+{artists.length - 5}</li>}
                      </ul>
                    </div>
                  )}

                  {price && (
                    <p className={`efc-price${isAccent ? ' efc-price--dark' : ''}`}>
                      <span className="efc-price-from">{t.from}</span> {price}
                    </p>
                  )}

                  {isExternal ? (
                    <a
                      href={ticketHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`efc-cta${isAccent ? ' efc-cta--on-accent' : ''}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t.book}
                    </a>
                  ) : (
                    <Link
                      href={ticketHref}
                      className={`efc-cta${isAccent ? ' efc-cta--on-accent' : ''}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t.book}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .efc-root {
          width: 100%;
          margin-bottom: 2.5rem;
        }
        .efc-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.65rem;
        }
        .efc-perspective {
          perspective: 1100px;
          height: 300px;
        }
        .efc-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 700ms ease;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .efc-face {
          position: absolute;
          inset: 0;
          border-radius: 1.25rem;
          overflow: hidden;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .efc-front {
          background: #0d0509;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.14);
        }
        .efc-cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .efc-cover--empty {
          background: linear-gradient(135deg, #1a0a12, #0d0509 55%, #1c1208);
        }
        .efc-front-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.15) 45%, transparent 70%);
        }
        .efc-logo-badge {
          position: absolute;
          bottom: 3.25rem;
          left: 0.75rem;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 0.85rem;
          background: #fff;
          padding: 0.35rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
          z-index: 2;
        }
        .efc-logo-badge :global(img),
        .efc-logo-badge img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .efc-front-label {
          position: absolute;
          left: 0.75rem;
          right: 0.75rem;
          bottom: 0.75rem;
          z-index: 2;
        }
        .efc-club-name {
          display: block;
          color: #fff;
          font-weight: 800;
          font-size: 0.78rem;
          line-height: 1.2;
          letter-spacing: 0.02em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.55);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .efc-back {
          transform: rotateY(180deg);
          background: #0f0f0f;
          color: #fbfaf6;
          border: 1px solid rgba(198, 160, 82, 0.35);
          padding: 1rem 0.85rem 0.85rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
        }
        .efc-back--accent {
          background: #c6a052;
          color: #0f0f0f;
          border-color: rgba(15, 15, 15, 0.15);
        }
        .efc-back-logo {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.12);
          padding: 0.3rem;
          margin-bottom: 0.55rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .efc-back-logo--on-accent {
          background: rgba(15, 15, 15, 0.1);
        }
        .efc-back-logo :global(img),
        .efc-back-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .efc-event-name {
          font-weight: 800;
          font-size: 0.82rem;
          line-height: 1.2;
          margin: 0 0 0.45rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .efc-event-name--dark {
          color: #0f0f0f;
        }
        .efc-lineup {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          width: 100%;
          margin-bottom: 0.4rem;
        }
        .efc-lineup-label {
          display: block;
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c6a052;
          margin-bottom: 0.25rem;
        }
        .efc-lineup-label--dark {
          color: rgba(15, 15, 15, 0.55);
        }
        .efc-artists {
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 0.68rem;
          font-weight: 600;
          line-height: 1.35;
          color: rgba(251, 250, 246, 0.88);
        }
        .efc-artists--dark {
          color: rgba(15, 15, 15, 0.82);
        }
        .efc-artists li {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .efc-more {
          opacity: 0.65;
          font-style: italic;
        }
        .efc-price {
          font-size: 1rem;
          font-weight: 900;
          margin: 0 0 0.55rem;
          color: #14ff00;
        }
        .efc-price--dark {
          color: #0f0f0f;
        }
        .efc-price-from {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.7;
          margin-right: 0.2rem;
        }
        .efc-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.55rem 0.5rem;
          border-radius: 999px;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          background: #14ff00;
          color: #0d0509;
          transition: filter 0.2s ease;
        }
        .efc-cta:hover {
          filter: brightness(0.92);
        }
        .efc-cta--on-accent {
          background: #0f0f0f;
          color: #fbfaf6;
        }

        /* Desktop: hover flip */
        @media (hover: hover) and (pointer: fine) {
          .efc-perspective:hover .efc-inner {
            transform: rotateY(180deg);
          }
          .efc-inner--flipped {
            transform: rotateY(180deg);
          }
        }
        /* Touch: tap flip */
        @media (hover: none) {
          .efc-inner--flipped {
            transform: rotateY(180deg);
          }
        }

        @media (min-width: 640px) {
          .efc-grid {
            gap: 1.25rem;
          }
          .efc-perspective {
            height: 380px;
          }
          .efc-logo-badge {
            width: 3.25rem;
            height: 3.25rem;
            left: 1rem;
            bottom: 3.75rem;
          }
          .efc-front-label {
            left: 1rem;
            right: 1rem;
            bottom: 1rem;
          }
          .efc-club-name {
            font-size: 0.95rem;
          }
          .efc-back {
            padding: 1.35rem 1.15rem 1.1rem;
          }
          .efc-event-name {
            font-size: 1rem;
          }
          .efc-artists {
            font-size: 0.78rem;
          }
          .efc-cta {
            font-size: 0.68rem;
            padding: 0.65rem 0.75rem;
          }
        }
        @media (min-width: 1024px) {
          .efc-perspective {
            height: 420px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .efc-inner {
            transition: none;
          }
          .efc-perspective:hover .efc-inner,
          .efc-inner--flipped {
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}
