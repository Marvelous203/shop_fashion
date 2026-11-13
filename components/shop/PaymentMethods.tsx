'use client';

import React from 'react';

export type PaymentMethodType = 'cod' | 'qr' | 'vnpay' | 'momo' | 'zalopay';

interface PaymentMethodsProps {
  selectedMethod: PaymentMethodType;
  onSelectMethod: (method: PaymentMethodType) => void;
}

export function PaymentMethods({ selectedMethod, onSelectMethod }: PaymentMethodsProps) {
  const methods = [
    {
      id: 'cod' as PaymentMethodType,
      name: 'Thanh toán khi nhận hàng (COD)',
      description: 'Nhận hàng, kiểm tra hàng rồi mới thanh toán tiền mặt',
      icon: (
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: 'Phổ biến',
    },
    {
      id: 'qr' as PaymentMethodType,
      name: 'Chuyển khoản QR ngân hàng',
      description: 'Quét mã VietQR qua app ngân hàng (MB Bank, Vietcombank, Techcombank)',
      icon: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
      badge: 'Nhanh chóng 24/7',
    },
    {
      id: 'vnpay' as PaymentMethodType,
      name: 'VNPAY',
      description: 'Thẻ ATM nội địa / Visa / Mastercard / JCB / VNPAY QR',
      icon: (
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#005BAA] text-white font-bold text-[9px] tracking-tighter">
          VNPAY
        </span>
      ),
    },
    {
      id: 'momo' as PaymentMethodType,
      name: 'Ví điện tử MoMo',
      description: 'Thanh toán trực tiếp qua liên kết ví MoMo',
      icon: (
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#A50064] text-white font-bold text-[9px] tracking-tighter">
          MoMo
        </span>
      ),
    },
    {
      id: 'zalopay' as PaymentMethodType,
      name: 'Ví ZaloPay',
      description: 'Thanh toán tức thì qua ứng dụng Zalo / ZaloPay',
      icon: (
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#0068FF] text-white font-bold text-[9px] tracking-tighter">
          Zalo
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
        Phương thức thanh toán
      </h3>

      <div className="space-y-2.5">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <label
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-neutral-900 bg-neutral-50 dark:bg-neutral-800/60 dark:border-white shadow-xs ring-1 ring-neutral-900 dark:ring-white'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={isSelected}
                onChange={() => onSelectMethod(method.id)}
                className="mt-1 text-neutral-900 focus:ring-neutral-900 dark:focus:ring-white border-neutral-300"
              />

              <div className="shrink-0 mt-0.5">{method.icon}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {method.name}
                  </span>
                  {method.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                  {method.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
