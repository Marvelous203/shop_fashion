// AUTO-GENERATED — source of truth: docs/DESIGN.md

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface Filter {
  id: string;
  name: string;
  gradeFilter: string;
  tintBackground: string;
}

export const FILTERS: Filter[] = [
  {
    id: 'daylight',
    name: 'Daylight',
    gradeFilter: 'none',
    tintBackground: 'transparent',
  },
  {
    id: 'soft-film',
    name: 'Soft Film',
    gradeFilter: 'contrast(.92) saturate(.85) brightness(1.06)',
    tintBackground:
      'linear-gradient(180deg, rgba(255,226,214,.35), rgba(180,200,220,.35))',
  },
  {
    id: 'cool-studio',
    name: 'Cool Studio',
    gradeFilter: 'saturate(.9) brightness(1.06) contrast(1.04)',
    tintBackground:
      'linear-gradient(180deg, rgba(150,190,255,.55), rgba(200,220,255,.3))',
  },
  {
    id: 'blue-hour',
    name: 'Blue Hour',
    gradeFilter: 'brightness(.82) contrast(1.1) saturate(1.1)',
    tintBackground:
      'linear-gradient(180deg, rgba(70,60,170,.75), rgba(150,90,170,.55))',
  },
  {
    id: 'mono',
    name: 'Mono',
    gradeFilter: 'grayscale(1) contrast(1.12) brightness(1.03)',
    tintBackground: 'transparent',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    gradeFilter: 'saturate(1.1) brightness(1.02)',
    tintBackground:
      'linear-gradient(180deg, rgba(255,180,90,.6), rgba(255,140,80,.4))',
  },
];

// ─── Identities ──────────────────────────────────────────────────────────────

export interface Identity {
  name: string;
  age: number;
  city: string;
  countryCode: string;
  tempC: number;
  dnaSeed: string;
}

export const IDENTITIES: Identity[] = [
  { name: 'Han Seo-yeon', age: 23, city: 'Seoul',   countryCode: 'KR', tempC: 14, dnaSeed: 'VL-0423-KR' },
  { name: 'Kim Ha-eun',   age: 22, city: 'Busan',   countryCode: 'KR', tempC: 17, dnaSeed: 'VL-0460-KR' },
  { name: 'Yoon Ji-woo',  age: 25, city: 'Seoul',   countryCode: 'KR', tempC: 12, dnaSeed: 'VL-0497-KR' },
  { name: 'Park Min-ji',  age: 24, city: 'Incheon', countryCode: 'KR', tempC: 13, dnaSeed: 'VL-0534-KR' },
  { name: 'Lee Soo-ah',   age: 21, city: 'Daegu',   countryCode: 'KR', tempC: 15, dnaSeed: 'VL-0571-KR' },
];

// ─── Tune Config ─────────────────────────────────────────────────────────────

export interface SliderConfig {
  label: string;
  min: number;
  max: number;
  default: number;
}

export interface TuneSection {
  sliders: SliderConfig[];
  presets: string[];
  /** Optional colour swatches (hex strings) */
  swatches?: string[];
  /** Whether the section uses multi-select (accessories) */
  multiSelect?: boolean;
  /** Multi-select options if applicable */
  options?: string[];
}

export const TUNE_CONFIG: Record<string, TuneSection> = {
  face: {
    sliders: [
      { label: 'Smile',   min: 0, max: 100, default: 35 },
      { label: 'Jawline', min: 0, max: 100, default: 50 },
      { label: 'Freckles', min: 0, max: 100, default: 10 },
    ],
    presets: ['Soft', 'Defined', 'Natural', 'Sculpted'],
  },
  hair: {
    sliders: [
      { label: 'Volume', min: 0, max: 100, default: 60 },
      { label: 'Shine',  min: 0, max: 100, default: 70 },
    ],
    presets: ['High bun', 'Low bun', 'Long straight', 'Bob', 'Ponytail'],
    swatches: ['#14110f', '#3b2a20', '#6b4a35', '#a07c5a', '#d9c3a1'],
  },
  makeup: {
    sliders: [
      { label: 'Blush',    min: 0, max: 100, default: 30 },
      { label: 'Lip tint', min: 0, max: 100, default: 45 },
      { label: 'Glow',     min: 0, max: 100, default: 55 },
    ],
    presets: ['No-makeup', 'Glass skin', 'Soft glam', 'Editorial'],
    swatches: ['#e8b4a8', '#d98c8c', '#b5525e', '#8e3c4a'],
  },
  accessories: {
    sliders: [],
    presets: [],
    multiSelect: true,
    options: ['Gold hoops', 'Silver chain', 'Shoulder bag', 'Sunglasses', 'Watch', 'Hair clip'],
  },
  tattoos: {
    sliders: [
      { label: 'Opacity', min: 0, max: 100, default: 40 },
    ],
    presets: ['None', 'Fine line', 'Floral', 'Script', 'Minimal dots'],
  },
  details: {
    sliders: [
      { label: 'Skin texture',      min: 0, max: 100, default: 70 },
      { label: 'Fabric detail',     min: 0, max: 100, default: 80 },
      { label: 'Lighting softness', min: 0, max: 100, default: 60 },
    ],
    presets: ['Studio', 'Natural', 'Cinematic'],
  },
};
