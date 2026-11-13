'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Look } from '@/lib/data/looks';
import { buildImageUrl } from '@/lib/data/looks';
import type { Product, ProductVariant } from '@/lib/data/products';
import { formatVND } from '@/lib/utils/format';
import { getSuggestedSize, type Size } from '@/lib/utils/size-guide';
import { useCart } from '@/lib/hooks/useCart';
import { SizeSelector } from './SizeSelector';
import { ColorSwatch } from './ColorSwatch';
import { SizeGuide } from './SizeGuide';
import { BundleDeal } from './BundleDeal';
import { ShareLookButton } from './ShareLookButton';
import { SaveImageButton } from './SaveImageButton';

interface ProductDetailClientProps {
  look: Look;
  product: Product;
  productsInLook: Product[];
  heightCmParam?: string;
  filterParam?: string;
}

export function ProductDetailClient({
  look,
  product,
  productsInLook,
  heightCmParam,
  filterParam,
}: ProductDetailClientProps) {
  const { addItem } = useCart();

  // Selected piece within the look
  const [selectedProduct, setSelectedProduct] = useState<Product>(product);

  // Available sizes & colors for selected product
  const availableColors = Array.from(new Set(selectedProduct.variants.map((v) => v.color)));
  const [selectedColor, setSelectedColor] = useState<string>(
    availableColors[0] || 'Default'
  );

  // Get suggested size from heightCm
  const heightNumber = heightCmParam ? parseInt(heightCmParam, 10) : undefined;
  const suggestedSize: Size | null =
    heightNumber && !isNaN(heightNumber) ? getSuggestedSize(heightNumber) : null;

  // Selected size default to suggested size if available, or first available size
  const defaultSize =
    suggestedSize && selectedProduct.variants.some((v) => v.size === suggestedSize)
      ? suggestedSize
      : (selectedProduct.variants[0]?.size as Size) || 'M';

  const [selectedSize, setSelectedSize] = useState<Size>(defaultSize);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Find variant matching current selection
  const currentVariant: ProductVariant | undefined = selectedProduct.variants.find(
    (v) => v.size === selectedSize && (v.color === selectedColor || availableColors.length <= 1)
  ) || selectedProduct.variants.find((v) => v.size === selectedSize) || selectedProduct.variants[0];

  // Stock status
  const stock = currentVariant ? currentVariant.stock : 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 3;

  // Stock map for SizeSelector
  const stockMap: Partial<Record<Size, number>> = {};
  selectedProduct.variants.forEach((v) => {
    if (v.color === selectedColor || availableColors.length <= 1) {
      stockMap[v.size] = v.stock;
    }
  });

  const handleProductChange = (prod: Product) => {
    setSelectedProduct(prod);
    const newColors = Array.from(new Set(prod.variants.map((v) => v.color)));
    const newColor = newColors[0] || 'Default';
    setSelectedColor(newColor);

    const newSize =
      suggestedSize && prod.variants.some((v) => v.size === suggestedSize)
        ? suggestedSize
        : (prod.variants[0]?.size as Size) || 'M';
    setSelectedSize(newSize);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      productId: selectedProduct.id,
      name: selectedProduct.name,
      priceVND: selectedProduct.priceVND,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      imageFile: look.imageFile,
      lookId: look.id,
    });

    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 2500);
  };

  const largeImageUrl = look.imageFile.startsWith('http')
    ? look.imageFile
    : buildImageUrl(look.imageFile, 1200);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-black tracking-widest uppercase font-serif">
              VELL
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              <Link href="/" className="hover:text-black dark:hover:text-white transition">
                Phòng Thử Đồ (Studio)
              </Link>
              <Link href="/shop" className="hover:text-black dark:hover:text-white transition">
                Bộ Sưu Tập (Shop)
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-100/60 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold tracking-wider uppercase transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Giỏ Hàng</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <Link href="/shop" className="hover:underline">
            Cửa hàng
          </Link>
          <span>/</span>
          <span className="capitalize">{look.category}</span>
          <span>/</span>
          <span className="text-neutral-800 dark:text-neutral-200 font-medium">{look.name}</span>
        </div>

        {/* 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Model Image Hero with stage ID for html2canvas */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div
              id="stage"
              className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-md"
            >
              <img
                src={largeImageUrl}
                alt={look.name}
                className="w-full h-full object-cover object-top"
                crossOrigin="anonymous"
              />

              {/* Look Info Tag overlay */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                  Look #{look.id}: {look.name}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/80 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200 backdrop-blur-md">
                  {look.category}
                </span>
              </div>
            </div>

            {/* Action Buttons: Share & Save Look */}
            <div className="flex flex-wrap gap-3">
              <ShareLookButton lookId={look.id} filterId={filterParam} className="flex-1 justify-center" />
              <SaveImageButton lookId={look.id} stageSelector="#stage" className="flex-1 justify-center" />
            </div>
          </div>

          {/* Right Column: Details, Selection, Add to Cart & Bundle Deal */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Title & Price */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {selectedProduct.category}
                </span>

                {/* Stock Status Pill */}
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Hết hàng
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Sắp hết (Còn {stock} món)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Còn hàng
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white mt-1">
                {selectedProduct.name}
              </h1>

              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                  {formatVND(selectedProduct.priceVND)}
                </span>
                <span className="text-xs text-neutral-400">Mã SKU: {currentVariant?.sku}</span>
              </div>
            </div>

            {/* Piece Selector (If Look has multiple pieces) */}
            {productsInLook.length > 1 && (
              <div className="space-y-2 pt-2 border-t border-neutral-200/80 dark:border-neutral-800">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Chọn món trong bộ sưu tập:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {productsInLook.map((prod) => {
                    const isCurrent = prod.id === selectedProduct.id;
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleProductChange(prod)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition ${
                          isCurrent
                            ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <p className="truncate">{prod.name}</p>
                        <p className={`text-[11px] mt-0.5 ${isCurrent ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-500'}`}>
                          {formatVND(prod.priceVND)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Swatch */}
            {availableColors.length > 0 && (
              <ColorSwatch
                colors={availableColors}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />
            )}

            {/* Size Selector */}
            <SizeSelector
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              suggestedSize={suggestedSize}
              stockMap={stockMap}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            />

            {/* Add to Cart Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold uppercase tracking-wider text-xs transition duration-200 shadow-md ${
                  isOutOfStock
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-600'
                    : addSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100'
                }`}
              >
                {addSuccess ? '✓ Đã thêm vào giỏ hàng!' : isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
              </button>

              <p className="text-[11px] text-center text-neutral-500">
                Miễn phí vận chuyển cho đơn hàng từ 500.000₫ • Đổi trả trong 7 ngày
              </p>
            </div>

            {/* Bundle Deal Component */}
            {productsInLook.length >= 2 && (
              <div className="mt-2">
                <BundleDeal look={look} products={productsInLook} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Size Guide Modal */}
      <SizeGuide
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={selectedProduct.category}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 text-center text-xs text-neutral-500 mt-12">
        <p>© 2026 VELL Fashion Studio & Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}
