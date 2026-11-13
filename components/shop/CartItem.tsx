'use client';

import React from 'react';
import type { CartItem as CartItemType } from '@/lib/hooks/useCart';
import { formatVND } from '@/lib/utils/format';
import { buildImageUrl } from '@/lib/data/looks';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, size: string, color: string, qty: number) => void;
  onRemove: (productId: string, size: string, color: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const imageUrl = item.imageFile
    ? item.imageFile.startsWith('http')
      ? item.imageFile
      : buildImageUrl(item.imageFile, 200)
    : '/placeholder.png';

  return (
    <div className="flex items-center gap-4 py-4 border-b border-neutral-100 dark:border-neutral-800">
      {/* Thumbnail */}
      <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200/60 dark:border-neutral-800">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {item.name}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-[10px]">
              Size: {item.size}
            </span>
            <span>•</span>
            <span>Màu: {item.color}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
              className="px-2.5 py-1 text-xs text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition"
              aria-label="Giảm số lượng"
            >
              -
            </button>
            <span className="px-2.5 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200 min-w-[28px] text-center">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
              className="px-2.5 py-1 text-xs text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition"
              aria-label="Tăng số lượng"
            >
              +
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-bold text-neutral-900 dark:text-white">
              {formatVND(item.priceVND * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[10px] text-neutral-400">
                {formatVND(item.priceVND)} / món
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => onRemove(item.productId, item.size, item.color)}
        className="p-1.5 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition self-start"
        aria-label="Xóa sản phẩm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
