'use client';

import React from 'react';

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  province: string;
  note: string;
}

interface CheckoutFormProps {
  formData: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
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

export function CheckoutForm({ formData, onChange, errors }: CheckoutFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
        Thông tin nhận hàng
      </h3>

      <div className="space-y-3">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Họ và tên người nhận <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="Nguyễn Văn A"
            className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 ${
              errors.fullName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
            }`}
          />
          {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Số điện thoại (Việt Nam) <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="0912 345 678"
            className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 ${
              errors.phone ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
            }`}
          />
          {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Province / City */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Tỉnh / Thành phố <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.province}
            onChange={(e) => onChange('province', e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Detailed Address */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Địa chỉ nhận hàng (Số nhà, đường, phường/xã) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="Số 123, đường Lê Lợi, Phường Bến Nghé, Quận 1"
            className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 ${
              errors.address ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
            }`}
          />
          {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Ghi chú đơn hàng (Tùy chọn)
          </label>
          <textarea
            rows={2}
            value={formData.note}
            onChange={(e) => onChange('note', e.target.value)}
            placeholder="Ghi chú về thời gian giao hàng, hướng dẫn chỉ đường..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>
    </div>
  );
}
