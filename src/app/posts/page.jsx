// src/app/posts/page.jsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function PostsPage() {
  const [todayCount, setTodayCount] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    async function fetchCounts() {
      // 1) 전체 포스트 개수
      const { count: total, error: errTotal } = await supabase
        .from("posts")
        .select("id", { count: "exact", head: true });
      if (!errTotal) {
        setTotalCount(total);
      }

      // 2) 오늘 포스트 개수
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).toISOString();
      const startOfTomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      ).toISOString();

      const { count: postsToday, error: errToday } = await supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startOfDay)
        .lt("created_at", startOfTomorrow);
      if (!errToday) {
        setTodayCount(postsToday);
      }
    }

    fetchCounts();
  }, []);

  return (
    <main className="relative h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* 우측 상단 통계 박스 */}
      <div className="flex flex-col text-sm text-gray-800 dark:text-gray-200 font-medium leading-snug">
    <span>오늘의 포스팅: <span className="font-semibold">{todayCount}</span></span>
    <span>전체 포스팅: <span className="font-semibold">{totalCount}</span></span>
  </div>

      {/* 여기에 원하시는 다른 컨텐츠를 넣으세요 */}
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-500 dark:text-gray-400">
          포스팅 목록 대신 오늘/전체 포스팅 수를 보여줍니다.
        </p>
      </div>
    </main>
  );
}