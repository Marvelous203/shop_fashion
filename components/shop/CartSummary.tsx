'use client';

import React, { useState } from 'react';
import { formatVND, estimateShipping } from '@/lib/utils/format';

interface CartSummaryProps {
  subtotal: number;
  province: string;
  onProvinceChange: (province: string) => void;
  couponCode: string;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  discountPercent: number;
  appliedCoupon?: string;
  onRemoveCoupon?: () => void;
}

const PROVINCES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
  'Quảng Ninh',
  'Thừa Thiên Huế',
  'Khánh Hòa',
  'Tỉnh thành khác',
];

export function CartSummary({
  subtotal,
  province,
  onProvinceChange,
  couponCode,
  onApplyCoupon,
  discountPercent,
  appliedCoupon,
  onRemoveCoupon,
}: CartSummaryProps) {
  const [inputCode, setInputCode] = useState(couponCode || '');
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const shipping = estimateShipping(subtotal, province);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = onApplyCoupon(inputCode.trim());
    setCouponMessage({ text: res.message, error: !res.success });
  };

  const freeShippingThreshold = 500000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-5 shadow-xs">
      <h3 className="text-base font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
        Tóm tắt đơn hàng
      </h3>

      {/* Free Shipping Progress */}
      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-xs">
        {isFreeShipping ? (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
            <span>🎉</span>
            <span>Đơn hàng của bạn đủ điều kiện được <strong>Miễn phí vận chuyển toàn quốc</strong>!</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-neutral-600 dark:text-neutral-400">
              Mua thêm <strong className="text-neutral-900 dark:text-neutral-100">{formatVND(neededForFreeShipping)}</strong> để được <strong>Miễn phí vận chuyển</strong>
            </p>
            <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
              <div
                className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Shipping Province Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          Tỉnh / Thành phố nhận hàng:
        </label>
        <select
          value={province}
          onChange={(e) => onProvinceChange(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        >
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Coupon input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          Mã giảm giá (Coupon):
        </label>
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <span className="font-mono font-bold">{appliedCoupon}</span>
              <span>(-{discountPercent}%)</span>
            </div>
            {onRemoveCoupon && (
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-neutral-400 hover:text-red-500 text-xs font-medium"
              >
                Gỡ bỏ
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Nhập mã VELL10..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 uppercase text-neutral-900 dark:text-neutral-100 placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition"
            >
              Áp dụng
            </button>
          </form>
        )}

        {couponMessage && (
          <p
            className={`text-[11px] ${
              couponMessage.error ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {couponMessage.text}
          </p>
        )}
      </div>

      {/* Calculation rows */}
      <div className="space-y-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Tạm tính hàng hoá</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{formatVND(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-rose-600 dark:text-rose-400">
            <span>Giảm giá ({appliedCoupon})</span>
            <span className="font-semibold">-{formatVND(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Phí vận chuyển ({province})</span>
          <span>{shipping === 0 ? <strong className="text-emerald-600 dark:text-emerald-400">Miễn phí</strong> : formatVND(shipping)}</span>
        </div>

        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-baseline">
          <span className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Tổng cộng
          </span>
          <div className="text-right">
            <span className="text-xl font-extrabold text-neutral-900 dark:text-white">
              {formatVND(finalTotal)}
            </span>
            <p className="text-[10px] text-neutral-400 mt-0.5">Đã bao gồm VAT nếu có</p>
          </div>
        </div>
      </div>
    </div>
  );
}
