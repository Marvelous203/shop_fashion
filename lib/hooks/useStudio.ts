'use client';

import { useState, useCallback, useEffect } from 'react';
import { useHistory } from './useHistory';
import { LOOKS } from '@/lib/data/looks';
import { FILTERS, IDENTITIES, type Identity } from '@/lib/data/filters';

export interface StudioState {
  lookId: number;         // 0-7
  gradeId: string;        // filter id e.g. "daylight"
  realism: number;        // 0-100, default 75
  height: number;         // 150-185, default 168
  build: number;          // 0-100, default 50
  framing: 'full' | 'mid' | 'portrait'; // default 'full'
  activeTab: 'DNA' | 'BODY' | 'STYLE' | 'PERSONALITY' | 'STORY'; // default 'STYLE'
  activeSideItem: string; // default 'Outfits'
  bx: number;
  by: number;
  mx: number; // parallax
}

export interface SavedLook {
  id: string;
  lookId: number;
  gradeId: string;
  createdAt: number;
}

export const DEFAULT_STUDIO_STATE: StudioState = {
  lookId: 0,
  gradeId: 'daylight',
  realism: 75,
  height: 168,
  build: 50,
  framing: 'full',
  activeTab: 'STYLE',
  activeSideItem: 'Outfits',
  bx: 0,
  by: 0,
  mx: 0,
};

type SnapState = Omit<StudioState, 'bx' | 'by' | 'mx'>;

export function useStudio() {
  const [state, setState] = useState<StudioState>(DEFAULT_STUDIO_STATE);

  // History stack for undo/redo (excluding parallax)
  const snapInitial: SnapState = {
    lookId: DEFAULT_STUDIO_STATE.lookId,
    gradeId: DEFAULT_STUDIO_STATE.gradeId,
    realism: DEFAULT_STUDIO_STATE.realism,
    height: DEFAULT_STUDIO_STATE.height,
    build: DEFAULT_STUDIO_STATE.build,
    framing: DEFAULT_STUDIO_STATE.framing,
    activeTab: DEFAULT_STUDIO_STATE.activeTab,
    activeSideItem: DEFAULT_STUDIO_STATE.activeSideItem,
  };

  const {
    canUndo,
    canRedo,
    push: pushHistory,
    undo: historyUndo,
    redo: historyRedo,
    reset: resetHistory,
  } = useHistory<SnapState>(snapInitial);

  // Identity state
  const [identityIndex, setIdentityIndex] = useState(0);
  const [customName, setCustomName] = useState(IDENTITIES[0].name);

  // Favorites (set of lookIds)
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Saved looks library
  const [savedLibrary, setSavedLibrary] = useState<SavedLook[]>([]);

  // Drawers and popups
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Commit state change to history
  const commit = useCallback(
    (newState: StudioState) => {
      const snap: SnapState = {
        lookId: newState.lookId,
        gradeId: newState.gradeId,
        realism: newState.realism,
        height: newState.height,
        build: newState.build,
        framing: newState.framing,
        activeTab: newState.activeTab,
        activeSideItem: newState.activeSideItem,
      };
      pushHistory(snap);
    },
    [pushHistory]
  );

  const update = useCallback(
    (partial: Partial<StudioState>, shouldCommit = true) => {
      setState((prev) => {
        const next = { ...prev, ...partial };
        if (shouldCommit) {
          commit(next);
        }
        return next;
      });
    },
    [commit]
  );

  const undo = useCallback(() => {
    const snap = historyUndo();
    if (snap) {
      setState((prev) => ({
        ...prev,
        ...snap,
      }));
    }
  }, [historyUndo]);

  const redo = useCallback(() => {
    const snap = historyRedo();
    if (snap) {
      setState((prev) => ({
        ...prev,
        ...snap,
      }));
    }
  }, [historyRedo]);

  const resetAll = useCallback(() => {
    setState(DEFAULT_STUDIO_STATE);
    resetHistory(snapInitial);
  }, [resetHistory, snapInitial]);

  const toggleFavorite = useCallback((lookId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(lookId)) {
        next.delete(lookId);
      } else {
        next.add(lookId);
      }
      return next;
    });
  }, []);

  const saveToLibrary = useCallback(() => {
    const newSaved: SavedLook = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      lookId: state.lookId,
      gradeId: state.gradeId,
      createdAt: Date.now(),
    };
    setSavedLibrary((prev) => [newSaved, ...prev]);
    return newSaved;
  }, [state.lookId, state.gradeId]);

  const currentIdentity: Identity = {
    ...IDENTITIES[identityIndex],
    name: customName || IDENTITIES[identityIndex].name,
  };

  const nextIdentity = useCallback(() => {
    setIdentityIndex((prev) => {
      const nextIdx = (prev + 1) % IDENTITIES.length;
      setCustomName(IDENTITIES[nextIdx].name);
      return nextIdx;
    });
  }, []);

  // Parallax updater (doesn't trigger undo history)
  const setParallax = useCallback((bx: number, by: number, mx: number) => {
    setState((prev) => {
      if (prev.bx === bx && prev.by === by && prev.mx === mx) return prev;
      return { ...prev, bx, by, mx };
    });
  }, []);

  // Keyboard shortcuts: Cmd/Ctrl+Z = undo, Shift+Cmd/Ctrl+Z = redo, ArrowLeft/Right = step looks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.isContentEditable ||
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setState((prev) => {
          const nextLook = (prev.lookId + LOOKS.length - 1) % LOOKS.length;
          const updated = { ...prev, lookId: nextLook };
          commit(updated);
          return updated;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setState((prev) => {
          const nextLook = (prev.lookId + 1) % LOOKS.length;
          const updated = { ...prev, lookId: nextLook };
          commit(updated);
          return updated;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, commit]);

  return {
    state,
    setState,
    update,
    commit,
    undo,
    redo,
    canUndo,
    canRedo,
    resetAll,
    // parallax
    setParallax,
    // identity
    currentIdentity,
    identityIndex,
    setCustomName,
    nextIdentity,
    // favorites
    favorites,
    toggleFavorite,
    isCurrentFavorite: favorites.has(state.lookId),
    // saved library
    savedLibrary,
    saveToLibrary,
    // drawer visibility
    isCartOpen,
    setIsCartOpen,
    isLibraryOpen,
    setIsLibraryOpen,
    isMoreOpen,
    setIsMoreOpen,
  };
}
