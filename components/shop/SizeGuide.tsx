'use client';

import React from 'react';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  category?: 'tops' | 'bottoms' | 'full' | 'shoes' | 'acc';
}

export function SizeGuide({ isOpen, onClose, category = 'tops' }: SizeGuideProps) {
  if (!isOpen) return null;

  const isShoe = category === 'shoes';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Bảng Quy Đổi Kích Cỡ (Size Guide)</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isShoe ? 'Dành cho Giày & Dép' : 'Dành cho Trang phục VELL Standard'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          {isShoe ? (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Cỡ VN/EU</th>
                  <th className="py-2.5 px-3">Chiều dài bàn chân</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                <tr>
                  <td className="py-2 px-3 font-semibold">XS</td>
                  <td className="py-2 px-3">35 - 36</td>
                  <td className="py-2 px-3">22.0 - 22.5 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">S</td>
                  <td className="py-2 px-3">36 - 37</td>
                  <td className="py-2 px-3">22.5 - 23.0 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">M</td>
                  <td className="py-2 px-3">37 - 38</td>
                  <td className="py-2 px-3">23.0 - 23.5 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">L</td>
                  <td className="py-2 px-3">38 - 39</td>
                  <td className="py-2 px-3">23.5 - 24.0 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">XL</td>
                  <td className="py-2 px-3">39 - 40</td>
                  <td className="py-2 px-3">24.0 - 24.5 cm</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chiều cao</th>
                  <th className="py-2.5 px-3">Vòng ngực</th>
                  <th className="py-2.5 px-3">Vòng eo</th>
                  <th className="py-2.5 px-3">Vòng mông</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                <tr>
                  <td className="py-2 px-3 font-semibold">XS</td>
                  <td className="py-2 px-3">≤ 155 cm</td>
                  <td className="py-2 px-3">78 - 82 cm</td>
                  <td className="py-2 px-3">60 - 64 cm</td>
                  <td className="py-2 px-3">84 - 88 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">S</td>
                  <td className="py-2 px-3">156 - 162 cm</td>
                  <td className="py-2 px-3">82 - 86 cm</td>
                  <td className="py-2 px-3">64 - 68 cm</td>
                  <td className="py-2 px-3">88 - 92 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">M</td>
                  <td className="py-2 px-3">163 - 168 cm</td>
                  <td className="py-2 px-3">86 - 90 cm</td>
                  <td className="py-2 px-3">68 - 72 cm</td>
                  <td className="py-2 px-3">92 - 96 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">L</td>
                  <td className="py-2 px-3">169 - 174 cm</td>
                  <td className="py-2 px-3">90 - 94 cm</td>
                  <td className="py-2 px-3">72 - 76 cm</td>
                  <td className="py-2 px-3">96 - 100 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">XL</td>
                  <td className="py-2 px-3">≥ 175 cm</td>
                  <td className="py-2 px-3">94 - 98 cm</td>
                  <td className="py-2 px-3">76 - 80 cm</td>
                  <td className="py-2 px-3">100 - 104 cm</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
          <p className="font-medium text-neutral-800 dark:text-neutral-200">💡 Mẹo chọn size vừa vặn:</p>
          <p className="mt-1">
            Nếu số đo của bạn nằm ở ranh giới giữa hai size, hãy chọn size nhỏ hơn nếu muốn ôm người hoặc size lớn hơn nếu muốn mặc thoải mái, phóng khoáng.
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
