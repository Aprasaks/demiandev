// src/app/posts/[postId]/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams }                    from 'next/navigation';
import dynamic                           from 'next/dynamic';
import { supabase }                     from '@/lib/supabaseClient';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import hljs from 'highlight.js/lib/core';
import jsLang  from 'highlight.js/lib/languages/javascript';
import tsLang  from 'highlight.js/lib/languages/typescript';
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
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!post) return;
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach(el => {
        hljs.highlightElement(el);
      });
    }, 100);
  }, [post]);

  if (loading) return <div className="text-center py-16">로딩 중…</div>;
  if (!post)   return <div className="text-center py-16">글을 찾을 수 없습니다.</div>;

  return (
    <main className="relative h-screen textured-bg text-white">
      <div className="fixed inset-0">
        <div className="w-full h-full bg-cover bg-center filter blur-sm scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 h-full overflow-auto px-4 py-8">
        <div className="max-w-3xl mx-auto p-8 bg-white/10 rounded-xl shadow-lg backdrop-blur-lg">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
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