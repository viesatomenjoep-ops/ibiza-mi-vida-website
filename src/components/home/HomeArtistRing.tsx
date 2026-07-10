'use client'

import Link from 'next/link'
import { useMemo } from 'react'

export interface RingItem {
  image: string
  name: string
  href: string
  kind?: 'artist' | 'party' | string
}

const TEXT: Record<string, { kicker: string; title: string; sub: string }> = {
  nl: { kicker: 'Line-up', title: 'Artiesten & Feesten', sub: 'De grootste namen en events van alle clubs op Ibiza' },
  en: { kicker: 'Line-up', title: 'Artists & Parties', sub: 'The biggest names and events from every club on Ibiza' },
  es: { kicker: 'Line-up', title: 'Artistas y Fiestas', sub: 'Los grandes nombres y eventos de todos los clubes de Ibiza' },
  de: { kicker: 'Line-up', title: 'Künstler & Partys', sub: 'Die größten Namen und Events aller Clubs auf Ibiza' },
  fr: { kicker: 'Line-up', title: 'Artistes & Fêtes', sub: 'Les plus grands noms et événements de tous les clubs d’Ibiza' },
}

/**
 * 3D ring carousel — photo cards absolutely stacked inside a `preserve-3d`
 * container, each placed with rotateY(index × step) translateZ(radius), spinning
 * infinitely inside a `perspective` stage. The sides are dimmed with a gradient
 * toward the section background so the front card reads clearly.
 *
 * Geometry follows the brief: 6 cards · 60° step · translateZ(310px) ·
 * perspective 1300px · 26s linear infinite.
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
      {/* Layered background: soft organic glows + dot grid pattern */}
      <div className="ibz-ring__bg" aria-hidden>
        <span className="ibz-ring__glow ibz-ring__glow--gold" />
        <span className="ibz-ring__glow ibz-ring__glow--terra" />
        <span className="ibz-ring__grid" />
      </div>

      <div className="ibz-ring__head">
        <span className="ibz-ring__kicker">{t.kicker}</span>
        <h2 className="ibz-ring__title">{t.title}</h2>
        <p className="ibz-ring__sub">{t.sub}</p>
      </div>

      <div className="ibz-ring__stage" style={{ perspective: `${perspective}px` }}>
        <div className="ibz-ring__scaler">
          <div
            className="ibz-ring__ring"
            style={{ animationDuration: `${duration}s` }}
          >
            {cards.map((card, i) => (
              <Link
                key={`${card.href}-${i}`}
                href={card.href}
                className="ibz-ring__card"
                style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.image} alt={card.name} loading="lazy" referrerPolicy="no-referrer" />
                <span className="ibz-ring__card-shade" aria-hidden />
                <span className="ibz-ring__card-name">{card.name}</span>
                {card.kind === 'artist' && <span className="ibz-ring__card-tag">Artist</span>}
              </Link>
            ))}
          </div>
        </div>

        {/* Side gradients dim the edges toward the background colour */}
        <div className="ibz-ring__fade ibz-ring__fade--l" aria-hidden />
        <div className="ibz-ring__fade ibz-ring__fade--r" aria-hidden />
      </div>

      {/* Curved cream base so the section flows into the light map below */}
      <div className="ibz-ring__base" aria-hidden />

      <style jsx>{`
        .ibz-ring {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          margin-top: -2.75rem;
          padding: 5.5rem 1rem 6.5rem;
          background: #0f0f0f;
          border-top-left-radius: 2.75rem;
          border-top-right-radius: 2.75rem;
          box-shadow: 0 -1px 0 rgba(198, 160, 82, 0.25) inset;
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
          opacity: 0.5;
        }
        .ibz-ring__glow--gold {
          top: -8%;
          left: 50%;
          width: 62vw;
          max-width: 720px;
          aspect-ratio: 1;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(198, 160, 82, 0.55), transparent 62%);
        }
        .ibz-ring__glow--terra {
          bottom: -14%;
          left: 12%;
          width: 44vw;
          max-width: 520px;
          aspect-ratio: 1;
          background: radial-gradient(circle, rgba(255, 78, 0, 0.28), transparent 60%);
        }
        .ibz-ring__grid {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
          background-size: 46px 46px;
          -webkit-mask-image: radial-gradient(ellipse at 50% 30%, #000 40%, transparent 80%);
          mask-image: radial-gradient(ellipse at 50% 30%, #000 40%, transparent 80%);
        }
        .ibz-ring__head {
          position: relative;
          z-index: 2;
          text-align: center;
          margin: 0 auto 2.5rem;
          max-width: 44rem;
        }
        .ibz-ring__kicker {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #c6a052;
          margin-bottom: 0.75rem;
        }
        .ibz-ring__title {
          font-family: var(--font-serif, Georgia, serif);
          font-weight: 800;
          font-size: clamp(1.9rem, 5vw, 3.1rem);
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: #fbfaf6;
          margin: 0 0 0.7rem;
        }
        .ibz-ring__sub {
          font-size: clamp(0.9rem, 2.4vw, 1.05rem);
          color: rgba(251, 250, 246, 0.66);
          margin: 0;
        }
        .ibz-ring__stage {
          position: relative;
          z-index: 1;
          height: 380px;
          width: 100%;
        }
        .ibz-ring__scaler {
          width: 220px;
          margin: 0 auto;
          transform-style: preserve-3d;
        }
        .ibz-ring__ring {
          position: relative;
          width: 220px;
          height: 300px;
          margin: 0 auto;
          top: 34px;
          transform-style: preserve-3d;
          animation-name: ibz-ring-spin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .ibz-ring__card {
          position: absolute;
          inset: 0;
          border-radius: 1.15rem;
          overflow: hidden;
          background: #1a1a1a;
          border: 1px solid rgba(198, 160, 82, 0.35);
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.55);
          backface-visibility: hidden;
          transition: box-shadow 0.3s ease;
        }
        .ibz-ring__card :global(img),
        .ibz-ring__card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ibz-ring__card-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.82) 4%, rgba(0, 0, 0, 0.1) 42%, transparent 70%);
        }
        .ibz-ring__card-name {
          position: absolute;
          left: 0.9rem;
          right: 0.9rem;
          bottom: 0.85rem;
          color: #fff;
          font-weight: 700;
          font-size: 0.98rem;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ibz-ring__card-tag {
          position: absolute;
          top: 0.7rem;
          left: 0.7rem;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0f0f0f;
          background: #c6a052;
        }
        .ibz-ring__fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 26%;
          z-index: 3;
          pointer-events: none;
        }
        .ibz-ring__fade--l {
          left: 0;
          background: linear-gradient(to right, #0f0f0f 8%, rgba(15, 15, 15, 0) 100%);
        }
        .ibz-ring__fade--r {
          right: 0;
          background: linear-gradient(to left, #0f0f0f 8%, rgba(15, 15, 15, 0) 100%);
        }
        .ibz-ring__base {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3.25rem;
          z-index: 2;
          background: #efedea;
          border-top-left-radius: 2.5rem;
          border-top-right-radius: 2.5rem;
        }

        @media (max-width: 768px) {
          .ibz-ring {
            padding: 4.25rem 0.75rem 5.25rem;
          }
          .ibz-ring__stage {
            height: 320px;
          }
          .ibz-ring__scaler {
            transform: scale(0.66);
            transform-origin: center top;
          }
        }
        @media (max-width: 420px) {
          .ibz-ring__scaler {
            transform: scale(0.52);
            transform-origin: center top;
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
