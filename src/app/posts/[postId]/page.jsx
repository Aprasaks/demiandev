// src/app/posts/[postId]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';


const ToastViewer = dynamic(
  () => import('@toast-ui/react-editor').then(m => m.Viewer),
  { ssr: false }
);

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    (async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();
      setPost(data);
      setLoading(false);
    })();
  }, [postId]);

  if (loading) return <div className="text-center py-16">로딩 중...</div>;
  if (!post)   return <div className="text-center py-16">글을 찾을 수 없습니다.</div>;

  return (
    <main className="relative h-screen textured-bg text-white">
      {/* 배경 (화면 고정) */}
      <div className="fixed inset-0">
        <div className="w-full h-full bg-cover bg-center filter blur-sm scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
      </div>

      {/* 콘텐츠 (스크롤 가능) */}
      <div className="relative z-10 h-full overflow-auto px-4 py-8">
        <div className="max-w-2xl mx-auto p-8 bg-white/10 rounded-xl shadow-lg backdrop-blur-lg">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <div className="flex gap-3 mb-6 text-sm text-blue-300">
            <span>카테고리: {post.category}</span>
            <span className="opacity-70">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          <ToastViewer
            initialValue={post.content}
            theme="dark"
            usageStatistics={false}
          />
        </div>
      </div>
    </main>
  );
}