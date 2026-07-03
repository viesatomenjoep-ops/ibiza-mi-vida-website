'use client';

import React, { useEffect, useState } from 'react';

export function CSSClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div className="w-12 h-12 rounded-full border-2 border-ibiza-green/20 bg-black/40 shadow-md shrink-0 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-ibiza-green/40" />
      </div>
    );
  }

  const hrs = time.getHours();
  const mins = time.getMinutes();
  const secs = time.getSeconds();

  const hrAngle = (hrs % 12) * 30 + mins * 0.5;
  const minAngle = mins * 6;
  const secAngle = secs * 6;

  return (
    <div className="relative w-12 h-12 rounded-full border-2 border-ibiza-green/50 flex items-center justify-center bg-black/50 shadow-[0_0_15px_rgba(0,166,152,0.25)] shrink-0 transition-all">
      {/* Center Pin */}
      <div className="w-1.5 h-1.5 rounded-full bg-ibiza-green z-30 shadow-[0_0_4px_rgba(0,166,152,0.8)]" />
      
      {/* Hour Hand */}
      <div 
        className="absolute w-0.5 h-3 bg-white/90 origin-bottom bottom-[50%] rounded-full z-10"
        style={{ transform: `rotate(${hrAngle}deg)` }}
      />
      
      {/* Minute Hand */}
      <div 
        className="absolute w-[1.5px] h-4.5 bg-white/70 origin-bottom bottom-[50%] rounded-full z-10"
        style={{ transform: `rotate(${minAngle}deg)` }}
      />
      
      {/* Second Hand */}
      <div 
        className="absolute w-[1px] h-5 bg-ibiza-green origin-bottom bottom-[50%] z-20"
        style={{ transform: `rotate(${secAngle}deg)` }}
      />

      {/* Clock Face Indicators */}
      <div className="absolute top-1 w-0.5 h-1 bg-white/30 rounded-full" />
      <div className="absolute bottom-1 w-0.5 h-1 bg-white/30 rounded-full" />
      <div className="absolute left-1 h-0.5 w-1 bg-white/30 rounded-full" />
      <div className="absolute right-1 h-0.5 w-1 bg-white/30 rounded-full" />
    </div>
  );
}
