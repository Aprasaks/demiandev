"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import PostViewer from "@/components/PostViewer";
import InlineActions from "@/components/InlineActions";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id?.toString();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    if (!projectId) return;
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("title, content, created_at")
        .eq("id", projectId)
        .single();

      if (error || !data) {
        setError(true);
      } else {
        setProject(data);
      }
    };

    fetchProject();
  }, [projectId]);

  if (error) {
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

  if (!project) return <main className="p-8">로딩 중...</main>;

  return (
    <main className="min-h-screen p-8 bg-white dark:bg-black text-gray-900 dark:text-gray-100 relative">
      <div className="w-full flex justify-end mb-4">
        <InlineActions
          postId={projectId}
          tableName="projects"
          editPath={`/simple/projects/${projectId}`}
        />
      </div>

      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

      <time className="block text-sm text-gray-500 dark:text-gray-400 mb-6">
        {new Date(project.created_at).toLocaleString()}
      </time>

      <PostViewer content={project.content} />

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