'use client';

import React, { useRef, useEffect, useState } from 'react';
import { showToast } from './Toast';

export type TabKey = 'DNA' | 'BODY' | 'STYLE' | 'PERSONALITY' | 'STORY';

interface TopBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  cartCount: number;
  onToggleCart: () => void;
  favCount: number;
  isCurrentFav: boolean;
  onToggleFav: () => void;
  savedCount: number;
  onToggleLib: () => void;
  isMoreOpen: boolean;
  setIsMoreOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'DNA', label: 'DNA' },
  { key: 'BODY', label: 'BODY' },
  { key: 'STYLE', label: 'STYLE' },
  { key: 'PERSONALITY', label: 'PERSONALITY' },
  { key: 'STORY', label: 'STORY' },
];

export default function TopBar({
  activeTab,
  onTabChange,
  cartCount,
  onToggleCart,
  favCount,
  isCurrentFav,
  onToggleFav,
  savedCount,
  onToggleLib,
  isMoreOpen,
  setIsMoreOpen,
}: TopBarProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [indStyle, setIndStyle] = useState<{ left: number; width: number }>({
    left: 4,
    width: 100,
  });

  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeBtn = tabsContainerRef.current.querySelector<HTMLButtonElement>(
      `button[data-t="${activeTab}"]`
    );
    if (activeBtn) {
      setIndStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [activeTab]);

  const handleMoreAction = (msg: string) => {
    setIsMoreOpen(false);
    if (msg === 'Share link copied') {
      try {
        navigator.clipboard.writeText(window.location.href);
      } catch {
        // ignore
      }
    }
    showToast(msg);
  };

  return (
    <>
      <div id="logo">
        <b>VELL</b>
        <span>CREATE A VELL</span>
      </div>

      <div id="tabs" className="glass" ref={tabsContainerRef}>
        <i
          id="tabInd"
          className="pill-on"
          style={{
            left: `${indStyle.left}px`,
            width: `${indStyle.width}px`,
          }}
        />
        {TABS.map((tab) => (
          <button
            key={tab.key}
            data-t={tab.key}
            className={activeTab === tab.key ? 'on' : ''}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id="icons">
        {/* Cart */}
        <button
          className="ib glass"
          id="btnCart"
          aria-label="Cart"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCart();
          }}
        >
          <svg className="ic" viewBox="0 0 24 24">
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2.5 3.5h3l2.4 11.2h10.2l2-8H6.4" />
          </svg>
          <span
            className={`bd ${cartCount > 0 ? 'on bump' : ''}`}
            id="bdCart"
          >
            {cartCount > 0 ? cartCount : ''}
          </span>
        </button>

        {/* Favorites */}
        <button
          className={`ib glass ${isCurrentFav ? 'filled' : ''}`}
          id="btnFav"
          aria-label="Favourites"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav();
          }}
        >
          <svg className="ic" viewBox="0 0 24 24">
            <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
          </svg>
          <span
            className={`bd ${favCount > 0 ? 'on' : ''}`}
            id="bdFav"
          >
            {favCount > 0 ? favCount : ''}
          </span>
        </button>

        {/* Library */}
        <button
          className="ib glass"
          id="btnLib"
          aria-label="Library"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLib();
          }}
        >
          <svg className="ic" viewBox="0 0 24 24">
            <path d="M5 8h14l-1 12H6L5 8z" />
            <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
          </svg>
          <span
            className={`bd ${savedCount > 0 ? 'on' : ''}`}
            id="bdLib"
          >
            {savedCount > 0 ? savedCount : ''}
          </span>
        </button>

        {/* More */}
        <button
          className="ib glass"
          id="btnMore"
          aria-label="More"
          onClick={(e) => {
            e.stopPropagation();
            setIsMoreOpen((prev) => !prev);
          }}
        >
          <svg className="ic" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="1.3" fill="currentColor" />
            <circle cx="12" cy="12" r="1.3" fill="currentColor" />
            <circle cx="19" cy="12" r="1.3" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div id="more" className={`glass ${isMoreOpen ? 'on' : ''}`}>
        <button onClick={() => handleMoreAction('Share link copied')}>
          Share look
        </button>
        <button onClick={() => handleMoreAction('Exported 4K render')}>
          Export render
        </button>
        <button onClick={() => handleMoreAction('Duplicated as new VELL')}>
          Duplicate
        </button>
        <button onClick={() => handleMoreAction('Settings saved')}>
          Settings
        </button>
      </div>
    </>
  );
}
