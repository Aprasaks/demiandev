"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import PostViewer from "@/components/PostViewer";
import InlineActions from "@/components/InlineActions";

export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("title, content, created_at, category")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        setError(true);
      } else {
        setPost(data);
      }
    };

    fetchPost();
  }, [params.id]);

  if (error) {
    return (
      <main className="min-h-screen p-8 bg-white dark:bg-black flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">글을 불러오는 데 실패했습니다.</p>
        <Link href="/posts" className="text-blue-600 hover:underline">
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (!post) return <main className="p-8">로딩 중...</main>;

  return (
    <main className="min-h-screen overflow-auto bg-white dark:bg-black text-gray-900 dark:text-gray-100 px-8 py-12 relative">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="w-full flex justify-end mb-4">
          <InlineActions
            postId={params.id}
            tableName="posts"
            editPath={`/simple/posts/${params.id}`}
          />
        </div>

        <h1 className="text-4xl font-bold mb-2 text-center">
          {post.title}
        </h1>

        <div className="flex items-center space-x-4 mb-8 text-sm text-gray-500 dark:text-gray-400">
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
          {post.category && (
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              {post.category}
            </span>
          )}
        </div>

        <PostViewer content={post.content || ""} />

        <div className="mt-12">
          <Link href="/posts" className="inline-block text-blue-600 hover:underline">
            ← 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}