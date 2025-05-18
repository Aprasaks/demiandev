'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import '@toast-ui/editor/dist/toastui-editor.css';
import { supabase } from '@/lib/supabaseClient';

const ToastEditor = dynamic(
  () => import('@toast-ui/react-editor').then(mod => mod.Editor),
  { ssr: false }
);

const POST_TYPES = [
  { value: 'dev', label: '개발 지식 포스트' },
  { value: 'project', label: '프로젝트 포스트' },
  { value: 'error', label: '에러 모음 포스트' },
];

const CATEGORY_MAP = {
  dev: [
    'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'TypeScript', 'Next.js', '기타'
  ],
  project: [
    '기본'
  ],
  error: [
    '기본'
  ],
};

export default function WritePage() {
  const [type, setType] = useState('dev');
  const [category, setCategory] = useState(CATEGORY_MAP['dev'][0]);
  const [title, setTitle] = useState('');
  const editorRef = useRef();
  const router = useRouter();

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const handleTypeChange = (e) => {
    const nextType = e.target.value;
    setType(nextType);
    setCategory(CATEGORY_MAP[nextType][0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editorRef.current?.getInstance().getMarkdown() || '';
    if (title.trim() && content.trim()) {
      // type에 따라 테이블명 결정
      let table = 'posts';
      if (type === 'project') table = 'projects';
      else if (type === 'error') table = 'error';

      const { error } = await supabase
        .from(table)
        .insert([
          {
            title,
            content,
            category,
            type,
            created_at: new Date().toISOString(),
          }
        ]);
      if (error) {
        alert('저장 실패: ' + error.message);
      } else {
        alert('저장 완료!');
        router.push('/posts');
      }
    } else {
      alert('제목과 내용을 모두 입력하세요!');
    }
  };

  return (
    <main className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          fpsLimit: 60,
          particles: {
            number: { value: 50, density: { enable: true, area: 800 } },
            size:   { value: { min: 1, max: 3 } },
            move:   { enable: true, speed: 0.3, outModes: 'out' },
            color:  { value: '#ffffff40' },
            opacity:{ value: { min: 0.1, max: 0.3 } },
          },
        }}
      />

      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-10 w-full max-w-4xl mt-24">
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-2 justify-center tracking-tight">
            <span>✍️</span> 새 글 작성
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 mb-8">
              <select
                value={type}
                onChange={handleTypeChange}
                className="w-1/2 px-4 py-3 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none transition font-semibold text-base"
              >
                {POST_TYPES.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-1/2 px-4 py-3 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none transition font-semibold text-base"
              >
                {CATEGORY_MAP[type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-6 py-4 mb-8 rounded-lg bg-white/20 placeholder-white/70 text-2xl font-semibold focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="제목을 입력하세요"
              maxLength={64}
            />
            <div className="mb-10 bg-white/10 rounded-xl overflow-hidden shadow-md border border-white/10">
              <ToastEditor
                ref={editorRef}
                initialValue=""
                height="480px"
                placeholder="내용을 입력하세요..."
                previewStyle="vertical"
                theme="dark"
                usageStatistics={false}
                hideModeSwitch={true}
                toolbarItems={[
                  ['heading', 'bold', 'italic', 'strike'],
                  ['hr', 'quote'],
                  ['ul', 'ol', 'task', 'indent', 'outdent'],
                  ['table', 'image', 'link'],
                  ['code', 'codeblock'],
                ]}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-10 py-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold shadow-lg transition"
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}