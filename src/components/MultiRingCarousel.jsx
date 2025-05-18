// src/components/MultiRingCarousel.jsx
'use client';

import React from 'react';
import RingCarousel from './RingCarousel';

/**
 * rings: [
 *   { items, radius, tilt, speed },
 *   ...
 * ]
 */
export default function MultiRingCarousel({ rings }) {
  const count = rings.length;
  return (
    <div className="absolute inset-0 pointer-events-none">
      {rings.map((cfg, idx) => {
        // 화면 세로 위치를 %로 계산 (idx 0 → 10%, 1 → 30%, ...)
        const topPercent =  ((idx + 1) / (count + 1)) * 100;
        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: `${topPercent}%`,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: `${cfg.radius * 2}px`, // 링이 차지하는 높이
            }}
          >
            <RingCarousel
              items={cfg.items}
              radius={cfg.radius}
              tilt={cfg.tilt}
              speed={cfg.speed}
            />
          </div>
        );
      })}
    </div>
  );
}