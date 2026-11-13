'use client';

import React from 'react';
import type { Look } from '@/lib/data/looks';

interface HotspotsProps {
  look: Look;
  framing: 'full' | 'mid' | 'portrait';
  onSelectCategory?: (cat: 'tops' | 'bottoms' | 'full' | 'shoes' | 'acc') => void;
}

const CATEGORIES: ('tops' | 'bottoms' | 'full' | 'shoes' | 'acc')[] = [
  'tops',
  'bottoms',
  'full',
  'shoes',
  'acc',
];

export default function Hotspots({
  look,
  framing,
  onSelectCategory,
}: HotspotsProps) {
  if (framing !== 'full') {
    return null;
  }

  return (
    <div id="hotspots">
      {CATEGORIES.map((cat) => {
        const items = look.pieces[cat];
        const pos = look.hotspots[cat];
        if (!items || items.length === 0 || !pos) return null;

        return (
          <button
            key={cat}
            className="hs"
            style={{
              left: `${pos[0]}%`,
              top: `${pos[1]}%`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectCategory?.(cat);
            }}
            aria-label={`Inspect ${cat}`}
          >
            <em>
              {items.map((p, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <br />}
                  <u>{p.name}</u> · {p.color} · ${p.priceUSD}
                </React.Fragment>
              ))}
            </em>
          </button>
        );
      })}
    </div>
  );
}
