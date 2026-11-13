'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export interface ShareUrlParams {
  look?: string;
  filter?: string;
  height?: string;
  build?: string;
}

export function useShareUrl() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentParams: ShareUrlParams = useMemo(
    () => ({
      look: searchParams.get('look') ?? undefined,
      filter: searchParams.get('filter') ?? undefined,
      height: searchParams.get('height') ?? undefined,
      build: searchParams.get('build') ?? undefined,
    }),
    [searchParams]
  );

  const generateShareUrl = useCallback(
    (state: ShareUrlParams) => {
      const params = new URLSearchParams();
      if (state.look !== undefined) params.set('look', state.look);
      if (state.filter !== undefined) params.set('filter', state.filter);
      if (state.height !== undefined) params.set('height', state.height);
      if (state.build !== undefined) params.set('build', state.build);
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}${pathname}?${params.toString()}`;
    },
    [pathname]
  );

  const updateParams = useCallback(
    (state: ShareUrlParams) => {
      const url = generateShareUrl(state);
      router.replace(url);
    },
    [generateShareUrl, router]
  );

  const copyToClipboard = useCallback(
    async (state?: ShareUrlParams) => {
      const url = generateShareUrl(state ?? currentParams);
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      return url;
    },
    [generateShareUrl, currentParams]
  );

  return { currentParams, generateShareUrl, updateParams, copyToClipboard };
}
