'use client'

import Link from 'next/link'
import { useMemo } from 'react'

export interface RingItem {
  image: string
  name: string
  href: string
  kind?: 'artist' | 'party' | string
  /** White club logo (ClubTickets whitelogo) shown top-centre on the card. */
  clubLogo?: string
  clubName?: string
  /** The upcoming event this artist plays at (optional). */
  eventName?: string
}

const TEXT: Record<string, { kicker: string; title: string }> = {
  nl: { kicker: 'Club Tickets Ibiza', title: 'Artiesten' },
  en: { kicker: 'Club Tickets Ibiza', title: 'Artists' },
  es: { kicker: 'Club Tickets Ibiza', title: 'Artistas' },
  de: { kicker: 'Club Tickets Ibiza', title: 'Künstler' },
  fr: { kicker: 'Club Tickets Ibiza', title: 'Artistes' },
}

/**
 * Full-width 3D ring carousel — six artist photo cards absolutely stacked in a
 * `preserve-3d` container, each placed with rotateY(index × 60°)
 * translateZ(310px) inside a stage with perspective 1300px. The whole ring
 * spins in 26s, linear and infinite; the sides dim with a gradient toward the
 * background colour.
 *
 * Every card shows the SAME artist image on both faces (a mirrored back would
 * look broken while the ring turns), with the white club logo top-centre, the
 * artist name at the bottom and — when known — the event they play at.
 */
export function HomeArtistRing({
  items,
  locale = 'nl',
  radius = 310,
  perspective = 1300,
  duration = 26,
}: {
  items: RingItem[]
  locale?: string
  radius?: number
  perspective?: number
  duration?: number
}) {
  const t = TEXT[locale] || TEXT.en
  const cards = useMemo(() => items.filter((i) => i && i.image).slice(0, 6), [items])
  if (cards.length === 0) return null

  const step = 360 / cards.length

  return (
    <section className="ibz-ring" aria-label={t.title}>
      <div className="ibz-ring__head">
        <span className="ibz-ring__kicker">{t.kicker}</span>
        <h2 className="ibz-ring__title">{t.title}</h2>
      </div>

      {/* Full-width rounded stage panel (screenshot style) */}
      <div className="ibz-ring__panel">
        <div className="ibz-ring__stage" style={{ perspective: `${perspective}px` }}>
          <div className="ibz-ring__scaler">
            <div className="ibz-ring__ring" style={{ animationDuration: `${duration}s` }}>
              {cards.map((card, i) => (
                <Link
                  key={`${card.href}-${i}`}
                  href={card.href}
                  className="ibz-ring__card"
                  style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
                >
                  {/* Front + back faces: identical artist image & labels, so the
                      card looks the same from every side while the ring spins. */}
                  {(['front', 'back'] as const).map((face) => (
                    <span key={face} className={`ibz-ring__face ibz-ring__face--${face}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={card.image} alt={face === 'front' ? card.name : ''} loading="lazy" referrerPolicy="no-referrer" />
                      <span className="ibz-ring__shade" aria-hidden />
                      {card.clubLogo && (
                        <span className="ibz-ring__club-logo">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={card.clubLogo} alt={card.clubName || ''} loading="lazy" referrerPolicy="no-referrer" />
                        </span>
                      )}
                      <span className="ibz-ring__label">
                        <span className="ibz-ring__name">{card.name}</span>
                        {card.eventName && <span className="ibz-ring__event">{card.eventName}</span>}
                      </span>
                    </span>
                  ))}
                </Link>
              ))}
            </div>
          </div>

          {/* Side gradients dim the edges toward the panel background */}
          <div className="ibz-ring__fade ibz-ring__fade--l" aria-hidden />
          <div className="ibz-ring__fade ibz-ring__fade--r" aria-hidden />
        </div>
      </div>

      <style jsx>{`
        .ibz-ring {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          margin-top: -2.5rem;
          padding: 4.5rem 0 3.5rem;
          background: #0c0c0c;
          border-top-left-radius: 2.5rem;
          border-top-right-radius: 2.5rem;
        }
        .ibz-ring__head {
          position: relative;
          z-index: 2;
          margin: 0 auto 2rem;
          max-width: 72rem;
          padding: 0 1.25rem;
        }
        .ibz-ring__kicker {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c6a052;
          margin-bottom: 0.6rem;
        }
        .ibz-ring__title {
          font-family: var(--font-serif, Georgia, serif);
          font-weight: 800;
          font-size: clamp(1.8rem, 4.6vw, 2.9rem);
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: #fbfaf6;
          margin: 0;
        }
        /* Full-bleed rounded panel, like the reference: a dark plate the ring
           lives in, edge-to-edge with a small inset. */
        .ibz-ring__panel {
          position: relative;
          margin: 0 0.6rem;
          border-radius: 1.6rem;
          background: #151515;
          border: 1px solid rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }
        .ibz-ring__stage {
          position: relative;
          z-index: 1;
          height: 440px;
          width: 100%;
          overflow: hidden;
        }
        .ibz-ring__scaler {
          width: 250px;
          margin: 0 auto;
          transform-style: preserve-3d;
        }
        .ibz-ring__ring {
          position: relative;
          width: 250px;
          height: 360px;
          margin: 0 auto;
          top: 40px;
          transform-style: preserve-3d;
          animation-name: ibz-ring-spin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .ibz-ring__card {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          border-radius: 1.4rem;
        }
        .ibz-ring__face {
          position: absolute;
          inset: 0;
          border-radius: 1.4rem;
          overflow: hidden;
          background: #1a1a1a;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .ibz-ring__face--back {
          transform: rotateY(180deg);
        }
        .ibz-ring__face :global(img),
        .ibz-ring__face img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ibz-ring__shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, transparent 26%),
            linear-gradient(to top, rgba(0, 0, 0, 0.85) 4%, rgba(0, 0, 0, 0.1) 45%, transparent 68%);
        }
        /* White club logo — top, horizontally centred */
        .ibz-ring__club-logo {
          position: absolute;
          top: 0.9rem;
          left: 50%;
          transform: translateX(-50%);
          width: 5.5rem;
          height: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ibz-ring__club-logo :global(img),
        .ibz-ring__club-logo img {
          position: static;
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
        }
        .ibz-ring__label {
          position: absolute;
          left: 1rem;
          right: 1rem;
          bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .ibz-ring__name {
          color: #fff;
          font-weight: 800;
          font-size: 1.15rem;
          line-height: 1.15;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ibz-ring__event {
          color: rgba(255, 255, 255, 0.75);
          font-weight: 600;
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.7);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        /* Dim the sides toward the panel background colour */
        .ibz-ring__fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 22%;
          z-index: 3;
          pointer-events: none;
        }
        .ibz-ring__fade--l {
          left: 0;
          background: linear-gradient(to right, #151515 6%, rgba(21, 21, 21, 0) 100%);
        }
        .ibz-ring__fade--r {
          right: 0;
          background: linear-gradient(to left, #151515 6%, rgba(21, 21, 21, 0) 100%);
        }

        @media (min-width: 768px) {
          .ibz-ring__panel {
            margin: 0 1.25rem;
            border-radius: 2rem;
          }
          .ibz-ring__stage {
            height: 500px;
          }
          .ibz-ring__ring {
            top: 60px;
          }
        }
        @media (max-width: 767px) {
          .ibz-ring {
            padding: 3.5rem 0 2.75rem;
          }
          .ibz-ring__stage {
            height: 340px;
          }
          .ibz-ring__scaler {
            transform: scale(0.78);
            transform-origin: center top;
          }
          .ibz-ring__ring {
            top: 22px;
          }
        }
        @media (max-width: 420px) {
          .ibz-ring__stage {
            height: 300px;
          }
          .ibz-ring__scaler {
            transform: scale(0.64);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ibz-ring__ring {
            animation: none;
          }
        }
      `}</style>
      {/* Keyframes must be global (styled-jsx scopes @keyframes otherwise) */}
      <style jsx global>{`
        @keyframes ibz-ring-spin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </section>
  )
}
