import PostDetail from '@/components/PostDetail';

export default function PostDetailPage({ params }) {
  return <PostDetail postId={params.postId} />;
}