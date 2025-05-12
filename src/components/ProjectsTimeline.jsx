// File: src/components/ProjectsTimeline.jsx
"use client";

import Link from "next/link";

export default function ProjectsTimeline({ projects }) {
  return (
    <div className="overflow-x-auto px-8 py-4">
      <ul className="relative flex items-start border-t-2 border-gray-200 dark:border-gray-700">
        {projects.map((proj, idx) => (
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