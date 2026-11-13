'use client';

import React, { useState } from 'react';
import type { Look } from '@/lib/data/looks';
import type { Product } from '@/lib/data/products';
import { formatVND } from '@/lib/utils/format';
import { useCart } from '@/lib/hooks/useCart';

interface BundleDealProps {
  look: Look;
  products: Product[];
}

export function BundleDeal({ look, products }: BundleDealProps) {
  const { addItem } = useCart();
  const [selectedIds, setSelectedIds] = useState<string[]>(products.map((p) => p.id));
  const [added, setAdded] = useState(false);

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
  const count = selectedProducts.length;

  // Apply 15% discount if 3 or more pieces selected
  const hasBundleDiscount = count >= 3;
  const rawTotal = selectedProducts.reduce((sum, p) => sum + p.priceVND, 0);
  const discountAmount = hasBundleDiscount ? Math.round(rawTotal * 0.15) : 0;
  const finalTotal = rawTotal - discountAmount;

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddBundle = () => {
    selectedProducts.forEach((product) => {
      // get default variant
      const defaultVariant = product.variants[0];
      const discountedItemPrice = hasBundleDiscount
        ? Math.round(product.priceVND * 0.85)
        : product.priceVND;

      addItem({
        productId: product.id,
        name: product.name,
        priceVND: discountedItemPrice,
        size: defaultVariant?.size || 'M',
        color: defaultVariant?.color || 'Default',
        quantity: 1,
        imageFile: look.imageFile,
        lookId: look.id,
      });
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (products.length < 2) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Ưu Đãi Trọn Bộ (Bundle Deal)
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-1.5">
            Mua trọn phong cách: {look.name}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {hasBundleDiscount
              ? 'Tiết kiệm ngay 15% khi mua từ 3 món trở lên trong bộ sưu tập này.'
              : 'Chọn thêm món để nhận ngay ưu đãi giảm 15% trọn bộ!'}
          </p>
        </div>

        {hasBundleDiscount && (
          <div className="text-right">
            <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-rose-500 text-white">
              -15% OFF
            </span>
          </div>
        )}
      </div>

      {/* Item Checklist */}
      <div className="space-y-2 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/60">
        {products.map((prod) => {
          const isChecked = selectedIds.includes(prod.id);
          return (
            <label
              key={prod.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                isChecked
                  ? 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 shadow-xs'
                  : 'border-transparent text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(prod.id)}
                  className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300 dark:border-neutral-700"
                />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-200">{prod.name}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{prod.category}</p>
                </div>
              </div>
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                {formatVND(prod.priceVND)}
              </div>
            </label>
          );
        })}
      </div>

      {/* Pricing and Action */}
      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatVND(finalTotal)}
            </span>
            {hasBundleDiscount && (
              <span className="text-xs line-through text-neutral-400 font-medium">
                {formatVND(rawTotal)}
              </span>
            )}
          </div>
          {hasBundleDiscount && (
            <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
              Tiết kiệm: {formatVND(discountAmount)}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddBundle}
          disabled={count === 0}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-sm ${
            added
              ? 'bg-emerald-600 text-white'
              : count === 0
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-600'
              : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100'
          }`}
        >
          {added ? '✓ Đã thêm vào giỏ!' : `Mua cả bộ (${count} món)`}
        </button>
      </div>
    </div>
  );
}
