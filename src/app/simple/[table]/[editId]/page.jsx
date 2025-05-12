// src/app/simple/[table]/[editId]/page.jsx
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import SimpleEditorWrapper from "@/components/tiptap-templates/simple/simple-editor-wrapper";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function SimpleEditPage({ params }) {
  const { table, editId } = params;

  let title = "";
  let category = "html";
  let initialContent = "<p></p>";

  // DB에서 기존 레코드 불러오기
  const builder = supabase
    .from(table)
    .select(table === "posts" ? "title, content, category" : "title, content")
    .eq("id", editId)
    .single();

  const { data: record, error } = await builder;
  if (error || !record) {
    return redirect(`/${table}`);
  }

  title = record.title;
  initialContent = record.content;
  if (table === "posts") category = record.category;

  return (
    <div className="p-8 bg-white dark:bg-black min-h-screen space-y-4">
      <SimpleEditorWrapper
        tableName={table}
        editId={editId}
        initialTitle={title}
        initialCategory={category}
        initialContent={initialContent}
      />
    </div>
  );
}