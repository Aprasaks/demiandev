// File: src/app/projects/page.jsx

import { createClient } from "@supabase/supabase-js";
import ProjectsTimeline from "@/components/ProjectsTimeline";

export default async function ProjectsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // projects 테이블에서 id, title, created_at 순으로 내림차순 조회
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <p>프로젝트 불러오는 중 오류 발생</p>;
  }

  return (
    <main className="p-8 bg-white dark:bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        프로젝트 살펴보기
      </h1>
      <ProjectsTimeline projects={projects} />
    </main>
  );
}