'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { supabase } from '@/lib/supabaseClient';
import BookTreeSidebar from '@/components/BookTreeSidebar';

export default function PostsIndexPage() {
  const [term, setTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // BookTree 오픈 상태
  const [isBookTreeOpen, setIsBookTreeOpen] = useState(false);

  // posts를 카테고리별로
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) return;
      // 그룹핑
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

  // 검색 결과 (posts, projects, error → title만)
  const [results, setResults] = useState([]);
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(results.length / pageSize);
  const pagedResults = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 기록 요청 모달 관련 state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  const particlesInit = async engine => { await loadSlim(engine); };

  const handleSubmit = async e => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    setLoading(true);

    const [devRes, projectRes, errorRes] = await Promise.all([
      supabase.from('posts').select('*').or(`title.ilike.%${q}%`),
      supabase.from('projects').select('*').or(`title.ilike.%${q}%`),
      supabase.from('error').select('*').or(`title.ilike.%${q}%`),
    ]);

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
  };

  const getContainerClass = () => {
    if (!searched) return 'before-search';
    return results.length > 1 ? 'search-many' : 'search-one';
  };

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
  
        {/* 오른쪽: 검색창/결과 */}
        <div className="flex-1 flex flex-col items-center justify-start pt-32 px-8">
          {/* 검색창 */}
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-xl mb-12 flex justify-center"
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
            >
              <Search size={24} />
            </button>
          </form>
  
          {/* 결과 카드/프리뷰 */}
          <div
            className={`flex flex-wrap items-end justify-center gap-8 w-full ${getContainerClass()}`}
            style={{ minHeight: '100px' }}
          >
            {!searched && (
              <div className="text-gray-400 text-lg opacity-70">검색어를 입력해 주세요</div>
            )}
            {loading && <div className="text-gray-300">검색 중...</div>}
            {searched && !loading && pagedResults.map((item, i) => (
              <div
                key={`${item._type}_${item.id}`}
                className="group block w-44 rounded-xl bg-zinc-800/80 p-4 shadow-lg hover:scale-105 transition"
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
              </div>
            ))}
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
}