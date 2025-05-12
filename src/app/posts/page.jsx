// src/app/posts/page.jsx
import { createClient } from "@supabase/supabase-js";
import PostsTimeline from "@/components/PostsTimeline";

export default async function PostsPage({ searchParams }) {
  const category = searchParams?.category ?? null;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  let query = supabase
    .from("posts")
    .select("id, title, created_at, category")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: posts, error } = await query;

  if (error) {
    // 에러 처리 (원하시는 대로)
    return <p>글 불러오는 중 오류 발생</p>;
  }

  // 클라이언트 컴포넌트에 데이터를 props 로 넘겨준다
  return <PostsTimeline posts={posts} initialCategory={category} />;
}