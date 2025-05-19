import './globals.css';
import '../../src/styles/_variables.scss';
import '../../src/styles/_keyframe-animations.scss';
import 'highlight.js/styles/github-dark.css';

import Header from '@/components/Header';
import GAProvider from '@/components/GAProvider'; // 추가

const GA_ID = "G-DGT55PXCEZ"; // 너의 ID

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* 여긴 meta, title, link만 넣는 곳 */}
      </head>
      <body className="min-h-screen text-white overflow-auto">
        <GAProvider gaId={GA_ID} /> {/* ✅ 올바른 위치 */}
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}