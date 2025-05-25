// src/app/posts/[postId]/page.jsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 클라이언트 전용 뷰어
import PostDetailClient from '@/components/PostDetailClient'

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'src', 'posts')
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  return files.map(name => ({ postId: name.replace(/\.md$/, '') }))
}

export default async function Page({ params }) {
  const mdPath = path.join(process.cwd(), 'src', 'posts', `${params.postId}.md`)
  const raw = fs.readFileSync(mdPath, 'utf8')
  const { data: meta, content: markdown } = matter(raw)

  return (
    <PostDetailClient
      title={meta.title}
      markdown={markdown}
    />
  )
}