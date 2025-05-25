// src/app/posts/page.jsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import PostsIndexClient from '@/components/PostsIndexClient';

export const revalidate = 0; // 필요에 따라 ISR 설정

export default async function PostsIndexPage() {
  // 1. posts 디렉토리 경로
  const postsDir = path.join(process.cwd(), 'src', 'posts');

  // 2. .md 파일 목록 읽기
  const filenames = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  // 3. frontMatter(title, category 등) 파싱
  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDir, filename);
    const source = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(source);

    return {
      id: filename.replace(/\.md$/, ''),        // slug
      title: data.title || filename.replace(/\.md$/, ''),
      category: data.category || '기타',
    };
  });

  // 4. 카테고리별로 묶기
  const byCategory = {};
  posts.forEach((post) => {
    if (!byCategory[post.category]) byCategory[post.category] = [];
    byCategory[post.category].push(post);
  });
  const categories = Object.entries(byCategory).map(([category, posts]) => ({
    category,
    posts,
  }));

  // 5. 클라이언트 컴포넌트에 전달
  return <PostsIndexClient categories={categories} />;
}