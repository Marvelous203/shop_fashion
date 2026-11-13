'use client';

import React, { useState, useMemo } from 'react';

const TRAITS = [
  'Curious',
  'Bold',
  'Calm',
  'Witty',
  'Romantic',
  'Driven',
  'Playful',
  'Gentle',
  'Creative',
  'Loyal',
];

const AX = ['Openness', 'Energy', 'Warmth', 'Focus', 'Humour'];

const hashVal = (s: string) => {
  let h = 7;
  for (const c of s) {
    h = (h * 31 + c.charCodeAt(0)) >>> 0;
  }
  return h;
};

export default function PersonalityPanel() {
  const [traits, setTraits] = useState<string[]>([
    'Curious',
    'Creative',
    'Gentle',
  ]);
  const [sliderOverrides, setSliderOverrides] = useState<
    Record<number, number>
  >({});

  // Calculate radar values
  const radarValues = useMemo(() => {
    return AX.map((axis, i) => {
      if (sliderOverrides[i] !== undefined) {
        return sliderOverrides[i];
      }
      return 30 + (traits.reduce((s, t) => s + hashVal(t + ':' + axis), 0) % 65);
    });
  }, [traits, sliderOverrides]);

  const toggleTrait = (t: string) => {
    setTraits((prev) => {
      let next: string[];
      if (prev.includes(t)) {
        next = prev.filter((x) => x !== t);
      } else {
        next = [...prev, t];
        if (next.length > 3) {
          next.shift();
        }
      }
      return next.length > 0 ? next : [t];
    });
  };

  // Radar geometry
  const cx = 125;
  const cy = 108;
  const R = 78;

  const getPt = (i: number, r: number) => {
    const rad = ((-90 + 72 * i) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };

  const gridPolygons = [0.25, 0.5, 0.75, 1].map((f) => {
    return AX.map((_, i) => getPt(i, R * f).join(',')).join(' ');
  });

  const valuePolygon = radarValues
    .map((v, i) => getPt(i, (R * v) / 100).join(','))
    .join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="vh">
        <h3>Personality</h3>
        <span>pick up to 3</span>
      </div>

      <div className="opts" id="tr">
        {TRAITS.map((t) => (
          <button
            key={t}
            className={`opt ${traits.includes(t) ? 'on' : ''}`}
            onClick={() => toggleTrait(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <svg id="radar" viewBox="0 0 250 210" width="250" height="210">
        {/* concentric webs */}
        {gridPolygons.map((poly, idx) => (
          <polygon
            key={idx}
            points={poly}
            fill="none"
            stroke="rgba(255,255,255,.25)"
          />
        ))}

        {/* axis lines */}
        {AX.map((_, i) => {
          const p = getPt(i, R);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p[0]}
              y2={p[1]}
              stroke="rgba(255,255,255,.18)"
            />
          );
        })}

        {/* value polygon */}
        <polygon
          points={valuePolygon}
          fill="rgba(255,255,255,.28)"
          stroke="#fff"
          strokeWidth="1.5"
        />

        {/* labels */}
        {AX.map((a, i) => {
          const p = getPt(i, R + 14);
          const c = Math.cos(((-90 + 72 * i) * Math.PI) / 180);
          const anchor = c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle';
          return (
            <text
              key={a}
              x={p[0]}
              y={p[1] + 4}
              fill="#fff"
              fontSize="11"
              fontFamily="var(--font-figtree, sans-serif)"
              textAnchor={anchor}
            >
              {a}
            </text>
          );
        })}
      </svg>

      {/* Sliders for top 2 axes */}
      {[0, 1].map((idx) => {
        const val = radarValues[idx];
        return (
          <div key={AX[idx]} className="sl">
            <div className="sr">
              <span>{AX[idx]}</span>
              <b>{val}%</b>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={val}
              style={{ '--p': `${val}%` } as React.CSSProperties}
              onChange={(e) =>
                setSliderOverrides((prev) => ({
                  ...prev,
                  [idx]: Number(e.target.value),
                }))
              }
            />
          </div>
        );
      })}
    </div>
  );
}
