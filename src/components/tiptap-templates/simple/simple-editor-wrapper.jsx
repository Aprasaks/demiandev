"use client"

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { SimpleEditor } from "./simple-editor"

export default function SimpleEditorWrapper({
  editId,
  initialTitle,
  initialCategory,
  initialContent,
}) {
  const router = useRouter()
  const editorRef = useRef(null)

  // 1) 테이블 선택 상태 (posts, projects, error, search)
  const [table, setTable] = useState("posts")
  // 2) 프로그래밍 언어 카테고리 (html, css, javascript, react, node)
  const [category, setCategory] = useState(initialCategory)
  const [title, setTitle] = useState(initialTitle)

  const handleSave = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }
    const html = editorRef.current?.getHTML() || ""

   // 테이블별로 보낼 필드 결정
   const payload =
     table === "posts"
       ? { title, content: html, category }
       : { title, content: html };

   let result;
   if (editId) {
     result = await supabase
       .from(table)
       .update(payload)
       .eq("id", editId);
   } else {
     result = await supabase
       .from(table)
       .insert(payload);
   }

    if (result.error) {
      console.error("저장 실패:", result.error)
      alert("저장에 실패했습니다.")
    } else {
      router.push(`/${table}`)
    }
  }

  return (
    <div className="space-y-4">
      {/* 테이블 선택 드롭다운 */}
      <div className="flex items-center space-x-4">
        <label className="font-medium">저장 위치:</label>
        <select
          value={table}
          onChange={e => setTable(e.target.value)}
          className="p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
        >
          <option value="posts">Posts</option>
          <option value="projects">Projects</option>
          <option value="error">Error</option>
          <option value="search">Search</option>
        </select>

        {/* posts 선택 시에만 프로그래밍 언어 카테고리 노출 */}
        {table === "posts" && (
          <>
            <label className="font-medium">언어:</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
            >
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="react">React</option>
              <option value="node">Node</option>
            </select>
          </>
        )}
      </div>

      {/* 제목 입력 */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
      />

      {/* 에디터 */}
      <SimpleEditor
        ref={editorRef}
        onSave={handleSave}
        initialContent={initialContent}
      />
    </div>
  )
}
