"use client"

import React, { useRef, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"

export default function SimplePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")  // ?edit=ID 읽기

  const editorRef = useRef(null)

  // 제목, 카테고리, 초기 콘텐츠 상태
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("html")
  const [initialContent, setInitialContent] = useState("<p></p>")
  const [loading, setLoading] = useState(!!editId)

  // 1) 편집 모드라면 기존 글 불러오기
  useEffect(() => {
    if (!editId) {
      setLoading(false)
      return
    }
    supabase
      .from("posts")
      .select("title, content, category")
      .eq("id", editId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("불러오기 실패:", error)
          alert("글 불러오기에 실패했습니다.")
          router.push("/posts")
        } else {
          setTitle(data.title)
          setCategory(data.category)
          setInitialContent(data.content)
        }
      })
      .finally(() => setLoading(false))
  }, [editId])

  const handleSave = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }
    const html = editorRef.current?.getHTML() || ""

    let result
    if (editId) {
      // 업데이트
      result = await supabase
        .from("posts")
        .update({ title, content: html, category })
        .eq("id", editId)
    } else {
      // 새 글 삽입
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

  if (loading) {
    return <p className="p-8 text-center">불러오는 중...</p>
  }

  return (
    <div className="p-8 bg-white dark:bg-black min-h-screen space-y-4">
      {/* 제목 입력 */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
      />

      {/* 카테고리 선택 */}
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

      {/* 에디터에 초기 콘텐츠 전달 */}
      <SimpleEditor
        ref={editorRef}
        onSave={handleSave}
        initialContent={initialContent}
      />
    </div>
  )
}