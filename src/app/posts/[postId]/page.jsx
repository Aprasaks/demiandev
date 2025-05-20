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
  const [allTitles, setAllTitles] = useState([]); // 모든 포스트 title/id 저장

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

  // 모든 포스트 title, id fetch (자동 링크용)
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title');
      setAllTitles(data || []);
    })();
  }, []);

  // 코드블럭 하이라이트
  useEffect(() => {
    if (!post) return;
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach(el => {
        hljs.highlightElement(el);
      });
    }, 100);
  }, [post]);

  // 자동 하이라이트/링크: 모든 포스트 title이 본문 내 등장 시 자동 링크
  useEffect(() => {
    if (!post || !allTitles.length) return;
    setTimeout(() => {
      document.querySelectorAll('.toastui-editor-contents').forEach(container => {
        allTitles.forEach(({ title, id }) => {
          // 너무 짧거나 긴 제목, null, undefined는 제외
          if (!title || title.length < 2 || title.length > 32) return;
          if (title === post.title) return;
          // 이미 링크처리된 부분 제외: 단순 정규식, 필요시 개선 가능
          const reg = new RegExp(`\\b(${escapeRegExp(title)})\\b`, 'g');
          container.innerHTML = container.innerHTML.replace(
            reg,
            (match) =>
              `<a href="/posts/${id}" class="transition text-sky-400 font-bold underline underline-offset-2 decoration-dotted hover:text-white hover:bg-sky-700/20 rounded px-1">${match}</a>`
          );
        });
      });
    }, 120);
  }, [post, allTitles, postId]);

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
      router.push('/'); // 삭제 후 홈으로 이동
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
        {/* 상세 카드 전체를 key로 감싸서 완전 리마운트 */}
        <div key={postId} className="max-w-3xl mx-auto p-8 bg-zinc-800/90 rounded-xl shadow-lg backdrop-blur-lg">
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
            key={postId}
            initialValue={post.content}
            theme="dark"
            usageStatistics={false}
          />
        </div>
      </div>
    </main>
  );
}