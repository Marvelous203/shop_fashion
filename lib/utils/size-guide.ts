export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export function getSuggestedSize(heightCm: number): Size {
  if (heightCm <= 155) return 'XS';
  if (heightCm <= 162) return 'S';
  if (heightCm <= 168) return 'M';
  if (heightCm <= 174) return 'L';
  return 'XL';
}
