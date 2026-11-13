'use client';

import React, { useState } from 'react';
import { TUNE_CONFIG, type TuneSection } from '@/lib/data/filters';
import { showToast } from './Toast';

interface TunePanelProps {
  sectionKey: string;
  onRescan?: () => void;
}

export default function TunePanel({ sectionKey, onRescan }: TunePanelProps) {
  const normKey = sectionKey.toLowerCase();
  // Map 'acc' -> 'accessories', 'tattoo' -> 'tattoos'
  const configKey =
    normKey === 'acc'
      ? 'accessories'
      : normKey === 'tattoo'
      ? 'tattoos'
      : normKey;

  const config: TuneSection = TUNE_CONFIG[configKey] || {
    sliders: [],
    presets: [],
  };

  const isComingSoon = ['face', 'hair', 'makeup'].includes(normKey);

  const [activeSwatch, setActiveSwatch] = useState(0);
  const [activePreset, setActivePreset] = useState(0);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    config.sliders?.forEach((s) => {
      init[s.label] = s.default;
    });
    return init;
  });
  const [selectedMulti, setSelectedMulti] = useState<Set<string>>(new Set());

  const handleSliderChange = (label: string, val: number) => {
    if (isComingSoon) return;
    setSliderValues((prev) => ({ ...prev, [label]: val }));
    onRescan?.();
  };

  const handlePresetClick = (p: string, idx: number) => {
    if (isComingSoon) {
      showToast('This feature is coming soon');
      return;
    }
    setActivePreset(idx);
    onRescan?.();
    showToast(`${sectionKey}: ${p}`);
  };

  const handleSwatchClick = (idx: number) => {
    if (isComingSoon) {
      showToast('This feature is coming soon');
      return;
    }
    setActiveSwatch(idx);
    onRescan?.();
  };

  const handleMultiClick = (opt: string) => {
    setSelectedMulti((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });
    onRescan?.();
  };

  const title = normKey.charAt(0).toUpperCase() + normKey.slice(1);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        opacity: isComingSoon ? 0.6 : 1,
        pointerEvents: isComingSoon ? 'auto' : 'auto',
      }}
    >
      <div className="vh">
        <h3>{title}</h3>
        {isComingSoon ? (
          <span
            style={{
              color: '#ffc83b',
              fontWeight: 600,
              fontSize: '11px',
              border: '1px solid #ffc83b',
              padding: '2px 6px',
              borderRadius: '999px',
            }}
          >
            ✕ Coming soon
          </span>
        ) : (
          <span>changes re-render the model</span>
        )}
      </div>

      {/* Swatches */}
      {config.swatches && config.swatches.length > 0 && (
        <div className="sws">
          {config.swatches.map((color, idx) => (
            <button
              key={idx}
              className={`sw ${activeSwatch === idx ? 'on' : ''}`}
              style={{
                background: color,
                cursor: isComingSoon ? 'not-allowed' : 'pointer',
              }}
              onClick={() => handleSwatchClick(idx)}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>
      )}

      {/* Presets */}
      {config.presets && config.presets.length > 0 && (
        <div className="opts" id="prs">
          {config.presets.map((p, idx) => (
            <button
              key={p}
              className={`opt ${activePreset === idx ? 'on' : ''}`}
              style={{ cursor: isComingSoon ? 'not-allowed' : 'pointer' }}
              onClick={() => handlePresetClick(p, idx)}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Multi-select options */}
      {config.multiSelect && config.options && (
        <>
          <div className="lab">Add items</div>
          <div className="opts">
            {config.options.map((opt) => {
              const on = selectedMulti.has(opt);
              return (
                <button
                  key={opt}
                  className={`opt ${on ? 'on' : ''}`}
                  onClick={() => handleMultiClick(opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Sliders */}
      {config.sliders && config.sliders.length > 0 && (
        <div id="sls" style={{ marginTop: '10px' }}>
          {config.sliders.map((s) => {
            const val = sliderValues[s.label] ?? s.default;
            const pct = ((val - s.min) / (s.max - s.min)) * 100;
            return (
              <div key={s.label} className="sl">
                <div className="sr">
                  <span>{s.label}</span>
                  <b>{val}%</b>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  value={val}
                  style={
                    {
                      '--p': `${pct}%`,
                      cursor: isComingSoon ? 'not-allowed' : 'pointer',
                    } as React.CSSProperties
                  }
                  disabled={isComingSoon}
                  onChange={(e) =>
                    handleSliderChange(s.label, Number(e.target.value))
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
