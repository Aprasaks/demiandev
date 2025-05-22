// src/app/posts/[postId]/page.jsx


import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

// ⭐️ Prism + Toast UI Code Syntax Highlight 플러그인
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // 원하는 테마로 변경 가능

import CommentSection from "@/components/CommentSection";

// Toast UI Viewer 동적 import
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

  // 세션 상태 관리
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

  // 👇 highlight.js 관련 코드 **삭제**

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
            initialValue={post.content}
            theme="dark"
            usageStatistics={false}
            // ⭐️ 코드 하이라이트 플러그인 추가!
            plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
          />
          <CommentSection postId={post.id} />
        </div>
      </div>
    </main>
  );

import PostDetail from '@/components/PostDetail';

export default function PostDetailPage({ params }) {
  // params.postId가 자동으로 전달됨
  return <PostDetail postId={params.postId} />;
}