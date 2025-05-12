// src/app/projects/[id]/page.jsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import PostViewer from "@/components/PostViewer";
import EditButton from "@/components/EditButton";

export default async function ProjectPage({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // URL 세그먼트에서 id 추출
  const { id } = params;

  // projects 테이블에서 해당 레코드 불러오기
  const { data: project, error } = await supabase
    .from("projects")
    .select("title, content, created_at") // category는 없으므로 제외
    .eq("id", id)
    .single();

  if (error || !project) {
    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center bg-white dark:bg-black">
        <p className="text-red-500 mb-4">프로젝트를 불러오는 데 실패했습니다.</p>
        <Link
          href="/projects"
          className="text-blue-600 hover:underline"
        >
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-white dark:bg-black text-gray-900 dark:text-gray-100 relative">
      {/* 수정 버튼 */}
      <EditButton postId={id} tableName="projects" />

      {/* 제목 */}
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

      {/* 작성일 */}
      <time className="block text-sm text-gray-500 dark:text-gray-400 mb-6">
        {new Date(project.created_at).toLocaleString()}
      </time>

      {/* 본문 */}
      <PostViewer content={project.content} />

      {/* 뒤로가기 */}
      <div className="mt-8">
        <Link
          href="/projects"
          className="text-blue-600 hover:underline"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    </main>
  );
}