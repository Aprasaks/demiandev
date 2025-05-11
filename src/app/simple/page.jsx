"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function SimplePage() {
  const router = useRouter();
  const editorRef = useRef(null);

  // 제목 상태 추가
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    // 제목이 비어 있으면 경고
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    const html = editorRef.current?.getHTML() || "";
    const { error } = await supabase
      .from("posts")
      .insert({ title, content: html });
    if (error) {
      alert("저장에 실패했습니다.");
    } else {
      router.push("/posts");
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-black min-h-screen space-y-4">
      {/* 제목 입력란 */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
      />

      {/* 에디터 + 저장 버튼 */}
      <SimpleEditor ref={editorRef} onSave={handleSave} />
    </div>
  );
}