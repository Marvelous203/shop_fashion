export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  // → "1.950.000 ₫"
}

export const formatPrice = formatVND;

export function estimateShipping(totalVND: number, province: string): number {
  if (totalVND >= 500000) return 0; // free shipping
  if (['Hà Nội', 'TP. Hồ Chí Minh', 'Hồ Chí Minh'].includes(province)) return 30000;
  return 50000;
}
