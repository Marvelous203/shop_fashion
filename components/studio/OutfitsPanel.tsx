'use client';

import React, { useState } from 'react';
import { type Look, type PieceItem, buildImageUrl } from '@/lib/data/looks';

interface OutfitsPanelProps {
  looks: Look[];
  currentLookId: number;
  onSelectLook: (id: number) => void;
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  openCategory?: 'tops' | 'bottoms' | 'full' | 'shoes' | 'acc' | null;
  onToggleCategory?: (cat: 'tops' | 'bottoms' | 'full' | 'shoes' | 'acc') => void;
  cartItemIds: Set<string>;
  onToggleCartItem: (piece: PieceItem, cat: string, lookId: number) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'everyday', label: 'Everyday', icon: 'tee' },
  { id: 'athletic', label: 'Athletic', icon: 'run' },
  { id: 'sleep', label: 'Sleep', icon: 'moon' },
  { id: 'formal', label: 'Formal', icon: 'hanger' },
  { id: 'party', label: 'Party', icon: 'dress' },
  { id: 'street', label: 'Street', icon: 'hoodie' },
];

const ACCORDION_GROUPS: {
  key: 'tops' | 'bottoms' | 'full' | 'shoes' | 'acc';
  label: string;
}[] = [
  { key: 'tops', label: 'TOPS' },
  { key: 'bottoms', label: 'BOTTOMS' },
  { key: 'full', label: 'FULL BODY' },
  { key: 'shoes', label: 'SHOES' },
  { key: 'acc', label: 'ACCESSORIES' },
];

function CategoryIcon({ type }: { type: string }) {
  switch (type) {
    case 'grid':
      return (
        <svg className="ic" viewBox="0 0 24 24">
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
        </svg>
      );
    case 'tee':
      return (
        <svg className="ic" viewBox="0 0 24 24">
          <path d="M8 4l-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3a4 4 0 0 1-8 0z" />
        </svg>
      );
    case 'run':
      return (
        <svg className="ic" viewBox="0 0 24 24">
          <circle cx="14" cy="5" r="2" />
          <path d="M6 20l3-6 3 2 2-5-3-2-3 2M12 16l1 4M14 11l4 1" />
        </svg>
      );
    case 'moon':
      return (
        <svg className="ic" viewBox="0 0 24 24">
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </svg>
      );
    case 'hanger':
      return (
        <svg className="ic" viewBox="0 0 24 24">
          <path d="M12 7a2 2 0 1 0-2-2" />
          <path d="M12 7v2L3 15.5a1 1 0 0 0 .6 1.8h16.8a1 1 0 0 0 .6-1.8L12 9" />
        </svg>
      );
    case 'dress':
      return (
        <svg className="ic" viewBox="0 0 24 24">
          <path d="M9 3l3 3 3-3 1 6-2 3 4 9H7l4-9-2-3z" />
        </svg>
      );
    case 'hoodie':
      return (
        <svg className="ic" viewBox="0 0 24 24">
          <path d="M8 4c0 2 1.8 3 4 3s4-1 4-3l4 2.5-1.5 5L16 10v10H8V10l-2.5 1.5-1.5-5z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function OutfitsPanel({
  looks,
  currentLookId,
  onSelectLook,
  favorites,
  onToggleFavorite,
  openCategory,
  onToggleCategory,
  cartItemIds,
  onToggleCartItem,
}: OutfitsPanelProps) {
  const [selectedCat, setSelectedCat] = useState('all');

  const filteredLooks = looks.filter(
    (l) => selectedCat === 'all' || l.category === selectedCat
  );

  const currentLook = looks[currentLookId] || looks[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="vh">
        <h3>Outfits</h3>
        <span>
          {filteredLooks.length} look{filteredLooks.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Category chips */}
      <div id="chips">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`chip ${selectedCat === cat.id ? 'on' : ''}`}
            onClick={() => setSelectedCat(cat.id)}
          >
            <span className="ct">
              <CategoryIcon type={cat.icon} />
            </span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Looks Grid */}
      <div id="grid">
        {filteredLooks.map((look) => {
          const isSelected = look.id === currentLookId;
          const isFav = favorites.has(look.id);
          const thumbUrl = buildImageUrl(look.imageFile, 360);

          return (
            <div
              key={look.id}
              className={`card ${isSelected ? 'on' : ''}`}
              onClick={() => onSelectLook(look.id)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(look.id);
              }}
            >
              <div
                className="im"
                style={{ backgroundImage: `url("${thumbUrl}")` }}
              />
              <span className="nm">{look.name}</span>
              <span
                className={`hb ${isFav ? 'on' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(look.id);
                }}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
                </svg>
              </span>
            </div>
          );
        })}
      </div>

      {/* Accordion Pieces */}
      <div id="acc">
        {ACCORDION_GROUPS.map((group) => {
          const items = currentLook.pieces[group.key] || [];
          const isOpen = openCategory === group.key;

          return (
            <div
              key={group.key}
              className={`row ${isOpen ? 'open' : ''}`}
              data-g={group.key}
            >
              <button
                className="rh"
                onClick={() => onToggleCategory?.(group.key)}
              >
                <span>
                  {group.label}
                  {items.length > 0 && <small> · {items.length}</small>}
                </span>
                <svg className="ic" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className="ab">
                <div>
                  {items.length === 0 ? (
                    <div className="it none">Nothing in this look</div>
                  ) : (
                    items.map((item, idx) => {
                      const pieceCartId = `${currentLook.id}-${group.key}-${item.name}`;
                      const inCart = cartItemIds.has(pieceCartId);

                      return (
                        <div key={idx} className="it">
                          <span className="in">
                            {item.name}
                            <small>{item.color}</small>
                          </span>
                          <b>${item.priceUSD}</b>
                          <button
                            className={`add ${inCart ? 'on' : ''}`}
                            aria-label="Toggle in cart"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleCartItem(item, group.key, currentLook.id);
                            }}
                          >
                            {inCart ? (
                              <svg className="ic" viewBox="0 0 24 24">
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                              </svg>
                            ) : (
                              <svg className="ic" viewBox="0 0 24 24">
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
