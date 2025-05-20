'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { supabase } from '@/lib/supabaseClient';

// Editor만 클라이언트 전용으로 로드
const Editor = dynamic(
  () => import('@toast-ui/react-editor').then(m => m.Editor),
  { ssr: false }
);

const POST_TYPES = [
  { value: 'dev',     label: '개발 지식 포스트' },
  { value: 'project', label: '프로젝트 포스트' },
  { value: 'error',   label: '에러 모음 포스트' },
];
const CATEGORY_MAP = {
  dev:     ['HTML','CSS','JavaScript','React','Node.js','TypeScript','Next.js','데이터베이스','기타'],
  project: ['기본'],
  error:   ['기본'],
};

// 👉 **실제 페이지 내용 컴포넌트 (useSearchParams 사용)**
function WritePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editorRef = useRef();

  // 수정모드: ?edit=포스트ID
  const editId = searchParams.get('edit');

  const [type, setType] = useState('dev');
  const [category, setCategory] = useState(CATEGORY_MAP.dev[0]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(!!editId);

  // 기존 포스트 데이터 로드 (수정모드)
  useEffect(() => {
    if (!editId) return;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', editId)
        .single();
      if (error || !data) {
        alert('글을 불러오지 못했습니다.');
        router.replace('/posts');
        return;
      }
      setType(data.type || 'dev');
      setCategory(data.category || CATEGORY_MAP[data.type || 'dev'][0]);
      setTitle(data.title || '');
      // Editor 내용 세팅 (Toast UI는 약간의 delay 필요)
      setTimeout(() => {
        editorRef.current?.getInstance().setMarkdown(data.content || '');
      }, 100);
      setLoading(false);
    })();
    // eslint-disable-next-line
  }, [editId]);

  const particlesInit = async engine => { await loadSlim(engine); };

  const handleTypeChange = e => {
    const next = e.target.value;
    setType(next);
    setCategory(CATEGORY_MAP[next][0]);
  };

  // 저장: 신규 or 수정
  const handleSubmit = async e => {
    e.preventDefault();
    const content = editorRef.current?.getInstance().getMarkdown() || '';
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력하세요!');
      return;
    }

    let error;
    if (editId) {
      // **수정 모드**
      ({ error } = await supabase
        .from('posts')
        .update({ title, content, category, type })
        .eq('id', editId)
      );
    } else {
      // **신규 작성**
      ({ error } = await supabase
        .from('posts')
        .insert([{ title, content, category, type, created_at: new Date().toISOString() }])
      );
    }

    if (error) {
      alert((editId ? '수정' : '저장') + ' 실패: ' + error.message);
    } else {
      alert(editId ? '수정 완료!' : '저장 완료!');
      router.push('/posts');
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
            number:  { value: 50, density: { enable: true, area: 800 } },
            size:    { value: { min: 1, max: 3 } },
            move:    { enable: true, speed: 0.3, outModes: 'out' },
            color:   { value: '#ffffff40' },
            opacity: { value: { min: 0.1, max: 0.3 } },
          },
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-10 w-full max-w-4xl mt-24">
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-2 justify-center">
            <span>✍️</span> {editId ? '글 수정' : '새 글 작성'}
          </h2>

          {loading ? (
            <div className="text-center py-24">불러오는 중...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* 타입/카테고리 선택 */}
              <div className="flex gap-4 mb-8">
                <select
                  value={type}
                  onChange={handleTypeChange}
                  className="w-1/2 px-4 py-3 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none transition font-semibold text-base"
                >
                  {POST_TYPES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
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

              {/* 제목 입력 */}
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-6 py-4 mb-8 rounded-lg bg-white/20 placeholder-white/70 text-2xl font-semibold focus:ring-2 focus:ring-blue-400 outline-none transition"
                placeholder="제목을 입력하세요"
                maxLength={64}
              />

              {/* 에디터: 코드블럭 버튼만 활성화 */}
              <div className="mb-10 bg-white/10 rounded-xl overflow-hidden shadow-md border border-white/10">
                <Editor
                  ref={editorRef}
                  initialValue=""
                  height="480px"
                  previewStyle="vertical"
                  initialEditType="wysiwyg"
                  useCommandShortcut={true}
                  theme="dark"
                  usageStatistics={false}
                  toolbarItems={[
                    ['heading','bold','italic','strike'],
                    ['hr','quote'],
                    ['ul','ol','task','indent','outdent'],
                    ['table','image','link'],
                    ['code','codeblock'],
                    ['scrollSync'],
                  ]}
                />
              </div>

              {/* 저장 버튼 */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-10 py-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold shadow-lg transition"
                >
                  {editId ? '수정하기' : '저장하기'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

// 👉 **Suspense로 감싸서 내보내기**
export default function WritePage() {
  return (
    <Suspense fallback={<div className="text-center py-32">로딩 중...</div>}>
      <WritePageContent />
    </Suspense>
  );
}