// src/components/PostsTimeline.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa";

export default function PostsTimeline({ posts: initialPosts, initialCategory }) {
  const [posts, setPosts] = useState(initialPosts);
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? initialCategory;
  const router = useRouter();

  // 만약 클라이언트에서 필터링 로직을 더 수행하고 싶다면 useEffect 로 처리
  useEffect(() => {
    // 예: url 파라미터가 바뀔 때 추가 fetch/필터링 로직
    // 지금은 서버에서 받은 initialPosts 로 충분하다면 생략 가능
  }, [category]);

  const iconMap = {
    html:       <FaHtml5 />,
    css:        <FaCss3Alt />,
    javascript: <FaJs />,
    react:      <FaReact />,
    node:       <FaNodeJs />,
  };

  return (
    <main className="h-screen overflow-auto bg-white dark:bg-black px-4 py-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {category
          ? `${category.toUpperCase()} 카테고리 글`
          : "전체 글 타임라인"}
      </h1>
      <VerticalTimeline lineColor="#4A5568">
        {posts.map((post, i) => (
          <VerticalTimelineElement
            key={post.id}
            date={new Date(post.created_at).toLocaleDateString()}
            position={i % 2 === 0 ? "left" : "right"}
            iconStyle={{
              background: "#2D3748",
              color: "#fff",
              boxShadow: "0 0 0 4px rgba(45,55,72,0.5)",
            }}
            icon={iconMap[post.category] || <FaJs />}
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
        ))}
      </VerticalTimeline>
    </main>
  );
}