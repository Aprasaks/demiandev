// src/app/posts/new/page.jsx
import SimpleEditorWrapper from "@/components/tiptap-templates/simple/simple-editor-wrapper";

export default function PostsCreatePage() {
  return (
    <div className="p-8 bg-white dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">새 글 작성</h1>
      <SimpleEditorWrapper
        tableName="posts"
        editId={null}
        initialTitle=""
        initialCategory="html"
        initialContent="<p></p>"
      />
    </div>
  );
}