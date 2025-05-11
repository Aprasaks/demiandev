// src/app/posts/[id]/page.jsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import PostViewer from "@/components/PostViewer";  // static import

export default async function PostPage({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: post, error } = await supabase
    .from("posts")
    .select("content, created_at")
    .eq("id", params.id)
    .single();

  if (error || !post) {
    return (
      <main className="p-8">
        <p className="text-red-500">글을 불러오는 데 실패했습니다.</p>
        <Link href="/posts" className="text-blue-600 hover:underline">
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="p-8">
      {/* 이 컴포넌트는 클라이언트에서만 렌더됩니다 */}
      <PostViewer content={post.content || ""} />

      <Link
        href="/posts"
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        ← 목록으로
      </Link>
    </main>
  );
}