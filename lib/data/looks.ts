// AUTO-GENERATED — source of truth: docs/DESIGN.md

export interface PieceItem {
  name: string;
  color: string;
  priceUSD: number;
  priceVND: number; // priceUSD * 25000, rounded to nearest 1000
}

export interface Look {
  id: number;
  name: string;
  category: 'everyday' | 'athletic' | 'sleep' | 'formal' | 'party' | 'street';
  imageFile: string;
  pieces: {
    tops: PieceItem[];
    bottoms: PieceItem[];
    full: PieceItem[];
    shoes: PieceItem[];
    acc: PieceItem[];
  };
  hotspots: Partial<Record<'tops' | 'bottoms' | 'full' | 'shoes' | 'acc', [number, number]>>;
}

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';

export function buildImageUrl(file: string, w: number): string {
  return (
    'https://images.higgs.ai/?default=1&output=webp&url=' +
    encodeURIComponent(CDN + file) +
    '&w=' +
    w +
    '&q=85'
  );
}

function p(name: string, color: string, priceUSD: number): PieceItem {
  return { name, color, priceUSD, priceVND: Math.round((priceUSD * 25000) / 1000) * 1000 };
}

/** Hotspot positions: x%, y% of the figure box */
const HS = {
  tops:    [60, 24] as [number, number],
  full:    [60, 38] as [number, number],
  bottoms: [38, 47] as [number, number],
  shoes:   [40, 95] as [number, number],
  acc:     [56, 14] as [number, number],
};

export const LOOKS: Look[] = [
  {
    id: 0,
    name: 'Denim Maxi',
    category: 'everyday',
    imageFile: 'hf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png',
    pieces: {
      tops:    [p('Ribbed crop tank', 'Charcoal', 38)],
      bottoms: [p('Washed denim maxi skirt', 'Light wash', 96)],
      full:    [],
      shoes:   [p('Knee-high leather boots', 'Black', 210)],
      acc:     [p('Leather belt', 'Black', 42), p('Gold hoops', '14k', 64)],
    },
    hotspots: { tops: HS.tops, bottoms: HS.bottoms, shoes: HS.shoes, acc: HS.acc },
  },
  {
    id: 1,
    name: 'Cloud Set',
    category: 'everyday',
    imageFile: 'hf_20261112_034738_73282737-acc8-41e9-a822-96c663e27b6c.png',
    pieces: {
      tops:    [p('Half-zip sweatshirt', 'Oat', 74)],
      bottoms: [p('Wide sweatpants', 'Oat', 68)],
      full:    [],
      shoes:   [p('Chunky sneakers', 'White', 120)],
      acc:     [p('Gold hoops', '14k', 64)],
    },
    hotspots: { tops: HS.tops, bottoms: HS.bottoms, shoes: HS.shoes, acc: HS.acc },
  },
  {
    id: 2,
    name: 'Library Knit',
    category: 'everyday',
    imageFile: 'hf_20261112_034742_9a8a92fd-79ae-4163-9ffa-14ae2a68717f.png',
    pieces: {
      tops:    [p('Cable-knit cardigan', 'Cream', 112), p('Cotton tee', 'White', 24)],
      bottoms: [p('Pleated wide trousers', 'Heather grey', 98)],
      full:    [],
      shoes:   [p('Penny loafers', 'Brown', 150)],
      acc:     [],
    },
    hotspots: { tops: HS.tops, bottoms: HS.bottoms, shoes: HS.shoes },
  },
  {
    id: 3,
    name: 'Lilac Run',
    category: 'athletic',
    imageFile: 'hf_20261112_034735_4e352e03-ad2b-44d1-9fcf-4b5b9454dc55.png',
    pieces: {
      tops:    [p('Zip training jacket', 'Lilac', 88), p('Sports crop top', 'Lilac', 44)],
      bottoms: [p('High-rise leggings', 'Lilac', 72)],
      full:    [],
      shoes:   [p('Running sneakers', 'White', 140)],
      acc:     [],
    },
    hotspots: { tops: HS.tops, bottoms: HS.bottoms, shoes: HS.shoes },
  },
  {
    id: 4,
    name: 'Satin Night',
    category: 'sleep',
    imageFile: 'hf_20261112_034738_aeb8ea57-6399-4f3c-b54a-4a57d0bd971e.png',
    pieces: {
      tops:    [p('Satin pyjama shirt', 'Powder blue', 66)],
      bottoms: [p('Satin pyjama trousers', 'Powder blue', 58)],
      full:    [],
      shoes:   [p('Fluffy slippers', 'Ivory', 34)],
      acc:     [],
    },
    hotspots: { tops: HS.tops, bottoms: HS.bottoms, shoes: HS.shoes },
  },
  {
    id: 5,
    name: 'Night Suit',
    category: 'formal',
    imageFile: 'hf_20261112_034736_aace5c5f-8c14-4b00-83ba-744dbad2e337.png',
    pieces: {
      tops:    [p('Oversized blazer', 'Black', 240), p('Silk camisole', 'Ivory', 82)],
      bottoms: [p('Straight suit trousers', 'Black', 160)],
      full:    [],
      shoes:   [p('Pointed heels', 'Black', 190)],
      acc:     [],
    },
    hotspots: { tops: HS.tops, bottoms: HS.bottoms, shoes: HS.shoes },
  },
  {
    id: 6,
    name: 'Sage Slip',
    category: 'party',
    imageFile: 'hf_20261112_034735_3d9fb69e-b4e0-49f7-a2d4-e592bd616c27.png',
    pieces: {
      tops:    [],
      bottoms: [],
      full:    [p('Satin slip midi dress', 'Sage', 180)],
      shoes:   [p('Strappy sandals', 'Silver', 130)],
      acc:     [p('Fine chain necklace', 'Silver', 56)],
    },
    hotspots: { full: HS.full, shoes: HS.shoes, acc: HS.acc },
  },
  {
    id: 7,
    name: 'Bomber Cargo',
    category: 'street',
    imageFile: 'hf_20261112_034740_3e3c5ad7-689b-46a2-8e09-c7d36a569b9c.png',
    pieces: {
      tops:    [p('Leather bomber', 'Black', 260), p('Crop tee', 'White', 22)],
      bottoms: [p('Parachute cargo pants', 'Khaki', 94)],
      full:    [],
      shoes:   [p('Platform sneakers', 'Black', 150)],
      acc:     [],
    },
    hotspots: { tops: HS.tops, bottoms: HS.bottoms, shoes: HS.shoes },
  },
];
