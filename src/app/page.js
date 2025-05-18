// src/app/page.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter }       from 'next/navigation';
import { ArrowRight }      from 'lucide-react';
import { motion }          from 'framer-motion';         // ← 추가
import Particles           from 'react-tsparticles';
import { loadSlim }        from 'tsparticles-slim';
import MultiRingCarousel   from '@/components/MultiRingCarousel';

export default function HomePage() {
  const router = useRouter();

  const sampleTitles = useMemo(() => [
    'GraphQL 기초 이해', 'React 성능 최적화', 'Next.js ISR 완전정복',
    'CSS 인 액션', 'TypeScript 완벽 가이드', '데이터 시각화 실전',
    '알고리즘 탐구', '클린 코드 작성법', '디자인 패턴',
    '우수님날씨앱 멋져요', '웹 접근성 가이드', '프로그래밍 면접 준비',
  ], []);

  const [books, setBooks] = useState([]);
  useEffect(() => {
    const rnd = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      title: sampleTitles[Math.floor(Math.random() * sampleTitles.length)],
    }));
    setBooks(rnd);
  }, [sampleTitles]);

  const ringConfigs = useMemo(() => [
    { items: books, radius: 500, tilt: 0, speed: 40000, reverse: false },
    { items: books, radius: 400, tilt: 0, speed: 30000, reverse: true  },
    { items: books, radius: 500, tilt: 0, speed: 25000, reverse: false },
    { items: books, radius: 400, tilt: 0, speed: 30000, reverse: true  },
    { items: books, radius: 500, tilt: 0, speed: 40000, reverse: false },
  ], [books]);

  const particlesInit = async engine => {
    await loadSlim(engine);
  };

  const goPosts = () => {
    router.push('/posts');
  };

  return (
    <main className="relative h-screen bg-gray-900 text-white overflow-hidden">
      {/* 배경 + 블러 + 그라데이션 */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center filter blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
      </div>

      {/* 빛 번짐 */}
      <div className="shine-overlay" />

      {/* 파티클 */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          fpsLimit: 60,
          particles: {
            number:  { value: 50, density: { enable: true, area: 800 } },
            size:    { value: { min: 1, max: 3 } },
            move:    { enable: true, speed: 0.3, outModes: 'out' },
            color:   { value: '#ffffff30' },
            opacity: { value: { min: 0.05, max: 0.2 } },
            links:   { enable: false },
            shape:   { type: 'circle' },
          },
        }}
      />

      {/* 5단 무한 서고 링 */}
      <MultiRingCarousel rings={ringConfigs} />

      {/* 안내 문구 + 들어가기 버튼 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 space-y-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-aggro text-center"
        >
          당신이 원하는 기록을 찾아볼까요?
        </motion.p>

        <motion.button
          onClick={goPosts}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="
            flex items-center gap-2
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold
            px-6 py-3 rounded-full
            shadow-lg
            transition
          "
        >
          검색하기 <ArrowRight size={20} />
        </motion.button>
      </div>
    </main>
  );
}