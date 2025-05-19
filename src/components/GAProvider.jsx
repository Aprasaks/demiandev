// src/components/GAProvider.jsx
"use client";
import { useEffect } from "react";

export default function GAProvider({ gaId }) {
  useEffect(() => {
    if (!gaId) return;

    // gtag.js 삽입
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    // gtag 초기화 코드 삽입
    const inlineScript = document.createElement("script");
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', { page_path: window.location.pathname });
    `;
    document.head.appendChild(inlineScript);

    // cleanup
    return () => {
      document.head.removeChild(script);
      document.head.removeChild(inlineScript);
    };
  }, [gaId]);

  return null;
}