// src/app/layout.js
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";

import "./globals.css";
import "../../src/styles/_variables.scss";
import "../../src/styles/_keyframe-animations.scss";
import "../components/tiptap-templates/simple/simple-editor.scss";
import "highlight.js/styles/github-dark.css";

export default function RootLayout({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [session, setSession] = useState(null);

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

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((d) => !d);
  };

  return (
    <html lang="ko" className={isDark ? "dark" : ""}>
      <body className="min-h-screen bg-white text-black dark:bg-black dark:text-white overflow-auto ">
        <header className="relative flex items-center justify-between h-16 px-16">
          <nav className="flex space-x-6">
            <Link href="/posts" className="hover:underline ">Posts</Link>
            <Link href="/projects" className="hover:underline ">Projects</Link>
            <Link href="/error" className="hover:underline ">Error</Link>
            <Link href="/search" className="hover:underline ">Search</Link>
            {session && (
              <Link href="/simple" className="hover:underline ">
                Write
              </Link>
            )}
          </nav>

          <Link
          href="/"
          className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-aggro hover:opacity-80 transition-opacity"
         >
           DEMIAN
         </Link>

          <div className="flex items-center space-x-4">
          

{session ? (
             <>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  관리자님, 어서오세요
                </span>
                {/* 여기에 로그아웃 버튼 추가 */}
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-8 h-8 flex items-center justify-center hover:text-red-500"
                  title="Logout"
                >
                  {/* 간단한 전원 아이콘 */}
                  <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 512 512"
  className="w-6 h-6"
>
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </button>
            )}
 
            {/* GitHub 아이콘 */}
            <a
              href="https://github.com/Aprasaks"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.648.5.5 5.648.5 12c0 5.084 3.292 9.386 7.862 10.91.574.104.78-.248.78-.552 0-.272-.01-1.18-.015-2.14-3.197.695-3.872-1.54-3.872-1.54-.523-1.327-1.278-1.68-1.278-1.68-1.045-.714.08-.699.08-.699 1.156.081 1.765 1.187 1.765 1.187 1.027 1.757 2.694 1.25 3.353.955.103-.745.402-1.25.732-1.538-2.552-.29-5.236-1.277-5.236-5.69 0-1.257.448-2.287 1.187-3.094-.119-.292-.514-1.468.113-3.06 0 0 .966-.31 3.167 1.182a11.045 11.045 0 0 1 2.883-.388c.978.004 1.963.132 2.882.388 2.2-1.492 3.164-1.182 3.164-1.182.628 1.592.233 2.768.114 3.06.74.807 1.185 1.837 1.185 3.094 0 4.424-2.69 5.396-5.254 5.682.414.354.782 1.05.782 2.115 0 1.526-.014 2.755-.014 3.128 0 .307.203.66.785.548C20.713 21.384 24 17.082 24 12 24 5.648 18.352.5 12 .5z" />
              </svg>
            </a>

            {/* 다크 모드 토글 */}
            <button onClick={toggleDarkMode} className="w-8 h-8 flex items-center justify-center">
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-6 h-6">
                  <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6">
                  <path d="M375.7 19.7c-1.5-8-6.9-14.7-14.4-17.8s-16.1-2.2-22.8 2.4L256 61.1 173.5 4.2c-6.7-4.6-15.3-5.5-22.8-2.4s-12.9 9.8-14.4 17.8l-18.1 98.5L19.7 136.3c-8 1.5-14.7 6.9-17.8 14.4s-2.2 16.1 2.4 22.8L61.1 256 4.2 338.5c-4.6 6.7-5.5 15.3-2.4 22.8s9.8 13 17.8 14.4l98.5 18.1 18.1 98.5c1.5 8 6.9 14.7 14.4 17.8s16.1 2.2 22.8-2.4L256 450.9l82.5 56.9c6.7 4.6 15.3 5.5 22.8 2.4s12.9-9.8 14.4-17.8l18.1-98.5 98.5-18.1c8-1.5 14.7-6.9 17.8-14.4s2.2-16.1-2.4-22.8L450.9 256l56.9-82.5c4.6-6.7 5.5-15.3 2.4-22.8s-9.8-12.9-17.8-14.4l-98.5-18.1L375.7 19.7z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* 로그인 모달 */}
        {showLogin && !session && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full relative">
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
