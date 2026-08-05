'use client';

import React, { useMemo } from 'react';
import { MessageCircle } from 'lucide-react';

interface WaBandSectionProps {
  /** Kicker label above the h2 */
  kicker?: string;
  /** Main headline */
  heading?: string;
  /** Description text */
  description?: string;
  /** Button label */
  btnLabel?: string;
  /** WhatsApp number */
  phone?: string;
  /** Club venues to show in lift — if empty, lift is hidden */
  venues?: Array<{ slug: string; whitelogo?: string; picture?: string; name?: string }>;
}

const LIFT_COLS = 4;

export default function WaBandSection({
  kicker = 'Heb je vragen?',
  heading = 'Wij staan voor je klaar',
  description = 'Chat met ons via WhatsApp voor advies, VIP reserveringen of hulp bij het boeken van je tickets.',
  btnLabel = 'Chat met ons',
  phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33666528412',
  venues = [],
}: WaBandSectionProps) {
  const liftCols = useMemo(() =>
    Array.from({ length: LIFT_COLS }, (_, i) => ({
      id: i,
      duration: 30 + i * 6,
      reverse: i % 2 === 1,
      delay: -(i * 5),
    })), []);

  return (
    <section
      className="wa-band-section"
      aria-label="Contact via WhatsApp"
    >
      {/* Lift elevator background */}
      {venues.length > 0 && (
        <div className="wa-lift-bg" aria-hidden="true">
          <div className="lift-cols">
            {liftCols.map(col => {
              const offset = (col.id * 3) % venues.length;
              const rotated = [...venues.slice(offset), ...venues.slice(0, offset)];
              const items = [...rotated, ...rotated];
              return (
                <div key={col.id} className="lift-col">
                  <div
                    className="lift-track"
                    style={{
                      animationDuration: `${col.duration}s`,
                      animationDirection: col.reverse ? 'reverse' : 'normal',
                      animationDelay: `${col.delay}s`,
                    }}
                  >
                    {items.map((v, idx) => (
                      <div key={`${v.slug}-${idx}`} className="lift-item">
                        <img
                          src={v.whitelogo || v.picture || ''}
                          alt=""
                          className="wa-lift-logo"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="wrap wa-band-inner">
        <div className="wa-band-text">
          <div className="wa-band-kicker">{kicker}</div>
          <h2 className="wa-band-heading">{heading}</h2>
          <p className="wa-band-desc">{description}</p>
        </div>
        <a
          href={`https://wa.me/${phone}`}
          target="_blank"
          rel="noreferrer"
          className="wa-big-new"
          aria-label="Open WhatsApp"
        >
          <MessageCircle size={20} />
          {btnLabel}
        </a>
      </div>
    </section>
  );
}
