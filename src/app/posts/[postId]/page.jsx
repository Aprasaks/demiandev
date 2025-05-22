// src/app/posts/[postId]/page.jsx

import PostDetail from '@/components/PostDetail';

export default function PostDetailPage({ params }) {
  // params.postId가 자동으로 전달됨
  return <PostDetail postId={params.postId} />;
}