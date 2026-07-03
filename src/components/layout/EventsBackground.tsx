'use client'

import React from 'react'

export function EventsBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white">
      {/* Light Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
        src="https://res.cloudinary.com/daj1lyfgk/video/upload/v1783098563/zna3zmwypuqpikuatbqy.mp4"
      />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* Vertical Scrolling Logos */}
      <div className="absolute inset-0 flex justify-evenly overflow-hidden opacity-10">
        {[0, 1, 2, 3, 4, 5].map((colIndex) => (
          <div 
            key={colIndex} 
            className="w-24 md:w-32 flex flex-col gap-12"
            style={{
              animation: `marquee-vertical ${30 + colIndex * 5}s linear infinite ${colIndex % 2 === 1 ? 'reverse' : 'normal'}`,
              animationDelay: `-${colIndex * 6}s`
            }}
          >
            {[1,2,3,4,5,6].map((i) => (
              <React.Fragment key={`${colIndex}-${i}`}>
                <img src="/logos/amnesia.png" alt="" className="w-full object-contain filter invert" />
                <img src="/logos/pacha.png" alt="" className="w-full object-contain filter invert" />
                <img src="/logos/hi.png" alt="" className="w-full object-contain filter invert" />
                <img src="/logos/ushuaia.png" alt="" className="w-full object-contain filter invert" />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
