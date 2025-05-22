// 예: src/components/WriteButton.jsx
import Link from "next/link";
export default function WriteButton() {
  return (
    <Link href="/write">
      <button className="
        px-5 py-2 rounded-lg
        bg-white/10
        border border-white/20
        text-white
        font-bold
        hover:bg-cyan-500/20
        hover:border-cyan-400
        hover:text-cyan-200
        shadow
        transition
      ">
        글쓰기
      </button>
    </Link>
  );
}
