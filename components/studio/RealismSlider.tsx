'use client';

import React from 'react';

interface RealismSliderProps {
  realism: number;
  onRealismChange: (val: number, commit?: boolean) => void;
  onRescan?: () => void;
}

export default function RealismSlider({
  realism,
  onRealismChange,
  onRescan,
}: RealismSliderProps) {
  const pct = realism;

  return (
    <div id="real" className="glass">
      <div className="t">Realism</div>
      <div className="rr">
        <input
          type="range"
          id="realR"
          min={0}
          max={100}
          value={realism}
          style={{ '--p': `${pct}%` } as React.CSSProperties}
          onChange={(e) => onRealismChange(Number(e.target.value), false)}
          onPointerUp={(e) => {
            const val = Number((e.target as HTMLInputElement).value);
            onRealismChange(val, true);
            onRescan?.();
          }}
        />
        <b id="realV">{realism}%</b>
      </div>
      <div className="rl">
        <span>Stylized</span>
        <span>Hyper Realistic</span>
      </div>
    </div>
  );
}
