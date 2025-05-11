// src/app/simple/page.jsx  (혹은 SimplePage 컴포넌트 위치)
"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function SimplePage() {
  const router = useRouter();
  const editorRef = useRef(null);

  // 1) 제목
  const [title, setTitle] = useState("");
  // 2) 카테고리
  const [category, setCategory] = useState("html");

  const handleSave = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    const html = editorRef.current?.getHTML() || "";

    // 3) category도 함께 insert
    const { error } = await supabase.from("posts").insert({
      title,
      content: html,
      category,
    });

    if (error) {
      console.error(error);
      alert("저장에 실패했습니다.");
    } else {
      router.push("/posts");
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-black min-h-screen space-y-4">
      {/* 제목 */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
      />

      {/* 카테고리 */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-40 p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
      >
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="javascript">JavaScript</option>
        <option value="react">React</option>
        <option value="node">Node</option>
      </select>

      {/* 에디터 + 저장 */}
      <SimpleEditor ref={editorRef} onSave={handleSave} />
    </div>
  );
}