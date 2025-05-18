// components/SmallBook.jsx
"use client";

export default function SmallBook({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        group
        w-20 h-28               /* 작게: 가로 80px, 세로 112px */
        bg-gradient-to-br from-gray-100 to-gray-300  
        rounded-md
        relative
        cursor-pointer
        transition
        transform hover:-translate-y-1
      `}
    >
      {/* Spine(책등) */}
      <div
        className={`
          absolute left-0 top-1 bottom-1
          w-1
          bg-gray-400
          rounded-tr-md rounded-br-md
        `}
      />
      {/* Cover */}
      <div
        className={`
          absolute inset-1
          bg-white
          rounded-sm
          overflow-hidden
          transition-shadow
          group-hover:shadow-[0_0_8px_rgba(255,255,200,0.8)]
        `}
      >
        <span
          className={`
            absolute bottom-1 left-1 right-1
            text-xs font-semibold text-gray-700
            truncate
          `}
        >
          {title}
        </span>
      </div>
    </div>
  );
}