'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function PostsIndexPage() {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // 파티클
  const particlesInit = async (engine) => { await loadSlim(engine); };

  // 통합 검색
  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    setLoading(true);

    // 3개 테이블 검색 (title + content)
    const [devRes, projectRes, errorRes] = await Promise.all([
      supabase.from('posts').select('*').or(`title.ilike.%${q}%,content.ilike.%${q}%`),
      supabase.from('projects').select('*').or(`title.ilike.%${q}%,content.ilike.%${q}%`),
      supabase.from('error').select('*').or(`title.ilike.%${q}%,content.ilike.%${q}%`),
    ]);

    // 에러처리
    if (devRes.error || projectRes.error || errorRes.error) {
      setResults([]);
    } else {
      // 결과 통합
      const allResults = [
        ...(devRes.data || []).map(item => ({
          ...item,
          _type: 'posts',
          image: item.image || 'https://source.unsplash.com/160x220/?book,dev',
        })),
        ...(projectRes.data || []).map(item => ({
          ...item,
          _type: 'projects',
          image: item.image || 'https://source.unsplash.com/160x220/?book,project',
        })),
        ...(errorRes.data || []).map(item => ({
          ...item,
          _type: 'error',
          image: item.image || 'https://source.unsplash.com/160x220/?book,error',
        })),
      ];
      setResults(allResults);
    }
    setSearched(true);
    setLoading(false);
  };

  // 카드 애니메이션
  const getCardContainerClass = () => {
    if (!searched) return 'before-search';
    if (results.length <= 1) return 'search-one';
    return 'search-many';
  };

  return (
    <main className="relative h-screen textured-bg text-white overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0 ">
        <div className="w-full h-full bg-cover bg-center filter blur-sm scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
      </div>

      {/* 파티클 */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          fpsLimit: 60,
          particles: {
            number: { value: 50, density: { enable: true, area: 800 } },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 0.3, outModes: 'out' },
            color: { value: '#ffffff40' },
            opacity: { value: { min: 0.1, max: 0.3 } },
          },
        }}
      />

      {/* 중앙 검색폼 + 카드 */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        {/* 검색폼 */}
        <form onSubmit={handleSubmit} className="relative w-full max-w-xl mb-8">
          <input
            type="text"
            value={term}
            onChange={e => setTerm(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="
              w-full py-4 pl-5 pr-14 rounded-full
              bg-white/20 placeholder-white/70 text-white
              focus:outline-none focus:ring-2 focus:ring-white/50
              backdrop-blur-sm transition
              glow-search
            "
          />
          <button
            type="submit"
            aria-label="검색"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white opacity-80 hover:opacity-100 transition"
          >
            <Search size={24} />
          </button>
        </form>

        {/* 카드 리스트 */}
        <div
          className={`relative flex justify-center items-end gap-6 card-anim-container ${getCardContainerClass()}`}
        >
          {/* 검색 전 */}
          {!searched && (
            <div
              className="bg-white/10 rounded-xl shadow-xl overflow-hidden border border-white/10 backdrop-blur-lg flex flex-col items-center w-40 h-56 min-w-[8rem] max-w-xs justify-center animate-fadein"
              style={{
                boxShadow: '0 8px 32px #0008',
                transition: 'width 0.7s cubic-bezier(.4,2,.3,1)',
              }}
            >
              <span className="text-gray-400 text-base opacity-80">검색 결과 없음</span>
            </div>
          )}

          {/* 로딩 */}
          {loading && (
            <div className="text-lg text-gray-300 px-10 py-16">검색중...</div>
          )}

          {/* 결과 */}
          {searched && !loading && results.map((post, i) => (
            <Link
              key={`${post._type}_${post.id}`}
              href={`/${post._type}/${post.id}`}
              className="hover:scale-[1.03] transition-all duration-200"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                className="bg-white/10 rounded-xl shadow-lg overflow-hidden border border-white/10 backdrop-blur-lg flex flex-col items-center w-36 min-w-[8rem] max-w-xs animate-expand cursor-pointer"
                style={{
                  transform: `translateY(0)`,
                  boxShadow: '0 8px 32px #0008',
                  opacity: 1,
                  transition: 'transform 0.7s cubic-bezier(.4,2,.3,1), opacity 0.5s',
                  animationDelay: `${0.06 * i}s`,
                }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-24 h-32 object-cover mt-4 rounded-lg bg-gray-200"
                />
                <div className="flex-1 flex flex-col items-center justify-center p-2">
                  {/* 타입/카테고리 */}
                  <div className="text-xs font-semibold text-cyan-300 mb-1">{{
                    posts: '개발지식',
                    projects: '프로젝트',
                    error: '에러모음'
                  }[post._type] || ''}</div>
                  <div className="text-sm font-bold text-white mb-1 truncate text-center">{post.title}</div>
                  <div className="text-xs text-gray-300 text-center">{post.category || ''}</div>
                </div>
              </div>
            </Link>
          ))}

          {/* 검색했지만 결과 없을 때 */}
          {searched && !loading && results.length === 0 && (
            <div className="bg-white/10 rounded-xl shadow-xl overflow-hidden border border-white/10 backdrop-blur-lg flex flex-col items-center w-40 h-56 min-w-[8rem] max-w-xs justify-center animate-fadein"
              style={{
                boxShadow: '0 8px 32px #0008',
                transition: 'width 0.7s cubic-bezier(.4,2,.3,1)',
              }}>
              <span className="text-gray-400 text-base opacity-80">검색 결과 없음</span>
            </div>
          )}
        </div>
      </div>

      {/* 애니메이션 스타일 */}
      <style>{`
        .card-anim-container {
          min-height: 15rem;
          transition: min-width 0.8s cubic-bezier(.5,2,.3,1);
        }
        .before-search > div {
          transition: width 0.7s cubic-bezier(.4,2,.3,1), opacity 0.6s;
        }
        .search-many > div {
          animation: fadein 0.8s cubic-bezier(.4,2,.3,1);
        }
        @keyframes fadein {
          0% { opacity: 0; transform: scale(0.93); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
}