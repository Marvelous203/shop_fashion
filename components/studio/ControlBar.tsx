'use client';

import React from 'react';

interface ControlBarProps {
  canUndo: boolean;
  canRedo: boolean;
  framing: 'full' | 'mid' | 'portrait';
  onUndo: () => void;
  onRedo: () => void;
  onCycleFraming: () => void;
  onReset: () => void;
}

export default function ControlBar({
  canUndo,
  canRedo,
  framing,
  onUndo,
  onRedo,
  onCycleFraming,
  onReset,
}: ControlBarProps) {
  const poseLabel = {
    full: 'Full',
    mid: 'Mid',
    portrait: 'Portrait',
  }[framing];

  return (
    <div id="ctrl" className="glass">
      <button
        id="bUndo"
        disabled={!canUndo}
        onClick={onUndo}
        aria-label="Undo"
      >
        <svg className="ic" viewBox="0 0 24 24">
          <path d="M9 14L4 9l5-5" />
          <path d="M4 9h10a6 6 0 0 1 0 12h-4" />
        </svg>
        Undo
      </button>

      <button
        id="bRedo"
        disabled={!canRedo}
        onClick={onRedo}
        aria-label="Redo"
      >
        <svg className="ic" viewBox="0 0 24 24">
          <path d="M15 14l5-5-5-5" />
          <path d="M20 9H10a6 6 0 0 0 0 12h4" />
        </svg>
        Redo
      </button>

      <button
        id="bPose"
        className="pose"
        title="Pose"
        onClick={onCycleFraming}
      >
        <svg className="ic" viewBox="0 0 24 24">
          <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
          <circle cx="12" cy="9.5" r="2" />
          <path d="M8.5 17c.5-3 2-4 3.5-4s3 1 3.5 4" />
        </svg>
        <span id="poseL">{poseLabel}</span>
      </button>

      <button id="bReset" onClick={onReset} aria-label="Reset">
        <svg className="ic" viewBox="0 0 24 24">
          <path d="M4 12a8 8 0 1 0 2.5-5.8" />
          <path d="M4 4v4h4" />
        </svg>
        Reset
      </button>
    </div>
  );
}
