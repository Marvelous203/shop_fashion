'use client';

import React from 'react';

interface ColorSwatchProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const COLOR_MAP: Record<string, { bg: string; border?: string }> = {
  Charcoal: { bg: '#2b2d2f' },
  'Light wash': { bg: '#8ba6c1' },
  Black: { bg: '#171717' },
  '14k': { bg: '#e5c158' },
  Oat: { bg: '#d8ccb8' },
  White: { bg: '#ffffff', border: '#e5e5e5' },
  Cream: { bg: '#fdfbf0', border: '#e8e4d8' },
  'Heather grey': { bg: '#9ba0a5' },
  Brown: { bg: '#5c3a21' },
  Lilac: { bg: '#c8a2c8' },
  'Powder blue': { bg: '#a4c2cb' },
  Ivory: { bg: '#fcf6eb', border: '#ebe3d3' },
  Sage: { bg: '#919f8a' },
  Silver: { bg: '#d4d8dd' },
  Khaki: { bg: '#b8a688' },
};

export function ColorSwatch({ colors, selectedColor, onSelectColor }: ColorSwatchProps) {
  // deduplicate colors
  const uniqueColors = Array.from(new Set(colors));

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
          Màu sắc:
        </span>
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          {selectedColor || 'Mặc định'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {uniqueColors.map((color) => {
          const isSelected = selectedColor === color;
          const colorMeta = COLOR_MAP[color] || { bg: '#666666' };

          return (
            <button
              key={color}
              type="button"
              onClick={() => onSelectColor(color)}
              title={color}
              className={`
                group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
                }
              `}
            >
              <span
                className="w-3.5 h-3.5 rounded-full shadow-inner shrink-0"
                style={{
                  backgroundColor: colorMeta.bg,
                  border: colorMeta.border ? `1px solid ${colorMeta.border}` : '1px solid rgba(0,0,0,0.1)',
                }}
              />
              <span>{color}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
