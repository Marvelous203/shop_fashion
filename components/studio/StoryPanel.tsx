'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Identity } from '@/lib/data/filters';
import type { Look } from '@/lib/data/looks';

interface StoryPanelProps {
  currentLook: Look;
  identity: Identity;
  height: number;
}

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

export default function StoryPanel({
  currentLook,
  identity,
  height,
}: StoryPanelProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [activeTraits, setActiveTraits] = useState(['curious', 'creative', 'gentle']);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateBio = (tr: string[]) => {
    const t0 = tr[0] || 'curious';
    const t1 = tr[1] || t0;
    const t2 = tr[2] || t0;

    return `${identity.name} is ${height} cm of ${t0} energy from ${identity.city}. Mornings start with a long walk along the river in her ${currentLook.name.toLowerCase()} look; friends call her ${t1} and a little ${t2}. She collects film cameras, keeps a sketchbook of strangers' outfits, and is saving for a studio of her own.`;
  };

  const startTyping = (text: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText('');
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 2;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 22);
  };

  useEffect(() => {
    const text = generateBio(activeTraits);
    startTyping(text);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentLook.name, identity.name, identity.city, height, activeTraits]);

  const handleRewrite = () => {
    const shuffled = [...TRAITS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((t) => t.toLowerCase());
    setActiveTraits(shuffled);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="vh">
        <h3>Story</h3>
        <span>auto-written from your choices</span>
      </div>

      <div id="story">
        <span id="stxt">{displayedText}</span>
        <span className="caret" />
      </div>

      <button
        className="outl"
        id="rewrite"
        style={{ marginTop: '14px' }}
        onClick={handleRewrite}
      >
        Rewrite story
      </button>
    </div>
  );
}
