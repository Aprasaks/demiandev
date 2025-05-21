// components/BookTreeSidebar.jsx
'use client';
import React, { useState, useMemo } from "react";

export default function BookTreeSidebar({ categories = [], searchTerm = "" }) {
  const [openCategory, setOpenCategory] = useState(null);

  // 검색어에 따라 자동 오픈/하이라이트
  const highlightInfo = useMemo(() => {
    if (!searchTerm) return { open: null, highlightPostId: null };
    const lower = searchTerm.toLowerCase();
    for (const cat of categories) {
      for (const post of cat.posts) {
        if (post.title.toLowerCase().includes(lower)) {
          return { open: cat.category, highlightPostId: post.id };
        }
      }
    }
    return { open: null, highlightPostId: null };
  }, [searchTerm, categories]);

  const actuallyOpen = highlightInfo.open ?? openCategory;

  return (
    <aside className="w-80 min-w-[240px] max-w-xs h-full bg-transparent px-5 py-8 border-r border-white/10 select-none">
      <div className="font-bold text-lg mb-6 flex items-center gap-2">
        <span role="img">📚</span> 개발 카테고리
      </div>
      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.category}>
            <button
              className={`
                font-semibold py-1 px-2 rounded w-full text-left
                ${actuallyOpen === cat.category ? 'bg-blue-900/70 text-blue-300' : 'hover:bg-white/10'}
                transition
              `}
              onClick={() => setOpenCategory(cat.category)}
              type="button"
            >
              {cat.category}
            </button>
            <div className={`tree-children ${actuallyOpen === cat.category ? 'open' : ''} pl-4`}>
              {cat.posts.map(post => (
                <div
                  key={post.id}
                  className={`
                    py-1 px-2 rounded
                    ${highlightInfo.highlightPostId === post.id ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-white/10'}
                    transition
                  `}
                >
                  {post.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .tree-children {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(.4,0,.2,1);
        }
        .tree-children.open {
          max-height: 350px;
        }
      `}</style>
    </aside>
  );
}