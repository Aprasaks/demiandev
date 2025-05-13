"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import PostViewer from "@/components/PostViewer";

export default function ErrorDetailPage() {
  const params = useParams();
  const errorId = params.id?.toString();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    if (!errorId) return;
    const fetchError = async () => {
      const { data, error } = await supabase
        .from("error")
        .select("title, content, created_at")
        .eq("id", errorId)
        .single();

      if (error || !data) {
        setError(true);
      } else {
        setRecord(data);
      }
    };

    fetchError();
  }, [errorId]);

  if (error) {
    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center bg-white dark:bg-black">
        <p className="text-red-500 mb-4">해당 에러를 찾을 수 없습니다.</p>
        <Link href="/error" className="text-blue-600 hover:underline">
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (!record) return <main className="p-8">로딩 중...</main>;

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