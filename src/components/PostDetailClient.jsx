// src/components/PostDetailClient.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

export default function PostDetailClient({ title, markdown }) {
  const [fullHtml, setFullHtml] = useState('');

  // Markdown → Highlighted HTML
  useEffect(() => {
    async function convert() {
      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeHighlight)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(markdown);
      setFullHtml(String(file));
    }
    convert();
  }, [markdown]);

  // <h2>1. …</h2> 단위로 분할해 sections 생성
  const sections = useMemo(() => {
    if (!fullHtml) return [];
    const parts = fullHtml.split(/<h2\s*>\s*\d+\.\s*/);
    return parts.map((part, idx) => {
      if (idx === 0) return { label: '목차', html: part };
      const [heading, ...rest] = part.split('</h2>');
      const clean = heading.replace(/<[^>]+>/g, '').trim();
      return {
        label: `${idx}. ${clean}`,
        html: `<h2>${heading}</h2>${rest.join('</h2>')}`,
      };
    });
  }, [fullHtml]);

  const [idx, setIdx] = useState(0);
  const particlesInit = async engine => { await loadSlim(engine); };

  if (!sections.length) return null;

  return (
    <main className="relative min-h-screen bg-gray-900 text-white">
      {/* 고정 배경 + 그라데이션 + 파티클 */}
      <div className="fixed inset-0 z-0 bg-[url('/stars.png')] bg-cover bg-center">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black/80 to-transparent" />
        <Particles
          id="tsparticles-detail"
          init={particlesInit}
          className="absolute inset-0 pointer-events-none"
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

      {/* 콘텐츠 전체 스크롤 */}
      <div className="relative z-10 flex items-center justify-center px-4">
      {idx === 0 ? (
  <div className="flex w-full max-w-6xl h-screen items-center justify-center px-4">
    {/* 좌측: 제목만 */}
    <div className="w-2/3 pr-12 space-y-6">
      <p className="text-2xl sm:text-3xl font-aggro leading-snug">
        당신이 고른 기억은
      </p>
      <p className="font-jamsil text-7xl sm:text-8xl font-bold leading-tight">
        {title}
      </p>
    </div>

    {/* 우측: 목차 */}
    <div className="w-1/3 pl-12">
      <div className="text-3xl font-semibold mb-6">목차</div>
      <div className="flex flex-col space-y-4">
        {sections.slice(1).map((sec, i) => (
          <button
            key={i}
            onClick={() => setIdx(i + 1)}
            className="text-xl sm:text-2xl text-left hover:text-white/80 transition"
          >
            {sec.label}
          </button>
        ))}
      </div>
    </div>
  </div>
) : (
          // ▶ 선택된 챕터 본문
          <div className="w-full max-w-5xl px-6 py-16">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIdx(0)}
                className="text-base underline text-blue-300 hover:text-blue-400"
              >
                목차 보기
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 leading-snug tracking-wide">
              {sections[idx].label}
            </h2>
            <article
              className="text-lg sm:text-xl leading-relaxed tracking-wide space-y-6
                         overflow-x-hidden whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: sections[idx].html }}
            />
          </div>
        )}
      </div>
    </main>
  );
}