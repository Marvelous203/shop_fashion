'use client';

import React from 'react';
import { buildImageUrl } from '@/lib/data/looks';

interface SceneProps {
  gradeFilter: string;
  tintBackground: string;
  bx: number;
  by: number;
  realism?: number;
}

const DEFAULT_BG_FILE = 'hf_20261112_034551_6394b127-5366-40a8-9c82-3c416f1161f1.png';
const BG_URL = buildImageUrl(DEFAULT_BG_FILE, 2400);

export default function Scene({
  gradeFilter,
  tintBackground,
  bx,
  by,
  realism = 75,
}: SceneProps) {
  const k = Math.max(0, (80 - realism) / 80);
  const bgFilter = k > 0 ? `blur(${k * 5}px) saturate(${1 + k * 0.5})` : 'none';

  return (
    <div id="scene">
      <div id="grade" style={{ filter: gradeFilter }}>
        <div
          id="bg"
          style={{
            backgroundImage: `url("${BG_URL}")`,
            transform: `translate3d(${bx}px, ${by}px, 0) scale(1.04)`,
            filter: bgFilter,
          }}
        />
        <div id="tint" style={{ background: tintBackground }} />
      </div>
      <div id="vignette" />
    </div>
  );
}
