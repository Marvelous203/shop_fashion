'use client';

import { useSyncExternalStore, useCallback } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  priceVND: number;
  size: string;
  color: string;
  quantity: number;
  imageFile: string;
  lookId: number;
}

const STORAGE_KEY = 'vell-cart';

let memoryCart: CartItem[] = [];
let isInitialized = false;
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function initMemoryCart() {
  if (isInitialized) return;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        memoryCart = JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }
  isInitialized = true;
}

function getSnapshot(): CartItem[] {
  if (!isInitialized) {
    initMemoryCart();
  }
  return memoryCart;
}

const SERVER_EMPTY: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return SERVER_EMPTY;
}

function subscribe(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function saveCart(newItems: CartItem[]) {
  memoryCart = newItems;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // ignore
    }
  }
  emitChange();
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((item: CartItem) => {
    const current = memoryCart;
    const existing = current.find(
      (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
    );
    let next: CartItem[];
    if (existing) {
      next = current.map((i) =>
        i.productId === item.productId && i.size === item.size && i.color === item.color
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      next = [...current, item];
    }
    saveCart(next);
  }, []);

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    const current = memoryCart;
    const next = current.filter(
      (i) => !(i.productId === productId && i.size === size && i.color === color)
    );
    saveCart(next);
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }
      const current = memoryCart;
      const next = current.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      );
      saveCart(next);
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const totalVND = items.reduce((sum, i) => sum + i.priceVND * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, totalVND, totalItems };
}
