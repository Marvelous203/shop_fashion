'use client';

import React, { useState } from 'react';

interface ShareLookButtonProps {
  lookId?: number | string;
  filterId?: string;
  className?: string;
}

export function ShareLookButton({ lookId, filterId, className = '' }: ShareLookButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const url = new URL(window.location.href);
      if (lookId !== undefined) url.searchParams.set('look', String(lookId));
      if (filterId) url.searchParams.set('filter', filterId);

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url.toString());
      } else {
        const input = document.createElement('input');
        input.value = url.toString();
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 transition shadow-sm ${className}`}
      aria-label="Chia sẻ phong cách này"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-600 dark:text-emerald-400">Đã chép link!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Chia sẻ Look</span>
        </>
      )}
    </button>
  );
}
