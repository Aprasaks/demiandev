// src/app/simple/page.jsx
import { createClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import SimpleEditorWrapper from "@/components/tiptap-templates/simple/simple-editor-wrapper"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function SimplePage({ searchParams }) {
  const editId = searchParams?.edit

  // 기본값
  let title = ""
  let category = "html"
  let initialContent = "<p></p>"

  if (editId) {
    const { data: post, error } = await supabase
      .from("posts")
      .select("title, content, category")
      .eq("id", editId)
      .single()

    if (error || !post) {
      // 잘못된 ID로 들어왔으면 /posts 로 돌려보내기
      return redirect("/posts")
    }

    title = post.title
    category = post.category
    initialContent = post.content
  }

  return (
    <div className="p-8 bg-white dark:bg-black min-h-screen space-y-4">
      <SimpleEditorWrapper
        editId={editId}
        initialTitle={title}
        initialCategory={category}
        initialContent={initialContent}
      />
    </div>
  )
}