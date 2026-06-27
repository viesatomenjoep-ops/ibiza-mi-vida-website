import React from 'react';

export function WaveBottom({ fill, className }: { fill: string; className?: string }) {
  return (
    <div style={{ lineHeight: 0, overflow: "hidden", marginBottom: -2 }} className={className}>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 90 }}>
        <path d="M0,0 C480,90 960,90 1440,0 L1440,90 L0,90 Z" fill={fill} />
      </svg>
    </div>
  );
}

export function WaveTop({ fill, className }: { fill: string; className?: string }) {
  return (
    <div style={{ lineHeight: 0, overflow: "hidden", marginTop: -2 }} className={className}>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 90 }}>
        <path d="M0,90 C480,0 960,0 1440,90 L1440,0 L0,0 Z" fill={fill} />
      </svg>
    </div>
  );
}

export function WaveAsym({ fill, flip, className }: { fill: string; flip?: boolean; className?: string }) {
  return (
    <div style={{ lineHeight: 0, overflow: "hidden" }} className={className}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80, transform: flip ? "scaleX(-1)" : "none" }}>
        <path d="M0,0 C200,80 700,0 1440,60 L1440,80 L0,80 Z" fill={fill} />
      </svg>
    </div>
  );
}
