"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, title, created_at, category")
        .order("created_at", { ascending: false });

      setPosts(data || []);
    };

    fetchPosts();
  }, []);

  if (!posts.length) {
    return (
      <main className="p-8">
        <p className="text-gray-400">아직 작성된 글이 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">글 목록</h1>
      <ul className="space-y-4">
        {posts.map((post) =>
          post ? (
            <li key={post.id} className="border-b pb-2">
              <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-gray-500">{post.category}</p>
            </li>
          ) : null // ✅ 삭제된 데이터 껍데기 방지
        )}
      </ul>
    </main>
  );
}