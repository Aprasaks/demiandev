// src/components/RingCarousel.jsx
'use client';

import React, { useEffect, useRef } from 'react';
import './RingCarousel.css';

/**
 * RingCarousel
 * @param {{ id: number; title: string }[]} items
 * @param {number} radius    링의 반지름 (px)
 * @param {number} tilt      X축 기울기 각도 (deg)
 * @param {number} speed     한 바퀴 도는 데 걸리는 시간 (ms)
 */
export default function RingCarousel({
  items,
  radius = 300,
  tilt = 60,
  speed = 20000,
}) {
  const ringRef = useRef();

  useEffect(() => {
    const el = ringRef.current;
    el.style.setProperty('--ring-radius', `${radius}px`);
    el.style.setProperty('--ring-tilt', `${tilt}deg`);
    el.style.setProperty('--ring-speed', `${speed}ms`);
  }, [radius, tilt, speed]);

  const n = items.length;
  return (
    <div className="ring-carousel">
      <div ref={ringRef} className="ring">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="ring__item"
            style={{ '--i': i, '--n': n }}
          >
            <div className="book-card">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}