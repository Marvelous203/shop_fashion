'use client';

import React, { useState } from 'react';
import { FILTERS, type Filter } from '@/lib/data/filters';
import { buildImageUrl, type Look } from '@/lib/data/looks';

interface FilterPanelProps {
  currentLook: Look;
  currentGradeId: string;
  onSelectGradeId: (gradeId: string) => void;
}

export default function FilterPanel({
  currentLook,
  currentGradeId,
  onSelectGradeId,
}: FilterPanelProps) {
  const [winStart, setWinStart] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeFilter =
    FILTERS.find((f) => f.id === currentGradeId) || FILTERS[0];

  const handleNudge = () => {
    setWinStart((prev) => (prev + 1) % FILTERS.length);
  };

  // 64px thumbnail crop
  const k = 64 / 360;
  const avatarUrl = buildImageUrl(currentLook.imageFile, 1000);

  // 5 visible thumbnails in the sliding window
  const visibleIndices = [0, 1, 2, 3, 4].map(
    (offset) => (winStart + offset) % FILTERS.length
  );

  return (
    <div id="filt" className="glass">
      {/* Dropdown selector */}
      <div className="ddc">
        <div className="t">Filter</div>
        <div className="ddw">
          <button
            id="ddb"
            className={isDropdownOpen ? 'open' : ''}
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen((prev) => !prev);
            }}
          >
            <span id="ddn">{activeFilter.name}</span>
            <svg className="ic" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div className={`ddl ${isDropdownOpen ? 'on' : ''}`} id="ddl">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={f.id === currentGradeId ? 'on' : ''}
                onClick={() => {
                  onSelectGradeId(f.id);
                  setIsDropdownOpen(false);
                }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div id="thumbs">
        {visibleIndices.map((filterIdx) => {
          const filter = FILTERS[filterIdx];
          const isSelected = filter.id === currentGradeId;

          return (
            <button
              key={`${filterIdx}-${filter.id}`}
              className={`th ${isSelected ? 'on' : ''}`}
              title={filter.name}
              onClick={() => onSelectGradeId(filter.id)}
            >
              <span
                className="fc"
                style={{
                  backgroundImage: `url("${avatarUrl}")`,
                  backgroundSize: `${1360 * k}px ${2048 * k}px`,
                  backgroundPosition: `${-500 * k}px ${-46 * k}px`,
                  filter: filter.gradeFilter,
                }}
              />
              <i style={{ background: filter.tintBackground }} />
            </button>
          );
        })}
      </div>

      {/* Next filters button */}
      <button
        id="nxt"
        aria-label="Next filters"
        onClick={handleNudge}
      >
        <svg className="ic" viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
