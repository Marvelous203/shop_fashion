import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LOOKS } from '@/lib/data/looks';
import { ProductCard } from '@/components/shop/ProductCard';

export const metadata: Metadata = {
  title: 'Mua sắm thời trang | VELL',
  description: 'Khám phá các bộ sưu tập thời trang cao cấp và phong cách phối đồ chuẩn visual tại VELL.',
  openGraph: {
    title: 'Mua sắm thời trang | VELL',
    description: 'Khám phá các bộ sưu tập thời trang cao cấp và phong cách phối đồ chuẩn visual tại VELL.',
  },
};

const CATEGORIES = [
  { id: 'all', label: 'Tất cả (All)' },
  { id: 'everyday', label: 'Hàng ngày (Everyday)' },
  { id: 'athletic', label: 'Thể thao (Athletic)' },
  { id: 'sleep', label: 'Đồ ngủ (Sleep)' },
  { id: 'formal', label: 'Công sở / Dạ tiệc (Formal)' },
  { id: 'party', label: 'Tiệc tùng (Party)' },
  { id: 'street', label: 'Đường phố (Street)' },
];

interface ShopContentProps {
  searchParams?: Promise<{ category?: string; sort?: string }>;
}

async function ShopContent({ searchParams }: ShopContentProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const currentCategory = resolvedParams.category || 'all';

  const filteredLooks = LOOKS.filter((look) => {
    if (currentCategory === 'all') return true;
    return look.category.toLowerCase() === currentCategory.toLowerCase();
  });

  return (
    <>
      {/* Category Filters Bar */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.id;
            const href = cat.id === 'all' ? '/shop' : `/shop?category=${cat.id}`;
            return (
              <Link
                key={cat.id}
                href={href}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700'
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Product Grid: 3-column responsive */}
      {filteredLooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredLooks.map((look) => (
            <ProductCard key={look.id} look={look} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <p className="text-neutral-500 text-sm">Không tìm thấy phong cách nào trong danh mục này.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block px-5 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold uppercase tracking-wider"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      )}
    </>
  );
}

function ShopSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="aspect-[3/4] bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      ))}
    </div>
  );
}

export default function ShopPage(props: ShopContentProps) {
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
              <Link href="/shop" className="text-black dark:text-white underline underline-offset-4">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Hero */}
        <div className="mb-10 text-center md:text-left">
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">
            Seasonal Looks & Outfits
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
            Bộ Sưu Tập Thời Trang VELL
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl">
            Lựa chọn phong cách yêu thích được phối sẵn bởi các stylist hàng đầu. Bạn có thể mua trọn bộ với ưu đãi 15% hoặc chọn mua từng món riêng lẻ.
          </p>
        </div>

        <Suspense fallback={<ShopSkeleton />}>
          <ShopContent searchParams={props.searchParams} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 text-center text-xs text-neutral-500">
        <p>© 2026 VELL Fashion Studio & Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}
