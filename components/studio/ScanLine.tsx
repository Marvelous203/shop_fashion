'use client';

import React, { useEffect, useState } from 'react';

interface ScanLineProps {
  triggerKey?: number | string;
}

export default function ScanLine({ triggerKey }: ScanLineProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setActive(true);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [triggerKey]);

  return (
    <div
      id="scan"
      className={active ? 'go' : ''}
      onAnimationEnd={() => setActive(false)}
    />
  );
}
