'use client';

import React, { useState, useEffect, useRef } from 'react';
import { type Look, buildImageUrl } from '@/lib/data/looks';
import ScanLine from './ScanLine';
import Hotspots from './Hotspots';

interface ModelViewerProps {
  looks: Look[];
  currentLookId: number;
  mx: number;
  height: number;
  build: number;
  framing: 'full' | 'mid' | 'portrait';
  realism: number;
  scanTrigger?: number | string;
  onSelectCategory?: (cat: 'tops' | 'bottoms' | 'full' | 'shoes' | 'acc') => void;
}

export default function ModelViewer({
  looks,
  currentLookId,
  mx,
  height,
  build,
  framing,
  realism,
  scanTrigger,
  onSelectCategory,
}: ModelViewerProps) {
  const currentLook = looks[currentLookId] || looks[0];

  // Transition state for figures wipe animation
  const [prevLookId, setPrevLookId] = useState<number | null>(null);
  const [incomingLookId, setIncomingLookId] = useState<number>(currentLookId);
  const [isWiping, setIsWiping] = useState(false);
  const lastLookIdRef = useRef(currentLookId);

  useEffect(() => {
    if (currentLookId !== lastLookIdRef.current) {
      setPrevLookId(lastLookIdRef.current);
      setIncomingLookId(currentLookId);
      setIsWiping(true);
      lastLookIdRef.current = currentLookId;
    }
  }, [currentLookId]);

  // Realism filter calculation
  const k = Math.max(0, (80 - realism) / 80);
  const realFilter =
    k > 0
      ? `saturate(${1 + k * 0.9}) contrast(${1 + k * 0.25}) blur(${k * 1.4}px) brightness(${1 + k * 0.05})`
      : 'none';

  // Body scale calculations
  const scaleY = 1 + ((height - 168) / 168) * 0.9;
  const scaleX = 1 + ((build - 50) / 50) * 0.07;

  return (
    <div
      id="modelWrap"
      className={framing}
      style={
        {
          '--real': realFilter,
        } as React.CSSProperties
      }
    >
      <div id="shadow" />
      <div
        id="modelInner"
        style={{
          transform: `translate3d(${mx}px, 0, 0) scaleX(${scaleX}) scaleY(${scaleY})`,
        }}
      >
        <div id="breath">
          <div id="figs">
            {/* Previous figure if wiping */}
            {isWiping && prevLookId !== null && looks[prevLookId] && (
              <div
                className="fig"
                style={{
                  backgroundImage: `url("${buildImageUrl(looks[prevLookId].imageFile, 1000)}")`,
                }}
              />
            )}

            {/* Current / Incoming figure */}
            <div
              key={incomingLookId}
              className={`fig ${isWiping ? 'in' : ''}`}
              style={{
                backgroundImage: `url("${buildImageUrl(currentLook.imageFile, 1000)}")`,
              }}
              onAnimationEnd={() => {
                setIsWiping(false);
                setPrevLookId(null);
              }}
            />
          </div>

          <ScanLine triggerKey={`${currentLookId}-${scanTrigger}`} />

          <Hotspots
            look={currentLook}
            framing={framing}
            onSelectCategory={onSelectCategory}
          />
        </div>
      </div>
    </div>
  );
}
