// src/app/page.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter }       from 'next/navigation';
import { ArrowRight, Heart } from 'lucide-react';
import { motion }          from 'framer-motion';
import Particles           from 'react-tsparticles';
import { loadSlim }        from 'tsparticles-slim';
import MultiRingCarousel   from '@/components/MultiRingCarousel';
import { supabase }        from '@/lib/supabaseClient';

export default function HomePage() {
  const router = useRouter();



  const [books, setBooks] = useState([]);
  // Supabase에서 posts 테이블 데이터 fetch
useEffect(() => {
  async function fetchBooks() {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title')
      .order('created_at', { ascending: false })
      .limit(12);
    if (!error && data) setBooks(data);
    else setBooks([]);
  }
  fetchBooks();
}, []);

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

  // 좋아요 로직
  const [likes, setLikes]           = useState(0);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [hasLiked, setHasLiked]     = useState(false);
  const [toggling, setToggling]     = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('likes')
        .select('count')
        .eq('id', 'homepage')
        .single();
      if (!error && data) {
        setLikes(data.count);
      } else {
        console.error('좋아요 수 로드 실패', error);
      }
      if (typeof window !== 'undefined' && localStorage.getItem('liked_homepage')) {
        setHasLiked(true);
      }
      setLoadingLikes(false);
    })();
  }, []);

  const handleLike = async () => {
    if (loadingLikes || toggling || hasLiked) return;
    setToggling(true);
    setLikes(prev => prev + 1);
    const { error } = await supabase
      .from('likes')
      .update({ count: likes + 1 })
      .eq('id', 'homepage');
    if (error) {
      console.error('좋아요 업데이트 실패', error);
      setLikes(prev => prev - 1);
    } else {
      localStorage.setItem('liked_homepage', 'true');
      setHasLiked(true);
    }
    setToggling(false);
  };

  return (
    <main className="relative h-screen bg-gray-900 text-white overflow-hidden">
      {/* 배경 + 블러 + 그라데이션 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-cover bg-center filter blur-sm scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
      </div>

      {/* 빛 번짐 */}
      <div className="shine-overlay pointer-events-none" />

      {/* 파티클 */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0 pointer-events-none"
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

      {/* 오른쪽 하단 좋아요 버튼 */}
      <button
        onClick={handleLike}
        disabled={loadingLikes || toggling || hasLiked}
        className={`
          fixed right-6 bottom-6 z-20 flex items-center space-x-2
          ${hasLiked ? 'bg-red-600' : 'bg-gray-600 hover:bg-red-700'}
          text-white rounded-full px-4 py-3 shadow-lg transition
          ${loadingLikes || toggling || hasLiked ? 'opacity-50 cursor-default' : ''}
        `}
        title={hasLiked ? '이미 좋아요를 누르셨습니다' : '이 홈페이지가 마음에 든다면 눌러주세요!'}
      >
        <Heart className="w-6 h-6" />
        <span className="font-medium">{likes}</span>
      </button>
    </main>
  );
}