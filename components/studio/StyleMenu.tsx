'use client';

import React, { useRef, useEffect, useState } from 'react';
import { showToast } from './Toast';

export type StyleSectionKey =
  | 'face'
  | 'hair'
  | 'makeup'
  | 'body'
  | 'outfits'
  | 'acc'
  | 'tattoo'
  | 'details';

interface StyleMenuProps {
  activeSection: string;
  onSelectSection: (key: StyleSectionKey) => void;
  onRandomize: () => void;
  isStyleTab: boolean;
}

interface MenuItem {
  key: StyleSectionKey;
  label: string;
  isComingSoon?: boolean;
  icon: React.ReactNode;
}

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'face',
    label: 'Face',
    isComingSoon: true,
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9 10v1M15 10v1M9 15c1.7 1.6 4.3 1.6 6 0" />
      </svg>
    ),
  },
  {
    key: 'hair',
    label: 'Hair',
    isComingSoon: true,
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M5 20c0-8 2-15 7-15s7 7 7 15" />
        <path d="M9 20c0-5 1-9 3-9s3 4 3 9" />
      </svg>
    ),
  },
  {
    key: 'makeup',
    label: 'Makeup',
    isComingSoon: true,
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M3 12c3-4 6-3 9-1 3-2 6-3 9 1-3 5-6 6-9 6s-6-1-9-6z" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
  {
    key: 'body',
    label: 'Body',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="2.3" />
        <path d="M12 8v6M7 10l5-2 5 2M9 21l3-7 3 7" />
      </svg>
    ),
  },
  {
    key: 'outfits',
    label: 'Outfits',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M8 4l-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3a4 4 0 0 1-8 0z" />
      </svg>
    ),
  },
  {
    key: 'acc',
    label: 'Accessories',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M7 3h10l4 5-9 13L3 8z" />
        <path d="M3 8h18M9 3l3 5 3-5M12 21L9 8M12 21l3-13" />
      </svg>
    ),
  },
  {
    key: 'tattoo',
    label: 'Tattoos',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M12 3c3 4 6 6 6 10a6 6 0 0 1-12 0c0-4 3-6 6-10z" />
      </svg>
    ),
  },
  {
    key: 'details',
    label: 'Details',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </svg>
    ),
  },
];

export default function StyleMenu({
  activeSection,
  onSelectSection,
  onRandomize,
  isStyleTab,
}: StyleMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indTop, setIndTop] = useState(10);
  const [randRot, setRandRot] = useState(0);

  const normalizedActive = activeSection.toLowerCase();

  useEffect(() => {
    if (!containerRef.current) return;
    const activeBtn = containerRef.current.querySelector<HTMLButtonElement>(
      `button[data-k="${normalizedActive}"]`
    );
    if (activeBtn) {
      setIndTop(activeBtn.offsetTop);
    }
  }, [normalizedActive]);

  const handleRandClick = () => {
    setRandRot((prev) => prev + 360);
    onRandomize();
  };

  return (
    <>
      <div
        id="side"
        className="glass"
        ref={containerRef}
        style={{
          transform: isStyleTab ? 'none' : 'translateX(-240px)',
        }}
      >
        <i
          id="sideInd"
          className="pill-on"
          style={{ top: `${indTop}px` }}
        />
        {MENU_ITEMS.map((item) => {
          const isActive = normalizedActive === item.key;
          return (
            <button
              key={item.key}
              data-k={item.key}
              className={isActive ? 'on' : ''}
              style={
                item.isComingSoon
                  ? { opacity: 0.55, cursor: 'not-allowed' }
                  : undefined
              }
              title={item.isComingSoon ? '✕ Coming soon' : undefined}
              onClick={() => {
                if (item.isComingSoon) {
                  showToast(`${item.label}: ✕ Coming soon`);
                }
                onSelectSection(item.key);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.isComingSoon && (
                <span
                  style={{
                    fontSize: '10px',
                    marginLeft: 'auto',
                    opacity: 0.8,
                    background: 'rgba(255,255,255,0.15)',
                    padding: '2px 5px',
                    borderRadius: '6px',
                  }}
                >
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        id="rand"
        className="glass"
        style={{
          transform: isStyleTab ? 'none' : 'translateX(-280px)',
        }}
        onClick={handleRandClick}
      >
        <svg
          className="ic"
          viewBox="0 0 24 24"
          style={{
            transform: `rotate(${randRot}deg)`,
            transition: 'transform .8s cubic-bezier(.3,.7,.3,1)',
          }}
        >
          <path d="M20 11a8 8 0 0 0-14-4M4 4v4h4" />
          <path d="M4 13a8 8 0 0 0 14 4M20 20v-4h-4" />
        </svg>
        Randomize VELL
      </button>
    </>
  );
}
