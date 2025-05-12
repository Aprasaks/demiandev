// src/app/posts/layout.js
import Link from "next/link";

export const metadata = {
  title: "Posts",
};

export default function PostsLayout({ children }) {
  const categories = ["HTML", "CSS", "JavaScript", "React", "Node"];

  return (
    <section>
      {/* 1) /posts 전용 카테고리 메뉴 */}
      <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
        <ul className="max-w-5xl mx-auto flex w-full">
          {categories.map((cat) => (
            <li key={cat} className="flex-1">
              <Link
                href={`/posts?category=${cat.toLowerCase()}`}
                className="block w-full text-center py-3 font-bold text-gray-800 dark:text-gray-200 hover:underline"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 2) 이 자리에 page.jsx 가 렌더링됩니다 */}
      <div>{children}</div>
    </section>
  );
}