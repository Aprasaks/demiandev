// src/app/posts/page.jsx
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

// 서버 컴포넌트로 async/await 사용
export default async function PostsPage() {
  // 1) Supabase 클라이언트 초기화
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // 2) 이제 title 컬럼을 select 에 포함시킵니다.
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title')            // ← title 포함
    .order('created_at', { ascending: false })

  // 3) 에러 처리
  if (error) {
    console.error('Supabase fetch error ▶', error)
    return (
      <main className="p-8">
        <p className="text-red-500">
          글 목록을 불러오는 데 실패했습니다: {error.message}
        </p>
      </main>
    )
  }

  // 4) 데이터가 없으면 메시지
  if (!posts || posts.length === 0) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">글 목록</h1>
        <p>아직 작성된 글이 없습니다.</p>
      </main>
    )
  }

  // 5) 정상 렌더: title 로 표시
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">글 목록</h1>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/posts/${post.id}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {post.title || '(제목 없음)'}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}