'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

type LiveEvent = { name: string; slug?: string };
type LiveRecord = { today: LiveEvent[]; lastNight: LiveEvent[]; isDayClub: boolean };
type Status = 'green' | 'orange' | 'red' | null;

interface ClubLogoSliderProps {
  clubLogos: Array<{ slug: string; name: string; whitelogo?: string; picture?: string; }>;
  base: string;
  className?: string;
  basePath?: string;
  /** Per-club live event data keyed by slug — enables the live status tracker */
  liveByClub?: Record<string, LiveRecord>;
  locale?: string;
  showLegend?: boolean;
  /** Auto-scroll speed in px per frame (lower = slower). Default 0.5 */
  speed?: number;
}

const LEGEND: Record<string, { live: string; tonight: string; last: string; now: string }> = {
  en: { live: 'Live now on Ibiza', tonight: 'Party today', last: 'Last-minute entry', now: 'Live now' },
  nl: { live: 'Nu live op Ibiza', tonight: 'Feest vandaag', last: 'Last-minute entree', now: 'Nu live' },
  de: { live: 'Jetzt live auf Ibiza', tonight: 'Party heute', last: 'Last-Minute-Einlass', now: 'Jetzt live' },
  es: { live: 'En directo en Ibiza', tonight: 'Fiesta hoy', last: 'Entrada de última hora', now: 'En directo' },
  fr: { live: 'En direct à Ibiza', tonight: 'Fête aujourd’hui', last: 'Entrée de dernière minute', now: 'En direct' },
};

const DOT_COLORS: Record<Exclude<Status, null>, string> = {
  green: '#22e07a',
  orange: '#ff9f1c',
  red: '#ff3b3b',
};

/** Compute live status from event data using the current local time. */
function computeStatus(live: LiveRecord | undefined, now: Date): { status: Status; count: number } {
  if (!live) return { status: null, count: 0 };
  const h = now.getHours() + now.getMinutes() / 60;
  const todayCount = live.today.length;

  if (live.isDayClub) {
    if (todayCount === 0) return { status: null, count: 0 };
    if (h < 14) return { status: 'green', count: todayCount };   // party today, upcoming
    if (h < 21) return { status: 'orange', count: todayCount };  // live now
    if (h < 23) return { status: 'red', count: todayCount };     // last entry
    return { status: null, count: 0 };
  }

  // Night club — early hours belong to last night's party
  if (h < 6 && live.lastNight.length > 0) {
    if (h < 3) return { status: 'orange', count: live.lastNight.length }; // live now
    return { status: 'red', count: live.lastNight.length };               // last entry ~5am
  }
  if (todayCount > 0) {
    if (h >= 23) return { status: 'orange', count: todayCount };  // just started tonight
    return { status: 'green', count: todayCount };                // party tonight, upcoming
  }
  return { status: null, count: 0 };
}

function StatusBadge({ status, count }: { status: Status; count: number }) {
  if (!status || count < 1) return null;
  const color = DOT_COLORS[status];
  const dots = Math.min(count, 3);
  return (
    <span
      className="absolute -top-3 -right-2 z-20 flex items-center gap-0.5 rounded-full bg-black/70 px-1.5 py-1 backdrop-blur-sm ring-1 ring-white/10"
      style={{ boxShadow: `0 0 10px ${color}55` }}
    >
      {Array.from({ length: dots }).map((_, i) => (
        <span key={i} className="relative flex h-2 w-2">
          {status !== 'green' && (
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 cls-ping"
              style={{ background: color }}
            />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: color }} />
        </span>
      ))}
    </span>
  );
}

export function ClubLogoSlider({
  clubLogos,
  base,
  className = "w-full relative z-20 bg-black/80 py-4 border-t border-white/10 border-b",
  basePath = "club-tickets",
  liveByClub,
  locale = 'en',
  showLegend = false,
  speed = 0.5,
}: ClubLogoSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [now, setNow] = useState<Date | null>(null);

  // Compute status only on the client (avoids hydration mismatch) + refresh each minute.
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || clubLogos.length === 0) return;

    let animationId: number;

    const play = () => {
      if (!isDragging.current && slider) {
        slider.scrollLeft -= speed;
        if (slider.scrollLeft <= 0) {
          slider.scrollLeft = slider.scrollWidth / 2;
        }
      }
      animationId = requestAnimationFrame(play);
    };

    play();
    return () => cancelAnimationFrame(animationId);
  }, [clubLogos, speed]);

  const handleTouchStart = () => {
    isDragging.current = true;
  };
  const handleTouchEnd = () => {
    setTimeout(() => {
      isDragging.current = false;
    }, 2000);
  };

  if (!clubLogos || clubLogos.length === 0) return null;

  const hasTracker = !!liveByClub && Object.keys(liveByClub).length > 0;
  const L = LEGEND[locale] || LEGEND.en;

  // Is anything live/active right now (for the legend headline pulse)?
  const anyLive = hasTracker && now
    ? Object.values(liveByClub!).some(r => computeStatus(r, now).status !== null)
    : false;

  return (
    <div className={className}>
      <style>{`
        @keyframes clsPing { 75%, 100% { transform: scale(2.2); opacity: 0 } }
        .cls-ping { animation: clsPing 1.4s cubic-bezier(0,0,0.2,1) infinite; }
        @keyframes clsGlow { 0%,100% { opacity: 1 } 50% { opacity: .55 } }
        .cls-glow { animation: clsGlow 1.8s ease-in-out infinite; }
      `}</style>

      {showLegend && hasTracker && (
        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-white/70">
          <span className="flex items-center gap-1.5 text-white/90">
            <span className={`inline-flex h-2 w-2 rounded-full ${anyLive ? 'cls-glow' : ''}`} style={{ background: DOT_COLORS.orange }} />
            {L.live}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex h-2 w-2 rounded-full" style={{ background: DOT_COLORS.green }} /> {L.tonight}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex h-2 w-2 rounded-full" style={{ background: DOT_COLORS.red }} /> {L.last}
          </span>
        </div>
      )}

      <div
        className="w-full overflow-x-auto md:overflow-x-hidden hide-scrollbar cursor-default"
        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Extra top padding gives the status badges room so they are never clipped */}
        <div className="flex items-center w-max pt-6 pb-2">
          {[...clubLogos, ...clubLogos, ...clubLogos, ...clubLogos]
            .filter(club => club.whitelogo || club.picture)
            .map((club, idx) => {
              const live = hasTracker && now ? computeStatus(liveByClub![club.slug], now) : { status: null as Status, count: 0 };
              return (
                <Link
                  href={`${base}/${basePath}/${club.slug}`}
                  key={`${club.slug}-${idx}`}
                  className="inline-flex items-center justify-center px-8 opacity-80 hover:opacity-100 transition-opacity"
                  draggable={false}
                  aria-label={live.status ? `${club.name} — live` : club.name}
                >
                  {/* Wrapper is the positioning context so the badge anchors to the logo, inside the padded row */}
                  <span className="relative inline-flex items-center justify-center">
                    <StatusBadge status={live.status} count={live.count} />
                    <img
                      src={club.whitelogo || club.picture}
                      alt={club.name}
                      className="h-8 md:h-10 w-auto object-contain brightness-0 invert drop-shadow-md pointer-events-none"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
