import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { LOOKS, buildImageUrl } from '@/lib/data/looks';
import { PRODUCTS } from '@/lib/data/products';
import { ProductDetailClient } from '@/components/shop/ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    height?: string;
    heightCm?: string;
    filter?: string;
    look?: string;
  }>;
}

export function generateStaticParams() {
  return LOOKS.map((l) => ({ id: String(l.id) }));
}

function resolveProductAndLook(rawId: string) {
  const decoded = decodeURIComponent(rawId);

  // 1. Check direct product match:
  let product = PRODUCTS.find((p) => p.id === decoded);
  if (!product) {
    product = PRODUCTS.find((p) => decoded.startsWith(p.id));
  }

  // 2. Extract look ID:
  let lookId = 0;
  if (product) {
    lookId = product.lookId;
  } else {
    const match = decoded.match(/^(\d+)/);
    if (match) {
      lookId = parseInt(match[1], 10);
    }
  }

  const look = LOOKS.find((l) => l.id === lookId) || LOOKS[0];
  const productsInLook = PRODUCTS.filter((p) => p.lookId === look.id);

  if (!product) {
    product = productsInLook[0] || {
      id: `prod-${look.id}-0`,
      lookId: look.id,
      category: 'tops',
      name: look.name,
      priceVND: 1500000,
      variants: [
        { size: 'XS', color: 'Default', stock: 5, sku: `LOOK-${look.id}-XS` },
        { size: 'S', color: 'Default', stock: 8, sku: `LOOK-${look.id}-S` },
        { size: 'M', color: 'Default', stock: 12, sku: `LOOK-${look.id}-M` },
        { size: 'L', color: 'Default', stock: 6, sku: `LOOK-${look.id}-L` },
        { size: 'XL', color: 'Default', stock: 3, sku: `LOOK-${look.id}-XL` },
      ],
      sizeGuide: { XS: '≤155cm', S: '156-162cm', M: '163-168cm', L: '169-174cm', XL: '≥175cm' },
    };
  }

  return { product, look, productsInLook };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { product, look } = resolveProductAndLook(id);

  const title = `${product.name} | VELL Fashion`;
  const description = `Bộ sưu tập ${look.name} - ${product.name} chất lượng cao tại VELL.`;
  const imageUrl = look.imageFile.startsWith('http')
    ? look.imageFile
    : buildImageUrl(look.imageFile, 1200);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

async function ProductDetailLoader({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sParams = searchParams ? await searchParams : {};
  const { product, look, productsInLook } = resolveProductAndLook(id);

  const heightCmParam = sParams.heightCm || sParams.height;
  const filterParam = sParams.filter;

  return (
    <ProductDetailClient
      look={look}
      product={product}
      productsInLook={productsInLook}
      heightCmParam={heightCmParam}
      filterParam={filterParam}
    />
  );
}

export default function ProductDetailPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest text-neutral-500">Đang tải sản phẩm...</p>
          </div>
        </div>
      }
    >
      <ProductDetailLoader {...props} />
    </Suspense>
  );
}
