'use client';

import React from 'react';
import type { SavedLook } from '@/lib/hooks/useStudio';
import { type Look, buildImageUrl } from '@/lib/data/looks';
import { FILTERS } from '@/lib/data/filters';

interface LibraryDrawerProps {
  isOpen: boolean;
  savedLooks: SavedLook[];
  looks: Look[];
  onSelectSaved: (lookId: number, gradeId: string) => void;
}

export default function LibraryDrawer({
  isOpen,
  savedLooks,
  looks,
  onSelectSaved,
}: LibraryDrawerProps) {
  return (
    <div id="lib" className={`glass ${isOpen ? 'on' : ''}`}>
      <div className="vh">
        <h3>Library</h3>
        <span id="libN">{savedLooks.length} saved</span>
      </div>

      <div id="libRow">
        {savedLooks.length === 0 ? (
          <em>Save a look to start your library.</em>
        ) : (
          savedLooks.map((item) => {
            const look = looks[item.lookId] || looks[0];
            const filter =
              FILTERS.find((f) => f.id === item.gradeId) || FILTERS[0];
            const thumbUrl = buildImageUrl(look.imageFile, 360);

            return (
              <div
                key={item.id}
                className="sc pop"
                onClick={() => onSelectSaved(item.lookId, item.gradeId)}
                title={`${look.name} (${filter.name})`}
              >
                <div
                  className="im"
                  style={{
                    backgroundImage: `url("${thumbUrl}")`,
                    filter: filter.gradeFilter,
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
