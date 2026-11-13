'use client';

import React from 'react';
import type { Size } from '@/lib/utils/size-guide';

interface SizeSelectorProps {
  sizes?: Size[];
  selectedSize: Size | string;
  onSelectSize: (size: Size) => void;
  suggestedSize?: Size | null;
  stockMap?: Partial<Record<Size, number>>;
  onOpenSizeGuide?: () => void;
}

const DEFAULT_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL'];

export function SizeSelector({
  sizes = DEFAULT_SIZES,
  selectedSize,
  onSelectSize,
  suggestedSize,
  stockMap = {},
  onOpenSizeGuide,
}: SizeSelectorProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Kích cỡ:
          </span>
          <span className="font-mono text-neutral-500 dark:text-neutral-400">
            {selectedSize || 'Chưa chọn'}
          </span>
          {suggestedSize && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              ✨ Gợi ý theo vóc dáng: Size {suggestedSize}
            </span>
          )}
        </div>
        {onOpenSizeGuide && (
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="text-[11px] underline text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
          >
            Hướng dẫn chọn size
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const isSuggested = suggestedSize === size;
          const stock = stockMap[size];
          const isOutOfStock = stock !== undefined && stock === 0;
          const isLowStock = stock !== undefined && stock > 0 && stock <= 3;

          return (
            <button
              key={size}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectSize(size)}
              className={`
                relative min-w-[50px] px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all
                border flex flex-col items-center justify-center gap-0.5
                ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white shadow-sm ring-2 ring-neutral-900/20 dark:ring-white/30'
                    : isOutOfStock
                    ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed dark:bg-neutral-900 dark:text-neutral-600 dark:border-neutral-800 line-through'
                    : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800 dark:hover:border-neutral-700'
                }
                ${isSuggested && !isSelected ? 'border-amber-400 dark:border-amber-500/70 bg-amber-50/40 dark:bg-amber-950/20' : ''}
              `}
            >
              <div className="flex items-center gap-1">
                <span>{size}</span>
                {isSuggested && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                )}
              </div>
              {stock !== undefined && (
                <span
                  className={`text-[9px] font-normal leading-none ${
                    isOutOfStock
                      ? 'text-red-500/80 dark:text-red-400/80'
                      : isLowStock
                      ? isSelected
                        ? 'text-amber-200 dark:text-amber-900 font-semibold'
                        : 'text-amber-600 dark:text-amber-400'
                      : isSelected
                      ? 'text-neutral-300 dark:text-neutral-600'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {isOutOfStock ? 'Hết' : isLowStock ? `Còn ${stock}` : `${stock}c`}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
