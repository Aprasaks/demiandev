// src/app/projects/page.jsx
import { createClient } from "@supabase/supabase-js";
import ProjectsTimeline from "@/components/ProjectsTimeline";

export default async function ProjectsPage() {
  // 1) Supabase 클라이언트 초기화
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // 2) projects 테이블에서 id, title, created_at 순으로 내림차순 조회
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  // 3) 에러 처리
  if (error) {
    return <p>프로젝트 불러오는 중 오류 발생</p>;
  }

  // 4) ProjectsTimeline 컴포넌트에 projects만 넘겨서 렌더
  return <ProjectsTimeline projects={projects} />;
}