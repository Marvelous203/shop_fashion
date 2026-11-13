'use client';

import React from 'react';
import Link from 'next/link';
import type { Look } from '@/lib/data/looks';
import { buildImageUrl } from '@/lib/data/looks';
import { formatVND } from '@/lib/utils/format';

export interface ProductCardProps {
  look?: Look;
  title?: string;
  category?: string;
  imageFile?: string;
  fromPrice?: number;
  href?: string;
  id?: string | number;
  piecesCount?: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function ProductCard({
  look,
  title,
  category,
  imageFile,
  fromPrice,
  href,
  id,
  piecesCount,
}: ProductCardProps) {
  // Resolve data from look if provided
  const itemTitle = title || look?.name || 'VELL Collection';
  const itemCategory = category || look?.category || 'fashion';
  const itemImage = imageFile || look?.imageFile || '';
  const itemId = id !== undefined ? id : look?.id ?? 0;

  // Calculate starting price if not provided
  let calculatedFromPrice = fromPrice;
  let totalPieces = piecesCount;

  if (look && calculatedFromPrice === undefined) {
    const allPieces = [
      ...look.pieces.tops,
      ...look.pieces.bottoms,
      ...look.pieces.full,
      ...look.pieces.shoes,
      ...look.pieces.acc,
    ];
    if (allPieces.length > 0) {
      calculatedFromPrice = Math.min(...allPieces.map((p) => p.priceVND));
      totalPieces = allPieces.length;
    } else {
      calculatedFromPrice = 500000;
    }
  }

  const destination =
    href || `/product/${itemId}-${slugify(itemTitle)}`;

  const imageUrl = itemImage
    ? itemImage.startsWith('http')
      ? itemImage
      : buildImageUrl(itemImage, 600)
    : '/placeholder.png';

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition duration-300 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700">
      {/* Image Container */}
      <Link href={destination} className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 block">
        <img
          src={imageUrl}
          alt={itemTitle}
          className="w-full h-full object-cover object-top transition duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
            {itemCategory}
          </span>
        </div>

        {totalPieces !== undefined && totalPieces > 0 && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/80 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200 backdrop-blur-sm">
              {totalPieces} món phối sẵn
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-black dark:group-hover:text-white transition">
            <Link href={destination}>{itemTitle}</Link>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Chỉ từ{' '}
            <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
              {formatVND(calculatedFromPrice || 0)}
            </span>
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <Link
            href={destination}
            className="w-full text-center py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
