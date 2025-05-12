"use client";

import React, { useState } from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import Link from "next/link";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa";

export default function PostsTimeline({ posts }) {
  // 카테고리 목록 (all 포함)
  const categories = ["all", "html", "css", "javascript", "react", "node"];
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 선택된 카테고리에 따른 필터링
  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  // 아이콘 매핑
  const iconMap = {
    html: <FaHtml5 />,
    css: <FaCss3Alt />,
    javascript: <FaJs />,
    react: <FaReact />,
    node: <FaNodeJs />,
  };

  return (
    <main className="h-screen overflow-auto bg-white dark:bg-black px-4 py-8">
      {/* <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {selectedCategory === "all"
          ? "전체 글 타임라인"
          : `${selectedCategory.toUpperCase()} 카테고리 글`}        
      </h1> */}

      {/* 카테고리 선택 */}
      <div className="flex justify-center mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="all">전체</option>
          {categories
            .filter((c) => c !== "all")
            .map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
        </select>
      </div>

      <VerticalTimeline lineColor="#4A5568">
        {filteredPosts.map((post, idx) => {
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
              }}
              contentArrowStyle={{ borderRight: "8px solid #1A202C" }}
            >
              <Link href={`/posts/${post.id}`} className="no-underline">
                <h3 className="text-2xl font-semibold mb-2 text-white">
                  {post.title || "(제목 없음)"}
                </h3>
                <p className="text-sm text-gray-400">
                  {new Date(post.created_at).toLocaleTimeString()}
                </p>
              </Link>
            </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>
    </main>
  );
}
