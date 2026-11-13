'use client';

import React, { useState } from 'react';
import { showToast } from './Toast';

interface SaveButtonProps {
  onSave: () => void;
}

export default function SaveButton({ onSave }: SaveButtonProps) {
  const [shining, setShining] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShining(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShining(true);
      });
    });
    onSave();
    showToast('Saved to library');
  };

  return (
    <div id="save" className="glass">
      <button
        className={shining ? 'shine' : ''}
        onClick={handleClick}
        onAnimationEnd={() => setShining(false)}
      >
        SAVE TO LIBRARY
      </button>
    </div>
  );
}
