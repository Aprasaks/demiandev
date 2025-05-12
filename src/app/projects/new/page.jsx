// src/app/projects/new/page.jsx
import SimpleEditorWrapper from "@/components/tiptap-templates/simple/simple-editor-wrapper";

export default function ProjectsCreatePage() {
  return (
    <div className="p-8 bg-white dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        새 프로젝트 작성
      </h1>
      <SimpleEditorWrapper
        tableName="projects"
        editId={null}
        initialTitle=""
        initialCategory=""    
        initialContent="<p></p>"
      />
    </div>
  );
}