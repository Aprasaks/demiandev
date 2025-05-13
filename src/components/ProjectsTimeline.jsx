"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProjectsTimeline() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // 1. 초기 프로젝트 목록 불러오기
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      setProjects(data || []);
    };

    fetchProjects();

    // 2. 실시간 구독
    const channel = supabase
      .channel("realtime-projects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        (payload) => {
          setProjects((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new, ...prev];
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((proj) => proj.id !== payload.old.id);
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((proj) =>
                proj.id === payload.new.id ? payload.new : proj
              );
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="overflow-x-auto px-8 py-4">
      <ul className="relative flex items-start border-t-2 border-gray-200 dark:border-gray-700">
        {projects.map((proj) => (
          <li
            key={proj.id}
            className="relative flex flex-col items-center flex-none w-60 mr-10"
          >
            {/* 타임라인 마커 */}
            <span
              className="
                absolute -top-3 
                left-1/2 transform -translate-x-1/2
                flex items-center justify-center
                w-6 h-6 bg-blue-500 rounded-full
                ring-8 ring-white dark:ring-gray-900
              "
            >
              ●
            </span>

            {/* 날짜 */}
            <time className="mt-4 mb-2 text-sm text-gray-400 dark:text-gray-500">
              {new Date(proj.created_at).toLocaleDateString()}
            </time>

            {/* 제목(링크) */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              <Link href={`/projects/${proj.id}`}>
                {proj.title}
              </Link>
            </h3>
          </li>
        ))}
      </ul>
    </div>
  );
}