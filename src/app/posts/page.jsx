// src/app/posts/page.jsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

// 여기에 사용할 아이콘 라이브러리를 임포트
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa";

export default function PostsTimeline() {
  const [posts, setPosts] = useState([]);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function load() {
      let query = supabase
        .from("posts")
        .select("id, title, created_at, category")
        .order("created_at", { ascending: false });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (!error) setPosts(data);
    }
    load();
  }, [category]);

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
        포스트 타임라인
      </h1>
      <VerticalTimeline lineColor="#4A5568">
        {posts.map((post, idx) => {
          const pos = idx % 2 === 0 ? "left" : "right"; // 좌/우 교차
          const icon = iconMap[post.category] || <FaJs />;

          return (
            <VerticalTimelineElement
              key={post.id}
              date={new Date(post.created_at).toLocaleDateString()}
              position={pos}
              iconStyle={{
                background: "#2D3748",
                color: "#FFF",
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
              className={`vertical-timeline-element--${post.category}`}
              onTimelineElementClick={() => {
                window.location.href = `/posts/${post.id}`;
              }}
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