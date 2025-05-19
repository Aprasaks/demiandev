// src/app/posts/page.jsx
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

  const particlesInit = async engine => {
    await loadSlim(engine);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    setLoading(true);

    // posts / projects / error 세 테이블에서 통합 검색
    const [devRes, projectRes, errorRes] = await Promise.all([
      supabase.from('posts').select('*').or(`title.ilike.%${q}%,content.ilike.%${q}%`),
      supabase.from('projects').select('*').or(`title.ilike.%${q}%,content.ilike.%${q}%`),
      supabase.from('error').select('*').or(`title.ilike.%${q}%,content.ilike.%${q}%`),
    ]);

    if (devRes.error || projectRes.error || errorRes.error) {
      setResults([]);
    } else {
      const all = [
        ...(devRes.data || []).map(item => ({ ...item, _type: 'posts' })),
        ...(projectRes.data || []).map(item => ({ ...item, _type: 'projects' })),
        ...(errorRes.data || []).map(item => ({ ...item, _type: 'error' })),
      ].map(item => ({
        ...item,
        image:
          item.image ||
          `https://source.unsplash.com/400x533/?${encodeURIComponent(item.title.split(' ')[0] || 'code')}`,
      }));
      setResults(all);
    }

    setSearched(true);
    setLoading(false);
  };

  const getContainerClass = () => {
    if (!searched) return 'before-search';
    return results.length > 1 ? 'search-many' : 'search-one';
  };

  return (
    <main className="relative h-screen bg-gray-900 text-white overflow-hidden">
      {/* 배경 + 그라데이션 */}
      <div className="absolute inset-0">
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
            number: { value: 60, density: { enable: true, area: 800 } },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 0.4, outModes: 'out' },
            color: { value: '#ffffff30' },
            opacity: { value: { min: 0.1, max: 0.25 } },
          },
        }}
      />

      {/* 검색폼 + 카드 */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        <form onSubmit={handleSubmit} className="relative w-full max-w-xl mb-12">
          <input
            type="text"
            value={term}
            onChange={e => setTerm(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="
              w-full py-4 pl-5 pr-14 rounded-full
              bg-white/10 placeholder-white/60 text-white
              focus:outline-none focus:ring-2 focus:ring-white/40
              transition
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

        <div
        className={`flex flex-wrap items-end justify-center gap-8 ${getContainerClass()}`}
        style={{ minHeight: '100px' }}  // 검색 전후에 항상 250px 높이를 확보
        >
          {/* 검색 전 */}
          {!searched && (
            <div className="text-gray-400 text-lg opacity-70">검색어를 입력해 주세요</div>
          )}

          {/* 로딩 */}
          {loading && <div className="text-gray-300">검색 중...</div>}

          {/* 결과 */}
          {searched && !loading && results.map((item, i) => (
            <Link
              key={`${item._type}_${item.id}`}
              href={`/${item._type}/${item.id}`}
              className="group block w-44 hover:scale-105 transform transition"
            >
              <div className="aspect-w-3 aspect-h-4 rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 w-full p-3 backdrop-blur-md bg-black/40">
                  <span className="text-xs text-cyan-300 uppercase">
                    {{
                      posts: '개발지식',
                      projects: '프로젝트',
                      error: '에러모음',
                    }[item._type]}
                  </span>
                  <h3 className="mt-1 text-sm font-bold truncate">{item.title}</h3>
                  <p className="text-[10px] text-gray-200 truncate">{item.category || '기본'}</p>
                </div>
              </div>
            </Link>
          ))}

          {/* 검색 후 결과 없음 */}
          {searched && !loading && results.length === 0 && (
            <div className="text-gray-400 text-lg opacity-70">검색 결과가 없습니다</div>
          )}
        </div>
      </div>
    </main>
  );
}