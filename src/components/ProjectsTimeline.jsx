"use client";

import Link from "next/link";

export default function ProjectsTimeline({ projects, initialCategory }) {
  return (
    <div className="px-8 py-6 overflow-x-auto">
      {/* 수평 축 그리는 border-t */}
      <ul className="relative flex items-start border-t-2 border-gray-200 dark:border-gray-700">
        {projects.map((proj) => (
          <li
            key={proj.id}
            className="relative flex flex-col items-center flex-none w-60 mr-10"
          >
            {/* 타임라인 마커 원 */}
            <span className="
              absolute -top-3 
              left-1/2 transform -translate-x-1/2
              flex items-center justify-center
              w-6 h-6 bg-blue-500 rounded-full
              ring-8 ring-white dark:ring-gray-900
            ">
              ●
            </span>

            {/* 날짜 */}
            <time className="mt-4 mb-2 text-sm text-gray-400 dark:text-gray-500">
              {new Date(proj.created_at).toLocaleDateString()}
            </time>

            {/* 제목 (링크) */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              <Link href={`/projects/${proj.id}`}>{proj.title}</Link>
            </h3>

            {/* 카테고리 */}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center">
              {proj.category}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}