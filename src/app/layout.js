// src/app/layout.js
import './globals.css';
import '../../src/styles/_variables.scss';
import '../../src/styles/_keyframe-animations.scss';
// import 'highlight.js/styles/github-dark.css';

import Header from '@/components/Header';
import GAProvider from '@/components/GAProvider';

const GA_ID = "G-DGT55PXCEZ";

export const metadata = {
  title: "DEMIAN – 무한한 기록",
  icons: {
    icon : "/favicon.svg",
  },
  description: "모든 기록은 전부 어딘가에 저장되어있다.",
  openGraph: {
    title: "DEMIAN – 개발 블로그",
    description: "당신이 원하는 기록을 검색하고 공유하세요.",
    url: "https://demian.dev",
    siteName: "DEMIAN",
    images: [
      {
        url: "https://source.unsplash.com/1200x630/?programming,code",
        width: 1200,
        height: 630,
        alt: "DEMIAN 블로그"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "DEMIAN – 개발 블로그",
    description: "당신이 원하는 기록을 검색하고 공유하세요.",
    images: ["https://source.unsplash.com/1200x630/?programming,code"],
    creator: "@Aprasaks"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen text-white overflow-auto">
        {/* 구글 애널리틱스 (프로덕션일 때만) */}
        {process.env.NODE_ENV === 'production' && <GAProvider gaId={GA_ID} />}
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}