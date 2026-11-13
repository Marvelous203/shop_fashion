'use client';

import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState<number>(0);

  const push = useCallback((newState: T) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, index + 1);
      return [...sliced, newState];
    });
    setIndex((prev) => prev + 1);
  }, [index]);

  const undo = useCallback((): T | null => {
    if (index > 0) {
      const nextIdx = index - 1;
      setIndex(nextIdx);
      return history[nextIdx];
    }
    return null;
  }, [index, history]);

  const redo = useCallback((): T | null => {
    if (index < history.length - 1) {
      const nextIdx = index + 1;
      setIndex(nextIdx);
      return history[nextIdx];
    }
    return null;
  }, [index, history]);

  const reset = useCallback((state: T) => {
    setHistory([state]);
    setIndex(0);
  }, []);

  return {
    current: history[index],
    canUndo: index > 0,
    canRedo: index < history.length - 1,
    push,
    undo,
    redo,
    reset,
    historyIndex: index,
  };
}
