'use client';

import React, { useEffect, useRef } from 'react';
import type { Identity } from '@/lib/data/filters';

interface DnaPanelProps {
  identity: Identity;
  onReseed: () => void;
}

const N = 26;

export default function DnaPanel({ identity, onReseed }: DnaPanelProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Clear previous children
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const NS = 'http://www.w3.org/2000/svg';
    const lines: SVGLineElement[] = [];
    const circlesA: SVGCircleElement[] = [];
    const circlesB: SVGCircleElement[] = [];

    for (let i = 0; i < N; i++) {
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('stroke', '#fff');
      svg.appendChild(line);
      lines.push(line);
    }

    for (let i = 0; i < N; i++) {
      const cA = document.createElementNS(NS, 'circle');
      cA.setAttribute('fill', '#fff');
      svg.appendChild(cA);
      circlesA.push(cA);

      const cB = document.createElementNS(NS, 'circle');
      cB.setAttribute('fill', '#fff');
      svg.appendChild(cB);
      circlesB.push(cB);
    }

    let t = 0;
    let animId: number;

    const loop = () => {
      t += 0.03;
      for (let i = 0; i < N; i++) {
        const ph = i * 0.42 + t;
        const s = Math.sin(ph);
        const d = (Math.cos(ph) + 1) / 2;
        const x = 12 + i * 11;
        const y1 = 60 + s * 38;
        const y2 = 60 - s * 38;

        lines[i].setAttribute('x1', String(x));
        lines[i].setAttribute('x2', String(x));
        lines[i].setAttribute('y1', String(y1));
        lines[i].setAttribute('y2', String(y2));
        lines[i].setAttribute('stroke-opacity', String(0.15 + d * 0.25));

        circlesA[i].setAttribute('cx', String(x));
        circlesA[i].setAttribute('cy', String(y1));
        circlesA[i].setAttribute('r', String(2 + d * 2.4));
        circlesA[i].setAttribute('fill-opacity', String(0.4 + d * 0.6));

        circlesB[i].setAttribute('cx', String(x));
        circlesB[i].setAttribute('cy', String(y2));
        circlesB[i].setAttribute('r', String(2 + (1 - d) * 2.4));
        circlesB[i].setAttribute('fill-opacity', String(0.4 + (1 - d) * 0.6));
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="vh">
        <h3>DNA</h3>
        <span>identity seed</span>
      </div>

      <svg
        ref={svgRef}
        id="helix"
        viewBox="0 0 300 120"
        width="300"
        height="120"
      />

      <div className="kv">
        <span>Seed</span>
        <b>{identity.dnaSeed}</b>
      </div>
      <div className="kv">
        <span>Heritage</span>
        <b>Korean</b>
      </div>
      <div className="kv">
        <span>Age</span>
        <b>{identity.age}</b>
      </div>
      <div className="kv">
        <span>Eye colour</span>
        <b>Dark brown</b>
      </div>
      <div className="kv">
        <span>Hair</span>
        <b>Black · high bun</b>
      </div>

      <button className="outl" id="reseed" onClick={onReseed}>
        Re-seed identity
      </button>
    </div>
  );
}
