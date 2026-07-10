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

const TEXT: Record<string, { kicker: string; title: string; sub: string }> = {
  nl: { kicker: 'Club Tickets Ibiza', title: 'Artiesten', sub: 'De grootste namen van het eiland — draaiend door alle clubs' },
  en: { kicker: 'Club Tickets Ibiza', title: 'Artists', sub: 'The biggest names on the island — spinning through every club' },
  es: { kicker: 'Club Tickets Ibiza', title: 'Artistas', sub: 'Los nombres más grandes de la isla — girando por todos los clubes' },
  de: { kicker: 'Club Tickets Ibiza', title: 'Künstler', sub: 'Die größten Namen der Insel — unterwegs durch alle Clubs' },
  fr: { kicker: 'Club Tickets Ibiza', title: 'Artistes', sub: 'Les plus grands noms de l’île — en tournée dans tous les clubs' },
}

/**
 * Full-width 3D ring carousel — grip.agency-inspired premium dark section:
 * layered organic glows, a subtle dot-grid, gold hairlines, a rounded top that
 * overlaps the hero video and a cream curved base flowing into the light map
 * section below.
 *
 * Ring geometry (per the brief): six cards absolutely stacked in a
 * `preserve-3d` container, each at rotateY(index × 60°) translateZ(310px),
 * inside a stage with perspective 1300px, spinning 26s linear infinite; the
 * sides dim with a gradient toward the background colour. Both card faces show
 * the same artist image so the card looks identical from every angle.
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
      {/* ── Layered background: organic glows + dot grid (grip look) ── */}
      <div className="ibz-ring__bg" aria-hidden>
        <span className="ibz-ring__glow ibz-ring__glow--gold" />
        <span className="ibz-ring__glow ibz-ring__glow--terra" />
        <span className="ibz-ring__glow ibz-ring__glow--ember" />
        <span className="ibz-ring__dots" />
        <span className="ibz-ring__topline" />
      </div>

      <div className="ibz-ring__head">
        <span className="ibz-ring__kicker">{t.kicker}</span>
        <h2 className="ibz-ring__title">{t.title}</h2>
        <p className="ibz-ring__sub">{t.sub}</p>
      </div>

      {/* ── Stage: full-width, ring floats over the glows ── */}
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
                    <span className="ibz-ring__card-edge" aria-hidden />
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

        {/* Side gradients dim the edges toward the section background */}
        <div className="ibz-ring__fade ibz-ring__fade--l" aria-hidden />
        <div className="ibz-ring__fade ibz-ring__fade--r" aria-hidden />
      </div>

      {/* ── Curved layered base: gold hairline arc + cream curve flowing into
          the light map section below (the "smalle gedeelte met rondingen") ── */}
      <div className="ibz-ring__base-arc" aria-hidden />
      <div className="ibz-ring__base" aria-hidden />

      <style jsx>{`
        .ibz-ring {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          margin-top: -2.75rem;
          padding: 5rem 0 7rem;
          background: #0f0f0f;
          border-top-left-radius: 2.75rem;
          border-top-right-radius: 2.75rem;
        }
        .ibz-ring__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .ibz-ring__glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
        }
        .ibz-ring__glow--gold {
          top: -10%;
          left: 50%;
          width: 64vw;
          max-width: 760px;
          aspect-ratio: 1;
          transform: translateX(-50%);
          opacity: 0.55;
          background: radial-gradient(circle, rgba(198, 160, 82, 0.55), transparent 62%);
        }
        .ibz-ring__glow--terra {
          bottom: -16%;
          left: 8%;
          width: 46vw;
          max-width: 540px;
          aspect-ratio: 1;
          opacity: 0.5;
          background: radial-gradient(circle, rgba(255, 78, 0, 0.3), transparent 60%);
        }
        .ibz-ring__glow--ember {
          top: 30%;
          right: -8%;
          width: 38vw;
          max-width: 460px;
          aspect-ratio: 1;
          opacity: 0.4;
          background: radial-gradient(circle, rgba(225, 77, 104, 0.28), transparent 60%);
        }
        /* Subtle dot-grid, fading out radially (grip pattern layer) */
        .ibz-ring__dots {
          position: absolute;
          inset: 0;
          opacity: 0.16;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.55) 1px, transparent 1.5px);
          background-size: 26px 26px;
          -webkit-mask-image: radial-gradient(ellipse at 50% 32%, #000 30%, transparent 78%);
          mask-image: radial-gradient(ellipse at 50% 32%, #000 30%, transparent 78%);
        }
        /* Gold hairline along the rounded top edge */
        .ibz-ring__topline {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent 8%, rgba(198, 160, 82, 0.65) 50%, transparent 92%);
        }
        .ibz-ring__head {
          position: relative;
          z-index: 2;
          text-align: center;
          margin: 0 auto 2.25rem;
          max-width: 46rem;
          padding: 0 1.25rem;
        }
        .ibz-ring__kicker {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #c6a052;
          margin-bottom: 0.7rem;
        }
        .ibz-ring__title {
          font-family: var(--font-serif, Georgia, serif);
          font-weight: 800;
          font-size: clamp(2rem, 5.2vw, 3.2rem);
          line-height: 1.03;
          letter-spacing: -0.01em;
          color: #fbfaf6;
          margin: 0 0 0.6rem;
        }
        .ibz-ring__sub {
          font-size: clamp(0.88rem, 2.3vw, 1.02rem);
          color: rgba(251, 250, 246, 0.62);
          margin: 0;
        }
        .ibz-ring__stage {
          position: relative;
          z-index: 1;
          height: 480px;
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
          top: 50px;
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
          box-shadow: 0 34px 80px rgba(0, 0, 0, 0.65);
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
        /* Gold hairline edge on every card (premium structure accent) */
        .ibz-ring__card-edge {
          position: absolute;
          inset: 0;
          border-radius: 1.4rem;
          border: 1px solid rgba(198, 160, 82, 0.45);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        /* White club logo — top, horizontally centred */
        .ibz-ring__club-logo {
          position: absolute;
          top: 0.95rem;
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
          gap: 0.22rem;
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
          color: #c6a052;
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.7);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        /* Dim the sides toward the section background colour */
        .ibz-ring__fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 24%;
          z-index: 3;
          pointer-events: none;
        }
        .ibz-ring__fade--l {
          left: 0;
          background: linear-gradient(to right, #0f0f0f 6%, rgba(15, 15, 15, 0) 100%);
        }
        .ibz-ring__fade--r {
          right: 0;
          background: linear-gradient(to left, #0f0f0f 6%, rgba(15, 15, 15, 0) 100%);
        }
        /* ── Curved base: thin gold arc hovering above the cream curve ── */
        .ibz-ring__base-arc {
          position: absolute;
          left: 4%;
          right: 4%;
          bottom: 3.4rem;
          height: 2.6rem;
          z-index: 2;
          border-top-left-radius: 100% 200%;
          border-top-right-radius: 100% 200%;
          border-top: 1px solid rgba(198, 160, 82, 0.5);
          pointer-events: none;
        }
        .ibz-ring__base {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3.5rem;
          z-index: 2;
          background: #efedea;
          border-top-left-radius: 2.75rem;
          border-top-right-radius: 2.75rem;
          box-shadow: 0 -14px 40px rgba(0, 0, 0, 0.35);
        }

        @media (max-width: 767px) {
          .ibz-ring {
            padding: 4rem 0 5.5rem;
          }
          .ibz-ring__stage {
            height: 350px;
          }
          .ibz-ring__scaler {
            transform: scale(0.78);
            transform-origin: center top;
          }
          .ibz-ring__ring {
            top: 24px;
          }
          .ibz-ring__base {
            height: 2.75rem;
            border-top-left-radius: 2rem;
            border-top-right-radius: 2rem;
          }
          .ibz-ring__base-arc {
            bottom: 2.6rem;
          }
        }
        @media (max-width: 420px) {
          .ibz-ring__stage {
            height: 306px;
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
