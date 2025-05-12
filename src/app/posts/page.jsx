// src/app/posts/page.jsx
import { createClient } from "@supabase/supabase-js";
import PostsTimeline from "@/components/PostsTimeline";

export default async function PostsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, created_at, category")
    .order("created_at", { ascending: false });

  if (error) {
    return <p>글 불러오는 중 오류 발생</p>;
  }

  return (
    <main className="p-8 bg-white dark:bg-black min-h-screen">
      <PostsTimeline posts={posts} />
    </main>
  );
}