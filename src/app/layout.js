// src/app/layout.js
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 추가!
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";


import "./globals.css";
import "../../src/styles/_variables.scss";
import "../../src/styles/_keyframe-animations.scss";
import "highlight.js/styles/github-dark.css";

export default function RootLayout({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setShowLogin(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleProfileClick = () => {
    if (session) {
      supabase.auth.signOut();
    } else {
      setShowLogin(true);
    }
  };

  // ✨ 글쓰기 버튼 (로그인 시에만 노출)
  const handleWriteClick = () => {
    router.push('/write');
  };

  return (
    <html lang="ko">
      <body className="min-h-screen text-white overflow-auto">
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 px-16 bg-transparent backdrop-blur-sm">
          {/* 중앙 로고 */}
          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-aggro hover:opacity-80 transition-opacity"
          >
            DEMIAN
          </Link>
          {/* 우측: 글쓰기, 로그인/로그아웃, GitHub */}
          <div className="flex items-center space-x-4">
            {/* 로그인 시 글쓰기 버튼 */}
            {session && (
              <button
                onClick={handleWriteClick}
                className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-bold transition"
                style={{ fontSize: "1rem" }}
              >
                글쓰기
              </button>
            )}
            {/* 로그인/로그아웃 */}
            {session ? (
              <>
                <span className="font-medium">관리자님, 어서오세요</span>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-8 h-8 flex items-center justify-center hover:text-red-500"
                  title="Logout"
                >
                  {/* 전원 아이콘 */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512" className="w-6 h-6">
                    <path d="M497 273l-80 80c-15 15-41 4.5-41-17v-48H215c-13 0-24-11-24-24v-32c0-13 11-24 24-24h161v-48c0-21.5 26-32 41-17l80 80c9 9 9 23.6 0 32.6zM272 432v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V32C0 5.5 21.5-16 48-16h176c26.5 0 48 21.5 48 48v48c0 13.3-10.7 24-24 24s-24-10.7-24-24V32H48v448h176v-48c0-13.3 10.7-24 24-24s24 10.7 24 24z" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={handleProfileClick}
                className="w-8 h-8 flex items-center justify-center"
                title="Login"
              >
                {/* 사용자 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </button>
            )}
            {/* GitHub 링크 */}
            <a
              href="https://github.com/Aprasaks"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center"
              title="GitHub"
            >
              {/* GitHub 아이콘 */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.648.5.5 5.648.5 12c0 5.084 3.292 9.386 7.862 10.91.574.104.78-.248.78-.552 0-.272-.01-1.18-.015-2.14-3.197.695-3.872-1.54-3.872-1.54-.523-1.327-1.278-1.68-1.278-1.68-1.045-.714.08-.699.08-.699 1.156.081 1.765 1.187 1.765 1.187 1.027 1.757 2.694 1.25 3.353.955.103-.745.402-1.25.732-1.538-2.552-.29-5.236-1.277-5.236-5.69 0-1.257.448-2.287 1.187-3.094-.119-.292-.514-1.468.113-3.06 0 0 .966-.31 3.167 1.182a11.045 11.045 0 0 1 2.883-.388c.978.004 1.963.132 2.882.388 2.2-1.492 3.164-1.182 3.164-1.182.628 1.592.233 2.768.114 3.06.74.807 1.185 1.837 1.185 3.094 0 4.424-2.69 5.396-5.254 5.682.414.354.782 1.05.782 2.115 0 1.526-.014 2.755-.014 3.128 0 .307.203.66.785.548C20.713 21.384 24 17.082 24 12 24 5.648 18.352.5 12 .5z" />
              </svg>
            </a>
          </div>
        </header>

        {/* 로그인 모달 */}
        {showLogin && !session && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
              <button onClick={() => setShowLogin(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
              <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} onlyThirdPartyProviders={false} view="sign_in" />
            </div>
          </div>
        )}

        {/* 본문 */}
        <main>{children}</main>
      </body>
    </html>
  );
}