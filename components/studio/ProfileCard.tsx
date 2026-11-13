'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Identity } from '@/lib/data/filters';
import { buildImageUrl, type Look } from '@/lib/data/looks';
import { showToast } from './Toast';

interface ProfileCardProps {
  currentLook: Look;
  identity: Identity;
  onShuffle: () => void;
  onNameChange: (name: string) => void;
}

export default function ProfileCard({
  currentLook,
  identity,
  onShuffle,
  onNameChange,
}: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rotS, setRotS] = useState(0);
  const nameRef = useRef<HTMLSpanElement>(null);

  // Avatar crop calculation:
  // Size = 98px, k = 98 / 360
  const k = 98 / 360;
  const avatarUrl = buildImageUrl(currentLook.imageFile, 1000);

  const handleShuffle = () => {
    setRotS((prev) => prev + 180);
    onShuffle();
  };

  const handleToggleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
      setTimeout(() => {
        if (nameRef.current) {
          nameRef.current.focus();
          const range = document.createRange();
          range.selectNodeContents(nameRef.current);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 50);
    } else {
      setIsEditing(false);
      if (nameRef.current) {
        const text = nameRef.current.innerText.trim();
        if (text) {
          onNameChange(text);
        }
      }
      showToast('Name updated');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleToggleEdit();
    }
  };

  return (
    <div id="profile" className="glass">
      <div
        id="avatar"
        style={{
          backgroundImage: `url("${avatarUrl}")`,
          backgroundSize: `${1360 * k}px ${2048 * k}px`,
          backgroundPosition: `${-500 * k}px ${-46 * k}px`,
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div id="pinfo">
        <div className="prow">
          <span
            id="pname"
            ref={nameRef}
            contentEditable={isEditing}
            suppressContentEditableWarning
            className={isEditing ? 'ed' : ''}
            onKeyDown={handleKeyDown}
          >
            {identity.name}
          </span>
          <button
            className="rb"
            id="pen"
            aria-label="Edit name"
            onClick={handleToggleEdit}
          >
            <svg className="ic" viewBox="0 0 24 24">
              <path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1z" />
              <path d="M14.5 6.5l3 3" />
            </svg>
          </button>
          <button
            className="rb"
            id="shuf"
            aria-label="Shuffle identity"
            style={{ transform: `rotate(${rotS}deg)` }}
            onClick={handleShuffle}
          >
            <svg className="ic" viewBox="0 0 24 24">
              <path d="M3 7h4c3 0 4 10 8 10h5" />
              <path d="M3 17h4c1.5 0 2.4-1.6 3.3-3.3M15 7h5" />
              <path d="M17.5 4.5L20 7l-2.5 2.5" />
              <path d="M17.5 14.5L20 17l-2.5 2.5" />
            </svg>
          </button>
        </div>
        <div className="meta">
          <span id="age">{identity.age}</span>
          <i />
          <span id="city">
            {identity.city}, {identity.countryCode}
          </span>
          <i />
          <span className="wx" data-tip="Overcast · soft daylight">
            <svg className="ic" viewBox="0 0 24 24">
              <path d="M7 18h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5 4.3 4.3 0 0 0 7 18z" />
            </svg>
            <span id="temp">{identity.tempC}°C</span>
          </span>
        </div>
      </div>
    </div>
  );
}
