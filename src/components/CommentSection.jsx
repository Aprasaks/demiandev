// src/components/CommentSection.jsx (추천!)
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");

  // 댓글 조회
  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });
    setComments(data || []);
  }

  // 댓글 작성
  async function handleSubmit(e) {
    e.preventDefault();
    if (!nickname.trim() || !password.trim() || !content.trim()) {
      alert("닉네임, 비밀번호, 내용을 모두 입력하세요.");
      return;
    }
    const { error } = await supabase.from("comments").insert([
      {
        post_id: postId,
        nickname,
        password,
        content,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      alert("댓글 저장 실패: " + error.message);
    } else {
      setNickname(""); setPassword(""); setContent("");
      fetchComments();
    }
  }

  return (
    <section className="my-12">
      <h3 className="text-lg font-bold mb-2">💬 댓글</h3>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
  {/* 첫 줄: 닉네임, 비밀번호 */}
  <div className="flex gap-2">
    <input
      placeholder="닉네임"
      value={nickname}
      onChange={e => setNickname(e.target.value)}
      className="px-2 py-1 rounded bg-gray-900 text-white w-32"
      // 또는 w-28, w-36 등도 취향껏!
    />
    <input
      type="password"
      placeholder="비밀번호"
      value={password}
      onChange={e => setPassword(e.target.value)}
      className="px-2 py-1 rounded bg-gray-900 text-white w-32"
    />
  </div>
  {/* 두 번째 줄: 내용 + 작성버튼 */}
  <div className="flex gap-2">
    <input
      placeholder="댓글 내용"
      value={content}
      onChange={e => setContent(e.target.value)}
      className="px-2 py-1 rounded bg-gray-900 text-white flex-1"
    />
    <button
      className="bg-blue-500 px-3 py-1 rounded text-white font-bold"
      style={{ whiteSpace: 'nowrap' }}
    >
      작성
    </button>
  </div>
</form>
      <ul>
        {comments.map(c => (
          <li key={c.id} className="py-2 border-b border-white/10">
            <span className="font-bold">{c.nickname}:</span> {c.content}
          </li>
        ))}
      </ul>
    </section>
  );
}