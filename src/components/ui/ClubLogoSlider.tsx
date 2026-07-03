'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

interface ClubLogoSliderProps {
  clubLogos: Array<{ slug: string; name: string; whitelogo?: string; picture?: string; }>;
  base: string;
  className?: string;
}

export function ClubLogoSlider({ clubLogos, base, className = "w-full relative z-20 bg-black/80 py-4 border-t border-white/10 border-b" }: ClubLogoSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || clubLogos.length === 0) return;

    let animationId: number;
    const speed = 0.5;

    const play = () => {
      if (!isDragging.current && slider) {
        slider.scrollLeft += speed;
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(play);
    };

    play();
    return () => cancelAnimationFrame(animationId);
  }, [clubLogos]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (sliderRef.current?.offsetLeft || 0);
    scrollLeft.current = sliderRef.current?.scrollLeft || 0;
  };
  const handleMouseLeave = () => { isDragging.current = false; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (sliderRef.current) sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
    scrollLeft.current = sliderRef.current?.scrollLeft || 0;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (sliderRef.current) sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const handleTouchEnd = () => { isDragging.current = false; };

  if (!clubLogos || clubLogos.length === 0) return null;

  return (
    <div className={className}>
      <div 
        className="w-full overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing" 
        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center w-max">
          {[...clubLogos, ...clubLogos, ...clubLogos, ...clubLogos]
            .filter(club => club.whitelogo || club.picture)
            .map((club, idx) => (
            <Link 
              href={`${base}/club-tickets/${club.slug}`}
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
