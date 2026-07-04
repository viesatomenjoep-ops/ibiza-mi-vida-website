'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

interface ClubLogoSliderProps {
  clubLogos: Array<{ slug: string; name: string; whitelogo?: string; picture?: string; }>;
  base: string;
  className?: string;
  basePath?: string;
}

export function ClubLogoSlider({ clubLogos, base, className = "w-full relative z-20 bg-black/80 py-4 border-t border-white/10 border-b", basePath = "club-tickets" }: ClubLogoSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || clubLogos.length === 0) return;

    let animationId: number;
    const speed = 0.5;

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
  }, [clubLogos]);

  const handleTouchStart = () => {
    isDragging.current = true;
  };
  const handleTouchEnd = () => { 
    // Wait for native momentum scroll to finish before resuming auto-play
    setTimeout(() => {
      isDragging.current = false;
    }, 2000); 
  };

  if (!clubLogos || clubLogos.length === 0) return null;

  return (
    <div className={className}>
      <div
        className="w-full overflow-x-auto md:overflow-x-hidden hide-scrollbar cursor-default"
        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div className="flex items-center w-max">
          {[...clubLogos, ...clubLogos, ...clubLogos, ...clubLogos]
            .filter(club => club.whitelogo || club.picture)
            .map((club, idx) => (
            <Link 
              href={`${base}/${basePath}/${club.slug}`}
              key={`${club.slug}-${idx}`} 
              className="inline-flex items-center justify-center px-8 opacity-80 hover:opacity-100 transition-opacity"
              draggable={false}
            >
              <img
                src={club.whitelogo || club.picture}
                alt={club.name}
                className="h-8 md:h-10 w-auto object-contain brightness-0 invert drop-shadow-md pointer-events-none"
                loading="lazy"
                decoding="async"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
