// AUTO-GENERATED — source of truth: docs/DESIGN.md

export interface ProductVariant {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  color: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  lookId: number;
  category: 'tops' | 'bottoms' | 'full' | 'shoes' | 'acc';
  name: string;
  priceVND: number;
  variants: ProductVariant[];
  sizeGuide: { XS: string; S: string; M: string; L: string; XL: string };
}

const STANDARD_SIZE_GUIDE = {
  XS: '≤155cm',
  S:  '156-162cm',
  M:  '163-168cm',
  L:  '169-174cm',
  XL: '≥175cm',
};

const SHOE_SIZE_GUIDE = {
  XS: '35-36',
  S:  '36-37',
  M:  '37-38',
  L:  '38-39',
  XL: '39-40',
};

const SIZES: Array<'XS' | 'S' | 'M' | 'L' | 'XL'> = ['XS', 'S', 'M', 'L', 'XL'];

function colorCode(color: string): string {
  return color.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase();
}

function makeVariants(
  catShort: string,
  lookId: number,
  itemIdx: number,
  color: string,
  stocks: number[],
): ProductVariant[] {
  return SIZES.map((size, si) => ({
    size,
    color,
    stock: stocks[si],
    sku: `${catShort}-${lookId}${itemIdx}-${size}-${colorCode(color)}`,
  }));
}

export const PRODUCTS: Product[] = [
  // ── Look 0: Denim Maxi ──────────────────────────────────────────────────
  {
    id: 'prod-0-top-0',
    lookId: 0,
    category: 'tops',
    name: 'Ribbed crop tank',
    priceVND: 950000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('TOP', 0, 0, 'Charcoal', [8, 12, 10, 7, 5]),
  },
  {
    id: 'prod-0-bot-0',
    lookId: 0,
    category: 'bottoms',
    name: 'Washed denim maxi skirt',
    priceVND: 2400000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('BOT', 0, 0, 'Light wash', [6, 10, 12, 9, 5]),
  },
  {
    id: 'prod-0-sho-0',
    lookId: 0,
    category: 'shoes',
    name: 'Knee-high leather boots',
    priceVND: 5250000,
    sizeGuide: SHOE_SIZE_GUIDE,
    variants: makeVariants('SHO', 0, 0, 'Black', [5, 8, 10, 8, 6]),
  },
  {
    id: 'prod-0-acc-0',
    lookId: 0,
    category: 'acc',
    name: 'Leather belt',
    priceVND: 1050000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('ACC', 0, 0, 'Black', [10, 12, 15, 10, 8]),
  },
  {
    id: 'prod-0-acc-1',
    lookId: 0,
    category: 'acc',
    name: 'Gold hoops',
    priceVND: 1600000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('ACC', 0, 1, '14k', [12, 12, 12, 12, 12]),
  },

  // ── Look 1: Cloud Set ───────────────────────────────────────────────────
  {
    id: 'prod-1-top-0',
    lookId: 1,
    category: 'tops',
    name: 'Half-zip sweatshirt',
    priceVND: 1850000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('TOP', 1, 0, 'Oat', [9, 13, 11, 8, 6]),
  },
  {
    id: 'prod-1-bot-0',
    lookId: 1,
    category: 'bottoms',
    name: 'Wide sweatpants',
    priceVND: 1700000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('BOT', 1, 0, 'Oat', [9, 13, 11, 8, 6]),
  },
  {
    id: 'prod-1-sho-0',
    lookId: 1,
    category: 'shoes',
    name: 'Chunky sneakers',
    priceVND: 3000000,
    sizeGuide: SHOE_SIZE_GUIDE,
    variants: makeVariants('SHO', 1, 0, 'White', [7, 11, 10, 8, 5]),
  },
  {
    id: 'prod-1-acc-0',
    lookId: 1,
    category: 'acc',
    name: 'Gold hoops',
    priceVND: 1600000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('ACC', 1, 0, '14k', [12, 12, 12, 12, 12]),
  },

  // ── Look 2: Library Knit ────────────────────────────────────────────────
  {
    id: 'prod-2-top-0',
    lookId: 2,
    category: 'tops',
    name: 'Cable-knit cardigan',
    priceVND: 2800000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('TOP', 2, 0, 'Cream', [7, 10, 12, 8, 5]),
  },
  {
    id: 'prod-2-top-1',
    lookId: 2,
    category: 'tops',
    name: 'Cotton tee',
    priceVND: 600000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('TOP', 2, 1, 'White', [15, 15, 15, 12, 10]),
  },
  {
    id: 'prod-2-bot-0',
    lookId: 2,
    category: 'bottoms',
    name: 'Pleated wide trousers',
    priceVND: 2450000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('BOT', 2, 0, 'Heather grey', [6, 10, 12, 9, 5]),
  },
  {
    id: 'prod-2-sho-0',
    lookId: 2,
    category: 'shoes',
    name: 'Penny loafers',
    priceVND: 3750000,
    sizeGuide: SHOE_SIZE_GUIDE,
    variants: makeVariants('SHO', 2, 0, 'Brown', [5, 8, 10, 8, 5]),
  },

  // ── Look 3: Lilac Run ───────────────────────────────────────────────────
  {
    id: 'prod-3-top-0',
    lookId: 3,
    category: 'tops',
    name: 'Zip training jacket',
    priceVND: 2200000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('TOP', 3, 0, 'Lilac', [8, 11, 10, 8, 5]),
  },
  {
    id: 'prod-3-top-1',
    lookId: 3,
    category: 'tops',
    name: 'Sports crop top',
    priceVND: 1100000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('TOP', 3, 1, 'Lilac', [10, 13, 12, 9, 6]),
  },
  {
    id: 'prod-3-bot-0',
    lookId: 3,
    category: 'bottoms',
    name: 'High-rise leggings',
    priceVND: 1800000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('BOT', 3, 0, 'Lilac', [9, 12, 11, 8, 6]),
  },
  {
    id: 'prod-3-sho-0',
    lookId: 3,
    category: 'shoes',
    name: 'Running sneakers',
    priceVND: 3500000,
    sizeGuide: SHOE_SIZE_GUIDE,
    variants: makeVariants('SHO', 3, 0, 'White', [7, 10, 10, 8, 5]),
  },

  // ── Look 4: Satin Night ─────────────────────────────────────────────────
  {
    id: 'prod-4-top-0',
    lookId: 4,
    category: 'tops',
    name: 'Satin pyjama shirt',
    priceVND: 1650000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('TOP', 4, 0, 'Powder blue', [8, 10, 12, 9, 6]),
  },
  {
    id: 'prod-4-bot-0',
    lookId: 4,
    category: 'bottoms',
    name: 'Satin pyjama trousers',
    priceVND: 1450000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('BOT', 4, 0, 'Powder blue', [8, 10, 12, 9, 6]),
  },
  {
    id: 'prod-4-sho-0',
    lookId: 4,
    category: 'shoes',
    name: 'Fluffy slippers',
    priceVND: 850000,
    sizeGuide: SHOE_SIZE_GUIDE,
    variants: makeVariants('SHO', 4, 0, 'Ivory', [10, 12, 12, 10, 8]),
  },

  // ── Look 5: Night Suit ──────────────────────────────────────────────────
  {
    id: 'prod-5-top-0',
    lookId: 5,
    category: 'tops',
    name: 'Oversized blazer',
    priceVND: 6000000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('TOP', 5, 0, 'Black', [5, 8, 10, 8, 5]),
  },
  {
    id: 'prod-5-top-1',
    lookId: 5,
    category: 'tops',
    name: 'Silk camisole',
    priceVND: 2050000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('TOP', 5, 1, 'Ivory', [8, 11, 12, 9, 6]),
  },
  {
    id: 'prod-5-bot-0',
    lookId: 5,
    category: 'bottoms',
    name: 'Straight suit trousers',
    priceVND: 4000000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('BOT', 5, 0, 'Black', [6, 9, 11, 8, 5]),
  },
  {
    id: 'prod-5-sho-0',
    lookId: 5,
    category: 'shoes',
    name: 'Pointed heels',
    priceVND: 4750000,
    sizeGuide: SHOE_SIZE_GUIDE,
    variants: makeVariants('SHO', 5, 0, 'Black', [5, 8, 10, 8, 5]),
  },

  // ── Look 6: Sage Slip ───────────────────────────────────────────────────
  {
    id: 'prod-6-ful-0',
    lookId: 6,
    category: 'full',
    name: 'Satin slip midi dress',
    priceVND: 4500000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('FUL', 6, 0, 'Sage', [6, 10, 12, 8, 5]),
  },
  {
    id: 'prod-6-sho-0',
    lookId: 6,
    category: 'shoes',
    name: 'Strappy sandals',
    priceVND: 3250000,
    sizeGuide: SHOE_SIZE_GUIDE,
    variants: makeVariants('SHO', 6, 0, 'Silver', [6, 9, 11, 8, 5]),
  },
  {
    id: 'prod-6-acc-0',
    lookId: 6,
    category: 'acc',
    name: 'Fine chain necklace',
    priceVND: 1400000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('ACC', 6, 0, 'Silver', [15, 15, 15, 15, 15]),
  },

  // ── Look 7: Bomber Cargo ────────────────────────────────────────────────
  {
    id: 'prod-7-top-0',
    lookId: 7,
    category: 'tops',
    name: 'Leather bomber',
    priceVND: 6500000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('TOP', 7, 0, 'Black', [5, 8, 9, 7, 5]),
  },
  {
    id: 'prod-7-top-1',
    lookId: 7,
    category: 'tops',
    name: 'Crop tee',
    priceVND: 550000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('TOP', 7, 1, 'White', [15, 15, 15, 12, 10]),
  },
  {
    id: 'prod-7-bot-0',
    lookId: 7,
    category: 'bottoms',
    name: 'Parachute cargo pants',
    priceVND: 2350000,
    sizeGuide: STANDARD_SIZE_GUIDE,
    variants: makeVariants('BOT', 7, 0, 'Khaki', [7, 10, 12, 9, 6]),
  },
  {
    id: 'prod-7-sho-0',
    lookId: 7,
    category: 'shoes',
    name: 'Platform sneakers',
    priceVND: 3750000,
    sizeGuide: SHOE_SIZE_GUIDE,
    variants: makeVariants('SHO', 7, 0, 'Black', [6, 9, 11, 8, 5]),
  },
];
