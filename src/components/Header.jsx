// src/components/Header.jsx
"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 px-16 bg-transparent backdrop-blur-sm">
      {/* 왼쪽 여백(고정 폭) */}
      <div style={{ width: 160 }} />

      {/* 중앙 로고 */}
      <Link
        href="/"
        className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-aggro hover:opacity-80 transition-opacity"
      >
        DEMIAN
      </Link>

      {/* 오른쪽 GitHub 아이콘 */}
      <div className="flex items-center justify-end space-x-4">
        <a
          href="https://github.com/Aprasaks"
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center"
          title="GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 .5C5.648.5.5 5.648.5 12c0 5.084 3.292 9.386 7.862 10.91.574.104.78-.248.78-.552 0-.272-.01-1.18-.015-2.14-3.197.695-3.872-1.54-3.872-1.54-.523-1.327-1.278-1.68-1.278-1.68-1.045-.714.08-.699.08-.699 1.156.081 1.765 1.187 1.765 1.187 1.027 1.757 2.694 1.25 3.353.955.103-.745.402-1.25.732-1.538-2.552-.29-5.236-1.277-5.236-5.69 0-1.257.448-2.287 1.187-3.094-.119-.292-.514-1.468.113-3.06 0 0 .966-.31 3.167 1.182a11.045 11.045 0 0 1 2.883-.388c.978.004 1.963.132 2.882.388 2.2-1.492 3.164-1.182 3.164-1.182.628 1.592.233 2.768.114 3.06.74.807 1.185 1.837 1.185 3.094 0 4.424-2.69 5.396-5.254 5.682.414.354.782 1.05.782 2.115 0 1.526-.014 2.755-.014 3.128 0 .307.203.66.785.548C20.713 21.384 24 17.082 24 12 24 5.648 18.352.5 12 .5z"
            />
          </svg>
        </a>
      </div>
    </header>
  );
}