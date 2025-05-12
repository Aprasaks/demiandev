// src/app/posts/page.jsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useSearchParams, useRouter } from "next/navigation"
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css"
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa"

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const router = useRouter()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    async function load() {
      let q = supabase
        .from("posts")
        .select("id, title, created_at, category")
        .order("created_at", { ascending: false })
      if (category) q = q.eq("category", category)
      const { data, error } = await q
      if (error) {
        console.error("Posts load error:", error)
      } else {
        setPosts(data)
      }
    }
    load()
  }, [category])

  const iconMap = {
    html: <FaHtml5 />,
    css: <FaCss3Alt />,
    javascript: <FaJs />,
    react: <FaReact />,
    node: <FaNodeJs />,
  }

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
  )
}