// src/components/EditButton.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function EditButton({ postId }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    // 상태 변경 리스너
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 세션이 없으면 아무것도 렌더하지 않음
  if (!session) return null;

  return (
    <Link
      href={`/simple?edit=${postId}`}
      className="absolute top-8 right-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
    >
      수정
    </Link>
  );
}