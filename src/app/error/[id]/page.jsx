// src/app/error/[id]/page.jsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import PostViewer from "@/components/PostViewer"; // 에러 본문 렌더러로 재사용

export default async function ErrorDetailPage({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { id } = params;

  const { data: record, error } = await supabase
    .from("error")
    .select("title, content, created_at")
    .eq("id", id)
    .single();

  if (error || !record) {
    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center bg-white dark:bg-black">
        <p className="text-red-500 mb-4">해당 에러를 찾을 수 없습니다.</p>
        <Link href="/error" className="text-blue-600 hover:underline">
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-2">{record.title}</h1>
      <time className="block text-sm text-gray-500 dark:text-gray-400 mb-8">
        {new Date(record.created_at).toLocaleString()}
      </time>
      <PostViewer content={record.content || ""} />
      <div className="mt-12">
        <Link href="/error" className="text-blue-600 hover:underline">
          ← 목록으로 돌아가기
        </Link>
      </div>
    </main>
  );
}