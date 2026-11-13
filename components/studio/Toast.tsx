'use client';

import React, { useState, useEffect } from 'react';

type ToastListener = (msg: string) => void;
const listeners = new Set<ToastListener>();

export function showToast(message: string) {
  listeners.forEach((fn) => fn(message));
}

export default function Toast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handler = (msg: string) => {
      setMessage(msg);
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setVisible(false);
      }, 1800);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div id="toast" className={`glass ${visible ? 'on' : ''}`}>
      <svg className="ic" viewBox="0 0 24 24">
        <path
          d="M5 12.5l4.5 4.5L19 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}
