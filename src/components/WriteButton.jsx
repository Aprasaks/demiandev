// 예: src/components/WriteButton.jsx
import Link from "next/link";
export default function WriteButton() {
  return (
    <Link href="/write">
      <button className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition">
        글쓰기
      </button>
    </Link>
  );
}
