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

  // 기록요청 모달 관련 state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  // 페이지네이션 (카드 4개씩)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(results.length / pageSize);
  const pagedResults = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const particlesInit = async engine => { await loadSlim(engine); };

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
    setCurrentPage(1); // 검색할 때마다 1페이지로
  };

  const getContainerClass = () => {
    if (!searched) return 'before-search';
    return results.length > 1 ? 'search-many' : 'search-one';
  };

  // 기록 요청 처리 함수 (Supabase + Discord)
  const handleRequestLog = async () => {
    if (!requestText.trim() || requestLoading) return;
    setRequestLoading(true);

    // 1. Supabase 기록 남기기
    await supabase.from('requests').insert({
      keyword: term,
      message: requestText,
      created_at: new Date().toISOString(),
    });

    // 2. Discord Webhook으로도 요청 (api route로 fetch)
    await fetch('/api/request-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword: term,
        message: requestText,
      }),
    });

    setRequestSent(true);
    setRequestLoading(false);

    setTimeout(() => {
      setShowRequestModal(false);
      setRequestText('');
      setRequestSent(false);
    }, 1800);
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
          style={{ minHeight: '100px' }}
        >
          {/* 검색 전 */}
          {!searched && (
            <div className="text-gray-400 text-lg opacity-70">검색어를 입력해 주세요</div>
          )}

          {/* 로딩 */}
          {loading && <div className="text-gray-300">검색 중...</div>}

          {/* 결과 (카드 4개만) */}
          {searched && !loading && pagedResults.map((item, i) => (
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

          {/* 검색 후 결과 없음 + 기록요청 */}
          {searched && !loading && results.length === 0 && (
            <div className="flex flex-col items-center gap-4 text-gray-400 text-lg opacity-70 mt-4">
              <div>검색 결과가 없습니다</div>
              <button
                className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-full shadow transition"
                onClick={() => setShowRequestModal(true)}
              >
                기록 요청하기
              </button>
            </div>
          )}
        </div>

        {/* 페이지네이션 (화살표) */}
        {searched && !loading && results.length > pageSize && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              className={`px-3 py-1 rounded-full bg-white/10 hover:bg-white/30 transition ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(c => c - 1)}
            >
              ←
            </button>
            <span className="text-base text-white/80 select-none">{currentPage} / {totalPages}</span>
            <button
              className={`px-3 py-1 rounded-full bg-white/10 hover:bg-white/30 transition ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(c => c + 1)}
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* 기록요청 모달 */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black rounded-lg p-6 w-full max-w-sm shadow-xl relative">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
            >✕</button>
            <div className="font-bold text-lg mb-3">기록 요청하기</div>
            <div className="mb-2 text-sm text-gray-600">아래에 요청 내용을 작성해주세요.</div>
            <textarea
              value={requestText}
              onChange={e => setRequestText(e.target.value)}
              rows={4}
              className="w-full border rounded p-2 mb-4"
              placeholder={`예) "${term}"에 대한 기록을 요청합니다.`}
              disabled={requestSent}
            />
            <button
              className="bg-blue-700 hover:bg-blue-600 text-white rounded px-5 py-2 font-bold w-full"
              onClick={handleRequestLog}
              disabled={!requestText.trim() || requestLoading || requestSent}
            >
              {requestLoading ? "요청 중..." : requestSent ? "요청 완료!" : "요청하기"}
            </button>
            {requestSent && (
              <div className="mt-3 text-green-700 text-center font-bold">요청이 접수되었습니다!</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}