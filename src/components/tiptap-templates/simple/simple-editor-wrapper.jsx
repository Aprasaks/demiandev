// src/components/tiptap-templates/simple/simple-editor-wrapper.jsx
"use client"

import React, { useRef } from "react"
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

  const [title, setTitle] = React.useState(initialTitle)
  const [category, setCategory] = React.useState(initialCategory)

  const handleSave = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }
    const html = editorRef.current?.getHTML() || ""

    let result
    if (editId) {
      result = await supabase
        .from("posts")
        .update({ title, content: html, category })
        .eq("id", editId)
    } else {
      result = await supabase
        .from("posts")
        .insert({ title, content: html, category })
    }

    if (result.error) {
      console.error("저장 실패:", result.error)
      alert("저장에 실패했습니다.")
    } else {
      router.push("/posts")
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
      />

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-40 p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
      >
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="javascript">JavaScript</option>
        <option value="react">React</option>
        <option value="node">Node</option>
      </select>

      <SimpleEditor
        ref={editorRef}
        onSave={handleSave}
        initialContent={initialContent}
      />
    </div>
  )
}