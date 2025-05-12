// src/components/ErrorTable.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ErrorTable({ errors }) {
  const [search, setSearch] = useState("");
  const filtered = errors.filter((log) =>
    log.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-8 py-6">
      {/* 검색 입력 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="제목 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
        />
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="px-4 py-2 text-left">날짜</th>
              <th className="px-4 py-2 text-left">제목</th>
              <th className="px-4 py-2 text-left">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2">{log.title}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <Link
                    href={`/error/${log.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    보기
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}