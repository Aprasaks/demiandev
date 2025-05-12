// src/app/simple/[table]/page.jsx
import SimpleEditorWrapper from "@/components/tiptap-templates/simple/simple-editor-wrapper";

export default function SimpleCreatePage({ params }) {
  const { table } = params; // "posts" | "projects" | "error" | "search"

  return (
    <div className="p-8 bg-white dark:bg-black min-h-screen space-y-4">
      <SimpleEditorWrapper
        tableName={table}
        editId={null}
        initialTitle=""
        initialCategory="html"
        initialContent="<p></p>"
      />
    </div>
  );
}