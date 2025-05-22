// src/app/posts/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { supabase } from '@/lib/supabaseClient';
import BookTreeSidebar from '@/components/BookTreeSidebar';
import Link from 'next/link';

export default function PostsIndexPage() {
  const [term, setTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isBookTreeOpen, setIsBookTreeOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const searchBoxRef = useRef(null);

  // 실시간 검색 결과
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(results.length / pageSize);
  const pagedResults = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 기록 요청 모달 관련 state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  // 파티클
  const particlesInit = async engine => { await loadSlim(engine); };

  // posts 카테고리별 fetch
  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) return;
      const byCategory = {};
      for (const post of data) {
        const cat = post.category || '기타';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(post);
      }
      setCategories(
        Object.entries(byCategory).map(([category, posts]) => ({
          category,
          posts,
        }))
      );
    }
    fetchPosts();
  }, []);

  // 실시간 검색
  useEffect(() => {
    // 검색어가 없으면 초기화
    if (!term.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    let ignore = false;
    setLoading(true);

    async function doSearch() {
      const q = term.trim();
      const [devRes, projectRes, errorRes] = await Promise.all([
        supabase.from('posts').select('*').or(`title.ilike.%${q}%`),
        supabase.from('projects').select('*').or(`title.ilike.%${q}%`),
        supabase.from('error').select('*').or(`title.ilike.%${q}%`),
      ]);

      if (!ignore) {
        if (devRes.error || projectRes.error || errorRes.error) {
          setResults([]);
        } else {
          const all = [
            ...(devRes.data || []).map(item => ({ ...item, _type: 'posts' })),
            ...(projectRes.data || []).map(item => ({ ...item, _type: 'projects' })),
            ...(errorRes.data || []).map(item => ({ ...item, _type: 'error' })),
          ];
          setResults(all);
        }
        setSearched(true);
        setLoading(false);
        setCurrentPage(1);
      }
    }
    // debounce (살짝 느리게)
    const timeout = setTimeout(doSearch, 200);
    return () => {
      ignore = true;
      clearTimeout(timeout);
    };
  }, [term]);

  // 기록 요청 처리 함수
  const handleRequestLog = async () => {
    if (!requestText.trim() || requestLoading) return;
    setRequestLoading(true);

    await supabase.from('requests').insert({
      keyword: term,
      message: requestText,
      created_at: new Date().toISOString(),
    });

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

  // 카드 위치(검색창 기준)
  // 검색창 위치가 변할 수도 있으니 left/top은 스타일로 잡음
  // (정밀하게 맞추고 싶으면 더 보정 가능)
  return (
    <main className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* 배경 + 파티클 */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-cover bg-center filter blur-sm scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
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
      </div>
  
      {/* BookTreeSidebar(왼쪽) + 검색/결과(오른쪽) */}
      <div className="relative z-10 flex flex-row items-start justify-center min-h-screen w-full">
        {/* 왼쪽: BookTreeSidebar */}
        <div className="flex-shrink-0 flex flex-col items-center justify-start pt-32" style={{ width: 340, minWidth: 240 }}>
          <BookTreeSidebar
            categories={categories}
            searchTerm={term}
          />
        </div>
  
        {/* 오른쪽: 검색창/카드 */}
        <div className="flex-1 flex flex-col items-center px-8 pt-32 relative">
          {/* 검색창 (가운데 + 아래로 내림) */}
          <form
            ref={searchBoxRef}
            className="relative w-full max-w-xl flex justify-center mt-28 mb-10"
            onSubmit={e => e.preventDefault()} // enter 막기 (실시간 검색만)
          >
            <input
              type="text"
              value={term}
              onChange={e => setTerm(e.target.value)}
              onFocus={() => setIsBookTreeOpen(true)}
              onBlur={() => setIsBookTreeOpen(false)}
              placeholder="검색어를 입력하세요"
              className="w-full py-4 pl-5 pr-14 rounded-full bg-white/10 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition"
            />
            <button
              type="submit"
              aria-label="검색"
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white opacity-80 hover:opacity-100 transition"
              tabIndex={-1}
            >
              <Search size={24} />
            </button>
          </form>
  
          {/* 카드 컨테이너 (검색창 바로 밑에, 가로 row, 넘치면 좌우 넘김) */}
          {searched && !loading && results.length > 0 && (
            <div className="relative w-full max-w-3xl flex flex-col items-center">
              <div className="flex items-stretch justify-center gap-4 w-full">
                {/* 왼쪽 화살표 */}
                {totalPages > 1 && (
                  <button
                    className={`flex items-center px-2 text-2xl select-none transition ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-cyan-400'}`}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => c - 1)}
                    aria-label="이전"
                    style={{ minWidth: 40 }}
                  >
                    ←
                  </button>
                )}
                {/* 카드들 */}
                <div className="flex flex-row gap-4 flex-1 justify-center">
                  {pagedResults.map((item, i) => (
                    <Link
                    href={`/${item._type}/${item.id}`} // ← 상세 페이지 주소로!
                    key={`${item._type}_${item.id}_${i}`}
                    className="w-56 rounded-xl bg-zinc-800/80 p-4 shadow-lg hover:scale-[1.03] transition cursor-pointer"
                    style={{ minWidth: 200, maxWidth: 240 }}
                  >
                      <span className="text-xs text-cyan-300 uppercase">
                        {{
                          posts: '개발지식',
                          projects: '프로젝트',
                          error: '에러모음',
                        }[item._type]}
                      </span>
                      <h3 className="mt-2 text-sm font-bold truncate">{item.title}</h3>
                      <p className="text-[10px] text-gray-200 truncate">{item.category || '기본'}</p>
                    </Link>
                  ))}
                </div>
                {/* 오른쪽 화살표 */}
                {totalPages > 1 && (
                  <button
                    className={`flex items-center px-2 text-2xl select-none transition ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:text-cyan-400'}`}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(c => c + 1)}
                    aria-label="다음"
                    style={{ minWidth: 40 }}
                  >
                    →
                  </button>
                )}
              </div>
              {/* 하단 페이지 정보 */}
              {totalPages > 1 && (
                <div className="text-xs text-gray-400 mt-2">{currentPage} / {totalPages}</div>
              )}
            </div>
          )}
  
          {/* 로딩/없음 */}
          {!searched && (
            <div className="text-gray-400 text-lg opacity-70 mt-16">검색어를 입력해 주세요</div>
          )}
          {loading && <div className="text-gray-300 mt-16">검색 중...</div>}
          {searched && !loading && results.length === 0 && (
            <div className="flex flex-col items-center gap-4 text-gray-400 text-lg opacity-70 mt-16">
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
};