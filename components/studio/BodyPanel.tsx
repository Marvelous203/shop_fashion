'use client';

import React, { useState } from 'react';

interface BodyPanelProps {
  height: number;
  build: number;
  framing: 'full' | 'mid' | 'portrait';
  onHeightChange: (h: number, commit?: boolean) => void;
  onBuildChange: (b: number, commit?: boolean) => void;
  onFramingChange: (f: 'full' | 'mid' | 'portrait') => void;
  onRescan?: () => void;
}

const POSTURES = ['Relaxed', 'Confident', 'Editorial'];

const FRAMINGS: { key: 'full' | 'mid' | 'portrait'; label: string }[] = [
  { key: 'full', label: 'Full body' },
  { key: 'mid', label: 'Mid shot' },
  { key: 'portrait', label: 'Portrait' },
];

export function getSuggestedSize(heightCm: number): string {
  if (heightCm <= 155) return 'XS';
  if (heightCm <= 162) return 'S';
  if (heightCm <= 168) return 'M';
  if (heightCm <= 174) return 'L';
  return 'XL';
}

export default function BodyPanel({
  height,
  build,
  framing,
  onHeightChange,
  onBuildChange,
  onFramingChange,
  onRescan,
}: BodyPanelProps) {
  const [activePosture, setActivePosture] = useState('Relaxed');

  const suggestedSize = getSuggestedSize(height);

  const heightPct = ((height - 150) / (185 - 150)) * 100;
  const buildPct = build; // 0-100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="vh">
        <h3>Body</h3>
        <span>proportions</span>
      </div>

      {/* Suggested size banner */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '8px 12px',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
        }}
      >
        <span style={{ color: 'var(--ink-2)' }}>Recommended Size</span>
        <b
          style={{
            background: '#fff',
            color: '#1b1a1d',
            padding: '2px 8px',
            borderRadius: '8px',
            fontWeight: 700,
          }}
        >
          {suggestedSize}
        </b>
      </div>

      {/* Height Slider */}
      <div className="sl">
        <div className="sr">
          <span>Height (cm)</span>
          <b>{height}cm</b>
        </div>
        <input
          type="range"
          min={150}
          max={185}
          value={height}
          style={{ '--p': `${heightPct}%` } as React.CSSProperties}
          onChange={(e) => onHeightChange(Number(e.target.value), false)}
          onPointerUp={(e) =>
            onHeightChange(Number((e.target as HTMLInputElement).value), true)
          }
        />
      </div>

      {/* Build Slider */}
      <div className="sl">
        <div className="sr">
          <span>Build</span>
          <b>{build}</b>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={build}
          style={{ '--p': `${buildPct}%` } as React.CSSProperties}
          onChange={(e) => onBuildChange(Number(e.target.value), false)}
          onPointerUp={(e) =>
            onBuildChange(Number((e.target as HTMLInputElement).value), true)
          }
        />
      </div>

      {/* Posture */}
      <div className="lab">Posture</div>
      <div className="opts" id="po">
        {POSTURES.map((p) => (
          <button
            key={p}
            className={`opt ${activePosture === p ? 'on' : ''}`}
            onClick={() => {
              setActivePosture(p);
              onRescan?.();
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Framing */}
      <div className="lab">Framing</div>
      <div className="opts" id="fr">
        {FRAMINGS.map((f) => (
          <button
            key={f.key}
            className={`opt ${framing === f.key ? 'on' : ''}`}
            data-f={f.key}
            onClick={() => onFramingChange(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
