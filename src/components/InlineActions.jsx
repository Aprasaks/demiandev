// src/components/InlineActions.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

export default function InlineActions({
  postId,
  tableName = "posts",
  editPath,            // ex: `/simple/posts/${postId}`
  className = "",      // 필요하면 스타일 덧붙일 수 있게
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const onDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", postId);

    if (error) {
      alert("삭제 중 오류: " + error.message);
      setLoading(false);
    } else {
      router.push(`/${tableName}`);
    }
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <Link href={editPath} className="hover:underline">
        수정하기
      </Link>
      <span className="text-gray-500 dark:text-gray-400">|</span>
      <button
        onClick={onDelete}
        disabled={loading}
        className="hover:underline text-red-600 dark:text-red-400 disabled:opacity-50"
      >
        {loading ? "삭제중…" : "삭제하기"}
      </button>
    </div>
  );
}