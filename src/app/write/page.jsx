// src/app/write/page.jsx
import dynamic from "next/dynamic";

// 클라이언트 컴포넌트로 WriteEditor 불러오기 (SSR X)
const WriteEditor = dynamic(() => import('@/components/WriteEditor'), { ssr: false });

export default function WritePage() {
  return <WriteEditor />;
}