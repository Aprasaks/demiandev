// src/components/EditButton.jsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function EditButton({ postId, tableName = "posts" }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!session) return null;

  // params 기반 다이내믹 경로
  const href = `/simple/${tableName}/${postId}`;

  return (
    <Link
      href={href}
      className="absolute top-8 right-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
    >
      수정
    </Link>
  );
}