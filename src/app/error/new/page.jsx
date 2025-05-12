// File: src/app/error/new/page.jsx
import SimpleEditorWrapper from "@/components/tiptap-templates/simple/simple-editor-wrapper";

export default function ErrorCreatePage() {
  return (
    <div className="p-8 bg-white dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        새 에러 기록
      </h1>
      <SimpleEditorWrapper
        tableName="error"
        editId={null}
        initialTitle=""
        initialCategory=""     
        initialContent="<p></p>"
      />
    </div>
  );
}