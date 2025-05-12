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
  {/* 이 div 안의 컨텐츠만 최대 3xl 크기로 제한하고 가운데 정렬 */}
  <div className="max-w-3xl mx-auto flex flex-col items-center">
    {/* 수정 버튼 */}
    <EditButton postId={params.id} tableName="posts" />

    {/* 제목 */}
    <h1 className="text-4xl font-bold mb-2 text-center">
      {post.title}
    </h1>

    {/* 작성일 + 카테고리 */}
    <div className="flex items-center space-x-4 mb-8 text-sm text-gray-500 dark:text-gray-400">
      {/* ... */}
    </div>

    {/* 본문 */}
    <PostViewer content={post.content || ""} />

    {/* 뒤로가기 */}
    <div className="mt-12">
      <Link href="/posts" className="inline-block text-blue-600 hover:underline">
        ← 목록으로 돌아가기
      </Link>
    </div>
  </div>
</main>
  );
}