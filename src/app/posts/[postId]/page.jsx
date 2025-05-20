'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import hljs from 'highlight.js/lib/core';
import jsLang from 'highlight.js/lib/languages/javascript';
import tsLang from 'highlight.js/lib/languages/typescript';
import cssLang from 'highlight.js/lib/languages/css';
import htmlLang from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('javascript', jsLang);
hljs.registerLanguage('typescript', tsLang);
hljs.registerLanguage('css', cssLang);
hljs.registerLanguage('html', htmlLang);

const ToastViewer = dynamic(
  () => import('@toast-ui/react-editor').then(m => m.Viewer),
  { ssr: false }
);

export default function PostDetailPage() {
  const { postId } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [allTitles, setAllTitles] = useState([]);
  const [viewerKey, setViewerKey] = useState(0);

  // 세션 상태 관리 (Header 참고)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // 단일 포스트 fetch
  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();
      setPost(data);
      setLoading(false);
    })();
  }, [postId]);

  // 전체 포스트 title/id fetch (자동 링크용)
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title');
      setAllTitles(data || []);
    })();
  }, []);

  // ToastViewer 강제 리마운트
  useEffect(() => {
    setViewerKey(v => v + 1);
  }, [postId]);

  // 자동 링크 및 코드블럭 하이라이트 (타이밍 완전 통일!)
  useEffect(() => {
    if (!post || !allTitles.length) return;
    // ToastViewer의 key 변경 or postId가 바뀔 때만 딱 한 번 실행!
    const timer = setTimeout(() => {
      document.querySelectorAll('.toastui-editor-contents').forEach(container => {
        allTitles.forEach(({ title, id }) => {
          if (!title || title.length < 2 || title.length > 32) return;
          if (title === post.title) return;
          const reg = new RegExp(`\\b(${escapeRegExp(title)})\\b`, 'g');
          container.innerHTML = container.innerHTML.replace(
            reg,
            (match) =>
              `<a href="/posts/${id}" class="my-inline-link">${match}</a>`
          );
        });
      });
      // 코드블럭 하이라이트
      document.querySelectorAll('pre code').forEach(el => {
        hljs.highlightElement(el);
      });
    }, 180); // 150~250 추천
  
    return () => clearTimeout(timer); // cleanup! 혹시 타이밍 꼬이는거 방지
  }, [post, allTitles, viewerKey, postId]);

  // 정규식 특수문자 이스케이프 (title에 특수문자 포함시 대응)
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 수정 클릭 시
  const handleEdit = () => {
    router.push(`/write?edit=${postId}`);
  };

  // 삭제 클릭 시
  const handleDelete = async () => {
    if (!window.confirm('정말 이 글을 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) {
      alert('글이 삭제되었습니다.');
      router.push('/');
    } else {
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) return <div className="text-center py-16">로딩 중…</div>;
  if (!post)   return <div className="text-center py-16">글을 찾을 수 없습니다.</div>;

  return (
    <main className="relative h-screen textured-bg text-white">
      <div className="fixed inset-0">
        <div className="w-full h-full bg-cover bg-center filter blur-sm scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 h-full overflow-auto px-4 pt-24 pb-8">
        <div className="max-w-3xl mx-auto p-8 bg-zinc-800/90 rounded-xl shadow-lg backdrop-blur-lg">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            {session && (
              <div className="flex gap-4 text-sm text-gray-300">
                <span className="cursor-pointer hover:underline" onClick={handleEdit}>수정하기</span>
                <span>|</span>
                <span className="cursor-pointer hover:text-red-400 hover:underline" onClick={handleDelete}>삭제하기</span>
              </div>
            )}
          </div>
          <ToastViewer
            key={viewerKey}
            initialValue={post.content}
            theme="dark"
            usageStatistics={false}
          />
        </div>
      </div>
    </main>
  );
}

// my-inline-link 클래스는 글로벌 CSS에 넣어줘!
// .my-inline-link {
//   color: #7fd1ff;
//   font-weight: bold;
//   text-decoration: underline dotted #7fd1ff;
//   background: none;
//   border-radius: 0.4em;
//   padding: 0 0.15em;
//   transition: background 0.2s;
// }
// .my-inline-link:hover {
//   background: #244267;
//   color: #fff;
//   text-decoration: underline solid #fff;
// }