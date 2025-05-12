// src/app/posts/[id]/page.jsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import PostViewer from "@/components/PostViewer";
import EditButton from "@/components/EditButton";

export default async function PostPage({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: post, error } = await supabase
    .from("posts")
    .select("title, content, created_at, category")
    .eq("id", params.id)
    .single();

  if (error || !post) {
    return (
      <main className="min-h-screen p-8 bg-white dark:bg-black flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">글을 불러오는 데 실패했습니다.</p>
        <Link href="/posts" className="text-blue-600 hover:underline">
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-auto bg-white dark:bg-black text-gray-900 dark:text-gray-100 px-8 py-12 relative">
      {/* 수정 버튼 */}
      <EditButton postId={params.id} tableName="posts" />

      {/* 제목 */}
      {post.title && <h1 className="text-4xl font-bold mb-2">{post.title}</h1>}

      {/* 작성일 + 카테고리 */}
      <div className="flex items-center space-x-4 mb-8 text-sm text-gray-500 dark:text-gray-400">
        <span>{new Date(post.created_at).toLocaleString()}</span>
        {post.category && (
          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
            {post.category.toUpperCase()}
          </span>
        )}
      </div>

      {/* 본문 */}
      <PostViewer content={post.content || ""} />

      {/* 뒤로가기 */}
      <div className="mt-12">
        <Link href="/posts" className="inline-block text-blue-600 hover:underline">
          ← 목록으로 돌아가기
        </Link>
      </div>
    </main>
  );
}