// src/components/PostsTimeline.jsx
"use client";

import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { useRouter } from "next/navigation";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa";

export default function PostsTimeline({ posts, initialCategory }) {
  const router = useRouter();

  // 카테고리별 아이콘 매핑
  const iconMap = {
    html: <FaHtml5 />,
    css: <FaCss3Alt />,
    javascript: <FaJs />,
    react: <FaReact />,
    node: <FaNodeJs />,
  };

  return (
    <main className="h-screen overflow-auto bg-white dark:bg-black px-4 py-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {initialCategory
          ? `${initialCategory.toUpperCase()} 카테고리 글`
          : "전체 글 타임라인"}
      </h1>
      <VerticalTimeline lineColor="#4A5568">
        {posts.map((post, idx) => {
          const position = idx % 2 === 0 ? "left" : "right";
          const icon = iconMap[post.category] || <FaJs />;

          return (
            <VerticalTimelineElement
              key={post.id}
              date={new Date(post.created_at).toLocaleDateString()}
              position={position}
              iconStyle={{
                background: "#2D3748",
                color: "#fff",
                boxShadow: "0 0 0 4px rgba(45,55,72,0.5)",
              }}
              icon={icon}
              contentStyle={{
                background: "#1A202C",
                color: "#E2E8F0",
                borderRadius: "8px",
                padding: "16px",
                cursor: "pointer",
              }}
              contentArrowStyle={{ borderRight: "8px solid #1A202C" }}
              onTimelineElementClick={() => router.push(`/posts/${post.id}`)}
            >
              <h3 className="text-2xl font-semibold mb-2 text-white">
                {post.title || "(제목 없음)"}
              </h3>
              <p className="text-sm text-gray-400">
                {new Date(post.created_at).toLocaleTimeString()}
              </p>
            </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>
    </main>
  );
}