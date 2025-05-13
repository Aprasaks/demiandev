"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import Link from "next/link";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
} from "react-icons/fa";

import "react-vertical-timeline-component/style.min.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PostsTimeline() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "html", "css", "javascript", "react", "node"];

  useEffect(() => {
    // 초기 데이터 불러오기
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      setPosts(data || []);
    };

    fetchPosts();

    // 실시간 구독
    const channel = supabase
      .channel("realtime-posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          setPosts((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new, ...prev];
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((p) => p.id !== payload.old.id);
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((p) => (p.id === payload.new.id ? payload.new : p));
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // cleanup
    };
  }, []);

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const iconMap = {
    html: <FaHtml5 />,
    css: <FaCss3Alt />,
    javascript: <FaJs />,
    react: <FaReact />,
    node: <FaNodeJs />,
  };

  return (
    <main className="h-screen overflow-auto bg-white dark:bg-black px-4 py-8">
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