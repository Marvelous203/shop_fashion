'use client';

import React, { useState } from 'react';
import html2canvas from 'html2canvas';

interface SaveImageButtonProps {
  lookId?: number | string;
  stageSelector?: string;
  className?: string;
}

export function SaveImageButton({
  lookId = '0',
  stageSelector = '#stage',
  className = '',
}: SaveImageButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    try {
      setLoading(true);
      const target =
        document.querySelector<HTMLElement>(stageSelector) ||
        document.querySelector<HTMLElement>('#product-hero') ||
        document.querySelector<HTMLElement>('main') ||
        document.body;

      if (!target) {
        setLoading(false);
        return;
      }

      const canvas = await html2canvas(target, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: null,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `vell-look-${lookId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error saving image:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCapture}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 transition shadow-sm disabled:opacity-50 ${className}`}
      aria-label="Lưu ảnh trang phục"
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin text-neutral-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Đang xuất ảnh...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Lưu ảnh Look</span>
        </>
      )}
    </button>
  );
}
